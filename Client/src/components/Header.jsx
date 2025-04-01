import IoTBayLogo from "../assets/IoTBay_Logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../main";
import { useContext } from "react";

// import

function Header() {
  const { loggedIn } = useContext(AuthContext);

  return (
    <>
      <header className="header">
        <img src={IoTBayLogo} alt="IoTBay Logo" />
        <h1>
          <a href="/">IoTBay</a>
        </h1>
        <nav>
          {loggedIn && <Link to="/main">Main</Link>}
          {loggedIn && <Link to="/logout">Logout</Link>}

          {!loggedIn && <Link to="/login">Login</Link>}
          {!loggedIn && <Link to="/register">Register</Link>}
        </nav>
      </header>
    </>
  );
}

export default Header;
