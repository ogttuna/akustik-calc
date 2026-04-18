import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  airtightness: "good",
  panelHeightMm: 2700,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 30,
  sharedTrack: "independent"
};

const LAB_DOUBLE_STUD_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  connectionType: "line_connection",
  studType: "light_steel_stud",
  studSpacingMm: 600,
  airtightness: "good",
  sharedTrack: "independent"
};

const WALL_SELECTOR_OUTPUTS = ["Rw", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const CLEAR_DOUBLE_LEAF_LAYERS: readonly LayerInput[] = [
  { materialId: "ytong_aac_d700", thicknessMm: 80 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const HELD_AAC_BOUNDARY_LAYERS: readonly LayerInput[] = [
  { materialId: "ytong_aac_d700", thicknessMm: 100 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const STRONG_DOUBLE_STUD_LAYERS: readonly LayerInput[] = [
  { materialId: "gypsum", thicknessMm: 12.5 },
  { materialId: "gypsum", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 75 },
  { materialId: "glasswool", thicknessMm: 60 },
  { materialId: "air_gap", thicknessMm: 70 },
  { materialId: "gypsum", thicknessMm: 12.5 },
  { materialId: "gypsum", thicknessMm: 12.5 }
];

const BLOCKED_SOURCE_RANK_4_WALL_SELECTOR_FEASIBILITY = {
  sliceId: "blocked_source_backed_widening_rerank_v1",
  auditedCandidateId: "wall_selector_behavior_widening",
  auditedCandidateRank: 4,
  feasibilityStatus: "blocked_after_explicit_rank_4_feasibility_audit",
  runtimeReady: false,
  runtimeBehaviorChange: false,
  blocker: "wall_selector_trace_guard_is_already_closed_and_no_fresh_classified_red_exists",
  rerankProgressStatus: "all_ranked_candidates_are_now_explicitly_blocked_and_rerank_is_ready_for_closeout_selection",
  selectedNextComparisonCandidate: null,
  selectedNextComparisonReason:
    "rank_4_stays_fail_closed_because_current_wall_selector_trace_and_card_guards_do_not_expose_a_live_runtime_red"
} as const;

const BLOCKED_SOURCE_RANK_4_WALL_SELECTOR_EVIDENCE = {
  clearRouteFact: "clear_double_leaf_and_double_stud_controls_already_hold_without_boundary_or_hold_leakage",
  boundaryRouteFact: "held_aac_boundary_routes_already_surface_low_confidence_ambiguous_family_boundary_hold",
  blockerFact: "no_current_wall_selector_case_exposes_a_new_classified_red_stronger_than_the_existing_closed_trace_guard"
} as const;

describe("blocked-source rank-4 wall-selector feasibility contract", () => {
  it("keeps rank-4 blocked after an explicit feasibility audit and points the rerank to closeout selection instead of another comparison", () => {
    expect(BLOCKED_SOURCE_RANK_4_WALL_SELECTOR_FEASIBILITY).toEqual({
      sliceId: "blocked_source_backed_widening_rerank_v1",
      auditedCandidateId: "wall_selector_behavior_widening",
      auditedCandidateRank: 4,
      feasibilityStatus: "blocked_after_explicit_rank_4_feasibility_audit",
      runtimeReady: false,
      runtimeBehaviorChange: false,
      blocker: "wall_selector_trace_guard_is_already_closed_and_no_fresh_classified_red_exists",
      rerankProgressStatus: "all_ranked_candidates_are_now_explicitly_blocked_and_rerank_is_ready_for_closeout_selection",
      selectedNextComparisonCandidate: null,
      selectedNextComparisonReason:
        "rank_4_stays_fail_closed_because_current_wall_selector_trace_and_card_guards_do_not_expose_a_live_runtime_red"
    });
  });

  it("anchors the blocked rank-4 decision to the already-closed wall-selector trace posture rather than a missing guard", () => {
    const clearDoubleLeaf = calculateAssembly(CLEAR_DOUBLE_LEAF_LAYERS, {
      airborneContext: FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_SELECTOR_OUTPUTS
    });
    const heldBoundary = calculateAssembly(HELD_AAC_BOUNDARY_LAYERS, {
      airborneContext: FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_SELECTOR_OUTPUTS
    });
    const strongDoubleStud = calculateAssembly(STRONG_DOUBLE_STUD_LAYERS, {
      airborneContext: LAB_DOUBLE_STUD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_SELECTOR_OUTPUTS
    });

    expect(clearDoubleLeaf.dynamicAirborneTrace?.detectedFamily).toBe("double_leaf");
    expect(clearDoubleLeaf.dynamicAirborneTrace?.confidenceClass).toBe("medium");
    expect(clearDoubleLeaf.dynamicAirborneTrace?.familyBoundaryHoldApplied).toBeUndefined();
    expect(clearDoubleLeaf.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(clearDoubleLeaf.unsupportedTargetOutputs).toEqual(["Rw"]);
    expect(clearDoubleLeaf.warnings.some((warning: string) => /boundary between|family-boundary hold/i.test(warning))).toBe(
      false
    );

    expect(heldBoundary.dynamicAirborneTrace?.detectedFamily).toBe("lined_massive_wall");
    expect(heldBoundary.dynamicAirborneTrace?.confidenceClass).toBe("low");
    expect(heldBoundary.dynamicAirborneTrace?.familyDecisionClass).toBe("ambiguous");
    expect(heldBoundary.dynamicAirborneTrace?.runnerUpFamily).toBe("double_leaf");
    expect(heldBoundary.dynamicAirborneTrace?.familyBoundaryHoldApplied).toBe(true);
    expect(heldBoundary.warnings.some((warning: string) => /boundary between lined massive wall and double leaf/i.test(warning))).toBe(
      true
    );
    expect(heldBoundary.warnings.some((warning: string) => /family-boundary hold was applied/i.test(warning))).toBe(true);

    expect(strongDoubleStud.dynamicAirborneTrace?.detectedFamily).toBe("double_stud_system");
    expect(strongDoubleStud.dynamicAirborneTrace?.confidenceClass).toBe("medium");
    expect(strongDoubleStud.dynamicAirborneTrace?.familyBoundaryHoldApplied).toBeUndefined();
    expect(strongDoubleStud.supportedTargetOutputs).toEqual(["Rw"]);
    expect(strongDoubleStud.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(strongDoubleStud.warnings.some((warning: string) => /double-stud corridor/i.test(warning))).toBe(true);

    expect(BLOCKED_SOURCE_RANK_4_WALL_SELECTOR_EVIDENCE).toEqual({
      clearRouteFact: "clear_double_leaf_and_double_stud_controls_already_hold_without_boundary_or_hold_leakage",
      boundaryRouteFact: "held_aac_boundary_routes_already_surface_low_confidence_ambiguous_family_boundary_hold",
      blockerFact: "no_current_wall_selector_case_exposes_a_new_classified_red_stronger_than_the_existing_closed_trace_guard"
    });
  });
});
