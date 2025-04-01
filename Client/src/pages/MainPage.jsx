import "./MainPage.css";
import ProductListing from "../components/ProductListing";
import { useContext } from "react";
import { AuthContext } from "../main";

function MainPage() {
  const { products } = useContext(AuthContext);
  console.log(products);
  if (products.length === 0) {
    return <></>;
  }

  return (
    <div className="main-container">
      <main className="main-container">
        <h1 className="welcome-message">Welcome Back to IOT Bay</h1>
        <div className="button-container">
          {products.map((product, index) => (
            <ProductListing key={product.productid || index} data={product} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default MainPage;
