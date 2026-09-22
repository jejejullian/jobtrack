import { Plus } from "lucide-react";
import Searchbar from "@/components/common/Searchbar";
import StatusFilter from "./StatusFilter";
import SortDropdown from "./SortDropdown";

import { Button } from "@/components/ui/button";

// search, filter, sort, add button
export default function JobsToolbar({ search, onSearchChange, filter, onFilterChange, sortOrder, onSortChange, displayedCount, totalCount, onAdd }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="order-1 flex items-center gap-2 lg:order-2">
        <div className="flex-1">
          <Searchbar value={search} onChange={onSearchChange} />
        </div>

        <Button
          onClick={onAdd}
          size="sm"
          className="hidden whitespace-nowrap rounded-xl shadow-none lg:flex"
        >
          <Plus size={18} />
          Add Job
        </Button>
      </div>

      <div className="order-2 flex flex-wrap items-center gap-2 lg:order-1">
        <StatusFilter value={filter} onChange={onFilterChange} />

        <SortDropdown value={sortOrder} onChange={onSortChange} />

        <p className="whitespace-nowrap text-sm text-muted-foreground">
          <span className="hidden lg:inline">Showing </span>
          {displayedCount} of {totalCount} jobs
        </p>
      </div>
    </div>
  );
}