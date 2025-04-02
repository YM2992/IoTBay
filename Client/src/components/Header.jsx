import IoTBayLogo from "/assets/IoTBay_Logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../main";
import { useContext } from "react";
import { useEffect } from "react";
import { fetchGet } from "../api";
import { RxAvatar } from "react-icons/rx";

function Header() {
  const { loggedIn, updateProducts, products } = useContext(AuthContext);

  const fetchProducts = async () => {
    const response = await fetchGet("product/");
    if (!response) return;
    updateProducts(response.data);
  };

  useEffect(() => {
    if (products.length > 0) return;
    fetchProducts();
  }, [products]);

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
          {loggedIn && (
            <Link to="/profile" style={{ display: "flex", alignItems: "center" }}>
              <RxAvatar style={{ fontSize: "1.2rem" }} />
            </Link>
          )}

          {!loggedIn && <Link to="/login">Login</Link>}
          {!loggedIn && <Link to="/register">Register</Link>}
        </nav>
      </header>
    </>
  );
}

export default Header;
