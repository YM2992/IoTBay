import express from "express";
import {
  addToCart,
  getCartItems,
  updateCartQuantity,
  removeCartItem,
} from "../Controller/cartController.js";
import { protect } from "../Controller/authController.js";

const router = express.Router();

router.use(protect); // ✅ Make sure this is applied BEFORE all routes

router.post("/add", addToCart);
router.get("/", getCartItems);
router.post("/update-quantity", updateCartQuantity);
router.delete("/remove", removeCartItem);

export default router;
