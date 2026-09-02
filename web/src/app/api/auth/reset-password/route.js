import prisma from "@/lib/prisma";
import AppError from "@/lib/AppError";
import { hashPassword, hashToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const body = await req.json()
    const { token, password } = body;

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

    const hashed = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return Response.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json({ error: error.message, field: error.field }, { status: error.statusCode });
    }

    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
