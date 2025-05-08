import React, { useEffect, useState, useContext } from "react";
import { Spin } from "antd";
import { NewEditUser as EditUser } from "@/components/NewEditUser"; // Named import from your component
import { AppContext } from "@/context/AppContext";
import { urlMaker } from "../api";

const EditUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AppContext);

  useEffect(() => {
    console.log("Decoded Token:", atob(token.split('.')[1]));
    console.log("Stored Token:", token);
    fetch(urlMaker("user"), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) { // Check if the response is OK
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setUsers(data.data);
        } else {
          console.error("API Error:", data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <Spin tip="Loading users..." />;
  }

  return (
    <div className="edit-user-page">
      <h1>Edit User</h1>
      <EditUser data={users} />
    </div>
  );
};

export default EditUserPage;
