import prisma from "@/lib/prisma";
import AppError from "@/lib/AppError";
import { normalizeEmail, hashToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    const email = normalizeEmail(req.nextUrl.searchParams.get("email"));

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
          return Response.json({ message: "Email already verified. You can now log in." });
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

    return Response.json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json({ error: error.message, field: error.field }, { status: error.statusCode });
    }

    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
