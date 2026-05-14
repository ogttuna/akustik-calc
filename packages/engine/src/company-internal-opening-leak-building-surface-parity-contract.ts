import type { RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTION_STATUS,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID,
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
} from "./company-internal-opening-leak-building-runtime-corridor";
import {
  COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_TARGET_OUTPUTS,
  COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT,
  COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT,
  COMPANY_INTERNAL_OPENING_LEAK_FIELD_BUILDING_RUNTIME_TARGET_OUTPUTS
} from "./company-internal-opening-leak-building-runtime-corridor-contract";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_LANDED_GATE =
  "company_internal_opening_leak_building_surface_parity_plan";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTION_STATUS =
  "company_internal_opening_leak_building_surface_parity_landed_selected_input_surface";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "company_internal_opening_leak_building_input_surface_plan";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "apps/web/features/workbench/company-internal-opening-leak-building-input-surface.test.ts";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_LABEL =
  "opening/leak field/building input surface";

export const COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  ...COMPANY_INTERNAL_OPENING_LEAK_FIELD_BUILDING_RUNTIME_TARGET_OUTPUTS,
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

type CompanyInternalOpeningLeakSurfaceRuntimeSnapshot = {
  basisId: string | null;
  candidateId: string | null;
  dntw: number | null;
  dnw: number | null;
  errorBudgetDb: number | null;
  rw: number | null;
  rwPrime: number | null;
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
};

export type CompanyInternalOpeningLeakBuildingSurfaceParityContract = {
  apiSurfaceParityRequired: true;
  cardReportSurfaceParityRequired: true;
  fieldSnapshot: CompanyInternalOpeningLeakSurfaceRuntimeSnapshot;
  buildingSnapshot: CompanyInternalOpeningLeakSurfaceRuntimeSnapshot;
  landedGate: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_LANDED_GATE;
  previousRuntimeLandedGate: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_LANDED_GATE;
  previousRuntimeSelectedNextAction: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION;
  previousRuntimeSelectedNextFile: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE;
  previousRuntimeSelectionStatus: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTION_STATUS;
  runtimeMovedAtSurfaceParity: false;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTION_STATUS;
  visibleSurfaceTargets: readonly [
    "output_cards",
    "route_posture",
    "scenario_summary",
    "corridor_dossier",
    "method_dossier",
    "local_saved_replay",
    "calculator_api_payload",
    "markdown_report"
  ];
};

function numberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value * 10) / 10 : null;
}

function buildSnapshot(input: {
  airborneContext: typeof COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT |
    typeof COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT;
  targetOutputs: readonly RequestedOutputId[];
}): CompanyInternalOpeningLeakSurfaceRuntimeSnapshot {
  const result = calculateAssembly([
    { materialId: "gypsum_board", thicknessMm: 12.5 },
    { materialId: "air_gap", thicknessMm: 40 },
    { materialId: "rockwool", thicknessMm: 40 },
    { materialId: "concrete", thicknessMm: 160 }
  ], {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.targetOutputs
  });

  return {
    basisId: result.airborneBasis?.method ?? null,
    candidateId: result.airborneCandidateResolution?.selectedCandidateId ?? null,
    dntw: numberOrNull(result.metrics.estimatedDnTwDb),
    dnw: numberOrNull(result.metrics.estimatedDnWDb),
    errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
    rw: numberOrNull(result.metrics.estimatedRwDb),
    rwPrime: numberOrNull(result.metrics.estimatedRwPrimeDb),
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

export function buildCompanyInternalOpeningLeakBuildingSurfaceParityContract():
  CompanyInternalOpeningLeakBuildingSurfaceParityContract {
  return {
    apiSurfaceParityRequired: true,
    buildingSnapshot: buildSnapshot({
      airborneContext: COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_BUILDING_CONTEXT,
      targetOutputs: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_TARGET_OUTPUTS
    }),
    cardReportSurfaceParityRequired: true,
    fieldSnapshot: buildSnapshot({
      airborneContext: COMPANY_INTERNAL_OPENING_LEAK_RUNTIME_FIELD_CONTEXT,
      targetOutputs: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_TARGET_OUTPUTS
    }),
    landedGate: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_LANDED_GATE,
    previousRuntimeLandedGate: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_LANDED_GATE,
    previousRuntimeSelectedNextAction:
      COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
    previousRuntimeSelectedNextFile:
      COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
    previousRuntimeSelectionStatus:
      COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_CORRIDOR_SELECTION_STATUS,
    runtimeMovedAtSurfaceParity: false,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_FILE,
    selectedNextLabel: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SURFACE_PARITY_SELECTION_STATUS,
    visibleSurfaceTargets: [
      "output_cards",
      "route_posture",
      "scenario_summary",
      "corridor_dossier",
      "method_dossier",
      "local_saved_replay",
      "calculator_api_payload",
      "markdown_report"
    ]
  };
}

export function assertCompanyInternalOpeningLeakBuildingSurfaceParityContract(
  contract: CompanyInternalOpeningLeakBuildingSurfaceParityContract =
    buildCompanyInternalOpeningLeakBuildingSurfaceParityContract()
): void {
  if (
    contract.fieldSnapshot.basisId !== COMPANY_INTERNAL_OPENING_LEAK_FIELD_RUNTIME_METHOD ||
    contract.fieldSnapshot.candidateId !== COMPANY_INTERNAL_OPENING_LEAK_FIELD_SELECTED_CANDIDATE_ID ||
    contract.fieldSnapshot.rw !== 38.2 ||
    contract.fieldSnapshot.rwPrime !== 36.4 ||
    contract.fieldSnapshot.dnw !== 36.7 ||
    contract.fieldSnapshot.dntw !== 36.9 ||
    contract.fieldSnapshot.errorBudgetDb !== COMPANY_INTERNAL_OPENING_LEAK_FIELD_TOLERANCE_DB
  ) {
    throw new Error("Opening/leak field surface parity moved the runtime field values or basis.");
  }

  if (
    contract.buildingSnapshot.basisId !== COMPANY_INTERNAL_OPENING_LEAK_BUILDING_RUNTIME_METHOD ||
    contract.buildingSnapshot.candidateId !== COMPANY_INTERNAL_OPENING_LEAK_BUILDING_SELECTED_CANDIDATE_ID ||
    contract.buildingSnapshot.rw !== 38.2 ||
    contract.buildingSnapshot.rwPrime !== 31.6 ||
    contract.buildingSnapshot.dntw !== 32.1 ||
    contract.buildingSnapshot.errorBudgetDb !== COMPANY_INTERNAL_OPENING_LEAK_BUILDING_TOLERANCE_DB
  ) {
    throw new Error("Opening/leak building surface parity moved the runtime building values or basis.");
  }
}
