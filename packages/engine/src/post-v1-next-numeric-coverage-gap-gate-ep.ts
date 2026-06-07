import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
  GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  POST_V1_GATE_EO_COUNTERS,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_LANDED_GATE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_ACTION,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_FILE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTION_STATUS,
  summarizePostV1WallDirectFixedDoubleLeafBridgeLossRuntimeGateEO
} from "./post-v1-wall-direct-fixed-double-leaf-bridge-loss-runtime-gate-eo";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_ep_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_ep_landed_no_runtime_selected_wall_direct_fixed_double_leaf_field_building_adapter_owner_gate_eq" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_ACTION =
  "post_v1_wall_direct_fixed_double_leaf_field_building_adapter_owner_gate_eq_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-owner-gate-eq-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_LABEL =
  "post-V1 wall direct-fixed double-leaf field/building adapter owner Gate EQ" as const;

export const POST_V1_GATE_EP_SELECTED_CANDIDATE_ID =
  "wall.direct_fixed_double_leaf_field_building_adapter_owner_gap" as const;

export const POST_V1_GATE_EP_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_EP_EQ_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_PLAN_2026-06-07.md" as const;

export const POST_V1_GATE_EP_SELECTED_TARGET_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_EP_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "Gate EO closed the element-lab direct-fixed bridge-loss runtime gap, so Gate EP must subtract the now-live lab route, already-live Gate S non-direct-fixed families, and missing-input boundaries before choosing the next action.",
    rejectedDirections: [
      "repeating Gate EO lab Rw/STC/C/Ctr runtime as a new scope move",
      "reopening independent/resilient double-leaf field/building routes that already have Gate S plus Gate I/AR adapters",
      "counting missing support spacing or missing room RT60 as calculable scope"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "The highest ROI is the direct-fixed field/building adapter owner proof: the same complete direct-fixed wall that now has an owned lab curve still uses screening fallback for field outputs and remains unsupported for building prediction.",
    rejectedDirections: [
      "aliasing lab Rw/STC directly into R'w/Dn,w/DnT,w without field/building adapters",
      "changing the Gate EO lab formula before same-family holdouts exist",
      "source crawling, confidence wording, or frontend work without a selected calculator route"
    ]
  }
] as const;

export const POST_V1_GATE_EP_NO_RUNTIME_COUNTERS = {
  candidateCount: 9,
  estimatedNextAdapterOwnerLedgers: 2,
  estimatedNextNewCalculableLayerTemplates: 1,
  estimatedNextNewCalculableRequestShapes: 3,
  estimatedNextRuntimeCorrectedLayerTemplates: 1,
  estimatedNextRuntimeCorrectedRequestShapes: 3,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: POST_V1_GATE_EP_ROI_ANALYSIS_ITERATIONS.length,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const DIRECT_FIXED_DOUBLE_LEAF_LAYERS = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 45 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_DOUBLE_LEAF_TOPOLOGY = {
  cavity1AbsorptionClass: "none",
  cavity1DepthMm: 45,
  cavity1FillCoverage: "empty",
  cavity1LayerIndices: [1],
  sideALeafLayerIndices: [0],
  sideBLeafLayerIndices: [2],
  supportTopology: "direct_fixed",
  topologyMode: "double_leaf_framed"
} as const;

const DIRECT_FIXED_LAB_CONTEXT = {
  connectionType: "direct_fix",
  contextMode: "element_lab",
  studSpacingMm: 400,
  wallTopology: DIRECT_FIXED_DOUBLE_LEAF_TOPOLOGY
} as const satisfies AirborneContext;

const DIRECT_FIXED_FIELD_CONTEXT = {
  ...DIRECT_FIXED_LAB_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2500,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 50
} as const satisfies AirborneContext;

const DIRECT_FIXED_FIELD_MISSING_RT60_CONTEXT = {
  ...DIRECT_FIXED_LAB_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2500,
  panelWidthMm: 3000,
  receivingRoomVolumeM3: 50
} as const satisfies AirborneContext;

const DIRECT_FIXED_BUILDING_CONTEXT = {
  ...DIRECT_FIXED_LAB_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2500,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 50,
  sourceRoomVolumeM3: 45
} as const satisfies AirborneContext;

export type PostV1GateEPCandidateId =
  | typeof POST_V1_GATE_EP_SELECTED_CANDIDATE_ID
  | "broad_source_crawl_frontend_confidence_non_goal"
  | "floor_or_astm_closed_repeats_after_eo"
  | "wall.direct_fixed_bridge_loss_retune_without_holdouts"
  | "wall.direct_fixed_building_alias_without_adapter_rejected"
  | "wall.direct_fixed_lab_closed_by_eo"
  | "wall.direct_fixed_missing_input_boundaries"
  | "wall.gate_s_non_direct_fixed_field_building_already_live"
  | "wall.source_row_or_holdout_tightening_without_owner";

export type PostV1GateEPSliceKind =
  | "adapter_owner_gap"
  | "already_live"
  | "blocked_metric_alias"
  | "blocked_non_goal"
  | "closed_runtime_gap"
  | "closed_runtime_repeat"
  | "formula_retune_blocked"
  | "needs_input_boundary"
  | "source_or_holdout_blocked";

export type PostV1GateEPCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateEPCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeValues: boolean;
  readonly ownerProofRequiredBeforeRuntime: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateEPSliceKind;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementationNow: boolean;
  readonly touchesSharedOrApiSurfaceNow: boolean;
};

export type PostV1GateEPCurrentRouteEvidence = {
  readonly buildingBasisMethod: string | null | undefined;
  readonly buildingMissingPhysicalInputs: readonly string[];
  readonly buildingSelectedCandidateId: string | undefined;
  readonly buildingSupportedOutputs: readonly RequestedOutputId[];
  readonly buildingUnsupportedOutputs: readonly RequestedOutputId[];
  readonly fieldBasisMethod: string | null | undefined;
  readonly fieldMetrics: {
    readonly Dnw: number | null | undefined;
    readonly DnTw: number | null | undefined;
    readonly RwPrime: number | null | undefined;
  };
  readonly fieldSelectedCandidateId: string | undefined;
  readonly fieldSupportedOutputs: readonly RequestedOutputId[];
  readonly fieldUnsupportedOutputs: readonly RequestedOutputId[];
  readonly labBasisMethod: string | null | undefined;
  readonly labMetrics: {
    readonly C: number | null | undefined;
    readonly Ctr: number | null | undefined;
    readonly Rw: number | null | undefined;
    readonly STC: number | null | undefined;
  };
  readonly labSelectedCandidateId: string | undefined;
  readonly missingFieldRt60BasisMethod: string | null | undefined;
  readonly missingFieldRt60MissingPhysicalInputs: readonly string[];
  readonly missingFieldRt60SelectedCandidateId: string | undefined;
};

export type PostV1GateEPSummary = {
  readonly candidates: readonly PostV1GateEPCandidate[];
  readonly currentRouteEvidence: PostV1GateEPCurrentRouteEvidence;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_EP_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_EP_PLAN_DOC_PATH;
  readonly previousGateEO: {
    readonly counters: typeof POST_V1_GATE_EO_COUNTERS;
    readonly landedGate: typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTION_STATUS;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_EP_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_EP_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTION_STATUS;
};

export function buildPostV1GateEPCurrentRouteEvidence(): PostV1GateEPCurrentRouteEvidence {
  const lab = calculateAssembly(DIRECT_FIXED_DOUBLE_LEAF_LAYERS, {
    airborneContext: DIRECT_FIXED_LAB_CONTEXT,
    calculator: "dynamic",
    targetOutputs: ["Rw", "STC", "C", "Ctr"]
  });
  const field = calculateAssembly(DIRECT_FIXED_DOUBLE_LEAF_LAYERS, {
    airborneContext: DIRECT_FIXED_FIELD_CONTEXT,
    calculator: "dynamic",
    targetOutputs: POST_V1_GATE_EP_SELECTED_TARGET_OUTPUTS
  });
  const building = calculateAssembly(DIRECT_FIXED_DOUBLE_LEAF_LAYERS, {
    airborneContext: DIRECT_FIXED_BUILDING_CONTEXT,
    calculator: "dynamic",
    targetOutputs: POST_V1_GATE_EP_SELECTED_TARGET_OUTPUTS
  });
  const missingFieldRt60 = calculateAssembly(DIRECT_FIXED_DOUBLE_LEAF_LAYERS, {
    airborneContext: DIRECT_FIXED_FIELD_MISSING_RT60_CONTEXT,
    calculator: "dynamic",
    targetOutputs: POST_V1_GATE_EP_SELECTED_TARGET_OUTPUTS
  });

  return {
    buildingBasisMethod: building.airborneBasis?.method,
    buildingMissingPhysicalInputs: [...(building.airborneBasis?.missingPhysicalInputs ?? [])],
    buildingSelectedCandidateId: building.airborneCandidateResolution?.selectedCandidateId,
    buildingSupportedOutputs: [...building.supportedTargetOutputs],
    buildingUnsupportedOutputs: [...building.unsupportedTargetOutputs],
    fieldBasisMethod: field.airborneBasis?.method,
    fieldMetrics: {
      Dnw: field.metrics.estimatedDnWDb,
      DnTw: field.metrics.estimatedDnTwDb,
      RwPrime: field.metrics.estimatedRwPrimeDb
    },
    fieldSelectedCandidateId: field.airborneCandidateResolution?.selectedCandidateId,
    fieldSupportedOutputs: [...field.supportedTargetOutputs],
    fieldUnsupportedOutputs: [...field.unsupportedTargetOutputs],
    labBasisMethod: lab.airborneBasis?.method,
    labMetrics: {
      C: lab.metrics.estimatedCDb,
      Ctr: lab.metrics.estimatedCtrDb,
      Rw: lab.metrics.estimatedRwDb,
      STC: lab.metrics.estimatedStc
    },
    labSelectedCandidateId: lab.airborneCandidateResolution?.selectedCandidateId,
    missingFieldRt60BasisMethod: missingFieldRt60.airborneBasis?.method,
    missingFieldRt60MissingPhysicalInputs: [
      ...(missingFieldRt60.airborneBasis?.missingPhysicalInputs ?? [])
    ],
    missingFieldRt60SelectedCandidateId: missingFieldRt60.airborneCandidateResolution?.selectedCandidateId
  };
}

export function rankPostV1GateEPNumericCoverageCandidates(): readonly PostV1GateEPCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate EO now owns the direct separating-element curve for complete direct-fixed double-leaf element-lab stacks",
        "complete field_between_rooms direct-fixed requests still calculate R'w/Dn,w/DnT,w through screening_mass_law_curve_seed_v3 instead of the Gate EO curve plus Gate I field adapter",
        "complete building_prediction direct-fixed requests still stop as dynamic_calculator_building_prediction_runtime_adapter_owner_missing",
        "Gate EQ must prove the field/building adapter owner boundaries before any runtime value movement"
      ],
      id: POST_V1_GATE_EP_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts",
        "packages/engine/src/dynamic-airborne-gate-i-airborne-field-context.ts",
        "packages/engine/src/dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor.ts",
        "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-runtime-gate-eo-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate EO: it targets one common visible wall subset where lab is now owned, field is calculable but routed through a weaker screening lane, and building prediction is still unsupported with complete physical inputs.",
      score: 3.42,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_FILE,
      sliceKind: "adapter_owner_gap",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EP_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "Gate EO already moved complete element-lab direct-fixed Rw/STC/C/Ctr to the equivalent coupled-mass bridge-loss owner",
        "selecting lab again would not widen scope or improve routing",
        "future work may calibrate this owner only after same-family holdouts exist"
      ],
      id: "wall.direct_fixed_lab_closed_by_eo",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-runtime-gate-eo-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already live after Gate EO.",
      score: 2.12,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_gap",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "Gate S plus Gate I/AR already own non-direct-fixed double-leaf field/building adapters when complete physical inputs are present",
        "reselecting independent/resilient families would repeat closed route work",
        "the fresh gap is direct-fixed-specific because Gate EO intentionally stayed lab-only"
      ],
      id: "wall.gate_s_non_direct_fixed_field_building_already_live",
      implementationEvidencePaths: [
        "packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts",
        "packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts",
        "packages/engine/src/post-v1-wall-common-auto-topology-second-pass-gate-cs-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already live for the non-direct-fixed subset.",
      score: 1.94,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_live",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EP_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "complete direct-fixed field requests should eventually use an explicit field adapter",
        "lab Rw/STC must not be relabelled into field metrics without room area, volume, RT60, and adapter ownership",
        "Gate EQ is required before runtime so this alias remains blocked"
      ],
      id: "wall.direct_fixed_building_alias_without_adapter_rejected",
      implementationEvidencePaths: [
        "packages/engine/src/dynamic-airborne-gate-i-airborne-field-context.ts",
        "packages/engine/src/dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked metric/basis alias.",
      score: 1.37,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_metric_alias",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EP_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "missing supportSpacingMm still stops the Gate EO lab owner as needs_input",
        "missing receivingRoomRt60S still stops field outputs as needs_input",
        "guessing these inputs would weaken calculator correctness"
      ],
      id: "wall.direct_fixed_missing_input_boundaries",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-runtime-gate-eo.ts",
        "packages/engine/src/dynamic-calculator-route-input-topology.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      reason: "Correct needs_input boundary, not a scope candidate.",
      score: 1.02,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "needs_input_boundary",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_EP_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "Gate EO runtime values are intentionally uncalibrated with a 6 dB budget",
        "same-family direct-fixed holdouts are absent",
        "retuning now would be accuracy theater rather than a defensible calculator improvement"
      ],
      id: "wall.direct_fixed_bridge_loss_retune_without_holdouts",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-runtime-gate-eo.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      reason: "Formula retune is blocked until same-family holdouts exist.",
      score: 0.91,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "formula_retune_blocked",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "source rows can become exact answers, anchors, or holdouts only after a selected route owner names the needed evidence",
        "Gate EP has a current implementation gap that can be proven without crawling",
        "broad holdout tightening does not beat the adapter-owner gap"
      ],
      id: "wall.source_row_or_holdout_tightening_without_owner",
      implementationEvidencePaths: [
        "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      reason: "Useful later, blocked for this slice.",
      score: 0.76,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "source_or_holdout_blocked",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: POST_V1_GATE_EP_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "ASTM exact-band input is already closed by Gate EJ",
        "recent floor runtime formula-route gaps are not fresh after the Gate ED/EJ/EO chain",
        "these do not address the current direct-fixed field/building route defect"
      ],
      id: "floor_or_astm_closed_repeats_after_eo",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts",
        "packages/engine/src/post-v1-floor-heavy-concrete-combined-resilient-channel-lower-treatment-runtime-gate-ed-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed repeats after the current chain.",
      score: 0.54,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_repeat",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: [
        "source crawling, confidence wording, and frontend polish do not choose a formula route",
        "the selected gap is provable in the current engine with no frontend implementation",
        "these directions remain out of the calculator slice"
      ],
      id: "broad_source_crawl_frontend_confidence_non_goal",
      implementationEvidencePaths: ["AGENTS.md", "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: false,
      reason: "Non-calculator work for the current slice.",
      score: 0.2,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: POST_V1_GATE_EP_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    }
  ] as const satisfies readonly PostV1GateEPCandidate[];
}

export function summarizePostV1GateEPNumericCoverageGap(): PostV1GateEPSummary {
  if (
    POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_LANDED_GATE
  ) {
    throw new Error("Gate EP can only land after Gate EO selects the next numeric coverage rerank.");
  }

  const previousGateEO = summarizePostV1WallDirectFixedDoubleLeafBridgeLossRuntimeGateEO();
  const candidates = rankPostV1GateEPNumericCoverageCandidates();
  const selected = candidates.filter((candidate) => candidate.selected);

  if (selected.length !== 1 || selected[0]?.id !== POST_V1_GATE_EP_SELECTED_CANDIDATE_ID) {
    throw new Error("Gate EP must select exactly the direct-fixed field/building adapter owner gap.");
  }

  return {
    candidates,
    currentRouteEvidence: buildPostV1GateEPCurrentRouteEvidence(),
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_EP_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_EP_PLAN_DOC_PATH,
    previousGateEO: {
      counters: previousGateEO.counters,
      landedGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_GATE_EO_LANDED_GATE,
      selectedNextAction: previousGateEO.selectedNextAction,
      selectedNextFile: previousGateEO.selectedNextFile,
      selectionStatus: previousGateEO.selectionStatus
    },
    roiAnalysisIterations: POST_V1_GATE_EP_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: POST_V1_GATE_EP_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EP_SELECTION_STATUS
  };
}

export const POST_V1_GATE_EP_ROUTE_METHOD_ASSERTIONS = {
  buildingCurrentUnsupportedMethod: "dynamic_calculator_building_prediction_runtime_adapter_owner_missing",
  buildingSelectedCandidateId: "candidate_dynamic_unsupported",
  fieldCurrentScreeningCandidateId: "candidate_multileaf_screening_fallback",
  fieldCurrentScreeningMethod: "screening_mass_law_curve_seed_v3",
  fieldExpectedMetrics: {
    Dnw: 26,
    DnTw: 28,
    RwPrime: 25
  },
  forbiddenRuntimeMethodsBeforeGateEQ: [
    GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
    GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
    GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD
  ],
  gateARSelectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
  gateEOSelectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
  missingFieldRt60CandidateId: "candidate_dynamic_needs_input"
} as const;
