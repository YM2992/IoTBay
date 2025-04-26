import express from "express";
import { protect, restrictTo } from "../Controller/authController.js";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  getAllAvailableProducts,
  deleteOneProduct,
} from "../Controller/productController.js";

const productRoute = express.Router();

productRoute
  .route("/")
  .get(getAllAvailableProducts)
  .post(protect, restrictTo("manager", "staff", "owner"), createProduct)
  .patch(protect, restrictTo("manager", "staff", "owner"), updateProduct)
  .delete(protect, restrictTo("manager", "staff", "owner"), deleteOneProduct);

productRoute.route("/all").get(protect, restrictTo("manager", "staff", "owner"), getAllProducts);

export default productRoute;
