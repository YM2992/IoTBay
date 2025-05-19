//jin
import { useState } from "react";
import Input from "../components/Input";
import { toast } from "react-hot-toast";
import { strictEmailRegex, numberRegex } from "../utils/helper";
import { fetchPost, checkEmail, optionMaker } from "../api";

import "./Login.css";

function CreateUserPages({ refetch }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [phone, setPhone] = useState("123456789");
  const [role, setRole] = useState("customer");

  const inputMenu = [
    {
      field: "Full Name",
      value: name,
      func: setName,
    },
    {
      field: "Email",
      value: email,
      func: setEmail,
    },
    {
      field: "Password",
      value: password,
      func: setPassword,
      type: "password",
    },
    {
      field: "Confirm Password",
      value: passwordConfirm,
      func: setPasswordConfirm,
      type: "password",
    },
    {
      field: "Phone",
      value: phone,
      func: setPhone,
    },
  ];

  const clear = () => {
    setEmail("");
    setName("");
    setPassword("");
    setPasswordConfirm("");
    setPhone("123456789");
    setRole("customer");
  };

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
      role,
    };

    try {
      await fetchPost("user/", optionMaker(data));
      toast.success("Successfully created new user!");
      clear();
      refetch();
    } catch (error) {
      console.log(error);
      return toast.error("Failed to register, please try again later");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="center-content">
          <div className="profile-icon">
            <img src="/assets/IoTBay_Logo.png" alt="IoTBay" />
          </div>
          <h2 className="welcome-text">Admin Create User</h2>
        </div>

        <div className="input-container">
          {inputMenu.map((input) => (
            <Input
              key={input.field}
              field={input.field}
              value={input.value}
              func={input.func}
              type={input.type ? input.type : "text"}
            />
          ))}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ marginRight: "8px" }}>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <button onClick={handleSubmit} className="sign-in-btn">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateUserPages;
