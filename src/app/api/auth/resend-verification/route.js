  import prisma from "@/lib/prisma";
  import AppError from "@/lib/AppError";
  import { normalizeEmail, hashToken, generateToken } from "@/lib/auth";
  import { sendVerificationEmail } from "@/lib/email";

  const VERIFICATION_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;
  const RESEND_COOLDOWN_MS = 60 * 1000;

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

      const rawToken = generateToken();
      const hashedToken = hashToken(rawToken);
      const expiry = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS);
      const cutoff = new Date(Date.now() - RESEND_COOLDOWN_MS);

      const result = await prisma.user.updateMany({
        where: {
          id: user.id,
          OR: [{ lastResendAt: null }, { lastResendAt: { lt: cutoff } }],
        },
        data: {
          verifyToken: hashedToken,
          verifyTokenExpiry: expiry,
          lastResendAt: new Date(),
        },
      });

      if (result.count === 0) {
        const fresh = await prisma.user.findUnique({ where: { id: user.id }, select: { lastResendAt: true } });
        if (!fresh) throw new AppError("Something went wrong", 500);

        const elapsed = Date.now() - new Date(fresh.lastResendAt).getTime();

        const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);

        throw new AppError(`Please wait ${waitSeconds} seconds before requesting another verification email.`, 429, "email");
      }

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
