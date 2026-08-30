import { Resend } from "resend";
import AppError from "@/lib/AppError";

const resend = new Resend(process.env.RESEND_API_KEY);
let warnedAboutDefaultSender = false;

const ensureEmailConfig = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new AppError("RESEND_API_KEY is not configured", 500);
  }
  if (!process.env.FRONTEND_URL) {
    throw new AppError("FRONTEND_URL is not configured", 500);
  }
  if (!process.env.FROM_EMAIL) {
    throw new AppError("FROM_EMAIL is not configured", 500);
  }

  if (process.env.FROM_EMAIL === "onboarding@resend.dev" && !warnedAboutDefaultSender) {
    console.warn("Using onboarding@resend.dev. Use a verified Resend domain before production.");
    warnedAboutDefaultSender = true;
  }
};

export const sendVerificationEmail = async (email, token) => {
  ensureEmailConfig();

  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Verify your Job Tracker account",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #534ab7;">Verify your email</h2>
        <p>Click the button below to verify your Job Tracker account.</p>
        <a href="${verifyUrl}"
           style="display: inline-block; background: #534ab7; color: white;
                  padding: 12px 24px; border-radius: 8px; text-decoration: none;
                  font-weight: 600; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #888; font-size: 14px;">
          Link expires in 24 hours. If you didn't create an account, ignore this email.
        </p>
        <p style="color: #bbb; font-size: 12px;">
          Or copy this link: ${verifyUrl}
        </p>
      </div>
    `,
  });

  if (error) {
    throw new AppError(error.message || "Failed to send verification email", 502);
  }
};
