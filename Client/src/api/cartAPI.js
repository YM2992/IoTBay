import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add item to cart
export const addToCart = async (productid, quantity, url = "/cart/add") => {
  const res = await axiosInstance.post(url, { productid, quantity });
  return res.data.data;
};

// Remove item from cart
export const removeCartItem = async (productid) => {
  const guestOrderId = localStorage.getItem("guestOrderId");

  const url = guestOrderId
    ? `/cart/guest?productid=${productid}&orderid=${guestOrderId}`
    : `/cart/remove?productid=${productid}`;

  const res = await axiosInstance.delete(url);
  return res.data.data;
};

// Update quantity
export const updateCartQuantity = async (productid, quantity) => {
  const guestOrderId = localStorage.getItem("guestOrderId");

  const url = guestOrderId ? "/cart/guest" : "/cart/update-quantity";

  const res = await axiosInstance.patch(url, {
    productid,
    quantity,
    orderid: guestOrderId || undefined,
  });

  return res.data.data;
};

// Buy now
export const buyNow = async (productid, quantity) => {
  const res = await axiosInstance.post("/cart/buy-now", { productid, quantity });
  return res.data.data;
};

// Fetch cart
export const fetchCart = async () => {
  const guestOrderId = localStorage.getItem("guestOrderId");
  const isLoggedIn = !!localStorage.getItem("jwt");
  let url;

  if (!isLoggedIn) {
    url = guestOrderId ? `/cart/guest?orderid=${guestOrderId}` : `/cart/guest`;
  } else {
    url = `/cart`;
  }
  // const url = !isLoggedIn && guestOrderId ? `/cart/guest?orderid=${guestOrderId}` : `/cart`;

  const res = await axiosInstance.get(url);
  return res.data.data;
};
