import express from "express";
import { protect } from "../Controller/authController.js";
import { getOrderHistory, getOrderById } from "../Controller/orderController.js";

const orderRoute = express.Router();

orderRoute.get("/history", protect, getOrderHistory);
orderRoute.get("/:orderid", protect, getOrderById); 
export default orderRoute;
