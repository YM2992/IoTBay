import { createOne, getAll, deleteOneByFilter, updateOneWithFilter } from "./centralController.js";
import catchAsync from "../Utils/catchAsync.js";
import cusError from "../Utils/cusError.js";

export const getUserAddressBook = catchAsync(async (req, res, next) => {
  const addressBook = getAll("address_book");
  const { userid } = req.user;

  const filteredAddressBook = addressBook.filter((address) => address.userid === userid);

  res.status(200).json({
    status: "success",
    data: filteredAddressBook,
  });
});

export const createAddress = catchAsync(async (req, res, next) => {
  const { address, recipient, phone, is_default } = req.body;
  const { userid } = req.user;

  console.log(address);

  if (!address || !userid) return next(new cusError("Please provide all needed fields", 400));

  const dataFilter = {
    address,
    userid,
    recipient,
    phone,
    is_default,
  };

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
