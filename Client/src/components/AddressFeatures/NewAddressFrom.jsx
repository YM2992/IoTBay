import { useState, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { fetchPost, optionMaker } from "@/api";

import { Button, Modal, Input } from "antd";
import toast from "react-hot-toast";
import AddressForm from "./AddressForm";

function NewAddressFrom({ refetch }) {
  const [open, setOpen] = useState(false);
  const [addressItem, setAddressItem] = useState();
  const { token } = useContext(AppContext);

  const handleChange = (field) => (e) => {
    const data = e.target.value;
    setAddressItem((prev) => ({
      ...prev,
      [field]: data,
    }));
  };

  const onSubmit = async () => {
    const { recipient, phone, address } = addressItem;
    if (!recipient.trim() || !phone.trim() || !address.trim()) {
      return toast.error("All field must be filled");
    }

    try {
      await fetchPost("address/", optionMaker(addressItem, "POST", token));
      toast.success("Successfully added new address");
      handleCancel();
      if (refetch) refetch();
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to add new address");
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setAddressItem();
    setOpen(false);
  };

  return (
    <>
      <Button style={{ display: "block", margin: "1rem auto" }} type="primary" onClick={showModal}>
        Add new Address
      </Button>
      <Modal
        title={"Add new address"}
        open={open}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={onSubmit}>
            Add
          </Button>,
        ]}
      >
        <AddressForm handleChange={handleChange} />
      </Modal>
    </>
  );
}

export default NewAddressFrom;
