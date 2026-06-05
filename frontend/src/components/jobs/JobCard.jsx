import { Calendar, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../../utils/date";

// mobile job card
export default function JobCard({ job, onDelete, onStatusChange, onEdit }) {
  return (
    <div className="card card-bordered bg-base-100 shadow-sm">
      <div className="card-body p-4 gap-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-base">{job.company}</h3>
            <p className="text-sm text-base-content/60">{job.position}</p>
          </div>
          <StatusBadge status={job.status} onChange={(newStatus) => onStatusChange(job.id, newStatus)} className="shrink-0" />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-base-content/50">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {job.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(job.appliedAt)}
          </span>
        </div>

        {/* Notes */}
        {job.notes && <p className="text-xs text-base-content/60 line-clamp-2">{job.notes}</p>}

        {/* Reference Link */}
        {job.referenceLink ? (
          <a href={job.referenceLink} target="_blank" rel="noopener noreferrer" className="text-primary text-xs underline hover:text-black/50">
            View Link
          </a>
        ) : (
          <span className="text-base-content/30 text-xs">—</span>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 border-t border-base-300 mt-1 py-1 px-2">
          <button className="btn btn-ghost btn-xs text-error" onClick={() => onDelete(job.id)}>
            Delete
          </button>

          <button className="btn btn-ghost btn-xs text-base-content/60 hover:text-base-content" onClick={() => onEdit(job)}>
            {" "}
            Edit{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
