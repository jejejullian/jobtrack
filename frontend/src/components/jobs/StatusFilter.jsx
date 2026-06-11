import { useEffect, useRef, useState } from "react";
import { Funnel } from "lucide-react";
import { JOB_FILTER_STATUSES } from "../../constants/job";

// filter by status
export default function StatusFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button type="button" onClick={() => setOpen((prev) => !prev)} className="btn btn-primary border-none btn-sm rounded-xl shadow-none">
        <Funnel size={14} />
        {value === "All" ? "Filter" : value}
      </button>

      {open && (
        <ul className="absolute left-0 z-50 mt-2 w-44 rounded-xl border border-base-200 bg-base-100 shadow-lg p-1 flex flex-col gap-1">
          {JOB_FILTER_STATUSES.map((status) => (
            <li key={status}>
              <button
                type="button"
                onClick={() => {
                  onChange(status);
                  setOpen(false);
                }}
                className={`w-full text-left rounded-lg text-sm px-3 py-1.5 transition-colors
                  ${value === status ? "bg-primary/10 text-primary font-medium" : "text-base-content/70 hover:bg-base-300"}`}
              >
                {status}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
