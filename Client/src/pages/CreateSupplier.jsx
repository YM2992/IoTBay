import { useContext, useEffect, useState } from "react";
import Input from "../components/Input";
import { toast } from "react-hot-toast";
import { strictEmailRegex } from "../utils/helper";
import { API_ROUTES, fetchPost, checkEmail, optionMaker} from "../api";
import { createSupplier } from "@/api/Supplier";
// maybe use SuoolierController directly?
import { AppContext } from "@/context/AppContext"; // Should provide token context - no more null roles!

import "./Login.css";

function CreateSupplier({ refetch }) { 
  const [agent, setAgent] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const {token} = useContext(AppContext); // authenticate

  useEffect (() => {
    console.log("TOKEN:", token); // authenticate use?
    }, [token]);

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
  if (!agent.trim() || !company.trim() || !email.trim() || !address.trim()) {
    return toast.error("All fields must be filled");
  }
  if (!strictEmailRegex.test(email)) return toast.error("Email is not valid");

  // Check if email already exists
  const result = await checkEmail(email);
  if (!result || result.exist) return toast.error("Email already exists");

  const data = {
    contactName: agent, // Maps to contactName in the database
    companyName: company, // Maps to companyName in the database
    email,
    address,
  };

  try {
    // Use the createSupplier function to make the API call
    await createSupplier(data, token);
    toast.success("Successfully added new supplier!");
    clear(); // Clear the form fields
    refetch(); // Refresh the supplier list
  } catch (error) {
    console.error("Error creating supplier:", error);
    toast.error("Failed to add supplier, try again later");
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
