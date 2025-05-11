import React, { useEffect, useState } from "react";
import { fetchGet } from "@/api";
import { toast } from "react-hot-toast";
import "./AccessLog.css"; // Create a CSS file for styling

const AccessLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetchGet("access-logs");
        setLogs(response.data);
      } catch (error) {
        toast.error("Failed to fetch access logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="access-log-container">
      <h1 className="access-log-title">Access Logs</h1>
      {loading ? (
        <p>Loading...</p>
      ) : logs.length > 0 ? (
        <table className="access-log-table">
          <thead>
            <tr>
              <th>Login Time</th>
              <th>Logout Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
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
        <p>No access logs found.</p>
      )}
    </div>
  );
};

export default AccessLog;
