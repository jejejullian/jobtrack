const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message =
    err.isOperational && err.message
      ? err.message
      : "terjadi kesalahan pada server";

  res.status(statusCode).json({ error: message });
};

export default errorHandler;
