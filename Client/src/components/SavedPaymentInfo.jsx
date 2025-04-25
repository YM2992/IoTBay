import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { fetchPost } from "../api";
import { toast } from "react-hot-toast";

import "./SavedPaymentInfo.css";

function SavedPaymentInfo({ paymentInfo }) {
    const [newPaymentInfo, setNewPaymentInfo] = useState(paymentInfo || {
        cardNumber: "",
        expiryDate: "",
        cardholderName: "",
        cvv: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPaymentInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const resData = await fetchPost("paymentInfo/", newPaymentInfo);

            if (!resData) {
                return toast.error("Failed to save payment details, please try again later");
            }

            alert("Payment information saved successfully!");
        } catch (error) {
            console.error(error);
            alert("An error occurred while saving payment information.");
        }
    };

    return (
        <div className="payment-info">
            <h2>{paymentInfo ? "Saved Payment Details" : "Payment Details"}</h2>
            <form>
                <div>
                    <label>
                        Card Number
                        <input
                            className="card-number"
                            type="text"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={newPaymentInfo.cardNumber}
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
                            value={newPaymentInfo.cardholderName}
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
                            value={newPaymentInfo.expiryDate}
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
                            value={newPaymentInfo.cvv}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <button type="button" onClick={handleSave}>
                    {paymentInfo ? "Update Payment Information" : "Save Payment Information"}
                </button>
            </form>
        </div>
    );
}

SavedPaymentInfo.propTypes = {
  paymentInfo: PropTypes.shape({
    cardNumber: PropTypes.string.isRequired,
    expiryDate: PropTypes.string.isRequired,
    cardholderName: PropTypes.string.isRequired,
    cvv: PropTypes.string.isRequired,
  }).isRequired,
};

export default SavedPaymentInfo;
