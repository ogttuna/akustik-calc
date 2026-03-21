import type { AssemblyCalculation } from "@dynecho/shared";

import { getDnTAkSourceMode } from "./dntak-source-mode";
import { getFieldAirborneModeLabel, getFieldAirborneRouteLabel } from "./field-airborne-output";

export type FieldAirborneProvenanceSummary = {
  detail: string;
  label: string;
  modeLabel: string;
};

function hasFieldRoute(result: AssemblyCalculation | null): boolean {
  return (
    result?.airborneOverlay?.contextMode === "field_between_rooms" ||
    result?.airborneOverlay?.contextMode === "building_prediction" ||
    result?.ratings?.iso717?.descriptor === "R'w" ||
    typeof result?.ratings?.field?.DnTAk === "number"
  );
}

function getCurveLabel(result: AssemblyCalculation | null): string {
  return result?.airborneOverlay?.leakagePenaltyApplied || result?.airborneOverlay?.fieldFlankingPenaltyApplied
    ? "final apparent curve after the active leakage and flanking overlays"
    : "final apparent airborne curve";
}

export function getFieldAirborneProvenanceSummary(
  result: AssemblyCalculation | null
): FieldAirborneProvenanceSummary | null {
  if (!hasFieldRoute(result)) {
    return null;
  }

  const routeLabel = getFieldAirborneRouteLabel(result);
  const modeLabel = getFieldAirborneModeLabel(result);
  const dntakMode = getDnTAkSourceMode(result);

  if (dntakMode === "exact_field_proxy_anchor") {
    return {
      detail: `${routeLabel} is active. DnT,A,k is source-anchored through an official exact field proxy on the local DnT,A lane instead of being inferred from a generic apparent-field companion.`,
      label: "Exact source anchor",
      modeLabel
    };
  }

  if (dntakMode === "approximate_companion") {
    return {
      detail: `${routeLabel} is active. DnT,A,k is carried as an official approximate source companion and stays separate from the local apparent-field DnT,A derivation.`,
      label: "Source companion",
      modeLabel
    };
  }

  if (typeof result?.metrics?.estimatedDnTwDb === "number" || typeof result?.metrics?.estimatedDnTADb === "number") {
    return {
      detail: `${routeLabel} is active. DnT outputs are being standardized from the ${getCurveLabel(result)} using partition area and receiving-room volume.`,
      label: "Room-standardized apparent derivation",
      modeLabel
    };
  }

  if (typeof result?.metrics?.estimatedDnWDb === "number" || typeof result?.metrics?.estimatedDnADb === "number") {
    return {
      detail: `${routeLabel} is active. Dn outputs are being carried as area-normalized companions from the ${getCurveLabel(result)} using the current partition area.`,
      label: "Area-normalized apparent derivation",
      modeLabel
    };
  }

  if (typeof result?.metrics?.estimatedRwPrimeDb === "number" || result?.ratings?.iso717?.descriptor === "R'w") {
    return {
      detail: `${routeLabel} is active. R'w is being read directly from the ${getCurveLabel(result)} as the apparent on-site airborne single number.`,
      label: "Apparent field derivation",
      modeLabel
    };
  }

  return {
    detail: `${routeLabel} is active on the current airborne lane.`,
    label: "Field airborne route",
    modeLabel
  };
}

export function getFieldAirborneReportLines(result: AssemblyCalculation | null): string[] {
  const summary = getFieldAirborneProvenanceSummary(result);

  if (!summary) {
    return [];
  }

  const lines = [
    `- Airborne field route: ${summary.modeLabel}`,
    `- Airborne field provenance: ${summary.label}. ${summary.detail}`
  ];

  if (typeof result?.metrics?.estimatedRwPrimeDb === "number") {
    lines.push(`- R'w provenance: apparent on-site airborne single number from the final field curve`);
  }

  if (typeof result?.metrics?.estimatedDnWDb === "number") {
    lines.push(`- Dn,w provenance: area-normalized apparent derivation via 10log10(A0/S)`);
  }

  if (typeof result?.metrics?.estimatedDnADb === "number") {
    lines.push(`- Dn,A provenance: Dn,w + C on the area-normalized apparent lane`);
  }

  if (typeof result?.metrics?.estimatedDnTwDb === "number") {
    lines.push(`- DnT,w provenance: room-standardized apparent derivation via 10log10(0.32V/S)`);
  }

  if (typeof result?.metrics?.estimatedDnTADb === "number") {
    lines.push(`- DnT,A provenance: DnT,w + C on the standardized apparent lane`);
  }

  if (typeof result?.ratings?.field?.DnTAk === "number") {
    const dntakMode = getDnTAkSourceMode(result);
    lines.push(
      dntakMode === "exact_field_proxy_anchor"
        ? "- DnT,A,k provenance: official exact field proxy anchor on the local DnT,A lane"
        : dntakMode === "approximate_companion"
          ? "- DnT,A,k provenance: official approximate project-dependent source companion"
          : "- DnT,A,k provenance: source-backed field-side single number on the active airborne lane"
    );
  }

  return lines;
}
