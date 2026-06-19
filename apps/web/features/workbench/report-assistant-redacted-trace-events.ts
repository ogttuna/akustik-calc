import {
  validateReportAssistantResultEnvelope,
  type ReportAssistantResultEnvelope,
  type ReportAssistantResultRouteStatus,
  type ReportAssistantResultSourceTrace
} from "./report-assistant-result-contract";
import type {
  ReportAssistantCapabilityRendererKind,
  ReportAssistantCapabilityResultKind
} from "./report-assistant-capabilities";

export type ReportAssistantRedactedTraceEventSchemaVersion = "report_assistant_redacted_trace_event_v1";

export type ReportAssistantTraceEventStage =
  | "confirmation"
  | "result_envelope"
  | "route_adapter";

export type ReportAssistantTraceConfirmationStatus =
  | "confirmed"
  | "not_required"
  | "rejected"
  | "required_pending"
  | "stale";

export type ReportAssistantTraceValidationStatus = "failed" | "passed";
export type ReportAssistantTraceRedactionStatus = "redacted";

export type ReportAssistantRedactedSourceTraceRef = {
  hasDetail: boolean;
  kind: ReportAssistantResultSourceTrace["kind"];
  refId: string;
};

export type ReportAssistantRedactedTraceEvent = {
  authority: ReportAssistantResultEnvelope["authority"];
  basisCount: number;
  basisMetricIds: readonly string[];
  confirmationStatus: ReportAssistantTraceConfirmationStatus;
  evidenceCount: number;
  redaction: {
    droppedFields: readonly string[];
    status: ReportAssistantTraceRedactionStatus;
  };
  rendererKind: ReportAssistantCapabilityRendererKind;
  requestId: string;
  resultKind: ReportAssistantCapabilityResultKind;
  routeStatus: ReportAssistantResultRouteStatus;
  schemaVersion: ReportAssistantRedactedTraceEventSchemaVersion;
  selectedCapability: string;
  sourceTraceCount: number;
  sourceTraceRefs: readonly ReportAssistantRedactedSourceTraceRef[];
  stage: ReportAssistantTraceEventStage;
  taskCodes: readonly string[];
  usedReadActions: readonly string[];
  usedToolNames: readonly string[];
  validationErrorCount: number;
  validationErrorRefs: readonly string[];
  validationStatus: ReportAssistantTraceValidationStatus;
  warningCount: number;
};

export type CreateReportAssistantRedactedTraceEventInput = {
  confirmationStatus?: ReportAssistantTraceConfirmationStatus;
  envelope: ReportAssistantResultEnvelope;
  requestId: string;
  stage?: ReportAssistantTraceEventStage;
  usedReadActions?: readonly string[];
  usedToolNames?: readonly string[];
};

const REDACTED_DROPPED_FIELDS: readonly string[] = [
  "input.instruction",
  "input.document",
  "input.providerTranscript",
  "envelope.confidenceReason",
  "envelope.evidence.detail",
  "envelope.sourceTrace.label",
  "envelope.sourceTrace.detail",
  "envelope.tasks.message",
  "envelope.warnings",
  "envelope.basis.valueLabel"
];

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) =>
      `${JSON.stringify(key)}:${stableStringify(record[key])}`
    ).join(",")}}`;
  }

  return JSON.stringify(value);
}

function hashRef(value: unknown): string {
  const text = stableStringify(value);
  let hash = 2166136261;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

function sourceTraceRef(
  trace: ReportAssistantResultSourceTrace,
  index: number
): ReportAssistantRedactedSourceTraceRef {
  return {
    hasDetail: typeof trace.detail === "string" && trace.detail.length > 0,
    kind: trace.kind,
    refId: `source-trace:${trace.kind}:${String(index + 1)}:${hashRef({
      detail: trace.detail ?? "",
      kind: trace.kind,
      label: trace.label
    })}`
  };
}

function defaultConfirmationStatus(envelope: ReportAssistantResultEnvelope): ReportAssistantTraceConfirmationStatus {
  if (envelope.routeStatus === "stale") {
    return "stale";
  }

  if (envelope.requiresConfirmation) {
    return "required_pending";
  }

  return "not_required";
}

function uniqueStrings(values: readonly string[] | undefined): readonly string[] {
  return [...new Set(values ?? [])].sort((left, right) => left.localeCompare(right));
}

export function createReportAssistantRedactedTraceEvent(
  input: CreateReportAssistantRedactedTraceEventInput
): ReportAssistantRedactedTraceEvent {
  const validation = validateReportAssistantResultEnvelope(input.envelope);
  const validationErrors = validation.ok ? [] : validation.errors;

  return {
    authority: input.envelope.authority,
    basisCount: input.envelope.basis.length,
    basisMetricIds: uniqueStrings(input.envelope.basis.map((basis) => basis.metricId)),
    confirmationStatus: input.confirmationStatus ?? defaultConfirmationStatus(input.envelope),
    evidenceCount: input.envelope.evidence.length,
    redaction: {
      droppedFields: REDACTED_DROPPED_FIELDS,
      status: "redacted"
    },
    rendererKind: input.envelope.rendererKind,
    requestId: input.requestId,
    resultKind: input.envelope.resultKind,
    routeStatus: input.envelope.routeStatus,
    schemaVersion: "report_assistant_redacted_trace_event_v1",
    selectedCapability: input.envelope.capabilityName,
    sourceTraceCount: input.envelope.sourceTrace.length,
    sourceTraceRefs: input.envelope.sourceTrace.map(sourceTraceRef),
    stage: input.stage ?? "result_envelope",
    taskCodes: uniqueStrings(input.envelope.tasks.map((task) => task.code)),
    usedReadActions: uniqueStrings(input.usedReadActions),
    usedToolNames: uniqueStrings(input.usedToolNames),
    validationErrorCount: validationErrors.length,
    validationErrorRefs: validationErrors.map((error, index) => `validation-error:${String(index + 1)}:${hashRef(error)}`),
    validationStatus: validation.ok ? "passed" : "failed",
    warningCount: input.envelope.warnings.length
  };
}

export function createReportAssistantRedactedTraceEvents(input: {
  envelopes: readonly ReportAssistantResultEnvelope[];
  requestId: string;
  stage?: ReportAssistantTraceEventStage;
  usedReadActions?: readonly string[];
  usedToolNames?: readonly string[];
}): readonly ReportAssistantRedactedTraceEvent[] {
  return input.envelopes.map((envelope) =>
    createReportAssistantRedactedTraceEvent({
      envelope,
      requestId: input.requestId,
      stage: input.stage,
      usedReadActions: input.usedReadActions,
      usedToolNames: input.usedToolNames
    })
  );
}
