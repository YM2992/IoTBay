import { useContext, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import { Typography, Divider } from "antd";
import CartItem from "../components/CartItem";
import "./Cart.css";

const { Title, Text } = Typography;

function Cart() {
  const { user, cart, fetchCart } = useContext(AppContext);

  useEffect(() => {
    if (user?.userid) {
      console.log("🔄 Fetching cart...");
      fetchCart(user.userid);
    }
  }, [user]);

  console.log("🧾 Cart from context:", cart);

  const totalPrice = Array.isArray(cart)
    ? cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
    : "0.00";

  useEffect(() => {
    if (user?.userid) {
      console.log("🛒 Fetching cart for user:", user.userid);
      fetchCart(user.userid);
    }
  }, [user]);

  return (
    <div className="cart-wrapper">
      {/* Left: Items List */}
      <div className="cart-left">
        <div className="cart-header">
          <h2>🛒 All Items ({cart?.length || 0})</h2>
        </div>

        {cart?.length > 0 ? (
          cart.map((item) => <CartItem item={item} key={item.productid} />)
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      {/* Right: Order Summary */}
      <div className="cart-right">
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-total-row">
            <span className="order-total-label">Total:</span>
            <span className="order-total-amount">AU${totalPrice}</span>
          </div>

          <button className="checkout-button">Checkout Now</button>

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
