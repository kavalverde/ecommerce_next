import { GetServerSideProps, NextPage } from "next";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { CartList, OrderSummary } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import { CreditCardOffOutlined, CreditCardOutlined } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { getSession } from "next-auth/react";
import { dbOrders } from "@/database";
import { IOrder, IOrderItem } from "@/interfaces";
import { ecommerceApi } from "@/api";
import { useRouter } from "next/router";
import { useState } from "react";

export type OrderResponseBody = {
  id: string;
  status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED";
};

interface Props {
  order: IOrder;
  products?: IOrderItem[];
}

const OrderPage: NextPage<Props> = ({ order, products }) => {
  const router = useRouter();
  const { shippingAddress } = order;
  const [isPaying, setIsPaying] = useState(false);

  /* PAYPAL functions */
  const createOrder = async (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: order.total,
          },
        },
      ],
    });
  };
  const onApprove = async (data: any, actions: any) => {
    return actions.order!.capture().then((details: OrderResponseBody) => {
      onOrderCompleted(details);
    });
  };
  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") {
      return alert("Error al procesar el pago");
    }
    setIsPaying(true);
    try {
      const { data } = await ecommerceApi.post("/orders/pay", {
        transactionID: details.id,
        orderID: order._id,
      });

      router.reload();
    } catch (error) {
      setIsPaying(false);
      console.log(error);
      alert("Error al procesar el pago");
    }
  };

  return (
    <ShopLayout
      title={"Resumen de orden 123"}
      page_description={"Resumen de la orden de compra"}
    >
      <Typography variant="h1" component={"h1"}>
        Orden: {order._id}
      </Typography>
      {order.isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Orden ya fue pagada"
          variant="outlined"
          color="success"
          icon={<CreditCardOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}
      <Grid container spacing={2} className="fadeIn">
        <Grid item xs={12} sm={7}>
          {/* CardList */}
          <CartList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({order.numberOfItems} producto
                {order.numberOfItems > 1 ? "s" : ""})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
              </Box>

              <Typography>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </Typography>
              <Typography>
                {shippingAddress.address}
                {shippingAddress.address2
                  ? `, ${shippingAddress.address2}`
                  : ""}
              </Typography>
              <Typography>
                {shippingAddress.city} {shippingAddress.zip}
              </Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary
                orderValues={{
                  numberOfItems: order.numberOfItems,
                  subtotal: order.subtotal,
                  tax: order.tax,
                  total: order.total,
                }}
              />

              <Box sx={{ mt: 3 }} display={"flex"} flexDirection={"column"}>
                <Box
                  display={"flex"}
                  justifyContent={"center"}
                  className="fadeIn"
                  sx={{ display: isPaying ? "flex" : "none" }}
                >
                  <CircularProgress />
                </Box>
                <Box
                  flexDirection={"column"}
                  sx={{ display: isPaying ? "none" : "flex", flex: 1 }}
                >
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label="Orden ya fue pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditCardOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query; // your fetch function here
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }
  const order = await dbOrders.getOrderByID(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }
  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
