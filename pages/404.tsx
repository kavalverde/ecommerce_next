import { ShopLayout } from "@/components/layouts";
import React from "react";
import { Box, Typography } from "@mui/material";

const Custom404 = () => {
  return (
    <ShopLayout
      title={"Página no encontrada"}
      page_description={"Nada que mostrar aquí"}
    >
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        height={"calc(100vh - 200px)"}
        sx={{ flexDirection: { xs: "column", sm: "row" } }}
      >
        <Typography
          variant={"h1"}
          component={"h1"}
          fontSize={70}
          fontWeight={200}
        >
          404
        </Typography>
        <Typography
          variant={"h1"}
          component={"h1"}
          fontSize={70}
          fontWeight={200}
          marginLeft={2}
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          |
        </Typography>
        <Typography marginLeft={2}>No encontramos la página</Typography>
      </Box>
    </ShopLayout>
  );
};

export default Custom404;
