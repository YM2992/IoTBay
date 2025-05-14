//jin

import React, { useState,useContext } from "react";
import { Table, Input, Space, Button } from "antd";
import { fetchPost, optionMaker } from "@/api";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

const { Column } = Table;

export const NewEditUser = ({ data, refetch }) => {
  const { token } = useContext(AppContext);
  
  const [editedNames, setEditedNames] = useState({});
  const [fullNameInput, setFullNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [isEditing, setIsEditing] = useState({});
  const [editedPhones, setEditedPhones] = useState({});


  const handleToggleActivation = async (userid) => {
    try {
      await fetchPost("user/toggleActivation", optionMaker({ userid }, "PATCH", token));
      
      toast.success("User activation status changed");
      refetch();
    } catch (error) {
      toast.error(error.message || "Error toggling activation");
    }
  };


  const handleDelete = async (userid) => {
    
    try {
      
      await fetchPost("user/delete", optionMaker({ userid }, "DELETE", token));
      toast.success("User deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error.message || "Error deleting user");
    }
  };

  const handleSubmit = async (data, method, message) => {
      try {
        
        await fetchPost("user/usermanage", optionMaker(data, method, token));
        toast.success(message);
      } catch (error) {
        toast.error(error.message || "An error occurred");
      } finally {
        
        
        
      }
    };
  
  const handleEdit = (userid,name,phone) => {
  
  setIsEditing((prev) => ({ ...prev, [userid]: true }));
  setEditedNames((prev) => ({ ...prev, [userid]: name }));
  setEditedPhones((prev) => ({ ...prev, [userid]: phone }));
};

const handleSave = async (userid, newName,newPhone) => {
  await handleSubmit({ userid, name: newName, phone: newPhone }, "PATCH", "Successfully updated user");
  setIsEditing((prev) => ({ ...prev, [userid]: false })); 
  refetch();
};
  
  const [appliedFilters, setAppliedFilters] = useState({
    fullName: "",
    phone: "",
  });

  
  const handleSearch = () => {
    setAppliedFilters({
      fullName: fullNameInput,
      phone: phoneInput,
    });
  };

  
  const filteredData = data.filter(item => {
    
    const nameMatch =
      appliedFilters.fullName === "" ||
      (item.name &&
        item.name.toLowerCase().includes(appliedFilters.fullName.toLowerCase()));

    
    const phoneStr = item.phone ? item.phone.toString().padStart(10, "0") : "";
    
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
        <Column
  title="Full Name"
  dataIndex="name"
  key="name"
  render={(text, record) => 
    isEditing[record.userid] ? (
    <Input
      value={editedNames[record.userid??record.name] }
      onChange={(e) => setEditedNames({ ...editedNames, [record.userid]: e.target.value })}  
      />
      ) : (
      <span>{record.name}</span>
    )
  }
  />

          <Column
          title="Phone Number"
          dataIndex="phone"
          key="phone"
          render={(text, record) => 
            isEditing[record.userid] ? (
              <Input
                value={editedPhones[record.userid]}
                onChange={(e) => setEditedPhones({ ...editedPhones, [record.userid]: e.target.value })}
              />
            ) : (
              <span>{record.phone}</span>
            )
          }
        />
        <Column
          title="Status"
          key="status"
          render={(text, record) => (
            <span style={{ color: record.activate ? 'green' : 'red', fontWeight: 'bold' }}>
              {record.activate ? 'Active' : 'Inactive'}
            </span>
          )}
        />

        <Column title="Role" dataIndex="role" key="role" />

  
  

        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            isEditing[record.userid] ?(
              <Space>
             <Button onClick={() => handleSave(record.userid, editedNames[record.userid] || record.name, editedPhones[record.userid] || record.phone)}>
               Save
             </Button>
             <Button
                onClick={() => handleToggleActivation(record.userid)}
                type="default"
              >
                Activate/Deactivate
              </Button>
             <Button onClick={() => handleDelete(record.userid)}>
            Delete
          </Button>
          </Space>
            ) : (
      <Button onClick={() => handleEdit(record.userid,record.name,record.phone)}>Edit</Button>

    )
          )}

          
        />
      </Table>
    </>
  );
};
