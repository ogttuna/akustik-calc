import type { ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type RouteSnapshot = {
  cards: Record<string, CardSnapshot>;
  exactMatchId: string | null;
  estimateFitPercent: number | null;
  estimateKind: string | null;
  impactBasis: string | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

type RouteCase = {
  expected: RouteSnapshot;
  id: string;
  impactFieldContext?: ImpactFieldContext;
  rows: readonly Omit<LayerDraft, "id">[];
  targetOutputs: readonly RequestedOutputId[];
  warningIncludes: readonly RegExp[];
};

const LAB_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];

const FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const OPEN_BOX_DRY_FRAGMENTED_SOURCE_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "6" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "7" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "40" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "60" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "3" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "5" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "1" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "2" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "20" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "15" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "15" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "20" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "20" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const OPEN_BOX_DRY_DISJOINT_UPPER_FILL_ROWS: readonly Omit<LayerDraft, "id">[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: "13" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "100" },
  { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: "25" },
  { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
  { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "25" },
  { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "60" },
  { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: "25" },
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: "370" }
];

const CASES: readonly RouteCase[] = [
  {
    id: "r5b-fragmented-source-lab",
    rows: OPEN_BOX_DRY_FRAGMENTED_SOURCE_ROWS,
    targetOutputs: LAB_OUTPUTS,
    expected: {
      cards: {
        Rw: { status: "live", value: "75 dB" },
        "Ln,w": { status: "live", value: "44 dB" },
        "Ln,w+CI": { status: "live", value: "44 dB" },
        DeltaLw: { status: "unsupported", value: "Not ready" }
      },
      exactMatchId: "tuas_r5b_open_box_timber_measured_2026",
      estimateFitPercent: null,
      estimateKind: null,
      impactBasis: "open_measured_floor_system_exact_match",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: ["DeltaLw"]
    },
    warningIncludes: [/curated exact floor-system match active: TUAS R5b/i]
  },
  {
    id: "r5b-fragmented-source-field",
    impactFieldContext: FIELD_CONTEXT,
    rows: OPEN_BOX_DRY_FRAGMENTED_SOURCE_ROWS,
    targetOutputs: FIELD_OUTPUTS,
    expected: {
      cards: {
        Rw: { status: "live", value: "75 dB" },
        "Ln,w": { status: "live", value: "44 dB" },
        "L'n,w": { status: "live", value: "46 dB" },
        "L'nT,w": { status: "live", value: "43.6 dB" },
        "L'nT,50": { status: "live", value: "46.6 dB" }
      },
      exactMatchId: "tuas_r5b_open_box_timber_measured_2026",
      estimateFitPercent: null,
      estimateKind: null,
      impactBasis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      supported: ["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    },
    warningIncludes: [/curated exact floor-system match active: TUAS R5b/i, /live field-side supplement is active/i]
  },
  {
    id: "r5b-disjoint-upper-fill-lab",
    rows: OPEN_BOX_DRY_DISJOINT_UPPER_FILL_ROWS,
    targetOutputs: LAB_OUTPUTS,
    expected: {
      cards: {
        Rw: { status: "live", value: "63.8 dB" },
        "Ln,w": { status: "live", value: "56.3 dB" },
        "Ln,w+CI": { status: "live", value: "57.7 dB" },
        DeltaLw: { status: "unsupported", value: "Not ready" }
      },
      exactMatchId: null,
      estimateFitPercent: 54,
      estimateKind: "family_general",
      impactBasis: "predictor_floor_system_family_general_estimate",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: ["DeltaLw"]
    },
    warningIncludes: [/single-entry floor roles are duplicated: upper fill x2/i, /family general at 54% fit/i]
  },
  {
    id: "r5b-disjoint-upper-fill-field",
    impactFieldContext: FIELD_CONTEXT,
    rows: OPEN_BOX_DRY_DISJOINT_UPPER_FILL_ROWS,
    targetOutputs: FIELD_OUTPUTS,
    expected: {
      cards: {
        Rw: { status: "live", value: "63.8 dB" },
        "Ln,w": { status: "live", value: "56.3 dB" },
        "L'n,w": { status: "live", value: "58.3 dB" },
        "L'nT,w": { status: "live", value: "55.9 dB" },
        "L'nT,50": { status: "live", value: "58.8 dB" }
      },
      exactMatchId: null,
      estimateFitPercent: 54,
      estimateKind: "family_general",
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      supported: ["Rw", "Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    },
    warningIncludes: [/single-entry floor roles are duplicated: upper fill x2/i, /family general at 54% fit/i]
  }
];

function rowsWithIds(id: string, rows: readonly Omit<LayerDraft, "id">[]): LayerDraft[] {
  return rows.map((row, index) => ({
    ...row,
    id: `${id}-${index + 1}`
  }));
}

function snapshot(testCase: RouteCase): {
  route: RouteSnapshot;
  warnings: readonly string[];
} {
  const evaluated = evaluateScenario({
    id: testCase.id,
    impactFieldContext: testCase.impactFieldContext,
    name: testCase.id,
    rows: rowsWithIds(testCase.id, testCase.rows),
    source: "current",
    studyMode: "floor",
    targetOutputs: testCase.targetOutputs
  });

  expect(evaluated.result, `${testCase.id} should evaluate`).not.toBeNull();
  if (!evaluated.result) {
    throw new Error(`${testCase.id} did not evaluate.`);
  }

  return {
    route: {
      cards: Object.fromEntries(
        testCase.targetOutputs.map((output) => {
          const card = buildOutputCard({
            output,
            result: evaluated.result!,
            studyMode: "floor"
          });

          return [output, { status: card.status, value: card.value }];
        })
      ),
      exactMatchId: evaluated.result.floorSystemMatch?.system.id ?? null,
      estimateFitPercent: evaluated.result.floorSystemEstimate?.fitPercent ?? null,
      estimateKind: evaluated.result.floorSystemEstimate?.kind ?? null,
      impactBasis: evaluated.result.impact?.basis ?? null,
      supported: evaluated.result.supportedTargetOutputs,
      unsupported: evaluated.result.unsupportedTargetOutputs
    },
    warnings: evaluated.warnings
  };
}

describe("open-box dry package fragmentation card matrix", () => {
  it("pins R5b fragmented exact and disjoint upper-fill output cards on lab and field surfaces", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const actual = snapshot(testCase);

      if (JSON.stringify(actual.route) !== JSON.stringify(testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual.route)}`);
      }

      for (const pattern of testCase.warningIncludes) {
        if (!actual.warnings.some((warning) => pattern.test(warning))) {
          failures.push(`${testCase.id}: missing warning ${pattern}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
