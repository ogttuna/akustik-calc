export type WorkbenchV2MeasuredWallRwAnchorSummary = {
  createdAtIso: string;
  createdFromPresetId?: string;
  fingerprint: string;
  id: string;
  measurementMethodStandard: "ISO 10140-2" | "ASTM E90" | "source_report_unknown";
  ratingStandard: "ISO 717-1" | "ASTM E413" | "source_report_unknown";
  sourceLabel: string;
  sourceStatus: "active" | "draft" | "promoted" | "retired";
  toleranceDb: number;
  updatedAtIso: string;
  valueDb: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseMeasurementMethodStandard(value: unknown): WorkbenchV2MeasuredWallRwAnchorSummary["measurementMethodStandard"] | null {
  return value === "ISO 10140-2" || value === "ASTM E90" || value === "source_report_unknown" ? value : null;
}

function parseRatingStandard(value: unknown): WorkbenchV2MeasuredWallRwAnchorSummary["ratingStandard"] | null {
  return value === "ISO 717-1" || value === "ASTM E413" || value === "source_report_unknown" ? value : null;
}

function parseSourceStatus(value: unknown): WorkbenchV2MeasuredWallRwAnchorSummary["sourceStatus"] | null {
  return value === "active" || value === "draft" || value === "promoted" || value === "retired" ? value : null;
}

export function parseWorkbenchV2MeasuredWallRwAnchorSummary(value: unknown): WorkbenchV2MeasuredWallRwAnchorSummary | null {
  if (
    !isRecord(value) ||
    typeof value.createdAtIso !== "string" ||
    (value.createdFromPresetId !== undefined && typeof value.createdFromPresetId !== "string") ||
    typeof value.fingerprint !== "string" ||
    typeof value.id !== "string" ||
    typeof value.sourceLabel !== "string" ||
    typeof value.toleranceDb !== "number" ||
    !Number.isFinite(value.toleranceDb) ||
    typeof value.updatedAtIso !== "string" ||
    typeof value.valueDb !== "number" ||
    !Number.isFinite(value.valueDb)
  ) {
    return null;
  }

  const measurementMethodStandard = parseMeasurementMethodStandard(value.measurementMethodStandard);
  const ratingStandard = parseRatingStandard(value.ratingStandard);
  const sourceStatus = parseSourceStatus(value.sourceStatus);

  if (!measurementMethodStandard || !ratingStandard || !sourceStatus) {
    return null;
  }

  return {
    createdAtIso: value.createdAtIso,
    createdFromPresetId: value.createdFromPresetId,
    fingerprint: value.fingerprint,
    id: value.id,
    measurementMethodStandard,
    ratingStandard,
    sourceLabel: value.sourceLabel,
    sourceStatus,
    toleranceDb: value.toleranceDb,
    updatedAtIso: value.updatedAtIso,
    valueDb: value.valueDb
  };
}

export function parseWorkbenchV2MeasuredWallRwAnchorSummaries(value: unknown): WorkbenchV2MeasuredWallRwAnchorSummary[] {
  if (!isRecord(value) || !Array.isArray(value.anchors)) {
    return [];
  }

  return value.anchors
    .map(parseWorkbenchV2MeasuredWallRwAnchorSummary)
    .filter((anchor): anchor is WorkbenchV2MeasuredWallRwAnchorSummary => anchor !== null);
}

export function formatWorkbenchV2MeasuredWallRwAnchorValue(anchor: WorkbenchV2MeasuredWallRwAnchorSummary): string {
  const value = Number.isInteger(anchor.valueDb) ? anchor.valueDb.toFixed(0) : anchor.valueDb.toFixed(1);

  if (anchor.toleranceDb > 0) {
    const tolerance = Number.isInteger(anchor.toleranceDb) ? anchor.toleranceDb.toFixed(0) : anchor.toleranceDb.toFixed(1);
    return `Rw ${value} dB +/-${tolerance}`;
  }

  return `Rw ${value} dB`;
}
