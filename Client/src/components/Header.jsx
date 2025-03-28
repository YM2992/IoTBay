import IoTBayLogo from '../assets/IoTBay_Logo.png';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  return (
    <>
      <header className="header">
        <img src={IoTBayLogo} alt="IoTBay Logo" />
        <h1>
          <a href='/'>
            IoTBay
          </a>
        </h1>
        <nav>
          {(() => {
            const location = useLocation();
            const currentPath = location.pathname;

            if (currentPath === '/') {
              return (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              );
            } else if (currentPath === '/login') {
              return (
                <>
                  <Link to="/">Home</Link>
                </>
              );
            } else if (currentPath === '/main') {
              return (
                <>
                  <Link to="/logout">Logout</Link>
                </>
              );
            }
            return null;
          })()}
        </nav>
      </header >
    </>
  );
}

export default Header;
