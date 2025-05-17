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
  const [monthStr, yearStr] = expiryDate.split('/');
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

const transactCheckout = db.transaction(async (data) => {
  const { userid, items, paymentDetailsResolved } = data;
  let totalAmount = 0;
  const productUpdates = [];
  const orderProductEntries = [];

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
      throw new cusError(`Not enough stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`, 400);
    }
    totalAmount += product.price * item.quantity;
    productUpdates.push({ productid: item.productid, newQuantity: product.quantity - item.quantity });
    orderProductEntries.push({
        productid: item.productid,
        quantity: item.quantity,
        price: product.price // Price at the time of purchase
    });
  }

  if (totalAmount <= 0 && items.length > 0) { // Allow $0 orders if items exist (e.g. fully discounted) but not if cart is empty leading to $0
    console.warn(`Order for user ${userid} has a total of $0. Proceeding.`);
  } else if (totalAmount < 0) {
     throw new cusError("Order total cannot be negative.", 400);
  }


  // 2. Create Order
  const orderDate = new Date().toISOString().split("T")[0];
  const newOrderData = {
    userid,
    orderDate,
    status: "paid",
    amount: totalAmount,
    // shippingAddressId: paymentDetailsResolved.shippingAddressId // Add if you handle shipping addresses
  };
  const newOrderResult = createOne("orders", newOrderData);
  const orderid = newOrderResult.lastInsertRowid;
  if (!orderid) {
    throw new cusError("Failed to create order record.", 500);
  }

  // 3. Create Order_Product entries
  for (const entry of orderProductEntries) {
    createOne("order_product", {
      orderid,
      productid: entry.productid,
      quantity: entry.quantity
    });
  }

  // 4. Apply stock updates
  for (const pu of productUpdates) {
    updateOne("product", pu.productid, { quantity: pu.newQuantity });
  }

  // 5. Create Order_Payment entry
  createOne("order_payment", {
    paymentDate: orderDate,
    amount: totalAmount,
    userid,
    cardNumber: paymentDetailsResolved.cardNumberToStore, // Actual card number used for payment
    orderid
  });

  // 6. If new card and saveCard is true, save to payment_card (without CVV if schema doesn't support it)
  if (paymentDetailsResolved.isNew && paymentDetailsResolved.saveCard) {
    const cleanCardNumber = paymentDetailsResolved.cardNumber.replace(/\s+/g, "");
    const existingUserCard = db.prepare(
      "SELECT cardid FROM payment_card WHERE userid = ? AND cardNumber = ?"
    ).get(userid, cleanCardNumber);

    if (!existingUserCard) {
      const cardToSave = {
        userid,
        cardholderName: paymentDetailsResolved.cardholderName,
        cardNumber: cleanCardNumber,
        expiryDate: paymentDetailsResolved.expiryDate,
        // cvv: paymentDetailsResolved.cvv, // Only include if your payment_card table schema has CVV
                                          // And you accept the security risks.
      };
      createOne("payment_card", cardToSave);
    } else {
      console.log("Card number already saved for this user.");
    }
  }

  // 7. Clear user's pending cart (which is an order with status 'pending')
  const pendingCart = db.prepare("SELECT orderid FROM orders WHERE userid = ? AND status = 'pending' LIMIT 1").get(userid);
  if (pendingCart) {
    db.prepare("DELETE FROM order_product WHERE orderid = ?").run(pendingCart.orderid);
    db.prepare("DELETE FROM orders WHERE orderid = ?").run(pendingCart.orderid);
  }

  return { orderid, totalAmount };
});

export const processCheckout = catchAsync(async (req, res, next) => {
  const { userid } = req.user;
  const { items, paymentDetails } = req.body;

  if (!items || items.length === 0) {
    return next(new cusError("Your cart is empty. Cannot proceed to checkout.", 400));
  }
  if (!paymentDetails) {
    return next(new cusError("Payment details are required.", 400));
  }

  let paymentDetailsResolved = {
    isNew: paymentDetails.isNew,
    saveCard: paymentDetails.saveCard || false,
    cardNumberToStore: null, // This will be the full card number for order_payment
    cardholderName: paymentDetails.cardholderName,
    cardNumber: paymentDetails.cardNumber,
    expiryDate: paymentDetails.expiryDate,
    cvv: paymentDetails.cvv,
  };

  if (paymentDetails.isNew) {
    const { cardholderName, cardNumber, expiryDate, cvv } = paymentDetails;
    if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
      return next(new cusError("Cardholder name, card number, expiry date, and CVV are required for new cards.", 400));
    }
    const cleanCardNumber = cardNumber.replace(/\s+/g, "");
    if (!/^\d{15,16}$/.test(cleanCardNumber)) { // Common card lengths
        return next(new cusError("Invalid card number format. Must be 15 or 16 digits.", 400));
    }
    if (!/^\d{3,4}$/.test(cvv)) { // Common CVV lengths
        return next(new cusError("Invalid CVV format. Must be 3 or 4 digits.", 400));
    }
    if (isCardExpired(expiryDate)) {
        return next(new cusError("The provided card is expired or the expiry date is invalid.", 400));
    }

    paymentDetailsResolved.cardNumberToStore = cleanCardNumber;
    paymentDetailsResolved.cardNumber = cleanCardNumber; // Ensure it's cleaned for saving
  } else { // Using a saved card
    const { cardid } = paymentDetails;
    if (!cardid) {
      return next(new cusError("Saved card ID is required when not using a new card.", 400));
    }
    const savedCard = getOne("payment_card", "cardid", cardid);
    if (!savedCard || savedCard.userid !== userid) {
      return next(new cusError("Saved card not found or you do not have permission to use it.", 404));
    }
    if (isCardExpired(savedCard.expiryDate)) {
      return next(new cusError(`The selected saved card (ending in ${savedCard.cardNumber.slice(-4)}) is expired.`, 400));
    }
    paymentDetailsResolved.cardNumberToStore = savedCard.cardNumber; // Full card number from DB for payment record
    // For saved cards, we don't need to re-assign other details to paymentDetailsResolved unless they are used for saving logic
  }

  const result = await transactCheckout({ userid, items, paymentDetailsResolved });

  res.status(201).json({
    status: "success",
    message: "Checkout successful! Your order has been placed.",
    data: {
      orderid: result.orderid,
      totalAmount: result.totalAmount,
    },
  });
});