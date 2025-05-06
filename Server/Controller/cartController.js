// Controller/cartController.js
import catchAsync from "../Utils/catchAsync.js";
import cusError from "../Utils/cusError.js";
import { db } from "../DB/database.js";

// ✅ Add product to cart
export const addToCart = catchAsync(async (req, res, next) => {
    const { userid, productid, quantity } = req.body;
    console.log("🛒 Add to Cart:", { userid, productid, quantity });
  
    if (!userid || !productid || !quantity) {
      return next(new cusError("Missing required fields", 400));
    }
  
    let orderid;
  
    // Step 1: Check for existing pending order
    const existingOrder = await new Promise((resolve, reject) => {
      db.get(
        `SELECT orderid FROM orders WHERE userid = ? AND status = 'pending' LIMIT 1`,
        [userid],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  
    orderid = existingOrder?.orderid;
  
    // Step 2: Create order if not found
    if (!orderid) {
      orderid = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO orders (userid, amount, status) VALUES (?, 0, 'pending')`,
          [userid],
          function (err) {
            if (err) return reject(err);
            resolve(this.lastID);
          }
        );
      });
    }
  
    // Step 3: Add/Update product in cart
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO order_product (orderid, productid, quantity)
         VALUES (?, ?, ?)
         ON CONFLICT(orderid, productid)
         DO UPDATE SET quantity = quantity + excluded.quantity`,
        [orderid, productid, quantity],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  
    // Step 4: Respond
    res.status(201).json({
      status: "success",
      message: "Product added to cart",
      data: { orderid },
    });
  });

// ✅ Update quantity in cart
export const updateCartQuantity = catchAsync(async (req, res, next) => {
  const { userid, productid, quantity } = req.body;
  if (!userid || !productid || quantity == null)
    return next(new cusError("Missing required fields", 400));

  const parsedQty = parseInt(quantity, 10);
  if (isNaN(parsedQty) || parsedQty < 0)
    return next(new cusError("Quantity must be 0 or more", 400));

  const query = `
    UPDATE order_product
    SET quantity = ?
    WHERE orderid = (SELECT orderid FROM orders WHERE userid = ? AND status = 'pending' LIMIT 1)
      AND productid = ?
  `;

  db.run(query, [parsedQty, userid, productid], function (err) {
    if (err) return next(new cusError("Failed to update quantity", 500));
    res.status(200).json({ status: "success", message: "Quantity updated" });
  });
});

// ✅ Remove item from cart
export const removeCartItem = catchAsync(async (req, res, next) => {
  const { userid, productid } = req.body;
  if (!userid || !productid)
    return next(new cusError("Missing required fields", 400));

  const query = `
    DELETE FROM order_product
    WHERE orderid = (SELECT orderid FROM orders WHERE userid = ? AND status = 'pending' LIMIT 1)
      AND productid = ?
  `;

  db.run(query, [userid, productid], function (err) {
    if (err) return next(new cusError("Failed to remove item", 500));
    res.status(200).json({ status: "success", message: "Item removed from cart" });
  });
});

// ✅ Fetch cart items for user
export const getCartItems = catchAsync(async (req, res, next) => {
    const { userid } = req.params;
  
    if (!userid) return next(new cusError("User ID required", 400));
  
    const query = `
      SELECT p.productid, p.name, p.price, p.image, op.quantity
      FROM order_product op
      JOIN orders o ON op.orderid = o.orderid
      JOIN product p ON op.productid = p.productid
      WHERE o.userid = ? AND o.status = 'pending'
    `;
  
    db.all(query, [userid], (err, rows) => {
      if (err) return next(new cusError("Failed to fetch cart", 500));
  
      res.status(200).json({
        status: "success",
        data: rows,
      });
    });
  });
  