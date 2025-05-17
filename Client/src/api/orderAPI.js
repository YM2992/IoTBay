// src/api/orderAPI.js
import { API_ROUTES, fetchGet } from "@/api";

export const fetchOrderHistory = async (token) => {
  return fetchGet(API_ROUTES.order.getOrderHistory, {
    headers: {
      Authorization: `Bearer ${token || localStorage.getItem("jwt")}`,
    },
  });
};
