import React from "react";

function Input({ field, func }) {
  return (
    <input
      style={{ marginBottom: "1rem" }}
      type={field}
      placeholder={field}
      // value={value}
      className="input-field"
      onChange={(e) => func(e.target.value)}
      required
    />
  );
}

export default Input;
