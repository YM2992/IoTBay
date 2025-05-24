import { useEffect, useContext, useState, useRef } from "react"; // Added useRef
import { AppContext } from "@/context/AppContext";
import CartItem from "@/components/CartItem";
import OrderSummary from "@/components/OrderSummary";
import PaymentCard from "@/components/Checkout/PaymentCard";
import NewCardForm from "@/components/Checkout/NewCardForm"; // Import NewCardForm
import "./Checkout.css";
import { Radio } from "antd"; // Input removed as it's now in NewCardForm
import toast from "react-hot-toast";
import { getPaymentCards } from "@/components/Payment";
import { removeCartItem as removeCartItemAPI, updateCartQuantity } from "@/api/cartAPI";
import { API_ROUTES, fetchPost, optionMaker } from "@/api";

import NewAddressFrom from "@/components/AddressFeatures/NewAddressFrom";
import AddressSelection from "@/components/AddressFeatures/AddressSelection";
import { useFetch } from "@/hook/useFetch";
import AddressForm from "@/components/AddressFeatures/AddressForm";
import { useNavigate } from "react-router-dom";

function CheckoutPage() {
  const { cart, fetchCart, token } = useContext(AppContext);
  const navigate = useNavigate();
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
  } = useFetch(
    "address",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    { enable: token ? true : false }
  );

  useEffect(() => {
    if (token) {
      fetchPaymentCards();
      fetchCart();
    } else {
      setSelectedPaymentOption("new_card");
      setPaymentCards([]);
    }
  }, [token]);

  const handleAddressInput = (field) => (e) => {
    const data = e.target.value;
    setSelectedAddress((prev) => ({
      ...prev,
      [field]: data,
    }));
  };

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
      return;
    }

    if (!selectedAddress) {
      return toast.error("You must select or input a shipping address.");
    }

    let order_address;

    if (token) {
      const addressid = selectedAddress.split("-")[1];
      const { phone, recipient, address } = addressData.find(
        (add) => add.addressid === parseInt(addressid)
      );
      order_address = { phone, recipient, address };
    } else {
      order_address = selectedAddress;
    }

    const orderDetails = {
      items: cart,
      paymentDetails,
      address: order_address,
    };

    if (!token) {
      const guestOrderId = localStorage.getItem("guestOrderId");
      if (guestOrderId) {
        orderDetails.guestOrderId = guestOrderId;
      } else {
        return toast.error("Guest order ID not found.");
      }

      // If the user is not logged in, we don't want to save the card
      if (orderDetails.paymentDetails && orderDetails.paymentDetails.isNew) {
        orderDetails.paymentDetails.saveCard = false;
      }
    }

    try {
      const url = token ? API_ROUTES.checkout.checkout : API_ROUTES.checkout.guest;
      const response = await fetchPost(url, optionMaker(orderDetails, "POST", token));
      if (response && response.status === "success" && response.data) {
        toast.success("Checkout successful!");

        if (!token && localStorage.getItem("guestOrderId")) {
          localStorage.removeItem("guestOrderId");
        }

        fetchCart(); // clear cart after checkout

        navigate("/order-confirmation", {
          state: {
            orderid: response.data.orderid,
            totalAmount: response.data.totalAmount,
            products: response.data.products,
          },
        });
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
                setNewCardDetails(allValues);
              }}
            />
          )}
        </div>

        <div className="payment-section-container">
          <h3>Shipping Address</h3>
          {token && addressData && (
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
          {token && addressData && <NewAddressFrom refetch={refetch} />}

          {!token && <AddressForm handleChange={handleAddressInput} />}
        </div>
        <button className="checkout-button" onClick={handlePaymentCallback}>
          Pay Now
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
