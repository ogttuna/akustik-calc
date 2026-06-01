import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS } from "./open-box-timber-raw-bare-estimate";
import { OPEN_WEB_RAW_BARE_FORMULA_BASIS } from "./open-web-raw-bare-estimate";

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
  feasibilityStatus: "open_box_and_open_web_resolved_by_raw_bare_runtime_corridors",
  runtimeReady: true,
  runtimeBehaviorChange: true,
  blocker: null,
  rerankProgressStatus: "remove_open_box_and_open_web_from_blocked_rank_3_after_runtime_corridors",
  selectedNextComparisonCandidate: "raw_bare_open_web_surface_parity",
  selectedNextComparisonReason:
    "open_box_and_open_web_now_use separate source_absent raw_bare formula corridors without borrowing packaged source rows"
} as const;

const BLOCKED_SOURCE_RANK_3_RAW_BARE_EVIDENCE = {
  openBoxFact: "visible_bare_open_box_routes_now_use_source_absent_raw_bare_formula_runtime_without_borrowing_packaged_tuas_rows",
  openWebFact: "visible_bare_open_web_routes_now_use_source_absent_raw_bare_formula_runtime_without_borrowing_ubiq_inex_firestop_package_rows",
  blockerFact: "no_current_source_row_proves_true_bare_carrier_impact_behavior_for_open_web_so_the_runtime_keeps_wide_not_measured_budgets"
} as const;

describe("blocked-source rank-3 raw bare open-box/open-web feasibility contract", () => {
  it("tracks raw-bare open-box/open-web runtime resolution after the rank-3 audit", () => {
    expect(BLOCKED_SOURCE_RANK_3_RAW_BARE_FEASIBILITY).toEqual({
      sliceId: "blocked_source_backed_widening_rerank_v1",
      auditedCandidateId: "raw_bare_open_box_open_web_impact_widening",
      auditedCandidateRank: 3,
      feasibilityStatus: "open_box_and_open_web_resolved_by_raw_bare_runtime_corridors",
      runtimeReady: true,
      runtimeBehaviorChange: true,
      blocker: null,
      rerankProgressStatus: "remove_open_box_and_open_web_from_blocked_rank_3_after_runtime_corridors",
      selectedNextComparisonCandidate: "raw_bare_open_web_surface_parity",
      selectedNextComparisonReason:
        "open_box_and_open_web_now_use separate source_absent raw_bare formula corridors without borrowing packaged source rows"
    });
  });

  it("keeps open-web on its own source-absent corridor and proves raw-bare runtimes do not borrow packaged source rows", () => {
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
    expect(openWebLab.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(openWebLab.impact).toMatchObject({
      LnW: 96,
      LnWPlusCI: 97.8,
      basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS,
      labOrField: "lab"
    });
    expect(openWebLab.floorSystemRatings).toMatchObject({
      Rw: 32,
      basis: OPEN_WEB_RAW_BARE_FORMULA_BASIS
    });
    expect(openWebLab.supportedTargetOutputs).toEqual(["Rw", "Ln,w", "Ln,w+CI"]);
    expect(openWebLab.unsupportedTargetOutputs).toEqual([]);

    expect(openWebField.floorSystemMatch).toBeNull();
    expect(openWebField.floorSystemEstimate?.kind).toBe("family_archetype");
    expect(openWebField.impact).toMatchObject({
      CI50_2500: 5.2,
      LPrimeNW: 98,
      LPrimeNTw: 95.6,
      LPrimeNT50: 100.8,
      LnW: 96,
      LnWPlusCI: 97.8,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      labOrField: "lab"
    });
    expect(openWebField.supportedTargetOutputs).toEqual([
      "Rw",
      "R'w",
      "DnT,w",
      "Ln,w",
      "CI,50-2500",
      "Ln,w+CI",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
    expect(openWebField.unsupportedTargetOutputs).toEqual([]);

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
      LPrimeNT50: 94.1,
      LPrimeNTw: 90.7,
      LPrimeNW: 93.1,
      LnW: 91.1,
      LnWPlusCI: 90.2,
      basis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      labOrField: "lab"
    });
    expect(openBoxField.impact?.metricBasis?.LnW).toBe(OPEN_BOX_TIMBER_RAW_BARE_FORMULA_BASIS);
    expect(openBoxField.supportedTargetOutputs).toEqual(FIELD_OUTPUTS);
    expect(openBoxField.unsupportedTargetOutputs).toEqual([]);

    expect(BLOCKED_SOURCE_RANK_3_RAW_BARE_EVIDENCE).toEqual({
      openBoxFact: "visible_bare_open_box_routes_now_use_source_absent_raw_bare_formula_runtime_without_borrowing_packaged_tuas_rows",
      openWebFact: "visible_bare_open_web_routes_now_use_source_absent_raw_bare_formula_runtime_without_borrowing_ubiq_inex_firestop_package_rows",
      blockerFact: "no_current_source_row_proves_true_bare_carrier_impact_behavior_for_open_web_so_the_runtime_keeps_wide_not_measured_budgets"
    });
  });
});
