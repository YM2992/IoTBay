import IoTBayLogo from "/assets/IoTBay_Logo.png";
import { Link } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import { useContext, useEffect } from "react";
import { fetchGet } from "../api";
import { RxAvatar } from "react-icons/rx";
import { IoCartOutline, IoLogOutOutline } from "react-icons/io5";

import { Dropdown } from "antd";

const subBtnCSS = {
  lineHeight: "1rem",
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontSize: "1rem",
};

const items = [
  {
    key: "1",
    label: (
      <Link to="/profile" style={subBtnCSS}>
        <RxAvatar />
        <span>Profile</span>
      </Link>
    ),
  },
  {
    key: "2",
    label: (
      <Link to="/logout" style={subBtnCSS}>
        <IoLogOutOutline />
        <span>Logout</span>
      </Link>
    ),
  },
];
const SubMenu = () => (
  <Dropdown menu={{ items }}>
    <a style={{ display: "flex", alignItems: "center" }} onClick={(e) => e.preventDefault()}>
      <RxAvatar style={{ fontSize: "1.2rem" }} />
    </a>
  </Dropdown>
);

function Header() {
  const { loggedIn, updateProducts, products } = useContext(AppContext);

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
          <Link to="/products">Products</Link>
          <Link to="/cart" style={{ display: "flex", alignItems: "center" }}>
            <IoCartOutline style={{ fontSize: "1.2rem" }} />
          </Link>

          {loggedIn && <SubMenu />}

          {!loggedIn && <Link to="/login">Login</Link>}
          {!loggedIn && <Link to="/register">Register</Link>}
        </nav>
      </header>
    </>
  );
}

export default Header;
