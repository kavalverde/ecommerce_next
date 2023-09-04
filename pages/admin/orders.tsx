import { AdminLayout } from "@/components/layouts";
import { IOrder, IUser } from "@/interfaces";
import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Chip, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import React from "react";
import useSWR from "swr";

const columns: GridColDef[] = [
  { field: "id", headerName: "Orden ID", width: 250 },
  { field: "email", headerName: "Correo", width: 250 },
  { field: "nombre", headerName: "Nombre completo", width: 300 },
  { field: "total", headerName: "Monto total" },
  {
    field: "isPaid",
    headerName: "Pagado",
    renderCell: ({ row }: GridRenderCellParams) => {
      return row.isPaid ? (
        <Chip variant="outlined" label="Pagada" color="success" />
      ) : (
        <Chip variant="outlined" label="Pendiente" color="error" />
      );
    },
  },
  {
    field: "noProductos",
    headerName: "No. Productos",
    align: "center",
  },
  {
    field: "check",
    headerName: "Ver Orden",
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Ver órden
        </a>
      );
    },
  },
  { field: "createdAt", headerName: "Creada en:" },
];

const OrdersPage = () => {
  const { data = [], error } = useSWR<IOrder[]>("/api/admin/orders");
  if (!data && !error) return <></>;

  const rows = data!.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    nombre: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    noProductos: order.numberOfItems,
    createdAt: order.createdAt,
  }));
  return (
    <AdminLayout
      title={"Órdenes"}
      subtitle="Mantenimiento de órdenes"
      icon={<ConfirmationNumberOutlined />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
