// Server/Route/orderRoute.js

import express from "express";
import { protect } from "../Controller/authController.js";
import { getOrderHistory } from "../Controller/orderController.js";

const orderRoute = express.Router();

// 🧾 Order history route
orderRoute
  .route("/history")
  .get(protect, getOrderHistory);

// ✅ Export like payment route
export default orderRoute;
