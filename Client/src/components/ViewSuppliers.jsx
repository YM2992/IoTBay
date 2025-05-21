/*
import React, { useState, useContext } from "react";
import { Table, Input, Space, Button } from "antd";
import { fetchPost, optionMaker } from "@/api";
*/ // This has failed me thus far.. 
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Alert } from 'antd';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '@/api/Supplier';

const ViewSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form] = Form.useForm();

  const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

  // Fetch suppliers on component mount
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

  // Handle form submission for creating/updating a supplier
  const handleSave = async (values) => {
    try {
      setLoading(true);
      if (editingSupplier) {
        await updateSupplier(editingSupplier.supplierid, values, token);
      } else {
        await createSupplier(values, token);
      }
      setIsModalVisible(false);
      form.resetFields();
      const data = await getSuppliers(token);
      setSuppliers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a supplier
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

  // Open the modal for adding/editing a supplier
  const openModal = (supplier = null) => {
    setEditingSupplier(supplier);
    setIsModalVisible(true);
    if (supplier) {
      form.setFieldsValue(supplier);
    } else {
      form.resetFields();
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsModalVisible(false);
    setEditingSupplier(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Contact Name',
      dataIndex: 'contactName',
      key: 'contactName',
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.supplierid)}>
            Delete
          </Button>
        </>
      ),
    },
  ];
  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }

  return (
    <div>
      <h1>Suppliers</h1>
      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Add Supplier
      </Button>
      <Table
        dataSource={suppliers}
        columns={columns}
        rowKey="supplierid"
        bordered
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
        visible={isModalVisible}
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

