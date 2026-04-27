import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, ResolvedLayer } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  findVerifiedAirborneAssemblyMatch,
  findVerifiedAirborneAssemblyMatchWithLabFallback
} from "./airborne-verified-catalog";
import { summarizeAirborneTopology, type AirborneTopologySummary } from "./airborne-topology";
import { calculateAssembly } from "./calculate-assembly";
import { computeLayerSurfaceMassKgM2 } from "./layer-surface-mass";
import { getDefaultMaterialCatalog, resolveMaterial } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const;
const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const;

const FIELD_CONTEXT = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 2500,
  panelWidthMm: 4000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 50
} as const satisfies AirborneContext;

const LAB_CONTEXT = {
  airtightness: "good",
  contextMode: "element_lab"
} as const satisfies AirborneContext;

const WALL_SINGLE_LEAF_MASS_LAW_GATE_A = {
  sliceId: "wall_single_leaf_mass_law_calibration_v1",
  landedGate: "gate_a_source_formula_contract",
  latestClosedSlice: "wall_coverage_expansion_planning_v2",
  candidateFamily: "unmatched_massive_single_leaf_wall",
  candidateRouteFamily: "wall_single_leaf_massive_formula_lane",
  runtimeBehaviorChange: false,
  runtimeWidening: false,
  runtimeTightening: false,
  selectedGateBAction:
    "gate_b_bounded_runtime_candidate_matrix_or_no_runtime_closeout_for_unmatched_single_leaf_massive_walls",
  status: "no_runtime_contract_landed"
} as const;

const MASS_LAW_SOURCE_FORMULA_BASIS = [
  {
    id: "ks_type_0_homogeneous_mineral",
    codeOwner: "packages/engine/src/airborne-calculator.ts",
    formula: "Rw = 30.9 * log10(surfaceMassKgM2) - 22.2",
    massRangeKgM2: "65 < m < 720",
    runtimeSurface: "ks_rw_calibrated",
    toleranceOwner: "formula_owned_until_benchmarked_against_single_leaf_wall_sources"
  },
  {
    id: "ks_type_3_aac",
    codeOwner: "packages/engine/src/airborne-calculator.ts",
    formula: "Rw = 30.9 * log10(surfaceMassKgM2) - 20.2",
    massRangeKgM2: "140 < m < 480",
    runtimeSurface: "ks_rw_calibrated",
    toleranceOwner: "formula_owned_until_benchmarked_against_aac_source_rows"
  },
  {
    id: "ks_type_4_lightweight_concrete",
    codeOwner: "packages/engine/src/airborne-calculator.ts",
    formula:
      "Rw = 32.6 * log10(m) - 22.5 for 50-150 kg/m2; Rw = 26.1 * log10(m) - 8.4 for 150-300 kg/m2",
    massRangeKgM2: "50 <= m <= 300",
    runtimeSurface: "ks_rw_calibrated",
    toleranceOwner: "formula_owned_until_benchmarked_against_lightweight_concrete_wall_sources"
  },
  {
    id: "single_leaf_masonry_aircrete_calibration",
    codeOwner: "packages/engine/src/dynamic-airborne-masonry-calibration.ts",
    formula: "source-row calibration functions over current dynamic masonry delegate",
    massRangeKgM2: "bounded_by_material_family_calibration_rows",
    runtimeSurface:
      "silicate_masonry_calibration | aircrete_unfinished_calibration | porotherm_plastered_calibration | xella_yton_family_calibrations",
    toleranceOwner:
      "packages/engine/src/airborne-masonry-benchmark.test.ts and sibling masonry benchmark suites"
  }
] as const;

const POSITIVE_GATE_B_CANDIDATES = [
  {
    id: "concrete_150_unmatched_massive_single_leaf",
    layers: [{ materialId: "concrete", thicknessMm: 150 }],
    expectedFamily: "rigid_massive_wall",
    expectedMethod: "ks_rw_calibrated",
    expectedRwPrimeDb: 53,
    expectedStrategy: "rigid_massive_blend",
    formulaBasisId: "ks_type_0_homogeneous_mineral"
  },
  {
    id: "solid_brick_150_unmatched_single_leaf",
    layers: [{ materialId: "solid_brick", thicknessMm: 150 }],
    expectedFamily: "masonry_nonhomogeneous",
    expectedMethod: "sharp",
    expectedRwPrimeDb: 51,
    expectedStrategy: "masonry_nonhomogeneous_blend",
    formulaBasisId: "single_leaf_masonry_aircrete_calibration"
  },
  {
    id: "generic_aac_150_unmatched_single_leaf",
    layers: [{ materialId: "aac", thicknessMm: 150 }],
    expectedFamily: "masonry_nonhomogeneous",
    expectedMethod: "sharp",
    expectedRwPrimeDb: 38,
    expectedStrategy: "masonry_nonhomogeneous_blend+aircrete_unfinished_calibration",
    formulaBasisId: "single_leaf_masonry_aircrete_calibration"
  }
] as const satisfies readonly {
  expectedFamily: string;
  expectedMethod: string;
  expectedRwPrimeDb: number;
  expectedStrategy: string;
  formulaBasisId: (typeof MASS_LAW_SOURCE_FORMULA_BASIS)[number]["id"];
  id: string;
  layers: readonly LayerInput[];
}[];

const PROTECTED_EXACT_OR_SOURCE_ROWS = [
  {
    id: "silka_150_lab_fallback_in_field_context",
    layers: [{ materialId: "silka_cs_block", thicknessMm: 150 }],
    context: FIELD_CONTEXT,
    expectedMetricValue: 50,
    expectedMatchId: "xella_silka_cs_150_official_2026",
    expectedRwDb: 48,
    usedLabFallback: true
  },
  {
    id: "xella_d700_150_plaster10_exact_lab",
    layers: [
      { materialId: "cement_plaster", thicknessMm: 10 },
      { materialId: "ytong_aac_d700", thicknessMm: 150 },
      { materialId: "cement_plaster", thicknessMm: 10 }
    ],
    context: LAB_CONTEXT,
    expectedMetricValue: 47,
    expectedMatchId: "xella_ytong_d700_150_plaster10_official_2026",
    expectedRwDb: 47,
    usedLabFallback: false
  },
  {
    id: "porotherm_140_dense_plaster_exact_lab",
    layers: [
      { materialId: "dense_plaster", thicknessMm: 13 },
      { materialId: "porotherm_pls_140", thicknessMm: 140 },
      { materialId: "dense_plaster", thicknessMm: 13 }
    ],
    context: LAB_CONTEXT,
    expectedMetricValue: 44,
    expectedMatchId: "wienerberger_porotherm_140_dense_plaster_primary_2026",
    expectedRwDb: 44,
    usedLabFallback: false
  }
] as const satisfies readonly {
  context: AirborneContext;
  expectedMatchId: string;
  expectedMetricValue: number;
  expectedRwDb: number;
  id: string;
  layers: readonly LayerInput[];
  usedLabFallback: boolean;
}[];

const NEGATIVE_TOPOLOGY_BOUNDARIES = [
  {
    id: "double_leaf_empty_cavity",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 70 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ],
    expectedFamily: "double_leaf",
    expectedStrategy: "double_leaf_empty_cavity_delegate",
    reason: "has_cavity_and_two_visible_leaves"
  },
  {
    id: "lined_massive_heavy_core_concrete",
    layers: [
      { materialId: "gypsum_board", thicknessMm: 12.5 },
      { materialId: "rockwool", thicknessMm: 50 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "concrete", thicknessMm: 100 }
    ],
    expectedFamily: "lined_massive_wall",
    expectedStrategy: "lined_massive_blend",
    reason: "lined_massive_heavy_core_is_a_separate_screening_lane"
  },
  {
    id: "clt_140_laminated_single_leaf",
    layers: [{ materialId: "clt_panel", thicknessMm: 140 }],
    expectedFamily: "single_leaf_panel",
    expectedStrategy: "timber_panel_blend",
    reason: "laminated_timber_panel_is_not_the_mineral_mass_law_lane"
  }
] as const satisfies readonly {
  expectedFamily: string;
  expectedStrategy: string;
  id: string;
  layers: readonly LayerInput[];
  reason: string;
}[];

const PROTECTED_ADJACENT_SURFACES = [
  {
    id: "lsf_and_resilient_exact_catalog_rows",
    evidenceOwners: [
      "packages/engine/src/airborne-verified-catalog.test.ts",
      "packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts",
      "apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts"
    ],
    formulaLaneMayOverride: false
  },
  {
    id: "timber_stud_and_direct_timber_exact_rows",
    evidenceOwners: [
      "packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts",
      "packages/engine/src/wall-timber-lightweight-source-audit.test.ts",
      "apps/web/features/workbench/wall-direct-timber-exact-route-card-matrix.test.ts"
    ],
    formulaLaneMayOverride: false
  },
  {
    id: "clt_wall_formula_lane",
    evidenceOwners: [
      "packages/engine/src/wall-clt-gate-b-source-contract.test.ts",
      "packages/engine/src/wall-timber-stud-clt-gate-a-audit-contract.test.ts"
    ],
    formulaLaneMayOverride: false
  },
  {
    id: "heavy_core_concrete_lined_massive_screening_lane",
    evidenceOwners: [
      "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
      "packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts"
    ],
    formulaLaneMayOverride: false
  }
] as const;

const GATE_B_RUNTIME_CONTRACT_REQUIREMENTS = {
  allowedPositiveRuntimeScope: [
    "unmatched_single_visible_mineral_leaf",
    "zero_cavities",
    "zero_porous_or_gap_fill",
    "zero_stud_or_support_layers",
    "no_verified_exact_catalog_match",
    "no_lab_fallback_match",
    "not_clt_or_timber_panel",
    "not_lined_massive_heavy_core"
  ],
  requiredMatricesBeforeRuntimeMove: [
    "positive_unmatched_concrete_masonry_aac_candidates",
    "negative_exact_lsf_resilient_timber_stud_clt_lined_massive_candidates",
    "exact_and_lab_fallback_precedence",
    "field_output_support_and_missing_input_honesty",
    "web_route_card_when_values_support_confidence_or_evidence_text_move"
  ],
  uiCardTestRequiredWhen: [
    "Rw_or_RwPrime_value_changes",
    "supported_output_set_changes",
    "confidence_or_evidence_text_changes",
    "missing_input_or_unsupported_copy_changes"
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

function hasVerifiedOrLabFallback(
  layers: readonly ResolvedLayer[],
  context: AirborneContext
): boolean {
  return Boolean(findVerifiedAirborneAssemblyMatchWithLabFallback(layers, context));
}

function isGateBEligibleUnmatchedMassiveSingleLeaf(input: {
  context: AirborneContext;
  dynamicFamily: string | undefined;
  layers: readonly ResolvedLayer[];
  strategy: string | undefined;
  topology: AirborneTopologySummary;
}): boolean {
  return (
    input.topology.visibleLeafCount === 1 &&
    input.topology.cavityCount === 0 &&
    input.topology.porousLayerCount === 0 &&
    !input.topology.hasStudLikeSupport &&
    !hasVerifiedOrLabFallback(input.layers, input.context) &&
    ["rigid_massive_wall", "masonry_nonhomogeneous"].includes(input.dynamicFamily ?? "") &&
    !/lined_massive|timber|panel|double_leaf|stud/i.test(input.strategy ?? "")
  );
}

describe("wall single-leaf mass-law calibration Gate A contract", () => {
  it("records the no-runtime Gate A decision and names the source/formula basis", () => {
    expect(WALL_SINGLE_LEAF_MASS_LAW_GATE_A).toEqual({
      sliceId: "wall_single_leaf_mass_law_calibration_v1",
      landedGate: "gate_a_source_formula_contract",
      latestClosedSlice: "wall_coverage_expansion_planning_v2",
      candidateFamily: "unmatched_massive_single_leaf_wall",
      candidateRouteFamily: "wall_single_leaf_massive_formula_lane",
      runtimeBehaviorChange: false,
      runtimeWidening: false,
      runtimeTightening: false,
      selectedGateBAction:
        "gate_b_bounded_runtime_candidate_matrix_or_no_runtime_closeout_for_unmatched_single_leaf_massive_walls",
      status: "no_runtime_contract_landed"
    });

    expect(MASS_LAW_SOURCE_FORMULA_BASIS.map((entry) => entry.id)).toEqual([
      "ks_type_0_homogeneous_mineral",
      "ks_type_3_aac",
      "ks_type_4_lightweight_concrete",
      "single_leaf_masonry_aircrete_calibration"
    ]);

    for (const path of [
      "docs/calculator/SLICE_WALL_SINGLE_LEAF_MASS_LAW_CALIBRATION_PLAN.md",
      "docs/calculator/CHECKPOINT_2026-04-27_WALL_SINGLE_LEAF_MASS_LAW_GATE_A_HANDOFF.md",
      "packages/engine/src/airborne-calculator.ts",
      "packages/engine/src/dynamic-airborne-masonry-calibration.ts",
      "packages/engine/src/airborne-masonry-benchmark.test.ts",
      "packages/engine/src/airborne-aircrete-benchmark.test.ts",
      "packages/engine/src/airborne-ytong-massief-benchmark.test.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("pins positive unmatched mineral single-leaf candidates for Gate B analysis", () => {
    for (const testCase of POSITIVE_GATE_B_CANDIDATES) {
      const resolvedLayers = resolveRows(testCase.layers);
      const topology = summarizeAirborneTopology(resolvedLayers);
      const result = calculateAssembly(testCase.layers, {
        airborneContext: FIELD_CONTEXT,
        calculator: "dynamic",
        targetOutputs: WALL_FIELD_OUTPUTS
      });

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
        detectedFamily: testCase.expectedFamily,
        selectedMethod: testCase.expectedMethod,
        strategy: testCase.expectedStrategy
      });
      expect(result.metrics.estimatedRwPrimeDb, testCase.id).toBe(testCase.expectedRwPrimeDb);
      expect(
        isGateBEligibleUnmatchedMassiveSingleLeaf({
          context: FIELD_CONTEXT,
          dynamicFamily: result.dynamicAirborneTrace?.detectedFamily,
          layers: resolvedLayers,
          strategy: result.dynamicAirborneTrace?.strategy,
          topology
        }),
        testCase.id
      ).toBe(true);
    }
  });

  it("keeps exact catalog and lab-fallback rows stronger than the formula lane", () => {
    for (const testCase of PROTECTED_EXACT_OR_SOURCE_ROWS) {
      const resolvedLayers = resolveRows(testCase.layers);
      const topology = summarizeAirborneTopology(resolvedLayers);
      const match = findVerifiedAirborneAssemblyMatchWithLabFallback(
        resolvedLayers,
        testCase.context
      );
      const targetOutputs =
        testCase.context.contextMode === "element_lab" ? WALL_LAB_OUTPUTS : WALL_FIELD_OUTPUTS;
      const result = calculateAssembly(testCase.layers, {
        airborneContext: testCase.context,
        calculator: "dynamic",
        targetOutputs
      });

      expect(topology.visibleLeafCount, testCase.id).toBe(1);
      expect(match?.match.id, testCase.id).toBe(testCase.expectedMatchId);
      expect(match?.match.metricValue, testCase.id).toBe(testCase.expectedMetricValue);
      expect(match?.usedLabFallback, testCase.id).toBe(testCase.usedLabFallback);
      expect(result.metrics.estimatedRwDb, testCase.id).toBe(testCase.expectedRwDb);
      expect(
        isGateBEligibleUnmatchedMassiveSingleLeaf({
          context: testCase.context,
          dynamicFamily: result.dynamicAirborneTrace?.detectedFamily,
          layers: resolvedLayers,
          strategy: result.dynamicAirborneTrace?.strategy,
          topology
        }),
        testCase.id
      ).toBe(false);
    }
  });

  it("blocks adjacent non-target topologies from the single-leaf mineral formula lane", () => {
    for (const testCase of NEGATIVE_TOPOLOGY_BOUNDARIES) {
      const resolvedLayers = resolveRows(testCase.layers);
      const topology = summarizeAirborneTopology(resolvedLayers);
      const result = calculateAssembly(testCase.layers, {
        airborneContext: FIELD_CONTEXT,
        calculator: "dynamic",
        targetOutputs: WALL_FIELD_OUTPUTS
      });

      expect(result.dynamicAirborneTrace, testCase.id).toMatchObject({
        detectedFamily: testCase.expectedFamily,
        strategy: testCase.expectedStrategy
      });
      expect(
        isGateBEligibleUnmatchedMassiveSingleLeaf({
          context: FIELD_CONTEXT,
          dynamicFamily: result.dynamicAirborneTrace?.detectedFamily,
          layers: resolvedLayers,
          strategy: result.dynamicAirborneTrace?.strategy,
          topology
        }),
        `${testCase.id} ${testCase.reason}`
      ).toBe(false);
    }
  });

  it("locks Gate B requirements and protected adjacent evidence surfaces", () => {
    expect(GATE_B_RUNTIME_CONTRACT_REQUIREMENTS.allowedPositiveRuntimeScope).toEqual([
      "unmatched_single_visible_mineral_leaf",
      "zero_cavities",
      "zero_porous_or_gap_fill",
      "zero_stud_or_support_layers",
      "no_verified_exact_catalog_match",
      "no_lab_fallback_match",
      "not_clt_or_timber_panel",
      "not_lined_massive_heavy_core"
    ]);
    expect(GATE_B_RUNTIME_CONTRACT_REQUIREMENTS.requiredMatricesBeforeRuntimeMove).toContain(
      "web_route_card_when_values_support_confidence_or_evidence_text_move"
    );

    for (const surface of PROTECTED_ADJACENT_SURFACES) {
      expect(surface.formulaLaneMayOverride, surface.id).toBe(false);
      for (const path of surface.evidenceOwners) {
        expect(existsSync(join(REPO_ROOT, path)), `${surface.id} ${path}`).toBe(true);
      }
    }
  });
});
