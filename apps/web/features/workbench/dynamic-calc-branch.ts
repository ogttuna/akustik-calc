import type { AssemblyCalculation } from "@dynecho/shared";

import { IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE, isImpactOnlyLowConfidenceFloorLane } from "./impact-only-low-confidence-floor-lane";
import type { StudyMode } from "./preset-definitions";
import { isSteelBoundSupportFormLane, STEEL_BOUND_SUPPORT_FORM_ROUTE_NOTE } from "./steel-bound-support-form-lane";

export type DynamicCalcBranchSummary = {
  detail: string;
  tone: "neutral" | "ready" | "warning";
  value: string;
};

function formatStrategyLabel(strategy: string | undefined): string {
  return strategy ? strategy.replaceAll("_", " ") : "seed screening path";
}

export function getDynamicCalcBranchSummary(input: {
  result: AssemblyCalculation | null;
  studyMode: StudyMode;
}): DynamicCalcBranchSummary {
  const { result, studyMode } = input;

  if (!result) {
    return {
      detail:
        studyMode === "floor"
          ? "Choose the route, then build a floor stack so DynEcho can resolve the active impact family or formula branch."
          : "Choose the route, then build a wall stack so DynEcho can resolve the active airborne branch.",
      tone: "neutral",
      value: "Waiting for stack"
    };
  }

  if (studyMode === "floor") {
    const trace = result.dynamicImpactTrace ?? null;
    if (result.floorSystemMatch) {
      return {
        detail: `${result.floorSystemMatch.system.label}. ${trace?.systemTypeLabel ? `${trace.systemTypeLabel} topology` : "Curated floor-family topology"} with published companion ratings is active on this route.`,
        tone: "ready",
        value: "Exact floor family"
      };
    }

    if (trace) {
      if (trace.estimateTier === "low_confidence") {
        if (isImpactOnlyLowConfidenceFloorLane(result)) {
          return {
            detail: `${trace.selectedLabel} is active. Final published-family fallback on the ${trace.systemTypeLabel?.toLowerCase() ?? "current"} topology. ${IMPACT_ONLY_LOW_CONFIDENCE_FLOOR_FAMILY_NOTE}`,
            tone: "warning",
            value: trace.systemTypeLabel ?? trace.selectionKindLabel
          };
        }

        return {
          detail: `${trace.selectedLabel} is active. Final published-family fallback on the ${trace.systemTypeLabel?.toLowerCase() ?? "current"} topology, so this branch stays source-backed but below the narrower same-family estimate corridor.`,
          tone: "warning",
          value: trace.systemTypeLabel ?? trace.selectionKindLabel
        };
      }

      if (trace.selectionKind === "formula_estimate") {
        return {
          detail: `${trace.selectedLabel} is active. ${trace.impactBasisLabel} on the ${trace.systemTypeLabel?.toLowerCase() ?? "current"} topology.`,
          tone: "warning",
          value: trace.systemTypeLabel ?? trace.selectionKindLabel
        };
      }

      if (isSteelBoundSupportFormLane(result)) {
        return {
          detail: `${trace.selectionKindLabel} is active through ${trace.selectedLabel}. ${STEEL_BOUND_SUPPORT_FORM_ROUTE_NOTE}`,
          tone: "warning",
          value: trace.systemTypeLabel ?? trace.selectionKindLabel
        };
      }

      return {
        detail: `${trace.selectionKindLabel} is active through ${trace.selectedLabel}. ${trace.impactBasisLabel}${trace.systemTypeLabel ? ` on the ${trace.systemTypeLabel.toLowerCase()} topology.` : "."}`,
        tone: trace.evidenceTier === "exact" ? "ready" : trace.confidenceClass === "low" ? "warning" : "neutral",
        value: trace.systemTypeLabel ?? trace.selectionKindLabel
      };
    }

    return {
      detail: "No supported floor impact branch is live yet. Complete the stack or land an exact/published family lane first.",
      tone: "warning",
      value: "Awaiting supported topology"
    };
  }

  const airborneTrace = result.dynamicAirborneTrace ?? null;
  if (airborneTrace) {
    return {
      detail: `${airborneTrace.selectedLabel} anchor is active with ${formatStrategyLabel(airborneTrace.strategy)}.`,
      tone:
        airborneTrace.confidenceClass === "high"
          ? "ready"
          : airborneTrace.confidenceClass === "low"
            ? "warning"
            : "neutral",
      value: airborneTrace.detectedFamilyLabel
    };
  }

  return {
    detail:
      result.metrics.airGapCount > 0
        ? "Visible wall stack currently stays on the seed cavity-screening path because no family-aware airborne branch has locked yet."
        : "Visible wall stack currently stays on the seed single-leaf path because no family-aware airborne branch has locked yet.",
    tone: "warning",
    value: result.calculatorLabel ?? "Screening seed"
  };
}
