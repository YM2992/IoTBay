import React from 'react';
import { useCart } from '../context/CartContext';  
import './CartPage.css';

const CartPage = () => {
  const { cart, removeFromCart } = useCart();  

  const handleRemove = (productId) => {
    removeFromCart(productId);  
  };

  return (
    <div className="cart-container">
    <div className="cart-page">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((product) => (
            <div key={product.productid} className="cart-item">
              <h3>{product.name}</h3>
              
              <p>${product.price}</p>
              <button onClick={() => handleRemove(product.productid)}>
                Remove from Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default CartPage;
