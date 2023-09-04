import { useContext, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import {
  AccountCircleOutlined,
  AdminPanelSettings,
  CategoryOutlined,
  ConfirmationNumberOutlined,
  DashboardOutlined,
  EscalatorWarningOutlined,
  FemaleOutlined,
  LoginOutlined,
  MaleOutlined,
  SearchOutlined,
  VpnKeyOutlined,
} from "@mui/icons-material";
import { AuthContext, UIContext } from "@/context";
import { useRouter } from "next/router";

export const SideMenu = () => {
  const router = useRouter();
  const { user, isLoggedIn, logoutUser } = useContext(AuthContext);
  const { isMenuOpen, toggleSideMenu } = useContext(UIContext);

  const [searchTerm, setSearchTerm] = useState("");

  const onSearchTerm = () => {
    if (searchTerm.trim().length === 0) return;
    router.push(`/search/${searchTerm}`);
    toggleSideMenu();
  };

  const navigateTo = (path: string) => {
    router.push(`${path}`);
    toggleSideMenu();
  };

  const onLogout = () => {
    logoutUser();
  };

  return (
    <Drawer
      open={isMenuOpen}
      anchor="right"
      sx={{ backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" }}
      onClose={() => toggleSideMenu()}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
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
                    onClick={onSearchTerm}
                  >
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>
          {isLoggedIn && (
            <>
              <ListItem button>
                <ListItemIcon>
                  <AccountCircleOutlined />
                </ListItemIcon>
                <ListItemText primary={"Perfil"} />
              </ListItem>

              <ListItem button onClick={() => navigateTo("/orders/history")}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={"Mis Ordenes"} />
              </ListItem>
            </>
          )}

          <ListItem
            button
            sx={{ display: { xs: "", sm: "none" } }}
            onClick={() => navigateTo("men")}
          >
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={"/category/Hombres"} />
          </ListItem>

          <ListItem
            button
            sx={{ display: { xs: "", sm: "none" } }}
            onClick={() => navigateTo("/category/women")}
          >
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={"Mujeres"} />
          </ListItem>

          <ListItem
            button
            sx={{ display: { xs: "", sm: "none" } }}
            onClick={() => navigateTo("/category/kid")}
          >
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={"Niños"} />
          </ListItem>
          {isLoggedIn ? (
            <ListItem button onClick={() => onLogout()}>
              <ListItemIcon>
                <LoginOutlined />
              </ListItemIcon>
              <ListItemText primary={"Salir"} />
            </ListItem>
          ) : (
            <ListItem
              button
              onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}
            >
              <ListItemIcon>
                <VpnKeyOutlined />
              </ListItemIcon>
              <ListItemText primary={"Ingresar"} />
            </ListItem>
          )}

          {/* Admin */}
          {user?.role === "admin" && (
            <>
              <Divider />
              <ListSubheader>Panel de administración</ListSubheader>

              <ListItem button onClick={() => navigateTo(`/admin/products`)}>
                <ListItemIcon>
                  <CategoryOutlined />
                </ListItemIcon>
                <ListItemText primary={"Productos"} />
              </ListItem>

              <ListItem button onClick={() => navigateTo(`/admin/`)}>
                <ListItemIcon>
                  <DashboardOutlined />
                </ListItemIcon>
                <ListItemText primary={"Dashboard"} />
              </ListItem>

              <ListItem button onClick={() => navigateTo(`/admin/orders`)}>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={"Ordenes"} />
              </ListItem>

              <ListItem button onClick={() => navigateTo(`/admin/users`)}>
                <ListItemIcon>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary={"Usuarios"} />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};
