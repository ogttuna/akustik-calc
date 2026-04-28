import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, ResolvedLayer } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  findVerifiedAirborneAssemblyMatch,
  findVerifiedAirborneAssemblyMatchWithLabFallback
} from "./airborne-verified-catalog";
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

const WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B = {
  landedGate: "gate_b_bounded_current_value_source_tolerance_matrix",
  previousGate: "gate_a_scope_sharp_davy_double_leaf_cavity_applicability",
  runtimeBehaviorChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedGateCAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
  sliceId: "wall_double_leaf_sharp_davy_scoping_v1",
  status: "no_runtime_source_tolerance_matrix_landed"
} as const;

const POSITIVE_CURRENT_VALUE_CASES = [
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
    },
    sourcePostureId: "empty_double_leaf_formula_owned_no_stack_source"
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
    },
    sourcePostureId: "porous_double_leaf_formula_owned_no_stack_source"
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
    },
    sourcePostureId: "single_stud_metadata_low_confidence_no_bounded_rule"
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
    },
    sourcePostureId: "double_stud_split_cavity_no_stack_source"
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
  sourcePostureId: string;
}[];

const SOURCE_TOLERANCE_DECISIONS = [
  {
    benchmarkEnvelope: false,
    candidateId: "empty_double_leaf",
    currentValueIsDefensible: true,
    directStackSourceRow: false,
    formulaToleranceOwner: false,
    id: "empty_double_leaf_formula_owned_no_stack_source",
    labFallbackSourceRow: false,
    runtimeMoveAllowedNow: false,
    runtimeMoveBlocker:
      "empty_aac_air_gap_gypsum_double_leaf_has_formula_basis_but_no_stack_source_row_or_bounded_tolerance"
  },
  {
    benchmarkEnvelope: false,
    candidateId: "porous_double_leaf_no_stud_metadata",
    currentValueIsDefensible: true,
    directStackSourceRow: false,
    formulaToleranceOwner: false,
    id: "porous_double_leaf_formula_owned_no_stack_source",
    labFallbackSourceRow: false,
    runtimeMoveAllowedNow: false,
    runtimeMoveBlocker:
      "gypsum_wool_gap_gypsum_double_leaf_has_no_direct_source_row_benchmark_envelope_or_named_tolerance"
  },
  {
    benchmarkEnvelope: false,
    candidateId: "single_stud_with_explicit_metadata",
    currentValueIsDefensible: true,
    directStackSourceRow: false,
    formulaToleranceOwner: false,
    id: "single_stud_metadata_low_confidence_no_bounded_rule",
    labFallbackSourceRow: false,
    runtimeMoveAllowedNow: false,
    runtimeMoveBlocker:
      "explicit_stud_metadata_routes_to_framed_calibration_but_low_confidence_stack_has_no_source_tolerance_rule"
  },
  {
    benchmarkEnvelope: false,
    candidateId: "double_stud_split_cavity_with_explicit_metadata",
    currentValueIsDefensible: true,
    directStackSourceRow: false,
    formulaToleranceOwner: false,
    id: "double_stud_split_cavity_no_stack_source",
    labFallbackSourceRow: false,
    runtimeMoveAllowedNow: false,
    runtimeMoveBlocker:
      "independent_split_cavity_double_stud_formula_owned_but_no_stack_specific_source_row_or_tolerance"
  }
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

const PROTECTED_BOUNDARY_SURFACES = [
  {
    evidenceOwners: [
      "packages/engine/src/airborne-verified-catalog.test.ts",
      "packages/engine/src/airborne-verified-catalog-lab-fallback.test.ts"
    ],
    formulaLaneMayOverride: false,
    id: "exact_catalog_and_lab_fallback_rows"
  },
  {
    evidenceOwners: [
      "packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts",
      "apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts"
    ],
    formulaLaneMayOverride: false,
    id: "resilient_side_count_rows"
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
    id: "single_leaf_lined_massive_heavy_core_and_clt_boundaries"
  },
  {
    evidenceOwners: [
      "packages/engine/src/wall-formula-family-widening-audit.test.ts",
      "packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-a-contract.test.ts"
    ],
    formulaLaneMayOverride: false,
    id: "direct_coupled_and_triple_leaf_negative_boundaries"
  }
] as const;

const GATE_B_CLOSEOUT_REQUIREMENTS = {
  closeoutReason:
    "positive_double_leaf_and_stud_candidates_are_supported_but_no_new_stack_source_or_formula_tolerance_justifies_runtime_movement",
  nextContractRequired:
    "post_wall_double_leaf_sharp_davy_scoping_v1_next_slice_selection_contract",
  nextGateAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
  routeCardWorkRequiredNow: false,
  routeCardRequiredIfLaterRuntimeMoves: true,
  unchangedSurfaces: [
    "runtime_values",
    "formula_coefficients",
    "confidence_scores",
    "output_support",
    "verified_catalog_precedence",
    "web_route_card_text"
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

describe("wall double-leaf Sharp/Davy scoping Gate B contract", () => {
  it("records Gate B as a no-runtime current-value source/tolerance matrix", () => {
    expect(WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B).toEqual({
      landedGate: "gate_b_bounded_current_value_source_tolerance_matrix",
      previousGate: "gate_a_scope_sharp_davy_double_leaf_cavity_applicability",
      runtimeBehaviorChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedGateCAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
      sliceId: "wall_double_leaf_sharp_davy_scoping_v1",
      status: "no_runtime_source_tolerance_matrix_landed"
    });

    for (const path of [
      "docs/calculator/SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_REVALIDATION.md",
      "packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-a-contract.test.ts",
      "packages/engine/src/dynamic-airborne.ts",
      "packages/engine/src/dynamic-airborne-cavity-topology.ts",
      "packages/engine/src/dynamic-airborne-framed-wall.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins positive double-leaf and stud current values without changing runtime", () => {
    for (const testCase of POSITIVE_CURRENT_VALUE_CASES) {
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

      expect(findVerifiedAirborneAssemblyMatch(resolvedLayers, testCase.fieldContext), testCase.id)
        .toBeNull();
      expect(findVerifiedAirborneAssemblyMatchWithLabFallback(resolvedLayers, testCase.fieldContext), testCase.id)
        .toBeNull();
      expect(topology.visibleLeafCount, testCase.id).toBe(2);
      expect(topology.hasPorousFill, testCase.id).toBe(testCase.expected.hasPorousFill);
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

  it("blocks runtime movement because no positive stack has source tolerance evidence", () => {
    expect(SOURCE_TOLERANCE_DECISIONS.map((decision) => decision.id)).toEqual(
      POSITIVE_CURRENT_VALUE_CASES.map((candidate) => candidate.sourcePostureId)
    );

    for (const decision of SOURCE_TOLERANCE_DECISIONS) {
      expect(decision.currentValueIsDefensible, decision.id).toBe(true);
      expect(decision.directStackSourceRow, decision.id).toBe(false);
      expect(decision.labFallbackSourceRow, decision.id).toBe(false);
      expect(decision.benchmarkEnvelope, decision.id).toBe(false);
      expect(decision.formulaToleranceOwner, decision.id).toBe(false);
      expect(decision.runtimeMoveAllowedNow, decision.id).toBe(false);
      expect(decision.runtimeMoveBlocker, decision.id).toMatch(/source|benchmark|tolerance|row/i);
      expect(
        POSITIVE_CURRENT_VALUE_CASES.some((candidate) => candidate.id === decision.candidateId),
        decision.id
      ).toBe(true);
    }
  });

  it("keeps exact, resilient, timber, single-leaf, CLT, direct-coupled, and triple-leaf surfaces protected", () => {
    for (const surface of PROTECTED_BOUNDARY_SURFACES) {
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

  it("selects Gate C closeout unless new source evidence is added before runtime movement", () => {
    expect(GATE_B_CLOSEOUT_REQUIREMENTS).toEqual({
      closeoutReason:
        "positive_double_leaf_and_stud_candidates_are_supported_but_no_new_stack_source_or_formula_tolerance_justifies_runtime_movement",
      nextContractRequired:
        "post_wall_double_leaf_sharp_davy_scoping_v1_next_slice_selection_contract",
      nextGateAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
      routeCardWorkRequiredNow: false,
      routeCardRequiredIfLaterRuntimeMoves: true,
      unchangedSurfaces: [
        "runtime_values",
        "formula_coefficients",
        "confidence_scores",
        "output_support",
        "verified_catalog_precedence",
        "web_route_card_text"
      ]
    });
  });
});
