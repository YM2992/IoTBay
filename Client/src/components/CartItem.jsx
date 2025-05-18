import { useContext } from "react";
import { Card, Typography, Select, Space, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { AppContext } from "@/context/AppContext";
import { removeCartItem as removeCartItemAPI, updateCartQuantity } from "@/api/cartAPI";
import toast from "react-hot-toast";
import { getImageSrc } from "@/utils/helper";

const { Text } = Typography;
const { Option } = Select;

function CartItem({ item }) {
  const { user, fetchCart } = useContext(AppContext);

  const handleQtyChange = async (item, newQty) => {
    try {
      await updateCartQuantity(item.productid, newQty);
      await fetchCart();
      toast.success("Quantity updated");
    } catch (err) {
      console.error("❌ Failed to update quantity:", err.message);
      toast.error("Failed to update quantity");
    }
  };

  const handleDelete = async (productid) => {
    try {
      await removeCartItemAPI(productid);
      await fetchCart();
      toast.success("Item removed");
    } catch (err) {
      console.error("❌ Failed to remove item:", err.message);
      toast.error("Failed to remove item");
    }
  };

  return (
    <Card
      style={{ marginBottom: "1px", borderRadius: "0px", marginLeft: "15px", marginRight: "-15px" }}
    >
      <div style={{ display: "flex" }}>
        <img
          src={getImageSrc(item.image)}
          alt={item.name}
          style={{
            width: 120,
            height: 120,
            objectFit: "cover",
            marginRight: 16,
          }}
        />

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div>
            <Text strong style={{ fontSize: "18px" }}>
              {item.name}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: "16px" }}>
              ${item.price.toFixed(2)}
            </Text>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: "auto",
              gap: 16,
              paddingRight: "10px",
            }}
          >
            <Select
              value={item.quantity}
              style={{ width: 80 }}
              onChange={(value) => handleQtyChange(item, Number(value))}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <Option key={i + 1} value={i + 1}>
                  {i + 1}
                </Option>
              ))}
            </Select>

            <Tooltip title="Remove">
              <DeleteOutlined
                style={{ fontSize: 18, cursor: "pointer", color: "red" }}
                onClick={() => handleDelete(item.productid)}
              />
            </Tooltip>

            <Text strong style={{ fontSize: "18px" }}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CartItem;
