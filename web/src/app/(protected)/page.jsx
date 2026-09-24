import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { JOB_STATUSES } from "@/constants/job";
import { getDaysSince } from "@/utils/date";
import StatCards from "@/components/dashboard/StatCards";
import RecentJobs from "@/components/dashboard/RecentJobs";
import FollowUpJobs from "@/components/dashboard/FollowUpJobs";

// threshold for follow-up alert
const FOLLOW_UP_DAYS = 14;

// no cache, render tiap request
export const dynamic = "force-dynamic";

function getCurrentTimestamp() {
  return Date.now();
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const decoded = token ? verifyToken(token) : null;

  if (!decoded) redirect("/login");

  const jobs = await prisma.job.findMany({
    where: { userId: parseInt(decoded.userId) },
    orderBy: { appliedAt: "desc" },
  });

  const now = getCurrentTimestamp();
  const normalizedJobs = jobs.map((job) => ({
    ...job,
    appliedAt: job.appliedAt.toISOString(),
    updateAt: job.updateAt.toISOString(),
    daysSince: getDaysSince(job.updateAt, now),
  }));

  // derived stats
  const stats = {
    total: normalizedJobs.length,
    ...Object.fromEntries(JOB_STATUSES.map((status) => [status.toLowerCase(), normalizedJobs.filter((job) => job.status === status).length])),
  };

  // 5 most recent
  const recentJobs = [...normalizedJobs].sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()).slice(0, 5);

  // applied & not updated in 14+ days — most overdue first
  const followUpJobsAll = normalizedJobs.filter((job) => job.status === "Applied" && job.daysSince >= FOLLOW_UP_DAYS).sort((a, b) => b.daysSince - a.daysSince);
  const followUpTotal = followUpJobsAll.length;
  const followUpJobs = followUpJobsAll.slice(0, 5);

  // top insight message
  let insight = "Start tracking your first application.";
  if (followUpTotal > 0) {
    insight = `${followUpTotal} application${followUpTotal > 1 ? "s" : ""} need follow-up.`;
  } else if (stats.offer > 0) {
    insight = `${stats.offer} active offer${stats.offer > 1 ? "s" : ""} received.`;
  } else if (stats.interview > 0) {
    insight = `${stats.interview} interview${stats.interview > 1 ? "s" : ""} in progress.`;
  } else if (stats.applied > 0) {
    insight = `${stats.applied} application${stats.applied > 1 ? "s" : ""} submitted so far.`;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="hidden sm:block text-2xl font-semibold">Dashboard</h2>

        {/* Tablet & Desktop */}
        <p className="hidden sm:block text-sm text-muted-foreground mt-1">{insight}</p>

        {/* Mobile */}
        <div className="sm:hidden mt-3">
          <div className="bg-primary text-primary-foreground rounded-xl px-4 py-3">
            <p className="text-sm font-medium">{insight}</p>
          </div>
        </div>
      </div>

      <StatCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentJobs jobs={recentJobs} />
        <FollowUpJobs jobs={followUpJobs} totalCount={followUpTotal} />
      </div>
    </div>
  );
}
