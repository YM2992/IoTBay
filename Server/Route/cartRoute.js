import express from "express";
import { protect, restrictTo } from "../Controller/authController.js";
import {
  addToCart,
  getCartItems,
  updateCartQuantity,
  removeCartItem, 
  buyNow
} from "../Controller/cartController.js";

const cartRoute = express.Router();

cartRoute.post("/add", protect, addToCart);

cartRoute.post("/buy-now", protect, buyNow);

cartRoute.get("/", protect, getCartItems);

cartRoute.post("/update-quantity", protect, updateCartQuantity);

cartRoute.delete("/remove", protect, removeCartItem);

cartRoute.get("/all", protect, restrictTo("manager", "staff", "owner"), getCartItems);

export default cartRoute;
