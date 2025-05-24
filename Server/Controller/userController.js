import { createOne } from "./centralController.js";
import { hashPassword } from "./authController.js";
import catchAsync from "../Utils/catchAsync.js";
import { getOne, getAll, updateOne, deleteOne } from "./centralController.js";
import cusError from "../Utils/cusError.js";

export const findUserByEmail = (email) => {
  return getOne("user", "email", email);
};

export const userExists = catchAsync(async (req, res, next) => {
  const current = findUserByEmail(req.body.email);
  const exist = current ? true : false;
  console.log(exist);

  res.status(200).json({
    status: "success",
    exist,
  });
});

export const findUserById = (id) => {
  return getOne("user", "userid", id);
};

export const getMe = catchAsync(async (req, res, next) => {
  const currentUser = req.user;
  delete currentUser.password;
  delete currentUser.userid;

  res.status(200).json({
    status: "success",
    data: currentUser,
  });
});

export const getAllUser = catchAsync(async (req, res, next) => {
  const users = getAll("user");

  res.status(200).json({
    status: "success",
    data: users,
  });
});

export const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, phone, role = "customer" } = req.body;

  if (!name || !email || !password || !phone)
    return next(new cusError("Please provide all needed information", 400));

  const dataFilter = {
    name,
    email,
    password: await hashPassword(password),
    role,
    phone: phone,
  };

  try {
    createOne("user", dataFilter);
    delete dataFilter.password;

    res.status(200).json({
      status: "success",
      data: dataFilter,
    });
  } catch (error) {
    let message = `${error.code} ${error.message}`;
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE")
      message = `Duplicate Field: ${error.message}`;

    return next(new cusError(message, 400));
  }
});

export const updateUser = catchAsync(async (req, res, next) => {
  const { name, email, password, phone, address } = req.body;

  // Filter out null or undefined values and provide defaults
  const data = {
    name,
    email,
    password,
    phone,
    address
  };

  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  // Remove undefined fields (e.g., if password is not provided)
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined || !data[key]) {
      delete data[key];
    }
  });

  try {
    updateOne("user", req.user.userid, data);

    // Remove sensitive data before sending the response
    delete data.password;

    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    let message = `${error.code} ${error.message}`;
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE")
      message = `Duplicate Field: ${error.message}`;

    return next(new cusError(message, 400));
  }
});

export const updateUserById = catchAsync(async (req, res, next) => {
  const { name, phone, userid, email } = req.body;
  if (!name) {
    return next(new cusError("Please enter new name", 400));
  }

  try {
    console.log("user id ", userid);
    console.log("Name: ", name);

    await updateOne("user", userid, { name, phone, email });

    res.status(200).json({
      status: "success",
      data: { userid, name, phone },
    });
  } catch (error) {
    return next(new cusError("Error updating user", 500));
  }
});


export const deleteUserById = catchAsync(async (req, res, next) => {
  const { userid } = req.body;
  if (!userid) {
    return next(new cusError("user id missing", 400));
  }
  const deleteUser = await deleteOne("user", userid);

  res.status(200).json({
    status: " success",
    data: deleteUser,
  });
});



export const toggleUserActivation = catchAsync(async (req, res, next) => {
  const { userid } = req.body;
  if (!userid) {
    return next(new cusError("user id missing", 400));
  }

  const user = await findUserById(userid);

  if (!user) {
    return next(new cusError("User not founded", 404));
  }

  const activateStatus = !user.activate;
  const activateTrueFalse = activateStatus ? 1 : 0;

  try {
    const changedStatus = await updateOne("user", userid, { activate: activateTrueFalse });

    res.status(200).json({
      status: "success",
      data: changedStatus,
    });
  } catch (error) {
    console.error(error);
    return next(new cusError("Error updating activation", 500));
  }
});



export const deactivateUser = catchAsync(async (req, res, next) => {
  const userId = req.user.userid; // Ensure req.user.userid is populated
  console.log("Deactivating user with ID:", userId); // Debugging log

  // Update the "activate" column to 0
  await updateOne("user", userId, { activate: 0 }, "userid");

  res.status(200).json({
    status: "success",
    message: "Account deactivated successfully",
  });
});

export const accessLog = catchAsync(async (req, res, next) => {
  const userId = req.user.userid;

  try {
    const logs = await getAll(
      "access_logs",
      "userid",
      userId,
      "login_time DESC"
    );

    res.status(200).json({
      status: "success",
      data: logs,
    });
  } catch (error) {
    return next(new cusError("Failed to fetch access logs", 500));
  }
});
