import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildPersonalUseMvpCoverageSprintGateASContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-as";
import {
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ar";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB } from "./dynamic-airborne-gate-o-building-prediction-formula-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const BUILDING_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const BROAD_WALL_OUTPUTS = ["Rw", "STC", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const COMPLETE_BUILDING_CONTEXT: AirborneContext = {
  airtightness: "good",
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2700,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.55,
  receivingRoomVolumeM3: 42,
  sourceRoomVolumeM3: 38
};

const PARTIAL_BUILDING_CONTEXT: AirborneContext = {
  ...COMPLETE_BUILDING_CONTEXT,
  receivingRoomRt60S: undefined,
  receivingRoomVolumeM3: undefined
};

const LINED_MASSIVE_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const REQUIRED_GATE_AS_SURFACES = [
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-as.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-as-airborne-building-prediction-surface-parity-contract.test.ts",
  "apps/web/features/workbench/airborne-building-prediction-surface.ts",
  "apps/web/features/workbench/airborne-building-prediction-surface-parity.test.ts",
  "apps/web/features/workbench/field-airborne-output.ts",
  "apps/web/features/workbench/field-airborne-provenance.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/simple-workbench-method-dossier.ts",
  "apps/web/features/workbench/simple-workbench-corridor-dossier.ts",
  "apps/web/features/workbench/dynamic-calc-branch.ts",
  "apps/web/features/workbench/target-output-status.ts",
  "apps/web/features/workbench/compose-workbench-report.ts",
  "apps/web/app/api/estimate/route.ts",
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_HANDOFF.md",
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
  "docs/calculator/CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_HANDOFF.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("Personal-Use MVP Coverage Sprint Gate AS airborne building-prediction surface/API/report parity", () => {
  it("lands Gate AS as visible parity only and selects acceptance matrix refresh", () => {
    expect(buildPersonalUseMvpCoverageSprintGateASContract()).toEqual({
      apiShapeChange: false,
      candidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      evidencePromotion: false,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_LANDED_GATE,
      numericRuntimeBehaviorChange: false,
      previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_LANDED_GATE,
      previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AR_SELECTION_STATUS,
      runtimeMethod: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedImplementationSlice: "calculator_model_first_physics_prediction_pivot_v1",
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTION_STATUS,
      sourceRowsRequiredForRuntimeSelection: false,
      visibleSurfaceIds: [
        "output_cards",
        "route_posture",
        "scenario_corridor_summary",
        "method_dossier",
        "corridor_dossier",
        "saved_replay",
        "markdown_report",
        "estimate_api_payload"
      ],
      workbenchInputBehaviorChange: false,
      workbenchVisibleBehaviorChange: true
    });

    for (const path of REQUIRED_GATE_AS_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps Gate AR runtime values unchanged while requiring visible surfaces to carry method, candidate, and budget", () => {
    const result = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: COMPLETE_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BROAD_WALL_OUTPUTS
    });

    expect(result.metrics.estimatedRwPrimeDb).toBe(58);
    expect(result.metrics.estimatedDnTwDb).toBe(59);
    expect(result.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(result.unsupportedTargetOutputs).toEqual(["Rw", "STC"]);
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: GATE_O_AIRBORNE_BUILDING_PREDICTION_TOLERANCE_DB,
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.warnings).toContain(GATE_AR_AIRBORNE_BUILDING_PREDICTION_WARNING);
  });

  it("keeps missing building context outside Gate AS surface claims", () => {
    const result = calculateAssembly(LINED_MASSIVE_WALL, {
      airborneContext: PARTIAL_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_OUTPUTS
    });

    expect(result.supportedTargetOutputs).toEqual([]);
    expect(result.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(result.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(result.airborneBasis?.method).not.toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(result.airborneBasis?.missingPhysicalInputs).toEqual([
      "receivingRoomVolumeM3",
      "receivingRoomRt60S"
    ]);
  });

  it("keeps docs and the current-gate runner aligned with Gate AS closeout and Gate AT selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_LANDED_GATE);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTION_STATUS);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AS_SELECTED_NEXT_FILE);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "calculator-personal-use-mvp-coverage-sprint-gate-as-airborne-building-prediction-surface-parity-contract.test.ts"
    );
    expect(runner).toContain("airborne-building-prediction-surface-parity.test.ts");
  });
});
