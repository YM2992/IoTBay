import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Image, Button, InputNumber, Typography, Card, Divider } from "antd";
import CartPopup from "../components/CartPopup";
import "./ProductPage.css";

const { Title, Text, Paragraph } = Typography;

function ProductPage() {
  const { productid } = useParams();
  const [data, setData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const { addToCart, fetchCart, products } = useContext(AppContext);

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
      const userData = JSON.parse(localStorage.getItem("user"));
  
      if (!userData || !userData.userid) {
        toast.error("You must be logged in to add to cart");
        return;
      }
  
      const payload = {
        userid: userData.userid,
        productid: data.productid,
        quantity,
      };
  
      console.log("🛒 Adding to cart with payload:", payload);
  
      // Call API to add item to cart
      const response = await addToCart(payload.userid, payload.productid, payload.quantity);
  
      if (response?.status === "success") {
        // Refresh the global cart
        await fetchCart(payload.userid);
  
        // Show success popup
        toast.custom((t) => (
            <Card
            className="cart-toast-popup"
            style={{
              position: "fixed",
              bottom: "-130px", // ⬅️ move it down here
              right: "20px",
              zIndex: 9999,
              width: 280,
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              animation: t.visible ? "slide-in 0.3s ease-out" : "slide-out 0.3s ease-in",
              cursor: "pointer",
            }}
            onClick={() => toast.dismiss(t.id)}
          >
            ✅ <strong>{quantity}x {data.name}</strong> added to cart!
            <p style={{ fontSize: "12px", color: "#666", marginTop: 5 }}>Click to dismiss</p>
          </Card>
        ));
      } else {
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
            src={`/assets/products/${data.image}.jpg`}
            alt={data.name}
            width={500}
            height={500}
            style={{ objectFit: "contain", borderRadius: "8px" }}
            preview={true}
          />
        </div>

        <div className="product-right">
          <Title level={2} className="product-title">{data.name}</Title>
          <Title level={3} className="product-price">AU ${data.price.toFixed(2)} each</Title>
          <Text className="in-stock-text">In stock</Text>

          <div className="product-quantity">
            <Text strong className="quantity-label">Quantity:</Text>
            <InputNumber
              min={1}
              max={data.quantity}
              value={quantity}
              onChange={(val) => setQuantity(val)}
            />
            <Text className="quantity-available">/ {data.quantity} available</Text>
          </div>

          <div className="product-actions">
            <Button
              type="primary"
              size="large"
              disabled={data.quantity === 0}
              onClick={() => console.log("Buy Now")}
            >
              Buy Now
            </Button>

            <Button
              type="default"
              size="large"
              disabled={data.quantity === 0}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>

            <Button
              type="default"
              size="large"
              onClick={() => console.log("Add to Wishlist")}
            >
              Add to Wishlist
            </Button>
          </div>

          <Divider />

          <Card title="Product Description" bordered={false}>
            <Paragraph>{data.description}</Paragraph>
          </Card>
        </div>
      </div>

      <CartPopup
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        product={data}
        quantity={quantity}
      />
    </div>
  );
}

export default ProductPage;
