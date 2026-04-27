import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const TARGET_OUTPUTS = [
  "Rw",
  "Ln,w",
  "Ln,w+CI",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

const PLITEQ_EXACT_SOURCE_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 120 },
  { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 2.5 },
  { floorRole: "resilient_layer", materialId: "geniemat_rst02", thicknessMm: 2 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }
];

const UBIQ_FL32_BOUND_SOURCE_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }
];

const FLOOR_FALLBACK_GATE_B_SOURCE_CONTRACT = {
  activeSlice: "floor_fallback_low_confidence_cleanup_v1",
  candidateId: "floor.steel_fallback_low_confidence.field",
  generatedCaseId: "floor-steel-fallback",
  gate: "Gate B",
  nextAction:
    "close_floor_fallback_low_confidence_cleanup_gate_c_and_select_ui_input_output_honesty_v1",
  runtimeBehaviorChange: false,
  status: "no_runtime_source_formula_decision_landed",
  webPostureChange: false
} as const;

const GATE_B_BLOCKERS = {
  exactPromotionBlockers: [
    "live_stack_uses_ubiq_resilient_ceiling_not_pliteq_resilient_channel",
    "live_stack_uses_rockwool_not_pliteq_glasswool",
    "live_stack_lacks_geniemat_rst02_or_rst12_resilient_layer",
    "live_stack_lacks_19mm_inex_floor_panel_deck",
    "live_vinyl_is_3mm_not_the_2_5mm_pliteq_vinyl_exact_row"
  ],
  boundPromotionBlockers: [
    "live_stack_lacks_19mm_inex_floor_panel_deck",
    "live_stack_uses_vinyl_not_engineered_timber_with_acoustic_underlay",
    "live_stack_has_100mm_ceiling_fill_but_ubiq_fl32_bound_rows_omit_ceiling_fill",
    "ubiq_fl32_bound_source_is_upper_bound_support_not_exact_lnw_support"
  ],
  failClosedCorrectionBlockers: [
    "unsupported_lprimen_t50_is_already_explicitly_unsupported",
    "lnw_plus_ci_and_delta_lw_are_explicitly_unsupported_on_the_lab_lane",
    "low_confidence_warnings_and_web_card_posture_are_already_visible"
  ]
} as const;

const ACTIVE_BOUNDARIES = {
  disallowedMoves: [
    "promote_floor_steel_fallback_from_low_confidence_to_exact_or_bound",
    "interpolate_between_pliteq_exact_rows_and_ubiq_bound_rows_as_if_they_were_one_source_family",
    "invent_lprimen_t50_from_lprimen_tw_without_a_ci50_2500_source_or_formula",
    "change_web_low_confidence_wording_without_engine_posture_change",
    "reopen_gdmtxa04a_c11c_raw_open_box_open_web_heavy_concrete_wall_selector_timber_stud_or_clt_wall"
  ]
} as const;

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

function calculateSourceStack(rows: readonly LayerInput[]) {
  return calculateAssembly(rows, {
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs: TARGET_OUTPUTS
  });
}

describe("floor fallback low-confidence Gate B source/formula contract", () => {
  it("records that Gate B landed as a no-runtime source/formula decision", () => {
    expect(FLOOR_FALLBACK_GATE_B_SOURCE_CONTRACT).toEqual({
      activeSlice: "floor_fallback_low_confidence_cleanup_v1",
      candidateId: "floor.steel_fallback_low_confidence.field",
      generatedCaseId: "floor-steel-fallback",
      gate: "Gate B",
      nextAction:
        "close_floor_fallback_low_confidence_cleanup_gate_c_and_select_ui_input_output_honesty_v1",
      runtimeBehaviorChange: false,
      status: "no_runtime_source_formula_decision_landed",
      webPostureChange: false
    });

    for (const path of [
      "docs/calculator/CHECKPOINT_2026-04-27_FLOOR_FALLBACK_LOW_CONFIDENCE_GATE_A_HANDOFF.md",
      "docs/calculator/SLICE_FLOOR_FALLBACK_LOW_CONFIDENCE_CLEANUP_PLAN.md",
      "packages/engine/src/floor-fallback-low-confidence-gate-a-audit-contract.test.ts",
      "packages/catalogs/src/floor-systems/pliteq-steel-joist-rows.ts",
      "packages/catalogs/src/floor-systems/bound-floor-systems.ts",
      "packages/engine/src/lightweight-steel-bound-estimate.ts",
      "apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the selected generated stack on the pinned low-confidence fallback lane", () => {
    const testCase = generatedCase("floor-steel-fallback");
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);

    expect(testCase.rows).toContainEqual({
      floorRole: "ceiling_cavity",
      materialId: "ubiq_resilient_ceiling",
      thicknessMm: 120
    });
    expect(testCase.rows).toContainEqual({
      floorRole: "ceiling_fill",
      materialId: "rockwool",
      thicknessMm: 100
    });
    expect(testCase.rows).toContainEqual({
      floorRole: "floor_covering",
      materialId: "vinyl_flooring",
      thicknessMm: 3
    });
    expect(testCase.rows).not.toContainEqual({
      floorRole: "floating_screed",
      materialId: "inex_floor_panel",
      thicknessMm: 19
    });
    expect(testCase.rows).not.toContainEqual({
      floorRole: "resilient_layer",
      materialId: "geniemat_rst02",
      thicknessMm: 2
    });

    expect(field.floorSystemMatch).toBeNull();
    expect(field.boundFloorSystemMatch).toBeNull();
    expect(field.boundFloorSystemEstimate).toBeNull();
    expect(resultSnapshot(field)).toMatchObject({
      floorSystemEstimateBasis: "predictor_floor_system_low_confidence_estimate",
      floorSystemEstimateKind: "low_confidence",
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lPrimeNT50: null,
      lPrimeNTw: 58.5,
      lPrimeNW: 61.3,
      lnW: 58.3,
      lnWPlusCI: null,
      rw: 61,
      rwPrimeDb: 70,
      unsupportedTargetOutputs: ["L'nT,50"]
    });
    expect(field.dynamicImpactTrace).toMatchObject({
      estimateTier: "low_confidence",
      evidenceTier: "estimate",
      fitPercent: 28,
      selectionKindLabel: "Low-confidence fallback"
    });
  });

  it("proves exact and bound source precedence already work when the source topology is actually present", () => {
    const pliteq = calculateSourceStack(PLITEQ_EXACT_SOURCE_STACK);
    const ubiq = calculateSourceStack(UBIQ_FL32_BOUND_SOURCE_STACK);

    expect(pliteq.floorSystemMatch?.system.id).toBe("pliteq_steel_joist_250_rst02_vinyl_lab_2026");
    expect(pliteq.floorSystemEstimate).toBeNull();
    expect(pliteq.boundFloorSystemMatch).toBeNull();
    expect(pliteq.boundFloorSystemEstimate).toBeNull();
    expect(pliteq.impact).toMatchObject({
      LPrimeNTw: 58.2,
      LPrimeNW: 61,
      LnW: 58,
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      confidence: {
        level: "high",
        provenance: "exact_floor_system_family"
      },
      metricBasis: {
        LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
        LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
        LnW: "official_floor_system_exact_match"
      },
      scope: "exact_floor_system_family"
    });
    expect(resultSnapshot(pliteq).unsupportedTargetOutputs).toEqual([
      "Ln,w+CI",
      "DeltaLw",
      "L'nT,50"
    ]);

    expect(ubiq.floorSystemMatch).toBeNull();
    expect(ubiq.floorSystemEstimate).toBeNull();
    expect(ubiq.boundFloorSystemMatch).toBeNull();
    expect(ubiq.boundFloorSystemEstimate).toMatchObject({
      kind: "bound_interpolation",
      sourceSystems: [
        { id: "ubiq_fl32_steel_200_lab_2026" },
        { id: "ubiq_fl32_steel_300_lab_2026" }
      ]
    });
    expect(ubiq.lowerBoundImpact).toMatchObject({
      LPrimeNTwUpperBound: 52.2,
      LPrimeNWUpperBound: 55,
      LnWUpperBound: 52,
      basis: "mixed_bound_plus_estimated_standardized_field_volume_normalization",
      scope: "family_bound_estimate"
    });
    expect(resultSnapshot(ubiq)).toMatchObject({
      boundFloorSystemEstimateKind: "bound_interpolation",
      floorSystemEstimateKind: null,
      impactBasis: "mixed_bound_plus_estimated_standardized_field_volume_normalization",
      rw: 62,
      unsupportedTargetOutputs: ["Ln,w+CI", "DeltaLw", "L'nT,50"]
    });
  });

  it("blocks Gate B promotion and narrows the next action to Gate C closeout", () => {
    const testCase = generatedCase("floor-steel-fallback");
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);

    expect(field.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]);
    expect(field.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(field.impact?.LPrimeNT50).toBeUndefined();
    expect(field.warnings.some((warning: string) => /L'nT,50/i.test(warning))).toBe(true);
    expect(field.warnings.some((warning: string) => /Published low-confidence fallback active/i.test(warning)))
      .toBe(true);

    expect(GATE_B_BLOCKERS).toEqual({
      exactPromotionBlockers: [
        "live_stack_uses_ubiq_resilient_ceiling_not_pliteq_resilient_channel",
        "live_stack_uses_rockwool_not_pliteq_glasswool",
        "live_stack_lacks_geniemat_rst02_or_rst12_resilient_layer",
        "live_stack_lacks_19mm_inex_floor_panel_deck",
        "live_vinyl_is_3mm_not_the_2_5mm_pliteq_vinyl_exact_row"
      ],
      boundPromotionBlockers: [
        "live_stack_lacks_19mm_inex_floor_panel_deck",
        "live_stack_uses_vinyl_not_engineered_timber_with_acoustic_underlay",
        "live_stack_has_100mm_ceiling_fill_but_ubiq_fl32_bound_rows_omit_ceiling_fill",
        "ubiq_fl32_bound_source_is_upper_bound_support_not_exact_lnw_support"
      ],
      failClosedCorrectionBlockers: [
        "unsupported_lprimen_t50_is_already_explicitly_unsupported",
        "lnw_plus_ci_and_delta_lw_are_explicitly_unsupported_on_the_lab_lane",
        "low_confidence_warnings_and_web_card_posture_are_already_visible"
      ]
    });
    expect(ACTIVE_BOUNDARIES.disallowedMoves).toEqual([
      "promote_floor_steel_fallback_from_low_confidence_to_exact_or_bound",
      "interpolate_between_pliteq_exact_rows_and_ubiq_bound_rows_as_if_they_were_one_source_family",
      "invent_lprimen_t50_from_lprimen_tw_without_a_ci50_2500_source_or_formula",
      "change_web_low_confidence_wording_without_engine_posture_change",
      "reopen_gdmtxa04a_c11c_raw_open_box_open_web_heavy_concrete_wall_selector_timber_stud_or_clt_wall"
    ]);
    expect(FLOOR_FALLBACK_GATE_B_SOURCE_CONTRACT.nextAction).toBe(
      "close_floor_fallback_low_confidence_cleanup_gate_c_and_select_ui_input_output_honesty_v1"
    );
  });
});
