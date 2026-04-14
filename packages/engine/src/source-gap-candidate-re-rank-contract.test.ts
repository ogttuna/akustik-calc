import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import { describe, expect, it } from "vitest";

const POST_UBIQ_SOURCE_GAP_DECISION = {
  closedResearchSlices: ["tuas_c11c_frequency_source_recheck_v1", "dataholz_gdmtxa04a_material_surface_recheck_v1"],
  closedCheckpointAction: "checkpoint_validation_and_commit_v1",
  latestCheckpointCommit: "49ce4eb",
  closedPlanningAction: "post_checkpoint_next_slice_selection_v1",
  latestClosedImplementationSlice: "clt_combined_anchor_history_replay_matrix_v1",
  planningContractRefreshSlice: "post_ubiq_source_gap_decision_matrix_v1",
  selectedNextPlanningAction: "post_clt_combined_anchor_history_next_slice_selection_v1",
  runtimeBehaviorChange: false
} as const;

const CLOSED_UBIQ_SOURCE_GAP_SLICES = [
  "ubiq_open_web_weaker_band_posture_guard_v1",
  "ubiq_weak_band_exact_import_source_mapping_v1",
  "ubiq_open_web_supported_band_finish_completion_v1",
  "impact_lnw_plus_ci_bound_surface_v1",
  "ubiq_lnw_plus_ci_bound_history_guard_v1",
  "ubiq_lnw_plus_ci_near_miss_estimate_posture_decision_v1",
  "ubiq_open_web_packaged_finish_family_design_v1",
  "ubiq_open_web_packaged_finish_near_miss_matrix_v1",
  "ubiq_open_web_packaged_finish_history_replay_matrix_v1"
] as const;

const SOURCE_GAP_CANDIDATES = [
  {
    id: "dataholz_gdmtxa04a",
    posture: "closed_deferred_until_composite_dry_screed_surface_can_be_modeled",
    runtimeWideningEligible: false,
    selectedNextGuard: false
  },
  {
    id: "ubiq_fl23_25_27_weaker_band",
    posture: "closed_exact_only_import_no_longer_selected_next",
    runtimeWideningEligible: false,
    selectedNextGuard: false
  },
  {
    id: "tuas_c11c",
    posture: "closed_deferred_until_raw_spectrum_or_source_correction_explains_weighted_tuple",
    runtimeWideningEligible: false,
    selectedNextGuard: false
  },
  {
    id: "raw_bare_open_box_open_web_impact",
    posture: "defer_until_bare_carrier_impact_source_exists",
    runtimeWideningEligible: false,
    selectedNextGuard: false
  }
] as const;

const UBIQ_WEAKER_BAND_SOURCE_VALUES = [
  {
    family: "FL-23",
    carpetLnWPlusCI: [64, 63, 63],
    timberLnW: [71, 70, 70]
  },
  {
    family: "FL-25",
    carpetLnWPlusCI: [64, 63, 63],
    timberLnW: [71, 70, 70]
  },
  {
    family: "FL-27",
    carpetLnWPlusCI: [63, 62, 62],
    timberLnW: [70, 69, 69]
  }
] as const;

const IMPORTED_UBIQ_OPEN_WEB_CORRIDOR_FAMILIES = ["FL24", "FL26", "FL28"] as const;

function exactIdsMatching(pattern: RegExp) {
  return EXACT_FLOOR_SYSTEMS.map((system) => system.id).filter((id) => pattern.test(id));
}

function boundIdsMatching(pattern: RegExp) {
  return BOUND_FLOOR_SYSTEMS.map((system) => system.id).filter((id) => pattern.test(id));
}

describe("source gap candidate re-rank contract", () => {
  it("keeps source-gap widening closed after checkpoint validation and the CLT history guard", () => {
    const selectedCandidates = SOURCE_GAP_CANDIDATES.filter((candidate) => candidate.selectedNextGuard);

    expect(selectedCandidates).toEqual([]);
    expect(POST_UBIQ_SOURCE_GAP_DECISION).toEqual({
      closedResearchSlices: ["tuas_c11c_frequency_source_recheck_v1", "dataholz_gdmtxa04a_material_surface_recheck_v1"],
      closedCheckpointAction: "checkpoint_validation_and_commit_v1",
      latestCheckpointCommit: "49ce4eb",
      closedPlanningAction: "post_checkpoint_next_slice_selection_v1",
      latestClosedImplementationSlice: "clt_combined_anchor_history_replay_matrix_v1",
      planningContractRefreshSlice: "post_ubiq_source_gap_decision_matrix_v1",
      selectedNextPlanningAction: "post_clt_combined_anchor_history_next_slice_selection_v1",
      runtimeBehaviorChange: false
    });
    expect(CLOSED_UBIQ_SOURCE_GAP_SLICES).toContain("ubiq_open_web_weaker_band_posture_guard_v1");
    expect(CLOSED_UBIQ_SOURCE_GAP_SLICES).toContain("ubiq_weak_band_exact_import_source_mapping_v1");
    expect(CLOSED_UBIQ_SOURCE_GAP_SLICES).toContain("ubiq_open_web_packaged_finish_history_replay_matrix_v1");
    expect(SOURCE_GAP_CANDIDATES.filter((candidate) => candidate.runtimeWideningEligible)).toEqual([]);
  });

  it("keeps the landed UBIQ FL-23/25/27 weak band on exact-only import posture", () => {
    const weakBandRows = EXACT_FLOOR_SYSTEMS.filter((system) => /^ubiq_fl(?:23|25|27)_open_web_steel_/u.test(system.id));

    expect(weakBandRows).toHaveLength(54);
    expect(new Set(weakBandRows.map((system) => system.familyEstimateEligible))).toEqual(new Set([false]));
    expect(boundIdsMatching(/^ubiq_fl(?:23|25|27)_open_web_steel_/u)).toEqual([]);

    const importedCorridorFamilies = new Set(
      exactIdsMatching(/^ubiq_fl(?:24|26|28)_open_web_steel_/u).map((id) => id.match(/^ubiq_(fl\d+)_/u)?.[1]?.toUpperCase())
    );

    expect(importedCorridorFamilies).toEqual(new Set(IMPORTED_UBIQ_OPEN_WEB_CORRIDOR_FAMILIES));

    for (const candidate of UBIQ_WEAKER_BAND_SOURCE_VALUES) {
      expect(candidate.timberLnW.every((value) => value >= 69)).toBe(true);
      expect(candidate.carpetLnWPlusCI.every((value) => value >= 62)).toBe(true);
    }
  });

  it("keeps selected and deferred source candidates on non-widening catalog posture", () => {
    const gdmtxa04a = EXACT_FLOOR_SYSTEMS.find((system) => system.id === "dataholz_gdmtxa04a_clt_lab_2026");
    const exactIds = EXACT_FLOOR_SYSTEMS.map((system) => system.id);

    expect(gdmtxa04a?.manualMatch).toBe(false);
    expect(gdmtxa04a?.estimateMatch).toBeUndefined();
    expect(gdmtxa04a?.sourceUrl).toBe("https://www.dataholz.eu/en/index/download/en/gdmtxa04a-0.pdf");
    expect(exactIds).not.toContain("tuas_c11c_clt260_measured_2026");

    expect(SOURCE_GAP_CANDIDATES.find((candidate) => candidate.id === "dataholz_gdmtxa04a")?.posture).toBe(
      "closed_deferred_until_composite_dry_screed_surface_can_be_modeled"
    );
    expect(SOURCE_GAP_CANDIDATES.find((candidate) => candidate.id === "tuas_c11c")?.posture).toBe(
      "closed_deferred_until_raw_spectrum_or_source_correction_explains_weighted_tuple"
    );
    expect(SOURCE_GAP_CANDIDATES.find((candidate) => candidate.id === "raw_bare_open_box_open_web_impact")?.posture).toBe(
      "defer_until_bare_carrier_impact_source_exists"
    );
    expect(SOURCE_GAP_CANDIDATES.filter((candidate) => candidate.runtimeWideningEligible)).toEqual([]);
  });
});
