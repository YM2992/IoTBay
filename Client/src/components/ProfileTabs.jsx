import { useState, useContext, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FaBoxOpen, FaCreditCard, FaFileInvoice, FaStar, FaHistory } from "react-icons/fa";
import "react-tabs/style/react-tabs.css";

import { AppContext } from "@/context/AppContext";
import { API_ROUTES, fetchGet } from "@/api";

// Import SavedPaymentInfo component
import SavedPaymentCard from "./SavedPaymentCard";
import PaymentHistory from "./PaymentHistory";
import toast from "react-hot-toast";

const tabStyle = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontWeight: "500",
};

const TabOptions = [
  { icon: <FaBoxOpen />, label: "Listings" },
  { icon: <FaFileInvoice />, label: "Orders" },
  {
    icon: <FaCreditCard />,
    label: "Payment",
  },
  {
    icon: <FaHistory />,
    label: "Payment History",
  },
  { icon: <FaStar />, label: "Reviews" },
];

function ProfileTabs() {
  const { user, token, paymentCards, updatePaymentCards } = useContext(AppContext);
  const [tabIndex, setTabIndex] = useState(0);
  const [cards, setCards] = useState(paymentCards || []);

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
  }, []);

  useEffect(() => {
    if (paymentCards && paymentCards.length > 0) {
      let cards = paymentCards.map((card, index) => {
        return <SavedPaymentCard paymentCard={card} key={index} />;
      });

      setCards(cards);
    } else {
      setCards([]);
    }
  }, [paymentCards, updatePaymentCards]);

  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  return (
    <Tabs selectedIndex={tabIndex} onSelect={handleTabChange}>
      <TabList>
        {TabOptions.map((tab, index) => (
          <Tab key={index} style={tabStyle}>
              {tab.icon}
              {tab.label}
          </Tab>
        ))}
      </TabList>

      {/* Listings Tab */}
      <TabPanel>
        <div className="listing-controls">
          <button className="create-listing-btn">+ START A NEW LISTING</button>
          <select className="sort-dropdown">
            <option>Sort by: Default</option>
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>
        <p className="empty-msg">You don’t have any listings for sale.</p>
      </TabPanel>

      {/* Orders Tab */}
      <TabPanel>
        <p className="empty-msg">You haven’t made any orders yet.</p>
      </TabPanel>

      {/* Reviews Tab */}
      <TabPanel>
        <p className="empty-msg">You don’t have any reviews yet.</p>
      </TabPanel>

      <TabPanel>
      {paymentCards.length > 0 && 
          <h2>
            {paymentCards.length > 1 ? "Saved Payment Methods" : "Saved Payment Method"}
          </h2>}
        {paymentCards.length === 0 && <h2>No saved payment methods</h2>}
        
        {cards.length > 0 && (
          <div>
            {cards.map((card, index) => (
              <div key={index}>{card}</div>
            ))}
          </div>
        )}

        <h3>Add New Payment Method</h3>
        <SavedPaymentCard
          token={token}
        />
      </TabPanel>

      <TabPanel>
        <PaymentHistory />
      </TabPanel>
    </Tabs>
  );
}

export default ProfileTabs;
