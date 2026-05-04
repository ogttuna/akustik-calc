import type { AssemblyCalculation, FloorRole } from "@dynecho/shared";

import type { LayerDraft } from "./workbench-store";
import {
  IMPACT_ONLY_LOW_CONFIDENCE_TOPOLOGY_GAP_DETAIL,
  IMPACT_ONLY_LOW_CONFIDENCE_TOPOLOGY_GAP_VALUE,
  isImpactOnlyLowConfidenceFloorLane
} from "./impact-only-low-confidence-floor-lane";
import { parsePositiveWorkbenchNumber } from "./parse-number";
import {
  isSteelBoundSupportFormLane,
  STEEL_BOUND_SUPPORT_FORM_GAP_DETAIL,
  STEEL_BOUND_SUPPORT_FORM_GAP_VALUE
} from "./steel-bound-support-form-lane";

export type GuidedTopologyGap = {
  detail: string;
  value: string;
};

function hasLiveRole(rows: readonly LayerDraft[], role: FloorRole): boolean {
  return rows.some((row) => row.floorRole === role && typeof parsePositiveWorkbenchNumber(row.thicknessMm) === "number");
}

function joinTopologySteps(steps: readonly string[]): string {
  if (!steps.length) {
    return "";
  }

  if (steps.length === 1) {
    return steps[0]!;
  }

  return `${steps.slice(0, -1).join(", ")} and ${steps[steps.length - 1]}`;
}

export function getGuidedTopologyGap(input: {
  result: AssemblyCalculation | null;
  rows: readonly LayerDraft[];
  studyMode: "floor" | "wall";
}): GuidedTopologyGap | null {
  if (input.studyMode === "wall") {
    const trace = input.result?.dynamicAirborneTrace ?? null;
    if (
      !trace ||
      trace.detectedFamily !== "multileaf_multicavity" ||
      trace.visibleLeafCount < 3 ||
      trace.cavityCount < 2
    ) {
      return null;
    }

    const tripleLeafWarning = input.result?.warnings.find(
      (warning: string) =>
        /^Triple-leaf exact calculation needs grouped wall topology/u.test(warning) ||
        /^Grouped triple-leaf topology is present/u.test(warning)
    );

    if (tripleLeafWarning && /^Triple-leaf exact calculation needs grouped wall topology/u.test(tripleLeafWarning)) {
      return {
        detail: tripleLeafWarning,
        value: "Grouped topology missing"
      };
    }

    if (tripleLeafWarning) {
      return {
        detail: tripleLeafWarning,
        value: "Source validation blocked"
      };
    }

    return {
      detail:
        "This wall has three visible leaves and two cavities, so DynEcho keeps it on the triple-leaf screening route until grouped topology and source validation are both visible.",
      value: "Triple-leaf screening"
    };
  }

  if (input.studyMode !== "floor") {
    return null;
  }

  if (isSteelBoundSupportFormLane(input.result)) {
    return {
      detail: STEEL_BOUND_SUPPORT_FORM_GAP_DETAIL,
      value: STEEL_BOUND_SUPPORT_FORM_GAP_VALUE
    };
  }

  const trace = input.result?.dynamicImpactTrace ?? null;
  if (!trace || trace.estimateTier !== "low_confidence") {
    return null;
  }

  if (isImpactOnlyLowConfidenceFloorLane(input.result)) {
    return {
      detail: IMPACT_ONLY_LOW_CONFIDENCE_TOPOLOGY_GAP_DETAIL,
      value: IMPACT_ONLY_LOW_CONFIDENCE_TOPOLOGY_GAP_VALUE
    };
  }

  const missingSteps: string[] = [];

  if (!hasLiveRole(input.rows, "resilient_layer")) {
    missingSteps.push("model the resilient layer as its own live row");
  }

  if (!hasLiveRole(input.rows, "floating_screed") && !hasLiveRole(input.rows, "upper_fill")) {
    missingSteps.push("add the dry-deck, screed, or upper-fill package above the support");
  }

  if (trace.systemType === "suspended_ceiling_only" && (!hasLiveRole(input.rows, "ceiling_board") || !hasLiveRole(input.rows, "ceiling_cavity"))) {
    missingSteps.push("tag the suspended ceiling package with explicit cavity and board rows");
  }

  if (!missingSteps.length) {
    return {
      detail:
        "This lane is still on the final published-family fallback. Tighten the stack with a closer published family or an exact product/system row before reading it as a final claim.",
      value: "Prefer a narrower family"
    };
  }

  return {
    detail: `This ${trace.systemTypeLabel?.toLowerCase() ?? "current"} lane is still broad because the live stack does not yet pin down the full treatment package. ${joinTopologySteps(
      missingSteps
    )}.`,
    value: "Topology still broad"
  };
}
