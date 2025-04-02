import { useState, useContext } from "react";
import { AuthContext } from "../main";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { fetchPost } from "../api";

import "./Login.css";
import Input from "../components/Input";

function Login() {
  const [email, setEmail] = useState("jeff@test.com");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (email.trim() === "" || password.trim() === "") {
      return toast.error("Email or Password could not be empty");
    }
    const data = {
      email,
      password,
    };

    const resData = await fetchPost("user/login", data);

    if (!resData) {
      return toast.error("Wrong email or password");
    }

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
