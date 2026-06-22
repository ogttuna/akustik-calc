import {
  REQUESTED_OUTPUT_IDS,
  type ProjectUserVerifiedCalculatedAnchorMetricBasis,
  type RequestedOutputId
} from "@dynecho/shared";

export type WorkbenchV2VerifiedCalculatedAnchorValueSummary = {
  metric: RequestedOutputId;
  metricBasis: ProjectUserVerifiedCalculatedAnchorMetricBasis;
  valueDb: number;
};

export type WorkbenchV2VerifiedCalculatedAnchorSummary = {
  createdAtIso: string;
  createdFromPresetId?: string;
  createdFromProjectId?: string;
  description?: string;
  fingerprint: string;
  id: string;
  mode: "ceiling" | "floor" | "opening" | "wall";
  name: string;
  revision: number;
  scope: "project_evidence" | "team_evidence" | "user_evidence";
  status: "active" | "conflict" | "draft" | "promoted" | "retired";
  updatedAtIso: string;
  valueMetrics: RequestedOutputId[];
  valueSummaries: WorkbenchV2VerifiedCalculatedAnchorValueSummary[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseMode(value: unknown): WorkbenchV2VerifiedCalculatedAnchorSummary["mode"] | null {
  return value === "ceiling" || value === "floor" || value === "opening" || value === "wall" ? value : null;
}

function parseScope(value: unknown): WorkbenchV2VerifiedCalculatedAnchorSummary["scope"] | null {
  return value === "project_evidence" || value === "team_evidence" || value === "user_evidence" ? value : null;
}

function parseStatus(value: unknown): WorkbenchV2VerifiedCalculatedAnchorSummary["status"] | null {
  return value === "active" || value === "conflict" || value === "draft" || value === "promoted" || value === "retired"
    ? value
    : null;
}

function parseValueMetrics(value: unknown): RequestedOutputId[] | null {
  const requestedOutputIds = new Set<string>(REQUESTED_OUTPUT_IDS);
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string" || !requestedOutputIds.has(entry))) {
    return null;
  }

  return Array.from(new Set(value)) as RequestedOutputId[];
}

function parseMetricBasis(value: unknown): ProjectUserVerifiedCalculatedAnchorMetricBasis | null {
  return value === "airborne_lab" ||
    value === "airborne_field" ||
    value === "airborne_building_prediction" ||
    value === "impact_lab" ||
    value === "impact_field"
    ? value
    : null;
}

function parseValueSummaries(value: unknown): WorkbenchV2VerifiedCalculatedAnchorValueSummary[] | null {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    return null;
  }

  const requestedOutputIds = new Set<string>(REQUESTED_OUTPUT_IDS);
  const summaries: WorkbenchV2VerifiedCalculatedAnchorValueSummary[] = [];
  for (const entry of value) {
    if (!isRecord(entry) || typeof entry.metric !== "string" || !requestedOutputIds.has(entry.metric)) {
      return null;
    }
    const metricBasis = parseMetricBasis(entry.metricBasis);
    if (!metricBasis || typeof entry.valueDb !== "number" || !Number.isFinite(entry.valueDb)) {
      return null;
    }

    summaries.push({
      metric: entry.metric as RequestedOutputId,
      metricBasis,
      valueDb: entry.valueDb
    });
  }

  return summaries;
}

export function parseWorkbenchV2VerifiedCalculatedAnchorSummary(
  value: unknown
): WorkbenchV2VerifiedCalculatedAnchorSummary | null {
  if (
    !isRecord(value) ||
    typeof value.createdAtIso !== "string" ||
    (value.createdFromPresetId !== undefined && typeof value.createdFromPresetId !== "string") ||
    (value.createdFromProjectId !== undefined && typeof value.createdFromProjectId !== "string") ||
    (value.description !== undefined && typeof value.description !== "string") ||
    typeof value.fingerprint !== "string" ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.revision !== "number" ||
    !Number.isInteger(value.revision) ||
    typeof value.updatedAtIso !== "string"
  ) {
    return null;
  }

  const mode = parseMode(value.mode);
  const scope = parseScope(value.scope);
  const status = parseStatus(value.status);
  const valueMetrics = parseValueMetrics(value.valueMetrics);
  const valueSummaries = parseValueSummaries(value.valueSummaries);

  if (!mode || !scope || !status || !valueMetrics || !valueSummaries) {
    return null;
  }

  return {
    createdAtIso: value.createdAtIso,
    createdFromPresetId: value.createdFromPresetId,
    createdFromProjectId: value.createdFromProjectId,
    description: value.description,
    fingerprint: value.fingerprint,
    id: value.id,
    mode,
    name: value.name,
    revision: value.revision,
    scope,
    status,
    updatedAtIso: value.updatedAtIso,
    valueMetrics,
    valueSummaries
  };
}

export function parseWorkbenchV2VerifiedCalculatedAnchorSummaries(
  value: unknown
): WorkbenchV2VerifiedCalculatedAnchorSummary[] {
  if (!isRecord(value) || !Array.isArray(value.anchors)) {
    return [];
  }

  return value.anchors
    .map(parseWorkbenchV2VerifiedCalculatedAnchorSummary)
    .filter((anchor): anchor is WorkbenchV2VerifiedCalculatedAnchorSummary => anchor !== null);
}

export function formatWorkbenchV2VerifiedCalculatedAnchorMetrics(
  anchor: WorkbenchV2VerifiedCalculatedAnchorSummary
): string {
  return anchor.valueMetrics.length ? anchor.valueMetrics.join(", ") : "No saved outputs";
}

function formatValueDb(valueDb: number): string {
  const rounded = Math.round(valueDb * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)} dB`;
}

export function formatWorkbenchV2VerifiedCalculatedAnchorValues(
  anchor: WorkbenchV2VerifiedCalculatedAnchorSummary
): string {
  if (!anchor.valueSummaries.length) {
    return formatWorkbenchV2VerifiedCalculatedAnchorMetrics(anchor);
  }

  return anchor.valueSummaries
    .map((value) => `${value.metric} ${formatValueDb(value.valueDb)}`)
    .join(", ");
}

export function formatWorkbenchV2VerifiedCalculatedAnchorContext(
  anchor: WorkbenchV2VerifiedCalculatedAnchorSummary
): string {
  const mode = anchor.mode[0].toUpperCase() + anchor.mode.slice(1);
  const scope = anchor.scope === "project_evidence" ? "Project" : anchor.scope === "team_evidence" ? "Team" : "User";
  return `${mode} / ${scope} / exact match only`;
}

export function getApplicableWorkbenchV2VerifiedCalculatedAnchors(
  anchors: readonly WorkbenchV2VerifiedCalculatedAnchorSummary[],
  currentFingerprint: string | null
): WorkbenchV2VerifiedCalculatedAnchorSummary[] {
  if (!currentFingerprint) {
    return [];
  }

  return anchors.filter((anchor) => anchor.status === "active" && anchor.fingerprint === currentFingerprint);
}
