import { forwardRef, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../../context/auth";
import { createJob, updateJob } from "../../services/api";
import { JOB_STATUSES } from "../../constants/job";
import { toDateInputValue } from "../../utils/date";

const INITIAL_FORM = {
  company: "",
  position: "",
  location: "",
  status: "Applied",
  appliedAt: toDateInputValue(),
  notes: "",
  referenceLink: "",
};

const getInitialForm = (job) =>
  job
    ? {
        company: job.company ?? "",
        position: job.position ?? "",
        location: job.location ?? "",
        status: job.status ?? "Applied",
        appliedAt: toDateInputValue(job.appliedAt),
        notes: job.notes ?? "",
        referenceLink: job.referenceLink ?? "",
      }
    : INITIAL_FORM;

function JobModal({ id = "job_modal", job = null, onSuccess }, ref) {
  const isEdit = !!job;

  const [form, setForm] = useState(() => getInitialForm(job));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const statusRef = useRef(null);

  const { token } = useAuth();

  useEffect(() => {
    if (!statusOpen) return;
    const handleClose = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClose);
    document.addEventListener("touchstart", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
      document.removeEventListener("touchstart", handleClose);
    };
  }, [statusOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClose = () => {
    setError(null);
    setStatusOpen(false);
    ref.current?.close();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.company.trim() || !form.position.trim()) {
      setError("Company and position are required.");
      return;
    }

    try {
      setLoading(true);
      const result = isEdit ? await updateJob(token, job.id, form) : await createJob(token, form);
      onSuccess(result, isEdit);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog ref={ref} id={id} className="modal">
      <div className="modal-box max-w-md rounded-2xl border border-base-200 shadow-none">
        <div className="mb-5">
          <h3 className="font-semibold text-base">{isEdit ? "Edit Job" : "Add Job"}</h3>
          <p className="text-sm text-base-content/50 mt-0.5">
            {isEdit ? "Update your job application details." : "Add a new job application to your tracker."}
          </p>
        </div>

        {error && (
          <div className="alert alert-error rounded-xl text-sm shadow-none mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <fieldset className="fieldset p-0">
              <legend className="fieldset-legend text-xs text-base-content/50 font-normal">Company *</legend>
              <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="e.g. Tokopedia"
                className="input input-bordered input-sm w-full rounded-xl focus:outline-none focus:border-primary" />
            </fieldset>

            <fieldset className="fieldset p-0">
              <legend className="fieldset-legend text-xs text-base-content/50 font-normal">Position *</legend>
              <input type="text" name="position" value={form.position} onChange={handleChange} placeholder="e.g. Frontend Dev"
                className="input input-bordered input-sm w-full rounded-xl focus:outline-none focus:border-primary" />
            </fieldset>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <fieldset className="fieldset p-0">
              <legend className="fieldset-legend text-xs text-base-content/50 font-normal">Location</legend>
              <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Jakarta"
                className="input input-bordered input-sm w-full rounded-xl focus:outline-none focus:border-primary" />
            </fieldset>

            <fieldset className="fieldset p-0">
              <legend className="fieldset-legend text-xs text-base-content/50 font-normal">Status</legend>
              <div ref={statusRef} className="relative">
                <button
                  type="button"
                  onClick={() => setStatusOpen((prev) => !prev)}
                  className="flex items-center justify-between w-full h-8 px-3 rounded-xl border border-base-300 bg-base-100 text-sm focus:outline-none focus:border-primary"
                >
                  <span>{form.status}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${statusOpen ? "rotate-180" : ""}`} />
                </button>

                {statusOpen && (
                  <ul className="absolute z-9999 top-full mt-1 left-0 w-full rounded-xl border border-base-200 bg-base-100 shadow-lg p-1 flex flex-col gap-0.5">
                    {JOB_STATUSES.map((status) => (
                      <li key={status}>
                        <button
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({ ...prev, status }));
                            setStatusOpen(false);
                          }}
                          className={`w-full text-left rounded-lg text-sm px-3 py-1.5 transition-colors
                            ${form.status === status
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-base-content/70 hover:bg-base-300"
                            }`}
                        >
                          {status}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </fieldset>
          </div>

          <fieldset className="fieldset p-0">
            <legend className="fieldset-legend text-xs text-base-content/50 font-normal">Applied Date</legend>
            <input type="date" name="appliedAt" value={form.appliedAt} onChange={handleChange}
              className="h-8 w-full rounded-xl border border-base-300 bg-base-100 px-3 text-sm text-base-content outline-none focus:border-primary" />
          </fieldset>

          <fieldset className="fieldset p-0">
            <legend className="fieldset-legend text-xs text-base-content/50 font-normal">Notes</legend>
            <textarea name="notes" value={form.notes} onChange={handleChange}
              placeholder="e.g. Referral from John, skills needed: React, Node.js"
              rows={3}
              className="textarea textarea-bordered w-full rounded-xl text-sm focus:outline-none focus:border-primary resize-none" />
          </fieldset>

          <fieldset className="fieldset p-0">
            <legend className="fieldset-legend text-xs text-base-content/50 font-normal">Link</legend>
            <input type="url" name="referenceLink" value={form.referenceLink} onChange={handleChange} placeholder="https://..."
              className="input input-bordered input-sm w-full rounded-xl focus:outline-none focus:border-primary" />
          </fieldset>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button type="button" onClick={handleClose} className="btn btn-ghost btn-sm rounded-xl">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary btn-sm rounded-xl shadow-none">
              {loading ? <span className="loading loading-spinner loading-xs" /> : isEdit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}

export default forwardRef(JobModal);