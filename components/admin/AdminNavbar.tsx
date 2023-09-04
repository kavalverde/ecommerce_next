import { useContext } from "react";
import NextLink from "next/link";
import { AppBar, Toolbar, Link, Typography, Box, Button } from "@mui/material";

import { UIContext } from "@/context";

export const AdminNavbar = () => {
  const { toggleSideMenu } = useContext(UIContext);

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref legacyBehavior>
          <Link display="flex" alignItems="center">
            <Typography variant="h6">Next | </Typography>
            <Typography sx={{ ml: 0.5 }}>Ecommerce</Typography>
          </Link>
        </NextLink>
        <Box flex={1}></Box>

        {/* Pantallas pequeñas */}
        <Button onClick={() => toggleSideMenu()}>Menú</Button>
        {/* TODO flex*/}
      </Toolbar>
    </AppBar>
  );
};
