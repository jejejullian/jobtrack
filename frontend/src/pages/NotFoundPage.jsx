import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import EmptyState from "../components/common/EmptyState";

export default function NotFoundPage() {
  return (
    <EmptyState
      icon={FileQuestion}
      title="Page not found"
      description="The page you are looking for does not exist or has been moved."
      action={
        <Link to="/jobs" className="btn btn-primary btn-sm rounded-xl shadow-none">
          Back to Jobs
        </Link>
      }
    />
  );
}
