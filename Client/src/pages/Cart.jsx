import { useContext, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import CartItem from "../components/CartItem";
import { removeCartItem as removeCartItemAPI, updateCartQuantity } from "@/api/cartAPI";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

import EmptyCard from "../components/EmptyCard";

function Cart() {
  const { cart, fetchCart } = useContext(AppContext);
  const navigate = useNavigate(); // ✅ Hook inside component

  useEffect(() => {
    fetchCart();
  }, []);

  const totalPrice = Array.isArray(cart)
    ? cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
    : "0.00";

  const removeItemFromCart = async (productid) => {
    try {
      await removeCartItemAPI(productid);
      await fetchCart();
    } catch (err) {
      console.error("❌ Failed to remove item:", err.message);
    }
  };

  const handleQtyChange = async (item, newQty) => {
    try {
      await updateCartQuantity(item.productid, newQty);
      await fetchCart();
    } catch (err) {
      console.error("❌ Failed to update quantity:", err.message);
    }
  };

  return (
    <div className="cart-wrapper">
      <div className="cart-left">
        <div className="cart-header">
          <h2>🛒 All Items ({cart?.length || 0})</h2>
        </div>

        {cart?.length > 0 ? (
          cart.map((item) => (
            <CartItem
              item={item}
              key={`product-${item.productid}`}
              onDelete={() => removeItemFromCart(item.productid)}
              onQtyChange={handleQtyChange}
            />
          ))
        ) : (
          <EmptyCard
            description={"Your cart is empty."}
            btnLink="/products"
            btnText="Explore Now"
            style={{ margin: "0 1rem 0" }}
          />
        )}
      </div>

      <div className="cart-right">
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-total-row">
            <span className="order-total-label">Total:</span>
            <span className="order-total-amount">AU${totalPrice}</span>
          </div>
          <button
            className="checkout-button"
            onClick={() => {
              console.log("🔁 Navigating to checkout...");
              navigate("/checkout");
            }}
            disabled={cart?.length === 0}
          >
            Checkout Now
          </button>
          <div className="payment-methods">
            <img src="/assets/Visa.png" alt="Visa" />
            <img src="/assets/Mastercard.png" alt="MasterCard" />
            <img src="/assets/Paypal.png" alt="PayPal" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
