import { randomUUID } from "node:crypto";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { RequestedOutputId } from "@dynecho/shared";

import type {
  ReportAssistantContext,
  ReportAssistantTraceSummary
} from "./report-assistant-context";
import type { SimpleWorkbenchAssistantTraceSnapshot } from "./simple-workbench-assistant-trace-snapshot";

export const REPORT_ASSISTANT_FINDINGS_RELATIVE_PATH =
  ".dynecho/calculator-review-queue/report-assistant-findings.jsonl";

export type PlausibilitySourceSummary = {
  accessedAtIso?: string;
  note?: string;
  title: string;
  url: string;
};

export type ReportAssistantFindingVerdict = "insufficient_context" | "likely_wrong" | "suspicious";
export type ReportAssistantFindingSeverity = "high" | "low" | "medium";

export type ReportAssistantFindingRecord = {
  assistantTraceSnapshot?: SimpleWorkbenchAssistantTraceSnapshot;
  createdAtIso: string;
  engineDisplayValue?: string;
  id: string;
  layersSummary: readonly string[];
  metric: string;
  metricId: string;
  outputId?: RequestedOutputId;
  projectId?: string;
  reason: string;
  reportDisplayValue: string;
  scenarioId?: string;
  severity: ReportAssistantFindingSeverity;
  source: "report_assistant";
  sources: readonly PlausibilitySourceSummary[];
  traceSummary: ReportAssistantTraceSummary;
  userInstruction?: string;
  verdict: ReportAssistantFindingVerdict;
};

export type ReportAssistantFindingDraft = {
  metricId: string;
  reason: string;
  severity: ReportAssistantFindingSeverity;
  sources?: readonly PlausibilitySourceSummary[];
  userInstruction?: string;
  verdict: ReportAssistantFindingVerdict;
};

export type ReportAssistantFindingPreparationResult =
  | {
      errors: readonly string[];
      ok: false;
    }
  | {
      ok: true;
      record: ReportAssistantFindingRecord;
    };

const FINDING_VERDICTS = new Set<string>(["insufficient_context", "likely_wrong", "suspicious"]);
const FINDING_SEVERITIES = new Set<string>(["high", "low", "medium"]);

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function normalizeSource(value: unknown): PlausibilitySourceSummary | null {
  if (!isObjectRecord(value) || typeof value.title !== "string" || typeof value.url !== "string") {
    return null;
  }

  const title = value.title.trim();
  const url = value.url.trim();

  if (title.length === 0 || !/^https?:\/\//iu.test(url)) {
    return null;
  }

  return {
    accessedAtIso: normalizeOptionalString(value.accessedAtIso),
    note: normalizeOptionalString(value.note),
    title,
    url
  };
}

export function parseReportAssistantFindingDraft(value: unknown): ReportAssistantFindingDraft | null {
  if (!isObjectRecord(value) || typeof value.metricId !== "string" || typeof value.reason !== "string") {
    return null;
  }

  if (!FINDING_VERDICTS.has(String(value.verdict)) || !FINDING_SEVERITIES.has(String(value.severity))) {
    return null;
  }

  const sources = Array.isArray(value.sources)
    ? value.sources.map((entry) => normalizeSource(entry)).filter((entry): entry is PlausibilitySourceSummary => entry !== null)
    : [];

  return {
    metricId: value.metricId,
    reason: value.reason,
    severity: value.severity as ReportAssistantFindingSeverity,
    sources,
    userInstruction: normalizeOptionalString(value.userInstruction),
    verdict: value.verdict as ReportAssistantFindingVerdict
  };
}

export function prepareReportAssistantFindingRecord(input: {
  context: ReportAssistantContext;
  draft: ReportAssistantFindingDraft;
  idFactory?: () => string;
  now?: () => Date;
}): ReportAssistantFindingPreparationResult {
  const reason = input.draft.reason.trim();
  if (reason.length === 0) {
    return {
      errors: ["Review finding reason cannot be empty."],
      ok: false
    };
  }

  const metric = input.context.metrics.find((entry) => entry.id === input.draft.metricId);
  if (!metric) {
    return {
      errors: [`Metric id ${input.draft.metricId} does not exist in the current report context.`],
      ok: false
    };
  }

  const nowIso = (input.now ?? (() => new Date()))().toISOString();

  return {
    ok: true,
    record: {
      assistantTraceSnapshot: input.context.assistantTraceSnapshot,
      createdAtIso: nowIso,
      engineDisplayValue: metric.engineDisplayValue,
      id: input.idFactory?.() ?? randomUUID(),
      layersSummary: input.context.layersSummary,
      metric: metric.metric,
      metricId: metric.id,
      outputId: metric.outputId,
      projectId: input.context.projectId,
      reason,
      reportDisplayValue: metric.reportDisplayValue,
      scenarioId: input.context.scenarioId,
      severity: input.draft.severity,
      source: "report_assistant",
      sources: input.draft.sources ?? [],
      traceSummary: input.context.traceSummary,
      userInstruction: input.draft.userInstruction,
      verdict: input.draft.verdict
    }
  };
}

export function getReportAssistantFindingQueuePath(env: NodeJS.ProcessEnv = process.env): string {
  const configuredPath = env.DYNECHO_REPORT_ASSISTANT_FINDINGS_PATH?.trim();
  return configuredPath && configuredPath.length > 0
    ? configuredPath
    : path.join(process.cwd(), REPORT_ASSISTANT_FINDINGS_RELATIVE_PATH);
}

export async function appendReportAssistantFindingRecord(
  record: ReportAssistantFindingRecord,
  options?: {
    queuePath?: string;
  }
): Promise<void> {
  const queuePath = options?.queuePath ?? getReportAssistantFindingQueuePath();
  await mkdir(path.dirname(queuePath), {
    recursive: true
  });
  await appendFile(queuePath, `${JSON.stringify(record)}\n`, "utf8");
}

export async function readReportAssistantFindingRecords(options?: {
  queuePath?: string;
}): Promise<ReportAssistantFindingRecord[]> {
  const queuePath = options?.queuePath ?? getReportAssistantFindingQueuePath();

  let raw: string;
  try {
    raw = await readFile(queuePath, "utf8");
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  return raw
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => JSON.parse(line) as ReportAssistantFindingRecord);
}
