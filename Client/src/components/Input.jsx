import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
function Input({ field, func, value, type = "text" }) {
  const [show, setShow] = useState(type !== "password");
  const isPassword = type === "password";

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <input
        style={{ marginBottom: "1rem" }}
        value={value}
        placeholder={field}
        type={isPassword ? (show ? "text" : "password") : value}
        className="input-field"
        onChange={(e) => func(e.target.value)}
        required
      ></input>
      {isPassword && (
        <p
          onClick={() => setShow(!show)}
          style={{ position: "absolute", right: "10px", lineHeight: "2.3rem", margin: "auto" }}
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </p>
      )}
    </div>
  );
}
export default Input;
