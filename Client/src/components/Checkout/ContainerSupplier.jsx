import React from 'react';
import ViewSuppliers from './ViewSuppliers';

const ContainerSupplier = () => {
  return (
    <div>
      <h1>Edit Supplier</h1>
      <ViewSuppliers />   
    </div>
  );
};

export default ContainerSupplier;

/*
[0] ERROR! {
[0]   statusCode: 500,
[0]   status: 'error',
[0]   message: "Cannot read properties of null (reading 'role')"
        ?!?!?!
*/