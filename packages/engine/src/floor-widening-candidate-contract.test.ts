import type { ImpactPredictorInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { derivePredictorPublishedFamilyEstimate } from "./predictor-published-family-estimate";

type WideningCandidateCase = {
  expected: {
    basis: string;
    candidateIds: readonly string[];
    kind: "family_archetype" | "family_general" | "low_confidence";
    lnW: number;
    rw: number;
    sourceIds?: readonly string[];
  };
  id: string;
  input: ImpactPredictorInput;
};

const CASES: readonly WideningCandidateCase[] = [
  {
    id: "open-box-basic-archetype",
    input: {
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        thicknessMm: 3
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 13
      }
    },
    expected: {
      basis: "predictor_floor_system_family_archetype_estimate",
      candidateIds: ["tuas_r2b_open_box_timber_measured_2026"],
      kind: "family_archetype",
      lnW: 46,
      rw: 62
    }
  },
  {
    id: "open-box-dry-archetype",
    input: {
      structuralSupportType: "open_box_timber",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 370
      },
      resilientLayer: {
        thicknessMm: 3,
        dynamicStiffnessMNm3: 64
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 50
      },
      floatingScreed: {
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 60
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 13
      }
    },
    expected: {
      basis: "predictor_floor_system_family_archetype_estimate",
      candidateIds: ["tuas_r5b_open_box_timber_measured_2026"],
      kind: "family_archetype",
      lnW: 44,
      rw: 75
    }
  },
  {
    id: "ubiq-open-web-suspended-vinyl",
    input: {
      structuralSupportType: "steel_joists",
      supportForm: "open_web_or_rolled",
      impactSystemType: "suspended_ceiling_only",
      baseSlab: {
        thicknessMm: 250
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "vinyl_flooring",
        thicknessMm: 3
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 120,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 16
      }
    },
    expected: {
      basis: "predictor_floor_system_family_general_estimate",
      candidateIds: [
        "ubiq_fl33_open_web_steel_200_lab_2026",
        "ubiq_fl33_open_web_steel_300_lab_2026",
        "ubiq_fl28_open_web_steel_200_exact_lab_2026",
        "ubiq_fl28_open_web_steel_300_exact_lab_2026",
        "ubiq_fl28_open_web_steel_400_exact_lab_2026"
      ],
      kind: "family_general",
      lnW: 51,
      rw: 63.1,
      sourceIds: [
        "ubiq_fl28_open_web_steel_200_exact_lab_2026",
        "ubiq_fl28_open_web_steel_300_exact_lab_2026",
        "ubiq_fl28_open_web_steel_400_exact_lab_2026"
      ]
    }
  },
  {
    id: "ubiq-open-web-carpet-combined",
    input: {
      structuralSupportType: "steel_joists",
      supportForm: "open_web_or_rolled",
      impactSystemType: "combined_upper_lower_system",
      floorCovering: {
        mode: "material_layer",
        materialClass: "carpet_with_foam_underlay",
        thicknessMm: 10
      }
    },
    expected: {
      basis: "predictor_floor_system_family_general_estimate",
      candidateIds: [
        "ubiq_fl28_open_web_steel_300_exact_lab_2026",
        "ubiq_fl28_open_web_steel_200_exact_lab_2026",
        "ubiq_fl28_open_web_steel_400_exact_lab_2026"
      ],
      kind: "family_general",
      lnW: 51,
      rw: 63.7
    }
  },
  {
    id: "clt-bare-interpolation",
    input: {
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "bare_floor",
      baseSlab: {
        thicknessMm: 140
      }
    },
    expected: {
      basis: "predictor_mass_timber_clt_bare_interpolation_estimate",
      candidateIds: [
        "tuas_x2_clt140_measured_2026",
        "tuas_c2_clt260_measured_2026"
      ],
      kind: "family_general",
      lnW: 64,
      rw: 35
    }
  },
  {
    id: "clt-dry-upper-only",
    input: {
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "dry_floating_floor",
      baseSlab: {
        thicknessMm: 140
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 50
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      }
    },
    expected: {
      basis: "predictor_mass_timber_clt_dry_interaction_estimate",
      candidateIds: ["tuas_x5_clt140_measured_2026"],
      kind: "family_general",
      lnW: 65,
      rw: 55
    }
  },
  {
    id: "clt-dry-combined",
    input: {
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 260
      },
      resilientLayer: {
        thicknessMm: 3
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 50
      },
      floatingScreed: {
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 60
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_rigid_hanger",
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 13
      }
    },
    expected: {
      basis: "predictor_mass_timber_clt_dry_interaction_estimate",
      candidateIds: ["tuas_c5c_clt260_measured_2026"],
      kind: "family_general",
      lnW: 38,
      rw: 75
    }
  },
  {
    id: "dataholz-dry-clt-upper-only",
    input: {
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "dry_floating_floor",
      baseSlab: {
        thicknessMm: 140
      },
      upperFill: {
        materialClass: "elastic_bonded_fill",
        thicknessMm: 60
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 25
      }
    },
    expected: {
      basis: "predictor_mass_timber_clt_dataholz_dry_estimate",
      candidateIds: ["dataholz_gdmtxn01_dry_clt_lab_2026"],
      kind: "family_general",
      lnW: 50.2,
      rw: 62.1
    }
  },
  {
    id: "dataholz-dry-clt-combined",
    input: {
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 140
      },
      upperFill: {
        materialClass: "bonded_chippings",
        thicknessMm: 60
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "dry_floating_gypsum_fiberboard",
        thicknessMm: 25
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 60,
        cavityFillThicknessMm: 60,
        boardLayerCount: 1,
        boardThicknessMm: 15
      }
    },
    expected: {
      basis: "predictor_mass_timber_clt_dataholz_dry_estimate",
      candidateIds: ["dataholz_gdmtxa01a_clt_lab_2026"],
      kind: "family_general",
      lnW: 45.8,
      rw: 66
    }
  },
  {
    id: "dataholz-wet-clt-heavy-floating",
    input: {
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "heavy_floating_floor",
      upperFill: {
        materialClass: "non_bonded_chippings",
        thicknessMm: 120
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 60
      }
    },
    expected: {
      basis: "predictor_floor_system_family_archetype_estimate",
      candidateIds: [
        "dataholz_gdmnxn06_fill_clt_lab_2026",
        "dataholz_gdmnxn05_wet_clt_lab_2026"
      ],
      kind: "family_archetype",
      lnW: 41.9,
      rw: 76.1
    }
  },
  {
    id: "dataholz-wet-clt-suspended",
    input: {
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "dry_floating_floor",
      baseSlab: {
        thicknessMm: 140
      },
      resilientLayer: {
        thicknessMm: 8
      },
      floatingScreed: {
        materialClass: "generic_screed",
        thicknessMm: 50
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "vinyl_flooring",
        thicknessMm: 4
      },
      lowerTreatment: {
        type: "suspended_ceiling_elastic_hanger",
        cavityDepthMm: 65,
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 13,
        boardMaterialClass: "gypsum_board"
      }
    },
    expected: {
      basis: "predictor_floor_system_family_general_estimate",
      candidateIds: [
        "dataholz_gdmnxa02a_00_clt_lab_2026",
        "dataholz_gdmnxa02a_02_clt_lab_2026"
      ],
      kind: "family_general",
      lnW: 49.5,
      rw: 61.5
    }
  }
];

describe("floor widening candidate contract", () => {
  it("keeps the current widening-first and tightening-first floor branches pinned to their audited source rows", () => {
    const failures: string[] = [];

    for (const testCase of CASES) {
      const result = derivePredictorPublishedFamilyEstimate(testCase.input);

      if (!result || !result.impact) {
        failures.push(`${testCase.id}: expected a published-family estimate result`);
        continue;
      }

      const actualSourceIds = result.sourceSystems.map((system) => system.id);
      const expectedSourceIds = testCase.expected.sourceIds ?? testCase.expected.candidateIds;

      if (result.kind !== testCase.expected.kind) {
        failures.push(`${testCase.id}: expected kind ${testCase.expected.kind}, got ${result.kind}`);
      }

      if (result.impact.basis !== testCase.expected.basis) {
        failures.push(`${testCase.id}: expected basis ${testCase.expected.basis}, got ${result.impact.basis}`);
      }

      if (JSON.stringify(result.impact.estimateCandidateIds) !== JSON.stringify(testCase.expected.candidateIds)) {
        failures.push(
          `${testCase.id}: expected candidate ids ${JSON.stringify(testCase.expected.candidateIds)}, got ${JSON.stringify(result.impact.estimateCandidateIds)}`
        );
      }

      if (JSON.stringify(actualSourceIds) !== JSON.stringify(expectedSourceIds)) {
        failures.push(
          `${testCase.id}: expected source ids ${JSON.stringify(expectedSourceIds)}, got ${JSON.stringify(actualSourceIds)}`
        );
      }

      if (result.impact.LnW !== testCase.expected.lnW) {
        failures.push(`${testCase.id}: expected Ln,w ${testCase.expected.lnW}, got ${String(result.impact.LnW)}`);
      }

      if (result.airborneRatings.Rw !== testCase.expected.rw) {
        failures.push(`${testCase.id}: expected Rw ${testCase.expected.rw}, got ${String(result.airborneRatings.Rw)}`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("keeps under-described CLT dry combined shorthand off the TUAS C5c published lane", () => {
    const result = derivePredictorPublishedFamilyEstimate({
      structuralSupportType: "mass_timber_clt",
      impactSystemType: "combined_upper_lower_system",
      baseSlab: {
        thicknessMm: 260
      },
      upperFill: {
        materialClass: "generic_fill",
        thicknessMm: 50
      },
      floorCovering: {
        mode: "material_layer",
        materialClass: "laminate_flooring",
        thicknessMm: 8
      },
      lowerTreatment: {
        type: "suspended_ceiling_rigid_hanger",
        cavityFillThicknessMm: 100,
        boardLayerCount: 2,
        boardThicknessMm: 13
      }
    });

    expect(result).toBeNull();
  });
});
