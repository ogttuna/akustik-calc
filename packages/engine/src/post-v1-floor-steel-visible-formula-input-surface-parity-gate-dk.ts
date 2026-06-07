import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTION_STATUS,
  POST_V1_GATE_DJ_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_DJ_SELECTED_CANDIDATE_ID
} from "./post-v1-next-numeric-coverage-gap-gate-dj";
import {
  STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS
} from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_FORMULA_BASIS
} from "./steel-floor-impact-formula-corridor";

export const POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_LANDED_GATE =
  "post_v1_floor_steel_visible_formula_input_surface_parity_gate_dk_plan" as const;

export const POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTION_STATUS =
  "post_v1_floor_steel_visible_formula_input_surface_parity_gate_dk_landed_surface_parity_selected_next_numeric_coverage_gap_gate_dl" as const;

export const POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_dl_plan" as const;

export const POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dl-contract.test.ts" as const;

export const POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage/accuracy gap Gate DL" as const;

export const POST_V1_GATE_DK_SELECTED_CANDIDATE_ID =
  POST_V1_GATE_DJ_SELECTED_CANDIDATE_ID;

export const POST_V1_GATE_DK_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DK_COUNTERS = {
  astmAliasRequestShapesKeptUnsupported: 2,
  calculatorApiSurfaceFieldsAdded: ["steelFloorFormulaSurface"],
  frontendImplementationFilesTouched: 0,
  formulaBasis: STEEL_FLOOR_FORMULA_BASIS,
  impactOnlySurfaceRequestShapes: 4,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 4,
  protectedNoSurfaceGeneratedRequestShapes: 5,
  requiredPhysicalInputs: STEEL_FLOOR_FORMULA_INPUT_SURFACE_FIELDS,
  runtimeCorrectedLayerTemplates: 0,
  runtimeCorrectedRequestShapes: 0
} as const;

export const POST_V1_GATE_DK_SURFACE_TARGETS = [
  "estimate_api_payload",
  "impact_only_api_payload",
  "shared_request_schema",
  "engine_impact_only_surface"
] as const;

export const POST_V1_GATE_DK_NEGATIVE_BOUNDARIES = [
  "Gate DK reuses the Gate DI steel mass-spring formula owner and does not introduce a new steel formula",
  "missing steelSupportForm, steelCarrierDepthMm, steelCarrierSpacingMm, toppingOrFloatingLayer, resilientLayerDynamicStiffnessMNm3, loadBasisKgM2, or lowerCeilingIsolationSupportForm remains needs_input",
  "surface-absent generated steel/open-web rows keep their previous Ln,w-only posture and do not publish DeltaLw",
  "bound-only UBIQ/open-web Ln,w rows and generic steel family archetypes do not become DeltaLw owners",
  "ISO DeltaLw does not alias to ASTM IIC or AIIC",
  "Gate DK touches only shared/API/server surface plumbing and engine impact-only routing, not frontend UI implementation"
] as const;

export type PostV1FloorSteelVisibleFormulaInputSurfaceParityGateDKSummary = {
  readonly counters: typeof POST_V1_GATE_DK_COUNTERS;
  readonly landedGate: typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_LANDED_GATE;
  readonly negativeBoundaries: typeof POST_V1_GATE_DK_NEGATIVE_BOUNDARIES;
  readonly previousGateDJ: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_LANDED_GATE;
    readonly noRuntimeCounters: typeof POST_V1_GATE_DJ_NO_RUNTIME_COUNTERS;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTION_STATUS;
  };
  readonly runtimeFormulaBasis: typeof STEEL_FLOOR_FORMULA_BASIS;
  readonly selectedCandidateId: typeof POST_V1_GATE_DK_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction:
    typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTION_STATUS;
  readonly sourceRowsRequiredForRuntimeSelection: false;
  readonly surfaceTargets: typeof POST_V1_GATE_DK_SURFACE_TARGETS;
  readonly targetOutputs: typeof POST_V1_GATE_DK_TARGET_OUTPUTS;
};

export function summarizePostV1FloorSteelVisibleFormulaInputSurfaceParityGateDK():
  PostV1FloorSteelVisibleFormulaInputSurfaceParityGateDKSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_LANDED_GATE
  ) {
    throw new Error("Gate DK can only land after Gate DJ selects steel visible formula input surface parity.");
  }

  return {
    counters: POST_V1_GATE_DK_COUNTERS,
    landedGate: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_LANDED_GATE,
    negativeBoundaries: POST_V1_GATE_DK_NEGATIVE_BOUNDARIES,
    previousGateDJ: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_DJ_NO_RUNTIME_COUNTERS,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DJ_SELECTION_STATUS
    },
    runtimeFormulaBasis: STEEL_FLOOR_FORMULA_BASIS,
    selectedCandidateId: POST_V1_GATE_DK_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_STEEL_VISIBLE_FORMULA_INPUT_SURFACE_PARITY_GATE_DK_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    surfaceTargets: POST_V1_GATE_DK_SURFACE_TARGETS,
    targetOutputs: POST_V1_GATE_DK_TARGET_OUTPUTS
  };
}
