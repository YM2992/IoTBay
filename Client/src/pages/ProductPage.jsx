import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Image, Button, InputNumber, Typography, Card, Divider } from "antd";
import "./ProductPage.css";
import { getImageSrc } from "@/utils/helper";

const { Title, Text, Paragraph } = Typography;

function ProductPage() {
  const { productid } = useParams();
  const [data, setData] = useState(null);
  const [quantity, setQuantity] = useState(1);
<<<<<<< HEAD
  const { addToCart, fetchCart, products, loggedIn} = useContext(AppContext);

=======
  const { addToCart, fetchCart, products, loggedIn } = useContext(AppContext);
  // const navigate = useNavigate();
>>>>>>> 603c576fe3dbba975b8a95ecea9a31b6adaa0a73

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const product = products.find((p) => p.productid === Number(productid));
    if (product) setData(product);
  }, [products, productid]);

  if (!data) return <p>Loading...</p>;

  const handleAddToCart = async () => {
    try {
      if (!loggedIn) {
        toast("🛒 Adding to cart as guest...", { icon: "👤" });
      }
<<<<<<< HEAD
  
      console.log("Adding to cart:", {
=======

      console.log("🛒 Adding to cart:", {
>>>>>>> 603c576fe3dbba975b8a95ecea9a31b6adaa0a73
        productid: data.productid,
        quantity,
      });

      const response = await addToCart(data.productid, quantity);
<<<<<<< HEAD
  
      if (response?.cart && Array.isArray(response.cart)) {
  // 🧠 Store guest orderid
  if (!loggedIn && response.orderid) {
    localStorage.setItem("guestOrderId", response.orderid);
    console.log("💾 Guest order ID stored:", response.orderid);
  }
        await fetchCart(); 
  
=======

      if (Array.isArray(response)) {
        await fetchCart(); // no userid needed

>>>>>>> 603c576fe3dbba975b8a95ecea9a31b6adaa0a73
        toast.custom((t) => (
          <Card
            className="cart-toast-popup"
            style={{
              position: "fixed",
              bottom: "-150px",
              right: "20px",
              zIndex: 9999,
              width: 280,
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              animation: t.visible ? "slide-in 0.3s ease-out" : "slide-out 0.3s ease-in",
              cursor: "pointer",
            }}
            onClick={() => toast.dismiss(t.id)}
          >
            ✅{" "}
            <strong>
              {quantity}x {data.name}
            </strong>{" "}
            added to cart!
            <p style={{ fontSize: "12px", color: "#666", marginTop: 5 }}>Click to dismiss</p>
          </Card>
        ));
      } else {
        console.warn("⚠️ Unexpected response in addToCart:", response);
        toast.error("❌ Could not add to cart");
      }
    } catch (err) {
      console.error("❌ Error in handleAddToCart:", err);
      toast.error("Something went wrong adding to cart");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="product-page">
        <div className="product-left">
          <Image
            className="product-details-image"
            src={getImageSrc(data.image)}
            alt={data.name}
            width={500}
            height={500}
            style={{ objectFit: "contain", borderRadius: "8px" }}
            preview={true}
          />
        </div>

        <div className="product-right">
          <Title level={2} className="product-title">
            {data.name}
          </Title>
          <Title level={3} className="product-price">
            AU ${data.price.toFixed(2)} each
          </Title>
          <Text className="in-stock-text">In stock</Text>

          <div className="product-quantity">
            <Text strong className="quantity-label">
              Quantity:
            </Text>
            <InputNumber
              min={1}
              max={data.quantity}
              value={quantity}
              onChange={(val) => setQuantity(val)}
            />
            <Text className="quantity-available">/ {data.quantity} available</Text>
          </div>

          <div className="product-actions">
            <div className="product-actions">
              <Button
                className="add-to-cart-button"
                size="large"
                disabled={data.quantity === 0}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>

          <Divider />

          <Card title="Product Description" bordered={false}>
            <Paragraph>{data.description}</Paragraph>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
