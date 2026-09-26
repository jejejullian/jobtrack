import prisma from "@/lib/prisma";
import AppError from "@/lib/AppError";
import { normalizeEmail, hashToken, generateToken } from "@/lib/auth";
import { sendResetPasswordEmail } from "@/lib/email";

const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000;
const RESET_REQUEST_COOLDOWN_MS = 60 * 1000;

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
    const cutoff = new Date(Date.now() - RESET_REQUEST_COOLDOWN_MS);

    const result = await prisma.user.updateMany({
      where: {
        id: user.id,
        OR: [{ lastResetRequestAt: null }, { lastResetRequestAt: { lt: cutoff } }],
      },
      data: { resetToken: hashedToken, resetTokenExpiry: expiry, lastResetRequestAt: new Date() },
    });

    if (result.count === 0) {
      const fresh = await prisma.user.findUnique({ where: { id: user.id }, select: { lastResetRequestAt: true } });
      if (!fresh) throw new AppError("Something went wrong", 500);

      const elapsed = Date.now() - new Date(fresh.lastResetRequestAt).getTime();

      const waitSeconds = Math.ceil((RESET_REQUEST_COOLDOWN_MS - elapsed) / 1000);

      throw new AppError(`Please wait ${waitSeconds} seconds before requesting another reset link.`, 429, "email");
    }

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
