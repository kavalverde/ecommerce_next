import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts";
import { PeopleOutline } from "@mui/icons-material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Grid, MenuItem, Select } from "@mui/material";
import useSWR from "swr";
import { IUser } from "@/interfaces";
import { ecommerceApi } from "@/api";

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>("/api/admin/users");

  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) return <></>;

  const onRoleUpdate = async (userID: string, newRole: string) => {
    const previousUsers = users.map((user) => ({ ...user }));
    const updatedUsers = users.map((user) => ({
      ...user,
      role: user._id === userID ? newRole : user.role,
    }));
    setUsers(updatedUsers);
    try {
      await ecommerceApi.put(`/admin/users`, { userID, role: newRole });
    } catch (error) {
      setUsers(previousUsers);
      console.log(error);
      alert("Error al actualizar el rol del usuario");
    }
  };

  const columns: GridColDef[] = [
    { field: "email", headerName: "Correo", width: 250 },
    { field: "name", headerName: "Nombre completo", width: 300 },
    {
      field: "role",
      headerName: "Rol",
      width: 300,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <Select
            value={row.role}
            label="Rol"
            sx={{ width: 300 }}
            onChange={({ target }) => onRoleUpdate(row.id, target.value)}
          >
            <MenuItem value="admin">admin</MenuItem>
            <MenuItem value="client">client</MenuItem>
            <MenuItem value="super-user">super-user</MenuItem>
            <MenuItem value="SEO">SEO</MenuItem>
          </Select>
        );
      },
    },
  ];

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  return (
    <AdminLayout
      title="Usuarios"
      subtitle="Mantenimiento de usuarios"
      icon={<PeopleOutline />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
