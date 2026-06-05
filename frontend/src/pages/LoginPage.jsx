import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/auth";
import { login as loginApi, resendVerification } from "../services/api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNeedsVerification(false);
    setLoading(true);

    try {
      const data = await loginApi({ email, password });
      login(data.token, data.user);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      const message = err.message || "Invalid email or password";
      setError(message);
      if (message.toLowerCase().includes("verify")) {
        setNeedsVerification(true);
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      const data = await resendVerification({ email });
      toast.success(data.message || "Verification email sent! Check your inbox.");
    } catch {
      toast.error("Failed to resend. Try again.");
    } finally {
      setResendLoading(false);
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
            <h1 className="text-2xl font-bold text-primary">Job Tracker</h1>
            <p className="text-sm text-base-content/50">Sign in to your account</p>
          </header>

          {error && (
            <p role="alert" className="bg-error/10 text-error text-sm px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="login-email" className="text-xs font-medium">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full h-10 rounded-xl border border-base-300 bg-base-100 px-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="login-password" className="text-xs font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-10 rounded-xl border border-base-300 bg-base-100 px-3 pr-10 text-sm outline-none transition-colors focus:border-primary"
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

            <button type="submit" className="btn btn-primary w-full mt-1" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Sign In"}
            </button>

            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {needsVerification && (
              <div className="bg-warning/10 text-warning text-sm px-3 py-2 rounded-lg flex items-center justify-between gap-2">
                <span>Email not verified.</span>
                <button type="button" onClick={handleResendVerification} disabled={resendLoading} className="text-xs font-medium underline">
                  {resendLoading ? "Sending..." : "Resend link"}
                </button>
              </div>
            )}
          </form>

          <p className="text-center text-sm text-base-content/50">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}