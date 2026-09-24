"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import { CheckCircle, XCircle } from "lucide-react";

import { verifyEmail, resendVerification } from "@/services/api";

import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const REDIRECT_SECONDS = 10;

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState(token ? "loading" : "error");
  const [message, setMessage] = useState(token ? "" : "Invalid verification link.");
  const [resendEmail, setResendEmail] = useState(() => searchParams.get("email") || "");
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  const handleResend = async () => {
    if (!resendEmail) {
      toast.add({
        type: "error",
        description: "Enter your email first.",
      });
      return;
    }

    setResendLoading(true);
    try {
      const data = await resendVerification({ email: resendEmail });
      toast.add({
        type: "success",
        description: data.message || "New verification link sent! Check your inbox.",
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

  // verifikasi token ke backend
  useEffect(() => {
    if (!token) return;

    const email = searchParams.get("email") || "";

    verifyEmail(token, email)
      .then((data) => {
        setStatus("success");
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Verification failed. The link may have expired.");
      });
  }, [token, searchParams]);

  // countdown
  useEffect(() => {
    if (status !== "success") return;

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // navigasi
  useEffect(() => {
    if (status === "success" && countdown === 0) {
      router.push("/login");
    }
  }, [status, countdown, router]);

  return (
    <main className="login-bg min-h-screen flex items-center justify-center px-4">
      <section className="w-full max-w-sm rounded-2xl border border-primary/20 bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <Image src="/logo.png" width={1254} height={1254} className="h-12 w-auto object-contain" alt="Job Tracker logo" priority />

          {status === "loading" && (
            <>
              <span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Verifying your email...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle size={48} className="text-green-600 dark:text-green-400" strokeWidth={1.5} />
              <h1 className="text-lg font-semibold">Email Verified!</h1>
              <p className="text-sm text-muted-foreground">{message}</p>
              <p className="text-xs text-muted-foreground/70">Redirecting to login in {countdown}s...</p>
             <Button className="w-full h-10 rounded-2xl cursor-pointer" render={<Link href="/login">Sign In Now</Link>} />
            </>
          )}

          {status === "error" && (
            <>
              <XCircle size={48} className="text-destructive" strokeWidth={1.5} />
              <h1 className="text-lg font-semibold">Verification Failed</h1>
              <p className="text-sm text-muted-foreground">{message}</p>

              <div className="w-full space-y-2">
                <p className="text-xs text-muted-foreground">Need a new verification link?</p>
                <Input type="email" placeholder="Enter your email" value={resendEmail} onChange={(e) => setResendEmail(e.target.value)} className="h-10 rounded-xl focus-visible:ring-0 focus-visible:border-primary" />
                <Button onClick={handleResend} disabled={resendLoading || !resendEmail} className="w-full h-10 rounded-2xl cursor-pointer">
                  {resendLoading ? <span className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : "Resend Verification Email"}
                </Button>
              </div>

              <Link href="/login" className="text-xs text-primary hover:underline">
                Back to Login
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
