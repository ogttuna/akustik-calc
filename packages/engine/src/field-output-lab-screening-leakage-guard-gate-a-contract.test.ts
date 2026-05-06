import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type ContextSnapshot = {
  candidateIds: readonly string[] | null;
  confidence: string | null;
  dnA: number | null;
  dnTA: number | null;
  dnTw: number | null;
  dnW: number | null;
  family: string | null;
  fieldBasis: string | null;
  floorRatingsBasis: string | null;
  impactBasis: string | null;
  lPrimeNT50: number | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  matchId: string | null;
  rw: number | null;
  rwPrime: number | null;
  strategy: string | null;
  supported: readonly RequestedOutputId[];
  systemEstimateKind: string | null;
  unsupported: readonly RequestedOutputId[];
  warnings: string;
};

const FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_inventory_field_output_lab_screening_leakage_without_runtime_value_movement",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_b_strengthen_visible_field_output_basis_copy_with_paired_engine_web_report_tests",
  selectedNextFile: "apps/web/features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts",
  selectionStatus:
    "gate_a_inventoried_field_output_lab_screening_leakage_no_runtime_selected_visible_wording_guard_gate_b",
  sliceId: "field_output_lab_screening_leakage_guard_v1",
  supportPromotion: false,
  valueRetune: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts",
  "packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts",
  "packages/engine/src/floor-field-continuation-gate-a-matrix.test.ts",
  "packages/engine/src/acoustic-output-coverage.test.ts",
  "apps/web/features/workbench/field-airborne-output.ts",
  "apps/web/features/workbench/field-airborne-provenance.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/simple-workbench-evidence.ts",
  "apps/web/features/workbench/floor-field-continuation-gate-a-card-matrix.test.ts",
  "docs/calculator/SLICE_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V20_GATE_A_HANDOFF.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GUARD_PLAN.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
] as const;

const FIELD_OUTPUT_INVENTORY = [
  {
    basisOwner: "apparent_curve_overlay_and_building_normalization",
    id: "wall_low_confidence_split_rockwool_rprime_dntw",
    metricFamily: "airborne_field",
    outputs: ["R'w", "DnT,w"],
    risk: "finite_values_can_look_exact_while_strategy_is_multileaf_screening_blend_low_confidence",
    selectedGateBGuard: true
  },
  {
    basisOwner: "official_floor_system_exact_match_plus_field_continuation",
    id: "exact_floor_airborne_and_impact_field_companions",
    metricFamily: "floor_airborne_and_impact_field",
    outputs: ["R'w", "DnT,w", "L'n,w", "L'nT,w"],
    risk: "exact_floor_row_does_not_make_every_field_companion_an_independent_exact_field_measurement",
    selectedGateBGuard: true
  },
  {
    basisOwner: "predictor_floor_system_low_confidence_estimate_plus_field_continuation",
    id: "low_confidence_floor_field_companions",
    metricFamily: "floor_airborne_and_impact_field",
    outputs: ["R'w", "DnT,w", "L'n,w", "L'nT,w"],
    risk: "low_confidence_floor_fallback_still_emits_precise_looking_field_outputs",
    selectedGateBGuard: true
  },
  {
    basisOwner: "screening_mass_law_curve_seed_v3_plus_predictor_impact_field_continuation",
    id: "raw_generated_floor_fallback_field_companions",
    metricFamily: "raw_floor_screening_field",
    outputs: ["R'w", "DnT,w", "L'n,w", "L'nT,w"],
    risk: "raw_screening_and_predictor_basis_must_stay_visible_when_field_metrics_are_finite",
    selectedGateBGuard: true
  },
  {
    basisOwner: "missing_geometry_or_missing_volume_gate",
    id: "partial_field_context_needs_input_boundary",
    metricFamily: "missing_input",
    outputs: ["DnT,w", "DnT,A", "L'n,w", "L'nT,w"],
    risk: "missing_field_geometry_must_request_input_instead_of_silent_metric_promotion",
    selectedGateBGuard: false
  }
] as const;

const NEGATIVE_BOUNDARIES = [
  "finite_rprime_does_not_mean_exact_field_measurement",
  "finite_dntw_does_not_mean_design_grade_without_field_overlay_owner",
  "exact_floor_system_match_does_not_make_estimated_field_continuations_exact",
  "low_confidence_floor_or_wall_route_must_not_show_success_exact_posture",
  "bound_floor_support_must_not_be_rendered_as_live_exact_metric",
  "missing_room_volume_must_block_standardized_field_outputs",
  "missing_field_k_or_direct_field_source_must_block_field_impact_outputs",
  "rockwool_split_triple_leaf_rw41_remains_screening_not_fixed"
] as const;

const VISIBLE_COPY_INVENTORY = [
  {
    file: "apps/web/features/workbench/field-airborne-output.ts",
    requiredPhrases: [
      "final apparent airborne curve",
      "receiving-room volume",
      "partition width and height"
    ],
    risk: "airborne_live_details_need_basis_words_when_finite_field_outputs_are_shown"
  },
  {
    file: "apps/web/features/workbench/field-airborne-provenance.ts",
    requiredPhrases: [
      "Room-standardized apparent derivation",
      "area-normalized apparent derivation",
      "apparent on-site airborne single number"
    ],
    risk: "report_citations_need_to_carry_apparent_derivation_basis"
  },
  {
    file: "apps/web/features/workbench/simple-workbench-output-model.ts",
    requiredPhrases: [
      "Field-side impact value after K or direct-path carry-over",
      "Standardized field impact result with receiving-room normalization",
      "Conservative standardized field impact upper bound"
    ],
    risk: "field_impact_cards_need_clearer_exact_vs_estimated_vs_bound_basis"
  },
  {
    file: "apps/web/features/workbench/simple-workbench-output-posture.ts",
    requiredPhrases: [
      "not being framed as an independent exact source row",
      "Conservative bound",
      "Awaiting field input"
    ],
    risk: "posture_badges_are_the_visible_place_to_prevent_design_grade_overread"
  },
  {
    file: "apps/web/features/workbench/simple-workbench-evidence.ts",
    requiredPhrases: [
      "Field airborne provenance",
      "Dynamic impact anchor",
      "Dynamic airborne anchor"
    ],
    risk: "proposal_evidence_must_not_omit_source_or_basis_posture"
  }
] as const;

const FIELD_OUTPUTS = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Ln,w",
  "Ln,w+CI",
  "DeltaLw",
  "L'n,w",
  "L'nT,w",
  "L'nT,50",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

const SPLIT_ROCKWOOL_FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const COMPLETE_TRIPLE_LEAF_BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2500,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const FLOOR_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200
};

const FLOOR_BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const FLOOR_BUILDING_IMPACT_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

const SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const UBIQ_EXACT_OPEN_WEB_200_LAYERS: readonly LayerInput[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: 145 },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: 65 },
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: 20 },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: 19 },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: 200 }
];

const REINFORCED_CONCRETE_LOW_CONFIDENCE_LAYERS: readonly LayerInput[] = [
  { floorRole: "base_structure", materialId: "concrete", thicknessMm: 180 },
  { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: 8 },
  { floorRole: "floor_covering", materialId: "vinyl_flooring", thicknessMm: 3 },
  { floorRole: "ceiling_cavity", materialId: "resilient_channel", thicknessMm: 120 },
  { floorRole: "ceiling_fill", materialId: "glasswool", thicknessMm: 100 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: 16 }
];

const RAW_TERMINAL_CONCRETE_HELPER_LAYERS: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 40 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "furring_channel", thicknessMm: 18 },
  { materialId: "furring_channel", thicknessMm: 18 },
  { materialId: "concrete", thicknessMm: 160 }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function snapshot(layers: readonly LayerInput[], input: {
  airborneContext: AirborneContext | null;
  calculator?: "dynamic";
  impactFieldContext?: ImpactFieldContext | null;
  targetOutputs?: readonly RequestedOutputId[];
}): ContextSnapshot {
  const result = calculateAssembly(layers, {
    airborneContext: input.airborneContext,
    calculator: input.calculator,
    impactFieldContext: input.impactFieldContext ?? null,
    targetOutputs: input.targetOutputs ?? FIELD_OUTPUTS
  });

  return {
    candidateIds: result.impact?.estimateCandidateIds ?? result.floorSystemEstimate?.candidateIds ?? null,
    confidence: result.dynamicAirborneTrace?.confidenceClass ?? null,
    dnA: result.metrics.estimatedDnADb ?? null,
    dnTA: result.metrics.estimatedDnTADb ?? null,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    dnW: result.metrics.estimatedDnWDb ?? null,
    family: result.dynamicAirborneTrace?.detectedFamily ?? null,
    fieldBasis: result.ratings.field?.basis ?? null,
    floorRatingsBasis: result.floorSystemRatings?.basis ?? null,
    impactBasis: result.impact?.basis ?? null,
    lPrimeNT50: result.impact?.LPrimeNT50 ?? result.lowerBoundImpact?.LPrimeNT50UpperBound ?? null,
    lPrimeNTw: result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound ?? null,
    lPrimeNW: result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound ?? null,
    lnW: result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound ?? null,
    matchId: result.floorSystemMatch?.system.id ?? null,
    rw: result.floorSystemRatings?.Rw ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    strategy: result.dynamicAirborneTrace?.strategy ?? null,
    supported: result.supportedTargetOutputs,
    systemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

function floorBuildingSnapshot(layers: readonly LayerInput[]): ContextSnapshot {
  return snapshot(layers, {
    airborneContext: FLOOR_BUILDING_CONTEXT,
    impactFieldContext: FLOOR_BUILDING_IMPACT_CONTEXT
  });
}

describe("field-output lab/screening leakage guard Gate A contract", () => {
  it("lands Gate A as an inventory-only no-runtime gate and selects visible wording guard Gate B", () => {
    expect(FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_inventory_field_output_lab_screening_leakage_without_runtime_value_movement",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_b_strengthen_visible_field_output_basis_copy_with_paired_engine_web_report_tests",
      selectedNextFile: "apps/web/features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts",
      selectionStatus:
        "gate_a_inventoried_field_output_lab_screening_leakage_no_runtime_selected_visible_wording_guard_gate_b",
      sliceId: "field_output_lab_screening_leakage_guard_v1",
      supportPromotion: false,
      valueRetune: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("inventories low-confidence wall field outputs without making the rockwool triple-leaf answer exact", () => {
    const wall = snapshot(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: SPLIT_ROCKWOOL_FIELD_OUTPUTS
    });

    expect(wall).toMatchObject({
      confidence: "medium",
      dnTw: 52,
      family: "multileaf_multicavity",
      fieldBasis: "apparent_curve_overlay + 10log10(0.32V/S)",
      rwPrime: 50,
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction",
      supported: ["R'w", "DnT,w"],
      unsupported: []
    });
    expect(wall.warnings).toContain("family physics prediction");
    expect(wall.warnings).toContain("Dynamic airborne confidence is medium");
  });

  it("pins exact, low-confidence, and raw floor field-output bases before visible copy movement", () => {
    expect(floorBuildingSnapshot(UBIQ_EXACT_OPEN_WEB_200_LAYERS)).toMatchObject({
      dnTw: 70,
      floorRatingsBasis: "official_floor_system_exact_match",
      impactBasis: "mixed_exact_plus_estimated_local_guide",
      lPrimeNT50: 52,
      lPrimeNTw: 52.2,
      lPrimeNW: 55,
      lnW: 52,
      matchId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
      rw: 63,
      rwPrime: 68,
      supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50", "Ctr"],
      systemEstimateKind: null,
      unsupported: ["DeltaLw"]
    });

    expect(floorBuildingSnapshot(REINFORCED_CONCRETE_LOW_CONFIDENCE_LAYERS)).toMatchObject({
      candidateIds: [
        "euracoustics_f2_elastic_ceiling_concrete_lab_2026",
        "euracoustics_f1_rigid_ceiling_concrete_lab_2026",
        "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026"
      ],
      dnTw: 59,
      floorRatingsBasis: "predictor_floor_system_low_confidence_estimate",
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lPrimeNTw: 50.2,
      lPrimeNW: 53,
      lnW: 50,
      rw: 65.9,
      rwPrime: 58,
      supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
      systemEstimateKind: "low_confidence",
      unsupported: ["Ln,w+CI", "DeltaLw", "L'nT,50"]
    });

    expect(floorBuildingSnapshot(RAW_TERMINAL_CONCRETE_HELPER_LAYERS)).toMatchObject({
      dnTw: 59,
      floorRatingsBasis: "screening_mass_law_curve_seed_v3",
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lPrimeNTw: 72.9,
      lPrimeNW: 75.7,
      lnW: 72.7,
      matchId: null,
      rw: 57,
      rwPrime: 57,
      supported: ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "Ln,w", "L'n,w", "L'nT,w", "Ctr"],
      systemEstimateKind: null,
      unsupported: ["Ln,w+CI", "DeltaLw", "L'nT,50"]
    });
  });

  it("keeps missing volume and missing field-impact input as needs-input boundaries, not silent promotion", () => {
    const fieldOnly = snapshot(UBIQ_EXACT_OPEN_WEB_200_LAYERS, {
      airborneContext: FLOOR_FIELD_CONTEXT,
      impactFieldContext: null
    });
    const labOnly = snapshot(UBIQ_EXACT_OPEN_WEB_200_LAYERS, {
      airborneContext: null,
      impactFieldContext: null
    });

    expect(fieldOnly).toMatchObject({
      dnTw: null,
      impactBasis: "official_floor_system_exact_match",
      lPrimeNTw: null,
      lPrimeNW: null,
      rwPrime: 68,
      supported: ["Rw", "R'w", "Dn,w", "Dn,A", "Ln,w", "Ln,w+CI", "Ctr"],
      unsupported: ["DnT,w", "DnT,A", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]
    });
    expect(fieldOnly.warnings).toContain("receivingRoomVolumeM3 must be defined before DnT,w / DnT,A");

    expect(labOnly).toMatchObject({
      dnTw: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      rwPrime: null,
      supported: ["Rw", "Ln,w", "Ln,w+CI", "Ctr"],
      unsupported: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]
    });
  });

  it("records visible output-card and report-copy surfaces that Gate B must harden", () => {
    expect(FIELD_OUTPUT_INVENTORY.map((entry) => entry.id)).toEqual([
      "wall_low_confidence_split_rockwool_rprime_dntw",
      "exact_floor_airborne_and_impact_field_companions",
      "low_confidence_floor_field_companions",
      "raw_generated_floor_fallback_field_companions",
      "partial_field_context_needs_input_boundary"
    ]);
    expect(FIELD_OUTPUT_INVENTORY.filter((entry) => entry.selectedGateBGuard).map((entry) => entry.id)).toEqual([
      "wall_low_confidence_split_rockwool_rprime_dntw",
      "exact_floor_airborne_and_impact_field_companions",
      "low_confidence_floor_field_companions",
      "raw_generated_floor_fallback_field_companions"
    ]);

    for (const surface of VISIBLE_COPY_INVENTORY) {
      const contents = readRepoFile(surface.file);
      for (const phrase of surface.requiredPhrases) {
        expect(contents, `${surface.file} must retain phrase: ${phrase}`).toContain(phrase);
      }
    }
  });

  it("selects Gate B only for wording/posture hardening and keeps exact/design-grade negative boundaries explicit", () => {
    expect(NEGATIVE_BOUNDARIES).toEqual([
      "finite_rprime_does_not_mean_exact_field_measurement",
      "finite_dntw_does_not_mean_design_grade_without_field_overlay_owner",
      "exact_floor_system_match_does_not_make_estimated_field_continuations_exact",
      "low_confidence_floor_or_wall_route_must_not_show_success_exact_posture",
      "bound_floor_support_must_not_be_rendered_as_live_exact_metric",
      "missing_room_volume_must_block_standardized_field_outputs",
      "missing_field_k_or_direct_field_source_must_block_field_impact_outputs",
      "rockwool_split_triple_leaf_rw41_remains_screening_not_fixed"
    ]);
    expect(FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GATE_A).toMatchObject({
      selectedNextAction: "gate_b_strengthen_visible_field_output_basis_copy_with_paired_engine_web_report_tests",
      selectedNextFile: "apps/web/features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts",
      selectionStatus:
        "gate_a_inventoried_field_output_lab_screening_leakage_no_runtime_selected_visible_wording_guard_gate_b"
    });
  });

  it("keeps active docs aligned with the landed Gate A and selected Gate B target", () => {
    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GATE_A.selectionStatus);
      expect(contents).toContain(FIELD_OUTPUT_LAB_SCREENING_LEAKAGE_GATE_A.selectedNextFile);
    }
  });
});
