function Input({ field, func, value, type = "text" }) {
  return (
    <input
      style={{ marginBottom: "1rem" }}
      type={type}
      placeholder={field}
      value={value}
      className="input-field"
      onChange={(e) => func(e.target.value)}
      required
    />
  );
}

export default Input;
