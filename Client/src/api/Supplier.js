import { API_ROUTES, fetchGet, fetchPost,fetchPatch, fetchDelete, optionMaker } from '@/api'; //fetchPatch

// Get all suppliers
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

// Create a new supplier
export const createSupplier = async (supplierData, token) => {
  const response = await fetchPost(API_ROUTES.supplier.create, optionMaker(supplierData, 'PATCH', token));
  if (!response) throw new Error('Failed to create supplier');
  if (!response.status || response.status !== 'success') throw new Error('Failed to create supplier');

  return response.data;
};

// Update a supplier
export const updateSupplier = async(id, supplierData, token ) => {
  const response = await fetchPost(API_ROUTES.supplier.update(id), optionMaker(supplierData, 'PATCH', token));
  if (!response) throw new Error ('Failed to update supplier');  
  if (!response.status || response.status !== 'success') throw new Error ('Failed to update supplier');
  return response.data;
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
export const deleteSupplier = async (id, token) => {
  const response = await fetchDelete(API_ROUTES.supplier.delete(id), {
    headers: {
      Authorization: `Bearer ${token}`, //plsplspls
    },
  });
  // if (!response) throw new Error('Failed to delete supplier');  -- Kinda redunant??
  if (!response.status || response.status !== 'success') throw new Error('Failed to delete supplier');

  return response;
};