import NextLink from "next/link";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { GetServerSideProps } from "next";
import { AuthLayout } from "../../components/layouts";
import { useForm } from "react-hook-form";
import { validations } from "@/utils";
import { ErrorOutline } from "@mui/icons-material";
import { useState, useEffect } from "react";
// import { AuthContext } from "@/context";
import { useRouter } from "next/router";
import { signIn, getSession, getProviders } from "next-auth/react";

type formData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders().then((prov) => {
      setProviders(prov);
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const onLogin = async ({ email, password }: formData) => {
    setShowError(false);
    /* const isValidLogin = await loginUser(email, password);
    if (!isValidLogin) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }
    const destination = router.query.p?.toString() || "/";
    router.replace(destination); */

    await signIn("credentials", {
      email,
      password,
    });
  };

  return (
    <AuthLayout title={"Ingresar"}>
      <form onSubmit={handleSubmit(onLogin)} noValidate>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar Sesión
              </Typography>
              {showError && (
                <Chip
                  label="No reconocemos ese usuario / contraseña"
                  color="error"
                  icon={<ErrorOutline />}
                  className="fadeIn"
                />
              )}
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
                href={`/auth/register${
                  router.query.p && "?p=" + router.query.p
                }`}
                passHref
                legacyBehavior
              >
                <Link underline="always">¿No tienes cuenta?</Link>
              </NextLink>
            </Grid>
            <Grid
              item
              xs={12}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"end"}
            >
              <Divider sx={{ width: "100%", mb: 2 }} />
              {Object.values(providers).map((provider: any, index) => {
                if (provider.id !== "credentials")
                  return (
                    <Button
                      key={index}
                      variant="outlined"
                      fullWidth
                      onClick={() => signIn(provider.id)}
                      sx={{ mb: 1, color: "text.secondary" }}
                    >
                      {provider.name}
                    </Button>
                  );
              })}
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

export default LoginPage;
