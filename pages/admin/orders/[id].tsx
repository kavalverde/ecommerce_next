import { GetServerSideProps, NextPage } from "next";
import { CartList, OrderSummary } from "@/components/cart";
import { AdminLayout } from "@/components/layouts";
import {
  AirplaneTicketOutlined,
  CreditCardOffOutlined,
  CreditCardOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { dbOrders } from "@/database";
import { IOrder, IOrderItem } from "@/interfaces";

interface Props {
  order: IOrder;
  products?: IOrderItem[];
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { shippingAddress } = order;
  return (
    <AdminLayout
      title={"Resumen de orden 123"}
      subtitle={`Orden: ${order._id}`}
      icon={<AirplaneTicketOutlined />}
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
                <Box display={"flex"} flexDirection={"column"}>
                  {order.isPaid ? (
                    <Chip
                      sx={{ my: 2, flex: 1 }}
                      label="Orden ya fue pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditCardOutlined />}
                    />
                  ) : (
                    <Chip
                      sx={{ my: 2, flex: 1 }}
                      label="Pendiente de pago"
                      variant="outlined"
                      color="error"
                      icon={<CreditCardOffOutlined />}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query; // your fetch function here
  const order = await dbOrders.getOrderByID(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/admin/orders`,
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
