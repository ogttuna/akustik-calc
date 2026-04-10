import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];
const IMPACT_FIELD_OUTPUTS: readonly RequestedOutputId[] = ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"];

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

type GapLedgerCase = {
  expectedField: {
    basis: string | null;
    boundId?: string | null;
    exactId: string | null;
    supported: readonly RequestedOutputId[];
    unsupported: readonly RequestedOutputId[];
  };
  expectedLab: {
    basis: string | null;
    boundId?: string | null;
    exactId: string | null;
    supported: readonly RequestedOutputId[];
    unsupported: readonly RequestedOutputId[];
  };
  id: string;
  layers: readonly LayerInput[];
};

const CASES: readonly GapLedgerCase[] = [
  {
    id: "bare-clt",
    layers: [{ materialId: "clt_panel", thicknessMm: 140 }],
    expectedLab: {
      basis: "predictor_mass_timber_clt_bare_interpolation_estimate",
      boundId: null,
      exactId: null,
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: []
    },
    expectedField: {
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      boundId: null,
      exactId: null,
      supported: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "bare-open-box",
    layers: [{ materialId: "open_box_timber_slab", thicknessMm: 370 }],
    expectedLab: {
      basis: null,
      boundId: null,
      exactId: null,
      supported: ["Rw"],
      unsupported: ["Ln,w", "Ln,w+CI"]
    },
    expectedField: {
      basis: null,
      boundId: null,
      exactId: null,
      supported: [],
      unsupported: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]
    }
  },
  {
    id: "open-box-dry-exact",
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
      boundId: null,
      exactId: "tuas_r5b_open_box_timber_measured_2026",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: []
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      boundId: null,
      exactId: "tuas_r5b_open_box_timber_measured_2026",
      supported: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "open-box-mixed-board-exact",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expectedLab: {
      basis: "open_measured_floor_system_exact_match",
      boundId: null,
      exactId: "tuas_r6a_open_box_timber_measured_2026",
      supported: ["Rw", "Ln,w"],
      unsupported: ["Ln,w+CI"]
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      boundId: null,
      exactId: "tuas_r6a_open_box_timber_measured_2026",
      supported: ["Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["L'nT,50"]
    }
  },
  {
    id: "open-box-staged-upper-package-exact",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 25 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 13 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 3 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expectedLab: {
      basis: "open_measured_floor_system_exact_match",
      boundId: null,
      exactId: "tuas_r10a_open_box_timber_measured_2026",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: []
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      boundId: null,
      exactId: "tuas_r10a_open_box_timber_measured_2026",
      supported: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "open-box-hybrid-lower-geotextile-exact",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
      { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expectedLab: {
      basis: "open_measured_floor_system_exact_match",
      boundId: null,
      exactId: "tuas_r7b_open_box_timber_measured_2026",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: []
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      boundId: null,
      exactId: "tuas_r7b_open_box_timber_measured_2026",
      supported: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "open-box-hybrid-lower-geotextile-finishless-exact",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "upper_fill", materialId: "eps_floor_insulation_board", thicknessMm: 35 },
      { floorRole: "floating_screed", materialId: "geotextile", thicknessMm: 1 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expectedLab: {
      basis: "open_measured_floor_system_exact_match",
      boundId: null,
      exactId: "tuas_r8b_open_box_timber_measured_2026",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: []
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      boundId: null,
      exactId: "tuas_r8b_open_box_timber_measured_2026",
      supported: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "open-box-hybrid-lower-wet-top-exact",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 40 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expectedLab: {
      basis: "open_measured_floor_system_exact_match",
      boundId: null,
      exactId: "tuas_r9b_open_box_timber_measured_2026",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: []
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      boundId: null,
      exactId: "tuas_r9b_open_box_timber_measured_2026",
      supported: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "open-box-hybrid-lower-no-fill-exact",
    layers: [
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 13 },
      { floorRole: "ceiling_cavity", materialId: "tuas_open_box_ceiling_family_a", thicknessMm: 45 },
      { floorRole: "ceiling_cavity", materialId: "resilient_stud_ceiling", thicknessMm: 25 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 370 }
    ],
    expectedLab: {
      basis: "open_measured_floor_system_exact_match",
      boundId: null,
      exactId: "tuas_r2c_open_box_timber_measured_2026",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: []
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      boundId: null,
      exactId: "tuas_r2c_open_box_timber_measured_2026",
      supported: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "clt-x3-staged-upper-exact",
    layers: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 13 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 3 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
    ],
    expectedLab: {
      basis: "open_measured_floor_system_exact_match",
      boundId: null,
      exactId: "tuas_x3_clt140_measured_2026",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: []
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      boundId: null,
      exactId: "tuas_x3_clt140_measured_2026",
      supported: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "clt-c3-staged-upper-exact",
    layers: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 13 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "screed", thicknessMm: 3 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ],
    expectedLab: {
      basis: "open_measured_floor_system_exact_match",
      boundId: null,
      exactId: "tuas_c3_clt260_measured_2026",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: []
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      boundId: null,
      exactId: "tuas_c3_clt260_measured_2026",
      supported: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "clt-x4-heavy-dry-top-exact",
    layers: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 140 }
    ],
    expectedLab: {
      basis: "open_measured_floor_system_exact_match",
      boundId: null,
      exactId: "tuas_x4_clt140_measured_2026",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: []
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      boundId: null,
      exactId: "tuas_x4_clt140_measured_2026",
      supported: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "clt-c4-heavy-dry-top-exact",
    layers: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ],
    expectedLab: {
      basis: "open_measured_floor_system_exact_match",
      boundId: null,
      exactId: "tuas_c4_clt260_measured_2026",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: []
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      boundId: null,
      exactId: "tuas_c4_clt260_measured_2026",
      supported: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "clt-c5-heavy-dry-top-exact",
    layers: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: 8 },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: 3 },
      { floorRole: "upper_fill", materialId: "glasswool_board", thicknessMm: 50 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "floating_screed", materialId: "gypsum_board", thicknessMm: 15 },
      { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 260 }
    ],
    expectedLab: {
      basis: "open_measured_floor_system_exact_match",
      boundId: null,
      exactId: "tuas_c5_clt260_measured_2026",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: []
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      boundId: null,
      exactId: "tuas_c5_clt260_measured_2026",
      supported: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "bare-open-web",
    layers: [{ materialId: "open_web_steel_joist", thicknessMm: 300 }],
    expectedLab: {
      basis: null,
      boundId: null,
      exactId: null,
      supported: ["Rw"],
      unsupported: ["Ln,w", "Ln,w+CI"]
    },
    expectedField: {
      basis: null,
      boundId: null,
      exactId: null,
      supported: [],
      unsupported: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"]
    }
  },
  {
    id: "open-web-exact",
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
      boundId: null,
      exactId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: []
    },
    expectedField: {
      basis: "mixed_exact_plus_estimated_local_guide",
      boundId: null,
      exactId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      supported: ["Ln,w", "L'n,w", "L'nT,w", "L'nT,50"],
      unsupported: []
    }
  },
  {
    id: "open-web-bound",
    layers: [
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
      { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
      { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
      { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
    ],
    expectedLab: {
      basis: "official_floor_system_bound_support",
      boundId: "ubiq_fl33_open_web_steel_300_lab_2026",
      exactId: null,
      supported: ["Rw", "Ln,w"],
      unsupported: ["Ln,w+CI"]
    },
    expectedField: {
      basis: "mixed_bound_plus_estimated_standardized_field_volume_normalization",
      boundId: "ubiq_fl33_open_web_steel_300_lab_2026",
      exactId: null,
      supported: ["Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["L'nT,50"]
    }
  }
];

function getOutputValue(
  result: ReturnType<typeof calculateAssembly>,
  output: RequestedOutputId
): number | null | undefined {
  switch (output) {
    case "Rw":
      return result.floorSystemRatings?.Rw ?? result.metrics.estimatedRwDb;
    case "Ln,w":
      return result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound;
    case "Ln,w+CI":
      return result.impact?.LnWPlusCI;
    case "L'n,w":
      return result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound;
    case "L'nT,w":
      return result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound;
    case "L'nT,50":
      return result.impact?.LPrimeNT50 ?? result.lowerBoundImpact?.LPrimeNT50UpperBound;
    default:
      return undefined;
  }
}

function isInsideBroadCorridor(output: RequestedOutputId, value: number) {
  switch (output) {
    case "Rw":
      return value >= 15 && value <= 95;
    case "Ln,w":
    case "Ln,w+CI":
    case "L'n,w":
    case "L'nT,w":
    case "L'nT,50":
      return value >= 20 && value <= 100;
    default:
      return false;
  }
}

describe("floor source gap ledger contract", () => {
  it("keeps the current supported-vs-fail-closed family split explicit across representative floor cases", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const lab = calculateAssembly(testCase.layers, {
        targetOutputs: LAB_OUTPUTS
      });
      const field = calculateAssembly(testCase.layers, {
        impactFieldContext: IMPACT_FIELD_CONTEXT,
        targetOutputs: IMPACT_FIELD_OUTPUTS
      });

      if (!lab.ok || !field.ok) {
        failures.push(`${testCase.id}: expected both lab and field calculations to stay ok`);
        continue;
      }

      expect(lab.impact?.basis ?? lab.lowerBoundImpact?.basis ?? null).toBe(testCase.expectedLab.basis);
      expect(lab.floorSystemMatch?.system.id ?? null).toBe(testCase.expectedLab.exactId);
      expect(lab.boundFloorSystemMatch?.system.id ?? null).toBe(testCase.expectedLab.boundId ?? null);
      expect(lab.supportedTargetOutputs).toEqual(testCase.expectedLab.supported);
      expect(lab.unsupportedTargetOutputs).toEqual(testCase.expectedLab.unsupported);

      expect(field.impact?.basis ?? field.lowerBoundImpact?.basis ?? null).toBe(testCase.expectedField.basis);
      expect(field.floorSystemMatch?.system.id ?? null).toBe(testCase.expectedField.exactId);
      expect(field.boundFloorSystemMatch?.system.id ?? null).toBe(testCase.expectedField.boundId ?? null);
      expect(field.supportedTargetOutputs).toEqual(testCase.expectedField.supported);
      expect(field.unsupportedTargetOutputs).toEqual(testCase.expectedField.unsupported);

      for (const output of testCase.expectedLab.supported) {
        const value = getOutputValue(lab, output);
        if (!(typeof value === "number" && Number.isFinite(value) && isInsideBroadCorridor(output, value))) {
          failures.push(`${testCase.id} lab: supported output ${output} should stay finite and inside a broad corridor, got ${String(value)}`);
        }
      }

      for (const output of testCase.expectedField.supported) {
        const value = getOutputValue(field, output);
        if (!(typeof value === "number" && Number.isFinite(value) && isInsideBroadCorridor(output, value))) {
          failures.push(`${testCase.id} field: supported output ${output} should stay finite and inside a broad corridor, got ${String(value)}`);
        }
      }

      if (testCase.expectedLab.basis === null && lab.impact) {
        failures.push(`${testCase.id} lab: expected impact lane to stay fail-closed`);
      }

      if (testCase.expectedField.basis === null && field.impact) {
        failures.push(`${testCase.id} field: expected impact continuation to stay fail-closed`);
      }
    }

    expect(failures).toEqual([]);
  });
});
