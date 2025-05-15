import React from "react";
import { Space, Table, Tag } from "antd";
const { Column, ColumnGroup } = Table;
const data = [
  {
    key: "1",
    recipient: "Jeff R",
    address: "New York No. 1 Lake Park",
    phone: "123456789",
    tags: ["nice", "developer"],
    is_default: true,
  },
  {
    key: "2",
    recipient: "Jim B",
    address: "London No. 1 Lake Park",
    phone: "123456789",
    tags: ["loser"],
    is_default: false,
  },
  {
    key: "3",
    recipient: "Joe A",
    address: "Sydney No. 1 Lake Park",
    phone: "123456789",
    tags: ["cool", "teacher"],
    is_default: false,
  },
];

// ((SELECT userid FROM user WHERE email = 'yasir@test.com'), 'Yasir M', 'Unit 12, 20 Pacific Hwy, Hornsby NSW 2077', 0434567890, true);
const AddressBook = () => (
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
    <Column
      title="Action"
      key="action"
      render={(_, record) => (
        <Space size="middle">
          <a>Invite {record.lastName}</a>
          <a>Delete</a>
        </Space>
      )}
    />
  </Table>
);
export default AddressBook;
