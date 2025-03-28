import React, { useState } from "react";
import "./Login.css";
import Input from "../components/Input";
import { json } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const emailInput = document.getElementById("email").value;
  // const passwordInput = document.getElementsByTagName("password").value;

const handleSubmit = async () =>{
  if(email.trim === "" || password.trim === "") return "";
  const data = {
    email,password
  }

  const res = await fetch("http://localhost:8000/api/user/login/",{

    method:"POST",
    body:JSON.stringify(data),
    headers:{
      "Content-Type" :"application/json",
    }
  })
  // if res.status. == fail code != 200

  // got the 
  const resData = await res.json();
  console.log(resData.token);
  localStorage.setItem("jwt", resData.token);

  if (res.status === 200) {
    window.location.href = "/welcome";
  } else {
    setError("Invalid email or password. Please try again.");
  }
}

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
        

        <Input field="email" func={setEmail} />
        <Input field="password" func={setPassword} />
        
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
