import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { promisify } from "util";

import catchAsync from "../Utils/catchAsync.js";
import cusError from "../Utils/cusError.js";
import { findUserByEmail, findUserById } from "./userController.js";

// Password Hashing
export const hashPassword = async function (password) {
  return await bcrypt.hash(password, 12);
};

// Password Checker
const correctPassword = async function (typedInPassword, dbSavedPassword) {
  if (!dbSavedPassword || !typedInPassword) return null;
  return await bcrypt.compare(typedInPassword, dbSavedPassword);
};

//  Sign JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Send JWT in Cookie + Body
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

// Login Controller
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new cusError("Please provide email and password", 400));
  }

  const user = await findUserByEmail(email); 

  if (!user) {
    return next(new cusError("Incorrect email or password", 401));
  }

  const correct = await correctPassword(password, user.password);

  if (!correct) {
    return next(new cusError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
});

// Protect Middleware
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new cusError("You are not logged in!", 401));
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET || "secret" // update as needed
    );

    // Log decoded for debug
    console.log("Decoded JWT:", decoded);

    // Attach to request
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    console.log("❌ Invalid token:", err.message);
    next(new cusError("Invalid token", 401));
  }
};

// Role-Based Restriction
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new cusError("You do not have permission to perform this action", 403));
    }
    next();
  };
};
