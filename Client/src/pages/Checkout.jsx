import { useEffect, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import CartItem from "@/components/CartItem";
import OrderSummary from "@/components/OrderSummary";
import "./Checkout.css"; 

function CheckoutPage() {
  const { cart, fetchCart } = useContext(AppContext);

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="checkout-wrapper">
      <div className="cart-left">
        <div className="cart-header">
          <h2>Your Checkout Items</h2>
        </div>

        {cart?.map((item) => (
          <CartItem
            key={`checkout-${item.productid}`}
            item={item}
            onDelete={() => {}}
            onQtyChange={() => {}}
          />
        ))}
      </div>

      <div className="cart-right">
        <OrderSummary items={cart} />
      </div>
    </div>
  );
}

export default CheckoutPage;
