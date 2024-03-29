import { db } from "@/database";
import type { NextApiRequest, NextApiResponse } from "next";
import { Product } from "@/models";
import { IProduct } from "@/interfaces";

type Data =
  | {
      message: string;
    }
  | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProductBySlug(req, res);
    default:
      return res.status(400).json({
        message: "This method is not allowed",
      });
  }
}
const getProductBySlug = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  await db.connect();
  const { slug } = req.query;
  const product = await Product.findOne({ slug }).lean();
  if (!product) {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
  product.images.map((image) => {
    return image.includes("http")
      ? image
      : `${process.env.HOST_NAME}products/${image}`;
  });
  return res.status(200).json(product);
};
