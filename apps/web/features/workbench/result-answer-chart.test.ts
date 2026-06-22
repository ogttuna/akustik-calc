import type { AssemblyCalculation } from "@dynecho/shared";
import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ResultAnswerChart } from "./result-answer-chart";
import { ResultSummary } from "./result-summary";

function buildFixture(overrides: Partial<AssemblyCalculation> = {}): AssemblyCalculation {
  return {
    curve: {
      frequenciesHz: [125, 250, 500],
      transmissionLossDb: [40, 50, 60]
    },
    impact: {
      CI: -7.4,
      DeltaLw: 24.1,
      labOrField: "lab",
      LnW: 74.7
    },
    impactPredictorStatus: {
      active: true,
      futureSupportedTargetOutputs: [],
      implementedFamilyEstimate: false,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: false,
      notes: [],
      readyForPlannedSolver: true,
      warnings: []
    },
    layers: [],
    metrics: {
      estimatedCDb: -0.7,
      estimatedCtrDb: -5.4,
      estimatedRwDb: 45,
      estimatedStc: 43,
      method: "screening_mass_law_curve_seed_v3"
    },
    ok: true,
    ratings: {
      iso717: {
        composite: "Rw 45 (-1;-5)",
        descriptor: "Rw"
      }
    },
    supportedImpactOutputs: ["Ln,w"],
    supportedTargetOutputs: ["Rw", "Ln,w"],
    targetOutputs: ["Rw", "Ln,w"],
    unsupportedImpactOutputs: [],
    unsupportedTargetOutputs: [],
    warnings: [],
    ...overrides
  } as AssemblyCalculation;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("result answer chart", () => {
  it("keeps the lane grid stacked until very wide layouts", () => {
    const html = renderToStaticMarkup(
      createElement(ResultAnswerChart, {
        result: buildFixture(),
        targetLnwDb: "53",
        targetRwDb: "52"
      })
    );

    expect(html).toContain("2xl:grid-cols-2");
    expect(html).not.toContain("md:grid-cols-2");
  });

  it("can force a stacked lane layout for narrow panel embeddings", () => {
    const html = renderToStaticMarkup(
      createElement(ResultAnswerChart, {
        layout: "stacked",
        result: buildFixture(),
        targetLnwDb: "53",
        targetRwDb: "52"
      })
    );

    expect(html).toContain('class="grid gap-4"');
    expect(html).not.toContain("2xl:grid-cols-2");
  });

  it("renders only the selected impact lane for impact-only answer scopes", () => {
    vi.stubGlobal("React", React);
    const result = buildFixture({
      impact: {
        availableOutputs: ["Ln,w", "DeltaLw"],
        basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
        confidence: {
          level: "medium",
          provenance: "formula_estimate_narrow_scope",
          score: 0.73,
          summary: "Fixture confidence."
        },
        DeltaLw: 24.3,
        labOrField: "lab",
        LnW: 50.3,
        notes: ["Fixture note."],
        scope: "narrow_heavy_concrete_only"
      },
      supportedTargetOutputs: ["Ln,w", "DeltaLw"],
      targetOutputs: ["Ln,w", "DeltaLw", "IIC"],
      unsupportedTargetOutputs: ["IIC"]
    });
    const chartHtml = renderToStaticMarkup(
      createElement(ResultAnswerChart, {
        result,
        targetLnwDb: "55",
        targetRwDb: "52"
      })
    );
    const summaryHtml = renderToStaticMarkup(
      createElement(ResultSummary, {
        result,
        targetLnwDb: "55",
        targetRwDb: "52",
        warnings: []
      })
    );

    expect(chartHtml).toContain("Ln,w");
    expect(chartHtml).toContain("50.3 dB");
    expect(chartHtml).toContain("DeltaLw");
    expect(chartHtml).not.toContain("Rw estimate");
    expect(chartHtml).not.toContain(">STC<");
    expect(summaryHtml).toContain("Ln,w");
    expect(summaryHtml).toContain("50.3 dB");
    expect(summaryHtml).not.toContain("Rw estimate");
    expect(summaryHtml).not.toContain(">STC<");
    expect(summaryHtml).not.toContain("Spectrum adaptation");
  });

  it("renders floor impact answer stops without leaking diagnostic airborne cards", () => {
    vi.stubGlobal("React", React);
    const result = buildFixture({
      acousticAnswerBoundary: {
        method: "dynamic_calculator_floor_impact_missing_physical_fields",
        missingPhysicalInputs: ["loadBasisKgM2"],
        origin: "needs_input",
        requiredInputs: ["loadBasisKgM2"],
        route: "floor",
        unsupportedOutputs: ["Ln,w", "DeltaLw"]
      },
      impact: null,
      supportedImpactOutputs: [],
      supportedTargetOutputs: [],
      targetOutputs: ["Ln,w", "DeltaLw"],
      unsupportedImpactOutputs: ["Ln,w", "DeltaLw"],
      unsupportedTargetOutputs: ["Ln,w", "DeltaLw"]
    });
    const chartHtml = renderToStaticMarkup(
      createElement(ResultAnswerChart, {
        result,
        targetLnwDb: "55",
        targetRwDb: "52"
      })
    );
    const summaryHtml = renderToStaticMarkup(
      createElement(ResultSummary, {
        result,
        targetLnwDb: "55",
        targetRwDb: "52",
        warnings: []
      })
    );

    expect(chartHtml).toBe("");
    expect(summaryHtml).toContain("Impact answer");
    expect(summaryHtml).toContain("Not ready");
    expect(summaryHtml).toContain("Needs input: Load basis");
    expect(summaryHtml).not.toContain("loadBasisKgM2");
    expect(summaryHtml).not.toContain("Rw estimate");
    expect(summaryHtml).not.toContain(">STC<");
  });

  it("formats grouped floor field-context needs-input rows for users", () => {
    vi.stubGlobal("React", React);
    const result = buildFixture({
      acousticAnswerBoundary: {
        method: "dynamic_calculator_floor_impact_missing_field_context",
        missingPhysicalInputs: ["impactFieldContext", "impactFieldContext.ci50_2500Db"],
        origin: "needs_input",
        requiredInputs: ["impactFieldContext", "impactFieldContext.ci50_2500Db"],
        route: "floor",
        unsupportedOutputs: ["L'nT,50"]
      },
      impact: null,
      supportedImpactOutputs: [],
      supportedTargetOutputs: [],
      targetOutputs: ["L'nT,50"],
      unsupportedImpactOutputs: ["L'nT,50"],
      unsupportedTargetOutputs: ["L'nT,50"]
    });

    const summaryHtml = renderToStaticMarkup(
      createElement(ResultSummary, {
        result,
        targetLnwDb: "55",
        targetRwDb: "52",
        warnings: []
      })
    );

    expect(summaryHtml).toContain("Needs input: Impact field context, CI,50-2500");
    expect(summaryHtml).not.toContain("impactFieldContext");
    expect(summaryHtml).not.toContain("ci50_2500Db");
  });

  it("formats parked airborne answer missing inputs for users", () => {
    vi.stubGlobal("React", React);
    const result = buildFixture({
      acousticAnswerBoundary: {
        method: "dynamic_calculator_route_input_contract_missing_physical_fields",
        missingPhysicalInputs: ["sideALeafGroup", "cavity1DepthMm"],
        origin: "needs_input",
        requiredInputs: ["sideALeafGroup", "cavity1DepthMm"],
        route: "wall",
        unsupportedOutputs: ["Rw", "STC"]
      },
      airborneBasis: {
        assumptions: ["missing physical fields are user prompts"],
        calculationStandard: "none",
        curveBasis: "no_curve",
        kind: "airborne_needs_input",
        method: "dynamic_calculator_route_input_contract_missing_physical_fields",
        missingPhysicalInputs: ["sideALeafGroup", "cavity1DepthMm"],
        missingSourceEvidence: [],
        origin: "needs_input",
        propertyDefaults: [],
        ratingStandard: "none",
        requiredInputs: ["sideALeafGroup", "cavity1DepthMm"]
      },
      impact: null,
      supportedImpactOutputs: [],
      supportedTargetOutputs: [],
      targetOutputs: ["Rw", "STC"],
      unsupportedImpactOutputs: [],
      unsupportedTargetOutputs: ["Rw", "STC"]
    });

    const summaryHtml = renderToStaticMarkup(
      createElement(ResultSummary, {
        result,
        targetLnwDb: "55",
        targetRwDb: "52",
        warnings: []
      })
    );

    expect(summaryHtml).toContain("Needs input: Side A leaf group, First cavity depth");
    expect(summaryHtml).not.toContain("sideALeafGroup");
    expect(summaryHtml).not.toContain("cavity1DepthMm");
  });
});
