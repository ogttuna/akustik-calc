import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { calculateImpactOnly } from "./calculate-impact-only";
import { TUAS_C11C_COMBINED_WET_SOURCE_LAYERS } from "./tuas-c11c-exact-import-readiness";

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];

const BLOCKED_SOURCE_RANK_2_C11C_FEASIBILITY = {
  sliceId: "blocked_source_backed_widening_rerank_v1",
  auditedCandidateId: "tuas_c11c_exact_import",
  auditedCandidateRank: 2,
  feasibilityStatus: "blocked_after_explicit_rank_2_feasibility_audit",
  runtimeReady: false,
  runtimeBehaviorChange: false,
  blocker: "combined_wet_c11c_tuple_remains_frequency_or_source_anomalous_and_cannot_be_imported_honestly",
  rerankProgressStatus: "advance_to_rank_3_without_promoting_rank_2",
  selectedNextComparisonCandidate: "raw_bare_open_box_open_web_impact_widening",
  selectedNextComparisonReason:
    "rank_2_has_a_real_visible_schedule_but_the_weak_tuple_still_prevents_honest_exact_import_or_screened_impact_reopen"
} as const;

const BLOCKED_SOURCE_RANK_2_C11C_EVIDENCE = {
  exactRowFact: "tuas_c11c_clt260_measured_2026_still_does_not_exist_in_exact_floor_systems",
  routeFact: "visible_c11c_rows_stay_screening_only_with_rw_only_support_and_all_impact_outputs_fail_closed",
  blockerFact: "the_combined_wet_c11c_tuple_remains_much_weaker_than_nearby_combined_clt_rows_and_is_not_source_explained"
} as const;

describe("blocked-source rank-2 C11c feasibility contract", () => {
  it("keeps rank-2 blocked after an explicit feasibility audit and advances the rerank to raw bare open-box/open-web", () => {
    expect(BLOCKED_SOURCE_RANK_2_C11C_FEASIBILITY).toEqual({
      sliceId: "blocked_source_backed_widening_rerank_v1",
      auditedCandidateId: "tuas_c11c_exact_import",
      auditedCandidateRank: 2,
      feasibilityStatus: "blocked_after_explicit_rank_2_feasibility_audit",
      runtimeReady: false,
      runtimeBehaviorChange: false,
      blocker: "combined_wet_c11c_tuple_remains_frequency_or_source_anomalous_and_cannot_be_imported_honestly",
      rerankProgressStatus: "advance_to_rank_3_without_promoting_rank_2",
      selectedNextComparisonCandidate: "raw_bare_open_box_open_web_impact_widening",
      selectedNextComparisonReason:
        "rank_2_has_a_real_visible_schedule_but_the_weak_tuple_still_prevents_honest_exact_import_or_screened_impact_reopen"
    });
  });

  it("anchors the blocked rank-2 decision to the missing exact row plus the still-fail-closed visible route", () => {
    const lab = calculateAssembly(TUAS_C11C_COMBINED_WET_SOURCE_LAYERS, { targetOutputs: LAB_OUTPUTS });
    const impactOnly = calculateImpactOnly(TUAS_C11C_COMBINED_WET_SOURCE_LAYERS, {
      targetOutputs: ["Ln,w", "Ln,w+CI"]
    });

    expect(EXACT_FLOOR_SYSTEMS.some((system) => system.id === "tuas_c11c_clt260_measured_2026")).toBe(false);
    expect(lab.floorSystemMatch).toBeNull();
    expect(lab.floorSystemEstimate).toBeNull();
    expect(lab.floorSystemRatings?.Rw).toBe(49);
    expect(lab.impact).toBeNull();
    expect(lab.supportedTargetOutputs).toEqual(["Rw"]);
    expect(lab.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI"]);
    expect(impactOnly.floorSystemMatch).toBeNull();
    expect(impactOnly.floorSystemEstimate).toBeNull();
    expect(impactOnly.impact).toBeNull();

    expect(BLOCKED_SOURCE_RANK_2_C11C_EVIDENCE).toEqual({
      exactRowFact: "tuas_c11c_clt260_measured_2026_still_does_not_exist_in_exact_floor_systems",
      routeFact: "visible_c11c_rows_stay_screening_only_with_rw_only_support_and_all_impact_outputs_fail_closed",
      blockerFact: "the_combined_wet_c11c_tuple_remains_much_weaker_than_nearby_combined_clt_rows_and_is_not_source_explained"
    });
  });
});
