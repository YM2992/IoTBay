import express from "express";
import { getPaymentCard, updatePaymentCard, removePaymentCard, getPaymentHistory } from "../Controller/paymentController.js";
import { protect } from "../Controller/authController.js";

const paymentRoute = express.Router();

paymentRoute
    .route("/card/")
    .get(protect, getPaymentCard)
    .post(protect, updatePaymentCard)
    .delete(protect, removePaymentCard);

paymentRoute
    .route("/history/")
    .get(protect, getPaymentHistory);

export default paymentRoute;