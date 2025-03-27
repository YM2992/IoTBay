import React from "react";
import "./Register.css";

function Register(){
    <div className="register-page">
        <main>
            <h1>Registration</h1>
            <h2>Join us for an easier shopping experience</h2>

            <div>
                <label for="getPass">Password</label>
                <input type="password" id="getPas" name="password" minLength="8" required/>
                
                <label for="getPass">Confirm Password</label>
                <input type="password" id="confirmPas" name="confirm_password" />
            </div>

            
            <button type="submit" class="btn"> Submit </button>
        </main>        
    </div>
}

// If getPas = confirmPas --> Accept

export default Register;