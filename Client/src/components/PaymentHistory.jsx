import { API_ROUTES, fetchGet } from "@/api";
import { AppContext } from "@/context/AppContext";
import { Table } from "antd";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const { Column } = Table;

import "./PaymentHistory.css";

function PaymentHistory() {
    const { user, token } = useContext(AppContext);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [visibleHistory, setVisibleHistory] = useState([]);

    useEffect(() => {
        fetchGet(API_ROUTES.payment.getPaymentHistory, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((response) => {
                if (!response || response.status !== "success") {
                    throw new Error("Failed to fetch payment history");
                }
                return response.data;
            })
            .then((data) => {
                setPaymentHistory(data);
                setVisibleHistory(data);
                console.log("Payment history data:", data);
            })
            .catch((error) => {
                console.error("Error fetching payment history:", error);
                toast.error("Failed to fetch payment history.");
            });
    }, []);

    return (
        <div className="payment-history">
            <h2>Payment History</h2>
            <input
                className="payment-history-search"
                type="text"
                placeholder="Search payment history"
                onChange={(e) => {
                    const searchValue = e.target.value.toLowerCase();
                    setVisibleHistory(paymentHistory.filter(
                            (item) =>
                                item.paymentid.toString().includes(searchValue) ||
                                item.orderid.toString().includes(searchValue) ||
                                item.paymentDate.toLowerCase().includes(searchValue)
                        )
                    );
                }}
            />
            <Table dataSource={visibleHistory} rowKey={"paymentid"} rowHoverable>
                <Column title="Payment ID" dataIndex="paymentid" key="paymentid" />
                <Column title="User ID" dataIndex="userid" key="userid" />
                <Column title="Order ID" dataIndex="orderid" key="orderid" />
                <Column title="Payment Date" dataIndex="paymentDate" key="paymentDate" />
                <Column title="Amount" dataIndex="amount" key="amount" />
                <Column title="Card Number" dataIndex="cardNumber" key="cardNumber" />
            </Table>
        </div>
    );
}

export default PaymentHistory;