import { API_ROUTES, fetchGet } from "@/api";
import { AppContext } from "@/context/AppContext";
import { Table, Input, Button, Space, Modal } from "antd";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const { Column } = Table;

function OrderHistory() {
  const { token } = useContext(AppContext);
  const [orderHistory, setOrderHistory] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchGet(API_ROUTES.order.getOrderHistory, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response || response.status !== "success") {
          throw new Error("Failed to fetch order history");
        }
        return response.data;
      })
      .then((data) => {
        setOrderHistory(data);
        setVisibleOrders(data);
        console.log("✅ Order history data:", data);
      })
      .catch((error) => {
        console.error("❌ Error fetching order history:", error);
        toast.error("Failed to fetch order history.");
      });
  }, [token]);

  const handleSearch = () => {
    const search = searchValue.toLowerCase();
    const filtered = orderHistory.filter(
      (item) =>
        item.orderid.toString().includes(search) ||
        item.orderDate.toLowerCase().includes(search)
    );
    setVisibleOrders(filtered);
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="order-history">
      <h2>Order History</h2>

      <Space style={{ marginBottom: "1rem", flexWrap: "wrap" }}>
        <Input
          className="order-history-search"
          placeholder="Search by Order ID or Date"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </Space>

      <Table dataSource={visibleOrders} rowKey="orderid" rowHoverable>
        <Column title="Order ID" dataIndex="orderid" key="orderid" />
        <Column title="User ID" dataIndex="userid" key="userid" />
        <Column title="Date" dataIndex="orderDate" key="orderDate" />
        <Column title="Status" dataIndex="status" key="status" />
        <Column title="Amount" dataIndex="amount" key="amount" />
        <Column title="Product" dataIndex="name" key="name" />
        <Column title="Quantity" dataIndex="quantity" key="quantity" />
        <Column title="Price" dataIndex="price" key="price" />
        <Column
          title="Actions"
          key="actions"
          render={(_, record) => (
            <Button type="link" onClick={() => showOrderDetails(record)}>
              View Details
            </Button>
          )}
        />
      </Table>

      <Modal
        title={`Order #${selectedOrder?.orderid}`}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        {selectedOrder && (
          <div>
            <p><strong>Date:</strong> {selectedOrder.orderDate}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Amount:</strong> ${selectedOrder.amount.toFixed(2)}</p>
            <p><strong>Product:</strong> {selectedOrder.name}</p>
            <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
            <p><strong>Price:</strong> ${selectedOrder.price.toFixed(2)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default OrderHistory;
