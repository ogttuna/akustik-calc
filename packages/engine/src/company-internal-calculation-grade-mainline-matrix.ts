import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  type PersonalUseMvpCoverageFailureClass,
  type PersonalUseMvpCoverageMetricValuePin,
  type PersonalUseMvpCoverageOutputBasis,
  type PersonalUseMvpCoveragePosture,
  type PersonalUseMvpCoverageRoute,
  type PersonalUseMvpCoverageScenarioRow,
  type PersonalUseMvpCoverageVisibleSurface
} from "./calculator-personal-use-mvp-coverage-sprint";
import {
  buildPersonalUseMvpCoverageSprintGateBQScenarioMatrix,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bq";
import {
  buildPersonalUseMvpCoverageSprintGateATScenarioMatrix
} from "./calculator-personal-use-mvp-coverage-sprint-gate-at";
import {
  COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD,
  COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-company-internal-heavy-composite-wall";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  buildSteelFloorFormulaPredictorInputFromSurface,
  STEEL_FLOOR_SUSPENDED_CEILING_DELTA_LW_OWNER_INPUTS
} from "./steel-floor-formula-input-surface";
import {
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_REFERENCE_FLOOR_TYPE
} from "./steel-floor-impact-formula-corridor";
import {
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
  COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS
} from "./company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT,
  COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT
} from "./company-internal-opening-leak-building-runtime-corridor-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
} from "./company-internal-opening-leak-building-runtime-corridor";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_BUILDING_CONTEXT,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_FIELD_CONTEXT
} from "./company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTION_STATUS
} from "./company-internal-opening-leak-a-weighted-spectrum-adapter-surface-parity-contract";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_LANDED_GATE =
  "company_internal_calculation_grade_matrix_refresh_after_heavy_composite_plan";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTION_STATUS =
  "company_internal_calculation_grade_matrix_refresh_after_heavy_composite_landed_no_runtime_selected_steel_suspended_ceiling_delta_lw_owner_contract";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_ACTION =
  "company_internal_steel_suspended_ceiling_delta_lw_owner_contract_plan";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-owner-contract.test.ts";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_LABEL =
  "steel suspended-ceiling ISO DeltaLw owner contract";

export const COMPANY_INTERNAL_CALCULATION_GRADE_HEAVY_COMPOSITE_ROW_IDS = [
  "wall.heavy_composite_complete_family_physics.lab",
  "wall.heavy_composite_complete_field_adapter.field",
  "wall.building_prediction_missing_context.needs_input"
] as const;

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_LANDED_GATE =
  "company_internal_calculation_grade_mainline_matrix_v2_refresh_plan";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTION_STATUS =
  "company_internal_calculation_grade_mainline_matrix_v2_refresh_landed_selected_steel_suspended_ceiling_delta_lw_runtime_corridor";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_ACTION =
  "company_internal_steel_suspended_ceiling_delta_lw_runtime_corridor_plan";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_LABEL =
  "steel suspended-ceiling ISO DeltaLw numeric runtime corridor";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_IMPORTED_BUILDING_ROW_IDS = [
  "wall.complete_building_prediction.runtime",
  "wall.complete_building_prediction_broad_targets.alias_boundary",
  "wall.building_prediction_partial_context.needs_input"
] as const;

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RETIRED_ROW_IDS = [
  "wall.building_prediction_missing_context.needs_input",
  "floor.lightweight_steel_suspended_ceiling_delta_lw.unsupported"
] as const;

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RECLASSIFIED_ORIGIN_ROW_IDS = [
  "floor.heavy_concrete_floating_floor.lab"
] as const;

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_STEEL_DELTA_LW_OWNER_ROW_ID =
  "floor.lightweight_steel_suspended_ceiling_delta_lw.needs_input";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_LANDED_GATE =
  "company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_plan";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTION_STATUS =
  "company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_landed_selected_steel_suspended_ceiling_low_frequency_lnt50_owner";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_ACTION =
  "company_internal_steel_suspended_ceiling_low_frequency_lnt50_owner_contract_plan";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-steel-suspended-ceiling-low-frequency-lnt50-owner-contract.test.ts";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_LABEL =
  "steel suspended-ceiling L'nT,50 low-frequency owner contract";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_STEEL_DELTA_LW_RUNTIME_ROW_ID =
  "floor.lightweight_steel_suspended_ceiling_delta_lw.runtime";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_RETIRED_ROW_IDS = [
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_STEEL_DELTA_LW_OWNER_ROW_ID
] as const;

const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_PREVIOUS_SURFACE_PARITY_LANDED_GATE =
  "company_internal_steel_suspended_ceiling_delta_lw_surface_parity_plan";

const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_PREVIOUS_SURFACE_PARITY_SELECTION_STATUS =
  "company_internal_steel_suspended_ceiling_delta_lw_surface_parity_landed_selected_matrix_v3_refresh";

const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_PREVIOUS_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "company_internal_calculation_grade_mainline_matrix_v3_refresh_after_steel_delta_lw_surface_parity_plan";

const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_PREVIOUS_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v3-contract.test.ts";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_LANDED_GATE =
  "company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_plan";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTION_STATUS =
  "company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_landed_selected_opening_leak_building_adapter_owner";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_ACTION =
  "company_internal_opening_leak_building_adapter_owner_contract_plan";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-opening-leak-building-adapter-owner-contract.test.ts";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_LABEL =
  "opening/leak building-context adapter owner contract";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_RUNTIME_ROW_ID =
  "floor.lightweight_steel_suspended_ceiling_lnt50.runtime";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_MISSING_CI_ROW_ID =
  "floor.lightweight_steel_suspended_ceiling_lnt50_missing_ci.unsupported";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_EXACT_FIELD_ROW_ID =
  "floor.lightweight_steel_suspended_ceiling_lnt50_exact_field_precedence.field";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_IMPORTED_ROW_IDS = [
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_RUNTIME_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_MISSING_CI_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_EXACT_FIELD_ROW_ID
] as const;

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_RETIRED_ROW_IDS = [
  "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported"
] as const;

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_LANDED_GATE =
  "company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_plan";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTION_STATUS =
  "company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_landed_selected_opening_leak_a_weighted_adapter_owner";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION =
  "company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_plan";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract.test.ts";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_LABEL =
  "opening/leak Dn,A / DnT,A spectrum-adapter owner contract";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_FIELD_ROW_ID =
  "wall.opening_leak_field_runtime.input_surface";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_ROW_ID =
  "wall.opening_leak_building_runtime.input_surface";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_A_WEIGHTED_ROW_ID =
  "wall.opening_leak_a_weighted_boundary.unsupported";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID =
  "wall.opening_leak_building_missing_owner.needs_input";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_IMPORTED_ROW_IDS = [
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_FIELD_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_A_WEIGHTED_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID
] as const;

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_RETIRED_ROW_IDS = [
  "wall.opening_leak_composite_building_boundary.unsupported"
] as const;

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_LANDED_GATE =
  "company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_plan";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTION_STATUS =
  "company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_landed_selected_boundary_revalidation";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_ACTION =
  "company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_plan";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-building-astm-boundary-revalidation-contract.test.ts";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_LABEL =
  "building partial-context and ASTM parked-boundary revalidation";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_FIELD_ROW_ID =
  "wall.opening_leak_a_weighted_field_runtime.input_surface";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_ROW_ID =
  "wall.opening_leak_a_weighted_building_runtime.input_surface";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_DNA_ROW_ID =
  "wall.opening_leak_a_weighted_building_dna.unsupported";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_MISSING_BAND_ROW_ID =
  "wall.opening_leak_a_weighted_missing_frequency.needs_input";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_LAB_ALIAS_ROW_ID =
  "wall.opening_leak_a_weighted_lab_alias.unsupported";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_ASTM_ALIAS_ROW_ID =
  "wall.opening_leak_a_weighted_astm_alias.unsupported";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_EXACT_SOURCE_ROW_ID =
  "wall.opening_leak_a_weighted_exact_source_precedence.boundary";

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_IMPORTED_ROW_IDS = [
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_FIELD_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_DNA_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_MISSING_BAND_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_LAB_ALIAS_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_ASTM_ALIAS_ROW_ID,
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_EXACT_SOURCE_ROW_ID
] as const;

export const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_RETIRED_ROW_IDS = [
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_A_WEIGHTED_ROW_ID
] as const;

export const COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_LANDED_GATE =
  "company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_plan";

export const COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTION_STATUS =
  "company_internal_building_astm_boundary_revalidation_after_a_weighted_matrix_landed_selected_final_internal_use_rehearsal";

export const COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_ACTION =
  "company_internal_final_internal_use_rehearsal_after_boundary_revalidation_plan";

export const COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts";

export const COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_LABEL =
  "final internal-use rehearsal and operating envelope";

export const COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_BUILDING_ROW_IDS = [
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID,
  "wall.building_prediction_partial_context.needs_input"
] as const;

export const COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_FLOOR_ASTM_ROW_IDS = [
  "floor.astm_iic_aiic_boundary.unsupported",
  "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
  "floor.reinforced_concrete_combined_astm_iic.unsupported"
] as const;

export const COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_CROSS_ROUTE_ASTM_ROW_IDS = [
  COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_ASTM_ALIAS_ROW_ID
] as const;

export const COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_ROW_IDS = [
  ...COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_BUILDING_ROW_IDS,
  ...COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_FLOOR_ASTM_ROW_IDS,
  ...COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_CROSS_ROUTE_ASTM_ROW_IDS
] as const;

const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_PREVIOUS_INPUT_SURFACE_LANDED_GATE =
  "company_internal_opening_leak_building_input_surface_plan";

const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_PREVIOUS_INPUT_SURFACE_SELECTION_STATUS =
  "company_internal_opening_leak_building_input_surface_landed_selected_matrix_v5_refresh";

const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_PREVIOUS_INPUT_SURFACE_SELECTED_NEXT_ACTION =
  "company_internal_calculation_grade_mainline_matrix_v5_refresh_after_opening_leak_building_input_surface_plan";

const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_PREVIOUS_INPUT_SURFACE_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v5-contract.test.ts";

const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_PREVIOUS_SURFACE_PARITY_LANDED_GATE =
  "company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_plan";

const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_PREVIOUS_SURFACE_PARITY_SELECTION_STATUS =
  "company_internal_steel_suspended_ceiling_low_frequency_lnt50_surface_parity_landed_selected_matrix_v4_refresh";

const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_PREVIOUS_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "company_internal_calculation_grade_mainline_matrix_v4_refresh_after_lnt50_surface_parity_plan";

const COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_PREVIOUS_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v4-contract.test.ts";

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const WALL_BUILDING_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const OPENING_LEAK_FIELD_SUPPORTED_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const OPENING_LEAK_BUILDING_SUPPORTED_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const OPENING_LEAK_A_WEIGHTED_OUTPUTS = ["Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const OPENING_LEAK_A_WEIGHTED_BUILDING_OUTPUTS = ["DnT,A"] as const satisfies readonly RequestedOutputId[];
const OPENING_LEAK_A_WEIGHTED_BUILDING_DNA_OUTPUTS = ["Dn,A"] as const satisfies readonly RequestedOutputId[];
const OPENING_LEAK_A_WEIGHTED_ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const STEEL_LNT50_MATRIX_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];
const STEEL_LNT50_ONLY_OUTPUTS = ["L'nT,50"] as const satisfies readonly RequestedOutputId[];

const STEEL_LNT50_COMPLETE_FIELD_CONTEXT = {
  ci50_2500Db: -1,
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
} as const satisfies ImpactFieldContext;

const STEEL_LNT50_MISSING_CI_FIELD_CONTEXT = {
  fieldKDb: STEEL_LNT50_COMPLETE_FIELD_CONTEXT.fieldKDb,
  receivingRoomVolumeM3: STEEL_LNT50_COMPLETE_FIELD_CONTEXT.receivingRoomVolumeM3
} as const satisfies ImpactFieldContext;

const OPENING_LEAK_HOST_WALL_LAYERS = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const satisfies readonly LayerInput[];

const WALL_VISIBLE_SURFACES = [
  "workbench_card",
  "saved_replay",
  "calculator_api",
  "markdown_report",
  "pdf_report",
  "docx_report"
] as const satisfies readonly PersonalUseMvpCoverageVisibleSurface[];

const FLOOR_IMPACT_VISIBLE_SURFACES = [
  "workbench_card",
  "saved_replay",
  "calculator_api",
  "impact_only_api",
  "markdown_report",
  "pdf_report",
  "docx_report"
] as const satisfies readonly PersonalUseMvpCoverageVisibleSurface[];

const BASIS_ORDER = [
  "element_lab",
  "field_apparent",
  "astm_rating_boundary",
  "building_prediction"
] as const satisfies readonly PersonalUseMvpCoverageOutputBasis[];

const POSTURE_ORDER = [
  "family_physics",
  "bounded_screening",
  "needs_input",
  "unsupported",
  "exact",
  "source_anchored_delta",
  "calibrated_physics"
] as const satisfies readonly PersonalUseMvpCoveragePosture[];

const ROUTE_ORDER = ["wall", "floor"] as const satisfies readonly PersonalUseMvpCoverageRoute[];

const FAILURE_CLASS_ORDER = [
  "basis_boundary",
  "correct_block",
  "coverage_gap",
  "hostile_input_refusal",
  "none",
  "unsupported_metric"
] as const satisfies readonly PersonalUseMvpCoverageFailureClass[];

export type CompanyInternalCalculationGradeLaneId =
  | "airborne_building_prediction_runtime_terms"
  | "astm_iic_aiic_parked_boundary"
  | "broad_source_crawl"
  | "steel_suspended_ceiling_delta_lw_owner_contract"
  | "steel_suspended_ceiling_low_frequency_owner_contract"
  | "wall_heavy_core_concrete_posture_cleanup";

export type CompanyInternalCalculationGradeLaneCandidate = {
  basisLeakageRisk: number;
  calculationGradeRisk: number;
  evidenceRowIds: readonly string[];
  id: CompanyInternalCalculationGradeLaneId;
  implementationCost: number;
  reason: string;
  score: number;
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
  userFrequency: number;
};

export type CompanyInternalCalculationGradeLaneSelection = {
  candidates: readonly CompanyInternalCalculationGradeLaneCandidate[];
  selectedCandidate: CompanyInternalCalculationGradeLaneCandidate;
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type CompanyInternalCalculationGradeMainlineMatrixContract = {
  astmRuntimeContinuesParked: true;
  landedGate: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_LANDED_GATE;
  matrixRows: 61;
  matrixRowsAddedAfterHeavyComposite: 3;
  newRuntimeBehaviorChangeInRefresh: false;
  previousGateBQSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTION_STATUS;
  previousGateBQSelectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION;
  priorHeavyCompositeRuntimeMovementPreserved: true;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

export type CompanyInternalCalculationGradeMainlineMatrixSummary = {
  basisCoverage: readonly PersonalUseMvpCoverageOutputBasis[];
  correctlyBlockedRowIds: readonly string[];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  exactSourcePrecedenceRowIds: readonly string[];
  failureClassCounts: Readonly<Record<PersonalUseMvpCoverageFailureClass, number>>;
  heavyCompositeRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_HEAVY_COMPOSITE_ROW_IDS;
  noNewRuntimeValueMovement: true;
  parkedAstmBoundaryRowIds: readonly string[];
  remainingCalculationGradeBlockerRowIds: readonly string[];
  routeCoverage: readonly PersonalUseMvpCoverageRoute[];
  rowCount: 61;
  selectedLane: CompanyInternalCalculationGradeLaneId;
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_FILE;
};

export type CompanyInternalCalculationGradeV2LaneId =
  | "broad_source_crawl"
  | "steel_suspended_ceiling_delta_lw_runtime_corridor"
  | "steel_suspended_ceiling_low_frequency_owner_contract"
  | "wall_opening_leak_building_adapter"
  | "wall_screening_origin_cleanup";

export type CompanyInternalCalculationGradeV2LaneCandidate = {
  basisLeakageRisk: number;
  calculationGradeRisk: number;
  evidenceRowIds: readonly string[];
  id: CompanyInternalCalculationGradeV2LaneId;
  implementationCost: number;
  reason: string;
  score: number;
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
  userFrequency: number;
};

export type CompanyInternalCalculationGradeV2LaneSelection = {
  candidates: readonly CompanyInternalCalculationGradeV2LaneCandidate[];
  selectedCandidate: CompanyInternalCalculationGradeV2LaneCandidate;
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type CompanyInternalCalculationGradeMainlineMatrixV2Contract = {
  buildingRuntimeRowsImportedFromGateAT: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_IMPORTED_BUILDING_ROW_IDS;
  landedGate: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_LANDED_GATE;
  matrixRows: 60;
  newRuntimeBehaviorChangeInRefresh: false;
  previousMatrixRows: 61;
  reclassifiedOriginRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RECLASSIFIED_ORIGIN_ROW_IDS;
  retiredRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RETIRED_ROW_IDS;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  steelDeltaLwOwnerRowId: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_STEEL_DELTA_LW_OWNER_ROW_ID;
};

export type CompanyInternalCalculationGradeMainlineMatrixV2Summary = {
  basisCoverage: readonly PersonalUseMvpCoverageOutputBasis[];
  correctlyBlockedRowIds: readonly string[];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  exactSourcePrecedenceRowIds: readonly string[];
  failureClassCounts: Readonly<Record<PersonalUseMvpCoverageFailureClass, number>>;
  hiddenScreeningOriginRowIds: readonly [];
  importedBuildingRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_IMPORTED_BUILDING_ROW_IDS;
  noNewRuntimeValueMovement: true;
  parkedAstmBoundaryRowIds: readonly string[];
  reclassifiedOriginRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RECLASSIFIED_ORIGIN_ROW_IDS;
  remainingCalculationGradeBlockerRowIds: readonly string[];
  retiredRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RETIRED_ROW_IDS;
  routeCoverage: readonly PersonalUseMvpCoverageRoute[];
  rowCount: 60;
  selectedLane: CompanyInternalCalculationGradeV2LaneId;
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_FILE;
};

export type CompanyInternalCalculationGradeV3LaneId =
  | "astm_iic_aiic_parked_boundary"
  | "broad_source_crawl"
  | "steel_suspended_ceiling_low_frequency_owner_contract"
  | "wall_opening_leak_building_adapter";

export type CompanyInternalCalculationGradeV3LaneCandidate = {
  basisLeakageRisk: number;
  calculationGradeRisk: number;
  evidenceRowIds: readonly string[];
  id: CompanyInternalCalculationGradeV3LaneId;
  implementationCost: number;
  reason: string;
  score: number;
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
  userFrequency: number;
};

export type CompanyInternalCalculationGradeV3LaneSelection = {
  candidates: readonly CompanyInternalCalculationGradeV3LaneCandidate[];
  selectedCandidate: CompanyInternalCalculationGradeV3LaneCandidate;
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type CompanyInternalCalculationGradeMainlineMatrixV3Contract = {
  landedGate: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_LANDED_GATE;
  matrixRows: 60;
  newRuntimeBehaviorChangeInRefresh: false;
  previousMatrixRows: 60;
  previousSurfaceParityLandedGate: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_PREVIOUS_SURFACE_PARITY_LANDED_GATE;
  previousSurfaceParitySelectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_PREVIOUS_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  previousSurfaceParitySelectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_PREVIOUS_SURFACE_PARITY_SELECTED_NEXT_FILE;
  previousSurfaceParitySelectionStatus: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_PREVIOUS_SURFACE_PARITY_SELECTION_STATUS;
  promotedSteelDeltaLwRowId: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_STEEL_DELTA_LW_RUNTIME_ROW_ID;
  retiredRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_RETIRED_ROW_IDS;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

export type CompanyInternalCalculationGradeMainlineMatrixV3Summary = {
  basisCoverage: readonly PersonalUseMvpCoverageOutputBasis[];
  correctlyBlockedRowIds: readonly string[];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  exactSourcePrecedenceRowIds: readonly string[];
  failureClassCounts: Readonly<Record<PersonalUseMvpCoverageFailureClass, number>>;
  hiddenScreeningOriginRowIds: readonly [];
  noRuntimeValueMovementInRefresh: true;
  parkedAstmBoundaryRowIds: readonly string[];
  promotedSteelDeltaLwRowId: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_STEEL_DELTA_LW_RUNTIME_ROW_ID;
  remainingCalculationGradeBlockerRowIds: readonly string[];
  retiredRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_RETIRED_ROW_IDS;
  routeCoverage: readonly PersonalUseMvpCoverageRoute[];
  rowCount: 60;
  selectedLane: CompanyInternalCalculationGradeV3LaneId;
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_FILE;
};

export type CompanyInternalCalculationGradeV4LaneId =
  | "airborne_building_prediction_runtime_terms"
  | "astm_iic_aiic_parked_boundary"
  | "broad_source_crawl"
  | "opening_leak_building_adapter_owner_contract";

export type CompanyInternalCalculationGradeV4LaneCandidate = {
  basisLeakageRisk: number;
  calculationGradeRisk: number;
  evidenceRowIds: readonly string[];
  id: CompanyInternalCalculationGradeV4LaneId;
  implementationCost: number;
  reason: string;
  score: number;
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
  userFrequency: number;
};

export type CompanyInternalCalculationGradeV4LaneSelection = {
  candidates: readonly CompanyInternalCalculationGradeV4LaneCandidate[];
  selectedCandidate: CompanyInternalCalculationGradeV4LaneCandidate;
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type CompanyInternalCalculationGradeMainlineMatrixV4Contract = {
  landedGate: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_LANDED_GATE;
  matrixRows: 62;
  newRuntimeBehaviorChangeInRefresh: false;
  previousMatrixRows: 60;
  previousSurfaceParityLandedGate: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_PREVIOUS_SURFACE_PARITY_LANDED_GATE;
  previousSurfaceParitySelectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_PREVIOUS_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  previousSurfaceParitySelectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_PREVIOUS_SURFACE_PARITY_SELECTED_NEXT_FILE;
  previousSurfaceParitySelectionStatus: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_PREVIOUS_SURFACE_PARITY_SELECTION_STATUS;
  promotedSteelLnt50RowId: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_RUNTIME_ROW_ID;
  retiredRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_RETIRED_ROW_IDS;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

export type CompanyInternalCalculationGradeMainlineMatrixV4Summary = {
  basisCoverage: readonly PersonalUseMvpCoverageOutputBasis[];
  correctlyBlockedRowIds: readonly string[];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  exactSourcePrecedenceRowIds: readonly string[];
  failureClassCounts: Readonly<Record<PersonalUseMvpCoverageFailureClass, number>>;
  hiddenScreeningOriginRowIds: readonly [];
  importedSteelLnt50RowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_IMPORTED_ROW_IDS;
  noRuntimeValueMovementInRefresh: true;
  parkedAstmBoundaryRowIds: readonly string[];
  promotedSteelLnt50RowId: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_RUNTIME_ROW_ID;
  remainingCalculationGradeBlockerRowIds: readonly string[];
  retiredRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_RETIRED_ROW_IDS;
  routeCoverage: readonly PersonalUseMvpCoverageRoute[];
  rowCount: 62;
  selectedLane: CompanyInternalCalculationGradeV4LaneId;
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_FILE;
};

export type CompanyInternalCalculationGradeV5LaneId =
  | "airborne_building_prediction_partial_context_revalidation"
  | "astm_iic_aiic_parked_boundary"
  | "broad_source_crawl"
  | "opening_leak_a_weighted_spectrum_adapter_owner";

export type CompanyInternalCalculationGradeV5LaneCandidate = {
  basisLeakageRisk: number;
  calculationGradeRisk: number;
  evidenceRowIds: readonly string[];
  id: CompanyInternalCalculationGradeV5LaneId;
  implementationCost: number;
  reason: string;
  score: number;
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
  userFrequency: number;
};

export type CompanyInternalCalculationGradeV5LaneSelection = {
  candidates: readonly CompanyInternalCalculationGradeV5LaneCandidate[];
  selectedCandidate: CompanyInternalCalculationGradeV5LaneCandidate;
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type CompanyInternalCalculationGradeMainlineMatrixV5Contract = {
  importedOpeningLeakFieldBuildingRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_IMPORTED_ROW_IDS;
  landedGate: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_LANDED_GATE;
  matrixRows: 65;
  newRuntimeBehaviorChangeInRefresh: false;
  previousInputSurfaceLandedGate: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_PREVIOUS_INPUT_SURFACE_LANDED_GATE;
  previousInputSurfaceSelectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_PREVIOUS_INPUT_SURFACE_SELECTED_NEXT_ACTION;
  previousInputSurfaceSelectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_PREVIOUS_INPUT_SURFACE_SELECTED_NEXT_FILE;
  previousInputSurfaceSelectionStatus: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_PREVIOUS_INPUT_SURFACE_SELECTION_STATUS;
  previousMatrixRows: 62;
  retiredRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_RETIRED_ROW_IDS;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

export type CompanyInternalCalculationGradeMainlineMatrixV5Summary = {
  basisCoverage: readonly PersonalUseMvpCoverageOutputBasis[];
  correctlyBlockedRowIds: readonly string[];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  exactSourcePrecedenceRowIds: readonly string[];
  failureClassCounts: Readonly<Record<PersonalUseMvpCoverageFailureClass, number>>;
  hiddenScreeningOriginRowIds: readonly [];
  importedOpeningLeakFieldBuildingRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_IMPORTED_ROW_IDS;
  noRuntimeValueMovementInRefresh: true;
  parkedAstmBoundaryRowIds: readonly string[];
  promotedOpeningLeakBuildingRowId: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_ROW_ID;
  promotedOpeningLeakFieldRowId: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_FIELD_ROW_ID;
  remainingCalculationGradeBlockerRowIds: readonly string[];
  retiredRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_RETIRED_ROW_IDS;
  routeCoverage: readonly PersonalUseMvpCoverageRoute[];
  rowCount: 65;
  selectedLane: CompanyInternalCalculationGradeV5LaneId;
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_FILE;
};

export type CompanyInternalCalculationGradeV6LaneId =
  | "boundary_revalidation_building_partial_context_and_astm"
  | "broad_source_crawl"
  | "final_internal_use_rehearsal";

export type CompanyInternalCalculationGradeV6LaneCandidate = {
  basisLeakageRisk: number;
  calculationGradeRisk: number;
  evidenceRowIds: readonly string[];
  id: CompanyInternalCalculationGradeV6LaneId;
  implementationCost: number;
  reason: string;
  score: number;
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
  userFrequency: number;
};

export type CompanyInternalCalculationGradeV6LaneSelection = {
  candidates: readonly CompanyInternalCalculationGradeV6LaneCandidate[];
  selectedCandidate: CompanyInternalCalculationGradeV6LaneCandidate;
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type CompanyInternalCalculationGradeMainlineMatrixV6Contract = {
  importedOpeningLeakAWeightedRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_IMPORTED_ROW_IDS;
  landedGate: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_LANDED_GATE;
  matrixRows: 71;
  newRuntimeBehaviorChangeInRefresh: false;
  previousMatrixRows: 65;
  previousSurfaceParityLandedGate: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_LANDED_GATE;
  previousSurfaceParitySelectedNextAction: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  previousSurfaceParitySelectedNextFile: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_FILE;
  previousSurfaceParitySelectionStatus: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTION_STATUS;
  retiredRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_RETIRED_ROW_IDS;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

export type CompanyInternalCalculationGradeMainlineMatrixV6Summary = {
  basisCoverage: readonly PersonalUseMvpCoverageOutputBasis[];
  correctlyBlockedRowIds: readonly string[];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  exactSourcePrecedenceRowIds: readonly string[];
  failureClassCounts: Readonly<Record<PersonalUseMvpCoverageFailureClass, number>>;
  hiddenScreeningOriginRowIds: readonly [];
  importedOpeningLeakAWeightedRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_IMPORTED_ROW_IDS;
  noRuntimeValueMovementInRefresh: true;
  parkedAstmBoundaryRowIds: readonly string[];
  promotedOpeningLeakAWeightedBuildingRowId: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_ROW_ID;
  promotedOpeningLeakAWeightedFieldRowId: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_FIELD_ROW_ID;
  remainingCalculationGradeBlockerRowIds: readonly string[];
  retiredRowIds: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_RETIRED_ROW_IDS;
  routeCoverage: readonly PersonalUseMvpCoverageRoute[];
  rowCount: 71;
  selectedLane: CompanyInternalCalculationGradeV6LaneId;
  selectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_FILE;
};

export type CompanyInternalBuildingAstmBoundaryRevalidationLaneId =
  | "astm_runtime_adapter"
  | "broad_source_crawl"
  | "final_internal_use_rehearsal";

export type CompanyInternalBuildingAstmBoundaryRevalidationLaneCandidate = {
  basisLeakageRisk: number;
  calculationGradeRisk: number;
  evidenceRowIds: readonly string[];
  id: CompanyInternalBuildingAstmBoundaryRevalidationLaneId;
  implementationCost: number;
  reason: string;
  score: number;
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
  userFrequency: number;
};

export type CompanyInternalBuildingAstmBoundaryRevalidationLaneSelection = {
  candidates: readonly CompanyInternalBuildingAstmBoundaryRevalidationLaneCandidate[];
  selectedCandidate: CompanyInternalBuildingAstmBoundaryRevalidationLaneCandidate;
  selectedNextAction: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_FILE;
  selectionPolicy: readonly string[];
};

export type CompanyInternalBuildingAstmBoundaryRevalidationContract = {
  astmBoundaryRowsStayUnsupported: true;
  buildingBoundaryRowsStayNeedsInput: true;
  landedGate: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_LANDED_GATE;
  matrixRows: 71;
  newRuntimeBehaviorChangeInRevalidation: false;
  previousMatrixV6LandedGate: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_LANDED_GATE;
  previousMatrixV6SelectedNextAction: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_ACTION;
  previousMatrixV6SelectedNextFile: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_FILE;
  previousMatrixV6SelectionStatus: typeof COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTION_STATUS;
  revalidatedBoundaryRowIds: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_ROW_IDS;
  revalidatedBuildingRowIds: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_BUILDING_ROW_IDS;
  revalidatedCrossRouteAstmRowIds: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_CROSS_ROUTE_ASTM_ROW_IDS;
  revalidatedFloorAstmRowIds: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_FLOOR_ASTM_ROW_IDS;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
};

export type CompanyInternalBuildingAstmBoundaryRevalidationSummary = {
  astmUnsupportedRowIds: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_FLOOR_ASTM_ROW_IDS;
  boundaryRowsWithoutErrorBudget: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_ROW_IDS;
  boundaryRowsWithoutValuePins: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_ROW_IDS;
  buildingMissingPhysicalInputsByRowId: Readonly<Record<string, readonly string[]>>;
  buildingNeedsInputRowIds: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_BUILDING_ROW_IDS;
  crossRouteAstmUnsupportedRowIds: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_CROSS_ROUTE_ASTM_ROW_IDS;
  finalRehearsalReady: true;
  matrixRows: 71;
  matrixV6AWeightedValuePinsPreserved: true;
  selectedLane: CompanyInternalBuildingAstmBoundaryRevalidationLaneId;
  selectedNextAction: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_FILE;
};

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function orderedSubset<T extends string>(values: readonly T[], order: readonly T[]): readonly T[] {
  const valueSet = new Set(values);
  return order.filter((value) => valueSet.has(value));
}

function failureClassCounts(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[]
): Readonly<Record<PersonalUseMvpCoverageFailureClass, number>> {
  return FAILURE_CLASS_ORDER.reduce((accumulator, failureClass) => {
    accumulator[failureClass] = matrix.filter((row) => row.failureClass === failureClass).length;
    return accumulator;
  }, {} as Record<PersonalUseMvpCoverageFailureClass, number>);
}

function metricPins(metrics: Record<string, number | null | undefined>): PersonalUseMvpCoverageMetricValuePin[] {
  return Object.entries(metrics).flatMap(([metric, value]) =>
    typeof value === "number" && Number.isFinite(value)
      ? [{ metric: metric as RequestedOutputId, value: round1(value) }]
      : []
  );
}

function impactToleranceDb(
  impact: { errorBudgets?: readonly { metricId: RequestedOutputId; toleranceDb: number }[] } | null | undefined,
  metricId: RequestedOutputId
): number | null {
  return impact?.errorBudgets?.find((budget) => budget.metricId === metricId)?.toleranceDb ?? null;
}

function generatedHeavyCompositeCase() {
  const testCase = ENGINE_MIXED_GENERATED_CASES.find(
    (entry) => entry.id === "wall-heavy-composite-hint-suppression"
  );

  if (!testCase) {
    throw new Error("Company-internal matrix expected wall-heavy-composite-hint-suppression.");
  }

  return testCase;
}

function heavyCompositeLabRow(): PersonalUseMvpCoverageScenarioRow {
  const testCase = generatedHeavyCompositeCase();
  const result = calculateAssembly(testCase.rows, testCase.labOptions);
  const snapshot = resultSnapshot(result);

  return {
    basis: "element_lab",
    currentPosture: "family_physics",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "wall_heavy_composite_double_leaf",
    hostileVariant: "complete_heavy_composite_stack_previously_screening",
    id: "wall.heavy_composite_complete_family_physics.lab",
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_heavy_composite_wall_family_physics_prediction",
    requestedMetrics: WALL_LAB_OUTPUTS,
    route: "wall",
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
      missingPhysicalInputs: result.airborneBasis?.missingPhysicalInputs ?? [],
      origin: result.airborneBasis?.origin ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.airborneCandidateResolution?.selectedCandidateId ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: metricPins({
        C: snapshot.c,
        Ctr: snapshot.ctr,
        Rw: snapshot.rw,
        STC: snapshot.stc
      })
    },
    toleranceOrErrorBudget: "Rw/STC/C/Ctr lab wall family prediction with +/-8 dB source_absent budget",
    valueOrBlockedReason: "Rw 63 / STC 63 / C -1.4 / Ctr -6.3 through heavy-composite wall family physics",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  };
}

function heavyCompositeFieldRow(): PersonalUseMvpCoverageScenarioRow {
  const testCase = generatedHeavyCompositeCase();
  const result = calculateAssembly(testCase.rows, testCase.fieldOptions);
  const snapshot = resultSnapshot(result);

  return {
    basis: "field_apparent",
    currentPosture: "family_physics",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "wall_heavy_composite_double_leaf_field_adapter",
    hostileVariant: "field_between_rooms_request_on_owned_lab_family_basis",
    id: "wall.heavy_composite_complete_field_adapter.field",
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_airborne_field_adapter_on_heavy_composite_lab_basis",
    requestedMetrics: WALL_FIELD_OUTPUTS,
    route: "wall",
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
      missingPhysicalInputs: result.airborneBasis?.missingPhysicalInputs ?? [],
      origin: result.airborneBasis?.origin ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.airborneCandidateResolution?.selectedCandidateId ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: metricPins({
        "Dn,w": snapshot.dnW,
        "DnT,A": snapshot.dnTA,
        "DnT,w": snapshot.dnTw,
        "R'w": snapshot.rwPrimeDb
      })
    },
    toleranceOrErrorBudget: "R'w/Dn field adapter with +/-10 dB source_absent field budget",
    valueOrBlockedReason: "R'w 60 / Dn,w 60 / DnT,w 61 / DnT,A 60.1 through Gate I field adapter",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  };
}

function buildingPredictionMissingInputRow(): PersonalUseMvpCoverageScenarioRow {
  const testCase = generatedHeavyCompositeCase();
  const result = calculateAssembly(testCase.rows, {
    airborneContext: {
      ...testCase.fieldOptions?.airborneContext,
      contextMode: "building_prediction"
    },
    calculator: "dynamic",
    targetOutputs: WALL_BUILDING_OUTPUTS
  });
  const missingPhysicalInputs = result.airborneBasis?.missingPhysicalInputs ?? [];

  return {
    basis: "building_prediction",
    currentPosture: "needs_input",
    expectedPosture: "needs_input",
    failureClass: "correct_block",
    family: "wall_airborne_building_prediction_missing_context",
    hostileVariant: "building_prediction_selected_without_flanking_and_output_basis_owners",
    id: "wall.building_prediction_missing_context.needs_input",
    inputCompleteness: "partial",
    nextAction: "keep_missing_input_prompt",
    originSupportBucket: "building_prediction_physical_context_missing",
    requestedMetrics: WALL_BUILDING_OUTPUTS,
    route: "wall",
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
      missingPhysicalInputs,
      origin: result.airborneBasis?.origin ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.airborneCandidateResolution?.selectedCandidateId ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: []
    },
    toleranceOrErrorBudget: "blocked_no_budget_until_building_prediction_context_is_complete",
    valueOrBlockedReason: `Needs ${missingPhysicalInputs.join(", ")} before any R'w/DnT,w building prediction`,
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  };
}

function buildHeavyCompositeRefreshRows(): readonly PersonalUseMvpCoverageScenarioRow[] {
  return [
    heavyCompositeLabRow(),
    heavyCompositeFieldRow(),
    buildingPredictionMissingInputRow()
  ];
}

export function buildCompanyInternalCalculationGradeMainlineMatrix():
  readonly PersonalUseMvpCoverageScenarioRow[] {
  return [
    ...buildPersonalUseMvpCoverageSprintGateBQScenarioMatrix(),
    ...buildHeavyCompositeRefreshRows()
  ];
}

export function buildCompanyInternalCalculationGradeMainlineMatrixContract():
  CompanyInternalCalculationGradeMainlineMatrixContract {
  return {
    astmRuntimeContinuesParked: true,
    landedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_LANDED_GATE,
    matrixRows: 61,
    matrixRowsAddedAfterHeavyComposite: 3,
    newRuntimeBehaviorChangeInRefresh: false,
    previousGateBQSelectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTED_NEXT_ACTION,
    previousGateBQSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BQ_SELECTION_STATUS,
    priorHeavyCompositeRuntimeMovementPreserved: true,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_FILE,
    selectedNextLabel: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

function scoreLane(
  candidate: Pick<
    CompanyInternalCalculationGradeLaneCandidate,
    "basisLeakageRisk" | "calculationGradeRisk" | "implementationCost" | "userFrequency"
  >
): number {
  return round1(
    (candidate.userFrequency * candidate.calculationGradeRisk) /
      (candidate.implementationCost + candidate.basisLeakageRisk + 1)
  );
}

export function rankCompanyInternalCalculationGradeNextLanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildCompanyInternalCalculationGradeMainlineMatrix()
): CompanyInternalCalculationGradeLaneSelection {
  const candidateSeeds = [
    {
      basisLeakageRisk: 2,
      calculationGradeRisk: 8,
      evidenceRowIds: ["floor.lightweight_steel_suspended_ceiling_delta_lw.unsupported"],
      id: "steel_suspended_ceiling_delta_lw_owner_contract",
      implementationCost: 4,
      reason:
        "This is the broadest remaining ISO floor-impact metric gap in the refreshed matrix: the steel suspended-ceiling-only route returns Ln,w but still blocks DeltaLw until the upper/reference package owner is explicit.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 8
    },
    {
      basisLeakageRisk: 3,
      calculationGradeRisk: 6,
      evidenceRowIds: ["floor.lightweight_steel_suspended_ceiling_lnt50.unsupported"],
      id: "steel_suspended_ceiling_low_frequency_owner_contract",
      implementationCost: 5,
      reason:
        "L'nT,50 remains important, but it needs a low-frequency owner and should stay behind the ISO DeltaLw owner for the same common floor route.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 5
    },
    {
      basisLeakageRisk: 4,
      calculationGradeRisk: 5,
      evidenceRowIds: ["wall.building_prediction_missing_context.needs_input"],
      id: "airborne_building_prediction_runtime_terms",
      implementationCost: 8,
      reason:
        "Building prediction stays correctly parked, but runtime ISO 12354 flanking terms are higher cost and should follow narrower ISO floor-impact gaps.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 6
    },
    {
      basisLeakageRisk: 2,
      calculationGradeRisk: 4,
      evidenceRowIds: [
        "wall.heavy_composite_complete_family_physics.lab",
        "wall.heavy_composite_complete_field_adapter.field"
      ],
      id: "wall_heavy_core_concrete_posture_cleanup",
      implementationCost: 5,
      reason:
        "Heavy-composite is now calculation-grade; remaining wall heavy-core/concrete work is a follow-up matrix/posture cleanup unless a new live screening row is proven.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 6
    },
    {
      basisLeakageRisk: 9,
      calculationGradeRisk: 4,
      evidenceRowIds: [
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.reinforced_concrete_combined_astm_iic.unsupported"
      ],
      id: "astm_iic_aiic_parked_boundary",
      implementationCost: 8,
      reason:
        "ASTM IIC/AIIC remains documented and blocked, but the company-internal mainline is ISO-first until a later plan explicitly reselects ASTM.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 4
    },
    {
      basisLeakageRisk: 8,
      calculationGradeRisk: 2,
      evidenceRowIds: [
        "floor.lightweight_steel_exact_source_precedence.lab",
        "floor.reinforced_concrete_combined_exact_source_precedence.lab"
      ],
      id: "broad_source_crawl",
      implementationCost: 9,
      reason:
        "Exact rows remain overrides and calibration evidence, but broad source crawling is not a substitute for the selected source-absent ISO solver gap.",
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 3
    }
  ] as const satisfies readonly Omit<CompanyInternalCalculationGradeLaneCandidate, "score" | "selected">[];

  const matrixIds = new Set(matrix.map((row) => row.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !matrixIds.has(id));

    if (missingRows.length > 0) {
      throw new Error(`Company-internal lane ${candidate.id} references missing matrix rows: ${missingRows.join(", ")}`);
    }

    return {
      ...candidate,
      score: scoreLane(candidate),
      selected: false
    };
  });
  const [selected] = [...candidatesWithoutSelection].sort((left, right) => {
    const scoreDelta = right.score - left.score;
    return scoreDelta === 0 ? left.id.localeCompare(right.id) : scoreDelta;
  });

  if (!selected) {
    throw new Error("Company-internal matrix requires one selected next lane.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Company-internal matrix did not mark a selected next lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_REFRESH_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "keep ASTM IIC/AIIC parked unless an active mainline plan explicitly reselects it",
      "score user_frequency * calculation_grade_risk / (implementation_cost + basis_leakage_risk + 1)",
      "prefer ISO floor-impact DeltaLw gaps before specialized low-frequency or building-prediction adapters",
      "do not select broad source crawling when a source-absent formula owner can increase calculator coverage"
    ]
  };
}

function requireRows(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[],
  rowIds: readonly string[],
  label: string
): void {
  const ids = new Set(matrix.map((row) => row.id));
  const missing = rowIds.filter((id) => !ids.has(id));

  if (missing.length > 0) {
    throw new Error(`Company-internal matrix missing ${label} row(s): ${missing.join(", ")}`);
  }
}

export function summarizeCompanyInternalCalculationGradeMainlineMatrix(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildCompanyInternalCalculationGradeMainlineMatrix()
): CompanyInternalCalculationGradeMainlineMatrixSummary {
  requireRows(matrix, COMPANY_INTERNAL_CALCULATION_GRADE_HEAVY_COMPOSITE_ROW_IDS, "heavy-composite");
  const laneSelection = rankCompanyInternalCalculationGradeNextLanes(matrix);

  return {
    basisCoverage: orderedSubset(matrix.map((row) => row.basis), BASIS_ORDER),
    correctlyBlockedRowIds: matrix
      .filter((row) => row.failureClass !== "none")
      .map((row) => row.id),
    currentPostureCoverage: orderedSubset(matrix.map((row) => row.currentPosture), POSTURE_ORDER),
    exactSourcePrecedenceRowIds: [
      "floor.lightweight_steel_exact_source_precedence.lab",
      "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab",
      "floor.reinforced_concrete_combined_exact_source_precedence.lab"
    ],
    failureClassCounts: failureClassCounts(matrix),
    heavyCompositeRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_HEAVY_COMPOSITE_ROW_IDS,
    noNewRuntimeValueMovement: true,
    parkedAstmBoundaryRowIds: [
      "floor.astm_iic_aiic_boundary.unsupported",
      "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
      "floor.reinforced_concrete_combined_astm_iic.unsupported"
    ],
    remainingCalculationGradeBlockerRowIds: [
      "floor.lightweight_steel_suspended_ceiling_delta_lw.unsupported",
      "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported",
      "wall.building_prediction_missing_context.needs_input"
    ],
    routeCoverage: orderedSubset(matrix.map((row) => row.route), ROUTE_ORDER),
    rowCount: 61,
    selectedLane: laneSelection.selectedCandidate.id,
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile
  };
}

export function assertCompanyInternalHeavyCompositeRuntimeRows(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildCompanyInternalCalculationGradeMainlineMatrix()
): void {
  const lab = matrix.find((row) => row.id === "wall.heavy_composite_complete_family_physics.lab");
  const field = matrix.find((row) => row.id === "wall.heavy_composite_complete_field_adapter.field");
  const building = matrix.find((row) => row.id === "wall.building_prediction_missing_context.needs_input");

  if (!lab || !field || !building) {
    throw new Error("Company-internal heavy-composite runtime rows are incomplete.");
  }

  if (
    lab.runtime.basisId !== COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_RUNTIME_METHOD ||
    lab.runtime.selectedMethod !== COMPANY_INTERNAL_HEAVY_COMPOSITE_WALL_SELECTED_CANDIDATE_ID ||
    lab.runtime.errorBudgetDb !== 8
  ) {
    throw new Error("Company-internal heavy-composite lab row no longer uses the owned family solver.");
  }

  if (
    field.runtime.basisId !== GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD ||
    field.runtime.selectedMethod !== GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID ||
    field.runtime.errorBudgetDb !== 10
  ) {
    throw new Error("Company-internal heavy-composite field row no longer uses the owned field adapter.");
  }

  if (
    building.currentPosture !== "needs_input" ||
    building.runtime.supportedTargetOutputs.length > 0 ||
    building.runtime.missingPhysicalInputs.length === 0
  ) {
    throw new Error("Company-internal building-prediction row must stay parked with precise missing inputs.");
  }
}

function requireRow(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[],
  rowId: string,
  label: string
): PersonalUseMvpCoverageScenarioRow {
  const row = matrix.find((entry) => entry.id === rowId);

  if (!row) {
    throw new Error(`Company-internal matrix v2 missing ${label} row: ${rowId}`);
  }

  return row;
}

function importGateATBuildingRows(): readonly PersonalUseMvpCoverageScenarioRow[] {
  const gateAtRows = buildPersonalUseMvpCoverageSprintGateATScenarioMatrix();

  return COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_IMPORTED_BUILDING_ROW_IDS.map((rowId) =>
    requireRow(gateAtRows, rowId, "Gate AT building")
  );
}

function normalizeHeavyFloatingOriginForV2(
  row: PersonalUseMvpCoverageScenarioRow
): PersonalUseMvpCoverageScenarioRow {
  if (row.id !== "floor.heavy_concrete_floating_floor.lab") {
    return row;
  }

  return {
    ...row,
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_heavy_floating_floor_iso12354_annexc_family_estimate",
    runtime: {
      ...row.runtime,
      origin: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
      selectedMethod: "formula_estimate"
    },
    toleranceOrErrorBudget: "formula_estimate_medium_confidence",
    valueOrBlockedReason: "Ln,w 44.9 / DeltaLw 26.9 through the narrow ISO 12354 Annex-C floating-floor formula"
  };
}

function steelSuspendedCeilingDeltaLwOwnerRow(
  previousRow: PersonalUseMvpCoverageScenarioRow
): PersonalUseMvpCoverageScenarioRow {
  return {
    ...previousRow,
    currentPosture: "needs_input",
    expectedPosture: "needs_input",
    failureClass: "correct_block",
    id: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_STEEL_DELTA_LW_OWNER_ROW_ID,
    nextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_ACTION,
    originSupportBucket: "steel_suspended_ceiling_delta_lw_upper_reference_package_owner_missing",
    runtime: {
      ...previousRow.runtime,
      basisId: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
      missingPhysicalInputs: STEEL_FLOOR_SUSPENDED_CEILING_DELTA_LW_OWNER_INPUTS,
      origin: "needs_input",
      selectedMethod: "formula_estimate",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: ["DeltaLw"],
      valuePins: []
    },
    toleranceOrErrorBudget: "blocked_no_delta_lw_budget_until_upper_reference_package_owner_inputs_are_complete",
    valueOrBlockedReason:
      "Needs toppingOrFloatingLayer, resilientLayerDynamicStiffnessMNm3, and loadBasisKgM2 before DeltaLw can promote"
  };
}

function steelSuspendedCeilingDeltaLwRuntimeRow(
  previousRow: PersonalUseMvpCoverageScenarioRow
): PersonalUseMvpCoverageScenarioRow {
  const surface = buildSteelFloorFormulaPredictorInputFromSurface({
    layers: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
    surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
    targetOutputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS
  });

  if (surface.status !== "ready_for_formula_corridor" || !surface.impactPredictorInput) {
    throw new Error(`Company-internal matrix v3 expected steel DeltaLw runtime input to be complete, got ${surface.status}.`);
  }

  const result = calculateAssembly(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS, {
    impactPredictorInput: surface.impactPredictorInput,
    targetOutputs: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS
  });

  return {
    ...previousRow,
    currentPosture: "family_physics",
    expectedPosture: "family_physics",
    failureClass: "none",
    hostileVariant: "complete_upper_reference_package_after_surface_parity",
    id: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_STEEL_DELTA_LW_RUNTIME_ROW_ID,
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_steel_suspended_ceiling_delta_lw_formula_corridor",
    requestedMetrics: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_RUNTIME_TARGET_OUTPUTS,
    runtime: {
      basisId: result.impact?.basis ?? STEEL_FLOOR_FORMULA_BASIS,
      errorBudgetDb: impactToleranceDb(result.impact, "DeltaLw"),
      missingPhysicalInputs: [],
      origin: result.impact?.basis ?? STEEL_FLOOR_FORMULA_BASIS,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.dynamicImpactTrace?.selectionKind ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: metricPins({
        "DeltaLw": result.impact?.DeltaLw,
        "Ln,w": result.impact?.LnW
      })
    },
    toleranceOrErrorBudget:
      `Ln,w +/-${STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB} dB / DeltaLw +/-${STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB} dB source_absent_formula_error_budget; reference ${STEEL_FLOOR_SUSPENDED_CEILING_REFERENCE_FLOOR_TYPE}`,
    valueOrBlockedReason:
      "Ln,w 51.6 / DeltaLw 22.4 through the steel suspended-ceiling lower-reference plus upper-package formula corridor"
  };
}

export function buildCompanyInternalCalculationGradeMainlineMatrixV2():
  readonly PersonalUseMvpCoverageScenarioRow[] {
  const baseRows = buildCompanyInternalCalculationGradeMainlineMatrix();
  const importedBuildingRows = new Map(importGateATBuildingRows().map((row) => [row.id, row]));
  const oldSteelDeltaLwRow = requireRow(
    baseRows,
    "floor.lightweight_steel_suspended_ceiling_delta_lw.unsupported",
    "old steel DeltaLw"
  );
  const retired = new Set<string>(COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RETIRED_ROW_IDS);
  const rows = [
    ...baseRows
      .filter((row) => !retired.has(row.id))
      .map((row) => importedBuildingRows.get(row.id) ?? normalizeHeavyFloatingOriginForV2(row)),
    steelSuspendedCeilingDeltaLwOwnerRow(oldSteelDeltaLwRow)
  ];
  const ids = rows.map((row) => row.id);

  if (new Set(ids).size !== ids.length) {
    throw new Error("Company-internal matrix v2 contains duplicate row ids.");
  }

  return rows;
}

export function buildCompanyInternalCalculationGradeMainlineMatrixV2Contract():
  CompanyInternalCalculationGradeMainlineMatrixV2Contract {
  return {
    buildingRuntimeRowsImportedFromGateAT: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_IMPORTED_BUILDING_ROW_IDS,
    landedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_LANDED_GATE,
    matrixRows: 60,
    newRuntimeBehaviorChangeInRefresh: false,
    previousMatrixRows: 61,
    reclassifiedOriginRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RECLASSIFIED_ORIGIN_ROW_IDS,
    retiredRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RETIRED_ROW_IDS,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_FILE,
    selectedNextLabel: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    steelDeltaLwOwnerRowId: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_STEEL_DELTA_LW_OWNER_ROW_ID
  };
}

export function rankCompanyInternalCalculationGradeV2NextLanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildCompanyInternalCalculationGradeMainlineMatrixV2()
): CompanyInternalCalculationGradeV2LaneSelection {
  const candidateSeeds = [
    {
      basisLeakageRisk: 2,
      calculationGradeRisk: 8,
      evidenceRowIds: [COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_STEEL_DELTA_LW_OWNER_ROW_ID],
      id: "steel_suspended_ceiling_delta_lw_runtime_corridor",
      implementationCost: 5,
      reason:
        "The owner prompt is explicit after the previous gate; the next calculator-grade improvement is numeric ISO DeltaLw runtime when the upper/reference package inputs are complete.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 8
    },
    {
      basisLeakageRisk: 3,
      calculationGradeRisk: 6,
      evidenceRowIds: ["floor.lightweight_steel_suspended_ceiling_lnt50.unsupported"],
      id: "steel_suspended_ceiling_low_frequency_owner_contract",
      implementationCost: 5,
      reason:
        "L'nT,50 remains blocked but should stay behind the same-route DeltaLw runtime because it needs a separate low-frequency owner.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 5
    },
    {
      basisLeakageRisk: 4,
      calculationGradeRisk: 4,
      evidenceRowIds: ["wall.opening_leak_composite_building_boundary.unsupported"],
      id: "wall_opening_leak_building_adapter",
      implementationCost: 7,
      reason:
        "Opening/leak building prediction remains an explicit unsupported boundary after the owned building route is imported.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 5
    },
    {
      basisLeakageRisk: 2,
      calculationGradeRisk: 3,
      evidenceRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RECLASSIFIED_ORIGIN_ROW_IDS,
      id: "wall_screening_origin_cleanup",
      implementationCost: 6,
      reason:
        "The matrix v2 refresh removed the hidden heavy-floating screening origin; remaining screening cleanup should wait for live rows proven in the matrix.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 4
    },
    {
      basisLeakageRisk: 8,
      calculationGradeRisk: 2,
      evidenceRowIds: [
        "floor.lightweight_steel_exact_source_precedence.lab",
        "floor.reinforced_concrete_combined_exact_source_precedence.lab"
      ],
      id: "broad_source_crawl",
      implementationCost: 9,
      reason:
        "Exact rows remain valuable overrides and calibration evidence, but no matrix-v2 blocker requires broad source crawling.",
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 3
    }
  ] as const satisfies readonly Omit<CompanyInternalCalculationGradeV2LaneCandidate, "score" | "selected">[];
  const matrixIds = new Set(matrix.map((row) => row.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !matrixIds.has(id));

    if (missingRows.length > 0) {
      throw new Error(`Company-internal matrix v2 lane ${candidate.id} references missing rows: ${missingRows.join(", ")}`);
    }

    return {
      ...candidate,
      score: scoreLane(candidate),
      selected: false
    };
  });
  const [selected] = [...candidatesWithoutSelection].sort((left, right) => {
    const scoreDelta = right.score - left.score;
    return scoreDelta === 0 ? left.id.localeCompare(right.id) : scoreDelta;
  });

  if (!selected) {
    throw new Error("Company-internal matrix v2 requires one selected next lane.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Company-internal matrix v2 did not mark a selected next lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V2_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "import accepted building-prediction runtime rows before adding new building formulas",
      "keep DeltaLw owner prompts as needs_input until upper/reference package inputs are complete",
      "fail any complete company-internal row that still exposes screening_fallback origin",
      "prefer the now-owned steel suspended-ceiling DeltaLw runtime over broad source crawling"
    ]
  };
}

export function summarizeCompanyInternalCalculationGradeMainlineMatrixV2(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildCompanyInternalCalculationGradeMainlineMatrixV2()
): CompanyInternalCalculationGradeMainlineMatrixV2Summary {
  requireRows(matrix, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_IMPORTED_BUILDING_ROW_IDS, "imported building");
  requireRows(matrix, [COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_STEEL_DELTA_LW_OWNER_ROW_ID], "steel DeltaLw owner");
  const ids = new Set(matrix.map((row) => row.id));
  const retiredStillPresent = COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RETIRED_ROW_IDS.filter((id) => ids.has(id));

  if (retiredStillPresent.length > 0) {
    throw new Error(`Company-internal matrix v2 still contains retired row ids: ${retiredStillPresent.join(", ")}`);
  }

  const hiddenScreeningOriginRowIds = matrix
    .filter((row) =>
      row.inputCompleteness === "complete" &&
      row.currentPosture === "family_physics" &&
      row.runtime.origin === "screening_fallback"
    )
    .map((row) => row.id);

  if (hiddenScreeningOriginRowIds.length > 0) {
    throw new Error(`Company-internal matrix v2 still hides screening origins: ${hiddenScreeningOriginRowIds.join(", ")}`);
  }

  const laneSelection = rankCompanyInternalCalculationGradeV2NextLanes(matrix);

  return {
    basisCoverage: orderedSubset(matrix.map((row) => row.basis), BASIS_ORDER),
    correctlyBlockedRowIds: matrix
      .filter((row) => row.failureClass !== "none")
      .map((row) => row.id),
    currentPostureCoverage: orderedSubset(matrix.map((row) => row.currentPosture), POSTURE_ORDER),
    exactSourcePrecedenceRowIds: [
      "floor.lightweight_steel_exact_source_precedence.lab",
      "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab",
      "floor.reinforced_concrete_combined_exact_source_precedence.lab"
    ],
    failureClassCounts: failureClassCounts(matrix),
    hiddenScreeningOriginRowIds: [],
    importedBuildingRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_IMPORTED_BUILDING_ROW_IDS,
    noNewRuntimeValueMovement: true,
    parkedAstmBoundaryRowIds: [
      "floor.astm_iic_aiic_boundary.unsupported",
      "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
      "floor.reinforced_concrete_combined_astm_iic.unsupported"
    ],
    reclassifiedOriginRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RECLASSIFIED_ORIGIN_ROW_IDS,
    remainingCalculationGradeBlockerRowIds: [
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_STEEL_DELTA_LW_OWNER_ROW_ID,
      "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported"
    ],
    retiredRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_RETIRED_ROW_IDS,
    routeCoverage: orderedSubset(matrix.map((row) => row.route), ROUTE_ORDER),
    rowCount: 60,
    selectedLane: laneSelection.selectedCandidate.id,
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile
  };
}

export function buildCompanyInternalCalculationGradeMainlineMatrixV3():
  readonly PersonalUseMvpCoverageScenarioRow[] {
  const baseRows = buildCompanyInternalCalculationGradeMainlineMatrixV2();
  const oldSteelDeltaLwRow = requireRow(
    baseRows,
    COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V2_STEEL_DELTA_LW_OWNER_ROW_ID,
    "matrix v2 steel DeltaLw owner"
  );
  const retired = new Set<string>(COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_RETIRED_ROW_IDS);
  const rows = [
    ...baseRows.filter((row) => !retired.has(row.id)),
    steelSuspendedCeilingDeltaLwRuntimeRow(oldSteelDeltaLwRow)
  ];
  const ids = rows.map((row) => row.id);

  if (new Set(ids).size !== ids.length) {
    throw new Error("Company-internal matrix v3 contains duplicate row ids.");
  }

  return rows;
}

export function buildCompanyInternalCalculationGradeMainlineMatrixV3Contract():
  CompanyInternalCalculationGradeMainlineMatrixV3Contract {
  return {
    landedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_LANDED_GATE,
    matrixRows: 60,
    newRuntimeBehaviorChangeInRefresh: false,
    previousMatrixRows: 60,
    previousSurfaceParityLandedGate:
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_PREVIOUS_SURFACE_PARITY_LANDED_GATE,
    previousSurfaceParitySelectedNextAction:
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_PREVIOUS_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    previousSurfaceParitySelectedNextFile:
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_PREVIOUS_SURFACE_PARITY_SELECTED_NEXT_FILE,
    previousSurfaceParitySelectionStatus:
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_PREVIOUS_SURFACE_PARITY_SELECTION_STATUS,
    promotedSteelDeltaLwRowId: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_STEEL_DELTA_LW_RUNTIME_ROW_ID,
    retiredRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_RETIRED_ROW_IDS,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_FILE,
    selectedNextLabel: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export function rankCompanyInternalCalculationGradeV3NextLanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildCompanyInternalCalculationGradeMainlineMatrixV3()
): CompanyInternalCalculationGradeV3LaneSelection {
  const candidateSeeds = [
    {
      basisLeakageRisk: 3,
      calculationGradeRisk: 7,
      evidenceRowIds: ["floor.lightweight_steel_suspended_ceiling_lnt50.unsupported"],
      id: "steel_suspended_ceiling_low_frequency_owner_contract",
      implementationCost: 4,
      reason:
        "Steel suspended-ceiling ISO Ln,w/DeltaLw is now calculation-grade; the same common floor route still blocks L'nT,50 until a low-frequency owner exists.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 6
    },
    {
      basisLeakageRisk: 4,
      calculationGradeRisk: 4,
      evidenceRowIds: ["wall.opening_leak_composite_building_boundary.unsupported"],
      id: "wall_opening_leak_building_adapter",
      implementationCost: 7,
      reason:
        "Opening/leak building context remains unsupported, but it is a separate wall adapter after the current steel floor route is stabilized.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 5
    },
    {
      basisLeakageRisk: 7,
      calculationGradeRisk: 4,
      evidenceRowIds: [
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.reinforced_concrete_combined_astm_iic.unsupported"
      ],
      id: "astm_iic_aiic_parked_boundary",
      implementationCost: 8,
      reason:
        "ASTM IIC/AIIC remains valuable but must stay behind ISO low-frequency ownership in this company-internal mainline.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 4
    },
    {
      basisLeakageRisk: 8,
      calculationGradeRisk: 2,
      evidenceRowIds: [
        "floor.lightweight_steel_exact_source_precedence.lab",
        "floor.reinforced_concrete_combined_exact_source_precedence.lab"
      ],
      id: "broad_source_crawl",
      implementationCost: 9,
      reason:
        "Exact rows remain overrides and calibration evidence, but broad source crawling is not the next calculator coverage unlock.",
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 3
    }
  ] as const satisfies readonly Omit<CompanyInternalCalculationGradeV3LaneCandidate, "score" | "selected">[];
  const matrixIds = new Set(matrix.map((row) => row.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !matrixIds.has(id));

    if (missingRows.length > 0) {
      throw new Error(`Company-internal matrix v3 lane ${candidate.id} references missing rows: ${missingRows.join(", ")}`);
    }

    return {
      ...candidate,
      score: scoreLane(candidate),
      selected: false
    };
  });
  const [selected] = [...candidatesWithoutSelection].sort((left, right) => {
    const scoreDelta = right.score - left.score;
    return scoreDelta === 0 ? left.id.localeCompare(right.id) : scoreDelta;
  });

  if (!selected) {
    throw new Error("Company-internal matrix v3 requires one selected next lane.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Company-internal matrix v3 did not mark a selected next lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V3_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "record the landed steel suspended-ceiling Ln,w/DeltaLw runtime before selecting another runtime lane",
      "keep L'nT,50 blocked until a low-frequency impact spectrum owner exists",
      "keep ASTM IIC/AIIC parked unless a later active plan explicitly reselects ASTM",
      "do not choose broad source crawling while a source-absent owner contract can unlock calculator coverage"
    ]
  };
}

export function summarizeCompanyInternalCalculationGradeMainlineMatrixV3(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildCompanyInternalCalculationGradeMainlineMatrixV3()
): CompanyInternalCalculationGradeMainlineMatrixV3Summary {
  requireRows(matrix, [COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_STEEL_DELTA_LW_RUNTIME_ROW_ID], "steel DeltaLw runtime");
  const ids = new Set(matrix.map((row) => row.id));
  const retiredStillPresent = COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_RETIRED_ROW_IDS.filter((id) => ids.has(id));

  if (retiredStillPresent.length > 0) {
    throw new Error(`Company-internal matrix v3 still contains retired row ids: ${retiredStillPresent.join(", ")}`);
  }

  const hiddenScreeningOriginRowIds = matrix
    .filter((row) =>
      row.inputCompleteness === "complete" &&
      row.currentPosture === "family_physics" &&
      row.runtime.origin === "screening_fallback"
    )
    .map((row) => row.id);

  if (hiddenScreeningOriginRowIds.length > 0) {
    throw new Error(`Company-internal matrix v3 still hides screening origins: ${hiddenScreeningOriginRowIds.join(", ")}`);
  }

  const laneSelection = rankCompanyInternalCalculationGradeV3NextLanes(matrix);

  return {
    basisCoverage: orderedSubset(matrix.map((row) => row.basis), BASIS_ORDER),
    correctlyBlockedRowIds: matrix
      .filter((row) => row.failureClass !== "none")
      .map((row) => row.id),
    currentPostureCoverage: orderedSubset(matrix.map((row) => row.currentPosture), POSTURE_ORDER),
    exactSourcePrecedenceRowIds: [
      "floor.lightweight_steel_exact_source_precedence.lab",
      "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab",
      "floor.reinforced_concrete_combined_exact_source_precedence.lab"
    ],
    failureClassCounts: failureClassCounts(matrix),
    hiddenScreeningOriginRowIds: [],
    noRuntimeValueMovementInRefresh: true,
    parkedAstmBoundaryRowIds: [
      "floor.astm_iic_aiic_boundary.unsupported",
      "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
      "floor.reinforced_concrete_combined_astm_iic.unsupported"
    ],
    promotedSteelDeltaLwRowId: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_STEEL_DELTA_LW_RUNTIME_ROW_ID,
    remainingCalculationGradeBlockerRowIds: [
      "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported"
    ],
    retiredRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V3_RETIRED_ROW_IDS,
    routeCoverage: orderedSubset(matrix.map((row) => row.route), ROUTE_ORDER),
    rowCount: 60,
    selectedLane: laneSelection.selectedCandidate.id,
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile
  };
}

function calculateSteelSuspendedCeilingLnt50(
  input: {
    fieldContext: ImpactFieldContext;
    targetOutputs: readonly RequestedOutputId[];
  }
) {
  const surface = buildSteelFloorFormulaPredictorInputFromSurface({
    layers: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS,
    surface: COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_SURFACE,
    targetOutputs: input.targetOutputs
  });

  if (surface.status !== "ready_for_formula_corridor" || !surface.impactPredictorInput) {
    throw new Error(`Company-internal matrix v4 expected steel L'nT,50 input to be complete, got ${surface.status}.`);
  }

  return calculateAssembly(COMPANY_INTERNAL_STEEL_SUSPENDED_CEILING_DELTA_LW_COMPLETE_LAYERS, {
    impactFieldContext: input.fieldContext,
    impactPredictorInput: surface.impactPredictorInput,
    targetOutputs: input.targetOutputs
  });
}

function steelSuspendedCeilingLnt50RuntimeRow(): PersonalUseMvpCoverageScenarioRow {
  const result = calculateSteelSuspendedCeilingLnt50({
    fieldContext: STEEL_LNT50_COMPLETE_FIELD_CONTEXT,
    targetOutputs: STEEL_LNT50_MATRIX_TARGET_OUTPUTS
  });

  return {
    basis: "field_apparent",
    currentPosture: "family_physics",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "floor_lightweight_steel_suspended_ceiling_low_frequency_field_adapter",
    hostileVariant: "complete_field_context_with_ci50_after_surface_parity",
    id: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_RUNTIME_ROW_ID,
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_steel_suspended_ceiling_low_frequency_lnt50_field_adapter",
    requestedMetrics: STEEL_LNT50_MATRIX_TARGET_OUTPUTS,
    route: "floor",
    runtime: {
      basisId: result.impact?.basis ?? null,
      errorBudgetDb: impactToleranceDb(result.impact, "L'nT,50"),
      missingPhysicalInputs: [],
      origin: result.impact?.basis ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.dynamicImpactTrace?.selectionKind ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: metricPins({
        "DeltaLw": result.impact?.DeltaLw,
        "L'n,w": result.impact?.LPrimeNW,
        "L'nT,50": result.impact?.LPrimeNT50,
        "L'nT,w": result.impact?.LPrimeNTw,
        "Ln,w": result.impact?.LnW
      })
    },
    toleranceOrErrorBudget:
      "Ln,w +/-4.5 dB / DeltaLw +/-2 dB / L'n,w +/-5 dB / L'nT,w +/-5.5 dB / L'nT,50 +/-7 dB source_absent field adapter budgets",
    valueOrBlockedReason:
      "Ln,w 51.6 / DeltaLw 22.4 / L'n,w 54.6 / L'nT,w 51.8 / L'nT,50 50.8 with CI,50-2500 -1 through the steel low-frequency field adapter",
    visibleSurfaceParityTarget: FLOOR_IMPACT_VISIBLE_SURFACES
  };
}

function steelSuspendedCeilingLnt50MissingCiRow(): PersonalUseMvpCoverageScenarioRow {
  const result = calculateSteelSuspendedCeilingLnt50({
    fieldContext: STEEL_LNT50_MISSING_CI_FIELD_CONTEXT,
    targetOutputs: STEEL_LNT50_MATRIX_TARGET_OUTPUTS
  });

  return {
    basis: "field_apparent",
    currentPosture: "family_physics",
    expectedPosture: "family_physics",
    failureClass: "basis_boundary",
    family: "floor_lightweight_steel_suspended_ceiling_low_frequency_ci_missing",
    hostileVariant: "field_context_without_ci50_2500_owner",
    id: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_MISSING_CI_ROW_ID,
    inputCompleteness: "partial",
    nextAction: "keep_missing_ci50_2500_boundary",
    originSupportBucket: "low_frequency_ci50_2500_owner_missing",
    requestedMetrics: STEEL_LNT50_MATRIX_TARGET_OUTPUTS,
    route: "floor",
    runtime: {
      basisId: result.impact?.basis ?? null,
      errorBudgetDb: impactToleranceDb(result.impact, "L'nT,w"),
      missingPhysicalInputs: [],
      origin: result.impact?.basis ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.dynamicImpactTrace?.selectionKind ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: metricPins({
        "DeltaLw": result.impact?.DeltaLw,
        "L'n,w": result.impact?.LPrimeNW,
        "L'nT,50": result.impact?.LPrimeNT50,
        "L'nT,w": result.impact?.LPrimeNTw,
        "Ln,w": result.impact?.LnW
      })
    },
    toleranceOrErrorBudget:
      "L'n,w +/-5 dB and L'nT,w +/-5.5 dB remain visible; blocked L'nT,50 has no budget until CI,50-2500 is owned",
    valueOrBlockedReason:
      "L'n,w 54.6 / L'nT,w 51.8 remain supported, but L'nT,50 is blocked until CI,50-2500 or an exact low-frequency band owner is present",
    visibleSurfaceParityTarget: FLOOR_IMPACT_VISIBLE_SURFACES
  };
}

function steelSuspendedCeilingLnt50ExactFieldPrecedenceRow(): PersonalUseMvpCoverageScenarioRow {
  const result = calculateImpactOnly([{ materialId: "air_gap", thicknessMm: 90 }], {
    exactImpactSource: {
      frequenciesHz: [50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150],
      labOrField: "field",
      levelsDb: [63, 62, 61, 61, 60, 59, 58, 57, 56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46],
      standardMethod: "ISO 16283-2"
    },
    targetOutputs: STEEL_LNT50_ONLY_OUTPUTS
  });

  return {
    basis: "field_apparent",
    currentPosture: "exact",
    expectedPosture: "exact",
    failureClass: "none",
    family: "floor_lightweight_steel_suspended_ceiling_low_frequency_exact_field_precedence",
    hostileVariant: "exact_field_band_packet_precedes_source_absent_lnt50_adapter",
    id: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_EXACT_FIELD_ROW_ID,
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "exact_field_band_curve_precedence_over_source_absent_lnt50_adapter",
    requestedMetrics: STEEL_LNT50_ONLY_OUTPUTS,
    route: "floor",
    runtime: {
      basisId: result.impact?.basis ?? null,
      errorBudgetDb: null,
      missingPhysicalInputs: [],
      origin: result.impact?.basis ?? null,
      publicEntryPoint: "calculateImpactOnly",
      selectedMethod: result.impact?.basis ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: metricPins({
        "L'nT,50": result.impact?.LPrimeNT50
      })
    },
    toleranceOrErrorBudget: "exact_field_band_curve_no_source_absent_budget",
    valueOrBlockedReason: "Exact field-band packet supports L'nT,50 55.0 and stays separate from the source-absent steel adapter",
    visibleSurfaceParityTarget: FLOOR_IMPACT_VISIBLE_SURFACES
  };
}

export function buildCompanyInternalCalculationGradeMainlineMatrixV4():
  readonly PersonalUseMvpCoverageScenarioRow[] {
  const baseRows = buildCompanyInternalCalculationGradeMainlineMatrixV3();
  requireRow(
    baseRows,
    "floor.lightweight_steel_suspended_ceiling_lnt50.unsupported",
    "matrix v3 steel L'nT,50 unsupported"
  );
  const retired = new Set<string>(COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_RETIRED_ROW_IDS);
  const rows = [
    ...baseRows.filter((row) => !retired.has(row.id)),
    steelSuspendedCeilingLnt50RuntimeRow(),
    steelSuspendedCeilingLnt50MissingCiRow(),
    steelSuspendedCeilingLnt50ExactFieldPrecedenceRow()
  ];
  const ids = rows.map((row) => row.id);

  if (new Set(ids).size !== ids.length) {
    throw new Error("Company-internal matrix v4 contains duplicate row ids.");
  }

  return rows;
}

export function buildCompanyInternalCalculationGradeMainlineMatrixV4Contract():
  CompanyInternalCalculationGradeMainlineMatrixV4Contract {
  return {
    landedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_LANDED_GATE,
    matrixRows: 62,
    newRuntimeBehaviorChangeInRefresh: false,
    previousMatrixRows: 60,
    previousSurfaceParityLandedGate:
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_PREVIOUS_SURFACE_PARITY_LANDED_GATE,
    previousSurfaceParitySelectedNextAction:
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_PREVIOUS_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    previousSurfaceParitySelectedNextFile:
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_PREVIOUS_SURFACE_PARITY_SELECTED_NEXT_FILE,
    previousSurfaceParitySelectionStatus:
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_PREVIOUS_SURFACE_PARITY_SELECTION_STATUS,
    promotedSteelLnt50RowId: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_RUNTIME_ROW_ID,
    retiredRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_RETIRED_ROW_IDS,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_FILE,
    selectedNextLabel: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export function rankCompanyInternalCalculationGradeV4NextLanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildCompanyInternalCalculationGradeMainlineMatrixV4()
): CompanyInternalCalculationGradeV4LaneSelection {
  const candidateSeeds = [
    {
      basisLeakageRisk: 3,
      calculationGradeRisk: 6,
      evidenceRowIds: ["wall.opening_leak_composite_building_boundary.unsupported"],
      id: "opening_leak_building_adapter_owner_contract",
      implementationCost: 5,
      reason:
        "The steel ISO suspended-ceiling route now covers Ln,w, DeltaLw, L'n,w, L'nT,w, and L'nT,50; the next highest-ROI ISO calculator gap is the common wall opening/leak route when field or building outputs are requested.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 7
    },
    {
      basisLeakageRisk: 4,
      calculationGradeRisk: 5,
      evidenceRowIds: ["wall.building_prediction_partial_context.needs_input"],
      id: "airborne_building_prediction_runtime_terms",
      implementationCost: 8,
      reason:
        "General building prediction remains important, but the full ISO 12354 flanking owner set is higher cost than the narrower opening/leak adapter boundary.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 6
    },
    {
      basisLeakageRisk: 7,
      calculationGradeRisk: 5,
      evidenceRowIds: [
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.reinforced_concrete_combined_astm_iic.unsupported"
      ],
      id: "astm_iic_aiic_parked_boundary",
      implementationCost: 8,
      reason:
        "ASTM IIC/AIIC remains a visible requested family, but this company-internal mainline is still prioritizing ISO calculator coverage before non-alias ASTM rating procedures.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 4
    },
    {
      basisLeakageRisk: 8,
      calculationGradeRisk: 2,
      evidenceRowIds: [
        "floor.lightweight_steel_exact_source_precedence.lab",
        "floor.reinforced_concrete_combined_exact_source_precedence.lab",
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_EXACT_FIELD_ROW_ID
      ],
      id: "broad_source_crawl",
      implementationCost: 9,
      reason:
        "Exact rows and exact field bands stay valuable precedence evidence, but broad source crawling is not the next calculator coverage unlock.",
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 3
    }
  ] as const satisfies readonly Omit<CompanyInternalCalculationGradeV4LaneCandidate, "score" | "selected">[];
  const matrixIds = new Set(matrix.map((row) => row.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !matrixIds.has(id));

    if (missingRows.length > 0) {
      throw new Error(`Company-internal matrix v4 lane ${candidate.id} references missing rows: ${missingRows.join(", ")}`);
    }

    return {
      ...candidate,
      score: scoreLane(candidate),
      selected: false
    };
  });
  const [selected] = [...candidatesWithoutSelection].sort((left, right) => {
    const scoreDelta = right.score - left.score;
    return scoreDelta === 0 ? left.id.localeCompare(right.id) : scoreDelta;
  });

  if (!selected) {
    throw new Error("Company-internal matrix v4 requires one selected next lane.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Company-internal matrix v4 did not mark a selected next lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V4_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "record the landed steel suspended-ceiling L'nT,50 runtime before selecting another runtime lane",
      "keep missing CI,50-2500 and exact field-band precedence as separate matrix rows",
      "prefer the next ISO wall/floor calculator gap over ASTM IIC/AIIC while the mainline remains ISO-first",
      "do not choose broad source crawling when a bounded source-absent adapter can increase calculator coverage"
    ]
  };
}

export function summarizeCompanyInternalCalculationGradeMainlineMatrixV4(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildCompanyInternalCalculationGradeMainlineMatrixV4()
): CompanyInternalCalculationGradeMainlineMatrixV4Summary {
  requireRows(matrix, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_IMPORTED_ROW_IDS, "steel L'nT,50 v4");
  const ids = new Set(matrix.map((row) => row.id));
  const retiredStillPresent = COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_RETIRED_ROW_IDS.filter((id) => ids.has(id));

  if (retiredStillPresent.length > 0) {
    throw new Error(`Company-internal matrix v4 still contains retired row ids: ${retiredStillPresent.join(", ")}`);
  }

  const hiddenScreeningOriginRowIds = matrix
    .filter((row) =>
      row.inputCompleteness === "complete" &&
      row.currentPosture === "family_physics" &&
      row.runtime.origin === "screening_fallback"
    )
    .map((row) => row.id);

  if (hiddenScreeningOriginRowIds.length > 0) {
    throw new Error(`Company-internal matrix v4 still hides screening origins: ${hiddenScreeningOriginRowIds.join(", ")}`);
  }

  const laneSelection = rankCompanyInternalCalculationGradeV4NextLanes(matrix);

  return {
    basisCoverage: orderedSubset(matrix.map((row) => row.basis), BASIS_ORDER),
    correctlyBlockedRowIds: matrix
      .filter((row) => row.failureClass !== "none")
      .map((row) => row.id),
    currentPostureCoverage: orderedSubset(matrix.map((row) => row.currentPosture), POSTURE_ORDER),
    exactSourcePrecedenceRowIds: [
      "floor.lightweight_steel_exact_source_precedence.lab",
      "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab",
      "floor.reinforced_concrete_combined_exact_source_precedence.lab",
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_EXACT_FIELD_ROW_ID
    ],
    failureClassCounts: failureClassCounts(matrix),
    hiddenScreeningOriginRowIds: [],
    importedSteelLnt50RowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_IMPORTED_ROW_IDS,
    noRuntimeValueMovementInRefresh: true,
    parkedAstmBoundaryRowIds: [
      "floor.astm_iic_aiic_boundary.unsupported",
      "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
      "floor.reinforced_concrete_combined_astm_iic.unsupported"
    ],
    promotedSteelLnt50RowId: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_RUNTIME_ROW_ID,
    remainingCalculationGradeBlockerRowIds: [
      "wall.opening_leak_composite_building_boundary.unsupported",
      "wall.building_prediction_partial_context.needs_input",
      "floor.astm_iic_aiic_boundary.unsupported",
      "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
      "floor.reinforced_concrete_combined_astm_iic.unsupported"
    ],
    retiredRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_RETIRED_ROW_IDS,
    routeCoverage: orderedSubset(matrix.map((row) => row.route), ROUTE_ORDER),
    rowCount: 62,
    selectedLane: laneSelection.selectedCandidate.id,
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile
  };
}

function calculateOpeningLeakFieldBuilding(input: {
  airborneContext: AirborneContext;
  targetOutputs: readonly RequestedOutputId[];
}) {
  return calculateAssembly(OPENING_LEAK_HOST_WALL_LAYERS, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.targetOutputs
  });
}

function openingLeakFieldRuntimeMatrixRow(): PersonalUseMvpCoverageScenarioRow {
  const result = calculateOpeningLeakFieldBuilding({
    airborneContext: COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT,
    targetOutputs: OPENING_LEAK_FIELD_SUPPORTED_OUTPUTS
  });

  return {
    basis: "field_apparent",
    currentPosture: "family_physics",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "wall_opening_leak_field_adapter",
    hostileVariant: "ui_derived_complete_field_opening_leak_context_after_input_surface",
    id: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_FIELD_ROW_ID,
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_opening_leak_field_area_energy_runtime_corridor",
    requestedMetrics: OPENING_LEAK_FIELD_SUPPORTED_OUTPUTS,
    route: "wall",
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
      missingPhysicalInputs: result.airborneBasis?.missingPhysicalInputs ?? [],
      origin: result.airborneBasis?.origin ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.airborneCandidateResolution?.selectedCandidateId ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: metricPins({
        "Dn,w": result.metrics.estimatedDnWDb,
        "DnT,w": result.metrics.estimatedDnTwDb,
        "R'w": result.metrics.estimatedRwPrimeDb
      })
    },
    toleranceOrErrorBudget: `R'w/Dn,w/DnT,w +/-${COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB} dB source_absent opening/leak field budget`,
    valueOrBlockedReason: "R'w 36.4 / Dn,w 36.7 / DnT,w 36.9 from UI-owned opening/leak field input surface",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  };
}

function openingLeakBuildingRuntimeMatrixRow(): PersonalUseMvpCoverageScenarioRow {
  const result = calculateOpeningLeakFieldBuilding({
    airborneContext: COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT,
    targetOutputs: OPENING_LEAK_BUILDING_SUPPORTED_OUTPUTS
  });

  return {
    basis: "building_prediction",
    currentPosture: "family_physics",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "wall_opening_leak_building_adapter",
    hostileVariant: "ui_derived_complete_building_opening_leak_context_after_input_surface",
    id: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_ROW_ID,
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_opening_leak_building_area_energy_runtime_corridor",
    requestedMetrics: OPENING_LEAK_BUILDING_SUPPORTED_OUTPUTS,
    route: "wall",
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
      missingPhysicalInputs: result.airborneBasis?.missingPhysicalInputs ?? [],
      origin: result.airborneBasis?.origin ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.airborneCandidateResolution?.selectedCandidateId ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: metricPins({
        "DnT,w": result.metrics.estimatedDnTwDb,
        "R'w": result.metrics.estimatedRwPrimeDb
      })
    },
    toleranceOrErrorBudget: `R'w/DnT,w +/-${COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB} dB source_absent opening/leak building budget`,
    valueOrBlockedReason: "R'w 31.6 / DnT,w 32.1 from UI-owned opening/leak building input surface",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  };
}

function openingLeakAWeightedBoundaryMatrixRow(): PersonalUseMvpCoverageScenarioRow {
  const result = calculateOpeningLeakFieldBuilding({
    airborneContext: COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT,
    targetOutputs: OPENING_LEAK_A_WEIGHTED_OUTPUTS
  });

  return {
    basis: "field_apparent",
    currentPosture: "unsupported",
    expectedPosture: "unsupported",
    failureClass: "unsupported_metric",
    family: "wall_opening_leak_a_weighted_boundary",
    hostileVariant: "a_weighted_opening_leak_outputs_requested_without_spectrum_adapter_owner",
    id: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_A_WEIGHTED_ROW_ID,
    inputCompleteness: "complete",
    nextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION,
    originSupportBucket: "opening_leak_a_weighted_spectrum_adapter_owner_missing",
    requestedMetrics: OPENING_LEAK_A_WEIGHTED_OUTPUTS,
    route: "wall",
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: null,
      missingPhysicalInputs: [],
      origin: "unsupported",
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.airborneCandidateResolution?.selectedCandidateId ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: []
    },
    toleranceOrErrorBudget: "blocked_no_a_weighted_opening_leak_budget_until_spectrum_adapter_owner_exists",
    valueOrBlockedReason: "Opening/leak Dn,A / DnT,A remain unsupported until the A-weighted spectrum adapter owns C/Ctr transfer for the field/building route",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  };
}

function openingLeakBuildingMissingOwnerMatrixRow(): PersonalUseMvpCoverageScenarioRow {
  const partialContext: AirborneContext = {
    ...COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT
  };
  delete partialContext.sourceRoomVolumeM3;
  const result = calculateOpeningLeakFieldBuilding({
    airborneContext: partialContext,
    targetOutputs: OPENING_LEAK_BUILDING_SUPPORTED_OUTPUTS
  });
  const missingPhysicalInputs = result.airborneBasis?.missingPhysicalInputs ?? [];

  return {
    basis: "building_prediction",
    currentPosture: "needs_input",
    expectedPosture: "needs_input",
    failureClass: "correct_block",
    family: "wall_opening_leak_building_missing_owner",
    hostileVariant: "building_opening_leak_context_without_source_room_owner",
    id: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID,
    inputCompleteness: "partial",
    nextAction: "keep_missing_input_prompt",
    originSupportBucket: "opening_leak_building_physical_owner_missing",
    requestedMetrics: OPENING_LEAK_BUILDING_SUPPORTED_OUTPUTS,
    route: "wall",
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: null,
      missingPhysicalInputs,
      origin: result.airborneBasis?.origin ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.airborneCandidateResolution?.selectedCandidateId ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: []
    },
    toleranceOrErrorBudget: "blocked_no_opening_leak_building_budget_until_missing_owner_fields_are_complete",
    valueOrBlockedReason: `Needs ${missingPhysicalInputs.join(", ")} before opening/leak R'w / DnT,w building prediction can promote`,
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  };
}

export function buildCompanyInternalCalculationGradeMainlineMatrixV5():
  readonly PersonalUseMvpCoverageScenarioRow[] {
  const baseRows = buildCompanyInternalCalculationGradeMainlineMatrixV4();
  requireRow(
    baseRows,
    "wall.opening_leak_composite_building_boundary.unsupported",
    "matrix v4 opening/leak field-building unsupported boundary"
  );
  const retired = new Set<string>(COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_RETIRED_ROW_IDS);
  const rows = [
    ...baseRows.filter((row) => !retired.has(row.id)),
    openingLeakFieldRuntimeMatrixRow(),
    openingLeakBuildingRuntimeMatrixRow(),
    openingLeakAWeightedBoundaryMatrixRow(),
    openingLeakBuildingMissingOwnerMatrixRow()
  ];
  const ids = rows.map((row) => row.id);

  if (new Set(ids).size !== ids.length) {
    throw new Error("Company-internal matrix v5 contains duplicate row ids.");
  }

  return rows;
}

export function buildCompanyInternalCalculationGradeMainlineMatrixV5Contract():
  CompanyInternalCalculationGradeMainlineMatrixV5Contract {
  return {
    importedOpeningLeakFieldBuildingRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_IMPORTED_ROW_IDS,
    landedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_LANDED_GATE,
    matrixRows: 65,
    newRuntimeBehaviorChangeInRefresh: false,
    previousInputSurfaceLandedGate:
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_PREVIOUS_INPUT_SURFACE_LANDED_GATE,
    previousInputSurfaceSelectedNextAction:
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_PREVIOUS_INPUT_SURFACE_SELECTED_NEXT_ACTION,
    previousInputSurfaceSelectedNextFile:
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_PREVIOUS_INPUT_SURFACE_SELECTED_NEXT_FILE,
    previousInputSurfaceSelectionStatus:
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_PREVIOUS_INPUT_SURFACE_SELECTION_STATUS,
    previousMatrixRows: 62,
    retiredRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_RETIRED_ROW_IDS,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_FILE,
    selectedNextLabel: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export function rankCompanyInternalCalculationGradeV5NextLanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildCompanyInternalCalculationGradeMainlineMatrixV5()
): CompanyInternalCalculationGradeV5LaneSelection {
  const candidateSeeds = [
    {
      basisLeakageRisk: 3,
      calculationGradeRisk: 6,
      evidenceRowIds: [COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_A_WEIGHTED_ROW_ID],
      id: "opening_leak_a_weighted_spectrum_adapter_owner",
      implementationCost: 4,
      reason:
        "Opening/leak field/building R'w/Dn/DnT are now calculation-grade from UI input; the same common wall route still blocks Dn,A/DnT,A until a spectrum-adapter owner exists.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 6
    },
    {
      basisLeakageRisk: 4,
      calculationGradeRisk: 4,
      evidenceRowIds: [
        "wall.building_prediction_partial_context.needs_input",
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID
      ],
      id: "airborne_building_prediction_partial_context_revalidation",
      implementationCost: 6,
      reason:
        "Building prediction partial inputs are correctly parked with precise prompts; they should be revalidated after the narrower opening/leak A-weighted owner.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 5
    },
    {
      basisLeakageRisk: 7,
      calculationGradeRisk: 5,
      evidenceRowIds: [
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.reinforced_concrete_combined_astm_iic.unsupported"
      ],
      id: "astm_iic_aiic_parked_boundary",
      implementationCost: 8,
      reason:
        "ASTM IIC/AIIC remains parked; the company-internal mainline is still ISO-first and must not alias ISO Ln,w/DeltaLw to ASTM ratings.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 4
    },
    {
      basisLeakageRisk: 8,
      calculationGradeRisk: 2,
      evidenceRowIds: [
        "floor.lightweight_steel_exact_source_precedence.lab",
        "floor.reinforced_concrete_combined_exact_source_precedence.lab",
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_EXACT_FIELD_ROW_ID
      ],
      id: "broad_source_crawl",
      implementationCost: 9,
      reason:
        "Exact rows and exact field bands stay valuable precedence evidence, but broad source crawling is still not the next calculator coverage unlock.",
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 3
    }
  ] as const satisfies readonly Omit<CompanyInternalCalculationGradeV5LaneCandidate, "score" | "selected">[];
  const matrixIds = new Set(matrix.map((row) => row.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !matrixIds.has(id));

    if (missingRows.length > 0) {
      throw new Error(`Company-internal matrix v5 lane ${candidate.id} references missing rows: ${missingRows.join(", ")}`);
    }

    return {
      ...candidate,
      score: scoreLane(candidate),
      selected: false
    };
  });
  const [selected] = [...candidatesWithoutSelection].sort((left, right) => {
    const scoreDelta = right.score - left.score;
    return scoreDelta === 0 ? left.id.localeCompare(right.id) : scoreDelta;
  });

  if (!selected) {
    throw new Error("Company-internal matrix v5 requires one selected next lane.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Company-internal matrix v5 did not mark a selected next lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V5_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "record the landed opening/leak field/building input surface before selecting another runtime lane",
      "retire stale opening/leak field/building unsupported rows only after supported field and building rows are pinned",
      "keep A-weighted opening/leak outputs unsupported until a spectrum-adapter owner exists",
      "keep ASTM IIC/AIIC parked unless a later active plan explicitly reselects ASTM",
      "do not choose broad source crawling when a bounded source-absent adapter can increase calculator coverage"
    ]
  };
}

export function summarizeCompanyInternalCalculationGradeMainlineMatrixV5(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildCompanyInternalCalculationGradeMainlineMatrixV5()
): CompanyInternalCalculationGradeMainlineMatrixV5Summary {
  requireRows(matrix, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_IMPORTED_ROW_IDS, "opening/leak field-building v5");
  const ids = new Set(matrix.map((row) => row.id));
  const retiredStillPresent = COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_RETIRED_ROW_IDS.filter((id) => ids.has(id));

  if (retiredStillPresent.length > 0) {
    throw new Error(`Company-internal matrix v5 still contains retired row ids: ${retiredStillPresent.join(", ")}`);
  }

  const hiddenScreeningOriginRowIds = matrix
    .filter((row) =>
      row.inputCompleteness === "complete" &&
      row.currentPosture === "family_physics" &&
      row.runtime.origin === "screening_fallback"
    )
    .map((row) => row.id);

  if (hiddenScreeningOriginRowIds.length > 0) {
    throw new Error(`Company-internal matrix v5 still hides screening origins: ${hiddenScreeningOriginRowIds.join(", ")}`);
  }

  const laneSelection = rankCompanyInternalCalculationGradeV5NextLanes(matrix);

  return {
    basisCoverage: orderedSubset(matrix.map((row) => row.basis), BASIS_ORDER),
    correctlyBlockedRowIds: matrix
      .filter((row) => row.failureClass !== "none")
      .map((row) => row.id),
    currentPostureCoverage: orderedSubset(matrix.map((row) => row.currentPosture), POSTURE_ORDER),
    exactSourcePrecedenceRowIds: [
      "floor.lightweight_steel_exact_source_precedence.lab",
      "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab",
      "floor.reinforced_concrete_combined_exact_source_precedence.lab",
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_EXACT_FIELD_ROW_ID
    ],
    failureClassCounts: failureClassCounts(matrix),
    hiddenScreeningOriginRowIds: [],
    importedOpeningLeakFieldBuildingRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_IMPORTED_ROW_IDS,
    noRuntimeValueMovementInRefresh: true,
    parkedAstmBoundaryRowIds: [
      "floor.astm_iic_aiic_boundary.unsupported",
      "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
      "floor.reinforced_concrete_combined_astm_iic.unsupported"
    ],
    promotedOpeningLeakBuildingRowId: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_ROW_ID,
    promotedOpeningLeakFieldRowId: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_FIELD_ROW_ID,
    remainingCalculationGradeBlockerRowIds: [
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_A_WEIGHTED_ROW_ID,
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID,
      "wall.building_prediction_partial_context.needs_input",
      "floor.astm_iic_aiic_boundary.unsupported",
      "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
      "floor.reinforced_concrete_combined_astm_iic.unsupported"
    ],
    retiredRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_RETIRED_ROW_IDS,
    routeCoverage: orderedSubset(matrix.map((row) => row.route), ROUTE_ORDER),
    rowCount: 65,
    selectedLane: laneSelection.selectedCandidate.id,
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile
  };
}

function openingLeakAWeightedFieldRuntimeMatrixRow(): PersonalUseMvpCoverageScenarioRow {
  const result = calculateOpeningLeakFieldBuilding({
    airborneContext: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_FIELD_CONTEXT,
    targetOutputs: OPENING_LEAK_A_WEIGHTED_OUTPUTS
  });

  return {
    basis: "field_apparent",
    currentPosture: "family_physics",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "wall_opening_leak_a_weighted_field_adapter",
    hostileVariant: "ui_derived_complete_field_opening_leak_a_weighted_context_after_surface_parity",
    id: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_FIELD_ROW_ID,
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_opening_leak_a_weighted_field_spectrum_adapter_runtime_corridor",
    requestedMetrics: OPENING_LEAK_A_WEIGHTED_OUTPUTS,
    route: "wall",
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
      missingPhysicalInputs: result.airborneBasis?.missingPhysicalInputs ?? [],
      origin: result.airborneBasis?.origin ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.airborneCandidateResolution?.selectedCandidateId ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: metricPins({
        "Dn,A": result.metrics.estimatedDnADb,
        "DnT,A": result.metrics.estimatedDnTADb
      })
    },
    toleranceOrErrorBudget: `Dn,A/DnT,A +/-${COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB} dB source_absent opening/leak A-weighted field budget`,
    valueOrBlockedReason: "Dn,A 35.9 / DnT,A 36.1 from UI-owned opening/leak A-weighted field input surface",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  };
}

function openingLeakAWeightedBuildingRuntimeMatrixRow(): PersonalUseMvpCoverageScenarioRow {
  const result = calculateOpeningLeakFieldBuilding({
    airborneContext: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_BUILDING_CONTEXT,
    targetOutputs: OPENING_LEAK_A_WEIGHTED_BUILDING_OUTPUTS
  });

  return {
    basis: "building_prediction",
    currentPosture: "family_physics",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "wall_opening_leak_a_weighted_building_adapter",
    hostileVariant: "ui_derived_complete_building_opening_leak_a_weighted_context_after_surface_parity",
    id: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_ROW_ID,
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_opening_leak_a_weighted_building_spectrum_adapter_runtime_corridor",
    requestedMetrics: OPENING_LEAK_A_WEIGHTED_BUILDING_OUTPUTS,
    route: "wall",
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
      missingPhysicalInputs: result.airborneBasis?.missingPhysicalInputs ?? [],
      origin: result.airborneBasis?.origin ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.airborneCandidateResolution?.selectedCandidateId ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: metricPins({
        "DnT,A": result.metrics.estimatedDnTADb
      })
    },
    toleranceOrErrorBudget: `DnT,A +/-${COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB} dB source_absent opening/leak A-weighted building budget`,
    valueOrBlockedReason: "DnT,A 31.3 from UI-owned opening/leak A-weighted building input surface",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  };
}

function openingLeakAWeightedBuildingDnABoundaryMatrixRow(): PersonalUseMvpCoverageScenarioRow {
  const result = calculateOpeningLeakFieldBuilding({
    airborneContext: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_BUILDING_CONTEXT,
    targetOutputs: OPENING_LEAK_A_WEIGHTED_BUILDING_DNA_OUTPUTS
  });

  return {
    basis: "building_prediction",
    currentPosture: "unsupported",
    expectedPosture: "unsupported",
    failureClass: "unsupported_metric",
    family: "wall_opening_leak_a_weighted_building_dna_boundary",
    hostileVariant: "building_opening_leak_dna_requested_even_though_only_dnta_is_owned",
    id: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_DNA_ROW_ID,
    inputCompleteness: "complete",
    nextAction: "keep_building_dna_unsupported_until_metric_owner_exists",
    originSupportBucket: "opening_leak_a_weighted_building_dna_metric_owner_missing",
    requestedMetrics: OPENING_LEAK_A_WEIGHTED_BUILDING_DNA_OUTPUTS,
    route: "wall",
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: null,
      missingPhysicalInputs: [],
      origin: "unsupported",
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.airborneCandidateResolution?.selectedCandidateId ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: []
    },
    toleranceOrErrorBudget: "blocked_no_building_dn_a_budget_until_a_metric_owner_exists",
    valueOrBlockedReason: "Building Dn,A remains unsupported; Gate V6 owns building DnT,A only and does not alias DnT,A to Dn,A",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  };
}

function openingLeakAWeightedMissingBandMatrixRow(): PersonalUseMvpCoverageScenarioRow {
  const result = calculateOpeningLeakFieldBuilding({
    airborneContext: COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT,
    targetOutputs: OPENING_LEAK_A_WEIGHTED_OUTPUTS
  });

  return {
    basis: "field_apparent",
    currentPosture: "needs_input",
    expectedPosture: "needs_input",
    failureClass: "correct_block",
    family: "wall_opening_leak_a_weighted_missing_frequency_band",
    hostileVariant: "field_opening_leak_a_weighted_requested_without_frequency_band_set",
    id: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_MISSING_BAND_ROW_ID,
    inputCompleteness: "partial",
    nextAction: "keep_frequency_band_set_prompt",
    originSupportBucket: "opening_leak_a_weighted_frequency_band_set_missing",
    requestedMetrics: OPENING_LEAK_A_WEIGHTED_OUTPUTS,
    route: "wall",
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: null,
      missingPhysicalInputs: ["frequencyBandSet"],
      origin: result.airborneBasis?.origin ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.airborneCandidateResolution?.selectedCandidateId ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: []
    },
    toleranceOrErrorBudget: "blocked_no_a_weighted_budget_until_frequencyBandSet_is_explicit",
    valueOrBlockedReason: "Needs frequencyBandSet third_octave_100_3150 before opening/leak Dn,A / DnT,A can promote",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  };
}

function openingLeakAWeightedLabAliasBoundaryMatrixRow(): PersonalUseMvpCoverageScenarioRow {
  const result = calculateOpeningLeakFieldBuilding({
    airborneContext: {
      contextMode: "element_lab",
      frequencyBandSet: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
      hostWallAreaM2: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_FIELD_CONTEXT.hostWallAreaM2,
      openingLeakElements: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_FIELD_CONTEXT.openingLeakElements
    },
    targetOutputs: OPENING_LEAK_A_WEIGHTED_OUTPUTS
  });

  return {
    basis: "element_lab",
    currentPosture: "unsupported",
    expectedPosture: "unsupported",
    failureClass: "basis_boundary",
    family: "wall_opening_leak_a_weighted_lab_alias_boundary",
    hostileVariant: "lab_opening_leak_rw_stc_requested_as_dn_a_or_dnta",
    id: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_LAB_ALIAS_ROW_ID,
    inputCompleteness: "complete",
    nextAction: "keep_lab_rw_stc_out_of_a_weighted_field_building_route",
    originSupportBucket: "opening_leak_a_weighted_lab_alias_blocked",
    requestedMetrics: OPENING_LEAK_A_WEIGHTED_OUTPUTS,
    route: "wall",
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: null,
      missingPhysicalInputs: [],
      origin: "unsupported",
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.airborneCandidateResolution?.selectedCandidateId ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: []
    },
    toleranceOrErrorBudget: "blocked_no_lab_to_field_or_building_a_weighted_alias_budget",
    valueOrBlockedReason: "Lab Rw/STC opening/leak results are not aliases for Dn,A / DnT,A field or building outputs",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  };
}

function openingLeakAWeightedAstmAliasBoundaryMatrixRow(): PersonalUseMvpCoverageScenarioRow {
  const result = calculateOpeningLeakFieldBuilding({
    airborneContext: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_FIELD_CONTEXT,
    targetOutputs: OPENING_LEAK_A_WEIGHTED_ASTM_OUTPUTS
  });

  return {
    basis: "astm_rating_boundary",
    currentPosture: "unsupported",
    expectedPosture: "unsupported",
    failureClass: "basis_boundary",
    family: "wall_opening_leak_a_weighted_astm_alias_boundary",
    hostileVariant: "astm_iic_aiic_requested_from_airborne_opening_leak_a_weighted_route",
    id: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_ASTM_ALIAS_ROW_ID,
    inputCompleteness: "complete",
    nextAction: "keep_airborne_a_weighted_out_of_impact_astm_route",
    originSupportBucket: "opening_leak_a_weighted_astm_iic_aiic_alias_blocked",
    requestedMetrics: OPENING_LEAK_A_WEIGHTED_ASTM_OUTPUTS,
    route: "wall",
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: null,
      missingPhysicalInputs: [],
      origin: "unsupported",
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.airborneCandidateResolution?.selectedCandidateId ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: []
    },
    toleranceOrErrorBudget: "blocked_no_airborne_to_impact_astm_alias_budget",
    valueOrBlockedReason: "Opening/leak Dn,A / DnT,A is an airborne ISO route; it does not calculate impact ASTM IIC / AIIC",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  };
}

function openingLeakAWeightedExactSourcePrecedenceMatrixRow(): PersonalUseMvpCoverageScenarioRow {
  const result = calculateOpeningLeakFieldBuilding({
    airborneContext: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_FIELD_CONTEXT,
    targetOutputs: OPENING_LEAK_A_WEIGHTED_OUTPUTS
  });

  return {
    basis: "field_apparent",
    currentPosture: "family_physics",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "wall_opening_leak_a_weighted_exact_source_precedence_boundary",
    hostileVariant: "source_absent_a_weighted_formula_keeps_exact_source_precedence_reserved",
    id: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_EXACT_SOURCE_ROW_ID,
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_a_weighted_formula_with_exact_source_precedence_reserved",
    requestedMetrics: OPENING_LEAK_A_WEIGHTED_OUTPUTS,
    route: "wall",
    runtime: {
      basisId: result.airborneBasis?.method ?? null,
      errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
      missingPhysicalInputs: result.airborneBasis?.missingPhysicalInputs ?? [],
      origin: result.airborneBasis?.origin ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.airborneCandidateResolution?.selectedCandidateId ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: metricPins({
        "Dn,A": result.metrics.estimatedDnADb,
        "DnT,A": result.metrics.estimatedDnTADb
      })
    },
    toleranceOrErrorBudget: `source_absent formula +/-${COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB} dB; true same-basis exact A-weighted source rows still outrank this candidate`,
    valueOrBlockedReason: "Dn,A 35.9 / DnT,A 36.1 remain source-absent family physics, not exact measured evidence",
    visibleSurfaceParityTarget: WALL_VISIBLE_SURFACES
  };
}

export function buildCompanyInternalCalculationGradeMainlineMatrixV6():
  readonly PersonalUseMvpCoverageScenarioRow[] {
  const baseRows = buildCompanyInternalCalculationGradeMainlineMatrixV5();
  requireRow(
    baseRows,
    COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_A_WEIGHTED_ROW_ID,
    "matrix v5 opening/leak A-weighted unsupported boundary"
  );
  const retired = new Set<string>(COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_RETIRED_ROW_IDS);
  const rows = [
    ...baseRows.filter((row) => !retired.has(row.id)),
    openingLeakAWeightedFieldRuntimeMatrixRow(),
    openingLeakAWeightedBuildingRuntimeMatrixRow(),
    openingLeakAWeightedBuildingDnABoundaryMatrixRow(),
    openingLeakAWeightedMissingBandMatrixRow(),
    openingLeakAWeightedLabAliasBoundaryMatrixRow(),
    openingLeakAWeightedAstmAliasBoundaryMatrixRow(),
    openingLeakAWeightedExactSourcePrecedenceMatrixRow()
  ];
  const ids = rows.map((row) => row.id);

  if (new Set(ids).size !== ids.length) {
    throw new Error("Company-internal matrix v6 contains duplicate row ids.");
  }

  return rows;
}

export function buildCompanyInternalCalculationGradeMainlineMatrixV6Contract():
  CompanyInternalCalculationGradeMainlineMatrixV6Contract {
  return {
    importedOpeningLeakAWeightedRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_IMPORTED_ROW_IDS,
    landedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_LANDED_GATE,
    matrixRows: 71,
    newRuntimeBehaviorChangeInRefresh: false,
    previousMatrixRows: 65,
    previousSurfaceParityLandedGate: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_LANDED_GATE,
    previousSurfaceParitySelectedNextAction:
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    previousSurfaceParitySelectedNextFile:
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_FILE,
    previousSurfaceParitySelectionStatus:
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTION_STATUS,
    retiredRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_RETIRED_ROW_IDS,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_FILE,
    selectedNextLabel: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export function rankCompanyInternalCalculationGradeV6NextLanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildCompanyInternalCalculationGradeMainlineMatrixV6()
): CompanyInternalCalculationGradeV6LaneSelection {
  const candidateSeeds = [
    {
      basisLeakageRisk: 2,
      calculationGradeRisk: 4,
      evidenceRowIds: [
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID,
        "wall.building_prediction_partial_context.needs_input",
        "floor.astm_iic_aiic_boundary.unsupported",
        "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
        "floor.reinforced_concrete_combined_astm_iic.unsupported"
      ],
      id: "boundary_revalidation_building_partial_context_and_astm",
      implementationCost: 3,
      reason:
        "After A-weighted support lands in the matrix, the remaining high-value closeout is proving building partial-context prompts and parked ASTM boundaries still fail closed.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 5
    },
    {
      basisLeakageRisk: 2,
      calculationGradeRisk: 3,
      evidenceRowIds: [
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_FIELD_ROW_ID,
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_ROW_ID,
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_MISSING_BAND_ROW_ID
      ],
      id: "final_internal_use_rehearsal",
      implementationCost: 5,
      reason:
        "The final operating-envelope rehearsal comes after boundary rows are revalidated, so the release note does not hide any parked basis route.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 6
    },
    {
      basisLeakageRisk: 8,
      calculationGradeRisk: 2,
      evidenceRowIds: [
        "floor.lightweight_steel_exact_source_precedence.lab",
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_EXACT_SOURCE_ROW_ID
      ],
      id: "broad_source_crawl",
      implementationCost: 9,
      reason:
        "More sources can tighten budgets later, but the matrix still has bounded source-absent and basis-boundary closeout work ahead of broad crawling.",
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 3
    }
  ] as const satisfies readonly Omit<CompanyInternalCalculationGradeV6LaneCandidate, "score" | "selected">[];
  const matrixIds = new Set(matrix.map((row) => row.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !matrixIds.has(id));

    if (missingRows.length > 0) {
      throw new Error(`Company-internal matrix v6 lane ${candidate.id} references missing rows: ${missingRows.join(", ")}`);
    }

    return {
      ...candidate,
      score: scoreLane(candidate),
      selected: false
    };
  });
  const [selected] = [...candidatesWithoutSelection].sort((left, right) => {
    const scoreDelta = right.score - left.score;
    return scoreDelta === 0 ? left.id.localeCompare(right.id) : scoreDelta;
  });

  if (!selected) {
    throw new Error("Company-internal matrix v6 requires one selected next lane.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Company-internal matrix v6 did not mark a selected next lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "retire the stale A-weighted unsupported matrix row only after field and building A-weighted values are pinned",
      "keep missing frequencyBandSet as a user input prompt instead of falling back to base field/building values",
      "keep building Dn,A, lab aliases, and ASTM aliases unsupported unless a later owner explicitly promotes them",
      "revalidate building partial-context and ASTM parked-boundary rows before the final internal-use rehearsal",
      "do not choose broad source crawling while source-absent matrix closeout remains executable"
    ]
  };
}

export function summarizeCompanyInternalCalculationGradeMainlineMatrixV6(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildCompanyInternalCalculationGradeMainlineMatrixV6()
): CompanyInternalCalculationGradeMainlineMatrixV6Summary {
  requireRows(matrix, COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_IMPORTED_ROW_IDS, "opening/leak A-weighted v6");
  const ids = new Set(matrix.map((row) => row.id));
  const retiredStillPresent = COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_RETIRED_ROW_IDS.filter((id) => ids.has(id));

  if (retiredStillPresent.length > 0) {
    throw new Error(`Company-internal matrix v6 still contains retired row ids: ${retiredStillPresent.join(", ")}`);
  }

  const hiddenScreeningOriginRowIds = matrix
    .filter((row) =>
      row.inputCompleteness === "complete" &&
      row.currentPosture === "family_physics" &&
      row.runtime.origin === "screening_fallback"
    )
    .map((row) => row.id);

  if (hiddenScreeningOriginRowIds.length > 0) {
    throw new Error(`Company-internal matrix v6 still hides screening origins: ${hiddenScreeningOriginRowIds.join(", ")}`);
  }

  const laneSelection = rankCompanyInternalCalculationGradeV6NextLanes(matrix);

  return {
    basisCoverage: orderedSubset(matrix.map((row) => row.basis), BASIS_ORDER),
    correctlyBlockedRowIds: matrix
      .filter((row) => row.failureClass !== "none")
      .map((row) => row.id),
    currentPostureCoverage: orderedSubset(matrix.map((row) => row.currentPosture), POSTURE_ORDER),
    exactSourcePrecedenceRowIds: [
      "floor.lightweight_steel_exact_source_precedence.lab",
      "floor.lightweight_steel_suspended_ceiling_exact_source_precedence.lab",
      "floor.reinforced_concrete_combined_exact_source_precedence.lab",
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V4_STEEL_LNT50_EXACT_FIELD_ROW_ID
    ],
    failureClassCounts: failureClassCounts(matrix),
    hiddenScreeningOriginRowIds: [],
    importedOpeningLeakAWeightedRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_IMPORTED_ROW_IDS,
    noRuntimeValueMovementInRefresh: true,
    parkedAstmBoundaryRowIds: [
      "floor.astm_iic_aiic_boundary.unsupported",
      "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
      "floor.reinforced_concrete_combined_astm_iic.unsupported"
    ],
    promotedOpeningLeakAWeightedBuildingRowId:
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_ROW_ID,
    promotedOpeningLeakAWeightedFieldRowId:
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_FIELD_ROW_ID,
    remainingCalculationGradeBlockerRowIds: [
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_DNA_ROW_ID,
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_MISSING_BAND_ROW_ID,
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_LAB_ALIAS_ROW_ID,
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_ASTM_ALIAS_ROW_ID,
      COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V5_OPENING_BUILDING_MISSING_OWNER_ROW_ID,
      "wall.building_prediction_partial_context.needs_input",
      "floor.astm_iic_aiic_boundary.unsupported",
      "floor.lightweight_steel_suspended_ceiling_astm.unsupported",
      "floor.reinforced_concrete_combined_astm_iic.unsupported"
    ],
    retiredRowIds: COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_RETIRED_ROW_IDS,
    routeCoverage: orderedSubset(matrix.map((row) => row.route), ROUTE_ORDER),
    rowCount: 71,
    selectedLane: laneSelection.selectedCandidate.id,
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile
  };
}

function valueMap(row: PersonalUseMvpCoverageScenarioRow): Record<string, number> {
  return Object.fromEntries(row.runtime.valuePins.map((pin) => [pin.metric, pin.value]));
}

export function buildCompanyInternalBuildingAstmBoundaryRevalidationContract():
  CompanyInternalBuildingAstmBoundaryRevalidationContract {
  return {
    astmBoundaryRowsStayUnsupported: true,
    buildingBoundaryRowsStayNeedsInput: true,
    landedGate: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_LANDED_GATE,
    matrixRows: 71,
    newRuntimeBehaviorChangeInRevalidation: false,
    previousMatrixV6LandedGate: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_LANDED_GATE,
    previousMatrixV6SelectedNextAction: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_ACTION,
    previousMatrixV6SelectedNextFile: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTED_NEXT_FILE,
    previousMatrixV6SelectionStatus: COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_MATRIX_V6_SELECTION_STATUS,
    revalidatedBoundaryRowIds: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_ROW_IDS,
    revalidatedBuildingRowIds: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_BUILDING_ROW_IDS,
    revalidatedCrossRouteAstmRowIds: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_CROSS_ROUTE_ASTM_ROW_IDS,
    revalidatedFloorAstmRowIds: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_FLOOR_ASTM_ROW_IDS,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_FILE,
    selectedNextLabel: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export function rankCompanyInternalBuildingAstmBoundaryRevalidationNextLanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildCompanyInternalCalculationGradeMainlineMatrixV6()
): CompanyInternalBuildingAstmBoundaryRevalidationLaneSelection {
  const candidateSeeds = [
    {
      basisLeakageRisk: 1,
      calculationGradeRisk: 4,
      evidenceRowIds: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_ROW_IDS,
      id: "final_internal_use_rehearsal",
      implementationCost: 2,
      reason:
        "After the remaining building and ASTM boundaries are proven fail-closed, the highest-value next step is a final internal-use operating-envelope rehearsal.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 7
    },
    {
      basisLeakageRisk: 5,
      calculationGradeRisk: 3,
      evidenceRowIds: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_FLOOR_ASTM_ROW_IDS,
      id: "astm_runtime_adapter",
      implementationCost: 8,
      reason:
        "ASTM IIC/AIIC runtime can be useful later, but it is outside the ISO-first company-internal closeout and must not alias Ln,w or DeltaLw.",
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 3
    },
    {
      basisLeakageRisk: 6,
      calculationGradeRisk: 2,
      evidenceRowIds: [
        "floor.lightweight_steel_exact_source_precedence.lab",
        COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_EXACT_SOURCE_ROW_ID
      ],
      id: "broad_source_crawl",
      implementationCost: 9,
      reason:
        "More source rows are useful for later calibration, but they are not required to close the current company-internal operating envelope.",
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 3
    }
  ] as const satisfies readonly Omit<
    CompanyInternalBuildingAstmBoundaryRevalidationLaneCandidate,
    "score" | "selected"
  >[];
  const matrixIds = new Set(matrix.map((row) => row.id));
  const candidatesWithoutSelection = candidateSeeds.map((candidate) => {
    const missingRows = candidate.evidenceRowIds.filter((id) => !matrixIds.has(id));

    if (missingRows.length > 0) {
      throw new Error(
        `Company-internal boundary revalidation lane ${candidate.id} references missing rows: ${missingRows.join(", ")}`
      );
    }

    return {
      ...candidate,
      score: scoreLane(candidate),
      selected: false
    };
  });
  const [selected] = [...candidatesWithoutSelection].sort((left, right) => {
    const scoreDelta = right.score - left.score;
    return scoreDelta === 0 ? left.id.localeCompare(right.id) : scoreDelta;
  });

  if (!selected) {
    throw new Error("Company-internal boundary revalidation requires one selected next lane.");
  }

  const candidates = candidatesWithoutSelection.map((candidate) => ({
    ...candidate,
    selected: candidate.id === selected.id
  }));
  const selectedCandidate = candidates.find((candidate) => candidate.selected);

  if (!selectedCandidate) {
    throw new Error("Company-internal boundary revalidation did not mark a selected next lane.");
  }

  return {
    candidates,
    selectedCandidate,
    selectedNextAction: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_SELECTED_NEXT_FILE,
    selectionPolicy: [
      "building prediction partial contexts must remain needs_input with named physical owners and no value pins",
      "opening/leak building missing-owner rows must not borrow field values or expose a building budget",
      "ASTM IIC/AIIC rows must remain unsupported until a real ASTM rating adapter owns the route",
      "A-weighted airborne Dn,A/DnT,A rows must not become impact ASTM aliases",
      "after these boundaries are stable, run the final internal-use rehearsal instead of broad source crawling"
    ]
  };
}

export function summarizeCompanyInternalBuildingAstmBoundaryRevalidation(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] = buildCompanyInternalCalculationGradeMainlineMatrixV6()
): CompanyInternalBuildingAstmBoundaryRevalidationSummary {
  requireRows(matrix, COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_ROW_IDS, "building/ASTM boundary revalidation");

  const rowsById = new Map(matrix.map((row) => [row.id, row]));
  const boundaryRows = COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_ROW_IDS.map((rowId) =>
    requireRow(matrix, rowId, "building/ASTM boundary revalidation")
  );
  const buildingRows = COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_BUILDING_ROW_IDS.map((rowId) =>
    requireRow(matrix, rowId, "building boundary revalidation")
  );
  const floorAstmRows = COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_FLOOR_ASTM_ROW_IDS.map((rowId) =>
    requireRow(matrix, rowId, "floor ASTM boundary revalidation")
  );
  const crossRouteAstmRows = COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_CROSS_ROUTE_ASTM_ROW_IDS.map((rowId) =>
    requireRow(matrix, rowId, "cross-route ASTM boundary revalidation")
  );
  const invalidBuildingRows = buildingRows
    .filter((row) =>
      row.basis !== "building_prediction" ||
      row.currentPosture !== "needs_input" ||
      row.expectedPosture !== "needs_input" ||
      row.failureClass !== "correct_block" ||
      row.runtime.errorBudgetDb !== null ||
      row.runtime.supportedTargetOutputs.length > 0 ||
      row.runtime.valuePins.length > 0 ||
      row.runtime.missingPhysicalInputs.length === 0
    )
    .map((row) => row.id);

  if (invalidBuildingRows.length > 0) {
    throw new Error(`Company-internal building boundary rows no longer fail closed: ${invalidBuildingRows.join(", ")}`);
  }

  const invalidAstmRows = [...floorAstmRows, ...crossRouteAstmRows]
    .filter((row) =>
      row.basis !== "astm_rating_boundary" ||
      row.currentPosture !== "unsupported" ||
      row.expectedPosture !== "unsupported" ||
      row.runtime.errorBudgetDb !== null ||
      row.runtime.supportedTargetOutputs.length > 0 ||
      row.runtime.valuePins.length > 0 ||
      !row.runtime.unsupportedTargetOutputs.includes("IIC") ||
      !row.runtime.unsupportedTargetOutputs.includes("AIIC")
    )
    .map((row) => row.id);

  if (invalidAstmRows.length > 0) {
    throw new Error(`Company-internal ASTM boundary rows no longer fail closed: ${invalidAstmRows.join(", ")}`);
  }

  const fieldAWeighted = rowsById.get(COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_FIELD_ROW_ID);
  const buildingAWeighted = rowsById.get(COMPANY_INTERNAL_CALCULATION_GRADE_MATRIX_V6_OPENING_A_WEIGHTED_BUILDING_ROW_ID);
  const fieldPins = fieldAWeighted ? valueMap(fieldAWeighted) : {};
  const buildingPins = buildingAWeighted ? valueMap(buildingAWeighted) : {};
  const matrixV6AWeightedValuePinsPreserved =
    fieldPins["Dn,A"] === 35.9 &&
    fieldPins["DnT,A"] === 36.1 &&
    buildingPins["DnT,A"] === 31.3;

  if (!matrixV6AWeightedValuePinsPreserved) {
    throw new Error("Company-internal boundary revalidation moved Matrix V6 A-weighted value pins.");
  }

  const laneSelection = rankCompanyInternalBuildingAstmBoundaryRevalidationNextLanes(matrix);

  return {
    astmUnsupportedRowIds: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_FLOOR_ASTM_ROW_IDS,
    boundaryRowsWithoutErrorBudget: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_ROW_IDS,
    boundaryRowsWithoutValuePins: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_ROW_IDS,
    buildingMissingPhysicalInputsByRowId: Object.fromEntries(
      buildingRows.map((row) => [row.id, row.runtime.missingPhysicalInputs])
    ),
    buildingNeedsInputRowIds: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_BUILDING_ROW_IDS,
    crossRouteAstmUnsupportedRowIds: COMPANY_INTERNAL_BUILDING_ASTM_BOUNDARY_REVALIDATION_CROSS_ROUTE_ASTM_ROW_IDS,
    finalRehearsalReady: true,
    matrixRows: 71,
    matrixV6AWeightedValuePinsPreserved: true,
    selectedLane: laneSelection.selectedCandidate.id,
    selectedNextAction: laneSelection.selectedNextAction,
    selectedNextFile: laneSelection.selectedNextFile
  };
}
