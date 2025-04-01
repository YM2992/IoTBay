import { useState, useContext } from "react";
import { AuthContext } from "../main";
import { useNavigate } from "react-router-dom";

import "./Login.css";
import Input from "../components/Input";

function Login() {
  const [email, setEmail] = useState("jeff@test.com");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (email.trim === "" || password.trim === "") return;
    const data = {
      email,
      password,
    };
    const res = await fetch("http://localhost:8000/api/user/login/", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status != 200) {
      console.log(res);
      return;
    }

    const resData = await res.json();
    login(resData.token, resData.user);
    navigate("/welcome");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="center-content">
          <div className="profile-icon">
            <span className="text-xl font-bold text-black">IotBay</span>
          </div>
          <h2 className="welcome-text">Welcome!</h2>
          <p className="info-text">Please sign in to your account below</p>
        </div>

        <Input field="email" func={setEmail} value={email} />
        <Input field="password" func={setPassword} value={password} type="password" />

        <div className="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>

        <button onClick={handleSubmit} type="submit" className="sign-in-btn">
          Sign in
        </button>

        <p className="contact-us">
          Having problems? <a href="#">Contact us</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
