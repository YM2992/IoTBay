import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { API_ROUTES, fetchDelete, fetchGet, fetchPost } from "../api";
import { toast } from "react-hot-toast";
import { AppContext } from "@/context/AppContext";

import "./SavedPaymentCard.css";
import { FaTrash } from "react-icons/fa";

function SavedPaymentCard({ paymentCard }) {
    const { user, token, paymentCards, updatePaymentCards } = useContext(AppContext);
  
  const [newPaymentCard, setNewPaymentInfo] = useState(
    paymentCard || {
      cardNumber: "",
      expiryDate: "",
      cardholderName: "",
      cvv: "",
    }
  );

  const clearPaymentInfo = () => {
    setNewPaymentInfo({
      cardNumber: "",
      expiryDate: "",
      cardholderName: "",
      cvv: "",
    });
  };

  const refreshPaymentCards = () => {
    fetchGet(API_ROUTES.payment.getPaymentCards, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Payment_cards:", res);
        if (res && res.status === "success") {
          localStorage.setItem("payment_cards", JSON.stringify(res.data));
          updatePaymentCards(res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching payment card:", error);
        toast.error("Failed to fetch payment card information.");
      });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    let resData = null;

    try {
      resData = await fetchPost(API_ROUTES.payment.updatePaymentCard, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: newPaymentCard
      });

      if (!resData) {
        return toast.error(
          "Failed to save payment details" + (resData ? resData.message : "")
        );
      }

      toast.success(resData.message);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving payment information.");
    }

    if (resData.status === "success") {
      if (resData.message.includes("saved")) {
        clearPaymentInfo();
        refreshPaymentCards();
      } else if (resData.message.includes("updated")) {
        refreshPaymentCards();
      }
    }
  };

  const handleRemove = async () => {
    try {
      const resData = await fetchDelete(API_ROUTES.payment.removePaymentCard, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          cardNumber: paymentCard.cardNumber,
        }
      });

      if (!resData) {
        return toast.error(
          "Failed to remove payment details." + (resData ? resData.message : "")
        );
      }

      toast.success("Payment card removed successfully!");
      refreshPaymentCards();
    } catch (error) {
      console.error(error);
      toast.success("An error occurred while removing payment information.");
    }
  };

  return (
    <div className="payment-card-info">
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
        <div className="button-row">
          <button type="button" onClick={handleSave}>
            {paymentCard ? "Update Payment Card" : "Save Payment Card"}
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
        </div>
      </form>
    </div>
  );
}

SavedPaymentCard.propTypes = {
  paymentCard: PropTypes.shape({
    cardNumber: PropTypes.string.isRequired,
    expiryDate: PropTypes.string.isRequired,
    cardholderName: PropTypes.string.isRequired,
    cvv: PropTypes.string.isRequired,
  }).isRequired,
};

export default SavedPaymentCard;
