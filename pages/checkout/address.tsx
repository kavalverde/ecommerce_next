import { GetServerSideProps } from "next";
import { ShopLayout } from "@/components/layouts";
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  NoSsr,
  TextField,
  Typography,
} from "@mui/material";
import { countries } from "@/utils";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { CartContext } from "@/context";

type formData = {
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  zip: string;
  city: string;
  phone: string;
  country: string;
};
const getAddressFromCookies = (): formData => {
  return {
    firstName: Cookies.get("firstName") || "",
    lastName: Cookies.get("lastName") || "",
    address: Cookies.get("address") || "",
    address2: Cookies.get("address2") || "",
    zip: Cookies.get("zip") || "",
    city: Cookies.get("city") || "",
    phone: Cookies.get("phone") || "",
    country: Cookies.get("country") || "",
  };
};
const AddressPage = () => {
  const router = useRouter();
  const { updateAddress } = useContext(CartContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<formData>({
    defaultValues: getAddressFromCookies(),
  });

  useEffect(() => {
    reset(getAddressFromCookies());
  }, [reset]);

  const onSubmit = async (data: formData) => {
    updateAddress(data);
    router.push("/checkout/summary");
  };
  return (
    <ShopLayout
      title={"Dirección"}
      page_description={"Confirmar dirección del destino"}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Typography variant="h1" component={"h1"}>
          Dirección
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              fullWidth
              variant="filled"
              {...register("firstName", {
                required: "Este campo es requerido",
                minLength: 2,
              })}
              error={errors.firstName ? true : false}
              helperText={errors.firstName ? errors.firstName.message : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              fullWidth
              variant="filled"
              {...register("lastName", {
                required: "Este campo es requerido",
                minLength: 2,
              })}
              error={errors.lastName ? true : false}
              helperText={errors.lastName ? errors.lastName.message : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección"
              fullWidth
              variant="filled"
              {...register("address", {
                required: "Este campo es requerido",
                minLength: 2,
              })}
              error={errors.address ? true : false}
              helperText={errors.address ? errors.address.message : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección 2"
              fullWidth
              variant="filled"
              {...register("address2", {
                required: false,
                minLength: 2,
              })}
              error={errors.address2 ? true : false}
              helperText={errors.address2 ? errors.address2.message : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Código postal"
              fullWidth
              variant="filled"
              {...register("zip", {
                required: "Este campo es requerido",
                minLength: 2,
              })}
              error={errors.zip ? true : false}
              helperText={errors.zip ? errors.zip.message : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="filled">
              <NoSsr>
                <TextField
                  select
                  variant="filled"
                  label="País"
                  defaultValue={Cookies.get("country") || ""}
                  {...register("country", {
                    required: "Este campo es requerido",
                    minLength: 2,
                  })}
                  error={errors.country ? true : false}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name}
                    </MenuItem>
                  ))}
                </TextField>
              </NoSsr>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              fullWidth
              variant="filled"
              {...register("city", {
                required: "Este campo es requerido",
                minLength: 2,
              })}
              error={errors.city ? true : false}
              helperText={errors.city ? errors.city.message : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              fullWidth
              variant="filled"
              {...register("phone", {
                required: "Este campo es requerido",
                minLength: 2,
              })}
              error={errors.phone ? true : false}
              helperText={errors.phone ? errors.phone.message : ""}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 5 }} display={"flex"} justifyContent={"center"}>
          <Button
            color={"secondary"}
            className="circular-btn"
            size="large"
            type="submit"
          >
            Revisar pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

/* export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token = "" } = req.cookies;

  let isValidToken = false;

  try {
    await jwt.isValidToken(token);
    isValidToken = true;
  } catch (error) {
    isValidToken = false;
  }
  if (!isValidToken) {
    return {
      redirect: {
        destination: "/auth/login?p=/checkout/address",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}; */

export default AddressPage;
