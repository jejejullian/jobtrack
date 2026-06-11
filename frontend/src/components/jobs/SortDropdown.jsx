import { useEffect, useRef, useState } from "react";
import { ArrowUpDown } from "lucide-react";

// sort by date asc/desc
export default function SortDropdown({ value, onChange }) {
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
      <button type="button" onClick={() => setOpen((prev) => !prev)} className="btn btn-ghost btn-sm rounded-xl border border-primary text-primary hover:bg-primary/5">
        <ArrowUpDown size={14} />
        {value === "desc" ? "Newest" : "Oldest"}
      </button>

      {open && (
        <ul className="absolute left-0 z-50 mt-2 w-44 rounded-xl border border-base-200 bg-base-100 shadow-lg p-1 flex flex-col gap-1">
          {[
            { label: "Newest", value: "desc" },
            { label: "Oldest", value: "asc" },
          ].map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full text-left rounded-lg text-sm px-3 py-1.5 transition-colors
                  ${value === option.value ? "bg-primary/10 text-primary font-medium" : "text-base-content/70 hover:bg-base-300"}`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
