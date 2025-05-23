import { useEffect, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import "./welcome.css";

function Welcome() {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/products");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="welcome-container">
      <div>
        <div className="welcome-accent welcome-accent-top-left"></div>
        <div className="welcome-accent welcome-accent-bottom-right"></div>
        <h1 className="welcome-h1">Welcome Back, {user.name.split(" ")[0]}!</h1>
        <p className="welcome-p">Good to see you</p>
        <p className="welcome-p">Role: {user.role}</p>
        <button className="welcome-button" onClick={() => navigate("/products", { state: user })}>
          Go to Main Page
        </button>
      </div>
    </div>
  );
}

export default Welcome;
