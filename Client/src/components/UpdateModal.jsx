import { Button, Modal, Input, InputNumber } from "antd";
import { useState, useContext } from "react";
import { fetchPost, optionMaker } from "@/api";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

const { TextArea } = Input;
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Switch } from "antd";

const UpdateModal = ({ product, refetch }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { token } = useContext(AppContext);
  const [pro, setPro] = useState(product);
  const { productid, name, price, quantity, description, available, image } = pro;

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setPro(product);
    setOpen(false);
  };

  const handleOk = async () => {
    const isEqual = JSON.stringify(product) === JSON.stringify(pro);
    if (isEqual) {
      handleCancel();
      return toast.success("Nothing has changed");
    }

    const { productid, ...rest } = pro;
    const data = {
      productid,
      data: rest,
    };

    try {
      setConfirmLoading(true);
      await fetchPost("product/", optionMaker(data, "PATCH", token));
      toast.success("Successfully updated product");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setConfirmLoading(false);
      refetch();
      setOpen(false);
    }
  };

  const handleChange =
    (field, number = false) =>
    (e) => {
      const data = number ? e : e.target.value;
      setPro((prev) => ({
        ...prev,
        [field]: data,
      }));
    };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Manage
      </Button>
      <Modal
        title={`Product ${productid}`}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <label>Image Name</label>
        <Input placeholder={image} value={image} onChange={handleChange("image")} />

        <label>Name</label>
        <Input placeholder={name} value={name} onChange={handleChange("name")} />

        <label>Price</label>
        <InputNumber
          min={0}
          prefix="$"
          value={price}
          style={{ width: "100%" }}
          onChange={handleChange("price", true)}
        />

        <label>Quantity</label>
        <InputNumber
          min={0}
          value={quantity}
          style={{ width: "100%" }}
          onChange={handleChange("quantity", true)}
        />

        <label>Description</label>
        <TextArea
          value={description}
          placeholder="Controlled autosize"
          autoSize={{ minRows: 3, maxRows: 5 }}
          onChange={handleChange("description")}
        />

        <label style={{ display: "block" }}>Available to purchase</label>
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          value={available}
          // onChange={handleChange("available", true)}
          onChange={(e) => {
            setPro((prev) => ({
              ...prev,
              available: e ? 1 : 0,
            }));
          }}
        />
      </Modal>
    </>
  );
};

export default UpdateModal;
