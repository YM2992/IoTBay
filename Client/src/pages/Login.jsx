import { useState, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchPost, optionMaker } from "../api";
import { strictEmailRegex } from "../utils/helper";

import "./Login.css";
import Input from "../components/Input";

function Login() {
  const [email, setEmail] = useState("jeff@test.com");
  const [password, setPassword] = useState("");

  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!strictEmailRegex.test(email)) return toast.error("Email is not valid");
    if (email.trim() === "" || password.trim() === "") {
      return toast.error("Email or Password could not be empty");
    }
    const data = {
      email,
      password,
    };

    try {
      const resData = await fetchPost("user/login", optionMaker(data));

      login(resData.token, resData.user);
      navigate("/welcome");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="center-content">
          <div className="profile-icon">
            <img src="/assets/IoTBay_Logo.png" alt="IoTBay" />
          </div>
          <h2 className="welcome-text">Welcome!</h2>
          <p className="info-text">Please sign in to your account below</p>
        </div>

        <Input type="email" field="Email" value={email} func={setEmail} required />
        <Input type="password" field="Password" value={password} func={setPassword} />

        <div className="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>

        <button onClick={handleSubmit} className="sign-in-btn">
          Sign in
        </button>

        <p className="contact-us">
          Having problems? <a href="contact-us">Contact us</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
