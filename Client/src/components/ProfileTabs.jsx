import { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FaBoxOpen, FaFileInvoice, FaStar, FaUser } from "react-icons/fa";
import { fetchGet } from "@/api"; // Assuming you have a fetch utility
import { toast } from "react-hot-toast";
import "react-tabs/style/react-tabs.css";

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
  { icon: <FaUser />, label: "Access Log" },
];

function ProfileTabs() {
  const [tabIndex, setTabIndex] = useState(0);
  const [accessLogs, setAccessLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  useEffect(() => {
    if (tabIndex === 3) {
      // Fetch access logs when the "Access Log" tab is selected
      const fetchAccessLogs = async () => {
        setLoading(true);
        try {
          const response = await fetchGet("access-logs"); // Replace with your API endpoint
          setAccessLogs(response.data);
        } catch (error) {
          toast.error("Failed to fetch access logs.");
        } finally {
          setLoading(false);
        }
      };

      fetchAccessLogs();
    }
  }, [tabIndex]);

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

      {/* Access Log Tab */}
      <TabPanel>
        <h1 className="access-log-title">Access Logs</h1>
        {loading ? (
          <p>Loading...</p>
        ) : accessLogs.length > 0 ? (
          <table className="access-log-table">
            <thead>
              <tr>
                <th>Login Time</th>
                <th>Logout Time</th>
              </tr>
            </thead>
            <tbody>
              {accessLogs.map((log) => (
                <tr key={log.logid}>
                  <td>{new Date(log.login_time).toLocaleString()}</td>
                  <td>
                    {log.logout_time
                      ? new Date(log.logout_time).toLocaleString()
                      : "Still Logged In"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-msg">You don’t have any access logs yet.</p>
        )}
      </TabPanel>
    </Tabs>
  );
}

export default ProfileTabs;
