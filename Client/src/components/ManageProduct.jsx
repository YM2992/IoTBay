import { Table } from "antd";
import UpdateProductModal from "./UpdateProductModal";
import AddProduct from "./AddProduct";

const { Column } = Table;

function ManageProduct({ data, refetch }) {
  return (
    <>
      <AddProduct refetch={refetch} />

      <Table dataSource={data} rowHoverable rowKey="productid">
        <Column title="ID" dataIndex="productid" key={"productID"} />
        <Column title="Name" dataIndex="name" key="productName" />
        <Column title="Price" dataIndex="price" key="price" />

        <Column title="Quantity" dataIndex="quantity" key="quantity" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Image" dataIndex="image" key="image" />
        <Column
          title="Available"
          dataIndex="available"
          key="available"
          render={(value) => (value === 1 ? "True" : "False")}
        />

        <Column
          title="Action"
          key="action"
          render={(_, record) => (
            <>
              <UpdateProductModal refetch={refetch} key={record.productid} product={record} />
            </>
          )}
        />
      </Table>
    </>
  );
}

export default ManageProduct;
