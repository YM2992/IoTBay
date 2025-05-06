import { createContext, useState } from "react";
import {
  fetchCart as fetchCartAPI,
  addToCart as addToCartAPI,
  removeCartItem as removeCartItemAPI,
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
  // const fetchProduct = useAutoFetch("product/");

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

  const fetchCart = async (userid) => {
    console.log("Fetching cart...");
    try {
      const cartData = await fetchCartAPI(userid);
      console.log("✅ Cart fetched from API:", cartData);
      setCart(cartData);
    } catch (err) {
      console.error("❌ Failed to fetch cart in context:", err);
    }
  };

  const addToCart = async (userid, productid, quantity) => {
    return await addToCartAPI(userid, productid, quantity);
  };

  const removeItemFromCart = async (productid) => {
    if (!user?.userid) return;
    await removeCartItemAPI(user.userid, productid);
    await fetchCart(user.userid); // Refresh cart
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
        removeCartItemAPI,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
