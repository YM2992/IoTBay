import express from "express";
import { protect, restrictTo, login } from "../Controller/authController.js";
import { getAllUser, createUser, getMe } from "../Controller/userController.js";

const userRoute = express.Router();

userRoute
  .route("/")
  .get(protect, restrictTo("manager", "staff", "owner"), getAllUser)
  .post(createUser);

userRoute.route("/login").post(login);

userRoute.route("/me").get(protect, getMe);

export default userRoute;
