import { GetServerSideProps, NextPage } from "next";
import NextLink from "next/link";
import { ShopLayout } from "@/components/layouts";
import { Chip, Grid, Typography, Link } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { getSession } from "next-auth/react";
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "fullname", headerName: "Nombre completo", width: 300 },

  {
    field: "paid",
    headerName: "Pagado",
    description: "Estado de pago",
    width: 200,
    renderCell: (params: GridRenderCellParams) => {
      return params.row.paid ? (
        <Chip color="success" label="Pagado" variant="outlined" />
      ) : (
        <Chip color="error" label="No pagado" variant="outlined" />
      );
    },
  },
  {
    field: "order",
    headerName: "Ver orden",
    description: "Ver detalles de la orden",
    width: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <NextLink
          href={`/orders/${params.row.orderID}`}
          passHref
          legacyBehavior
        >
          <Link underline="always">Ver orden</Link>
        </NextLink>
      );
    },
  },
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = orders.map((order, index) => ({
    id: index + 1,
    paid: order.isPaid,
    fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    orderID: order._id,
  }));
  return (
    <ShopLayout
      title={"Historial de ordenes"}
      page_description={"Historial de ordenes del cliente"}
    >
      <Typography variant="h1" component={"h1"}>
        Historial de ordenes
      </Typography>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login?p=/orders/history",
        permanent: false,
      },
    };
  }

  const orders = await dbOrders.getOrdersByUser(session.user._id);

  return {
    props: {
      orders,
    },
  };
};

export default HistoryPage;
