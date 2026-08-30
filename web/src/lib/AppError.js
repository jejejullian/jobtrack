class AppError extends Error {
  constructor(message, statusCode = 500, field = null) {
    super(message);
    this.statusCode = statusCode;
    this.field = field;
    this.isOperational = true;
    this.name = "AppError";
  }
}

export default AppError;
