import "../pages/MainPage.css";
import "./ProductListing.css";

function ProductListing({ data }) {
  const { name, image, price } = data;

  console.log(data);
  return (
    <>
      <a href={`/product/${name}`} className="product-card">
        <img className="product-image" src={`/assets/products/${image}.jpg`} />
        <div className="product-details">
          <p className="product-title">{name}</p>
          <p className="product-price">${price.toFixed(2)}</p>
        </div>
      </a>
    </>
  );
}

export default ProductListing;
