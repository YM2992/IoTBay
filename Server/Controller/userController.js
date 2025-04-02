import { createOne } from "./centralController.js";
import { hashPassword } from "./authController.js";
import catchAsync from "../Utils/catchAsync.js";
import { getOne, getAll } from "./centralController.js";
import cusError from "../Utils/cusError.js";

export const findUserByEmail = (email) => {
  return getOne("user", "email", email);
};

export const userExists = catchAsync(async (req, res, next) => {
  const current = findUserByEmail(req.body.email);
  const exist = current ? true : false;

  res.status(200).json({
    status: "success",
    exist,
  });
});

export const findUserById = (id) => {
  return getOne("user", "userid", id);
};

export const getMe = catchAsync(async (req, res, next) => {
  const currentUser = req.user;
  delete currentUser.password;
  delete currentUser.userid;

  res.status(200).json({
    status: "success",
    data: currentUser,
  });
});

export const getAllUser = catchAsync(async (req, res, next) => {
  const users = getAll("user");

  res.status(200).json({
    status: "success",
    data: users,
  });
});

export const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone)
    return next(new cusError("Please provide all needed information", 400));

  const dataFilter = {
    name,
    email,
    password: await hashPassword(password),
    role: "customer",
    phone: phone,
  };

  try {
    createOne("user", dataFilter);
    delete dataFilter.password;

    res.status(200).json({
      status: "success",
      data: dataFilter,
    });
  } catch (error) {
    let message = `${error.code} ${error.message}`;
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") message = `Duplicate Field: ${error.message}`;

    return next(new cusError(message, 400));
  }
});
