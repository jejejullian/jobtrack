import prisma from "@/lib/prisma";
import AppError from "@/lib/AppError";
import { normalizeEmail, hashToken, generateToken } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

const VERIFICATION_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const resendAttempts = new Map();

const enforceResendCooldown = (email) => {
  console.log("resendAttempts size:", resendAttempts.size, "has email:", resendAttempts.has(email));
  const now = Date.now();
  const lastAttemptAt = resendAttempts.get(email);

  if (lastAttemptAt && now - lastAttemptAt < RESEND_COOLDOWN_MS) {
    const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - (now - lastAttemptAt)) / 1000);
    throw new AppError(`Please wait ${waitSeconds} seconds before requesting another verification email.`, 429, "email");
  }

  resendAttempts.set(email, now);
};

export async function POST(req) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body.email);

    if (!email) throw new AppError("Email is required", 400, "email");

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return Response.json({
        message: "If this email is registered and unverified, a new link will be sent.",
      });
    }

    if (user.isVerified) {
      return Response.json({
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

    return Response.json({
      message: "If this email is registered and unverified, a new link will be sent.",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json({ error: error.message, field: error.field }, { status: error.statusCode });
    }

    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
