import { useEffect } from "react";
import { useParams } from "react-router-dom";

function ProductDetails() {
  const { productid } = useParams();
  console.log(productid);

  useEffect(() => {
    // const data = products.find((product) => product._id === id.slug);
    // setProduct(data);
  }, [productid]);

  return <div>ProductDetails</div>;
}

export default ProductDetails;
