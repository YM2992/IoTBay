import express from "express";
import { protect, restrictTo, login, logout } from "../Controller/authController.js";
import {
  getAllUser,
  createUser,
  getMe,
  userExists, deleteUserById, toggleUserActivation } from "../Controller/userController.js";
import { updateUserById,
  updateUser,
  deactivateUser,
  accessLog,
} from "../Controller/userController.js";

const userRoute = express.Router();

userRoute
  .route("/")
  .get(protect, restrictTo("admin","manager", "staff", "owner"), getAllUser)
  .post(createUser)
  .patch(protect, updateUser);
  

userRoute.route("/login").post(login);

userRoute.route("/checkEmail").post(userExists);

userRoute.route("/me").get(protect, getMe);

userRoute.route("/deactivate").patch(protect, deactivateUser);

userRoute.route("/access-log").post(protect, accessLog);

userRoute.route("/logout").post(protect, logout);

userRoute.route("/usermanage").patch(protect, restrictTo("admin"),updateUserById);;

userRoute.route("/toggleActivation").patch(protect, restrictTo("admin"),toggleUserActivation);;

userRoute.route("/delete").delete(protect, restrictTo("admin"),deleteUserById);;



export default userRoute;
