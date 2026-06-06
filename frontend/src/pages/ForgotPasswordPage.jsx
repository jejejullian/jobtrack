import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword as forgotPasswordApi } from "../services/api";
import { MailCheck } from "lucide-react";
import toast from "react-hot-toast";

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
      toast.error(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #EEEDFE 0%, #e0e7ff 50%, #E1F5EE 100%)",
      }}
    >
      <section className="card bg-base-100 w-full max-w-sm border border-primary/20">
        <div className="card-body gap-4">
          <header className="flex flex-col items-center gap-2 mb-2">
            <img src="/logo.png" alt="Job Tracker logo" className="h-12 w-auto" />
            <h1 className="text-2xl font-bold text-primary">Forgot Password</h1>
            <p className="text-sm text-base-content/50 text-center">{sent ? "Check your email for the reset link." : "Enter your email to reset your password."}</p>
          </header>

          {sent ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-success p-5 text-left shadow-sm">
                <h3 className="flex items-center gap-2 font-semibold text-success-content">
                  <MailCheck size={18} />
                  Check your inbox
                </h3>

                <p className="mt-2 text-sm text-success-content/80">Check the inbox for:</p>

                <div className="mt-2 break-all rounded-lg bg-black/10 px-3 py-2 text-sm font-medium text-success-content">{email}</div>

                <p className="mt-2 text-sm text-success-content/80">We've sent a password reset link.</p>
              </div>

              <Link to="/login" className="btn btn-primary w-full rounded-2xl">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="forgot-email" className="text-xs font-medium">
                  Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full h-10 rounded-xl border border-base-300 bg-base-100 px-3 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>

              <button type="submit" className="btn btn-primary w-full mt-1 rounded-2xl" disabled={loading}>
                {loading ? <span className="loading loading-spinner loading-sm" /> : "Send Reset Link"}
              </button>

              <p className="text-center text-sm text-base-content/50">
                Remember your password?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
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
