import { forwardRef } from "react";

function ConfirmModal({
  id = "confirm_modal",
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  confirmClass = "btn-error",
  onConfirm,
}, ref) {
  // reusable confirm dialog
  return (
    <dialog ref={ref} id={id} className="modal">
      <div className="modal-box mx-4 w-[calc(100%-2rem)] max-w-sm rounded-2xl shadow-none border border-base-200">
        <h3 className="font-medium text-base">{title}</h3>
        {description && (
          <p className="text-sm text-base-content/60 mt-1">{description}</p>
        )}

        <div className="modal-action mt-6 flex-col-reverse gap-2 sm:flex-row">
          <form method="dialog">
            <button className="btn btn-ghost btn-sm w-full rounded-xl sm:w-auto">Cancel</button>
          </form>

          <form method="dialog">
            <button
              className={`btn btn-sm w-full rounded-xl shadow-none text-base-100 sm:w-auto ${confirmClass}`}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </form>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default forwardRef(ConfirmModal);
