import { useState, useContext, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import SavedPaymentCard from "./SavedPaymentCard"; // Assuming SavedPaymentCard is in the same directory
import { API_ROUTES, fetchGet } from "@/api";
import toast from "react-hot-toast";

function PaymentCardsTab() {
  const { token, paymentCards, updatePaymentCards } = useContext(AppContext);
  const [cardsToDisplay, setCardsToDisplay] = useState([]);

  useEffect(() => {
    fetchGet(API_ROUTES.payment.getPaymentCards, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Payment_cards:", res);
        if (res && res.status === "success") {
          localStorage.setItem("payment_cards", JSON.stringify(res.data));
          updatePaymentCards(res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching payment card:", error);
        toast.error("Failed to fetch payment card information.");
      });
  }, [token]);

  useEffect(() => {
    if (paymentCards && paymentCards.length > 0) {
      const mappedCards = paymentCards.map((card, index) => (
        <SavedPaymentCard paymentCard={card} key={index} />
      ));
      setCardsToDisplay(mappedCards);
    } else {
      setCardsToDisplay([]);
    }
  }, [paymentCards]);

  return (
    <div>
      <h2>Add New Payment Method</h2>
      <SavedPaymentCard token={token} />

      {(paymentCards && paymentCards.length > 0) ? (
        <h2>
          {paymentCards.length > 1
            ? "Saved Payment Methods"
            : "Saved Payment Method"}
        </h2>
      ) : (
        <h2>No saved payment methods</h2>
      )}
      {paymentCards && paymentCards.length === 0 && (
        <h2>No saved payment methods</h2>
      )}

      {cardsToDisplay.length > 0 && (
        <div>
          {cardsToDisplay.map((cardComponent, index) => (
            <div key={index}>{cardComponent}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaymentCardsTab;
