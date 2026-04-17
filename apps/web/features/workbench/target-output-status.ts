import type { ImpactGuideDerivation } from "@dynecho/engine";
import type { AssemblyCalculation, RequestedOutputId } from "@dynecho/shared";

import {
  GUIDE_OUTPUTS,
  LIVE_OUTPUTS,
  RESEARCH_OUTPUTS,
  REQUESTED_OUTPUT_SUPPORT_NOTES,
  SCOPED_OUTPUTS,
  UPSTREAM_ONLY_OUTPUTS
} from "./workbench-data";
import {
  getFieldAirborneBlockingRequirement,
  getFieldAirborneLiveDetail,
  getFieldAirborneModeLabel,
  getFieldAirbornePendingDetail,
  getFieldAirbornePendingLabel,
  getFieldAirborneStatusLabel,
  isFieldAirborneOutput
} from "./field-airborne-output";
import {
  describeAirborneValidationPosture,
  describeImpactValidationPosture,
  getActiveValidationFamily,
  getActiveValidationMode
} from "./validation-regime";
import type { ValidationPosture } from "./validation-regime";
import {
  IMPACT_ONLY_LOW_CONFIDENCE_CTR_DETAIL,
  IMPACT_ONLY_LOW_CONFIDENCE_LNW_DETAIL,
  IMPACT_ONLY_LOW_CONFIDENCE_RW_DETAIL,
  IMPACT_ONLY_LOW_CONFIDENCE_UNAVAILABLE_DETAIL,
  isImpactOnlyLowConfidenceFloorLane,
  isImpactOnlyLowConfidenceUnavailableOutput
} from "./impact-only-low-confidence-floor-lane";
import {
  REINFORCED_CONCRETE_LOW_CONFIDENCE_CTR_DETAIL,
  REINFORCED_CONCRETE_LOW_CONFIDENCE_LNW_DETAIL,
  REINFORCED_CONCRETE_LOW_CONFIDENCE_RW_DETAIL,
  isReinforcedConcreteLowConfidenceFloorLane
} from "./reinforced-concrete-low-confidence-floor-lane";
import {
  isSteelBoundSupportFormLane,
  STEEL_BOUND_SUPPORT_FORM_AIRBORNE_DETAIL,
  STEEL_BOUND_SUPPORT_FORM_LNW_DETAIL
} from "./steel-bound-support-form-lane";

export type TargetOutputStatus = {
  kind:
    | "engine_live"
    | "engine_bound"
    | "guide_ready"
    | "research"
    | "unavailable"
    | "parity_import"
    | "pending_input";
  label: string;
  note: string;
  output: RequestedOutputId;
  tone: "accent" | "neutral" | "success" | "warning";
};

export type TargetOutputCorridor = {
  detail: string;
  familyLabel?: string;
  laneLabel: string;
  modeLabel?: string;
  tone: "accent" | "neutral" | "success" | "warning";
};

const FIELD_OUTPUTS = new Set<RequestedOutputId>(["L'n,w", "L'nT,w", "L'nT,50"]);
const IMPACT_CORRIDOR_OUTPUTS = new Set<RequestedOutputId>(["Ln,w", "DeltaLw", "CI", "CI,50-2500", "Ln,w+CI", "LnT,A"]);

function hasGuideValue(
  output: RequestedOutputId,
  guideResult: ImpactGuideDerivation | null
): { boundOnly: boolean; value: boolean } {
  if (!guideResult) {
    return { boundOnly: false, value: false };
  }

  if (output === "L'nT,50") {
    return { boundOnly: false, value: typeof guideResult.LPrimeNT50 === "number" };
  }

  if (output === "L'nT,w") {
    return {
      boundOnly:
        typeof guideResult.LPrimeNTw !== "number" && typeof guideResult.LPrimeNTwUpperBound === "number",
      value:
        typeof guideResult.LPrimeNTw === "number" || typeof guideResult.LPrimeNTwUpperBound === "number"
    };
  }

  if (output === "L'n,w") {
    return {
      boundOnly:
        typeof guideResult.LPrimeNW !== "number" && typeof guideResult.LPrimeNWUpperBound === "number",
      value:
        typeof guideResult.LPrimeNW === "number" || typeof guideResult.LPrimeNWUpperBound === "number"
    };
  }

  if (output === "CI,50-2500") {
    return { boundOnly: false, value: typeof guideResult.CI50_2500 === "number" };
  }

  if (output === "Ln,w+CI") {
    return { boundOnly: false, value: typeof guideResult.LnWPlusCI === "number" };
  }

  if (output === "CI") {
    return { boundOnly: false, value: typeof guideResult.CI === "number" };
  }

  return { boundOnly: false, value: false };
}

function hasEngineBoundValue(output: RequestedOutputId, result: AssemblyCalculation | null): boolean {
  const bound = result?.lowerBoundImpact ?? null;

  if (!bound) {
    return false;
  }

  if (output === "Ln,w") {
    return typeof bound.LnWUpperBound === "number";
  }

  if (output === "Ln,w+CI") {
    return typeof bound.LnWPlusCIUpperBound === "number";
  }

  if (output === "L'n,w") {
    return typeof bound.LPrimeNWUpperBound === "number";
  }

  if (output === "L'nT,w") {
    return typeof bound.LPrimeNTwUpperBound === "number";
  }

  if (output === "DeltaLw") {
    return typeof bound.DeltaLwLowerBound === "number";
  }

  return false;
}

function getEngineLiveLabel(output: RequestedOutputId, result: AssemblyCalculation): string {
  if (isFieldAirborneOutput(output)) {
    return getFieldAirborneStatusLabel(output, result);
  }

  if (output === "Ln,w" && hasEngineBoundValue(output, result) && isSteelBoundSupportFormLane(result)) {
    return "Crossover bound";
  }

  if (LIVE_OUTPUTS.has(output)) {
    return "Live";
  }

  if (hasEngineBoundValue(output, result)) {
    return "Bound support";
  }

  if (result.floorSystemMatch) {
    return "Exact live";
  }

  if (result.floorSystemEstimate) {
    return "Family estimate";
  }

  if (result.impactCatalogMatch?.impact) {
    return "Official product";
  }

  if (SCOPED_OUTPUTS.has(output) || GUIDE_OUTPUTS.has(output)) {
    return "Scoped live";
  }

  return "Live";
}

function getPendingLabel(output: RequestedOutputId, result: AssemblyCalculation | null): string {
  if (isFieldAirborneOutput(output)) {
    return getFieldAirbornePendingLabel(output, result);
  }

  if (LIVE_OUTPUTS.has(output)) {
    if (output === "R'w") {
      return "Need field mode";
    }

    if (output === "DnT,A,k") {
      return "Need field source";
    }

    if (output === "DnT,w" || output === "DnT,A") {
      return "Need geometry + V";
    }

    if (output === "Dn,w" || output === "Dn,A") {
      return "Need geometry";
    }

    return "Need valid stack";
  }

  if (output === "LnT,A") {
    return "Need exact octave field bands";
  }

  if (SCOPED_OUTPUTS.has(output)) {
    return "Need supported topology";
  }

  if (GUIDE_OUTPUTS.has(output)) {
    if (output === "L'nT,50") {
      return "Need field inputs";
    }

    if (output === "L'nT,w" || output === "L'n,w") {
      return "Need K or field path";
    }

    if (output === "CI,50-2500") {
      return "Need CI,50-2500";
    }

    if (output === "Ln,w+CI" || output === "CI") {
      return "Need CI";
    }
  }

  return "Pending";
}

function getPostureTone(posture: ValidationPosture["posture"]): "accent" | "neutral" | "success" | "warning" {
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

function getFieldContinuationDetail(
  output: RequestedOutputId,
  result: AssemblyCalculation | null,
  guideResult: ImpactGuideDerivation | null,
  status: TargetOutputStatus
): string {
  const continuation = result?.dynamicImpactTrace?.fieldContinuation ?? "none";
  const continuationLabel = result?.dynamicImpactTrace?.fieldContinuationLabel ?? "Field continuation staged";

  if (continuation === "explicit_k_correction") {
    return `${continuationLabel} is active. ${output} is currently carried from lab-side Ln,w through an explicit K correction instead of a full in-situ band solver.`;
  }

  if (continuation === "direct_flanking_energy_sum") {
    return `${continuationLabel} is active. ${output} is currently carried through direct plus flanking energy summation before re-rating.`;
  }

  if (continuation === "standardized_room_volume") {
    return `${continuationLabel} is active. ${output} is currently standardized with receiving-room volume in line with the current field-volume path.`;
  }

  if (continuation === "bound_room_volume") {
    return `${continuationLabel} is active, but only as a conservative field-side bound.`;
  }

  if (continuation === "local_guide_simple") {
    return `${continuationLabel} is active. ${output} is currently being carried by the Turkish simple-guide branch with explicit K and Hd semantics.`;
  }

  if (continuation === "local_guide_small_room") {
    return `${continuationLabel} is active. ${output} is currently being carried by the Turkish small-room guide shortcut instead of the generic room-volume normalization.`;
  }

  if (guideResult) {
    return `Guide/manual carry-over is armed for ${output}. The current floor lane can continue once the required K, room-volume, or low-frequency companion inputs are present.`;
  }

  return `${continuationLabel}. ${status.label} is still the current state for this output.`;
}

export function getTargetOutputStatus(input: {
  guideResult: ImpactGuideDerivation | null;
  output: RequestedOutputId;
  result: AssemblyCalculation | null;
}): TargetOutputStatus {
  const { guideResult, output, result } = input;
  const guideState = hasGuideValue(output, guideResult);
  const supportNote = REQUESTED_OUTPUT_SUPPORT_NOTES[output];
  const isImpactOnlyLowConfidenceLane = isImpactOnlyLowConfidenceFloorLane(result);
  const isReinforcedConcreteLowConfidenceLane =
    isReinforcedConcreteLowConfidenceFloorLane(result);
  const isSteelSupportFormBoundLane = isSteelBoundSupportFormLane(result);
  const fieldAirborneRequirement = isFieldAirborneOutput(output)
    ? getFieldAirborneBlockingRequirement(output, result)
    : null;

  if (RESEARCH_OUTPUTS.has(output)) {
    return {
      kind: "research",
      label: "Research lane",
      note: supportNote,
      output,
      tone: "neutral"
    };
  }

  if (result?.supportedTargetOutputs.includes(output)) {
    const label = getEngineLiveLabel(output, result);
    const customEngineLiveNote = isFieldAirborneOutput(output)
      ? getFieldAirborneLiveDetail(output, result)
      : isReinforcedConcreteLowConfidenceLane && output === "Ln,w"
        ? REINFORCED_CONCRETE_LOW_CONFIDENCE_LNW_DETAIL
        : isReinforcedConcreteLowConfidenceLane && output === "Rw"
          ? REINFORCED_CONCRETE_LOW_CONFIDENCE_RW_DETAIL
          : isReinforcedConcreteLowConfidenceLane && output === "Ctr"
            ? REINFORCED_CONCRETE_LOW_CONFIDENCE_CTR_DETAIL
            : isImpactOnlyLowConfidenceLane && output === "Ln,w"
              ? IMPACT_ONLY_LOW_CONFIDENCE_LNW_DETAIL
              : isImpactOnlyLowConfidenceLane && output === "Rw"
                ? IMPACT_ONLY_LOW_CONFIDENCE_RW_DETAIL
                : isImpactOnlyLowConfidenceLane && output === "Ctr"
                  ? IMPACT_ONLY_LOW_CONFIDENCE_CTR_DETAIL
                  : isSteelSupportFormBoundLane && output === "Ln,w"
                    ? STEEL_BOUND_SUPPORT_FORM_LNW_DETAIL
                    : isSteelSupportFormBoundLane &&
                        (output === "Rw" || output === "Ctr")
                      ? STEEL_BOUND_SUPPORT_FORM_AIRBORNE_DETAIL
                      : null;

    return {
      kind: hasEngineBoundValue(output, result) ? "engine_bound" : "engine_live",
      label,
      note:
        customEngineLiveNote ??
        (label === "Bound support"
          ? `${supportNote} The current stack only resolves a conservative bound for this output.`
          : supportNote),
      output,
      tone: hasEngineBoundValue(output, result) ? "accent" : "success"
    };
  }

  if (guideState.value) {
    const label = guideState.boundOnly ? "Guide bound" : "Guide ready";

    return {
      kind: "guide_ready",
      label,
      note:
        label === "Guide bound"
          ? `${supportNote} The current guide supplement only yields a conservative upper-bound form.`
          : `${supportNote} The current value comes from the explicit guide/manual supplement lane.`,
      output,
      tone: guideState.boundOnly ? "accent" : "success"
    };
  }

  if (result?.unsupportedTargetOutputs.includes(output)) {
    if (fieldAirborneRequirement) {
      return {
        kind: "pending_input",
        label: getFieldAirbornePendingLabel(output, result),
        note: getFieldAirbornePendingDetail(output, result),
        output,
        tone: "warning"
      };
    }

    return {
      kind: "unavailable",
      label:
        isImpactOnlyLowConfidenceLane && isImpactOnlyLowConfidenceUnavailableOutput(output)
          ? "Impact-only fallback"
          : "Unavailable on current path",
      note:
        isImpactOnlyLowConfidenceLane && isImpactOnlyLowConfidenceUnavailableOutput(output)
          ? IMPACT_ONLY_LOW_CONFIDENCE_UNAVAILABLE_DETAIL
          : `${supportNote} DynEcho is keeping this requested output explicit instead of inventing a number for the current stack/path.`,
      output,
      tone: "warning"
    };
  }

  if (UPSTREAM_ONLY_OUTPUTS.has(output)) {
    return {
      kind: "parity_import",
      label: "Parity import",
      note: supportNote,
      output,
      tone: "warning"
    };
  }

  return {
    kind: "pending_input",
    label: getPendingLabel(output, result),
    note: isFieldAirborneOutput(output) ? getFieldAirbornePendingDetail(output, result) : supportNote,
    output,
    tone: GUIDE_OUTPUTS.has(output) || SCOPED_OUTPUTS.has(output) ? "accent" : "warning"
  };
}

export function getTargetOutputCorridor(input: {
  guideResult: ImpactGuideDerivation | null;
  output: RequestedOutputId;
  result: AssemblyCalculation | null;
}): TargetOutputCorridor {
  const { guideResult, output, result } = input;
  const status = getTargetOutputStatus(input);
  const activeFamily = getActiveValidationFamily(result);
  const activeMode = getActiveValidationMode(result);
  const isReinforcedConcreteLowConfidenceLane =
    isReinforcedConcreteLowConfidenceFloorLane(result);

  if (RESEARCH_OUTPUTS.has(output)) {
    return {
      detail: "No standards-backed ASTM adapter is live for this output yet.",
      laneLabel: "Research scope",
      tone: "neutral"
    };
  }

  if (isFieldAirborneOutput(output)) {
    return {
      detail:
        status.kind === "engine_live"
          ? getFieldAirborneLiveDetail(output, result)
          : status.note,
      familyLabel: result?.dynamicAirborneTrace?.detectedFamilyLabel,
      laneLabel: "Field airborne lane",
      modeLabel:
        result?.airborneOverlay?.contextMode === "field_between_rooms" ||
        result?.airborneOverlay?.contextMode === "building_prediction"
          ? getFieldAirborneModeLabel(result)
          : status.label,
      tone:
        status.label === "Exact source"
          ? "success"
          : status.kind === "pending_input" || status.kind === "unavailable"
            ? status.tone
            : "accent"
    };
  }

  if (LIVE_OUTPUTS.has(output)) {
    const airbornePosture = describeAirborneValidationPosture(result);

    return {
      detail:
        isReinforcedConcreteLowConfidenceLane &&
        (output === "Rw" || output === "Ctr")
          ? status.note
          : airbornePosture.detail,
      familyLabel: result?.dynamicAirborneTrace?.detectedFamilyLabel,
      laneLabel: "Airborne lane",
      modeLabel: airbornePosture.label,
      tone: getPostureTone(airbornePosture.posture)
    };
  }

  if (FIELD_OUTPUTS.has(output)) {
    const isFieldMode = activeMode?.posture === "field";

    return {
      detail: getFieldContinuationDetail(output, result, guideResult, status),
      familyLabel: activeFamily?.label,
      laneLabel: status.kind === "guide_ready" ? "Guide/manual carry-over" : "Field continuation",
      modeLabel: isFieldMode ? activeMode.label : result?.dynamicImpactTrace?.fieldContinuationLabel ?? status.label,
      tone:
        status.kind === "guide_ready"
          ? status.tone
          : result?.dynamicImpactTrace?.fieldContinuation === "bound_room_volume"
            ? "warning"
            : result?.dynamicImpactTrace?.fieldContinuation && result.dynamicImpactTrace.fieldContinuation !== "none"
              ? "accent"
              : status.tone
    };
  }

  if (IMPACT_CORRIDOR_OUTPUTS.has(output)) {
    const impactPosture = describeImpactValidationPosture(result);

    return {
      detail:
        status.kind === "guide_ready"
          ? `Guide/manual supplement is currently shaping ${output}.`
          : isReinforcedConcreteLowConfidenceLane && output === "Ln,w"
            ? status.note
          : impactPosture.detail,
      familyLabel: activeFamily?.label,
      laneLabel: status.kind === "guide_ready" ? "Guide/manual supplement" : "Impact floor corridor",
      modeLabel: activeMode?.label ?? impactPosture.label,
      tone:
        status.kind === "guide_ready"
          ? status.tone
          : status.kind === "engine_bound"
            ? "warning"
            : getPostureTone(impactPosture.posture)
    };
  }

  return {
    detail: status.note,
    laneLabel: "Requested output lane",
    modeLabel: status.label,
    tone: status.tone
  };
}

export function summarizeTargetOutputs(input: {
  guideResult: ImpactGuideDerivation | null;
  outputs: readonly RequestedOutputId[];
  result: AssemblyCalculation | null;
}) {
  const statuses = input.outputs.map((output) =>
    getTargetOutputStatus({
      guideResult: input.guideResult,
      output,
      result: input.result
    })
  );

  return {
    engineBound: statuses.filter((status) => status.kind === "engine_bound"),
    engineLive: statuses.filter((status) => status.kind === "engine_live"),
    guideReady: statuses.filter((status) => status.kind === "guide_ready"),
    parityImport: statuses.filter((status) => status.kind === "parity_import"),
    pendingInput: statuses.filter((status) => status.kind === "pending_input"),
    research: statuses.filter((status) => status.kind === "research"),
    statuses,
    unavailable: statuses.filter((status) => status.kind === "unavailable")
  };
}
