"use client";

import { Funnel } from "lucide-react";
import { JOB_FILTER_STATUSES } from "../../constants/job";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// filter by status
export default function StatusFilter({ value, onChange }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button type="button" size="sm" className="rounded-xl shadow-none gap-1.5">
            <Funnel size={14} />
            {value === "All" ? "Filter" : value}
          </Button>
        }
      />

      <DropdownMenuContent align="start" className="w-44">
        {JOB_FILTER_STATUSES.map((status) => (
          <DropdownMenuItem key={status} onClick={() => onChange(status)} className={value === status ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"}>
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
