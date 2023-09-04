import { useState, useContext } from "react";
import NextLink from "next/link";
import { getSession, signIn } from "next-auth/react";
import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

import { AuthLayout } from "../../components/layouts";
import { useForm } from "react-hook-form";
import { validations } from "@/utils";
import { useRouter } from "next/router";
import { AuthContext } from "@/context";
import { GetServerSideProps } from "next";

type formData = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const onRegister = async ({ name, email, password }: formData) => {
    setShowError(false);
    const { hasError, message } = await registerUser(name, email, password);
    if (hasError) {
      setShowError(true);
      setErrorMessage(message || "Error en las credenciales");
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }
    // const destination = router.query.p?.toString() || "/";
    // router.replace(destination);
    await signIn("credentials", {
      email,
      password,
    });
  };

  return (
    <AuthLayout title={"Ingresar"}>
      <form onSubmit={handleSubmit(onRegister)} noValidate>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Crear cuenta
              </Typography>
            </Grid>
            {showError && (
              <Chip
                label="Usuario ya registrado"
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
              />
            )}
            <Grid item xs={12}>
              <TextField
                label="Nombre completo"
                variant="filled"
                fullWidth
                {...register("name", {
                  required: "El nombre es requerido",
                  minLength: 2,
                  pattern: {
                    value: /^[a-zA-Z ]*$/,
                    message: "El nombre solo puede contener letras",
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: "El correo es requerido",
                  validate: (val) => validations.isEmail(val),
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
                type="submit"
              >
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink
                href={`/auth/login${router.query.p && "?p=" + router.query.p}`}
                passHref
                legacyBehavior
              >
                <Link underline="always">¿Ya tienes cuenta?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });

  const { p = "/" } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default RegisterPage;
