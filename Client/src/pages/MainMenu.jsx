import React from "react";
import './main.css';
import Rash from './rashberry pi.jpg';
import Wifi from './wifi.jpg';
import Aduino from './aduino switch.jpg';
import Network from './download.jpg';

function MainMenu() {
    return (
        <div className="main-container">
            <header>
            <button className="logout-button">
                    Logout
             </button>

            </header>

            <main className="main-container">
            <h1 className="welcome-message">Welcome Back to IOT Bay</h1>
            <div className="button-container">
                <div>
                <img src={Rash} className="item-image"/>
                <button>Rashberry Pi</button>
                </div>
                <div>
                <img src={Wifi} className="item-image"/>
                <button>Wifi Extender</button>
                </div>
                <div>
                <img src={Aduino} className="item-image"/>
                <button>Aduino Board</button>
                </div>
                <div>
                <img src={Network} className="item-image"/>
                <button>Network Switch</button>
                </div>
            
            
            
            </div>
            </main>
        </div>
    );
}

export default MainMenu;
