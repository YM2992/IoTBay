import { useContext, useEffect, useState } from 'react';
import { Table, Button, Space, Input, Spin, Alert } from 'antd';
import { getSuppliers, updateSupplier } from '@/api/Supplier';
import { AppContext } from "@/context/AppContext";

const ViewSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCompany, setSearchCompany] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const [toggleMode, setToggleMode] = useState(false); // Track toggle activation mode
  const { token } = useContext(AppContext);

  // Fetch suppliers from the database
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

  // Toggle the activation status of a supplier
  const toggleActivation = async (supplier) => {
    try {
      const updatedSupplier = { ...supplier, activate: !supplier.activate }; // Toggle the activate value
      await updateSupplier(supplier.supplierid, updatedSupplier, token); // Update in the database
      const data = await getSuppliers(token); // Refresh the supplier list
      setSuppliers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter suppliers based on search terms
  const filteredResults = suppliers.filter((supplier) =>
    supplier.companyName.toLowerCase().includes(searchCompany.toLowerCase()) &&
    supplier.contactName.toLowerCase().includes(searchContact.toLowerCase())
  );

  // Define table columns
  const columns = [
    { title: 'ID', dataIndex: 'supplierid', key: 'ID' },
    { title: 'Contact Name', dataIndex: 'contactName', key: 'contactName' },
    { title: 'Company Name', dataIndex: 'companyName', key: 'companyName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <span style={{ color: record.activate ? 'green' : 'red', fontWeight: 'bold' }}>
          {record.activate ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        toggleMode ? (
          <Button
            type="link"
            onClick={() => toggleActivation(record)}
            style={{ color: record.activate ? 'red' : 'green' }}
          >
            {record.activate ? 'Deactivate' : 'Activate'}
          </Button>
        ) : (          
        <>
          <Button type="link" onClick={() => openModal(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record.supplierid)}>Delete</Button>
        </>
        )
      ),
    },
  ];

  if (loading) return <Spin tip="Loading suppliers..." />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  return (
    <div>
      <h1>Suppliers</h1> 
      <Space size={20} style={{ marginBottom: 16 }}> 
        <Button type="primary" onClick={() =>{}}>Search Bar</Button>        
        <Input
          placeholder="Search by Contact Name"
          value={searchContact}
          onChange={(e) => setSearchContact(e.target.value)}
          style={{ width: 300 }}
        />
        <Input
          placeholder="Search by Company"
          value={searchCompany}
          onChange={(e) => setSearchCompany(e.target.value)}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          danger
          onClick={() => setToggleMode(!toggleMode)} // Toggle the mode
        >
          {toggleMode ? 'Disable Toggle Mode' : 'Enable Toggle Mode'}
        </Button>
      </Space>
      <Table
        dataSource={filteredResults}
        columns={columns}
        rowKey="supplierid"
        bordered
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ViewSuppliers;