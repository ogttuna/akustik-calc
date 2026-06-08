import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
  GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL
} from "./calculator-personal-use-mvp-coverage-sprint-gate-ab";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTION_STATUS,
  buildBroadAccuracyWallTripleLeafCalibratedSolverCoverageRefreshContract
} from "./broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-coverage-refresh";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_ERROR_BUDGET_DB,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-broad-accuracy-wall-triple-leaf-calibrated";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/catalogs/src/materials/seed-materials.ts",
  "packages/engine/src/dynamic-airborne-broad-accuracy-wall-triple-leaf-calibrated.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-contract.test.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-coverage-refresh.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-coverage-refresh-contract.test.ts",
  "apps/web/features/workbench/wall-triple-leaf-calibrated-solver-surface.ts",
  "apps/web/features/workbench/wall-triple-leaf-calibrated-solver-surface-parity.test.ts",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function buildNrcTripleLeafCase(
  variant: "assembly_a" | "assembly_b" | "assembly_d"
): { context: AirborneContext; layers: readonly LayerInput[] } {
  const board = { materialId: "nrc_type_c_gypsum_board", thicknessMm: 12.7 } satisfies LayerInput;
  const batt = { materialId: "nrc_glass_fiber_batt", thicknessMm: 92.1 } satisfies LayerInput;

  if (variant === "assembly_a") {
    return {
      context: buildContext({
        cavity1: [1],
        cavity2: [3],
        internal: [2],
        sideA: [0],
        sideB: [4, 5]
      }),
      layers: [board, batt, board, batt, board, board]
    };
  }

  if (variant === "assembly_d") {
    return {
      context: buildContext({
        cavity1: [1],
        cavity2: [4],
        internal: [2, 3],
        sideA: [0],
        sideB: [5]
      }),
      layers: [board, batt, board, board, batt, board]
    };
  }

  return {
    context: buildContext({
      cavity1: [1],
      cavity2: [3],
      internal: [2],
      sideA: [0],
      sideB: [4]
    }),
    layers: [board, batt, board, batt, board]
  };
}

function buildContext(input: {
  cavity1: readonly number[];
  cavity2: readonly number[];
  internal: readonly number[];
  sideA: readonly number[];
  sideB: readonly number[];
}): AirborneContext {
  return {
    contextMode: "element_lab",
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: 92.1,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: [...input.cavity1],
      cavity2AbsorptionClass: "porous_absorptive",
      cavity2DepthMm: 92.1,
      cavity2FillCoverage: "full",
      cavity2LayerIndices: [...input.cavity2],
      internalLeafCoupling: "independent",
      internalLeafLayerIndices: [...input.internal],
      sideALeafLayerIndices: [...input.sideA],
      sideBLeafLayerIndices: [...input.sideB],
      supportTopology: "independent_frames",
      topologyMode: "grouped_triple_leaf"
    }
  };
}

describe("broad accuracy wall multileaf triple-leaf calibrated solver coverage refresh contract", () => {
  it("lands the coverage refresh matrix without moving runtime and selects local substitution mapping next", () => {
    const contract = buildBroadAccuracyWallTripleLeafCalibratedSolverCoverageRefreshContract();

    expect(contract).toMatchObject({
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_LANDED_GATE,
      noRuntimeValueMovement: true,
      selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTION_STATUS
    });
    expect(contract.previousSurfaceParity).toEqual({
      landedGate: "broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_surface_parity_plan",
      selectedNextAction: "broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_coverage_refresh_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-coverage-refresh-contract.test.ts",
      selectionStatus:
        "broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_surface_parity_landed_selected_coverage_refresh"
    });
    expect(contract.remainingFollowups).toEqual([
      {
        id: "wall_generic_gypsum_glasswool_substitution",
        reason: "selected now because it can broaden the calibrated triple-leaf solver without changing source rows",
        selectedNow: true
      },
      {
        id: "wall_local_rockwool_mlv_plaster_substitution",
        reason: "selected now because local material mappings block realistic wall calculator coverage",
        selectedNow: true
      },
      {
        id: "open_web_steel_direct_fixed_lining_similarity",
        reason: "still needs a direct-fixed lower-support transfer owner before runtime promotion",
        selectedNow: false
      },
      {
        id: "open_box_timber_measured_similarity",
        reason: "still needs a wet/dry hybrid interaction owner and must not borrow open-web steel",
        selectedNow: false
      }
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("summarizes supported, blocked, boundary, and follow-up rows without readiness inflation", () => {
    const contract = buildBroadAccuracyWallTripleLeafCalibratedSolverCoverageRefreshContract();

    expect(contract.summary).toEqual({
      basisBoundaryRowIds: [
        "wall.nrc_2024_mixed_lab_field_request.needs_input",
        "wall.nrc_2024_building_request.boundary"
      ],
      correctlyBlockedRowIds: [
        "wall.duplicate_grouped_topology.needs_input",
        "wall.flat_or_partial_grouped_topology.needs_input"
      ],
      exactPrecedenceBoundaryRowIds: ["wall.nrc_2024_exact_candidate.precedence_boundary"],
      failureClassCounts: {
        basis_boundary: 2,
        correct_block: 2,
        coverage_followup: 4,
        exact_precedence_boundary: 1,
        none: 3
      },
      noRuntimeValueMovement: true,
      rankedFollowupRowIds: [
        "wall.generic_gypsum_glasswool_substitution.followup",
        "wall.local_rockwool_mlv_plaster_substitution.followup",
        "floor.open_web_direct_fixed_lining.followup",
        "floor.open_box_timber_similarity.followup"
      ],
      rowCount: 12,
      selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      supportedRuntimeRowIds: [
        "wall.nrc_2024_assembly_b_lab.calibrated",
        "wall.nrc_2024_assembly_a_lab.calibrated",
        "wall.nrc_2024_assembly_d_lab.calibrated"
      ]
    });
    expect(
      contract.matrixRows.find((row) => row.id === "wall.local_rockwool_mlv_plaster_substitution.followup")
    ).toMatchObject({
      currentPosture: "followup_ranked",
      missingPhysicalInputs: ["localMaterialFamilyMappingOwner", "limpMassAndAbsorberCouplingOwner"],
      nextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      route: "wall"
    });
  });

  it("keeps NRC 2024 Assembly A/B/D calibrated public-calculator values frozen", () => {
    const cases = [
      {
        expected: { C: 1.4, Ctr: -7.4, Rw: 49, STC: 60 },
        variant: "assembly_b" as const
      },
      {
        expected: { C: 0.3, Ctr: -7.9, Rw: 58, STC: 64 },
        variant: "assembly_a" as const
      },
      {
        expected: { C: 1.2, Ctr: -7.5, Rw: 55, STC: 65 },
        variant: "assembly_d" as const
      }
    ];

    for (const entry of cases) {
      const { context, layers } = buildNrcTripleLeafCase(entry.variant);
      const result = calculateAssembly(layers, {
        airborneContext: context,
        calculator: "dynamic",
        targetOutputs: LAB_OUTPUTS
      });

      expect(result.metrics).toMatchObject({
        estimatedCDb: entry.expected.C,
        estimatedCtrDb: entry.expected.Ctr,
        estimatedRwDb: entry.expected.Rw,
        estimatedStc: entry.expected.STC
      });
      expect(result.airborneBasis).toMatchObject({
        errorBudgetDb: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_ERROR_BUDGET_DB,
        method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
        origin: "calibrated_family_physics",
        toleranceClass: "calibrated_prediction"
      });
      expect(result.airborneCandidateResolution).toMatchObject({
        runtimeValueMovement: true,
        selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID,
        selectedOrigin: "calibrated_family_physics"
      });
      expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
    }
  });

  it("keeps mixed field requests, local substitutions, and hostile topology out of calibrated support", () => {
    const nrcCase = buildNrcTripleLeafCase("assembly_b");
    const mixedFieldResult = calculateAssembly(nrcCase.layers, {
      airborneContext: nrcCase.context,
      calculator: "dynamic",
      targetOutputs: ["Rw", "R'w", "DnT,w"]
    });
    const localRockwool = calculateAssembly(GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL, {
      airborneContext: GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const genericLayers = nrcCase.layers.map((layer) => ({
      ...layer,
      materialId: layer.materialId === "nrc_type_c_gypsum_board" ? "gypsum_board" : "glasswool_board"
    }));
    const genericResult = calculateAssembly(genericLayers, {
      airborneContext: nrcCase.context,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const duplicateResult = calculateAssembly(nrcCase.layers, {
      airborneContext: {
        ...nrcCase.context,
        wallTopology: {
          ...nrcCase.context.wallTopology,
          sideALeafLayerIndices: [0, 1]
        }
      },
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });

    expect(mixedFieldResult.metrics.estimatedRwDb).toBe(49);
    expect(mixedFieldResult.supportedTargetOutputs).toEqual(["Rw"]);
    expect(mixedFieldResult.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(mixedFieldResult.airborneBasis?.method).not.toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD);
    expect(mixedFieldResult.airborneCandidateResolution?.candidates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID,
          outputIds: ["Rw", "R'w", "DnT,w"],
          selected: false
        })
      ])
    );

    expect(localRockwool.metrics).toMatchObject({
      estimatedRwDb: 53,
      estimatedStc: 64
    });
    expect(localRockwool.airborneBasis?.method).not.toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD);

    for (const result of [genericResult, duplicateResult]) {
      expect(result.airborneBasis?.method).not.toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD);
      expect(result.airborneCandidateResolution?.selectedCandidateId).not.toBe(
        BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID
      );
    }
  });

  it("keeps docs and the current-gate runner aligned with the coverage refresh closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_LANDED_GATE
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTION_STATUS
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_COVERAGE_REFRESH_SELECTED_NEXT_FILE
      );
      expect(normalizedContent, path).toContain("local substitution");
      expect(normalizedContent, path).toContain("rockwool");
      expect(normalizedContent, path).toContain("glasswool");
      expect(normalizedContent, path).toContain("rw 49");
      expect(normalizedContent, path).toContain("r'w");
      expect(normalizedContent, path).toContain("dnt,w");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain(
      "broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-coverage-refresh-contract.test.ts"
    );
  });
});
