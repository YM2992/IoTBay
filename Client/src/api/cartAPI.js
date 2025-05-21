
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
export const addToCart = async (productid, quantity) => {
  const res = await axiosInstance.post("/cart/add", { productid, quantity });
  return res.data.data; 
};

// Remove item from cart
export const removeCartItem = async (productid) => {
  const guestOrderId = localStorage.getItem("guestOrderId");

  const url = guestOrderId
    ? `/cart/remove?productid=${productid}&orderid=${guestOrderId}`
    : `/cart/remove?productid=${productid}`;


  const res = await axiosInstance.delete(url);
  return res.data.data;
};



// Update quantity
export const updateCartQuantity = async (productid, quantity) => {
  const guestOrderId = localStorage.getItem("guestOrderId");

  const res = await axiosInstance.patch("/cart/update-quantity", {
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

  const url = !isLoggedIn && guestOrderId
    ? `/cart?orderid=${guestOrderId}`
    : `/cart`;

  const res = await axiosInstance.get(url);
  return res.data.data;
};


