import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

import {
  getGateARAirborneBuildingPredictionOutputDetail,
  getGateARAirborneBuildingPredictionSurface
} from "./airborne-building-prediction-surface";
import { getGateIAirborneFieldContextSurface } from "./airborne-field-context-surface";
import { isFieldAirborneOutput } from "./field-airborne-output";
import { FIELD_OUTPUT_DESIGN_GRADE_POSTURE_GUARD } from "./field-output-owner-policy-copy";
import {
  getGateAYAdvancedWallOutputDetail,
  getGateAYAdvancedWallSurface
} from "./advanced-wall-source-absent-surface";
import {
  getHeavyConcreteCombinedFormulaCorridorPosture,
  isHeavyConcreteCombinedFormulaCorridorImpact
} from "./heavy-concrete-combined-impact-corridor-view";
import {
  getGateSOpeningLeakCompositeOutputDetail,
  getGateSOpeningLeakCompositeSurface
} from "./opening-leak-composite-surface";
import {
  getWallTripleLeafCalibratedSolverOutputDetail,
  getWallTripleLeafCalibratedSolverSurface
} from "./wall-triple-leaf-calibrated-solver-surface";
import {
  getWallTripleLeafLocalSubstitutionOutputDetail,
  getWallTripleLeafLocalSubstitutionSurface
} from "./wall-triple-leaf-local-substitution-surface";
import {
  getOpenWebSupportedBandSimilarityOutputDetail,
  getOpenWebSupportedBandSimilarityPosture,
  isOpenWebSupportedBandSimilarityResult
} from "./open-web-supported-band-similarity-surface";
import {
  getOpenWebDirectFixedLiningOutputDetail,
  getOpenWebDirectFixedLiningPosture,
  isOpenWebDirectFixedLiningResult
} from "./open-web-direct-fixed-lining-surface";
import {
  getOpenBoxTimberSimilarityOutputDetail,
  getOpenBoxTimberSimilarityPosture,
  isOpenBoxTimberSimilarityResult
} from "./open-box-timber-similarity-surface";
import {
  getOpenBoxTimberRawBareOutputDetail,
  getOpenBoxTimberRawBarePosture,
  isOpenBoxTimberRawBareResult
} from "./open-box-timber-raw-bare-surface";
import {
  getCompanyInternalOpeningLeakFieldBuildingOutputDetail,
  getCompanyInternalOpeningLeakFieldBuildingSurface
} from "./opening-leak-field-building-surface";
import type { StudyMode } from "./preset-definitions";
import {
  describeAirborneValidationPosture,
  describeImpactValidationPosture,
  type ValidationPosture
} from "./validation-regime";
import { getRockwoolTripleLeafScreeningPolicyCopy } from "./rockwool-triple-leaf-screening-policy-copy";
import {
  getSteelFloorFormulaCorridorPosture,
  isSteelFloorFormulaCorridorImpact
} from "./steel-floor-formula-corridor-view";
import {
  getTimberCltDeltaLwFormulaCorridorPosture,
  isTimberCltDeltaLwFormulaCorridorImpact
} from "./timber-clt-delta-lw-corridor-view";

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
  const gateARBuildingSurface =
    studyMode === "wall" ? getGateARAirborneBuildingPredictionSurface(result) : null;
  const gateAYAdvancedWallSurface =
    studyMode === "wall" ? getGateAYAdvancedWallSurface(result) : null;
  const wallTripleLeafCalibratedSurface =
    studyMode === "wall" ? getWallTripleLeafCalibratedSolverSurface(result) : null;
  const wallTripleLeafLocalSubstitutionSurface =
    studyMode === "wall" ? getWallTripleLeafLocalSubstitutionSurface(result) : null;
  const gateSOpeningLeakSurface =
    studyMode === "wall" ? getGateSOpeningLeakCompositeSurface(result) : null;
  const companyInternalOpeningLeakFieldBuildingSurface =
    studyMode === "wall" ? getCompanyInternalOpeningLeakFieldBuildingSurface(result) : null;

  if (companyInternalOpeningLeakFieldBuildingSurface) {
    const detail =
      getCompanyInternalOpeningLeakFieldBuildingOutputDetail(output, result) ??
      companyInternalOpeningLeakFieldBuildingSurface.postureDetail;

    if (status === "live" && result?.supportedTargetOutputs.includes(output)) {
      return {
        detail,
        label: companyInternalOpeningLeakFieldBuildingSurface.label,
        tone: "accent"
      };
    }

    if (status === "unsupported") {
      return {
        detail,
        label: "Opening/leak field/building boundary",
        tone: "neutral"
      };
    }
  }

  if (gateARBuildingSurface) {
    const detail =
      getGateARAirborneBuildingPredictionOutputDetail(output, result) ??
      gateARBuildingSurface.postureDetail;

    if (status === "live" && (output === "R'w" || output === "DnT,w")) {
      return {
        detail,
        label: gateARBuildingSurface.label,
        tone: "accent"
      };
    }

    if (status === "unsupported") {
      return {
        detail,
        label: "Airborne building boundary",
        tone: "neutral"
      };
    }
  }

  if (gateAYAdvancedWallSurface) {
    const detail = getGateAYAdvancedWallOutputDetail(output, result) ?? gateAYAdvancedWallSurface.postureDetail;

    if (status === "live" && (output === "Rw" || output === "STC" || output === "C" || output === "Ctr")) {
      return {
        detail,
        label: gateAYAdvancedWallSurface.label,
        tone: "accent"
      };
    }

    if (status === "needs_input" || gateAYAdvancedWallSurface.origin === "needs_input") {
      return {
        detail,
        label: "Advanced wall input needed",
        tone: "warning"
      };
    }

    if (status === "unsupported") {
      return {
        detail,
        label: "Advanced wall boundary",
        tone: "neutral"
      };
    }
  }

  if (wallTripleLeafCalibratedSurface) {
    const detail =
      getWallTripleLeafCalibratedSolverOutputDetail(output, result) ??
      wallTripleLeafCalibratedSurface.postureDetail;

    if (status === "live" && (output === "Rw" || output === "STC" || output === "C" || output === "Ctr")) {
      return {
        detail,
        label: wallTripleLeafCalibratedSurface.label,
        tone: "success"
      };
    }

    if (status === "unsupported") {
      return {
        detail,
        label: "Wall triple-leaf calibrated boundary",
        tone: "neutral"
      };
    }
  }

  if (wallTripleLeafLocalSubstitutionSurface) {
    const detail =
      getWallTripleLeafLocalSubstitutionOutputDetail(output, result) ??
      wallTripleLeafLocalSubstitutionSurface.postureDetail;

    if (
      status === "live" &&
      result?.supportedTargetOutputs.includes(output) &&
      (output === "Rw" || output === "STC" || output === "C" || output === "Ctr")
    ) {
      return {
        detail,
        label: wallTripleLeafLocalSubstitutionSurface.label,
        tone: "accent"
      };
    }

    if (status === "unsupported") {
      return {
        detail,
        label: "Wall triple-leaf local substitution boundary",
        tone: "neutral"
      };
    }
  }

  if (gateSOpeningLeakSurface) {
    const detail = getGateSOpeningLeakCompositeOutputDetail(output, result) ?? gateSOpeningLeakSurface.postureDetail;

    if (status === "live" && (output === "Rw" || output === "STC")) {
      return {
        detail,
        label: gateSOpeningLeakSurface.label,
        tone: "accent"
      };
    }

    if (status === "needs_input" || gateSOpeningLeakSurface.origin === "needs_input") {
      return {
        detail,
        label: "Opening/leak input needed",
        tone: "warning"
      };
    }

    if (status === "unsupported") {
      return {
        detail,
        label: "Opening/leak boundary",
        tone: "neutral"
      };
    }
  }

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
        detail:
          `The field route is recognized, but it still needs geometry, room-volume, K, or imported field evidence before this metric can be defended. ${FIELD_OUTPUT_DESIGN_GRADE_POSTURE_GUARD}`,
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
        "DAC is intentionally packaging this as a one-sided support value. It is useful for scoping, but it should not be read as a claimed exact readout, and other live cards can still stay visible beside it.",
      label: "Conservative bound",
      tone: "warning"
    };
  }

  if (
    studyMode === "floor" &&
    status === "live" &&
    isOpenBoxTimberRawBareResult(result) &&
    (
      output === "Rw" ||
      output === "C" ||
      output === "Ctr" ||
      output === "Ln,w" ||
      output === "CI" ||
      output === "CI,50-2500" ||
      output === "Ln,w+CI"
    )
  ) {
    const posture = getOpenBoxTimberRawBarePosture();

    return {
      ...posture,
      detail: getOpenBoxTimberRawBareOutputDetail(output, result) ?? posture.detail
    };
  }

  if (
    studyMode === "floor" &&
    status === "live" &&
    isOpenBoxTimberSimilarityResult(result) &&
    (output === "Rw" || output === "C" || output === "Ln,w" || output === "CI" || output === "CI,50-2500" || output === "Ln,w+CI")
  ) {
    const posture = getOpenBoxTimberSimilarityPosture();

    return {
      ...posture,
      detail: getOpenBoxTimberSimilarityOutputDetail(output, result) ?? posture.detail
    };
  }

  if (
    studyMode === "floor" &&
    status === "live" &&
    isOpenWebDirectFixedLiningResult(result) &&
    (output === "Rw" || output === "Ln,w" || output === "CI" || output === "Ln,w+CI")
  ) {
    const posture = getOpenWebDirectFixedLiningPosture();

    return {
      ...posture,
      detail: getOpenWebDirectFixedLiningOutputDetail(output, result) ?? posture.detail
    };
  }

  if (
    studyMode === "floor" &&
    status === "live" &&
    isOpenWebSupportedBandSimilarityResult(result) &&
    (output === "Rw" || output === "Ln,w" || output === "CI" || output === "Ln,w+CI")
  ) {
    const posture = getOpenWebSupportedBandSimilarityPosture();

    return {
      ...posture,
      detail: getOpenWebSupportedBandSimilarityOutputDetail(output, result) ?? posture.detail
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
    const gateISurface = getGateIAirborneFieldContextSurface(result);

    if (gateISurface && isFieldAirborneOutput(output)) {
      return {
        detail: gateISurface.postureDetail,
        label: gateISurface.label,
        tone: "accent"
      };
    }

    return {
      detail:
        `This metric is carried through the active field continuation chain from the current lab or apparent curve. It is not being framed as an independent exact source row or measured field result. ${FIELD_OUTPUT_DESIGN_GRADE_POSTURE_GUARD}`,
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
    if (isHeavyConcreteCombinedFormulaCorridorImpact(result) && (output === "Ln,w" || output === "DeltaLw")) {
      return getHeavyConcreteCombinedFormulaCorridorPosture();
    }

    if (isSteelFloorFormulaCorridorImpact(result) && (output === "Ln,w" || output === "DeltaLw")) {
      return getSteelFloorFormulaCorridorPosture();
    }

    if (output === "DeltaLw" && isTimberCltDeltaLwFormulaCorridorImpact(result)) {
      return getTimberCltDeltaLwFormulaCorridorPosture();
    }

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
  const rockwoolTripleLeafScreeningPolicy = getRockwoolTripleLeafScreeningPolicyCopy(result);

  if (rockwoolTripleLeafScreeningPolicy) {
    return {
      detail: `${rockwoolTripleLeafScreeningPolicy.outputDetail} ${posture.detail}`,
      label: rockwoolTripleLeafScreeningPolicy.label,
      tone: "warning"
    };
  }

  return {
    detail: posture.detail,
    label: "Airborne screening lane",
    tone: getValidationTone(posture.posture)
  };
}
