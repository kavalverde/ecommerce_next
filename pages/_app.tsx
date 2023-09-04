import "@/styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { SWRConfig } from "swr";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import type { AppProps } from "next/app";
import { lightTheme } from "../themes/light-theme";
import { Authprovider, Cartprovider, UIprovider } from "@/context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SessionProvider>
        <PayPalScriptProvider
          options={{
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
          }}
        >
          <SWRConfig
            value={{
              fetcher: (resource, init) =>
                fetch(resource, init).then((res) => res.json()),
            }}
          >
            <Authprovider>
              <Cartprovider>
                <UIprovider>
                  <ThemeProvider theme={lightTheme}>
                    <CssBaseline />
                    <Component {...pageProps} />
                  </ThemeProvider>
                </UIprovider>
              </Cartprovider>
            </Authprovider>
          </SWRConfig>
        </PayPalScriptProvider>
      </SessionProvider>
    </>
  );
}
