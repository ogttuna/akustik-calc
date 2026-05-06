import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, ImpactFieldContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type FieldBasisKind =
  | "apparent_curve_continuation"
  | "bound_continuation"
  | "design_grade_owner_absent"
  | "impact_field_continuation"
  | "lab_continuation"
  | "needs_input"
  | "standardized_field_continuation";

type ContextSnapshot = {
  confidence: string | null;
  dnTA: number | null;
  dnTw: number | null;
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

type FieldPolicyRow = {
  basis: FieldBasisKind;
  designGradeAllowedNow: false;
  id: string;
  outputs: readonly RequestedOutputId[];
  requiredBeforeDesignGrade: readonly string[];
  selectedGateBVisiblePolicy: boolean;
};

const FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_inventory_field_output_owner_design_grade_policy_after_v22_rerank",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_b_pin_visible_field_output_design_grade_owner_policy",
  selectedNextFile: "apps/web/features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts",
  selectionStatus:
    "gate_a_inventoried_field_output_owner_design_grade_policy_no_runtime_selected_visible_policy_gate_b",
  sliceId: "field_output_owner_and_design_grade_policy_v1",
  supportPromotion: false,
  valueRetune: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v22-gate-a-contract.test.ts",
  "packages/engine/src/field-output-lab-screening-leakage-guard-gate-a-contract.test.ts",
  "packages/engine/src/company-internal-misclassification-readiness-blocker-contract.test.ts",
  "apps/web/features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts",
  "docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_A_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_ALIGNED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_A_HANDOFF.md"
] as const;

const DESIGN_GRADE_REQUIREMENTS = [
  "field_metric_owner",
  "source_basis_owner",
  "geometry_or_room_context_owner",
  "tolerance_owner",
  "negative_boundaries",
  "paired_engine_tests",
  "paired_web_report_tests"
] as const;

const FIELD_OUTPUT_OWNER_POLICY_INVENTORY: readonly FieldPolicyRow[] = [
  {
    basis: "apparent_curve_continuation",
    designGradeAllowedNow: false,
    id: "low_confidence_wall_rprime_dntw_apparent_curve_continuation",
    outputs: ["R'w", "DnT,w"],
    requiredBeforeDesignGrade: DESIGN_GRADE_REQUIREMENTS,
    selectedGateBVisiblePolicy: true
  },
  {
    basis: "standardized_field_continuation",
    designGradeAllowedNow: false,
    id: "exact_floor_airborne_field_companions_from_lab_row_and_room_context",
    outputs: ["R'w", "DnT,w", "DnT,A"],
    requiredBeforeDesignGrade: DESIGN_GRADE_REQUIREMENTS,
    selectedGateBVisiblePolicy: true
  },
  {
    basis: "impact_field_continuation",
    designGradeAllowedNow: false,
    id: "exact_floor_impact_field_companions_from_lab_row_and_field_k",
    outputs: ["L'n,w", "L'nT,w", "L'nT,50"],
    requiredBeforeDesignGrade: DESIGN_GRADE_REQUIREMENTS,
    selectedGateBVisiblePolicy: true
  },
  {
    basis: "bound_continuation",
    designGradeAllowedNow: false,
    id: "bound_or_low_confidence_floor_field_outputs_need_owner_before_issue",
    outputs: ["R'w", "DnT,w", "L'n,w", "L'nT,w"],
    requiredBeforeDesignGrade: DESIGN_GRADE_REQUIREMENTS,
    selectedGateBVisiblePolicy: true
  },
  {
    basis: "needs_input",
    designGradeAllowedNow: false,
    id: "missing_room_volume_field_k_or_direct_path_needs_input",
    outputs: ["DnT,w", "DnT,A", "L'n,w", "L'nT,w", "L'nT,50"],
    requiredBeforeDesignGrade: DESIGN_GRADE_REQUIREMENTS,
    selectedGateBVisiblePolicy: true
  },
  {
    basis: "design_grade_owner_absent",
    designGradeAllowedNow: false,
    id: "all_finite_field_outputs_owner_absent_until_policy_closes",
    outputs: ["R'w", "DnT,w", "DnT,A", "L'n,w", "L'nT,w", "L'nT,50"],
    requiredBeforeDesignGrade: DESIGN_GRADE_REQUIREMENTS,
    selectedGateBVisiblePolicy: true
  }
] as const;

const FIELD_METRIC_OWNER_MATRIX = [
  {
    designGradeOwnerNamed: false,
    metric: "R'w",
    requiredOwner: "apparent_or_measured_field_airborne_owner",
    sourceBasisRequired: "lab_curve_or_field_measurement_basis",
    toleranceOwnerNamed: false
  },
  {
    designGradeOwnerNamed: false,
    metric: "DnT,w",
    requiredOwner: "room_standardized_airborne_owner",
    sourceBasisRequired: "receiving_room_volume_rt60_and_apparent_curve_or_field_measurement_basis",
    toleranceOwnerNamed: false
  },
  {
    designGradeOwnerNamed: false,
    metric: "DnT,A",
    requiredOwner: "room_standardized_weighted_airborne_owner",
    sourceBasisRequired: "dnT_curve_c_weighting_and_room_context",
    toleranceOwnerNamed: false
  },
  {
    designGradeOwnerNamed: false,
    metric: "L'n,w",
    requiredOwner: "field_impact_owner",
    sourceBasisRequired: "direct_field_path_or_owned_field_k_basis",
    toleranceOwnerNamed: false
  },
  {
    designGradeOwnerNamed: false,
    metric: "L'nT,w",
    requiredOwner: "standardized_field_impact_owner",
    sourceBasisRequired: "field_k_receiving_room_volume_and_standardization_basis",
    toleranceOwnerNamed: false
  },
  {
    designGradeOwnerNamed: false,
    metric: "L'nT,50",
    requiredOwner: "low_frequency_standardized_field_impact_owner",
    sourceBasisRequired: "field_k_low_frequency_band_and_volume_basis",
    toleranceOwnerNamed: false
  }
] as const;

const MISSING_INPUT_NEGATIVE_BOUNDARIES = [
  "missing_receiving_room_volume_blocks_dntw_and_dnta",
  "missing_field_k_or_direct_field_path_blocks_lprime_outputs",
  "finite_lab_or_apparent_neighbor_does_not_fill_missing_standardized_field_metric",
  "exact_floor_lab_row_does_not_make_field_companions_independent_exact_measurements",
  "low_confidence_or_raw_fallback_outputs_remain_non_design_grade",
  "rockwool_triple_leaf_field_outputs_carry_rw41_screening_posture"
] as const;

const ROCKWOOL_SCREENING_FIELD_OUTPUT_CARRY_FORWARD = {
  artifact: "rockwool_screening_field_output_carry_forward",
  designGradeFieldOutputAllowedNow: false,
  exactSourceValidatedNow: false,
  groupedScreeningAnswer: "Rw 41",
  groupedStrategy: "multileaf_screening_blend",
  sourceLaneDisposition: "paused_waiting_rights_safe_source_packet",
  visiblePostureRequiredNow: "screening_only_not_fixed_not_source_validated"
} as const;

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
    confidence: result.dynamicAirborneTrace?.confidenceClass ?? null,
    dnTA: result.metrics.estimatedDnTADb ?? null,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
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

describe("field-output owner and design-grade policy Gate A contract", () => {
  it("lands Gate A no-runtime and selects visible design-grade owner policy Gate B", () => {
    expect(FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_inventory_field_output_owner_design_grade_policy_after_v22_rerank",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_b_pin_visible_field_output_design_grade_owner_policy",
      selectedNextFile: "apps/web/features/workbench/field-output-owner-and-design-grade-policy-gate-b-visible.test.ts",
      selectionStatus:
        "gate_a_inventoried_field_output_owner_design_grade_policy_no_runtime_selected_visible_policy_gate_b",
      sliceId: "field_output_owner_and_design_grade_policy_v1",
      supportPromotion: false,
      valueRetune: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
    // Gate B has landed, so Gate A's selected next file is now present.
    expect(existsSync(join(REPO_ROOT, FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_A.selectedNextFile))).toBe(
      true
    );
  });

  it("inventories field-style metrics and blocks design-grade use without an owner", () => {
    expect(FIELD_OUTPUT_OWNER_POLICY_INVENTORY.map((entry) => entry.id)).toEqual([
      "low_confidence_wall_rprime_dntw_apparent_curve_continuation",
      "exact_floor_airborne_field_companions_from_lab_row_and_room_context",
      "exact_floor_impact_field_companions_from_lab_row_and_field_k",
      "bound_or_low_confidence_floor_field_outputs_need_owner_before_issue",
      "missing_room_volume_field_k_or_direct_path_needs_input",
      "all_finite_field_outputs_owner_absent_until_policy_closes"
    ]);
    expect(FIELD_OUTPUT_OWNER_POLICY_INVENTORY.every((entry) => entry.designGradeAllowedNow === false)).toBe(true);
    expect(FIELD_OUTPUT_OWNER_POLICY_INVENTORY.every((entry) => entry.selectedGateBVisiblePolicy)).toBe(true);

    for (const entry of FIELD_OUTPUT_OWNER_POLICY_INVENTORY) {
      expect(entry.requiredBeforeDesignGrade).toEqual(DESIGN_GRADE_REQUIREMENTS);
    }

    expect(FIELD_METRIC_OWNER_MATRIX.every((entry) => entry.designGradeOwnerNamed === false)).toBe(true);
    expect(FIELD_METRIC_OWNER_MATRIX.every((entry) => entry.toleranceOwnerNamed === false)).toBe(true);
    expect(FIELD_METRIC_OWNER_MATRIX.map((entry) => entry.metric)).toEqual([
      "R'w",
      "DnT,w",
      "DnT,A",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
  });

  it("pins live wall and floor field-style outputs as continuations, not design-grade measurements", () => {
    const wall = snapshot(SPLIT_ROCKWOOL_STACK, {
      airborneContext: COMPLETE_TRIPLE_LEAF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: SPLIT_ROCKWOOL_FIELD_OUTPUTS
    });
    const exactFloor = floorBuildingSnapshot(UBIQ_EXACT_OPEN_WEB_200_LAYERS);
    const lowConfidenceFloor = floorBuildingSnapshot(REINFORCED_CONCRETE_LOW_CONFIDENCE_LAYERS);
    const rawFallbackFloor = floorBuildingSnapshot(RAW_TERMINAL_CONCRETE_HELPER_LAYERS);

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

    expect(exactFloor).toMatchObject({
      dnTw: 70,
      floorRatingsBasis: "official_floor_system_exact_match",
      impactBasis: "mixed_exact_plus_estimated_local_guide",
      lPrimeNT50: 52,
      lPrimeNTw: 52.2,
      lPrimeNW: 55,
      matchId: "ubiq_fl28_open_web_steel_200_exact_lab_2026",
      rw: 63,
      rwPrime: 68,
      systemEstimateKind: null
    });

    expect(lowConfidenceFloor).toMatchObject({
      dnTw: 59,
      floorRatingsBasis: "predictor_floor_system_low_confidence_estimate",
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lPrimeNTw: 50.2,
      lPrimeNW: 53,
      rw: 65.9,
      rwPrime: 58,
      systemEstimateKind: "low_confidence"
    });

    expect(rawFallbackFloor).toMatchObject({
      dnTw: 59,
      floorRatingsBasis: "screening_mass_law_curve_seed_v3",
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      lPrimeNTw: 72.9,
      lPrimeNW: 75.7,
      rw: 57,
      rwPrime: 57,
      systemEstimateKind: null
    });
  });

  it("keeps missing field inputs as needs-input boundaries instead of deriving from adjacent live values", () => {
    const missingRoomVolume = snapshot(UBIQ_EXACT_OPEN_WEB_200_LAYERS, {
      airborneContext: FLOOR_FIELD_CONTEXT,
      impactFieldContext: null
    });
    const missingImpactField = snapshot(UBIQ_EXACT_OPEN_WEB_200_LAYERS, {
      airborneContext: FLOOR_BUILDING_CONTEXT,
      impactFieldContext: null
    });
    const labOnly = snapshot(UBIQ_EXACT_OPEN_WEB_200_LAYERS, {
      airborneContext: null,
      impactFieldContext: null
    });

    expect(MISSING_INPUT_NEGATIVE_BOUNDARIES).toEqual([
      "missing_receiving_room_volume_blocks_dntw_and_dnta",
      "missing_field_k_or_direct_field_path_blocks_lprime_outputs",
      "finite_lab_or_apparent_neighbor_does_not_fill_missing_standardized_field_metric",
      "exact_floor_lab_row_does_not_make_field_companions_independent_exact_measurements",
      "low_confidence_or_raw_fallback_outputs_remain_non_design_grade",
      "rockwool_triple_leaf_field_outputs_carry_rw41_screening_posture"
    ]);

    expect(missingRoomVolume).toMatchObject({
      dnTw: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      rwPrime: 68
    });
    expect(missingRoomVolume.unsupported).toEqual(
      expect.arrayContaining(["DnT,w", "DnT,A", "L'n,w", "L'nT,w", "L'nT,50"])
    );
    expect(missingRoomVolume.warnings).toContain("receivingRoomVolumeM3 must be defined before DnT,w / DnT,A");

    expect(missingImpactField).toMatchObject({
      dnTw: 70,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      rwPrime: 68
    });
    expect(missingImpactField.unsupported).toEqual(expect.arrayContaining(["L'n,w", "L'nT,w", "L'nT,50"]));

    expect(labOnly).toMatchObject({
      dnTw: null,
      lPrimeNT50: null,
      lPrimeNTw: null,
      lPrimeNW: null,
      rwPrime: null
    });
    expect(labOnly.unsupported).toEqual(
      expect.arrayContaining(["R'w", "DnT,w", "DnT,A", "L'n,w", "L'nT,w", "L'nT,50"])
    );
  });

  it("carries forward rockwool screening and Uris source-packet blockers", () => {
    expect(ROCKWOOL_SCREENING_FIELD_OUTPUT_CARRY_FORWARD).toEqual({
      artifact: "rockwool_screening_field_output_carry_forward",
      designGradeFieldOutputAllowedNow: false,
      exactSourceValidatedNow: false,
      groupedScreeningAnswer: "Rw 41",
      groupedStrategy: "multileaf_screening_blend",
      sourceLaneDisposition: "paused_waiting_rights_safe_source_packet",
      visiblePostureRequiredNow: "screening_only_not_fixed_not_source_validated"
    });
  });

  it("keeps active docs and current-gate runner aligned with Gate A and selected Gate B", () => {
    for (const relativePath of REQUIRED_ALIGNED_DOCS) {
      const contents = readRepoFile(relativePath);
      expect(contents).toContain(FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_A.selectionStatus);
      expect(contents).toContain(FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_A.selectedNextFile);
      expect(contents).toContain(FIELD_OUTPUT_OWNER_AND_DESIGN_GRADE_POLICY_GATE_A.selectedNextAction);
      expect(contents).toContain("field_output_owner_design_grade_policy_inventory");
      expect(contents).toContain("source_basis_and_tolerance_requirement_matrix");
      expect(contents).toContain("missing_geometry_and_missing_field_input_negative_boundaries");
      expect(contents).toContain("rockwool_screening_field_output_carry_forward");
      expect(contents).toContain("pre_company_internal_use_exit_criteria");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/field-output-owner-and-design-grade-policy-gate-a-contract.test.ts");
  });
});
