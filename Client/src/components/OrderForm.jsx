import { useState } from "react";
import {
  createOrder,
  submitOrder,
} from "../api/ordersMock"; // use our mock backend
import "./Order.css";

function OrderForm({ onOrderCreated }) {
  const [deviceList, setDeviceList] = useState("");
  const [total, setTotal] = useState("");
  const [status, setStatus] = useState("saved"); // local state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setLoading(true);
    try {
      const order = await createOrder({
        deviceIds: deviceList.split(",").map((d) => d.trim()),
        total,
      });

      setMessage(`Order saved: ${order.id}`);
      setStatus("saved");
      onOrderCreated?.(order); // callback to refresh list if needed
    } catch (err) {
      setMessage("Error saving order");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const order = await createOrder({
        deviceIds: deviceList.split(",").map((d) => d.trim()),
        total,
      });

      await submitOrder(order.id);
      setMessage(`Order submitted: ${order.id}`);
      setStatus("submitted");
      onOrderCreated?.(order);
    } catch (err) {
      setMessage("Error submitting order");
    }
    setLoading(false);
  };

  return (
    <div className="order-form">
      <h3>Create a New Order</h3>

      <label>Device IDs (comma separated)</label>
      <input
        type="text"
        value={deviceList}
        onChange={(e) => setDeviceList(e.target.value)}
        placeholder="dev001, dev002"
      />

      <label>Total Amount</label>
      <input
        type="text"
        value={total}
        onChange={(e) => setTotal(e.target.value)}
        placeholder="$0.00"
      />

      <div className="order-actions">
        <button onClick={handleSave} disabled={loading || status === "submitted"}>
          Save Order
        </button>
        <button onClick={handleSubmit} disabled={loading || status === "submitted"}>
          Submit Order
        </button>
      </div>

      {message && <p className="feedback-msg">{message}</p>}
    </div>
  );
}

export default OrderForm;
