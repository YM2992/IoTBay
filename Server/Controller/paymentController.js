import { createOne } from "./centralController.js";
import { hashPassword } from "./authController.js";
import catchAsync from "../Utils/catchAsync.js";
import { getOne, getAll } from "./centralController.js";
import cusError from "../Utils/cusError.js";

export const getPaymentDetails = catchAsync(async (req, res, next) => {
  const { userId } = req.user;

  if (!userId) return next(new cusError("Please provide all necessary information", 400));

  try {
    const paymentInfo = await getAll("payment", { userId });

    if (!paymentInfo) return next(new cusError("No payment information found", 404));

    res.status(200).json({
      status: "success",
      data: paymentInfo,
    });
  } catch (error) {
    return next(new cusError(error.message, 400));
  }
});

export const updatePaymentDetails = catchAsync(async (req, res, next) => {
  const { cardNumber, expiryDate, cardholderName, cvv } = req.body;

  if (!cardNumber || !expiryDate || !cardholderName || !cvv) return next(new cusError("Please provide all necessary information", 400));

  try {
    const dataFilter = {
      cardNumber: await hashPassword(cardNumber),
      expiryDate,
      cardholderName,
      cvv,
    };

    const existingPaymentInfo = await getOne("payment", { cardNumber: dataFilter.cardNumber });

    if (existingPaymentInfo) return next(new cusError("Payment information already exists", 409));

    await createOne("payment", dataFilter);

    res.status(201).json({
      status: "success",
      message: "Payment information saved successfully",
    });
  } catch (error) {
    return next(new cusError(error.message, 400));
  }
});

export const removePaymentDetails = catchAsync(async (req, res, next) => {
  const { cardNumber } = req.body;

  if (!cardNumber) return next(new cusError("Please provide all necessary information", 400));

  try {
    const dataFilter = {
      cardNumber: await hashPassword(cardNumber),
    };

    const result = await getOne("payment", dataFilter);

    if (!result) return next(new cusError("No payment information found", 404));

    delete dataFilter.cardNumber;

    res.status(200).json({
      status: "success",
      message: "Payment information removed successfully",
    });
  } catch (error) {
    return next(new cusError(error.message, 400));
  }
});