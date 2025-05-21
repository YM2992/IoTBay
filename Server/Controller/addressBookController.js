import {
  createOne,
  getAll,
  deleteOneByFilter,
  updateOneWithFilter,
  getAllWithFilter,
  getOne,
} from "./centralController.js";
import catchAsync from "../Utils/catchAsync.js";
import cusError from "../Utils/cusError.js";
import { isNineDigitNumber } from "../Utils/helper.js";

export const getUserAddressBook = catchAsync(async (req, res, next) => {
  const addressBook = getAll("address_book");
  const { userid } = req.user;

  const filteredAddressBook = addressBook
    .filter((address) => address.userid === userid)
    .sort((a, b) => b.is_default - a.is_default);

  res.status(200).json({
    status: "success",
    data: filteredAddressBook,
  });
});

export const createAddress = catchAsync(async (req, res, next) => {
  const { address, recipient, phone } = req.body;
  const { userid } = req.user;

  if (!address || !userid) return next(new cusError("Please provide all needed fields", 400));

  const dataFilter = {
    address,
    userid,
    recipient,
    phone,
  };

  if (!isNineDigitNumber(phone)) return next(new cusError("Phone number has to be 9 digits", 401));

  const addressBook = getAllWithFilter("address_book", { userid });
  if (addressBook.length < 1) {
    dataFilter.is_default = true;
  }

  try {
    createOne("address_book", dataFilter);

    res.status(201).json({
      status: "success",
      data: dataFilter,
    });
  } catch (error) {
    if (error.code.startsWith("SQLITE")) return next(new cusError(error, 500, "Database_Error"));
  }
});

export const deleteOneAddressBook = catchAsync(async (req, res, next) => {
  const { addressid } = req.body;
  const { userid } = req.user;

  if (!addressid)
    return next(new cusError("You have to provide address id you wish to delete", 401));

  const addressBook = deleteOneByFilter("address_book", { addressid, userid });

  res.status(200).json({
    status: "success",
    data: addressBook,
  });
});

export const updateOneAddressBook = catchAsync(async (req, res, next) => {
  const { data, addressid } = req.body;
  const { userid } = req.user;

  if (!addressid)
    return next(new cusError("You have to provide address id you wish to update", 401));

  if (data.is_default) {
    const data = {
      is_default: 0,
    };
    updateOneWithFilter("address_book", { userid }, data);
  }

  if (data.phone && !isNineDigitNumber(data.phone))
    return next(new cusError("Phone number has to be 9 digits", 401));

  try {
    updateOneWithFilter("address_book", { addressid, userid }, data);

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    if (error.code.startsWith("SQLITE")) return next(new cusError(error, 500, "Database_Error"));

    console.error(error);
    return next(new cusError("Something went wrong", 500));
  }
});

export const updateOrderAddress = catchAsync(async (req, res, next) => {
  const { address, orderid } = req.body;
  const { userid } = req.user;

  const curOrder = getAllWithFilter("orders", { orderid, userid });

  if (curOrder.length < 1) return next(new cusError("Order not found", 404));
  if (curOrder[0].status !== "paid")
    return next(new cusError("You can only update paid orders", 401));

  try {
    updateOneWithFilter("orders", { orderid, userid }, { address });

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    if (error.code.startsWith("SQLITE")) return next(new cusError(error, 500, "Database_Error"));
    console.error(error);
    return next(new cusError("Something went wrong", 500));
  }
});
