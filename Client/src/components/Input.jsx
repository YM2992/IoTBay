function Input({ field, func, value }) {
  return (
    <input
      style={{ marginBottom: "1rem" }}
      type={field}
      placeholder={field}
      value={value}
      className="input-field"
      onChange={(e) => func(e.target.value)}
      required
    />
  );
}

export default Input;
