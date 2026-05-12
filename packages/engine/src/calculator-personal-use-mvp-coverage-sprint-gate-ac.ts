import type { PersonalUseMvpCoverageVisibleSurface } from "./calculator-personal-use-mvp-coverage-sprint";
import {
  GATE_AB_COMPLETE_TOPOLOGY_OWNER_FIELDS,
  GATE_AB_WALL_LAB_OUTPUTS
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ab";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_LANDED_GATE =
  "gate_ac_personal_use_mvp_flat_multicavity_topology_surface_parity_plan";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTION_STATUS =
  "gate_ac_personal_use_mvp_flat_multicavity_topology_surface_parity_landed_selected_broad_revalidation_gate_ad";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTED_NEXT_FILE =
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ad-flat-multicavity-broad-revalidation-and-internal-pilot-rehearsal-contract.test.ts";

export const PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTED_NEXT_ACTION =
  "gate_ad_personal_use_mvp_flat_multicavity_broad_revalidation_and_internal_pilot_rehearsal_plan";

export const GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL =
  "Wall multicavity topology owner set";

export const GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_FILE =
  "apps/web/features/workbench/flat-multicavity-topology-surface.ts";

export const GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_PARITY_FILE =
  "apps/web/features/workbench/flat-multicavity-topology-surface-parity.test.ts";

export const GATE_AC_SURFACE_PARITY_TARGETS = [
  "workbench_card",
  "saved_replay",
  "calculator_api",
  "markdown_report"
] as const satisfies readonly PersonalUseMvpCoverageVisibleSurface[];

export const GATE_AC_FLAT_MULTICAVITY_UI_OWNER_FIELDS = [
  ...GATE_AB_COMPLETE_TOPOLOGY_OWNER_FIELDS
] as const;

export const GATE_AC_WALL_LAB_OUTPUTS = [...GATE_AB_WALL_LAB_OUTPUTS] as const;

export type PersonalUseMvpCoverageSprintGateACSummary = {
  landedGate: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_LANDED_GATE;
  noRuntimeValueMovement: true;
  selectedNextAction: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTED_NEXT_FILE;
  selectionStatus: typeof PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTION_STATUS;
  surfaceLabel: typeof GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL;
  surfaceParityTargets: typeof GATE_AC_SURFACE_PARITY_TARGETS;
  topologyOwnerFields: typeof GATE_AC_FLAT_MULTICAVITY_UI_OWNER_FIELDS;
};

export function summarizePersonalUseMvpCoverageSprintGateAC(): PersonalUseMvpCoverageSprintGateACSummary {
  return {
    landedGate: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_LANDED_GATE,
    noRuntimeValueMovement: true,
    selectedNextAction: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTED_NEXT_ACTION,
    selectedNextFile: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTED_NEXT_FILE,
    selectionStatus: PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AC_SELECTION_STATUS,
    surfaceLabel: GATE_AC_FLAT_MULTICAVITY_TOPOLOGY_SURFACE_LABEL,
    surfaceParityTargets: GATE_AC_SURFACE_PARITY_TARGETS,
    topologyOwnerFields: GATE_AC_FLAT_MULTICAVITY_UI_OWNER_FIELDS
  };
}
