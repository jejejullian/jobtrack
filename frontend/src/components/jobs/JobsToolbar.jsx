import { Plus } from "lucide-react";
import Searchbar from "../Searchbar";
import StatusFilter from "./StatusFilter";
import SortDropdown from "./SortDropdown";

export default function JobsToolbar({ search, onSearchChange, filter, onFilterChange, sortOrder, onSortChange, displayedCount, totalCount, onAdd }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="order-1 lg:order-2 flex items-center gap-2">
        <div className="flex-1">
          <Searchbar value={search} onChange={onSearchChange} />
        </div>

        <button onClick={onAdd} className="hidden lg:flex btn btn-primary btn-sm rounded-xl shadow-none whitespace-nowrap">
          <Plus size={18} />
          Add Job
        </button>
      </div>

      <div className="order-2 lg:order-1 flex items-center gap-2 flex-wrap">
        <StatusFilter value={filter} onChange={onFilterChange} />

        <SortDropdown value={sortOrder} onChange={onSortChange} />

        <p className="text-sm text-base-content/60 whitespace-nowrap">
          <span className="lg:inline hidden">Showing </span>
          {displayedCount} of {totalCount} jobs
        </p>
      </div>
    </div>
  );
}
