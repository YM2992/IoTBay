import { createRoot } from "react-dom/client";
import { createContext, useState, StrictMode } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from './context/CartContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("jwt"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [products, setProducts] = useState([]);

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
    <AuthContext.Provider value={{ loggedIn, user, products, login, logout, updateProducts }}>
      {children}
    </AuthContext.Provider>
  );
};

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
    <StrictMode>
      <App />
    </StrictMode>
    </CartProvider>
  </AuthProvider>
);
