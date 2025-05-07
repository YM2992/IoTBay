import express from "express";
import {
  addToCart,
  getCartItems,
  updateCartQuantity,
  removeCartItem,
} from "../Controller/cartController.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userid", getCartItems);
router.post("/update-quantity", updateCartQuantity);
router.delete("/remove", removeCartItem);

export default router;
