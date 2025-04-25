import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("jwt"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const login = (token, userData) => {
    localStorage.setItem("jwt", token);
    localStorage.setItem("user", JSON.stringify(userData));
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
  return (
    <AppContext.Provider value={{ loggedIn, user, products, login, logout, updateProducts }}>
      {children}
    </AppContext.Provider>
  );
};
