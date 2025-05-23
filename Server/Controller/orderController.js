import db from "../Controller/dbController.js";
import catchAsync from "../Utils/catchAsync.js";
import { getAll } from "./centralController.js";

export const getOrderHistory = catchAsync(async (req, res, next) => {
  const userid = req.user.userid;
  console.log("Fetching order history for user:", userid);

  const history = db
    .prepare(
      `
SELECT DISTINCT *
FROM orders o
WHERE o.userid = ? AND o.status != 'pending'
ORDER BY o.orderDate DESC;

`
    )
    .all(userid);

  res.status(200).json({
    status: "success",
    data: history,
  });
});

export const getOrderById = catchAsync(async (req, res, next) => {
  const { orderid } = req.params;

  const items = db
    .prepare(
      `
  SELECT p.productid, p.name, p.price, p.image, op.quantity
  FROM order_product op
  JOIN product p ON op.productid = p.productid
  WHERE op.orderid = ?
`
    )
    .all(orderid);

  if (!items || items.length === 0) {
    return res.status(404).json({ status: "fail", message: "No products found for this order." });
  }

  res.status(200).json({
    status: "success",
    data: items,
  });
});

export const getAllOrders = catchAsync(async (req, res, next) => {
  const orders = getAll("orders");

  res.status(200).json({
    status: "success",
    data: orders,
  });
});
