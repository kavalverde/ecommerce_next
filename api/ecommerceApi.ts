import axios from "axios";

const ecommerceApi = axios.create({
  baseURL: "/api",
});

export default ecommerceApi;
