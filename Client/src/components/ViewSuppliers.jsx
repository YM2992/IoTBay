import { useContext, useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Space, Input, Spin, Alert } from 'antd';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '@/api/Supplier';
import { AppContext } from "@/context/AppContext";

const ViewSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCompany, setSearchCompany] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form] = Form.useForm();
  const { token } = useContext(AppContext);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers(token);
        setSuppliers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, [token]);

  const handleSave = async (values) => {
    try {
      setLoading(true);
      if (editingSupplier) {
        await updateSupplier(editingSupplier.supplierid, values, token);
      } else {
        await createSupplier(values, token);
      }
      const data = await getSuppliers(token);
      setSuppliers(data);
      form.resetFields();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteSupplier(id, token);
      const data = await getSuppliers(token);
      setSuppliers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (supplier) => {
    setEditingSupplier(supplier);
    setIsOpen(true);
    if (supplier) {
      form.setFieldsValue(supplier);
    } else {
      form.resetFields();
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingSupplier(null);
    form.resetFields();
  };

  // Filter suppliers based on both search terms
  const filteredResults = suppliers.filter((supplier) =>
    supplier.companyName.toLowerCase().includes(searchCompany.toLowerCase()) &&
    supplier.contactName.toLowerCase().includes(searchContact.toLowerCase())
  );

  const columns = [
    { title: 'ID', dataIndex: 'supplierid', key: 'ID' },
    { title: 'Contact Name', dataIndex: 'contactName', key: 'contactName' },
    { title: 'Company Name', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
      title: 'Status', key: 'status',
      render: (_, record) => (
        <span style={{ color: record.activate ? 'green' : 'red', fontWeight: 'bold' }}>
          {record.activate ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Actions', key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.supplierid)}>Delete</Button>
        </>
      ),
    },
  ];

  if (error) return <Alert message="Error" description={error} type="error" />;
  return (
    <div>
      <h1>Suppliers</h1>
      <Space size={20}>
      <Button type="primary" onClick={() =>{}} style={{ marginBottom: 16 }}>Search Bar</Button>
      <Input
        placeholder="Search by Company"
        value={searchCompany}
        onChange={(e) => setSearchCompany(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Input
        placeholder="Search by Contact Name"
        value={searchContact}
        onChange={(e) => setSearchContact(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Button type="primary" danger onClick={() => {}} style={{ marginBottom: 16 }}> Toggle Activation</Button>
      </Space>


      <Table
        dataSource={filteredResults}
        columns={columns}
        rowKey="supplierid"
        bordered
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
        open={isOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            name="contactName"
            label="Contact Name"
            rules={[{ required: true, message: 'Please enter the contact name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="companyName"
            label="Company Name"
            rules={[{ required: true, message: 'Please enter the company name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter the email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter the address' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ViewSuppliers;