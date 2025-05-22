/*
import React, { useState, useContext } from "react";
import { Table, Input, Space, Button } from "antd";
import { fetchPost, optionMaker } from "@/api";
*/ // This has failed me thus far.. 
import { useContext, useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Spin, Alert } from 'antd';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '@/api/Supplier';
import { AppContext } from "@/context/AppContext";

const ViewSuppliers = () => {

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCom, setSearchCom] = useState('');
  //const [isModalVisible, setIsModalVisible] = useState(false); // deprecated 
  const [isOpen, setIsOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form] = Form.useForm();
  const {token} = useContext(AppContext);

  console.log("Token:",token);
 // const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        console.log("TOKEN:", token)
        const data = await getSuppliers(token);
        console.log("Fetched Suppliers:", data); //This works
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
        await updateSupplier(editingSupplier.supplierid, values, token); // This will now use PATCH
      } else {
        await createSupplier(values, token);
      }      
      setIsIsOpen(false);
      form.resetFields();
      const data = await getSuppliers(token); // refresh list
      setSuppliers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };  
  
  // Old PUT method found at old-Handle local

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
  const openModal = (supplier) => {    
    //console.log(editingSupplier.supplierid); // Is id stored??
    console.log(supplier);
    setEditingSupplier(supplier);
    setIsOpen(true);
    if (supplier) {
      form.setFieldsValue(supplier);
    } else {
      form.resetFields();
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsOpen(false);
    setEditingSupplier(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'supplierid', // connects with database
      key: 'ID',

    },
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
      render: (_, record) => {
        console.log("Record for Edit:", record); // Log the record being passed
         return (
           <>
             <Button type="link" onClick={() => openModal(record)}>
               Edit
             </Button>
             <Button type="link" danger onClick={() => handleDelete(record.supplierid)}>
               Delete
             </Button>
           </>
         );
       },
     },
   ];

  if (loading) {
    return <Spin tip="Loading suppliers..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" />;
  }  

  return (
    <div>
      <h1>Suppliers</h1>
      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Add Supplier
      </Button>
      <Input placeholder='Search by Company' value={searchCom}
      onChange= {(e) => setSearchTerm(e.target.value)}
      style={{ marginBottom: 16, width: 300 }} 
      />
      <Table
        dataSource={suppliers}
        columns={columns}
        rowKey="supplierid"
        bordered
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
        open={isOpen} //visible was  deprecated
        onCancel={closeModal}
        onOk={() => form.submit()} // ERROR 
      >
        <Form form={form} layout="vertical" onFinish={handleSave}> 
          <Form.Item  //maybe the issue is above. handle.Save
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

