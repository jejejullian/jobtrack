import { Briefcase, Send, MessageSquare, BadgeCheck, XCircle } from "lucide-react";

const STAT_CONFIG = [
  {
    key: "total",
    label: "Total",
    colorClass: "text-base-content",
    icon: Briefcase,
  },
  {
    key: "applied",
    label: "Applied",
    colorClass: "text-info",
    icon: Send,
  },
  {
    key: "interview",
    label: "Interview",
    colorClass: "text-warning",
    icon: MessageSquare,
  },
  {
    key: "offer",
    label: "Offer",
    colorClass: "text-success",
    icon: BadgeCheck,
  },
  {
    key: "rejected",
    label: "Rejected",
    colorClass: "text-error",
    icon: XCircle,
  },
];

export default function StatCards({ stats }) {
  return (
    <>
      {/* Mobile */}
      <div className="sm:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
          {STAT_CONFIG.map(({ key, label, colorClass,}) => (
            <div key={key} className="card bg-base-100 border border-base-200 shadow-sm shrink-0 w-16 snap-start">
              <div className="card-body p-2 items-center text-center">
                <p className={`text-2xl font-bold ${colorClass}`}>{stats[key] ?? 0}</p>

                <p className="text-xs text-base-content/60">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tablet & Desktop */}
      <div className="hidden sm:grid grid-cols-3 lg:grid-cols-5 gap-3">
        {STAT_CONFIG.map(({ key, label, colorClass, icon: Icon }) => (
          <div key={key} className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md ">
            <div className="card-body p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-base-content/50">{label}</p>

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
