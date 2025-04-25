import EmptyCartCard from "../components/EmptyCartCard";

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
      <EmptyCartCard />
    </div>
  );
}

export default Cart;
