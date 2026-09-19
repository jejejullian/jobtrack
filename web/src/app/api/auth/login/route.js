import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import AppError from "@/lib/AppError";
import { comparePassword, signToken, normalizeEmail } from "@/lib/auth";

// konfigurasi lockout — urutan durasi (ms) berdasarkan jumlah gagal berturut-turut
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATIONS_MS = [30 * 1000, 60 * 1000, 5 * 60 * 1000, 15 * 60 * 1000, 30 * 60 * 1000];

// hitung durasi lockout berdasarkan jumlah percobaan gagal
const getLockoutDurationMs = (failedAttempts) => {
  const index = failedAttempts - LOCKOUT_THRESHOLD;
  const clampedIndex = Math.min(index, LOCKOUT_DURATIONS_MS.length - 1);
  return LOCKOUT_DURATIONS_MS[clampedIndex];
};

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

    // cek dulu apakah akun ini sedang dikunci, sebelum sempat cek password sama sekali
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMs = user.lockedUntil.getTime() - Date.now();
      const remainingSeconds = Math.ceil(remainingMs / 1000);

      let remainingText;
      if (remainingSeconds < 60) {
        remainingText = `${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
      } else {
        const remainingMinutes = Math.ceil(remainingSeconds / 60);
        remainingText = `${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
      }

      throw new AppError(`Too many failed attempts. Please try again in ${remainingText}.`, 429);
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      // password salah — increment counter secara atomic di level database,
      // biar gak ada celah waktu antara "baca" dan "tulis" kalau ada request nyaris bersamaan
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: { increment: 1 } },
      });

      const newFailedAttempts = updatedUser.failedLoginAttempts;

      if (newFailedAttempts >= LOCKOUT_THRESHOLD) {
        const durationMs = getLockoutDurationMs(newFailedAttempts);

        await prisma.user.update({
          where: { id: user.id },
          data: { lockedUntil: new Date(Date.now() + durationMs) },
        });
      }

      throw new AppError("Invalid email or password", 401);
    }

    if (!user.isVerified) {
      throw new AppError("Please verify your email before loggin in. Check your inbox", 403, "email");
    }

    // login berhasil — reset counter lockout
    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });
    }

    const token = signToken({ userId: user.id });
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
