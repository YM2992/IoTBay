import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FaCreditCard, FaFileInvoice, FaFire } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import "react-tabs/style/react-tabs.css";

import { AuthContext } from "../main";
import { useContext } from "react";

// Import SavedPaymentInfo component
import SavedPaymentInfo from "./SavedPaymentInfo";

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
  const { user } = useContext(AuthContext);
  const { paymentInfo } = user;
  const [tabIndex, setTabIndex] = useState(0);

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
        <SavedPaymentInfo paymentInfo={paymentInfo} />
      </TabPanel>

      <TabPanel>
        <h2>Any content 4</h2>
      </TabPanel>
    </Tabs>
  );
}

export default ProfileTabs;
