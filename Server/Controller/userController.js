import { createOne } from "./centralController.js";
import { hashPassword } from "./authController.js";
import catchAsync from "../Utils/catchAsync.js";
import { getOne, getAll, updateOne,deleteOne } from "./centralController.js";
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
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone)
    return next(new cusError("Please provide all needed information", 400));

  const dataFilter = {
    name,
    email,
    password: await hashPassword(password),
    role: "customer",
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
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") message = `Duplicate Field: ${error.message}`;

    return next(new cusError(message, 400));
  }
});

export const updateUserById = catchAsync(async (req, res, next) => {
  const { name,phone, userid } = req.body;

  if (!name ) return next(new cusError("Please provide a new name", 400));

  try {

    console.log("user id received:", userid);  // Debug log
    console.log("Name received:", name); 
    console.log("Phone received:", phone);
    // Use the helper function to find the user
   
    // Update the user's name
    const updateResult = await updateOne("user", userid,{name,phone});

    console.log("Update result:", updateResult); 


    res.status(200).json({
      status: "success",
      data: { userid, name ,phone},
    });
  } catch (error) {
    console.error("Update error:", error);
    return next(new cusError("Error updating user", 500));
  }

});

export const deleteUserById = catchAsync(async (req, res, next) => {
  const { userid } = req.body;
  if (!userid) throw new cusError("User id is required to delete a user", 400);

  const deletedUser = await deleteOne("user", userid);

  res.status(200).json({
    status: "success",
    data: deletedUser,
  });
});


export const toggleUserActivation = catchAsync(async (req, res, next) => {
  const { userid } = req.body;
  
  if (!userid) {
    return next(new cusError("User id is required", 400));
  }
  
  // Retrieve the current user data
  const user = await findUserById(userid);
  
  if (!user) {
    return next(new cusError("User not found", 404));
  }
  
  // Toggle the activation status
  const newActivationStatus = !user.activate;
  const newActivationStatusNum = newActivationStatus ? 1 : 0;

  
  try {
    const updateResult = await updateOne("user", userid, { activate: newActivationStatusNum });
    console.log("Toggle activation result:", updateResult);
    
    res.status(200).json({
      status: "success",
      data: { userid, activate: newActivationStatus },
    });
  } catch (error) {
    console.error("Toggle activation error:", error);
    return next(new cusError("Error updating user activation", 500));
  }
});

