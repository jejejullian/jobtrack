import prisma from "@/lib/prisma";
import AppError from "@/lib/AppError";
import { hashPassword, generateToken, hashToken, normalizeEmail } from "@/lib/auth";
import { sendVerificationEmail, sendOverwriteNotice } from "@/lib/email";
import dns from "dns/promises";

// config & state
const VERIFICATION_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

// cek domain email MX record (bisa menerima email atau tidak)
const checkMxRecord = async (email) => {
  const domain = email.split("@")[1];
  try {
    const records = await dns.resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password, turnstileToken } = body;
    const email = normalizeEmail(body.email);

    //  validasi input dasar
    if (!email) throw new AppError("Email is required", 400, "email");
    if (!username) throw new AppError("Username is required", 400, "username");
    if (!password) throw new AppError("Password is required", 400, "password");
    if (password.length < 8) {
      throw new AppError("Password must be at least 8 characters", 400, "password");
    }
    if (!/[a-zA-Z]/.test(password)) {
      throw new AppError("Password must contain at least one letter", 400, "password");
    }
    if (!/[0-9]/.test(password)) {
      throw new AppError("Password must contain at least one number", 400, "password");
    }

    // validasi turnstile token SEBELUM proses apa pun
    if (!turnstileToken) {
      throw new AppError("CAPTCHA verification is required", 400, "turnstileToken");
    }

    const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY, 
        response: turnstileToken,
      }),
    });

    const turnstileData = await turnstileRes.json();

    if (!turnstileData.success) {
      throw new AppError("CAPTCHA verification failed. Please try again.", 400, "turnstileToken");
    }

    //  validasi domain email (tolak email dari domain fiktif)
    const hasMx = await checkMxRecord(email);
    if (!hasMx) {
      throw new AppError("Email domain does not exist or cannot receive email", 400, "email");
    }

    //  cek email sudah pernah dipakai/belum
    const existingEmail = await prisma.user.findUnique({ where: { email } });

    if (existingEmail) {
      if (existingEmail.isVerified) {
        throw new AppError("Email already in use", 409, "email");
      }

      // cek cooldown SEBELUM proses apa pun
      const cutoff = new Date(Date.now() - RESEND_COOLDOWN_MS);
      if (existingEmail.lastResendAt && existingEmail.lastResendAt > cutoff) {
        const elapsed = Date.now() - new Date(existingEmail.lastResendAt).getTime();
        const waitSeconds = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
        throw new AppError(`Please wait ${waitSeconds} seconds before requesting another verification email.`, 429, "email");
      }

      // cek username baru tidak dipakai user LAIN (exclude diri sendiri)
      if (username !== existingEmail.username) {
        const usernameTaken = await prisma.user.findUnique({ where: { username } });
        if (usernameTaken && usernameTaken.id !== existingEmail.id) {
          throw new AppError("Username already taken", 409, "username");
        }
      }

      const hashed = await hashPassword(password);
      const rawToken = generateToken();
      const hashedToken = hashToken(rawToken);
      const expiry = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS);

      await prisma.user.update({
        where: { id: existingEmail.id },
        data: {
          username,
          password: hashed,
          verifyToken: hashedToken,
          verifyTokenExpiry: expiry,
          lastResendAt: new Date(),
        },
      });

      await sendOverwriteNotice(email, username);
      await sendVerificationEmail(email, rawToken);

      return Response.json({ message: "This email already has a pending registration. We've updated your details and resent the verification email." }, { status: 200 });
    }

    //  cek username sudah terpakai/belum
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) throw new AppError("Username already taken", 409, "username");

    //  user baru
    const hashed = await hashPassword(password);

    const rawToken = generateToken();
    const hashedToken = hashToken(rawToken);
    const expiry = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS);

    await prisma.user.create({
      data: {
        email,
        username,
        password: hashed,
        verifyToken: hashedToken,
        verifyTokenExpiry: expiry,
        lastResendAt: new Date(),
      },
    });

    await sendVerificationEmail(email, rawToken);

    return Response.json({ message: "Register successful. Please check your email to verify your account." }, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json({ error: error.message, field: error.field }, { status: error.statusCode });
    }

    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
