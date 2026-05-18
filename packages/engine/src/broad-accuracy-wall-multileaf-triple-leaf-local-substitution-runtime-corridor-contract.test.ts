import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTION_STATUS,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_STRATEGY,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID,
  buildBroadAccuracyWallTripleLeafLocalSubstitutionRuntimeCorridorContract
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor";
import { calculateAssembly } from "./calculate-assembly";
import { buildDynamicCalculatorCandidateResolverRuntime } from "./dynamic-calculator-candidate-resolver-runtime";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-broad-accuracy-wall-triple-leaf-calibrated";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-formula-corridor.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-formula-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor-contract.test.ts",
  "packages/engine/src/dynamic-airborne.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "packages/engine/src/calculate-assembly.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "docs/calculator/SLICE_BROAD_ACCURACY_REFERENCE_BENCHMARK_AND_SIMILARITY_SOLVER_PLAN.md",
  "docs/calculator/BROAD_ACCURACY_CALCULATOR_PLAN.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
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

const NRC_SOURCE_LIKE_STACK: readonly LayerInput[] = [
  { materialId: "nrc_type_c_gypsum_board", thicknessMm: 12.7 },
  { materialId: "nrc_glass_fiber_batt", thicknessMm: 92.1 },
  { materialId: "nrc_type_c_gypsum_board", thicknessMm: 12.7 },
  { materialId: "nrc_glass_fiber_batt", thicknessMm: 92.1 },
  { materialId: "nrc_type_c_gypsum_board", thicknessMm: 12.7 }
];

const GENERIC_GYPSUM_GLASSWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "glasswool_board", thicknessMm: 92.1 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "glasswool_board", thicknessMm: 92.1 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const LOCAL_ROCKWOOL_MLV_PLASTER_STACK: readonly LayerInput[] = [
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

const SOURCE_LIKE_CONTEXT: AirborneContext = buildContext({
  cavity1: [1],
  cavity1DepthMm: 92.1,
  cavity2: [3],
  cavity2DepthMm: 92.1,
  internal: [2],
  sideA: [0],
  sideB: [4],
  supportTopology: "independent_frames"
});

const LOCAL_ROCKWOOL_CONTEXT: AirborneContext = buildContext({
  cavity1: [3],
  cavity1DepthMm: 50,
  cavity2: [5],
  cavity2DepthMm: 50,
  internal: [4],
  sideA: [0, 1, 2],
  sideB: [6, 7, 8],
  supportTopology: "independent_frames"
});

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function buildContext(input: {
  cavity1: readonly number[];
  cavity1DepthMm: number;
  cavity2: readonly number[];
  cavity2DepthMm: number;
  internal: readonly number[];
  sideA: readonly number[];
  sideB: readonly number[];
  supportTopology: NonNullable<NonNullable<AirborneContext["wallTopology"]>["supportTopology"]>;
}): AirborneContext {
  return {
    contextMode: "element_lab",
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: input.cavity1DepthMm,
      cavity1FillCoverage: "full",
      cavity1LayerIndices: input.cavity1,
      cavity2AbsorptionClass: "porous_absorptive",
      cavity2DepthMm: input.cavity2DepthMm,
      cavity2FillCoverage: "full",
      cavity2LayerIndices: input.cavity2,
      internalLeafCoupling: "independent",
      internalLeafLayerIndices: input.internal,
      sideALeafLayerIndices: input.sideA,
      sideBLeafLayerIndices: input.sideB,
      supportTopology: input.supportTopology,
      topologyMode: "grouped_triple_leaf"
    }
  };
}

describe("broad accuracy wall multileaf triple-leaf local substitution runtime corridor contract", () => {
  it("lands the Rw runtime corridor and selects surface parity next", () => {
    const contract = buildBroadAccuracyWallTripleLeafLocalSubstitutionRuntimeCorridorContract();

    expect(contract).toMatchObject({
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_LANDED_GATE,
      runtimeMethod: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
      runtimeValueMovement: true,
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID,
      selectedNextAction: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
      selectedNextLabel: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
      selectionStatus: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTION_STATUS,
      supportedRuntimeOutputs: ["Rw"]
    });
    expect(contract.metricBoundaries).toEqual({
      buildingPredictionMetricsBlocked: true,
      fieldMetricsBlocked: true,
      stcCAndCtrAdaptersBlocked: true
    });
    expect(contract.candidateRuntimeRows.map((row) => row.designCorridorRwDb)).toEqual([49.3, 52.8]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes generic gypsum/glasswool Rw through the parent runtime corridor", () => {
    const result = calculateAssembly(GENERIC_GYPSUM_GLASSWOOL_STACK, {
      airborneContext: SOURCE_LIKE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(result.metrics.estimatedRwDb).toBe(50);
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(result.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "multileaf_multicavity",
      selectedMethod: "triple_leaf_two_cavity_frequency_solver",
      strategy: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_STRATEGY
    });
    expect(result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.warnings.join("\n")).toContain("source-absent formula corridor");
    expect(result.dynamicAirborneTrace?.notes.join("\n")).toContain(
      "Formula design corridor Rw 49.3 with live ISO-rounded Rw 50"
    );
  });

  it("promotes local Rockwool/MLV/plaster Rw and supersedes the old Gate G Rw 50 fixture", () => {
    const result = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });

    expect(result.metrics.estimatedRwDb).toBe(53);
    expect(result.supportedTargetOutputs).toEqual(["Rw"]);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.airborneBasis).toMatchObject({
      errorBudgetDb: 8,
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(result.airborneCandidateResolution?.selectedCandidateId).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID
    );
    expect(result.dynamicAirborneTrace?.strategy).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_STRATEGY
    );
    expect(result.dynamicAirborneTrace?.notes.join("\n")).toContain(
      "Formula design corridor Rw 52.8 with live ISO-rounded Rw 53"
    );
  });

  it("keeps source-family controls, hostile grouping, and field aliases out of the local runtime", () => {
    const sourceControl = calculateAssembly(NRC_SOURCE_LIKE_STACK, {
      airborneContext: SOURCE_LIKE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const duplicateGrouping = calculateAssembly(GENERIC_GYPSUM_GLASSWOOL_STACK, {
      airborneContext: {
        ...SOURCE_LIKE_CONTEXT,
        wallTopology: {
          ...SOURCE_LIKE_CONTEXT.wallTopology,
          sideALeafLayerIndices: [0, 1]
        }
      },
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const fieldAlias = calculateAssembly(GENERIC_GYPSUM_GLASSWOOL_STACK, {
      airborneContext: SOURCE_LIKE_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,w"]
    });

    expect(sourceControl.metrics.estimatedRwDb).toBe(49);
    expect(sourceControl.airborneBasis?.method).toBe(BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_RUNTIME_METHOD);
    expect(sourceControl.airborneCandidateResolution?.selectedCandidateId).toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_CALIBRATED_SELECTED_CANDIDATE_ID
    );

    expect(duplicateGrouping.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(duplicateGrouping.airborneBasis?.method).not.toBe(
      BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD
    );

    expect(fieldAlias.supportedTargetOutputs).toEqual([]);
    expect(fieldAlias.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(fieldAlias.airborneBasis?.origin).not.toBe("family_physics_prediction");
  });

  it("keeps exact source precedence above the local substitution runtime candidate", () => {
    const runtime = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const exactOverride = buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: LOCAL_ROCKWOOL_CONTEXT,
      layers: LOCAL_ROCKWOOL_MLV_PLASTER_STACK,
      route: "wall",
      runtimeSignal: {
        airborneBasis: runtime.airborneBasis,
        detectedFamily: runtime.dynamicAirborneTrace?.detectedFamily,
        runtimeValueMovement: runtime.airborneCandidateResolution?.runtimeValueMovement,
        selectedMethod: runtime.dynamicAirborneTrace?.selectedMethod,
        strategy: runtime.dynamicAirborneTrace?.strategy
      },
      sourceAnchor: {
        applied: true,
        match: {
          id: "future_rights_safe_same_stack_local_substitution_lab_row",
          label: "Future same-stack local substitution lab row",
          metricLabel: "Rw",
          metricValue: 53,
          sourceMode: "lab"
        }
      },
      targetOutputs: ["Rw"]
    });

    expect(exactOverride.resolution).toMatchObject({
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(exactOverride.resolution.selectedBasis).toMatchObject({
      exactSourceId: "future_rights_safe_same_stack_local_substitution_lab_row",
      origin: "measured_exact_full_stack"
    });
  });

  it("keeps docs and current-gate runner aligned with the runtime corridor closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_LANDED_GATE
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTION_STATUS
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE
      );
      expect(normalizedContent, path).toContain("surface parity");
      expect(normalizedContent, path).toContain("52.8");
      expect(normalizedContent, path).toContain("49.3");
      expect(normalizedContent, path).toContain("runtime");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor");
    expect(runner).toContain(
      "broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor-contract.test.ts"
    );
  });
});
