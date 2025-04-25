import { Spin } from "antd";

const contentStyle = {
  padding: 50,
  background: "rgba(0, 0, 0, 0.05)",
  borderRadius: 4,
};

function LoadingSpinner({ tip = "Loading", size = "small" }) {
  return (
    <Spin tip={tip} size={size}>
      <div style={contentStyle} />
    </Spin>
  );
}

export default LoadingSpinner;
