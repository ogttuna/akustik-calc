import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  findVerifiedAirborneAssemblyMatch,
  findVerifiedAirborneAssemblyMatchWithLabFallback
} from "./airborne-verified-catalog";
import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const;
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const;

const HEAVY_CORE_CONCRETE_GATE_B_AUDIT = {
  activeSlice: "realistic_layer_combination_coverage_cartography_v1",
  candidateId: "wall.concrete_heavy_core_screening.field",
  generatedCaseId: "wall-screening-concrete",
  gate: "Gate B",
  nextAction:
    "source_formula_and_implementation_path_audit_before_any_runtime_math_change",
  runtimeBehaviorChange: false,
  selectedSurface: "generated_dynamic_case",
  status: "no_runtime_audit_contract_landed"
} as const;

const HEAVY_CORE_CONCRETE_SURFACE_BOUNDARIES = {
  generatedCandidate: {
    authority: "selected Gate A runtime-widening candidate",
    evidenceTier: "screening",
    id: "wall-screening-concrete",
    mayRetuneInThisSlice: true
  },
  workbenchConcretePreset: {
    authority: "existing user-visible screening preset guard",
    evidencePath: "apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts",
    id: "concrete_wall",
    mayRetuneInThisSlice: false
  },
  selectorValuePins: {
    authority: "adjacent drift/value guards only",
    evidencePath: "packages/engine/src/dynamic-airborne-wall-selector-value-pins.test.ts",
    mayRetuneInThisSlice: false
  },
  heavyCompositeSibling: {
    authority: "adjacent double-leaf screening sibling, not the selected target",
    evidenceTier: "screening",
    id: "wall-heavy-composite-hint-suppression",
    mayRetuneInThisSlice: false
  }
} as const;

const HEAVY_CORE_CONCRETE_SOURCE_FORMULA_AUDIT = {
  auditedEvidence: {
    directExternalBenchmarkMatchInCurrentAudit: false,
    exactCatalogMatch: false,
    officialFamilyCandidateNeedsSeparateImport: true,
    localFormulaComponents: [
      "mass_law_candidate_curve",
      "iso_717_curve_rating",
      "field_flanking_overlay",
      "dn_dw_dnt_field_normalization"
    ],
    upstreamFormulaContext: [
      "Acoustic2 dynamic notes describe lined_massive_wall as a family solver, not a measured row",
      "Gyproc wall-lining tables are relevant family candidates, not an imported exact match for this stack",
      "Davy double-leaf research is corridor evidence, not an exact value for this concrete-lined stack",
      "ISO 12354-1/ISO 717-1 describe estimation/rating framework, not a stack-specific source row"
    ]
  },
  blocker:
    "no source row or topology-specific tolerance exists for gypsum_board_12_5_rockwool_50_air_gap_50_concrete_100",
  justifiedEvidenceTierAfterAudit: "screening",
  proposedRuntimeContractStatus: "blocked_until_source_or_bounded_family_rule_is_named",
  runtimeBehaviorChange: false
} as const;

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

describe("wall heavy-core concrete Gate B audit contract", () => {
  it("records that Gate B starts with a no-runtime audit contract before any retune", () => {
    expect(HEAVY_CORE_CONCRETE_GATE_B_AUDIT).toEqual({
      activeSlice: "realistic_layer_combination_coverage_cartography_v1",
      candidateId: "wall.concrete_heavy_core_screening.field",
      generatedCaseId: "wall-screening-concrete",
      gate: "Gate B",
      nextAction:
        "source_formula_and_implementation_path_audit_before_any_runtime_math_change",
      runtimeBehaviorChange: false,
      selectedSurface: "generated_dynamic_case",
      status: "no_runtime_audit_contract_landed"
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md",
      "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts",
      HEAVY_CORE_CONCRETE_SURFACE_BOUNDARIES.workbenchConcretePreset.evidencePath,
      HEAVY_CORE_CONCRETE_SURFACE_BOUNDARIES.selectorValuePins.evidencePath
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins the selected generated heavy-core/concrete field lane before source/formula tightening", () => {
    const testCase = generatedCase("wall-screening-concrete");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const labSnapshot = resultSnapshot(lab);
    const fieldSnapshot = resultSnapshot(field);

    expect(testCase.studyMode).toBe("wall");
    expect(lab.calculatorId).toBe("dynamic");
    expect(field.calculatorId).toBe("dynamic");
    expect(labSnapshot.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(fieldSnapshot.supportedTargetOutputs).toEqual([...FIELD_OUTPUTS]);
    expect(fieldSnapshot.unsupportedTargetOutputs).toEqual([]);

    expect(field.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: "lined_massive_wall",
      selectedMethod: "mass_law",
      strategy: "lined_massive_blend"
    });

    expect(labSnapshot).toMatchObject({
      c: -1.6,
      ctr: -6.5,
      dynamicFamily: "lined_massive_wall",
      rw: 57,
      rwDb: 57,
      stc: 57
    });
    expect(fieldSnapshot).toMatchObject({
      c: -1.6,
      ctr: -6.3,
      dnTA: 54.9,
      dnTw: 56,
      dnW: 55,
      dynamicFamily: "lined_massive_wall",
      rw: 55,
      rwDb: 55,
      rwPrimeDb: 55,
      stc: 55
    });

    expect(field.metrics.estimatedRwPrimeDb).toBeLessThanOrEqual(lab.metrics.estimatedRwDb);
    expect(field.warnings.some((warning: string) => /Dynamic Topology path/i.test(warning))).toBe(true);
    expect(field.warnings.some((warning: string) => /local to this repo/i.test(warning))).toBe(true);
  });

  it("blocks formula or benchmark promotion until a source row or bounded family rule is named", () => {
    const testCase = generatedCase("wall-screening-concrete");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);

    expect(findVerifiedAirborneAssemblyMatch(lab.layers, testCase.labOptions.airborneContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatch(field.layers, testCase.fieldOptions.airborneContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(field.layers, testCase.fieldOptions.airborneContext))
      .toBeNull();

    expect(field.floorSystemMatch).toBeNull();
    expect(field.floorSystemEstimate).toBeNull();
    expect(field.boundFloorSystemMatch).toBeNull();
    expect(field.boundFloorSystemEstimate).toBeNull();
    expect(field.airborneOverlay).toMatchObject({
      detectedFamily: "cavity_wall_surrogate",
      fieldFlankingPenaltyApplied: true,
      fieldFlankingPenaltyDb: 1.8
    });

    expect(field.dynamicAirborneTrace?.candidateMethods.map((entry) => entry.method)).toEqual([
      "screening_mass_law_curve_seed_v3",
      "ks_rw_calibrated",
      "mass_law",
      "sharp",
      "kurtovic"
    ]);
    expect(field.dynamicAirborneTrace?.candidateMethods.find((entry) => entry.selected)).toMatchObject({
      method: "mass_law",
      rwDb: 58
    });
    expect(field.warnings.some((warning: string) => /official|verified catalog|exact row/i.test(warning))).toBe(false);

    expect(HEAVY_CORE_CONCRETE_SOURCE_FORMULA_AUDIT).toEqual({
      auditedEvidence: {
        directExternalBenchmarkMatchInCurrentAudit: false,
        exactCatalogMatch: false,
        officialFamilyCandidateNeedsSeparateImport: true,
        localFormulaComponents: [
          "mass_law_candidate_curve",
          "iso_717_curve_rating",
          "field_flanking_overlay",
          "dn_dw_dnt_field_normalization"
        ],
        upstreamFormulaContext: [
          "Acoustic2 dynamic notes describe lined_massive_wall as a family solver, not a measured row",
          "Gyproc wall-lining tables are relevant family candidates, not an imported exact match for this stack",
          "Davy double-leaf research is corridor evidence, not an exact value for this concrete-lined stack",
          "ISO 12354-1/ISO 717-1 describe estimation/rating framework, not a stack-specific source row"
        ]
      },
      blocker:
        "no source row or topology-specific tolerance exists for gypsum_board_12_5_rockwool_50_air_gap_50_concrete_100",
      justifiedEvidenceTierAfterAudit: "screening",
      proposedRuntimeContractStatus: "blocked_until_source_or_bounded_family_rule_is_named",
      runtimeBehaviorChange: false
    });
  });

  it("keeps adjacent heavy-core surfaces separate from the selected generated candidate", () => {
    const selected = calculateAssembly(
      generatedCase("wall-screening-concrete").rows,
      generatedCase("wall-screening-concrete").fieldOptions
    );
    const sibling = calculateAssembly(
      generatedCase("wall-heavy-composite-hint-suppression").rows,
      generatedCase("wall-heavy-composite-hint-suppression").fieldOptions
    );

    expect(HEAVY_CORE_CONCRETE_SURFACE_BOUNDARIES).toEqual({
      generatedCandidate: {
        authority: "selected Gate A runtime-widening candidate",
        evidenceTier: "screening",
        id: "wall-screening-concrete",
        mayRetuneInThisSlice: true
      },
      workbenchConcretePreset: {
        authority: "existing user-visible screening preset guard",
        evidencePath: "apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts",
        id: "concrete_wall",
        mayRetuneInThisSlice: false
      },
      selectorValuePins: {
        authority: "adjacent drift/value guards only",
        evidencePath: "packages/engine/src/dynamic-airborne-wall-selector-value-pins.test.ts",
        mayRetuneInThisSlice: false
      },
      heavyCompositeSibling: {
        authority: "adjacent double-leaf screening sibling, not the selected target",
        evidenceTier: "screening",
        id: "wall-heavy-composite-hint-suppression",
        mayRetuneInThisSlice: false
      }
    });

    expect(selected.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");
    expect(selected.dynamicAirborneTrace?.strategy).toBe("lined_massive_blend");
    expect(resultSnapshot(selected).rwPrimeDb).toBe(55);

    expect(sibling.dynamicAirborneTrace?.detectedFamily).toBe("double_leaf");
    expect(sibling.dynamicAirborneTrace?.strategy).toBe(
      "double_leaf_empty_cavity_delegate+heavy_unframed_cavity_cap"
    );
    expect(sibling.dynamicAirborneTrace?.confidenceClass).toBe("low");
    expect(resultSnapshot(sibling).rwPrimeDb).toBe(60);
  });
});
