import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildDynamicCalculatorCandidateResolverRuntime } from "./dynamic-calculator-candidate-resolver-runtime";
import {
  COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD,
  COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_SELECTED_CANDIDATE_ID,
  COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_WARNING
} from "./dynamic-airborne-company-internal-heavy-composite-wall";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const;
const WALL_FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const;

const ORDINARY_DOUBLE_LEAF = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

function heavyCompositeCase() {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find(
    (entry) => entry.id === "wall-heavy-composite-hint-suppression"
  );

  if (!testCase) {
    throw new Error("wall-heavy-composite-hint-suppression generated case is missing");
  }

  return testCase;
}

describe("company internal heavy-composite wall family physics cleanup", () => {
  it("promotes the complete heavy-composite lab wall from screening fallback to named family physics without moving values", () => {
    const testCase = heavyCompositeCase();
    const result = calculateAssembly(testCase.rows, testCase.labOptions);
    const snapshot = resultSnapshot(result);

    expect(snapshot).toMatchObject({
      c: -1.4,
      ctr: -6.3,
      dynamicFamily: "double_leaf",
      rw: 63,
      rwDb: 63,
      stc: 63,
      supportedTargetOutputs: [...WALL_LAB_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      confidenceScore: 0.6,
      detectedFamily: "double_leaf",
      selectedMethod: "mass_law",
      strategy: "double_leaf_empty_cavity_delegate+heavy_unframed_cavity_cap"
    });
    expect(result.warnings.some((warning: string) => /Dynamic airborne confidence is low/i.test(warning))).toBe(false);
    expect(result.warnings).toContain(COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_WARNING);
    expect(result.airborneBasis).toMatchObject({
      calculationStandard: "engine_double_leaf_cavity",
      curveBasis: "calculated_frequency_curve",
      errorBudgetDb: 8,
      family: "double_leaf",
      kind: "airborne_physics_prediction",
      method: COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      ratingStandard: "ISO 717-1",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
  });

  it("keeps field outputs basis-explicit through the field adapter instead of lab aliasing", () => {
    const testCase = heavyCompositeCase();
    const result = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const snapshot = resultSnapshot(result);

    expect(snapshot).toMatchObject({
      c: -1.4,
      ctr: -6.1,
      dnTA: 60.1,
      dnTw: 61,
      dnW: 60,
      dynamicFamily: "double_leaf",
      rw: 60,
      rwDb: 60,
      rwPrimeDb: 60,
      stc: 60,
      supportedTargetOutputs: [...WALL_FIELD_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(result.dynamicAirborneTrace?.confidenceClass).toBe("medium");
    expect(result.warnings.some((warning: string) => /Dynamic airborne confidence is low/i.test(warning))).toBe(false);
    expect(result.airborneBasis).toMatchObject({
      calculationStandard: "ISO 12354-1",
      errorBudgetDb: 10,
      family: "double_leaf",
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.airborneBasis?.assumptions).toContain(
      `base lab-family method remains ${COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD}`
    );
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
  });

  it("keeps exact source precedence and non-heavy ordinary double leaves out of the heavy-composite basis", () => {
    const testCase = heavyCompositeCase();
    const runtime = calculateAssembly(testCase.rows, testCase.labOptions);
    const exactOverride = buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: testCase.labOptions?.airborneContext,
      layers: testCase.rows,
      route: "wall",
      runtimeSignal: {
        airborneBasis: runtime.airborneBasis,
        detectedFamily: runtime.dynamicAirborneTrace?.detectedFamily,
        runtimeValueMovement: runtime.airborneCandidateResolution?.runtimeValueMovement,
        selectedMethod: runtime.dynamicAirborneTrace?.selectedMethod,
        strategy: runtime.dynamicAirborneTrace?.strategy
      },
      sourceAnchor: {
        applied: true,
        match: {
          id: "company_internal_heavy_composite_exact_lab_row",
          label: "Company internal heavy composite exact lab row",
          metricLabel: "Rw",
          metricValue: 64,
          sourceMode: "lab"
        }
      },
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const ordinary = calculateAssembly(ORDINARY_DOUBLE_LEAF, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(exactOverride.resolution).toMatchObject({
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(exactOverride.resolution.selectedBasis).toMatchObject({
      exactSourceId: "company_internal_heavy_composite_exact_lab_row",
      origin: "measured_exact_full_stack"
    });
    expect(ordinary.airborneBasis?.method).not.toBe(COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD);
    expect(ordinary.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_SELECTED_CANDIDATE_ID
    );
  });
});
