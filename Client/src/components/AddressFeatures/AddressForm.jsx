import { Input } from "antd";

function AddressForm({ handleChange }) {
  return (
    <>
      <label>Address</label>
      <Input placeholder="address" onChange={handleChange("address")} />

      <label>Recipient</label>
      <Input placeholder={"recipient"} onChange={handleChange("recipient")} />

      <label>Phone</label>
      <Input placeholder={"phone"} onChange={handleChange("phone")} />
    </>
  );
}

export default AddressForm;
