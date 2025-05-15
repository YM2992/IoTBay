import db from "../Controller/dbController.js";
import catchAsync from "../Utils/catchAsync.js";

export const getOrderHistory = catchAsync(async (req, res, next) => {
    const userid = req.user.userid;
    console.log("Fetching order history for user:", userid);

    const history = db.prepare(`
      SELECT o.orderid, o.status, o.orderDate, o.amount, 
             p.name, p.price, op.quantity, p.productid
      FROM orders o
      JOIN order_product op ON o.orderid = op.orderid
      JOIN product p ON op.productid = p.productid
      WHERE o.userid = ? AND o.status = 'paid'
    `).all(userid);
  
    res.status(200).json({
      status: "success",
      data: history,
    });
  });
  
