import { createContext, useState } from "react";
import {
  fetchCart as fetchCartAPI,
  addToCart as addToCartAPI,
  removeCartItem as removeCartItemAPI,
  updateCartQuantity as updateCartQuantityAPI,
  buyNow as buyNowAPI,
} from "@/api/cartAPI";
import { fetchPost, optionMaker } from "@/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("jwt"));
  const [token, setToken] = useState(localStorage.getItem("jwt"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [buyNowItem, setBuyNowItem] = useState(null);
  const [paymentCards, setPaymentCards] = useState(
    JSON.parse(localStorage.getItem("payment_cards")) || []
  );

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
    localStorage.removeItem("payment_cards");
    setLoggedIn(false);
    setUser(null);

    fetchPost("user/logout", optionMaker({}, "POST", token)).then((res) => {
        console.log("Logout successful", res);
    }).catch((err) => {
        console.error("Logout failed", err);
    });
  };

  const updatePaymentCards = (data) => {
    localStorage.setItem("payment_cards", JSON.stringify(data));
    setPaymentCards(data);
  };

  const updateProducts = (newProducts) => {
    setProducts(newProducts);
  };

  const fetchCart = async () => {
    console.log("🛒 Fetching cart...");
    try {
      const cartData = await fetchCartAPI();
      const mergedCart = cartData.reduce((acc, item) => {
        const existing = acc.find((i) => i.productid === item.productid);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, []);
      console.log("✅ Cart fetched and merged:", mergedCart);
      setCart(mergedCart);
    } catch (err) {
      console.error("❌ Failed to fetch cart in context:", err);
    }
  };

  const addToCart = async (productid, quantity) => {
    return await addToCartAPI(productid, quantity);
  };

  const removeItemFromCart = async (productid) => {
    await removeCartItemAPI(productid);
    await fetchCart();
  };

  const updateCartQuantity = async (productid, quantity) => {
    await updateCartQuantityAPI(productid, quantity);
    await fetchCart();
  };

  const buyNow = async (productid, quantity) => {
    const orderData = await buyNowAPI(productid, quantity);
    setBuyNowItem({ productid, quantity, ...orderData });
  };

  return (
    <AppContext.Provider
      value={{
        loggedIn,
        token,
        user,
        products,
        cart,
        buyNowItem,
        login,
        logout,
        updateProducts,
        updatePaymentCards,
        fetchCart,
        addToCart,
        removeItemFromCart,
        updateCartQuantity,
        buyNow,
        paymentCards,
        setPaymentCards,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
