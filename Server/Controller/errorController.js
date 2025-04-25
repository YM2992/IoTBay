import cusError from "../Utils/cusError.js";

const senErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    // Operational, trusted error: send a message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming or other unknown error: don't show error details
    console.error("ERROR!", err);
    res.status(500).json({
      status: "error",
      msg: "something went very wrong!",
    });
  }
};

const handleValidationErrorDB = (err) => {
  const [, secondPart, thirdPart] = err.message.split(":");

  const message = `Invalid input data: ${thirdPart}`;
  return new cusError(message, 400);
};

const handleJWTExpireError = (err) => {
  return new cusError("Your token has expired! Please Login again");
};

export default (err, req, res, next) => {
  console.log("=========ERROR CONTROLLER============");
  console.log(err);
  console.log("=========ERROR ENDS============");
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err, message: err.message };

  if (error?.name === "Database_Error") error = handleValidationErrorDB(error);
  if (error?.name === "TokenExpiredError") error = handleJWTExpireError(error);

  senErrorProd(error, req, res);
};
