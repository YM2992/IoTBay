import React from "react";
import './MainPage.css';
import Rash from '../assets/rashberry pi.jpg';
import Wifi from '../assets/wifi.jpg';
import Aduino from '../assets/aduino switch.jpg';
import Network from '../assets/download.jpg';
import ProductListing from "../components/ProductListing";
import { useEffect, useState } from "react";

function MainPage() {
    const [products, setProducts] = useState([]);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        setUserName(storedUserName || 'Guest');
        fetch('http://localhost:8000/api/product')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                console.log(response);

                return response.json();
            })
            .then(data => {
                console.log('Fetched products:', data);
                setProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));

            console.log(products);
    }, []);

    return (
        <div className="main-container">
            <main className="main-container">
                <h1 className="welcome-message">Welcome Back to IOT Bay , <span className="username">{userName}</span>!</h1>
                <div className="button-container">
                    {products.map(product => (
                        <ProductListing data={product}  />
                    ))}
                    <div>
                        
                    <ProductListing data={{
                        name: "Raspberry Pi 4 Model B",
                        price: 85,
                        quantity: 10,
                        description: "A small computer that can be used for a variety of projects",
                        image: Rash
                    }} />
                    </div>
                    <div>
                    <ProductListing data={{
                        name: "Raspberry Pi 3",
                        price: 65,
                        quantity: 10,
                        description: "A small computer that can be used for a variety of projects",
                        image: Rash
                    }} />
                    </div>
                    <div>

                    <ProductListing data={{
                        name: "Arduino Uno",
                        price: 13,
                        quantity: 5,
                        description: "A microcontroller that can be used for a variety of projects",
                        image: Aduino
                    }} />
                    </div>
                    <div>

                    <ProductListing data={{
                        name: "ESP32",
                        price: 7,
                        quantity: 87,
                        description: "A microcontroller that can be used for a variety of projects",
                        image: Wifi
                    }} />
                    </div>
                    <div>

                    <ProductListing data={{
                        name: "LoRaWAN Gateway",
                        price: 70,
                        quantity: 87,
                        description: "A long range wireless communication gateway",
                        image: Wifi
                    }} />
                    </div>
                    <div>

                    <ProductListing data={{
                        name: "Switch",
                        price: 20,
                        quantity: 87,
                        description: "A network switch",
                        image: Network
                    }} />
                    </div>
                    <div>

                    <ProductListing data={{
                        name: "WROOM-32",
                        price: 3,
                        quantity: 87,
                        description: "A microcontroller that can be used for a variety of projects",
                        image: Wifi
                    }} />
                    </div>

                    {/* <div>
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
                    </div> */}

                </div>
            </main>
        </div>
    );
}

export default MainPage;
