import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { Typography, Divider } from "antd";
import "./Checkout.css";

const { Title, Text } = Typography;

function CheckoutPage() {
  const { buyNowItem, products, user } = useContext(AppContext);

  if (!buyNowItem) return <p>No item selected for checkout.</p>;

  const { productid, quantity } = buyNowItem;
  const product = products.find((p) => p.productid === productid);
  if (!product) return <p>Product not found.</p>;

  const total = (product.price * quantity).toFixed(2);

  return (
    <div className="checkout-page">
      <div className="checkout-left">
        <div className="address-card">
          <div className="address-header">
            <Title level={4}>Shipping Address</Title>
            <button className="change-btn">Change</button>
          </div>
          <Text strong>
            {user?.name} {user?.phone || "0412345678"}
          </Text>
          <p>{user?.address || "123 Main St"}</p>
          <p>
            Sydney NEW SOUTH WALES Australia 2000{" "}
            <span className="default-tag">Default Address</span>
          </p>
          <button className="edit-btn">Edit Address</button>
        </div>

        <div className="order-details-card">
          <Title level={4}>Order Details</Title>
          <div className="product-row">
            <img
              src={`/assets/products/${product.image}.jpg`}
              alt={product.name}
            />
            <div className="product-info">
              <Text strong>{product.name}</Text>
              <p>Quantity: {quantity}</p>
              <p>Unit Price: ${product.price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="shipping-options">
          <Title level={5}>CHOOSE YOUR SHIPPING OPTIONS</Title>
          <label>
            <input type="radio" name="shipping" defaultChecked /> Standard
            Shipping — AU$7.95
          </label>
          <br />
          <label>
            <input type="radio" name="shipping" /> Express Shipping — AU$29.95
          </label>
        </div>
      </div>

      <div className="checkout-right">
        <div className="order-summary">
          <Title level={4}>Order Summary</Title>
          <div className="summary-row">
            <span>Total:</span>
            <span>AU${total}</span>
          </div>
          <div className="summary-row">
            <span>Shipping Fee:</span>
            <span>AU$7.95</span>
          </div>
          <div className="summary-row">
            <span>Order Total:</span>
            <span className="total">
              AU${(parseFloat(total) + 7.95).toFixed(2)}
            </span>
          </div>
          <button className="checkout-button">Continue</button>
        </div>
      </div>
      <div className="payment-method">
  <Title level={4}>Payment Method</Title>

  <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <input type="radio" name="payment" defaultChecked />
    Credit/Debit Card
    <div className="card-logos">
      <img src="/assets/Visa.png" alt="Visa" />
      <img src="/assets/Mastercard.png" alt="Mastercard" />
    </div>
  </label>
</div>

    </div>
  );
}

export default CheckoutPage;
