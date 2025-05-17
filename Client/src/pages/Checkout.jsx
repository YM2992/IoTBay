import { useEffect, useContext, useState, useRef } from "react"; // Added useRef
import { AppContext } from "@/context/AppContext";
import CartItem from "@/components/CartItem";
import OrderSummary from "@/components/OrderSummary";
import PaymentCard from "@/components/Checkout/PaymentCard";
import NewCardForm from "@/components/Checkout/NewCardForm"; // Import NewCardForm
import "./Checkout.css";
import { Radio, Button, Checkbox, Typography } from "antd"; // Input removed as it's now in NewCardForm
import toast from "react-hot-toast";
import { getPaymentCards } from "@/components/Payment";
import { removeCartItem as removeCartItemAPI, updateCartQuantity } from "@/api/cartAPI";
import { API_ROUTES, fetchPost, optionMaker } from "@/api";

import NewAddressFrom from "@/components/AddressFeatures/NewAddressFrom";
import AddressSelection from "@/components/AddressFeatures/AddressSelection";
import { useFetch } from "@/hook/useFetch";

const { Text } = Typography;

function CheckoutPage() {
  const { cart, fetchCart, token } = useContext(AppContext);
  const [paymentCards, setPaymentCards] = useState([]);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newCardDetails, setNewCardDetails] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
  });
  const newCardFormRef = useRef(null);

  const {
    data: addressData,
    error,
    refetch,
  } = useFetch("address", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (token) {
      fetchPaymentCards();
    } else {
      setSelectedPaymentOption("new_card");
      setPaymentCards([]);
    }
  }, [token]);

  const removeItemFromCart = async (productid) => {
    try {
      await removeCartItemAPI(productid);
      await fetchCart();
    } catch (err) {
      console.error("❌ Failed to remove item:", err.message);
    }
  };

  const handleQtyChange = async (item, newQty) => {
    try {
      await updateCartQuantity(item.productid, newQty);
      await fetchCart();
    } catch (err) {
      console.error("❌ Failed to update quantity:", err.message);
    }
  };

  const fetchPaymentCards = async () => {
    try {
      const res = await getPaymentCards(token);
      if (res && res.status === "success" && Array.isArray(res.data)) {
        setPaymentCards(res.data);
        const currentSelectedCardId = selectedPaymentOption?.startsWith("saved_")
          ? selectedPaymentOption.split("_")[1]
          : null;
        const stillExists = currentSelectedCardId
          ? res.data.some((card) => card.cardid.toString() === currentSelectedCardId)
          : false;

        if (selectedPaymentOption && stillExists) {
          // Keep current selection if it still exists
        } else if (res.data.length > 0) {
          setSelectedPaymentOption(`saved_${res.data[0].cardid}`);
        } else {
          setSelectedPaymentOption("new_card");
        }
      } else {
        toast.error(res?.message || "Failed to process payment cards data.");
        setPaymentCards([]);
        setSelectedPaymentOption("new_card");
      }
    } catch (error) {
      toast.error(error.message || "Error fetching payment cards.");
      setPaymentCards([]);
      setSelectedPaymentOption("new_card");
    }
  };

  const handlePaymentOptionChange = (e) => {
    const newSelectedOption = e.target.value;
    if (selectedPaymentOption === "new_card" && newSelectedOption !== "new_card") {
      // Reset new card form if switching away from it
      if (newCardFormRef.current && typeof newCardFormRef.current.resetFields === "function") {
        newCardFormRef.current.resetFields();
      }
    }
    setSelectedPaymentOption(newSelectedOption);
  };

  const handleAddressOptionChange = (e) => {
    const newSelectedOption = e.target.value;
    setSelectedAddress(newSelectedOption);
  };

  const getPaymentDetailsForOrder = async () => {
    if (selectedPaymentOption && selectedPaymentOption.startsWith("saved_")) {
      const cardId = selectedPaymentOption.split("_")[1];
      const selectedCard = paymentCards.find((card) => card.cardid.toString() === cardId);
      if (selectedCard) {
        // Basic expiry date validation (format MM/YY)
        if (!selectedCard.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(selectedCard.expiryDate)) {
          toast.error(
            `Selected card (**** ${
              selectedCard.cardNumber ? selectedCard.cardNumber.slice(-4) : "N/A"
            }) has an invalid expiry date format.`
          );
          return null;
        }
        const [monthStr, yearStr] = selectedCard.expiryDate.split("/");
        const month = parseInt(monthStr, 10);
        const year = parseInt(`20${yearStr}`, 10);
        const lastDayOfExpiryMonth = new Date(year, month, 0);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (lastDayOfExpiryMonth < currentDate) {
          toast.error(`Selected card (**** ${selectedCard.cardNumber.slice(-4)}) is expired.`);
          return null;
        }
        return { ...selectedCard, isNew: false, saveCard: false }; // Existing cards are not "saved" again via this flow
      }
      toast.error("Selected saved card not found.");
      return null;
    } else if (selectedPaymentOption === "new_card") {
      if (newCardFormRef.current) {
        return await newCardFormRef.current.validateAndGetNewCardDetails();
      }
      toast.error("New card form is not ready. Please try again.");
      return null;
    }
    toast.error("Please select or enter a payment method.");
    return null;
  };

  const handlePaymentCallback = async () => {
    const paymentDetails = await getPaymentDetailsForOrder();

    if (!paymentDetails) {
      toast.error("Failed to get payment details. Please check your selection.");
      return;
    }

    if (!selectedAddress) {
      return toast.error("You must select an shipping address.");
    }

    const addressid = selectedAddress.split("-")[1];

    // Call "/api/checkout" endpoint with the payment details
    const orderDetails = {
      items: cart,
      paymentDetails,
      addressid,
    };
    try {
      const response = await fetchPost(
        API_ROUTES.checkout.checkout,
        optionMaker(orderDetails, "POST", token)
      );
      if (response && response.status === "success") {
        toast.success("Checkout successful!");
        // Optionally redirect or clear cart
        fetchCart(); // Refresh cart after checkout
      } else {
        toast.error(response?.message || "Checkout failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "Error during checkout.");
    }
  };

  return (
    <div className="checkout-wrapper">
      <div className="cart-left">
        <div className="cart-header">
          <h2>Your Checkout Items</h2>
        </div>
        {cart?.length > 0 ? (
          cart.map((item) => (
            <CartItem
              key={`checkout-${item.productid}-${item.cartitemid}`}
              item={item}
              onDelete={() => removeItemFromCart(item.productid)}
              onQtyChange={handleQtyChange}
            />
          ))
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

      <div className="cart-right">
        <OrderSummary
          items={cart}
          getPaymentDetails={getPaymentDetailsForOrder}
          paymentCallback={handlePaymentCallback}
          disabledBtn={!selectedAddress}
        />

        <div className="payment-section-container">
          <h3>Payment Method</h3>
          <Radio.Group
            onChange={handlePaymentOptionChange}
            value={selectedPaymentOption}
            className="payment-radio-group"
          >
            {paymentCards.map((card) => (
              <PaymentCard
                key={card.cardid}
                card={card}
                token={token}
                onCardUpdated={fetchPaymentCards}
              />
            ))}
            <Radio value="new_card" className="new-card-radio-option">
              Pay with new card
            </Radio>
          </Radio.Group>

          {selectedPaymentOption === "new_card" && (
            <NewCardForm
              ref={newCardFormRef}
              initialDetails={newCardDetails}
              onFormChange={(_, allValues) => {
                // Update newCardDetails state if you need to react to live changes
                // or if other parts of CheckoutPage depend on this intermediate state.
                // For now, primarily used for initial values and potentially resetting.
                setNewCardDetails(allValues);
              }}
            />
          )}
        </div>

        <div className="payment-section-container">
          <h3>Shipping Address</h3>
          {addressData && (
            <Radio.Group
              onChange={handleAddressOptionChange}
              value={selectedAddress}
              className="payment-radio-group"
            >
              {addressData.map((address) => (
                <>
                  <AddressSelection address={address} refetch={refetch} />
                </>
              ))}
            </Radio.Group>
          )}
          <NewAddressFrom refetch={refetch} />
        </div>
        <button className="checkout-button" onClick={handlePaymentCallback}>
          Pay Now
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
