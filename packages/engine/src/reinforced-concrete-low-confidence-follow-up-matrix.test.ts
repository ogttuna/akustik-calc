import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";

type DynamicResult = ReturnType<typeof calculateAssembly> | ReturnType<typeof calculateImpactOnly>;

type FollowUpSnapshot = {
  candidateIds: readonly string[] | null;
  deltaLw: number | null;
  estimateKind: string | null;
  fitPercent: number | null;
  impactBasis: string | null;
  implementedFamilyEstimate: boolean | null;
  implementedFormulaEstimate: boolean | null;
  implementedLowConfidenceEstimate: boolean | null;
  inputMode: string | null;
  lnW: number | null;
  rw: number | null;
  rwCtr: number | null;
  supported: readonly string[];
  unsupported: readonly string[];
};

type FollowUpCase = {
  evaluate: () => DynamicResult;
  expected: FollowUpSnapshot;
  id: string;
};

function snapshot(result: DynamicResult): FollowUpSnapshot {
  return {
    candidateIds: result.impact?.estimateCandidateIds ?? null,
    deltaLw: result.impact?.DeltaLw ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? null,
    fitPercent: result.floorSystemEstimate?.fitPercent ?? null,
    impactBasis: result.impact?.basis ?? null,
    implementedFamilyEstimate: result.impactPredictorStatus?.implementedFamilyEstimate ?? null,
    implementedFormulaEstimate: result.impactPredictorStatus?.implementedFormulaEstimate ?? null,
    implementedLowConfidenceEstimate: result.impactPredictorStatus?.implementedLowConfidenceEstimate ?? null,
    inputMode: result.impactPredictorStatus?.inputMode ?? null,
    lnW: result.impact?.LnW ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    rwCtr: result.floorSystemRatings?.RwCtr ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs
  };
}

const CASES: readonly FollowUpCase[] = [
  {
    id: "explicit predictor input now parks reinforced-concrete combined impact as needs-input",
    evaluate: () =>
      calculateImpactOnly([], {
        impactPredictorInput: {
          structuralSupportType: "reinforced_concrete",
          impactSystemType: "combined_upper_lower_system",
          baseSlab: { materialClass: "heavy_concrete", thicknessMm: 180, densityKgM3: 2400 },
          resilientLayer: { thicknessMm: 8, dynamicStiffnessMNm3: 35 },
          floorCovering: { mode: "material_layer", materialClass: "vinyl_flooring", thicknessMm: 3, densityKgM3: 1400 },
          lowerTreatment: {
            type: "suspended_ceiling_elastic_hanger",
            cavityDepthMm: 120,
            cavityFillThicknessMm: 100,
            boardLayerCount: 2,
            boardThicknessMm: 16
          }
        } as never,
        targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
      }),
    expected: {
      candidateIds: null,
      deltaLw: null,
      estimateKind: null,
      fitPercent: null,
      impactBasis: null,
      implementedFamilyEstimate: false,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: false,
      inputMode: "explicit_predictor_input",
      lnW: null,
      rw: 60,
      rwCtr: 53.8,
      supported: [],
      unsupported: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
    }
  },
  {
    id: "visible layer derivation preserves airborne Rw/Ctr but parks reinforced-concrete impact as needs-input",
    evaluate: () =>
      calculateAssembly(
        [
          { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 },
          { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
          { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
          { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 120 },
          { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 }
        ] as never,
        {
          targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
        }
      ),
    expected: {
      candidateIds: null,
      deltaLw: null,
      estimateKind: null,
      fitPercent: null,
      impactBasis: null,
      implementedFamilyEstimate: false,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: false,
      inputMode: "derived_from_visible_layers",
      lnW: null,
      rw: 60,
      rwCtr: 53.8,
      supported: ["Rw", "Ctr"],
      unsupported: ["Ln,w", "DeltaLw"]
    }
  },
  {
    id: "expanded board schedule also parks combined impact instead of falling through to bare-floor impact",
    evaluate: () =>
      calculateAssembly(
        [
          { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 },
          { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
          { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
          { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 120 },
          { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 },
          { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 8 }
        ] as never,
        {
          targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
        }
      ),
    expected: {
      candidateIds: null,
      deltaLw: null,
      estimateKind: null,
      fitPercent: null,
      impactBasis: null,
      implementedFamilyEstimate: false,
      implementedFormulaEstimate: false,
      implementedLowConfidenceEstimate: false,
      inputMode: "derived_from_visible_layers",
      lnW: null,
      rw: 60,
      rwCtr: 53.8,
      supported: ["Rw", "Ctr"],
      unsupported: ["Ln,w", "DeltaLw"]
    }
  },
  {
    id: "upper-only vinyl floating floor stays on the heavy-floating formula corridor instead of the reinforced low-confidence follow-up lane",
    evaluate: () =>
      calculateImpactOnly([], {
        impactPredictorInput: {
          structuralSupportType: "reinforced_concrete",
          impactSystemType: "heavy_floating_floor",
          referenceFloorType: "heavy_standard",
          baseSlab: { materialClass: "heavy_concrete", thicknessMm: 180, densityKgM3: 2400 },
          resilientLayer: { thicknessMm: 8, dynamicStiffnessMNm3: 35 },
          floorCovering: { mode: "material_layer", materialClass: "vinyl_flooring", thicknessMm: 3, densityKgM3: 1400 }
        } as never,
        targetOutputs: ["Rw", "Ctr", "Ln,w", "DeltaLw"]
      }),
    expected: {
      candidateIds: null,
      deltaLw: 7,
      estimateKind: null,
      fitPercent: null,
      impactBasis: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      implementedFamilyEstimate: false,
      implementedFormulaEstimate: true,
      implementedLowConfidenceEstimate: false,
      inputMode: "explicit_predictor_input",
      lnW: 64.8,
      rw: 60,
      rwCtr: 53.7,
      supported: ["Ln,w", "DeltaLw"],
      unsupported: ["Rw", "Ctr"]
    }
  }
] as const;

describe("reinforced concrete low-confidence follow-up matrix", () => {
  it.each(CASES)("$id", ({ evaluate, expected }) => {
    expect(snapshot(evaluate())).toEqual(expected);
  });

  it("removes the guarded low-confidence corridor without collapsing nearby formula-owned lanes", () => {
    const explicitPredictor = snapshot(CASES[0].evaluate());
    const derivedVisible = snapshot(CASES[1].evaluate());
    const expandedBoardBoundary = snapshot(CASES[2].evaluate());
    const heavyFloatingFormula = snapshot(CASES[3].evaluate());

    expect(explicitPredictor.implementedLowConfidenceEstimate).toBe(false);
    expect(explicitPredictor.impactBasis).toBeNull();
    expect(explicitPredictor.supported).toEqual([]);

    expect(derivedVisible.implementedLowConfidenceEstimate).toBe(false);
    expect(derivedVisible.inputMode).toBe("derived_from_visible_layers");
    expect(derivedVisible.supported).toEqual(["Rw", "Ctr"]);

    expect(expandedBoardBoundary.impactBasis).toBeNull();
    expect(expandedBoardBoundary.candidateIds).toBeNull();
    expect(expandedBoardBoundary.inputMode).toBe("derived_from_visible_layers");
    expect(expandedBoardBoundary.implementedLowConfidenceEstimate).toBe(false);

    expect(heavyFloatingFormula.impactBasis).toBe("predictor_heavy_floating_floor_iso12354_annexc_estimate");
    expect(heavyFloatingFormula.deltaLw).toBe(7);
    expect(heavyFloatingFormula.implementedLowConfidenceEstimate).toBe(false);
  });
});
