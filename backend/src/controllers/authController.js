import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../lib/prisma.js"
import AppError from "../utils/AppError.js"
import asyncHandler from "../utils/asyncHandler.js"

const register = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new AppError("Email already in use", 400)

  const hashed = await bcrypt.hash(password, 10)
  await prisma.user.create({ data: { email, username, password: hashed } })

  res.json({ message: "Register successful" })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new AppError("Invalid email or password", 401)

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) throw new AppError("Invalid email or password", 401)

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  })

  res.json({ message: "Login successful", token })
})

export { register, login }