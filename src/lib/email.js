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

// send verification email
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

// send notice saat ada resend/overwrite ke email yang belum verified
export const sendOverwriteNotice = async (email, newUsername) => {
  ensureEmailConfig();

  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "New registration attempt on your pending Job Tracker account",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #534ab7;">Registration details were updated</h2>
        <p>
          Someone just submitted a new registration for this email address,
          using the username <strong>${newUsername}</strong> and a new password.
        </p>
        <p>
          If this was you, you can ignore this message — just use the verification
          email that follows to activate your account.
        </p>
        <p style="color: #c0392b; font-weight: 600;">
          If this was NOT you, do not click the verification link that follows.
          Someone else may be trying to take over this pending registration.
        </p>
        <p style="color: #888; font-size: 14px;">
          This account has not been verified yet, so no one can log in until
          a verification link is clicked.
        </p>
      </div>
    `,
  });

  if (error) {
   // tidak throw, notif gagal tidak-apa
    console.error("Failed to send overwrite notice:", error.message);
  }
};

// send reset password email
export const sendResetPasswordEmail = async (email, token) => {
  ensureEmailConfig();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;

  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Reset your Job Tracker password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #534ab7;">Reset your password</h2>
        <p>Click the button below to reset your Job Tracker password.</p>
        <a href="${resetUrl}"
           style="display: inline-block; background: #534ab7; color: white;
                  padding: 12px 24px; border-radius: 8px; text-decoration: none;
                  font-weight: 600; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #888; font-size: 14px;">
          Link expires in 1 hour. If you didn't request this, ignore this email.
        </p>
        <p style="color: #bbb; font-size: 12px;">
          Or copy this link: ${resetUrl}
        </p>
      </div>
    `,
  });

  if (error) {
    throw new AppError(error.message || "Failed to send reset password email", 502);
  }
};
