import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_LANDED_GATE,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_ACTION,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_FILE,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTION_STATUS,
  POST_V1_GATE_EV_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EV_PLAN_DOC_PATH,
  POST_V1_GATE_EV_SELECTED_GAP_ID,
  summarizePostV1GateEVCurrentCoverageAccuracyGapLedger
} from "./post-v1-current-coverage-accuracy-gap-ledger-gate-ev";
import {
  POST_V1_GATE_DD_EVIDENCE_BOUNDARIES,
  POST_V1_GATE_DD_LIVE_ROUTE_PINS,
  POST_V1_GATE_DD_UNLOCK_REQUIREMENTS
} from "./post-v1-wall-heavy-core-lined-massive-accuracy-gate-dd";
import {
  POST_V1_GATE_DG_COUNTERS,
  POST_V1_GATE_DG_FIELD_RUNTIME_BASIS,
  POST_V1_GATE_DG_LAB_RUNTIME_BASIS,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_LANDED_GATE
} from "./post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg";

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_LANDED_GATE =
  "post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_plan" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTION_STATUS =
  "post_v1_wall_heavy_core_lined_massive_calibration_owner_gate_ew_landed_no_runtime_owner_rejected_selected_next_numeric_coverage_gap_gate_ex" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ex_plan" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ex-contract.test.ts" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage/accuracy gap Gate EX" as const;

export const POST_V1_GATE_EW_OWNER_DECISION_ID =
  "wall.heavy_core_lined_massive.calibration_owner_rejected_missing_wall_specific_source_or_bounded_rule" as const;

export const POST_V1_GATE_EW_PLAN_DOC_PATH = POST_V1_GATE_EV_PLAN_DOC_PATH;

export const POST_V1_GATE_EW_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_EW_NO_RUNTIME_COUNTERS = {
  acceptedOwnerLedgers: 0,
  calibrationOwnerRejectedLedgers: 1,
  evidenceBoundaryLedgersPinned: POST_V1_GATE_DD_EVIDENCE_BOUNDARIES.length,
  frontendImplementationFilesTouched: 0,
  metricBasisBoundariesPinned: 4,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  protectedRuntimePins: 8,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  wallSpecificPositiveRowsAccepted: 0
} as const;

export type PostV1GateEWOwnerEvidenceId =
  | "bounded_wall_lining_rule_missing"
  | "current_bounded_prediction_not_calibration_holdout"
  | "floor_only_cc60_rows_rejected"
  | "formula_context_without_local_tolerance_rejected"
  | "manufacturer_context_missing_mounting_and_tolerance"
  | "metric_basis_boundary_pinned"
  | "presets_selector_and_deep_hybrid_rejected"
  | "wall_specific_source_row_missing";

export type PostV1GateEWOwnerEvidence = {
  readonly acceptedForCalibrationOwner: boolean;
  readonly evidencePaths: readonly string[];
  readonly id: PostV1GateEWOwnerEvidenceId;
  readonly protectsBoundary:
    | "exact_or_verified_source_precedence"
    | "floor_only_rejection"
    | "formula_tolerance_owner"
    | "metric_basis"
    | "runtime_pin_freeze"
    | "source_locator"
    | "topology_mounting";
  readonly reason: string;
  readonly requiredBeforeRuntime: boolean;
};

export type PostV1GateEWRejectedOwner = {
  readonly accepted: false;
  readonly decisionId: typeof POST_V1_GATE_EW_OWNER_DECISION_ID;
  readonly missingRequirements: typeof POST_V1_GATE_DD_UNLOCK_REQUIREMENTS;
  readonly reason: string;
  readonly selectedNextAction: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_FILE;
};

export type PostV1GateEWSummary = {
  readonly evidence: readonly PostV1GateEWOwnerEvidence[];
  readonly fieldRuntimeBasis: typeof POST_V1_GATE_DG_FIELD_RUNTIME_BASIS;
  readonly landedGate: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_LANDED_GATE;
  readonly labRuntimeBasis: typeof POST_V1_GATE_DG_LAB_RUNTIME_BASIS;
  readonly liveRoutePins: typeof POST_V1_GATE_DD_LIVE_ROUTE_PINS;
  readonly noRuntimeCounters: typeof POST_V1_GATE_EW_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly ownerDecision: PostV1GateEWRejectedOwner;
  readonly planDocPath: typeof POST_V1_GATE_EW_PLAN_DOC_PATH;
  readonly previousGateEV: {
    readonly counters: typeof POST_V1_GATE_EV_NO_RUNTIME_COUNTERS;
    readonly landedGate: typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_LANDED_GATE;
    readonly selectedGapId: typeof POST_V1_GATE_EV_SELECTED_GAP_ID;
    readonly selectedNextAction: typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTION_STATUS;
  };
  readonly selectedNextAction: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTION_STATUS;
  readonly sourceRuntimeBasisGate: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_LANDED_GATE;
  readonly sourceRuntimeBasisCounters: typeof POST_V1_GATE_DG_COUNTERS;
  readonly targetOutputs: typeof POST_V1_GATE_EW_TARGET_OUTPUTS;
};

export function buildPostV1GateEWCalibrationOwnerEvidence():
  readonly PostV1GateEWOwnerEvidence[] {
  return [
    {
      acceptedForCalibrationOwner: false,
      evidencePaths: [
        "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
        "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
      ],
      id: "wall_specific_source_row_missing",
      protectsBoundary: "source_locator",
      reason:
        "No wall-specific lined concrete or heavy-masonry source row with stack, topology, metric, basis, and locator ownership exists for the live route.",
      requiredBeforeRuntime: true
    },
    {
      acceptedForCalibrationOwner: false,
      evidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts"
      ],
      id: "bounded_wall_lining_rule_missing",
      protectsBoundary: "formula_tolerance_owner",
      reason:
        "Gate DF/DG bound the existing route and basis but did not name coefficient scope, local tolerance, holdouts, or negative-boundary proof for retuning.",
      requiredBeforeRuntime: true
    },
    {
      acceptedForCalibrationOwner: false,
      evidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-accuracy-gate-dd.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts"
      ],
      id: "current_bounded_prediction_not_calibration_holdout",
      protectsBoundary: "runtime_pin_freeze",
      reason:
        "The current live lab and field pins are executable behavior, not same-family measured calibration/holdout evidence.",
      requiredBeforeRuntime: true
    },
    {
      acceptedForCalibrationOwner: false,
      evidencePaths: [
        "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
        "packages/catalogs/src/index.ts"
      ],
      id: "floor_only_cc60_rows_rejected",
      protectsBoundary: "floor_only_rejection",
      reason:
        "Knauf CC60 concrete rows are floor/ceiling source truth and do not define wall-lining Rw tolerance or mounting topology.",
      requiredBeforeRuntime: false
    },
    {
      acceptedForCalibrationOwner: false,
      evidencePaths: [
        "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
        "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
      ],
      id: "manufacturer_context_missing_mounting_and_tolerance",
      protectsBoundary: "topology_mounting",
      reason:
        "Manufacturer wall-lining context is relevant but lacks side-order, mounting, coupling, source tolerance, and paired negative-boundary metadata.",
      requiredBeforeRuntime: true
    },
    {
      acceptedForCalibrationOwner: false,
      evidencePaths: [
        "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
        "packages/engine/src/dynamic-airborne-framed-wall.ts"
      ],
      id: "formula_context_without_local_tolerance_rejected",
      protectsBoundary: "formula_tolerance_owner",
      reason:
        "ISO/Sharp/Davy context is useful formula background but is not yet translated into a local lined-massive wall single-number tolerance owner.",
      requiredBeforeRuntime: true
    },
    {
      acceptedForCalibrationOwner: false,
      evidencePaths: [
        "packages/engine/src/dynamic-airborne-wall-selector-value-pins.test.ts",
        "packages/engine/src/dynamic-airborne-deep-hybrid-swap-heavy-core.test.ts",
        "apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts"
      ],
      id: "presets_selector_and_deep_hybrid_rejected",
      protectsBoundary: "exact_or_verified_source_precedence",
      reason:
        "Presets, selector value pins, and deep-hybrid guards are drift/stability evidence, not source truth or calibration holdouts.",
      requiredBeforeRuntime: false
    },
    {
      acceptedForCalibrationOwner: false,
      evidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts",
        "packages/engine/src/dynamic-airborne-gate-i-airborne-field-context.ts"
      ],
      id: "metric_basis_boundary_pinned",
      protectsBoundary: "metric_basis",
      reason:
        "Lab bounded Rw/STC/C/Ctr and field R'w/Dn,w/DnT,w/DnT,A remain separate; lab calibration cannot alias into field/building outputs.",
      requiredBeforeRuntime: true
    }
  ] as const satisfies readonly PostV1GateEWOwnerEvidence[];
}

export function summarizePostV1WallHeavyCoreLinedMassiveCalibrationOwnerGateEW():
  PostV1GateEWSummary {
  if (
    POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_LANDED_GATE
  ) {
    throw new Error("Gate EW can only land after Gate EV selects the heavy-core / lined-massive calibration owner.");
  }

  const previousGateEV = summarizePostV1GateEVCurrentCoverageAccuracyGapLedger();
  const evidence = buildPostV1GateEWCalibrationOwnerEvidence();

  if (evidence.some((row) => row.acceptedForCalibrationOwner)) {
    throw new Error("Gate EW must not accept the calibration owner without wall-specific source or bounded-rule evidence.");
  }

  const ownerDecision: PostV1GateEWRejectedOwner = {
    accepted: false,
    decisionId: POST_V1_GATE_EW_OWNER_DECISION_ID,
    missingRequirements: POST_V1_GATE_DD_UNLOCK_REQUIREMENTS,
    reason:
      "Current evidence proves the route must stay bounded/frozen: neither a wall-specific lined concrete/heavy-masonry source row nor a named bounded wall lining rule with tolerance exists.",
    selectedNextAction:
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_FILE
  };

  return {
    evidence,
    fieldRuntimeBasis: POST_V1_GATE_DG_FIELD_RUNTIME_BASIS,
    landedGate: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_LANDED_GATE,
    labRuntimeBasis: POST_V1_GATE_DG_LAB_RUNTIME_BASIS,
    liveRoutePins: POST_V1_GATE_DD_LIVE_ROUTE_PINS,
    noRuntimeCounters: POST_V1_GATE_EW_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    ownerDecision,
    planDocPath: POST_V1_GATE_EW_PLAN_DOC_PATH,
    previousGateEV: {
      counters: previousGateEV.noRuntimeCounters,
      landedGate: previousGateEV.landedGate,
      selectedGapId: previousGateEV.selectedGapId,
      selectedNextAction: previousGateEV.selectedNextAction,
      selectedNextFile: previousGateEV.selectedNextFile,
      selectionStatus: previousGateEV.selectionStatus
    },
    selectedNextAction:
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_LABEL,
    selectionStatus:
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTION_STATUS,
    sourceRuntimeBasisCounters: POST_V1_GATE_DG_COUNTERS,
    sourceRuntimeBasisGate:
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RUNTIME_BASIS_GATE_DG_LANDED_GATE,
    targetOutputs: POST_V1_GATE_EW_TARGET_OUTPUTS
  };
}
