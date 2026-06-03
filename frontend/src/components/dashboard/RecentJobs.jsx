import { Link } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
import StatusBadge from "../jobs/StatusBadge"; 
import { formatDate } from "../../utils/date"; 
import EmptyState from "../common/EmptyState"; 

export default function RecentJobs({ jobs }) {
  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm">
      <div className="card-body p-4 gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">Recent Applications</h2>
          <Link to="/jobs" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            icon={BriefcaseBusiness}
            title="No applications yet"
            description="Start adding jobs to track them here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm text-center">
              <thead>
                <tr className="text-xs text-base-content/40">
                  <th>Company</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover">
                    <td className="font-medium text-sm">{job.company}</td>
                    <td className="text-sm text-base-content/60">{job.position}</td>
                    <td>
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="text-xs text-base-content/50 whitespace-nowrap">
                      {formatDate(job.appliedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}