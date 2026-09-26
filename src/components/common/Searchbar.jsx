"use client"

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar({ value, onChange }) {
  return (
    <label className="relative block w-full lg:w-72">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        type="search"
        aria-label="Search jobs"
        placeholder="Search jobs..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          search-input
          box-border
          h-8
          w-full
          rounded-xl
          bg-background
          pl-10
          pr-4
          text-sm
          outline-none
          placeholder:text-muted-foreground
          focus-visible:ring-0 focus-visible:border-primary
        "
      />
    </label>
  );
}