import express from "express";
import { protect } from "../Controller/authController.js";
import { getOrderHistory, getOrderById, getAllOrders } from "../Controller/orderController.js";

const orderRoute = express.Router();

// orderRoute.route("/").get(getAllOrders);

orderRoute.get("/history", protect, getOrderHistory);
orderRoute.get("/:orderid", protect, getOrderById);

export default orderRoute;
