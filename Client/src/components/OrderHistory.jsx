import { API_ROUTES, fetchGet, fetchPost, optionMaker } from "@/api";
import { AppContext } from "@/context/AppContext";
import { getImageSrc } from "@/utils/helper";
import { Table, Input, Button, Space, Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const { Column } = Table;

function OrderHistory() {
  const { token } = useContext(AppContext);
  const [orderHistory, setOrderHistory] = useState([]);
  const [visibleOrders, setVisibleOrders] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [inputAddress, setInputAddress] = useState(null);
  // console.log(orderHistory);

  const fetchOrderHis = () => {
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
      })
      .catch((error) => {
        console.error("Error fetching order history:", error);
        toast.error("Failed to fetch order history.");
      });
  };

  useEffect(() => {
    if (token) fetchOrderHis();
  }, [token]);

  const handleSearch = () => {
    const search = searchValue.toLowerCase();
    const filtered = orderHistory.filter(
      (item) =>
        item.orderid.toString().includes(search) || item.orderDate.toLowerCase().includes(search)
    );
    setVisibleOrders(filtered);
  };

  const showOrderDetails = async (order) => {
    try {
      const res = await fetchGet(`order/${order.orderid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedOrder({
        ...order,
        products: res.data,
      });

      setIsModalOpen(true);
    } catch (err) {
      toast.error("Failed to load order details");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setInputAddress(null);
  };

  const onUpdateAddress = async function () {
    const { orderid } = selectedOrder;

    if (!inputAddress) return toast.error("Nothing has changed");

    // if (inputAddress.trim() === selectedOrder.address.trim()) {
    //   setInputAddress(null);
    //   return toast.success("Nothing has changed");
    // }
    console.log(inputAddress);

    const data = {
      orderid,
      shipment: inputAddress,
    };

    try {
      await fetchPost("address/shipment", optionMaker(data, "PATCH", token));
      fetchOrderHis();
      toast.success("Successfully updated shipping address");
      closeModal();
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong while updating shipping address");
    }
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

      <Table
        dataSource={visibleOrders}
        rowKey={(record) => `${record.orderid}-${record.orderDate}`}
        rowHoverable
      >
        <Column title="Order ID" dataIndex="orderid" key="orderid" />
        <Column title="Date" dataIndex="orderDate" key="orderDate" />
        <Column title="Address" dataIndex="address" key="address" />
        <Column title="Status" dataIndex="status" key="status" />
        <Column
          title="Amount"
          key="amount"
          render={(_, record) => `$${record.amount.toFixed(2)}`}
        />
        <Column
          title="Actions"
          key="actions"
          render={(_, record) => (
            <>
              <Button type="link" onClick={() => showOrderDetails(record)}>
                View Details
              </Button>
            </>
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
            <p>
              <strong>Date:</strong> {selectedOrder.orderDate}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <>
              <strong>Address:</strong>
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  key={selectedOrder.address}
                  defaultValue={selectedOrder.address}
                  onChange={(e) => {
                    setInputAddress({ ...inputAddress, address: e.target.value });
                  }}
                />
              </Space.Compact>
            </>

            <>
              <strong>Phone:</strong>
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  key={selectedOrder.phone}
                  defaultValue={selectedOrder.phone}
                  onChange={(e) => {
                    setInputAddress({ ...inputAddress, phone: e.target.value });
                  }}
                />
              </Space.Compact>
            </>

            <>
              <strong>Recipient:</strong>
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  key={selectedOrder.recipient}
                  defaultValue={selectedOrder.recipient}
                  onChange={(e) => {
                    setInputAddress({ ...inputAddress, recipient: e.target.value });
                  }}
                />
              </Space.Compact>
            </>
            <p>
              <Button
                disabled={selectedOrder.status !== "paid"}
                type="primary"
                onClick={onUpdateAddress}
              >
                Update Shipment
              </Button>
            </p>
            <p>
              <strong>Total Amount:</strong> ${selectedOrder.amount.toFixed(2)}
            </p>
            <hr />
            <h4>Products:</h4>
            {selectedOrder.products.map((p) => (
              <div key={p.productid} style={{ display: "flex", marginBottom: "1rem" }}>
                <img
                  src={getImageSrc(p.image)}
                  alt={p.name}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    marginRight: 10,
                  }}
                />
                <div>
                  <p>
                    <strong>{p.name}</strong>
                  </p>
                  <p>Quantity: {p.quantity}</p>
                  <p>Price: ${p.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default OrderHistory;
