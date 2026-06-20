import type { FloorRole, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { evaluateScenario } from "./scenario-analysis";

type RawRouteCase = {
  expected: {
    basis: string | null;
    estimateKind: string | null;
    floorSystemMatchId: string | null;
    supported: readonly RequestedOutputId[];
  };
  id: string;
  rows: Array<{
    floorRole?: FloorRole;
    id: string;
    materialId: string;
    thicknessMm: number | string;
  }>;
};

const FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const CASES: readonly RawRouteCase[] = [
  {
    id: "raw_concrete_single",
    rows: [{ id: "a", materialId: "concrete", thicknessMm: 150 }],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw_concrete_treatment",
    rows: [
      { id: "a", materialId: "concrete", thicknessMm: 150 },
      { id: "b", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { id: "c", materialId: "screed", thicknessMm: 30 },
      { id: "d", materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw_concrete_ceiling_board_cavity",
    rows: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "furring_channel", thicknessMm: 28 },
      { id: "c", materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw_concrete_ceiling_board_fill",
    rows: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "rockwool", thicknessMm: 90 },
      { id: "c", materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw_concrete_full_ceiling_helper",
    rows: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "rockwool", thicknessMm: 90 },
      { id: "c", materialId: "furring_channel", thicknessMm: 28 },
      { id: "d", materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw_concrete_mixed_order_helper",
    rows: [
      { id: "a", materialId: "furring_channel", thicknessMm: 28 },
      { id: "b", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "c", materialId: "rockwool", thicknessMm: 90 },
      { id: "d", materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw_concrete_split_ceiling_cavity",
    rows: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "c", materialId: "furring_channel", thicknessMm: 14 },
      { id: "d", materialId: "furring_channel", thicknessMm: 14 },
      { id: "e", materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw_concrete_disjoint_board_fill_board_helper",
    rows: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "rockwool", thicknessMm: 45 },
      { id: "c", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "d", materialId: "furring_channel", thicknessMm: 28 },
      { id: "e", materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw_concrete_helper_with_top_finish",
    rows: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "rockwool", thicknessMm: 90 },
      { id: "c", materialId: "furring_channel", thicknessMm: 28 },
      { id: "d", materialId: "concrete", thicknessMm: 150 },
      { id: "e", materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw_heavy_walllike_split_fill_both_sides",
    rows: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 12.5 },
      { id: "b", materialId: "rockwool", thicknessMm: 45 },
      { id: "c", materialId: "concrete", thicknessMm: 120 },
      { id: "d", materialId: "rockwool", thicknessMm: 45 },
      { id: "e", materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw_heavy_walllike_board_fill_board_mixed",
    rows: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 12.5 },
      { id: "b", materialId: "rockwool", thicknessMm: 45 },
      { id: "c", materialId: "gypsum_board", thicknessMm: 12.5 },
      { id: "d", materialId: "concrete", thicknessMm: 120 },
      { id: "e", materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw_steel_joist_helper_fill_board_mixed",
    rows: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "rockwool", thicknessMm: 90 },
      { id: "c", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "d", materialId: "steel_joist_floor", thicknessMm: 250 }
    ],
    expected: {
      basis: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w"]
    }
  },
  {
    id: "raw_concrete_split_full_ceiling_helper",
    rows: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "c", materialId: "rockwool", thicknessMm: 45 },
      { id: "d", materialId: "rockwool", thicknessMm: 45 },
      { id: "e", materialId: "furring_channel", thicknessMm: 14 },
      { id: "f", materialId: "furring_channel", thicknessMm: 14 },
      { id: "g", materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw_open_box_single",
    rows: [{ id: "a", materialId: "open_box_timber_slab", thicknessMm: 370 }],
    expected: {
      basis: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w"]
    }
  },
  {
    id: "raw_open_box_treatment",
    rows: [
      { id: "a", materialId: "ceramic_tile", thicknessMm: 8 },
      { id: "b", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { id: "c", materialId: "screed", thicknessMm: 30 },
      { id: "d", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expected: {
      basis: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w"]
    }
  },
  {
    id: "raw_open_box_ceiling_helper",
    rows: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "rockwool", thicknessMm: 90 },
      { id: "c", materialId: "furring_channel", thicknessMm: 28 },
      { id: "d", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expected: {
      basis: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w"]
    }
  },
  {
    id: "raw_open_box_upper_only_dry",
    rows: [
      { id: "a", materialId: "laminate_flooring", thicknessMm: 8 },
      { id: "b", materialId: "eps_underlay", thicknessMm: 3 },
      { id: "c", materialId: "generic_fill", thicknessMm: 50 },
      { id: "d", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { id: "e", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expected: {
      basis: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w"]
    }
  },
  {
    id: "raw_open_box_split_ceiling_helper",
    rows: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "c", materialId: "rockwool", thicknessMm: 45 },
      { id: "d", materialId: "rockwool", thicknessMm: 45 },
      { id: "e", materialId: "furring_channel", thicknessMm: 14 },
      { id: "f", materialId: "furring_channel", thicknessMm: 14 },
      { id: "g", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expected: {
      basis: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w"]
    }
  },
  {
    id: "raw_hollow_core_single",
    rows: [{ id: "a", materialId: "hollow_core_plank", thicknessMm: 200 }],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw_hollow_core_treatment",
    rows: [
      { id: "a", materialId: "vinyl_flooring", thicknessMm: 5 },
      { id: "b", materialId: "geniemat_rst05", thicknessMm: 5 },
      { id: "c", materialId: "hollow_core_plank", thicknessMm: 200 }
    ],
    expected: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: "pliteq_hcp200_rst05_vinyl_no_ceiling_lab_2026",
      supported: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "walllike_hybrid_concrete_board",
    rows: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 12.5 },
      { id: "b", materialId: "concrete", thicknessMm: 120 },
      { id: "c", materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "walllike_hybrid_concrete_board_fill",
    rows: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 12.5 },
      { id: "b", materialId: "rockwool", thicknessMm: 90 },
      { id: "c", materialId: "concrete", thicknessMm: 120 },
      { id: "d", materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "raw_lightweight_steel_helper_fill_board_mixed",
    rows: [
      { id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "b", materialId: "rockwool", thicknessMm: 90 },
      { id: "c", materialId: "gypsum_board", thicknessMm: 13 },
      { id: "d", materialId: "lightweight_steel_floor", thicknessMm: 250 }
    ],
    expected: {
      basis: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supported: ["R'w", "DnT,w"]
    }
  }
];

describe("raw floor screening route support", () => {
  it("keeps representative raw floor and wall-like cohorts on the same defended route-side support split", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const result = evaluateScenario({
        airborneContext: AIRBORNE_FIELD_CONTEXT,
        id: testCase.id,
        impactFieldContext: IMPACT_FIELD_CONTEXT,
        name: testCase.id,
        rows: testCase.rows.map((row) => ({
          ...row,
          thicknessMm: String(row.thicknessMm)
        })),
        source: "current",
        studyMode: "floor",
        targetOutputs: FIELD_OUTPUTS
      }).result;

      expect(result, `${testCase.id} should evaluate`).not.toBeNull();
      if (!result) {
        throw new Error(`${testCase.id} did not evaluate.`);
      }

      if ((result.impact?.basis ?? null) !== testCase.expected.basis) {
        failures.push(
          `${testCase.id}: expected basis ${testCase.expected.basis ?? "null"}, got ${result.impact?.basis ?? "null"}`
        );
      }

      if ((result.floorSystemEstimate?.kind ?? null) !== testCase.expected.estimateKind) {
        failures.push(
          `${testCase.id}: expected estimate kind ${testCase.expected.estimateKind ?? "null"}, got ${result.floorSystemEstimate?.kind ?? "null"}`
        );
      }

      if ((result.floorSystemMatch?.system.id ?? null) !== testCase.expected.floorSystemMatchId) {
        failures.push(
          `${testCase.id}: expected floor-system id ${testCase.expected.floorSystemMatchId ?? "null"}, got ${result.floorSystemMatch?.system.id ?? "null"}`
        );
      }

      if (JSON.stringify(result.supportedTargetOutputs) !== JSON.stringify(testCase.expected.supported)) {
        failures.push(
          `${testCase.id}: expected supported outputs ${JSON.stringify(testCase.expected.supported)}, got ${JSON.stringify(result.supportedTargetOutputs)}`
        );
      }
    }

    expect(failures).toEqual([]);
  });
});
