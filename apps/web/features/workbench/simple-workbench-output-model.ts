import {
  getFloorSystemC,
  getFloorSystemCtr,
  type AssemblyCalculation,
  type RequestedOutputId
} from "@dynecho/shared";

import { formatDecimal } from "@/lib/format";

import { FIELD_AIRBORNE_OUTPUTS, getFieldAirborneBlockingRequirement, getFieldAirborneLiveDetail, getFieldAirbornePendingDetail } from "./field-airborne-output";
import { IMPACT_ONLY_LOW_CONFIDENCE_CTR_DETAIL, IMPACT_ONLY_LOW_CONFIDENCE_LNW_DETAIL, IMPACT_ONLY_LOW_CONFIDENCE_RW_DETAIL, IMPACT_ONLY_LOW_CONFIDENCE_UNAVAILABLE_DETAIL, isImpactOnlyLowConfidenceFloorLane, isImpactOnlyLowConfidenceUnavailableOutput } from "./impact-only-low-confidence-floor-lane";
import type { StudyMode } from "./preset-definitions";
import { FIELD_IMPACT_OUTPUTS } from "./simple-workbench-constants";
import { buildSimpleWorkbenchOutputPosture } from "./simple-workbench-output-posture";
import { formatSignedDb } from "./simple-workbench-utils";
import { REQUESTED_OUTPUT_LABELS, REQUESTED_OUTPUT_SUPPORT_NOTES } from "./workbench-data";

export type BaseOutputCardModel = {
  detail: string;
  label: string;
  output: RequestedOutputId;
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

export type OutputCardModel = BaseOutputCardModel & {
  postureDetail: string;
  postureLabel: string;
  postureTone: "accent" | "neutral" | "success" | "warning";
};

function isExplicitlyUnsupportedOutput(
  result: AssemblyCalculation | null | undefined,
  output: RequestedOutputId
): boolean {
  return Boolean(result?.unsupportedTargetOutputs?.includes(output));
}

export function buildUnavailableOutputDetail(input: {
  output: RequestedOutputId;
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
}): string {
  const { output, result, studyMode } = input;
  const isImpactOnlyLowConfidenceLane = isImpactOnlyLowConfidenceFloorLane(result);

  if (!result) {
    return "Add a valid layer stack first.";
  }

  if (FIELD_AIRBORNE_OUTPUTS.has(output)) {
    const pendingDetail = getFieldAirbornePendingDetail(output, result);

    if (pendingDetail) {
      return pendingDetail;
    }
  }

  if (FIELD_IMPACT_OUTPUTS.has(output) && studyMode === "floor") {
    if (output === "L'n,w") {
      return "Need field K or a direct field supplement for L'n,w.";
    }

    if (output === "L'nT,w" || output === "L'nT,50") {
      return "Need field K together with receiving-room volume for standardized field impact outputs.";
    }

    if (output === "LnT,A") {
      return "Needs an exact Dutch field-band source. The simple panel does not fabricate it.";
    }
  }

  if (isImpactOnlyLowConfidenceLane && isImpactOnlyLowConfidenceUnavailableOutput(output)) {
    return IMPACT_ONLY_LOW_CONFIDENCE_UNAVAILABLE_DETAIL;
  }

  if (output === "Ln,w+CI" || output === "CI" || output === "CI,50-2500") {
    return "This appears only when the active impact lane carries low-frequency companion terms.";
  }

  return REQUESTED_OUTPUT_SUPPORT_NOTES[output];
}

export function isRouteBlockedOutput(input: {
  output: RequestedOutputId;
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
}): boolean {
  const { output, result, studyMode } = input;

  if (!result) {
    return true;
  }

  if (FIELD_AIRBORNE_OUTPUTS.has(output)) {
    return getFieldAirborneBlockingRequirement(output, result) !== null;
  }

  if (FIELD_IMPACT_OUTPUTS.has(output) && studyMode === "floor") {
    return true;
  }

  return false;
}

function getFloorSystemCtrTerm(result: AssemblyCalculation | null | undefined): number | null {
  const ratings = result?.floorSystemRatings;

  if (!ratings) {
    return null;
  }

  return getFloorSystemCtr(ratings) ?? null;
}

function getFloorSystemCAdaptationTerm(result: AssemblyCalculation | null | undefined): number | null {
  const ratings = result?.floorSystemRatings;

  if (!ratings) {
    return null;
  }

  return getFloorSystemC(ratings) ?? null;
}

export function buildOutputCard(input: {
  output: RequestedOutputId;
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
}): BaseOutputCardModel {
  const { output, result, studyMode } = input;
  const fieldRatings = result?.ratings.field;
  const isImpactOnlyLowConfidenceLane = isImpactOnlyLowConfidenceFloorLane(result);

  if (isExplicitlyUnsupportedOutput(result, output)) {
    return {
      detail: buildUnavailableOutputDetail({ output, result: result ?? null, studyMode }),
      label: REQUESTED_OUTPUT_LABELS[output],
      output,
      status: isRouteBlockedOutput({ output, result: result ?? null, studyMode }) ? "needs_input" : "unsupported",
      value: "Not ready"
    };
  }

  switch (output) {
    case "Rw":
      if (studyMode === "floor" && typeof result?.floorSystemRatings?.Rw === "number") {
        return {
          detail: "Companion airborne rating carried on the active floor lane. This can differ from the live airborne estimate shown elsewhere.",
          label: "Rw",
          output,
          status: "live",
          value: `${formatDecimal(result.floorSystemRatings.Rw)} dB`
        };
      }

      if (typeof result?.metrics.estimatedRwDb === "number") {
        return {
          detail: isImpactOnlyLowConfidenceLane ? IMPACT_ONLY_LOW_CONFIDENCE_RW_DETAIL : "Weighted airborne element rating from the active airborne calculator.",
          label: "Rw",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedRwDb)} dB`
        };
      }
      break;
    case "R'w":
      if (typeof result?.metrics.estimatedRwPrimeDb === "number") {
        return {
          detail: getFieldAirborneLiveDetail("R'w", result),
          label: "R'w",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedRwPrimeDb)} dB`
        };
      }
      break;
    case "STC":
      if (typeof result?.metrics.estimatedStc === "number") {
        return {
          detail: "ASTM single-number companion from the same airborne curve.",
          label: "STC",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedStc)} dB`
        };
      }
      break;
    case "C":
      if (studyMode === "floor") {
        const floorC = getFloorSystemCAdaptationTerm(result);

        if (typeof floorC === "number") {
          return {
            detail:
              "Companion mid-frequency adaptation carried on the active floor lane. This can differ from the live airborne estimate shown elsewhere.",
            label: "C",
            output,
            status: "live",
            value: formatSignedDb(floorC)
          };
        }
      }

      if (typeof result?.metrics.estimatedCDb === "number") {
        return {
          detail: "Mid-frequency adaptation term on the airborne lane.",
          label: "C",
          output,
          status: "live",
          value: formatSignedDb(result.metrics.estimatedCDb)
        };
      }
      break;
    case "Ctr":
      if (studyMode === "floor") {
        const floorCtr = getFloorSystemCtrTerm(result);

        if (typeof floorCtr === "number") {
          return {
            detail:
              "Companion traffic-noise adaptation carried on the active floor lane. This can differ from the live airborne estimate shown elsewhere.",
            label: "Ctr",
            output,
            status: "live",
            value: formatSignedDb(floorCtr)
          };
        }
      }

      if (typeof result?.metrics.estimatedCtrDb === "number") {
        return {
          detail: isImpactOnlyLowConfidenceLane ? IMPACT_ONLY_LOW_CONFIDENCE_CTR_DETAIL : "Traffic-noise adaptation term on the airborne lane.",
          label: "Ctr",
          output,
          status: "live",
          value: formatSignedDb(result.metrics.estimatedCtrDb)
        };
      }
      break;
    case "DnT,w":
      if (typeof result?.metrics.estimatedDnTwDb === "number") {
        return {
          detail: getFieldAirborneLiveDetail("DnT,w", result),
          label: "DnT,w",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedDnTwDb)} dB`
        };
      }
      break;
    case "DnT,A":
      if (typeof result?.metrics.estimatedDnTADb === "number") {
        return {
          detail: getFieldAirborneLiveDetail("DnT,A", result),
          label: "DnT,A",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedDnTADb)} dB`
        };
      }
      break;
    case "DnT,A,k":
      if (typeof fieldRatings?.DnTAk === "number" || typeof result?.metrics.estimatedDnTAkDb === "number") {
        return {
          detail: getFieldAirborneLiveDetail("DnT,A,k", result),
          label: "DnT,A,k",
          output,
          status: "live",
          value: `${formatDecimal(fieldRatings?.DnTAk ?? result?.metrics.estimatedDnTAkDb ?? 0)} dB`
        };
      }
      break;
    case "Dn,w":
      if (typeof result?.metrics.estimatedDnWDb === "number") {
        return {
          detail: getFieldAirborneLiveDetail("Dn,w", result),
          label: "Dn,w",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedDnWDb)} dB`
        };
      }
      break;
    case "Dn,A":
      if (typeof result?.metrics.estimatedDnADb === "number") {
        return {
          detail: getFieldAirborneLiveDetail("Dn,A", result),
          label: "Dn,A",
          output,
          status: "live",
          value: `${formatDecimal(result.metrics.estimatedDnADb)} dB`
        };
      }
      break;
    case "Ln,w":
      if (typeof result?.impact?.LnW === "number") {
        return {
          detail: isImpactOnlyLowConfidenceLane ? IMPACT_ONLY_LOW_CONFIDENCE_LNW_DETAIL : "Lab-side weighted normalized impact sound level.",
          label: "Ln,w",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LnW)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LnWUpperBound === "number") {
        return {
          detail:
            "Conservative upper bound from a bound-only floor family lane. DynEcho keeps this separate from any live airborne companion still shown on the same route.",
          label: "Ln,w",
          output,
          status: "bound",
          value: `<= ${formatDecimal(result.lowerBoundImpact.LnWUpperBound)} dB`
        };
      }
      break;
    case "L'n,w":
      if (typeof result?.impact?.LPrimeNW === "number") {
        return {
          detail: "Field-side impact value after K or direct-path carry-over.",
          label: "L'n,w",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LPrimeNW)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LPrimeNWUpperBound === "number") {
        return {
          detail: "Conservative field-side impact upper bound carried from the same bound-only lane.",
          label: "L'n,w",
          output,
          status: "bound",
          value: `<= ${formatDecimal(result.lowerBoundImpact.LPrimeNWUpperBound)} dB`
        };
      }
      break;
    case "CI":
      if (typeof result?.impact?.CI === "number") {
        return {
          detail: "Low-frequency impact companion term.",
          label: "CI",
          output,
          status: "live",
          value: formatSignedDb(result.impact.CI)
        };
      }
      break;
    case "CI,50-2500":
      if (typeof result?.impact?.CI50_2500 === "number") {
        return {
          detail: "Extended low-frequency impact companion term.",
          label: "CI,50-2500",
          output,
          status: "live",
          value: formatSignedDb(result.impact.CI50_2500)
        };
      }
      break;
    case "Ln,w+CI":
      if (typeof result?.impact?.LnWPlusCI === "number") {
        return {
          detail: "Combined weighted impact result with CI carry-over.",
          label: "Ln,w+CI",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LnWPlusCI)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LnWPlusCIUpperBound === "number") {
        return {
          detail:
            "Conservative upper bound from a source row that publishes combined Ln,w+CI without enough data to split exact Ln,w and CI.",
          label: "Ln,w+CI",
          output,
          status: "bound",
          value: `<= ${formatDecimal(result.lowerBoundImpact.LnWPlusCIUpperBound)} dB`
        };
      }
      break;
    case "DeltaLw":
      if (typeof result?.impact?.DeltaLw === "number") {
        return {
          detail: "Heavy-reference improvement term from the active impact lane.",
          label: "DeltaLw",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.DeltaLw)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.DeltaLwLowerBound === "number") {
        return {
          detail: "Conservative lower bound from a bound-only support lane.",
          label: "DeltaLw",
          output,
          status: "bound",
          value: `>= ${formatDecimal(result.lowerBoundImpact.DeltaLwLowerBound)} dB`
        };
      }
      break;
    case "L'nT,w":
      if (typeof result?.impact?.LPrimeNTw === "number") {
        return {
          detail: "Standardized field impact result with receiving-room normalization.",
          label: "L'nT,w",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LPrimeNTw)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LPrimeNTwUpperBound === "number") {
        return {
          detail: "Conservative standardized field impact upper bound carried from the same bound-only lane.",
          label: "L'nT,w",
          output,
          status: "bound",
          value: `<= ${formatDecimal(result.lowerBoundImpact.LPrimeNTwUpperBound)} dB`
        };
      }
      break;
    case "L'nT,50":
      if (typeof result?.impact?.LPrimeNT50 === "number") {
        return {
          detail: "Standardized field impact value with the extended low-frequency companion.",
          label: "L'nT,50",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LPrimeNT50)} dB`
        };
      }

      if (typeof result?.lowerBoundImpact?.LPrimeNT50UpperBound === "number") {
        return {
          detail: "Conservative L'nT,50 upper bound.",
          label: "L'nT,50",
          output,
          status: "bound",
          value: `<= ${formatDecimal(result.lowerBoundImpact.LPrimeNT50UpperBound)} dB`
        };
      }
      break;
    case "LnT,A":
      if (typeof result?.impact?.LnTA === "number") {
        return {
          detail: "Exact Dutch NEN 5077 A-weighted impact companion.",
          label: "LnT,A",
          output,
          status: "live",
          value: `${formatDecimal(result.impact.LnTA)} dB`
        };
      }
      break;
    default:
      break;
  }

  return {
    detail: buildUnavailableOutputDetail({ output, result, studyMode }),
    label: REQUESTED_OUTPUT_LABELS[output],
    output,
    status: isRouteBlockedOutput({ output, result, studyMode }) ? "needs_input" : "unsupported",
    value: "Not ready"
  };
}

export function addOutputCardPosture(
  card: BaseOutputCardModel,
  input: { result: AssemblyCalculation | null; studyMode: StudyMode }
): OutputCardModel {
  const posture = buildSimpleWorkbenchOutputPosture({
    output: card.output,
    result: input.result,
    status: card.status,
    studyMode: input.studyMode
  });

  return {
    ...card,
    postureDetail: posture.detail,
    postureLabel: posture.label,
    postureTone: posture.tone
  };
}

export function statusLabel(status: OutputCardModel["status"] | "ignored" | "used"): string {
  switch (status) {
    case "live":
      return "Live";
    case "bound":
      return "Bound";
    case "used":
      return "Used now";
    case "ignored":
      return "Ignored now";
    case "needs_input":
      return "Needs input";
    case "unsupported":
    default:
      return "Unsupported";
  }
}

export function outputStatusClass(status: OutputCardModel["status"]): string {
  switch (status) {
    case "live":
      return "border-[color:color-mix(in_oklch,var(--success)_42%,var(--line))] bg-[color:color-mix(in_oklch,var(--success)_10%,var(--paper))]";
    case "bound":
      return "border-[color:color-mix(in_oklch,var(--ink)_16%,var(--line))] bg-[color:var(--paper)]/88";
    case "needs_input":
      return "border-[color:color-mix(in_oklch,var(--warning)_34%,var(--line))] bg-[color:var(--warning-soft)]";
    case "unsupported":
    default:
      return "border-[color:color-mix(in_oklch,var(--warning)_24%,var(--line))] bg-[color:var(--paper)]/80";
  }
}

export function outputStatusTextClass(status: OutputCardModel["status"]): string {
  switch (status) {
    case "live":
      return "text-[color:var(--success-ink)]";
    case "bound":
      return "text-[color:var(--ink-soft)]";
    case "needs_input":
    case "unsupported":
    default:
      return "text-[color:var(--warning-ink)]";
  }
}

export function outputPostureTextClass(tone: OutputCardModel["postureTone"]): string {
  switch (tone) {
    case "success":
      return "text-[color:var(--success-ink)]";
    case "warning":
      return "text-[color:var(--warning-ink)]";
    case "accent":
      return "text-[color:var(--accent-ink)]";
    case "neutral":
    default:
      return "text-[color:var(--ink)]";
  }
}

export function outputPosturePanelClass(tone: OutputCardModel["postureTone"]): string {
  switch (tone) {
    case "success":
      return "border-[color:color-mix(in_oklch,var(--success)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--success)_8%,var(--paper))]";
    case "warning":
      return "border-[color:color-mix(in_oklch,var(--warning)_34%,var(--line))] bg-[color:color-mix(in_oklch,var(--warning)_10%,var(--paper))]";
    case "accent":
      return "border-[color:color-mix(in_oklch,var(--accent)_24%,var(--line))] bg-[color:color-mix(in_oklch,var(--accent)_8%,var(--paper))]";
    case "neutral":
    default:
      return "border-[color:var(--line)] bg-[color:var(--paper)]/72";
  }
}
