import IoTBayLogo from "/assets/IoTBay_Logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../main";
import { useContext } from "react";
import { useEffect } from "react";

function Header() {
  const { loggedIn, updateProducts } = useContext(AuthContext);
  const fetchProducts = async () => {
    const response = await fetch("http://localhost:8000/api/product");
    const data = await response.json();
    if (!response.ok) {
      return;
    }
    updateProducts(data.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <header className="header">
        <img src={IoTBayLogo} alt="IoTBay Logo" />
        <h1>
          <Link to="/">IoTBay</Link>
        </h1>
        <nav>
          <Link to="/">Home</Link>
          {loggedIn && <Link to="/main">Main</Link>}
          {loggedIn && <Link to="/logout">Logout</Link>}
          {/* {loggedIn && <Link to="/profile">ICON + Profile</Link>} */}

          {!loggedIn && <Link to="/login">Login</Link>}
          {!loggedIn && <Link to="/register">Register</Link>}
        </nav>
      </header>
    </>
  );
}

export default Header;
