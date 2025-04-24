import { Button, Empty, Typography } from "antd";
import { Link } from "react-router-dom";

function EmptyCartCard() {
  return (
    <div style={{ marginTop: "5rem", padding: "10rem", background: "#021029" }}>
      <Empty
        description={
          <Typography.Text style={{ color: "white" }}>Your cart is Empty</Typography.Text>
        }
      >
        <Button>
          <Link to="/products">Explore Now</Link>
        </Button>
      </Empty>
    </div>
  );
}

export default EmptyCartCard;
