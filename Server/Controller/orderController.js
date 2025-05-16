import db from "../Controller/dbController.js";
import catchAsync from "../Utils/catchAsync.js";

export const getOrderHistory = catchAsync(async (req, res, next) => {
    const { userid } = req.user; // Assuming 'protect' middleware adds user to req

    if (!userid) {
        return res.status(401).json({
            status: "fail",
            message: "User not authenticated.",
        });
    }

    const stmt = db.prepare(`
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
    `);

    const orderHistory = stmt.all(userid);

    if (!orderHistory || orderHistory.length === 0) {
        return res.status(200).json({ // Or 404 if you prefer for "no content"
            status: "success",
            message: "No order history found for this user.",
            data: [],
        });
    }

    res.status(200).json({
        status: "success",
        results: orderHistory.length,
        data: orderHistory,
    });
});