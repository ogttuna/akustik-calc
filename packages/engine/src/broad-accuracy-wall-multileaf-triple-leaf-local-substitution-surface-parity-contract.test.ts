import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTION_STATUS,
  buildBroadAccuracyWallTripleLeafLocalSubstitutionSurfaceParityContract
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-surface-parity";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTION_STATUS,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_STRATEGY,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor";
import {
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const TARGET_OUTPUTS = ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-runtime-corridor-contract.test.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-surface-parity.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-surface-parity-contract.test.ts",
  "apps/web/features/workbench/wall-triple-leaf-local-substitution-surface.ts",
  "apps/web/features/workbench/wall-triple-leaf-local-substitution-surface-parity.test.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/simple-workbench-corridor-dossier.ts",
  "apps/web/features/workbench/simple-workbench-method-dossier.ts",
  "apps/web/features/workbench/dynamic-calc-branch.ts",
  "apps/web/features/workbench/validation-regime.ts",
  "apps/web/features/workbench/compose-workbench-report.ts",
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

const GENERIC_CONTEXT: AirborneContext = buildContext({
  cavity1: [1],
  cavity1DepthMm: 92.1,
  cavity2: [3],
  cavity2DepthMm: 92.1,
  internal: [2],
  sideA: [0],
  sideB: [4],
  supportTopology: "independent_frames"
});

const LOCAL_CONTEXT: AirborneContext = buildContext({
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
      cavity1LayerIndices: [...input.cavity1],
      cavity2AbsorptionClass: "porous_absorptive",
      cavity2DepthMm: input.cavity2DepthMm,
      cavity2FillCoverage: "full",
      cavity2LayerIndices: [...input.cavity2],
      internalLeafCoupling: "independent",
      internalLeafLayerIndices: [...input.internal],
      sideALeafLayerIndices: [...input.sideA],
      sideBLeafLayerIndices: [...input.sideB],
      supportTopology: input.supportTopology,
      topologyMode: "grouped_triple_leaf"
    }
  };
}

describe("broad accuracy wall multileaf triple-leaf local substitution surface parity contract", () => {
  it("lands surface parity without runtime movement and selects coverage refresh next", () => {
    const contract = buildBroadAccuracyWallTripleLeafLocalSubstitutionSurfaceParityContract();

    expect(contract).toMatchObject({
      candidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID,
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_LANDED_GATE,
      runtimeMethod: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
      runtimeMovedAtSurfaceParity: false,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectedNextLabel:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_LABEL,
      selectionStatus:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTION_STATUS,
      surfaceTargets: [
        "output_cards",
        "route_posture",
        "dynamic_branch",
        "method_dossier",
        "local_saved_replay",
        "server_snapshot_replay",
        "calculator_api_payload",
        "markdown_report",
        "unsupported_metric_boundary"
      ]
    });
    expect(contract.previousRuntime).toEqual({
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_LANDED_GATE,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
      selectionStatus:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_CORRIDOR_SELECTION_STATUS
    });
    expect(contract.valuePins.map((pin) => pin.expected.liveRwDb)).toEqual([50, 53]);
    expect(contract.metricBoundaries).toEqual({
      buildingPredictionMetricsBlocked: true,
      fieldMetricsBlocked: true,
      stcCAndCtrAdaptersBlocked: true
    });

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the generic and local runtime pins while preserving unsupported metric boundaries", () => {
    const generic = calculateAssembly(GENERIC_GYPSUM_GLASSWOOL_STACK, {
      airborneContext: GENERIC_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const local = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const mixedFieldRequest = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: TARGET_OUTPUTS
    });

    expect(generic.metrics.estimatedRwDb).toBe(50);
    expect(generic.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(generic.dynamicAirborneTrace).toMatchObject({
      strategy: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_STRATEGY
    });
    expect(generic.supportedTargetOutputs).toEqual(["Rw"]);
    expect(generic.unsupportedTargetOutputs).toEqual([]);
    expect(generic.dynamicAirborneTrace?.notes.join("\n")).toContain(
      "Formula design corridor Rw 49.3 with live ISO-rounded Rw 50"
    );

    expect(local.metrics.estimatedRwDb).toBe(53);
    expect(local.airborneBasis).toMatchObject({
      errorBudgetDb: 8,
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(local.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(local.supportedTargetOutputs).toEqual(["Rw"]);
    expect(local.unsupportedTargetOutputs).toEqual([]);
    expect(local.dynamicAirborneTrace?.notes.join("\n")).toContain(
      "Formula design corridor Rw 52.8 with live ISO-rounded Rw 53"
    );

    expect(mixedFieldRequest.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(mixedFieldRequest.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(mixedFieldRequest.airborneBasis?.origin).toBe("needs_input");
    expect(
      mixedFieldRequest.airborneCandidateResolution?.candidates.some(
        (candidate: { id: string; selected?: boolean }) =>
          candidate.id === BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SELECTED_CANDIDATE_ID ||
          candidate.id === BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
      )
    ).toBe(true);
  });

  it("keeps docs, exports, and current-gate runners aligned with the surface parity closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_LANDED_GATE
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTION_STATUS
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_SURFACE_PARITY_SELECTED_NEXT_FILE
      );
      expect(normalizedContent, path).toContain("cards");
      expect(normalizedContent, path).toContain("reports");
      expect(normalizedContent, path).toContain("api");
      expect(normalizedContent, path).toContain("saved replay");
      expect(normalizedContent, path).toContain("unsupported");
      expect(normalizedContent, path).toContain("rw 53");
      expect(normalizedContent, path).toContain("rw 50");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");

    expect(index).toContain("broad-accuracy-wall-multileaf-triple-leaf-local-substitution-surface-parity");
    expect(runner).toContain(
      "broad-accuracy-wall-multileaf-triple-leaf-local-substitution-surface-parity-contract.test.ts"
    );
    expect(runner).toContain("wall-triple-leaf-local-substitution-surface-parity.test.ts");
  });
});
