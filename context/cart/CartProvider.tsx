import { FC, useEffect, useReducer } from "react";
import Cookie from "js-cookie";
import { CartContext, cartReducer } from "./";
import { ICartProduct, IOrder, ShippingAddress } from "@/interfaces";
import { ecommerceApi } from "@/api";
import axios from "axios";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subtotal: number;
  tax: number;
  total: number;

  shippingAddress?: ShippingAddress;
}

interface Props {
  children?: React.ReactNode;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subtotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

export const Cartprovider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cookieProducts = Cookie.get("cart")
        ? JSON.parse(Cookie.get("cart")!)
        : [];
      dispatch({
        type: "[Cart] - LoadCart from cookies | storage",
        payload: cookieProducts,
      });
    } catch (error) {
      dispatch({
        type: "[Cart] - LoadCart from cookies | storage",
        payload: [],
      });
    }
  }, []);

  useEffect(() => {
    if (Cookie.get("firstName")) {
      const shippingAddress = {
        firstName: Cookie.get("firstName") || "",
        lastName: Cookie.get("lastName") || "",
        address: Cookie.get("address") || "",
        address2: Cookie.get("address2") || "",
        zip: Cookie.get("zip") || "",
        city: Cookie.get("city") || "",
        country: Cookie.get("country") || "",
        phone: Cookie.get("phone") || "",
      };
      dispatch({
        type: "[Cart] - LoadAddress from Cookies",
        payload: shippingAddress,
      });
    }
  }, []);

  useEffect(() => {
    if (state.cart.length === 0) return;
    Cookie.set("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (prev, current) => current.quantity + prev,
      0
    );
    const subtotal = state.cart.reduce(
      (prev, current) => current.quantity * current.price + prev,
      0
    );
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const orderSummary = {
      numberOfItems,
      subtotal,
      tax: subtotal * taxRate,
      total: subtotal * (1 + taxRate),
    };
    dispatch({
      type: "[Cart] - Update order summary",
      payload: orderSummary,
    });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    const productInCart = state.cart.some((p) => p._id === product._id);
    if (!productInCart)
      return dispatch({
        type: "[Cart] - Update products in cart",
        payload: [...state.cart, product],
      });
    const productInCartButDifferentSize = state.cart.some(
      (p) => p._id === product._id && p.size === product.size
    );
    if (!productInCartButDifferentSize)
      return dispatch({
        type: "[Cart] - Update products in cart",
        payload: [...state.cart, product],
      });
    const updatedProducts = state.cart.map((p) => {
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;

      //Aqui se actualiza la cantidad
      p.quantity += product.quantity;
      return p;
    });
    dispatch({
      type: "[Cart] - Update products in cart",
      payload: updatedProducts,
    });
  };
  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: "[Cart] - Change product quantity", payload: product });
  };
  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: "[Cart] - Remove product in cart", payload: product });
  };

  const updateAddress = (address: ShippingAddress) => {
    Cookie.set("firstName", address.firstName);
    Cookie.set("lastName", address.lastName);
    Cookie.set("address", address.address);
    Cookie.set("address2", address.address2 || "");
    Cookie.set("zip", address.zip);
    Cookie.set("city", address.city);
    Cookie.set("phone", address.phone);
    Cookie.set("country", address.country);
    dispatch({ type: "[Cart] - UpdateAddress from Cookies", payload: address });
  };

  const createOrder = async (): Promise<{
    hasError: boolean;
    message: string;
  }> => {
    if (!state.shippingAddress) {
      throw new Error("No hay dirección de envío");
    }
    const body: IOrder = {
      orderItems: state.cart.map((p) => ({
        ...p,
        size: p.size!,
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subtotal: state.subtotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    };
    try {
      const { data } = await ecommerceApi.post<IOrder>("/orders", body);

      dispatch({ type: "[Cart] - Order complete" });

      return {
        hasError: false,
        message: data._id!,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message || error.message,
        };
      }
      return {
        hasError: true,
        message: "Error at create order, contact support",
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        //methods
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,

        //Orders
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
