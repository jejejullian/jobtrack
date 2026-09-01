import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import AppError from "@/lib/AppError";
import { comparePassword, signToken, normalizeEmail } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    const { password } = body;
    const email = normalizeEmail(body.email);

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("Invalid email or password", 401);

    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) throw new AppError("Invalid email or password", 401);

    if (!user.isVerified) {
      throw new AppError("Please verify your email before loggin in. Check your inbox", 403, "email");
    }

    const token = signToken({ userId: user.id })
    const response = NextResponse.json({
      message: "Login successful",
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json({ error: error.message, field: error.field }, { status: error.statusCode });
    }

    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
