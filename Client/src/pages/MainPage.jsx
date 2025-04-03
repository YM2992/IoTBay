import "./MainPage.css";
import ProductListing from "../components/ProductListing";
import { useContext } from "react";
import { AuthContext } from "../main";
import { useEffect } from "react";

function MainPage() {
  const { user } = useContext(AuthContext);
  const { products } = useContext(AuthContext);
  
  const username = user ? user?.name.split(" ")[0] : "Guest";
  
  let noProducts = products.length === 0;

  useEffect(() => {
    if (!noProducts) {
      return;
    }
  }, [products]);

  return (
    <div className="main-container">
      <main className="main-container">
        <h1 className="welcome-message">Welcome back to IoTBay, {username}!</h1>

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

export default MainPage;
