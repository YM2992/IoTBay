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

    useEffect(() => {
        fetch('http://localhost:8000/api/product')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                console.log(response);

                return response.json();
            })
            .then(data => {
                console.log('Fetched products:', data.data);
                setProducts(data.data);
            })
            .catch(error => console.error('Error fetching products:', error));

            console.log(products);
    }, []);

    return (
        <div className="main-container">
            <main className="main-container">
                <h1 className="welcome-message">Welcome Back to IOT Bay</h1>
                <div className="button-container">
                    {products.map((product, index) => (
                        <ProductListing key={product.productid || index} data={product} />
                    ))}

                    {/* <ProductListing data={{
                        name: "Raspberry Pi 4 Model B",
                        price: 85,
                        quantity: 10,
                        description: "A small computer that can be used for a variety of projects",
                        image: Rash
                    }} />

                    <ProductListing data={{
                        name: "Raspberry Pi 3",
                        price: 65,
                        quantity: 10,
                        description: "A small computer that can be used for a variety of projects",
                        image: Rash
                    }} />

                    <ProductListing data={{
                        name: "Arduino Uno",
                        price: 13,
                        quantity: 5,
                        description: "A microcontroller that can be used for a variety of projects",
                        image: Aduino
                    }} />

                    <ProductListing data={{
                        name: "ESP32",
                        price: 7,
                        quantity: 87,
                        description: "A microcontroller that can be used for a variety of projects",
                        image: Wifi
                    }} />

                    <ProductListing data={{
                        name: "LoRaWAN Gateway",
                        price: 70,
                        quantity: 87,
                        description: "A long range wireless communication gateway",
                        image: Wifi
                    }} />

                    <ProductListing data={{
                        name: "Switch",
                        price: 20,
                        quantity: 87,
                        description: "A network switch",
                        image: Network
                    }} />

                    <ProductListing data={{
                        name: "WROOM-32",
                        price: 3,
                        quantity: 87,
                        description: "A microcontroller that can be used for a variety of projects",
                        image: Wifi
                    }} /> */}
                </div>
            </main>
        </div>
    );
}

export default MainPage;
