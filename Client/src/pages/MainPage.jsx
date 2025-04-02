import "./MainPage.css";
import ProductListing from "../components/ProductListing";
import { useContext } from "react";
import { AuthContext } from "../main";
import { useEffect } from "react";

function MainPage() {
  const { products } = useContext(AuthContext);

  let noProducts = products.length === 0;

  useEffect(() => {
    if (!noProducts) {
      return;
    }
  }, [products]);

  return (
    <div className="main-container">
      <main className="main-container">
        <h1 className="welcome-message">Welcome Back to IOT Bay</h1>

        {noProducts && (
          <h1 style={{ color: "white" }}>
            There are some issues with the server, please refresh the page
          </h1>
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

export default MainPage;
