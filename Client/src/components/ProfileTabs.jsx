import { useState, useContext, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FaCreditCard, FaFileInvoice, FaFire, FaHistory } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
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
};

const TabOptions = [
  { icon: <ImProfile />, label: "info" },
  {
    icon: <FaFileInvoice />,
    label: "Orders",
  },
  {
    icon: <FaCreditCard />,
    label: "Payment",
  },
  {
    icon: <FaHistory />,
    label: "Payment History",
  },
  {
    icon: <FaFire />,
    label: "Others...",
  },
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
    console.log(index);
    setTabIndex(index);
  };

  return (
    <Tabs selectedIndex={tabIndex} onSelect={(index) => handleTabChange(index)}>
      <TabList>
        {TabOptions.map((tab, index) => (
          <Tab key={index}>
            <p style={tabStyle}>
              {tab.icon}
              {tab.label}
            </p>
          </Tab>
        ))}
      </TabList>

      <TabPanel>
        <h2>Any content 1</h2>
      </TabPanel>

      <TabPanel>
        <h2>Any content 2</h2>
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

      <TabPanel>
        <h2>Any content 4</h2>
      </TabPanel>
    </Tabs>
  );
}

export default ProfileTabs;
