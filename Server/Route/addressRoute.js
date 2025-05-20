import express from "express";
import { protect, restrictTo } from "../Controller/authController.js";

import {
  getUserAddressBook,
  createAddress,
  deleteOneAddressBook,
  updateOneAddressBook,
} from "../Controller/addressBookController.js";

const productRoute = express.Router();

productRoute
  .route("/")
  .get(protect, getUserAddressBook)
  .post(protect, createAddress)
  .patch(protect, updateOneAddressBook)
  .delete(protect, deleteOneAddressBook);

export default productRoute;
