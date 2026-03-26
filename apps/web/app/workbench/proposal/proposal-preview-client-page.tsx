"use client";

import { SurfacePanel } from "@dynecho/ui";
import { ArrowLeft, Copy, Download, Printer, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import {
  buildSimpleWorkbenchProposalHtml,
  buildSimpleWorkbenchProposalText,
  type SimpleWorkbenchProposalDocument
} from "@/features/workbench/simple-workbench-proposal";
import { buildSimpleWorkbenchProposalConstructionSection } from "@/features/workbench/simple-workbench-proposal-construction-section";
import { SimpleWorkbenchProposalConstructionFigure } from "@/features/workbench/simple-workbench-proposal-construction-figure";
import { buildSimpleWorkbenchProposalDossier } from "@/features/workbench/simple-workbench-proposal-dossier";
import { getSimpleWorkbenchProposalBranding } from "@/features/workbench/simple-workbench-proposal-branding";
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

function PreviewFactCard(props: { detail: string; label: string; value: string }) {
  const { detail, label, value } = props;

  return (
    <div className="min-w-0 rounded-[1rem] border hairline bg-[color:var(--paper)]/82 px-4 py-4">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</div>
      <div className="mt-2 break-words text-sm font-semibold text-[color:var(--ink)]">{value}</div>
      <p className="mt-2 text-[0.82rem] leading-5 text-[color:var(--ink-soft)]">{detail}</p>
    </div>
  );
}

function ProposalLayerScheduleTable(props: { layers: SimpleWorkbenchProposalDocument["layers"] }) {
  const { layers } = props;

  return (
    <div className="overflow-x-auto rounded-[1rem] border hairline bg-[color:var(--paper)]/82">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b hairline text-left text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Layer</th>
            <th className="px-4 py-3">Thickness</th>
            <th className="px-4 py-3">Density</th>
            <th className="px-4 py-3">Surface Mass</th>
            <th className="px-4 py-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {layers.map((layer) => (
            <tr className="border-b hairline last:border-b-0" key={`${layer.index}-${layer.label}`}>
              <td className="px-4 py-3 font-semibold text-[color:var(--ink-soft)]">{layer.index}</td>
              <td className="px-4 py-3 font-semibold text-[color:var(--ink)]">{layer.label}</td>
              <td className="px-4 py-3 text-[color:var(--ink-soft)]">{layer.thicknessLabel}</td>
              <td className="px-4 py-3 text-[color:var(--ink-soft)]">{layer.densityLabel ?? "Not listed"}</td>
              <td className="px-4 py-3 text-[color:var(--ink-soft)]">{layer.surfaceMassLabel ?? "Not listed"}</td>
              <td className="px-4 py-3 text-[color:var(--ink-soft)]">{layer.roleLabel ?? layer.categoryLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
  const proposalBranding = useMemo(
    () =>
      proposalDocument
        ? getSimpleWorkbenchProposalBranding({
            consultantCompany: proposalDocument.consultantCompany,
            consultantWordmarkLine: proposalDocument.consultantWordmarkLine,
            projectName: proposalDocument.projectName,
            reportProfile: proposalDocument.reportProfile,
            reportProfileLabel: proposalDocument.reportProfileLabel
          })
        : null,
    [proposalDocument]
  );
  const proposalDossier = useMemo(
    () => (proposalDocument ? buildSimpleWorkbenchProposalDossier(proposalDocument) : null),
    [proposalDocument]
  );
  const constructionSection = useMemo(
    () => (proposalDocument ? buildSimpleWorkbenchProposalConstructionSection(proposalDocument.layers, proposalDocument.studyModeLabel) : null),
    [proposalDocument]
  );
  const methodTraceNoteCount = useMemo(
    () => proposalDocument?.methodTraceGroups.reduce((count, group) => count + group.notes.length, 0) ?? 0,
    [proposalDocument]
  );
  const corridorCardCount = useMemo(
    () => proposalDocument?.corridorDossierCards.length ?? 0,
    [proposalDocument]
  );
  const densityLineCount = useMemo(
    () => proposalDocument?.layers.filter((layer) => typeof layer.densityLabel === "string" && layer.densityLabel.trim().length > 0).length ?? 0,
    [proposalDocument]
  );
  const surfaceMassLineCount = useMemo(
    () =>
      proposalDocument?.layers.filter((layer) => typeof layer.surfaceMassLabel === "string" && layer.surfaceMassLabel.trim().length > 0).length ?? 0,
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

  async function handleDownloadPdf(style: "branded" | "simple" = "branded") {
    if (!proposalDocument) {
      toast.error("No proposal loaded", {
        description: "Return to the workbench and package a proposal first."
      });
      return;
    }

    setIsDownloadingPdf(true);

    try {
      await downloadSimpleWorkbenchProposalPdf(proposalDocument, {
        style
      });
      toast.success(style === "simple" ? "Simple PDF downloaded" : "Branded PDF downloaded", {
        description:
          style === "simple"
            ? "DynEcho prepared the lightweight calculation-summary PDF on the server."
            : "DynEcho prepared the formal proposal PDF on the server."
      });
    } catch (error) {
      toast.error(style === "simple" ? "Simple PDF failed" : "PDF generation failed", {
        description:
          error instanceof Error
            ? error.message
            : `DynEcho could not generate the ${style === "simple" ? "simple" : "branded"} PDF on the server.`
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
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--ink-soft)]">
              Review the branded issue sheet, then print or save PDF from a dedicated route.
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
              className="focus-ring inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!proposalDocument || isDownloadingPdf}
              onClick={() => void handleDownloadPdf("simple")}
              type="button"
            >
              <Download className="h-4 w-4" />
              {isDownloadingPdf ? "Generating PDF..." : "Simple PDF"}
            </button>
            <button
              className="focus-ring ink-button-solid inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
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
            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <div
                className="rounded-[1.3rem] border px-5 py-5"
                style={
                  proposalBranding
                    ? {
                        background: `linear-gradient(135deg, ${proposalBranding.heroFrom}, ${proposalBranding.heroTo})`,
                        borderColor: proposalBranding.line
                      }
                    : undefined
                }
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                      {proposalDocument.reportProfileLabel}
                    </div>
                    <h2 className="mt-2 font-display text-[1.9rem] leading-none tracking-[-0.05em] text-[color:var(--ink)]">
                      {proposalDocument.projectName}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">{proposalDocument.executiveSummary}</p>
                  </div>
                  <div className="shrink-0">
                    {proposalDocument.consultantLogoDataUrl ? (
                      <img
                        alt={`${proposalDocument.consultantCompany} logo`}
                        className="h-14 w-14 rounded-[1rem] border bg-white object-contain p-2"
                        src={proposalDocument.consultantLogoDataUrl}
                        style={{ borderColor: proposalBranding?.line }}
                      />
                    ) : proposalBranding ? (
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-[1rem] text-sm font-semibold uppercase tracking-[0.2em] text-[#fff8f2]"
                        style={{ backgroundColor: proposalBranding.accentStrong }}
                      >
                        {proposalBranding.monogram}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <PreviewFactCard
                    detail={`${proposalDocument.clientName} · ${proposalDocument.proposalRecipient}`}
                    label="Issue"
                    value={`${proposalDocument.proposalReference} · ${proposalDocument.proposalRevision}`}
                  />
                  <PreviewFactCard
                    detail={proposalDocument.dynamicBranchDetail}
                    label="Primary read"
                    value={`${proposalDocument.primaryMetricLabel} ${proposalDocument.primaryMetricValue}`}
                  />
                  <PreviewFactCard
                    detail={proposalDocument.validationDetail}
                    label="Validation"
                    value={proposalDocument.validationLabel}
                  />
                  <PreviewFactCard
                    detail={`${proposalDocument.consultantCompany} · ${proposalDocument.preparedBy}`}
                    label="Snapshot"
                    value={formatSavedAtLabel(loadedPreview!.savedAtIso)}
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <PreviewFactCard
                  detail={`${proposalDocument.proposalAttention} · ${proposalDocument.proposalIssuePurpose}`}
                  label="Transmittal"
                  value={proposalDocument.proposalRecipient}
                />
                <PreviewFactCard
                  detail={`${proposalDocument.studyContextLabel} · ${proposalDocument.reportProfileLabel}`}
                  label="Route"
                  value={`${proposalDocument.studyModeLabel} · ${proposalDocument.contextLabel}`}
                />
                <PreviewFactCard
                  detail={`${densityLineCount} density line${densityLineCount === 1 ? "" : "s"} · ${surfaceMassLineCount} surface-mass line${surfaceMassLineCount === 1 ? "" : "s"}`}
                  label="Stack"
                  value={constructionSection?.totalThicknessLabel ?? "Thickness pending"}
                />
                <PreviewFactCard
                  detail={frameReady ? "Preview frame ready for print." : "Preview frame is still loading."}
                  label="Subject"
                  value={proposalDocument.proposalSubject}
                />
              </div>
            </div>
          </SurfacePanel>

          {proposalDossier ? (
            <SurfacePanel className="px-5 py-5 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Issue dossier</div>
                  <h2 className="mt-1 font-display text-[1.55rem] leading-none tracking-[-0.05em] text-[color:var(--ink)]">
                    Audit posture at a glance
                  </h2>
                </div>
                <div className="rounded-full border hairline bg-[color:var(--paper)]/76 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  {proposalDossier.linkedCitationCount} linked source{proposalDossier.linkedCitationCount === 1 ? "" : "s"} · {proposalDossier.warningCount} warning
                  {proposalDossier.warningCount === 1 ? "" : "s"}
                </div>
              </div>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-[color:var(--ink-soft)]">{proposalDossier.headline}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {proposalDossier.items.map((item) => (
                  <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/78 px-4 py-4" key={`${item.label}-${item.value}`}>
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{item.label}</div>
                    <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{item.value}</div>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{item.detail}</p>
                  </div>
                ))}
              </div>
            </SurfacePanel>
          ) : null}

          {proposalDocument.methodDossierCards.length > 0 || proposalDocument.methodTraceGroups.length > 0 ? (
            <>
              {proposalDocument.corridorDossierCards.length > 0 ? (
                <SurfacePanel className="px-5 py-5 sm:px-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                        Validation corridor package
                      </div>
                      <h2 className="mt-1 font-display text-[1.55rem] leading-none tracking-[-0.05em] text-[color:var(--ink)]">
                        Benchmarked family and mode posture
                      </h2>
                    </div>
                    <div className="rounded-full border hairline bg-[color:var(--paper)]/76 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                      {corridorCardCount} card{corridorCardCount === 1 ? "" : "s"}
                    </div>
                  </div>
                  <p className="mt-3 max-w-4xl text-sm leading-6 text-[color:var(--ink-soft)]">{proposalDocument.corridorDossierHeadline}</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {proposalDocument.corridorDossierCards.map((item) => (
                      <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/78 px-4 py-4" key={`${item.label}-${item.value}`}>
                        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{item.label}</div>
                        <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{item.value}</div>
                        <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </SurfacePanel>
              ) : null}

              <SurfacePanel className="px-5 py-5 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                      Solver rationale package
                    </div>
                    <h2 className="mt-1 font-display text-[1.55rem] leading-none tracking-[-0.05em] text-[color:var(--ink)]">
                      Packaged lane narrative
                    </h2>
                  </div>
                  <div className="rounded-full border hairline bg-[color:var(--paper)]/76 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                    {proposalDocument.methodTraceGroups.length} trace group{proposalDocument.methodTraceGroups.length === 1 ? "" : "s"} · {methodTraceNoteCount} selected note
                    {methodTraceNoteCount === 1 ? "" : "s"}
                  </div>
                </div>
                <p className="mt-3 max-w-4xl text-sm leading-6 text-[color:var(--ink-soft)]">{proposalDocument.methodDossierHeadline}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {proposalDocument.methodDossierCards.map((item) => (
                    <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/78 px-4 py-4" key={`${item.label}-${item.value}`}>
                      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{item.label}</div>
                      <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{item.value}</div>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--ink-soft)]">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </SurfacePanel>
            </>
          ) : null}

          <SurfacePanel className="px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  Construction section
                </div>
                <h2 className="mt-1 font-display text-[1.55rem] leading-none tracking-[-0.05em] text-[color:var(--ink)]">
                  Visible layer stack in solver order
                </h2>
              </div>
              <div className="rounded-full border hairline bg-[color:var(--paper)]/76 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                {proposalDocument.layers.length} visible row{proposalDocument.layers.length === 1 ? "" : "s"}
              </div>
            </div>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-[color:var(--ink-soft)]">
              The live stack is shown here as the client-facing technical section and repeated in the branded PDF schedule.
            </p>
            <div className="mt-4">
              <SimpleWorkbenchProposalConstructionFigure
                layers={proposalDocument.layers}
                studyModeLabel={proposalDocument.studyModeLabel}
              />
            </div>
          </SurfacePanel>

          <SurfacePanel className="px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  Technical layer schedule
                </div>
                <h2 className="mt-1 font-display text-[1.55rem] leading-none tracking-[-0.05em] text-[color:var(--ink)]">
                  Density and surface-mass register
                </h2>
              </div>
              <div className="rounded-full border hairline bg-[color:var(--paper)]/76 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                {proposalDocument.layers.length} row{proposalDocument.layers.length === 1 ? "" : "s"} · {constructionSection?.totalThicknessLabel ?? "Thickness pending"}
              </div>
            </div>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-[color:var(--ink-soft)]">
              Density and surface-mass lines stay visible beside the client-facing section so the schedule reads like a formal issue sheet.
            </p>
            <div className="mt-4">
              <ProposalLayerScheduleTable layers={proposalDocument.layers} />
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
