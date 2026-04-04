import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

type CoreCoverageCase = {
  expectedField: {
    basis: string;
    estimateKind: string | null;
    floorSystemMatchId: string | null;
    supportedTargetOutputs: readonly RequestedOutputId[];
    unsupportedTargetOutputs: readonly RequestedOutputId[];
  };
  expectedLab: {
    basis: string;
    estimateKind: string | null;
    floorSystemMatchId: string | null;
    supportedTargetOutputs: readonly RequestedOutputId[];
    unsupportedTargetOutputs: readonly RequestedOutputId[];
  };
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

const CASES: readonly CoreCoverageCase[] = [
  {
    id: "reinforced concrete bare floor",
    layers: [{ floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }],
    expectedLab: {
      basis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      estimateKind: null,
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["Ln,w+CI"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "reinforced concrete upper wet treatment",
    layers: [
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay_s30", thicknessMm: 8 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 50 },
      { floorRole: "floor_covering", materialId: "ceramic_tile", thicknessMm: 8 }
    ],
    expectedLab: {
      basis: "predictor_heavy_concrete_published_upper_treatment_estimate",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["Ln,w+CI"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "reinforced concrete ceiling-only treatment",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "genieclip_rst", thicknessMm: 90 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 90 },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: 150 }
    ],
    expectedLab: {
      basis: "predictor_heavy_bare_floor_iso12354_annexc_estimate",
      estimateKind: null,
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["Ln,w+CI"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "CLT bare floor",
    layers: [{ floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 160 }],
    expectedLab: {
      basis: "predictor_mass_timber_clt_bare_interpolation_estimate",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupportedTargetOutputs: []
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "CLT dry upper package",
    layers: [
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 145 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer_s40", thicknessMm: 20 },
      { floorRole: "upper_fill", materialId: "generic_fill", thicknessMm: 70 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 22 }
    ],
    expectedLab: {
      basis: "predictor_mass_timber_clt_dataholz_dry_estimate",
      estimateKind: "family_archetype",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupportedTargetOutputs: []
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_local_guide",
      estimateKind: "family_archetype",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "hollow-core bare floor",
    layers: [
      { floorRole: "base_structure", materialId: "hollow_core_plank", thicknessMm: 200 }
    ],
    expectedLab: {
      basis: "predictor_floor_system_family_general_estimate",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["Ln,w+CI"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "timber bare floor",
    layers: [{ floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 200 }],
    expectedLab: {
      basis: "predictor_floor_system_family_general_estimate",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["Ln,w+CI"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "timber dry upper exact family",
    layers: [
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 240 },
      { floorRole: "resilient_layer", materialId: "mw_t_impact_layer", thicknessMm: 30 },
      { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 25 },
      { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 27 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    expectedLab: {
      basis: "official_floor_system_exact_match",
      estimateKind: null,
      floorSystemMatchId: "dataholz_gdrtxa03b_timber_frame_dry_lab_2026",
      supportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupportedTargetOutputs: []
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_local_guide",
      estimateKind: null,
      floorSystemMatchId: "dataholz_gdrtxa03b_timber_frame_dry_lab_2026",
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "timber ceiling-only treatment",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 60 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 200 },
      { floorRole: "base_structure", materialId: "timber_frame_floor", thicknessMm: 200 }
    ],
    expectedLab: {
      basis: "predictor_floor_system_family_general_estimate",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["Ln,w+CI"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "open-box timber dry exact family",
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
      estimateKind: null,
      floorSystemMatchId: "tuas_r5b_open_box_timber_measured_2026",
      supportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupportedTargetOutputs: []
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      estimateKind: null,
      floorSystemMatchId: "tuas_r5b_open_box_timber_measured_2026",
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "open-web steel ceiling-only treatment",
    layers: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    expectedLab: {
      basis: "predictor_floor_system_family_general_estimate",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupportedTargetOutputs: []
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_local_guide",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "composite bare floor",
    layers: [{ floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 60 }],
    expectedLab: {
      basis: "predictor_floor_system_family_archetype_estimate",
      estimateKind: "family_archetype",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["Ln,w+CI"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: "family_archetype",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  },
  {
    id: "composite vinyl ceiling treatment",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "genieclip_rst", thicknessMm: 100 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 2.5 },
      { floorRole: "resilient_layer", materialId: "geniemat_rst05", thicknessMm: 5 },
      { floorRole: "base_structure", materialId: "composite_steel_deck", thicknessMm: 60 }
    ],
    expectedLab: {
      basis: "predictor_composite_panel_published_interaction_estimate",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "Ln,w"],
      unsupportedTargetOutputs: ["Ln,w+CI"]
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      estimateKind: "family_general",
      floorSystemMatchId: null,
      supportedTargetOutputs: ["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"],
      unsupportedTargetOutputs: []
    }
  }
];

function expectFinite(value: number | null | undefined, label: string) {
  expect(typeof value).toBe("number");
  expect(Number.isFinite(value)).toBe(true);
  expect(value as number).toBeGreaterThanOrEqual(0);
}

describe("floor core coverage matrix", () => {
  it.each(CASES)("keeps representative floor family $id on its defended lab and field posture", (entry) => {
    const lab = calculateAssembly(entry.layers, {
      targetOutputs: LAB_OUTPUTS
    });
    const field = calculateAssembly(entry.layers, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(lab.ok).toBe(true);
    expect(field.ok).toBe(true);

    expect(lab.impact?.basis).toBe(entry.expectedLab.basis);
    expect(lab.floorSystemEstimate?.kind ?? null).toBe(entry.expectedLab.estimateKind);
    expect(lab.floorSystemMatch?.system.id ?? null).toBe(entry.expectedLab.floorSystemMatchId);
    expect(lab.supportedTargetOutputs).toEqual(entry.expectedLab.supportedTargetOutputs);
    expect(lab.unsupportedTargetOutputs).toEqual(entry.expectedLab.unsupportedTargetOutputs);
    expectFinite(lab.floorSystemRatings?.Rw ?? null, `${entry.id} lab Rw`);
    expectFinite(lab.impact?.LnW ?? null, `${entry.id} lab Ln,w`);

    if (entry.expectedLab.supportedTargetOutputs.includes("Ln,w+CI")) {
      expectFinite(lab.impact?.LnWPlusCI ?? null, `${entry.id} lab Ln,w+CI`);
    } else {
      expect(lab.impact?.LnWPlusCI ?? null).toBeNull();
    }

    expect(field.ratings.iso717.descriptor).toBe("R'w");
    expect(field.impact?.basis).toBe(entry.expectedField.basis);
    expect(field.floorSystemEstimate?.kind ?? null).toBe(entry.expectedField.estimateKind);
    expect(field.floorSystemMatch?.system.id ?? null).toBe(entry.expectedField.floorSystemMatchId);
    expect(field.supportedTargetOutputs).toEqual(entry.expectedField.supportedTargetOutputs);
    expect(field.unsupportedTargetOutputs).toEqual(entry.expectedField.unsupportedTargetOutputs);
    expectFinite(field.floorSystemRatings?.Rw ?? null, `${entry.id} field floor-side Rw`);
    expectFinite(field.metrics.estimatedRwPrimeDb ?? null, `${entry.id} field R'w`);
    expectFinite(field.metrics.estimatedDnTwDb ?? null, `${entry.id} field DnT,w`);
    expectFinite(field.impact?.LnW ?? null, `${entry.id} field Ln,w`);
    expectFinite(field.impact?.LPrimeNW ?? null, `${entry.id} field L'n,w`);
    expectFinite(field.impact?.LPrimeNTw ?? null, `${entry.id} field L'nT,w`);
  });
});
