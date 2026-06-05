import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_GATE_CL_NO_RUNTIME_COUNTERS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-cl";
import {
  POST_V1_GATE_CK_BUILDING_TARGET_OUTPUTS,
  POST_V1_GATE_CK_FIELD_TARGET_OUTPUTS,
  POST_V1_GATE_CK_VALUE_PINS
} from "./post-v1-opening-leak-composite-wall-adapters-gate-ck";
import {
  POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS,
  POST_V1_GATE_CJ_BUILDING_VALUE_PINS
} from "./post-v1-wall-common-auto-topology-expansion-gate-cj";

export const POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_LANDED_GATE =
  "post_v1_required_physical_input_surface_parity_gate_cm_plan" as const;

export const POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTION_STATUS =
  "post_v1_required_physical_input_surface_parity_gate_cm_landed_no_runtime_selected_next_numeric_coverage_gap_gate_cn" as const;

export const POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_cn_plan" as const;

export const POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cn-contract.test.ts" as const;

export const POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate CN" as const;

export const POST_V1_GATE_CM_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_CM_INPUT_SURFACE_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  inputSurfaceLedgers: 4,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  requiredPhysicalInputsPinned: 20,
  runtimeValuesMoved: 0,
  guardedRequestShapes: 15,
  stoppedBoundaryFamiliesPinned: 8
} as const;

export type PostV1GateCMRequiredPhysicalInputSurfaceId =
  | "floor.heavy_floating_upper_treatment.dynamic_delta_lw_inputs_gate_cg2"
  | "floor.heavy_floating_upper_treatment.field_direct_flanking_inputs_gate_ch"
  | "wall.common_flat_double_leaf.building_prediction_inputs_gate_cj"
  | "wall.opening_leak_composite.field_building_inputs_gate_ck";

export type PostV1GateCMMissingInputBoundary = {
  readonly missingPhysicalInputs: readonly string[];
  readonly origin: "needs_input" | "unsupported";
  readonly unsupportedOutputs: readonly RequestedOutputId[];
};

export type PostV1GateCMRequiredPhysicalInputSurface = {
  readonly completeSupportedOutputs: readonly RequestedOutputId[];
  readonly id: PostV1GateCMRequiredPhysicalInputSurfaceId;
  readonly metricBasis: string;
  readonly missingInputBoundaries: readonly PostV1GateCMMissingInputBoundary[];
  readonly noRuntimeValueMovement: true;
  readonly nonGoals: readonly ("broad_source_row_crawl" | "confidence_wording" | "formula_retune" | "frontend_ui_polish" | "source_row_crawl")[];
  readonly requestedOutputs: readonly RequestedOutputId[];
  readonly requiredPhysicalInputs: readonly string[];
  readonly route: "floor" | "wall";
  readonly selectedRuntimeGate: string;
  readonly surfaceScope: "engine_required_input_guard";
};

export type PostV1GateCMCandidateId =
  | "broad_source_row_crawl"
  | "confidence_wording"
  | "frontend_ui_polish"
  | "next_numeric_coverage_gap_after_input_surface_guards";

export type PostV1GateCMSliceKind =
  | "blocked_non_goal"
  | "numeric_scope_accuracy_rerank";

export type PostV1GateCMNextCoverageCandidate = {
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateCMCandidateId;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateCMSliceKind;
};

export type PostV1GateCMSummary = {
  readonly frozenRuntimePins: {
    readonly gateCJBuildingValuePins: typeof POST_V1_GATE_CJ_BUILDING_VALUE_PINS;
    readonly gateCKOpeningLeakValuePins: typeof POST_V1_GATE_CK_VALUE_PINS;
  };
  readonly inputSurfaceCounters: typeof POST_V1_GATE_CM_INPUT_SURFACE_COUNTERS;
  readonly inputSurfaces: readonly PostV1GateCMRequiredPhysicalInputSurface[];
  readonly landedGate: typeof POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_CM_PLAN_DOC_PATH;
  readonly previousGateCL: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTION_STATUS;
  };
  readonly previousGateCLCounters: typeof POST_V1_GATE_CL_NO_RUNTIME_COUNTERS;
  readonly selectedNextAction: typeof POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTION_STATUS;
};

export function buildPostV1GateCMRequiredPhysicalInputSurfaces():
  readonly PostV1GateCMRequiredPhysicalInputSurface[] {
  return [
    {
      completeSupportedOutputs: [
        ...POST_V1_GATE_CK_FIELD_TARGET_OUTPUTS.filter((output) => output !== "Dn,A"),
        ...POST_V1_GATE_CK_BUILDING_TARGET_OUTPUTS.filter((output) => output !== "DnT,A")
      ],
      id: "wall.opening_leak_composite.field_building_inputs_gate_ck",
      metricBasis: "field_between_rooms_and_building_prediction",
      missingInputBoundaries: [
        {
          missingPhysicalInputs: ["receivingRoomRt60S"],
          origin: "needs_input",
          unsupportedOutputs: ["R'w", "DnT,w"]
        },
        {
          missingPhysicalInputs: ["frequencyBandSet"],
          origin: "needs_input",
          unsupportedOutputs: ["Dn,A", "DnT,A"]
        },
        {
          missingPhysicalInputs: ["flankingJunctionClass", "junctionCouplingLengthM", "sourceRoomVolumeM3"],
          origin: "needs_input",
          unsupportedOutputs: ["R'w", "DnT,w"]
        }
      ],
      noRuntimeValueMovement: true,
      nonGoals: ["frontend_ui_polish", "formula_retune", "source_row_crawl"],
      requestedOutputs: [...POST_V1_GATE_CK_FIELD_TARGET_OUTPUTS, ...POST_V1_GATE_CK_BUILDING_TARGET_OUTPUTS],
      requiredPhysicalInputs: [
        "hostWallAreaM2",
        "openingLeakElements",
        "receivingRoomRt60S",
        "receivingRoomVolumeM3",
        "flankingJunctionClass",
        "junctionCouplingLengthM",
        "sourceRoomVolumeM3",
        "frequencyBandSet"
      ],
      route: "wall",
      selectedRuntimeGate: "post_v1_opening_leak_composite_wall_adapters_gate_ck_plan",
      surfaceScope: "engine_required_input_guard"
    },
    {
      completeSupportedOutputs: [...POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS],
      id: "wall.common_flat_double_leaf.building_prediction_inputs_gate_cj",
      metricBasis: "building_prediction",
      missingInputBoundaries: [
        {
          missingPhysicalInputs: ["wallTopology.supportTopology"],
          origin: "needs_input",
          unsupportedOutputs: [...POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS]
        },
        {
          missingPhysicalInputs: ["studSpacingMm"],
          origin: "needs_input",
          unsupportedOutputs: [...POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS]
        },
        {
          missingPhysicalInputs: ["resilientBarSideCount"],
          origin: "needs_input",
          unsupportedOutputs: ["R'w", "DnT,w"]
        }
      ],
      noRuntimeValueMovement: true,
      nonGoals: ["frontend_ui_polish", "formula_retune", "source_row_crawl"],
      requestedOutputs: [...POST_V1_GATE_CJ_BUILDING_TARGET_OUTPUTS],
      requiredPhysicalInputs: [
        "wallTopology.supportTopology",
        "studSpacingMm",
        "panelHeightMm",
        "panelWidthMm",
        "receivingRoomRt60S",
        "receivingRoomVolumeM3",
        "sourceRoomVolumeM3",
        "flankingJunctionClass",
        "junctionCouplingLengthM",
        "resilientBarSideCount"
      ],
      route: "wall",
      selectedRuntimeGate: "post_v1_wall_common_auto_topology_expansion_gate_cj_plan",
      surfaceScope: "engine_required_input_guard"
    },
    {
      completeSupportedOutputs: ["Ln,w", "DeltaLw"],
      id: "floor.heavy_floating_upper_treatment.dynamic_delta_lw_inputs_gate_cg2",
      metricBasis: "element_lab_impact",
      missingInputBoundaries: [
        {
          missingPhysicalInputs: ["loadBasisKgM2"],
          origin: "needs_input",
          unsupportedOutputs: ["DeltaLw"]
        },
        {
          missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3"],
          origin: "needs_input",
          unsupportedOutputs: ["DeltaLw"]
        }
      ],
      noRuntimeValueMovement: true,
      nonGoals: ["frontend_ui_polish", "formula_retune", "source_row_crawl"],
      requestedOutputs: ["Ln,w", "DeltaLw"],
      requiredPhysicalInputs: ["loadBasisKgM2", "resilientLayerDynamicStiffnessMNm3"],
      route: "floor",
      selectedRuntimeGate: "post_v1_floor_common_floating_covering_expansion_gate_cg2_plan",
      surfaceScope: "engine_required_input_guard"
    },
    {
      completeSupportedOutputs: ["L'n,w", "L'nT,w", "L'nT,50"],
      id: "floor.heavy_floating_upper_treatment.field_direct_flanking_inputs_gate_ch",
      metricBasis: "field_impact_direct_flanking",
      missingInputBoundaries: [
        {
          missingPhysicalInputs: ["impactFieldContext.ci50_2500Db"],
          origin: "needs_input",
          unsupportedOutputs: ["L'nT,50"]
        },
        {
          missingPhysicalInputs: ["impactFieldContext.receivingRoomVolumeM3"],
          origin: "needs_input",
          unsupportedOutputs: ["L'nT,w", "L'nT,50"]
        }
      ],
      noRuntimeValueMovement: true,
      nonGoals: ["frontend_ui_polish", "formula_retune", "source_row_crawl"],
      requestedOutputs: ["L'n,w", "L'nT,w", "L'nT,50"],
      requiredPhysicalInputs: [
        "impactFieldContext.directPathOffsetDb",
        "impactFieldContext.flankingPaths",
        "impactFieldContext.receivingRoomVolumeM3",
        "impactFieldContext.ci50_2500Db"
      ],
      route: "floor",
      selectedRuntimeGate: "post_v1_next_numeric_coverage_gap_gate_ch_plan",
      surfaceScope: "engine_required_input_guard"
    }
  ] as const satisfies readonly PostV1GateCMRequiredPhysicalInputSurface[];
}

export function rankPostV1GateCMNextCoverageCandidates(): readonly PostV1GateCMNextCoverageCandidate[] {
  return [
    {
      expectedBeforeAfter: [
        "Gate CM closes selected-route required-input guards without moving runtime values",
        "the next action returns to numeric coverage and accuracy reranking"
      ],
      id: "next_numeric_coverage_gap_after_input_surface_guards",
      passesCalculatorAdvancementTest: true,
      selected: true,
      selectedNextActionIfSelected: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_FILE,
      sliceKind: "numeric_scope_accuracy_rerank"
    },
    {
      expectedBeforeAfter: [
        "frontend polish could improve ergonomics",
        "it is outside this engine calculator slice"
      ],
      id: "frontend_ui_polish",
      passesCalculatorAdvancementTest: false,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal"
    },
    {
      expectedBeforeAfter: [
        "source rows may later become exact answers, anchors, calibration rows, or holdouts",
        "broad crawling alone does not improve calculator scope or accuracy"
      ],
      id: "broad_source_row_crawl",
      passesCalculatorAdvancementTest: false,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal"
    },
    {
      expectedBeforeAfter: [
        "confidence wording can describe uncertainty",
        "it cannot replace formula ownership, required inputs, or holdouts"
      ],
      id: "confidence_wording",
      passesCalculatorAdvancementTest: false,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal"
    }
  ] as const satisfies readonly PostV1GateCMNextCoverageCandidate[];
}

export function summarizePostV1RequiredPhysicalInputSurfaceParityGateCM(): PostV1GateCMSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_ACTION !==
    POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_LANDED_GATE
  ) {
    throw new Error("Gate CM can only land after Gate CL selects required physical input surface parity.");
  }

  return {
    frozenRuntimePins: {
      gateCJBuildingValuePins: POST_V1_GATE_CJ_BUILDING_VALUE_PINS,
      gateCKOpeningLeakValuePins: POST_V1_GATE_CK_VALUE_PINS
    },
    inputSurfaceCounters: POST_V1_GATE_CM_INPUT_SURFACE_COUNTERS,
    inputSurfaces: buildPostV1GateCMRequiredPhysicalInputSurfaces(),
    landedGate: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_LANDED_GATE,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_CM_PLAN_DOC_PATH,
    previousGateCL: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CL_SELECTION_STATUS
    },
    previousGateCLCounters: POST_V1_GATE_CL_NO_RUNTIME_COUNTERS,
    selectedNextAction: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_REQUIRED_PHYSICAL_INPUT_SURFACE_PARITY_GATE_CM_SELECTION_STATUS
  };
}
