import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, ResolvedLayer } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { findVerifiedAirborneAssemblyMatchWithLabFallback } from "./airborne-verified-catalog";
import { summarizeAirborneTopology } from "./airborne-topology";
import { calculateAssembly } from "./calculate-assembly";
import { computeLayerSurfaceMassKgM2 } from "./layer-surface-mass";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const;
const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const;

const PLAIN_FIELD_CONTEXT = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 30
} as const satisfies AirborneContext;

const PLAIN_LAB_CONTEXT = {
  airtightness: "good",
  contextMode: "element_lab"
} as const satisfies AirborneContext;

const FRAMED_FIELD_CONTEXT = {
  ...PLAIN_FIELD_CONTEXT,
  connectionType: "line_connection",
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
} as const satisfies AirborneContext;

const FRAMED_LAB_CONTEXT = {
  ...PLAIN_LAB_CONTEXT,
  connectionType: "line_connection",
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
} as const satisfies AirborneContext;

const WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_A = {
  candidateFamily: "double_leaf_stud_cavity_wall",
  candidateRouteFamily: "wall_double_leaf_stud_cavity_formula_scoping",
  landedGate: "gate_a_scope_sharp_davy_double_leaf_cavity_applicability",
  latestClosedSlice: "wall_single_leaf_mass_law_calibration_v1",
  runtimeBehaviorChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedGateBAction:
    "gate_b_build_bounded_double_leaf_stud_candidate_matrix_or_close_no_runtime",
  sliceId: "wall_double_leaf_sharp_davy_scoping_v1",
  status: "no_runtime_scoping_contract_landed"
} as const;

const REPRESENTATIVE_CASES = [
  {
    fieldContext: PLAIN_FIELD_CONTEXT,
    id: "empty_double_leaf",
    labContext: PLAIN_LAB_CONTEXT,
    layers: [
      { materialId: "ytong_aac_d700", thicknessMm: 80 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    expected: {
      adjustmentDb: 1,
      candidateRwDb: 47,
      cavityCount: 1,
      confidence: "medium",
      dnTA: 45.8,
      dnTw: 47,
      dnW: 47,
      family: "double_leaf",
      hasPorousFill: false,
      method: "mass_law",
      porousLayerCount: 0,
      rw: 48,
      rwPrime: 46,
      strategy: "double_leaf_empty_cavity_delegate",
      totalGapThicknessMm: 50,
      visibleLeafMassRatio: 5.3
    }
  },
  {
    fieldContext: PLAIN_FIELD_CONTEXT,
    id: "porous_double_leaf_no_stud_metadata",
    labContext: PLAIN_LAB_CONTEXT,
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "air_gap", thicknessMm: 25 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    expected: {
      adjustmentDb: 4,
      candidateRwDb: 39,
      cavityCount: 1,
      confidence: "low",
      dnTA: 40.4,
      dnTw: 42,
      dnW: 42,
      family: "double_leaf",
      hasPorousFill: true,
      method: "mass_law",
      porousLayerCount: 1,
      rw: 43,
      rwPrime: 41,
      strategy: "double_leaf_porous_fill_corrected",
      totalGapThicknessMm: 25,
      visibleLeafMassRatio: 1
    }
  },
  {
    fieldContext: FRAMED_FIELD_CONTEXT,
    id: "single_stud_with_explicit_metadata",
    labContext: FRAMED_LAB_CONTEXT,
    layers: [
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 75 },
      { materialId: "glasswool", thicknessMm: 60 },
      { materialId: "gypsum", thicknessMm: 12.5 }
    ],
    expected: {
      adjustmentDb: 1,
      candidateRwDb: 40,
      cavityCount: 1,
      confidence: "low",
      dnTA: 35.9,
      dnTw: 38,
      dnW: 38,
      family: "stud_wall_system",
      familyDecisionClass: "narrow",
      familyDecisionMargin: 0.2,
      hasPorousFill: true,
      method: "mass_law",
      porousLayerCount: 1,
      runnerUpFamily: "double_leaf",
      rw: 45,
      rwPrime: 37,
      strategy: "stud_surrogate_blend+framed_wall_calibration",
      totalGapThicknessMm: 75,
      visibleLeafMassRatio: 1
    }
  },
  {
    fieldContext: FRAMED_FIELD_CONTEXT,
    id: "double_stud_split_cavity_with_explicit_metadata",
    labContext: FRAMED_LAB_CONTEXT,
    layers: [
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 75 },
      { materialId: "glasswool", thicknessMm: 60 },
      { materialId: "air_gap", thicknessMm: 70 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 }
    ],
    expected: {
      adjustmentDb: 1,
      candidateRwDb: 47,
      cavityCount: 1,
      confidence: "medium",
      dnTA: 51.8,
      dnTw: 53,
      dnW: 53,
      family: "double_stud_system",
      hasPorousFill: true,
      method: "mass_law",
      porousLayerCount: 1,
      rw: 61,
      rwPrime: 52,
      strategy: "double_stud_surrogate_blend+double_stud_calibration",
      totalGapThicknessMm: 145,
      visibleLeafMassRatio: 1
    }
  }
] as const satisfies readonly {
  expected: {
    adjustmentDb: number;
    candidateRwDb: number;
    cavityCount: number;
    confidence: string;
    dnTA: number;
    dnTw: number;
    dnW: number;
    family: string;
    familyDecisionClass?: string;
    familyDecisionMargin?: number;
    hasPorousFill: boolean;
    method: string;
    porousLayerCount: number;
    runnerUpFamily?: string;
    rw: number;
    rwPrime: number;
    strategy: string;
    totalGapThicknessMm: number;
    visibleLeafMassRatio: number;
  };
  fieldContext: AirborneContext;
  id: string;
  labContext: AirborneContext;
  layers: readonly LayerInput[];
}[];

const FORMULA_DELEGATE_OWNERSHIP = [
  {
    currentDelegate: "mass_law",
    family: "double_leaf",
    implementationOwners: [
      "packages/engine/src/dynamic-airborne.ts",
      "packages/engine/src/dynamic-airborne-cavity-topology.ts"
    ],
    routeStatus: "formula_owned_but_not_source_tolerance_promoted"
  },
  {
    currentDelegate: "mass_law+framed_wall_calibration",
    family: "stud_wall_system",
    implementationOwners: [
      "packages/engine/src/dynamic-airborne.ts",
      "packages/engine/src/dynamic-airborne-framed-wall.ts"
    ],
    routeStatus: "explicit_metadata_required_before_stud_lane_can_be_read_as_framed"
  },
  {
    currentDelegate: "mass_law+double_stud_calibration",
    family: "double_stud_system",
    implementationOwners: [
      "packages/engine/src/dynamic-airborne.ts",
      "packages/engine/src/dynamic-airborne-framed-wall.ts"
    ],
    routeStatus: "split_cavity_independent_track_formula_owned_but_source_tolerance_pending"
  },
  {
    currentDelegate: "screening_seed_plus_sharp_blend",
    family: "multileaf_multicavity",
    implementationOwners: [
      "packages/engine/src/dynamic-airborne.ts",
      "packages/engine/src/dynamic-airborne-cavity-topology.ts"
    ],
    routeStatus: "negative_boundary_for_triple_leaf_or_multi_cavity_shapes"
  }
] as const;

const REQUIRED_METADATA_BEFORE_RUNTIME_MOVEMENT = [
  "leaf_count",
  "leaf_surface_mass_and_asymmetry",
  "cavity_depth",
  "porous_fill_type_and_thickness",
  "residual_air_gap_depth",
  "stud_type",
  "stud_spacing",
  "shared_track_or_independent_track",
  "connection_type",
  "direct_coupling",
  "triple_leaf_or_multi_cavity_detection"
] as const;

const NEGATIVE_BOUNDARY_CASES = [
  {
    id: "aac_lining_boundary_stays_lined_massive_hold",
    expected: {
      family: "lined_massive_wall",
      familyBoundaryHoldApplied: true,
      familyDecisionClass: "ambiguous",
      runnerUpFamily: "double_leaf",
      rw: 46,
      rwPrime: 44,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold",
      visibleLeafCount: 2
    },
    fieldContext: PLAIN_FIELD_CONTEXT,
    labContext: PLAIN_LAB_CONTEXT,
    layers: [
      { materialId: "ytong_aac_d700", thicknessMm: 100 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ]
  },
  {
    id: "classic_triple_leaf_stays_multileaf_screening",
    expected: {
      cavityCount: 2,
      family: "multileaf_multicavity",
      rw: 32,
      rwPrime: 30,
      strategy: "multileaf_screening_blend",
      visibleLeafCount: 3
    },
    fieldContext: PLAIN_FIELD_CONTEXT,
    labContext: PLAIN_LAB_CONTEXT,
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ]
  }
] as const satisfies readonly {
  expected: {
    cavityCount?: number;
    family: string;
    familyBoundaryHoldApplied?: boolean;
    familyDecisionClass?: string;
    runnerUpFamily?: string;
    rw: number;
    rwPrime: number;
    strategy: string;
    visibleLeafCount: number;
  };
  fieldContext: AirborneContext;
  id: string;
  labContext: AirborneContext;
  layers: readonly LayerInput[];
}[];

const PROTECTED_EXACT_AND_ADJACENT_SURFACES = [
  {
    evidenceOwners: [
      "packages/engine/src/airborne-verified-catalog.test.ts",
      "packages/engine/src/airborne-verified-catalog-same-material-split-invariance.test.ts"
    ],
    formulaLaneMayOverride: false,
    id: "exact_catalog_rows"
  },
  {
    evidenceOwners: [
      "packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts",
      "apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts"
    ],
    formulaLaneMayOverride: false,
    id: "resilient_bar_side_count_exact_rows"
  },
  {
    evidenceOwners: [
      "packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts",
      "packages/engine/src/wall-timber-lightweight-source-audit.test.ts"
    ],
    formulaLaneMayOverride: false,
    id: "timber_exact_and_live_stud_formula_surfaces"
  },
  {
    evidenceOwners: [
      "packages/engine/src/wall-single-leaf-mass-law-calibration-gate-b-contract.test.ts",
      "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
      "packages/engine/src/wall-clt-gate-b-source-contract.test.ts"
    ],
    formulaLaneMayOverride: false,
    id: "single_leaf_lined_massive_and_clt_boundaries"
  }
] as const;

const GATE_B_SELECTION_REQUIREMENTS = {
  gateAAllowsRuntimeMovement: false,
  requiredBeforeAnyGateBValueMovement: [
    "positive_current_value_matrix_for_empty_double_leaf_porous_double_leaf_single_stud_and_double_stud",
    "negative_matrix_for_exact_catalog_resilient_timber_single_leaf_lined_massive_clt_and_triple_leaf",
    "explicit_source_or_formula_tolerance_owner_for_each_candidate_family",
    "field_output_support_for_rwprime_dnw_dntw_and_dnta",
    "route_card_tests_if_value_support_confidence_evidence_or_missing_input_copy_changes"
  ],
  selectedGateBAction:
    "gate_b_build_bounded_double_leaf_stud_candidate_matrix_or_close_no_runtime",
  unsupportedMoves: [
    "apply_sharp_or_davy_retune_without_scope_contract",
    "promote_stud_wall_system_from_low_confidence_without_source_or_bounded_family_rule",
    "merge_triple_leaf_multicavity_into_double_leaf",
    "override_exact_catalog_or_resilient_side_count_rows"
  ]
} as const;

function resolveRows(layers: readonly LayerInput[]): ResolvedLayer[] {
  const catalog = getDefaultMaterialCatalog();

  return layers.map((layer) => {
    const material = resolveMaterial(layer.materialId, catalog);

    return {
      ...layer,
      material,
      surfaceMassKgM2: computeLayerSurfaceMassKgM2(layer, material)
    };
  });
}

function selectedCandidate(
  candidateMethods: unknown
): { method: string; rwDb: number; selected: boolean } | undefined {
  if (!Array.isArray(candidateMethods)) {
    return undefined;
  }

  return candidateMethods.find(
    (candidate): candidate is { method: string; rwDb: number; selected: boolean } =>
      typeof candidate === "object" &&
      candidate !== null &&
      "selected" in candidate &&
      candidate.selected === true &&
      "method" in candidate &&
      typeof candidate.method === "string" &&
      "rwDb" in candidate &&
      typeof candidate.rwDb === "number"
  );
}

describe("wall double-leaf Sharp/Davy scoping Gate A contract", () => {
  it("records Gate A as a no-runtime scoping contract before any double-leaf retune", () => {
    expect(WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_A).toEqual({
      candidateFamily: "double_leaf_stud_cavity_wall",
      candidateRouteFamily: "wall_double_leaf_stud_cavity_formula_scoping",
      landedGate: "gate_a_scope_sharp_davy_double_leaf_cavity_applicability",
      latestClosedSlice: "wall_single_leaf_mass_law_calibration_v1",
      runtimeBehaviorChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedGateBAction:
        "gate_b_build_bounded_double_leaf_stud_candidate_matrix_or_close_no_runtime",
      sliceId: "wall_double_leaf_sharp_davy_scoping_v1",
      status: "no_runtime_scoping_contract_landed"
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-27_WALL_SINGLE_LEAF_MASS_LAW_GATE_C_CLOSEOUT_HANDOFF.md",
      "packages/engine/src/post-wall-single-leaf-mass-law-calibration-v1-next-slice-selection-contract.test.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins representative double-leaf, stud, and double-stud current values without moving runtime", () => {
    for (const testCase of REPRESENTATIVE_CASES) {
      const resolvedLayers = resolveRows(testCase.layers);
      const topology = summarizeAirborneTopology(resolvedLayers);
      const lab = calculateAssembly(testCase.layers, {
        airborneContext: testCase.labContext,
        calculator: "dynamic",
        targetOutputs: WALL_LAB_OUTPUTS
      });
      const field = calculateAssembly(testCase.layers, {
        airborneContext: testCase.fieldContext,
        calculator: "dynamic",
        targetOutputs: WALL_FIELD_OUTPUTS
      });
      const trace = field.dynamicAirborneTrace ?? lab.dynamicAirborneTrace;

      expect(findVerifiedAirborneAssemblyMatchWithLabFallback(resolvedLayers, testCase.fieldContext), testCase.id)
        .toBeNull();
      expect(topology.visibleLeafCount, testCase.id).toBe(2);
      expect(lab.supportedTargetOutputs, testCase.id).toEqual([...WALL_LAB_OUTPUTS]);
      expect(field.supportedTargetOutputs, testCase.id).toEqual([...WALL_FIELD_OUTPUTS]);
      expect(lab.unsupportedTargetOutputs, testCase.id).toEqual([]);
      expect(field.unsupportedTargetOutputs, testCase.id).toEqual([]);
      expect(lab.metrics.estimatedRwDb, testCase.id).toBe(testCase.expected.rw);
      expect(field.metrics, testCase.id).toMatchObject({
        estimatedDnTADb: testCase.expected.dnTA,
        estimatedDnTwDb: testCase.expected.dnTw,
        estimatedDnWDb: testCase.expected.dnW,
        estimatedRwPrimeDb: testCase.expected.rwPrime
      });
      expect(trace, testCase.id).toMatchObject({
        adjustmentDb: testCase.expected.adjustmentDb,
        cavityCount: testCase.expected.cavityCount,
        confidenceClass: testCase.expected.confidence,
        detectedFamily: testCase.expected.family,
        hasPorousFill: testCase.expected.hasPorousFill,
        selectedMethod: testCase.expected.method,
        strategy: testCase.expected.strategy,
        totalGapThicknessMm: testCase.expected.totalGapThicknessMm,
        visibleLeafCount: 2,
        visibleLeafMassRatio: testCase.expected.visibleLeafMassRatio
      });
      expect(trace?.porousLayerCount, testCase.id).toBe(testCase.expected.porousLayerCount);
      expect(trace?.candidateMethods.map((candidate: { method: string }) => candidate.method), testCase.id).toEqual([
        "screening_mass_law_curve_seed_v3",
        "ks_rw_calibrated",
        "mass_law",
        "sharp",
        "kurtovic"
      ]);
      expect(selectedCandidate(trace?.candidateMethods), testCase.id).toMatchObject({
        method: testCase.expected.method,
        rwDb: testCase.expected.candidateRwDb,
        selected: true
      });

      if ("familyDecisionClass" in testCase.expected) {
        expect(trace, testCase.id).toMatchObject({
          familyDecisionClass: testCase.expected.familyDecisionClass,
          familyDecisionMargin: testCase.expected.familyDecisionMargin,
          runnerUpFamily: testCase.expected.runnerUpFamily
        });
      }
    }
  });

  it("maps current delegate ownership and required metadata before any runtime movement", () => {
    expect(FORMULA_DELEGATE_OWNERSHIP.map((entry) => entry.family)).toEqual([
      "double_leaf",
      "stud_wall_system",
      "double_stud_system",
      "multileaf_multicavity"
    ]);
    expect(REQUIRED_METADATA_BEFORE_RUNTIME_MOVEMENT).toEqual([
      "leaf_count",
      "leaf_surface_mass_and_asymmetry",
      "cavity_depth",
      "porous_fill_type_and_thickness",
      "residual_air_gap_depth",
      "stud_type",
      "stud_spacing",
      "shared_track_or_independent_track",
      "connection_type",
      "direct_coupling",
      "triple_leaf_or_multi_cavity_detection"
    ]);

    for (const entry of FORMULA_DELEGATE_OWNERSHIP) {
      for (const path of entry.implementationOwners) {
        expect(existsSync(join(REPO_ROOT, path)), `${entry.family} ${path}`).toBe(true);
      }
    }
  });

  it("keeps exact rows, lined-massive boundaries, CLT, and triple-leaf shapes outside the Gate A target", () => {
    for (const surface of PROTECTED_EXACT_AND_ADJACENT_SURFACES) {
      expect(surface.formulaLaneMayOverride, surface.id).toBe(false);
      for (const path of surface.evidenceOwners) {
        expect(existsSync(join(REPO_ROOT, path)), `${surface.id} ${path}`).toBe(true);
      }
    }

    for (const testCase of NEGATIVE_BOUNDARY_CASES) {
      const lab = calculateAssembly(testCase.layers, {
        airborneContext: testCase.labContext,
        calculator: "dynamic",
        targetOutputs: WALL_LAB_OUTPUTS
      });
      const field = calculateAssembly(testCase.layers, {
        airborneContext: testCase.fieldContext,
        calculator: "dynamic",
        targetOutputs: WALL_FIELD_OUTPUTS
      });
      const trace = field.dynamicAirborneTrace ?? lab.dynamicAirborneTrace;

      expect(lab.metrics.estimatedRwDb, testCase.id).toBe(testCase.expected.rw);
      expect(field.metrics.estimatedRwPrimeDb, testCase.id).toBe(testCase.expected.rwPrime);
      expect(trace, testCase.id).toMatchObject({
        detectedFamily: testCase.expected.family,
        strategy: testCase.expected.strategy,
        visibleLeafCount: testCase.expected.visibleLeafCount
      });

      if ("cavityCount" in testCase.expected) {
        expect(trace?.cavityCount, testCase.id).toBe(testCase.expected.cavityCount);
      }

      if ("familyDecisionClass" in testCase.expected) {
        expect(trace, testCase.id).toMatchObject({
          familyBoundaryHoldApplied: testCase.expected.familyBoundaryHoldApplied,
          familyDecisionClass: testCase.expected.familyDecisionClass,
          runnerUpFamily: testCase.expected.runnerUpFamily
        });
      }
    }
  });

  it("selects Gate B candidate-matrix work but blocks value movement until source or tolerance evidence exists", () => {
    expect(GATE_B_SELECTION_REQUIREMENTS).toEqual({
      gateAAllowsRuntimeMovement: false,
      requiredBeforeAnyGateBValueMovement: [
        "positive_current_value_matrix_for_empty_double_leaf_porous_double_leaf_single_stud_and_double_stud",
        "negative_matrix_for_exact_catalog_resilient_timber_single_leaf_lined_massive_clt_and_triple_leaf",
        "explicit_source_or_formula_tolerance_owner_for_each_candidate_family",
        "field_output_support_for_rwprime_dnw_dntw_and_dnta",
        "route_card_tests_if_value_support_confidence_evidence_or_missing_input_copy_changes"
      ],
      selectedGateBAction:
        "gate_b_build_bounded_double_leaf_stud_candidate_matrix_or_close_no_runtime",
      unsupportedMoves: [
        "apply_sharp_or_davy_retune_without_scope_contract",
        "promote_stud_wall_system_from_low_confidence_without_source_or_bounded_family_rule",
        "merge_triple_leaf_multicavity_into_double_leaf",
        "override_exact_catalog_or_resilient_side_count_rows"
      ]
    });
  });
});
