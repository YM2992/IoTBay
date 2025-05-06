import { Card, Typography, Select, Space, Tooltip } from "antd";
import { HeartOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

function CartItem({ item, onQtyChange, onDelete }) {
  return (
    <Card
      style={{ marginBottom: "1px", borderRadius: "0px", marginLeft: "15px", marginRight: "-15px"}}
    >
      <div style={{ display: "flex" }}>
        {/* Product Image */}
        <img
          src={`/assets/products/${item.image}.jpg`}
          alt={item.name}
          style={{
            width: 120,
            height: 120,
            objectFit: "cover",
            marginRight: 16,
          }}
        />

        {/* Info and Actions */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Title and Price */}
          <div>
            <Text strong style={{ fontSize: "18px" }}>{item.name}</Text><br />
            <Text type="secondary" style={{ fontSize: "16px" }}>
              ${item.price.toFixed(2)}
            </Text>
          </div>

          {/* Bottom-right Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "auto", gap: 16 }}>
            <Select
              defaultValue={item.quantity}
              style={{ width: 80 }}
              onChange={(value) => onQtyChange?.(item, value)}
            >
              {Array.from({ length: 10 }, (_, i) => (
                <Option key={i + 1} value={i + 1}>{i + 1}</Option>
              ))}
            </Select>

            <Space>
              <Tooltip title="Wishlist">
                <HeartOutlined style={{ fontSize: 18, cursor: "pointer" }} />
              </Tooltip>
              <Tooltip title="Remove">
                <DeleteOutlined
                  style={{ fontSize: 18, cursor: "pointer", color: "red" }}
                  onClick={() => onDelete?.(item)}
                />
              </Tooltip>
            </Space>

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
