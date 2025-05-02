import { Button, Modal, Input, InputNumber } from "antd";
import { useState, useContext } from "react";
import { fetchPost, optionMaker } from "@/api";
import { AppContext } from "@/context/AppContext";
import toast from "react-hot-toast";

const { TextArea } = Input;

const defaultValue = {
  name: "",
  price: 1,
  quantity: 0,
  description: "",
  image: "default_image",
  available: true,
};

function AddProduct({ refetch }) {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { token } = useContext(AppContext);
  const [product, setProduct] = useState(defaultValue);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setProduct(defaultValue);
    setOpen(false);
  };

  const handleOk = async () => {
    Object.entries(product).forEach(([key, value]) => {
      if (typeof value !== "string") return;
      if (value.trim() === "") return toast.error(`${key} can not be empty`);
    });

    try {
      setConfirmLoading(true);
      await fetchPost("product/", optionMaker(product, "POST", token));
      toast.success("Successfully added new product");
      setProduct(defaultValue);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add new product");
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
      setProduct((prev) => ({
        ...prev,
        [field]: data,
      }));
    };

  return (
    <>
      <Button onClick={showModal} size="large" type="primary" style={{ marginBottom: "1rem" }}>
        Add New Product
      </Button>
      <Modal
        title={"Add new product"}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <label>Name</label>
        <Input
          placeholder={"please enter product name"}
          value={product.name}
          onChange={handleChange("name")}
        />

        <label>Price</label>
        <InputNumber
          min={0.01}
          prefix="$"
          defaultValue={1}
          value={product.price}
          style={{ width: "100%" }}
          onChange={handleChange("price", true)}
        />

        <label>Quantity</label>
        <InputNumber
          min={0}
          value={product.quantity}
          defaultValue={1}
          style={{ width: "100%" }}
          onChange={handleChange("quantity", true)}
        />

        <label>Description</label>
        <TextArea
          value={product.description}
          placeholder="Controlled autosize"
          autoSize={{ minRows: 3, maxRows: 5 }}
          onChange={handleChange("description")}
        />

        <label>Image Name</label>
        <Input
          placeholder={"default_image"}
          defaultValue={"default_image"}
          onChange={handleChange("image")}
        />
      </Modal>
    </>
  );
}

export default AddProduct;
