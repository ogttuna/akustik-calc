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

const FIELD_CONTEXT = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 2500,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 50
} as const satisfies AirborneContext;

const WALL_SINGLE_LEAF_MASS_LAW_GATE_B = {
  sliceId: "wall_single_leaf_mass_law_calibration_v1",
  landedGate: "gate_b_bounded_runtime_candidate_matrix",
  previousGate: "gate_a_source_formula_contract",
  runtimeBehaviorChange: false,
  runtimeWidening: false,
  runtimeTightening: false,
  selectedGateCAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
  status: "no_runtime_candidate_matrix_landed"
} as const;

const POSITIVE_RUNTIME_CANDIDATES = [
  {
    id: "concrete_150_unmatched_massive_single_leaf",
    layers: [{ materialId: "concrete", thicknessMm: 150 }],
    expectedCandidateMethodRw: 56.8,
    expectedConfidence: "high",
    expectedDnTA: 54.1,
    expectedDnTw: 55,
    expectedDnW: 53,
    expectedFamily: "rigid_massive_wall",
    expectedMethod: "ks_rw_calibrated",
    expectedRwPrimeDb: 53,
    expectedSelectedDelegate: "ks_rw_calibrated",
    expectedStrategy: "rigid_massive_blend",
    sourcePostureId: "formula_owned_no_stack_specific_wall_source"
  },
  {
    id: "solid_brick_150_unmatched_single_leaf",
    layers: [{ materialId: "solid_brick", thicknessMm: 150 }],
    expectedCandidateMethodRw: 52,
    expectedConfidence: "medium",
    expectedDnTA: 51.7,
    expectedDnTw: 53,
    expectedDnW: 51,
    expectedFamily: "masonry_nonhomogeneous",
    expectedMethod: "sharp",
    expectedRwPrimeDb: 51,
    expectedSelectedDelegate: "sharp",
    expectedStrategy: "masonry_nonhomogeneous_blend",
    sourcePostureId: "generic_masonry_formula_no_solid_brick_source_row"
  },
  {
    id: "generic_aac_150_unmatched_single_leaf",
    layers: [{ materialId: "aac", thicknessMm: 150 }],
    expectedCandidateMethodRw: 42,
    expectedConfidence: "medium",
    expectedDnTA: 39.4,
    expectedDnTw: 40,
    expectedDnW: 38,
    expectedFamily: "masonry_nonhomogeneous",
    expectedMethod: "sharp",
    expectedRwPrimeDb: 38,
    expectedSelectedDelegate: "sharp",
    expectedStrategy: "masonry_nonhomogeneous_blend+aircrete_unfinished_calibration",
    sourcePostureId: "family_adjacent_aircrete_benchmark_no_generic_aac_source_row"
  }
] as const satisfies readonly {
  expectedCandidateMethodRw: number;
  expectedConfidence: string;
  expectedDnTA: number;
  expectedDnTw: number;
  expectedDnW: number;
  expectedFamily: string;
  expectedMethod: string;
  expectedRwPrimeDb: number;
  expectedSelectedDelegate: string;
  expectedStrategy: string;
  id: string;
  layers: readonly LayerInput[];
  sourcePostureId: string;
}[];

const SOURCE_POSTURE_DECISIONS = [
  {
    id: "formula_owned_no_stack_specific_wall_source",
    candidateId: "concrete_150_unmatched_massive_single_leaf",
    currentValueIsDefensible: true,
    directStackSourceRow: false,
    familyAdjacentBenchmark: false,
    runtimeMoveAllowedNow: false,
    runtimeMoveBlocker:
      "generic_concrete_single_leaf_has_formula_basis_but_no_wall_stack_source_row_or_tolerance_pack"
  },
  {
    id: "generic_masonry_formula_no_solid_brick_source_row",
    candidateId: "solid_brick_150_unmatched_single_leaf",
    currentValueIsDefensible: true,
    directStackSourceRow: false,
    familyAdjacentBenchmark: true,
    runtimeMoveAllowedNow: false,
    runtimeMoveBlocker:
      "masonry_benchmarks_cover_curated_silka_porotherm_heluz_ytong_rows_not_generic_solid_brick"
  },
  {
    id: "family_adjacent_aircrete_benchmark_no_generic_aac_source_row",
    candidateId: "generic_aac_150_unmatched_single_leaf",
    currentValueIsDefensible: true,
    directStackSourceRow: false,
    familyAdjacentBenchmark: true,
    runtimeMoveAllowedNow: false,
    runtimeMoveBlocker:
      "aircrete_benchmarks_cover_named_density_families_but_not_the_generic_aac_catalog_placeholder"
  }
] as const;

const THICKNESS_SENSITIVITY_CASES = [
  {
    id: "concrete_single_leaf_monotonic",
    expectedFamily: "rigid_massive_wall",
    materialId: "concrete",
    values: [
      { thicknessMm: 100, rwPrimeDb: 48 },
      { thicknessMm: 150, rwPrimeDb: 53 },
      { thicknessMm: 200, rwPrimeDb: 56 }
    ]
  },
  {
    id: "solid_brick_single_leaf_monotonic",
    expectedFamily: "masonry_nonhomogeneous",
    materialId: "solid_brick",
    values: [
      { thicknessMm: 100, rwPrimeDb: 47 },
      { thicknessMm: 150, rwPrimeDb: 51 },
      { thicknessMm: 200, rwPrimeDb: 54 }
    ]
  },
  {
    id: "generic_aac_single_leaf_monotonic",
    expectedFamily: "masonry_nonhomogeneous",
    materialId: "aac",
    values: [
      { thicknessMm: 100, rwPrimeDb: 33 },
      { thicknessMm: 150, rwPrimeDb: 38 },
      { thicknessMm: 200, rwPrimeDb: 42 }
    ]
  }
] as const;

const GATE_B_CLOSEOUT_REQUIREMENTS = {
  closeoutReason:
    "positive_candidates_are_supported_and_monotonic_but_have_no_new_stack_specific_source_or_tolerance_to_justify_runtime_movement",
  nextContractRequired:
    "post_wall_single_leaf_mass_law_calibration_v1_next_slice_selection_contract",
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

function selectedCandidateMethod(
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

describe("wall single-leaf mass-law calibration Gate B contract", () => {
  it("records Gate B as a no-runtime bounded candidate matrix", () => {
    expect(WALL_SINGLE_LEAF_MASS_LAW_GATE_B).toEqual({
      sliceId: "wall_single_leaf_mass_law_calibration_v1",
      landedGate: "gate_b_bounded_runtime_candidate_matrix",
      previousGate: "gate_a_source_formula_contract",
      runtimeBehaviorChange: false,
      runtimeWidening: false,
      runtimeTightening: false,
      selectedGateCAction: "gate_c_no_runtime_closeout_and_next_slice_selection",
      status: "no_runtime_candidate_matrix_landed"
    });

    for (const path of [
      "packages/engine/src/wall-single-leaf-mass-law-calibration-gate-a-contract.test.ts",
      "docs/calculator/SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-27_WALL_SINGLE_LEAF_MASS_LAW_GATE_B_HANDOFF.md",
      "packages/engine/src/airborne-calculator.ts",
      "packages/engine/src/dynamic-airborne-masonry-calibration.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins the positive runtime candidates without changing values", () => {
    for (const testCase of POSITIVE_RUNTIME_CANDIDATES) {
      const resolvedLayers = resolveRows(testCase.layers);
      const topology = summarizeAirborneTopology(resolvedLayers);
      const result = calculateAssembly(testCase.layers, {
        airborneContext: FIELD_CONTEXT,
        calculator: "dynamic",
        targetOutputs: WALL_FIELD_OUTPUTS
      });
      const selected = selectedCandidateMethod(result.dynamicAirborneTrace?.candidateMethods);

      expect(findVerifiedAirborneAssemblyMatch(resolvedLayers, FIELD_CONTEXT), testCase.id)
        .toBeNull();
      expect(findVerifiedAirborneAssemblyMatchWithLabFallback(resolvedLayers, FIELD_CONTEXT), testCase.id)
        .toBeNull();
      expect(topology, testCase.id).toMatchObject({
        cavityCount: 0,
        hasPorousFill: false,
        hasStudLikeSupport: false,
        visibleLeafCount: 1
      });
      expect(result.supportedTargetOutputs, testCase.id).toEqual([...WALL_FIELD_OUTPUTS]);
      expect(result.unsupportedTargetOutputs, testCase.id).toEqual([]);
      expect(result.dynamicAirborneTrace, testCase.id).toMatchObject({
        confidenceClass: testCase.expectedConfidence,
        detectedFamily: testCase.expectedFamily,
        selectedMethod: testCase.expectedMethod,
        strategy: testCase.expectedStrategy
      });
      expect(selected, testCase.id).toMatchObject({
        method: testCase.expectedSelectedDelegate,
        rwDb: testCase.expectedCandidateMethodRw,
        selected: true
      });
      expect(result.metrics, testCase.id).toMatchObject({
        estimatedDnTADb: testCase.expectedDnTA,
        estimatedDnTwDb: testCase.expectedDnTw,
        estimatedDnWDb: testCase.expectedDnW,
        estimatedRwPrimeDb: testCase.expectedRwPrimeDb
      });
    }
  });

  it("blocks runtime movement because no positive candidate has stack-specific source tolerance", () => {
    expect(SOURCE_POSTURE_DECISIONS.map((decision) => decision.id)).toEqual(
      POSITIVE_RUNTIME_CANDIDATES.map((candidate) => candidate.sourcePostureId)
    );

    for (const decision of SOURCE_POSTURE_DECISIONS) {
      expect(decision.currentValueIsDefensible, decision.id).toBe(true);
      expect(decision.directStackSourceRow, decision.id).toBe(false);
      expect(decision.runtimeMoveAllowedNow, decision.id).toBe(false);
      expect(decision.runtimeMoveBlocker, decision.id).toMatch(/source|benchmark|tolerance|row/i);
    }
  });

  it("keeps thickness sensitivity monotonic inside the bounded formula-owned corridor", () => {
    for (const testCase of THICKNESS_SENSITIVITY_CASES) {
      const observed = testCase.values.map(({ thicknessMm }) => {
        const result = calculateAssembly(
          [{ materialId: testCase.materialId, thicknessMm }],
          {
            airborneContext: FIELD_CONTEXT,
            calculator: "dynamic",
            targetOutputs: WALL_FIELD_OUTPUTS
          }
        );

        expect(result.dynamicAirborneTrace?.detectedFamily, `${testCase.id}:${thicknessMm}`)
          .toBe(testCase.expectedFamily);
        return result.metrics.estimatedRwPrimeDb;
      });

      expect(observed, testCase.id).toEqual(testCase.values.map((value) => value.rwPrimeDb));
      expect(observed[1], testCase.id).toBeGreaterThan(observed[0]);
      expect(observed[2], testCase.id).toBeGreaterThan(observed[1]);
    }
  });

  it("selects Gate C closeout unless new source evidence is added before runtime movement", () => {
    expect(GATE_B_CLOSEOUT_REQUIREMENTS).toEqual({
      closeoutReason:
        "positive_candidates_are_supported_and_monotonic_but_have_no_new_stack_specific_source_or_tolerance_to_justify_runtime_movement",
      nextContractRequired:
        "post_wall_single_leaf_mass_law_calibration_v1_next_slice_selection_contract",
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
