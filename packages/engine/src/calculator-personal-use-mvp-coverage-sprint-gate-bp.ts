import type { AcousticInputFieldId, RequestedOutputId } from "@dynecho/shared";

import {
  buildPersonalUseMvpCoverageSprintGateBOContract,
  evaluateGateBOCompleteFormulaRuntime,
  evaluateGateBOIncompleteExplicitRuntime,
  evaluateGateBOVisibleDerivedNeedsInputRuntime,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bo";
import {
  HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS
} from "./heavy-concrete-combined-impact-formula-corridor";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_LANDED_GATE =
  "gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTION_STATUS =
  "gate_bp_personal_use_mvp_reinforced_concrete_cleanup_surface_parity_landed_selected_matrix_refresh_gate_bq";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_ACTION =
  "gate_bq_personal_use_mvp_coverage_matrix_refresh_after_reinforced_concrete_cleanup_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bq-coverage-matrix-refresh-after-reinforced-concrete-cleanup-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_LABEL =
  "coverage matrix refresh after reinforced-concrete cleanup";

export type GateBPReinforcedConcreteCleanupSurfaceId =
  | "calculator_api_payload"
  | "diagnostics_dossier"
  | "impact_only_api_payload"
  | "impact_trace"
  | "markdown_report"
  | "method_dossier"
  | "output_cards"
  | "route_card"
  | "saved_replay";

export type GateBPReinforcedConcreteNeedsInputSurfaceSnapshot = {
  readonly budgetFree: true;
  readonly cardStatus: "needs_input";
  readonly id: GateBPReinforcedConcreteCleanupSurfaceId;
  readonly impactBasis: null;
  readonly missingPhysicalInputs: readonly AcousticInputFieldId[];
  readonly origin: "needs_input";
  readonly supportedTargetOutputs: readonly RequestedOutputId[];
  readonly unsupportedTargetOutputs: readonly RequestedOutputId[];
};

export type GateBPReinforcedConcreteFormulaSurfaceSnapshot = {
  readonly basis: typeof HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS;
  readonly budgetMetricIds: readonly ["Ln,w", "DeltaLw"];
  readonly cardStatus: "live";
  readonly deltaLwDb: 13.7;
  readonly deltaLwToleranceDb: 5.5;
  readonly id: GateBPReinforcedConcreteCleanupSurfaceId;
  readonly lnWDb: 58.1;
  readonly lnWToleranceDb: 6.5;
  readonly origin: "formula_corridor";
  readonly sourceAbsentNotMeasuredEvidence: true;
};

export type GateBPReinforcedConcreteBoundaryGuard = {
  readonly budgetFree: true;
  readonly id:
    | "bare_heavy_floor_existing_corridor"
    | "exact_source_precedence"
    | "field_building_non_alias"
    | "upper_only_floating_floor_existing_corridor";
  readonly reason: string;
};

export type GateBPReinforcedConcreteCleanupSurfaceParityContract = {
  readonly boundaryGuards: readonly GateBPReinforcedConcreteBoundaryGuard[];
  readonly completeFormulaSurfaces: readonly GateBPReinforcedConcreteFormulaSurfaceSnapshot[];
  readonly explicitNeedsInputSurfaces: readonly GateBPReinforcedConcreteNeedsInputSurfaceSnapshot[];
  readonly landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_LANDED_GATE;
  readonly previousGateBO: {
    readonly landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_LANDED_GATE;
    readonly selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTION_STATUS;
  };
  readonly runtimeMovedAtGateBP: false;
  readonly selectedImplementationSlice: "personal_use_mvp_coverage_sprint_after_gate_bo_reinforced_concrete_cleanup_surface_parity";
  readonly selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTION_STATUS;
  readonly visibleDerivedNeedsInputSurfaces: readonly GateBPReinforcedConcreteNeedsInputSurfaceSnapshot[];
};

export type GateBPReinforcedConcreteCleanupSurfaceParitySummary = {
  readonly landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_LANDED_GATE;
  readonly previousLandedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_LANDED_GATE;
  readonly runtimeBasis: typeof HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS;
  readonly runtimeDeltaLwDb: 13.7;
  readonly runtimeLnWDb: 58.1;
  readonly selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_FILE;
  readonly selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTION_STATUS;
  readonly surfaceParityLandedBeforeMatrixRefresh: true;
};

const SURFACE_IDS = [
  "output_cards",
  "route_card",
  "impact_trace",
  "diagnostics_dossier",
  "method_dossier",
  "saved_replay",
  "calculator_api_payload",
  "impact_only_api_payload",
  "markdown_report"
] as const satisfies readonly GateBPReinforcedConcreteCleanupSurfaceId[];

function buildExplicitNeedsInputSnapshot(
  id: GateBPReinforcedConcreteCleanupSurfaceId
): GateBPReinforcedConcreteNeedsInputSurfaceSnapshot {
  const runtime = evaluateGateBOIncompleteExplicitRuntime();

  if (
    runtime.origin !== "needs_input" ||
    runtime.basisId !== null ||
    runtime.valuePins["Ln,w"] !== null ||
    runtime.valuePins.DeltaLw !== null
  ) {
    throw new Error("Gate BP explicit needs-input surface cannot promote incomplete reinforced-concrete runtime.");
  }

  return {
    budgetFree: true,
    cardStatus: "needs_input",
    id,
    impactBasis: null,
    missingPhysicalInputs: runtime.missingPhysicalInputs,
    origin: "needs_input",
    supportedTargetOutputs: runtime.supportedTargetOutputs,
    unsupportedTargetOutputs: runtime.unsupportedTargetOutputs
  };
}

function buildVisibleDerivedNeedsInputSnapshot(
  id: GateBPReinforcedConcreteCleanupSurfaceId
): GateBPReinforcedConcreteNeedsInputSurfaceSnapshot {
  const runtime = evaluateGateBOVisibleDerivedNeedsInputRuntime();

  if (
    runtime.origin !== "needs_input" ||
    runtime.basisId !== null ||
    runtime.valuePins["Ln,w"] !== null ||
    runtime.valuePins.DeltaLw !== null
  ) {
    throw new Error("Gate BP visible-derived needs-input surface cannot promote incomplete reinforced-concrete runtime.");
  }

  return {
    budgetFree: true,
    cardStatus: "needs_input",
    id,
    impactBasis: null,
    missingPhysicalInputs: runtime.missingPhysicalInputs,
    origin: "needs_input",
    supportedTargetOutputs: runtime.supportedTargetOutputs,
    unsupportedTargetOutputs: runtime.unsupportedTargetOutputs
  };
}

function buildFormulaSnapshot(
  id: GateBPReinforcedConcreteCleanupSurfaceId
): GateBPReinforcedConcreteFormulaSurfaceSnapshot {
  const runtime = evaluateGateBOCompleteFormulaRuntime();

  if (
    runtime.origin !== "formula_corridor" ||
    runtime.basisId !== HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS ||
    runtime.valuePins["Ln,w"] !== 58.1 ||
    runtime.valuePins.DeltaLw !== 13.7
  ) {
    throw new Error("Gate BP formula surface cannot move Gate BO runtime values or basis.");
  }

  return {
    basis: HEAVY_CONCRETE_COMBINED_IMPACT_FORMULA_BASIS,
    budgetMetricIds: ["Ln,w", "DeltaLw"] as const,
    cardStatus: "live",
    deltaLwDb: runtime.valuePins.DeltaLw,
    deltaLwToleranceDb: 5.5,
    id,
    lnWDb: runtime.valuePins["Ln,w"],
    lnWToleranceDb: 6.5,
    origin: "formula_corridor",
    sourceAbsentNotMeasuredEvidence: true
  };
}

function buildBoundaryGuards(): GateBPReinforcedConcreteBoundaryGuard[] {
  return [
    {
      budgetFree: true,
      id: "exact_source_precedence",
      reason: "Exact floor-system rows keep their measured source basis before the Gate BO formula corridor."
    },
    {
      budgetFree: true,
      id: "bare_heavy_floor_existing_corridor",
      reason: "Bare reinforced-concrete floors keep the existing bare heavy-floor formula instead of inheriting combined upper/lower budgets."
    },
    {
      budgetFree: true,
      id: "upper_only_floating_floor_existing_corridor",
      reason: "Upper-only floating-floor formulas keep their existing dry floating-floor lane and are not relabelled as combined upper/lower."
    },
    {
      budgetFree: true,
      id: "field_building_non_alias",
      reason: "Lab Ln,w and DeltaLw budgets cannot alias to L'n,w, L'nT,w, R'w, DnT,w, or building-prediction outputs."
    }
  ];
}

export function buildPersonalUseMvpCoverageSprintGateBPContract():
  GateBPReinforcedConcreteCleanupSurfaceParityContract {
  const gateBO = buildPersonalUseMvpCoverageSprintGateBOContract();
  if (gateBO.selectedNextAction !== PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_LANDED_GATE) {
    throw new Error("Gate BP can only land after Gate BO selects reinforced-concrete cleanup surface parity.");
  }

  return {
    boundaryGuards: buildBoundaryGuards(),
    completeFormulaSurfaces: SURFACE_IDS.map((id) => buildFormulaSnapshot(id)),
    explicitNeedsInputSurfaces: SURFACE_IDS.map((id) => buildExplicitNeedsInputSnapshot(id)),
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_LANDED_GATE,
    previousGateBO: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BO_SELECTION_STATUS
    },
    runtimeMovedAtGateBP: false,
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bo_reinforced_concrete_cleanup_surface_parity",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_FILE,
    selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTED_NEXT_LABEL,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BP_SELECTION_STATUS,
    visibleDerivedNeedsInputSurfaces: SURFACE_IDS.map((id) => buildVisibleDerivedNeedsInputSnapshot(id))
  };
}

export function summarizePersonalUseMvpCoverageSprintGateBP():
  GateBPReinforcedConcreteCleanupSurfaceParitySummary {
  const contract = buildPersonalUseMvpCoverageSprintGateBPContract();
  const firstRuntime = contract.completeFormulaSurfaces[0];

  if (!firstRuntime) {
    throw new Error("Gate BP expected at least one complete formula surface snapshot.");
  }

  return {
    landedGate: contract.landedGate,
    previousLandedGate: contract.previousGateBO.landedGate,
    runtimeBasis: firstRuntime.basis,
    runtimeDeltaLwDb: firstRuntime.deltaLwDb,
    runtimeLnWDb: firstRuntime.lnWDb,
    selectedNextAction: contract.selectedNextAction,
    selectedNextFile: contract.selectedNextFile,
    selectionStatus: contract.selectionStatus,
    surfaceParityLandedBeforeMatrixRefresh: true
  };
}
