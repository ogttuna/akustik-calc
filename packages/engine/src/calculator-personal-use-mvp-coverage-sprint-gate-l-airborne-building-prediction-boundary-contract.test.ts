import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildDynamicCalculatorRouteInputTopologyAssessment,
  GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS
} from "./dynamic-calculator-route-input-topology";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_PLAN,
  GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_STATUS,
  GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING,
  GATE_L_AIRBORNE_BUILDING_PREDICTION_MISSING_INPUTS
} from "./dynamic-airborne-gate-l-building-prediction-boundary";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_L = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_PLAN,
  numericRuntimeBehaviorChange: false,
  previousLandedGate: "gate_k_personal_use_mvp_airborne_field_context_input_surface_plan",
  runtimeOriginPromotion: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan",
  selectedNextFile:
    "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-m-airborne-building-prediction-input-contract.test.ts",
  selectionStatus: GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_STATUS,
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: true,
  workbenchVisibleBehaviorChange: true
} as const;

const REQUIRED_GATE_L_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-l-airborne-building-prediction-boundary-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-l-building-prediction-boundary.ts",
  "packages/engine/src/dynamic-calculator-route-input-topology.ts",
  "packages/engine/src/calculate-assembly.ts",
  "apps/web/features/workbench/airborne-building-prediction-boundary.test.ts",
  "apps/web/features/workbench/airborne-field-context-input-surface.ts",
  "apps/web/features/workbench/field-airborne-output.ts",
  "docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_L_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_L_HANDOFF.md"
] as const;

const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const WALL_LAB_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];
const GATE_M_BUILDING_PREDICTION_MISSING_INPUTS = [
  "sourceRoomVolumeM3",
  ...GATE_L_AIRBORNE_BUILDING_PREDICTION_MISSING_INPUTS,
  "junctionCouplingLengthM",
  "buildingPredictionOutputBasis"
] as const;

const WALL_FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate L airborne building-prediction boundary", () => {
  it("lands the boundary contract and selects the building-prediction input contract next", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_L).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_l_personal_use_mvp_airborne_building_prediction_boundary_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_k_personal_use_mvp_airborne_field_context_input_surface_plan",
      runtimeOriginPromotion: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-m-airborne-building-prediction-input-contract.test.ts",
      selectionStatus:
        "gate_l_personal_use_mvp_airborne_building_prediction_boundary_landed_selected_building_prediction_input_contract_gate_m",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: true,
      workbenchVisibleBehaviorChange: true
    });

    for (const path of REQUIRED_GATE_L_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("parks complete building-prediction requests until flanking and conservative assumption owners exist", () => {
    const result = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: WALL_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const assessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: WALL_BUILDING_CONTEXT,
      layers: LINED_MASSIVE_WALL,
      route: "wall",
      targetOutputs: WALL_FIELD_OUTPUTS
    });

    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(result.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: [...GATE_M_BUILDING_PREDICTION_MISSING_INPUTS],
      origin: "needs_input"
    });
    expect(result.warnings).toContain(GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING);
    expect(result.warnings).not.toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);
    expect(result.warnings.join("\n")).not.toContain("Airborne field-side overlay active");
    expect(result.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
    expect(result.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);

    expect(assessment).toMatchObject({
      missingPhysicalInputs: [...GATE_M_BUILDING_PREDICTION_MISSING_INPUTS],
      outputBasis: "building_prediction",
      routeFamilies: ["building_prediction_airborne_context"],
      status: "needs_input"
    });
    expect(assessment.inputCompletenessSet[0]?.requiredFields).toEqual([
      ...GATE_M_AIRBORNE_BUILDING_PREDICTION_REQUIRED_PHYSICAL_INPUTS
    ]);
    expect(assessment.prompts.map((prompt) => prompt.fieldId)).toEqual([
      ...GATE_M_BUILDING_PREDICTION_MISSING_INPUTS
    ]);
  });

  it("blocks lab-looking outputs when the requested context is building prediction", () => {
    const result = calculateAssembly(CLT_WALL, {
      airborneContext: WALL_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const assessment = buildDynamicCalculatorRouteInputTopologyAssessment({
      airborneContext: WALL_BUILDING_CONTEXT,
      layers: CLT_WALL,
      route: "wall",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(result.airborneBasis?.missingPhysicalInputs).toEqual([
      ...GATE_M_BUILDING_PREDICTION_MISSING_INPUTS
    ]);
    expect(result.warnings).toContain(GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING);
    expect(assessment).toMatchObject({
      missingPhysicalInputs: [...GATE_M_BUILDING_PREDICTION_MISSING_INPUTS],
      outputBasis: "building_prediction",
      status: "needs_input"
    });
    expect(assessment.inputCompletenessSet[0]?.targetOutputs).toEqual(["Rw", "STC"]);
  });

  it("leaves field-between-rooms Gate I and lab element routes numerically stable", () => {
    const field = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: WALL_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const lab = calculateAssembly(CLT_WALL, {
      airborneContext: { contextMode: "element_lab" },
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(field.metrics.estimatedRwPrimeDb).toBe(58);
    expect(field.metrics.estimatedDnTwDb).toBe(59);
    expect(field.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(field.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(field.warnings).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);
    expect(field.warnings).not.toContain(GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING);

    expect(lab.metrics.estimatedRwDb).toBe(42);
    expect(lab.metrics.estimatedStc).toBe(42);
    expect(lab.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
    expect(lab.airborneBasis?.origin).toBe("family_physics_prediction");
    expect(lab.warnings).not.toContain(GATE_L_AIRBORNE_BUILDING_PREDICTION_BOUNDARY_WARNING);
  });

  it("keeps docs and the current-gate runner aligned with Gate L and Gate M", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content).toContain("gate_l_personal_use_mvp_airborne_building_prediction_boundary_plan");
      expect(content).toContain("gate_m_personal_use_mvp_airborne_building_prediction_input_contract_plan");
      expect(content).toContain("flanking/junction");
      expect(content).toContain("conservative flanking assumption");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-l-airborne-building-prediction-boundary-contract.test.ts"
    );
    expect(runner).toContain("airborne-building-prediction-boundary.test.ts");
  });
});
