import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("jwt"));
  const [token, setToken] = useState(localStorage.getItem("jwt"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [paymentCards, setPaymentCards] = useState(JSON.parse(localStorage.getItem("payment_cards")) || null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  // const fetchProduct = useAutoFetch("product/");

  // const

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

  const updatePaymentCards = (data) => {
    localStorage.setItem("payment_cards", JSON.stringify(data));
    setPaymentCards(data);
  };

  const updateProducts = (newProducts) => {
    setProducts(newProducts);
  };
  return (
    <AppContext.Provider value={{ loggedIn, user, paymentCards, token, products, login, logout, updatePaymentCards, updateProducts }}>
      {children}
    </AppContext.Provider>
  );
};
