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
  let { cardid, cardNumber, expiryDate, cardholderName, cvv } = req.body; // cardid is now potentially undefined
  console.log("Payment card data received:", req.body);

  if (!cardNumber || !expiryDate || !cardholderName || !cvv) {
    return next(new cusError("Please provide all necessary card information (cardNumber, expiryDate, cardholderName, cvv).", 400));
  }
  
  const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
  cardNumber = cardNumber.replace(/\s+/g, ""); // remove whitespace
  
  if (cardNumber.length !== 16) {
    return next(new cusError("Card number must be 16 digits.", 400));
  }
  if (isNaN(cardNumber) || isNaN(cvv)) {
    return next(new cusError("Card number and CVV must be numeric.", 400));
  }
  if (cvv.toString().length !== 3) {
    return next(new cusError("CVV must be 3 digits.", 400));
  }
  if (!expiryDateRegex.test(expiryDate)) {
    return next(new cusError("Expiry date must be in MM/YY format.", 400));
  }

  try {
    const cardDetailsPayload = {
      cardNumber,
      expiryDate,
      cardholderName,
      cvv,
    };

    if (cardid) { // If cardid is provided, attempt to update
      // Verify the card exists and belongs to the user
      const existingCard = await getOne("payment_card", "cardid", cardid);

      if (!existingCard) {
        return next(new cusError("Payment card with the provided ID not found.", 404));
      }
      if (existingCard.userid !== userid) {
        return next(new cusError("Access denied. You can only update your own payment cards.", 403));
      }

      // Update existing payment information
      const updateResult = await updateOneWithFilter(
        "payment_card",
        { cardid: cardid, userid: userid }, // Filter criteria
        cardDetailsPayload // Fields to update
      );

      if (updateResult.changes === 0) {
        // no changes made
        console.log("No changes made to the payment card, data might be identical or card not found for update despite initial check.");
      }
      
      console.log("Payment card information updated successfully for cardid:", cardid);
      res.status(200).json({
        status: "success",
        message: "Payment card information updated successfully.",
        data: { cardid, ...cardDetailsPayload }
      });

    } else { // create a new card
      const newCardData = {
        ...cardDetailsPayload,
        userid
      };
      const createdCard = await createOne("payment_card", newCardData);

      console.log("New payment card saved successfully");
      res.status(201).json({
        status: "success",
        message: "Payment card saved successfully.",
        data: createdCard
      });
    }
  } catch (error) {
    console.error("Error in updatePaymentCard:", error);
    // Ensure a generic message for unexpected errors, and pass status code if available
    return next(new cusError(error.message || "An internal server error occurred while processing the payment card.", error.statusCode || 500));
  }
});

export const removePaymentCard = catchAsync(async (req, res, next) => {
  const { userid } = req.user;
  const { cardid, cardNumber } = req.body;

  if (!cardid || !cardNumber) {
    return next(new cusError("Please provide all necessary information (card ID and card number).", 400));
  }

  try {
    // Verify the card exists, belongs to the user, and matches cardNumber
    const paymentCardEntry = await getOne("payment_card", "cardid", cardid);

    if (!paymentCardEntry) {
      return next(new cusError("Payment card not found.", 404));
    }
    if (paymentCardEntry.userid !== userid) {
      return next(new cusError("Access denied. You can only delete your own payment cards.", 403));
    }
    if (paymentCardEntry.cardNumber !== cardNumber) {
        return next(new cusError("Card number does not match the provided card ID.", 400));
    }

    // Delete associated records in order_payment table first to satisfy foreign key constraints
    // This assumes cardid in order_payment references payment_card.cardid
    await deleteOneByFilter("order_payment", { cardid: cardid });
    console.log(`Associated payment history for cardid ${cardid} removed from order_payment.`);

    // Now, delete the payment card itself
    const dataFilter = {
      userid,
      cardid,
      cardNumber
    };

    const result = await deleteOneByFilter("payment_card", dataFilter);

    if (result.changes === 0) {
      // This might happen if the card was already deleted or filter criteria didn't match perfectly after the initial check.
      return next(new cusError("Failed to remove payment card. Card may have already been deleted or details mismatch.", 404));
    }

    console.log("Payment card removed successfully");

    res.status(200).json({
      status: "success",
      message: "Payment card removed successfully",
    });
  } catch (error) {
    console.error("Error in removePaymentCard:", error);
    return next(new cusError(error.message || "An internal server error occurred while removing the payment card.", error.statusCode || 500));
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