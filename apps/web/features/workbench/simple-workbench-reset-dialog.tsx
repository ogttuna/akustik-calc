"use client";

import { useEffect, useRef } from "react";

type SimpleWorkbenchResetDialogProps = {
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  rowCount: number;
};

export function SimpleWorkbenchResetDialog({ onCancel, onConfirm, open, rowCount }: SimpleWorkbenchResetDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="m-auto rounded-lg border border-[color:var(--line)] bg-[color:var(--paper)] p-6 shadow-xl backdrop:bg-black/40"
      onClose={onCancel}
    >
      <h3 className="text-sm font-semibold text-[color:var(--ink)]">Reset workbench?</h3>
      <p className="mt-2 text-[0.82rem] leading-6 text-[color:var(--ink-soft)]">
        {rowCount > 0
          ? `This will clear all ${rowCount} layers, custom materials, and field inputs. This cannot be undone.`
          : "This will clear all custom materials and field inputs. This cannot be undone."}
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <button
          className="focus-ring rounded border border-[color:var(--line)] px-3 py-1.5 text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="focus-ring rounded border border-[color:var(--warning)] bg-[color:var(--warning-soft)] px-3 py-1.5 text-[0.8rem] font-semibold text-[color:var(--warning-ink)] hover:brightness-95"
          onClick={onConfirm}
          type="button"
        >
          Reset everything
        </button>
      </div>
    </dialog>
  );
}
