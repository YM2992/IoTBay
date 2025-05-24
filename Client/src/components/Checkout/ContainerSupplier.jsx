import React from 'react';
import ViewSuppliers from "@/components/ViewSuppliers";
import { Toaster } from 'react-hot-toast'; // notifcation system needs to be activated in top layer

const ContainerSupplier = () => {
  return (
    <div>
      <h1>Edit Supplier</h1>
      <Toaster/> 
      <ViewSuppliers />   
    </div>
  );
};

export default ContainerSupplier;