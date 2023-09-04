import React, { FC, useReducer } from "react";
import { AuthContext, authReducer } from "./";
import { IUser } from "@/interfaces";
import { ecommerceApi } from "@/api";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}
interface Props {
  children?: React.ReactNode;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

export const Authprovider: FC<Props> = ({ children }) => {
  const router = useRouter();
  const { data, status } = useSession();
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

  useEffect(() => {
    if (status === "authenticated") {
      dispatch({ type: "[Auth] - Login", payload: data?.user as IUser });
    }
  }, [status, data]);

  /* useEffect(() => {
    checkToken();
  }, []); */

  const checkToken = async () => {
    if (!Cookies.get("token")) return;
    try {
      const { data } = await ecommerceApi.get("/user/validate-token");
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Login", payload: user });
    } catch (error) {
      Cookies.remove("token");
    }
  };

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await ecommerceApi.post("/user/login", {
        email,
        password,
      });
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Login", payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await ecommerceApi.post("/user/register", {
        name,
        email,
        password,
      });
      const { token, user } = data;
      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Login", payload: user });
      return {
        hasError: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message:
            error.response?.data.message || "Error al registrar el usuario",
        };
      }
      return {
        hasError: true,
        message: "No se pudo registrar el usuario",
      };
    }
  };
  const logoutUser = () => {
    //Cookies.remove("token");
    //Cookies.remove("cart");
    //router.reload();

    Cookies.remove("cart");
    Cookies.remove("firstName");
    Cookies.remove("lastName");
    Cookies.remove("address");
    Cookies.remove("address2");
    Cookies.remove("zip");
    Cookies.remove("city");
    Cookies.remove("country");
    Cookies.remove("phone");

    signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        //methods
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
