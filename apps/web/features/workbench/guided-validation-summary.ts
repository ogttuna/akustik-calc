import type { AssemblyCalculation } from "@dynecho/shared";

import {
  IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE,
  isImpactOnlyLowConfidenceFloorLane
} from "./impact-only-low-confidence-floor-lane";
import type { StudyMode } from "./preset-definitions";
import {
  isReinforcedConcreteLowConfidenceFloorLane,
  REINFORCED_CONCRETE_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE
} from "./reinforced-concrete-low-confidence-floor-lane";
import {
  isSteelBoundSupportFormLane,
  STEEL_BOUND_SUPPORT_FORM_ROUTE_NOTE
} from "./steel-bound-support-form-lane";
import {
  describeAirborneValidationPosture,
  describeImpactValidationPosture,
  type ValidationPosture
} from "./validation-regime";

export type GuidedValidationSummary = {
  detail: string;
  posture: ValidationPosture["posture"];
  tone: "neutral" | "ready" | "warning";
  value: string;
};

function mapValidationTone(posture: ValidationPosture["posture"]): GuidedValidationSummary["tone"] {
  switch (posture) {
    case "exact":
      return "ready";
    case "bound":
    case "low_confidence":
      return "warning";
    case "estimate":
    case "inactive":
    default:
      return "neutral";
  }
}

function mapValidationValue(posture: ValidationPosture["posture"]): GuidedValidationSummary["value"] {
  switch (posture) {
    case "exact":
      return "Exact evidence";
    case "estimate":
      return "Scoped estimate";
    case "low_confidence":
      return "Low-confidence fallback";
    case "bound":
      return "Conservative bound";
    case "inactive":
    default:
      return "Waiting for supported lane";
  }
}

function buildGuidedValidationDetail(input: {
  posture: ValidationPosture;
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
}): string {
  const { posture, result, studyMode } = input;

  switch (posture.posture) {
    case "exact":
      return `${posture.label} is active. This route is anchored by exact or official source evidence instead of a screening-only estimate.`;
    case "estimate":
      return `${
        posture.label
      } is active. Read this as a supported ${studyMode === "floor" ? "floor" : "wall"} estimate, not as a measured claim.`;
    case "low_confidence":
      if (studyMode === "floor" && isImpactOnlyLowConfidenceFloorLane(result)) {
        return `${posture.label} is active. ${IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE}`;
      }
      if (studyMode === "floor" && isReinforcedConcreteLowConfidenceFloorLane(result)) {
        return `${posture.label} is active. ${REINFORCED_CONCRETE_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE}`;
      }
      return `${posture.label} is active. This is the final published-family fallback, so treat it as a last-resort estimate rather than a narrow solver match.`;
    case "bound":
      if (studyMode === "floor" && isSteelBoundSupportFormLane(result)) {
        return `${posture.label} is active. ${STEEL_BOUND_SUPPORT_FORM_ROUTE_NOTE}`;
      }
      return `${posture.label} is active. This route is conservative support only, so the current impact number should be read as a bound instead of a delivery-ready claim. Airborne companions can still stay live on the same floor lane.`;
    case "inactive":
    default:
      return studyMode === "floor"
        ? "Build a supported floor topology before reading delivery confidence."
        : "Build a supported wall topology before reading delivery confidence.";
  }
}

export function getGuidedValidationSummary(input: {
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
}): GuidedValidationSummary {
  const posture =
    input.studyMode === "floor"
      ? describeImpactValidationPosture(input.result)
      : describeAirborneValidationPosture(input.result);

  return {
    detail: buildGuidedValidationDetail({
      posture,
      result: input.result,
      studyMode: input.studyMode
    }),
    posture: posture.posture,
    tone: mapValidationTone(posture.posture),
    value: mapValidationValue(posture.posture)
  };
}
