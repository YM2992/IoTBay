import express from "express";
import { getPaymentDetails, updatePaymentDetails, removePaymentDetails } from "../Controller/paymentController.js";
import { protect, restrictTo } from "../Controller/authController.js";

const paymentRoute = express.Router();

paymentRoute
    .route("/")
    .get(protect, getPaymentDetails)
    .post(protect, updatePaymentDetails)
    .delete(protect, removePaymentDetails);

export default paymentRoute;