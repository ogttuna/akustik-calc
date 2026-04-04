import { formatDecimal } from "@/lib/format";

import type { AssemblyCalculation } from "@dynecho/shared";

import { getFieldAirborneProvenanceSummary } from "./field-airborne-provenance";
import {
  describeAirborneValidationPosture,
  describeImpactValidationPosture,
  getActiveValidationFamily,
  getActiveValidationMode
} from "./validation-regime";
import type { ValidationPosture } from "./validation-regime";
import { getDutchResidentialDnTAkComplianceSummary } from "./dutch-airborne-compliance";
import { parseWorkbenchNumber } from "./parse-number";

export type ScenarioCorridorSummary = {
  activeFamilyLabel?: string;
  activeModeLabel?: string;
  airborneLabel: string;
  airborneProvenanceDetail?: string;
  airborneProvenanceLabel?: string;
  impactHeadline: string;
  impactLabel: string;
  impactPosture: ReturnType<typeof describeImpactValidationPosture>;
  airbornePosture: ReturnType<typeof describeAirborneValidationPosture>;
  fieldContinuationLabel?: string;
  narrative: string;
};

export type ScenarioDecisionSummary = {
  briefDeltaLabel?: string;
  briefStatusLabel: string;
  briefStatusTone: "accent" | "neutral" | "success" | "warning";
  dutchReferenceDeltaLabel?: string;
  dutchReferenceStatusLabel?: string;
  dutchReferenceStatusTone?: "accent" | "success" | "warning";
  liveDeltaLabel: string;
  liveStatusLabel: string;
  liveStatusTone: "accent" | "neutral" | "success" | "warning";
};

type ComparisonState =
  | { delta: number; kind: "numeric" }
  | { kind: "basis_changed" }
  | { kind: "unavailable" };

export function getValidationPostureTone(
  posture: ValidationPosture["posture"]
): "accent" | "neutral" | "success" | "warning" {
  switch (posture) {
    case "exact":
      return "success";
    case "estimate":
      return "accent";
    case "low_confidence":
      return "warning";
    case "bound":
      return "warning";
    case "inactive":
      return "neutral";
  }
}

export function getScenarioCorridorSummary(
  result: AssemblyCalculation | null | undefined
): ScenarioCorridorSummary {
  const impactPosture = describeImpactValidationPosture(result ?? null);
  const airbornePosture = describeAirborneValidationPosture(result ?? null);
  const activeFamily = getActiveValidationFamily(result ?? null);
  const activeMode = getActiveValidationMode(result ?? null);
  const airborneProvenance = getFieldAirborneProvenanceSummary(result ?? null);
  const fieldContinuationLabel =
    result?.dynamicImpactTrace && result.dynamicImpactTrace.fieldContinuation !== "none"
      ? result.dynamicImpactTrace.fieldContinuationLabel
      : undefined;

  const impactHeadline =
    typeof result?.impact?.LnTA === "number"
      ? `LnT,A ${formatDecimal(result.impact.LnTA)} dB`
      : typeof result?.impact?.LnW === "number"
      ? `Ln,w ${formatDecimal(result.impact.LnW)} dB`
      : typeof result?.impact?.LPrimeNTw === "number"
        ? `L'nT,w ${formatDecimal(result.impact.LPrimeNTw)} dB`
        : typeof result?.impact?.LPrimeNW === "number"
          ? `L'n,w ${formatDecimal(result.impact.LPrimeNW)} dB`
          : typeof result?.lowerBoundImpact?.LnWUpperBound === "number"
            ? `Ln,w <= ${formatDecimal(result.lowerBoundImpact.LnWUpperBound)} dB`
            : "Impact headline unavailable";

  return {
    activeFamilyLabel: activeFamily?.label,
    activeModeLabel: activeMode?.label,
    airborneLabel: airbornePosture.label,
    airborneProvenanceDetail: airborneProvenance?.detail,
    airborneProvenanceLabel: airborneProvenance?.label,
    airbornePosture,
    fieldContinuationLabel,
    impactHeadline,
    impactLabel: impactPosture.label,
    impactPosture,
    narrative: !result
      ? "No live scenario result yet."
      : `Impact corridor is ${activeMode?.label ?? impactPosture.label}${
          activeFamily ? ` on ${activeFamily.label}` : ""
        }. Airborne lane is ${airbornePosture.label}${
          airborneProvenance ? ` with ${airborneProvenance.label.toLowerCase()}` : ""
        }.`
  };
}

function formatSignedDb(value: number): string {
  return `${value >= 0 ? "+" : ""}${formatDecimal(value)} dB`;
}

function parseTarget(value: string | null | undefined): number | null {
  const parsed = parseWorkbenchNumber(value);
  return typeof parsed === "number" ? parsed : null;
}

function getImpactComparableMetric(
  result: AssemblyCalculation | null | undefined,
  options: { preferDutchExact?: boolean } = {}
):
  | { label: string; value: number }
  | null {
  if (options.preferDutchExact && typeof result?.impact?.LnTA === "number") {
    return { label: "LnT,A", value: result.impact.LnTA };
  }

  if (typeof result?.impact?.LnW === "number") {
    return { label: "Ln,w", value: result.impact.LnW };
  }

  if (typeof result?.impact?.LPrimeNTw === "number") {
    return { label: "L'nT,w", value: result.impact.LPrimeNTw };
  }

  if (typeof result?.impact?.LPrimeNW === "number") {
    return { label: "L'n,w", value: result.impact.LPrimeNW };
  }

  if (typeof result?.lowerBoundImpact?.LnWUpperBound === "number") {
    return { label: "Ln,w upper bound", value: result.lowerBoundImpact.LnWUpperBound };
  }

  return null;
}

function summarizeDecisionState(input: {
  context: "brief" | "live";
  hasTargets?: boolean;
  states: ComparisonState[];
}): {
  label: string;
  tone: "accent" | "neutral" | "success" | "warning";
} {
  const { context, hasTargets = true, states } = input;
  const numericStates = states.filter((state): state is Extract<ComparisonState, { kind: "numeric" }> => state.kind === "numeric");
  const hasSpecialStates = states.some((state) => state.kind !== "numeric");
  const hasPositive = numericStates.some((state) => state.delta > 0);
  const hasNegative = numericStates.some((state) => state.delta < 0);
  const allZero = numericStates.length > 0 && numericStates.every((state) => state.delta === 0);

  if (context === "brief" && !hasTargets) {
    return { label: "Brief not armed", tone: "neutral" };
  }

  if (numericStates.length === 0) {
    if (hasSpecialStates) {
      return {
        label: context === "live" ? "Partial live read" : "Partial brief read",
        tone: "accent"
      };
    }

    return {
      label: context === "live" ? "Live read unavailable" : "Brief read unavailable",
      tone: "neutral"
    };
  }

  if (hasSpecialStates) {
    return {
      label: context === "live" ? "Partial live read" : "Partial brief read",
      tone: "accent"
    };
  }

  if (allZero) {
    return {
      label: context === "live" ? "At live parity" : "On brief line",
      tone: context === "live" ? "neutral" : "success"
    };
  }

  if (hasPositive && !hasNegative) {
    return {
      label: context === "live" ? "Ahead of live" : "Ahead of brief",
      tone: "success"
    };
  }

  if (hasNegative && !hasPositive) {
    return {
      label: context === "live" ? "Below live" : "Below brief",
      tone: "warning"
    };
  }

  return {
    label: context === "live" ? "Trade-off versus live" : "Mixed brief fit",
    tone: context === "live" ? "accent" : "warning"
  };
}

export function getScenarioDecisionSummary(input: {
  baselineResult: AssemblyCalculation | null | undefined;
  candidateResult: AssemblyCalculation | null | undefined;
  targetLnwDb?: string | null;
  targetRwDb?: string | null;
}): ScenarioDecisionSummary {
  const { baselineResult, candidateResult, targetLnwDb, targetRwDb } = input;
  const candidateRw = candidateResult?.metrics.estimatedRwDb ?? null;
  const baselineRw = baselineResult?.metrics.estimatedRwDb ?? null;
  const candidateImpact = getImpactComparableMetric(candidateResult, { preferDutchExact: true });
  const baselineImpact = getImpactComparableMetric(baselineResult, { preferDutchExact: true });
  const candidateBriefImpact = getImpactComparableMetric(candidateResult);
  const targetRw = parseTarget(targetRwDb);
  const targetLnw = parseTarget(targetLnwDb);
  const liveStates: ComparisonState[] = [];
  const briefStates: ComparisonState[] = [];

  const liveParts = [];

  if (candidateRw !== null && baselineRw !== null) {
    const rwDelta = candidateRw - baselineRw;
    liveParts.push(`Rw ${formatSignedDb(rwDelta)}`);
    liveStates.push({ delta: rwDelta, kind: "numeric" });
  } else {
    liveParts.push("Rw unavailable");
    liveStates.push({ kind: "unavailable" });
  }

  if (candidateImpact && baselineImpact && candidateImpact.label === baselineImpact.label) {
    const impactDelta = baselineImpact.value - candidateImpact.value;
    liveParts.push(`${candidateImpact.label} ${formatSignedDb(impactDelta)}`);
    liveStates.push({ delta: impactDelta, kind: "numeric" });
  } else if (candidateImpact || baselineImpact) {
    liveParts.push("Impact basis changed");
    liveStates.push({ kind: "basis_changed" });
  } else {
    liveParts.push("Impact delta unavailable");
    liveStates.push({ kind: "unavailable" });
  }

  const briefParts = [];

  if (targetRw !== null) {
    if (candidateRw !== null) {
      const rwBriefDelta = candidateRw - targetRw;
      briefParts.push(`Rw ${formatSignedDb(rwBriefDelta)}`);
      briefStates.push({ delta: rwBriefDelta, kind: "numeric" });
    } else {
      briefStates.push({ kind: "unavailable" });
    }
  }

  if (targetLnw !== null) {
    if (candidateBriefImpact) {
      const impactBriefDelta = targetLnw - candidateBriefImpact.value;
      briefParts.push(`${candidateBriefImpact.label} ${formatSignedDb(impactBriefDelta)}`);
      briefStates.push({ delta: impactBriefDelta, kind: "numeric" });
    } else {
      briefStates.push({ kind: "unavailable" });
    }
  }

  const liveStatus = summarizeDecisionState({
    context: "live",
    states: liveStates
  });
  const briefStatus = summarizeDecisionState({
    context: "brief",
    hasTargets: targetRw !== null || targetLnw !== null,
    states: briefStates
  });
  const dutchReferenceSummary = getDutchResidentialDnTAkComplianceSummary(candidateResult ?? null);

  return {
    briefDeltaLabel:
      briefParts.filter((part): part is string => Boolean(part)).length > 0
        ? `Brief gap: ${briefParts.filter((part): part is string => Boolean(part)).join(" · ")}`
        : undefined,
    briefStatusLabel: briefStatus.label,
    briefStatusTone: briefStatus.tone,
    dutchReferenceDeltaLabel: dutchReferenceSummary?.detail,
    dutchReferenceStatusLabel: dutchReferenceSummary?.statusLabel,
    dutchReferenceStatusTone: dutchReferenceSummary?.tone,
    liveDeltaLabel: `Vs live: ${liveParts.join(" · ")}`,
    liveStatusLabel: liveStatus.label,
    liveStatusTone: liveStatus.tone
  };
}
