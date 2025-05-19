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
  .post(protect, restrictTo("manager", "staff", "admin"), createProduct)
  .patch(protect, restrictTo("manager", "staff", "admin"), updateProduct)
  .delete(protect, restrictTo("manager", "staff", "admin"), deleteOneProduct);

productRoute.route("/all").get(protect, restrictTo("manager", "staff", "admin"), getAllProducts);

export default productRoute;
