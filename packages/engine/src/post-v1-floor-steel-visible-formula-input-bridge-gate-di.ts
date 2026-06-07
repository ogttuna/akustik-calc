import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_GATE_DH_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_DH_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-dh";
import {
  STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS
} from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_FORMULA_BASIS
} from "./steel-floor-impact-formula-corridor";

export const POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_LANDED_GATE =
  "post_v1_floor_steel_visible_formula_input_bridge_gate_di_plan" as const;

export const POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTION_STATUS =
  "post_v1_floor_steel_visible_formula_input_bridge_gate_di_landed_runtime_selected_next_numeric_coverage_gap_gate_dj" as const;

export const POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_dj_plan" as const;

export const POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dj-contract.test.ts" as const;

export const POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage/accuracy gap Gate DJ" as const;

export const POST_V1_GATE_DI_SELECTED_CANDIDATE_ID =
  POST_V1_GATE_DH_SELECTED_CANDIDATE_ID;

export const POST_V1_GATE_DI_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DI_NEWLY_CALCULABLE_LAYER_TEMPLATES = [
  "steel_joist_visible_upper_lower_formula_bridge",
  "open_web_visible_upper_lower_formula_bridge"
] as const;

export const POST_V1_GATE_DI_COUNTERS = {
  astmAliasRequestShapesKeptUnsupported: 2,
  frontendImplementationFilesTouched: 0,
  formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
  newCalculableLayerTemplates: 2,
  newCalculableRequestShapes: 4,
  protectedNoSurfaceGeneratedRequestShapes: 5,
  requiredPhysicalInputs: STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS,
  runtimeCorrectedLayerTemplates: 0,
  runtimeCorrectedRequestShapes: 0
} as const;

export const POST_V1_GATE_DI_NEGATIVE_BOUNDARIES = [
  "surface-absent generated steel/open-web rows keep their previous Ln,w-only posture and do not publish DeltaLw",
  "missing steelSupportForm, steelCarrierDepthMm, steelCarrierSpacingMm, toppingOrFloatingLayer, resilientLayerDynamicStiffnessMNm3, loadBasisKgM2, or lowerCeilingIsolationSupportForm remains needs_input",
  "bound-only UBIQ/open-web Ln,w rows and generic steel family archetypes do not become DeltaLw owners",
  "ISO DeltaLw does not alias to ASTM IIC or AIIC"
] as const;

export type PostV1FloorSteelVisibleFormulaInputBridgeGateDISummary = {
  readonly counters: typeof POST_V1_GATE_DI_COUNTERS;
  readonly landedGate: typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_LANDED_GATE;
  readonly negativeBoundaries: typeof POST_V1_GATE_DI_NEGATIVE_BOUNDARIES;
  readonly newCalculableLayerTemplates: typeof POST_V1_GATE_DI_NEWLY_CALCULABLE_LAYER_TEMPLATES;
  readonly previousGateDH: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_LANDED_GATE;
    readonly noRuntimeCounters: typeof POST_V1_GATE_DH_NO_RUNTIME_COUNTERS;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTION_STATUS;
  };
  readonly runtimeFormulaBasis: typeof STEEL_FLOOR_FORMULA_BASIS;
  readonly selectedCandidateId: typeof POST_V1_GATE_DI_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTION_STATUS;
  readonly sourceRowsRequiredForRuntimeSelection: false;
  readonly targetOutputs: typeof POST_V1_GATE_DI_TARGET_OUTPUTS;
};

export function summarizePostV1FloorSteelVisibleFormulaInputBridgeGateDI():
  PostV1FloorSteelVisibleFormulaInputBridgeGateDISummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_LANDED_GATE
  ) {
    throw new Error("Gate DI can only land after Gate DH selects the steel visible formula input bridge.");
  }

  return {
    counters: POST_V1_GATE_DI_COUNTERS,
    landedGate: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_LANDED_GATE,
    negativeBoundaries: POST_V1_GATE_DI_NEGATIVE_BOUNDARIES,
    newCalculableLayerTemplates: POST_V1_GATE_DI_NEWLY_CALCULABLE_LAYER_TEMPLATES,
    previousGateDH: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_DH_NO_RUNTIME_COUNTERS,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DH_SELECTION_STATUS
    },
    runtimeFormulaBasis: STEEL_FLOOR_FORMULA_BASIS,
    selectedCandidateId: POST_V1_GATE_DI_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_BRIDGE_GATE_DI_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    targetOutputs: POST_V1_GATE_DI_TARGET_OUTPUTS
  };
}
