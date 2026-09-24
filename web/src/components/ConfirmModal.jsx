"use client"

import { forwardRef } from "react";
import { Button } from "@/components/ui/button";

function ConfirmModal({
  id = "confirm_modal",
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  confirmVariant = "destructive",
  onConfirm,
}, ref) {
  const handleConfirm = async () => {
    await onConfirm?.();
    ref.current?.close();
  };

  const handleCancel = () => {
    ref.current?.close();
  };

  return (
    <dialog
      ref={ref}
      id={id}
      className="m-auto rounded-2xl bg-transparent p-0 backdrop:bg-black/50"
    >
      <div className="mx-4 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-border bg-card p-6 shadow-none">
        <h3 className="text-base font-medium text-foreground">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" size="sm" onClick={handleCancel} className="w-full rounded-xl sm:w-auto cursor-pointer">
            Cancel
          </Button>

          <Button
            variant={confirmVariant}
            size="sm"
            className="w-full rounded-xl shadow-none sm:w-auto cursor-pointer"
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}

export default forwardRef(ConfirmModal);