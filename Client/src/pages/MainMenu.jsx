import React from "react";
import './main.css';
import Rash from './rashberry pi.jpg';

function MainMenu() {
    return (
        <div className="main-container">
            <header>
            <button className="logout-button">
                    Logout
             </button>

            </header>
            <h1 className="welcome-message">Welcome Back to IOT Bay</h1>
            <main className="button-container">
                <div>
                <img src={Rash} className="item-image"/>
                <button>Rashberry Pi</button>
                </div>
            
            <button>Item 2</button>
            <button>Item 3</button>
            <button>Item 4</button>
            </main>
        </div>
    );
}

export default MainMenu;
