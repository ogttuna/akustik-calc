import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

type RouteCardSnapshot = {
  cards: Partial<Record<RequestedOutputId, { status: string; value: string }>>;
  exactMatchId: string | null;
  impactBasis: string | null;
  lPrimeNT50: number | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  rw: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type RouteCase = {
  expected: RouteCardSnapshot;
  id: string;
  rows: readonly Omit<LayerDraft, "id">[];
};

const TARGET_OUTPUTS = [
  "Rw",
  "Ln,w",
  "CI",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 50
};

const CASES: readonly RouteCase[] = [
  {
    id: "c2c-combined-exact-anchor",
    rows: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
    ],
    expected: {
      cards: {
        Rw: { status: "live", value: "70 dB" },
        "Ln,w": { status: "live", value: "35 dB" },
        CI: { status: "live", value: "+4 dB" },
        "Ln,w+CI": { status: "live", value: "39 dB" },
        "L'n,w": { status: "live", value: "37 dB" },
        "L'nT,w": { status: "live", value: "35 dB" },
        "L'nT,50": { status: "live", value: "44 dB" }
      },
      exactMatchId: "tuas_c2c_clt260_measured_2026",
      impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: 44,
      lPrimeNTw: 35,
      lPrimeNW: 37,
      lnW: 35,
      lnWPlusCI: 39,
      rw: 70,
      supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "c3c-combined-exact-anchor",
    rows: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: "15" },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
    ],
    expected: {
      cards: {
        Rw: { status: "live", value: "73 dB" },
        "Ln,w": { status: "live", value: "27 dB" },
        CI: { status: "live", value: "+2 dB" },
        "Ln,w+CI": { status: "live", value: "29 dB" },
        "L'n,w": { status: "live", value: "29 dB" },
        "L'nT,w": { status: "live", value: "27 dB" },
        "L'nT,50": { status: "live", value: "43 dB" }
      },
      exactMatchId: "tuas_c3c_clt260_measured_2026",
      impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: 43,
      lPrimeNTw: 27,
      lPrimeNW: 29,
      lnW: 27,
      lnWPlusCI: 29,
      rw: 73,
      supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "c7c-combined-exact-anchor",
    rows: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: "70" },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
      { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: "1" },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: "40" },
      { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: "35" },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: "260" }
    ],
    expected: {
      cards: {
        Rw: { status: "live", value: "75 dB" },
        "Ln,w": { status: "live", value: "30 dB" },
        CI: { status: "live", value: "+5 dB" },
        "Ln,w+CI": { status: "live", value: "35 dB" },
        "L'n,w": { status: "live", value: "32 dB" },
        "L'nT,w": { status: "live", value: "30 dB" },
        "L'nT,50": { status: "live", value: "44 dB" }
      },
      exactMatchId: "tuas_c7c_clt260_measured_2026",
      impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: 44,
      lPrimeNTw: 30,
      lPrimeNW: 32,
      lnW: 30,
      lnWPlusCI: 35,
      rw: 75,
      supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  }
] as const;

function snapshot(testCase: RouteCase): RouteCardSnapshot {
  const evaluated = evaluateScenario({
    id: testCase.id,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    name: testCase.id,
    rows: testCase.rows.map((row, index) => ({
      ...row,
      id: `${testCase.id}-${index + 1}`
    })),
    source: "current",
    studyMode: "floor",
    targetOutputs: TARGET_OUTPUTS
  });

  expect(evaluated.result, `${testCase.id} should evaluate`).not.toBeNull();
  if (!evaluated.result) {
    throw new Error(`${testCase.id} did not evaluate.`);
  }

  const result = evaluated.result;

  return {
    cards: Object.fromEntries(
      TARGET_OUTPUTS.map((output) => {
        const card = buildOutputCard({
          output,
          result,
          studyMode: "floor"
        });

        return [output, { status: card.status, value: card.value }];
      })
    ) as RouteCardSnapshot["cards"],
    exactMatchId: result.floorSystemMatch?.system.id ?? null,
    impactBasis: result.impact?.basis ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? null,
    lnW: result.impact?.LnW ?? null,
    lnWPlusCI: result.impact?.LnWPlusCI ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

describe("clt local combined exact anchor route-card matrix", () => {
  it("pins the remaining exact local CLT combined anchors on the workbench surface", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const actual = snapshot(testCase);

      if (JSON.stringify(actual) !== JSON.stringify(testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual)}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
