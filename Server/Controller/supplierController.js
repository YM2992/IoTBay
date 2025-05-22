import {getAll,getOne,createOne,updateOne,deleteOne} from "./centralController.js";

import catchAsync from "../Utils/catchAsync.js";
import cusError from "../Utils/cusError.js";

const SUPPLIER_TABLE = "supplier"; 

// Get all suppliers
export const getAllSuppliers = catchAsync(async (req, res, next) => {
  const suppliers = await getAll(SUPPLIER_TABLE);

  res.status(200).json({
    status: "success",
    data: suppliers,
  });
});

// Get a single supplier by ID
export const getSupplierById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const supplier = getOne(SUPPLIER_TABLE, "supplierid", id);

  if (!supplier) {
    return next(new cusError("Supplier not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: supplier,
  });
});

// Create a new supplier
export const createSupplier = catchAsync(async (req, res, next) => {
  const { contactName, companyName, email, address } = req.body;

  if (!contactName || !companyName || !email || !address) {
    return next(new cusError("Please provide all required fields", 400));
  }

  try {
    const result = await createOne(SUPPLIER_TABLE, { contactName, companyName, email, address }); // Await the asynchronous operation

    res.status(201).json({
      status: "success",
      data: {id: result.lastInsertRowid, contactName, companyName, email, address,},
    });
  } catch (error) {
    let message = error.code === "SQLITE_CONSTRAINT_UNIQUE" 
      ? `Duplicate Field: ${error.message}` 
      : "Error creating supplier";

    return next(new cusError(message, 400));
  }
});

// Update a supplier by ID
export const updateSupplierById = async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const result = updateOne('supplier', id, updatedData);
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json({ 
      message: 'Supplier updated successfully', 
      data: updatedData 
    });
  } catch (error) {
    next(error);
  }
};

// Delete a supplier by ID

export const deleteSupplierById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = deleteOne('supplier', id);
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(204).json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    next(error);
  }
};

//Toggles activation

export const toggleSupplierActivation = async (req, res, next) => {
  const { id } = req.params;
  const { activate } = req.body;

  try {
    const result = updateOne('supplier', id, { activate });
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    res.status(200).json({ 
      message: 'Supplier activation status updated', 
      data: { id, activate } 
    });
  } catch (error) {
    next(error);
  }
};
