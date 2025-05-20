import UpdateAddressModal from "./UpdateAddressModel";
import { Radio, Typography } from "antd";
const { Text } = Typography;

function AddressSelection({ address, refetch }) {
  return (
    <Radio
      key={`Add_${address.addressid}`}
      value={`addressid-${address.addressid}`}
      style={{ width: "100%" }}
    >
      <div className="payment-card-content-wrapper">
        <div style={{ maxWidth: "60%" }}>
          <Text>Address: {address.address}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "0.9em" }}>
            Recipient: {address.recipient}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: "0.9em" }}>
            Phone: {address.phone}
          </Text>
        </div>
        <UpdateAddressModal ButtonType="link" addressItem={address} refetch={refetch} />
      </div>
    </Radio>
  );
}

export default AddressSelection;
