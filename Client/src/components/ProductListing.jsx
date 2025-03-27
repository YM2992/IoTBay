import React from "react";
import '../pages/MainPage.css';
import './ProductListing.css';

function ProductListing(props) {
    return (
        <>
            <a 
                href={`/product/${props.data.name}`} 
                className="product-card"
            >
                <img 
                    className="product-image" 
                    // src={props.data.imageUrl}
                    src={props.data.image}
                />
                <div className="product-details">
                    <p className="product-title">
                        {props.data.name}
                    </p>
                    <p className="product-price">
                        ${props.data.price.toFixed(2)}
                    </p>
                </div>
            </a>
        </>
    );
}

export default ProductListing;