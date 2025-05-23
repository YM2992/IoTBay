import { useState, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { fetchPost, optionMaker } from "@/api";

import { Button, Modal, Input, InputNumber, Switch, Popconfirm } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

const { TextArea } = Input;

const UpdateProductModal = ({ product, refetch }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { token } = useContext(AppContext);
  const [pro, setPro] = useState(product);
  const { productid, name, price, quantity, description, available, image } = pro;

  const handleSubmit = async (data, method, message) => {
    try {
      setConfirmLoading(true);
      await fetchPost("product/", optionMaker(data, method, token));
      toast.success(message);
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setConfirmLoading(false);
      refetch();
      setOpen(false);
    }
  };

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

    handleSubmit(data, "PATCH", "Successfully updated product");
  };

  const confirm = (e) => {
    handleSubmit({ productid }, "DELETE", "Successfully deleted product");
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
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Popconfirm
            key="delete"
            title="Delete the product"
            description="Are you sure to delete this product?"
            onConfirm={confirm}
            okText="Yes"
            cancelText="No"
          >
            <Button key="deleteBtn" type="primary" danger loading={confirmLoading}>
              Delete
            </Button>
          </Popconfirm>,

          <Button key="submit" type="primary" loading={confirmLoading} onClick={handleOk}>
            Update
          </Button>,
        ]}
      >
        <label>Image Link</label>
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

export default UpdateProductModal;
