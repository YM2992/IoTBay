import React from "react";
import "./Register.css";

function Register(){

    return(
    <div className="register-page">
        <main>
            <h1>Registration</h1>
            <h2>Join us for an easier shopping experience</h2>

            <div class="centered">
                           
                {/*Does this save?*/}
                <div class="FieldMargin">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" name="Full Name" required/>                
                </div>

                <div class="FieldMargin">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="Full Name" required/>                
                </div>

                <div class="FieldMargin">
                    <label for="getPass">Password</label>
                    <input type="password" id="getPas" name="password" minLength="8" required/>                
                </div>

                <div class="FieldMargin">    
                    <label for="confirmPas">Confirm Password</label>
                    <input type="password" id="confirmPas" name="confirm_password" autoComplete="off" />
                </div>
                
                {/* This needs to returned red text error if any validations fails
                        - Failed Data validation format
                        - getPas != confirmPas
                        - Email already exists in data base
                */}                            
                <button type="submit" class="SubBtn"> Submit </button>              

            </div>
        </main>        
    </div>
    )
}

// If getPas = confirmPas --> Accept

export default Register;