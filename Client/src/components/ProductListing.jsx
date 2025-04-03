import "../pages/MainPage.css";
import "./ProductListing.css";
import { useCart } from "../context/CartContext";

function ProductListing({ data }) {
  const { name, image, price } = data;
  const { addToCart } = useCart(); // Destructure the addToCart function

  const handleAddToCart = () => {
    addToCart(data); // Add the product to the cart
  };

  return (
    <>
      <a href={`/product/${name}`} className="product-card">
        <img className="product-image" src={`/assets/products/${image}.jpg`} />
        <div className="product-details">
          <p className="product-title">{name}</p>
          <p className="product-price">${price.toFixed(2)}</p>
          
        </div>
      </a>
      {/*uncomment this for cart button*/}
      {/*uncomment this for cart button*/}
      {/*<button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>*/}
    </>
  );
}

export default ProductListing;
