// src/api/cartAPI.js
import axios from "axios";
const API_URL = "http://localhost:8000/api/cart"; // Or your real backend base URL

export const fetchCart = async (userid) => {
    const res = await axios.get(`${API_URL}/${userid}`);
    return res.data.data;
  };
  
  

export const addToCart = async (userid, productid, quantity) => {
  try {
    const res = await axios.post(`${API_URL}/add`, {
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

export async function removeCartItem(userid, productid) {
    const res = await fetch(`${API_URL}/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid, productid }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to remove item");
    return data;
  }

  export const updateCartQuantity = async (userid, productid, quantity) => {
    const res = await fetch(`${API_URL}/update-quantity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid, productid, quantity }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update quantity");
    return data;
  };