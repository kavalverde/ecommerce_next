import { db } from "@/database";
import { IPaypal } from "@/interfaces";
import { Order } from "@/models";
import axios, { isAxiosError } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return payOrder(req, res);
    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}
const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,
    "utf8"
  ).toString("base64");

  const body = new URLSearchParams("grant_type=client_credentials");

  try {
    const { data } = await axios.post(
      process.env.PAYPAL_OAUTH_URL || "",
      body,
      {
        headers: {
          Authorization: `Basic ${base64Token}`,
          "Content-Type": "apllication/x-www-form-urlencoded",
        },
      }
    );
    return data.access_token;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log(error);
    }
    return null;
  }
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  //Todo: validar sesión del usuario
  //Todo: validar mongoID
  const paypalBearerToken = await getPaypalBearerToken();

  if (!paypalBearerToken) {
    return res
      .status(400)
      .json({ message: "No se pudo confirmar el token de paypal" });
  }

  const { transactionID = "", orderID = "" } = req.body;

  const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(
    `${process.env.PAYPAL_ORDERS_URL}/${transactionID}`,
    {
      headers: {
        Authorization: `Bearer ${paypalBearerToken}`,
      },
    }
  );
  if (data.status !== "COMPLETED") {
    return res.status(401).json({ message: "El pago no se ha completado" });
  }

  await db.connect();
  const dbOrder = await Order.findById(orderID);
  if (!dbOrder) {
    await db.disconnect();
    return res.status(400).json({ message: "No se encontró la orden" });
  }

  if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
    await db.disconnect();
    return res
      .status(400)
      .json({ message: "El monto abonado en Paypal no coincide con la orden" });
  }

  dbOrder.transactionID = transactionID;
  dbOrder.isPaid = true;
  dbOrder.save();

  await db.disconnect();

  return res.status(200).json({ message: "Orden pagada" });
};
