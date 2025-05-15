import { Button, Popconfirm, Space, Table, Tag } from "antd";
import { useFetch } from "@/hook/useFetch";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import LoadingSpinner from "./LoadingSpinner";
import UpdateAddressModal from "./AddressFeatures/UpdateAddressModel";

import NewAddressFrom from "./AddressFeatures/NewAddressFrom";

import { fetchPost, optionMaker } from "@/api";
import toast from "react-hot-toast";

const { Column } = Table;

function AddressBooks() {
  const { token } = useContext(AppContext);

  const { data, error, loading, refetch } = useFetch("address", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const confirm = async (id) => {
    try {
      await fetchPost("address/", optionMaker({ addressid: id }, "DELETE", token));
      toast.success("Successfully updated product");
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      refetch();
    }
  };

  const onSetDefault = async (addressid) => {
    const data = {
      addressid,
      data: { is_default: 1 },
    };

    try {
      await fetchPost("address/", optionMaker(data, "PATCH", token));
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      refetch();
    }
  };

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (error) {
    return <LoadingSpinner tip="Something went wrong, please try again later"></LoadingSpinner>;
  }

  return (
    <>
      <Table dataSource={data}>
        <Column title="Recipient" dataIndex="recipient" key="recipient" />
        <Column title="Address" dataIndex="address" key="address" />
        <Column title="Phone" dataIndex="phone" key="phone" />

        <Column
          title="Tags"
          dataIndex="is_default"
          key="is_default"
          render={(is_default) => <>{is_default ? <Tag color="green">Default</Tag> : ""}</>}
        />
        {/* Update Modal */}
        <Column
          title="Action"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <UpdateAddressModal refetch={refetch} key={record.addressid} addressItem={record} />

              <Popconfirm
                key="delete"
                title="Delete the address"
                description="Are you sure to delete this address"
                onConfirm={() => {
                  confirm(record.addressid);
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button key="deleteBtn" color="danger" variant="outlined">
                  Delete
                </Button>
              </Popconfirm>

              {!record.is_default && (
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => onSetDefault(record.addressid)}
                >
                  Set Default
                </Button>
              )}
            </Space>
          )}
        />
      </Table>

      {/* Create Modal */}
      <div style={{ marginTop: "1rem", width: "100%", display: "flex" }}>
        <NewAddressFrom refetch={refetch} />
      </div>
    </>
  );
}

export default AddressBooks;
