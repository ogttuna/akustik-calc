import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_GATE_EI_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EI_PLAN_DOC_PATH,
  POST_V1_GATE_EI_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ei";

export const POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_LANDED_GATE =
  "post_v1_floor_astm_iic_aiic_exact_band_input_surface_gate_ej_plan" as const;

export const POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTION_STATUS =
  "post_v1_floor_astm_iic_aiic_exact_band_input_surface_gate_ej_landed_surface_parity_selected_next_numeric_coverage_gap_gate_ek" as const;

export const POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ek_plan" as const;

export const POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ek-contract.test.ts" as const;

export const POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage/accuracy gap Gate EK" as const;

export const POST_V1_GATE_EJ_SURFACE_ID =
  "floor.astm_iic_aiic_user_band_input_surface" as const;

export const POST_V1_GATE_EJ_TARGET_OUTPUTS = [
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

export type PostV1GateEJInputSurface =
  | "estimate_request_exactImpactSource_standardMethod"
  | "impact_only_request_exactImpactSource_standardMethod"
  | "workbench_impact_band_import_explicit_standardMethod";

export type PostV1GateEJRejectedBoundary = {
  readonly boundary:
    | "ambiguous_standard_method_not_astm_owner"
    | "iso_default_import_not_astm_owner"
    | "lab_field_metric_mismatch"
    | "missing_standard_method_not_astm_owner"
    | "source_row_catalog_not_required"
    | "wrong_metric_formula_alias";
  readonly id: string;
  readonly reason: string;
};

export const POST_V1_GATE_EJ_INPUT_SURFACES = [
  "impact_only_request_exactImpactSource_standardMethod",
  "estimate_request_exactImpactSource_standardMethod",
  "workbench_impact_band_import_explicit_standardMethod"
] as const satisfies readonly PostV1GateEJInputSurface[];

export const POST_V1_GATE_EJ_REJECTED_BOUNDARIES = [
  {
    boundary: "iso_default_import_not_astm_owner",
    id: "iso_10140_16283_import_defaults_stay_iso",
    reason:
      "Workbench/import paths still default to ISO 10140-3 or ISO 16283-2 unless the source explicitly names an ASTM method."
  },
  {
    boundary: "missing_standard_method_not_astm_owner",
    id: "missing_standard_method_stays_standard_owner_stop",
    reason:
      "A one-third-octave grid without ASTM method evidence is not enough to publish IIC or AIIC."
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
    id: "iso_lnw_delta_lw_ci_not_astm_iic_aiic_formula_alias",
    reason:
      "Layer-derived ISO Ln,w, L'nT,w, DeltaLw, CI, and CI,50-2500 results do not alias to ASTM IIC or AIIC."
  },
  {
    boundary: "source_row_catalog_not_required",
    id: "finite_astm_source_row_crawl_not_selected",
    reason:
      "Gate EJ needs no finite ASTM source-row catalog; it only carries explicitly labelled user/import bands to the existing ASTM E989 owner."
  }
] as const satisfies readonly PostV1GateEJRejectedBoundary[];

export const POST_V1_GATE_EJ_COUNTERS = {
  frontendImplementationFilesTouched: 1,
  frontendUiPanelsTouched: 0,
  inputSurfaceLedgers: 1,
  newCalculableLayerTemplates: 0,
  newCalculableMetricBasisRequestShapes: 2,
  newCalculableRequestShapes: 0,
  rejectedBoundaryExamples: POST_V1_GATE_EJ_REJECTED_BOUNDARIES.length,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export const POST_V1_GATE_EJ_SURFACE_POLICY = {
  acceptedStandardMethods: [
    "ASTM E492 / ASTM E989",
    "ASTM E1007 / ASTM E989"
  ],
  defaultImportStandardMethods: [
    "ISO 10140-3",
    "ISO 16283-2"
  ],
  inputSurfaces: POST_V1_GATE_EJ_INPUT_SURFACES,
  noFormulaCoefficientChanges: true,
  noSourceRowCatalogImport: true,
  targetOutputs: POST_V1_GATE_EJ_TARGET_OUTPUTS
} as const;

export type PostV1GateEJSummary = {
  readonly counters: typeof POST_V1_GATE_EJ_COUNTERS;
  readonly landedGate:
    typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_LANDED_GATE;
  readonly planDocPath: typeof POST_V1_GATE_EI_PLAN_DOC_PATH;
  readonly previousGateEI: {
    readonly counters: typeof POST_V1_GATE_EI_NO_RUNTIME_COUNTERS;
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_LANDED_GATE;
    readonly selectedCandidateId: typeof POST_V1_GATE_EI_SELECTED_CANDIDATE_ID;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTION_STATUS;
  };
  readonly rejectedBoundaries: typeof POST_V1_GATE_EJ_REJECTED_BOUNDARIES;
  readonly selectedNextAction:
    typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_LABEL;
  readonly selectionStatus:
    typeof POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTION_STATUS;
  readonly surfaceId: typeof POST_V1_GATE_EJ_SURFACE_ID;
  readonly surfacePolicy: typeof POST_V1_GATE_EJ_SURFACE_POLICY;
};

export function summarizePostV1FloorAstmIicAiicExactBandInputSurfaceGateEJ():
  PostV1GateEJSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_LANDED_GATE
  ) {
    throw new Error("Gate EJ can only land after Gate EI selects the ASTM exact-band input surface.");
  }

  return {
    counters: POST_V1_GATE_EJ_COUNTERS,
    landedGate: POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_LANDED_GATE,
    planDocPath: POST_V1_GATE_EI_PLAN_DOC_PATH,
    previousGateEI: {
      counters: POST_V1_GATE_EI_NO_RUNTIME_COUNTERS,
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_LANDED_GATE,
      selectedCandidateId: POST_V1_GATE_EI_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EI_SELECTION_STATUS
    },
    rejectedBoundaries: POST_V1_GATE_EJ_REJECTED_BOUNDARIES,
    selectedNextAction:
      POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTED_NEXT_LABEL,
    selectionStatus:
      POST_V1_FLOOR_ASTM_IIC_AIIC_EXACT_BAND_INPUT_SURFACE_GATE_EJ_SELECTION_STATUS,
    surfaceId: POST_V1_GATE_EJ_SURFACE_ID,
    surfacePolicy: POST_V1_GATE_EJ_SURFACE_POLICY
  };
}
