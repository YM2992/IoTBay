import express from "express";
import {
  addToCart,
  getCartItems,
  updateCartQuantity,
  removeCartItem,
} from "../Controller/cartController.js";

const router = express.Router();

router.post("/add", (req, res, next) => {
    console.log("🔥 Hit /api/cart/add route");
    next();
  }, addToCart);
  

router.post("/add", addToCart);
router.get("/:userid", getCartItems);
router.patch("/update-quantity", updateCartQuantity);
router.delete("/remove", removeCartItem);

export default router;
