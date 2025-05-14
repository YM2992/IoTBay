import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import catchAsync from "../Utils/catchAsync.js";
import cusError from "../Utils/cusError.js";
import { findUserByEmail, findUserById } from "./userController.js";

export const hashPassword = async function (password) {
  return await bcrypt.hash(password, 12);
};

const correctPassword = async function (typedInPassword, dbSavedPassword) {
  if (!dbSavedPassword || !typedInPassword) return null;
  return await bcrypt.compare(typedInPassword, dbSavedPassword);
};

// sign new json web token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// send token to user
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.userid);

  user.password = undefined;

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    secure: true,
    httpOnly: true,
    sameSite: "none",
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(email);

  if (!email || !password) {
    return next(new cusError("please provide email and password", 400));
  }

  // check if user exists && password is correct
  const user = findUserByEmail(email);
  const correct = await correctPassword(password, user?.password);

  if (!correct || !user) {
    return next(new cusError("incorrect email or password", 401));
  }

  if (!user.activate) {
    return next(new cusError("Please find us to re-activate your account", 401));
  }

  // if all correct, send token back to user
  createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer"))
    return next(new cusError("You are not logged in, please login first", 401));

  token = token.split(" ")[1];
  if (token.trim() == "null")
    return next(new cusError("There is a token issue, please report it to us", 401));

  const result = await jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = findUserById(result.id);

  if (!currentUser) {
    return next(new cusError("The user no longer exist", 401));
  }

  if (!user.activate) {
    return next(new cusError("Please find us to re-activate your account", 401));
  }
  // Grand Access to Protected Route
  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new cusError("You do not have permission to perform this action", 403));
    }
    next();
  };
};
