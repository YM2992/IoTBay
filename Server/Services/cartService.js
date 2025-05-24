import db from "../Controller/dbController.js";
import { getOne, createOne, updateOne } from "../Controller/centralController.js";
import cusError from "../Utils/cusError.js";

export const addItemToCart = async (userid, productid, quantity) => {
  const today = new Date().toISOString().split("T")[0];

  // 1. If user is logged in, confirm they exist
  if (userid) {
    const user = getOne("user", "userid", userid);
    if (!user) throw new cusError("User not found", 404);
  }

  console.log(userid);

  // 2. Check if the product exists and stock is enough
  const product = getOne("product", "productid", productid);
  if (!product) throw new cusError("Product not found", 404);
  if (product.quantity < quantity) throw new cusError("Not enough stock", 400);

  // 3. Find existing pending order
  let pendingOrder;
  if (userid) {
    pendingOrder = db
      .prepare(`SELECT * FROM orders WHERE userid = ? AND status = 'pending' LIMIT 1`)
      .get(userid);
  } else {
    // For guests: get the latest guest order with no user
    pendingOrder = db
      .prepare(`SELECT * FROM orders WHERE userid IS NULL AND status = 'pending' LIMIT 1`)
      .get();
  }

  let orderid;

  // 4. Create new order if not found
  if (!pendingOrder) {
    const orderData = {
      amount: 0,
      status: "pending",
      orderDate: today,
    };

    if (userid) orderData.userid = userid;

    const newOrder = createOne("orders", orderData);
    orderid = newOrder.lastInsertRowid || newOrder.orderid;
  } else {
    orderid = pendingOrder.orderid;
  }

  // 5. Insert or update item in order_product
  const existing = db
    .prepare(`SELECT quantity FROM order_product WHERE orderid = ? AND productid = ?`)
    .get(orderid, productid);

  if (existing) {
    db.prepare(
      `
      UPDATE order_product 
      SET quantity = quantity + ? 
      WHERE orderid = ? AND productid = ?
    `
    ).run(quantity, orderid, productid);
  } else {
    db.prepare(
      `
      INSERT INTO order_product (orderid, productid, quantity) 
      VALUES (?, ?, ?)
    `
    ).run(orderid, productid, quantity);
  }

  // 6. Recalculate total amount
  await updateOrderAmount(orderid);

  return orderid;
};

// Update item quantity
export const updateItemQuantity = async (userid, productid, quantity, orderid = null) => {
  const parsedQty = parseInt(quantity, 10);
  if (isNaN(parsedQty) || parsedQty < 0) throw new cusError("Quantity must be 0 or more", 400);

  let order;
  if (userid) {
    order = db
      .prepare(`SELECT * FROM orders WHERE userid = ? AND status = 'pending' LIMIT 1`)
      .get(userid);
  } else {
    order = db
      .prepare(
        `SELECT * FROM orders WHERE orderid = ? AND userid IS NULL AND status = 'pending' LIMIT 1`
      )
      .get(orderid);
  }

  if (!order) throw new cusError("Cart not found", 404);

  db.prepare(`UPDATE order_product SET quantity = ? WHERE orderid = ? AND productid = ?`).run(
    parsedQty,
    order.orderid,
    productid
  );

  await updateOrderAmount(order.orderid);
};

// Remove item from cart
export const removeItemFromCart = async (userid, productid, orderid = null) => {
  const pid = Number(productid);
  if (!pid || isNaN(pid)) throw new cusError("Invalid product ID", 400);

  let cart;
  if (userid) {
    cart = db
      .prepare(`SELECT orderid FROM orders WHERE userid = ? AND status = 'pending' LIMIT 1`)
      .get(userid);
  } else {
    cart = db
      .prepare(
        `SELECT orderid FROM orders WHERE orderid = ? AND userid IS NULL AND status = 'pending' LIMIT 1`
      )
      .get(orderid);
  }

  if (!cart) throw new cusError("No active cart found", 404);

  const result = db
    .prepare(`DELETE FROM order_product WHERE orderid = ? AND productid = ?`)
    .run(cart.orderid, pid);

  if (result.changes === 0) throw new cusError("Product not found in cart", 404);

  const count = db
    .prepare(`SELECT COUNT(*) as count FROM order_product WHERE orderid = ?`)
    .get(cart.orderid);

  if (count.count === 0) {
    db.prepare(`DELETE FROM orders WHERE orderid = ?`).run(cart.orderid);
    return;
  }

  await updateOrderAmount(cart.orderid);
};

//  Fetch items in cart
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

//  Fetch items in cart (guest)
export const fetchGuestCart = async (orderid) => {
  const stmt = db.prepare(`
    SELECT p.productid, p.name, p.price, p.image, op.quantity
    FROM order_product op
    JOIN product p ON op.productid = p.productid
    WHERE op.orderid = ?
  `);
  return stmt.all(orderid);
};

//  Helper: Recalculate and update order total
const updateOrderAmount = async (orderid) => {
  const items = db
    .prepare(
      `
    SELECT p.price, op.quantity
    FROM order_product op
    JOIN product p ON op.productid = p.productid
    WHERE op.orderid = ?
  `
    )
    .all(orderid);

  const newTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  updateOne("orders", orderid, { amount: newTotal });
};
