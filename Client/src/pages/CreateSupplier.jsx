import { useState } from "react";
import Input from "../components/Input";
import { toast } from "react-hot-toast";
import { strictEmailRegex, numberRegex } from "../utils/helper";
import { fetchPost, checkEmail, optionMaker, API_ROUTES } from "../api";

import "./Login.css";

function CreateSupplier({ refetch }) {
  const [agent, setAgent] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const inputMenu = [
    {
      field: "Contact Name",
      value: agent,
      func: setAgent,
    },
    {
      field: "Company",
      value: company,
      func: setCompany,
    },
    {
      field: "Business email",
      value: email,
      func: setEmail,

    },
    {
      field: "Business Address",
      value: address,
      func: setAddress,
    },
  ];

  const clear = () => {
    setAgent("");
    setCompany("");
    setEmail("");
    setAddress("");
  };

  const handleSubmit = async () => {
    // Field guards
    if (!agent.trim() || !company.trim() || !email.trim() || !address.trim()) {
      return toast.error("All fields must be filled");
    }
    if (!strictEmailRegex.test(email)) return toast.error("Email is not valid");
    // if address test?? 
    // Check if email already exist
    const result = await checkEmail(email);
    if (!result || result.exist) return toast.error("Email already exist");

    const data = {
        // I added the column name of queries.sql table, tell me what I am supposed to do
      contactName : agent, // maps contactName
      companyName : company, // maps company to database colum
      email,
      address,
    };

    try {
      await fetchPost(API_ROUTES.supplier.create, optionMaker(data));
                // "supplier/create", optionMaker(data))
      toast.success("Successfully added new supplier!");
      clear();
      refetch();
    } catch (error) {
      console.log(error);
      return toast.error("Failed to add supplier, try again later");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="center-content">
          <div className="profile-icon">
            <img src="/assets/IoTBay_Logo.png" alt="IoTBay" />
          </div>
          <h2 className="welcome-text">Admin <br/> Create Supplier</h2>
        </div>

        <div className="input-container">
          {inputMenu.map((input) => (
            <Input
              key={input.field}
              field={input.field}
              value={input.value}
              func={input.func}
              type={input.type ? input.type : "text"}
            />
          ))}
          <button onClick={handleSubmit} className="sign-in-btn">
            Add Supplier
          </button>
        </div>
      </div>
    </div>
  );
}
export default CreateSupplier;
