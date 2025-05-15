import IoTBayLogo from "/assets/IoTBay_Logo.png";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import { useContext } from "react";
import { RxAvatar } from "react-icons/rx";
import { IoCartOutline, IoLogOutOutline } from "react-icons/io5";

import { Dropdown } from "antd";

import { managers } from "@/utils/const";

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
const SubMenu = ({ active }) => (
  <Dropdown menu={{ items }}>
    <a
      style={{ display: "flex", alignItems: "center" }}
      className={active ? "active" : ""}
      onClick={(e) => e.preventDefault()}
    >
      <RxAvatar style={{ fontSize: "1.2rem" }} />
    </a>
  </Dropdown>
);

function Header() {
  const { loggedIn, user } = useContext(AppContext);
  const location = useLocation();
  const isProfileActive = location.pathname === "/profile";

  return (
    <>
      <header className="header">
        <img src={IoTBayLogo} alt="IoTBay Logo" />
        <h1>
          <Link to="/">IoTBay</Link>
        </h1>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/cart" style={{ display: "flex", alignItems: "center" }}>
            <IoCartOutline style={{ fontSize: "1.2rem" }} />
          </NavLink>

          {loggedIn && managers.includes(user.role) && <NavLink to="/manage">Manage</NavLink>}

          {loggedIn && <SubMenu active={isProfileActive} />}

          {!loggedIn && <NavLink to="/login">Login</NavLink>}
          {!loggedIn && <NavLink to="/register">Register</NavLink>}
        </nav>
      </header>
    </>
  );
}

export default Header;
