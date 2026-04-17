import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI,50-2500", "Ln,w+CI"] as const;

const DATAHOLZ_GDMTXA04A_VISIBLE_ROWS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "gypsum_board", thicknessMm: 12.5 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 50 },
  { floorRole: "ceiling_cavity", materialId: "acoustic_hanger_ceiling", thicknessMm: 70 },
  { floorRole: "upper_fill", materialId: "non_bonded_chippings", thicknessMm: 60 },
  { floorRole: "floor_covering", materialId: "dry_floating_gypsum_fiberboard", thicknessMm: 65 },
  { floorRole: "base_structure", materialId: "clt_panel", thicknessMm: 160 }
];

const BLOCKED_SOURCE_RANK_1_GDMTXA04A_FEASIBILITY = {
  sliceId: "blocked_source_backed_widening_rerank_v1",
  auditedCandidateId: "dataholz_gdmtxa04a_visible_exact_reopen",
  auditedCandidateRank: 1,
  feasibilityStatus: "blocked_after_explicit_rank_1_feasibility_audit",
  runtimeReady: false,
  runtimeBehaviorChange: false,
  blocker: "visible_exact_reopen_still_requires_honest_composite_dry_screed_surface_modeling",
  rerankProgressStatus: "advance_to_rank_2_without_promoting_rank_1",
  selectedNextComparisonCandidate: "tuas_c11c_exact_import",
  selectedNextComparisonReason:
    "rank_1_keeps_the_strongest_direct_source_truth_but_is_not_runtime_eligible_until_visible_surface_modeling_is_honest"
} as const;

const BLOCKED_SOURCE_RANK_1_GDMTXA04A_EVIDENCE = {
  exactRowFact: "dataholz_gdmtxa04a_clt_lab_2026_exists_as_a_direct_official_exact_row",
  routeFact: "visible_gdmtxa04a_like_rows_still_route_to_dataholz_gdmtxa01a_clt_lab_2026_on_family_general_estimate",
  blockerFact: "the_visible_65mm_dry_screed_surface_is_still_a_composite_element_not_a_honest_single_material_match"
} as const;

describe("blocked-source rank-1 GDMTXA04A feasibility contract", () => {
  it("keeps rank-1 blocked after an explicit feasibility audit and advances the rerank to C11c", () => {
    expect(BLOCKED_SOURCE_RANK_1_GDMTXA04A_FEASIBILITY).toEqual({
      sliceId: "blocked_source_backed_widening_rerank_v1",
      auditedCandidateId: "dataholz_gdmtxa04a_visible_exact_reopen",
      auditedCandidateRank: 1,
      feasibilityStatus: "blocked_after_explicit_rank_1_feasibility_audit",
      runtimeReady: false,
      runtimeBehaviorChange: false,
      blocker: "visible_exact_reopen_still_requires_honest_composite_dry_screed_surface_modeling",
      rerankProgressStatus: "advance_to_rank_2_without_promoting_rank_1",
      selectedNextComparisonCandidate: "tuas_c11c_exact_import",
      selectedNextComparisonReason:
        "rank_1_keeps_the_strongest_direct_source_truth_but_is_not_runtime_eligible_until_visible_surface_modeling_is_honest"
    });
  });

  it("anchors the blocked rank-1 decision to direct source truth plus the still-estimate visible route", () => {
    const exactRow = EXACT_FLOOR_SYSTEMS.find((system) => system.id === "dataholz_gdmtxa04a_clt_lab_2026");
    const result = calculateAssembly(DATAHOLZ_GDMTXA04A_VISIBLE_ROWS, { targetOutputs: TARGET_OUTPUTS });

    expect(exactRow?.manualMatch).toBe(false);
    expect(exactRow?.estimateMatch).toBeUndefined();
    expect(result.floorSystemMatch).toBeNull();
    expect(result.floorSystemEstimate?.kind).toBe("family_general");
    expect(result.impact?.estimateCandidateIds).toEqual(["dataholz_gdmtxa01a_clt_lab_2026"]);

    expect(BLOCKED_SOURCE_RANK_1_GDMTXA04A_EVIDENCE).toEqual({
      exactRowFact: "dataholz_gdmtxa04a_clt_lab_2026_exists_as_a_direct_official_exact_row",
      routeFact: "visible_gdmtxa04a_like_rows_still_route_to_dataholz_gdmtxa01a_clt_lab_2026_on_family_general_estimate",
      blockerFact: "the_visible_65mm_dry_screed_surface_is_still_a_composite_element_not_a_honest_single_material_match"
    });
  });
});
