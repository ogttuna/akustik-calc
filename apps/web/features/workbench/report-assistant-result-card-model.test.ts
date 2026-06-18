import { describe, expect, it } from "vitest";

import {
  REPORT_ASSISTANT_CAPABILITY_REGISTRY,
  type ReportAssistantCapabilityContract
} from "./report-assistant-capabilities";
import {
  createReportAssistantResultCardModel,
  getReportAssistantResultCardTone,
  REPORT_ASSISTANT_RESULT_RENDERER_DEFINITIONS
} from "./report-assistant-result-card-model";
import {
  createReportAssistantResultEnvelope,
  type ReportAssistantResultEnvelope,
  type ReportAssistantResultEnvelopeInput
} from "./report-assistant-result-contract";

function envelopeInputForCapability(
  capability: ReportAssistantCapabilityContract
): ReportAssistantResultEnvelopeInput {
  if (capability.rendererKind === "calculator_preview_card") {
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
      capabilityName: capability.name,
      confidenceReason: "Calculator preview produced this value from the typed assistant request.",
      routeStatus: "ready",
      sourceTrace: [
        {
          kind: "calculator_preview",
          label: capability.name
        }
      ]
    };
  }

  return {
    authority: "draft_only",
    capabilityName: capability.name,
    confidenceReason: "The assistant produced a typed result envelope without claiming calculator authority.",
    routeStatus: "ready",
    sourceTrace: [
      {
        kind: capability.category === "read_tool" ? "project_read" : "deterministic",
        label: capability.name
      }
    ]
  };
}

function createEnvelopeForCapability(capability: ReportAssistantCapabilityContract): ReportAssistantResultEnvelope {
  return createReportAssistantResultEnvelope(envelopeInputForCapability(capability));
}

describe("report assistant result card model", () => {
  it("has renderer definitions for every registered assistant capability", () => {
    const registryRendererKinds = new Set(REPORT_ASSISTANT_CAPABILITY_REGISTRY.map((capability) => capability.rendererKind));

    for (const rendererKind of registryRendererKinds) {
      expect(REPORT_ASSISTANT_RESULT_RENDERER_DEFINITIONS[rendererKind]).toBeDefined();
    }
    expect(REPORT_ASSISTANT_RESULT_RENDERER_DEFINITIONS.error_card).toMatchObject({
      label: "Error",
      rendersCalculatorPreview: false
    });
  });

  it("builds a stable card model for every registered capability", () => {
    for (const capability of REPORT_ASSISTANT_CAPABILITY_REGISTRY) {
      const envelope = createEnvelopeForCapability(capability);
      const model = createReportAssistantResultCardModel(envelope);

      expect(model.rendererKind).toBe(capability.rendererKind);
      expect(model.rendererLabel).toBe(REPORT_ASSISTANT_RESULT_RENDERER_DEFINITIONS[capability.rendererKind].label);
      expect(model.routeStatusLabel).toBe("ready");
      expect(model.metaRows).toEqual([
        {
          label: "Authority",
          value: capability.rendererKind === "calculator_preview_card" ? "calculator backed" : "draft only"
        },
        {
          label: "Posture",
          value: capability.previewOnly ? "Preview" : capability.mutates ? "Mutates" : "Read"
        },
        {
          label: "Confirmation",
          value: capability.requiresConfirmation ? "Required" : "Not required"
        },
        {
          label: "Stale policy",
          value: capability.stalePolicy.replace(/_/gu, " ")
        }
      ]);
    }
  });

  it("keeps calculator preview cards preview-only with no confirmation affordance", () => {
    const calculatorCapability = REPORT_ASSISTANT_CAPABILITY_REGISTRY.find((capability) =>
      capability.rendererKind === "calculator_preview_card"
    );

    expect(calculatorCapability).toBeDefined();
    if (!calculatorCapability) {
      return;
    }

    const model = createReportAssistantResultCardModel(createEnvelopeForCapability(calculatorCapability));

    expect(model).toMatchObject({
      rendererLabel: "Calculator preview",
      rendersCalculatorPreview: true,
      tone: "success"
    });
    expect(model.metaRows).toContainEqual({
      label: "Posture",
      value: "Preview"
    });
    expect(model.metaRows).toContainEqual({
      label: "Confirmation",
      value: "Not required"
    });
  });

  it("classifies failure, boundary, and confirmation tones without natural-language parsing", () => {
    expect(
      getReportAssistantResultCardTone({
        authority: "error",
        requiresConfirmation: false,
        routeStatus: "provider_failed"
      })
    ).toBe("error");
    expect(
      getReportAssistantResultCardTone({
        authority: "needs_input",
        requiresConfirmation: false,
        routeStatus: "needs_input"
      })
    ).toBe("warning");
    expect(
      getReportAssistantResultCardTone({
        authority: "unsupported",
        requiresConfirmation: false,
        routeStatus: "unsupported"
      })
    ).toBe("warning");
    expect(
      getReportAssistantResultCardTone({
        authority: "draft_only",
        requiresConfirmation: true,
        routeStatus: "ready"
      })
    ).toBe("warning");
  });
});
