import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildDynamicCalculatorRouteInputTopologyAssessment } from "./dynamic-calculator-route-input-topology";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-field-context-harmonization";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING
} from "./dynamic-airborne-gate-i-airborne-field-context";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_K = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: "gate_k_personal_use_mvp_airborne_field_context_input_surface_plan",
  numericRuntimeBehaviorChange: false,
  previousLandedGate: "gate_j_personal_use_mvp_airborne_field_context_surface_parity_plan",
  runtimeOriginPromotion: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_l_personal_use_mvp_airborne_building_prediction_boundary_plan",
  selectedNextFile:
    "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-l-airborne-building-prediction-boundary-contract.test.ts",
  selectionStatus:
    "gate_k_personal_use_mvp_airborne_field_context_input_surface_landed_selected_building_prediction_boundary_gate_l",
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: true,
  workbenchVisibleBehaviorChange: true
} as const;

const REQUIRED_GATE_K_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-k-airborne-field-context-input-surface-contract.test.ts",
  "apps/web/features/workbench/airborne-field-context-input-surface.ts",
  "apps/web/features/workbench/airborne-field-context-input-surface.test.ts",
  "apps/web/features/workbench/scenario-analysis.ts",
  "apps/web/features/workbench/simple-workbench-shell.tsx",
  "apps/web/features/workbench/simple-workbench-route-panel.tsx",
  "apps/web/features/workbench/guided-output-unlocks.ts",
  "apps/web/features/workbench/field-airborne-output.ts",
  "docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_K_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_K_HANDOFF.md"
] as const;

const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const WALL_LAB_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];

const WALL_FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
};

const WALL_FIELD_CONTEXT_MISSING_RT60: AirborneContext = {
  ...WALL_FIELD_CONTEXT,
  receivingRoomRt60S: undefined
};

const WALL_BUILDING_CONTEXT: AirborneContext = {
  ...WALL_FIELD_CONTEXT,
  contextMode: "building_prediction",
  junctionQuality: "good"
};

const LINED_MASSIVE_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const CLT_WALL: readonly LayerInput[] = [
  { materialId: "clt_panel", thicknessMm: 120 }
] as const;

const GROUPED_TRIPLE_LEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const GROUPED_TRIPLE_LEAF_FIELD_CONTEXT: AirborneContext = {
  ...WALL_FIELD_CONTEXT,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate K airborne field-context input surface", () => {
  it("lands first-class input-surface ownership and selects the building-prediction boundary next", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_K).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_k_personal_use_mvp_airborne_field_context_input_surface_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_j_personal_use_mvp_airborne_field_context_surface_parity_plan",
      runtimeOriginPromotion: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_l_personal_use_mvp_airborne_building_prediction_boundary_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-l-airborne-building-prediction-boundary-contract.test.ts",
      selectionStatus:
        "gate_k_personal_use_mvp_airborne_field_context_input_surface_landed_selected_building_prediction_boundary_gate_l",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: true,
      workbenchVisibleBehaviorChange: true
    });

    for (const path of REQUIRED_GATE_K_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps complete UI-owned field context on the owned field runtime values", () => {
    const cases = [
      {
        candidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
        context: WALL_FIELD_CONTEXT,
        dnt: 59,
        errorBudgetDb: 8,
        layers: LINED_MASSIVE_WALL,
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        rwPrime: 58,
        warning: GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING
      },
      {
        candidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
        context: WALL_FIELD_CONTEXT,
        dnt: 41,
        errorBudgetDb: 8,
        layers: CLT_WALL,
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        rwPrime: 40,
        warning: GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING
      },
      {
        candidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
        context: GROUPED_TRIPLE_LEAF_FIELD_CONTEXT,
        dnt: 53,
        errorBudgetDb: 10,
        layers: GROUPED_TRIPLE_LEAF_STACK,
        method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_RUNTIME_METHOD,
        rwPrime: 52,
        warning: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_FIELD_CONTEXT_WARNING
      }
    ] as const;

    for (const testCase of cases) {
      const result = calculateAssembly(testCase.layers, {
        airborneContext: testCase.context,
        calculator: "dynamic",
        targetOutputs: WALL_FIELD_OUTPUTS
      });

      expect(result.metrics.estimatedRwPrimeDb).toBe(testCase.rwPrime);
      expect(result.metrics.estimatedDnTwDb).toBe(testCase.dnt);
      expect(result.airborneCandidateResolution).toMatchObject({
        selectedCandidateId: testCase.candidateId,
        selectedOrigin: "family_physics_prediction"
      });
      expect(result.airborneBasis).toMatchObject({
        errorBudgetDb: testCase.errorBudgetDb,
        method: testCase.method,
        origin: "family_physics_prediction"
      });
      expect(result.warnings).toContain(testCase.warning);
    }
  });

  it("treats missing RT60 as a physical input blocker even if legacy sidecar metrics are still computable", () => {
    const missingRt60 = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: WALL_FIELD_CONTEXT_MISSING_RT60,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const assessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: WALL_FIELD_CONTEXT_MISSING_RT60,
      layers: LINED_MASSIVE_WALL,
      route: "wall",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const completeAssessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: WALL_FIELD_CONTEXT,
      layers: LINED_MASSIVE_WALL,
      route: "wall",
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(missingRt60.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(missingRt60.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["receivingRoomRt60S"],
      origin: "needs_input"
    });
    expect(missingRt60.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(missingRt60.warnings).not.toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);

    expect(assessment).toMatchObject({
      missingPhysicalInputs: ["receivingRoomRt60S"],
      outputBasis: "field_apparent",
      status: "needs_input"
    });
    expect(assessment.inputCompletenessSet[0]?.requiredFields).toEqual([
      "contextMode",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);
    expect(completeAssessment).toMatchObject({
      missingPhysicalInputs: [],
      outputBasis: "field_apparent",
      status: "complete"
    });
  });

  it("keeps building prediction and lab outputs outside the Gate K field-between-rooms surface claim", () => {
    const building = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: WALL_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const lab = calculateAssembly(CLT_WALL, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(building.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
    expect(building.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(lab.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
    expect(lab.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
  });

  it("keeps docs and the current-gate runner aligned with Gate K and next Gate L", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);

      expect(text, path).toContain(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_K.selectionStatus);
      expect(text, path).toContain(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_K.selectedNextFile);
      expect(text, path).toContain(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_K.selectedNextAction);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-k-airborne-field-context-input-surface-contract.test.ts"
    );
    expect(runner).toContain("features/workbench/airborne-field-context-input-surface.test.ts");
  });
});
