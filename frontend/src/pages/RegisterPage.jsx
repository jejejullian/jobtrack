import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, MailCheck } from "lucide-react";
import { register as registerApi, resendVerification } from "../services/api";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // helpers
  const getErrorField = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("email")) return "email";
    if (lowerMessage.includes("username")) return "username";
    if (lowerMessage.includes("password")) return "password";
    return "password";
  };

  // client-side validation
  const validate = () => {
    const newErrors = { email: "", username: "", password: "", confirmPassword: "" };
    if (!email) newErrors.email = "Email is required";
    if (!username) newErrors.username = "Username is required";
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[a-zA-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number";
    }
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  // register
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registerApi({ email, username, password });
      setEmailSent(true);
    } catch (err) {
      const message = err.message || "Failed to register";
      const field = err.field || getErrorField(message);
      setErrors({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        [field]: message,
      });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // resend verification
  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      const data = await resendVerification({ email });
      toast.success(data.message || "Verification email sent! Check your inbox.");
    } catch (err) {
      toast.error(err.message || "Failed to resend. Try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const inputClass = "w-full h-10 rounded-xl border border-base-300 bg-base-100 px-3 text-sm outline-none  focus:border-primary";
  const inputClassWithIcon = "w-full h-10 rounded-xl border border-base-300 bg-base-100 px-3 pr-10 text-sm outline-none  focus:border-primary";

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
            <p className="text-sm text-base-content/50">{emailSent ? "Verify your email address" : "Create your account"}</p>
          </header>

          {emailSent ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-success p-5 text-left shadow-sm">
                <h3 className="flex items-center gap-2 font-semibold text-success-content">
                  <MailCheck size={18} />
                  Check your inbox
                </h3>

                <p className="mt-2 text-sm text-success-content/80">We've sent a verification email to:</p>

                <div className="mt-2 break-all rounded-lg bg-black/10 px-3 py-2 text-sm font-medium text-success-content">{email}</div>

                <p className="mt-2 text-sm text-success-content/80">Please verify your account before signing in.</p>
              </div>

              <button type="button" onClick={handleResendVerification} disabled={resendLoading} className="btn btn-outline btn-success w-full rounded-2xl">
                {resendLoading ? "Sending..." : "Resend verification email"}
              </button>

              <Link to="/login" className="btn btn-primary w-full rounded-2xl">
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
                <input id="register-email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus className={inputClass} />
                {errors.email && (
                  <p role="alert" className="text-error text-xs">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1">
                <label htmlFor="register-username" className="text-xs font-medium">
                  Username
                </label>
                <input id="register-username" type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required className={inputClass} />
                {errors.username && (
                  <p role="alert" className="text-error text-xs">
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
                  <input id="register-password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClassWithIcon} />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/70 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                  </button>
                </div>
                {errors.password && (
                  <p role="alert" className="text-error text-xs">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label htmlFor="register-confirmPassword" className="text-xs font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="register-confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={inputClassWithIcon}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/70 cursor-pointer"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirm ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p role="alert" className="text-error text-xs">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-full mt-1" disabled={loading}>
                {loading ? <span className="loading loading-spinner loading-sm" /> : "Sign Up"}
              </button>
            </form>
          )}

          {!emailSent && (
            <p className="text-center text-sm text-base-content/50">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
