import "./MainPage.css";
import ProductListing from "../components/ProductListing";
import { useContext, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import { useFetchProduct } from "@/hook/useFetchProduct";
import LoadingSpinner from "@/components/LoadingSpinner";

function ProductPage() {
  const { products } = useContext(AppContext);
  const { updateProducts } = useContext(AppContext);
  const { data, error, loading } = useFetchProduct("product/");

  useEffect(() => {
    if (!loading || !error) updateProducts(data);
  }, [data, loading, error]);

  let noProducts = products === null || products.length === 0;

  return (
    <div className="main-container">
      <main className="main-container">
        <h1 style={{ color: "white", fontSize: "2rem", fontWeight: "bold" }}>
          Explore our product range
        </h1>

        {(loading || noProducts) && <LoadingSpinner size="large" />}

        {error && (
          <h3 style={{ color: "white", marginTop: "2rem" }}>
            There are some issues with the server, please refresh the page
          </h3>
        )}

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
