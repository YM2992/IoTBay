import express from "express";
import { protect, restrictTo } from "../Controller/authController.js";
import { getAllProducts, createProduct } from "../Controller/productController.js";

const productRoute = express.Router();

productRoute
  .route("/")
  .get(getAllProducts)
  .post(protect, restrictTo("manager", "staff", "owner"), createProduct);

export default productRoute;
