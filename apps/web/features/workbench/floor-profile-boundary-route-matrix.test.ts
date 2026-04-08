import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { buildOutputCard } from "./simple-workbench-output-model";
import { evaluateScenario } from "./scenario-analysis";

type ScenarioRow = {
  floorRole?: string;
  id: string;
  materialId: string;
  thicknessMm: number | string;
};

type RouteSnapshot = {
  basis: string | null;
  candidateIds: readonly string[] | null;
  estimateKind: string | null;
  floorSystemMatchId: string | null;
  statuses: Record<RequestedOutputId, "live" | "needs_input" | "unsupported">;
};

type BoundaryCase = {
  expected: RouteSnapshot;
  id: string;
  rows: readonly ScenarioRow[];
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

const LIVE_STATUSES: Record<RequestedOutputId, "live" | "needs_input" | "unsupported"> = {
  Rw: "live",
  "R'w": "live",
  "DnT,w": "live",
  "Ln,w": "live",
  "L'n,w": "live",
  "L'nT,w": "live"
};

const FAIL_CLOSED_STATUSES: Record<RequestedOutputId, "live" | "needs_input" | "unsupported"> = {
  Rw: "unsupported",
  "R'w": "live",
  "DnT,w": "live",
  "Ln,w": "unsupported",
  "L'n,w": "needs_input",
  "L'nT,w": "needs_input"
};

function snapshot(id: string, rows: readonly ScenarioRow[]): RouteSnapshot {
  const result = evaluateScenario({
    airborneContext: AIRBORNE_FIELD_CONTEXT,
    id,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    name: id,
    rows: [...rows],
    source: "current",
    studyMode: "floor",
    targetOutputs: FIELD_OUTPUTS
  }).result;

  return {
    basis: result.impact?.basis ?? null,
    candidateIds: result.impact?.estimateCandidateIds ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    statuses: Object.fromEntries(
      FIELD_OUTPUTS.map((output) => [
        output,
        buildOutputCard({
          output,
          result,
          studyMode: "floor"
        }).status
      ])
    ) as RouteSnapshot["statuses"]
  };
}

const CASES: readonly BoundaryCase[] = [
  {
    id: "concrete-upper",
    rows: [
      { floorRole: "base_structure", id: "a", materialId: "concrete", thicknessMm: 150 },
      { floorRole: "resilient_layer", id: "b", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { floorRole: "floating_screed", id: "c", materialId: "screed", thicknessMm: 50 },
      { floorRole: "floor_covering", id: "d", materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: ["regupol_curve8_concrete_tile_lab_2026"],
      estimateKind: "family_general",
      floorSystemMatchId: null,
      statuses: LIVE_STATUSES
    }
  },
  {
    id: "concrete-lower",
    rows: [
      { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", id: "b", materialId: "genieclip_rst", thicknessMm: 90 },
      { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "base_structure", id: "d", materialId: "concrete", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: null,
      statuses: LIVE_STATUSES
    }
  },
  {
    id: "clt-upper",
    rows: [
      { floorRole: "base_structure", id: "a", materialId: "clt_panel", thicknessMm: 145 },
      { floorRole: "resilient_layer", id: "b", materialId: "mw_t_impact_layer_s40", thicknessMm: 20 },
      { floorRole: "upper_fill", id: "c", materialId: "generic_fill", thicknessMm: 70 },
      { floorRole: "floor_covering", id: "d", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 22 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_local_guide",
      candidateIds: ["dataholz_gdmtxn01_dry_clt_lab_2026"],
      estimateKind: "family_archetype",
      floorSystemMatchId: null,
      statuses: LIVE_STATUSES
    }
  },
  {
    id: "clt-lower",
    rows: [
      { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", id: "b", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", id: "c", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "base_structure", id: "d", materialId: "clt_panel", thicknessMm: 260 }
    ],
    expected: {
      basis: null,
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: null,
      statuses: FAIL_CLOSED_STATUSES
    }
  },
  {
    id: "openbox-upper",
    rows: [
      { floorRole: "floor_covering", id: "a", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", id: "b", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", id: "c", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", id: "d", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", id: "e", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expected: {
      basis: null,
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: null,
      statuses: FAIL_CLOSED_STATUSES
    }
  },
  {
    id: "openbox-lower",
    rows: [
      { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", id: "b", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "ceiling_cavity", id: "c", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "base_structure", id: "d", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expected: {
      basis: null,
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: null,
      statuses: FAIL_CLOSED_STATUSES
    }
  },
  {
    id: "openbox-combined",
    rows: [
      { floorRole: "ceiling_board", id: "a", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", id: "b", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", id: "d", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", id: "e", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", id: "f", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", id: "g", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", id: "h", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", id: "i", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expected: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: "tuas_r5b_open_box_timber_measured_2026",
      statuses: LIVE_STATUSES
    }
  },
  {
    id: "openweb-bare",
    rows: [{ floorRole: "base_structure", id: "a", materialId: "open_web_steel_floor", thicknessMm: 300 }],
    expected: {
      basis: null,
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: null,
      statuses: FAIL_CLOSED_STATUSES
    }
  },
  {
    id: "openweb-lower",
    rows: [
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", id: "b", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", id: "c", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", id: "d", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_local_guide",
      candidateIds: [
        "ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026",
        "ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026",
        "ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026"
      ],
      estimateKind: "family_general",
      floorSystemMatchId: null,
      statuses: LIVE_STATUSES
    }
  },
  {
    id: "openweb-combined",
    rows: [
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", id: "b", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", id: "c", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", id: "d", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", id: "e", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", id: "f", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", id: "g", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", id: "h", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    expected: {
      basis: "mixed_exact_plus_estimated_local_guide",
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      statuses: LIVE_STATUSES
    }
  },
  {
    id: "composite-bare",
    rows: [{ floorRole: "base_structure", id: "a", materialId: "composite_steel_deck", thicknessMm: 60 }],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: ["pmc_m1_bare_composite_lab_2026"],
      estimateKind: "family_archetype",
      floorSystemMatchId: null,
      statuses: LIVE_STATUSES
    }
  },
  {
    id: "composite-upper",
    rows: [
      { floorRole: "floor_covering", id: "a", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
      { floorRole: "resilient_layer", id: "b", materialId: "generic_resilient_underlay", thicknessMm: 15 },
      { floorRole: "base_structure", id: "c", materialId: "composite_steel_deck", thicknessMm: 60 }
    ],
    expected: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: "pmc_m1_dry_floating_floor_lab_2026",
      statuses: LIVE_STATUSES
    }
  },
  {
    id: "composite-lower",
    rows: [
      { floorRole: "ceiling_board", id: "a", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", id: "b", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", id: "c", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", id: "d", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure", id: "e", materialId: "composite_steel_deck", thicknessMm: 150 }
    ],
    expected: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: [
        "pmc_m1_bare_composite_lab_2026",
        "pmc_m1_dry_floating_plus_c2x_lab_2026",
        "pmc_m1_dry_floating_plus_c1x_lab_2026",
        "pmc_m1_dry_floating_floor_lab_2026"
      ],
      estimateKind: "low_confidence",
      floorSystemMatchId: null,
      statuses: LIVE_STATUSES
    }
  }
];

describe("floor profile boundary route matrix", () => {
  it.each(CASES)("keeps $id on its defended route lane", ({ expected, id, rows }) => {
    expect(snapshot(id, rows)).toEqual(expected);
  });
});
