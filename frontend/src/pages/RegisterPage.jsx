import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { register as registerApi } from "../services/api";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getErrorField = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("email")) return "email";
    if (lowerMessage.includes("username")) return "username";
    if (lowerMessage.includes("password")) return "password";
    return "password";
  };

  const validate = () => {
    const newErrors = { email: "", username: "", password: "", confirmPassword: "" };
    if (!email) newErrors.email = "Email is required";
    if (!username) newErrors.username = "Username is required";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registerApi({ email, username, password });
      toast.success("Account created successfully!");
      navigate("/login");
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
            <p className="text-sm text-base-content/50">Create your account</p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="form-control w-full">
              <label htmlFor="register-email" className="label pb-1">
                <span className="label-text text-xs font-medium">Email</span>
              </label>
              <input id="register-email" type="email" className="input input-primary w-full focus:border-primary" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
              {errors.email && (
                <p role="alert" className="text-error text-xs mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Username */}
            <div className="form-control w-full">
              <label htmlFor="register-username" className="label pb-1">
                <span className="label-text text-xs font-medium">Username</span>
              </label>
              <input id="register-username" type="text" className="input input-primary w-full focus:border-primary" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              {errors.username && (
                <p role="alert" className="text-error text-xs mt-1">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="form-control w-full">
              <label htmlFor="register-password" className="label pb-1">
                <span className="label-text text-xs font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  className="input input-primary w-full focus:border-primary"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
                <p role="alert" className="text-error text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-control w-full">
              <label htmlFor="register-confirmPassword" className="label pb-1">
                <span className="label-text text-xs font-medium">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  id="register-confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  className="input input-primary w-full focus:border-primary"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
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
                <p role="alert" className="text-error text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full mt-1" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-base-content/50">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
