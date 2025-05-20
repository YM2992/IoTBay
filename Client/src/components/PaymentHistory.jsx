import { API_ROUTES, fetchGet } from "@/api";
import { AppContext } from "@/context/AppContext";
import { Table, DatePicker, Input } from "antd"; // Added DatePicker
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const { Column } = Table;
const { RangePicker } = DatePicker;

import "./PaymentHistory.css";

function PaymentHistory() {
    const { user, token } = useContext(AppContext);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [visibleHistory, setVisibleHistory] = useState([]);
    const [idSearch, setIdSearch] = useState("");
    const [dateSearch, setDateSearch] = useState(null);

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
    }, [token]);

    useEffect(() => {
        let filteredHistory = paymentHistory;

        if (idSearch) {
            const idSearchLower = idSearch.toLowerCase();
            filteredHistory = filteredHistory.filter(
                (item) =>
                    item.paymentid.toString().includes(idSearchLower) ||
                    item.orderid.toString().includes(idSearchLower)
            );
        }

        if (dateSearch && dateSearch.length === 2) {
            const [startDate, endDate] = dateSearch;
            if (startDate && endDate) {
                filteredHistory = filteredHistory.filter((item) => {
                    const itemDate = new Date(item.paymentDate);
                    return itemDate >= startDate.startOf('day').toDate() && itemDate <= endDate.endOf('day').toDate();
                });
            }
        }

        setVisibleHistory(filteredHistory);
    }, [paymentHistory, idSearch, dateSearch]);

    return (
        <div className="payment-history">
            <h2>Payment History</h2>
            <div className="filter-controls">
                <div className="filter-input-group">
                    <label htmlFor="idSearchInput">Search by ID:</label>
                    <Input
                        id="idSearchInput"
                        className="payment-history-search id-search"
                        type="text"
                        placeholder="Payment or Order ID"
                        value={idSearch}
                        onChange={(e) => setIdSearch(e.target.value)}
                    />
                </div>
                <div className="filter-input-group">
                    <label htmlFor="dateRangePickerInput">Filter by Date:</label>
                    <RangePicker
                        id="dateRangePickerInput"
                        className="payment-history-search date-range-picker"
                        onChange={(dates) => setDateSearch(dates)}
                        placeholder={['Start Date', 'End Date']}
                    />
                </div>
            </div>
            <Table dataSource={visibleHistory} rowKey={"paymentid"} rowHoverable>
                <Column title="Payment ID" dataIndex="paymentid" key="paymentid" />
                <Column title="Order ID" dataIndex="orderid" key="orderid" />
                <Column title="Payment Date" dataIndex="paymentDate" key="paymentDate" />
                <Column 
                    title="Amount" 
                    dataIndex="amount" 
                    key="amount" 
                    render={(text) => `$${text}`}
                />
                <Column 
                    title="Card Number" 
                    dataIndex="cardNumber" 
                    key="cardNumber" 
                    render={(text) => {
                        if (text && text.length > 4) {
                            const lastFourDigits = text.slice(-4);
                            return `**** **** **** ${lastFourDigits}`;
                        }
                        return text;
                    }}
                />
            </Table>
        </div>
    );
}

export default PaymentHistory;