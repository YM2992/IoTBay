import "./MainPage.css";
import ProductListing from "../components/ProductListing";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { useEffect } from "react";

function ProductPage() {
  // const { user } = useContext(AuthContext);
  const { products } = useContext(AppContext);

  let noProducts = products.length === 0;

  useEffect(() => {
    if (!noProducts) {
      return;
    }
  }, [products]);

  return (
    <div className="main-container">
      <main className="main-container">
        <h1 style={{ color: "white", fontSize: "2rem", fontWeight: "bold" }}>
          Explore our product range
        </h1>

        {noProducts && (
          <h1 style={{ color: "white" }}>
            There are some issues with the server, please refresh the page
          </h1>
        )}

        <h2 className="products-h">Products</h2>
        {!noProducts && (
          <div className="button-container">
            {products.map((product, index) => (
              <ProductListing key={product.productid || index} data={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductPage;
