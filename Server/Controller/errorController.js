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

  // render website
  if (err.isOperational) {
    res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      msg: err.message,
    });
  }

  res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later.",
  });
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data: ${errors.join(". ")}`;
  return new cusError(message, 400);
};

const handleJWTExpireError = (err) => {
  return new cusError("Your token has expired! Please Login again");
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err, message: err.message };

  if (error._message === "Validation failed") error = handleValidationErrorDB(error);
  if (error.name === "TokenExpiredError") error = handleJWTExpireError(error);

  senErrorProd(error, req, res);
};
