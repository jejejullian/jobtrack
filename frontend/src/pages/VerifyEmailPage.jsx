import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { verifyEmail, resendVerification } from "../services/api";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState(() => searchParams.get("email") || "");
  const [resendLoading, setResendLoading] = useState(false);

  const handleResend = async () => {
    if (!resendEmail) {
      toast.error("Enter your email first.");
      return;
    }

    setResendLoading(true);
    try {
      const data = await resendVerification({ email: resendEmail });
      toast.success(data.message || "New verification link sent! Check your inbox.");
    } catch (err) {
      toast.error(err.message || "Failed to resend. Try again.");
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email") || "";

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    verifyEmail(token, email)
      .then((data) => {
        setStatus("success");
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Verification failed. The link may have expired.");
      });
  }, [searchParams]);

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #EEEDFE 0%, #e0e7ff 50%, #E1F5EE 100%)",
      }}
    >
      <section className="card bg-base-100 w-full max-w-sm border border-primary/20">
        <div className="card-body gap-4 items-center text-center">
          <img src="/logo.png" alt="Job Tracker logo" className="h-12 w-auto" />

          {status === "loading" && (
            <>
              <span className="loading loading-spinner loading-md text-primary" />
              <p className="text-sm text-base-content/60">Verifying your email...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle size={48} className="text-success" strokeWidth={1.5} />
              <h1 className="text-lg font-semibold">Email Verified!</h1>
              <p className="text-sm text-base-content/60">{message}</p>
              <Link to="/login" className="btn btn-primary btn-sm rounded-xl shadow-none w-full">
                Sign In
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle size={48} className="text-error" strokeWidth={1.5} />
              <h1 className="text-lg font-semibold">Verification Failed</h1>
              <p className="text-sm text-base-content/60">{message}</p>

              {/* Tambah ini */}
              <div className="w-full space-y-2">
                <p className="text-xs text-base-content/50">Need a new verification link?</p>
                <input type="email" placeholder="Enter your email" value={resendEmail} onChange={(e) => setResendEmail(e.target.value)} className="input input-bordered input-sm w-full rounded-xl focus:outline-none focus:border-primary" />
                <button onClick={handleResend} disabled={resendLoading || !resendEmail} className="btn btn-primary btn-sm rounded-xl shadow-none w-full">
                  {resendLoading ? <span className="loading loading-spinner loading-xs" /> : "Resend Verification Email"}
                </button>
              </div>

              <Link to="/login" className="text-xs text-primary hover:underline">
                Back to Login
              </Link>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
