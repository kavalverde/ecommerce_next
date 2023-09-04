import { AdminLayout } from "@/components/layouts";
import { IProduct } from "@/interfaces";
import { AddOutlined, CategoryOutlined } from "@mui/icons-material";
import { Box, Button, CardMedia, Grid, Link } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import NextLink from "next/link";

import React from "react";
import useSWR from "swr";

const columns: GridColDef[] = [
  {
    field: "img",
    headerName: "Imagen",
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
          <CardMedia
            component={"img"}
            className="fadeIn"
            image={row.img}
            alt={row.title}
          />
        </a>
      );
    },
  },

  {
    field: "title",
    headerName: "Título",
    width: 250,
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <NextLink href={`/admin/products/${row.slug}`} passHref legacyBehavior>
          <Link underline="always">{row.title}</Link>
        </NextLink>
      );
    },
  },
  { field: "gender", headerName: "Género" },
  { field: "type", headerName: "Tipo" },
  { field: "inStock", headerName: "Inventario" },
  { field: "price", headerName: "Precio" },
  { field: "sizes", headerName: "Tallas", width: 250 },
];

const ProductsPage = () => {
  const { data = [], error } = useSWR<IProduct[]>("/api/admin/products");
  if (!data && !error) return <></>;

  const rows = data!.map((product) => ({
    id: product._id,
    slug: product.slug,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(", "),
  }));
  return (
    <AdminLayout
      title={`Productos (${rows.length})`}
      subtitle="Mantenimiento de productos"
      icon={<CategoryOutlined />}
    >
      <Box display={"flex"} justifyContent={"end"} sx={{ mb: 1 }}>
        <Button
          startIcon={<AddOutlined />}
          color="secondary"
          href="/admin/products/new"
        >
          Crear producto
        </Button>
      </Box>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductsPage;
