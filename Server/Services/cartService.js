import { db } from "../DB/database.js";
import { createOne, getAll, updateOne, getOne } from "../Controller/centralController.js";
import cusError from "../Utils/cusError.js";

// Add or update product in cart
export const addItemToCart = async (userid, productid, quantity) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      const orderRow = getOne("orders", "userid", userid);
      const pendingOrder = orderRow && orderRow.status === "pending" ? orderRow : null;

      const proceed = (finalOrderId) => {
        const product = getOne("product", "productid", productid);
        if (!product) {
          db.run("ROLLBACK");
          return reject(new cusError("Product not found", 404));
        }

        if (product.quantity < quantity) {
          db.run("ROLLBACK");
          return reject(new cusError("Not enough stock available", 400));
        }

        db.run(
          `INSERT INTO order_product (orderid, productid, quantity)
           VALUES (?, ?, ?)
           ON CONFLICT(orderid, productid)
           DO UPDATE SET quantity = quantity + excluded.quantity`,
          [finalOrderId, productid, quantity],
          function (err) {
            if (err) {
              db.run("ROLLBACK");
              return reject(new cusError(err.message, 500));
            }

            db.run("COMMIT", (err) => {
              if (err) return reject(new cusError(err.message, 500));
              resolve(finalOrderId);
            });
          }
        );
      };

      if (!pendingOrder) {
        const newOrder = createOne("orders", {
          userid,
          amount: 0,
          status: "pending",
          orderDate: new Date().toISOString().split("T")[0],
        });
        proceed(newOrder.lastInsertRowid);
      } else {
        proceed(pendingOrder.orderid);
      }
    });
  });
};

// Remove Item from cart
export const removeItemFromCart = async (userid, productid) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get(
        `SELECT orderid FROM orders WHERE userid = ? AND status = 'pending' LIMIT 1`,
        [userid],
        (err, row) => {
          if (err || !row) return reject(new cusError("Cart not found", 404));

          const orderid = row.orderid;

          db.run(
            `DELETE FROM order_product WHERE orderid = ? AND productid = ?`,
            [orderid, productid],
            function (err) {
              if (err) return reject(new cusError(err.message, 500));

              db.get(
                `SELECT COUNT(*) as count FROM order_product WHERE orderid = ?`,
                [orderid],
                (err, result) => {
                  if (err) return reject(new cusError(err.message, 500));

                  if (result.count === 0) {
                    db.run(`DELETE FROM orders WHERE orderid = ?`, [orderid], (err) => {
                      if (err) return reject(new cusError(err.message, 500));
                      resolve();
                    });
                  } else {
                    resolve();
                  }
                }
              );
            }
          );
        }
      );
    });
  });
};

// Update item quantity
export const updateItemQuantity = async (userid, productid, quantity) => {
  return new Promise((resolve, reject) => {
    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty < 0)
      return reject(new cusError("Quantity must be 0 or more", 400));

    const query = `
      UPDATE order_product
      SET quantity = ?
      WHERE orderid = (
        SELECT orderid FROM orders
        WHERE userid = ? AND status = 'pending' LIMIT 1
      )
      AND productid = ?
    `;

    db.run(query, [parsedQty, userid, productid], function (err) {
      if (err) return reject(new cusError(err.message, 500));
      resolve();
    });
  });
};

// Fetch cart items
export const fetchUserCart = async (userid) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT p.productid, p.name, p.price, p.image, op.quantity
      FROM order_product op
      JOIN orders o ON op.orderid = o.orderid
      JOIN product p ON op.productid = p.productid
      WHERE o.userid = ? AND o.status = 'pending'
    `;

    db.all(query, [userid], (err, rows) => {
      if (err) return reject(new cusError(err.message, 500));
      resolve(rows);
    });
  });
};

// Buy Now Item
export const buyNowItem = async (userid, productid, quantity) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      try {
        const product = getOne("product", "productid", productid);
        if (!product) return reject(new cusError("Product not found", 404));
        if (product.quantity < quantity) return reject(new cusError("Not enough stock", 400));

        const paymentID = "BUY_NOW_" + Date.now(); // or use a UUID
        const order = createOne("orders", {
          userid,
          amount: product.price * quantity,
          status: "paid",
          orderDate: new Date().toISOString().split("T")[0],
          paymentID, // ✅ ADD THIS
        });

        db.run(
          `INSERT INTO order_product (orderid, productid, quantity) VALUES (?, ?, ?)`,
          [order.lastInsertRowid, productid, quantity],
          (err) => {
            if (err) return reject(new cusError(err.message, 500));
            resolve(order.lastInsertRowid);
          }
        );
      } catch (err) {
        console.error("❌ buyNowItem error:", err);
        reject(new cusError("Buy now failed", 500));
      }
    });
  });
};
