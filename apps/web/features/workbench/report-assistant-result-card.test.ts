import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AssistantResultCard } from "./report-assistant-result-card";
import { plausibilityReviewToAssistantResult } from "./report-assistant-plausibility-result";
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
    expect(html).toContain("Layer thickness");
    expect(html).not.toContain("missing_layer_thickness");
    expect(html).not.toContain("report-assistant-calculator-preview");
    expect(html).not.toContain("Metric basis");
    expect(html).not.toContain("46 dB");
  });

  // AGENT COORDINATION 2026-06-24 (Codex): protects the same route-input
  // presentation adapter used by Workbench so assistant cards cannot regress
  // to raw engine/input ids for the missing-input cases reported by the user.
  it("server-renders route-input task ids as user-facing labels and guidance", () => {
    const result = createReportAssistantResultEnvelope({
      authority: "needs_input",
      basis: [],
      capabilityName: "preview_described_layer_configuration",
      confidenceReason: "The assistant needs route-specific physical inputs before previewing calculator values.",
      routeStatus: "needs_input",
      tasks: [
        {
          code: "toppingOrFloatingLayer",
          message: "toppingOrFloatingLayer: Required physical input is missing.",
          severity: "warning"
        },
        {
          code: "impactFieldContext",
          message: "impactFieldContext: Required physical input is missing.",
          severity: "warning"
        },
        {
          code: "ratings.field.partitionAreaM2",
          message: "Number must be greater than 0.",
          severity: "error"
        }
      ]
    });

    const html = renderToStaticMarkup(createElement(AssistantResultCard, {
      calculatorPreview: CALCULATOR_PREVIEW,
      result
    }));

    expect(html).toContain("Upper topping / floating layer");
    expect(html).toContain("Classify or add the upper topping / floating layer required by the selected floor impact route.");
    expect(html).toContain("Impact field context");
    expect(html).toContain("Complete the impact field context required by the selected field impact output.");
    expect(html).toContain("Panel area");
    expect(html).toContain("Enter panel width and height; the route derives partition area from those dimensions.");
    expect(html).not.toContain("toppingOrFloatingLayer");
    expect(html).not.toContain("impactFieldContext");
    expect(html).not.toContain("ratings.field.partitionAreaM2");
    expect(html).not.toContain("Number must be greater than 0");
  });

  it("server-renders wall comparison envelopes without legacy calculator preview props", () => {
    const result = createReportAssistantResultEnvelope({
      authority: "calculator_backed",
      basis: [
        {
          basis: "wall-candidate-1:dynamic",
          metricId: "Rw",
          routeStatus: "ready",
          unit: "dB",
          valueLabel: "51 dB"
        },
        {
          basis: "wall-candidate-2:dynamic",
          metricId: "Rw",
          routeStatus: "ready",
          unit: "dB",
          valueLabel: "53 dB"
        }
      ],
      capabilityName: "report_assistant_wall_candidate_comparison_preview",
      confidenceReason: "Comparison rows copy only live values returned by the calculator preview route.",
      routeStatus: "ready",
      sourceTrace: [
        {
          kind: "calculator_preview",
          label: "preview_layer_stack_draft"
        }
      ],
      tasks: [
        {
          code: "wall-candidate-2:assistant_layer_material_missing",
          message: "Candidate 2: Layer 2 has no normalized material id.",
          severity: "warning"
        }
      ]
    });

    const html = renderToStaticMarkup(createElement(AssistantResultCard, {
      result
    }));

    expect(html).toContain('data-renderer="wall_candidate_comparison_card"');
    expect(html).toContain("Wall comparison");
    expect(html).toContain("51 dB");
    expect(html).toContain("53 dB");
    expect(html).toContain("Layer material");
    expect(html).toContain("Candidate 2: Layer 2 has no normalized material id.");
    expect(html).not.toContain("wall-candidate-2:assistant_layer_material_missing");
    expect(html).not.toContain("report-assistant-calculator-preview");
    expect(html).not.toContain("Apply");
    expect(html).not.toContain("Save");
  });

  it("server-renders research review cards with calculator and source values separated", () => {
    const result = plausibilityReviewToAssistantResult({
      review: {
        answerText: "Sources suggest this wall may be higher than the current calculator result, but evidence is partial.",
        comparableAssemblies: [
          {
            comparisonNote: "Similar gypsum and mineral wool wall only.",
            label: "Gypsum mineral wool wall reference",
            matchingLayers: ["Gypsum board", "Rock wool"],
            metricValues: ["Rw 45-50 dB"],
            sourceTitle: "Wall acoustic reference",
            sourceUrl: "https://example.com/wall-acoustic-reference",
            weakeningDifferences: ["unknown stud spacing"]
          }
        ],
        comparability: "partial",
        confidence: "medium",
        engineDisplayValue: "41 dB",
        missingEvidence: ["Exact tested stack is not available."],
        metric: "Rw",
        metricId: "output:Rw",
        rationale: ["Source evidence is advisory only."],
        recommendedActionText: "Ask before applying any report-only value.",
        severity: "medium",
        sourceQuality: "mixed",
        sources: [
          {
            title: "Wall acoustic reference",
            url: "https://example.com/wall-acoustic-reference"
          }
        ],
        valueRecommendation: {
          displayValue: "47 dB",
          note: "Advisory report value only."
        },
        valueReviewed: "41 dB",
        verdict: "suspicious"
      },
      source: "research_provider",
      warnings: []
    });

    const html = renderToStaticMarkup(createElement(AssistantResultCard, {
      result
    }));

    expect(html).toContain('data-renderer="research_review_card"');
    expect(html).toContain("Calculator result");
    expect(html).toContain("41 dB");
    expect(html).toContain("Research verdict");
    expect(html).toContain("suspicious");
    expect(html).toContain("Suggested report value");
    expect(html).toContain("47 dB");
    expect(html).toContain("partial");
    expect(html).toContain("mixed");
    expect(html).toContain("1 source");
    expect(html.match(/Suggested report value/gu)).toHaveLength(1);
  });
});
