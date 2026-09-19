"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { Eye, EyeOff, MailCheck } from "lucide-react";
import Image from "next/image";

import { register as registerApi, resendVerification } from "@/services/api";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Register() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileWidgetId, setTurnstileWidgetId] = useState(null);
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    turnstileToken: "",
  });
  const [loading, setLoading] = useState(false);

  // validasi field sebelum submit ke backend
  const validate = () => {
    const newErrors = {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      turnstileToken: "",
    };

    if (!email) {
      newErrors.email = "Email is required";
    }

    if (!username) {
      newErrors.username = "Username is required";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[a-zA-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  // re-render turnstile widget setiap komponen dimuat
  useEffect(() => {
    let widgetId = null;
    let cancelled = false;

    function renderTurnstile() {
      if (cancelled) return;
      if (window.turnstile) {
        widgetId = window.turnstile.render("#turnstile-widget", {
          sitekey: siteKey,
          size: "flexible",
          callback: (token) => {
            setTurnstileToken(token);
          },
        });
        setTurnstileWidgetId(widgetId);
      } else {
        // Coba lagi jika file JavaScript Turnstile belum selesai dimuat oleh browser
        setTimeout(renderTurnstile, 100);
      }
    }

    renderTurnstile();

    return () => {
      // Hentikan proses render dan hapus widget dari DOM jika user keburu pindah halaman
      cancelled = true;
      if (widgetId !== null && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [siteKey]);

  // Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await registerApi({
        email,
        username,
        password,
        turnstileToken,
      });

      setEmailSent(true);
    } catch (err) {
      const message = err.message || "Failed to register";

      // Error field spesifik akan ditempel ke input, sedangkan error 500, jaringan, atau field asing dialihkan ke toast.
      const knownFields = ["email", "username", "password", "turnstileToken"];

      if (err.field && knownFields.includes(err.field)) {
        setErrors({
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
          turnstileToken: "",
          [err.field]: message,
        });
      } else {
        toast.add({
          type: "error",
          description: message,
        });
      }

      // token turnstile sekali pakai, reset widget biar user captcha ulang
      if (turnstileWidgetId !== null && window.turnstile) {
        window.turnstile.reset(turnstileWidgetId);
      }
      setTurnstileToken("");
    } finally {
      setLoading(false);
    }
  };

  // Resend verification
  const handleResendVerification = async () => {
    setResendLoading(true);

    try {
      const data = await resendVerification({ email });

      toast.add({
        type: "success",
        description: data.message || "Verification email sent! Check your inbox.",
      });
    } catch (err) {
      toast.add({
        type: "error",
        description: err.message || "Failed to resend. Try again.",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="login-bg flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-sm rounded-2xl border border-primary/20 bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-4 p-6">
          {/* Logo & heading */}
          <header className="mb-2 flex flex-col items-center gap-2">
            <Image src="/logo.png" width={1254} height={1254} className="h-12 w-auto object-contain" alt="Job Tracker logo" priority />

            <h1 className="text-2xl font-bold text-primary">Job Tracker</h1>

            <p className="text-sm text-muted-foreground">{emailSent ? "Verify your email address" : "Create your account"}</p>
          </header>

          {emailSent ? (
            <div className="space-y-4">
              {/* Verification success */}
              <div className="rounded-xl bg-green-500/10 p-5 text-left shadow-sm dark:bg-green-500/15">
                <h3 className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-400">
                  <MailCheck size={18} />
                  Check your inbox
                </h3>

                <p className="mt-2 text-sm text-green-700/80 dark:text-green-400/80">We&apos;ve sent a verification email to:</p>

                <div className="mt-2 break-all rounded-lg bg-black/10 px-3 py-2 text-sm font-medium text-green-800 dark:text-green-300">{email}</div>

                <p className="mt-2 text-sm text-green-700/80 dark:text-green-400/80">Please verify your account before signing in.</p>
              </div>

              {/* Resend verification */}
              <Button type="button" variant="outline" onClick={handleResendVerification} disabled={resendLoading} className="h-10 w-full rounded-2xl cursor-pointer">
                {resendLoading ? "Sending..." : "Resend verification email"}
              </Button>

              {/* Back to login */}
              <Link href="/login" className="flex h-10 w-full items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-colors hover:bg-primary-hover">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1">
                <label htmlFor="register-email" className="text-xs font-medium">
                  Email
                </label>

                <Input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="h-10 rounded-xl focus-visible:ring-0 focus-visible:border-primary"
                />

                {errors.email && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1">
                <label htmlFor="register-username" className="text-xs font-medium">
                  Username
                </label>

                <Input
                  id="register-username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-10 rounded-xl focus-visible:ring-0 focus-visible:border-primary"
                />

                {errors.username && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label htmlFor="register-password" className="text-xs font-medium">
                  Password
                </label>

                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 rounded-xl pr-10 focus-visible:ring-0 focus-visible:border-primary"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                  </button>
                </div>

                {errors.password && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-1">
                <label htmlFor="register-confirmPassword" className="text-xs font-medium">
                  Confirm Password
                </label>

                <div className="relative">
                  <Input
                    id="register-confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-10 rounded-xl pr-10 focus-visible:ring-0 focus-visible:border-primary"
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirm ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div id="turnstile-widget" className="w-full"></div>

              {/* pesan error captcha */}
              {errors.turnstileToken && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.turnstileToken}
                </p>
              )}

              {/* script load library */}
              <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" />

              {/* Submit */}
              <Button type="submit" className="mt-1 h-10 w-full cursor-pointer rounded-2xl" disabled={loading}>
                {loading ? <span className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : "Sign Up"}
              </Button>
            </form>
          )}

          {/* Login */}
          {!emailSent && (
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
