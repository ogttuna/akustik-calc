import { describe, expect, it } from "vitest";

import {
  createReportAssistantResultEnvelope,
  validateReportAssistantResultEnvelope,
  type ReportAssistantResultEnvelopeInput
} from "./report-assistant-result-contract";

function calculatorPreviewInput(
  overrides: Partial<ReportAssistantResultEnvelopeInput> = {}
): ReportAssistantResultEnvelopeInput {
  return {
    authority: "calculator_backed",
    basis: [
      {
        basis: "laboratory_airborne",
        metricId: "Rw",
        routeStatus: "ready",
        unit: "dB",
        valueLabel: "46 dB"
      }
    ],
    capabilityName: "preview_described_layer_configuration",
    confidenceReason: "The value is produced by the preview-only calculator route.",
    evidence: [
      {
        label: "Parsed wall stack",
        detail: "Temporary described-layer request"
      }
    ],
    routeStatus: "ready",
    sourceTrace: [
      {
        kind: "calculator_preview",
        label: "preview_described_layer_configuration"
      }
    ],
    ...overrides
  };
}

describe("report assistant result envelope contract", () => {
  it("stamps calculator preview metadata from the capability registry", () => {
    const envelope = createReportAssistantResultEnvelope(calculatorPreviewInput());

    expect(envelope).toMatchObject({
      authority: "calculator_backed",
      capabilityName: "preview_described_layer_configuration",
      mutates: false,
      previewOnly: true,
      rendererKind: "calculator_preview_card",
      requiresConfirmation: false,
      resultKind: "calculator_preview",
      routeStatus: "ready",
      stalePolicy: "assistant_context_signature"
    });
    expect(envelope.basis).toEqual([
      {
        basis: "laboratory_airborne",
        metricId: "Rw",
        routeStatus: "ready",
        unit: "dB",
        valueLabel: "46 dB"
      }
    ]);
  });

  it("rejects metric basis rows without calculator, saved-state, provider, or confirmed authority", () => {
    const envelope = createReportAssistantResultEnvelope(calculatorPreviewInput());
    const validation = validateReportAssistantResultEnvelope({
      ...envelope,
      authority: "draft_only"
    });

    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.errors).toContain(
        "Metric basis rows require calculator_backed, saved_project_state, provider_review, or user_confirmed authority."
      );
    }
  });

  it("rejects calculator-backed answers without metric basis and route metadata", () => {
    expect(() =>
      createReportAssistantResultEnvelope(
        calculatorPreviewInput({
          basis: []
        })
      )
    ).toThrow(/calculator_backed authority requires at least one metric basis row/);
  });

  it("accepts needs-input and unsupported answers without numeric basis rows", () => {
    const needsInput = createReportAssistantResultEnvelope(
      calculatorPreviewInput({
        authority: "needs_input",
        basis: [],
        routeStatus: "needs_input",
        tasks: [
          {
            code: "missing_layer_thickness",
            message: "Layer thickness is required before a calculator preview can run.",
            severity: "warning"
          }
        ]
      })
    );
    const unsupported = createReportAssistantResultEnvelope(
      calculatorPreviewInput({
        authority: "unsupported",
        basis: [],
        routeStatus: "unsupported",
        tasks: [
          {
            code: "unsupported_floor_impact_route",
            message: "This output is not supported by the assistant preview route.",
            severity: "info"
          }
        ]
      })
    );

    expect(needsInput).toMatchObject({
      authority: "needs_input",
      basis: [],
      routeStatus: "needs_input"
    });
    expect(unsupported).toMatchObject({
      authority: "unsupported",
      basis: [],
      routeStatus: "unsupported"
    });
  });

  it("accepts distinct auth, provider, and validation failure route statuses with task context", () => {
    for (const routeStatus of ["auth_failed", "provider_failed", "validation_failed"] as const) {
      const envelope = createReportAssistantResultEnvelope(
        calculatorPreviewInput({
          authority: "error",
          basis: [],
          capabilityName: "report_assistant_query_route",
          routeStatus,
          tasks: [
            {
              code: routeStatus,
              message: `${routeStatus} boundary blocked the route.`,
              severity: "error"
            }
          ]
        })
      );

      expect(envelope).toMatchObject({
        authority: "error",
        routeStatus,
        tasks: [
          {
            code: routeStatus,
            severity: "error"
          }
        ]
      });
    }
  });

  it("requires task context for incomplete error route statuses", () => {
    expect(() =>
      createReportAssistantResultEnvelope(
        calculatorPreviewInput({
          authority: "error",
          basis: [],
          capabilityName: "report_assistant_query_route",
          routeStatus: "auth_failed"
        })
      )
    ).toThrow(/auth_failed results require at least one task/);
  });

  it("keeps action proposal confirmation policy aligned with the capability registry", () => {
    const proposal = createReportAssistantResultEnvelope({
      authority: "draft_only",
      capabilityName: "save_project_report_revision_from_current_draft",
      confidenceReason: "The assistant can only draft the save action until the user confirms it.",
      routeStatus: "ready"
    });

    expect(proposal).toMatchObject({
      mutates: false,
      previewOnly: true,
      rendererKind: "action_proposal_card",
      requiresConfirmation: true,
      resultKind: "action_proposal",
      stalePolicy: "target_stale_guard"
    });

    const validation = validateReportAssistantResultEnvelope({
      ...proposal,
      requiresConfirmation: false
    });

    expect(validation.ok).toBe(false);
    if (!validation.ok) {
      expect(validation.errors).toContain(
        'Envelope requiresConfirmation false does not match capability "save_project_report_revision_from_current_draft" value true.'
      );
    }
  });

  it("rejects unknown capabilities before rendering an assistant result", () => {
    expect(() =>
      createReportAssistantResultEnvelope({
        authority: "draft_only",
        capabilityName: "missing_report_assistant_capability",
        routeStatus: "ready"
      })
    ).toThrow(/Unknown report assistant capability/);
  });
});
