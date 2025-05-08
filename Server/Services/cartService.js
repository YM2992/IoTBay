import { db } from "../DB/database.js";

// Add or update product in cart
export const addItemToCart = async (userid, productid, quantity) => {
    if (!userid || !productid || !quantity) {
      throw new Error("Missing required fields");
    }
  
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");
  
        db.get(
          `SELECT orderid FROM orders WHERE userid = ? AND status = 'pending' LIMIT 1`,
          [userid],
          (err, row) => {
            if (err) {
              db.run("ROLLBACK");
              return reject(err);
            }
  
            const orderid = row?.orderid;
  
            const proceed = (finalOrderId) => {
              db.get(`SELECT quantity FROM product WHERE productid = ?`, [productid], (err, product) => {
                if (err || !product) {
                  db.run("ROLLBACK");
                  return reject(new Error("Product not found"));
                }
  
                if (product.quantity < quantity) {
                  db.run("ROLLBACK");
                  return reject(new Error("Not enough stock available"));
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
                      return reject(err);
                    }
  
                    db.run("COMMIT", (err) => {
                      if (err) return reject(err);
                      resolve(finalOrderId);
                    });
                  }
                );
              });
            };
  
            if (!orderid) {
              db.run(
                `INSERT INTO orders (userid, amount, status, orderDate)
                 VALUES (?, 0, 'pending', date('now'))`,
                [userid],
                function (err) {
                  if (err) {
                    db.run("ROLLBACK");
                    return reject(err);
                  }
                  proceed(this.lastID);
                }
              );
            } else {
              proceed(orderid);
            }
          }
        );
      });
    });
  };
  
// Update quantity
export async function updateItemQuantity(userid, productid, quantity) {
  if (!userid || !productid || quantity == null) {
    throw new Error("Missing required fields");
  }

  const parsedQty = parseInt(quantity, 10);
  if (isNaN(parsedQty) || parsedQty < 0) {
    throw new Error("Quantity must be 0 or more");
  }

  const query = `
    UPDATE order_product
    SET quantity = ?
    WHERE orderid = (
      SELECT orderid FROM orders
      WHERE userid = ? AND status = 'pending' LIMIT 1
    )
    AND productid = ?
  `;

  return new Promise((resolve, reject) => {
    db.run(query, [parsedQty, userid, productid], function (err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

// Remove item
export async function removeItemFromCart(userid, productid) {
  if (!userid || !productid) {
    throw new Error("Missing required fields");
  }

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.get(
        `SELECT orderid FROM orders WHERE userid = ? AND status = 'pending' LIMIT 1`,
        [userid],
        (err, row) => {
          if (err || !row) return reject(new Error("Cart not found"));

          const orderid = row.orderid;

          db.run(
            `DELETE FROM order_product WHERE orderid = ? AND productid = ?`,
            [orderid, productid],
            function (err) {
              if (err) return reject(err);

              db.get(
                `SELECT COUNT(*) as count FROM order_product WHERE orderid = ?`,
                [orderid],
                (err, result) => {
                  if (err) return reject(err);

                  if (result.count === 0) {
                    db.run(
                      `DELETE FROM orders WHERE orderid = ?`,
                      [orderid],
                      (err) => {
                        if (err) return reject(err);
                        resolve();
                      }
                    );
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
}

// Fetch cart items
export async function fetchUserCart(userid) {
  if (!userid) {
    throw new Error("User ID required");
  }

  const query = `
    SELECT p.productid, p.name, p.price, p.image, op.quantity
    FROM order_product op
    JOIN orders o ON op.orderid = o.orderid
    JOIN product p ON op.productid = p.productid
    WHERE o.userid = ? AND o.status = 'pending'
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [userid], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}
