import { useCallback, useEffect, useMemo, useState } from "react";
import { WifiOff, RotateCcw } from "lucide-react";
import { useAuth } from "../context/auth";
import { getJobs } from "../services/api";
import { JOB_STATUSES } from "../constants/job";
import { getDaysSince } from "../utils/date";
import ErrorState from "../components/common/ErrorState";
import StatCards from "../components/dashboard/StatCards";
import RecentJobs from "../components/dashboard/RecentJobs";
import FollowUpJobs from "../components/dashboard/FollowUpJobs";

const FOLLOW_UP_DAYS = 14;

export default function DashboardPage() {
  const { token } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const now = Date.now();
      const data = await getJobs(token);

      const normalizedJobs = data.map((job) => ({
        ...job,
        daysSince: getDaysSince(job.updatedAt ?? job.appliedAt, now),
      }));

      setJobs(normalizedJobs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const stats = useMemo(
    () => ({
      total: jobs.length,
      ...Object.fromEntries(JOB_STATUSES.map((status) => [status.toLowerCase(), jobs.filter((job) => job.status === status).length])),
    }),
    [jobs],
  );

  const recentJobs = useMemo(() => [...jobs].sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()).slice(0, 5), [jobs]);

  const followUpJobs = useMemo(() => jobs.filter((job) => job.status === "Applied" && job.daysSince >= FOLLOW_UP_DAYS), [jobs]);

  const insight = useMemo(() => {
    if (followUpJobs.length > 0) {
      return `${followUpJobs.length} application${followUpJobs.length > 1 ? "s" : ""} need follow-up.`;
    }

    if (stats.offer > 0) {
      return `${stats.offer} active offer${stats.offer > 1 ? "s" : ""} received.`;
    }

    if (stats.interview > 0) {
      return `${stats.interview} interview${stats.interview > 1 ? "s" : ""} in progress.`;
    }

    if (stats.applied > 0) {
      return `${stats.applied} application${stats.applied > 1 ? "s" : ""} submitted so far.`;
    }

    return "Start tracking your first application.";
  }, [stats, followUpJobs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        icon={WifiOff}
        title="Failed to load dashboard"
        description={error}
        action={
          <button onClick={fetchJobs} className="btn btn-primary btn-sm rounded-xl shadow-none">
            <RotateCcw size={16} />
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="hidden sm:block text-2xl font-semibold">Dashboard</h2>

        {/* Tablet & Desktop */}
        <p className="hidden sm:block text-sm text-base-content/60 mt-1">{insight}</p>

        {/* Mobile */}
        <div className="sm:hidden mt-3">
          <div className="bg-primary text-primary-content rounded-xl px-4 py-3">
            <p className="text-sm font-medium">{insight}</p>
          </div>
        </div>
      </div>

      <StatCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentJobs jobs={recentJobs} />
        <FollowUpJobs jobs={followUpJobs} />
      </div>
    </div>
  );
}
