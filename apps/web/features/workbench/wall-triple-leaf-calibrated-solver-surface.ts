import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_ERROR_BUDGET_DB,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_WARNING
} from "@dynecho/engine";
import type { AirborneCandidate, AirborneResultBasis, AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

export const WEB_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD =
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD;

export const WEB_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID =
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID;

export const WEB_WALL_TRIPLE_LEAF_CALIBRATED_WARNING =
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_WARNING;

const WALL_TRIPLE_LEAF_CALIBRATED_SURFACE_OUTPUTS = new Set<RequestedOutputId>([
  "C",
  "Ctr",
  "Dn,A",
  "Dn,w",
  "DnT,A",
  "DnT,A,k",
  "DnT,w",
  "R'w",
  "Rw",
  "STC"
]);

const WALL_TRIPLE_LEAF_CALIBRATED_LAB_OUTPUTS = new Set<RequestedOutputId>([
  "C",
  "Ctr",
  "Rw",
  "STC"
]);

export type WallTripleLeafCalibratedSolverSurface = {
  budgetLabel: string;
  candidateId: string;
  detail: string;
  label: string;
  method: string;
  notes: readonly string[];
  origin: string;
  postureDetail: string;
  reportLines: readonly string[];
  unsupportedOutputs: readonly RequestedOutputId[];
  warning: string | null;
};

function formatValue(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}

function formatSignedValue(value: number): string {
  return `${value >= 0 ? "+" : ""}${formatValue(value)}`;
}

function findWallTripleLeafCalibratedCandidate(
  result: AssemblyCalculation | null | undefined
): AirborneCandidate | null {
  return (
    result?.airborneCandidateResolution?.candidates.find(
      (candidate: AirborneCandidate) =>
        candidate.id === WEB_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID ||
        candidate.basis.method === WEB_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD
    ) ?? null
  );
}

function getWallTripleLeafCalibratedBasis(
  result: AssemblyCalculation | null | undefined
): AirborneResultBasis | null {
  if (result?.airborneBasis?.method === WEB_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD) {
    return result.airborneBasis;
  }

  return findWallTripleLeafCalibratedCandidate(result)?.basis ?? null;
}

function getWarning(result: AssemblyCalculation): string | null {
  const warnings = result.warnings as readonly string[];

  return (
    warnings.find((entry: string) => entry === WEB_WALL_TRIPLE_LEAF_CALIBRATED_WARNING) ??
    warnings.find((entry: string) => /NRC 2024 Type C\/glass-fiber triple-leaf calibrated solver/i.test(entry)) ??
    null
  );
}

export function getWallTripleLeafCalibratedSolverSurface(
  result: AssemblyCalculation | null | undefined
): WallTripleLeafCalibratedSolverSurface | null {
  const basis = getWallTripleLeafCalibratedBasis(result);

  if (!result || !basis) {
    return null;
  }

  const calibratedCandidate = findWallTripleLeafCalibratedCandidate(result);
  const candidateId =
    calibratedCandidate?.id ??
    result.airborneCandidateResolution?.selectedCandidateId ??
    WEB_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID;
  const budgetLabel = `+/-${formatValue(
    basis.errorBudgetDb ?? BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_ERROR_BUDGET_DB
  )} dB`;
  const unsupportedOutputs = result.unsupportedTargetOutputs.filter((output: RequestedOutputId) =>
    WALL_TRIPLE_LEAF_CALIBRATED_SURFACE_OUTPUTS.has(output)
  );
  const warning = getWarning(result);
  const label = "Wall triple-leaf calibrated solver";
  const values =
    `Rw ${formatValue(result.metrics.estimatedRwDb)} dB, STC ${formatValue(result.metrics.estimatedStc)} dB, ` +
    `C ${formatSignedValue(result.metrics.estimatedCDb)} dB, Ctr ${formatSignedValue(
      result.metrics.estimatedCtrDb
    )} dB`;
  const detail =
    `${label} is active through ${basis.method}: NRC 2024 Type C/glass-fiber source-family grouped triple-leaf input returns ${values} with ${budgetLabel} calibrated source-family budget. ` +
    "This is not an exact product row, and field/building outputs are not aliased from the lab result.";

  return {
    budgetLabel,
    candidateId,
    detail: warning ? `${detail} ${warning}` : detail,
    label,
    method: basis.method,
    notes: [
      `NRC 2024 Type C/glass-fiber triple-leaf calibrated solver selected ${candidateId}.`,
      `Calibrated lab values remain ${values}; budget ${budgetLabel}; not an exact measured product row.`,
      unsupportedOutputs.length > 0
        ? `Unsupported wall outputs: ${unsupportedOutputs.join(", ")} stay outside the lab calibrated lane.`
        : "No field/building companion output was requested on this lab calibrated lane.",
      ...(warning ? [warning] : [])
    ],
    origin: basis.origin,
    postureDetail: warning ? `${detail} ${warning}` : detail,
    reportLines: [
      `- Airborne wall triple-leaf calibrated basis: ${label} (method ${basis.method}; origin ${basis.origin}; candidate ${candidateId}).`,
      `- Airborne wall triple-leaf calibrated values: Rw ${formatValue(
        result.metrics.estimatedRwDb
      )} dB; STC ${formatValue(result.metrics.estimatedStc)} dB; C ${formatSignedValue(
        result.metrics.estimatedCDb
      )} dB; Ctr ${formatSignedValue(result.metrics.estimatedCtrDb)} dB; budget ${budgetLabel}; not exact measured product evidence.`,
      "- Airborne wall triple-leaf calibrated boundary: Rockwool, MLV, plaster, generic gypsum/glasswool, field, and building outputs do not inherit this NRC source-family lab result.",
      ...(unsupportedOutputs.length > 0
        ? [`- Airborne wall triple-leaf calibrated unsupported outputs: ${unsupportedOutputs.join(", ")}.`]
        : []),
      ...(warning ? [`- Airborne wall triple-leaf calibrated warning: ${warning}`] : [])
    ],
    unsupportedOutputs,
    warning
  };
}

export function getWallTripleLeafCalibratedSolverOutputDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null | undefined
): string | null {
  const surface = getWallTripleLeafCalibratedSolverSurface(result);

  if (!surface || !WALL_TRIPLE_LEAF_CALIBRATED_SURFACE_OUTPUTS.has(output)) {
    return null;
  }

  if (WALL_TRIPLE_LEAF_CALIBRATED_LAB_OUTPUTS.has(output)) {
    return surface.detail;
  }

  if (surface.unsupportedOutputs.includes(output)) {
    return `${surface.detail} ${output} remains unsupported on this calibrated lab route; add an owned field/building adapter before presenting it.`;
  }

  return surface.detail;
}

export function getWallTripleLeafCalibratedSolverReportLines(
  result: AssemblyCalculation | null | undefined
): readonly string[] {
  return getWallTripleLeafCalibratedSolverSurface(result)?.reportLines ?? [];
}
