import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { JOB_STATUS_BADGE, JOB_STATUSES } from "../../constants/job";

export default function StatusBadge({ status, onChange, className = "", useFixed = false }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClose = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClose);
    document.addEventListener("touchstart", handleClose);
    return () => {
      document.removeEventListener("mousedown", handleClose);
      document.removeEventListener("touchstart", handleClose);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleScroll = () => setOpen(false);
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [open]);

  if (!onChange) {
    return (
      <span className={`badge badge-sm ${JOB_STATUS_BADGE[status] ?? "badge-ghost"} ${className}`}>
        {status}
      </span>
    );
  }

  const handleToggle = () => {
    if (!open && useFixed && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: rect.right });
    }
    setOpen((prev) => !prev);
  };

  const dropdownList = (
    <ul
      className={`
        z-9999 min-w-28 rounded-xl border border-base-200 bg-base-100 shadow-lg p-1 flex flex-col gap-0.5
        ${useFixed ? "fixed" : "absolute mt-1.5"}
      `}
      style={useFixed ? { top: coords.top, left: coords.left, transform: "translateX(-100%)" } : { right: 0 }}
    >
      {JOB_STATUSES.map((option) => (
        <li key={option}>
          <button
            type="button"
            onClick={() => {
              onChange(option);
              setOpen(false);
            }}
            className={`w-full text-left rounded-lg text-xs px-3 py-1.5 transition-colors
              ${status === option
                ? "bg-primary/10 text-primary font-medium"
                : "text-base-content/60 hover:bg-base-300/60 hover:text-base-content"
              }`}
          >
            {option}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        className={`badge badge-sm ${JOB_STATUS_BADGE[status] ?? "badge-ghost"} cursor-pointer gap-1 pr-1.5`}
      >
        {status}
        <ChevronDown size={10} strokeWidth={2.5} />
      </button>

      {open && dropdownList}
    </div>
  );
}