import { useCallback, useEffect, useMemo, useState } from "react";
import { deleteJob, getJobs, updateJob } from "../services/api";

const MONTH_SEARCH_TERMS = [
  ["january", "jan", "januari"],
  ["february", "feb", "februari"],
  ["march", "mar", "maret"],
  ["april", "apr"],
  ["may", "mei"],
  ["june", "jun", "juni"],
  ["july", "jul", "juli"],
  ["august", "aug", "agustus", "agu"],
  ["september", "sep"],
  ["october", "oct", "oktober", "okt"],
  ["november", "nov"],
  ["december", "dec", "desember", "des"],
];

export function useJobs(token) {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getJobs(token);
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let isMounted = true;

    getJobs(token)
      .then((data) => {
        if (isMounted) {
          setJobs(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const displayedJobs = useMemo(
    () =>
      [...jobs]
        .filter((job) => {
          const q = search.toLowerCase().trim();
          const date = new Date(job.appliedAt);
          const monthMatches = MONTH_SEARCH_TERMS[date.getMonth()].some((m) => m.includes(q));
          const year = date.getFullYear().toString();

          return job.company.toLowerCase().includes(q) || job.position.toLowerCase().includes(q) || monthMatches || year.includes(q);
        })
        .filter((job) => (filter === "All" ? true : job.status === filter))
        .sort((a, b) => (sortOrder === "desc" ? new Date(b.appliedAt) - new Date(a.appliedAt) : new Date(a.appliedAt) - new Date(b.appliedAt))),
    [filter, jobs, search, sortOrder],
  );

  const deleteJobById = async (id) => {
    await deleteJob(token, id);
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  const updateJobStatus = async (id, newStatus) => {
    await updateJob(token, id, { status: newStatus });
    setJobs((prev) => prev.map((job) => (job.id === id ? { ...job, status: newStatus } : job)));
  };

  const saveJobResult = (result, isEdit) => {
    if (isEdit) {
      setJobs((prev) => prev.map((job) => (job.id === result.id ? result : job)));
      return;
    }

    setJobs((prev) => [...prev, result]);
  };

  return {
    jobs,
    displayedJobs,
    search,
    setSearch,
    filter,
    setFilter,
    sortOrder,
    setSortOrder,
    loading,
    error,
    refetchJobs,
    deleteJobById,
    updateJobStatus,
    saveJobResult,
  };
}
