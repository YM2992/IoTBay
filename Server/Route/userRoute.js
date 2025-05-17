import express from "express";
import { protect, restrictTo, login } from "../Controller/authController.js";
import { getAllUser, createUser, getMe, userExists, deleteUserById, toggleUserActivation } from "../Controller/userController.js";
import { updateUserById } from "../Controller/userController.js";

const userRoute = express.Router();

userRoute
  .route("/")
  .get(protect, restrictTo("admin","manager", "staff", "owner"), getAllUser)
  .post(createUser);
  

userRoute.route("/login").post(login);

userRoute.route("/checkEmail").post(userExists);

userRoute.route("/me").get(protect, getMe);

userRoute.route("/usermanage").patch(protect, restrictTo("admin"),updateUserById);;

userRoute.route("/toggleActivation").patch(protect, restrictTo("admin"),toggleUserActivation);;

userRoute.route("/delete").delete(protect, restrictTo("admin"),deleteUserById);;



export default userRoute;
