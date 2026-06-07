import type { RequestedOutputId } from "@dynecho/shared";

import {
  MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_PAIRS,
  type MassTimberCltUpperPackageDeltaLwSameSourcePair
} from "./mass-timber-clt-upper-package-delta-lw-runtime";
import {
  POST_V1_GATE_DY_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_DY_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-dy";

export const POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_LANDED_GATE =
  "post_v1_floor_mass_timber_clt_upper_package_delta_lw_owner_gate_dz_plan" as const;

export const POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTION_STATUS =
  "post_v1_floor_mass_timber_clt_upper_package_delta_lw_owner_gate_dz_landed_no_runtime_selected_mass_timber_clt_upper_package_delta_lw_runtime_gate_ea" as const;

export const POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_ACTION =
  "post_v1_floor_mass_timber_clt_upper_package_delta_lw_runtime_gate_ea_plan" as const;

export const POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-mass-timber-clt-upper-package-delta-lw-runtime-gate-ea-contract.test.ts" as const;

export const POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_LABEL =
  "post-V1 floor mass-timber CLT upper-package DeltaLw runtime Gate EA" as const;

export const POST_V1_GATE_DZ_OWNER_ID =
  "floor.mass_timber_clt.upper_package_delta_lw_same_source_reference_owner" as const;

export const POST_V1_GATE_DZ_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export type PostV1GateDZAcceptedSameSourcePair = MassTimberCltUpperPackageDeltaLwSameSourcePair;

export type PostV1GateDZRejectedBoundary = {
  readonly attemptedDeltaLw?: number;
  readonly boundary:
    | "astm_alias_not_iso_delta_lw_owner"
    | "baseline_reference_row_not_treated_owner"
    | "combined_lower_treatment_not_upper_only"
    | "cross_family_delta_lw_borrowing"
    | "formula_corridor_missing_required_physical_inputs"
    | "non_positive_measured_lnw_reduction"
    | "published_family_shorthand_not_exact_pair";
  readonly id: string;
  readonly reason: string;
  readonly relatedSystemIds: readonly string[];
};

export const POST_V1_GATE_DZ_ACCEPTED_SAME_SOURCE_PAIRS =
  MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_SAME_SOURCE_PAIRS;

export const POST_V1_GATE_DZ_REJECTED_BOUNDARIES = [
  {
    boundary: "baseline_reference_row_not_treated_owner",
    id: "tuas_x2_reference_row_rejected_as_delta_lw_owner",
    reason: "TUAS X2 is the 140 mm CLT reference finish package; it can anchor Ln,w but cannot publish DeltaLw by itself.",
    relatedSystemIds: ["tuas_x2_clt140_measured_2026"]
  },
  {
    boundary: "baseline_reference_row_not_treated_owner",
    id: "tuas_c2_reference_row_rejected_as_delta_lw_owner",
    reason: "TUAS C2 is the 260 mm CLT reference finish package; it can anchor Ln,w but cannot publish DeltaLw by itself.",
    relatedSystemIds: ["tuas_c2_clt260_measured_2026"]
  },
  {
    attemptedDeltaLw: -4,
    boundary: "non_positive_measured_lnw_reduction",
    id: "tuas_x5_negative_delta_rejected",
    reason: "TUAS X5 is worse than the same 140 mm CLT reference row, so it is not an improvement DeltaLw owner.",
    relatedSystemIds: ["tuas_x2_clt140_measured_2026", "tuas_x5_clt140_measured_2026"]
  },
  {
    attemptedDeltaLw: -5,
    boundary: "non_positive_measured_lnw_reduction",
    id: "tuas_c5_negative_delta_rejected",
    reason: "TUAS C5 is worse than the same 260 mm CLT reference row, so it is not an improvement DeltaLw owner.",
    relatedSystemIds: ["tuas_c2_clt260_measured_2026", "tuas_c5_clt260_measured_2026"]
  },
  {
    boundary: "combined_lower_treatment_not_upper_only",
    id: "tuas_clt_combined_lower_treatment_rows_rejected",
    reason: "C2c/C3c/C4c/C5c/C7c include suspended ceiling treatment and belong to a combined upper/lower owner lane.",
    relatedSystemIds: [
      "tuas_c2c_clt260_measured_2026",
      "tuas_c3c_clt260_measured_2026",
      "tuas_c4c_clt260_measured_2026",
      "tuas_c5c_clt260_measured_2026",
      "tuas_c7c_clt260_measured_2026"
    ]
  },
  {
    boundary: "published_family_shorthand_not_exact_pair",
    id: "generic_shorthand_estimate_rows_rejected",
    reason: "Packed or shorthand visible packages may still exact-match Ln,w, but Gate DZ does not turn them into DeltaLw owners without the exact same-source pair.",
    relatedSystemIds: ["tuas_x5_clt140_measured_2026", "tuas_c5_clt260_measured_2026"]
  },
  {
    boundary: "formula_corridor_missing_required_physical_inputs",
    id: "clt_formula_corridor_missing_dynamic_stiffness_rejected",
    reason: "The existing CLT formula corridor still needs loadBasisKgM2 and resilientLayerDynamicStiffnessMNm3 when it is not using a same-source DeltaLw pair.",
    relatedSystemIds: []
  },
  {
    boundary: "cross_family_delta_lw_borrowing",
    id: "open_box_open_web_heavy_or_composite_borrowing_rejected",
    reason: "Open-box, open-web, heavy concrete, steel, and composite panel rows are separate owner lanes and cannot supply CLT upper-package DeltaLw.",
    relatedSystemIds: []
  },
  {
    boundary: "astm_alias_not_iso_delta_lw_owner",
    id: "astm_iic_aiic_alias_rejected",
    reason: "ISO DeltaLw does not publish ASTM IIC or AIIC without their own ASTM one-third-octave owner.",
    relatedSystemIds: []
  }
] as const satisfies readonly PostV1GateDZRejectedBoundary[];

export const POST_V1_GATE_DZ_OWNER_POLICY = {
  acceptedSourceFamilyId: "tuas_open_measured_clt_upper_only",
  forbiddenBorrowing: [
    "astm_iic_aiic_alias",
    "composite_panel_published_interaction",
    "heavy_concrete_annexc",
    "open_box_open_web_delta_lw",
    "timber_clt_formula_corridor_without_dynamic_stiffness"
  ],
  noRuntimeValueMovement: true,
  requiredOwnerFields: [
    "baseSlabThicknessMm",
    "elementLabMetricBasis",
    "referenceFloorSystemId",
    "sourceFamilyId",
    "structuralSupportType",
    "treatedFloorSystemId",
    "upperPackageTreatmentClass"
  ],
  runtimeRequiresExactSameSourceReferencePair: true,
  sourceRowsAreAnchorsNotProductCatalog: true
} as const;

export const POST_V1_GATE_DZ_COUNTERS = {
  acceptedSameSourcePairs: POST_V1_GATE_DZ_ACCEPTED_SAME_SOURCE_PAIRS.length,
  broadSourceCrawlSelected: false,
  estimatedNextNewCalculableLayerTemplates: POST_V1_GATE_DZ_ACCEPTED_SAME_SOURCE_PAIRS.length,
  estimatedNextNewCalculableRequestShapes: POST_V1_GATE_DZ_ACCEPTED_SAME_SOURCE_PAIRS.length,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  rejectedBoundaryExamples: POST_V1_GATE_DZ_REJECTED_BOUNDARIES.length,
  runtimeBasisPromotions: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export type PostV1GateDZSummary = {
  readonly acceptedSameSourcePairs: typeof POST_V1_GATE_DZ_ACCEPTED_SAME_SOURCE_PAIRS;
  readonly counters: typeof POST_V1_GATE_DZ_COUNTERS;
  readonly landedGate:
    typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly ownerId: typeof POST_V1_GATE_DZ_OWNER_ID;
  readonly ownerPolicy: typeof POST_V1_GATE_DZ_OWNER_POLICY;
  readonly previousGateDY: {
    readonly counters: typeof POST_V1_GATE_DY_NO_RUNTIME_COUNTERS;
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_LANDED_GATE;
    readonly selectedCandidateId: typeof POST_V1_GATE_DY_SELECTED_CANDIDATE_ID;
    readonly selectedNextAction:
      typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_ACTION;
    readonly selectedNextFile:
      typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_FILE;
    readonly selectionStatus:
      typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTION_STATUS;
  };
  readonly rejectedBoundaries: typeof POST_V1_GATE_DZ_REJECTED_BOUNDARIES;
  readonly selectedNextAction:
    typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_LABEL;
  readonly selectionStatus:
    typeof POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_DZ_TARGET_OUTPUTS;
};

export function summarizePostV1GateDZMassTimberCltUpperPackageDeltaLwOwner(): PostV1GateDZSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_ACTION
      !== POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_LANDED_GATE
  ) {
    throw new Error("Gate DZ cannot land until Gate DY selects the CLT upper-package DeltaLw owner proof.");
  }

  return {
    acceptedSameSourcePairs: POST_V1_GATE_DZ_ACCEPTED_SAME_SOURCE_PAIRS,
    counters: POST_V1_GATE_DZ_COUNTERS,
    landedGate: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_LANDED_GATE,
    noRuntimeValueMovement: true,
    ownerId: POST_V1_GATE_DZ_OWNER_ID,
    ownerPolicy: POST_V1_GATE_DZ_OWNER_POLICY,
    previousGateDY: {
      counters: POST_V1_GATE_DY_NO_RUNTIME_COUNTERS,
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_LANDED_GATE,
      selectedCandidateId: POST_V1_GATE_DY_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DY_SELECTION_STATUS
    },
    rejectedBoundaries: POST_V1_GATE_DZ_REJECTED_BOUNDARIES,
    selectedNextAction:
      POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_FLOOR_MASS_TIMBER_CLT_UPPER_PACKAGE_DELTA_LW_OWNER_GATE_DZ_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_DZ_TARGET_OUTPUTS
  };
}
