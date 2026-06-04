import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateToken, hashToken } from "../utils/token.js";
import { sendVerificationEmail, sendResetPasswordEmail } from "../lib/email.js";
import dns from "dns/promises";

const VERIFICATION_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const resendAttempts = new Map();

const checkMxRecord = async (email) => {
  const domain = email.split("@")[1];
  try {
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
};

const normalizeEmail = (email) => email?.trim().toLowerCase();

const enforceResendCooldown = (email) => {
  const now = Date.now();
  const lastAttemptAt = resendAttempts.get(email);

  if (lastAttemptAt && now - lastAttemptAt < RESEND_COOLDOWN_MS) {
    const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - (now - lastAttemptAt)) / 1000);
    throw new AppError(`Please wait ${waitSeconds} seconds before requesting another verification email.`, 429, "email");
  }

  resendAttempts.set(email, now);
};

// Register
const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const email = normalizeEmail(req.body.email);

  if (!email) throw new AppError("Email is required", 400, "email");
  if (!username) throw new AppError("Username is required", 400, "username");
  if (!password) throw new AppError("Password is required", 400, "password");
  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400, "password");
  }
  if (!/[a-zA-Z]/.test(password)) {
    throw new AppError("Password must contain at least one letter", 400, "password");
  }
  if (!/[0-9]/.test(password)) {
    throw new AppError("Password must contain at least one number", 400, "password");
  }

  const hasMx = await checkMxRecord(email);
  if (!hasMx) {
    throw new AppError("Email domain does not exist or cannot recive email", 400, "email");
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    if (existingEmail.isVerified) {
      throw new AppError("Email already in use", 409, "email");
    }

    const rawToken = generateToken();
    const hashedToken = hashToken(rawToken);
    enforceResendCooldown(email);

    const expiry = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS);

    await prisma.user.update({
      where: { id: existingEmail.id },
      data: {
        verifyToken: hashedToken,
        verifyTokenExpiry: expiry,
      },
    });

    await sendVerificationEmail(email, rawToken);

    return res.status(200).json({
      message: "Register successful. Please check your email to verify your account.",
    });
  }

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) throw new AppError("Username already taken", 409, "username");

  const hashed = await bcrypt.hash(password, 10);

  const rawToken = generateToken();
  const hashedToken = hashToken(rawToken);
  const expiry = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS);

  await prisma.user.create({
    data: {
      email,
      username,
      password: hashed,
      verifyToken: hashedToken,
      verifyTokenExpiry: expiry,
    },
  });

  await sendVerificationEmail(email, rawToken);

  res.status(201).json({ message: "Register successful. Please check your email to verify your account" });
});

// Verify Email
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const email = normalizeEmail(req.query.email);

  if (!token) throw new AppError("Verification token is required", 400);

  const hashedToken = hashToken(token);

  const user = await prisma.user.findFirst({
    where: {
      verifyToken: hashedToken,
      verifyTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    if (email) {
      const userByEmail = await prisma.user.findUnique({ where: { email } });

      if (userByEmail?.isVerified) {
        return res.json({ message: "Email already verified. You can now log in." });
      }
    }

    const expiredUser = await prisma.user.findFirst({
      where: {
        verifyToken: hashedToken,
        verifyTokenExpiry: { lte: new Date() },
      },
    });

    if (expiredUser) {
      throw new AppError("Verification link has expired. Please request a new link.", 400, "expired");
    }

    throw new AppError("Verification link is invalid or has been replaced. Please request a new link.", 400, "invalid");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verifyToken: null,
      verifyTokenExpiry: null,
    },
  });

  res.json({ message: "Email verified successfully. You can now log in." });
});

// Login
const login = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const email = normalizeEmail(req.body.email);

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid email or password", 401);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new AppError("Invalid email or password", 401);

  if (!user.isVerified) {
    throw new AppError("Please verify your email before loggin in. Check your inbox", 403, "email");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  });
});

// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);

  if (!email) throw new AppError("Email is required", 400, "email");

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.json({ message: "If this email is registered, you will receive a reset link shortly." });
  }

  const rawToken = generateToken();
  const hashedToken = hashToken(rawToken);
  const expiry = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: hashedToken,
      resetTokenExpiry: expiry,
    },
  });

  await sendResetPasswordEmail(email, rawToken);

  res.json({
    message: "If this email is registered, you will receive a reset link shortly.",
  });
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token) throw new AppError("Reset token is required", 400);
  if (!password) throw new AppError("New password is required", 400, "password");
  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400, "password");
  }
  if (!/[a-zA-Z]/.test(password)) {
    throw new AppError("Password must contain at least one letter", 400, "password");
  }
  if (!/[0-9]/.test(password)) {
    throw new AppError("Password must contain at least one number", 400, "password");
  }

  const hashedToken = hashToken(token);

  const user = await prisma.user.findFirst({
    where: {
      resetToken: hashedToken,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  res.json({ message: "Password reset successful. You can now log in." });
});

// Resend Verification Email
const resendVerification = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);

  if (!email) throw new AppError("Email is required", 400, "email");

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.json({
      message: "If this email is registered and unverified, a new link will be sent.",
    });
  }

  if (user.isVerified) {
    return res.json({
      message: "This email is already verified. You can log in.",
      alreadyVerified: true,
    });
  }

  enforceResendCooldown(email);

  const rawToken = generateToken();
  const hashedToken = hashToken(rawToken);
  const expiry = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verifyToken: hashedToken,
      verifyTokenExpiry: expiry,
    },
  });

  await sendVerificationEmail(email, rawToken);

  res.json({
    message: "If this email is registered and unverified, a new link will be sent.",
  });
});

export { register, login, verifyEmail, forgotPassword, resetPassword, resendVerification };
