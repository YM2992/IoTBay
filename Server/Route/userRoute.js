import express from "express";
import { protect, restrictTo, login } from "../Controller/authController.js";
import {
  getAllUser,
  createUser,
  getMe,
  userExists,
  updateUser,
  deactivateUser,
  accessLog,
} from "../Controller/userController.js";

const userRoute = express.Router();

userRoute
  .route("/")
  .get(protect, restrictTo("manager", "staff", "owner"), getAllUser)
  .post(createUser)
  .patch(protect, updateUser);

userRoute.route("/login").post(login);

userRoute.route("/checkEmail").post(userExists);

userRoute.route("/me").get(protect, getMe);

userRoute.route("/deactivate").patch(protect, deactivateUser);

userRoute.route("/access-log").post(protect, accessLog);

export default userRoute;
