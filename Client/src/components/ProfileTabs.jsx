import { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
  FaBoxOpen,
  FaCreditCard,
  FaFileInvoice,
  FaStar,
  FaHistory,
  FaAddressBook,
} from "react-icons/fa";
import "react-tabs/style/react-tabs.css";

import PaymentHistory from "./PaymentHistory";
import PaymentCardsTab from "./PaymentCardsTab"; // Import the new component
import AddressBook from "./AddressBook";

const tabStyle = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontWeight: "500",
};

const TabOptions = [
  { icon: <FaBoxOpen />, label: "Listings" },
  { icon: <FaFileInvoice />, label: "Orders" },
  { icon: <FaStar />, label: "Reviews" },
  {
    icon: <FaCreditCard />,
    label: "Payment",
  },
  {
    icon: <FaHistory />,
    label: "Payment History",
  },
  {
    icon: <FaAddressBook />,
    label: "Address Book",
  },
];

function ProfileTabs() {
  const [tabIndex, setTabIndex] = useState(0);

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
        <PaymentCardsTab />
      </TabPanel>

      <TabPanel>
        <PaymentHistory />
      </TabPanel>

      <TabPanel>
        <AddressBook />
      </TabPanel>
    </Tabs>
  );
}

export default ProfileTabs;
