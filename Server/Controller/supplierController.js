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
export const updateSupplierById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { contactName, companyName, email, address } = req.body;

  if (!contactName && !companyName && !email && !address) {
    return next(new cusError("At least one field is required to update", 400));
  }

  const data = { contactName, companyName, email, address };

  // Remove undefined fields
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined || !data[key]) {
      delete data[key];
    }
  });

  try {
    const result = updateOne(SUPPLIER_TABLE, id, data);

    if (result.changes === 0) {
      return next(new cusError("Supplier not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { id, ...data },
    });
  } catch (error) {
    return next(new cusError("Error updating supplier", 500));
  }
});

// Delete a supplier by ID
export const deleteSupplierById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = deleteOne(SUPPLIER_TABLE, id);

    if (result.changes === 0) {
      return next(new cusError("Supplier not found", 404));
    }

    res.status(204).send(); // No content
  } catch (error) {
    return next(new cusError("Error deleting supplier", 500));
  }
});
