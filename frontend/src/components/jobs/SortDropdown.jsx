import { ArrowUpDown } from "lucide-react";

// sort by date asc/desc
export default function SortDropdown({ value, onChange }) {
  return (
    <div className="dropdown dropdown-start lg:dropdown-start">
      <button tabIndex={0} className="btn btn-ghost btn-sm rounded-xl border border-primary text-primary hover:bg-primary/5">
        <ArrowUpDown size={14} />
        {value === "desc" ? "Newest" : "Oldest"}
      </button>

      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-xl border border-base-200 shadow-lg z-50 w-44 mt-2 p-1 gap-1">
        {[{ label: "Newest", value: "desc" }, { label: "Oldest", value: "asc" }].map((option) => (
          <li key={option.value}>
            <button
              onClick={() => {
                onChange(option.value);
                document.activeElement?.blur();
              }}
              className={`rounded-lg text-sm transition-colors active:bg-base-200 ${value === option.value ? "bg-primary/10 text-primary font-medium" : "text-base-content/70 hover:bg-base-300"}`}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
