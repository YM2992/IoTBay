import db from "../Controller/dbController.js";
import { getOne, createOne, updateOne } from "../Controller/centralController.js";
import cusError from "../Utils/cusError.js";

// 🛒 Add or update product in cart
export const addItemToCart = async (userid, productid, quantity) => {
  const today = new Date().toISOString().split("T")[0];

  // Ensure the user exists
  const user = getOne("user", "userid", userid);
  if (!user) throw new cusError("User not found", 404);

  // Check if the product exists and stock is enough
  const product = getOne("product", "productid", productid);
  if (!product) throw new cusError("Product not found", 404);
  if (product.quantity < quantity) throw new cusError("Not enough stock", 400);

  // Find or create a pending order for the user
  let pendingOrder = getOne("orders", "userid", userid);
  let orderid;

  if (!pendingOrder || pendingOrder.status !== "pending") {
    const newOrder = createOne("orders", {
      userid,
      amount: 0,
      status: "pending",
      orderDate: today,
    });
    orderid = newOrder.lastInsertRowid || newOrder.orderid;
  } else {
    orderid = pendingOrder.orderid;
  }

  // Try to insert or update the order_product row
  const existing = db
    .prepare(`SELECT quantity FROM order_product WHERE orderid = ? AND productid = ?`)
    .get(orderid, productid);

  if (existing) {
    db.prepare(`UPDATE order_product SET quantity = quantity + ? WHERE orderid = ? AND productid = ?`)
      .run(quantity, orderid, productid);
  } else {
    db.prepare(`INSERT INTO order_product (orderid, productid, quantity) VALUES (?, ?, ?)`)
      .run(orderid, productid, quantity);
  }

  // Update the order amount
  await updateOrderAmount(orderid);
  return orderid;
};



// 🔄 Update item quantity
export const updateItemQuantity = async (userid, productid, quantity) => {
  const parsedQty = parseInt(quantity, 10);
  if (isNaN(parsedQty) || parsedQty < 0)
    throw new cusError("Quantity must be 0 or more", 400);

  const order = db.prepare(
    `SELECT * FROM orders WHERE userid = ? AND status = 'pending' LIMIT 1`
  ).get(userid);
  
  if (!order || order.status !== "pending") throw new cusError("Cart not found", 404);

  const stmt = db.prepare(`UPDATE order_product SET quantity = ? WHERE orderid = ? AND productid = ?`);
  stmt.run(parsedQty, order.orderid, productid);

  await updateOrderAmount(order.orderid);
};



// ❌ Remove item from cart
export const removeItemFromCart = async (userid, productid) => {
  const pid = Number(productid);
  if (!pid || isNaN(pid)) throw new cusError("Invalid product ID", 400);

  // 1. Get the user's pending cart
  const cart = db
    .prepare(`SELECT orderid FROM orders WHERE userid = ? AND status = 'pending' LIMIT 1`)
    .get(userid);

  if (!cart) throw new cusError("No active cart found for this user", 404);
  const orderid = cart.orderid;

  // 2. Delete product from cart
  const result = db
    .prepare(`DELETE FROM order_product WHERE orderid = ? AND productid = ?`)
    .run(orderid, pid);

  if (result.changes === 0) {
    throw new cusError("Product not found in cart", 404);
  }

  // 3. Check if cart is now empty
  const count = db
    .prepare(`SELECT COUNT(*) as count FROM order_product WHERE orderid = ?`)
    .get(orderid);

  if (count.count === 0) {
    db.prepare(`DELETE FROM orders WHERE orderid = ?`).run(orderid);
    return;
  }

  // 4. Otherwise update cart amount
  await updateOrderAmount(orderid);
};




// 📦 Fetch items in cart
export const fetchUserCart = async (userid) => {
  const stmt = db.prepare(`
    SELECT p.productid, p.name, p.price, p.image, op.quantity
    FROM order_product op
    JOIN orders o ON op.orderid = o.orderid
    JOIN product p ON op.productid = p.productid
    WHERE o.userid = ? AND o.status = 'pending'
  `);
  return stmt.all(userid);
};


// ⚡ Buy Now
export const buyNowItem = async (userid, productid, quantity) => {
  const today = new Date().toISOString().split("T")[0];
  const paymentID = "BUY_" + Date.now();

  const product = getOne("product", "productid", productid);
  if (!product) throw new cusError("Product not found", 404);
  if (product.quantity < quantity) throw new cusError("Not enough stock", 400);

  const newOrder = createOne("orders", {
    userid,
    amount: product.price * quantity,
    status: "paid",
    orderDate: today,
    paymentID,
  });

  db.prepare(`INSERT INTO order_product (orderid, productid, quantity) VALUES (?, ?, ?)`)
    .run(newOrder.lastInsertRowid || newOrder.orderid, productid, quantity);

  return newOrder.lastInsertRowid || newOrder.orderid;
};


// 🔁 Helper: Recalculate and update order total
const updateOrderAmount = async (orderid) => {
  const items = db.prepare(`
    SELECT p.price, op.quantity
    FROM order_product op
    JOIN product p ON op.productid = p.productid
    WHERE op.orderid = ?
  `).all(orderid);

  const newTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  updateOne("orders", orderid, { amount: newTotal });
};
