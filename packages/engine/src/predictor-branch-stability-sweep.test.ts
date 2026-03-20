import type { ImpactPredictorInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateImpactOnly } from "./calculate-impact-only";

type BranchSweepVariant = {
  id: string;
  input: ImpactPredictorInput;
  lnwRange: readonly [number, number];
  rwRange?: readonly [number, number];
};

type BranchSweepCase = {
  expectedBasis: string;
  expectedCandidateIds: readonly string[];
  expectedKind: "family_general" | "low_confidence";
  expectedSupportedTargetOutputs: readonly RequestedOutputId[];
  id: string;
  targetOutputs: readonly RequestedOutputId[];
  variants: readonly BranchSweepVariant[];
};

function expectInsideRange(
  value: number | null | undefined,
  range: readonly [number, number],
  label: string
): void {
  expect(typeof value).toBe("number");
  expect(Number.isFinite(value), `${label} should stay finite`).toBe(true);
  expect(value).toBeGreaterThanOrEqual(range[0]);
  expect(value).toBeLessThanOrEqual(range[1]);
}

const BRANCH_SWEEP_CASES: readonly BranchSweepCase[] = [
  {
    id: "concrete_combined_vinyl_elastic_family_general",
    expectedKind: "family_general",
    expectedBasis: "predictor_floor_system_family_general_estimate",
    expectedCandidateIds: [
      "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026",
      "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
      "euracoustics_f1_rigid_ceiling_concrete_lab_2026"
    ],
    targetOutputs: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
    expectedSupportedTargetOutputs: ["Rw", "Ctr", "Ln,w"],
    variants: [
      {
        id: "baseline",
        input: {
          structuralSupportType: "reinforced_concrete",
          impactSystemType: "combined_upper_lower_system",
          baseSlab: { materialClass: "heavy_concrete", thicknessMm: 180, densityKgM3: 2400 },
          resilientLayer: { thicknessMm: 8, dynamicStiffnessMNm3: 35 },
          floorCovering: {
            mode: "material_layer",
            materialClass: "vinyl_flooring",
            thicknessMm: 3,
            densityKgM3: 1400
          },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 120,
            cavityFillThicknessMm: 100,
            boardLayerCount: 2,
            boardThicknessMm: 16
          }
        },
        lnwRange: [50.0, 50.0],
        rwRange: [65.9, 65.9]
      },
      {
        id: "shallower_upper_and_ceiling_package",
        input: {
          structuralSupportType: "reinforced_concrete",
          impactSystemType: "combined_upper_lower_system",
          baseSlab: { materialClass: "heavy_concrete", thicknessMm: 165, densityKgM3: 2400 },
          resilientLayer: { thicknessMm: 6, dynamicStiffnessMNm3: 28 },
          floorCovering: {
            mode: "material_layer",
            materialClass: "vinyl_flooring",
            thicknessMm: 4,
            densityKgM3: 1400
          },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 100,
            cavityFillThicknessMm: 85,
            boardLayerCount: 2,
            boardThicknessMm: 15,
            boardMaterialClass: "firestop_board"
          }
        },
        lnwRange: [50.3, 50.5],
        rwRange: [65.2, 65.4]
      },
      {
        id: "deeper_ceiling_and_softer_resilient_package",
        input: {
          structuralSupportType: "reinforced_concrete",
          impactSystemType: "combined_upper_lower_system",
          baseSlab: { materialClass: "heavy_concrete", thicknessMm: 140, densityKgM3: 2400 },
          resilientLayer: { thicknessMm: 10, dynamicStiffnessMNm3: 32 },
          floorCovering: {
            mode: "material_layer",
            materialClass: "vinyl_flooring",
            thicknessMm: 2.5,
            densityKgM3: 1400
          },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 140,
            cavityFillThicknessMm: 120,
            boardLayerCount: 2,
            boardThicknessMm: 18,
            boardMaterialClass: "firestop_board"
          }
        },
        lnwRange: [50.6, 50.7],
        rwRange: [64.6, 64.8]
      }
    ]
  },
  {
    id: "open_web_steel_suspended_vinyl_family_general",
    expectedKind: "family_general",
    expectedBasis: "predictor_floor_system_family_general_estimate",
    expectedCandidateIds: [
      "ubiq_fl33_open_web_steel_200_lab_2026",
      "ubiq_fl33_open_web_steel_300_lab_2026",
      "ubiq_fl28_open_web_steel_200_exact_lab_2026",
      "ubiq_fl28_open_web_steel_300_exact_lab_2026",
      "ubiq_fl28_open_web_steel_400_exact_lab_2026"
    ],
    targetOutputs: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
    expectedSupportedTargetOutputs: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
    variants: [
      {
        id: "baseline",
        input: {
          structuralSupportType: "steel_joists",
          supportForm: "open_web_or_rolled",
          impactSystemType: "suspended_ceiling_only",
          baseSlab: { thicknessMm: 250 },
          floorCovering: { mode: "material_layer", materialClass: "vinyl_flooring", thicknessMm: 3 },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 120,
            cavityFillThicknessMm: 100,
            boardLayerCount: 2,
            boardThicknessMm: 16
          }
        },
        lnwRange: [51, 51],
        rwRange: [63.1, 63.1]
      },
      {
        id: "lighter_base_and_shallower_ceiling",
        input: {
          structuralSupportType: "steel_joists",
          supportForm: "open_web_or_rolled",
          impactSystemType: "suspended_ceiling_only",
          baseSlab: { thicknessMm: 210 },
          floorCovering: { mode: "material_layer", materialClass: "vinyl_flooring", thicknessMm: 3 },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 95,
            cavityFillThicknessMm: 75,
            boardLayerCount: 2,
            boardThicknessMm: 16
          }
        },
        lnwRange: [51, 51],
        rwRange: [63.1, 63.1]
      },
      {
        id: "deeper_open_web_ceiling",
        input: {
          structuralSupportType: "steel_joists",
          supportForm: "open_web_or_rolled",
          impactSystemType: "suspended_ceiling_only",
          baseSlab: { thicknessMm: 300 },
          floorCovering: { mode: "material_layer", materialClass: "vinyl_flooring", thicknessMm: 2 },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 150,
            cavityFillThicknessMm: 145,
            boardLayerCount: 2,
            boardThicknessMm: 15
          }
        },
        lnwRange: [51, 51],
        rwRange: [63.1, 63.1]
      }
    ]
  },
  {
    id: "composite_suspended_ceiling_published_interaction",
    expectedKind: "family_general",
    expectedBasis: "predictor_composite_panel_published_interaction_estimate",
    expectedCandidateIds: [
      "pmc_m1_dry_floating_plus_c2x_lab_2026",
      "pmc_m1_dry_floating_plus_c1x_lab_2026",
      "pmc_m1_bare_composite_lab_2026"
    ],
    targetOutputs: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
    expectedSupportedTargetOutputs: ["Rw", "Ln,w"],
    variants: [
      {
        id: "baseline",
        input: {
          structuralSupportType: "composite_panel",
          impactSystemType: "suspended_ceiling_only",
          baseSlab: { materialClass: "composite_steel_deck", thicknessMm: 150, densityKgM3: 2350 },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 150,
            cavityFillThicknessMm: 100,
            boardLayerCount: 2,
            boardThicknessMm: 16
          }
        },
        lnwRange: [63.3, 63.3],
        rwRange: [48.6, 48.6]
      },
      {
        id: "single_board_variant",
        input: {
          structuralSupportType: "composite_panel",
          impactSystemType: "suspended_ceiling_only",
          baseSlab: { materialClass: "composite_steel_deck", thicknessMm: 130, densityKgM3: 2350 },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 130,
            cavityFillThicknessMm: 80,
            boardLayerCount: 1,
            boardThicknessMm: 12.5
          }
        },
        lnwRange: [67.2, 67.2],
        rwRange: [46.6, 46.6]
      },
      {
        id: "deeper_ceiling_variant",
        input: {
          structuralSupportType: "composite_panel",
          impactSystemType: "suspended_ceiling_only",
          baseSlab: { materialClass: "composite_steel_deck", thicknessMm: 175, densityKgM3: 2350 },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 180,
            cavityFillThicknessMm: 140,
            boardLayerCount: 2,
            boardThicknessMm: 15
          }
        },
        lnwRange: [61.8, 61.8],
        rwRange: [50.0, 50.0]
      }
    ]
  },
  {
    id: "timber_bare_laminate_low_confidence",
    expectedKind: "low_confidence",
    expectedBasis: "predictor_floor_system_low_confidence_estimate",
    expectedCandidateIds: [
      "knauf_ct2g_timber_nil_lab_2026",
      "knauf_ct2h_timber_nil_lab_2026",
      "knauf_ct3b_timber_nil_lab_2026",
      "knauf_ct2a_timber_nil_lab_2026",
      "knauf_ct2d_timber_nil_lab_2026"
    ],
    targetOutputs: ["Rw", "Ctr", "Ln,w", "CI", "Ln,w+CI"],
    expectedSupportedTargetOutputs: ["Ln,w"],
    variants: [
      {
        id: "baseline",
        input: {
          structuralSupportType: "timber_joists",
          impactSystemType: "bare_floor",
          baseSlab: { thicknessMm: 240 },
          floorCovering: {
            mode: "material_layer",
            materialClass: "laminate_flooring",
            thicknessMm: 9,
            densityKgM3: 850
          }
        },
        lnwRange: [70.4, 70.4]
      },
      {
        id: "lighter_laminate_variant",
        input: {
          structuralSupportType: "timber_joists",
          impactSystemType: "bare_floor",
          baseSlab: { thicknessMm: 220 },
          floorCovering: {
            mode: "material_layer",
            materialClass: "laminate_flooring",
            thicknessMm: 8,
            densityKgM3: 820
          }
        },
        lnwRange: [70.4, 70.4]
      },
      {
        id: "thicker_laminate_variant",
        input: {
          structuralSupportType: "timber_joists",
          impactSystemType: "bare_floor",
          baseSlab: { thicknessMm: 260 },
          floorCovering: {
            mode: "material_layer",
            materialClass: "laminate_flooring",
            thicknessMm: 15,
            densityKgM3: 900
          }
        },
        lnwRange: [70.4, 70.4]
      }
    ]
  }
];

describe("predictor branch stability sweep", () => {
  it("keeps representative predictor-input topology families on the same solver branch across small variations", () => {
    for (const testCase of BRANCH_SWEEP_CASES) {
      for (const variant of testCase.variants) {
        const result = calculateImpactOnly([], {
          impactPredictorInput: variant.input,
          targetOutputs: testCase.targetOutputs
        });

        const label = `${testCase.id} :: ${variant.id}`;
        const expectedUnsupported = testCase.targetOutputs.filter(
          (output) => !testCase.expectedSupportedTargetOutputs.includes(output)
        );

        expect(result.sourceMode, `${label} should stay on predictor_input`).toBe("predictor_input");
        expect(result.floorSystemEstimate?.kind, `${label} should keep the same floor-system estimate kind`).toBe(
          testCase.expectedKind
        );
        expect(result.impact?.basis, `${label} should keep the same predictor basis`).toBe(testCase.expectedBasis);
        expect(result.impact?.estimateCandidateIds, `${label} should keep the same candidate family`).toEqual(
          testCase.expectedCandidateIds
        );
        expect(result.supportedTargetOutputs, `${label} should keep the same supported target outputs`).toEqual(
          testCase.expectedSupportedTargetOutputs
        );
        expect(result.unsupportedTargetOutputs, `${label} should keep the same unsupported target outputs`).toEqual(
          expectedUnsupported
        );
        expect(result.impactPredictorStatus?.implementedFamilyEstimate, `${label} should stay on an implemented family lane`).toBe(true);
        expect(
          result.impactPredictorStatus?.implementedLowConfidenceEstimate,
          `${label} should keep its low-confidence flag coherence`
        ).toBe(testCase.expectedKind === "low_confidence");

        expectInsideRange(result.impact?.LnW, variant.lnwRange, `${label} Ln,w`);

        if (variant.rwRange) {
          expectInsideRange(result.floorSystemRatings?.Rw, variant.rwRange, `${label} Rw`);
        } else {
          expect(result.floorSystemRatings?.Rw ?? null, `${label} should keep proxy airborne floor ratings hidden`).toBeNull();
        }
      }
    }
  });
});
