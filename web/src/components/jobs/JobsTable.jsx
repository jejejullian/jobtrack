"use client";

import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/date";
import StatusBadge from "./StatusBadge";

import { Button } from "@/components/ui/button";

// desktop job table
export default function JobsTable({ jobs, onStatusChange, onEdit, onDelete }) {
  return (
    <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
      <table className="w-full border-collapse">
        <thead className="bg-muted text-xs font-normal text-muted-foreground/70">
          <tr className="text-center">
            <th className="px-3 py-2">Company</th>
            <th className="px-3 py-2">Position</th>
            <th className="px-3 py-2">Location</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Applied Date</th>
            <th className="px-3 py-2">Link</th>
            <th className="px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {jobs.map((job) => (
            <tr key={job.id} className="border-t border-border hover:bg-muted/50">
              <td className="px-3 py-2 font-medium">{job.company}</td>
              <td className="px-3 py-2 text-muted-foreground">{job.position}</td>
              <td className="px-3 py-2 text-sm text-muted-foreground/70">{job.location || "-"}</td>
              <td className="px-3 py-2">
                <StatusBadge status={job.status} onChange={(newStatus) => onStatusChange(job.id, newStatus)} useFixed={true} />
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-sm text-muted-foreground">{formatDate(job.appliedAt)}</td>
              <td className="px-3 py-2">
                {job.referenceLink ? (
                  <a href={job.referenceLink} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline hover:text-primary/70">
                    View Link
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground/50">-</span>
                )}
              </td>
              <td className="flex items-center justify-center gap-1 px-3 py-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(job)} className="h-7 w-7 p-0 text-muted-foreground/50 hover:bg-transparent hover:text-foreground">
                  <Pencil size={14} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(job.id)} className="h-7 w-7 p-0 text-destructive/50 hover:bg-transparent hover:text-destructive">
                  <Trash2 size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
