import Link from "next/link";
import { Clock } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";

// applied jobs not updated in 14+ days 
export default function FollowUpJobs({ jobs, totalCount = jobs.length }) {
  const hiddenCount = totalCount - jobs.length;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm">Needs Follow-up</h2>
            {totalCount > 0 && <Badge className="rounded-full">{totalCount}</Badge>}
          </div>

          <Link href="/jobs" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>

        {jobs.length === 0 ? (
          <EmptyState icon={Clock} title="All caught up!" description="No applications need follow-up right now." />
        ) : (
          <>
            <ul className="space-y-2">
              {jobs.map((job) => (
                <li key={job.id} className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{job.company}</p>
                    <p className="text-xs text-muted-foreground truncate">{job.position}</p>
                  </div>
                  <span className="text-xs text-primary font-semibold shrink-0 ml-3">{job.daysSince}d ago</span>
                </li>
              ))}
            </ul>

            {hiddenCount > 0 && (
              <Link href="/jobs" className="block text-center text-xs text-muted-foreground hover:text-primary hover:underline pt-1">
                +{hiddenCount} more need follow-up
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}