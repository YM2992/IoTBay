import express from "express";
import {
  addToCart,
  getCartItems,
  updateCartQuantity,
  removeCartItem,
} from "../Controller/cartController.js";
import { protect } from "../Controller/authController.js";

const router = express.Router();

<<<<<<< HEAD
router.use(protect); // ✅ Make sure this is applied BEFORE all routes

=======
>>>>>>> 657c19a85019d129818acb9b7f53d8540388198e
router.post("/add", addToCart);
router.get("/", getCartItems);
router.post("/update-quantity", updateCartQuantity);
router.delete("/remove", removeCartItem);

export default router;
