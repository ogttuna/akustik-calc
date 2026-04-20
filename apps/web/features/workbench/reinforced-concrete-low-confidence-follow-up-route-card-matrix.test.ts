import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getDynamicCalcBranchSummary } from "./dynamic-calc-branch";
import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

type CardSnapshot = {
  status: string;
  value: string;
};

type RouteSnapshot = {
  basis: string | null;
  branchDetailMentionsHeavyBareFormula: boolean;
  branchDetailMentionsHeavyFloatingFormula: boolean;
  branchDetailMentionsLowConfidenceFallback: boolean;
  branchDetailMentionsMixedRowConcreteLane: boolean;
  branchDetailMentionsProxyAirborneCompanions: boolean;
  branchTone: string;
  branchValue: string;
  candidateIds: readonly string[] | null;
  cards: Partial<Record<RequestedOutputId, CardSnapshot>>;
  estimateKind: string | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type RouteCase = {
  expected: RouteSnapshot;
  id: string;
  rows: readonly Omit<LayerDraft, "id">[];
};

const ROUTE_OUTPUTS = ["Rw", "Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

const LOW_CONFIDENCE_CANDIDATE_IDS = [
  "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
  "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
  "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
] as const;

const CASES: readonly RouteCase[] = [
  {
    id: "visible low-confidence reinforced-concrete follow-up route stays explicit",
    rows: [
      { materialId: "concrete", thicknessMm: "180", floorRole: "base_structure" },
      { materialId: "generic_resilient_underlay", thicknessMm: "8", floorRole: "resilient_layer" },
      { materialId: "vinyl_flooring", thicknessMm: "3", floorRole: "floor_covering" },
      { materialId: "resilient_channel", thicknessMm: "120", floorRole: "ceiling_cavity" },
      { materialId: "glasswool", thicknessMm: "100", floorRole: "ceiling_fill" },
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "16", floorRole: "ceiling_board" }
    ],
    expected: {
      basis: "predictor_floor_system_low_confidence_estimate",
      branchDetailMentionsHeavyBareFormula: false,
      branchDetailMentionsHeavyFloatingFormula: false,
      branchDetailMentionsLowConfidenceFallback: true,
      branchDetailMentionsMixedRowConcreteLane: true,
      branchDetailMentionsProxyAirborneCompanions: true,
      branchTone: "warning",
      branchValue: "Combined upper and lower system",
      candidateIds: LOW_CONFIDENCE_CANDIDATE_IDS,
      cards: {
        Rw: { status: "live", value: "65.9 dB" },
        "Ln,w": { status: "live", value: "50 dB" },
        DeltaLw: { status: "unsupported", value: "Not ready" }
      },
      estimateKind: "low_confidence",
      supported: ["Rw", "Ctr", "Ln,w"],
      unsupported: ["DeltaLw"]
    }
  },
  {
    id: "expanded board schedule stays outside the bounded follow-up route and falls back to heavy bare-floor formula cards",
    rows: [
      { materialId: "concrete", thicknessMm: "180", floorRole: "base_structure" },
      { materialId: "generic_resilient_underlay", thicknessMm: "8", floorRole: "resilient_layer" },
      { materialId: "vinyl_flooring", thicknessMm: "3", floorRole: "floor_covering" },
      { materialId: "resilient_channel", thicknessMm: "120", floorRole: "ceiling_cavity" },
      { materialId: "glasswool", thicknessMm: "100", floorRole: "ceiling_fill" },
      { materialId: "firestop_board", thicknessMm: "8", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "8", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "8", floorRole: "ceiling_board" },
      { materialId: "firestop_board", thicknessMm: "8", floorRole: "ceiling_board" }
    ],
    expected: {
      basis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      branchDetailMentionsHeavyBareFormula: true,
      branchDetailMentionsHeavyFloatingFormula: false,
      branchDetailMentionsLowConfidenceFallback: false,
      branchDetailMentionsMixedRowConcreteLane: false,
      branchDetailMentionsProxyAirborneCompanions: false,
      branchTone: "warning",
      branchValue: "Combined upper and lower system",
      candidateIds: null,
      cards: {
        Rw: { status: "live", value: "60 dB" },
        "Ln,w": { status: "live", value: "71.8 dB" },
        DeltaLw: { status: "unsupported", value: "Not ready" }
      },
      estimateKind: null,
      supported: ["Rw", "Ctr", "Ln,w"],
      unsupported: ["DeltaLw"]
    }
  },
  {
    id: "upper-only vinyl floating stack stays on the dry floating-floor formula route instead of the reinforced follow-up surface",
    rows: [
      { materialId: "concrete", thicknessMm: "180", floorRole: "base_structure" },
      { materialId: "generic_resilient_underlay", thicknessMm: "8", floorRole: "resilient_layer" },
      { materialId: "vinyl_flooring", thicknessMm: "3", floorRole: "floor_covering" }
    ],
    expected: {
      basis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      branchDetailMentionsHeavyBareFormula: false,
      branchDetailMentionsHeavyFloatingFormula: true,
      branchDetailMentionsLowConfidenceFallback: false,
      branchDetailMentionsMixedRowConcreteLane: false,
      branchDetailMentionsProxyAirborneCompanions: false,
      branchTone: "warning",
      branchValue: "Dry floating floor",
      candidateIds: null,
      cards: {
        Rw: { status: "live", value: "60 dB" },
        "Ln,w": { status: "live", value: "57.1 dB" },
        DeltaLw: { status: "live", value: "14.7 dB" }
      },
      estimateKind: null,
      supported: ["Rw", "Ctr", "Ln,w", "DeltaLw"],
      unsupported: []
    }
  }
] as const;

function snapshot(testCase: RouteCase): RouteSnapshot {
  const scenario = evaluateScenario({
    id: testCase.id,
    name: testCase.id,
    rows: testCase.rows.map((row, index) => ({ ...row, id: `${testCase.id}-${index + 1}` })),
    source: "current",
    studyMode: "floor",
    targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
  });

  expect(scenario.result, `${testCase.id} should evaluate`).not.toBeNull();
  if (!scenario.result) {
    throw new Error(`${testCase.id} did not evaluate.`);
  }

  const branchSummary = getDynamicCalcBranchSummary({
    result: scenario.result,
    studyMode: "floor"
  });

  const cardOutputs = Object.fromEntries(
    ROUTE_OUTPUTS.map((output) => {
      const card = buildOutputCard({
        output,
        result: scenario.result,
        studyMode: "floor"
      });

      return [output, { status: card.status, value: card.value }];
    })
  ) as Partial<Record<RequestedOutputId, CardSnapshot>>;

  return {
    basis: scenario.result.impact?.basis ?? null,
    branchDetailMentionsHeavyBareFormula: branchSummary.detail.includes("Heavy bare-floor formula is active."),
    branchDetailMentionsHeavyFloatingFormula: branchSummary.detail.includes("Heavy floating-floor formula is active."),
    branchDetailMentionsLowConfidenceFallback: branchSummary.detail.includes("Low-confidence fallback · reinforced concrete is active."),
    branchDetailMentionsMixedRowConcreteLane: branchSummary.detail.includes("mixed nearby-row concrete lane"),
    branchDetailMentionsProxyAirborneCompanions: branchSummary.detail.includes("proxy airborne companions"),
    branchTone: branchSummary.tone,
    branchValue: branchSummary.value,
    candidateIds: scenario.result.impact?.estimateCandidateIds ?? null,
    cards: cardOutputs,
    estimateKind: scenario.result.floorSystemEstimate?.kind ?? null,
    supported: scenario.result.supportedTargetOutputs,
    unsupported: scenario.result.unsupportedTargetOutputs
  };
}

describe("reinforced concrete low-confidence follow-up route card matrix", () => {
  it.each(CASES)("$id", (testCase) => {
    expect(snapshot(testCase)).toEqual(testCase.expected);
  });

  it("keeps the low-confidence follow-up surface distinct from nearby formula-owned reinforced-concrete routes", () => {
    const lowConfidenceVisible = snapshot(CASES[0]);
    const expandedBoardBoundary = snapshot(CASES[1]);
    const dryFloatingFormula = snapshot(CASES[2]);

    expect(lowConfidenceVisible.cards.DeltaLw).toEqual({
      status: "unsupported",
      value: "Not ready"
    });
    expect(lowConfidenceVisible.branchDetailMentionsLowConfidenceFallback).toBe(true);

    expect(expandedBoardBoundary.branchDetailMentionsHeavyBareFormula).toBe(true);
    expect(expandedBoardBoundary.branchDetailMentionsLowConfidenceFallback).toBe(false);

    expect(dryFloatingFormula.branchValue).toBe("Dry floating floor");
    expect(dryFloatingFormula.cards.DeltaLw).toEqual({
      status: "live",
      value: "14.7 dB"
    });
  });
});
