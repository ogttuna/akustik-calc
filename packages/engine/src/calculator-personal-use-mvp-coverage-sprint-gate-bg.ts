import type { ImpactCalculation } from "@dynecho/shared";

import {
  buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract,
  GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
  GATE_BF_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS,
  GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_LANDED_GATE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_ACTION,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_FILE,
  PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTION_STATUS
} from "./heavy-concrete-combined-impact-input-surface";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_LANDED_GATE =
  "gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTION_STATUS =
  "gate_bg_personal_use_mvp_floor_impact_source_absent_post_input_surface_revalidation_landed_no_runtime_selected_coverage_matrix_refresh_gate_bh";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_ACTION =
  "gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bh-floor-impact-source-absent-coverage-matrix-refresh-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_LABEL =
  "floor-impact source-absent coverage matrix refresh";

export const GATE_BG_REVALIDATED_OUTPUTS = ["Ln,w", "DeltaLw"] as const;

export type PersonalUseMvpCoverageSprintGateBGRevalidationContract = {
  apiShapeChange: false;
  evidencePromotion: false;
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_LANDED_GATE;
  numericRuntimeBehaviorChange: false;
  previousGateBF: {
    landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_LANDED_GATE;
    selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_ACTION;
    selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_FILE;
    selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTION_STATUS;
  };
  revalidatedRuntimeImpact: ImpactCalculation | null;
  revalidatedRuntimeBasis: typeof GATE_BF_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS;
  routeCardValueChange: false;
  selectedImplementationSlice: "personal_use_mvp_coverage_sprint_after_gate_bf_floor_impact_source_absent_post_input_surface_revalidation";
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_LABEL;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTION_STATUS;
  sourceRowsRequiredForRuntimeSelection: false;
  workbenchInputBehaviorChange: false;
};

export function buildPersonalUseMvpCoverageSprintGateBGRevalidationContract():
  PersonalUseMvpCoverageSprintGateBGRevalidationContract {
  const gateBF = buildGateBFHeavyConcreteCombinedImpactInputSurfaceContract({
    layers: GATE_BF_HEAVY_CONCRETE_COMBINED_VISIBLE_STACK,
    surface: GATE_BF_HEAVY_CONCRETE_COMBINED_INPUT_SURFACE,
    targetOutputs: GATE_BG_REVALIDATED_OUTPUTS
  });

  return {
    apiShapeChange: false,
    evidencePromotion: false,
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_LANDED_GATE,
    numericRuntimeBehaviorChange: false,
    previousGateBF: {
      landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_LANDED_GATE,
      selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_ACTION,
      selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTED_NEXT_FILE,
      selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BF_SELECTION_STATUS
    },
    revalidatedRuntimeBasis: GATE_BF_HEAVY_CONCRETE_COMBINED_RUNTIME_BASIS,
    revalidatedRuntimeImpact: gateBF.runtimeFormulaImpact,
    routeCardValueChange: false,
    selectedImplementationSlice:
      "personal_use_mvp_coverage_sprint_after_gate_bf_floor_impact_source_absent_post_input_surface_revalidation",
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_FILE,
    selectedNextLabel: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTED_NEXT_LABEL,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_BG_SELECTION_STATUS,
    sourceRowsRequiredForRuntimeSelection: false,
    workbenchInputBehaviorChange: false
  };
}
