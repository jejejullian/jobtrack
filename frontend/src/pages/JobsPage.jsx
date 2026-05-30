import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useAuth } from "../context/auth";
import { Plus, Trash2, Pencil } from "lucide-react";
import { getJobs, deleteJob, updateJob } from "../services/api";
import Searchbar from "../components/Searchbar";
import StatusFilter from "../components/StatusFilter";
import JobCard from "../components/JobCard";
import SortDropdown from "../components/SortDropdown";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import JobModal from "../components/JobModal";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [modalKey, setModalKey] = useState(0);

  const { token } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs(token);
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [token]);

  const displayedJobs = [...jobs]
    .filter((job) => {
      const q = search.toLowerCase().trim();

      const date = new Date(job.appliedAt);

      const monthIndex = date.getMonth();

      const months = [
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

      const monthMatches = months[monthIndex].some((m) => m.includes(q));

      const year = date.getFullYear().toString();

      return job.company.toLowerCase().includes(q) || job.position.toLowerCase().includes(q) || monthMatches || year.includes(q);
    })
    .filter((job) => (filter === "All" ? true : job.status === filter))
    .sort((a, b) => (sortOrder === "desc" ? new Date(b.appliedAt) - new Date(a.appliedAt) : new Date(a.appliedAt) - new Date(b.appliedAt)));

  const openDeleteModal = (id) => {
    setJobToDelete(id);
    document.getElementById("delete_modal").showModal();
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    await deleteJob(token, jobToDelete);
    setJobs((prev) => prev.filter((j) => j.id !== jobToDelete));
    setJobToDelete(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateJob(token, id, { status: newStatus });
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j)));
  };

  const openAddModal = () => {
    flushSync(() => {
      setJobToEdit(null);
      setModalKey((k) => k + 1);
    });
    document.getElementById("job_modal")?.showModal();
  };

  const openEditModal = (job) => {
    flushSync(() => {
      setJobToEdit(job);
      setModalKey((k) => k + 1);
    });
    document.getElementById("job_modal")?.showModal();
  };

  const handleSuccess = (result, isEdit) => {
    if (isEdit) {
      setJobs((prev) => prev.map((j) => (j.id === result.id ? result : j)));
    } else {
      setJobs((prev) => [...prev, result]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="loading loading-spinner loading-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-md mx-auto mt-10">
        <span>Failed to load data: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="order-1 lg:order-2 flex items-center gap-2">
          <div className="flex-1">
            <Searchbar value={search} onChange={setSearch} />
          </div>

          {/* Desktop only */}
          <button onClick={openAddModal} className="hidden lg:flex btn btn-primary btn-sm rounded-xl shadow-none whitespace-nowrap">
            <Plus size={18} />
            Add Job
          </button>
        </div>

        {/* Filter + Sort + Info */}
        <div className="order-2 lg:order-1 flex items-center gap-2 flex-wrap">
          <StatusFilter value={filter} onChange={setFilter} />

          <SortDropdown value={sortOrder} onChange={setSortOrder} />

          <p className="text-sm text-base-content/60 whitespace-nowrap">
            <span className="lg:inline hidden">Showing </span>
            {displayedJobs.length} of {jobs.length} jobs
          </p>
        </div>
      </div>

      {displayedJobs.length === 0 && (
        <div className="text-center py-16 text-base-content/40">
          <p className="text-sm">No matching jobs found.</p>
        </div>
      )}

      {displayedJobs.length > 0 && (
        <div className="md:hidden space-y-3">
          {displayedJobs.map((job) => (
            <JobCard key={job.id} job={job} onDelete={openDeleteModal} onStatusChange={handleStatusChange} onEdit={openEditModal} />
          ))}
        </div>
      )}

      {displayedJobs.length > 0 && (
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
              {displayedJobs.map((job) => (
                <tr key={job.id} className="hover group">
                  <td className="font-medium">{job.company}</td>
                  <td className="text-base-content/70">{job.position}</td>
                  <td className="text-base-content/50 text-sm">{job.location || "—"}</td>
                  <td>
                    <StatusBadge status={job.status} onChange={(newStatus) => handleStatusChange(job.id, newStatus)} />
                  </td>
                  <td className="text-sm text-base-content/60 whitespace-nowrap">{new Date(job.appliedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "numeric", year: "numeric" })}</td>
                  <td>
                    {job.referenceLink ? (
                      <a href={job.referenceLink} target="_blank" rel="noopener noreferrer" className="text-primary text-xs underline hover:text-black/50">
                        View Link
                      </a>
                    ) : (
                      <span className="text-base-content/30 text-xs">—</span>
                    )}
                  </td>
                  <td className="flex items-center justify-center gap-1">
                    <button onClick={() => openEditModal(job)} className="btn btn-ghost btn-xs text-base-content/30 hover:text-base-content hover:bg-transparent transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => openDeleteModal(job.id)} className="btn btn-ghost btn-xs text-error/40 hover:text-error hover:bg-transparent transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Floating Add Button */}
      <button onClick={openAddModal} className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-20 btn btn-primary btn-circle shadow-xl">
        <Plus size={22} />
      </button>

      {/* Modal  */}
      <JobModal key={modalKey} id="job_modal" job={jobToEdit} onSuccess={handleSuccess} />

      <ConfirmModal id="delete_modal" title="Delete this job?" description="This action cannot be undone." confirmLabel="Delete" confirmClass="btn-error" onConfirm={handleDelete} />
    </div>
  );
}
