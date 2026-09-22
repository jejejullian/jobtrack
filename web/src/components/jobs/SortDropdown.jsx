"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const SORT_OPTIONS = [
  { label: "Newest", value: "desc" },
  { label: "Oldest", value: "asc" },
];

// sort by date asc/desc
export default function SortDropdown({ value, onChange }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button type="button" variant="outline" size="sm" className="rounded-xl border-primary text-primary hover:bg-primary/5 gap-1.5">
            <ArrowUpDown size={14} />
            {value === "desc" ? "Newest" : "Oldest"}
          </Button>
        }
      />

      <DropdownMenuContent align="start" className="w-44">
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem key={option.value} onClick={() => onChange(option.value)} className={value === option.value ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
