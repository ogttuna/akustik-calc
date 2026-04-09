import type { AssemblyCalculation } from "@dynecho/shared";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ResultAnswerChart } from "./result-answer-chart";

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
});
