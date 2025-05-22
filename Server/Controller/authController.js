import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import catchAsync from "../Utils/catchAsync.js";
import cusError from "../Utils/cusError.js";
import { findUserByEmail, findUserById } from "./userController.js";
import { createOne } from "./centralController.js";
import db from "../Controller/dbController.js";


export const hashPassword = async function (password) {
  return await bcrypt.hash(password, 12);
};

const correctPassword = async function (typedInPassword, dbSavedPassword) {
  if (!dbSavedPassword || !typedInPassword) return null;
  return await bcrypt.compare(typedInPassword, dbSavedPassword);
};

// sign new json web token
const signToken = (user) => {
  return jwt.sign({ id: user.userid, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// send token to user
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user);

  user.password = undefined;

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
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
    return next(new cusError("Please provide email and password", 400));
  }

  // Check if user exists && password is correct
  const user = findUserByEmail(email);
  const correct = await correctPassword(password, user?.password);

  if (!correct || !user) {
    return next(new cusError("Incorrect email or password", 401));
  }

  if (!user.activate) {
    return next(
      new cusError("Please contact support to re-activate your account", 401)
    );
  }
  if(!user.activate){
    return next(new cusError("please find us to re-activate your account",401));
  }

  if (!user.activate) {
    return next(new cusError("Please find us to re-activate your account", 401));
  }

  // Check if user is already logged in and update the previous access log to be logout
  const previousAccessLog = db.prepare(`
    SELECT logid FROM access_logs
    WHERE userid = ? AND logout_time IS NULL
    ORDER BY login_time DESC
    LIMIT 1
  `).get(user.userid);

  if (previousAccessLog) {
    const updateResult = db.prepare(`
      UPDATE access_logs
      SET logout_time = ?
      WHERE logid = ?
    `).run(new Date().toISOString(), previousAccessLog.logid);

    if (updateResult.changes === 0) {
      console.error("No access log found for this user to update.");
      return next(new cusError("No access log found for this user", 404));
    } else {
      console.log("Previous access log updated successfully.");
    }
  }

  // Use createOne to insert into access_logs
  try {
    await createOne("access_logs", {
      userid: user.userid,
      login_time: new Date().toISOString()
    });
  } catch (err) {
    console.error("Failed to insert access log:", err.message);
    return next(new cusError("Internal DB error during login", 500));
  }

  // If all correct, send token back to user
  createSendToken(user, 200, res);
});

export const logout = catchAsync(async (req, res, next) => {
  if (req.user && req.user.userid) {
    try {
      const updateResult = db.prepare(`
        UPDATE access_logs
        SET logout_time = ?
        WHERE logid = (
          SELECT logid FROM access_logs
          WHERE userid = ? AND logout_time IS NULL
          ORDER BY login_time DESC
          LIMIT 1
        )
      `).run(new Date().toISOString(), req.user.userid);

      if (updateResult.changes === 0) {
        console.error("No access log found for this user to update.");
        return next(new cusError("No access log found for this user", 404));
      } else {
        console.log("Access log updated successfully on logout.");
      }
    } catch (err) {
      console.error("Failed to update access_log on logout:", err.message);
      return next(new cusError("Internal DB error during logout", 500));
    }
  }

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

// OLD protect > New protect 
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
  if (!currentUser.activate) {
    return next(new cusError("please find us to re-activate your account", 401));
  }
 
  if (!currentUser.activate) {
    return next(new cusError("Please find us to re-activate your account", 401));
  }
  // Grand Access to Protected Route
  req.user = currentUser;
  // console.log("Protect: ", currentUser);
  next();
});


// Error (propbably cause of something else)
export const restrictTo = (...roles) => {  
  return (req, res, next) => {
  /* sorry it was disruptting other stuff too  
  if (token) {
      console.log("Token:", token);
    } else {
      console.log("Token is null or undefined");
    } // token testing delete above
     */

    if (!roles.includes(req.user.role)) {
      return next(
        new cusError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};