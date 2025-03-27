import React from "react";
import "./Register.css";

function Register(){
    return(
    <div className="register-page">
        <main>
            <h1>Registration</h1>
            <h2>Join us for an easier shopping experience</h2>

            <div class="FieldMargin">
                <label for="fullName">Full Name</label>
                <input type="text" id="fullName" name="Full Name" required/>                
            </div>

            <div class="FieldMargin">
                <label for="getPass">Password</label>
                <input type="password" id="getPas" name="password" minLength="8" required/>                
            </div>
            
            <div class="FieldMargin">    
                <label for="getPass">Confirm Password</label>
                <input type="password" id="confirmPas" name="confirm_password" />
            </div>

            
            <button type="submit" class="btn"> Submit </button>
            
        </main>        
    </div>
    )
}

// If getPas = confirmPas --> Accept

export default Register;