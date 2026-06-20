"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";

import type { SimpleWorkbenchProposalDocument } from "./simple-workbench-proposal";
import {
  buildSimpleWorkbenchProposalSuggestedFilename,
  normalizeSimpleWorkbenchProposalExportFilename,
  type SimpleWorkbenchProposalExportStyle
} from "./simple-workbench-proposal-pdf";

type SimpleWorkbenchProposalPdfFilenameRequest = {
  id: number;
  resolve: (filename: string | null) => void;
  suggestedFilename: string;
};

type SimpleWorkbenchProposalPdfFilenameDialogProps = {
  onCancel: () => void;
  onConfirm: (filename: string) => void;
  request: SimpleWorkbenchProposalPdfFilenameRequest | null;
};

function SimpleWorkbenchProposalPdfFilenameDialog({
  onCancel,
  onConfirm,
  request
}: SimpleWorkbenchProposalPdfFilenameDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [draftFilename, setDraftFilename] = useState("");
  const suggestedFilename = request?.suggestedFilename ?? "dynecho-report.pdf";
  const normalizedFilename = useMemo(
    () =>
      normalizeSimpleWorkbenchProposalExportFilename(draftFilename, {
        fallbackFilename: suggestedFilename,
        format: "pdf"
      }),
    [draftFilename, suggestedFilename]
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (request) {
      setDraftFilename(request.suggestedFilename);
      if (!dialog.open) {
        dialog.showModal();
      }
      window.requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [request]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!request) {
      return;
    }
    onConfirm(normalizedFilename);
  }

  return (
    <dialog
      ref={dialogRef}
      className="m-auto max-h-[calc(100svh-2rem)] w-[min(calc(100vw-2rem),32rem)] overflow-y-auto rounded-lg border border-[color:var(--line)] bg-[color:var(--paper)] p-0 shadow-xl backdrop:bg-black/40"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClose={onCancel}
    >
      <form className="p-5 sm:p-6" onSubmit={handleSubmit}>
        <div className="eyebrow">PDF Export</div>
        <h3 className="mt-1 text-base font-semibold text-[color:var(--ink)]">Name the PDF</h3>
        <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--ink-faint)]" htmlFor="proposal-pdf-filename">
          File name
        </label>
        <input
          ref={inputRef}
          className="focus-ring mt-2 w-full rounded border border-[color:var(--line)] bg-white px-3 py-2 text-sm font-medium text-[color:var(--ink)] shadow-inner"
          id="proposal-pdf-filename"
          onChange={(event) => setDraftFilename(event.target.value)}
          type="text"
          value={draftFilename}
        />
        <div className="mt-2 rounded border border-[color:var(--line)] bg-[color:var(--panel)] px-3 py-2 text-xs font-medium text-[color:var(--ink-soft)]">
          {normalizedFilename}
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            className="focus-ring rounded border border-[color:var(--line)] px-3 py-1.5 text-[0.8rem] font-medium text-[color:var(--ink-soft)] hover:bg-[color:var(--panel)]"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="focus-ring rounded border border-[color:var(--accent)] bg-[color:var(--accent)] px-3 py-1.5 text-[0.8rem] font-semibold text-white hover:brightness-95"
            type="submit"
          >
            Download PDF
          </button>
        </div>
      </form>
    </dialog>
  );
}

export function useSimpleWorkbenchProposalPdfFilenameDialog(): {
  pdfFilenameDialog: ReactNode;
  requestPdfFilename: (
    proposalDocument: SimpleWorkbenchProposalDocument,
    options?: {
      style?: SimpleWorkbenchProposalExportStyle;
    }
  ) => Promise<string | null>;
} {
  const activeRequestRef = useRef<SimpleWorkbenchProposalPdfFilenameRequest | null>(null);
  const [activeRequest, setActiveRequest] = useState<SimpleWorkbenchProposalPdfFilenameRequest | null>(null);

  const closeRequest = useCallback((filename: string | null) => {
    const request = activeRequestRef.current;
    activeRequestRef.current = null;
    setActiveRequest(null);
    request?.resolve(filename);
  }, []);

  const requestPdfFilename = useCallback(
    (
      proposalDocument: SimpleWorkbenchProposalDocument,
      options?: {
        style?: SimpleWorkbenchProposalExportStyle;
      }
    ) =>
      new Promise<string | null>((resolve) => {
        activeRequestRef.current?.resolve(null);
        const style = options?.style === "simple" ? "simple" : "branded";
        const request: SimpleWorkbenchProposalPdfFilenameRequest = {
          id: Date.now(),
          resolve,
          suggestedFilename: buildSimpleWorkbenchProposalSuggestedFilename(proposalDocument, {
            format: "pdf",
            style
          })
        };
        activeRequestRef.current = request;
        setActiveRequest(request);
      }),
    []
  );

  useEffect(
    () => () => {
      activeRequestRef.current?.resolve(null);
      activeRequestRef.current = null;
    },
    []
  );

  return {
    pdfFilenameDialog: (
      <SimpleWorkbenchProposalPdfFilenameDialog
        key={activeRequest?.id ?? "idle"}
        onCancel={() => closeRequest(null)}
        onConfirm={(filename) => closeRequest(filename)}
        request={activeRequest}
      />
    ),
    requestPdfFilename
  };
}
