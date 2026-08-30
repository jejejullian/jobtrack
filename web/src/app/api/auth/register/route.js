import prisma from "@/lib/prisma";
import AppError from "@/lib/AppError";
import { hashPassword, generateToken, hashToken, normalizeEmail } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import dns from "dns/promises";

// config & state
const VERIFICATION_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const resendAttempts = new Map();

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

// cooldown resend verifikasi
const enforceResendCooldown = (email) => {
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
    const { username, password } = body;
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

    //  validasi domain email (tolak email dari domain fiktif)
    const hasMx = await checkMxRecord(email);
    if (!hasMx) {
      throw new AppError("Email domain does not exist or cannot receive email", 400, "email");
    }

    //  cek apakah email sudah pernah dipakai
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      if (existingEmail.isVerified) {
        throw new AppError("Email already in use", 409, "email");
      }

      // email sudah dipakai TAPI belum diverifikasi -> kirim ulang link verifikasi
      enforceResendCooldown(email);

      // generate token verifikasi baru, timpa yang lama
      const rawToken = generateToken();
      const hashedToken = hashToken(rawToken);
      const expiry = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS);

      await prisma.user.update({
        where: { id: existingEmail.id },
        data: {
          verifyToken: hashedToken,
          verifyTokenExpiry: expiry,
        },
      });

      await sendVerificationEmail(email, rawToken);

      return Response.json({ message: "Register successful. Please check your email to verify your account." }, { status: 200 });
    }

    //  cek username sudah dipakai atau belum
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
