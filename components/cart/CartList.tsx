import {
  Box,
  Button,
  CardActionArea,
  CardMedia,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { ItemCounter } from "../ui";
import { FC, useContext } from "react";
import { CartContext } from "@/context";
import { ICartProduct, IOrderItem } from "@/interfaces";

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
  const { cart, updateCartQuantity, removeCartProduct } =
    useContext(CartContext);
  const onChangeProductQuantity = (product: ICartProduct, quantity: number) => {
    product.quantity = quantity;
    updateCartQuantity(product);
  };
  const onRemoveProduct = (product: ICartProduct) => {
    removeCartProduct(product);
  };
  const productToShow = products ? products : cart;
  return (
    <>
      {productToShow.map((product, index) => (
        <Grid container spacing={2} sx={{ mb: 1 }} key={index}>
          <Grid item xs={3}>
            {/* TODO: llevar a la pagina del producto */}
            <NextLink href={`/product/${product.slug}`} legacyBehavior>
              <Link>
                <CardActionArea>
                  <CardMedia
                    image={product.image}
                    component={"img"}
                    sx={{ borderRadius: "5px" }}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display={"flex"} flexDirection={"column"}>
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Talla: <strong>{product.size}</strong>
              </Typography>
              {editable ? (
                <ItemCounter
                  currentValue={product.quantity}
                  maxValue={10}
                  onUpdateQuantity={(quantity) => {
                    onChangeProductQuantity(product as ICartProduct, quantity);
                  }}
                />
              ) : (
                <Typography variant="h5">
                  {product.quantity} producto{product.quantity > 1 && "s"}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            display={"flex"}
            alignItems={"center"}
            flexDirection={"column"}
          >
            <Typography variant="subtitle1" textAlign={"center"}>
              ${product.price}
              {editable && (
                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => onRemoveProduct(product as ICartProduct)}
                >
                  Remover
                </Button>
              )}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </>
  );
};
