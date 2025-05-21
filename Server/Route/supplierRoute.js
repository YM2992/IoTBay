// probably bad
import express from "express";
import { protect, restrictTo } from "../Controller/authController.js";
import {
  getAllSuppliers,
  createSupplier,
  getSupplierById,
  updateSupplierById,
  deleteSupplierById,
} from "../Controller/supplierController.js";

const supplierRoute = express.Router();

supplierRoute
  .route("/")
  .get(protect, restrictTo("admin", "manager", "owner"), getAllSuppliers) // delted staff
  .post(protect, restrictTo("admin"), createSupplier); // maybe broken??? 

supplierRoute
  .route("/:id")
  .get(protect, getSupplierById)
  .patch(protect, restrictTo("admin"), updateSupplierById)
  .delete(protect, restrictTo("admin"), deleteSupplierById);

export default supplierRoute;
