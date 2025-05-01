import express from "express";
import { getPaymentCard, updatePaymentCard, removePaymentCard } from "../Controller/paymentController.js";
import { protect, restrictTo } from "../Controller/authController.js";

const paymentRoute = express.Router();

paymentRoute
    .route("/card/")
    .get(protect, getPaymentCard)
    .post(protect, updatePaymentCard)
    .delete(protect, removePaymentCard);

paymentRoute
    .route("/history/")

export default paymentRoute;