import express from "express";
import { protect, restrictTo } from "../Controller/authController.js";

import {
  getUserAddressBook,
  createAddress,
  deleteOneAddressBook,
  updateOneAddressBook,
  updateOrderAddress,
} from "../Controller/addressBookController.js";

const addressRoute = express.Router();

addressRoute
  .route("/")
  .get(protect, getUserAddressBook)
  .post(protect, createAddress)
  .patch(protect, updateOneAddressBook)
  .delete(protect, deleteOneAddressBook);

addressRoute.route("/shipment").patch(protect, updateOrderAddress);

export default addressRoute;
