import { Button, Empty, Typography } from "antd";
import { Link } from "react-router-dom";

function EmptyCard({ description, showBtn = true, btnText = "OK", btnLink = "/", style = {} }) {
  return (
    <div style={{ marginTop: "5rem", padding: "10rem", background: "white", ...style }}>
      <Empty description={<Typography.Text>{description}</Typography.Text>}>
        {showBtn && (
          <Button>
            <Link to={btnLink}>{btnText}</Link>
          </Button>
        )}
      </Empty>
    </div>
  );
}

export default EmptyCard;
