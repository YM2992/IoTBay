import { useState, useEffect, useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
  FaBoxOpen,
  FaCreditCard,
  FaFileInvoice,
  FaStar, FaUser,
  FaHistory,
  FaAddressBook,
} from "react-icons/fa";
import { fetchPost, optionMaker } from "@/api";
import { AppContext } from "@/context/AppContext";
import { toast } from "react-hot-toast";
import "react-tabs/style/react-tabs.css";

import PaymentHistory from "./PaymentHistory";
import PaymentCardsTab from "./PaymentCardsTab"; // Import the new component
import OrderHistory from "./OrderHistory";

import AddressBooks from "./AddressBooks";

const tabStyle = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontWeight: "500",
};

const TabOptions = [
  { icon: <FaFileInvoice />, label: "Orders" },
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
  { icon: <FaUser />, label: "Access Log" },
];

function ProfileTabs() {
  const [tabIndex, setTabIndex] = useState(0);
  const [accessLogs, setAccessLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AppContext);

  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  useEffect(() => {
    if (tabIndex === 4) { // Access Log Tab
      const fetchAccessLogs = async () => {
        setLoading(true);
        try {
          const response = await fetchPost(
            "user/access-log",
            optionMaker({}, "POST", token)
          );
          setAccessLogs(response.data);
        } catch (error) {
          toast.error("Failed to fetch access logs.");
        } finally {
          setLoading(false);
        }
      };

      fetchAccessLogs();
    }
  }, [tabIndex, token]);

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

      {/* Orders Tab */}
      <TabPanel>
        <OrderHistory />
      </TabPanel>

      <TabPanel>
        <PaymentCardsTab />
      </TabPanel>

      <TabPanel>
        <PaymentHistory />
      </TabPanel>

      <TabPanel>
        <AddressBooks />
      </TabPanel>

      {/* Access Log Tab */}
      <TabPanel>
        <div className="access-log-container">
          <h1 className="access-log-title">
            Access Log
            <span
              style={{ fontSize: "14px", color: "#666", marginLeft: "10px" }}
            >
              ({accessLogs.length} sessions)
            </span>
          </h1>
          {loading ? (
            <div className="loading-spinner">
              <p>Loading your access log...</p>
            </div>
          ) : accessLogs.length > 0 ? (
            <table className="access-log-table">
              <thead>
                <tr>
                  <th>Session Start</th>
                  <th>Session End</th>
                  <th>Status</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {accessLogs.map((log) => {
                  const loginTime = new Date(log.login_time);
                  const logoutTime = log.logout_time
                    ? new Date(log.logout_time)
                    : null;

                  const duration = logoutTime
                    ? Math.max(
                        0,
                        Math.round((logoutTime - loginTime) / (1000 * 60))
                      )
                    : null;

                  return (
                    <tr key={log.logid}>
                      <td>
                        {loginTime.toLocaleDateString("en-AU", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        {log.logout_time
                          ? new Date(log.logout_time).toLocaleString("en-AU", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }) : "Still Logged In"}
                      </td>

                      <td>
                        <span
                          className={`access-log-status ${
                            logoutTime ? "status-completed" : "status-active"
                          }`}
                        >
                          {logoutTime ? "Completed" : "Active"}
                        </span>
                      </td>
                      <td>
                        {duration !== null
                          ? duration === 0
                            ? "Less than a minute"
                            : `${duration} ${
                                duration === 1 ? "minute" : "minutes"
                              }`
                          : "Current session"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty-logs">
              <p>No access history available</p>
            </div>
          )}
        </div>
      </TabPanel>
    </Tabs>
  );
}

export default ProfileTabs;
