import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/auth";
import { login as loginApi } from "../services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginApi({ email, password });
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #EEEDFE 0%, #e0e7ff 50%, #E1F5EE 100%)",
      }}
    >
      <div className="card bg-base-100 w-full max-w-sm border border-primary/20">
        <div className="card-body gap-4">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <img src="/logo.png" alt="Job Tracker" className="h-12 w-auto" />
            <h1 className="text-2xl font-bold text-primary">Job Tracker</h1>
            <p className="text-sm text-base-content/50">Sign in to your account</p>
          </div>

          {/* Error */}
          {error && <div className="bg-error/10 text-error text-sm px-3 py-2 rounded-lg">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <label className="form-control w-full">
              <div className="label pb-1">
                <span className="label-text text-xs font-medium">Email</span>
              </div>
              <input type="email" className="input input-primary w-full focus:border-primary" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
            </label>

            {/* Password */}
            <label className="form-control w-full">
              <div className="label pb-1">
                <span className="label-text text-xs font-medium">Password</span>
              </div>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} className="input input-bordered w-full pr-10 focus:input-primary" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/70" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                </button>
              </div>
            </label>

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-full mt-1" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Sign In"}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-base-content/50">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
