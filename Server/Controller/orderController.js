import db from "../Controller/dbController.js";
import catchAsync from "../Utils/catchAsync.js";

export const getOrderHistory = catchAsync(async (req, res, next) => {
    const { userid } = req.user;

    if (!userid) {
        return res.status(401).json({
            status: "fail",
            message: "User not authenticated.",
        });
    }

    const orderHistory = db.prepare(`
        SELECT 
            o.orderid, 
            o.userid, 
            o.orderDate, 
            o.status, 
            o.amount,
            p.name,
            op.quantity,
            p.price 
        FROM orders o
        JOIN order_product op ON o.orderid = op.orderid
        JOIN product p ON op.productid = p.productid
        WHERE o.userid = ?
        ORDER BY o.orderDate DESC, o.orderid DESC
    `).all(userid);

    // Check if order history is empty
    if (!orderHistory || orderHistory.length === 0) {
        return res.status(200).json({
            status: "success",
            message: "No order history found for this user.",
            data: [],
        });
    }

    res.status(200).json({
        status: "success",
        data: orderHistory
    });
});