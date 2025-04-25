import { createOne, getAll, updateOne } from "./centralController.js";
import catchAsync from "../Utils/catchAsync.js";
import cusError from "../Utils/cusError.js";

export const getAllProducts = catchAsync(async (req, res, next) => {
  const products = getAll("product");

  res.status(200).json({
    status: "success",
    data: products,
  });
});

export const getAllAvailableProducts = catchAsync(async (req, res, next) => {
  const products = getAll("product");

  const data = products.filter((ele) => ele.available);

  res.status(200).json({
    status: "success",
    data,
  });
});

export const createProduct = catchAsync(async (req, res, next) => {
  const { name, price, quantity, description } = req.body;
  if (!name || !price || !quantity || !description)
    return next(new cusError("Please provide all needed fields", 400));

  const dataFilter = {
    name,
    price,
    quantity,
    description,
  };

  try {
    createOne("product", dataFilter);

    res.status(201).json({
      status: "success",
      data: dataFilter,
    });
  } catch (error) {
    if (error.code.startsWith("SQLITE")) return next(new cusError(error, 500, "Database_Error"));
  }
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const { data, productid } = req.body;
  console.log(data);

  const allowedFields = ["name", "price", "quantity", "description", "image", "available"];

  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key))
  );

  if (Object.keys(filteredData).length === 0) {
    return next(new cusError("No valid fields provided for update.", 500));
  }
  console.log(filteredData);

  try {
    updateOne("product", productid, filteredData);

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error(error);
    if (error.code.startsWith("SQLITE")) return next(new cusError(error, 500, "Database_Error"));

    return next(new cusError("Something went wrong", 500));
  }
});
