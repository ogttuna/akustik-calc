"use client";

import {
  ArrowLeft,
  Bot,
  Check,
  ChevronDown,
  Download,
  FileText,
  Loader2,
  Printer,
  RefreshCcw,
  RotateCcw,
  Save,
  Send
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type ChangeEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { buildReportAssistantContext } from "../workbench/report-assistant-context";
import {
  applyValidatedReportAssistantPatch,
  validateReportAssistantPatch,
  type ReportAssistantPatchValidationResult
} from "../workbench/report-assistant-patch";
import { sendReportAssistantRequest } from "../workbench/report-assistant-request-client";
import {
  parseSimpleWorkbenchProposalDocument,
  type SimpleWorkbenchProposalDocument
} from "../workbench/simple-workbench-proposal";
import {
  downloadSimpleWorkbenchProposalDocx,
  downloadSimpleWorkbenchProposalPdf,
  getSimpleWorkbenchProposalExportLabel,
  type SimpleWorkbenchProposalExportFormat,
  type SimpleWorkbenchProposalExportStyle
} from "../workbench/simple-workbench-proposal-pdf";
import { buildSimpleWorkbenchProposalPreviewHtml } from "../workbench/simple-workbench-proposal-preview-html";
import {
  readSimpleWorkbenchProposalPreview,
  resetSimpleWorkbenchProposalPreviewCustomizations,
  storeSimpleWorkbenchProposalPreview,
  storeSimpleWorkbenchProposalPreviewCustomizations,
  updateSimpleWorkbenchProposalPreviewProjectContext,
  type LoadedSimpleWorkbenchProposalPreview,
  type SimpleWorkbenchProposalPreviewProjectContext
} from "../workbench/simple-workbench-proposal-preview-storage";

type ProposalPdfStyle = "branded" | "simple";

type AssistantPatchPayload = {
  error?: unknown;
  errors?: unknown;
  ok?: unknown;
  patch?: unknown;
  source?: unknown;
  validation?: unknown;
  warnings?: unknown;
};

type AssistantMessage = {
  detail: string;
  id: string;
  tone: "error" | "neutral" | "success" | "warning";
  title: string;
};

type ProjectReportSaveSource = "assistant" | "manual";

type ProjectReportSavePayload = {
  report?: {
    displayCode?: unknown;
    id?: unknown;
    updatedAtIso?: unknown;
  };
};

type LoadedProjectReportPayload = {
  document: SimpleWorkbenchProposalDocument;
  projectContext: SimpleWorkbenchProposalPreviewProjectContext;
};

type AssistantProjectSummary = {
  assemblyCount: number;
  clientName?: string;
  id: string;
  name: string;
  reportCount: number;
  updatedAtIso: string;
};

type AssistantProjectReportSummary = {
  assemblyId: string;
  currentRevisionId: string;
  displayCode?: string;
  id: string;
  name: string;
  revisionCount: number;
  status: "archived" | "draft" | "issued";
  updatedAtIso: string;
};

type AssistantProjectRevisionSummary = {
  assistantPatchSummary?: {
    operationCount: number;
    validationStatus: "valid" | "warning";
  };
  changeSummary?: string;
  createdAtIso: string;
  displayCode?: string;
  id: string;
  source: "assistant" | "generated" | "import" | "manual";
};

type AssistantProjectContextSummary = {
  project: AssistantProjectSummary;
  report?: AssistantProjectReportSummary;
  revision?: AssistantProjectRevisionSummary;
};

type AssistantProjectContextState =
  | { status: "error"; message: string }
  | { status: "loading" }
  | { status: "local" }
  | { status: "ready"; summary: AssistantProjectContextSummary };

const STYLE_OPTIONS: readonly { label: string; value: ProposalPdfStyle }[] = [
  { label: "Branded", value: "branded" },
  { label: "Simple", value: "simple" }
];

const DIRECT_TEXT_FIELDS = [
  { key: "projectName", label: "Project" },
  { key: "clientName", label: "Client" },
  { key: "proposalRecipient", label: "Issued to" },
  { key: "proposalAttention", label: "Attention" },
  { key: "proposalSubject", label: "Subject" },
  { key: "proposalReference", label: "Reference" },
  { key: "proposalRevision", label: "Revision" },
  { key: "proposalIssuePurpose", label: "Purpose" },
  { key: "proposalValidityNote", label: "Validity" }
] as const satisfies readonly { key: keyof SimpleWorkbenchProposalDocument; label: string }[];

const SERVER_PROJECT_REPORT_NAME_MAX_LENGTH = 160;

const SENDER_FIELDS = [
  { key: "consultantCompany", label: "Company" },
  { key: "consultantWordmarkLine", label: "Wordmark line" },
  { key: "preparedBy", label: "Prepared by" },
  { key: "approverTitle", label: "Title" },
  { key: "consultantEmail", label: "Email" },
  { key: "consultantPhone", label: "Phone" },
  { key: "consultantAddress", label: "Address" }
] as const satisfies readonly { key: keyof SimpleWorkbenchProposalDocument; label: string }[];

function formatSavedAtLabel(savedAtIso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(savedAtIso));
}

function getDocumentSignature(document: SimpleWorkbenchProposalDocument | null): string {
  if (!document) {
    return "no-document";
  }

  return JSON.stringify({
    coverage: document.coverageItems.map((item) => [item.label, item.value, item.status]),
    fields: [
      document.projectName,
      document.proposalRecipient,
      document.proposalReference,
      document.primaryMetricLabel,
      document.primaryMetricValue,
      document.executiveSummary
    ],
    metrics: document.metrics.map((metric) => [metric.label, metric.value]),
    notes: [document.assumptionItems.length, document.recommendationItems.length, document.warnings.length]
  });
}

function getStringField(document: SimpleWorkbenchProposalDocument, key: keyof SimpleWorkbenchProposalDocument): string {
  const value = document[key];
  return typeof value === "string" ? value : "";
}

function parseLineList(value: string): string[] {
  return value
    .split(/\r?\n/u)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

function formatBriefItems(items: SimpleWorkbenchProposalDocument["assumptionItems"]): string {
  return items.map((item) => item.detail).join("\n");
}

function buildBriefItems(value: string, label: string): SimpleWorkbenchProposalDocument["assumptionItems"] {
  return parseLineList(value).map((detail) => ({
    detail,
    label,
    tone: "neutral"
  }));
}

function getPayloadMessages(payload: unknown): string[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as { error?: unknown; errors?: unknown };
  if (Array.isArray(record.errors)) {
    return record.errors.filter((entry): entry is string => typeof entry === "string");
  }
  if (typeof record.error === "string") {
    return [record.error];
  }

  return [];
}

function getPayloadError(payload: unknown, fallback: string): string {
  const messages = getPayloadMessages(payload);
  return messages.length > 0 ? messages.join(" ") : fallback;
}

function parseProjectReportSavePayload(payload: unknown): { displayCode?: string; id: string; updatedAtIso: string } | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const report = (payload as ProjectReportSavePayload).report;
  if (!report || typeof report !== "object" || typeof report.id !== "string" || typeof report.updatedAtIso !== "string") {
    return null;
  }

  return {
    displayCode: typeof report.displayCode === "string" ? report.displayCode : undefined,
    id: report.id,
    updatedAtIso: report.updatedAtIso
  };
}

async function readProjectReportSavePayload(response: Response, fallback: string): Promise<unknown> {
  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(getPayloadError(payload, fallback));
  }

  return payload;
}

function hasProjectReportCreateContext(
  context: SimpleWorkbenchProposalPreviewProjectContext | undefined
): context is SimpleWorkbenchProposalPreviewProjectContext & {
  serverProjectAssemblyId: string;
  serverProjectId: string;
  sourceAssemblySnapshot: unknown;
  sourceMaterialSnapshot: {
    customMaterials: readonly unknown[];
    materialVisualOverrides: readonly unknown[];
  };
} {
  return Boolean(
    context?.serverProjectId &&
      context.serverProjectAssemblyId &&
      context.sourceAssemblySnapshot !== undefined &&
      context.sourceMaterialSnapshot
  );
}

function formatProjectReportLibraryName(document: SimpleWorkbenchProposalDocument): string {
  const sourceName = (document.proposalSubject || `${document.projectName} report`).trim() || "Project report";
  if (sourceName.length <= SERVER_PROJECT_REPORT_NAME_MAX_LENGTH) {
    return sourceName;
  }

  const truncatedName = sourceName.slice(0, SERVER_PROJECT_REPORT_NAME_MAX_LENGTH);
  const lastCharCode = truncatedName.charCodeAt(truncatedName.length - 1);

  return lastCharCode >= 0xd800 && lastCharCode <= 0xdbff ? truncatedName.slice(0, -1) : truncatedName;
}

function parseLoadedProjectReportPayload(payload: unknown, fallbackProjectId: string): LoadedProjectReportPayload | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const report = (payload as { report?: unknown }).report;
  if (!report || typeof report !== "object") {
    return null;
  }

  const reportRecord = report as Record<string, unknown>;
  const projectId = typeof reportRecord.projectId === "string" ? reportRecord.projectId : fallbackProjectId;
  const reportId = typeof reportRecord.id === "string" ? reportRecord.id : undefined;
  const assemblyId = typeof reportRecord.assemblyId === "string" ? reportRecord.assemblyId : undefined;
  const updatedAtIso = typeof reportRecord.updatedAtIso === "string" ? reportRecord.updatedAtIso : undefined;
  const sourceMaterialSnapshot = reportRecord.sourceMaterialSnapshot;
  const document = parseSimpleWorkbenchProposalDocument(reportRecord.reportDocument);

  if (
    !projectId ||
    !reportId ||
    !assemblyId ||
    !updatedAtIso ||
    !document ||
    !sourceMaterialSnapshot ||
    typeof sourceMaterialSnapshot !== "object" ||
    !Array.isArray((sourceMaterialSnapshot as { customMaterials?: unknown }).customMaterials) ||
    !Array.isArray((sourceMaterialSnapshot as { materialVisualOverrides?: unknown }).materialVisualOverrides) ||
    !Object.hasOwn(reportRecord, "sourceAssemblySnapshot")
  ) {
    return null;
  }

  return {
    document: {
      ...document,
      serverProjectId: projectId,
      serverProjectScenarioId: assemblyId
    },
    projectContext: {
      serverProjectAssemblyId: assemblyId,
      serverProjectId: projectId,
      serverProjectReportId: reportId,
      serverProjectReportUpdatedAtIso: updatedAtIso,
      sourceAssemblySnapshot: reportRecord.sourceAssemblySnapshot,
      sourceCalculationOutput: Object.hasOwn(reportRecord, "sourceCalculationOutput") ? reportRecord.sourceCalculationOutput : undefined,
      sourceMaterialSnapshot: {
        customMaterials: [...(sourceMaterialSnapshot as { customMaterials: unknown[] }).customMaterials],
        materialVisualOverrides: [...(sourceMaterialSnapshot as { materialVisualOverrides: unknown[] }).materialVisualOverrides]
      }
    }
  };
}

function getLatestAssistantPatchSummary(document: SimpleWorkbenchProposalDocument) {
  const assistantAdjustments = (document.reportAdjustments ?? []).filter((adjustment) => adjustment.source === "assistant");
  if (!assistantAdjustments.length) {
    return undefined;
  }

  const latestAdjustment = assistantAdjustments.reduce((latest, adjustment) =>
    adjustment.appliedAtIso > latest.appliedAtIso ? adjustment : latest
  );

  return {
    appliedAtIso: latestAdjustment.appliedAtIso,
    instruction: latestAdjustment.reason,
    operationCount: assistantAdjustments.length,
    validationStatus: "valid" as const
  };
}

function isPatchValidation(value: unknown): value is ReportAssistantPatchValidationResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as { operations?: unknown; status?: unknown };
  return (
    (record.status === "valid" || record.status === "requires_confirmation" || record.status === "rejected") &&
    Array.isArray(record.operations)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function postAssistantProjectRead(payload: Record<string, string | undefined>): Promise<unknown> {
  const response = await fetch("/api/report-assistant/project-read", {
    body: JSON.stringify(payload),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });

  return readProjectReportSavePayload(response, "DAC could not read the project context for the assistant.");
}

function getProjectReadResult(payload: unknown): unknown {
  return isRecord(payload) && payload.ok === true ? payload.result : undefined;
}

function parseAssistantProjectSummary(payload: unknown): AssistantProjectSummary | null {
  const result = getProjectReadResult(payload);
  const project = isRecord(result) ? result.project : undefined;
  if (
    !isRecord(project) ||
    typeof project.id !== "string" ||
    typeof project.name !== "string" ||
    typeof project.updatedAtIso !== "string" ||
    typeof project.assemblyCount !== "number" ||
    typeof project.reportCount !== "number"
  ) {
    return null;
  }

  return {
    assemblyCount: project.assemblyCount,
    clientName: typeof project.clientName === "string" ? project.clientName : undefined,
    id: project.id,
    name: project.name,
    reportCount: project.reportCount,
    updatedAtIso: project.updatedAtIso
  };
}

function parseAssistantProjectReportSummaries(payload: unknown): AssistantProjectReportSummary[] {
  const result = getProjectReadResult(payload);
  const reports = isRecord(result) && Array.isArray(result.reports) ? result.reports : [];

  return reports.flatMap((entry): AssistantProjectReportSummary[] => {
    if (
      !isRecord(entry) ||
      typeof entry.assemblyId !== "string" ||
      typeof entry.currentRevisionId !== "string" ||
      typeof entry.id !== "string" ||
      typeof entry.name !== "string" ||
      typeof entry.revisionCount !== "number" ||
      typeof entry.status !== "string" ||
      !["archived", "draft", "issued"].includes(entry.status) ||
      typeof entry.updatedAtIso !== "string"
    ) {
      return [];
    }

    return [
      {
        assemblyId: entry.assemblyId,
        currentRevisionId: entry.currentRevisionId,
        displayCode: typeof entry.displayCode === "string" ? entry.displayCode : undefined,
        id: entry.id,
        name: entry.name,
        revisionCount: entry.revisionCount,
        status: entry.status as AssistantProjectReportSummary["status"],
        updatedAtIso: entry.updatedAtIso
      }
    ];
  });
}

function parseAssistantProjectRevisionSummaries(payload: unknown): AssistantProjectRevisionSummary[] {
  const result = getProjectReadResult(payload);
  const revisions = isRecord(result) && Array.isArray(result.revisions) ? result.revisions : [];

  return revisions.flatMap((entry): AssistantProjectRevisionSummary[] => {
    if (
      !isRecord(entry) ||
      typeof entry.createdAtIso !== "string" ||
      typeof entry.id !== "string" ||
      typeof entry.source !== "string" ||
      !["assistant", "generated", "import", "manual"].includes(entry.source)
    ) {
      return [];
    }

    const assistantPatchSummary = isRecord(entry.assistantPatchSummary) &&
      typeof entry.assistantPatchSummary.operationCount === "number" &&
      typeof entry.assistantPatchSummary.validationStatus === "string" &&
      ["valid", "warning"].includes(entry.assistantPatchSummary.validationStatus)
      ? {
          operationCount: entry.assistantPatchSummary.operationCount,
          validationStatus: entry.assistantPatchSummary.validationStatus as "valid" | "warning"
        }
      : undefined;

    return [
      {
        assistantPatchSummary,
        changeSummary: typeof entry.changeSummary === "string" ? entry.changeSummary : undefined,
        createdAtIso: entry.createdAtIso,
        displayCode: typeof entry.displayCode === "string" ? entry.displayCode : undefined,
        id: entry.id,
        source: entry.source as AssistantProjectRevisionSummary["source"]
      }
    ];
  });
}

function AssistantProjectContextStrip(props: {
  hasUnsavedChanges: boolean;
  projectReportLinked: boolean;
  state: AssistantProjectContextState;
}) {
  const { hasUnsavedChanges, projectReportLinked, state } = props;
  const badgeLabel =
    state.status === "ready" && state.summary.report
      ? "Saved report context"
      : state.status === "ready"
        ? "Project context"
        : state.status === "loading"
          ? "Loading context"
          : state.status === "error"
            ? "Context unavailable"
            : "Current draft";

  return (
    <div className="report-assistant-context" data-status={state.status}>
      <div className="report-assistant-context-head">
        <strong>{badgeLabel}</strong>
        <span className={state.status === "error" ? "ui-badge ui-badge-warning" : "ui-badge"}>
          {projectReportLinked ? "Project saved" : hasUnsavedChanges ? "Unsaved draft" : "Draft"}
        </span>
      </div>

      {state.status === "ready" ? (
        <div className="report-assistant-context-grid">
          <div>
            <span>Project</span>
            <strong>{state.summary.project.name}</strong>
            {state.summary.project.clientName ? <small>{state.summary.project.clientName}</small> : null}
          </div>
          {state.summary.report ? (
            <div>
              <span>Report</span>
              <strong>{state.summary.report.displayCode ? `${state.summary.report.displayCode} - ${state.summary.report.name}` : state.summary.report.name}</strong>
              <small>
                {state.summary.report.revisionCount} revision{state.summary.report.revisionCount === 1 ? "" : "s"} · {state.summary.report.status}
              </small>
            </div>
          ) : (
            <div>
              <span>Report</span>
              <strong>Not saved yet</strong>
              <small>Save to project creates the first report record.</small>
            </div>
          )}
          {state.summary.revision ? (
            <div>
              <span>Revision</span>
              <strong>{state.summary.revision.displayCode ?? "Current revision"}</strong>
              <small>
                {state.summary.revision.source}
                {state.summary.revision.assistantPatchSummary
                  ? ` · ${state.summary.revision.assistantPatchSummary.operationCount} assistant operation${
                      state.summary.revision.assistantPatchSummary.operationCount === 1 ? "" : "s"
                    }`
                  : ""}
              </small>
            </div>
          ) : null}
        </div>
      ) : state.status === "loading" ? (
        <p>Loading saved project context for this assistant panel.</p>
      ) : state.status === "error" ? (
        <p>{state.message}</p>
      ) : (
        <p>The assistant is reviewing the current browser report draft.</p>
      )}

      <small className="report-assistant-context-note">
        Assistant edits change only this draft until you apply them and save the project report.
      </small>
    </div>
  );
}

function ReportTextField(props: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="report-field">
      <span>{props.label}</span>
      <input
        className="report-input"
        onChange={(event) => props.onChange(event.currentTarget.value)}
        value={props.value}
      />
    </label>
  );
}

function ReportTextArea(props: {
  label: string;
  onChange: (value: string) => void;
  rows?: number;
  value: string;
}) {
  return (
    <label className="report-field report-field-wide">
      <span>{props.label}</span>
      <textarea
        className="report-input report-textarea"
        onChange={(event) => props.onChange(event.currentTarget.value)}
        rows={props.rows ?? 4}
        value={props.value}
      />
    </label>
  );
}

function ReportCollapse(props: {
  children: ReactNode;
  defaultOpen?: boolean;
  meta?: string;
  title: string;
}) {
  return (
    <details className="report-collapse" open={props.defaultOpen}>
      <summary>
        <span>{props.title}</span>
        <span className="report-collapse-meta">
          {props.meta ? <small>{props.meta}</small> : null}
          <ChevronDown className="report-collapse-icon h-4 w-4" />
        </span>
      </summary>
      <div className="report-collapse-body">{props.children}</div>
    </details>
  );
}

export function ReportEditor() {
  const searchParams = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const loadedProjectReportKeyRef = useRef<string | null>(null);
  const [loadedPreview, setLoadedPreview] = useState<LoadedSimpleWorkbenchProposalPreview | null>(null);
  const [document, setDocument] = useState<SimpleWorkbenchProposalDocument | null>(null);
  const [frameReady, setFrameReady] = useState(false);
  const [activePdfStyle, setActivePdfStyle] = useState<ProposalPdfStyle>(
    searchParams.get("style") === "simple" ? "simple" : "branded"
  );
  const projectIdParam = searchParams.get("projectId")?.trim() ?? "";
  const reportIdParam = searchParams.get("reportId")?.trim() ?? "";
  const [isDownloading, setIsDownloading] = useState(false);
  const [assistantInstruction, setAssistantInstruction] = useState("");
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([]);
  const [assistantValidation, setAssistantValidation] = useState<ReportAssistantPatchValidationResult | null>(null);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [isProjectSaving, setIsProjectSaving] = useState(false);
  const projectSaveInFlightRef = useRef(false);
  const [projectContext, setProjectContext] = useState<SimpleWorkbenchProposalPreviewProjectContext | undefined>();
  const [assistantProjectContext, setAssistantProjectContext] = useState<AssistantProjectContextState>({ status: "local" });
  const [projectSaveSource, setProjectSaveSource] = useState<ProjectReportSaveSource>("manual");

  const applyLoadedPreview = useCallback((nextPreview: LoadedSimpleWorkbenchProposalPreview | null) => {
    setLoadedPreview(nextPreview);
    setDocument(nextPreview?.document ?? null);
    setProjectContext(nextPreview?.projectContext);
    setAssistantValidation(null);
    setFrameReady(false);
    setProjectSaveSource("manual");
  }, []);

  const reloadPreview = useCallback(() => {
    const nextPreview = readSimpleWorkbenchProposalPreview();
    applyLoadedPreview(nextPreview);
    return nextPreview;
  }, [applyLoadedPreview]);

  const loadProjectReportFromUrl = useCallback(async (projectId: string, reportId: string) => {
    const key = `${projectId}:${reportId}`;
    if (loadedProjectReportKeyRef.current === key) {
      return;
    }

    loadedProjectReportKeyRef.current = key;

    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}/reports/${encodeURIComponent(reportId)}`, {
        method: "GET"
      });
      const payload = await readProjectReportSavePayload(response, "DAC could not open the selected project report.");
      const loadedReport = parseLoadedProjectReportPayload(payload, projectId);

      if (!loadedReport) {
        throw new Error("Selected project report does not contain a restorable proposal document.");
      }

      storeSimpleWorkbenchProposalPreview(loadedReport.document, {
        projectContext: loadedReport.projectContext
      });
      applyLoadedPreview(readSimpleWorkbenchProposalPreview());
    } catch (error) {
      applyLoadedPreview(null);
      toast.error("Project report open failed", {
        description: error instanceof Error ? error.message : "Saved report could not be loaded."
      });
    }
  }, [applyLoadedPreview]);

  useEffect(() => {
    const nextPreview = readSimpleWorkbenchProposalPreview();
    const urlReportMatchesPreview = reportIdParam && nextPreview?.projectContext?.serverProjectReportId === reportIdParam;

    if (nextPreview && (!reportIdParam || urlReportMatchesPreview)) {
      applyLoadedPreview(nextPreview);
      return;
    }

    if (projectIdParam && reportIdParam) {
      void loadProjectReportFromUrl(projectIdParam, reportIdParam);
      return;
    }

    applyLoadedPreview(nextPreview);
  }, [applyLoadedPreview, loadProjectReportFromUrl, projectIdParam, reportIdParam]);

  const baseSignature = useMemo(
    () => getDocumentSignature(loadedPreview?.document ?? null),
    [loadedPreview?.document]
  );
  const draftSignature = useMemo(() => getDocumentSignature(document), [document]);
  const hasUnsavedChanges = document !== null && loadedPreview !== null && draftSignature !== baseSignature;
  const canSaveProjectReport = hasProjectReportCreateContext(projectContext);
  const projectReportLinked = Boolean(projectContext?.serverProjectReportId && projectContext.serverProjectReportUpdatedAtIso);

  const proposalHtml = useMemo(
    () => (document ? buildSimpleWorkbenchProposalPreviewHtml(document, activePdfStyle) : ""),
    [activePdfStyle, document]
  );

  useEffect(() => {
    setFrameReady(false);
  }, [proposalHtml]);

  useEffect(() => {
    let active = true;

    async function loadAssistantProjectContext(currentProjectContext: SimpleWorkbenchProposalPreviewProjectContext) {
      const projectId = currentProjectContext.serverProjectId;
      if (!projectId) {
        setAssistantProjectContext({ status: "local" });
        return;
      }

      setAssistantProjectContext({ status: "loading" });
      try {
        const projectPayload = await postAssistantProjectRead({
          action: "read_project_summary",
          projectId
        });
        const project = parseAssistantProjectSummary(projectPayload);
        if (!project) {
          throw new Error("Project summary was not available.");
        }

        if (!currentProjectContext.serverProjectReportId) {
          if (active) {
            setAssistantProjectContext({
              status: "ready",
              summary: {
                project
              }
            });
          }
          return;
        }

        const [reportsPayload, revisionsPayload] = await Promise.all([
          postAssistantProjectRead({
            action: "list_project_reports",
            projectId
          }),
          postAssistantProjectRead({
            action: "list_project_report_revisions",
            projectId,
            reportId: currentProjectContext.serverProjectReportId
          })
        ]);
        const reports = parseAssistantProjectReportSummaries(reportsPayload);
        const report = reports.find((entry) => entry.id === currentProjectContext.serverProjectReportId);
        if (!report) {
          throw new Error("Saved report summary was not available.");
        }

        const revisions = parseAssistantProjectRevisionSummaries(revisionsPayload);
        const revision = revisions.find((entry) => entry.id === report.currentRevisionId);

        if (active) {
          setAssistantProjectContext({
            status: "ready",
            summary: {
              project,
              report,
              revision
            }
          });
        }
      } catch (error) {
        if (active) {
          setAssistantProjectContext({
            message: error instanceof Error ? error.message : "Project context could not be loaded.",
            status: "error"
          });
        }
      }
    }

    if (!projectContext?.serverProjectId) {
      setAssistantProjectContext({ status: "local" });
      return () => {
        active = false;
      };
    }

    void loadAssistantProjectContext(projectContext);

    return () => {
      active = false;
    };
  }, [projectContext?.serverProjectId, projectContext?.serverProjectReportId, projectContext?.serverProjectReportUpdatedAtIso]);

  const assistantContext = useMemo(
    () =>
      document
        ? buildReportAssistantContext({
            baseDocument: loadedPreview?.baseDocument,
            document
          })
        : null,
    [document, loadedPreview?.baseDocument]
  );

  function updateDocumentField<K extends keyof SimpleWorkbenchProposalDocument>(
    key: K,
    value: SimpleWorkbenchProposalDocument[K]
  ) {
    setDocument((current) => (current ? { ...current, [key]: value } : current));
    setAssistantValidation(null);
    setProjectSaveSource("manual");
  }

  function updateMetric(index: number, patch: Partial<SimpleWorkbenchProposalDocument["metrics"][number]>) {
    setDocument((current) =>
      current
        ? {
            ...current,
            metrics: current.metrics.map((metric, metricIndex) => (metricIndex === index ? { ...metric, ...patch } : metric))
          }
        : current
    );
    setAssistantValidation(null);
    setProjectSaveSource("manual");
  }

  function updateCoverage(index: number, patch: Partial<SimpleWorkbenchProposalDocument["coverageItems"][number]>) {
    setDocument((current) =>
      current
        ? {
            ...current,
            coverageItems: current.coverageItems.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item))
          }
        : current
    );
    setAssistantValidation(null);
    setProjectSaveSource("manual");
  }

  function handleStyleChange(event: ChangeEvent<HTMLInputElement>) {
    setActivePdfStyle(event.currentTarget.value === "simple" ? "simple" : "branded");
  }

  function handleSaveEdits() {
    if (!document) {
      toast.error("No report draft");
      return;
    }

    const customizedAtIso = storeSimpleWorkbenchProposalPreviewCustomizations(document);
    const nextPreview = readSimpleWorkbenchProposalPreview();
    setLoadedPreview(nextPreview);
    setDocument(nextPreview?.document ?? document);
    toast.success("Report edits saved", {
      description: customizedAtIso ? formatSavedAtLabel(customizedAtIso) : "Local report draft updated."
    });
  }

  async function handleSaveReportToProject() {
    if (!document) {
      toast.error("No report draft");
      return;
    }
    if (!canSaveProjectReport) {
      toast.error("Project report target unavailable", {
        description: projectContext?.serverProjectId
          ? "Save and select a project combination before storing the report."
          : "Open this report from a selected project in workbench-v2."
      });
      return;
    }
    if (projectSaveInFlightRef.current) {
      return;
    }

    const documentForProject: SimpleWorkbenchProposalDocument = {
      ...document,
      serverProjectId: projectContext.serverProjectId,
      serverProjectScenarioId: projectContext.serverProjectAssemblyId
    };
    const encodedProjectId = encodeURIComponent(projectContext.serverProjectId);
    const revisionSource: ProjectReportSaveSource =
      projectSaveSource === "assistant" || getLatestAssistantPatchSummary(documentForProject) ? projectSaveSource : "manual";

    projectSaveInFlightRef.current = true;
    setIsProjectSaving(true);
    try {
      const response = projectContext.serverProjectReportId
        ? await fetch(
            `/api/projects/${encodedProjectId}/reports/${encodeURIComponent(projectContext.serverProjectReportId)}/revisions`,
            {
              body: JSON.stringify({
                assistantPatchSummary:
                  revisionSource === "assistant" ? getLatestAssistantPatchSummary(documentForProject) : undefined,
                changeSummary:
                  revisionSource === "assistant"
                    ? "Assistant-adjusted report editor draft."
                    : "Manual report editor draft.",
                document: documentForProject,
                expectedReportUpdatedAtIso: projectContext.serverProjectReportUpdatedAtIso,
                source: revisionSource
              }),
              headers: {
                "content-type": "application/json"
              },
              method: "POST"
            }
          )
        : await fetch(`/api/projects/${encodedProjectId}/reports`, {
            body: JSON.stringify({
              assemblyId: projectContext.serverProjectAssemblyId,
              name: formatProjectReportLibraryName(documentForProject),
              reportDocument: documentForProject,
              sourceAssemblySnapshot: projectContext.sourceAssemblySnapshot,
              sourceCalculationOutput: projectContext.sourceCalculationOutput,
              sourceMaterialSnapshot: projectContext.sourceMaterialSnapshot
            }),
            headers: {
              "content-type": "application/json"
            },
            method: "POST"
          });

      const payload = await readProjectReportSavePayload(response, "DAC could not save the report to the project.");
      const savedReport = parseProjectReportSavePayload(payload);
      if (!savedReport) {
        throw new Error("DAC saved the report but the server response was incomplete.");
      }

      const nextProjectContext: SimpleWorkbenchProposalPreviewProjectContext = {
        ...projectContext,
        serverProjectReportId: savedReport.id,
        serverProjectReportUpdatedAtIso: savedReport.updatedAtIso
      };
      if (hasUnsavedChanges) {
        storeSimpleWorkbenchProposalPreviewCustomizations(documentForProject, {
          projectContext: nextProjectContext
        });
      } else {
        updateSimpleWorkbenchProposalPreviewProjectContext(nextProjectContext);
      }

      const nextPreview = readSimpleWorkbenchProposalPreview();
      setLoadedPreview(nextPreview);
      setProjectContext(nextPreview?.projectContext ?? nextProjectContext);
      setDocument(nextPreview?.document ?? documentForProject);
      setProjectSaveSource("manual");
      toast.success(projectContext.serverProjectReportId ? "Project report revision saved" : "Project report saved", {
        description: `${savedReport.displayCode ?? "Report"} updated ${formatSavedAtLabel(savedReport.updatedAtIso)}.`
      });
    } catch (error) {
      toast.error("Project report save failed", {
        description: error instanceof Error ? error.message : "Report could not be stored in the project."
      });
    } finally {
      projectSaveInFlightRef.current = false;
      setIsProjectSaving(false);
    }
  }

  function handleResetEdits() {
    resetSimpleWorkbenchProposalPreviewCustomizations();
    reloadPreview();
    toast.success("Report edits reset", {
      description: "The packaged baseline report is active again."
    });
  }

  function handlePrint() {
    const frameWindow = iframeRef.current?.contentWindow;
    if (!frameWindow || !document) {
      toast.error("Preview not ready");
      return;
    }

    frameWindow.focus();
    frameWindow.print();
  }

  async function handleDownloadExport(
    style: SimpleWorkbenchProposalExportStyle,
    format: SimpleWorkbenchProposalExportFormat
  ) {
    if (!document) {
      toast.error("No report draft");
      return;
    }

    setIsDownloading(true);
    try {
      if (format === "docx") {
        await downloadSimpleWorkbenchProposalDocx(document, { style });
      } else {
        await downloadSimpleWorkbenchProposalPdf(document, { style });
      }
      toast.success(`${getSimpleWorkbenchProposalExportLabel({ format, style })} downloaded`);
    } catch (error) {
      toast.error(`${getSimpleWorkbenchProposalExportLabel({ format, style })} failed`, {
        description: error instanceof Error ? error.message : "Export failed."
      });
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleAssistantRequest() {
    if (!document || !assistantContext) {
      toast.error("No report draft");
      return;
    }
    if (assistantInstruction.trim().length === 0) {
      toast.error("Assistant instruction is empty");
      return;
    }

    setIsAssistantLoading(true);
    setAssistantValidation(null);
    const instruction = assistantInstruction.trim();

    const result = await sendReportAssistantRequest<AssistantPatchPayload>({
      body: {
        context: assistantContext,
        document,
        instruction
      },
      documentSignature: assistantContext.assistantContextSignature,
      kind: "patch_proposal",
      url: "/api/report-assistant/patch"
    });

    setIsAssistantLoading(false);

    if (!result.ok) {
      const messages = result.errors.length > 0 ? result.errors : getPayloadMessages(result.payload);
      setAssistantMessages((current) => [
        {
          detail: messages.join(" ") || "Assistant request failed.",
          id: `assistant-error-${Date.now()}`,
          title: "Assistant request failed",
          tone: "error"
        },
        ...current
      ]);
      return;
    }

    const validation = isPatchValidation(result.payload?.validation)
      ? result.payload.validation
      : validateReportAssistantPatch({
          context: assistantContext,
          document,
          patch: result.payload?.patch
        });

    if (validation.status === "rejected") {
      setAssistantMessages((current) => [
        {
          detail: validation.errors.join(" ") || "The proposed patch was rejected.",
          id: `assistant-rejected-${Date.now()}`,
          title: "Patch rejected",
          tone: "warning"
        },
        ...current
      ]);
      return;
    }

    setAssistantValidation(validation);
    setAssistantMessages((current) => [
      {
        detail: validation.patchSummary || `${validation.operations.length} operation proposed.`,
        id: `assistant-valid-${Date.now()}`,
        title: validation.requiresUserConfirmation ? "Review required" : "Patch ready",
        tone: validation.requiresUserConfirmation ? "warning" : "success"
      },
      ...current
    ]);
  }

  function handleApplyAssistantPatch() {
    if (!document || !assistantValidation) {
      return;
    }

    try {
      const nextDocument = applyValidatedReportAssistantPatch(document, assistantValidation, {
        confirmed: true,
        scope: "export_only",
        source: "assistant"
      });
      setDocument(nextDocument);
      setAssistantValidation(null);
      setProjectSaveSource("assistant");
      toast.success("Assistant patch applied to draft", {
        description: "Save report edits when the draft is ready."
      });
      setAssistantMessages((current) => [
        {
          detail: `${assistantValidation.operations.length} operation${assistantValidation.operations.length === 1 ? "" : "s"} applied to the draft.`,
          id: `assistant-applied-${Date.now()}`,
          title: "Patch applied",
          tone: "success"
        },
        ...current
      ]);
    } catch (error) {
      toast.error("Assistant patch failed", {
        description: error instanceof Error ? error.message : "Patch could not be applied."
      });
    }
  }

  function handleRejectAssistantPatch() {
    if (!assistantValidation) {
      return;
    }

    const rejectedCount = assistantValidation.operations.length;
    setAssistantValidation(null);
    setAssistantMessages((current) => [
      {
        detail: `${rejectedCount} proposed operation${rejectedCount === 1 ? "" : "s"} left unapplied.`,
        id: `assistant-rejected-local-${Date.now()}`,
        title: "Patch rejected",
        tone: "neutral"
      },
      ...current
    ]);
  }

  if (!document) {
    return (
      <main className="report-page">
        <div className="report-shell">
          <section className="report-empty">
            <FileText className="h-8 w-8" />
            <h1>No packaged report</h1>
            <p>Run a calculator result and open the report handoff before editing.</p>
            <Link className="focus-ring ui-button ui-button-primary" href="/workbench-v2">
              Open calculator
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const savedLabel = loadedPreview
    ? loadedPreview.hasCustomizations && loadedPreview.customizedAtIso
      ? `Saved edits ${formatSavedAtLabel(loadedPreview.customizedAtIso)}`
      : `Packaged ${formatSavedAtLabel(loadedPreview.savedAtIso)}`
    : "Local report draft";
  const projectSaveLabel = !projectContext?.serverProjectId
    ? "Local only"
    : projectReportLinked
      ? "Project report linked"
      : canSaveProjectReport
        ? "Project report ready"
        : "Project selected";

  return (
    <main className="report-page">
      <div className="report-shell">
        <header className="report-header">
          <div>
            <p className="ui-eyebrow">Report editor</p>
            <h1>{document.projectName}</h1>
            <div className="report-statusline">
              <span className="ui-badge">{savedLabel}</span>
              <span className="ui-badge">{hasUnsavedChanges ? "Unsaved draft" : "Draft saved"}</span>
              <span className="ui-badge">{frameReady ? "Preview ready" : "Preview loading"}</span>
              <span className={canSaveProjectReport ? "ui-badge ui-badge-success" : "ui-badge"}>{projectSaveLabel}</span>
            </div>
          </div>
          <div className="report-actions">
            <Link className="focus-ring ui-button" href="/workbench-v2">
              <ArrowLeft className="h-4 w-4" />
              Calculator
            </Link>
            <button className="focus-ring ui-icon-button" onClick={reloadPreview} title="Reload preview" type="button">
              <RefreshCcw className="h-4 w-4" />
            </button>
            <button
              className="focus-ring ui-icon-button"
              disabled={!loadedPreview?.hasCustomizations && !hasUnsavedChanges}
              onClick={handleResetEdits}
              title="Reset edits"
              type="button"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button className="focus-ring ui-button ui-button-primary" disabled={!hasUnsavedChanges} onClick={handleSaveEdits} type="button">
              <Save className="h-4 w-4" />
              Save edits
            </button>
            <button
              className="focus-ring ui-button ui-button-primary"
              disabled={!canSaveProjectReport || isProjectSaving}
              onClick={() => void handleSaveReportToProject()}
              title={
                canSaveProjectReport
                  ? projectReportLinked
                    ? "Save a new project report revision"
                    : "Save this report under the selected project"
                  : "Save and select a project combination in workbench-v2 first"
              }
              type="button"
            >
              <Save className="h-4 w-4" />
              {isProjectSaving ? "Saving project..." : projectReportLinked ? "Save revision" : "Save to project"}
            </button>
          </div>
        </header>

        <div className="report-grid">
          <section className="report-preview-panel">
            <div className="report-preview-toolbar">
              <div className="report-style-switch" role="radiogroup" aria-label="Report style">
                {STYLE_OPTIONS.map((option) => (
                  <label key={option.value}>
                    <input
                      checked={activePdfStyle === option.value}
                      name="report-style"
                      onChange={handleStyleChange}
                      type="radio"
                      value={option.value}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              <div className="report-export-actions">
                <button
                  className="focus-ring ui-button"
                  disabled={isDownloading}
                  onClick={() => void handleDownloadExport(activePdfStyle, "pdf")}
                  type="button"
                >
                  <Download className="h-4 w-4" />
                  PDF
                </button>
                <button
                  className="focus-ring ui-button"
                  disabled={isDownloading}
                  onClick={() => void handleDownloadExport(activePdfStyle, "docx")}
                  type="button"
                >
                  <Download className="h-4 w-4" />
                  DOCX
                </button>
                <button className="focus-ring ui-button" disabled={!frameReady} onClick={handlePrint} type="button">
                  <Printer className="h-4 w-4" />
                  Print
                </button>
              </div>
            </div>
            <iframe
              className="report-preview-frame"
              onLoad={() => setFrameReady(true)}
              ref={iframeRef}
              srcDoc={proposalHtml}
              title="Proposal preview"
            />
          </section>

          <aside className="report-side">
            <section className="report-editor-panel">
              <div className="report-panel-head">
                <FileText className="h-4 w-4" />
                <h2>Manual fields</h2>
              </div>

              <ReportCollapse defaultOpen meta="Issue metadata" title="Header">
                <div className="report-field-grid">
                  {DIRECT_TEXT_FIELDS.map((field) => (
                    <ReportTextField
                      key={field.key}
                      label={field.label}
                      onChange={(value) => updateDocumentField(field.key, value)}
                      value={getStringField(document, field.key)}
                    />
                  ))}
                </div>
              </ReportCollapse>

              <ReportCollapse meta={`${document.metrics.length} rows`} title="Results">
                <div className="report-field-grid">
                  <ReportTextField
                    label="Primary label"
                    onChange={(value) => updateDocumentField("primaryMetricLabel", value)}
                    value={document.primaryMetricLabel}
                  />
                  <ReportTextField
                    label="Primary value"
                    onChange={(value) => updateDocumentField("primaryMetricValue", value)}
                    value={document.primaryMetricValue}
                  />
                  <ReportTextArea
                    label="Executive summary"
                    onChange={(value) => updateDocumentField("executiveSummary", value)}
                    rows={5}
                    value={document.executiveSummary}
                  />
                  <ReportTextArea
                    label="Validation detail"
                    onChange={(value) => updateDocumentField("validationDetail", value)}
                    rows={3}
                    value={document.validationDetail}
                  />
                  {document.metrics.slice(0, 8).map((metric, index) => (
                    <div className="report-pair" key={`${metric.label}-${index}`}>
                      <ReportTextField label="Metric" onChange={(value) => updateMetric(index, { label: value })} value={metric.label} />
                      <ReportTextField label="Value" onChange={(value) => updateMetric(index, { value })} value={metric.value} />
                    </div>
                  ))}
                </div>
              </ReportCollapse>

              <ReportCollapse meta={`${document.coverageItems.length} outputs`} title="Output rows">
                <div className="report-field-grid">
                  {document.coverageItems.slice(0, 10).map((item, index) => (
                    <div className="report-pair" key={`${item.label}-${index}`}>
                      <ReportTextField label="Output" onChange={(value) => updateCoverage(index, { label: value })} value={item.label} />
                      <ReportTextField label="Value" onChange={(value) => updateCoverage(index, { value })} value={item.value} />
                    </div>
                  ))}
                </div>
              </ReportCollapse>

              <ReportCollapse meta="Consultant lines" title="Sender">
                <div className="report-field-grid">
                  {SENDER_FIELDS.map((field) => (
                    <ReportTextField
                      key={field.key}
                      label={field.label}
                      onChange={(value) => updateDocumentField(field.key, value)}
                      value={getStringField(document, field.key)}
                    />
                  ))}
                </div>
              </ReportCollapse>

              <ReportCollapse meta="One row per line" title="Notes">
                <div className="report-field-grid">
                  <ReportTextArea
                    label="Assumptions"
                    onChange={(value) => updateDocumentField("assumptionItems", buildBriefItems(value, "Assumption"))}
                    value={formatBriefItems(document.assumptionItems)}
                  />
                  <ReportTextArea
                    label="Recommendations"
                    onChange={(value) => updateDocumentField("recommendationItems", buildBriefItems(value, "Recommendation"))}
                    value={formatBriefItems(document.recommendationItems)}
                  />
                  <ReportTextArea
                    label="Warnings"
                    onChange={(value) => updateDocumentField("warnings", parseLineList(value))}
                    value={document.warnings.join("\n")}
                  />
                </div>
              </ReportCollapse>
            </section>

            <section className="report-assistant-panel">
              <div className="report-panel-head">
                <Bot className="h-4 w-4" />
                <h2>Assistant</h2>
                <span className={isAssistantLoading ? "ui-badge ui-badge-warning" : assistantValidation ? "ui-badge ui-badge-accent" : "ui-badge"}>
                  {isAssistantLoading ? "Working" : assistantValidation ? "Review" : "Ready"}
                </span>
              </div>
              <AssistantProjectContextStrip
                hasUnsavedChanges={hasUnsavedChanges}
                projectReportLinked={projectReportLinked}
                state={assistantProjectContext}
              />
              <div className="report-assistant-body">
                <ReportTextArea
                  label="Instruction"
                  onChange={setAssistantInstruction}
                  rows={4}
                  value={assistantInstruction}
                />
                <button
                  className="focus-ring ui-button ui-button-primary report-wide-action"
                  disabled={isAssistantLoading}
                  onClick={() => void handleAssistantRequest()}
                  type="button"
                >
                  {isAssistantLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Propose edit
                </button>

                {assistantValidation ? (
                  <div className="report-assistant-proposal">
                    <div>
                      <strong>{assistantValidation.patchSummary || "Patch proposal"}</strong>
                      <small>{assistantValidation.operations.length} operation{assistantValidation.operations.length === 1 ? "" : "s"}</small>
                    </div>
                    <ul>
                      {assistantValidation.operations.map((operation, index) => (
                        <li key={`${operation.type}-${index}`}>
                          <span>{operation.type.replace(/_/gu, " ")}</span>
                          <small>
                            {operation.type === "metric_value"
                              ? `${operation.label}: ${operation.beforeValue} -> ${operation.afterValue}`
                              : operation.type === "report_note"
                                ? operation.text
                                : `${operation.beforeValue} -> ${operation.afterValue}`}
                          </small>
                        </li>
                      ))}
                    </ul>
                    <button className="focus-ring ui-button ui-button-primary report-wide-action" onClick={handleApplyAssistantPatch} type="button">
                      <Check className="h-4 w-4" />
                      Apply to draft
                    </button>
                    <button className="focus-ring ui-button report-wide-action" onClick={handleRejectAssistantPatch} type="button">
                      Reject proposal
                    </button>
                  </div>
                ) : null}

                <div className="report-assistant-thread" aria-live="polite">
                  <div className="report-assistant-thread-head">
                    <span>Responses</span>
                    <small>{assistantMessages.length > 0 ? `${assistantMessages.length} logged` : "No response yet"}</small>
                  </div>
                  <div className="report-assistant-log">
                    {assistantMessages.length === 0 ? (
                      <div className="report-assistant-message" data-tone="neutral">
                        <strong>Ready for a focused edit</strong>
                        <span>Assistant results and apply/reject status appear here.</span>
                      </div>
                    ) : (
                      assistantMessages.slice(0, 4).map((message) => (
                        <div className="report-assistant-message" data-tone={message.tone} key={message.id}>
                          <strong>{message.title}</strong>
                          <span>{message.detail}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
