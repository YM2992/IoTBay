import { createOne } from "./centralController.js";
import { hashPassword } from "./authController.js";
import catchAsync from "../Utils/catchAsync.js";
import { getOne } from "./centralController.js";
import cusError from "../Utils/cusError.js";

export const findUserByEmail = (email) => {
  return getOne("user", "email", email);
};

export const findUserById = (id) => {
  return getOne("user", "userid", id);
};

export const getAllUser = () => {
  return getAll("user");
};

export const createUser = catchAsync(async (req, res, next) => {
  if (!req.body.agreement) return;

  const dataFilter = {
    name: req.body.name,
    email: req.body.email,
    password: await hashPassword(req.body.password),
    role: "customer",
    phone: req.body.phone,
  };

  try {
    createOne("user", dataFilter);
    delete dataFilter.password;

    res.status(200).json({
      status: "success",
      data: dataFilter,
    });
  } catch (error) {
    const message = `${error.code} ${error.message}`;
    return next(new cusError(message, 400));
  }
});
