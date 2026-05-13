import type {
  AirborneContext,
  AssemblyCalculation,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ay";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_LANDED_GATE =
  "gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTION_STATUS =
  "gate_az_personal_use_mvp_advanced_wall_source_absent_solver_input_surface_landed_selected_floor_impact_source_absent_solver_gap_cartography_gate_ba";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_ACTION =
  "gate_ba_personal_use_mvp_floor_impact_source_absent_solver_gap_cartography_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ba-floor-impact-source-absent-solver-gap-cartography-contract.test.ts";

export const GATE_AZ_ADVANCED_WALL_TARGET_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

export const GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "air_gap", thicknessMm: 20 },
  { materialId: "plywood", thicknessMm: 36 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "cement_board", thicknessMm: 30 }
] as const satisfies readonly LayerInput[];

function cloneGateAYAdvancedWallInput(): NonNullable<AirborneContext["advancedWall"]> {
  return {
    ...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT,
    cavities: GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.cavities.map((cavity) => ({ ...cavity })),
    frameCoupling: { ...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.frameCoupling },
    panels: GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.panels.map((panel) => ({
      ...panel,
      layerIds: [...(panel.layerIds ?? [])]
    })),
    targetOutputs: [...GATE_AY_COMPLETE_ADVANCED_WALL_RUNTIME_INPUT.targetOutputs]
  };
}

export const GATE_AZ_COMPLETE_ADVANCED_WALL_AIRBORNE_CONTEXT: AirborneContext = {
  advancedWall: cloneGateAYAdvancedWallInput(),
  contextMode: "element_lab"
};

export type GateAZAdvancedWallInputSurfaceContract = {
  activeAssembly: AssemblyCalculation;
  fieldBoundaryAssembly: AssemblyCalculation;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_LANDED_GATE;
  missingInputAssembly: AssemblyCalculation;
  numericRuntimeBehaviorMovedBeforeGateAZ: false;
  previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_LANDED_GATE;
  previousSelectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_ACTION;
  previousSelectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_FILE;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTION_STATUS;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTION_STATUS;
  sourceRowsRequiredForInputSurface: false;
  targetOutputs: typeof GATE_AZ_ADVANCED_WALL_TARGET_OUTPUTS;
};

function calculateGateAZAssembly(context: AirborneContext, targetOutputs: readonly RequestedOutputId[]):
  AssemblyCalculation {
  return calculateAssembly(GATE_AZ_VISIBLE_ADVANCED_WALL_LAYER_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
}

export function buildPersonalUseMvpCoverageSprintGateAZInputSurfaceContract():
  GateAZAdvancedWallInputSurfaceContract {
  if (PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_ACTION !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_LANDED_GATE) {
    throw new Error("Gate AZ can only land after Gate AY selects the advanced wall input surface.");
  }

  const missingInputContext: AirborneContext = {
    advancedWall: {
      ...cloneGateAYAdvancedWallInput(),
      panels: cloneGateAYAdvancedWallInput().panels?.map((panel, index) =>
        index === 0 ? { ...panel, criticalFrequencyHz: undefined, lossFactor: undefined } : panel
      )
    },
    contextMode: "element_lab"
  };
  const fieldBoundaryContext: AirborneContext = {
    advancedWall: {
      ...cloneGateAYAdvancedWallInput(),
      outputBasis: "field_between_rooms",
      targetOutputs: ["R'w", "DnT,w"]
    },
    contextMode: "field_between_rooms"
  };

  return {
    activeAssembly: calculateGateAZAssembly(
      GATE_AZ_COMPLETE_ADVANCED_WALL_AIRBORNE_CONTEXT,
      GATE_AZ_ADVANCED_WALL_TARGET_OUTPUTS
    ),
    fieldBoundaryAssembly: calculateGateAZAssembly(fieldBoundaryContext, ["R'w", "DnT,w"]),
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_LANDED_GATE,
    missingInputAssembly: calculateGateAZAssembly(missingInputContext, GATE_AZ_ADVANCED_WALL_TARGET_OUTPUTS),
    numericRuntimeBehaviorMovedBeforeGateAZ: false,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_LANDED_GATE,
    previousSelectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_ACTION,
    previousSelectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTED_NEXT_FILE,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AY_SELECTION_STATUS,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AZ_SELECTION_STATUS,
    sourceRowsRequiredForInputSurface: false,
    targetOutputs: GATE_AZ_ADVANCED_WALL_TARGET_OUTPUTS
  };
}
