class cusError extends Error {
  constructor(message, statusCode, name = null, ...args) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.name = name;
    this.additionalInfo = args;
  }
}

export default cusError;
