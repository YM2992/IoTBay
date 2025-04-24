import "../pages/MainPage.css";
import "./ProductListing.css";
import { Link } from "react-router-dom";

function ProductListing({ data }) {
  const { name, image, price, productid } = data;

  return (
    <>
      <Link to={`/products/${productid}`} className="product-card">
        <img className="product-image" src={`/assets/products/${image}.jpg`} />
        <div className="product-details">
          <p className="product-title">{name}</p>
          <p className="product-price">${price.toFixed(2)}</p>
        </div>
      </Link>
    </>
  );
}

export default ProductListing;
