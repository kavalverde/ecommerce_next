import NextLink from "next/link";
import { ShopLayout } from "@/components/layouts";
import { Box, Link, Typography } from "@mui/material";
import { RemoveShoppingCartOutlined } from "@mui/icons-material";

const EmptyPage = () => {
  return (
    <ShopLayout
      title={"Carrito vacío"}
      page_description={"No hay artículos en el carrito"}
    >
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        height={"calc(100vh - 200px)"}
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
      >
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
          <Typography variant="h1" component="h1">
            Carrito vacío
          </Typography>
          <NextLink href={"/"} passHref legacyBehavior>
            <Link typography={"h4"} color={"secondary"}>
              Regresar
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  );
};

export default EmptyPage;
