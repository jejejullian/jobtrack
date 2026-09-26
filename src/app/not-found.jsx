import Link from "next/link";
import { FileQuestion } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <EmptyState
        icon={FileQuestion}
        title="Page not found"
        description="The page you are looking for does not exist or has been moved."
        action={
          <Link
            href="/jobs"
            className="flex h-7 items-center justify-center rounded-xl bg-primary px-2.5 text-[0.8rem] font-medium text-primary-foreground shadow-none transition-colors hover:bg-primary-hover"
          >
            Back to Jobs
          </Link>
        }
      />
    </div>
  );
}