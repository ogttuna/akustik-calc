"use client";

import { SurfacePanel } from "@dynecho/ui";
import { ArrowLeft, ChevronDown, Download, Eye, RefreshCcw, RotateCcw, Save } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useDeferredValue, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  buildSimpleWorkbenchProposalHtml,
  type SimpleWorkbenchProposalCoverageStatus,
  type SimpleWorkbenchProposalDocument
} from "@/features/workbench/simple-workbench-proposal";
import { buildSimpleWorkbenchProposalConstructionSection } from "@/features/workbench/simple-workbench-proposal-construction-section";
import { SimpleWorkbenchProposalConstructionFigure } from "@/features/workbench/simple-workbench-proposal-construction-figure";
import { getSimpleWorkbenchProposalBranding } from "@/features/workbench/simple-workbench-proposal-branding";
import { downloadSimpleWorkbenchProposalPdf } from "@/features/workbench/simple-workbench-proposal-pdf";
import {
  readSimpleWorkbenchProposalPreview,
  resetSimpleWorkbenchProposalPreviewCustomizations,
  storeSimpleWorkbenchProposalPreviewCustomizations
} from "@/features/workbench/simple-workbench-proposal-preview-storage";

const TONE_OPTIONS = [
  { label: "Accent", value: "accent" },
  { label: "Neutral", value: "neutral" },
  { label: "Success", value: "success" },
  { label: "Warning", value: "warning" }
] as const;

const COVERAGE_STATUS_OPTIONS = [
  { label: "Live", value: "live" },
  { label: "Bound", value: "bound" },
  { label: "Needs input", value: "needs_input" },
  { label: "Unsupported", value: "unsupported" }
] as const;

type ToneValue = (typeof TONE_OPTIONS)[number]["value"];

function formatSavedAtLabel(savedAtIso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short"
  }).format(new Date(savedAtIso));
}

function parseLineList(value: string): string[] {
  return value
    .split(/\r?\n/u)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function formatLineList(values: readonly string[]): string {
  return values.join("\n");
}

function patchArrayItem<T extends object>(items: readonly T[], index: number, patch: Partial<T>): T[] {
  return items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
}

function EditorField(props: {
  label: string;
  note?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  const { label, note, onChange, placeholder, value } = props;

  return (
    <label className="grid gap-2">
      <div className="grid gap-1">
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</span>
        {note ? <p className="text-[0.78rem] leading-5 text-[color:var(--ink-soft)]">{note}</p> : null}
      </div>
      <input
        className="focus-ring rounded-[0.9rem] border hairline bg-[color:var(--paper)] px-3 py-3 text-sm text-[color:var(--ink)]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

function EditorTextarea(props: {
  label: string;
  note?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  value: string;
}) {
  const { label, note, onChange, placeholder, rows = 4, value } = props;

  return (
    <label className="grid gap-2">
      <div className="grid gap-1">
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</span>
        {note ? <p className="text-[0.78rem] leading-5 text-[color:var(--ink-soft)]">{note}</p> : null}
      </div>
      <textarea
        className="focus-ring rounded-[0.9rem] border hairline bg-[color:var(--paper)] px-3 py-3 text-sm leading-6 text-[color:var(--ink)]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        value={value}
      />
    </label>
  );
}

function EditorSelect<T extends string>(props: {
  label: string;
  onChange: (value: T) => void;
  options: readonly { label: string; value: T }[];
  value: T;
}) {
  const { label, onChange, options, value } = props;

  return (
    <label className="grid gap-2">
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</span>
      <select
        className="focus-ring rounded-[0.9rem] border hairline bg-[color:var(--paper)] px-3 py-3 text-sm text-[color:var(--ink)]"
        onChange={(event) => onChange(event.target.value as T)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function EditorSection(props: {
  description: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const { children, description, eyebrow, title } = props;

  return (
    <SurfacePanel className="px-5 py-5 sm:px-6">
      <div>
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{eyebrow}</div>
        <h2 className="mt-1 font-display text-[1.45rem] leading-none tracking-[-0.05em] text-[color:var(--ink)]">{title}</h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-[color:var(--ink-soft)]">{description}</p>
      </div>
      <div className="mt-4 grid gap-4">{children}</div>
    </SurfacePanel>
  );
}

function CollapsibleEditorSection(props: {
  children: ReactNode;
  defaultOpen?: boolean;
  description: string;
  eyebrow: string;
  summary: string;
  title: string;
}) {
  const { children, defaultOpen = false, description, eyebrow, summary, title } = props;

  return (
    <SurfacePanel className="px-5 py-5 sm:px-6">
      <details open={defaultOpen}>
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-[1rem] border hairline bg-[color:var(--paper)]/72 px-4 py-4">
          <div>
            <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{eyebrow}</div>
            <h2 className="mt-1 font-display text-[1.25rem] leading-none tracking-[-0.04em] text-[color:var(--ink)]">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[color:var(--ink-soft)]">{description}</p>
          </div>
          <div className="inline-flex shrink-0 items-center gap-2 rounded-full border hairline bg-[color:var(--paper)]/82 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
            <span>{summary}</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </summary>
        <div className="mt-4 grid gap-4">{children}</div>
      </details>
    </SurfacePanel>
  );
}

function EmptyArrayNote(props: { children: ReactNode }) {
  return (
    <div className="rounded-[1rem] border border-dashed hairline px-4 py-4 text-sm leading-6 text-[color:var(--ink-soft)]">
      {props.children}
    </div>
  );
}

export function ProposalAdjustClientPage() {
  const [baseDocument, setBaseDocument] = useState<SimpleWorkbenchProposalDocument | null>(null);
  const [editableDocument, setEditableDocument] = useState<SimpleWorkbenchProposalDocument | null>(null);
  const [savedAtIso, setSavedAtIso] = useState<string>("");
  const [customizedAtIso, setCustomizedAtIso] = useState<string | undefined>(undefined);
  const [lastSavedSignature, setLastSavedSignature] = useState("");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  function loadStoredPreview() {
    const preview = readSimpleWorkbenchProposalPreview();
    const signature = preview ? JSON.stringify(preview.document) : "";

    setBaseDocument(preview?.baseDocument ?? null);
    setEditableDocument(preview?.document ?? null);
    setSavedAtIso(preview?.savedAtIso ?? "");
    setCustomizedAtIso(preview?.customizedAtIso ?? undefined);
    setLastSavedSignature(signature);
  }

  useEffect(() => {
    loadStoredPreview();
  }, []);

  const deferredDocument = useDeferredValue(editableDocument);
  const baseSignature = useMemo(() => (baseDocument ? JSON.stringify(baseDocument) : ""), [baseDocument]);
  const currentSignature = useMemo(() => (editableDocument ? JSON.stringify(editableDocument) : ""), [editableDocument]);
  const hasManualOverrides = baseSignature.length > 0 && currentSignature !== baseSignature;
  const hasUnsavedChanges = currentSignature.length > 0 && currentSignature !== lastSavedSignature;
  const proposalHtml = useMemo(
    () => (deferredDocument ? buildSimpleWorkbenchProposalHtml(deferredDocument) : ""),
    [deferredDocument]
  );
  const proposalBranding = useMemo(
    () =>
      deferredDocument
        ? getSimpleWorkbenchProposalBranding({
            consultantCompany: deferredDocument.consultantCompany,
            consultantWordmarkLine: deferredDocument.consultantWordmarkLine,
            projectName: deferredDocument.projectName,
            reportProfile: deferredDocument.reportProfile,
            reportProfileLabel: deferredDocument.reportProfileLabel
          })
        : null,
    [deferredDocument]
  );
  const constructionSection = useMemo(
    () =>
      deferredDocument
        ? buildSimpleWorkbenchProposalConstructionSection(deferredDocument.layers, deferredDocument.studyModeLabel, {
            totalThicknessLabelOverride: deferredDocument.constructionTotalThicknessOverrideLabel
          })
        : null,
    [deferredDocument]
  );

  function updateDocument(mutator: (current: SimpleWorkbenchProposalDocument) => SimpleWorkbenchProposalDocument) {
    setEditableDocument((current) => (current ? mutator(current) : current));
  }

  function updateField<K extends keyof SimpleWorkbenchProposalDocument>(key: K, value: SimpleWorkbenchProposalDocument[K]) {
    updateDocument((current) => ({
      ...current,
      [key]: value
    }));
  }

  function persistCurrentDocument(options?: { silent?: boolean }): boolean {
    if (!editableDocument || !baseDocument) {
      return false;
    }

    if (!hasUnsavedChanges) {
      return true;
    }

    if (!hasManualOverrides) {
      resetSimpleWorkbenchProposalPreviewCustomizations();
      setCustomizedAtIso(undefined);
      setLastSavedSignature(currentSignature);
      if (!options?.silent) {
        toast.success("PDF edits cleared", {
          description: "The packaged proposal snapshot is active again."
        });
      }
      return true;
    }

    const nextCustomizedAtIso = storeSimpleWorkbenchProposalPreviewCustomizations(editableDocument);
    setCustomizedAtIso(nextCustomizedAtIso);
    setLastSavedSignature(currentSignature);

    if (!options?.silent) {
      toast.success("PDF edits saved", {
        description: "Only the proposal snapshot was updated. Calculator inputs and engine results stay untouched."
      });
    }

    return true;
  }

  function handleReloadStoredPreview() {
    loadStoredPreview();
    toast.success("Saved PDF state reloaded", {
      description: "The adjustment desk now matches the latest stored proposal snapshot."
    });
  }

  function handleResetToPackagedSnapshot() {
    if (!baseDocument) {
      return;
    }

    resetSimpleWorkbenchProposalPreviewCustomizations();
    setEditableDocument(baseDocument);
    setCustomizedAtIso(undefined);
    setLastSavedSignature(baseSignature);
    toast.success("Packaged snapshot restored", {
      description: "Manual PDF edits were cleared. The calculator result package is active again."
    });
  }

  function handleOpenPreview() {
    if (!editableDocument) {
      toast.error("No proposal loaded", {
        description: "Return to the workbench and package a proposal first."
      });
      return;
    }

    persistCurrentDocument({ silent: true });
    window.location.assign("/workbench/proposal");
  }

  async function handleDownloadPdf(style: "branded" | "simple") {
    if (!editableDocument) {
      toast.error("No proposal loaded", {
        description: "Return to the workbench and package a proposal first."
      });
      return;
    }

    persistCurrentDocument({ silent: true });
    setIsDownloadingPdf(true);

    try {
      await downloadSimpleWorkbenchProposalPdf(editableDocument, {
        style
      });
      toast.success(style === "simple" ? "Simple PDF downloaded" : "Branded PDF downloaded", {
        description: "The current proposal-adjustment snapshot was sent to the PDF renderer."
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

  if (!editableDocument) {
    return (
      <main className="ui-shell flex min-h-screen flex-col gap-6 overflow-x-clip px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <SurfacePanel className="px-5 py-6 sm:px-6">
          <div className="eyebrow">No Proposal Snapshot</div>
          <h1 className="mt-1 font-display text-[1.7rem] leading-none tracking-[-0.05em] text-[color:var(--ink)]">
            Package a proposal before opening the PDF adjustment desk
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink-soft)]">
            This page only edits the packaged proposal snapshot that feeds the preview and PDF renderer. Return to the workbench proposal tab and
            package an issue first.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              className="focus-ring surface-subtle-hover inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)]"
              href="/workbench"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to workbench
            </Link>
          </div>
        </SurfacePanel>
      </main>
    );
  }

  return (
    <main className="ui-shell flex min-h-screen flex-col gap-6 overflow-x-clip px-4 pb-12 pt-4 sm:px-6 lg:px-8">
      <SurfacePanel className="px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-4xl">
            <div className="eyebrow">Proposal Adjustment Desk</div>
            <h1 className="mt-1 font-display text-[2rem] leading-none tracking-[-0.05em] text-[color:var(--ink)]">
              PDF structure with manual override control
            </h1>
            <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
              These edits only change the packaged proposal snapshot that feeds the print preview and PDF renderer. Calculator rows, solver choices,
              and engine outputs stay untouched.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              className="focus-ring surface-subtle-hover inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)]"
              href="/workbench"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to workbench
            </Link>
            <button
              className="focus-ring surface-subtle-hover inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)]"
              onClick={handleReloadStoredPreview}
              type="button"
            >
              <RefreshCcw className="h-4 w-4" />
              Reload saved state
            </button>
            <button
              className="focus-ring surface-subtle-hover inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)]"
              onClick={handleResetToPackagedSnapshot}
              type="button"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to packaged
            </button>
            <button
              className="focus-ring surface-subtle-hover inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)]"
              onClick={() => persistCurrentDocument()}
              type="button"
            >
              <Save className="h-4 w-4" />
              Save PDF edits
            </button>
            <button
              className="focus-ring surface-subtle-hover inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)]"
              onClick={handleOpenPreview}
              type="button"
            >
              <Eye className="h-4 w-4" />
              Open print view
            </button>
            <button
              className="focus-ring surface-subtle-hover inline-flex items-center gap-2 rounded-full border hairline px-4 py-2 text-sm font-semibold text-[color:var(--ink-soft)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isDownloadingPdf}
              onClick={() => void handleDownloadPdf("branded")}
              type="button"
            >
              <Download className="h-4 w-4" />
              {isDownloadingPdf ? "Generating PDF..." : "Download branded PDF"}
            </button>
            <button
              className="focus-ring ink-button-solid inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isDownloadingPdf}
              onClick={() => void handleDownloadPdf("simple")}
              type="button"
            >
              <Download className="h-4 w-4" />
              {isDownloadingPdf ? "Generating PDF..." : "Simple PDF"}
            </button>
          </div>
        </div>
      </SurfacePanel>

      <SurfacePanel className="px-5 py-5 sm:px-6">
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
          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                Snapshot control
              </div>
              <h2 className="mt-2 font-display text-[1.7rem] leading-none tracking-[-0.05em] text-[color:var(--ink)]">
                {hasManualOverrides ? "Manual PDF edits active" : "Packaged proposal snapshot active"}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--ink-soft)]">
                {hasUnsavedChanges
                  ? "You have local changes that are already visible in the live preview but not yet stored for the shared print route."
                  : "The live preview matches the currently stored proposal snapshot."}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/82 px-4 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Packaged on</div>
                <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">
                  {savedAtIso ? formatSavedAtLabel(savedAtIso) : "No packaged timestamp"}
                </div>
              </div>
              <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/82 px-4 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Manual edit state</div>
                <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">
                  {customizedAtIso ? formatSavedAtLabel(customizedAtIso) : "No stored PDF overrides"}
                </div>
              </div>
              <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/82 px-4 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Layer stack</div>
                <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">
                  {editableDocument.layers.length} visible row{editableDocument.layers.length === 1 ? "" : "s"}
                </div>
                <p className="mt-2 text-[0.82rem] leading-5 text-[color:var(--ink-soft)]">
                  {constructionSection?.totalThicknessLabel ?? "Thickness pending"}
                </p>
              </div>
              <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/82 px-4 py-4">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">Scope boundary</div>
                <div className="mt-2 text-sm font-semibold text-[color:var(--ink)]">PDF snapshot only</div>
                <p className="mt-2 text-[0.82rem] leading-5 text-[color:var(--ink-soft)]">
                  Workbench calculation state is not edited on this page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SurfacePanel>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)]">
        <div className="grid gap-6">
          <EditorSection
            description="İlk ekranda sadece PDF kapağında en çok değiştirilen alanlar açık tutulur."
            eyebrow="Basic"
            title="Temel PDF bilgileri"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <EditorField label="Project name" onChange={(value) => updateField("projectName", value)} value={editableDocument.projectName} />
              <EditorField label="Client name" onChange={(value) => updateField("clientName", value)} value={editableDocument.clientName} />
              <EditorField label="Proposal recipient" onChange={(value) => updateField("proposalRecipient", value)} value={editableDocument.proposalRecipient} />
              <EditorField label="Attention line" onChange={(value) => updateField("proposalAttention", value)} value={editableDocument.proposalAttention} />
              <EditorField label="Proposal reference" onChange={(value) => updateField("proposalReference", value)} value={editableDocument.proposalReference} />
              <EditorField label="Proposal revision" onChange={(value) => updateField("proposalRevision", value)} value={editableDocument.proposalRevision} />
              <EditorField label="Proposal subject" onChange={(value) => updateField("proposalSubject", value)} value={editableDocument.proposalSubject} />
              <EditorField label="Issue purpose" onChange={(value) => updateField("proposalIssuePurpose", value)} value={editableDocument.proposalIssuePurpose} />
              <EditorField label="Validity note" onChange={(value) => updateField("proposalValidityNote", value)} value={editableDocument.proposalValidityNote} />
            </div>
            <EditorTextarea
              label="Executive summary"
              onChange={(value) => updateField("executiveSummary", value)}
              rows={5}
              value={editableDocument.executiveSummary}
            />
            <EditorTextarea label="Brief note" onChange={(value) => updateField("briefNote", value)} rows={4} value={editableDocument.briefNote} />
          </EditorSection>

          <CollapsibleEditorSection
            description="Consultant kimliği, issue meta alanları ve daha nadir dokunulan kapak satırları burada."
            eyebrow="Advanced"
            summary="Identity and issue meta"
            title="Consultant and issue metadata"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <EditorField label="Consultant company" onChange={(value) => updateField("consultantCompany", value)} value={editableDocument.consultantCompany} />
              <EditorField label="Prepared by" onChange={(value) => updateField("preparedBy", value)} value={editableDocument.preparedBy} />
              <EditorField label="Approver title" onChange={(value) => updateField("approverTitle", value)} value={editableDocument.approverTitle} />
              <EditorField label="Report profile label" onChange={(value) => updateField("reportProfileLabel", value)} value={editableDocument.reportProfileLabel} />
              <EditorField label="Consultant wordmark" onChange={(value) => updateField("consultantWordmarkLine", value)} value={editableDocument.consultantWordmarkLine} />
              <EditorField label="Issue code prefix" onChange={(value) => updateField("issueCodePrefix", value)} value={editableDocument.issueCodePrefix} />
              <EditorField label="Consultant email" onChange={(value) => updateField("consultantEmail", value)} value={editableDocument.consultantEmail} />
              <EditorField label="Consultant phone" onChange={(value) => updateField("consultantPhone", value)} value={editableDocument.consultantPhone} />
              <EditorField label="Issued on label" onChange={(value) => updateField("issuedOnLabel", value)} value={editableDocument.issuedOnLabel} />
            </div>
            <EditorTextarea label="Office address" onChange={(value) => updateField("consultantAddress", value)} rows={3} value={editableDocument.consultantAddress} />
          </CollapsibleEditorSection>

          <EditorSection
            description="Ana görünen değerler burada. İleri seviye metric satırları aşağıda yine aynı blok içinde kalır."
            eyebrow="Metrics"
            title="Primary numbers and route notes"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <EditorField label="Primary metric label" onChange={(value) => updateField("primaryMetricLabel", value)} value={editableDocument.primaryMetricLabel} />
              <EditorField label="Primary metric value" onChange={(value) => updateField("primaryMetricValue", value)} value={editableDocument.primaryMetricValue} />
              <EditorField label="Validation label" onChange={(value) => updateField("validationLabel", value)} value={editableDocument.validationLabel} />
              <EditorField label="Context label" onChange={(value) => updateField("contextLabel", value)} value={editableDocument.contextLabel} />
              <EditorField label="Dynamic branch label" onChange={(value) => updateField("dynamicBranchLabel", value)} value={editableDocument.dynamicBranchLabel} />
              <EditorField label="Study mode label" onChange={(value) => updateField("studyModeLabel", value)} value={editableDocument.studyModeLabel} />
              <EditorField label="Study context label" onChange={(value) => updateField("studyContextLabel", value)} value={editableDocument.studyContextLabel} />
              <EditorField label="Assembly headline" onChange={(value) => updateField("assemblyHeadline", value)} value={editableDocument.assemblyHeadline} />
            </div>
            <EditorTextarea
              label="Validation detail"
              onChange={(value) => updateField("validationDetail", value)}
              rows={3}
              value={editableDocument.validationDetail}
            />
            <EditorTextarea
              label="Dynamic branch detail"
              onChange={(value) => updateField("dynamicBranchDetail", value)}
              rows={3}
              value={editableDocument.dynamicBranchDetail}
            />
            {editableDocument.metrics.length === 0 ? (
              <EmptyArrayNote>No packaged live-output rows exist on this snapshot yet.</EmptyArrayNote>
            ) : (
              <div className="grid gap-4">
                {editableDocument.metrics.map((metric, index) => (
                  <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/80 px-4 py-4" key={`${metric.label}-${index}`}>
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                      Metric {index + 1}
                    </div>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <EditorField
                        label="Label"
                        onChange={(value) => updateDocument((current) => ({
                          ...current,
                          metrics: patchArrayItem(current.metrics, index, { label: value })
                        }))}
                        value={metric.label}
                      />
                      <EditorField
                        label="Value"
                        onChange={(value) => updateDocument((current) => ({
                          ...current,
                          metrics: patchArrayItem(current.metrics, index, { value })
                        }))}
                        value={metric.value}
                      />
                    </div>
                    <div className="mt-4">
                      <EditorTextarea
                        label="Detail"
                        onChange={(value) => updateDocument((current) => ({
                          ...current,
                          metrics: patchArrayItem(current.metrics, index, { detail: value })
                        }))}
                        rows={3}
                        value={metric.detail}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </EditorSection>

          <EditorSection
            description="Layer lines stay editable here before the PDF renderer runs. The manual total field can intentionally diverge from the row sum."
            eyebrow="Construction"
            title="Layer schedule and total override"
          >
            <EditorField
              label="Manual total thickness label"
              note="Leave blank to use the thickness sum generated from the visible rows."
              onChange={(value) =>
                updateField("constructionTotalThicknessOverrideLabel", value.trim().length > 0 ? value : undefined)
              }
              placeholder="184 mm total"
              value={editableDocument.constructionTotalThicknessOverrideLabel ?? ""}
            />
            <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/82 px-4 py-4">
              <SimpleWorkbenchProposalConstructionFigure
                layers={editableDocument.layers}
                studyModeLabel={editableDocument.studyModeLabel}
                totalThicknessOverrideLabel={editableDocument.constructionTotalThicknessOverrideLabel}
              />
            </div>
            {editableDocument.layers.length === 0 ? (
              <EmptyArrayNote>No packaged layer rows exist on this snapshot yet.</EmptyArrayNote>
            ) : (
              <div className="overflow-x-auto rounded-[1rem] border hairline bg-[color:var(--paper)]/82">
                <table className="min-w-[980px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b hairline text-left text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                      <th className="px-3 py-3">#</th>
                      <th className="px-3 py-3">Layer</th>
                      <th className="px-3 py-3">Thickness</th>
                      <th className="px-3 py-3">Density</th>
                      <th className="px-3 py-3">Surface Mass</th>
                      <th className="px-3 py-3">Role</th>
                      <th className="px-3 py-3">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableDocument.layers.map((layer, index) => (
                      <tr className="border-b hairline align-top last:border-b-0" key={`${layer.index}-${index}`}>
                        <td className="px-3 py-3 font-semibold text-[color:var(--ink-soft)]">{layer.index}</td>
                        <td className="px-3 py-3">
                          <input
                            className="focus-ring w-full rounded-md border hairline bg-[color:var(--paper)] px-2 py-2 text-sm text-[color:var(--ink)]"
                            onChange={(event) =>
                              updateDocument((current) => ({
                                ...current,
                                layers: patchArrayItem(current.layers, index, { label: event.target.value })
                              }))
                            }
                            value={layer.label}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            className="focus-ring w-full rounded-md border hairline bg-[color:var(--paper)] px-2 py-2 text-sm text-[color:var(--ink)]"
                            onChange={(event) =>
                              updateDocument((current) => ({
                                ...current,
                                layers: patchArrayItem(current.layers, index, { thicknessLabel: event.target.value })
                              }))
                            }
                            value={layer.thicknessLabel}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            className="focus-ring w-full rounded-md border hairline bg-[color:var(--paper)] px-2 py-2 text-sm text-[color:var(--ink)]"
                            onChange={(event) =>
                              updateDocument((current) => ({
                                ...current,
                                layers: patchArrayItem(current.layers, index, { densityLabel: event.target.value })
                              }))
                            }
                            placeholder="Not listed"
                            value={layer.densityLabel ?? ""}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            className="focus-ring w-full rounded-md border hairline bg-[color:var(--paper)] px-2 py-2 text-sm text-[color:var(--ink)]"
                            onChange={(event) =>
                              updateDocument((current) => ({
                                ...current,
                                layers: patchArrayItem(current.layers, index, { surfaceMassLabel: event.target.value })
                              }))
                            }
                            placeholder="Not listed"
                            value={layer.surfaceMassLabel ?? ""}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            className="focus-ring w-full rounded-md border hairline bg-[color:var(--paper)] px-2 py-2 text-sm text-[color:var(--ink)]"
                            onChange={(event) =>
                              updateDocument((current) => ({
                                ...current,
                                layers: patchArrayItem(current.layers, index, { roleLabel: event.target.value })
                              }))
                            }
                            value={layer.roleLabel ?? ""}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            className="focus-ring w-full rounded-md border hairline bg-[color:var(--paper)] px-2 py-2 text-sm text-[color:var(--ink)]"
                            onChange={(event) =>
                              updateDocument((current) => ({
                                ...current,
                                layers: patchArrayItem(current.layers, index, { categoryLabel: event.target.value })
                              }))
                            }
                            value={layer.categoryLabel}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </EditorSection>

          <CollapsibleEditorSection
            description="Dossier kartları, method trace notları ve coverage metinleri sık kullanılmadığı için kapalı gelir."
            eyebrow="Advanced"
            summary={`${editableDocument.corridorDossierCards.length + editableDocument.methodDossierCards.length + editableDocument.methodTraceGroups.length + editableDocument.coverageItems.length} packaged blocks`}
            title="Narratives, method blocks, and coverage"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <EditorTextarea
                label="Corridor dossier headline"
                onChange={(value) => updateField("corridorDossierHeadline", value)}
                rows={4}
                value={editableDocument.corridorDossierHeadline}
              />
              <EditorTextarea
                label="Method dossier headline"
                onChange={(value) => updateField("methodDossierHeadline", value)}
                rows={4}
                value={editableDocument.methodDossierHeadline}
              />
              <EditorTextarea
                label="Decision trail headline"
                onChange={(value) => updateField("decisionTrailHeadline", value)}
                rows={3}
                value={editableDocument.decisionTrailHeadline}
              />
            </div>

            {editableDocument.corridorDossierCards.length > 0 ? (
              <div className="grid gap-4">
                {editableDocument.corridorDossierCards.map((item, index) => (
                  <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/80 px-4 py-4" key={`corridor-${index}`}>
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                      Corridor card {index + 1}
                    </div>
                    <div className="mt-3 grid gap-4 md:grid-cols-3">
                      <EditorField
                        label="Label"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            corridorDossierCards: patchArrayItem(current.corridorDossierCards, index, { label: value })
                          }))
                        }
                        value={item.label}
                      />
                      <EditorField
                        label="Value"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            corridorDossierCards: patchArrayItem(current.corridorDossierCards, index, { value })
                          }))
                        }
                        value={item.value}
                      />
                      <EditorSelect<ToneValue>
                        label="Tone"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            corridorDossierCards: patchArrayItem(current.corridorDossierCards, index, { tone: value })
                          }))
                        }
                        options={TONE_OPTIONS}
                        value={item.tone}
                      />
                    </div>
                    <div className="mt-4">
                      <EditorTextarea
                        label="Detail"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            corridorDossierCards: patchArrayItem(current.corridorDossierCards, index, { detail: value })
                          }))
                        }
                        rows={3}
                        value={item.detail}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {editableDocument.methodDossierCards.length > 0 ? (
              <div className="grid gap-4">
                {editableDocument.methodDossierCards.map((item, index) => (
                  <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/80 px-4 py-4" key={`method-card-${index}`}>
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                      Method card {index + 1}
                    </div>
                    <div className="mt-3 grid gap-4 md:grid-cols-3">
                      <EditorField
                        label="Label"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            methodDossierCards: patchArrayItem(current.methodDossierCards, index, { label: value })
                          }))
                        }
                        value={item.label}
                      />
                      <EditorField
                        label="Value"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            methodDossierCards: patchArrayItem(current.methodDossierCards, index, { value })
                          }))
                        }
                        value={item.value}
                      />
                      <EditorSelect<ToneValue>
                        label="Tone"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            methodDossierCards: patchArrayItem(current.methodDossierCards, index, { tone: value })
                          }))
                        }
                        options={TONE_OPTIONS}
                        value={item.tone}
                      />
                    </div>
                    <div className="mt-4">
                      <EditorTextarea
                        label="Detail"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            methodDossierCards: patchArrayItem(current.methodDossierCards, index, { detail: value })
                          }))
                        }
                        rows={3}
                        value={item.detail}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {editableDocument.methodTraceGroups.length > 0 ? (
              <div className="grid gap-4">
                {editableDocument.methodTraceGroups.map((group, index) => (
                  <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/80 px-4 py-4" key={`trace-${index}`}>
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                      Trace group {index + 1}
                    </div>
                    <div className="mt-3 grid gap-4 md:grid-cols-3">
                      <EditorField
                        label="Label"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            methodTraceGroups: patchArrayItem(current.methodTraceGroups, index, { label: value })
                          }))
                        }
                        value={group.label}
                      />
                      <EditorField
                        label="Value"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            methodTraceGroups: patchArrayItem(current.methodTraceGroups, index, { value })
                          }))
                        }
                        value={group.value}
                      />
                      <EditorSelect<ToneValue>
                        label="Tone"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            methodTraceGroups: patchArrayItem(current.methodTraceGroups, index, { tone: value })
                          }))
                        }
                        options={TONE_OPTIONS}
                        value={group.tone}
                      />
                    </div>
                    <div className="mt-4 grid gap-4">
                      <EditorTextarea
                        label="Detail"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            methodTraceGroups: patchArrayItem(current.methodTraceGroups, index, { detail: value })
                          }))
                        }
                        rows={3}
                        value={group.detail}
                      />
                      <EditorTextarea
                        label="Notes"
                        note="One note per line."
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            methodTraceGroups: patchArrayItem(current.methodTraceGroups, index, { notes: parseLineList(value) })
                          }))
                        }
                        rows={4}
                        value={formatLineList(group.notes)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {editableDocument.coverageItems.length > 0 ? (
              <div className="grid gap-4">
                {editableDocument.coverageItems.map((item, index) => (
                  <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/80 px-4 py-4" key={`coverage-${index}`}>
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                      Coverage row {index + 1}
                    </div>
                    <div className="mt-3 grid gap-4 md:grid-cols-3">
                      <EditorField
                        label="Label"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            coverageItems: patchArrayItem(current.coverageItems, index, { label: value })
                          }))
                        }
                        value={item.label}
                      />
                      <EditorField
                        label="Value"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            coverageItems: patchArrayItem(current.coverageItems, index, { value })
                          }))
                        }
                        value={item.value}
                      />
                      <EditorSelect<SimpleWorkbenchProposalCoverageStatus>
                        label="Status"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            coverageItems: patchArrayItem(current.coverageItems, index, { status: value })
                          }))
                        }
                        options={COVERAGE_STATUS_OPTIONS}
                        value={item.status}
                      />
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <EditorField
                        label="Posture label"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            coverageItems: patchArrayItem(current.coverageItems, index, { postureLabel: value })
                          }))
                        }
                        value={item.postureLabel}
                      />
                      <EditorField
                        label="Next step"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            coverageItems: patchArrayItem(current.coverageItems, index, { nextStep: value || undefined })
                          }))
                        }
                        value={item.nextStep ?? ""}
                      />
                    </div>
                    <div className="mt-4 grid gap-4">
                      <EditorTextarea
                        label="Detail"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            coverageItems: patchArrayItem(current.coverageItems, index, { detail: value })
                          }))
                        }
                        rows={3}
                        value={item.detail}
                      />
                      <EditorTextarea
                        label="Posture detail"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            coverageItems: patchArrayItem(current.coverageItems, index, { postureDetail: value })
                          }))
                        }
                        rows={3}
                        value={item.postureDetail}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </CollapsibleEditorSection>

          <CollapsibleEditorSection
            description="Issue register, assumptions, citations ve warnings burada tutulur. Gerekmiyorsa hiç açmadan ilerleyebilirsiniz."
            eyebrow="Advanced"
            summary={`${editableDocument.issueRegisterItems.length + editableDocument.decisionTrailItems.length + editableDocument.assumptionItems.length + editableDocument.recommendationItems.length + editableDocument.citations.length} rows + warnings`}
            title="Registers, citations, and warnings"
          >
            {editableDocument.issueRegisterItems.length > 0 ? (
              <div className="grid gap-4">
                {editableDocument.issueRegisterItems.map((item, index) => (
                  <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/80 px-4 py-4" key={`register-${index}`}>
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                      Issue register row {index + 1}
                    </div>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <EditorField
                        label="Label"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            issueRegisterItems: patchArrayItem(current.issueRegisterItems, index, { label: value })
                          }))
                        }
                        value={item.label}
                      />
                      <EditorField
                        label="Reference"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            issueRegisterItems: patchArrayItem(current.issueRegisterItems, index, { reference: value })
                          }))
                        }
                        value={item.reference}
                      />
                      <EditorField
                        label="Status label"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            issueRegisterItems: patchArrayItem(current.issueRegisterItems, index, { statusLabel: value })
                          }))
                        }
                        value={item.statusLabel}
                      />
                      <EditorField
                        label="Issued on label"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            issueRegisterItems: patchArrayItem(current.issueRegisterItems, index, { issuedOnLabel: value })
                          }))
                        }
                        value={item.issuedOnLabel}
                      />
                    </div>
                    <div className="mt-4">
                      <EditorTextarea
                        label="Detail"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            issueRegisterItems: patchArrayItem(current.issueRegisterItems, index, { detail: value })
                          }))
                        }
                        rows={3}
                        value={item.detail}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {editableDocument.decisionTrailItems.length > 0 ? (
              <div className="grid gap-4">
                {editableDocument.decisionTrailItems.map((item, index) => (
                  <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/80 px-4 py-4" key={`decision-${index}`}>
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                      Decision item {index + 1}
                    </div>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <EditorField
                        label="Label"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            decisionTrailItems: patchArrayItem(current.decisionTrailItems, index, { label: value })
                          }))
                        }
                        value={item.label}
                      />
                      <EditorSelect<ToneValue>
                        label="Tone"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            decisionTrailItems: patchArrayItem(current.decisionTrailItems, index, { tone: value })
                          }))
                        }
                        options={TONE_OPTIONS}
                        value={item.tone}
                      />
                    </div>
                    <div className="mt-4">
                      <EditorTextarea
                        label="Detail"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            decisionTrailItems: patchArrayItem(current.decisionTrailItems, index, { detail: value })
                          }))
                        }
                        rows={3}
                        value={item.detail}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {editableDocument.assumptionItems.length > 0 ? (
              <div className="grid gap-4">
                {editableDocument.assumptionItems.map((item, index) => (
                  <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/80 px-4 py-4" key={`assumption-${index}`}>
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                      Assumption {index + 1}
                    </div>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <EditorField
                        label="Label"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            assumptionItems: patchArrayItem(current.assumptionItems, index, { label: value })
                          }))
                        }
                        value={item.label}
                      />
                      <EditorSelect<ToneValue>
                        label="Tone"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            assumptionItems: patchArrayItem(current.assumptionItems, index, { tone: value })
                          }))
                        }
                        options={TONE_OPTIONS}
                        value={item.tone}
                      />
                    </div>
                    <div className="mt-4">
                      <EditorTextarea
                        label="Detail"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            assumptionItems: patchArrayItem(current.assumptionItems, index, { detail: value })
                          }))
                        }
                        rows={3}
                        value={item.detail}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {editableDocument.recommendationItems.length > 0 ? (
              <div className="grid gap-4">
                {editableDocument.recommendationItems.map((item, index) => (
                  <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/80 px-4 py-4" key={`recommendation-${index}`}>
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                      Recommendation {index + 1}
                    </div>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <EditorField
                        label="Label"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            recommendationItems: patchArrayItem(current.recommendationItems, index, { label: value })
                          }))
                        }
                        value={item.label}
                      />
                      <EditorSelect<ToneValue>
                        label="Tone"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            recommendationItems: patchArrayItem(current.recommendationItems, index, { tone: value })
                          }))
                        }
                        options={TONE_OPTIONS}
                        value={item.tone}
                      />
                    </div>
                    <div className="mt-4">
                      <EditorTextarea
                        label="Detail"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            recommendationItems: patchArrayItem(current.recommendationItems, index, { detail: value })
                          }))
                        }
                        rows={3}
                        value={item.detail}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {editableDocument.citations.length > 0 ? (
              <div className="grid gap-4">
                {editableDocument.citations.map((item, index) => (
                  <div className="rounded-[1rem] border hairline bg-[color:var(--paper)]/80 px-4 py-4" key={`citation-${index}`}>
                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                      Citation {index + 1}
                    </div>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <EditorField
                        label="Label"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            citations: patchArrayItem(current.citations, index, { label: value })
                          }))
                        }
                        value={item.label}
                      />
                      <EditorSelect<ToneValue>
                        label="Tone"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            citations: patchArrayItem(current.citations, index, { tone: value })
                          }))
                        }
                        options={TONE_OPTIONS}
                        value={item.tone}
                      />
                    </div>
                    <div className="mt-4 grid gap-4">
                      <EditorField
                        label="Href"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            citations: patchArrayItem(current.citations, index, { href: value || undefined })
                          }))
                        }
                        value={item.href ?? ""}
                      />
                      <EditorTextarea
                        label="Detail"
                        onChange={(value) =>
                          updateDocument((current) => ({
                            ...current,
                            citations: patchArrayItem(current.citations, index, { detail: value })
                          }))
                        }
                        rows={3}
                        value={item.detail}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <EditorTextarea
              label="Warnings"
              note="One warning per line."
              onChange={(value) => updateField("warnings", parseLineList(value))}
              rows={5}
              value={formatLineList(editableDocument.warnings)}
            />
          </CollapsibleEditorSection>
        </div>

        <div className="grid gap-6">
          <SurfacePanel className="sticky top-4 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                  Live print frame
                </div>
                <h2 className="mt-1 font-display text-[1.35rem] leading-none tracking-[-0.05em] text-[color:var(--ink)]">
                  Current PDF composition
                </h2>
              </div>
              <div className="rounded-full border hairline bg-[color:var(--paper)]/78 px-3 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">
                {hasUnsavedChanges ? "Unsaved local edits" : hasManualOverrides ? "Saved PDF override" : "Packaged baseline"}
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-[color:var(--ink-soft)]">
              The iframe reflects your local edits immediately. Use <span className="font-semibold text-[color:var(--ink)]">Save PDF edits</span> to
              push them into the shared proposal preview route.
            </p>
            <div className="mt-4 rounded-[1rem] border hairline bg-white p-2">
              <iframe className="min-h-[1200px] w-full rounded-[0.8rem]" srcDoc={proposalHtml} title="Adjusted proposal preview" />
            </div>
          </SurfacePanel>
        </div>
      </div>
    </main>
  );
}
