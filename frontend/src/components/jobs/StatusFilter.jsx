import { Funnel } from "lucide-react";
import { JOB_FILTER_STATUSES } from "../../constants/job";

// filter by status
export default function StatusFilter({ value, onChange }) {
  return (
    <div className="dropdown dropdown-start lg:dropdown-start ">
      <button tabIndex={0} className="btn btn-primary border-none btn-sm rounded-xl shadow-none">
        <Funnel size={14} />
        {value === "All" ? "Filter" : value}
      </button>

      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-xl border border-base-200 shadow-lg z-50 w-44 mt-2 p-1 gap-1">
        {JOB_FILTER_STATUSES.map((status) => (
          <li key={status}>
            <button
              onClick={() => {
                onChange(status);
                document.activeElement?.blur();
              }}
              className={`rounded-lg text-sm transition-colors active:bg-base-200 ${value === status ? "bg-primary/10 text-primary font-medium" : "text-base-content/70 hover:bg-base-300"}`}
            >
              {status}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
