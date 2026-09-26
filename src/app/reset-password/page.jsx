import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

function ResetPasswordSkeleton() {
  return (
    <main className="login-bg min-h-screen flex items-center justify-center px-4">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordForm />
    </Suspense>
  );
}