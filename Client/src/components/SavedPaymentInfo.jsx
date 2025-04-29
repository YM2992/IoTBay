import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { fetchDelete, fetchPost } from "../api";
import { toast } from "react-hot-toast";

import "./SavedPaymentInfo.css";
import { FaTrash } from "react-icons/fa";

function SavedPaymentInfo({ paymentCard, token }) {
  const [newPaymentCard, setNewPaymentInfo] = useState(
    paymentCard || {
      cardNumber: "",
      expiryDate: "",
      cardholderName: "",
      cvv: "",
    }
  );

  React.useEffect(() => {
    console.log("Current Payment Info:", newPaymentCard);
  }, [newPaymentCard]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const resData = await fetchPost("payment/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: newPaymentCard
      });

      if (!resData) {
        return toast.error(
          "Failed to save payment details, please try again later"
        );
      }

      alert("Payment information saved successfully!");
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving payment information.");
    }
  };

  const handleRemove = async () => {
    try {
      const resData = await fetchDelete("payment", {
        cardNumber: paymentCard.cardNumber,
      });

      if (!resData) {
        return toast.error(
          "Failed to remove payment details, please try again later"
        );
      }

      alert("Payment information removed successfully!");
      setNewPaymentInfo({
        cardNumber: "",
        expiryDate: "",
        cardholderName: "",
        cvv: "",
      });
    } catch (error) {
      console.error(error);
      alert("An error occurred while removing payment information.");
    }
  };

  return (
    <div className="payment-info">
      <h2>{paymentCard ? "Saved Payment Details" : "Payment Details"}</h2>
      <form>
        <div>
          <label>
            Card Number
            <input
              className="card-number"
              type="text"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={newPaymentCard.cardNumber}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Cardholder Name
            <input
              className="cardholder-name"
              type="text"
              name="cardholderName"
              placeholder="First Last"
              value={newPaymentCard.cardholderName}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="flex-row">
          <label>
            Expiry Date
            <input
              className="expiry-date"
              type="text"
              name="expiryDate"
              placeholder="MM/YY"
              value={newPaymentCard.expiryDate}
              onChange={handleChange}
            />
          </label>
          <label>
            CVV
            <input
              className="cvv"
              type="text"
              name="cvv"
              placeholder="123"
              value={newPaymentCard.cvv}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="button" onClick={handleSave}>
          {paymentCard ? "Update Payment Information" : "Save Payment Information"}
        </button>
        {paymentCard && (
          <button
            role="remove-payment"
            type="button"
            onClick={handleRemove}
            className="remove-payment-btn"
          >
            <i aria-hidden="true"><FaTrash /></i>
          </button>
        )}
      </form>
    </div>
  );
}

SavedPaymentInfo.propTypes = {
  token: PropTypes.string.isRequired,
  paymentCard: PropTypes.shape({
    cardNumber: PropTypes.string.isRequired,
    expiryDate: PropTypes.string.isRequired,
    cardholderName: PropTypes.string.isRequired,
    cvv: PropTypes.string.isRequired,
  }).isRequired,
};

export default SavedPaymentInfo;
