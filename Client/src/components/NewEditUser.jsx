import React, { useState } from "react";
import { Table, Input, Space, Button } from "antd";

const { Column } = Table;

export const NewEditUser = ({ data }) => {
  // Local states for holding the values the user types
  const [fullNameInput, setFullNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  
  // State to store the filters applied when the Search button is clicked
  const [appliedFilters, setAppliedFilters] = useState({
    fullName: "",
    phone: "",
  });

  // Called when the Search button is pressed:
  const handleSearch = () => {
    setAppliedFilters({
      fullName: fullNameInput,
      phone: phoneInput,
    });
  };

  // Filtering logic:
  const filteredData = data.filter(item => {
    // Check name: case-insensitive partial match
    const nameMatch =
      appliedFilters.fullName === "" ||
      (item.name &&
        item.name.toLowerCase().includes(appliedFilters.fullName.toLowerCase()));

    // Convert phone to a string and pad it to 10 digits with leading zeros.
    const phoneStr = item.phone ? item.phone.toString().padStart(10, "0") : "";
    // Check phone: simple substring search (exact digits as stored)
    const phoneMatch =
      appliedFilters.phone === "" ||
      phoneStr.includes(appliedFilters.phone);

    return nameMatch && phoneMatch;
  });

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Full Name"
          value={fullNameInput}
          onChange={(e) => setFullNameInput(e.target.value)}
          style={{ width: 200 }}
        />
        <Input
          placeholder="Phone Number"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          style={{ width: 200 }}
        />
        <Button onClick={handleSearch} type="primary">
          Search
        </Button>
      </Space>
      <Table dataSource={filteredData} rowKey="userid">
        <Column title="Email" dataIndex="email" key="email" />
      </Table>
    </>
  );
};
