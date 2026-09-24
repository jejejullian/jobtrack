import { Briefcase, Send, MessageSquare, BadgeCheck, XCircle } from "lucide-react";

// stat card config
const STAT_CONFIG = [
  {
    key: "total",
    label: "Total",
    colorClass: "text-foreground",
    icon: Briefcase,
  },
  {
    key: "applied",
    label: "Applied",
    colorClass: "text-status-applied-text",
    icon: Send,
  },
  {
    key: "interview",
    label: "Interview",
    colorClass: "text-status-interview-text",
    icon: MessageSquare,
  },
  {
    key: "offer",
    label: "Offer",
    colorClass: "text-status-offer-text",
    icon: BadgeCheck,
  },
  {
    key: "rejected",
    label: "Rejected",
    colorClass: "text-status-rejected-text",
    icon: XCircle,
  },
];

export default function StatCards({ stats }) {
  return (
    <>
      {/* Mobile */}
      <div className="sm:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
          {STAT_CONFIG.map(({ key, label, colorClass }) => (
            <div key={key} className="rounded-xl border border-border bg-card shrink-0 w-16 snap-start shadow-sm">
              <div className="flex flex-col items-center text-center p-2">
                <p className={`text-2xl font-bold ${colorClass}`}>{stats[key] ?? 0}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tablet & Desktop */}
      <div className="hidden sm:grid grid-cols-3 lg:grid-cols-5 gap-3">
        {STAT_CONFIG.map(({ key, label, colorClass, icon: Icon }) => (
          <div key={key} className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className={`text-3xl font-bold ${colorClass}`}>{stats[key] ?? 0}</p>
                </div>
                <Icon className={`${colorClass} size-6`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}