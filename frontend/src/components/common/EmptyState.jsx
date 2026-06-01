export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-4 py-12 text-center">
      {Icon && <Icon size={56} strokeWidth={1.6} className="mb-4 text-base-content/30" />}
      <h2 className="text-base font-semibold text-base-content">{title}</h2>
      {description && <p className="mt-1 max-w-sm text-sm text-base-content/50">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
