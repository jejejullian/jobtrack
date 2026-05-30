import StatusBadge from "./StatusBadge";

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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {job.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {new Date(job.appliedAt).toLocaleDateString("id-ID")}
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
