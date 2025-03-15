import React from "react";
import './Landing.css';

function Landing() {
  return (
    <div className="landing-page">
      <main>
        <section className="hero">
          <h1 className="hero-h1">Welcome to IoTBay</h1>
          <h2 className="hero-h2">Your one stop shop for all IoT needs</h2>
          <p className="hero-p">Discover a wide range of sensors, actuators, and components for your IoT projects</p>
          <a href="/main" className="hero-button">Explore our range of devices</a>
        </section>
      </main>
    </div>
  );
}

export default Landing;
