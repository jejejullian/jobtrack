export default function ConfirmModal({
  id = "confirm_modal",
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  confirmClass = "btn-error",
  onConfirm,
}) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box max-w-sm rounded-2xl shadow-none border border-base-200">
        <h3 className="font-medium text-base">{title}</h3>
        {description && (
          <p className="text-sm text-base-content/60 mt-1">{description}</p>
        )}

        <div className="modal-action mt-6">
          {/* Close tanpa action */}  
          <form method="dialog">
            <button className="btn btn-ghost btn-sm rounded-xl">Cancel</button>
          </form>

          {/* Confirm action */}
          <form method="dialog">
            <button
              className={`btn btn-sm rounded-xl shadow-none text-base-100 ${confirmClass}`}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </form>
        </div>
      </div>

      {/* Click backdrop untuk close */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}