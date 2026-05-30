import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneCandidate } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
  GATE_AB_DUPLICATE_LAYER_GROUP_CONTEXT,
  GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
  GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
  GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL,
  GATE_AB_STALE_FLAT_ORDER_CONTEXT,
  GATE_AB_WALL_FIELD_OUTPUTS,
  GATE_AB_WALL_LAB_OUTPUTS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ab";
import { PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTION_STATUS } from "./calculator-personal-use-mvp-coverage-sprint-gate-ad";
import {
  GATE_AE_FLAT_MULTICAVITY_ERROR_BUDGET_DB,
  GATE_AE_FLAT_MULTICAVITY_EXPECTED_METRICS,
  GATE_AE_FLAT_MULTICAVITY_PREVIOUS_SCREENING_METRICS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTION_STATUS,
  summarizePersonalUseMvpCoverageSprintGateAE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ae";
import {
  GATE_AE_FLAT_MULTICAVITY_PREDICTION_STRATEGY,
  GATE_AE_FLAT_MULTICAVITY_PREDICTION_WARNING,
  GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
  GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ae-flat-multicavity";
import { buildDynamicCalculatorRouteInputTopologyAssessment } from "./dynamic-calculator-route-input-topology";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AE = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_LANDED_GATE,
  numericRuntimeBehaviorChange: true,
  previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTION_STATUS,
  routeCardValueChange: true,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTED_NEXT_ACTION,
  selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTED_NEXT_FILE,
  selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTION_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_GATE_AE_SURFACES = [
  "packages/engine/src/dynamic-airborne-gate-ae-flat-multicavity.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ae.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ae-flat-multicavity-solver-broadening-contract.test.ts",
  "packages/engine/src/dynamic-airborne.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "apps/web/features/workbench/flat-multicavity-topology-surface.ts",
  "apps/web/features/workbench/flat-multicavity-topology-surface-parity.test.ts",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-11_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate AE flat multicavity solver broadening", () => {
  it("lands Gate AE as an algorithmic runtime promotion and selects revalidation next", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_AE).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_plan",
      numericRuntimeBehaviorChange: true,
      previousSelectionStatus:
        "gate_ad_personal_use_mvp_broad_revalidation_landed_selected_flat_multicavity_solver_broadening_gate_ae",
      routeCardValueChange: true,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_af_personal_use_mvp_post_flat_multicavity_solver_broadening_revalidation_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-af-post-flat-multicavity-solver-broadening-revalidation-contract.test.ts",
      selectionStatus:
        "gate_ae_personal_use_mvp_flat_multicavity_solver_broadening_landed_selected_revalidation_gate_af",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false
    });
    expect(summarizePersonalUseMvpCoverageSprintGateAE()).toEqual({
      errorBudgetDb: GATE_AE_FLAT_MULTICAVITY_ERROR_BUDGET_DB,
      expectedMetrics: GATE_AE_FLAT_MULTICAVITY_EXPECTED_METRICS,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_LANDED_GATE,
      previousScreeningMetrics: GATE_AE_FLAT_MULTICAVITY_PREVIOUS_SCREENING_METRICS,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AD_SELECTION_STATUS,
      runtimeMethod: GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
      runtimeValueMovement: true,
      selectedCandidateId: GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTION_STATUS,
      solverStrategy: GATE_AE_FLAT_MULTICAVITY_PREDICTION_STRATEGY,
      sourceRowsRequiredForRuntimeSelection: false
    });

    for (const path of REQUIRED_GATE_AE_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete grouped flat multicavity walls from broad screening to the two-cavity solver", () => {
    const assessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
      layers: GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL,
      route: "wall",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });
    const result = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });
    const exactCandidate = result.airborneCandidateResolution?.candidates.find((candidate: AirborneCandidate) =>
      candidate.id.includes("exact_source")
    );
    const calibratedCandidate = result.airborneCandidateResolution?.candidates.find((candidate: AirborneCandidate) =>
      candidate.id.includes("calibrated")
    );

    expect(assessment).toMatchObject({
      missingPhysicalInputs: [],
      routeFamilies: ["triple_leaf_multicavity_airborne"],
      status: "complete_with_defaults"
    });
    expect(result.metrics).toMatchObject(GATE_AE_FLAT_MULTICAVITY_EXPECTED_METRICS);
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: GATE_AE_FLAT_MULTICAVITY_ERROR_BUDGET_DB,
      method: GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      selectedMethod: "triple_leaf_two_cavity_frequency_solver",
      strategy: GATE_AE_FLAT_MULTICAVITY_PREDICTION_STRATEGY
    });
    expect(result.dynamicAirborneTrace?.candidateMethods).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          method: "screening_mass_law_curve_seed_v3",
          rwDb: 35,
          selected: false
        }),
        expect.objectContaining({
          method: "triple_leaf_two_cavity_frequency_solver",
          rwDb: GATE_AE_FLAT_MULTICAVITY_EXPECTED_METRICS.estimatedRwDb,
          selected: true
        })
      ])
    );
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.warnings).toContain(GATE_AE_FLAT_MULTICAVITY_PREDICTION_WARNING);
    expect(exactCandidate).toMatchObject({
      selected: false,
      rejectionReasons: [expect.objectContaining({ code: "missing_source_evidence" })]
    });
    expect(calibratedCandidate).toMatchObject({
      selected: false,
      rejectionReasons: [expect.objectContaining({ code: "missing_source_evidence" })]
    });
  });

  it("keeps existing Gate G full-mineral-wool triple-leaf and hostile explicit topology boundaries out of Gate AE", () => {
    const pinnedResult = calculateAssembly(GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL, {
      airborneContext: GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });
    const staleResult = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: GATE_AB_STALE_FLAT_ORDER_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });
    const duplicateResult = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: GATE_AB_DUPLICATE_LAYER_GROUP_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_LAB_OUTPUTS
    });

    expect(pinnedResult.metrics).toMatchObject({
      estimatedCDb: 1.6,
      estimatedCtrDb: -7.2,
      estimatedRwDb: 53,
      estimatedStc: 64
    });
    expect(pinnedResult.airborneBasis).toMatchObject({
      errorBudgetDb: 8,
      method: "broad_accuracy_wall_triple_leaf_local_substitution_lab_spectrum_adapter_runtime",
      origin: "family_physics_prediction"
    });
    expect(pinnedResult.airborneCandidateResolution?.selectedCandidateId).toBe(
      "candidate_broad_accuracy_wall_triple_leaf_local_substitution_lab_spectrum_adapter_family_physics_prediction"
    );

    for (const result of [staleResult, duplicateResult]) {
      expect(result.airborneBasis?.method).not.toBe(GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD);
      expect(result.airborneCandidateResolution?.selectedCandidateId).not.toBe(
        GATE_AE_FLAT_MULTICAVITY_SELECTED_CANDIDATE_ID
      );
    }
  });

  it("does not alias the lab solver onto field outputs without field-context owners", () => {
    const fieldResult = calculateAssembly(GATE_AB_FLAT_MULTICAVITY_MANY_LAYER_WALL, {
      airborneContext: GATE_AB_COMPLETE_GROUPED_FLAT_CONTEXT,
      calculator: "dynamic",
      targetOutputs: GATE_AB_WALL_FIELD_OUTPUTS
    });

    expect(fieldResult.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["contextMode", "partitionAreaM2", "receivingRoomVolumeM3", "receivingRoomRt60S"],
      origin: "needs_input"
    });
    expect(fieldResult.airborneCandidateResolution?.selectedCandidateId).toBe("candidate_dynamic_needs_input");
    expect(fieldResult.supportedTargetOutputs).toEqual([]);
    expect(fieldResult.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
  });

  it("keeps docs, exports, runner, and web surface aligned with Gate AE closeout", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AE_SELECTED_NEXT_FILE);
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    const webSurface = readRepoFile("apps/web/features/workbench/flat-multicavity-topology-surface.ts");
    const webParity = readRepoFile("apps/web/features/workbench/flat-multicavity-topology-surface-parity.test.ts");

    expect(index).toContain("calculator-personal-use-mvp-coverage-sprint-gate-ae");
    expect(index).toContain("dynamic-airborne-gate-ae-flat-multicavity");
    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-ae-flat-multicavity-solver-broadening-contract.test.ts"
    );
    expect(webSurface).toContain("GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD");
    expect(webParity).toContain("GATE_AE_FLAT_MULTICAVITY_RUNTIME_METHOD");
  });
});
