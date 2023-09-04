import { useContext, useState } from "react";
import { useRouter } from "next/router";
//import { useRouter } from "next/router";
//import { GetServerSideProps } from "next";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";

import { getAllProductSlugs, getProductBySlug } from "@/database/dbProducts";
import { ShopLayout } from "@/components/layouts";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { ProductSlideShow, SizeSelector } from "@/components/products";
import { ItemCounter } from "@/components/ui";
import { ICartProduct, IProduct } from "@/interfaces";
import { ISize } from "../../interfaces/products";
import { CartContext } from "@/context";
/* import { useProducts } from "@/hooks";
import { ICartProduct } from '../../interfaces/cart';

const product = initialData.products[0]; */

interface Props {
  product: IProduct;
}
const ProductPage: NextPage<Props> = ({ product }) => {
  const router = useRouter();
  const { addProductToCart } = useContext(CartContext);
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });
  /*  const router = useRouter();
  const { products: product, isLoading } = useProducts(
    `/products/${router.query.slug}`
  );

  if (isLoading) return <FullScreenLoading />;

  if (!product) return <h1>No existe</h1>; */
  const onSelectedSize = (size: ISize) => {
    setTempCartProduct((current) => ({
      ...current,
      size,
    }));
  };
  const onUpdateQuantity = (quantity: number) => {
    setTempCartProduct((current) => ({
      ...current,
      quantity,
    }));
  };
  const onAddProduct = () => {
    if (!tempCartProduct.size) return;
    addProductToCart(tempCartProduct);
    router.push("/cart");
  };
  return (
    <ShopLayout title={product.title} page_description={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          {/* slideshow */}
          <ProductSlideShow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display={"flex"} flexDirection={"column"}>
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              ${product.price}
            </Typography>
            {/* Cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Cantidad</Typography>
              {/* Itencoubter */}
              <ItemCounter
                currentValue={tempCartProduct.quantity}
                onUpdateQuantity={(quantity) => onUpdateQuantity(quantity)}
                maxValue={product.inStock}
              />
              <SizeSelector
                sizes={product.sizes}
                selectedSize={tempCartProduct.size}
                onSelectedSize={(size) => onSelectedSize(size)}
              />
            </Box>
            {/* Agregar al carrito */}
            {product.inStock ? (
              <Button
                color="secondary"
                className="circular-btn"
                onClick={onAddProduct}
              >
                {tempCartProduct.size
                  ? "Agregar al carrito"
                  : "Selecciona una talla"}
              </Button>
            ) : (
              <Chip
                label="No hay disponible"
                color="error"
                variant="outlined"
                sx={{ cursor: "not-allowed" }}
              />
            )}

            {/* Descripción */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripción</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

//No usar esto ... SSR
/* export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug = "" } = params as { slug: string };
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
  };
}; */

//getStaticPaths
// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async () => {
  const productSlugs = await getAllProductSlugs();

  return {
    paths: productSlugs.map(({ slug }) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = "" } = params as { slug: string };
  const product = await getProductBySlug(slug); // your fetch function here

  if (!product) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};

export default ProductPage;
