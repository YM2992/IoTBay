import { Typography } from "antd";
import PropTypes from "prop-types";
import "./OrderSummary.css";

const { Title } = Typography;

function OrderSummary({ items, shippingFee = 0, paymentCallback }) {
  if (!items || items.length === 0) return <p>No items to summarize.</p>;

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const total = subtotal + shippingFee;

  return (
    <div className="order-summary">
      <Title level={4}>Order Summary</Title>

      <div className="summary-row total">
        <span>Total:</span>
        <span>AU${total.toFixed(2)}</span>
      </div>

      <button className="checkout-button" onClick={paymentCallback}>Pay Now</button>

      <div className="payment-methods">
        <img src="/assets/Visa.png" alt="Visa" />
        <img src="/assets/Mastercard.png" alt="MasterCard" />
        <img src="/assets/Paypal.png" alt="PayPal" />
      </div>
    </div>
  );
}

OrderSummary.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ),
  shippingFee: PropTypes.number,
  paymentCallback: PropTypes.func.isRequired
};

export default OrderSummary;
