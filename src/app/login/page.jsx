"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

import { useAuth } from "@/context/AuthContext";
import { login as loginApi, getMe, resendVerification } from "@/services/api";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const { updateUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNeedsVerification(false);
    setLoading(true);

    try {
      await loginApi({ email, password });

      const me = await getMe();
      updateUser(me.user);

      router.push("/jobs");
    } catch (err) {
      const message = err.message || "Invalid email or password";

      setError(message);

      if (message.toLowerCase().includes("verify")) {
        setNeedsVerification(true);
      }
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
    } catch {
      toast.add({
        type: "error",
        description: "Failed to resend. Try again.",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="login-bg min-h-screen flex items-center justify-center px-4">
      <section className="w-full max-w-sm rounded-2xl border border-primary/20 bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-4 p-6">
          {/* Header */}
          <header className="flex flex-col items-center gap-2 mb-2">
            <Image src="/logo.png" width={1254} height={1254} className="h-12 w-auto object-contain" alt="Job Tracker logo" priority />

            <h1 className="text-2xl font-bold text-primary">Job Tracker</h1>

            <p className="text-sm text-muted-foreground">Sign in to your account</p>
          </header>

          {/* Error */}
          {error && (
            <p role="alert" className="bg-destructive/10 text-destructive text-sm px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="login-email" className="text-xs font-medium">
                Email
              </label>

              <Input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="text-sm h-10 rounded-xl focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="login-password" className="text-xs font-medium">
                Password
              </label>

              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            {/* Submit */}
            <Button type="submit" className="w-full h-10 mt-1 rounded-2xl cursor-pointer" disabled={loading}>
              {loading ? <span className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : "Sign In"}
            </Button>

            {/* Forgot password */}
            <div className="text-right">
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Verification */}
            {needsVerification && (
              <div className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-sm px-3 py-2 rounded-lg flex items-center justify-between gap-2">
                <span>Email not verified.</span>

                <button type="button" onClick={handleResendVerification} disabled={resendLoading} className="text-xs font-medium underline">
                  {resendLoading ? "Sending..." : "Resend link"}
                </button>
              </div>
            )}
          </form>

          {/* Register */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
