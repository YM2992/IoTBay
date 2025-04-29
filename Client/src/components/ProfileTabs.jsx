import { useState, useContext, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FaCreditCard, FaFileInvoice, FaFire } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import "react-tabs/style/react-tabs.css";

import { AppContext } from "@/context/AppContext";
import { fetchGet } from "@/api";

// Import SavedPaymentInfo component
import SavedPaymentInfo from "./SavedPaymentInfo";
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
    icon: <FaFire />,
    label: "Others...",
  },
];

function ProfileTabs() {
  const { user, token, paymentCard, updatePaymentCard } = useContext(AppContext);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    fetchGet("payment/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Payment info:", res);
        if (res && res.status === "success" && res.data && res.data.length > 0) {
          localStorage.setItem("paymentCard", JSON.stringify(res.data[0]));
          updatePaymentCard(res.data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching payment card:", error);
        toast.error("Failed to fetch payment card information.");
      });
  }, []); // Fetch payment info on component mount

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
        <SavedPaymentInfo paymentCard={paymentCard} token={token} />
      </TabPanel>

      <TabPanel>
        <h2>Any content 4</h2>
      </TabPanel>
    </Tabs>
  );
}

export default ProfileTabs;
