import { Image, Typography, InputNumber } from "antd";
import { useState, useEffect } from "react";

const { Title, Text } = Typography;

function ProductDetails({ product }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  if (!product) return <p>Loading...</p>;
  

  return (
    <>
      <Image
        src={`/assets/products/${product.image}.jpg`}
        alt={product.name}
        width={500}
        height={500}
        style={{ objectFit: "contain", borderRadius: "8px" }}
        preview={true}
      />

      <Title level={2}>{product.name}</Title>
      <Text type="success">In stock</Text>
      <Title level={3}>AU ${product.price.toFixed(2)} each</Title>

      <div style={{ marginTop: "1rem" }}>
        <Text strong>Quantity:</Text>{" "}
        <InputNumber
          min={1}
          max={product.quantity}
          value={quantity}
          onChange={(val) => setQuantity(val)}
        />{" "}
        <Text>/ {product.quantity} available</Text>
      </div>
    </>
  );
}

export default ProductDetails;
