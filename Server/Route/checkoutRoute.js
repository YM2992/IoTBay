// Server/Route/checkoutRoute.js
import express from "express";
import { protect } from "../Controller/authController.js"; // Adjust path as needed
import { processCheckout } from "../Controller/checkoutController.js"; // Adjust path as needed

const checkoutRoute = express.Router();

// checkoutRoute.route("/").post(protect, processCheckout);
checkoutRoute.route("/").post(processCheckout);

export default checkoutRoute;
