import type { ImpactCalculation } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
  GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS,
  GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTION_STATUS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bl";
import {
  buildPersonalUseMvpCoverageSprintGateBJScenarioPack,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bj";
import {
  buildPersonalUseMvpCoverageSprintGateBKScenarioPack,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_LANDED_GATE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bk";
import {
  buildPersonalUseMvpCoverageSprintGateBGRevalidationContract,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_LANDED_GATE
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bg";
import { buildSteelFloorFormulaPredictorInputFromSurface } from "./steel-floor-formula-input-surface";
import {
  buildGateADSteelFloorImpactFormulaScenarioPack,
  STEEL_FLOOR_FORMULA_BASIS,
  STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS,
  STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB
} from "./steel-floor-impact-formula-corridor";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_LANDED_GATE =
  "gate_bm_personal_use_mvp_post_steel_suspended_ceiling_input_surface_revalidation_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTION_STATUS =
  "gate_bm_personal_use_mvp_post_steel_suspended_ceiling_input_surface_revalidation_landed_no_runtime_selected_matrix_refresh_gate_bn";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_ACTION =
  "gate_bn_personal_use_mvp_coverage_matrix_refresh_after_steel_suspended_ceiling_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bn-coverage-matrix-refresh-after-steel-suspended-ceiling-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_LABEL =
  "coverage matrix refresh after steel suspended-ceiling";

export type PersonalUseMvpCoverageSprintGateBMRuntimePin = {
  basis: ImpactCalculation["basis"] | null;
  deltaLw: number | null;
  lnW: number | null;
  supportedTargetOutputs: readonly string[];
  toleranceDb: number | null;
  unsupportedTargetOutputs: readonly string[];
};

export type PersonalUseMvpCoverageSprintGateBMContract = {
  apiShapeChange: false;
  evidencePromotion: false;
  fieldBuildingAdapterMoved: false;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_LANDED_GATE;
  labFieldBuildingAliasAdded: false;
  numericRuntimeBehaviorChange: false;
  previousGateBL: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_LANDED_GATE;
    selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_FILE;
    selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTION_STATUS;
  };
  revalidatedAdjacentFloorImpactSourceAbsentLane: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_LANDED_GATE;
    lnW: 44.4;
    deltaLw: 30.1;
  };
  revalidatedFieldBuildingGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE;
  revalidatedGateADUpperLowerRuntime: PersonalUseMvpCoverageSprintGateBMRuntimePin;
  revalidatedGateBKExactSourcePrecedence: true;
  revalidatedGateBKSuspendedCeilingRuntime: PersonalUseMvpCoverageSprintGateBMRuntimePin;
  revalidatedGateBKSuspendedCeilingSurfaceRuntime: PersonalUseMvpCoverageSprintGateBMRuntimePin;
  revalidatedPreviousSteelGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_LANDED_GATE;
  routeCardValueChange: false;
  selectedImplementationSlice: "personal_use_mvp_coverage_sprint_after_gate_bl_post_steel_suspended_ceiling_input_surface_revalidation";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_LABEL;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  workbenchInputBehaviorChange: false;
};

function runtimePinFromImpact(
  impact: ImpactCalculation | null | undefined,
  supportedTargetOutputs: readonly string[],
  unsupportedTargetOutputs: readonly string[]
): PersonalUseMvpCoverageSprintGateBMRuntimePin {
  const lnWBudget = impact?.errorBudgets?.find((budget) => budget.metricId === "Ln,w");

  return {
    basis: impact?.basis ?? null,
    deltaLw: typeof impact?.DeltaLw === "number" ? impact.DeltaLw : null,
    lnW: typeof impact?.LnW === "number" ? impact.LnW : null,
    supportedTargetOutputs,
    toleranceDb: lnWBudget?.toleranceDb ?? null,
    unsupportedTargetOutputs
  };
}

function buildSuspendedCeilingSurfaceRuntimePin(): PersonalUseMvpCoverageSprintGateBMRuntimePin {
  const surface = buildSteelFloorFormulaPredictorInputFromSurface({
    layers: GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS,
    surface: GATE_BL_COMPLETE_STEEL_SUSPENDED_CEILING_SURFACE,
    targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
  });
  const result = calculateAssembly(GATE_BL_STEEL_SUSPENDED_CEILING_UI_ROWS, {
    impactPredictorInput: surface.impactPredictorInput,
    targetOutputs: GATE_BL_STEEL_SUSPENDED_CEILING_TARGET_OUTPUTS
  });

  return runtimePinFromImpact(result.impact, result.supportedTargetOutputs, result.unsupportedTargetOutputs);
}

export function buildPersonalUseMvpCoverageSprintGateBMRevalidationContract():
  PersonalUseMvpCoverageSprintGateBMContract {
  const gateBKSuspended = buildPersonalUseMvpCoverageSprintGateBKScenarioPack().find(
    (scenario) => scenario.id === "gate_bk_complete_suspended_ceiling_steel_formula_corridor"
  );
  const gateBKExact = buildPersonalUseMvpCoverageSprintGateBKScenarioPack().find(
    (scenario) => scenario.id === "gate_bk_exact_source_precedence_stays_first"
  );
  const gateADImpact = buildGateADSteelFloorImpactFormulaScenarioPack()[0]?.contract.impact ?? null;
  const gateBG = buildPersonalUseMvpCoverageSprintGateBGRevalidationContract();
  const gateBJRows = buildPersonalUseMvpCoverageSprintGateBJScenarioPack();
  const gateBJField = gateBJRows.find((scenario) => scenario.id === "gate_bj_complete_field_volume_runtime_corridor");
  const gateBJBuilding = gateBJRows.find(
    (scenario) => scenario.id === "gate_bj_complete_building_direct_flanking_runtime_corridor"
  );

  if (!gateBKSuspended || !gateBKExact || !gateBJField || !gateBJBuilding) {
    throw new Error("Gate BM revalidation could not find the required upstream steel/field scenario rows.");
  }

  if (gateBKSuspended.basisId !== STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_BASIS) {
    throw new Error("Gate BM cannot close if the Gate BK suspended-ceiling basis moved.");
  }

  if (gateADImpact?.basis !== STEEL_FLOOR_FORMULA_BASIS) {
    throw new Error("Gate BM cannot close if the Gate AD upper/lower steel basis moved.");
  }

  if (gateBKExact.basisId !== "official_floor_system_exact_match") {
    throw new Error("Gate BM cannot close if exact floor-system source precedence moved.");
  }

  if (gateBG.revalidatedRuntimeImpact?.LnW !== 44.4 || gateBG.revalidatedRuntimeImpact?.DeltaLw !== 30.1) {
    throw new Error("Gate BM cannot close if the adjacent heavy-concrete source-absent lane moved.");
  }

  return {
    apiShapeChange: false,
    evidencePromotion: false,
    fieldBuildingAdapterMoved: false,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_LANDED_GATE,
    labFieldBuildingAliasAdded: false,
    numericRuntimeBehaviorChange: false,
    previousGateBL: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BL_SELECTION_STATUS
    },
    revalidatedAdjacentFloorImpactSourceAbsentLane: {
      deltaLw: 30.1,
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_LANDED_GATE,
      lnW: 44.4
    },
    revalidatedFieldBuildingGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BJ_LANDED_GATE,
    revalidatedGateADUpperLowerRuntime: runtimePinFromImpact(gateADImpact, ["Ln,w", "DeltaLw"], []),
    revalidatedGateBKExactSourcePrecedence: true,
    revalidatedGateBKSuspendedCeilingRuntime: {
      basis: gateBKSuspended.basisId,
      deltaLw: null,
      lnW: gateBKSuspended.valuePins.find((pin) => pin.metric === "Ln,w")?.value ?? null,
      supportedTargetOutputs: gateBKSuspended.supportedTargetOutputs,
      toleranceDb: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB,
      unsupportedTargetOutputs: gateBKSuspended.unsupportedTargetOutputs
    },
    revalidatedGateBKSuspendedCeilingSurfaceRuntime: buildSuspendedCeilingSurfaceRuntimePin(),
    revalidatedPreviousSteelGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BK_LANDED_GATE,
    routeCardValueChange: false,
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bl_post_steel_suspended_ceiling_input_surface_revalidation",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_FILE,
    selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTED_NEXT_LABEL,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BM_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    workbenchInputBehaviorChange: false
  };
}

export const GATE_BM_STEEL_TOLERANCE_PINS = {
  gateADDeltaLw: STEEL_FLOOR_FORMULA_DELTA_LW_TOLERANCE_DB,
  gateADLnW: STEEL_FLOOR_FORMULA_LN_W_TOLERANCE_DB,
  gateBKSuspendedCeilingLnW: STEEL_FLOOR_SUSPENDED_CEILING_FORMULA_LN_W_TOLERANCE_DB
} as const;
