import type {
  AcousticInputFieldId,
  ImpactCalculation,
  ImpactErrorBudget,
  LayerInput,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import {
  type PersonalUseMvpCoverageFailureClass,
  type PersonalUseMvpCoverageMetricValuePin,
  type PersonalUseMvpCoverageOutputBasis,
  type PersonalUseMvpCoveragePosture,
  type PersonalUseMvpCoverageScenarioRow,
  type PersonalUseMvpCoverageVisibleSurface
} from "./calculator-personal-use-mvp-coverage-sprint";
import { buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix } from "./calculator-personal-use-mvp-coverage-sprint-gate-aa";
import {
  GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ba";
import {
  buildPersonalUseMvpCoverageSprintGateBGRevalidationContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bg";
import {
  buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract,
  buildHeavyConcreteCombinedImpactPredictorInputFromSurface,
  GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
  GATE_BF_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS,
  GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
  HEAVY_CONCRETE_COMBINED_IMPACT_INPUT_SURFACE_FIELDS
} from "./heavy-concrete-combined-impact-input-surface";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_LANDED_GATE =
  "gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTION_STATUS =
  "gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_landed_no_runtime_selected_field_building_adapter_gate_bi";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_ACTION =
  "gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bi-floor-impact-field-building-adapter-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_LABEL =
  "floor-impact field/building adapter contract";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_EXPECTED_ROW_IDS = [
  "floor.heavy_concrete_floating_floor.lab",
  "floor.heavy_concrete_floating_floor_missing_load.needs_input",
  "floor.heavy_concrete_floating_floor_safe_reorder.lab",
  "floor.heavy_concrete_combined_input_surface.lab",
  "floor.heavy_concrete_combined_safe_reorder.lab",
  "floor.heavy_concrete_combined_missing_load.needs_input",
  "floor.heavy_concrete_combined_duplicate_base.refused",
  "floor.lightweight_steel_complete_formula.lab",
  "floor.lightweight_steel_duplicate_carrier.refused",
  "floor.lightweight_steel_formula_missing_spacing.needs_input",
  "floor.lightweight_steel_formula_wrong_family.inactive",
  "floor.lightweight_steel_exact_source_precedence.lab",
  "floor.timber_joist_impact.lab",
  "floor.timber_joist_formula_missing_dynamic_stiffness.needs_input",
  "floor.clt_mass_timber_impact.lab",
  "floor.clt_mass_timber_field_lnt50.local_guide",
  "floor.complete_field_impact_context.lprime",
  "floor.missing_field_impact_context.needs_input",
  "floor.building_impact.prediction_adapter_boundary",
  "floor.astm_iic_aiic_boundary.unsupported",
  "floor.many_layer_stress_exact_stable"
] as const;

export const GATE_BH_HEAVY_CONCRETE_COMBINED_ROW_IDS = [
  "floor.heavy_concrete_combined_input_surface.lab",
  "floor.heavy_concrete_combined_safe_reorder.lab",
  "floor.heavy_concrete_combined_missing_load.needs_input",
  "floor.heavy_concrete_combined_duplicate_base.refused"
] as const;

export type PersonalUseMvpCoverageSprintGateBILaneId =
  | "astm_impact_rating_adapter_contract"
  | "broad_floor_source_row_crawl"
  | "floor_impact_field_building_adapter_contract"
  | "floor_impact_formula_retune_with_holdouts"
  | "floor_impact_low_frequency_owner_contract";

export type PersonalUseMvpCoverageSprintGateBILaneCandidate = {
  basisLeakageRisk: number;
  blockedOrUnsupportedEvidence: number;
  evidenceRowIds: readonly string[];
  id: PersonalUseMvpCoverageSprintGateBILaneId;
  implementationCost: number;
  reason: string;
  score: number;
  selected: boolean;
  sourceRowsRequiredForRuntimeSelection: boolean;
  userFrequency: number;
};

export type PersonalUseMvpCoverageSprintGateBHLandingContract = {
  apiShapeChange: false;
  evidencePromotion: false;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_LANDED_GATE;
  matrixRows: 21;
  numericRuntimeBehaviorChange: false;
  previousGateBG: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_LANDED_GATE;
    selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_FILE;
    selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTION_STATUS;
  };
  routeCardValueChange: false;
  selectedImplementationSlice: "personal_use_mvp_coverage_sprint_after_gate_bg_floor_impact_source_absent_coverage_matrix_refresh";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_LABEL;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  workbenchInputBehaviorChange: false;
};

export type PersonalUseMvpCoverageSprintGateBHSummary = {
  basisCoverage: readonly PersonalUseMvpCoverageOutputBasis[];
  correctlyBlockedRowIds: readonly string[];
  currentPostureCoverage: readonly PersonalUseMvpCoveragePosture[];
  failureClassCounts: Readonly<Record<PersonalUseMvpCoverageFailureClass, number>>;
  heavyConcreteCombinedRowIds: typeof GATE_BH_HEAVY_CONCRETE_COMBINED_ROW_IDS;
  matrixRowsAddedAtGateBH: 5;
  noRuntimeValueMovement: true;
  previousSelectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTION_STATUS;
  routeCoverage: readonly ["floor"];
  rowCount: 21;
  selectedGateBILane: PersonalUseMvpCoverageSprintGateBILaneId;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTION_STATUS;
  sourceAbsentValueRowIds: readonly string[];
};

const FLOOR_LAB_IMPACT_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FLOOR_BUILDING_IMPACT_OUTPUTS = ["L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];

const IMPACT_VISIBLE_SURFACES = [
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
  "needs_input",
  "unsupported",
  "exact",
  "source_anchored_delta",
  "bounded_screening",
  "calibrated_physics"
] as const satisfies readonly PersonalUseMvpCoveragePosture[];

const FAILURE_CLASS_ORDER = [
  "none",
  "correct_block",
  "hostile_input_refusal",
  "unsupported_metric",
  "basis_boundary",
  "coverage_gap"
] as const satisfies readonly PersonalUseMvpCoverageFailureClass[];

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function orderedSubset<T extends string>(items: readonly T[], order: readonly T[]): T[] {
  const present = new Set(items);
  return order.filter((item) => present.has(item));
}

function valuePinsFromImpact(
  impact: ImpactCalculation | null | undefined,
  targetOutputs: readonly RequestedOutputId[]
): PersonalUseMvpCoverageMetricValuePin[] {
  const pins: PersonalUseMvpCoverageMetricValuePin[] = [];
  const push = (metric: RequestedOutputId, value: number | undefined): void => {
    if (targetOutputs.includes(metric) && typeof value === "number" && Number.isFinite(value)) {
      pins.push({ metric, value: round1(value) });
    }
  };

  push("Ln,w", impact?.LnW);
  push("DeltaLw", impact?.DeltaLw);
  push("L'n,w", impact?.LPrimeNW);
  push("L'nT,w", impact?.LPrimeNTw);
  push("L'nT,50", impact?.LPrimeNT50);

  return pins;
}

function heavyCombinedRuntimeRow(input: {
  hostileVariant: string | null;
  id: string;
  layers: readonly LayerInput[];
  valueOrBlockedReason: string;
}): PersonalUseMvpCoverageScenarioRow {
  const surface = buildHeavyConcreteCombinedImpactPredictorInputFromSurface({
    layers: input.layers,
    surface: GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
    targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
  });

  if (surface.status !== "ready_for_formula_corridor" || !surface.impactPredictorInput) {
    throw new Error(`Gate BH expected ${input.id} to be ready for the heavy combined formula corridor.`);
  }

  const result = calculateAssembly(input.layers, {
    impactPredictorInput: surface.impactPredictorInput,
    targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
  });
  const lnWBudget = result.impact?.errorBudgets?.find(
    (budget: ImpactErrorBudget) => budget.metricId === "Ln,w"
  );

  return {
    basis: "element_lab",
    currentPosture: "family_physics",
    expectedPosture: "family_physics",
    failureClass: "none",
    family: "floor_heavy_concrete_combined_upper_lower",
    hostileVariant: input.hostileVariant,
    id: input.id,
    inputCompleteness: "complete",
    nextAction: "regression_guard",
    originSupportBucket: "source_absent_heavy_concrete_combined_input_surface_formula",
    requestedMetrics: FLOOR_LAB_IMPACT_OUTPUTS,
    route: "floor",
    runtime: {
      basisId: result.impact?.basis ?? null,
      errorBudgetDb: lnWBudget?.toleranceDb ?? null,
      missingPhysicalInputs: [],
      origin: result.impact?.basis ?? null,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: result.dynamicImpactTrace?.selectionKind ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: valuePinsFromImpact(result.impact, FLOOR_LAB_IMPACT_OUTPUTS)
    },
    toleranceOrErrorBudget: "Ln,w +/-6.5 dB; DeltaLw +/-5.5 dB source_absent_formula_error_budget",
    valueOrBlockedReason: input.valueOrBlockedReason,
    visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
  };
}

function heavyCombinedBlockedRow(input: {
  failureClass: PersonalUseMvpCoverageFailureClass;
  hostileVariant: string;
  id: string;
  missingPhysicalInputs: readonly AcousticInputFieldId[];
  status: string;
  valueOrBlockedReason: string;
}): PersonalUseMvpCoverageScenarioRow {
  return {
    basis: "element_lab",
    currentPosture: "needs_input",
    expectedPosture: "needs_input",
    failureClass: input.failureClass,
    family: "floor_heavy_concrete_combined_upper_lower",
    hostileVariant: input.hostileVariant,
    id: input.id,
    inputCompleteness: input.failureClass === "hostile_input_refusal" ? "hostile" : "partial",
    nextAction: "keep_needs_input_or_unsafe_topology_boundary",
    originSupportBucket: input.status,
    requestedMetrics: FLOOR_LAB_IMPACT_OUTPUTS,
    route: "floor",
    runtime: {
      basisId: input.status,
      errorBudgetDb: null,
      missingPhysicalInputs: input.missingPhysicalInputs,
      origin: input.status,
      publicEntryPoint: "calculateAssembly",
      selectedMethod: "heavy_concrete_combined_input_surface_guard",
      supportedTargetOutputs: [],
      unsupportedTargetOutputs: FLOOR_LAB_IMPACT_OUTPUTS,
      valuePins: []
    },
    toleranceOrErrorBudget: "blocked_no_budget_surface",
    valueOrBlockedReason: input.valueOrBlockedReason,
    visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
  };
}

function buildHeavyCombinedRows(): readonly PersonalUseMvpCoverageScenarioRow[] {
  const missingLoad = buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract({
    layers: GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
    surface: {
      ...GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
      loadBasisKgM2: undefined
    },
    targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
  });
  const duplicateBase = buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract({
    layers: [
      ...GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
      {
        floorRole: "base_structure",
        materialId: "heavy_concrete",
        thicknessMm: 45
      }
    ],
    surface: GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
    targetOutputs: FLOOR_LAB_IMPACT_OUTPUTS
  });

  return [
    heavyCombinedRuntimeRow({
      hostileVariant: null,
      id: "floor.heavy_concrete_combined_input_surface.lab",
      layers: GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
      valueOrBlockedReason: "Ln,w 44.4 / DeltaLw 30.1 through Gate BD combined upper/lower corridor"
    }),
    heavyCombinedRuntimeRow({
      hostileVariant: "safe_reversed_visible_stack_with_explicit_surface_owners",
      id: "floor.heavy_concrete_combined_safe_reorder.lab",
      layers: [...GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK].reverse(),
      valueOrBlockedReason: "safe reorder remains Ln,w 44.4 / DeltaLw 30.1"
    }),
    heavyCombinedBlockedRow({
      failureClass: "correct_block",
      hostileVariant: "missing_load_basis",
      id: "floor.heavy_concrete_combined_missing_load.needs_input",
      missingPhysicalInputs: missingLoad.missingPhysicalInputs,
      status: missingLoad.status,
      valueOrBlockedReason: "Missing loadBasisKgM2 blocks combined upper/lower DeltaLw runtime"
    }),
    heavyCombinedBlockedRow({
      failureClass: "hostile_input_refusal",
      hostileVariant: "duplicate_heavy_concrete_base_structure",
      id: "floor.heavy_concrete_combined_duplicate_base.refused",
      missingPhysicalInputs: duplicateBase.missingPhysicalInputs,
      status: duplicateBase.status,
      valueOrBlockedReason: "unsafe_topology duplicate heavy-concrete base ownership refused"
    })
  ];
}

function buildBuildingBoundaryRow(): PersonalUseMvpCoverageScenarioRow {
  const result = calculateImpactOnly([], {
    impactPredictorInput: GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT,
    targetOutputs: FLOOR_BUILDING_IMPACT_OUTPUTS
  });

  return {
    basis: "building_prediction",
    currentPosture: "unsupported",
    expectedPosture: "unsupported",
    failureClass: "basis_boundary",
    family: "floor_impact_building_prediction_adapter",
    hostileVariant: "building_prediction_requested_from_lab_or_field_impact_lane",
    id: "floor.building_impact.prediction_adapter_boundary",
    inputCompleteness: "complete",
    nextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_ACTION,
    originSupportBucket: "floor_impact_building_prediction_adapter_not_owned",
    requestedMetrics: FLOOR_BUILDING_IMPACT_OUTPUTS,
    route: "floor",
    runtime: {
      basisId: result.impact?.basis ?? null,
      errorBudgetDb: null,
      missingPhysicalInputs: [],
      origin: result.impact?.basis ?? "unsupported",
      publicEntryPoint: "calculateImpactOnly",
      selectedMethod: result.dynamicImpactTrace?.selectionKind ?? null,
      supportedTargetOutputs: result.supportedTargetOutputs,
      unsupportedTargetOutputs: result.unsupportedTargetOutputs,
      valuePins: []
    },
    toleranceOrErrorBudget: "blocked_no_lab_or_field_to_building_alias",
    valueOrBlockedReason: "L'nT,w and L'nT,50 remain unsupported until building impact owners exist",
    visibleSurfaceParityTarget: IMPACT_VISIBLE_SURFACES
  };
}

function rowById(
  rows: readonly PersonalUseMvpCoverageScenarioRow[],
  id: string
): PersonalUseMvpCoverageScenarioRow {
  const row = rows.find((entry) => entry.id === id);

  if (!row) {
    throw new Error(`Gate BH expected floor-impact matrix row ${id}.`);
  }

  return row;
}

export function buildPersonalUseMvpCoverageSprintGateBHFloorImpactCoverageMatrix():
  readonly PersonalUseMvpCoverageScenarioRow[] {
  const gateAARows = buildPersonalUseMvpCoverageSprintGateAAScenarioMatrix();
  const selectedGateAARowIds = [
    "floor.heavy_concrete_floating_floor.lab",
    "floor.heavy_concrete_floating_floor_missing_load.needs_input",
    "floor.heavy_concrete_floating_floor_safe_reorder.lab",
    "floor.lightweight_steel_complete_formula.lab",
    "floor.lightweight_steel_duplicate_carrier.refused",
    "floor.lightweight_steel_formula_missing_spacing.needs_input",
    "floor.lightweight_steel_formula_wrong_family.inactive",
    "floor.lightweight_steel_exact_source_precedence.lab",
    "floor.timber_joist_impact.lab",
    "floor.timber_joist_formula_missing_dynamic_stiffness.needs_input",
    "floor.clt_mass_timber_impact.lab",
    "floor.clt_mass_timber_field_lnt50.local_guide",
    "floor.complete_field_impact_context.lprime",
    "floor.missing_field_impact_context.needs_input",
    "floor.astm_iic_aiic_boundary.unsupported",
    "floor.many_layer_stress_exact_stable"
  ] as const;
  const selectedRows = selectedGateAARowIds.map((id) => rowById(gateAARows, id));
  const firstTwoRows = selectedRows.slice(0, 3);
  const remainingRows = selectedRows.slice(3, 14);
  const tailRows = selectedRows.slice(14);

  return [
    ...firstTwoRows,
    ...buildHeavyCombinedRows(),
    ...remainingRows,
    buildBuildingBoundaryRow(),
    ...tailRows
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBHLandingContract():
  PersonalUseMvpCoverageSprintGateBHLandingContract {
  const gateBG = buildPersonalUseMvpCoverageSprintGateBGRevalidationContract();

  if (gateBG.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_LANDED_GATE) {
    throw new Error("Gate BH can only land after Gate BG selects floor-impact source-absent matrix refresh.");
  }

  return {
    apiShapeChange: false,
    evidencePromotion: false,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_LANDED_GATE,
    matrixRows: 21,
    numericRuntimeBehaviorChange: false,
    previousGateBG: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTION_STATUS
    },
    routeCardValueChange: false,
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bg_floor_impact_source_absent_coverage_matrix_refresh",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_FILE,
    selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_LABEL,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    workbenchInputBehaviorChange: false
  };
}

function countFailureClasses(
  rows: readonly PersonalUseMvpCoverageScenarioRow[]
): Readonly<Record<PersonalUseMvpCoverageFailureClass, number>> {
  return Object.fromEntries(
    FAILURE_CLASS_ORDER.map((failureClass) => [
      failureClass,
      rows.filter((row) => row.failureClass === failureClass).length
    ])
  ) as Readonly<Record<PersonalUseMvpCoverageFailureClass, number>>;
}

export function rankPersonalUseMvpCoverageSprintGateBILanes(
  matrix: readonly PersonalUseMvpCoverageScenarioRow[] =
    buildPersonalUseMvpCoverageSprintGateBHFloorImpactCoverageMatrix()
): readonly PersonalUseMvpCoverageSprintGateBILaneCandidate[] {
  const matrixIds = new Set(matrix.map((row) => row.id));
  const candidates = [
    {
      basisLeakageRisk: 7,
      blockedOrUnsupportedEvidence: 4,
      evidenceRowIds: [
        "floor.complete_field_impact_context.lprime",
        "floor.missing_field_impact_context.needs_input",
        "floor.building_impact.prediction_adapter_boundary",
        "floor.clt_mass_timber_field_lnt50.local_guide"
      ],
      id: "floor_impact_field_building_adapter_contract",
      implementationCost: 5,
      reason:
        "The refreshed floor matrix shows field and building outputs are the highest-value remaining basis boundary after lab source-absent floor lanes were stabilized.",
      score: 1.43,
      selected: true,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 7
    },
    {
      basisLeakageRisk: 8,
      blockedOrUnsupportedEvidence: 1,
      evidenceRowIds: ["floor.astm_iic_aiic_boundary.unsupported"],
      id: "astm_impact_rating_adapter_contract",
      implementationCost: 4,
      reason:
        "IIC/AIIC support is useful, but it must wait behind ISO field/building owner separation for daily consulting accuracy.",
      score: 0.79,
      selected: false,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 5
    },
    {
      basisLeakageRisk: 6,
      blockedOrUnsupportedEvidence: 1,
      evidenceRowIds: ["floor.clt_mass_timber_field_lnt50.local_guide"],
      id: "floor_impact_low_frequency_owner_contract",
      implementationCost: 4,
      reason:
        "L'nT,50 needs an explicit low-frequency owner; it should be folded into the field/building adapter contract rather than promoted alone.",
      score: 0.7,
      selected: false,
      sourceRowsRequiredForRuntimeSelection: false,
      userFrequency: 4
    },
    {
      basisLeakageRisk: 5,
      blockedOrUnsupportedEvidence: 0,
      evidenceRowIds: [
        "floor.heavy_concrete_combined_input_surface.lab",
        "floor.lightweight_steel_complete_formula.lab",
        "floor.timber_joist_impact.lab"
      ],
      id: "floor_impact_formula_retune_with_holdouts",
      implementationCost: 8,
      reason:
        "Runtime formula retune stays blocked until source-owned holdouts and paired negatives exist for the target family.",
      score: 0.21,
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 3
    },
    {
      basisLeakageRisk: 8,
      blockedOrUnsupportedEvidence: 0,
      evidenceRowIds: ["floor.lightweight_steel_exact_source_precedence.lab"],
      id: "broad_floor_source_row_crawl",
      implementationCost: 9,
      reason:
        "Broad source crawling can add exact overrides later, but the current matrix gap is basis-owner coverage for field/building impact outputs.",
      score: 0.12,
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true,
      userFrequency: 2
    }
  ] as const satisfies readonly PersonalUseMvpCoverageSprintGateBILaneCandidate[];

  for (const candidate of candidates) {
    const missing = candidate.evidenceRowIds.filter((id) => !matrixIds.has(id));
    if (missing.length > 0) {
      throw new Error(`Gate BI lane ${candidate.id} references missing Gate BH matrix rows: ${missing.join(", ")}`);
    }
  }

  return candidates;
}

export function summarizePersonalUseMvpCoverageSprintGateBH(
  rows: readonly PersonalUseMvpCoverageScenarioRow[] =
    buildPersonalUseMvpCoverageSprintGateBHFloorImpactCoverageMatrix()
): PersonalUseMvpCoverageSprintGateBHSummary {
  const rowIds = rows.map((row) => row.id);
  const missing = PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_EXPECTED_ROW_IDS.filter(
    (id) => !rowIds.includes(id)
  );

  if (missing.length > 0) {
    throw new Error(`Gate BH matrix is missing rows: ${missing.join(", ")}`);
  }

  const selected = rankPersonalUseMvpCoverageSprintGateBILanes(rows).find((candidate) => candidate.selected);

  if (!selected) {
    throw new Error("Gate BH requires one selected Gate BI lane.");
  }

  return {
    basisCoverage: orderedSubset(rows.map((row) => row.basis), BASIS_ORDER),
    correctlyBlockedRowIds: rows
      .filter((row) => row.failureClass !== "none")
      .map((row) => row.id),
    currentPostureCoverage: orderedSubset(rows.map((row) => row.currentPosture), POSTURE_ORDER),
    failureClassCounts: countFailureClasses(rows),
    heavyConcreteCombinedRowIds: GATE_BH_HEAVY_CONCRETE_COMBINED_ROW_IDS,
    matrixRowsAddedAtGateBH: 5,
    noRuntimeValueMovement: true,
    previousSelectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTION_STATUS,
    routeCoverage: ["floor"],
    rowCount: 21,
    selectedGateBILane: selected.id,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BH_SELECTION_STATUS,
    sourceAbsentValueRowIds: rows
      .filter(
        (row) =>
          row.runtime.valuePins.length > 0 &&
          row.originSupportBucket.includes("source_absent")
      )
      .map((row) => row.id)
  };
}

export const GATE_BH_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS =
  GATE_BF_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS;

export const GATE_BH_HEAVY_CONCRETE_COMBINED_REQUIRED_INPUTS =
  HEAVY_CONCRETE_COMBINED_IMPACT_INPUT_SURFACE_FIELDS;
