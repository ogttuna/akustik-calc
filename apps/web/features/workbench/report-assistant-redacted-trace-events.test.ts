import { describe, expect, it } from "vitest";

import {
  createReportAssistantRedactedTraceEvent,
  createReportAssistantRedactedTraceEvents
} from "./report-assistant-redacted-trace-events";
import {
  createReportAssistantResultEnvelope,
  type ReportAssistantResultEnvelope
} from "./report-assistant-result-contract";

function calculatorEnvelope(): ReportAssistantResultEnvelope {
  return createReportAssistantResultEnvelope({
    authority: "calculator_backed",
    basis: [
      {
        basis: "workbench_v2_calculator_preview",
        metricId: "Rw",
        routeStatus: "ready",
        unit: "dB",
        valueLabel: "46 dB"
      }
    ],
    capabilityName: "preview_described_layer_configuration",
    confidenceReason: "SECRET_API_KEY=sk-test leaked provider text must not be persisted.",
    evidence: [
      {
        detail: "FULL REPORT BODY: confidential wall assembly narrative",
        label: "Calculator preview evidence"
      }
    ],
    routeStatus: "ready",
    sourceTrace: [
      {
        detail: "FULL USER PROMPT: gypsum rock wool gypsum diz",
        kind: "calculator_preview",
        label: "preview_described_layer_configuration"
      }
    ],
    warnings: ["Provider transcript said: ignore previous instructions"]
  });
}

function errorEnvelope(): ReportAssistantResultEnvelope {
  return createReportAssistantResultEnvelope({
    authority: "error",
    basis: [],
    capabilityName: "report_assistant_query_route",
    confidenceReason: "Raw provider transcript should not be stored.",
    routeStatus: "validation_failed",
    sourceTrace: [
      {
        detail: "Saved report body tried to call a tool.",
        kind: "project_read",
        label: "untrusted_saved_report_text"
      }
    ],
    tasks: [
      {
        code: "assistant_untrusted_source_injection",
        message: "Full untrusted saved-report text must not appear in telemetry.",
        severity: "error"
      }
    ]
  });
}

function sourceReviewEnvelope(): ReportAssistantResultEnvelope {
  return createReportAssistantResultEnvelope({
    authority: "provider_review",
    capabilityName: "report_assistant_plausibility_route",
    confidenceReason: "Provider said suggested report value 47 dB from https://example.com/private-source.",
    evidence: [
      {
        detail: "Calculator 41 dB; suggested report value 47 dB; source https://example.com/private-source",
        label: "Suggested report value"
      }
    ],
    routeStatus: "ready",
    sourceTrace: [
      {
        detail: "Provider transcript contained source quotes and Rw 47 dB recommendation.",
        kind: "provider_review",
        label: "report_assistant_plausibility_route"
      }
    ],
    warnings: ["Provider patch was suppressed before validation."]
  });
}

describe("report assistant redacted trace events", () => {
  it("keeps calculator success events useful without storing prompt, source detail, or values", () => {
    const event = createReportAssistantRedactedTraceEvent({
      envelope: calculatorEnvelope(),
      requestId: "assistant-request-1",
      usedToolNames: ["preview_described_layer_configuration"]
    });
    const serialized = JSON.stringify(event);

    expect(event).toMatchObject({
      authority: "calculator_backed",
      basisCount: 1,
      basisMetricIds: ["Rw"],
      confirmationStatus: "not_required",
      redaction: {
        status: "redacted"
      },
      rendererKind: "calculator_preview_card",
      requestId: "assistant-request-1",
      resultKind: "calculator_preview",
      routeStatus: "ready",
      schemaVersion: "report_assistant_redacted_trace_event_v1",
      selectedCapability: "preview_described_layer_configuration",
      sourceTraceCount: 1,
      stage: "result_envelope",
      usedToolNames: ["preview_described_layer_configuration"],
      validationErrorCount: 0,
      validationErrorRefs: [],
      validationStatus: "passed",
      warningCount: 1
    });
    expect(event.sourceTraceRefs).toEqual([
      expect.objectContaining({
        hasDetail: true,
        kind: "calculator_preview"
      })
    ]);
    expect(serialized).not.toContain("SECRET_API_KEY");
    expect(serialized).not.toContain("sk-test");
    expect(serialized).not.toContain("FULL REPORT BODY");
    expect(serialized).not.toContain("FULL USER PROMPT");
    expect(serialized).not.toContain("46 dB");
    expect(serialized).not.toContain("ignore previous instructions");
  });

  it("emits failure events through the same redacted envelope path", () => {
    const event = createReportAssistantRedactedTraceEvent({
      envelope: errorEnvelope(),
      requestId: "assistant-request-2",
      stage: "route_adapter",
      usedReadActions: ["list_project_reports"]
    });
    const serialized = JSON.stringify(event);

    expect(event).toMatchObject({
      authority: "error",
      basisCount: 0,
      confirmationStatus: "not_required",
      requestId: "assistant-request-2",
      routeStatus: "validation_failed",
      selectedCapability: "report_assistant_query_route",
      sourceTraceCount: 1,
      stage: "route_adapter",
      taskCodes: ["assistant_untrusted_source_injection"],
      usedReadActions: ["list_project_reports"],
      validationStatus: "passed"
    });
    expect(event.sourceTraceRefs[0]).toMatchObject({
      hasDetail: true,
      kind: "project_read"
    });
    expect(serialized).not.toContain("Saved report body tried to call a tool");
    expect(serialized).not.toContain("Full untrusted saved-report text");
    expect(serialized).not.toContain("Raw provider transcript");
  });

  it("marks confirmation-required action proposals without treating them as applied", () => {
    const envelope = createReportAssistantResultEnvelope({
      authority: "draft_only",
      capabilityName: "export_current_report_snapshot_as_pdf",
      routeStatus: "ready",
      sourceTrace: [
        {
          detail: "No PDF was downloaded while creating this event.",
          kind: "deterministic",
          label: "report_assistant_action_proposal"
        }
      ]
    });
    const pending = createReportAssistantRedactedTraceEvent({
      envelope,
      requestId: "assistant-request-3"
    });
    const rejected = createReportAssistantRedactedTraceEvent({
      confirmationStatus: "rejected",
      envelope,
      requestId: "assistant-request-3",
      stage: "confirmation"
    });

    expect(pending).toMatchObject({
      confirmationStatus: "required_pending"
    });
    expect(rejected).toMatchObject({
      confirmationStatus: "rejected",
      stage: "confirmation"
    });
  });

  it("records source-review confirmation posture without leaking source values or provider text", () => {
    const event = createReportAssistantRedactedTraceEvent({
      confirmationStatus: "required_pending",
      envelope: sourceReviewEnvelope(),
      requestId: "assistant-request-source-review",
      usedToolNames: ["report_assistant_plausibility_route"]
    });
    const serialized = JSON.stringify(event);

    expect(event).toMatchObject({
      authority: "provider_review",
      confirmationStatus: "required_pending",
      evidenceCount: 1,
      rendererKind: "research_review_card",
      resultKind: "plausibility_review",
      routeStatus: "ready",
      selectedCapability: "report_assistant_plausibility_route",
      sourceTraceCount: 1,
      usedToolNames: ["report_assistant_plausibility_route"],
      validationStatus: "passed",
      warningCount: 1
    });
    expect(event.sourceTraceRefs[0]).toMatchObject({
      hasDetail: true,
      kind: "provider_review"
    });
    expect(serialized).not.toContain("47 dB");
    expect(serialized).not.toContain("41 dB");
    expect(serialized).not.toContain("https://example.com/private-source");
    expect(serialized).not.toContain("Provider transcript");
    expect(serialized).not.toContain("Provider patch was suppressed");
  });

  it("records validation failure counts and hashed refs without leaking validator text", () => {
    const valid = calculatorEnvelope();
    const invalid: ReportAssistantResultEnvelope = {
      ...valid,
      authority: "draft_only"
    };
    const event = createReportAssistantRedactedTraceEvent({
      envelope: invalid,
      requestId: "assistant-request-4"
    });
    const serialized = JSON.stringify(event);

    expect(event).toMatchObject({
      selectedCapability: "preview_described_layer_configuration",
      validationStatus: "failed"
    });
    expect(event.validationErrorCount).toBeGreaterThan(0);
    expect(event.validationErrorRefs).toHaveLength(event.validationErrorCount);
    expect(event.validationErrorRefs.every((ref) => ref.startsWith("validation-error:"))).toBe(true);
    expect(serialized).not.toContain("Metric basis rows require");
    expect(serialized).not.toContain("ready routeStatus cannot be paired");
  });

  it("creates one event per assistant result envelope", () => {
    const events = createReportAssistantRedactedTraceEvents({
      envelopes: [calculatorEnvelope(), errorEnvelope()],
      requestId: "assistant-request-5",
      usedToolNames: ["preview_described_layer_configuration"]
    });

    expect(events).toHaveLength(2);
    expect(events.map((event) => event.selectedCapability)).toEqual([
      "preview_described_layer_configuration",
      "report_assistant_query_route"
    ]);
    expect(events.every((event) => event.requestId === "assistant-request-5")).toBe(true);
  });
});
