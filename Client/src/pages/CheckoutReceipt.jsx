import { useLocation, useNavigate } from "react-router-dom";
import { Button, Typography, List, Divider } from "antd";
import "./CheckoutReceipt.css";

function CheckoutReceipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  if (!state) {
    return (
      <div className="receipt-container">
        <Typography.Title level={2} className="receipt-title">
          No Receipt Found
        </Typography.Title>
        <Button type="primary" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </div>
    );
  }

  const { orderNumber, date, totalAmount, items, paymentCard } = state;

  return (
    <div className="receipt-container">
      <Typography.Title level={2} className="receipt-title">
        Order Receipt
      </Typography.Title>
      <Divider />
      <div className="receipt-details">
        <Typography.Text strong>Order Number:</Typography.Text>
        <Typography.Text>{orderNumber}</Typography.Text>
        <Typography.Text strong>Date:</Typography.Text>
        <Typography.Text>{date}</Typography.Text>
        <Typography.Text strong>Total Amount:</Typography.Text>
        <Typography.Text>${totalAmount}</Typography.Text>
        <Typography.Text strong>Payment Method:</Typography.Text>
        <Typography.Text>
          {paymentCard.cardholderName} - **** **** **** {paymentCard.cardNumber.slice(-4)}
        </Typography.Text>
      </div>
      <Divider />
      <Typography.Title level={3}>Items</Typography.Title>
      <List
        itemLayout="horizontal"
        dataSource={items}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={item} />
          </List.Item>
        )}
      />
      <Button
        type="primary"
        size="large"
        className="back-to-home-button"
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </div>
  );
}

export default CheckoutReceipt;