import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

import { isFieldAirborneOutput } from "./field-airborne-output";
import type { StudyMode } from "./preset-definitions";
import {
  describeAirborneValidationPosture,
  describeImpactValidationPosture,
  type ValidationPosture
} from "./validation-regime";

export type SimpleWorkbenchOutputPostureTone = "accent" | "neutral" | "success" | "warning";

export type SimpleWorkbenchOutputPosture = {
  detail: string;
  label: string;
  tone: SimpleWorkbenchOutputPostureTone;
};

export type SimpleWorkbenchOutputPostureStatus = "bound" | "live" | "needs_input" | "unsupported";

const FIELD_IMPACT_OUTPUTS = new Set<RequestedOutputId>(["L'n,w", "L'nT,w", "L'nT,50", "LnT,A"]);
const COMPANION_OUTPUTS = new Set<RequestedOutputId>(["STC", "C", "Ctr", "CI", "CI,50-2500", "Ln,w+CI", "Dn,A", "DnT,A"]);

function getValidationTone(posture: ValidationPosture["posture"]): SimpleWorkbenchOutputPostureTone {
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
    default:
      return "neutral";
  }
}

export function getFallbackSimpleWorkbenchOutputPosture(
  status: SimpleWorkbenchOutputPostureStatus
): SimpleWorkbenchOutputPosture {
  switch (status) {
    case "live":
      return {
        detail: "The current route is carrying a readable output, but no explicit evidence-class snapshot was stored with this legacy proposal.",
        label: "Live route read",
        tone: "accent"
      };
    case "bound":
      return {
        detail: "The current route only stored a one-sided support value for this metric in the legacy snapshot.",
        label: "Conservative bound",
        tone: "warning"
      };
    case "needs_input":
      return {
        detail: "The route is staged, but the required project inputs were not yet packaged with this legacy snapshot.",
        label: "Awaiting route input",
        tone: "warning"
      };
    case "unsupported":
    default:
      return {
        detail: "The active route does not defend this metric on the stored topology.",
        label: "Unsupported on route",
        tone: "neutral"
      };
  }
}

export function buildSimpleWorkbenchOutputPosture(input: {
  output: RequestedOutputId;
  result: AssemblyCalculation | null;
  status: SimpleWorkbenchOutputPostureStatus;
  studyMode: StudyMode;
}): SimpleWorkbenchOutputPosture {
  const { output, result, status, studyMode } = input;

  if (status === "unsupported") {
    return {
      detail: "The active topology does not expose a defensible solver lane for this metric. Keep it visible, but frame it as out of scope on the current route.",
      label: "Unsupported on route",
      tone: "neutral"
    };
  }

  if (status === "needs_input") {
    if (isFieldAirborneOutput(output) || FIELD_IMPACT_OUTPUTS.has(output)) {
      return {
        detail: "The field route is recognized, but it still needs geometry, room-volume, K, or imported field evidence before this metric can be defended.",
        label: "Awaiting field input",
        tone: "warning"
      };
    }

    return {
      detail: "The route is close, but the missing context input or evidence upgrade listed beside this metric still needs to be supplied.",
      label: "Awaiting route input",
      tone: "warning"
    };
  }

  if (status === "bound") {
    return {
      detail:
        "DynEcho is intentionally packaging this as a one-sided support value. It is useful for scoping, but it should not be read as a claimed exact readout, and other live cards can still stay visible beside it.",
      label: "Conservative bound",
      tone: "warning"
    };
  }

  if (studyMode === "floor" && output === "Rw") {
    return {
      detail:
        "This airborne companion is carried on the active floor lane and can differ from the live airborne estimate shown elsewhere.",
      label: "Companion airborne",
      tone: "neutral"
    };
  }

  if (isFieldAirborneOutput(output) || FIELD_IMPACT_OUTPUTS.has(output) || output === "DnT,A,k") {
    return {
      detail: "This metric is carried through the active field continuation chain from the current lab or apparent curve. It is not being framed as an independent exact source row.",
      label: "Field continuation",
      tone: "accent"
    };
  }

  if (COMPANION_OUTPUTS.has(output)) {
    return {
      detail: "This number is a companion term derived from the primary live lane, not a separate solver route with its own evidence anchor.",
      label: "Companion carry-over",
      tone: "neutral"
    };
  }

  if (studyMode === "floor") {
    const posture = describeImpactValidationPosture(result);

    switch (posture.posture) {
      case "exact":
        return {
          detail: posture.detail,
          label: "Exact source row",
          tone: getValidationTone(posture.posture)
        };
      case "low_confidence":
        return {
          detail: posture.detail,
          label: "Low-confidence fallback",
          tone: getValidationTone(posture.posture)
        };
      case "estimate":
        return {
          detail: posture.detail,
          label: "Benchmark-backed estimate",
          tone: getValidationTone(posture.posture)
        };
      case "bound":
        return {
          detail: posture.detail,
          label: "Conservative bound",
          tone: getValidationTone(posture.posture)
        };
      case "inactive":
      default:
        return getFallbackSimpleWorkbenchOutputPosture(status);
    }
  }

  const posture = describeAirborneValidationPosture(result);
  return {
    detail: posture.detail,
    label: "Airborne screening lane",
    tone: getValidationTone(posture.posture)
  };
}
