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
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTION_STATUS,
  buildBroadAccuracyWallMultileafTripleLeafCalibratedSolverContract
} from "./broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_ERROR_BUDGET_DB,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_PREDICTION_STRATEGY,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_WARNING
} from "./dynamic-airborne-broad-accuracy-wall-triple-leaf-calibrated";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/catalogs/src/materials/seed-materials.ts",
  "packages/engine/src/dynamic-airborne-broad-accuracy-wall-triple-leaf-calibrated.ts",
  "packages/engine/src/dynamic-airborne.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-contract.test.ts",
  "packages/engine/src/wall-triple-leaf-source-curve-digitization-qc.ts",
  "packages/engine/src/wall-triple-leaf-calibration-fit.ts",
  "packages/engine/src/broad-accuracy-open-web-supported-band-similarity-coverage-refresh.ts",
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

describe("broad accuracy wall multileaf triple-leaf calibrated solver contract", () => {
  it("lands the calibrated solver runtime lane and selects surface parity next", () => {
    const contract = buildBroadAccuracyWallMultileafTripleLeafCalibratedSolverContract();

    expect(contract).toMatchObject({
      errorBudgetDb: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_ERROR_BUDGET_DB,
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_LANDED_GATE,
      runtimeMethod: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
      runtimeMovementThisGate: true,
      selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTION_STATUS
    });
    expect(contract.previousCoverageRefresh).toEqual({
      landedGate: "broad_accuracy_open_web_supported_band_similarity_coverage_refresh_plan",
      selectedNextAction: "broad_accuracy_wall_multileaf_triple_leaf_calibrated_solver_plan",
      selectedNextFile:
        "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-contract.test.ts",
      selectionStatus:
        "broad_accuracy_open_web_supported_band_similarity_coverage_refresh_landed_selected_wall_multileaf_triple_leaf_solver"
    });
    expect(contract.supportedScenarios.map((scenario) => scenario.assemblyId)).toEqual([
      "nrc_2024_assembly_b_internal_board",
      "nrc_2024_assembly_a_internal_board",
      "nrc_2024_assembly_d_internal_board"
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("calculates the NRC 2024 source-family Assembly B calibrated triple-leaf value from the public dynamic calculator", () => {
    const { context, layers } = buildNrcTripleLeafCase("assembly_b");
    const result = calculateAssembly(layers, {
      airborneContext: context,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });

    expect(result.metrics).toMatchObject({
      estimatedCDb: 1.4,
      estimatedCtrDb: -7.4,
      estimatedRwDb: 49,
      estimatedStc: 60
    });
    expect(result.airborneBasis).toMatchObject({
      anchorSourceId: "nrc_2024_internal_gypsum_double_stud",
      curveBasis: "measured_frequency_curve",
      errorBudgetDb: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_ERROR_BUDGET_DB,
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
      origin: "calibrated_family_physics",
      toleranceClass: "calibrated_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: "candidate_broad_accuracy_nrc2024_triple_leaf_calibrated",
      selectedOrigin: "calibrated_family_physics"
    });
    expect(result.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "high",
      selectedMethod: "triple_leaf_two_cavity_frequency_solver",
      strategy: BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_PREDICTION_STRATEGY
    });
    expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.warnings).toContain(BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_WARNING);
  });

  it("pins Assembly A and D calibrated variants without borrowing screening or the uncalibrated Rockwool lane", () => {
    const cases = [
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
      expect(result.airborneBasis?.method).toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD);
      expect(result.dynamicAirborneTrace?.candidateMethods).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            method: "screening_mass_law_curve_seed_v3",
            selected: false
          }),
          expect.objectContaining({
            method: "triple_leaf_two_cavity_frequency_solver",
            rwDb: entry.expected.Rw,
            selected: true
          })
        ])
      );
    }
  });

  it("keeps local Rockwool, generic glasswool, duplicate topology, and field outputs out of the calibrated lane", () => {
    const localRockwool = calculateAssembly(GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_WALL, {
      airborneContext: GATE_AB_PINNED_GROUPED_TRIPLE_LEAF_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const genericCase = buildNrcTripleLeafCase("assembly_b");
    const genericLayers = genericCase.layers.map((layer) => ({
      ...layer,
      materialId: layer.materialId === "nrc_type_c_gypsum_board" ? "gypsum_board" : "glasswool_board"
    }));
    const genericResult = calculateAssembly(genericLayers, {
      airborneContext: genericCase.context,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const duplicateResult = calculateAssembly(genericCase.layers, {
      airborneContext: {
        ...genericCase.context,
        wallTopology: {
          ...genericCase.context.wallTopology,
          sideALeafLayerIndices: [0, 1]
        }
      },
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const fieldResult = calculateAssembly(genericCase.layers, {
      airborneContext: genericCase.context,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"]
    });

    expect(localRockwool.metrics).toMatchObject({
      estimatedRwDb: 53,
      estimatedStc: 64
    });
    expect(localRockwool.airborneBasis?.method).toBe("broad_accuracy_wall_triple_leaf_local_substitution_lab_spectrum_adapter_runtime");
    expect(localRockwool.airborneBasis?.method).not.toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD);

    for (const result of [genericResult, duplicateResult]) {
      expect(result.airborneBasis?.method).not.toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD);
      expect(result.airborneCandidateResolution?.selectedCandidateId).not.toBe(
        "candidate_broad_accuracy_nrc2024_triple_leaf_calibrated"
      );
    }

    expect(fieldResult.airborneBasis?.method).not.toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD);
    expect(fieldResult.supportedTargetOutputs).toEqual([]);
    expect(fieldResult.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
  });

  it("keeps docs and the current-gate runner aligned with the calibrated solver closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_LANDED_GATE);
      expect(content, path).toContain(BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTION_STATUS);
      expect(content, path).toContain(BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_CALIBRATED_SOLVER_SELECTED_NEXT_FILE);
      expect(normalizedContent, path).toContain("nrc 2024");
      expect(normalizedContent, path).toContain("type c");
      expect(normalizedContent, path).toContain("glass-fiber");
      expect(normalizedContent, path).toContain("rw 49");
      expect(normalizedContent, path).toContain("rockwool");
      expect(normalizedContent, path).toContain("field");
      expect(normalizedContent, path).toContain("building");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(runner).toContain("broad-accuracy-wall-multileaf-triple-leaf-calibrated-solver-contract.test.ts");
  });
});
