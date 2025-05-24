// probably bad
import express from "express";
import { protect, restrictTo } from "../Controller/authController.js";
import {
  getAllSuppliers,
  createSupplier,
  updateSupplierById,
  deleteSupplierById,
} from "../Controller/supplierController.js";

const supplierRoute = express.Router();

supplierRoute
  .route("/")
  .get(protect, restrictTo("admin", "manager", "owner"), getAllSuppliers) // delted staff
  .post(protect, restrictTo("admin"), createSupplier) // maybe broken??? 
  .delete(protect, restrictTo("admin"), deleteSupplierById) // previously in area below  
  .patch(protect, restrictTo("admin"), updateSupplierById); // general commands above

supplierRoute
  .route("/:id")
export default supplierRoute;
