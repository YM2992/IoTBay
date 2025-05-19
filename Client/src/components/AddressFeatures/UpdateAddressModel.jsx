import { useState, useContext, useEffect } from "react";
import { AppContext } from "@/context/AppContext";
import { fetchPost, optionMaker } from "@/api";

import { Button, Modal, Input } from "antd";
import toast from "react-hot-toast";

const { TextArea } = Input;

const UpdateAddressModal = ({ addressItem, refetch, ButtonType = "outlined" }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { token } = useContext(AppContext);
  const [add, setAdd] = useState(addressItem);

  useEffect(() => {
    setAdd(addressItem);
  }, [open]);

  const { addressid, recipient, phone, address } = add;

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setAdd(address);
    setOpen(false);
  };

  const handleOk = async () => {
    const isEqual = JSON.stringify(address) === JSON.stringify(add);
    if (isEqual) {
      handleCancel();
      return toast.success("Nothing has changed");
    }

    const { addressid, ...rest } = add;
    const data = {
      addressid,
      data: rest,
    };

    try {
      setConfirmLoading(true);
      await fetchPost("address/", optionMaker(data, "PATCH", token));
      toast.success("Successfully updated address");
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setConfirmLoading(false);
      if (refetch) refetch();
      setOpen(false);
    }
  };

  const handleChange =
    (field, number = false) =>
    (e) => {
      const data = number ? e : e.target.value;
      setAdd((prev) => ({
        ...prev,
        [field]: data,
      }));
    };

  return (
    <>
      <Button color="primary" variant={ButtonType} onClick={showModal}>
        Update
      </Button>
      <Modal
        title={`Address ${addressid}`}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" loading={confirmLoading} onClick={handleOk}>
            Update
          </Button>,
        ]}
      >
        <label>Address</label>
        <Input placeholder={address} value={address} onChange={handleChange("address")} />

        <label>Recipient</label>
        <Input placeholder={recipient} value={recipient} onChange={handleChange("recipient")} />

        <label>Phone</label>
        <Input placeholder={phone} value={phone} onChange={handleChange("phone")} />
      </Modal>
    </>
  );
};

export default UpdateAddressModal;
