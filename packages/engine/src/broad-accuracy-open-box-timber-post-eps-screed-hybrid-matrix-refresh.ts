import {
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTION_STATUS
} from "./broad-accuracy-floor-open-box-timber-eps-screed-hybrid-package-surface-parity";
import { OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS } from "./open-box-timber-eps-screed-hybrid-package-estimate";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_BOX_TIMBER_SIMILARITY_BASIS } from "./open-box-timber-similarity-estimate";

export const BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_LANDED_GATE =
  "broad_accuracy_open_box_timber_post_eps_screed_hybrid_matrix_refresh_plan";

export const BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTION_STATUS =
  "broad_accuracy_open_box_timber_post_eps_screed_hybrid_matrix_refresh_landed_no_runtime_selected_open_web_raw_bare_owner";

export const BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION =
  "broad_accuracy_floor_open_web_raw_bare_carrier_owner_plan";

export const BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_FILE =
  "packages/engine/src/broad-accuracy-floor-open-web-raw-bare-carrier-owner-contract.test.ts";

export const BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_LABEL =
  "floor open-web raw-bare carrier owner";

export type BroadAccuracyOpenBoxTimberPostEpsMatrixMetricId =
  | "AIIC"
  | "C"
  | "CI"
  | "CI,50-2500"
  | "Ctr"
  | "DnT,w"
  | "IIC"
  | "L'n,w"
  | "L'nT,w"
  | "Ln,w"
  | "Ln,w+CI"
  | "R'w"
  | "Rw"
  | "Rw+C";

export type BroadAccuracyOpenBoxTimberPostEpsMatrixRowId =
  | "floor.open_box_timber_package_transfer_dry_gypsum_fiber.lab"
  | "floor.open_box_timber_package_transfer_thin_laminate.lab"
  | "floor.open_box_timber_package_transfer_reinforced_ceiling.lab"
  | "floor.open_box_timber_raw_bare_370.lab"
  | "floor.open_box_timber_raw_bare_220.lab"
  | "floor.open_box_timber_eps_screed_hybrid.lab"
  | "floor.open_box_timber_eps_screed_hybrid_safe_split.lab"
  | "floor.open_box_timber_r7b_exact_precedence.lab"
  | "floor.open_box_timber_r5b_exact_precedence.lab"
  | "floor.open_box_timber_dry_package_separate_from_eps.boundary"
  | "floor.open_box_timber_raw_bare_separate_from_eps.boundary"
  | "floor.open_box_timber_r8b_partial_no_finish.boundary"
  | "floor.open_box_timber_r9b_screed_only.boundary"
  | "floor.open_box_timber_r2c_missing_lower_mass.boundary"
  | "floor.open_box_timber_r10a_mixed_staged.boundary"
  | "floor.open_box_timber_field_building.boundary"
  | "floor.open_box_timber_astm_iic.unsupported"
  | "floor.open_web_raw_bare_owner.next";

export type BroadAccuracyOpenBoxTimberPostEpsMatrixPosture =
  | "exact"
  | "family_physics"
  | "followup_ranked"
  | "needs_input"
  | "separate_lane"
  | "unsupported";

export type BroadAccuracyOpenBoxTimberPostEpsMatrixFailureClass =
  | "basis_boundary"
  | "correct_block"
  | "coverage_followup"
  | "exact_precedence_boundary"
  | "none"
  | "separate_lane_boundary";

export type BroadAccuracyOpenBoxTimberPostEpsMatrixErrorBudgetPin = {
  readonly metric: BroadAccuracyOpenBoxTimberPostEpsMatrixMetricId;
  readonly toleranceDb: number;
};

export type BroadAccuracyOpenBoxTimberPostEpsMatrixRow = {
  readonly basis: "astm_rating_boundary" | "building_prediction" | "element_lab" | "field_apparent";
  readonly currentPosture: BroadAccuracyOpenBoxTimberPostEpsMatrixPosture;
  readonly errorBudgetPins: readonly BroadAccuracyOpenBoxTimberPostEpsMatrixErrorBudgetPin[];
  readonly expectedBasisId: string | null;
  readonly failureClass: BroadAccuracyOpenBoxTimberPostEpsMatrixFailureClass;
  readonly id: BroadAccuracyOpenBoxTimberPostEpsMatrixRowId;
  readonly missingPhysicalInputs: readonly string[];
  readonly nextAction: string;
  readonly originSupportBucket:
    | "basis_boundary"
    | "exact_source"
    | "ranked_followup"
    | "separate_supported_lane"
    | "source_absent_family_physics"
    | "wrong_family_guard";
  readonly requestedMetrics: readonly BroadAccuracyOpenBoxTimberPostEpsMatrixMetricId[];
  readonly route: "floor";
  readonly supportedTargetOutputs: readonly BroadAccuracyOpenBoxTimberPostEpsMatrixMetricId[];
  readonly unsupportedTargetOutputs: readonly BroadAccuracyOpenBoxTimberPostEpsMatrixMetricId[];
  readonly valuePins: readonly {
    readonly metric: BroadAccuracyOpenBoxTimberPostEpsMatrixMetricId;
    readonly value: number;
  }[];
};

export type BroadAccuracyOpenBoxTimberPostEpsOperatingEnvelopeSnapshot = {
  readonly blockedAliases: readonly string[];
  readonly outputBases: readonly string[];
  readonly requiredPhysicalInputGroups: readonly string[];
  readonly selectedNextGapCluster: typeof BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION;
  readonly supportedFamilyRoutes: readonly string[];
  readonly toleranceBudgetFamilies: readonly string[];
};

export type BroadAccuracyOpenBoxTimberPostEpsMatrixSummary = {
  readonly basisBoundaryRowIds: readonly BroadAccuracyOpenBoxTimberPostEpsMatrixRowId[];
  readonly correctlyBlockedRowIds: readonly BroadAccuracyOpenBoxTimberPostEpsMatrixRowId[];
  readonly exactPrecedenceBoundaryRowIds: readonly BroadAccuracyOpenBoxTimberPostEpsMatrixRowId[];
  readonly failureClassCounts: Record<BroadAccuracyOpenBoxTimberPostEpsMatrixFailureClass, number>;
  readonly noRuntimeValueMovement: true;
  readonly rankedFollowupRowIds: readonly BroadAccuracyOpenBoxTimberPostEpsMatrixRowId[];
  readonly rowCount: number;
  readonly selectedNextAction: typeof BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_LABEL;
  readonly separateLaneBoundaryRowIds: readonly BroadAccuracyOpenBoxTimberPostEpsMatrixRowId[];
  readonly supportedRuntimeRowIds: readonly BroadAccuracyOpenBoxTimberPostEpsMatrixRowId[];
};

export type BroadAccuracyOpenBoxTimberPostEpsMatrixRefreshContract = {
  readonly landedGate: typeof BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_LANDED_GATE;
  readonly matrixRows: readonly BroadAccuracyOpenBoxTimberPostEpsMatrixRow[];
  readonly noRuntimeValueMovement: true;
  readonly operatingEnvelope: BroadAccuracyOpenBoxTimberPostEpsOperatingEnvelopeSnapshot;
  readonly previousSurfaceParity: {
    readonly landedGate: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_LANDED_GATE;
    readonly selectedNextAction: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTION_STATUS;
  };
  readonly remainingFollowups: readonly {
    readonly id:
      | "airborne_or_impact_field_building_adapter"
      | "astm_iic_aiic_rating_curve_owner"
      | "open_web_raw_bare_carrier_owner"
      | "tuas_c11c_source_tuple_recheck";
    readonly reason: string;
    readonly selectedNow: boolean;
  }[];
  readonly selectedNextAction: typeof BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTION_STATUS;
  readonly summary: BroadAccuracyOpenBoxTimberPostEpsMatrixSummary;
};

const PACKAGE_TRANSFER_BUDGETS = [
  { metric: "Ln,w", toleranceDb: 7 },
  { metric: "CI", toleranceDb: 2 },
  { metric: "CI,50-2500", toleranceDb: 2.5 },
  { metric: "Ln,w+CI", toleranceDb: 7.5 },
  { metric: "Rw", toleranceDb: 6 },
  { metric: "Rw+C", toleranceDb: 6 }
] as const satisfies readonly BroadAccuracyOpenBoxTimberPostEpsMatrixErrorBudgetPin[];

const RAW_BARE_BUDGETS = [
  { metric: "Rw", toleranceDb: 8 },
  { metric: "C", toleranceDb: 2.5 },
  { metric: "Ctr", toleranceDb: 3.5 },
  { metric: "Ln,w", toleranceDb: 10 },
  { metric: "CI", toleranceDb: 3 },
  { metric: "CI,50-2500", toleranceDb: 4 },
  { metric: "Ln,w+CI", toleranceDb: 10.5 }
] as const satisfies readonly BroadAccuracyOpenBoxTimberPostEpsMatrixErrorBudgetPin[];

const EPS_SCREED_BUDGETS = [
  { metric: "Rw", toleranceDb: 7 },
  { metric: "C", toleranceDb: 3 },
  { metric: "Rw+C", toleranceDb: 7.5 },
  { metric: "Ln,w", toleranceDb: 8 },
  { metric: "CI", toleranceDb: 2.5 },
  { metric: "CI,50-2500", toleranceDb: 3 },
  { metric: "Ln,w+CI", toleranceDb: 8.5 }
] as const satisfies readonly BroadAccuracyOpenBoxTimberPostEpsMatrixErrorBudgetPin[];

export function buildBroadAccuracyOpenBoxTimberPostEpsScreedHybridMatrix():
  readonly BroadAccuracyOpenBoxTimberPostEpsMatrixRow[] {
  return [
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: PACKAGE_TRANSFER_BUDGETS,
      expectedBasisId: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      failureClass: "none",
      id: "floor.open_box_timber_package_transfer_dry_gypsum_fiber.lab",
      missingPhysicalInputs: [],
      nextAction: "keep dry gypsum-fiber package-transfer runtime pinned after EPS/screed parity",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 66 },
        { metric: "C", value: -3.9 },
        { metric: "Ln,w", value: 50.8 },
        { metric: "CI", value: 1.3 },
        { metric: "CI,50-2500", value: 3.3 },
        { metric: "Ln,w+CI", value: 52 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: PACKAGE_TRANSFER_BUDGETS,
      expectedBasisId: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      failureClass: "none",
      id: "floor.open_box_timber_package_transfer_thin_laminate.lab",
      missingPhysicalInputs: [],
      nextAction: "keep thin laminate/EPS package-transfer runtime pinned",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 55.5 },
        { metric: "C", value: -3.2 },
        { metric: "Ln,w", value: 53.5 },
        { metric: "CI", value: 1.5 },
        { metric: "CI,50-2500", value: 3.5 },
        { metric: "Ln,w+CI", value: 55 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: PACKAGE_TRANSFER_BUDGETS,
      expectedBasisId: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      failureClass: "none",
      id: "floor.open_box_timber_package_transfer_reinforced_ceiling.lab",
      missingPhysicalInputs: [],
      nextAction: "keep reinforced-ceiling package-transfer runtime pinned",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 63.5 },
        { metric: "C", value: -1.9 },
        { metric: "Ln,w", value: 53.5 },
        { metric: "CI", value: 0.5 },
        { metric: "CI,50-2500", value: 2 },
        { metric: "Ln,w+CI", value: 54 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: RAW_BARE_BUDGETS,
      expectedBasisId: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      failureClass: "none",
      id: "floor.open_box_timber_raw_bare_370.lab",
      missingPhysicalInputs: [],
      nextAction: "keep 370 mm raw-bare open-box timber runtime pinned",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 42.3 },
        { metric: "C", value: -1.4 },
        { metric: "Ctr", value: -5.8 },
        { metric: "Ln,w", value: 88.2 },
        { metric: "CI", value: -1.1 },
        { metric: "CI,50-2500", value: 3.1 },
        { metric: "Ln,w+CI", value: 87.1 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: RAW_BARE_BUDGETS,
      expectedBasisId: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      failureClass: "none",
      id: "floor.open_box_timber_raw_bare_220.lab",
      missingPhysicalInputs: [],
      nextAction: "keep 220 mm raw-bare open-box timber runtime pinned separately",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ctr", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 38.1 },
        { metric: "C", value: -1.6 },
        { metric: "Ctr", value: -6.2 },
        { metric: "Ln,w", value: 91.1 },
        { metric: "CI", value: -0.9 },
        { metric: "CI,50-2500", value: 3.4 },
        { metric: "Ln,w+CI", value: 90.2 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: EPS_SCREED_BUDGETS,
      expectedBasisId: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS,
      failureClass: "none",
      id: "floor.open_box_timber_eps_screed_hybrid.lab",
      missingPhysicalInputs: [],
      nextAction: "keep complete EPS/screed hybrid package runtime pinned",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 72 },
        { metric: "C", value: -1.3 },
        { metric: "Rw+C", value: 70.7 },
        { metric: "Ln,w", value: 47 },
        { metric: "CI", value: 0 },
        { metric: "CI,50-2500", value: 1 },
        { metric: "Ln,w+CI", value: 47 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "family_physics",
      errorBudgetPins: EPS_SCREED_BUDGETS,
      expectedBasisId: OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS,
      failureClass: "none",
      id: "floor.open_box_timber_eps_screed_hybrid_safe_split.lab",
      missingPhysicalInputs: [],
      nextAction: "keep safe split 185/185 mm support equivalent on the EPS/screed runtime lane",
      originSupportBucket: "source_absent_family_physics",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 72 },
        { metric: "C", value: -1.3 },
        { metric: "Rw+C", value: 70.7 },
        { metric: "Ln,w", value: 47 },
        { metric: "CI", value: 0 },
        { metric: "CI,50-2500", value: 1 },
        { metric: "Ln,w+CI", value: 47 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "exact",
      errorBudgetPins: [],
      expectedBasisId: "open_measured_floor_system_exact_match",
      failureClass: "exact_precedence_boundary",
      id: "floor.open_box_timber_r7b_exact_precedence.lab",
      missingPhysicalInputs: [],
      nextAction: "keep exact R7b ahead of EPS/screed source-absent runtime",
      originSupportBucket: "exact_source",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 72 },
        { metric: "C", value: -1.2735691827219923 },
        { metric: "Ln,w", value: 47 },
        { metric: "CI", value: 0 },
        { metric: "CI,50-2500", value: 1 },
        { metric: "Ln,w+CI", value: 47 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "exact",
      errorBudgetPins: [],
      expectedBasisId: "open_measured_floor_system_exact_match",
      failureClass: "exact_precedence_boundary",
      id: "floor.open_box_timber_r5b_exact_precedence.lab",
      missingPhysicalInputs: [],
      nextAction: "keep exact R5b ahead of package-transfer runtime",
      originSupportBucket: "exact_source",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 75 },
        { metric: "C", value: -3.124688292278481 },
        { metric: "Ln,w", value: 44 },
        { metric: "CI", value: 0 },
        { metric: "CI,50-2500", value: 3 },
        { metric: "Ln,w+CI", value: 44 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "separate_lane",
      errorBudgetPins: PACKAGE_TRANSFER_BUDGETS,
      expectedBasisId: OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      failureClass: "separate_lane_boundary",
      id: "floor.open_box_timber_dry_package_separate_from_eps.boundary",
      missingPhysicalInputs: [],
      nextAction: "keep dry package-transfer separate from EPS/screed hybrid runtime",
      originSupportBucket: "separate_supported_lane",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 66 },
        { metric: "Ln,w", value: 50.8 },
        { metric: "CI,50-2500", value: 3.3 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "separate_lane",
      errorBudgetPins: RAW_BARE_BUDGETS,
      expectedBasisId: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      failureClass: "separate_lane_boundary",
      id: "floor.open_box_timber_raw_bare_separate_from_eps.boundary",
      missingPhysicalInputs: [],
      nextAction: "keep raw-bare support route separate from EPS/screed hybrid runtime",
      originSupportBucket: "separate_supported_lane",
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ctr", "Ln,w", "CI,50-2500", "Ln,w+CI"],
      unsupportedTargetOutputs: [],
      valuePins: [
        { metric: "Rw", value: 42.3 },
        { metric: "Ln,w", value: 88.2 },
        { metric: "CI,50-2500", value: 3.1 }
      ]
    },
    {
      basis: "element_lab",
      currentPosture: "needs_input",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "floor.open_box_timber_r8b_partial_no_finish.boundary",
      missingPhysicalInputs: ["floorCoveringOwner", "resilientLayerOwner", "completeFinishPairOwner"],
      nextAction: "keep R8b as partial/no-finish evidence, not a complete EPS/screed runtime anchor",
      originSupportBucket: "basis_boundary",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C"],
      unsupportedTargetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "needs_input",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "floor.open_box_timber_r9b_screed_only.boundary",
      missingPhysicalInputs: ["upperFillOwner", "wetScreedOnlyBoundaryOwner"],
      nextAction: "keep R9b as screed-only evidence, not the complete EPS-board plus screed runtime",
      originSupportBucket: "basis_boundary",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C"],
      unsupportedTargetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "needs_input",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "floor.open_box_timber_r2c_missing_lower_mass.boundary",
      missingPhysicalInputs: ["ceilingFillOwner", "upperFillOwner", "floatingScreedOwner", "lowerMassInteractionOwner"],
      nextAction: "keep R2c out of EPS/screed runtime because lower and upper mass owners are missing",
      originSupportBucket: "basis_boundary",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C"],
      unsupportedTargetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "needs_input",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "floor.open_box_timber_r10a_mixed_staged.boundary",
      missingPhysicalInputs: ["mixedStagedUpperPackageOwner", "samePackagePredictorRowOwner"],
      nextAction: "keep R10a as mixed-staged evidence until its staged upper package owns a formula lane",
      originSupportBucket: "basis_boundary",
      requestedMetrics: ["Rw", "C", "Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C"],
      unsupportedTargetOutputs: ["Ln,w", "CI", "CI,50-2500", "Ln,w+CI"],
      valuePins: []
    },
    {
      basis: "field_apparent",
      currentPosture: "unsupported",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "basis_boundary",
      id: "floor.open_box_timber_field_building.boundary",
      missingPhysicalInputs: ["impactFieldContextOwner", "airborneFieldContextOwner", "buildingPredictionAdapterOwner"],
      nextAction: "do not alias open-box element-lab values or budgets to field apparent or building-prediction outputs",
      originSupportBucket: "basis_boundary",
      requestedMetrics: ["L'n,w", "L'nT,w", "R'w", "DnT,w"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["L'n,w", "L'nT,w", "R'w", "DnT,w"],
      valuePins: []
    },
    {
      basis: "astm_rating_boundary",
      currentPosture: "unsupported",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "correct_block",
      id: "floor.open_box_timber_astm_iic.unsupported",
      missingPhysicalInputs: ["ASTM E492/E989 IIC rating curve owner", "AIIC field rating owner"],
      nextAction: "keep ISO Ln,w/CI evidence out of ASTM IIC/AIIC outputs",
      originSupportBucket: "basis_boundary",
      requestedMetrics: ["IIC", "AIIC"],
      route: "floor",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["IIC", "AIIC"],
      valuePins: []
    },
    {
      basis: "element_lab",
      currentPosture: "followup_ranked",
      errorBudgetPins: [],
      expectedBasisId: null,
      failureClass: "coverage_followup",
      id: "floor.open_web_raw_bare_owner.next",
      missingPhysicalInputs: [
        "openWebBareCarrierSupportFormOwner",
        "openWebBareImpactCurveOwner",
        "openWebSourceAbsentBudgetOwner"
      ],
      nextAction: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
      originSupportBucket: "ranked_followup",
      requestedMetrics: ["Rw", "C", "Ctr", "Ln,w", "CI,50-2500", "Ln,w+CI"],
      route: "floor",
      supportedTargetOutputs: ["Rw", "C", "Ctr"],
      unsupportedTargetOutputs: ["Ln,w", "CI,50-2500", "Ln,w+CI"],
      valuePins: []
    }
  ];
}

export function buildBroadAccuracyOpenBoxTimberPostEpsOperatingEnvelopeSnapshot():
  BroadAccuracyOpenBoxTimberPostEpsOperatingEnvelopeSnapshot {
  return {
    blockedAliases: [
      "field/building impact outputs require field or building adapters",
      "R'w and DnT,w are not inferred from floor element-lab impact values",
      "ASTM/IIC outputs require ASTM contour/rating owners",
      "exact-only sibling rows cannot become generic EPS/screed anchors"
    ],
    outputBases: [
      "element_lab",
      "open_measured_floor_system_exact_match",
      OPEN_BOX_TIMBER_SIMILARITY_BASIS,
      OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS
    ],
    requiredPhysicalInputGroups: [
      "open-box timber support family and total carrier thickness",
      "floor covering and resilient-layer ownership",
      "upper-fill and floating-screed package ownership",
      "lower ceiling board/fill/cavity ownership",
      "explicit field/building or ASTM owner sets before non-lab outputs"
    ],
    selectedNextGapCluster:
      BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
    supportedFamilyRoutes: [
      "exact TUAS open-box timber source rows",
      "open-box timber package-transfer source-absent family corridor",
      "open-box timber raw-bare source-absent family corridor",
      "open-box timber EPS/screed hybrid source-absent family corridor"
    ],
    toleranceBudgetFamilies: [
      "package-transfer: +/-7 dB Ln,w, +/-6 dB Rw",
      "raw-bare: +/-10 dB Ln,w, +/-8 dB Rw",
      "EPS/screed hybrid: +/-8 dB Ln,w, +/-7 dB Rw"
    ]
  };
}

export function summarizeBroadAccuracyOpenBoxTimberPostEpsScreedHybridMatrix(
  rows: readonly BroadAccuracyOpenBoxTimberPostEpsMatrixRow[]
): BroadAccuracyOpenBoxTimberPostEpsMatrixSummary {
  const failureClassCounts: Record<BroadAccuracyOpenBoxTimberPostEpsMatrixFailureClass, number> = {
    basis_boundary: 0,
    correct_block: 0,
    coverage_followup: 0,
    exact_precedence_boundary: 0,
    none: 0,
    separate_lane_boundary: 0
  };

  for (const row of rows) {
    failureClassCounts[row.failureClass] += 1;
  }

  return {
    basisBoundaryRowIds: rows.filter((row) => row.failureClass === "basis_boundary").map((row) => row.id),
    correctlyBlockedRowIds: rows.filter((row) => row.failureClass === "correct_block").map((row) => row.id),
    exactPrecedenceBoundaryRowIds: rows
      .filter((row) => row.failureClass === "exact_precedence_boundary")
      .map((row) => row.id),
    failureClassCounts,
    noRuntimeValueMovement: true,
    rankedFollowupRowIds: rows.filter((row) => row.failureClass === "coverage_followup").map((row) => row.id),
    rowCount: rows.length,
    selectedNextAction: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_LABEL,
    separateLaneBoundaryRowIds: rows
      .filter((row) => row.failureClass === "separate_lane_boundary")
      .map((row) => row.id),
    supportedRuntimeRowIds: rows
      .filter((row) =>
        row.failureClass === "none" &&
        (row.expectedBasisId === OPEN_BOX_TIMBER_SIMILARITY_BASIS ||
          row.expectedBasisId === OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS ||
          row.expectedBasisId === OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_BASIS)
      )
      .map((row) => row.id)
  };
}

export function buildBroadAccuracyOpenBoxTimberPostEpsScreedHybridMatrixRefreshContract():
  BroadAccuracyOpenBoxTimberPostEpsMatrixRefreshContract {
  const matrixRows = buildBroadAccuracyOpenBoxTimberPostEpsScreedHybridMatrix();

  return {
    landedGate: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_LANDED_GATE,
    matrixRows,
    noRuntimeValueMovement: true,
    operatingEnvelope: buildBroadAccuracyOpenBoxTimberPostEpsOperatingEnvelopeSnapshot(),
    previousSurfaceParity: {
      landedGate: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_LANDED_GATE,
      selectedNextAction: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectionStatus: BROAD_ACCURACY_FLOOR_OPEN_BOX_TIMBER_EPS_SCREED_HYBRID_PACKAGE_SURFACE_PARITY_SELECTION_STATUS
    },
    remainingFollowups: [
      {
        id: "open_web_raw_bare_carrier_owner",
        reason:
          "selected now because open-box package-transfer/raw-bare/EPS lanes are visible and the remaining common floor gap is raw open-web impact ownership, not another open-box retune",
        selectedNow: true
      },
      {
        id: "tuas_c11c_source_tuple_recheck",
        reason:
          "not selected here because C11c still has a source/frequency tuple anomaly and should not be exact-promoted or used as a formula anchor",
        selectedNow: false
      },
      {
        id: "airborne_or_impact_field_building_adapter",
        reason:
          "not selected here because element-lab open-box Rw/Ln,w values cannot alias to field apparent or building-prediction outputs",
        selectedNow: false
      },
      {
        id: "astm_iic_aiic_rating_curve_owner",
        reason: "not selected here because ISO Ln,w/CI evidence cannot create ASTM IIC/AIIC ratings",
        selectedNow: false
      }
    ],
    selectedNextAction: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTED_NEXT_LABEL,
    selectionStatus: BROAD_ACCURACY_OPEN_BOX_TIMBER_POST_EPS_SCREED_HYBRID_MATRIX_REFRESH_SELECTION_STATUS,
    summary: summarizeBroadAccuracyOpenBoxTimberPostEpsScreedHybridMatrix(matrixRows)
  };
}
