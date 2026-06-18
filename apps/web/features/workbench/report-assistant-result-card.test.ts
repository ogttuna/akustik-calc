import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AssistantResultCard } from "./report-assistant-result-card";
import { createReportAssistantResultEnvelope } from "./report-assistant-result-contract";
import type { WorkbenchV2CalculatorAssistantPreview } from "../workbench-rebuild/workbench-v2-calculator-assistant";

const CALCULATOR_PREVIEW: WorkbenchV2CalculatorAssistantPreview = {
  calculationSummary: {
    primaryOutput: "Rw",
    primaryValueLabel: "46 dB",
    selectedOutputs: ["Rw", "STC"],
    status: "ready"
  },
  describedConfiguration: {
    description: "2x gypsum board, studs, mineral wool, gypsum board",
    layers: [
      {
        materialId: "gypsum_board",
        materialName: "Gypsum board",
        role: "lining",
        thicknessMm: 12.5
      }
    ],
    parser: "deterministic_wall_layer_description_v1",
    warnings: []
  },
  engineSummary: {
    calculatorId: "wall_formula_preview",
    calculatorLabel: "Wall formula preview",
    method: "owned_formula_route",
    supportedImpactOutputs: [],
    supportedTargetOutputs: ["Rw", "STC"],
    unsupportedImpactOutputs: [],
    unsupportedTargetOutputs: [],
    warnings: []
  },
  outputRows: [
    {
      detail: "laboratory_airborne",
      label: "Rw",
      status: "live",
      value: "46 dB"
    }
  ],
  requestedSnapshot: {
    customMaterialCount: 0,
    layerCount: 4,
    mode: "wall",
    name: "Assistant preview",
    selectedOutputs: ["Rw", "STC"]
  },
  tasks: []
};

describe("report assistant result card", () => {
  it("server-renders calculator-backed envelopes with preview markup, basis, and trace", () => {
    const result = createReportAssistantResultEnvelope({
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
      confidenceReason: "Calculator preview is produced from a typed described-layer request.",
      evidence: [
        {
          detail: "Temporary described wall stack",
          label: "Parsed request"
        }
      ],
      routeStatus: "ready",
      sourceTrace: [
        {
          kind: "calculator_preview",
          label: "preview_described_layer_configuration"
        }
      ]
    });

    const html = renderToStaticMarkup(createElement(AssistantResultCard, {
      calculatorPreview: CALCULATOR_PREVIEW,
      result
    }));

    expect(html).toContain('class="report-assistant-result-card"');
    expect(html).toContain('data-authority="calculator_backed"');
    expect(html).toContain('data-renderer="calculator_preview_card"');
    expect(html).toContain('data-tone="success"');
    expect(html).toContain("Calculator preview");
    expect(html).toContain("report-assistant-calculator-preview");
    expect(html).toContain("Metric basis");
    expect(html).toContain("46 dB");
    expect(html).toContain("calculator preview");
    expect(html).toContain("Parsed request");
  });

  it("server-renders needs-input envelopes without calculator preview or numeric values", () => {
    const result = createReportAssistantResultEnvelope({
      authority: "needs_input",
      basis: [],
      capabilityName: "preview_described_layer_configuration",
      confidenceReason: "The assistant needs a missing layer thickness before previewing calculator values.",
      routeStatus: "needs_input",
      tasks: [
        {
          code: "missing_layer_thickness",
          message: "Layer thickness is required before calculator preview can run.",
          severity: "warning"
        }
      ]
    });

    const html = renderToStaticMarkup(createElement(AssistantResultCard, {
      calculatorPreview: CALCULATOR_PREVIEW,
      result
    }));

    expect(html).toContain('data-authority="needs_input"');
    expect(html).toContain('data-tone="warning"');
    expect(html).toContain("missing_layer_thickness");
    expect(html).not.toContain("report-assistant-calculator-preview");
    expect(html).not.toContain("Metric basis");
    expect(html).not.toContain("46 dB");
  });
});
