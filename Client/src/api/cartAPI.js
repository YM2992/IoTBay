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
    console.log("📤 Token attached to request:", token);
  }
  return config;
});

// Add item to cart
export const addToCart = async (productid, quantity) => {
  const res = await axiosInstance.post("/cart/add", { productid, quantity });
  return res.data.data; // standardized
};

// Remove item from cart
export const removeCartItem = async (productid) => {
  const res = await axiosInstance.delete("/cart/remove", {
    data: { productid },
  });
  return res.data.data;
};

// Update quantity
export const updateCartQuantity = async (productid, quantity) => {
  const res = await axiosInstance.post("/cart/update-quantity", {
    productid,
    quantity,
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
  const res = await axiosInstance.get("/cart");
  return res.data.data;
};

