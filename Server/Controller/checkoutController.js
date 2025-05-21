import db from "./dbController.js";
import { getOne, createOne, updateOne } from "./centralController.js";
import catchAsync from "../Utils/catchAsync.js";
import cusError from "../Utils/cusError.js";

/**
 * Checks if a card is expired.
 * @param {string} expiryDate - The expiry date in MM/YY format.
 * @returns {boolean} True if the card is expired or format is invalid, false otherwise.
 */
function isCardExpired(expiryDate) {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
    return true; // Invalid format is treated as potentially risky/expired
  }
  const [monthStr, yearStr] = expiryDate.split("/");
  const month = parseInt(monthStr, 10);
  const year = parseInt(`20${yearStr}`, 10); // Assumes 21st century

  // Create a date for the first day of the month *after* the expiry month
  const expiryMonthObject = new Date(year, month, 1); // month is 0-indexed, so 'month' is correct

  // Get current date, set to first day of current month for comparison
  const currentDateObject = new Date();
  currentDateObject.setDate(1);
  currentDateObject.setHours(0, 0, 0, 0);

  // If the expiry month is before the current month, it's expired.
  return expiryMonthObject <= currentDateObject;
}

const transactCheckout = db.transaction((data) => {
  const { userid, items, paymentDetailsResolved, guestOrderId } = data; // Added guestOrderId
  let totalAmount = 0;
  const productUpdates = [];

  // 1. Validate items, calculate total amount, prepare stock updates
  for (const item of items) {
    if (!item.productid || !item.quantity || item.quantity <= 0) {
      throw new cusError("Invalid item data in cart.", 400);
    }
    const product = getOne("product", "productid", item.productid);
    if (!product) {
      throw new cusError(`Product with ID ${item.productid} not found.`, 404);
    }
    if (product.quantity < item.quantity) {
      throw new cusError(
        `Not enough stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`,
        400
      );
    }
    totalAmount += product.price * item.quantity;
    productUpdates.push({
      productid: item.productid,
      newQuantity: product.quantity - item.quantity,
    });
    // orderProductEntries are not explicitly collected here anymore for logged-in users;
    // they are created directly in step 3.
  }

  if (totalAmount <= 0 && items.length > 0) {
    console.warn(`Order for ${userid ? `user ${userid}` : `guest ${guestOrderId}`} has a total of $0. Proceeding.`);
  } else if (totalAmount < 0) {
    throw new cusError("Order total cannot be negative.", 400);
  }

  const orderDate = new Date().toISOString().split("T")[0];
  let finalOrderId;

  if (userid) { // Logged-in user
    // 2. Create NEW 'paid' Order for logged-in user
    const newOrderData = {
      userid,
      orderDate,
      status: "paid",
      amount: totalAmount,
    };
    const newOrderResult = createOne("orders", newOrderData);
    finalOrderId = newOrderResult.lastInsertRowid;
    if (!finalOrderId) {
      throw new cusError("Failed to create order record for user.", 500);
    }

    // 3. Create Order_Product entries for the new 'paid' order
    for (const item of items) {
      createOne("order_product", {
        orderid: finalOrderId,
        productid: item.productid,
        quantity: item.quantity,
      });
    }
  } else if (guestOrderId) { // Guest user
    // 2. Update existing 'pending' guest order to 'paid'
    const guestOrder = db.prepare(
      "SELECT orderid, status FROM orders WHERE orderid = ? AND userid IS NULL AND status = 'pending'"
    ).get(guestOrderId);

    if (!guestOrder) {
      throw new cusError(`Pending guest order with ID ${guestOrderId} not found, already processed, or does not belong to a guest.`, 404);
    }

    // Update order status, amount, and date
    const updateResult = db.prepare(
      "UPDATE orders SET status = 'paid', amount = ?, orderDate = ? WHERE orderid = ?"
    ).run(totalAmount, orderDate, guestOrderId);

    if (updateResult.changes === 0) {
      throw new cusError(`Failed to update guest order ${guestOrderId}.`, 500);
    }
    finalOrderId = guestOrderId;
    // For guests, order_product entries are assumed to be correct in the pending order.
    // cartService is responsible for keeping them accurate.
  } else {
    throw new cusError("Checkout requires an authenticated user or a guest order ID.", 400);
  }

  // 4. Apply stock updates (common for both)
  for (const pu of productUpdates) {
    updateOne("product", pu.productid, { quantity: pu.newQuantity });
  }

  // 5. Create Order_Payment entry (common for both)
  // Assumes order_payment.userid can be NULL for guests.
  createOne("order_payment", {
    paymentDate: orderDate,
    amount: totalAmount,
    userid: userid, // Will be NULL for guests
    cardNumber: paymentDetailsResolved.cardNumberToStore,
    orderid: finalOrderId,
  });

  // 6. If new card and saveCard is true, save to payment_card (only for logged-in users)
  if (userid && paymentDetailsResolved.isNew && paymentDetailsResolved.saveCard) {
    const cleanCardNumber = paymentDetailsResolved.cardNumber.replace(/\s+/g, "");
    const existingUserCard = db
      .prepare("SELECT cardid FROM payment_card WHERE userid = ? AND cardNumber = ?")
      .get(userid, cleanCardNumber);

    if (!existingUserCard) {
      const cardToSave = {
        userid,
        cardholderName: paymentDetailsResolved.cardholderName,
        cardNumber: cleanCardNumber,
        expiryDate: paymentDetailsResolved.expiryDate,
      };
      createOne("payment_card", cardToSave);
    } else {
      console.log("Card number already saved for this user.");
    }
  }

  // 7. Clear user's *original* pending cart (for logged-in users only)
  if (userid) {
    const pendingUserCart = db
      .prepare("SELECT orderid FROM orders WHERE userid = ? AND status = 'pending' LIMIT 1")
      .get(userid);
    if (pendingUserCart) {
      console.log(`Clearing pending cart for user ${userid} with order ID ${pendingUserCart.orderid} after successful checkout.`);
      db.prepare("DELETE FROM order_product WHERE orderid = ?").run(pendingUserCart.orderid);
      db.prepare("DELETE FROM orders WHERE orderid = ?").run(pendingUserCart.orderid);
    }
  }
  // For guests, their pending cart (the guestOrderId order) was converted to 'paid'.

  return { orderid: finalOrderId, totalAmount };
});

export const processCheckout = catchAsync(async (req, res, next) => {
  const userid = req.user ? req.user.userid : null;
  // Retrieve guestOrderId from request body for guest checkouts
  const { items, paymentDetails, guestOrderId: clientGuestOrderId, address: shippingAddress } = req.body;

  if (!items || items.length === 0) {
    return next(new cusError("Your cart is empty. Cannot proceed to checkout.", 400));
  }
  if (!paymentDetails) {
    return next(new cusError("Payment details are required.", 400));
  }
  if (!shippingAddress) {
    return next(new cusError("Shipping address is required.", 400));
  }
  // Basic validation for shipping address object
  if (typeof shippingAddress !== 'object' || shippingAddress === null || !shippingAddress.recipient || !shippingAddress.address || !shippingAddress.phone) {
    return next(new cusError("Invalid shipping address format. Recipient, address, and phone are required.", 400));
  }


  let paymentDetailsResolved = {
    isNew: paymentDetails.isNew,
    saveCard: paymentDetails.saveCard || false,
    cardNumberToStore: null,
    cardholderName: paymentDetails.cardholderName,
    cardNumber: paymentDetails.cardNumber, // This will be cleaned if new
    expiryDate: paymentDetails.expiryDate,
    cvv: paymentDetails.cvv,
    // shippingAddressId: paymentDetails.shippingAddressId, // If you use address IDs
  };

  if (paymentDetails.isNew) {
    const { cardholderName, cardNumber, expiryDate, cvv } = paymentDetails;
    if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
      return next(
        new cusError(
          "Cardholder name, card number, expiry date, and CVV are required for new cards.",
          400
        )
      );
    }
    const cleanCardNumber = cardNumber.replace(/\s+/g, "");
    if (!/^\d{15,16}$/.test(cleanCardNumber)) {
      return next(new cusError("Invalid card number format. Must be 15 or 16 digits.", 400));
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      return next(new cusError("Invalid CVV format. Must be 3 or 4 digits.", 400));
    }
    if (isCardExpired(expiryDate)) {
      return next(new cusError("The provided card is expired or the expiry date is invalid.", 400));
    }

    paymentDetailsResolved.cardNumberToStore = cleanCardNumber;
    paymentDetailsResolved.cardNumber = cleanCardNumber; // Ensure it's cleaned for saving
  } else { // Using a saved card (only applicable if userid is present)
    if (!userid) {
        return next(new cusError("Cannot use a saved card for guest checkout.", 400));
    }
    const { cardid } = paymentDetails;
    if (!cardid) {
      return next(new cusError("Saved card ID is required when not using a new card.", 400));
    }
    const savedCard = getOne("payment_card", "cardid", cardid);
    if (!savedCard || savedCard.userid !== userid) {
      return next(
        new cusError("Saved card not found or you do not have permission to use it.", 404)
      );
    }
    if (isCardExpired(savedCard.expiryDate)) {
      return next(
        new cusError(
          `The selected saved card (ending in ${savedCard.cardNumber.slice(-4)}) is expired.`,
          400
        )
      );
    }
    paymentDetailsResolved.cardNumberToStore = savedCard.cardNumber;
    // For saved cards, cardholderName, expiryDate are already known from savedCard if needed
    paymentDetailsResolved.cardholderName = savedCard.cardholderName;
    paymentDetailsResolved.expiryDate = savedCard.expiryDate;
  }

  // Pass userid, items, resolved payment details, and guestOrderId to the transaction
  const result = await transactCheckout({
    userid,
    items,
    paymentDetailsResolved,
    guestOrderId: clientGuestOrderId, // Pass guestOrderId
    // shippingAddress, // If transactCheckout needs the address directly
  });

  // TODO: Save shippingAddress to a new table like 'order_shipping_address' linked to the orderid
  // For now, we assume it's for display or other processing not directly in this transaction.


  res.status(201).json({
    status: "success",
    message: "Checkout successful! Your order has been placed.",
    data: {
      orderid: result.orderid,
      totalAmount: result.totalAmount,
      products: items // Return the items that were part of this order
    }
  });
});
