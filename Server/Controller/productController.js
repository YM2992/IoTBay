import { createOne, getAll } from "./centralController.js";
import catchAsync from "../Utils/catchAsync.js";
import { getOne } from "./centralController.js";
import cusError from "../Utils/cusError.js";

export const getAllProducts = catchAsync(async (req, res, next) => {
  const products = getAll("product");

  res.status(200).json({
    status: "success",
    data: products,
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

    res.status(200).json({
      status: "success",
      data: dataFilter,
    });
  } catch (error) {
    console.error(error);
    return next(new cusError("Something went wrong", 500));
  }
});
