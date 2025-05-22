import { API_ROUTES, fetchGet, fetchPost,fetchPatch, fetchDelete, optionMaker } from '@/api'; //fetchPatch

// Routing wasn't working that well for me for hard code here we go!
const BASE_URL = 'http://localhost:8000/api/supplier';

// Does this authentical token sill pass? [Authorizatoin header]
const createHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json', // Optional: Set content type if sending JSON
  },
});


// Get all suppliers *** NO CHANGES NEEDED
export const getSuppliers = async (token) => { // API_ROUTES.supplier.getAll,
  const response = await fetchGet(API_ROUTES.supplier.getAll, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response) throw new Error('Failed to fetch suppliers');
  if (!response.status || response.status !== 'success') throw new Error('Failed to fetch suppliers');

  return response.data; // Assuming the API returns { status: 'success', data: [...] }
};

// Create a new supplier ** No changes needed!!!
export const createSupplier = async (supplierData, token) => {
  const response = await fetchPost(API_ROUTES.supplier.create, optionMaker(supplierData, 'POST', token));
  if (!response) throw new Error('Failed to create supplier');
  if (!response.status || response.status !== 'success') throw new Error('Failed to create supplier');

  return response.data;
};

// Update a supplier
export const updateSupplier = async (supplierid, supplierData, token) => {
  const response = await fetch(`${BASE_URL}/${supplierid}`, {
    method: 'PATCH',
    ...createHeaders(token),
    body: JSON.stringify(supplierData),
  });
  if (!response.ok) throw new Error('Failed to update supplier');
  return await response.json();
};

/*
  if (!response || response.status !== "success") {
    throw new Error("Failed to update supplier");
  }
  return response.data;
*/

/* [OLD incompatiable PUT method]
  const response = await fetchPost(API_ROUTES.supplier.update(id), optionMaker(supplierData, 'PUT', token));
  if (!response) throw new Error('Failed to update supplier');
  if (!response.status || response.status !== 'success') throw new Error('Failed to update supplier');
  return response.data;};
  */

// Delete a supplier
export const deleteSupplier = async (supplierid, token) => {
  const response = await fetch(`${BASE_URL}/${supplierid}`, {
    method: 'DELETE',
    ...createHeaders(token),
  });
  if (!response.ok) throw new Error('Failed to delete supplier');
  return await response.json();
};

// Activation Toggling
export const toggleSupplierActivation = async (supplierid, activate, token) => {
  const response = await fetch(`${BASE_URL}/${supplierid}/activate`, {
    method: 'PATCH',
    ...createHeaders(token),
    body: JSON.stringify({ activate }),
  });
  if (!response.ok) throw new Error('Failed to toggle activation');
  return await response.json();
};