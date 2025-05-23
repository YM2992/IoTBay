import { useContext, useEffect, useState } from 'react';
import { Table, Button, Space, Input, Alert, Modal, Form } from 'antd';
import { getSuppliers, updateSupplier, deleteSupplier, toggleSupplierActivation } from '@/api/Supplier';
import { API_ROUTES, urlMaker } from '@/api/index'; // end point is found this way?
import { AppContext } from "@/context/AppContext";
import { fetchPost, optionMaker } from '@/api';
import { toast, Toaster  } from "react-hot-toast";

const ViewSuppliers = () => { 
  const [suppliers, setSuppliers] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [searchCompany, setSearchCompany] = useState(''); 
  const [searchContact, setSearchContact] = useState(''); 
  const [toggleMode, setToggleMode] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);  // isModalvisible is outdated
  const [editingSupplier, setEditingSupplier] = useState(null); 
  const { token } = useContext(AppContext); 
  const [form] = Form.useForm();

  // Creating elements for passin  
  const [agent, setAgent] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const fetchSuppliers = async (values) => { 
    try { 
      const data = await getSuppliers(token); 
      setSuppliers(data); 
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    } 
  }; 
  //CRUD operations
  useEffect(() => { 
    fetchSuppliers(); 
  }, [token]);

  const openModal = (supplier) => { 
    setEditingSupplier(supplier); 
    setIsModalOpen(true); 
    form.setFieldsValue(supplier); 
  };

  /// ** Please fix  replace supplier with form data...
  const handleSave = async (formValues) => {       
   const data = {
     supplierid : formValues.supplierid,
    update : {
      contactName : formValues.contactName,
      companyName : formValues.companyName,
      email : formValues.email,
      address : formValues.address,}
      // activate
   }   
    try{ 
      const endpoint = API_ROUTES.supplier.update //update(data);
      await fetchPost("supplier/", optionMaker(data, "PATCH", token));
      //toast.sucess("Sucessfully updated");
    } catch (error){
      //toast.error(error.message || "An error occurred");
    }
    fetchSuppliers();    /*

    try { 
      setLoading(true); 
      await updateSupplier(editingSupplier.supplierid, updatedValues, token); 
      const data = await getSuppliers(token); 
      setSuppliers(data); 
      setIsModalOpen(false); 
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    } 
    fetchSuppliers();
    */
  };

  const handleDeleteSupplier = async (supplierid) => {
    const data = {
     supplierid : formValues.supplierid,
    update : {
      activate : formValues.contactName,}
      // activate
   }
    // PUT??
    try{ 
      const endpoint = API_ROUTES.supplier.delete //.delete(data);
      await fetchPost("supplier/", optionMaker({supplierid}, "DELETE", token));
      toast.success("Sucessfully deleted");
      fetchSuppliers();
    } catch (error){
      toast.error(error.message || "An error occurred");
    }
    /*
    try { 
      setLoading(true); 
      await deleteSupplier(supplierid, token); 
      const data = await getSuppliers(token); 
      setSuppliers(data); 
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    } 
      */
  };

  const toggleActivation = async (record) => {
    
    const data = {
     supplierid : record.supplierid,
    update : {activate: record.activate ? 0 : 1 ,}
      // activate
   }
      
    try{ 
      const endpoint = API_ROUTES.supplier.update //update(data);
      await fetchPost("supplier/", optionMaker(data, "PATCH", token));
      //toast.sucess("Sucessfully updated");
    } catch (error){
      //toast.error(error.message || "An error occurred");
    }
    fetchSuppliers();    /*
    
    /*
    const statUpdated = { activate: !record.activate}; //negate/toggle
    const data = {record}
    const endpoint = API_ROUTES.supplier.update(data);
    try{
      await fetchPost(endpoint, optionMaker(data,"PATCH",token)); // How to I only make activate boolean change
      toast.success("Sucessfully updated")
    } catch (error){
      toast.error(error.message || "an error occurred");
    }
      */
    /*
    try { 
      setLoading(true); 
      await toggleSupplierActivation(supplier.supplierid, !supplier.activate, token); 
      const data = await getSuppliers(token); 
      setSuppliers(data); 
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    } 
    */
  };

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
            <Button type="link" danger onClick={() => handleDeleteSupplier(record.supplierid)}>Delete</Button> 
          </> 
        ) 
      ), 
    }, 
  ];
  if (error) return <Alert message="Error" description={error} type="error" />;
  return (
    <div>
      <Toaster/>      
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() =>{}}>Search Bar</Button>        
        <Input 
          placeholder="Search by Contact Name" 
          value={searchContact} 
          onChange={(e) => setSearchContact(e.target.value)} 
        />
        <Input 
          placeholder="Search by Company" 
          value={searchCompany} 
          onChange={(e) => setSearchCompany(e.target.value)} 
        />
        <Button type="primary" danger onClick={() => setToggleMode(!toggleMode)}>
          {toggleMode ? 'Disable Toggle Mode' : 'Enable Toggle Mode'}
        </Button>
      </Space>
      
      <Table 
        dataSource={filteredResults} 
        columns={columns} 
        rowKey="supplierid" 
      />
      <Modal 
        title="Edit Supplier" 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        onOk={() => form.submit()}
      >
        <Form 
          form={form} 
          onFinish={handleSave} //Previously () so it passes the value instead 
          layout="vertical"
        >
          <Form.Item name="supplierid" style={{ display: 'none' }}> 
            <Input type="hidden"/>
          </Form.Item>
          
          <Form.Item 
            name="companyName" 
            label="Company Name" 
            rules={[{ required: true, message: 'Please enter the company name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="contactName" 
            label="Contact Name" 
            rules={[{ required: true, message: 'Please enter the contact name' }]}
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