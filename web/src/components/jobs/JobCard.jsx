"use client";

import { Calendar, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate } from "@/utils/date";

import { Button } from "@/components/ui/button";

export default function JobCard({ job, onDelete, onEdit }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-2 p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-card-foreground">{job.company}</h3>
            <p className="text-sm text-muted-foreground">{job.position}</p>
          </div>
          <StatusBadge status={job.status} className="shrink-0" />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
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
        {job.notes && <p className="line-clamp-2 text-xs text-muted-foreground">{job.notes}</p>}

        {/* Reference Link */}
        {job.referenceLink ? (
          <a href={job.referenceLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline hover:text-primary/70">
            View Link
          </a>
        ) : (
          <span className="text-xs text-muted-foreground/50">—</span>
        )}

        {/* Actions */}
        <div className="mt-1 flex justify-end gap-2 border-t border-border px-2 py-1">
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-destructive hover:text-destructive" onClick={() => onDelete(job.id)}>
            Delete
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => onEdit(job)}>
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}
