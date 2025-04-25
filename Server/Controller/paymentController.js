import { createOne } from "./centralController.js";
import { hashPassword } from "./authController.js";
import catchAsync from "../Utils/catchAsync.js";
import { getOne, getAll } from "./centralController.js";
import cusError from "../Utils/cusError.js";

export const getPaymentDetails = catchAsync(async (req, res, next) => {
  const currentUser = req.user;
  delete currentUser.password;
  delete currentUser.userid;

  res.status(200).json({
    status: "success",
    data: currentUser,
  });
});

export const createPaymentDetails = catchAsync(async (req, res, next) => {
  const { cardNumber, cardholderName, expiryDate, cvv } = req.body;

  if (!cardNumber || !cardholderName || !expiryDate || !cvv)
    return next(new cusError("Please provide all necessary information", 400));

  const dataFilter = {
    cardNumber: await hashPassword(cardNumber),
    cardholderName,
    expiryDate,
    cvv: await hashPassword(cvv),
  };

  try {
    createOne("payment", dataFilter);
    delete dataFilter.cardNumber, delete dataFilter.cvv;

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
