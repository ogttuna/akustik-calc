import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type AssemblySnapshot = {
  basis: string | null;
  candidateIds: readonly string[] | null;
  estimateKind: string | null;
  floorSystemMatchId: string | null;
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
};

type BoundaryCase = {
  expectedField: AssemblySnapshot;
  expectedLab: AssemblySnapshot;
  id: string;
  layers: readonly LayerInput[];
};

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];
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

function snapshot(
  layers: readonly LayerInput[],
  mode: "lab" | "field"
): AssemblySnapshot {
  const result = calculateAssembly(
    layers,
    mode === "lab"
      ? { targetOutputs: LAB_OUTPUTS }
      : {
          airborneContext: AIRBORNE_FIELD_CONTEXT,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          targetOutputs: FIELD_OUTPUTS
        }
  );

  return {
    basis: result.impact?.basis ?? null,
    candidateIds: result.impact?.estimateCandidateIds ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatch?.system.id ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

const CASES: readonly BoundaryCase[] = [
  {
    id: "concrete upper-only treatment",
    layers: [
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    expectedLab: {
      basis: "predictor_heavy_concrete_published_upper_treatment_estimate",
      candidateIds: ["regupol_curve8_concrete_tile_lab_2026"],
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["Ln,w+CI"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: ["regupol_curve8_concrete_tile_lab_2026"],
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "concrete lower-only treatment",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "genieclip_rst", thicknessMm: 90 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
    ],
    expectedLab: {
      basis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["Ln,w+CI"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "clt upper-only dry package",
    layers: [
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 145 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: 20 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 70 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 22 }
    ],
    expectedLab: {
      basis: "predictor_mass_timber_clt_dataholz_dry_estimate",
      candidateIds: ["dataholz_gdmtxn01_dry_clt_lab_2026"],
      estimateKind: "family_archetype",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupportedTargetOutputs: []
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_local_guide",
      candidateIds: ["dataholz_gdmtxn01_dry_clt_lab_2026"],
      estimateKind: "family_archetype",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "clt lower-only guard",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ],
    expectedLab: {
      basis: null,
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw"],
      unsupportedTargetOutputs: ["Ln,w", "Ln,w+CI"]
    },
    expectedField: {
      basis: null,
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supportedTargetOutputs: ["R'w", "DnT,w"],
      unsupportedTargetOutputs: ["Rw", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "open-box upper-only guard",
    layers: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expectedLab: {
      basis: null,
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw"],
      unsupportedTargetOutputs: ["Ln,w", "Ln,w+CI"]
    },
    expectedField: {
      basis: null,
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supportedTargetOutputs: ["R'w", "DnT,w"],
      unsupportedTargetOutputs: ["Rw", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "open-box lower-only guard",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "ceiling_cavity", materialId: "furring_channel", thicknessMm: 28 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expectedLab: {
      basis: null,
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw"],
      unsupportedTargetOutputs: ["Ln,w", "Ln,w+CI"]
    },
    expectedField: {
      basis: null,
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supportedTargetOutputs: ["R'w", "DnT,w"],
      unsupportedTargetOutputs: ["Rw", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "open-box combined exact lane",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 60 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expectedLab: {
      basis: "open_measured_floor_system_exact_match",
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: "tuas_r5b_open_box_timber_measured_2026",
      supportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupportedTargetOutputs: []
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: "tuas_r5b_open_box_timber_measured_2026",
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "open-web bare guard",
    layers: [{ floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }],
    expectedLab: {
      basis: null,
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw"],
      unsupportedTargetOutputs: ["Ln,w", "Ln,w+CI"]
    },
    expectedField: {
      basis: null,
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: null,
      supportedTargetOutputs: ["R'w", "DnT,w"],
      unsupportedTargetOutputs: ["Rw", "Ln,w", "L'n,w", "L'nT,w"]
    }
  },
  {
    id: "open-web lower-only packaged lane",
    layers: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    expectedLab: {
      basis: "predictor_floor_system_family_general_estimate",
      candidateIds: [
        "ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026",
        "ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026",
        "ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026"
      ],
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupportedTargetOutputs: []
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_local_guide",
      candidateIds: [
        "ubiq_fl26_open_web_steel_300_16mm_exact_lab_2026",
        "ubiq_fl26_open_web_steel_200_16mm_exact_lab_2026",
        "ubiq_fl26_open_web_steel_400_16mm_exact_lab_2026"
      ],
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "open-web combined exact lane",
    layers: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      supportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupportedTargetOutputs: []
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_local_guide",
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "composite bare family lane",
    layers: [{ floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 60 }],
    expectedLab: {
      basis: "predictor_floor_system_family_archetype_estimate",
      candidateIds: ["pmc_m1_bare_composite_lab_2026"],
      estimateKind: "family_archetype",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["Ln,w+CI"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: ["pmc_m1_bare_composite_lab_2026"],
      estimateKind: "family_archetype",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "composite upper-only exact lane",
    layers: [
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 60 }
    ],
    expectedLab: {
      basis: "peer_reviewed_floor_system_exact_match",
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: "pmc_m1_dry_floating_floor_lab_2026",
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["Ln,w+CI"]
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      candidateIds: null,
      estimateKind: null,
      floorSystemMatchId: "pmc_m1_dry_floating_floor_lab_2026",
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "composite lower-only conservative lane",
    layers: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 150 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 150 }
    ],
    expectedLab: {
      basis: "predictor_floor_system_low_confidence_estimate",
      candidateIds: [
        "pmc_m1_bare_composite_lab_2026",
        "pmc_m1_dry_floating_plus_c2x_lab_2026",
        "pmc_m1_dry_floating_plus_c1x_lab_2026",
        "pmc_m1_dry_floating_floor_lab_2026"
      ],
      estimateKind: "low_confidence",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["Ln,w+CI"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      candidateIds: [
        "pmc_m1_bare_composite_lab_2026",
        "pmc_m1_dry_floating_plus_c2x_lab_2026",
        "pmc_m1_dry_floating_plus_c1x_lab_2026",
        "pmc_m1_dry_floating_floor_lab_2026"
      ],
      estimateKind: "low_confidence",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  }
];

describe("floor profile boundary matrix", () => {
  it.each(CASES)("keeps $id on its defended lab and field lane", ({ expectedField, expectedLab, layers }) => {
    expect(snapshot(layers, "lab")).toEqual(expectedLab);
    expect(snapshot(layers, "field")).toEqual(expectedField);
  });
});
