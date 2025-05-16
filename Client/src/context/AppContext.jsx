import { fetchPost, optionMaker } from "@/api";
import { createContext, useState, useEffect } from "react";

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

  // const

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

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

    fetchPost("user/logout", optionMaker({}, "POST", token)).then((res) => {
        console.log("Logout successful", res);
    }).catch((err) => {
        console.error("Logout failed", err);
    });
  };

  const updateProducts = (newProducts) => {
    setProducts(newProducts);
  };
  return (
    <AppContext.Provider
      value={{
        loggedIn,
        user,
        setUser,
        token,
        products,
        login,
        logout,
        updateProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
