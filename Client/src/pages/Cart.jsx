import EmptyCard from "../components/EmptyCard";

function Cart() {
  return (
    <div
      style={{
        width: "100%",
        padding: "1rem 5rem",
        height: "100%",
      }}
    >
      <h1>Cart</h1>

      {/* For later use */}
      <EmptyCard description={"Your cart is Empty"} btnLink="/products" btnText="Go to Shop" />
    </div>
  );
}

export default Cart;
