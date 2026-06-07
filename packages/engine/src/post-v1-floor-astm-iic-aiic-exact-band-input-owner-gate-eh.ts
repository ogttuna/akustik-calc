import type { RequestedOutputId } from "@dynecho/shared";

import {
  ASTM_E989_AIIC_METRIC_BASIS,
  ASTM_E989_IIC_METRIC_BASIS,
  ASTM_E989_IMPACT_RATING_BASIS,
  ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID
} from "./impact-astm-e989";
import {
  POST_V1_GATE_EG_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EG_PLAN_DOC_PATH,
  POST_V1_GATE_EG_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-eg";

export const POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_LANDED_GATE =
  "post_v1_floor_astm_iic_aiic_exact_band_input_owner_gate_eh_plan" as const;

export const POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTION_STATUS =
  "post_v1_floor_astm_iic_aiic_exact_band_input_owner_gate_eh_landed_no_runtime_selected_next_numeric_coverage_gap_gate_ei" as const;

export const POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ei_plan" as const;

export const POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ei-contract.test.ts" as const;

export const POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage/accuracy gap Gate EI" as const;

export const POST_V1_GATE_EH_OWNER_ID =
  "floor.astm_iic_aiic.exact_band_standard_method_owner" as const;

export const POST_V1_GATE_EH_TARGET_OUTPUTS = [
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

export type PostV1GateEHRequiredOwnerField =
  | "ASTM_E989_contour_rating_owner"
  | "bandSet=one_third_octave_100_3150"
  | "exactImpactSource.frequenciesHz"
  | "exactImpactSource.labOrField=field"
  | "exactImpactSource.labOrField=lab"
  | "exactImpactSource.levelsDb"
  | "metricBasis=astm_e989_aiic_metric_schema_adapter_bridge"
  | "metricBasis=astm_e989_iic_metric_schema_adapter_bridge"
  | "standardMethod=ASTM_E1007_E989"
  | "standardMethod=ASTM_E492_E989";

export type PostV1GateEHRejectedBoundary = {
  readonly boundary:
    | "ambiguous_standard_method_not_astm_owner"
    | "frontend_method_selector_deferred"
    | "iso_band_method_not_astm_owner"
    | "lab_field_metric_mismatch"
    | "missing_standard_method_not_astm_owner"
    | "source_row_catalog_not_required"
    | "wrong_metric_formula_alias";
  readonly id: string;
  readonly reason: string;
};

export const POST_V1_GATE_EH_REQUIRED_OWNER_FIELDS = [
  "exactImpactSource.frequenciesHz",
  "exactImpactSource.levelsDb",
  "bandSet=one_third_octave_100_3150",
  "ASTM_E989_contour_rating_owner",
  "standardMethod=ASTM_E492_E989",
  "exactImpactSource.labOrField=lab",
  "metricBasis=astm_e989_iic_metric_schema_adapter_bridge",
  "standardMethod=ASTM_E1007_E989",
  "exactImpactSource.labOrField=field",
  "metricBasis=astm_e989_aiic_metric_schema_adapter_bridge"
] as const satisfies readonly PostV1GateEHRequiredOwnerField[];

export const POST_V1_GATE_EH_REJECTED_BOUNDARIES = [
  {
    boundary: "iso_band_method_not_astm_owner",
    id: "iso_10140_or_16283_one_third_bands_do_not_publish_iic_aiic",
    reason:
      "ISO impact-band sources may publish ISO impact metrics, but they do not own ASTM IIC or AIIC."
  },
  {
    boundary: "missing_standard_method_not_astm_owner",
    id: "missing_standard_method_stays_standard_owner_stop",
    reason:
      "A one-third-octave band grid without ASTM E492 or ASTM E1007 method evidence is not enough to publish ASTM ratings."
  },
  {
    boundary: "ambiguous_standard_method_not_astm_owner",
    id: "ambiguous_standard_method_stays_standard_owner_stop",
    reason:
      "Generic one-third-octave wording does not select the ASTM E989 contour owner."
  },
  {
    boundary: "lab_field_metric_mismatch",
    id: "lab_astm_e492_owns_iic_field_astm_e1007_owns_aiic",
    reason:
      "Lab ASTM E492/E989 owns IIC only, while field ASTM E1007/E989 owns AIIC only."
  },
  {
    boundary: "wrong_metric_formula_alias",
    id: "iso_lnw_delta_lw_not_astm_iic_aiic_formula_alias",
    reason:
      "ISO Ln,w, L'nT,w, and DeltaLw formulas do not alias to ASTM IIC or AIIC."
  },
  {
    boundary: "source_row_catalog_not_required",
    id: "finite_astm_source_row_crawl_not_selected",
    reason:
      "Gate EH needs no finite ASTM source-row catalog; it pins the exact-band formula owner already in the engine."
  },
  {
    boundary: "frontend_method_selector_deferred",
    id: "workbench_method_selector_not_touched",
    reason:
      "User-facing ASTM method selection is a later input-surface slice; Gate EH touches no frontend implementation."
  }
] as const satisfies readonly PostV1GateEHRejectedBoundary[];

export const POST_V1_GATE_EH_OWNER_POLICY = {
  acceptedAiicMetricBasis: ASTM_E989_AIIC_METRIC_BASIS,
  acceptedIicMetricBasis: ASTM_E989_IIC_METRIC_BASIS,
  acceptedRuntimeBasis: ASTM_E989_IMPACT_RATING_BASIS,
  acceptedRuntimeCandidateId: ASTM_E989_IMPACT_RATING_SELECTED_CANDIDATE_ID,
  acceptedStandardMethods: [
    "ASTM E492 / ASTM E989",
    "ASTM E1007 / ASTM E989"
  ],
  noRuntimeValueMovement: true,
  requiredOwnerFields: POST_V1_GATE_EH_REQUIRED_OWNER_FIELDS,
  sourceRowsAreNotRequiredForOwner: true
} as const;

export const POST_V1_GATE_EH_COUNTERS = {
  acceptedOwnerLedgers: 1,
  astmExactBandRequestShapesPinned: 2,
  frontendImplementationFilesTouched: 0,
  isoToAstmAliasesPromoted: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  rejectedBoundaryExamples: POST_V1_GATE_EH_REJECTED_BOUNDARIES.length,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export type PostV1GateEHSummary = {
  readonly counters: typeof POST_V1_GATE_EH_COUNTERS;
  readonly landedGate:
    typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly ownerId: typeof POST_V1_GATE_EH_OWNER_ID;
  readonly ownerPolicy: typeof POST_V1_GATE_EH_OWNER_POLICY;
  readonly planDocPath: typeof POST_V1_GATE_EG_PLAN_DOC_PATH;
  readonly previousGateEG: {
    readonly counters: typeof POST_V1_GATE_EG_NO_RUNTIME_COUNTERS;
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_LANDED_GATE;
    readonly selectedCandidateId: typeof POST_V1_GATE_EG_SELECTED_CANDIDATE_ID;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTION_STATUS;
  };
  readonly rejectedBoundaries: typeof POST_V1_GATE_EH_REJECTED_BOUNDARIES;
  readonly selectedNextAction:
    typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_LABEL;
  readonly selectionStatus:
    typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_EH_TARGET_OUTPUTS;
};

export function summarizePostV1FloorAstmIicAiicExactBandInputOwnerGateEH():
  PostV1GateEHSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_LANDED_GATE
  ) {
    throw new Error("Gate EH can only land after Gate EG selects the ASTM exact-band input owner.");
  }

  return {
    counters: POST_V1_GATE_EH_COUNTERS,
    landedGate: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_LANDED_GATE,
    noRuntimeValueMovement: true,
    ownerId: POST_V1_GATE_EH_OWNER_ID,
    ownerPolicy: POST_V1_GATE_EH_OWNER_POLICY,
    planDocPath: POST_V1_GATE_EG_PLAN_DOC_PATH,
    previousGateEG: {
      counters: POST_V1_GATE_EG_NO_RUNTIME_COUNTERS,
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_LANDED_GATE,
      selectedCandidateId: POST_V1_GATE_EG_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EG_SELECTION_STATUS
    },
    rejectedBoundaries: POST_V1_GATE_EH_REJECTED_BOUNDARIES,
    selectedNextAction:
      POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTED_NEXT_LABEL,
    selectionStatus:
      POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_OWNER_GATE_EH_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_EH_TARGET_OUTPUTS
  };
}
