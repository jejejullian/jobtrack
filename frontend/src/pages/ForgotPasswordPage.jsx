import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword as forgotPasswordApi } from "../services/api";
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
            <p className="text-sm text-base-content/50 text-center">
              Enter your email and we'll send a reset link.
            </p>
          </header>

          {sent ? (
            <div className="space-y-4">
              <div className="alert alert-success rounded-xl text-sm shadow-none">
                <span>
                  If <strong>{email}</strong> is registered, a reset link has been sent. Check your inbox.
                </span>
              </div>
              <Link to="/login" className="btn btn-ghost btn-sm rounded-xl w-full">
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

              <button type="submit" className="btn btn-primary w-full mt-1" disabled={loading}>
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