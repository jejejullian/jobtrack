import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import EmptyState from "../common/EmptyState";

export default function FollowUpJobs({ jobs }) {
  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm">
      <div className="card-body p-4 gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm">Needs Follow-up</h2>

            {jobs.length > 0 && <span className="badge badge-primary badge-sm">{jobs.length}</span>}
          </div>

          <Link to="/jobs" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>

        {jobs.length === 0 ? (
          <EmptyState icon={Clock} title="All caught up!" description="No applications need follow-up right now." />
        ) : (
          <ul className="space-y-2">
            {jobs.map((job) => (
              <li key={job.id} className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{job.company}</p>

                  <p className="text-xs text-base-content/50 truncate">{job.position}</p>
                </div>

                <span className="text-xs text-primary font-semibold shrink-0 ml-3">{job.daysSince}d ago</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
