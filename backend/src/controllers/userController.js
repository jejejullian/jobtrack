import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// select fields
const userSelect = {
  id: true,
  email: true,
  username: true,
  isVerified: true,
  createdAt: true,
};

// get profile
const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: userSelect,
  });

  if (!user) throw new AppError("User not found", 404);

  res.json({ user });
});

// update username
const updateMe = asyncHandler(async (req, res) => {
  const username = req.body.username?.trim();

  if (!username) throw new AppError("Username is required", 400, "username");
  if (username.length < 3) throw new AppError("Username must be at least 3 characters", 400, "username");

  const existingUsername = await prisma.user.findFirst({
    where: {
      username,
      id: { not: req.user.id },
    },
  });

  if (existingUsername) throw new AppError("Username already taken", 409, "username");

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { username },
    select: userSelect,
  });

  res.json({ message: "Profile updated successfully", user });
});

// change password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword) throw new AppError("Current password is required", 400, "currentPassword");
  if (!newPassword) throw new AppError("New password is required", 400, "newPassword");
  if (newPassword.length < 8) throw new AppError("Password must be at least 8 characters", 400, "newPassword");
  if (!/[a-zA-Z]/.test(newPassword)) throw new AppError("Password must contain at least one letter", 400, "newPassword");
  if (!/[0-9]/.test(newPassword)) throw new AppError("Password must contain at least one number", 400, "newPassword");

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) throw new AppError("User not found", 404);

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) throw new AppError("Current password is incorrect", 400, "currentPassword");

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashed },
  });

  res.json({ message: "Password updated successfully" });
});

// delete account
const deleteMe = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) throw new AppError("Password is required", 400, "password");

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) throw new AppError("User not found", 404);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new AppError("Password is incorrect", 400, "password");

  await prisma.$transaction([
    prisma.job.deleteMany({ where: { userId: req.user.id } }),
    prisma.user.delete({ where: { id: req.user.id } }),
  ]);

  res.json({ message: "Account deleted successfully" });
});

export { getMe, updateMe, changePassword, deleteMe };
