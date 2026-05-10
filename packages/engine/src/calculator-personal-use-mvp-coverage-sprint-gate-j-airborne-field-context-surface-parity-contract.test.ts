import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
  GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING
} from "./dynamic-airborne-gate-i-airborne-field-context";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_J = {
  apiShapeChange: false,
  evidencePromotion: false,
  landedGate: "gate_j_personal_use_mvp_airborne_field_context_surface_parity_plan",
  numericRuntimeBehaviorChange: false,
  previousLandedGate: "gate_i_personal_use_mvp_airborne_field_context_continuation_plan",
  runtimeOriginPromotion: false,
  selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
  selectedNextAction: "gate_k_personal_use_mvp_airborne_field_context_input_surface_plan",
  selectedNextFile:
    "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-k-airborne-field-context-input-surface-contract.test.ts",
  selectionStatus:
    "gate_j_personal_use_mvp_airborne_field_context_surface_parity_landed_selected_input_surface_gate_k",
  sourceRowsRequiredForRuntimeSelection: false,
  workbenchInputBehaviorChange: false,
  workbenchVisibleBehaviorChange: true
} as const;

const REQUIRED_GATE_J_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts",
  "apps/web/features/workbench/airborne-field-context-surface.ts",
  "apps/web/features/workbench/airborne-field-context-surface-parity.test.ts",
  "apps/web/features/workbench/field-airborne-output.ts",
  "apps/web/features/workbench/field-airborne-provenance.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/simple-workbench-method-dossier.ts",
  "apps/web/features/workbench/simple-workbench-corridor-dossier.ts",
  "apps/web/features/workbench/validation-regime.ts",
  "apps/web/app/api/estimate/route.ts",
  "docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_J_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-10_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_J_HANDOFF.md"
] as const;

const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const WALL_LAB_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

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

const GROUPED_TRIPLE_LEAF_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
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

const GROUPED_TRIPLE_LEAF_FIELD_CONTEXT: AirborneContext = {
  ...WALL_FIELD_CONTEXT,
  wallTopology: GROUPED_TRIPLE_LEAF_CONTEXT.wallTopology
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate J airborne field-context surface parity", () => {
  it("lands surface parity without changing Gate I runtime values and selects Gate K input surface work", () => {
    expect(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_J).toEqual({
      apiShapeChange: false,
      evidencePromotion: false,
      landedGate: "gate_j_personal_use_mvp_airborne_field_context_surface_parity_plan",
      numericRuntimeBehaviorChange: false,
      previousLandedGate: "gate_i_personal_use_mvp_airborne_field_context_continuation_plan",
      runtimeOriginPromotion: false,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: "gate_k_personal_use_mvp_airborne_field_context_input_surface_plan",
      selectedNextFile:
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-k-airborne-field-context-input-surface-contract.test.ts",
      selectionStatus:
        "gate_j_personal_use_mvp_airborne_field_context_surface_parity_landed_selected_input_surface_gate_k",
      sourceRowsRequiredForRuntimeSelection: false,
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: true
    });

    for (const path of REQUIRED_GATE_J_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps complete field-context grouped, lined, and CLT examples on the same Gate I basis", () => {
    const cases = [
      {
        context: WALL_FIELD_CONTEXT,
        dnt: 59,
        errorBudgetDb: 8,
        layers: LINED_MASSIVE_WALL,
        rwPrime: 58
      },
      {
        context: WALL_FIELD_CONTEXT,
        dnt: 41,
        errorBudgetDb: 8,
        layers: CLT_WALL,
        rwPrime: 40
      },
      {
        context: GROUPED_TRIPLE_LEAF_FIELD_CONTEXT,
        dnt: 51,
        errorBudgetDb: 7,
        layers: GROUPED_TRIPLE_LEAF_STACK,
        rwPrime: 50
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
        selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
        selectedOrigin: "family_physics_prediction"
      });
      expect(result.airborneBasis).toMatchObject({
        calculationStandard: "ISO 12354-1",
        errorBudgetDb: testCase.errorBudgetDb,
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        origin: "family_physics_prediction",
        ratingStandard: "ISO 717-1",
        toleranceClass: "uncalibrated_prediction"
      });
      expect(result.warnings).toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);
    }
  });

  it("keeps missing field context, building prediction, and lab outputs outside the Gate J field-surface claim", () => {
    const missingContext = calculateAssembly(GROUPED_TRIPLE_LEAF_STACK, {
      airborneContext: GROUPED_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const building = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: WALL_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_FIELD_OUTPUTS
    });
    const lab = calculateAssembly(CLT_WALL, {
      airborneContext: WALL_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(missingContext.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(missingContext.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(missingContext.airborneBasis?.missingPhysicalInputs).toEqual([
      "contextMode",
      "partitionAreaM2",
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);
    expect(missingContext.warnings).not.toContain(GATE_I_AIRBORNE_FIELD_CONTEXT_WARNING);

    expect(building.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
    expect(building.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);

    expect(lab.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
    );
    expect(lab.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(lab.metrics.estimatedRwDb).toBe(42);
  });

  it("keeps docs and the current-gate runner aligned with Gate J and next Gate K", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const text = readRepoFile(path);

      expect(text, path).toContain(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_J.selectionStatus);
      expect(text, path).toContain(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_J.selectedNextFile);
      expect(text, path).toContain(MODEL_FIRST_PERSONAL_USE_MVP_COVERAGE_GATE_J.selectedNextAction);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts"
    );
    expect(runner).toContain("features/workbench/airborne-field-context-surface-parity.test.ts");
  });
});
