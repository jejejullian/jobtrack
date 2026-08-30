import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET;



// hash & compare password
export const hashPassword = (password) => bcrypt.hash(password, 10);
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);

// sign & verify JWT login
export const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

// token verifikasi email / reset password (bukan JWT)
export const generateToken = () => crypto.randomBytes(32).toString("hex");
export const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

// Sanitize email: remove spaces and lowercase
export const normalizeEmail = (email) => email?.trim().toLowerCase();
