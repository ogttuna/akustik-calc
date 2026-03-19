import type { AssemblyCalculation } from "@dynecho/shared";

import {
  DUTCH_BBL_AIRBORNE_REQUIREMENT_URL,
  DUTCH_RESIDENTIAL_ACOUSTIC_REFERENCE_URL
} from "./dutch-airborne-compliance";

export const DUTCH_IMPACT_REFERENCE_SOURCES = [
  {
    label: "IPLO BBL contact-sound minima",
    url: DUTCH_BBL_AIRBORNE_REQUIREMENT_URL
  },
  {
    label: "Wienerberger comfort contact-sound reference",
    url: DUTCH_RESIDENTIAL_ACOUSTIC_REFERENCE_URL
  }
] as const;

type DutchImpactReferenceRule = {
  id:
    | "nl_bbl_impact_residential"
    | "nl_bbl_impact_ancillary"
    | "nl_bbl_impact_same_dwelling"
    | "nl_comfortklasse_impact_residential";
  label: string;
  scope: string;
  sourceLabel: string;
  sourceUrl: string;
  thresholdDb: number;
};

export type DutchImpactReferenceRow = DutchImpactReferenceRule & {
  detail: string;
  reportLine: string;
  statusLabel: string;
  tone: "neutral" | "success" | "warning";
  valueDb?: number;
};

const DUTCH_IMPACT_REFERENCE_RULES = [
  {
    id: "nl_bbl_impact_residential",
    label: "Dutch BBL impact minimum",
    scope: "Residential separating floor",
    sourceLabel: "IPLO BBL contact-sound minimum",
    sourceUrl: DUTCH_BBL_AIRBORNE_REQUIREMENT_URL,
    thresholdDb: 54
  },
  {
    id: "nl_bbl_impact_ancillary",
    label: "Dutch BBL impact ancillary room",
    scope: "Residential floor to non-primary room",
    sourceLabel: "IPLO BBL ancillary-room contact-sound minimum",
    sourceUrl: DUTCH_BBL_AIRBORNE_REQUIREMENT_URL,
    thresholdDb: 59
  },
  {
    id: "nl_bbl_impact_same_dwelling",
    label: "Dutch BBL impact same dwelling",
    scope: "Room-to-room inside one dwelling",
    sourceLabel: "IPLO BBL same-dwelling contact-sound minimum",
    sourceUrl: DUTCH_BBL_AIRBORNE_REQUIREMENT_URL,
    thresholdDb: 79
  },
  {
    id: "nl_comfortklasse_impact_residential",
    label: "Dutch comfort impact class",
    scope: "Residential separating floor",
    sourceLabel: "Wienerberger comfort contact-sound reference",
    sourceUrl: DUTCH_RESIDENTIAL_ACOUSTIC_REFERENCE_URL,
    thresholdDb: 49
  }
] as const satisfies readonly DutchImpactReferenceRule[];

type ImpactProxyContext = {
  summary: string;
};

function formatSignedDelta(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)} dB`;
}

function getCurrentImpactProxyContext(
  result: AssemblyCalculation
): ImpactProxyContext | null {
  if (typeof result.impact?.LnTA === "number") {
    return {
      summary: `Current exact Dutch metric is LnT,A ${result.impact.LnTA.toFixed(1)} dB`
    };
  }

  if (typeof result.impact?.LPrimeNTw === "number") {
    return {
      summary: `Current live field metric is L'nT,w ${result.impact.LPrimeNTw.toFixed(1)} dB`
    };
  }

  if (typeof result.impact?.LPrimeNW === "number") {
    return {
      summary: `Current live field metric is L'n,w ${result.impact.LPrimeNW.toFixed(1)} dB`
    };
  }

  if (typeof result.impact?.LnW === "number") {
    return {
      summary: `Current live lab metric is Ln,w ${result.impact.LnW.toFixed(1)} dB`
    };
  }

  if (typeof result.lowerBoundImpact?.LPrimeNTwUpperBound === "number") {
    return {
      summary: `Current live field metric is L'nT,w upper bound <= ${result.lowerBoundImpact.LPrimeNTwUpperBound.toFixed(1)} dB`
    };
  }

  if (typeof result.lowerBoundImpact?.LPrimeNWUpperBound === "number") {
    return {
      summary: `Current live field metric is L'n,w upper bound <= ${result.lowerBoundImpact.LPrimeNWUpperBound.toFixed(1)} dB`
    };
  }

  if (typeof result.lowerBoundImpact?.LnWUpperBound === "number") {
    return {
      summary: `Current live lab metric is Ln,w upper bound <= ${result.lowerBoundImpact.LnWUpperBound.toFixed(1)} dB`
    };
  }

  return null;
}

export function getDutchResidentialImpactReferenceRows(
  result: AssemblyCalculation | null
): DutchImpactReferenceRow[] {
  if (!result) {
    return [];
  }

  const exactLnTA = result.impact?.LnTA;
  if (typeof exactLnTA === "number" && Number.isFinite(exactLnTA)) {
    return DUTCH_IMPACT_REFERENCE_RULES.map((rule) => {
      const deltaDb = Number((rule.thresholdDb - exactLnTA).toFixed(1));
      const passes = deltaDb >= 0;
      const statusLabel = passes ? `Pass ${formatSignedDelta(deltaDb)}` : `Gap ${Math.abs(deltaDb).toFixed(1)} dB`;
      const verb = passes ? "passes by" : "exceeds by";

      return {
        ...rule,
        detail: `${rule.scope} reference at LnT,A <= ${rule.thresholdDb} dB from ${rule.sourceLabel}. Current Dutch exact-band lane is source-backed and reads as a direct reference check.`,
        reportLine: `- ${rule.label} (${rule.scope}, LnT,A <= ${rule.thresholdDb} dB, source: ${rule.sourceLabel}): ${verb} ${Math.abs(deltaDb).toFixed(1)} dB`,
        statusLabel,
        tone: passes ? "success" : "warning",
        valueDb: exactLnTA
      };
    });
  }

  const liveProxy = getCurrentImpactProxyContext(result);
  const metricTail = liveProxy
    ? `${liveProxy.summary}, but Dutch residential contact-sound checks use NEN 5077 LnT,A, so DynEcho does not treat this as a compliance verdict.`
    : "Dutch residential contact-sound checks use NEN 5077 LnT,A, and DynEcho does not yet compute LnT,A directly, so no compliance verdict is emitted.";

  return DUTCH_IMPACT_REFERENCE_RULES.map((rule) => ({
    ...rule,
    detail: `${rule.scope} reference at LnT,A <= ${rule.thresholdDb} dB from ${rule.sourceLabel}. ${metricTail}`,
    reportLine: `- ${rule.label} (${rule.scope}, LnT,A <= ${rule.thresholdDb} dB, source: ${rule.sourceLabel}): pending, ${metricTail}`,
    statusLabel: "Need LnT,A",
    tone: "neutral"
  }));
}

export function getDutchResidentialImpactReferenceReportLines(
  result: AssemblyCalculation | null
): string[] {
  return getDutchResidentialImpactReferenceRows(result).map((row) => row.reportLine);
}
