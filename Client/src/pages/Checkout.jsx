import { useContext, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import SavedPaymentCard from "@/components/SavedPaymentCard";
import { Button, Divider, Typography, List, Modal, Input } from "antd";
import "./Checkout.css";
import { removePaymentCard, savePaymentCard } from "@/components/Payment";

function Checkout() {
  const { cart, paymentCards, user, token, updatePaymentCards } = useContext(AppContext);
  const [selectedCard, setSelectedCard] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [editedCardDetails, setEditedCardDetails] = useState({});
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    if (!selectedCard) {
      alert("Please select a payment method.");
      return;
    }

    alert("Order placed successfully!");
    navigate("/checkout/receipt", {
      state: {
        orderNumber: "#123456",
        date: new Date().toLocaleDateString(),
        totalAmount: cart ? cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2) : 0,
        items: cart ? cart.map((item) => `${item.name} (x${item.quantity})`) : [],
        paymentCard: selectedCard,
      },
    });
  };

  const handleEditCard = (card) => {
    setExpandedCard(card.cardNumber);
    setEditedCardDetails({ ...card });
  };

  const handleSaveEdit = () => {
    savePaymentCard(editedCardDetails, token);
    updatePaymentCards((prevCards) =>
      prevCards.map((card) =>
        card.cardNumber === editedCardDetails.cardNumber ? editedCardDetails : card
      )
    );
    setExpandedCard(null);
  };

  const handleDeleteCard = (cardNumber) => {
    removePaymentCard(cardNumber, token);
  };

  const handleInputChange = (field, value) => {
    setEditedCardDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  return (
    <div className="checkout-container">
      <Typography.Title level={2} className="checkout-title">
        Checkout
      </Typography.Title>

      <div className="checkout-content">
        <div className="cart-summary">
          <Typography.Title level={3}>Order Summary</Typography.Title>
          <List
            itemLayout="horizontal"
            dataSource={cart}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.name}
                  description={`Quantity: ${item.quantity} | Price: $${item.price.toFixed(2)}`}
                />
                <Typography.Text strong>
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography.Text>
              </List.Item>
            )}
          />
          <Divider />
        </div>

        <div className="payment-section">
          <Typography.Title level={3}>Payment Method</Typography.Title>
          {paymentCards.length > 0 ? (
            paymentCards.map((card, index) => (
              <div
                key={index}
                className={`payment-card ${selectedCard && selectedCard.cardNumber === card.cardNumber ? "selected" : ""}`}
                onClick={() => setSelectedCard(card)}
              >
                {expandedCard === card.cardNumber ? (
                  <div className="expanded-card">
                    <Input
                      value={editedCardDetails.cardholderName}
                      onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                      placeholder="Cardholder Name"
                    />
                    <Input
                      value={editedCardDetails.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      placeholder="Card Number"
                    />
                    <Input
                      value={editedCardDetails.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      placeholder="Expiry Date"
                    />
                    <Input
                      value={editedCardDetails.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      placeholder="CVV"
                    />
                    <Button type="primary" onClick={handleSaveEdit}>
                      Save
                    </Button>
                    <Button onClick={() => setExpandedCard(null)}>Cancel</Button>
                  </div>
                ) : (
                  <>
                    <Typography.Text>
                      {card.cardholderName} - **** **** **** {card.cardNumber.slice(-4)}
                    </Typography.Text>
                    <Button
                      type="link"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCard(card);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="link"
                      danger
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCard(card.cardNumber);
                      }}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            ))
          ) : (
            <Typography.Text>No saved payment methods. Add one below:</Typography.Text>
          )}
          <SavedPaymentCard />
        </div>
      </div>

      <Button
        type="primary"
        size="large"
        className="place-order-button"
        onClick={handlePlaceOrder}
      >
        Place Order
      </Button>
    </div>
  );
}

export default Checkout;