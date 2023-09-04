import { CartList, OrderSummary } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import { CartContext } from "@/context";
import { countries } from "@/utils";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const SummaryPage = () => {
  const router = useRouter();
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { shippingAddress, numberOfItems, createOrder } =
    useContext(CartContext);

  useEffect(() => {
    if (!Cookies.get("firstName")) {
      router.push("/checkout/address");
    }
  }, [router]);

  if (!shippingAddress) return <></>;
  const {
    address,
    city,
    country,
    firstName,
    lastName,
    phone,
    zip,
    address2 = "",
  } = shippingAddress;

  const getCountryName = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode);
    return country?.name || "";
  };

  const onCreateOrder = async () => {
    setIsPosting(true);
    const { hasError, message } = await createOrder();
    if (hasError) {
      setIsPosting(false);
      setErrorMessage(message);
      return;
    }
    router.replace(`/orders/${message}`);
  };
  return (
    <ShopLayout
      title={"Resumen de orden"}
      page_description={"Resumen de la orden de compra"}
    >
      <Typography variant="h1" component={"h1"}>
        Resumen de la orden
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={7}>
          {/* CardList */}
          <CartList editable={false} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({numberOfItems}{" "}
                {`producto${numberOfItems > 1 ? "s" : ""}`})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
                <NextLink href={"/checkout/address"} passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address}
                {address2 && `, ${address2}`}
              </Typography>
              <Typography>
                {city}, {zip}
              </Typography>
              <Typography>{getCountryName(country)}</Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display={"flex"} justifyContent={"end"}>
                <NextLink href={"/cart"} passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3, display: "flex", flexDirection: "column" }}>
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  onClick={() => onCreateOrder()}
                  disabled={isPosting}
                >
                  Confirmar orden
                </Button>
                <Chip
                  color="error"
                  label={errorMessage}
                  sx={{
                    display: errorMessage ? "flex" : "none",
                    mt: 2,
                    borderRadius: 0,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
