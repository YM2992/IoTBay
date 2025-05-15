import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import {
  API_ROUTES,
  fetchDelete,
  fetchGet,
  fetchPost,
  optionMaker,
} from "../api";
import { toast } from "react-hot-toast";
import { AppContext } from "@/context/AppContext";

import "./SavedPaymentCard.css";
import { FaTrash } from "react-icons/fa";
import { getPaymentCards, removePaymentCard, savePaymentCard } from "./Payment";
import { Modal, Button } from "antd"; // Import Button
import { ExclamationCircleFilled } from '@ant-design/icons'; // Import an icon

function SavedPaymentCard({ paymentCard }) {
  const { user, token, paymentCards, updatePaymentCards } = useContext(AppContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

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
    getPaymentCards(token)
      .then((res) => {
        if (res && res.status === "success") {
          console.log("Payment_cards:", res);
          if (res && res.status === "success") {
            localStorage.setItem("payment_cards", JSON.stringify(res.data));
            updatePaymentCards(res.data);
          }
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
    savePaymentCard(newPaymentCard, token)
      .then((res) => {
        if (res && res.status === "success") {
          if (res.message.includes("updated")) {
            toast.success("Payment card updated successfully!");
            paymentCard = {
              ...paymentCard,
              cardNumber: newPaymentCard.cardNumber,
              expiryDate: newPaymentCard.expiryDate,
              cardholderName: newPaymentCard.cardholderName,
              cvv: newPaymentCard.cvv,
            };
          } else {
            toast.success("Payment card saved successfully!");
            clearPaymentInfo();
          }
          refreshPaymentCards();
        } else {
          toast.error("Failed to save payment card.");
        }
      })
      .catch((error) => {
        console.error("Error saving payment card:", error);
        toast.error(error.message || "An error occurred while saving payment card.");
      });
  };

  const handleRemove = async () => {
    removePaymentCard(paymentCard.cardid, paymentCard.cardNumber, token)
      .then((res) => {
        if (res && res.status === "success") {
          toast.success("Payment card removed successfully!");
          refreshPaymentCards();
        } else {
          toast.error("Failed to remove payment card.");
        }
      })
      .catch((error) => {
        console.error("Error removing payment card:", error);
        toast.error(error.message || "An error occurred while removing payment card.");
      });
  };

  const getExpiryDateStatus = () => {
    const [month, year] = paymentCard.expiryDate.split("/");
    const expiryDateObj = new Date(`20${year}`, month - 1);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    expiryDateObj.setMonth(expiryDateObj.getMonth() + 1);
    expiryDateObj.setDate(0);
    expiryDateObj.setHours(23, 59, 59, 999);
    return expiryDateObj < currentDate ? "Expired" : "Active";
  }

  return (
    <div className="payment-card-info">
      <Modal
        title={
          <div className="modal-title-container">
            <ExclamationCircleFilled className="modal-title-icon" />
            Delete Payment Card
          </div>
        }
        open={isDeleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        centered
        closable={true}
        className="delete-modal"
        width={400}
        footer={
          <div className="modal-footer-container">
            <Button
              key="cancel"
              onClick={() => setDeleteModalOpen(false)}
              className="modal-cancel-button"
            >
              Cancel
            </Button>
            <Button
              key="delete"
              type="primary"
              danger
              onClick={() => {
                handleRemove(); 
                setDeleteModalOpen(false); 
              }}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="modal-body-text">Are you sure you want to delete this payment card?</p>
      </Modal>
      {paymentCard && (
        <div className="payment-card bordered-card">
          <div className="card-number">
            <span className="label">Card Number:</span>
            <span className="value">**** **** **** {paymentCard.cardNumber.slice(-4)}</span>
          </div>
          <div className="cardholder-name">
            <span className="label">Cardholder Name:</span>
            <span className="value">{paymentCard.cardholderName}</span>
          </div>
          <div className="expiry-date">
            <span className="label">Expiry Date:</span>
            {
              getExpiryDateStatus() === "Expired" ? (
                <span className="value expired">{paymentCard.expiryDate}</span>
              ) : (
                <span className="value">{paymentCard.expiryDate}</span>
              )
            }
          </div>
          
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="edit-btn"
          >
            {isExpanded ? "Cancel" : "Edit"}
          </button>
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="remove-btn"
          >
            <i aria-hidden="true">
              <FaTrash />
            </i>
          </button>
        </div>
      )}
      {paymentCard ? (isExpanded && (
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
          </div>
        </form>
      )) : (
        
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
          </div>
        </form>
        )}
    </div>
  );
}

SavedPaymentCard.propTypes = {
  paymentCard: PropTypes.shape({
    cardid: PropTypes.string.isRequired,
    cardNumber: PropTypes.string.isRequired,
    expiryDate: PropTypes.string.isRequired,
    cardholderName: PropTypes.string.isRequired,
    cvv: PropTypes.string.isRequired,
  }).isRequired,
};

export default SavedPaymentCard;
