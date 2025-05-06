// src/api/cartAPI.js
import axios from "axios";

export const fetchCart = async (userid) => {
    const res = await axios.get(`http://localhost:8000/api/cart/${userid}`);
    return res.data.data;
  };
  
  

export const addToCart = async (userid, productid, quantity) => {
  try {
    const res = await axios.post("http://localhost:8000/api/cart/add", {
      userid,
      productid,
      quantity,
    });
    return res.data;
  } catch (error) {
    console.error("❌ Failed to add to cart:", error);
    return null;
  }
};
