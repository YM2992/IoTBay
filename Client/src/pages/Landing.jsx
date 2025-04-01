import "./Landing.css";
import { useContext } from "react";
import { AuthContext } from "../main";
import { Link } from "react-router-dom";

function Landing() {
  const { loggedIn, user } = useContext(AuthContext);
  const Address = loggedIn ? "/main" : "/login";
  const message = loggedIn
    ? `Hi ${user.name.split(" ")[0]}, Find out our products here`
    : "Log in to Explore our range of devices";

  return (
    <div className="landing-page">
      <main>
        <section className="hero">
          <h1 className="hero-h1">Welcome to IoTBay</h1>
          <h2 className="hero-h2">Your one stop shop for all IoT needs</h2>
          <p className="hero-p">Discover our wide range of IoT components for your projects</p>
          <Link to={Address} className="hero-button">
            {message}
          </Link>
        </section>
      </main>
    </div>
  );
}

export default Landing;
