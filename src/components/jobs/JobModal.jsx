"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { createJob, updateJob } from "@/services/api";
import { JOB_STATUSES } from "@/constants/job";
import { toDateInputValue } from "@/utils/date";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [dialogNode, setDialogNode] = useState(null);

  const setRefs = (node) => {
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
    setDialogNode(node);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClose = () => {
    setError(null);
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
      const result = isEdit ? await updateJob(job.id, form) : await createJob(form);
      onSuccess(result, isEdit);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog ref={setRefs} id={id} className="m-auto rounded-2xl bg-transparent p-0 backdrop:bg-black/50">
      <div className="mx-4 w-[calc(100%-2rem)] max-w-md rounded-2xl border border-border bg-card p-6 shadow-none">
        <div className="mb-5">
          <h3 className="text-base font-semibold text-card-foreground">{isEdit ? "Edit Job" : "Add Job"}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{isEdit ? "Update your job application details." : "Add a new job application to your tracker."}</p>
        </div>

        {error && <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="scrollbar-none max-h-[60vh] space-y-3 overflow-auto px-1">
            <div className="grid grid-cols-2 gap-3">
              {/* Company */}
              <div>
                <label htmlFor="company" className="text-xs font-normal text-muted-foreground">
                  Company *
                </label>
                <Input id="company" name="company" value={form.company} onChange={handleChange} placeholder="e.g. Tokopedia" className="mt-1 h-8 rounded-xl text-sm  focus-visible:ring-0 focus-visible:border-primary" />
              </div>

              {/* Position */}
              <div>
                <label htmlFor="position" className="text-xs font-normal text-muted-foreground">
                  Position *
                </label>
                <Input id="position" name="position" value={form.position} onChange={handleChange} placeholder="e.g. Frontend Dev" className="mt-1 h-8 rounded-xl text-sm focus-visible:ring-0 focus-visible:border-primary" />
              </div>
            </div>

            {/* Location  */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="location" className="text-xs font-normal text-muted-foreground">
                  Location
                </label>
                <Input id="location" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Jakarta" className="mt-1 h-8 rounded-xl text-sm  focus-visible:ring-0 focus-visible:border-primary" />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="text-xs font-normal text-muted-foreground">
                  Status
                </label>
                <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}>
                  <SelectTrigger id="status" className="mt-1 h-8 w-full cursor-pointer appearance-none rounded-xl text-sm focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent container={dialogNode}>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      {JOB_STATUSES.map((status) => (
                        <SelectItem key={status} value={status} className="cursor-pointer ">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Applied Date */}
            <div>
              <label htmlFor="appliedAt" className="text-xs font-normal text-muted-foreground">
                Applied Date
              </label>
              <Input id="appliedAt" type="date" name="appliedAt" value={form.appliedAt} onChange={handleChange} className="mt-1 h-8 rounded-xl text-sm cursor-pointer  focus-visible:ring-0 focus-visible:border-primary" />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="text-xs font-normal text-muted-foreground">
                Notes
              </label>
              <Textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="e.g. Referral from John, skills needed: React, Node.js"
                rows={3}
                className="mt-1 resize-none rounded-xl text-sm  focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>

            {/* Link */}
            <div>
              <label htmlFor="referenceLink" className="text-xs font-normal text-muted-foreground">
                Link
              </label>
              <Input
                id="referenceLink"
                type="url"
                name="referenceLink"
                value={form.referenceLink}
                onChange={handleChange}
                placeholder="https://..."
                className="mt-1 h-8 rounded-xl text-sm  focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>

            {/* Button */}
            <div className="flex items-center justify-end gap-2 pt-3">
              <Button type="button" variant="ghost" size="sm" onClick={handleClose} className="rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={loading} className="rounded-xl shadow-none cursor-pointer">
                {loading ? <Loader2 size={14} className="animate-spin" /> : isEdit ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default forwardRef(JobModal);
