import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "Ln,w", "Ln,w+CI"];
const FIELD_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
];

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms" as const,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const RAW_BARE_OPEN_WEB_LAYERS: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 300 }
];

const RAW_BARE_OPEN_BOX_LAYERS: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "open_box_timber_slab", thicknessMm: 220 }
];

const BLOCKED_SOURCE_RANK_3_RAW_BARE_FEASIBILITY = {
  sliceId: "blocked_source_backed_widening_rerank_v1",
  auditedCandidateId: "raw_bare_open_box_open_web_impact_widening",
  auditedCandidateRank: 3,
  feasibilityStatus: "blocked_after_explicit_rank_3_feasibility_audit",
  runtimeReady: false,
  runtimeBehaviorChange: false,
  blocker: "current_open_box_and_open_web_sources_are_packaged_system_evidence_not_true_bare_carrier_impact_evidence",
  rerankProgressStatus: "advance_to_rank_4_without_promoting_rank_3",
  selectedNextComparisonCandidate: "wall_selector_behavior_widening",
  selectedNextComparisonReason:
    "rank_3_stays_fail_closed_because_reopening_it_now_would_reinterpret_packaged_rows_as_bare_carrier_impact_truth"
} as const;

const BLOCKED_SOURCE_RANK_3_RAW_BARE_EVIDENCE = {
  openBoxFact: "tuas_open_box_measured_rows_are_packaged_systems_and_visible_bare_open_box_routes_stay_impact_fail_closed",
  openWebFact: "ubiq_open_web_rows_are_inex_package_tables_and_visible_bare_open_web_routes_stay_impact_fail_closed",
  blockerFact: "no_current_source_row_proves_true_bare_carrier_impact_behavior_for_open_box_or_open_web"
} as const;

describe("blocked-source rank-3 raw bare open-box/open-web feasibility contract", () => {
  it("keeps rank-3 blocked after an explicit feasibility audit and advances the rerank to wall-selector behavior", () => {
    expect(BLOCKED_SOURCE_RANK_3_RAW_BARE_FEASIBILITY).toEqual({
      sliceId: "blocked_source_backed_widening_rerank_v1",
      auditedCandidateId: "raw_bare_open_box_open_web_impact_widening",
      auditedCandidateRank: 3,
      feasibilityStatus: "blocked_after_explicit_rank_3_feasibility_audit",
      runtimeReady: false,
      runtimeBehaviorChange: false,
      blocker: "current_open_box_and_open_web_sources_are_packaged_system_evidence_not_true_bare_carrier_impact_evidence",
      rerankProgressStatus: "advance_to_rank_4_without_promoting_rank_3",
      selectedNextComparisonCandidate: "wall_selector_behavior_widening",
      selectedNextComparisonReason:
        "rank_3_stays_fail_closed_because_reopening_it_now_would_reinterpret_packaged_rows_as_bare_carrier_impact_truth"
    });
  });

  it("anchors the blocked rank-3 decision to fail-closed bare routes rather than packaged source rows", () => {
    const openWebLab = calculateAssembly(RAW_BARE_OPEN_WEB_LAYERS, { targetOutputs: LAB_OUTPUTS });
    const openWebField = calculateAssembly(RAW_BARE_OPEN_WEB_LAYERS, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });
    const openBoxLab = calculateAssembly(RAW_BARE_OPEN_BOX_LAYERS, { targetOutputs: LAB_OUTPUTS });
    const openBoxField = calculateAssembly(RAW_BARE_OPEN_BOX_LAYERS, {
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      impactFieldContext: IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(openWebLab.floorSystemMatch).toBeNull();
    expect(openWebLab.floorSystemEstimate).toBeNull();
    expect(openWebLab.impact).toBeNull();
    expect(openWebLab.supportedTargetOutputs).toEqual(["Rw"]);
    expect(openWebLab.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI"]);

    expect(openWebField.floorSystemMatch).toBeNull();
    expect(openWebField.floorSystemEstimate).toBeNull();
    expect(openWebField.impact).toBeNull();
    expect(openWebField.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(openWebField.unsupportedTargetOutputs).toEqual([
      "Rw",
      "Ln,w",
      "CI,50-2500",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);

    expect(openBoxLab.floorSystemMatch).toBeNull();
    expect(openBoxLab.floorSystemEstimate).toBeNull();
    expect(openBoxLab.impact).toBeNull();
    expect(openBoxLab.supportedTargetOutputs).toEqual(["Rw"]);
    expect(openBoxLab.unsupportedTargetOutputs).toEqual(["Ln,w", "Ln,w+CI"]);

    expect(openBoxField.floorSystemMatch).toBeNull();
    expect(openBoxField.floorSystemEstimate).toBeNull();
    expect(openBoxField.impact).toBeNull();
    expect(openBoxField.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(openBoxField.unsupportedTargetOutputs).toEqual([
      "Rw",
      "Ln,w",
      "CI,50-2500",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);

    expect(BLOCKED_SOURCE_RANK_3_RAW_BARE_EVIDENCE).toEqual({
      openBoxFact: "tuas_open_box_measured_rows_are_packaged_systems_and_visible_bare_open_box_routes_stay_impact_fail_closed",
      openWebFact: "ubiq_open_web_rows_are_inex_package_tables_and_visible_bare_open_web_routes_stay_impact_fail_closed",
      blockerFact: "no_current_source_row_proves_true_bare_carrier_impact_behavior_for_open_box_or_open_web"
    });
  });
});
