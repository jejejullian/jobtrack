import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new AppError("Authorization failed. No access token.", 401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error(err);
      throw new AppError("Could not verify token", 403);
    }
    req.user = user;
    next();
  });
};
