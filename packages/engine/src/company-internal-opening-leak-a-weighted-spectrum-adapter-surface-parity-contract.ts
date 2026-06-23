import type { AssemblyCalculation, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_BUILDING_CONTEXT,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_LANDED_GATE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTION_STATUS,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_FIELD_CONTEXT
} from "./company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract";
import {
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD,
  COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID
} from "./company-internal-opening-leak-building-runtime-corridor";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_LANDED_GATE =
  "company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_plan";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTION_STATUS =
  "company_internal_opening_leak_a_weighted_spectrum_adapter_surface_parity_landed_selected_matrix_v6_refresh";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_ACTION =
  "company_internal_calculation_grade_mainline_matrix_v6_refresh_after_opening_leak_a_weighted_surface_parity_plan";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_FILE =
  "packages/engine/src/company-internal-calculation-grade-mainline-matrix-v6-contract.test.ts";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_LABEL =
  "company-internal matrix v6 refresh after opening/leak Dn,A / DnT,A surface parity";

export const COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_TARGETS = [
  "output_cards",
  "route_posture",
  "scenario_summary",
  "corridor_dossier",
  "method_dossier",
  "local_saved_replay",
  "server_snapshot_replay",
  "calculator_api_payload",
  "markdown_report",
  "frequency_band_input_surface"
] as const;

const HOST_WALL: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "concrete", thicknessMm: 160 }
] as const;

const FIELD_TARGETS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "Dn,A",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

const BUILDING_TARGETS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A",
  "Dn,A"
] as const satisfies readonly RequestedOutputId[];

type AWeightedSurfaceSnapshot = {
  basisId: string | null;
  candidateId: string | null;
  dnA: number | null;
  dntA: number | null;
  dntw: number | null;
  dnw: number | null;
  errorBudgetDb: number | null;
  frequencyBandSet: string | null;
  rwPrime: number | null;
  supportedTargetOutputs: readonly RequestedOutputId[];
  unsupportedTargetOutputs: readonly RequestedOutputId[];
};

export type CompanyInternalOpeningLeakAWeightedSurfaceParityContract = {
  buildingSnapshot: AWeightedSurfaceSnapshot;
  cardReportApiParityRequired: true;
  fieldSnapshot: AWeightedSurfaceSnapshot;
  frequencyBandInputSurfaceRequired: true;
  landedGate: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_LANDED_GATE;
  previousRuntimeLandedGate: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_LANDED_GATE;
  previousRuntimeSelectedNextAction: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION;
  previousRuntimeSelectedNextFile: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE;
  previousRuntimeSelectionStatus: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTION_STATUS;
  runtimeMovedAtSurfaceParity: false;
  selectedImplementationSlice: "company_internal_calculation_grade_mainline";
  selectedNextAction: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_ACTION;
  selectedNextFile: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_FILE;
  selectedNextLabel: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_LABEL;
  selectionStatus: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTION_STATUS;
  visibleSurfaceTargets: typeof COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_TARGETS;
};

function roundOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value * 10) / 10 : null;
}

function buildSnapshot(result: AssemblyCalculation): AWeightedSurfaceSnapshot {
  return {
    basisId: result.airborneBasis?.method ?? null,
    candidateId: result.airborneCandidateResolution?.selectedCandidateId ?? null,
    dnA: roundOrNull(result.metrics.estimatedDnADb),
    dntA: roundOrNull(result.metrics.estimatedDnTADb),
    dntw: roundOrNull(result.metrics.estimatedDnTwDb),
    dnw: roundOrNull(result.metrics.estimatedDnWDb),
    errorBudgetDb: result.airborneBasis?.errorBudgetDb ?? null,
    frequencyBandSet: result.airborneBasis?.frequencyBands?.bandSet ?? null,
    rwPrime: roundOrNull(result.metrics.estimatedRwPrimeDb),
    supportedTargetOutputs: result.supportedTargetOutputs,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs
  };
}

function calculateAWeightedSurfaceSnapshots(): {
  building: AWeightedSurfaceSnapshot;
  field: AWeightedSurfaceSnapshot;
} {
  return {
    building: buildSnapshot(
      calculateAssembly(HOST_WALL, {
        airborneContext: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_BUILDING_CONTEXT,
        calculator: "dynamic",
        targetOutputs: BUILDING_TARGETS
      })
    ),
    field: buildSnapshot(
      calculateAssembly(HOST_WALL, {
        airborneContext: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_FIELD_CONTEXT,
        calculator: "dynamic",
        targetOutputs: FIELD_TARGETS
      })
    )
  };
}

export function buildCompanyInternalOpeningLeakAWeightedSurfaceParityContract():
  CompanyInternalOpeningLeakAWeightedSurfaceParityContract {
  const snapshots = calculateAWeightedSurfaceSnapshots();

  return {
    buildingSnapshot: snapshots.building,
    cardReportApiParityRequired: true,
    fieldSnapshot: snapshots.field,
    frequencyBandInputSurfaceRequired: true,
    landedGate: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_LANDED_GATE,
    previousRuntimeLandedGate: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_LANDED_GATE,
    previousRuntimeSelectedNextAction:
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
    previousRuntimeSelectedNextFile:
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
    previousRuntimeSelectionStatus:
      COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTION_STATUS,
    runtimeMovedAtSurfaceParity: false,
    selectedImplementationSlice: "company_internal_calculation_grade_mainline",
    selectedNextAction: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
    selectedNextFile: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_FILE,
    selectedNextLabel: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTED_NEXT_LABEL,
    selectionStatus: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_PARITY_SELECTION_STATUS,
    visibleSurfaceTargets: COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SURFACE_TARGETS
  };
}

export function assertCompanyInternalOpeningLeakAWeightedSurfaceParityContract(
  contract: CompanyInternalOpeningLeakAWeightedSurfaceParityContract =
    buildCompanyInternalOpeningLeakAWeightedSurfaceParityContract()
): void {
  if (COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION !== contract.landedGate) {
    throw new Error("Opening/leak A-weighted surface parity did not consume the selected runtime corridor.");
  }

  if (
    contract.fieldSnapshot.basisId !== COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD ||
    contract.fieldSnapshot.candidateId !== COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID ||
    contract.fieldSnapshot.dnA !== 35.9 ||
    contract.fieldSnapshot.dntA !== 36.1 ||
    contract.fieldSnapshot.errorBudgetDb !== COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FIELD_TOLERANCE_DB ||
    contract.fieldSnapshot.frequencyBandSet !== COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET
  ) {
    throw new Error("Opening/leak field A-weighted surface snapshot drifted from runtime pins.");
  }

  if (
    contract.buildingSnapshot.basisId !== COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_RUNTIME_METHOD ||
    contract.buildingSnapshot.candidateId !== COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_SELECTED_CANDIDATE_ID ||
    contract.buildingSnapshot.dnA !== 31.1 ||
    contract.buildingSnapshot.dnw !== 31.9 ||
    contract.buildingSnapshot.dntA !== 31.3 ||
    contract.buildingSnapshot.errorBudgetDb !== COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_BUILDING_TOLERANCE_DB ||
    contract.buildingSnapshot.frequencyBandSet !== COMPANY_INTERNAL_OPENING_LEAK_A_WEIGHTED_FREQUENCY_BAND_SET
  ) {
    throw new Error("Opening/leak building A-weighted surface snapshot drifted from runtime pins.");
  }
}
