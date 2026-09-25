"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { resetPassword as resetPasswordApi } from "@/services/api";

import { toast } from "@/components/ui/toast";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // samain persis sama aturan backend (reset-password/route.js)
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!/[a-zA-Z]/.test(password)) {
      setError("Password must contain at least one letter.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid reset link.");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordApi({ token, password });
      toast.add({
        type: "success",
        description: "Password reset successfully!",
      });
      router.push("/login");
    } catch (err) {
      setError(err.message || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <main className="login-bg min-h-screen flex items-center justify-center px-4">
        <section className="w-full max-w-sm rounded-2xl border border-primary/20 bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col gap-4 p-6 text-center">
            <p className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">Invalid or missing reset token.</p>

            <Link href="/login" className={buttonVariants({ className: "rounded-xl" })}>
              Back to Login
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="login-bg min-h-screen flex items-center justify-center px-4">
      <section className="w-full max-w-sm rounded-2xl border border-primary/20 bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-4 p-6">
          <header className="flex flex-col items-center gap-2 mb-2">
            <Image src="/logo.png" width={1254} height={1254} className="h-12 w-auto object-contain" alt="Job Tracker logo" priority />
            <h1 className="text-2xl font-bold text-primary">Reset Password</h1>
            <p className="text-sm text-muted-foreground">Enter your new password below.</p>
          </header>

          {error && (
            <p role="alert" className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="reset-password" className="text-xs font-medium">
                New Password
              </label>
              <div className="relative">
                <Input
                  id="reset-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className="text-sm h-10 rounded-xl pr-10 focus-visible:ring-0 focus-visible:border-primary"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="reset-confirm" className="text-xs font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="reset-confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="text-sm h-10 rounded-xl pr-10 focus-visible:ring-0 focus-visible:border-primary"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-10 mt-1 rounded-2xl cursor-pointer" disabled={loading}>
              {loading ? <span className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : "Reset Password"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="text-primary font-medium hover:underline">
                Back to Login
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
