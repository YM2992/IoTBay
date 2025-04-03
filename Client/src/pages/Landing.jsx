import "./Landing.css";
import { useContext } from "react";
import { AuthContext } from "../main";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import AboutImage from "/assets/about_iot_image.png";
import FadeIn from "../components/FadeIn";

import microcontroller from "/assets/categories/microcontroller.png";
import sensor from "/assets/categories/sensor.png";
import actuator from "/assets/categories/pneumatic.png";
import router from "/assets/categories/connection.png";
import accessories from "/assets/categories/adapter.png";

import LandingCategory from "../components/LandingCategory";

function Landing() {
  const { loggedIn, user } = useContext(AuthContext);
  const Address = loggedIn ? "/main" : "/login";

  const message = loggedIn
    ? `Hi ${user?.name.split(" ")[0]}, discover our products`
    : "Log in to explore our range of devices";

  return (
    <div className="landing-page" style={{ padding: "2rem 1rem" }}>
      <main>
        <section className="hero">
          <h1 className="hero-h1">Welcome to IoTBay</h1>
          <h2 className="hero-h2">Your one stop shop for all IoT needs</h2>
          <p className="hero-p">
            Discover our wide range of IoT components for your projects
          </p>
          <Link to={Address} className="hero-button">
            {message}
          </Link>
        </section>

        <section className="about">
          <img src={AboutImage} alt="About IoT" className="about-image" />
          <div>
            <h2 className="about-h2">
              Australia&apos;s leading IoT components supplier
            </h2>
            <ul className="about-ul">
              <FadeIn>
                <li className="about-li">Based in Sydney</li>
              </FadeIn>
              <FadeIn>
                <li className="about-li">Wide range of components</li>
              </FadeIn>
              <FadeIn>
                <li className="about-li">Affordable prices</li>
              </FadeIn>
              <FadeIn>
                <li className="about-li">Fast shipping</li>
              </FadeIn>
              <FadeIn>
                <li className="about-li">Excellent customer service</li>
              </FadeIn>
            </ul>
          </div>
        </section>

        <Banner />

        <section className="categories">
          <h2 className="categories-h2">View our range</h2>
          <div className="categories-grid">
            <LandingCategory
              image={microcontroller}
              title="Microcontrollers"
            />
            <LandingCategory
              image={sensor}
              title="Sensors"
            />
            <LandingCategory
              image={actuator}
              title="Actuators"
            />
            <LandingCategory
              image={router}
              title="Routers"
            />
            <LandingCategory
              image={accessories}
              title="Accessories"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Landing;
