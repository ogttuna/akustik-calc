import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { BOUND_FLOOR_SYSTEMS, EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  buildGeneratedVariants,
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const LAB_OUTPUTS = ["Rw", "Ln,w", "Ln,w+CI", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
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

const UBIQ_FL32_200_BOUND_SOURCE_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 200 }
];

const UBIQ_FL32_250_BOUND_INTERPOLATION_STACK: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }
];

const GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A = {
  activeSlice: "generated_floor_fallback_topology_delta_v1",
  gate: "Gate A",
  nextAction: "close_topology_delta_gate_c_without_runtime_movement_unless_a_source_ready_candidate_appears",
  runtimeBehaviorChange: false,
  selectedFamily: "floor-steel-fallback",
  status: "no_runtime_topology_delta_matrix_landed"
} as const;

const REQUIRED_GATE_A_ARTIFACTS = [
  "generated_floor_fallback_topology_delta_matrix",
  "pliteq_exact_match_delta_register",
  "ubiq_bound_match_delta_register",
  "exact_bound_precedence_and_near_miss_guards",
  "unsupported_output_low_confidence_visibility_guards",
  "many_layer_and_reorder_stability_guard_plan",
  "next_candidate_decision"
] as const;

const GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_MATRIX = [
  {
    live: "steel_joist_floor 250 mm",
    pliteqExact: "steel_joist_floor 250 mm",
    role: "support",
    ubiqBound: "steel_joist_floor 200/300 mm family with 250 mm interpolation"
  },
  {
    live: "missing",
    pliteqExact: "inex_floor_panel 19 mm",
    role: "floating_screed",
    ubiqBound: "inex_floor_panel 19 mm"
  },
  {
    live: "missing",
    pliteqExact: "geniemat_rst02 or geniemat_rst12 source row",
    role: "resilient_layer",
    ubiqBound: "absent as a separate upper resilient layer"
  },
  {
    live: "vinyl_flooring 3 mm",
    pliteqExact: "vinyl_flooring 2.5 mm or the exact source finish thickness",
    role: "floor_covering",
    ubiqBound: "engineered_timber_with_acoustic_underlay"
  },
  {
    live: "ubiq_resilient_ceiling 120 mm",
    pliteqExact: "resilient_channel 120 mm",
    role: "ceiling_cavity",
    ubiqBound: "ubiq_resilient_ceiling family"
  },
  {
    live: "rockwool 100 mm",
    pliteqExact: "glasswool 100 mm",
    role: "ceiling_fill",
    ubiqBound: "absent"
  },
  {
    live: "2 x firestop_board 16 mm",
    pliteqExact: "2 x firestop_board 16 mm",
    role: "ceiling_board",
    ubiqBound: "2 x firestop_board 16 mm"
  }
] as const;

const PLITEQ_EXACT_MATCH_DELTA_REGISTER = {
  exactRowIds: [
    "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
    "pliteq_steel_joist_250_rst12_porcelain_lab_2026",
    "pliteq_steel_joist_250_rst02_wood_lab_2026"
  ],
  liveExactBlockers: [
    "live_stack_lacks_19mm_inex_floor_panel_deck",
    "live_stack_lacks_geniemat_rst02_or_rst12_resilient_layer",
    "live_stack_uses_ubiq_resilient_ceiling_not_pliteq_resilient_channel",
    "live_stack_uses_rockwool_not_pliteq_glasswool",
    "live_vinyl_is_3mm_not_the_2_5mm_pliteq_vinyl_exact_row"
  ]
} as const;

const UBIQ_BOUND_MATCH_DELTA_REGISTER = {
  boundRowIds: ["ubiq_fl32_steel_200_lab_2026", "ubiq_fl32_steel_300_lab_2026"],
  liveBoundBlockers: [
    "live_stack_lacks_19mm_inex_floor_panel_deck",
    "live_stack_uses_vinyl_not_engineered_timber_with_acoustic_underlay",
    "live_stack_has_100mm_ceiling_fill_but_ubiq_fl32_bound_rows_omit_ceiling_fill",
    "ubiq_fl32_bound_source_is_upper_bound_support_not_exact_lnw_support"
  ]
} as const;

const EXACT_BOUND_PRECEDENCE_AND_NEAR_MISS_GUARDS = [
  "exact_pliteq_rows_keep_precedence_over_generated_fallback_when_exact_topology_is_present",
  "ubiq_fl32_bound_rows_keep_bound_precedence_when_bound_topology_is_present",
  "generated_fallback_cannot_interpolate_between_pliteq_exact_and_ubiq_bound_as_one_source_family",
  "near_miss_live_stack_stays_low_confidence_even_when_support_family_and_boards_are_adjacent"
] as const;

const UNSUPPORTED_OUTPUT_LOW_CONFIDENCE_VISIBILITY_GUARDS = [
  "live_lab_lnw_plus_ci_stays_unsupported",
  "live_lab_delta_lw_stays_unsupported",
  "live_field_lprimen_t50_stays_unsupported",
  "low_confidence_warning_stays_visible_on_live_fallback"
] as const;

const MANY_LAYER_AND_REORDER_STABILITY_GUARD_PLAN = [
  "split_ceiling_fill_and_ceiling_cavity_variants_must_remain_finite",
  "split_variants_must_not_promote_to_pliteq_exact",
  "split_variants_must_not_promote_to_ubiq_bound",
  "future_reorder_coverage_must_preserve_existing_exact_and_bound_precedence"
] as const;

const NEXT_CANDIDATE_DECISION = {
  gateBSelected: false,
  nextFile: "packages/engine/src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts",
  reason: "gate_a_found_topology_near_misses_only_no_source_ready_runtime_candidate",
  runtimeCandidateReadyNow: false
} as const;

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

function calculateWithOutputs(rows: readonly LayerInput[], targetOutputs: readonly RequestedOutputId[]) {
  return calculateAssembly(rows, {
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    targetOutputs
  });
}

function exactFloorSystem(id: string) {
  const found = EXACT_FLOOR_SYSTEMS.find((system) => system.id === id);

  if (!found) {
    throw new Error(`Missing exact floor system ${id}`);
  }

  return found;
}

function boundFloorSystem(id: string) {
  const found = BOUND_FLOOR_SYSTEMS.find((system) => system.id === id);

  if (!found) {
    throw new Error(`Missing bound floor system ${id}`);
  }

  return found;
}

describe("generated floor fallback topology-delta Gate A contract", () => {
  it("records Gate A as a no-runtime topology-delta slice with all required artifacts", () => {
    expect(GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A).toEqual({
      activeSlice: "generated_floor_fallback_topology_delta_v1",
      gate: "Gate A",
      nextAction: "close_topology_delta_gate_c_without_runtime_movement_unless_a_source_ready_candidate_appears",
      runtimeBehaviorChange: false,
      selectedFamily: "floor-steel-fallback",
      status: "no_runtime_topology_delta_matrix_landed"
    });
    expect(REQUIRED_GATE_A_ARTIFACTS).toEqual([
      "generated_floor_fallback_topology_delta_matrix",
      "pliteq_exact_match_delta_register",
      "ubiq_bound_match_delta_register",
      "exact_bound_precedence_and_near_miss_guards",
      "unsupported_output_low_confidence_visibility_guards",
      "many_layer_and_reorder_stability_guard_plan",
      "next_candidate_decision"
    ]);

    for (const path of [
      "docs/calculator/SLICE_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_V1_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-29_GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_GATE_A_HANDOFF.md",
      "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md",
      "packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts",
      "packages/catalogs/src/floor-systems/pliteq-steel-joist-rows.ts",
      "packages/catalogs/src/floor-systems/bound-floor-systems.ts",
      "packages/engine/src/lightweight-steel-bound-estimate.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("builds the generated fallback topology-delta matrix from the live stack and source rows", () => {
    const testCase = generatedCase("floor-steel-fallback");
    const pliteqVinyl = exactFloorSystem("pliteq_steel_joist_250_rst02_vinyl_lab_2026");
    const ubiqSteel200 = boundFloorSystem("ubiq_fl32_steel_200_lab_2026");

    expect(testCase.rows).toEqual([
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
      { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 100 },
      { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 120 },
      { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
      { floorRole: "base_structure", materialId: "steel_joist_floor", thicknessMm: 250 }
    ]);
    expect(pliteqVinyl.match).toMatchObject({
      baseStructure: { materialIds: ["steel_joist_floor"], thicknessMm: 250 },
      ceilingBoard: { layerCount: 2, materialIds: ["firestop_board"], thicknessMm: 16 },
      ceilingCavity: { materialIds: ["resilient_channel"], thicknessMm: 120 },
      ceilingFill: { materialIds: ["glasswool"], thicknessMm: 100 },
      floorCovering: { materialIds: ["vinyl_flooring"], thicknessMm: 2.5 },
      floatingScreed: { materialIds: ["inex_floor_panel"], thicknessMm: 19 },
      resilientLayer: { materialIds: ["geniemat_rst02"], thicknessMm: 2 }
    });
    expect(ubiqSteel200.match).toMatchObject({
      absentRoles: ["upper_fill", "ceiling_fill"],
      baseStructure: { materialIds: ["steel_joist_floor"], thicknessMm: 200 },
      ceilingBoard: { layerCount: 2, materialIds: ["firestop_board"], thicknessMm: 16 },
      ceilingCavity: { materialIds: ["ubiq_resilient_ceiling"] },
      floorCovering: { materialIds: ["engineered_timber_with_acoustic_underlay"] },
      floatingScreed: { materialIds: ["inex_floor_panel"], thicknessMm: 19 }
    });
    expect(GENERATED_FLOOR_FALLBACK_TOPOLOGY_DELTA_MATRIX.map((entry) => entry.role)).toEqual([
      "support",
      "floating_screed",
      "resilient_layer",
      "floor_covering",
      "ceiling_cavity",
      "ceiling_fill",
      "ceiling_board"
    ]);
  });

  it("keeps the live generated stack low-confidence while naming exact and bound blockers", () => {
    const testCase = generatedCase("floor-steel-fallback");
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);

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
    expect(PLITEQ_EXACT_MATCH_DELTA_REGISTER.liveExactBlockers).toEqual([
      "live_stack_lacks_19mm_inex_floor_panel_deck",
      "live_stack_lacks_geniemat_rst02_or_rst12_resilient_layer",
      "live_stack_uses_ubiq_resilient_ceiling_not_pliteq_resilient_channel",
      "live_stack_uses_rockwool_not_pliteq_glasswool",
      "live_vinyl_is_3mm_not_the_2_5mm_pliteq_vinyl_exact_row"
    ]);
    expect(UBIQ_BOUND_MATCH_DELTA_REGISTER.liveBoundBlockers).toEqual([
      "live_stack_lacks_19mm_inex_floor_panel_deck",
      "live_stack_uses_vinyl_not_engineered_timber_with_acoustic_underlay",
      "live_stack_has_100mm_ceiling_fill_but_ubiq_fl32_bound_rows_omit_ceiling_fill",
      "ubiq_fl32_bound_source_is_upper_bound_support_not_exact_lnw_support"
    ]);
  });

  it("proves exact and bound source precedence already fire only on source topology", () => {
    const live = generatedCase("floor-steel-fallback");
    const liveField = calculateAssembly(live.rows, live.fieldOptions);
    const pliteq = calculateWithOutputs(PLITEQ_EXACT_SOURCE_STACK, FIELD_OUTPUTS);
    const ubiq200 = calculateWithOutputs(UBIQ_FL32_200_BOUND_SOURCE_STACK, FIELD_OUTPUTS);
    const ubiq250 = calculateWithOutputs(UBIQ_FL32_250_BOUND_INTERPOLATION_STACK, FIELD_OUTPUTS);

    expect(liveField.floorSystemMatch).toBeNull();
    expect(liveField.boundFloorSystemMatch).toBeNull();
    expect(liveField.boundFloorSystemEstimate).toBeNull();

    expect(PLITEQ_EXACT_MATCH_DELTA_REGISTER.exactRowIds).toEqual([
      "pliteq_steel_joist_250_rst02_vinyl_lab_2026",
      "pliteq_steel_joist_250_rst12_porcelain_lab_2026",
      "pliteq_steel_joist_250_rst02_wood_lab_2026"
    ]);
    expect(pliteq.floorSystemMatch?.system.id).toBe("pliteq_steel_joist_250_rst02_vinyl_lab_2026");
    expect(pliteq.boundFloorSystemMatch).toBeNull();
    expect(pliteq.boundFloorSystemEstimate).toBeNull();
    expect(pliteq.impact).toMatchObject({
      LPrimeNTw: 58.2,
      LPrimeNW: 61,
      LnW: 58,
      basis: "mixed_exact_plus_estimated_standardized_field_volume_normalization",
      scope: "exact_floor_system_family"
    });

    expect(UBIQ_BOUND_MATCH_DELTA_REGISTER.boundRowIds).toEqual([
      "ubiq_fl32_steel_200_lab_2026",
      "ubiq_fl32_steel_300_lab_2026"
    ]);
    expect(ubiq200.floorSystemMatch).toBeNull();
    expect(ubiq200.boundFloorSystemMatch?.system.id).toBe("ubiq_fl32_steel_200_lab_2026");
    expect(ubiq200.lowerBoundImpact).toMatchObject({
      LnWUpperBound: 53,
      basis: "mixed_bound_plus_estimated_standardized_field_volume_normalization",
      scope: "exact_floor_system_family"
    });
    expect(ubiq250.boundFloorSystemMatch).toBeNull();
    expect(ubiq250.boundFloorSystemEstimate).toMatchObject({
      kind: "bound_interpolation",
      sourceSystems: [{ id: "ubiq_fl32_steel_200_lab_2026" }, { id: "ubiq_fl32_steel_300_lab_2026" }]
    });
    expect(ubiq250.lowerBoundImpact).toMatchObject({
      LnWUpperBound: 52,
      basis: "mixed_bound_plus_estimated_standardized_field_volume_normalization",
      scope: "family_bound_estimate"
    });
    expect(EXACT_BOUND_PRECEDENCE_AND_NEAR_MISS_GUARDS).toEqual([
      "exact_pliteq_rows_keep_precedence_over_generated_fallback_when_exact_topology_is_present",
      "ubiq_fl32_bound_rows_keep_bound_precedence_when_bound_topology_is_present",
      "generated_fallback_cannot_interpolate_between_pliteq_exact_and_ubiq_bound_as_one_source_family",
      "near_miss_live_stack_stays_low_confidence_even_when_support_family_and_boards_are_adjacent"
    ]);
  });

  it("keeps unsupported output and low-confidence visibility guards explicit", () => {
    const testCase = generatedCase("floor-steel-fallback");
    const lab = calculateAssembly(testCase.rows, { targetOutputs: LAB_OUTPUTS });
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);

    expect(lab.supportedTargetOutputs).toEqual(["Rw", "Ln,w"]);
    expect(lab.unsupportedTargetOutputs).toEqual(["Ln,w+CI", "DeltaLw"]);
    expect(field.supportedTargetOutputs).toEqual(["Rw", "R'w", "DnT,w", "Ln,w", "L'n,w", "L'nT,w"]);
    expect(field.unsupportedTargetOutputs).toEqual(["L'nT,50"]);
    expect(field.impact?.LPrimeNT50).toBeUndefined();
    expect(field.warnings.some((warning: string) => /Published low-confidence fallback active/i.test(warning)))
      .toBe(true);
    expect(field.warnings.some((warning: string) => /L'nT,50/i.test(warning))).toBe(true);
    expect(UNSUPPORTED_OUTPUT_LOW_CONFIDENCE_VISIBILITY_GUARDS).toEqual([
      "live_lab_lnw_plus_ci_stays_unsupported",
      "live_lab_delta_lw_stays_unsupported",
      "live_field_lprimen_t50_stays_unsupported",
      "low_confidence_warning_stays_visible_on_live_fallback"
    ]);
  });

  it("keeps split variants finite without exact/bound promotion and selects Gate C closeout", () => {
    const testCase = generatedCase("floor-steel-fallback");
    const variants = buildGeneratedVariants(testCase);

    expect(variants.map((variant) => variant.id)).toEqual([
      "floor-steel-fallback:split-1:40+60",
      "floor-steel-fallback:split-2:50+70",
      "floor-steel-fallback:combined"
    ]);

    for (const variant of variants) {
      const result = calculateAssembly(variant.rows, testCase.fieldOptions);

      expect(result.floorSystemMatch, variant.id).toBeNull();
      expect(result.boundFloorSystemMatch, variant.id).toBeNull();
      expect(result.boundFloorSystemEstimate, variant.id).toBeNull();
      expect(Number.isFinite(result.metrics.estimatedRwDb), variant.id).toBe(true);
      expect(Number.isFinite(result.impact?.LnW), variant.id).toBe(true);
      expect(result.unsupportedTargetOutputs, variant.id).toEqual(["L'nT,50"]);
    }

    expect(MANY_LAYER_AND_REORDER_STABILITY_GUARD_PLAN).toEqual([
      "split_ceiling_fill_and_ceiling_cavity_variants_must_remain_finite",
      "split_variants_must_not_promote_to_pliteq_exact",
      "split_variants_must_not_promote_to_ubiq_bound",
      "future_reorder_coverage_must_preserve_existing_exact_and_bound_precedence"
    ]);
    expect(NEXT_CANDIDATE_DECISION).toEqual({
      gateBSelected: false,
      nextFile: "packages/engine/src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts",
      reason: "gate_a_found_topology_near_misses_only_no_source_ready_runtime_candidate",
      runtimeCandidateReadyNow: false
    });
  });
});
