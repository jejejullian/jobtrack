import { ChevronDown } from "lucide-react";

const STATUS_BADGE = {
  Applied: "badge-info",
  Interview: "badge-warning",
  Offer: "badge-success",
  Rejected: "badge-error",
};

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

export default function StatusBadge({ status, onChange, className = "" }) {
  if (!onChange) {
    return <span className={`badge badge-sm ${STATUS_BADGE[status] ?? "badge-ghost"} ${className}`}>{status}</span>;
  }

  return (
    <div className={`dropdown dropdown-center ${className}`}>
      {/* Badge langsung jadi trigger — tidak ada btn wrapper */}
      <div tabIndex={0} role="button" className={`badge badge-sm ${STATUS_BADGE[status] ?? "badge-ghost"} cursor-pointer gap-1 pr-1.5`}>
        {status}
        <ChevronDown size={10} strokeWidth={2.5} />
      </div>

      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-xl border border-base-200 shadow-lg z-50 w-auto mt-1.5 p-1 gap-0.5">
        {STATUSES.map((option) => (
          <li key={option}>
            <button
              onClick={() => {
                onChange(option);
                document.activeElement?.blur();
              }}
              className={`rounded-lg text-xs px-3 py-1.5 transition-colors
                ${status === option ? "bg-primary/10 text-primary font-medium" : "text-base-cprima/60 hover:bg-base-300/60 hover:text-base-content   "}`}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
