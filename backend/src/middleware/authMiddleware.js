import { promisify } from "util";
const verifyToken = promisify(jwt.verify);

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Authorization failed. No access token.", 401);
    }

    const user = await verifyToken(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
