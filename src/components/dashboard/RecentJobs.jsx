import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";
import StatusBadge from "@/components/jobs/StatusBadge";
import { formatDate } from "@/utils/date";
import EmptyState from "@/components/common/EmptyState";

// 5 most recent applications
export default function RecentJobs({ jobs }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">Recent Applications</h2>
          <Link href="/jobs" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>

        {jobs.length === 0 ? (
          <EmptyState icon={BriefcaseBusiness} title="No applications yet" description="Start adding jobs to track them here." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse">
              <thead className="bg-muted text-xs font-normal text-muted-foreground/70">
                <tr className="text-center">
                  <th className="px-3 py-2">Company</th>
                  <th className="px-3 py-2">Position</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Date</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {jobs.map((job) => (
                  <tr key={job.id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-3 py-2 font-medium text-sm">{job.company}</td>
                    <td className="px-3 py-2 text-sm text-muted-foreground">{job.position}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground/70">{formatDate(job.appliedAt)}</td>
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