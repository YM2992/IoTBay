import { hashPassword } from "./authController.js";
import catchAsync from "../Utils/catchAsync.js";
import { createOne, getAllWithFilter, updateOneWithFilter } from "./centralController.js";
import cusError from "../Utils/cusError.js";

export const getPaymentDetails = catchAsync(async (req, res, next) => {
  const { userid } = req.user;

  try {
    const paymentInfo = await getAllWithFilter("payment", { userid: userid });

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
  const { userid } = req.user;
  let { cardNumber, expiryDate, cardholderName, cvv } = req.body;

  // input data validity checks
  if (!cardNumber || !expiryDate || !cardholderName || !cvv) return next(new cusError("Please provide all necessary information", 400));
  
  const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
  cardNumber = cardNumber.replace(/\s+/g, ""); // remove whitespace
  
  if (cardNumber.length !== 16) return next(new cusError("Card number must be 16 digits", 400));
  if (isNaN(cardNumber) || isNaN(cvv)) return next(new cusError("Card number and CVV must be numeric", 400));
  if (cvv.toString().length !== 3) return next(new cusError("CVV must be 3 digits", 400));
  if (!expiryDateRegex.test(expiryDate)) return next(new cusError("Expiry date must be in MM/YY format", 400));
  if (expiryDate[0] > 12) return next(new cusError("Expiry month must be between 01 and 12", 400));

  try {
    const dataFilter = {
      userid: userid,
      cardNumber: cardNumber,
      expiryDate,
      cardholderName,
      cvv,
    };

    const existingPaymentInfo = await getAllWithFilter("payment", {
      userid: userid,
      cardNumber: dataFilter.cardNumber
    });

    if (existingPaymentInfo && existingPaymentInfo.length > 0) {
      console.log("Payment information already exists for this user");
      // Update existing payment information
      await updateOneWithFilter("payment", { userid: userid }, dataFilter);

      console.log("Payment information updated successfully");

      res.status(200).json({
        status: "success",
        message: "Payment information updated successfully",
      });
      return;
    }

    await createOne("payment", dataFilter);

    res.status(200).json({
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