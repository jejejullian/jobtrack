import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { resetPassword as resetPasswordApi } from "../services/api";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
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
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full h-10 rounded-xl border border-base-300 bg-base-100 px-3 pr-10 text-sm outline-none transition-colors focus:border-primary";

  if (!token) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #EEEDFE 0%, #e0e7ff 50%, #E1F5EE 100%)" }}
      >
        <section className="card bg-base-100 w-full max-w-sm border border-primary/20">
          <div className="card-body gap-4 text-center">
            <p className="text-error text-sm">Invalid or missing reset token.</p>
            <Link to="/login" className="btn btn-primary btn-sm rounded-xl shadow-none">
              Back to Login
            </Link>
          </div>
        </section>
      </main>
    );
  }

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
            <h1 className="text-2xl font-bold text-primary">Reset Password</h1>
            <p className="text-sm text-base-content/50">Enter your new password below.</p>
          </header>

          {error && (
            <p role="alert" className="bg-error/10 text-error text-sm px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* New Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="reset-password" className="text-xs font-medium">
                New Password
              </label>
              <div className="relative">
                <input
                  id="reset-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  className={inputClass}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/70"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="reset-confirm" className="text-xs font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="reset-confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={inputClass}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/70"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-1" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Reset Password"}
            </button>

            <p className="text-center text-sm text-base-content/50">
              <Link to="/login" className="text-primary font-medium hover:underline">
                Back to Login
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}