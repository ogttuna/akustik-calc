import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";

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
  feasibilityStatus: "open_box_resolved_by_raw_bare_runtime_open_web_still_blocked",
  runtimeReady: false,
  runtimeBehaviorChange: true,
  blocker: "open_web_sources_remain_packaged_system_evidence_not_true_bare_carrier_impact_evidence",
  rerankProgressStatus: "remove_open_box_from_blocked_rank_3_and_keep_open_web_blocked",
  selectedNextComparisonCandidate: "raw_bare_open_box_surface_parity",
  selectedNextComparisonReason:
    "open_box_now_uses_a_source_absent_raw_bare_formula_corridor_while_open_web_still_lacks_true_bare_carrier_evidence"
} as const;

const BLOCKED_SOURCE_RANK_3_RAW_BARE_EVIDENCE = {
  openBoxFact: "visible_bare_open_box_routes_now_use_source_absent_raw_bare_formula_runtime_without_borrowing_packaged_tuas_rows",
  openWebFact: "ubiq_open_web_rows_are_inex_package_tables_and_visible_bare_open_web_routes_stay_impact_fail_closed",
  blockerFact: "no_current_source_row_proves_true_bare_carrier_impact_behavior_for_open_web"
} as const;

describe("blocked-source rank-3 raw bare open-box/open-web feasibility contract", () => {
  it("keeps open-web blocked after the rank-3 audit while acknowledging the later raw-bare open-box runtime corridor", () => {
    expect(BLOCKED_SOURCE_RANK_3_RAW_BARE_FEASIBILITY).toEqual({
      sliceId: "blocked_source_backed_widening_rerank_v1",
      auditedCandidateId: "raw_bare_open_box_open_web_impact_widening",
      auditedCandidateRank: 3,
      feasibilityStatus: "open_box_resolved_by_raw_bare_runtime_open_web_still_blocked",
      runtimeReady: false,
      runtimeBehaviorChange: true,
      blocker: "open_web_sources_remain_packaged_system_evidence_not_true_bare_carrier_impact_evidence",
      rerankProgressStatus: "remove_open_box_from_blocked_rank_3_and_keep_open_web_blocked",
      selectedNextComparisonCandidate: "raw_bare_open_box_surface_parity",
      selectedNextComparisonReason:
        "open_box_now_uses_a_source_absent_raw_bare_formula_corridor_while_open_web_still_lacks_true_bare_carrier_evidence"
    });
  });

  it("keeps open-web fail-closed and proves open-box runtime does not borrow packaged source rows", () => {
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
    expect(openBoxLab.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(openBoxLab.impact).toMatchObject({
      LnW: 91.1,
      LnWPlusCI: 90.2,
      basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      labOrField: "lab"
    });
    expect(openBoxLab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(openBoxLab.unsupportedTargetOutputs).toEqual([]);

    expect(openBoxField.floorSystemMatch).toBeNull();
    expect(openBoxField.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(openBoxField.impact).toMatchObject({
      CI50_2500: 3.4,
      LnW: 91.1,
      LnWPlusCI: 90.2,
      basis: OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS,
      labOrField: "lab"
    });
    expect(openBoxField.impact?.LPrimeNW).toBeUndefined();
    expect(openBoxField.impact?.LPrimeNTw).toBeUndefined();
    expect(openBoxField.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w", "CI,50-2500", "Ln,w+CI"]);
    expect(openBoxField.unsupportedTargetOutputs).toEqual([
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);

    expect(BLOCKED_SOURCE_RANK_3_RAW_BARE_EVIDENCE).toEqual({
      openBoxFact: "visible_bare_open_box_routes_now_use_source_absent_raw_bare_formula_runtime_without_borrowing_packaged_tuas_rows",
      openWebFact: "ubiq_open_web_rows_are_inex_package_tables_and_visible_bare_open_web_routes_stay_impact_fail_closed",
      blockerFact: "no_current_source_row_proves_true_bare_carrier_impact_behavior_for_open_web"
    });
  });
});
