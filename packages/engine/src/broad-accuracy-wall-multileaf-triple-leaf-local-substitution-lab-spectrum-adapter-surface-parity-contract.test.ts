import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTION_STATUS,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
  BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter";
import {
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_LANDED_GATE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_FILE,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTION_STATUS,
  buildBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterSurfaceParityContract
} from "./broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-surface-parity";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const MIXED_OUTPUTS = ["Rw", "STC", "C", "Ctr", "R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_SURFACES = [
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-contract.test.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-surface-parity.ts",
  "packages/engine/src/broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-surface-parity-contract.test.ts",
  "apps/web/features/workbench/wall-triple-leaf-local-substitution-surface.ts",
  "apps/web/features/workbench/wall-triple-leaf-local-substitution-surface-parity.test.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/simple-workbench-output-posture.ts",
  "apps/web/features/workbench/flat-multicavity-topology-surface.ts",
  "apps/web/features/workbench/rockwool-triple-leaf-screening-policy-copy.ts",
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
  sideB: [4]
});

const LOCAL_CONTEXT: AirborneContext = buildContext({
  cavity1: [3],
  cavity1DepthMm: 50,
  cavity2: [5],
  cavity2DepthMm: 50,
  internal: [4],
  sideA: [0, 1, 2],
  sideB: [6, 7, 8]
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
      supportTopology: "independent_frames",
      topologyMode: "grouped_triple_leaf"
    }
  };
}

describe("broad accuracy wall triple-leaf local substitution lab spectrum adapter surface parity", () => {
  it("lands a no-runtime surface parity closeout and selects the adapter coverage refresh next", () => {
    const contract = buildBroadAccuracyWallTripleLeafLocalSubstitutionLabSpectrumAdapterSurfaceParityContract();

    expect(contract).toMatchObject({
      landedGate:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_LANDED_GATE,
      runtimeMethod:
        BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      runtimeMovedAtSurfaceParity: false,
      selectedCandidateId:
        BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectedNextLabel:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_LABEL,
      selectionStatus:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTION_STATUS,
      surfaceTargets: [
        "output_cards",
        "route_posture",
        "dynamic_trace",
        "method_dossier",
        "local_saved_replay",
        "server_snapshot_replay",
        "calculator_api_payload",
        "markdown_report",
        "unsupported_field_building_boundary",
        "exact_precedence_boundary",
        "hostile_topology_boundary"
      ]
    });
    expect(contract.previousAdapter).toEqual({
      landedGate: BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_LANDED_GATE,
      selectedNextAction:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_ACTION,
      selectedNextFile:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_NEXT_FILE,
      selectionStatus:
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTION_STATUS
    });
    expect(contract.valuePins.map((pin) => pin.expected)).toEqual([
      { cDb: 1.6, ctrDb: -7.2, errorBudgetDb: 6, rwDb: 50, stc: 61 },
      { cDb: 1.6, ctrDb: -7.2, errorBudgetDb: 8, rwDb: 53, stc: 64 }
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps generic and local lab adapter values, basis, budget, and boundary behavior stable", () => {
    const generic = calculateAssembly(GENERIC_GYPSUM_GLASSWOOL_STACK, {
      airborneContext: GENERIC_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const local = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });
    const mixed = calculateAssembly(LOCAL_ROCKWOOL_MLV_PLASTER_STACK, {
      airborneContext: LOCAL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: MIXED_OUTPUTS
    });

    expect(generic.metrics).toMatchObject({
      estimatedCDb: 1.6,
      estimatedCtrDb: -7.2,
      estimatedRwDb: 50,
      estimatedStc: 61
    });
    expect(generic.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(generic.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SELECTED_CANDIDATE_ID
    });
    expect(generic.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(generic.unsupportedTargetOutputs).toEqual([]);
    expect(generic.ratingAdapterBasisSet?.map((basis: { metricId: string; ratingStandard: string }) => basis.metricId)).toEqual(["STC", "C", "Ctr"]);
    expect(generic.warnings).toContain(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING);

    expect(local.metrics).toMatchObject({
      estimatedCDb: 1.6,
      estimatedCtrDb: -7.2,
      estimatedRwDb: 53,
      estimatedStc: 64
    });
    expect(local.airborneBasis).toMatchObject({
      errorBudgetDb: 8,
      method: BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(local.warnings.join("\n")).toContain("keeps the parent not-measured budget");

    expect(mixed.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(mixed.unsupportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(mixed.airborneBasis?.origin).toBe("needs_input");
    expect(mixed.warnings).toContain(BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_WARNING);
  });

  it("keeps docs, web surfaces, exports, and current-gate runners aligned with surface parity", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalizedContent = content.toLowerCase();

      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_LANDED_GATE
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTION_STATUS
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_ACTION
      );
      expect(content, path).toContain(
        BROAD_ACCURACY_WALL_MULTILEAF_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_SURFACE_PARITY_SELECTED_NEXT_FILE
      );
      expect(normalizedContent, path).toContain("stc 64");
      expect(normalizedContent, path).toContain("ctr -7.2");
      expect(normalizedContent, path).toContain("cards");
      expect(normalizedContent, path).toContain("reports");
      expect(normalizedContent, path).toContain("api");
      expect(normalizedContent, path).toContain("field");
      expect(normalizedContent, path).toContain("building");
    }

    const index = readRepoFile("packages/engine/src/index.ts");
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    const webSurface = readRepoFile("apps/web/features/workbench/wall-triple-leaf-local-substitution-surface.ts");
    const webSurfaceTest = readRepoFile(
      "apps/web/features/workbench/wall-triple-leaf-local-substitution-surface-parity.test.ts"
    );
    const outputModel = readRepoFile("apps/web/features/workbench/simple-workbench-output-model.ts");

    expect(index).toContain(
      "broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-surface-parity"
    );
    expect(runner).toContain(
      "broad-accuracy-wall-multileaf-triple-leaf-local-substitution-lab-spectrum-adapter-surface-parity-contract.test.ts"
    );
    expect(runner).toContain("wall-triple-leaf-local-substitution-surface-parity.test.ts");
    expect(webSurface).toContain(
      "BROAD_ACCURACY_WALL_TRIPLE_LEAF_LOCAL_SUBSTITUTION_LAB_SPECTRUM_ADAPTER_RUNTIME_METHOD"
    );
    expect(webSurface).toContain("and Ctr ${formatValue(result.metrics.estimatedCtrDb)} dB");
    expect(webSurfaceTest).toContain("lab STC 64 dB, C 1.6 dB, and Ctr -7.2 dB");
    expect(outputModel).toContain("getWallTripleLeafLocalSubstitutionOutputDetail");
  });
});
