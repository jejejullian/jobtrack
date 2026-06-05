import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../../utils/date";
import StatusBadge from "./StatusBadge";

// desktop job table
export default function JobsTable({ jobs, onStatusChange, onEdit, onDelete }) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-xl border border-base-200 bg-base-100">
      <table className="table w-full">
        <thead className="bg-base-200 text-base-content/40 text-xs font-normal">
          <tr className="text-center">
            <th>Company</th>
            <th>Position</th>
            <th>Location</th>
            <th>Status</th>
            <th>Applied Date</th>
            <th>Link</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {jobs.map((job) => (
            <tr key={job.id} className="hover group">
              <td className="font-medium">{job.company}</td>
              <td className="text-base-content/70">{job.position}</td>
              <td className="text-base-content/50 text-sm">{job.location || "-"}</td>
              <td>
                <StatusBadge status={job.status} onChange={(newStatus) => onStatusChange(job.id, newStatus)} />
              </td>
              <td className="text-sm text-base-content/60 whitespace-nowrap">{formatDate(job.appliedAt)}</td>
              <td>
                {job.referenceLink ? (
                  <a href={job.referenceLink} target="_blank" rel="noopener noreferrer" className="text-primary text-xs underline hover:text-black/50">
                    View Link
                  </a>
                ) : (
                  <span className="text-base-content/30 text-xs">-</span>
                )}
              </td>
              <td className="flex items-center justify-center gap-1">
                <button onClick={() => onEdit(job)} className="btn btn-ghost btn-xs text-base-content/30 hover:text-base-content hover:bg-transparent transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => onDelete(job.id)} className="btn btn-ghost btn-xs text-error/40 hover:text-error hover:bg-transparent transition-colors">
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
