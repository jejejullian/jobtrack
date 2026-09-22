import { ServerCrash } from "lucide-react";

export default function ErrorState({ icon: Icon = ServerCrash, title = "Something went wrong", description, action }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-4 py-12 text-center">
      <Icon size={60} strokeWidth={1.6} className="mb-4 text-destructive/60" />
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}