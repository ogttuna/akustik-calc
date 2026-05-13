import type {
  ImpactErrorBudget,
  ImpactOnlyCalculation,
  ImpactPredictorInput,
  RequestedOutputId
} from "@dynecho/shared";

import { calculateImpactOnly } from "./calculate-impact-only";
import {
  GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT,
  GATE_BA_MISSING_LOAD_OWNER_PROBE_INPUT
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ba";
import {
  buildPersonalUseMvpCoverageSprintGateBCFormulaCorridorContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_FORMULA_BASIS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bc";
import {
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB,
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB
} from "./heavy-concrete-combined-impact-formula-corridor";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE =
  "gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTION_STATUS =
  "gate_bd_personal_use_mvp_floor_impact_source_absent_runtime_corridor_landed_selected_surface_parity_gate_be";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_ACTION =
  "gate_be_personal_use_mvp_floor_impact_source_absent_surface_parity_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-be-floor-impact-source-absent-surface-parity-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS =
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS;

export const GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT = {
  ...GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT,
  impactSystemType: "combined_upper_lower_system",
  loadBasisKgM2: 100,
  lowerTreatment: {
    boardLayerCount: 2,
    boardMaterialClass: "gypsum_board",
    boardThicknessMm: 12.5,
    cavityDepthMm: 120,
    cavityFillThicknessMm: 80,
    supportClass: "furred_channels",
    type: "suspended_ceiling_elastic_hanger"
  }
} as const satisfies ImpactPredictorInput;

const GATE_BD_MISSING_LOWER_TREATMENT_INPUT = {
  ...GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT,
  lowerTreatment: undefined
} as const satisfies ImpactPredictorInput;

const GATE_BD_MISSING_DYNAMIC_STIFFNESS_INPUT = {
  ...GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT,
  resilientLayer: {
    thicknessMm: 8
  }
} as const satisfies ImpactPredictorInput;

const LAB_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

export type PersonalUseMvpCoverageSprintGateBDBoundaryId =
  | "astm_basis_non_alias"
  | "exact_source_precedence"
  | "heavy_floating_existing_corridor_preserved"
  | "missing_dynamic_stiffness_blocks_runtime"
  | "missing_load_published_anchor_preserved"
  | "missing_lower_treatment_blocks_runtime";

export type PersonalUseMvpCoverageSprintGateBDBoundarySnapshot = {
  readonly budgetMetricIds: readonly string[];
  readonly deltaLwDb: number | null;
  readonly id: PersonalUseMvpCoverageSprintGateBDBoundaryId;
  readonly impactBasis: string | null;
  readonly lnWDb: number | null;
  readonly supportedTargetOutputs: readonly RequestedOutputId[];
  readonly unsupportedTargetOutputs: readonly RequestedOutputId[];
};

export type PersonalUseMvpCoverageSprintGateBDRuntimeCandidate = {
  readonly availableOutputs: readonly RequestedOutputId[];
  readonly budgetMetricIds: readonly string[];
  readonly deltaLwDb: number;
  readonly deltaLwToleranceDb: typeof HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB;
  readonly errorBudgets: readonly ImpactErrorBudget[];
  readonly exactMeasuredRowsRemainPrecedence: true;
  readonly labOrField: "lab";
  readonly lnWDb: number;
  readonly lnWToleranceDb: typeof HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB;
  readonly metricBasis: {
    readonly DeltaLw: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS;
    readonly LnW: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS;
  };
  readonly runtimeBasis: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS;
  readonly sourceAbsentNotMeasuredEvidence: true;
};

export type PersonalUseMvpCoverageSprintGateBDRuntimeCorridorContract = {
  readonly boundarySnapshots: readonly PersonalUseMvpCoverageSprintGateBDBoundarySnapshot[];
  readonly gateBCFormulaBasis: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_FORMULA_BASIS;
  readonly landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE;
  readonly previousGateBC: {
    readonly landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE;
    readonly selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTION_STATUS;
  };
  readonly previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE;
  readonly runtimeCandidate: PersonalUseMvpCoverageSprintGateBDRuntimeCandidate;
  readonly runtimeValueMovement: true;
  readonly selectedImplementationSlice: "personal_use_mvp_coverage_sprint_after_gate_bd_floor_impact_source_absent_runtime_corridor";
  readonly selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_FILE;
  readonly selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTION_STATUS;
  readonly sourceRowsRequiredForRuntimeSelection: false;
};

export type PersonalUseMvpCoverageSprintGateBESurfaceParityLaneCandidate = {
  readonly broadSourceCrawl: boolean;
  readonly id:
    | "astm_impact_adapter"
    | "broad_floor_source_row_crawl"
    | "floor_impact_field_building_adapter"
    | "floor_impact_source_absent_input_surface"
    | "floor_impact_source_absent_surface_parity"
    | "floor_impact_source_absent_tolerance_retune";
  readonly reason: string;
  readonly runtimeMovementAllowedAtGateBD: boolean;
  readonly score: number;
  readonly selected: boolean;
  readonly sourceRowsRequiredForSelection: boolean;
};

export type PersonalUseMvpCoverageSprintGateBDSummary = {
  readonly landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE;
  readonly previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE;
  readonly runtimeBasis: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS;
  readonly runtimeDeltaLwDb: number;
  readonly runtimeLnWDb: number;
  readonly selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_FILE;
  readonly selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTION_STATUS;
  readonly surfaceParitySelectedBeforeInputSurfaceOrSourceCrawl: true;
};

const NEXT_LANE_CANDIDATES = [
  {
    broadSourceCrawl: false,
    id: "floor_impact_source_absent_surface_parity",
    reason:
      "Gate BD moved lab Ln,w and DeltaLw runtime, so the next bounded step is visible card/report/API parity for the new source-absent budgeted corridor.",
    runtimeMovementAllowedAtGateBD: false,
    score: 1.52,
    selected: true,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "floor_impact_source_absent_input_surface",
    reason:
      "First-class Dynamic Calculator controls should follow surface parity so the new runtime basis is already visible and reportable.",
    runtimeMovementAllowedAtGateBD: false,
    score: 1.08,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "floor_impact_field_building_adapter",
    reason: "Impact field/building adapters still need separate basis owners and must not borrow the new lab corridor.",
    runtimeMovementAllowedAtGateBD: false,
    score: 0.74,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "astm_impact_adapter",
    reason: "ASTM IIC/AIIC needs its own rating adapter and cannot alias ISO lab Ln,w or DeltaLw.",
    runtimeMovementAllowedAtGateBD: false,
    score: 0.58,
    selected: false,
    sourceRowsRequiredForSelection: false
  },
  {
    broadSourceCrawl: false,
    id: "floor_impact_source_absent_tolerance_retune",
    reason: "Tolerance retune remains blocked until source-owned combined upper/lower holdouts and paired negatives exist.",
    runtimeMovementAllowedAtGateBD: false,
    score: 0.36,
    selected: false,
    sourceRowsRequiredForSelection: true
  },
  {
    broadSourceCrawl: true,
    id: "broad_floor_source_row_crawl",
    reason:
      "Broad source crawling can add exact rows later, but it does not make the new runtime budget visible or safer for internal use.",
    runtimeMovementAllowedAtGateBD: false,
    score: 0.16,
    selected: false,
    sourceRowsRequiredForSelection: true
  }
] as const satisfies readonly PersonalUseMvpCoverageSprintGateBESurfaceParityLaneCandidate[];

function runImpact(input: ImpactPredictorInput, targetOutputs: readonly RequestedOutputId[] = LAB_OUTPUTS):
  ImpactOnlyCalculation {
  return calculateImpactOnly([], {
    impactPredictorInput: input,
    targetOutputs
  });
}

function snapshot(
  id: PersonalUseMvpCoverageSprintGateBDBoundaryId,
  calculation: ImpactOnlyCalculation
): PersonalUseMvpCoverageSprintGateBDBoundarySnapshot {
  return {
    budgetMetricIds: (calculation.impact?.errorBudgets ?? []).map((budget: ImpactErrorBudget) => budget.metricId),
    deltaLwDb: calculation.impact?.DeltaLw ?? null,
    id,
    impactBasis: calculation.impact?.basis ?? calculation.lowerBoundImpact?.basis ?? null,
    lnWDb: calculation.impact?.LnW ?? null,
    supportedTargetOutputs: calculation.supportedTargetOutputs,
    unsupportedTargetOutputs: calculation.unsupportedTargetOutputs
  };
}

function buildRuntimeCandidate(calculation: ImpactOnlyCalculation): PersonalUseMvpCoverageSprintGateBDRuntimeCandidate {
  const impact = calculation.impact;

  if (
    !impact ||
    impact.basis !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS ||
    typeof impact.LnW !== "number" ||
    typeof impact.DeltaLw !== "number"
  ) {
    throw new Error("Gate BD runtime candidate did not resolve to the combined upper/lower formula corridor.");
  }

  return {
    availableOutputs: impact.availableOutputs,
    budgetMetricIds: (impact.errorBudgets ?? []).map((budget: ImpactErrorBudget) => budget.metricId),
    deltaLwDb: impact.DeltaLw,
    deltaLwToleranceDb: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_DELTA_LW_TOLERANCE_DB,
    errorBudgets: impact.errorBudgets ?? [],
    exactMeasuredRowsRemainPrecedence: true,
    labOrField: "lab",
    lnWDb: impact.LnW,
    lnWToleranceDb: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_LN_W_TOLERANCE_DB,
    metricBasis: {
      DeltaLw: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS,
      LnW: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_RUNTIME_BASIS
    },
    runtimeBasis: impact.basis,
    sourceAbsentNotMeasuredEvidence: true
  };
}

export function rankPersonalUseMvpCoverageSprintGateBENextLanes():
  readonly PersonalUseMvpCoverageSprintGateBESurfaceParityLaneCandidate[] {
  return NEXT_LANE_CANDIDATES;
}

export function buildPersonalUseMvpCoverageSprintGateBDRuntimeCorridorContract():
  PersonalUseMvpCoverageSprintGateBDRuntimeCorridorContract {
  const gateBC = buildPersonalUseMvpCoverageSprintGateBCFormulaCorridorContract();
  if (gateBC.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE) {
    throw new Error("Gate BD can only land after Gate BC selects the runtime corridor.");
  }

  const runtime = runImpact(GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT);

  return {
    boundarySnapshots: [
      snapshot(
        "exact_source_precedence",
        calculateImpactOnly([], {
          officialFloorSystemId: "ubiq_fl28_open_web_steel_300_exact_lab_2026",
          targetOutputs: LAB_OUTPUTS
        })
      ),
      snapshot(
        "heavy_floating_existing_corridor_preserved",
        calculateImpactOnly([], {
          impactPredictorInput: GATE_BA_HEAVY_CONCRETE_FORMULA_PROBE_INPUT,
          targetOutputs: LAB_OUTPUTS
        })
      ),
      snapshot(
        "missing_load_published_anchor_preserved",
        calculateImpactOnly([], {
          impactPredictorInput: GATE_BA_MISSING_LOAD_OWNER_PROBE_INPUT,
          targetOutputs: LAB_OUTPUTS
        })
      ),
      snapshot("missing_lower_treatment_blocks_runtime", runImpact(GATE_BD_MISSING_LOWER_TREATMENT_INPUT)),
      snapshot("missing_dynamic_stiffness_blocks_runtime", runImpact(GATE_BD_MISSING_DYNAMIC_STIFFNESS_INPUT)),
      snapshot("astm_basis_non_alias", runImpact(GATE_BD_HEAVY_CONCRETE_COMBINED_RUNTIME_INPUT, ["IIC", "AIIC"]))
    ],
    gateBCFormulaBasis: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_FORMULA_BASIS,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE,
    previousGateBC: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_SELECTION_STATUS
    },
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE,
    runtimeCandidate: buildRuntimeCandidate(runtime),
    runtimeValueMovement: true,
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bd_floor_impact_source_absent_runtime_corridor",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false
  };
}

export function summarizePersonalUseMvpCoverageSprintGateBD(): PersonalUseMvpCoverageSprintGateBDSummary {
  const contract = buildPersonalUseMvpCoverageSprintGateBDRuntimeCorridorContract();
  const selected = rankPersonalUseMvpCoverageSprintGateBENextLanes().find((candidate) => candidate.selected);

  if (selected?.id !== "floor_impact_source_absent_surface_parity") {
    throw new Error("Gate BD next-lane ranking drifted from Gate BE surface parity.");
  }

  return {
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_LANDED_GATE,
    previousLandedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BC_LANDED_GATE,
    runtimeBasis: contract.runtimeCandidate.runtimeBasis,
    runtimeDeltaLwDb: contract.runtimeCandidate.deltaLwDb,
    runtimeLnWDb: contract.runtimeCandidate.lnWDb,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BD_SELECTION_STATUS,
    surfaceParitySelectedBeforeInputSurfaceOrSourceCrawl: true
  };
}
