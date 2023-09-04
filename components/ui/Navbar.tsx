import { useContext, useState } from "react";
import NextLink from "next/link";
import router, { useRouter } from "next/router";
import {
  AppBar,
  Toolbar,
  Link,
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
  Input,
  InputAdornment,
} from "@mui/material";
import {
  ClearOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { CartContext, UIContext } from "@/context";

export const Navbar = () => {
  const { asPath } = useRouter();
  const { toggleSideMenu } = useContext(UIContext);
  const { numberOfItems } = useContext(CartContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    router.push(`/search/${searchTerm}`);
  };

  const handleActiveButton = (path: string) => {
    if (asPath === `/category/${path}`) {
      return "primary";
    }
    return "info";
  };

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
        <Box
          sx={{
            display: isSearchVisible ? "none" : { xs: "none", sm: "block" },
          }}
          className="fadeIn"
        >
          <NextLink href="/category/men" passHref legacyBehavior>
            <Link>
              <Button color={handleActiveButton("men")}>Hombres</Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref legacyBehavior>
            <Link>
              <Button color={handleActiveButton("women")}>Mujeres</Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kid" passHref legacyBehavior>
            <Link>
              <Button color={handleActiveButton("kid")}>Niños</Button>
            </Link>
          </NextLink>
        </Box>
        <Box flex={1}></Box>
        {/* Pantallas desktop */}
        {isSearchVisible ? (
          <Input
            sx={{
              display: { xs: "none", sm: "flex" },
            }}
            className="fadeIn"
            autoFocus={true}
            onKeyUp={(e) => e.key === "Enter" && onSearchTerm()}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Buscar..."
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setIsSearchVisible(false)}
                >
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton
            className="fadeIn"
            onClick={() => setIsSearchVisible(true)}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            <SearchOutlined />
          </IconButton>
        )}
        {/* Pantallas pequeñas */}
        <IconButton
          sx={{ display: { xs: "flex", sm: "none" } }}
          onClick={toggleSideMenu}
        >
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" legacyBehavior>
          <Link>
            <IconButton>
              <Badge
                badgeContent={numberOfItems > 9 ? "+9" : numberOfItems}
                color="secondary"
              >
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>
        <Button onClick={() => toggleSideMenu()}>Menú</Button>
        {/* TODO flex*/}
      </Toolbar>
    </AppBar>
  );
};
