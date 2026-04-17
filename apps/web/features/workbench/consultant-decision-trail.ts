import type { ImpactGuideDerivation } from "@dynecho/engine";
import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

import { getFieldAirborneProvenanceSummary } from "./field-airborne-provenance";
import { summarizeTargetOutputs } from "./target-output-status";
import {
  describeAirborneValidationPosture,
  describeImpactValidationPosture,
  getActiveValidationFamily,
  getActiveValidationMode
} from "./validation-regime";

type DecisionTrailTone = "accent" | "neutral" | "success" | "warning";

export type ConsultantDecisionTrailItem = {
  detail: string;
  label: string;
  tone: DecisionTrailTone;
};

export type ConsultantDecisionTrail = {
  headline: string;
  items: ConsultantDecisionTrailItem[];
};

function getPostureTone(posture: "bound" | "estimate" | "exact" | "inactive" | "low_confidence"): DecisionTrailTone {
  switch (posture) {
    case "exact":
      return "success";
    case "estimate":
      return "accent";
    case "bound":
      return "warning";
    case "low_confidence":
      return "warning";
    case "inactive":
      return "neutral";
  }
}

function summarizeAssumptions(note: string): string {
  const normalized = note.replace(/\s+/g, " ").trim();

  if (normalized.length === 0) {
    return "No explicit assumption note is written yet.";
  }

  return normalized.length > 180 ? `${normalized.slice(0, 177).trimEnd()}...` : normalized;
}

function formatOutputCoverage(input: {
  guideResult: ImpactGuideDerivation | null;
  outputs: readonly RequestedOutputId[];
  result: AssemblyCalculation | null;
  screeningFallbackActive?: boolean;
}): ConsultantDecisionTrailItem {
  const summary = summarizeTargetOutputs(input);
  const activeCount = summary.engineLive.length + summary.engineBound.length + summary.guideReady.length;
  const blocked = [...summary.pendingInput, ...summary.unavailable, ...summary.parityImport, ...summary.research];
  const blockedLabels = blocked.map((status) => status.output);

  if (input.outputs.length === 0) {
    return {
      detail: "No requested outputs are armed, so the export cannot explain scope discipline yet.",
      label: "Output coverage",
      tone: "warning"
    };
  }

  return {
    detail:
      `${input.outputs.length} requested output${input.outputs.length === 1 ? "" : "s"} are armed. ` +
      `${activeCount} currently resolve through ${
        input.screeningFallbackActive ? "live, bound, guide-backed, or screening-fallback lanes" : "live, bound, or guide-backed lanes"
      }.` +
      (blockedLabels.length > 0
        ? ` Still explicit: ${blockedLabels.join(", ")}.`
        : " No requested output is currently left as an unresolved placeholder.") +
      (input.screeningFallbackActive ? " Keep the current package in screening mode until a narrower lane is proven." : ""),
    label: "Output coverage",
    tone: input.screeningFallbackActive ? "warning" : blockedLabels.length > 0 ? "warning" : activeCount > 0 ? "success" : "accent"
  };
}

export function getConsultantDecisionTrail(input: {
  briefNote?: string;
  guideResult: ImpactGuideDerivation | null;
  outputs: readonly RequestedOutputId[];
  result: AssemblyCalculation | null;
  warnings?: readonly string[];
}): ConsultantDecisionTrail {
  const { briefNote, guideResult, outputs, result, warnings = [] } = input;
  const impactPosture = describeImpactValidationPosture(result);
  const airbornePosture = describeAirborneValidationPosture(result);
  const activeFamily = getActiveValidationFamily(result);
  const activeMode = getActiveValidationMode(result);
  const fieldAirborneProvenance = getFieldAirborneProvenanceSummary(result);
  const screeningFallbackActive = Boolean(result && impactPosture.posture === "low_confidence");

  const items: ConsultantDecisionTrailItem[] = [
    {
      detail: !result
        ? impactPosture.detail
        : `${activeMode?.label ?? impactPosture.label}${activeFamily ? ` on ${activeFamily.label}` : ""}. ${impactPosture.detail}${
            screeningFallbackActive ? " Keep the current floor-side read in screening territory and do not treat it as delivery-ready." : ""
          }`,
      label: "Impact corridor",
      tone: getPostureTone(impactPosture.posture)
    },
    {
      detail: airbornePosture.detail,
      label: "Airborne corridor",
      tone: getPostureTone(airbornePosture.posture)
    },
    ...(screeningFallbackActive
      ? [
          {
            detail:
              "Low-confidence fallback remains active on the current floor-side route. Keep nearby-row evidence, warnings, and corridor notes attached, and do not present the package as delivery-ready.",
            label: "Delivery posture",
            tone: "warning" as const
          }
        ]
      : []),
    formatOutputCoverage({
      guideResult,
      outputs,
      result,
      screeningFallbackActive
    })
  ];

  if (fieldAirborneProvenance) {
    items.push({
      detail: `${fieldAirborneProvenance.detail} ${fieldAirborneProvenance.modeLabel} is the active route label.`,
      label: "Field provenance",
      tone: "accent"
    });
  }

  if (briefNote !== undefined) {
    items.push({
      detail: summarizeAssumptions(briefNote),
      label: "Assumption log",
      tone: briefNote.trim().length > 0 ? "success" : "warning"
    });
  }

  if (warnings.length > 0) {
    items.push({
      detail: `${warnings.length} active warning${warnings.length === 1 ? "" : "s"}. First signal: ${warnings[0]}`,
      label: "Active warnings",
      tone: "warning"
    });
  }

  return {
    headline: !result
      ? "No live decision trail yet. Build a valid stack before treating the export as a consultant brief."
      : `${impactPosture.label}${activeFamily ? ` on ${activeFamily.label}` : ""} is the current floor-side ${
          screeningFallbackActive ? "screening posture" : "posture"
        }. ${
          fieldAirborneProvenance
            ? `${fieldAirborneProvenance.label} is the active field-airborne reading.`
            : `${airbornePosture.label} is the current airborne reading.`
        }`,
    items
  };
}

export function getConsultantDecisionTrailReportLines(input: {
  briefNote?: string;
  guideResult: ImpactGuideDerivation | null;
  outputs: readonly RequestedOutputId[];
  result: AssemblyCalculation | null;
  warnings?: readonly string[];
}): string[] {
  const trail = getConsultantDecisionTrail(input);

  return [`- Decision trail headline: ${trail.headline}`, ...trail.items.map((item) => `- ${item.label}: ${item.detail}`)];
}
