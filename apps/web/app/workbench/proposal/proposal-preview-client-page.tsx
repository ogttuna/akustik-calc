"use client";

import { SurfacePanel } from "@dynecho/ui";
import { ArrowLeft, Copy, Download, Printer, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  buildSimpleWorkbenchProposalFilename,
  buildSimpleWorkbenchProposalHtml,
  buildSimpleWorkbenchProposalText,
  type SimpleWorkbenchProposalDocument
} from "@/features/workbench/simple-workbench-proposal";
import { downloadSimpleWorkbenchProposalPdf } from "@/features/workbench/simple-workbench-proposal-pdf";
import { readSimpleWorkbenchProposalPreview } from "@/features/workbench/simple-workbench-proposal-preview-storage";

type LoadedProposalPreview = {
  document: SimpleWorkbenchProposalDocument;
  savedAtIso: string;
} | null;

function formatSavedAtLabel(savedAtIso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short"
  }).format(new Date(savedAtIso));
}

export function ProposalPreviewClientPage() {
  const searchParams = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loadedPreview, setLoadedPreview] = useState<LoadedProposalPreview>(null);
  const [frameReady, setFrameReady] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    setLoadedPreview(readSimpleWorkbenchProposalPreview());
  }, []);

  const proposalDocument = loadedPreview?.document ?? null;
  const proposalHtml = useMemo(
    () => (proposalDocument ? buildSimpleWorkbenchProposalHtml(proposalDocument) : ""),
    [proposalDocument]
  );
  const proposalText = useMemo(
    () => (proposalDocument ? buildSimpleWorkbenchProposalText(proposalDocument) : ""),
    [proposalDocument]
  );
  const shouldAutoPrint = searchParams.get("autoprint") === "1";

  function handlePrint() {
    const frameWindow = iframeRef.current?.contentWindow;

    if (!frameWindow) {
      toast.error("Preview not ready", {
        description: "Wait for the print preview frame to finish loading."
      });
      return;
    }

    frameWindow.focus();
    frameWindow.print();
  }

  async function handleCopySummary() {
    if (!proposalText) {
      toast.error("No proposal loaded", {
        description: "Return to the workbench and package a proposal first."
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(proposalText);
      toast.success("Proposal summary copied", {
        description: "The current print-view summary is on your clipboard."
      });
    } catch {
      toast.error("Copy failed", {
        description: "Browser clipboard permission blocked the summary copy."
      });
    }
  }

  async function handleDownloadPdf() {
    if (!proposalDocument) {
      toast.error("No proposal loaded", {
        description: "Return to the workbench and package a proposal first."
      });
      return;
    }

    setIsDownloadingPdf(true);

    try {
      await downloadSimpleWorkbenchProposalPdf(proposalDocument);
      toast.success("Branded PDF downloaded", {
        description: "DynEcho prepared the formal proposal PDF on the server."
      });
    } catch (error) {
      toast.error("PDF generation failed", {
        description:
          error instanceof Error
            ? error.message
            : "DynEcho could not generate the branded PDF on the server."
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  }

  function handleReload() {
    setFrameReady(false);
    setLoadedPreview(readSimpleWorkbenchProposalPreview());
  }

  useEffect(() => {
    if (!proposalDocument || !shouldAutoPrint || !frameReady) {
      return;
    }

    const timer = window.setTimeout(() => {
      handlePrint();
    }, 220);

    return () => window.clearTimeout(timer);
  }, [frameReady, proposalDocument, shouldAutoPrint]);

  return (
    <main className="ui-shell flex min-h-screen flex-col gap-6 overflow-x-clip px-4 pb-12 pt-4 sm:px-6 lg:px-8">
      <SurfacePanel className="px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="eyebrow">Proposal Print View</div>
            <h1 className="mt-1 font-display text-[2rem] leading-none tracking-[-0.05em] text-[color:var(--ink)]">
              Official issue preview
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
              Review the branded proposal sheet in a dedicated print route, then use the browser print dialog to save it as PDF.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
              href="/workbench"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to workbench
            </Link>
            <button
              className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
              onClick={() => void handleCopySummary()}
              type="button"
            >
              <Copy className="h-4 w-4" />
              Copy summary
            </button>
            <button
              className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03]"
              onClick={handleReload}
              type="button"
            >
              <RefreshCcw className="h-4 w-4" />
              Reload snapshot
            </button>
            <button
              className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!proposalDocument || isDownloadingPdf}
              onClick={() => void handleDownloadPdf()}
              type="button"
            >
              <Download className="h-4 w-4" />
              {isDownloadingPdf ? "Generating PDF..." : "Download branded PDF"}
            </button>
            <button
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-4 py-2 text-sm font-semibold text-[color:var(--paper)]"
              onClick={handlePrint}
              type="button"
            >
              <Printer className="h-4 w-4" />
              Print / save PDF
            </button>
          </div>
        </div>
      </SurfacePanel>

      {proposalDocument ? (
        <>
          <SurfacePanel className="px-5 py-5 sm:px-6">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/78 px-4 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Project</div>
                <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{proposalDocument.projectName}</div>
                <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{proposalDocument.clientName}</p>
              </div>
              <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/78 px-4 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Issue</div>
                <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">
                  {proposalDocument.proposalReference} · {proposalDocument.proposalRevision}
                </div>
                <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{proposalDocument.issuedOnLabel}</p>
              </div>
              <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/78 px-4 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Transmittal</div>
                <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{proposalDocument.proposalRecipient}</div>
                <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                  {proposalDocument.proposalAttention}
                </p>
              </div>
              <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/78 px-4 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Snapshot</div>
                <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{formatSavedAtLabel(loadedPreview!.savedAtIso)}</div>
                <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                  {buildSimpleWorkbenchProposalFilename(proposalDocument.projectName)}.html
                </p>
              </div>
            </div>
            <div className="mt-3 rounded-[1rem] border hairline bg-[color:var(--paper)]/78 px-4 py-4">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Subject</div>
              <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{proposalDocument.proposalSubject}</div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">
                {frameReady ? "Preview frame ready" : "Loading preview frame"}
              </p>
            </div>
          </SurfacePanel>

          <section className="rounded-[1.5rem] border hairline bg-[color:var(--panel)] p-3 sm:p-4">
            <iframe
              className="min-h-[1200px] w-full rounded-[1.1rem] border hairline bg-white"
              onLoad={() => setFrameReady(true)}
              ref={iframeRef}
              srcDoc={proposalHtml}
              title="Proposal print preview frame"
            />
          </section>
        </>
      ) : (
        <SurfacePanel className="px-5 py-6 sm:px-6">
          <div className="eyebrow">No Preview Loaded</div>
          <h2 className="mt-1 font-display text-[1.5rem] leading-none tracking-[-0.05em] text-[color:var(--ink)]">
            Prepare a proposal from the guided workbench first
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
            This print route reads the latest packaged proposal snapshot from the workbench. Return to the guided flow, open the proposal tab, then use
            either <span className="font-semibold text-[color:var(--ink)]">Open print view</span> or <span className="font-semibold text-[color:var(--ink)]">Print / save PDF</span>.
          </p>
        </SurfacePanel>
      )}
    </main>
  );
}
