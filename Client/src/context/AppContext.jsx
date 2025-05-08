import { createContext, useState } from "react";
import {
  fetchCart as fetchCartAPI,
  addToCart as addToCartAPI,
  removeCartItem as removeCartItemAPI,
  updateCartQuantity as updateCartQuantityAPI,
} from "@/api/cartAPI";
import axios from "axios";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("jwt"));
  const [token, setToken] = useState(localStorage.getItem("jwt"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const login = (token, userData) => {
    localStorage.setItem("jwt", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setLoggedIn(false);
    setUser(null);
  };

  const updateProducts = (newProducts) => {
    setProducts(newProducts);
  };

  const fetchCart = async () => {
    console.log("🛒 Fetching cart...");
    try {
      const cartData = await fetchCartAPI();
      console.log("✅ Cart fetched from API:", cartData);
      setCart(cartData);
    } catch (err) {
      console.error("❌ Failed to fetch cart in context:", err);
    }
  };

  const addToCart = async (productid, quantity) => {
    return await addToCartAPI(productid, quantity);
  };

  const removeItemFromCart = async (productid) => {
    await removeCartItemAPI(productid);
    await fetchCart(); // Refresh cart
  };

  const updateCartQuantity = async (productid, quantity) => {
    await updateCartQuantityAPI(productid, quantity);
    await fetchCart(); // Refresh cart
  };

  return (
    <AppContext.Provider
      value={{
        loggedIn,
        user,
        token,
        products,
        cart,
        login,
        logout,
        updateProducts,
        fetchCart,
        addToCart,
        removeItemFromCart,
        updateCartQuantity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
