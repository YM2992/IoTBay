import express from "express";
import { protect, restrictTo, login } from "../Controller/authController.js";
import { getAllUser, createUser } from "../Controller/userController.js";

const userRoute = express.Router();

userRoute
  .route("/")
  .get(protect, restrictTo("manager", "staff", "owner"), getAllUser)
  .post(createUser);

userRoute.route("/login").post(login);

export default userRoute;
