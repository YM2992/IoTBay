import { hashPassword } from "./authController.js";
import catchAsync from "../Utils/catchAsync.js";
import { createOne, deleteOne, deleteOneByFilter, getAllWithFilter, getOne, updateOneWithFilter } from "./centralController.js";
import cusError from "../Utils/cusError.js";


/* Payment Card */
export const getPaymentCard = catchAsync(async (req, res, next) => {
  const { userid } = req.user;

  try {
    const paymentInfo = await getAllWithFilter("payment_card", { userid: userid });

    if (!paymentInfo) return next(new cusError("No payment card found", 404));

    res.status(200).json({
      status: "success",
      data: paymentInfo,
    });
  } catch (error) {
    return next(new cusError(error.message, 400));
  }
});

export const updatePaymentCard = catchAsync(async (req, res, next) => {
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

    const existingPaymentInfo = await getAllWithFilter("payment_card", {
      userid: userid,
      cardNumber: dataFilter.cardNumber
    });

    if (existingPaymentInfo && existingPaymentInfo.length > 0) {
      // Update existing payment information
      await updateOneWithFilter("payment_card", { cardNumber: cardNumber }, dataFilter);

      console.log("Payment card information updated successfully");

      res.status(200).json({
        status: "success",
        message: "Payment card information updated successfully",
      });
      return;
    }

    await createOne("payment_card", dataFilter);

    res.status(200).json({
      status: "success",
      message: "Payment card saved successfully",
    });
  } catch (error) {
    return next(new cusError(error.message, 400));
  }
});

export const removePaymentCard = catchAsync(async (req, res, next) => {
  const { userid } = req.user;
  const { cardNumber } = req.body;

  if (!cardNumber) return next(new cusError("Please provide all necessary information", 400));

  try {
    const dataFilter = {
      userid: userid,
      cardNumber: cardNumber
    };

    const result = await getAllWithFilter("payment_card", dataFilter);
    if (!result || result.length === 0) return next(new cusError("No payment card found", 404));

    await deleteOneByFilter("payment_card", dataFilter);

    res.status(200).json({
      status: "success",
      message: "Payment card removed successfully",
    });
  } catch (error) {
    return next(new cusError(error.message, 400));
  }
});


/* Payment History */
export const getPaymentHistory = catchAsync(async (req, res, next) => {
  const { userid } = req.user;

  try {
    const paymentHistory = await getAllWithFilter("order_payment", { userid: userid });

    if (!paymentHistory) return next(new cusError("No payment history found", 404));

    res.status(200).json({
      status: "success",
      data: paymentHistory,
    });

  } catch (error) {
    return next(new cusError(error.message, 400));
  }
});