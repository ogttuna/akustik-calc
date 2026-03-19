import type { AssemblyCalculation } from "@dynecho/shared";

import { getDnTAkSourceMode } from "./dntak-source-mode";

export const DUTCH_BBL_AIRBORNE_REQUIREMENT_URL =
  "https://iplo.nl/publish/pages/191119/besluit-bouwwerken-leefomgeving-tekst-bij-inwerkingtreding-1.pdf";
export const DUTCH_RESIDENTIAL_ACOUSTIC_REFERENCE_URL =
  "https://www.wienerberger.nl/content/dam/wienerberger/netherlands/marketing/documents-magazines/brochures/wall/NL_MKT_DOC_POR_Porotherm_Geluidsbrochure.pdf";
export const DUTCH_DNTAK_REFERENCE_SOURCES = [
  {
    label: "IPLO BBL airborne minimum",
    url: DUTCH_BBL_AIRBORNE_REQUIREMENT_URL
  },
  {
    label: "Wienerberger comfort reference",
    url: DUTCH_RESIDENTIAL_ACOUSTIC_REFERENCE_URL
  }
] as const;

type DutchDnTAkReferenceRule = {
  id:
    | "nl_bbl_residential"
    | "nl_bbl_residential_ancillary"
    | "nl_bbl_same_dwelling"
    | "nl_comfortklasse_residential";
  label: string;
  scope: string;
  sourceLabel: string;
  sourceUrl: string;
  thresholdDb: number;
};

export type DutchDnTAkComplianceRow = DutchDnTAkReferenceRule & {
  deltaDb: number;
  detail: string;
  reportLine: string;
  statusLabel: string;
  tone: "accent" | "success" | "warning";
  valueDb: number;
};

export type DutchDnTAkComplianceSummary = {
  detail: string;
  statusLabel: string;
  tone: "accent" | "success" | "warning";
};

const DUTCH_DNTAK_REFERENCE_RULES = [
  {
    id: "nl_bbl_residential",
    label: "Dutch BBL minimum",
    scope: "Residential separating wall",
    sourceLabel: "IPLO BBL airborne minimum",
    sourceUrl: DUTCH_BBL_AIRBORNE_REQUIREMENT_URL,
    thresholdDb: 52
  },
  {
    id: "nl_bbl_residential_ancillary",
    label: "Dutch BBL ancillary room",
    scope: "Residential wall to non-primary room",
    sourceLabel: "IPLO BBL airborne ancillary-room minimum",
    sourceUrl: DUTCH_BBL_AIRBORNE_REQUIREMENT_URL,
    thresholdDb: 47
  },
  {
    id: "nl_bbl_same_dwelling",
    label: "Dutch BBL same dwelling",
    scope: "Room-to-room inside one dwelling",
    sourceLabel: "IPLO BBL same-dwelling minimum",
    sourceUrl: DUTCH_BBL_AIRBORNE_REQUIREMENT_URL,
    thresholdDb: 32
  },
  {
    id: "nl_comfortklasse_residential",
    label: "Dutch comfort class",
    scope: "Residential separating wall",
    sourceLabel: "Wienerberger comfort reference",
    sourceUrl: DUTCH_RESIDENTIAL_ACOUSTIC_REFERENCE_URL,
    thresholdDb: 57
  }
] as const satisfies readonly DutchDnTAkReferenceRule[];

function formatSignedDelta(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)} dB`;
}

export function getDutchResidentialDnTAkComplianceRows(
  result: AssemblyCalculation | null
): DutchDnTAkComplianceRow[] {
  const valueDb = result?.ratings?.field?.DnTAk;

  if (!(typeof valueDb === "number" && Number.isFinite(valueDb))) {
    return [];
  }

  const sourceMode = getDnTAkSourceMode(result);
  const indicative = sourceMode === "approximate_companion";
  const sourceTail =
    sourceMode === "exact_field_proxy_anchor"
      ? "Current DnT,A,k is source-anchored through the local field proxy lane, so this reads as a direct reference check."
      : sourceMode === "approximate_companion"
        ? "Current DnT,A,k is a project-dependent official companion, so this reads only as an indicative reference check."
        : "Current DnT,A,k is carried on the active source-backed lane, so treat this as a reference check rather than an authority statement.";

  return DUTCH_DNTAK_REFERENCE_RULES.map((rule) => {
    const deltaDb = Number((valueDb - rule.thresholdDb).toFixed(1));
    const passes = deltaDb >= 0;
    const statusLabel = indicative
      ? passes
        ? `Indicative ${formatSignedDelta(deltaDb)}`
        : `Indicative gap ${Math.abs(deltaDb).toFixed(1)} dB`
      : passes
        ? `Pass ${formatSignedDelta(deltaDb)}`
        : `Gap ${Math.abs(deltaDb).toFixed(1)} dB`;
    const tone: DutchDnTAkComplianceRow["tone"] = indicative ? "accent" : passes ? "success" : "warning";
    const verb = passes ? "passes by" : "falls short by";

    return {
      ...rule,
      deltaDb,
      detail: `${rule.scope} reference at DnT,A,k >= ${rule.thresholdDb} dB from ${rule.sourceLabel}. ${sourceTail}`,
      reportLine: `- ${rule.label} (${rule.scope}, DnT,A,k >= ${rule.thresholdDb} dB, source: ${rule.sourceLabel}): ${indicative ? "indicative " : ""}${verb} ${Math.abs(deltaDb).toFixed(1)} dB`,
      statusLabel,
      tone,
      valueDb
    };
  });
}

export function getDutchResidentialDnTAkComplianceReportLines(
  result: AssemblyCalculation | null
): string[] {
  return getDutchResidentialDnTAkComplianceRows(result).map((row) => row.reportLine);
}

export function getDutchResidentialDnTAkComplianceSummary(
  result: AssemblyCalculation | null
): DutchDnTAkComplianceSummary | null {
  const rows = getDutchResidentialDnTAkComplianceRows(result);

  if (rows.length === 0) {
    return null;
  }

  const bblRow = rows.find((row) => row.id === "nl_bbl_residential") ?? rows[0];
  const comfortRow = rows.find((row) => row.id === "nl_comfortklasse_residential");
  const indicative = getDnTAkSourceMode(result) === "approximate_companion";
  const statusLabel = indicative ? "Indicative" : bblRow.deltaDb >= 0 ? "BBL pass" : "BBL gap";
  const detailParts = [
    `BBL ${indicative ? "indicative " : ""}${formatSignedDelta(bblRow.deltaDb)}`,
    comfortRow
      ? `Comfort ${indicative ? "indicative " : ""}${formatSignedDelta(comfortRow.deltaDb)}`
      : null
  ].filter((part): part is string => Boolean(part));

  return {
    detail: detailParts.join(" · "),
    statusLabel,
    tone: indicative ? "accent" : bblRow.deltaDb >= 0 ? "success" : "warning"
  };
}
