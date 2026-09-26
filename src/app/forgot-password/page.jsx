"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MailCheck } from "lucide-react";

import { forgotPassword as forgotPasswordApi } from "@/services/api";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await forgotPasswordApi({ email });
      setSent(true);
    } catch (err) {
      toast.add({
        type: "error",
        description: err.message || "Something went wrong. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-bg min-h-screen flex items-center justify-center px-4">
      <section className="w-full max-w-sm rounded-2xl border border-primary/20 bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-4 p-6">
          {/* Header */}
          <header className="flex flex-col items-center gap-2 mb-2">
            <Image src="/logo.png" width={1254} height={1254} className="h-12 w-auto object-contain" alt="Job Tracker logo" priority />

            <h1 className="text-2xl font-bold text-primary">Forgot Password</h1>

            <p className="text-sm text-muted-foreground text-center">{sent ? "Check your email for the reset link." : "Enter your email to reset your password."}</p>
          </header>

          {sent ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-left dark:border-green-900 dark:bg-green-950/40">
                <h3 className="flex items-center gap-2 font-semibold text-green-800 dark:text-green-300">
                  <MailCheck size={18} />
                  Check your inbox
                </h3>

                <p className="mt-2 text-sm text-green-700 dark:text-green-400">Check the inbox for:</p>

                <div className="mt-2 break-all rounded-lg bg-black/5 px-3 py-2 text-sm font-medium text-green-800 dark:bg-white/10 dark:text-green-300">{email}</div>

                <p className="mt-2 text-sm text-green-700 dark:text-green-400">We&apos;ve sent a password reset link.</p>
              </div>

              <Button render={<Link href="/login" />} className="w-full h-10 rounded-2xl">
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1">
                <label htmlFor="forgot-email" className="text-xs font-medium">
                  Email
                </label>

                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="text-sm h-10 rounded-xl focus-visible:ring-0 focus-visible:border-primary"
                />
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full h-10 mt-1 rounded-2xl cursor-pointer" disabled={loading}>
                {loading ? <span className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : "Send Reset Link"}
              </Button>

              {/* Login */}
              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
