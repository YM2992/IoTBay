import express from "express";
import {
  addToCart,
  getCartItems,
  updateCartQuantity,
  removeCartItem,
} from "../Controller/cartController.js";
import { protect, restrictTo } from "../Controller/authController.js";

const cartRoute = express.Router();

cartRoute.post("/add", protect, addToCart);
cartRoute.get("/", protect, getCartItems);
cartRoute.patch("/update-quantity", protect, updateCartQuantity);
cartRoute.delete("/remove", protect, removeCartItem);

cartRoute
  .route("/guest")
  .post(addToCart)
  .get(getCartItems)
  .patch(updateCartQuantity)
  .delete(removeCartItem);

export default cartRoute;
