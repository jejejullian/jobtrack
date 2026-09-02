import prisma from "@/lib/prisma";
import AppError from "@/lib/AppError";
import { normalizeEmail, hashToken, generateToken } from "@/lib/auth";
import { sendResetPasswordEmail } from "@/lib/email";

const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000;

export async function POST(req) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body.email);

    if (!email) throw new AppError("Email is required", 400, "email");

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json({ message: "If this email is registered, you will receive a reset link shortly." });
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

    return Response.json({
      message: "If this email is registered, you will receive a reset link shortly.",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json({ error: error.message, field: error.field }, { status: error.statusCode });
    }

    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
