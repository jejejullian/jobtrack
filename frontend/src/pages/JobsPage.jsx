import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useAuth } from "../context/auth";
import { BriefcaseBusiness, Plus, RotateCcw, SearchX, WifiOff } from "lucide-react";
import JobCard from "../components/jobs/JobCard";
import JobsTable from "../components/jobs/JobsTable";
import ConfirmModal from "../components/ConfirmModal";
import JobModal from "../components/jobs/JobModal";
import JobsToolbar from "../components/jobs/JobsToolbar";
import { useJobs } from "../hooks/useJobs";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

export default function JobsPage() {
  // modal state
  const [jobToDelete, setJobToDelete] = useState(null);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [modalKey, setModalKey] = useState(0);
  const jobModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  const { token } = useAuth();
  const { jobs, displayedJobs, search, setSearch, filter, setFilter, sortOrder, setSortOrder, loading, error, refetchJobs, deleteJobById, updateJobStatus, saveJobResult } = useJobs(token);

  // handlers
  const openDeleteModal = (id) => {
    setJobToDelete(id);
    deleteModalRef.current?.showModal();
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;
    await deleteJobById(jobToDelete);
    setJobToDelete(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateJobStatus(id, newStatus);
  };

  const openAddModal = () => {
    flushSync(() => {
      setJobToEdit(null);
      setModalKey((k) => k + 1);
    });
    jobModalRef.current?.showModal();
  };

  const openEditModal = (job) => {
    flushSync(() => {
      setJobToEdit(job);
      setModalKey((k) => k + 1);
    });
    jobModalRef.current?.showModal();
  };

  const handleSuccess = (result, isEdit) => {
    saveJobResult(result, isEdit);
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
      <ErrorState
        icon={WifiOff}
        title="Failed to load jobs"
        description={error}
        action={
          <button type="button" onClick={refetchJobs} className="btn btn-primary btn-sm rounded-xl shadow-none">
            <RotateCcw size={16} />
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <JobsToolbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        displayedCount={displayedJobs.length}
        totalCount={jobs.length}
        onAdd={openAddModal}
      />

      {jobs.length === 0 && (
        <EmptyState
          icon={BriefcaseBusiness}
          title="No jobs yet"
          description="Add your first job application to start tracking progress."
          action={
            <button type="button" onClick={openAddModal} className="btn btn-primary btn-sm rounded-xl shadow-none">
              <Plus size={16} />
              Add Job
            </button>
          }
        />
      )}

      {jobs.length > 0 && displayedJobs.length === 0 && (
        <EmptyState icon={SearchX} title="No matching jobs found" description="Try changing the search keyword, filter, or sort option." />
      )}

      {displayedJobs.length > 0 && (
        <div className="md:hidden space-y-3">
          {displayedJobs.map((job) => (
            <JobCard key={job.id} job={job} onDelete={openDeleteModal} onStatusChange={handleStatusChange} onEdit={openEditModal} />
          ))}
        </div>
      )}

      {displayedJobs.length > 0 && <JobsTable jobs={displayedJobs} onStatusChange={handleStatusChange} onEdit={openEditModal} onDelete={openDeleteModal} />}

      {/* Mobile Floating Add Button */}
      <button onClick={openAddModal} className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-20 btn btn-primary btn-circle shadow-xl">
        <Plus size={22} />
      </button>

      {/* Modal  */}
      <JobModal ref={jobModalRef} key={modalKey} id="job_modal" job={jobToEdit} onSuccess={handleSuccess} />

      <ConfirmModal ref={deleteModalRef} id="delete_modal" title="Delete this job?" description="This action cannot be undone." confirmLabel="Delete" confirmClass="btn-error" onConfirm={handleDelete} />
    </div>
  );
}
