import { useContext, FC } from "react";
import { Grid, Typography } from "@mui/material";
import React from "react";
import { CartContext } from "../../context/cart/CartContext";
import { currency } from "@/utils";

interface Props {
  orderValues?: {
    numberOfItems: number;
    subtotal: number;
    tax: number;
    total: number;
  };
}

export const OrderSummary: FC<Props> = ({ orderValues }) => {
  const { numberOfItems, subtotal, total, tax } = useContext(CartContext);

  const summaryValues = orderValues
    ? orderValues
    : { numberOfItems, subtotal, total, tax };

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No Productos</Typography>
      </Grid>
      <Grid item xs={6} display={"flex"} justifyContent={"end"}>
        <Typography>
          {summaryValues.numberOfItems} producto
          {summaryValues.numberOfItems > 1 && "s"}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display={"flex"} justifyContent={"end"}>
        <Typography>{currency.format(summaryValues.subtotal)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>
          Impuestos (
          {(Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) * 100).toFixed(0)}%)
        </Typography>
      </Grid>
      <Grid item xs={6} display={"flex"} justifyContent={"end"}>
        <Typography>{currency.format(summaryValues.tax)}</Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total: </Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }} display={"flex"} justifyContent={"end"}>
        <Typography variant="subtitle1">
          {currency.format(summaryValues.total)}
        </Typography>
      </Grid>
    </Grid>
  );
};
