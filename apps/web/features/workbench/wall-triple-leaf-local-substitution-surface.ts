import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTION_STATUS,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_WARNING,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID
} from "@dynecho/engine";
import type { AirborneCandidate, AirborneResultBasis, AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

export const WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_GATE =
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_LANDED_GATE;

export const WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_STATUS =
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTION_STATUS;

export const WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD =
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD;

export const WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID =
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID;

export const WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_METHOD =
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD;

export const WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID =
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID;

export const WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_WARNING =
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_WARNING;

export const WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING =
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING;

const WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_OUTPUTS = new Set<RequestedOutputId>([
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

const WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_OUTPUTS = new Set<RequestedOutputId>(["Rw"]);
const WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_ADAPTER_LAB_OUTPUTS = new Set<RequestedOutputId>([
  "C",
  "Ctr",
  "Rw",
  "STC"
]);

export type WallTripleLeafLocalSubstitutionSurface = {
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

function findWallTripleLeafLocalSubstitutionCandidate(
  result: AssemblyCalculation | null | undefined
): AirborneCandidate | null {
  return (
    result?.airborneCandidateResolution?.candidates.find(
      (candidate: AirborneCandidate) =>
        candidate.id === WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID ||
        candidate.basis.method === WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_METHOD ||
        candidate.id === WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID ||
        candidate.basis.method === WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD
    ) ?? null
  );
}

function getWallTripleLeafLocalSubstitutionBasis(
  result: AssemblyCalculation | null | undefined
): AirborneResultBasis | null {
  if (result?.airborneBasis?.method === WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD) {
    return result.airborneBasis;
  }

  if (result?.airborneBasis?.method === WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_METHOD) {
    return result.airborneBasis;
  }

  return findWallTripleLeafLocalSubstitutionCandidate(result)?.basis ?? null;
}

function getWarning(result: AssemblyCalculation): string | null {
  const warnings = result.warnings as readonly string[];

  return (
    warnings.find((entry: string) => entry === WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING) ??
    warnings.find((entry: string) => entry === WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_WARNING) ??
    warnings.find((entry: string) => /source-absent formula corridor/i.test(entry)) ??
    null
  );
}

function getDesignCorridorLine(result: AssemblyCalculation): string {
  const traceNote = result.dynamicAirborneTrace?.notes.find((note: string) =>
    /Formula design corridor Rw/u.test(note)
  );

  if (traceNote) {
    return traceNote.replace(/\.$/u, "");
  }

  if (result.metrics.estimatedRwDb >= 52.5) {
    return "Formula design corridor Rw 52.8 with live ISO-rounded Rw 53";
  }

  return "Formula design corridor Rw 49.3 with live ISO-rounded Rw 50";
}

export function getWallTripleLeafLocalSubstitutionSurface(
  result: AssemblyCalculation | null | undefined
): WallTripleLeafLocalSubstitutionSurface | null {
  const basis = getWallTripleLeafLocalSubstitutionBasis(result);

  if (!result || !basis) {
    return null;
  }

  const candidate = findWallTripleLeafLocalSubstitutionCandidate(result);
  const candidateId =
    candidate?.id ??
    result.airborneCandidateResolution?.selectedCandidateId ??
    WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID;
  const budgetLabel = `+/-${formatValue(basis.errorBudgetDb ?? 8)} dB`;
  const unsupportedOutputs = result.unsupportedTargetOutputs.filter((output: RequestedOutputId) =>
    WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_OUTPUTS.has(output)
  );
  const warning = getWarning(result);
  const label = "Wall triple-leaf local substitution";
  const designLine = getDesignCorridorLine(result);
  const valueLine = `lab Rw ${formatValue(result.metrics.estimatedRwDb)} dB`;
  const adapterActive = basis.method === WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_METHOD;
  const supportedLabLine = adapterActive
    ? `lab STC ${formatValue(result.metrics.estimatedStc)} dB, C ${formatValue(
        result.metrics.estimatedCDb
      )} dB, and Ctr ${formatValue(result.metrics.estimatedCtrDb)} dB are rated from the calculated curve`
    : "STC, C, and Ctr remain blocked until the lab spectrum adapter is active";
  const detail =
    `${label} is active through ${basis.method}: source-absent grouped triple-leaf input returns ${valueLine} with ${budgetLabel} not-measured budget. ` +
    `${designLine}. ${supportedLabLine}. It is not exact measured evidence, not NRC calibrated evidence, and field/building outputs remain blocked.`;

  return {
    budgetLabel,
    candidateId,
    detail: warning ? `${detail} ${warning}` : detail,
    label,
    method: basis.method,
    notes: [
      `Wall triple-leaf local substitution selected ${candidateId}.`,
      `${designLine}; budget ${budgetLabel}; not exact measured product evidence.`,
      adapterActive
        ? `Lab spectrum adapter supports STC ${formatValue(result.metrics.estimatedStc)}, C ${formatValue(
            result.metrics.estimatedCDb
          )}, and Ctr ${formatValue(result.metrics.estimatedCtrDb)} without copying Rw.`
        : "STC, C, and Ctr stay outside the Rw-only local-substitution lane until the lab spectrum adapter is active.",
      unsupportedOutputs.length > 0
        ? `Unsupported wall outputs: ${unsupportedOutputs.join(", ")} stay outside the local-substitution lab route.`
        : "Requested lab outputs are supported on this local-substitution lane.",
      ...(warning ? [warning] : [])
    ],
    origin: basis.origin,
    postureDetail: warning ? `${detail} ${warning}` : detail,
    reportLines: [
      `- Airborne wall triple-leaf local-substitution basis: ${label} (method ${basis.method}; origin ${basis.origin}; candidate ${candidateId}).`,
      `- Airborne wall triple-leaf local-substitution value: Rw ${formatValue(
        result.metrics.estimatedRwDb
      )} dB; budget ${budgetLabel}; ${designLine}; not exact measured product evidence.`,
      adapterActive
        ? `- Airborne wall triple-leaf local-substitution lab spectrum adapter: STC ${formatValue(
            result.metrics.estimatedStc
          )} dB; C ${formatValue(result.metrics.estimatedCDb)} dB; Ctr ${formatValue(
            result.metrics.estimatedCtrDb
          )} dB; all rated from the calculated curve, not copied from Rw.`
        : "- Airborne wall triple-leaf local-substitution boundary: STC, C, Ctr, field, and building outputs do not inherit this Rw-only source-absent formula corridor.",
      "- Airborne wall triple-leaf local-substitution field/building boundary: R'w, DnT,w, and building prediction outputs require their own context adapters.",
      ...(unsupportedOutputs.length > 0
        ? [`- Airborne wall triple-leaf local-substitution unsupported outputs: ${unsupportedOutputs.join(", ")}.`]
        : []),
      ...(warning ? [`- Airborne wall triple-leaf local-substitution warning: ${warning}`] : [])
    ],
    unsupportedOutputs,
    warning
  };
}

export function getWallTripleLeafLocalSubstitutionOutputDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null | undefined
): string | null {
  const surface = getWallTripleLeafLocalSubstitutionSurface(result);

  if (!surface || !WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_OUTPUTS.has(output)) {
    return null;
  }

  if (
    surface.method === WEB_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_METHOD &&
    WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_ADAPTER_LAB_OUTPUTS.has(output)
  ) {
    return surface.detail;
  }

  if (WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_OUTPUTS.has(output)) {
    return surface.detail;
  }

  if (surface.unsupportedOutputs.includes(output)) {
    return `${surface.detail} ${output} remains unsupported on this local-substitution route; add a separately owned adapter before presenting it.`;
  }

  return surface.detail;
}

export function getWallTripleLeafLocalSubstitutionReportLines(
  result: AssemblyCalculation | null | undefined
): readonly string[] {
  return getWallTripleLeafLocalSubstitutionSurface(result)?.reportLines ?? [];
}
