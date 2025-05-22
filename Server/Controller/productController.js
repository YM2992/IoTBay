import { createOne, getAll, updateOne, deleteOne } from "./centralController.js";
import catchAsync from "../Utils/catchAsync.js";
import cusError from "../Utils/cusError.js";

export const getAllProducts = catchAsync(async (req, res, next) => {
  const products = getAll("product");

  res.status(200).json({
    status: "success",
    data: products,
  });
});

export const deleteOneProduct = catchAsync(async (req, res, next) => {
  const { productid } = req.body;
  if (!productid) {
    return next(new cusError("You have to provide product id you wish to delete", 401));
  }

  const products = deleteOne("product", productid);

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
  const { name, price, quantity, description, image } = req.body;

  if (!name || !price || !quantity || !description)
    return next(new cusError("Please provide all needed fields", 400));

  if (!image) image = "default_image";

  const dataFilter = {
    name,
    price,
    quantity,
    description,
    image,
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

  // specify the filed allowed to change/update
  const allowedFields = ["name", "price", "quantity", "description", "image", "available"];

  // filter the data which belongs to the correct field
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key))
  );

  // if no valid filed has been provided, return error
  if (Object.keys(filteredData).length === 0) {
    return next(new cusError("No valid fields provided for update.", 401));
  }

  try {
    updateOne("product", productid, filteredData);

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    if (error.code.startsWith("SQLITE")) return next(new cusError(error, 500, "Database_Error"));

    console.log("Error occurred: ");
    console.error(error);
    return next(new cusError("Something went wrong", 500));
  }
});
