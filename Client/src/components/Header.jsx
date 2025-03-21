import IoTBayLogo from '../assets/IoTBay_Logo.png';

function Header() {
  return (
    <>
      <header className="header">
        <img src={IoTBayLogo} alt="IoTBay Logo" />
        <h1>
          <a>
            IoTBay
          </a>
        </h1>
        <nav>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </nav>
      </header>
    </>
  );
}

export default Header;
