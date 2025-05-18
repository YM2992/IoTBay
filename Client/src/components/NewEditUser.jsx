//jin

import React, { useState,useContext } from "react";
import { Table, Input, Space, Button } from "antd";
import { fetchPost, optionMaker } from "@/api";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import './NewEditUser.css';


const { Column } = Table;

export const NewEditUser = ({ data, refetch }) => {
  const { token } = useContext(AppContext);
  
  const [editedNames, setEditedNames] = useState({});
  const [isEditing, setIsEditing] = useState({});
  const [editedPhones, setEditedPhones] = useState({});
  const [editemail,seteditemail] = useState({});
  const [searchParams,setSearchParams] = useSearchParams();
  
  const fullNameInput = searchParams.get("name") || "";
  const phoneInput = searchParams.get("phone")||"";
  
  
  const [nameSearch,setNameSearch] = useState(fullNameInput);
  const [phoneSearch,setPhoneSearch ]=useState(phoneInput);

  

  const handleToggle = async (userid) =>{  
      await handleSubmit("user/toggleActivation",{userid},"PATCH","User Status successfully changed");
    
  };


  
  const handleDelete = async (userid)=>{
    await handleSubmit("user/delete", {userid},"DELETE", "User has been deleted");
  }

  

  const handleSubmit = async (url, data, method, message) => {
      try {
        await fetchPost(url, optionMaker(data, method, token));
        toast.success(message);
      } catch (error) {
        toast.error(error.message || "An error occurred");
      } finally {
        refetch();
      }
    };
  
  const handleEdit = (userid,name,phone,email) => {
  
    setIsEditing((prev) => ({ ...prev, [userid]: true }));
    setEditedNames((prev) => ({ ...prev, [userid]: name }));
    setEditedPhones((prev) => ({ ...prev, [userid]: phone }));
    seteditemail((prev)=> ({...prev,[userid]:email}));
  };

  const handleSave = async (userid, newName,newPhone,newEmail) => {
    await handleSubmit("user/usermanage",{ userid, name: newName, phone: newPhone ,email:newEmail}, "PATCH", "Successfully updated user");
    setIsEditing((prev) => ({ ...prev, [userid]: false })); 
    
  };
  
  

  
  const handleSearch = () => {

    setSearchParams({name:nameSearch.trim(),phone:phoneSearch.trim()});
    
  };

  
  const filteredData = data.filter(item => {
    
    const nameMatch =
      fullNameInput === "" ||
      (item.name &&
        item.name.toLowerCase().includes(fullNameInput.toLowerCase()));

    
    const phoneStr = item.phone ? item.phone.toString() : "";
    
    const phoneMatch =
      phoneInput === "" ||
      phoneStr.includes(phoneInput );

    return nameMatch && phoneMatch;
  });

  return (
    
    <>
      <Space size ={24} style={{ marginBottom: 16 }}>
        <Input
          placeholder="Full Name"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Input
          placeholder="Phone Number"
          value={phoneSearch}
          onChange={(e) => setPhoneSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Button onClick={handleSearch} type="primary">
          Search
        </Button>
        <Button onClick={()=>{
          setNameSearch("");
          setPhoneSearch("");
          setSearchParams({name:"", phone: "" });
          refetch();
        }}>Reset</Button>
      </Space>





      <Table className="myTable" dataSource={filteredData} rowKey="userid">
        <Column title="Email" dataIndex="email" key="email"
        render={(text,record)=> isEditing[record.userid]? (
          <Input value={editemail[record.userid]} onChange={(e)=> seteditemail({...editemail,[record.userid]:e.target.value})}
          
          />
        ):(
          <span>{record.email}</span>
        )

        }

         />
        <Column title="Full Name" dataIndex="name" key="name"
        render={(text, record) =>  isEditing[record.userid] ? (
        <Input
         value={editedNames[record.userid??record.name] } onChange={(e) => setEditedNames({ ...editedNames, [record.userid]: e.target.value })}  
        />
         ) : (
        <span>{record.name}</span>
         )}
  />

          <Column
          title="Phone Number" dataIndex="phone" key="phone"
          render={(text, record) => 
            isEditing[record.userid] ? (
              <Input
                value={editedPhones[record.userid]} onChange={(e) => setEditedPhones({ ...editedPhones, [record.userid]: e.target.value })}
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
             <Button onClick={() => handleSave(record.userid, editedNames[record.userid] || record.name, editedPhones[record.userid] || record.phone,editemail[record.userid]|| record.email)}>
               Save
             </Button>
             <Button
                onClick={() => handleToggle(record.userid)}
                type="default"
              >
                Activate/Deactivate
              </Button>
              <Button onClick={() => handleDelete(record.userid)}>
                 Delete
             </Button>
             </Space>
               ) : (
              <Button onClick={() => handleEdit(record.userid,record.name,record.phone,record.email)}>Edit</Button>

                 )
              )}

          
        />
      </Table>
    </>
  );
};
