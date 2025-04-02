import { useState } from "react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { strictEmailRegex, numberRegex } from "../utils/helper";
import { fetchPost, checkEmail } from "../api";

import "./Login.css";

function Registration() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("123456789");

  const handleSubmit = async () => {
    // Field guards
    if (!email.trim() || !password.trim() || !name.trim() || !phone.trim()) {
      return toast.error("All field must be filled");
    }
    if (!(passwordConfirm.trim() === password.trim())) {
      return toast.error("Password and Confirm must be same");
    }
    if (!strictEmailRegex.test(email)) return toast.error("Email is not valid");
    if (!numberRegex.test(phone) || phone.length !== 9) return toast.error("Phone is not valid");

    // Check if email already exist
    const result = await checkEmail(email);
    if (!result || result.exist) return toast.error("Email already exist");

    const data = {
      email,
      password,
      name,
      phone: Number(phone),
    };

    const resData = await fetchPost("user/", data);

    if (!resData) {
      return toast.error("Failed to register, please try again later");
    }

    navigate("/login");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="center-content">
          <div className="profile-icon">
            <span className="text-xl font-bold text-black">IotBay</span>
          </div>
          <h2 className="welcome-text">Join Now!</h2>
          <p className="info-text">Become a member with us today for FREE.</p>
        </div>

        <div className="input-container">
          <Input field="Full Name" value={name} func={setName} />
          <Input field="Email" value={email} func={setEmail} />
          <Input type="password" value={password} field="Password" func={setPassword} />
          <Input
            type="password"
            value={passwordConfirm}
            field="Confirm Password"
            func={setPasswordConfirm}
          />
          <Input field="Phone" func={setPhone} value={phone} />
          <button onClick={handleSubmit} className="sign-in-btn">
            Create Account
          </button>
        </div>

        <p className="contact-us">
          Already a Member? <Link to="/login">login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Registration;
