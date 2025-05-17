
import { useContext, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import SavedPaymentCard from "@/components/SavedPaymentCard";
import { Button, Divider, Typography, List, Modal, Input } from "antd";
import "./Checkout.css";

import { Radio, Button, Checkbox, Typography } from "antd"; // Input removed as it's now in NewCardForm
import toast from "react-hot-toast";
import { getPaymentCards } from "@/components/Payment"; 
import { removeCartItem as removeCartItemAPI, updateCartQuantity } from "@/api/cartAPI";
import { API_ROUTES, fetchPost, optionMaker } from "@/api";

const { Text } = Typography;

function CheckoutPage() {
  const { cart, fetchCart, token } = useContext(AppContext);
  const [paymentCards, setPaymentCards] = useState([]);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [newCardDetails, setNewCardDetails] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    saveCard: false
  });
  const newCardFormRef = useRef(null);


  const handlePlaceOrder = () => {
    if (!selectedCard) {
      alert("Please select a payment method.");
      return;
    }


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

  const fetchPaymentCards = async () => {
    try {
      const res = await getPaymentCards(token);
      if (res && res.status === "success" && Array.isArray(res.data)) {
        setPaymentCards(res.data);
        const currentSelectedCardId = selectedPaymentOption?.startsWith('saved_') ? selectedPaymentOption.split('_')[1] : null;
        const stillExists = currentSelectedCardId ? res.data.some(card => card.cardid.toString() === currentSelectedCardId) : false;


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

  const handlePaymentCallback = async () => {
    const paymentDetails = await getPaymentDetailsForOrder();
    if (!paymentDetails) {
      toast.error("Failed to get payment details. Please check your selection.");
      return;
    }

    // Call "/api/checkout" endpoint with the payment details
    const orderDetails = {
      items: cart,
      paymentDetails,
    };
    try {
      const response = await fetchPost(API_ROUTES.checkout.checkout, optionMaker(orderDetails, "POST", token));
      if (response && response.status === "success") {
        toast.success("Checkout successful!");
        // Optionally redirect or clear cart
        fetchCart(); // Refresh cart after checkout
      } else {
        toast.error(response?.message || "Checkout failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "Error during checkout.");
    }
  }

  return (

    <div className="checkout-wrapper">
      <div className="cart-left">
        <div className="cart-header">
          <h2>Your Checkout Items</h2>
        </div>
        {cart?.length > 0 ? (
          cart.map((item) => (
          <CartItem
            key={`checkout-${item.productid}-${item.cartitemid}`} 
            item={item}
              onDelete={() => removeItemFromCart(item.productid)}
              onQtyChange={handleQtyChange}
          />
          ))
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

      <div className="cart-right">
        <OrderSummary items={cart} getPaymentDetails={getPaymentDetailsForOrder} paymentCallback={handlePaymentCallback} />
        
        <div className="payment-section-container">
          <h3>Payment Method</h3>
          <Radio.Group 
            onChange={handlePaymentOptionChange} 
            value={selectedPaymentOption} 
            className="payment-radio-group"
          >
            {paymentCards.map((card) => (
              <PaymentCard 
                key={card.cardid} 
                card={card} 
                token={token}
                onCardUpdated={fetchPaymentCards}
              />
            ))}
            <Radio 
              value="new_card" 
              className="new-card-radio-option" 
            >
              Pay with new card
            </Radio>
          </Radio.Group>


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

