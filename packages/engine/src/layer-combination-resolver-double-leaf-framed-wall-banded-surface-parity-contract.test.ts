import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_LABEL,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTION_STATUS,
  buildLayerCombinationResolverDoubleLeafFramedWallBandedSurfaceParityContract
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-surface-parity";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "CI", "IIC"] as const satisfies readonly RequestedOutputId[];

const DOUBLE_LEAF_ABSORBED_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const INDEPENDENT_ABSORBED_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 90,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "independent_frames",
    topologyMode: "double_leaf_framed"
  }
};

const RESILIENT_BOTH_SIDES_CONTEXT: AirborneContext = {
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  resilientBarSideCount: "both_sides",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 75,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "resilient_channel",
    topologyMode: "double_leaf_framed"
  }
};

const RESILIENT_ONE_SIDE_CONTEXT: AirborneContext = {
  ...RESILIENT_BOTH_SIDES_CONTEXT,
  resilientBarSideCount: "one_side"
};

const RESILIENT_MISSING_SIDE_COUNT_CONTEXT: AirborneContext = {
  connectionType: "resilient_channel",
  contextMode: "element_lab",
  studSpacingMm: 600,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 75,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "resilient_channel",
    topologyMode: "double_leaf_framed"
  }
};

const DIRECT_FIXED_EMPTY_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 45 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_CONTEXT: AirborneContext = {
  connectionType: "direct_fix",
  contextMode: "element_lab",
  studSpacingMm: 400,
  wallTopology: {
    cavity1AbsorptionClass: "none",
    cavity1DepthMm: 45,
    cavity1FillCoverage: "empty",
    cavity1LayerIndices: [1],
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [2],
    supportTopology: "direct_fixed",
    topologyMode: "double_leaf_framed"
  }
};

const FIELD_CONTEXT: AirborneContext = {
  ...INDEPENDENT_ABSORBED_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const REQUIRED_SURFACES = [
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-surface-parity.ts",
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-surface-parity-contract.test.ts",
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor.ts",
  "packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity.ts",
  "apps/web/features/workbench/layer-combination-resolver-candidate-surface-parity.test.ts",
  "apps/web/features/workbench/layer-combination-resolver-candidate-surface.ts",
  "apps/web/features/workbench/simple-workbench-wall-topology.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md",
  "docs/calculator/INSUL_COMPETITOR_RESEARCH_2026-05-20.md"
] as const;

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md",
  "docs/calculator/INSUL_COMPETITOR_RESEARCH_2026-05-20.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateWall(context: AirborneContext, targetOutputs: readonly RequestedOutputId[] = WALL_OUTPUTS) {
  return calculateAssembly(DOUBLE_LEAF_ABSORBED_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
}

function expectDoubleLeafSurfaceTrace(
  context: AirborneContext,
  expected: {
    C: number;
    Ctr: number;
    Rw: number;
    STC: number;
    errorBudgetDb: number;
  }
) {
  const result = calculateWall(context);

  expect(result.metrics).toMatchObject({
    estimatedCDb: expected.C,
    estimatedCtrDb: expected.Ctr,
    estimatedRwDb: expected.Rw,
    estimatedStc: expected.STC
  });
  expect(result.airborneBasis).toMatchObject({
    errorBudgetDb: expected.errorBudgetDb,
    method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
    origin: "family_physics_prediction"
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "source_absent_family_solver",
    errorBudgetMetrics: ["Rw", "C", "Ctr", "STC"],
    noRuntimeValueMovement: true,
    requestedBasis: "element_lab",
    route: "wall",
    runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
    selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
    supportBucket: "source_absent_estimate",
    supportedMetrics: ["Rw", "C", "Ctr", "STC"],
    valuePins: expect.arrayContaining([
      { metric: "Rw", value: expected.Rw },
      { metric: "STC", value: expected.STC },
      { metric: "C", value: expected.C },
      { metric: "Ctr", value: expected.Ctr }
    ])
  });
  expect(result.layerCombinationResolverTrace?.surfaceDetail).toContain("scenario-specific");
  expect(result.layerCombinationResolverTrace?.surfaceDetail).toContain("not measured evidence");

  return result;
}

describe("layer combination resolver double-leaf framed wall banded surface parity contract", () => {
  it("lands surface parity and selects double-leaf/framed coverage refresh", () => {
    const contract = buildLayerCombinationResolverDoubleLeafFramedWallBandedSurfaceParityContract();

    expect(contract).toMatchObject({
      basis: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      candidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousRuntimeCorridor: {
        landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_LANDED_GATE,
        selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
        selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
        selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS
      },
      selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE,
      selectedNextLabel: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_LABEL,
      selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTION_STATUS
    });
    expect(contract.surfaceTargets).toEqual([
      "candidate_trace",
      "output_cards",
      "route_posture",
      "confidence_provenance",
      "metric_basis_rows",
      "method_dossier",
      "local_saved_replay",
      "server_snapshot_replay",
      "calculator_api_payload",
      "impact_only_api_payload",
      "markdown_report"
    ]);
    expect(contract.representativeScenarios).toEqual([
      expect.objectContaining({
        errorBudgetDb: 7,
        expectedMetricPins: [
          { metric: "Rw", value: 45 },
          { metric: "STC", value: 45 },
          { metric: "C", value: -1 },
          { metric: "Ctr", value: -6.1 }
        ],
        id: "wall_independent_absorbed_double_leaf_framed"
      }),
      expect.objectContaining({
        errorBudgetDb: 8,
        expectedMetricPins: [
          { metric: "Rw", value: 46 },
          { metric: "STC", value: 46 },
          { metric: "C", value: -1.1 },
          { metric: "Ctr", value: -6.2 }
        ],
        id: "wall_resilient_both_sides_double_leaf_framed"
      }),
      expect.objectContaining({
        errorBudgetDb: 8,
        expectedMetricPins: [
          { metric: "Rw", value: 45 },
          { metric: "STC", value: 45 },
          { metric: "C", value: -1.1 },
          { metric: "Ctr", value: -6.2 }
        ],
        id: "wall_resilient_one_side_double_leaf_framed"
      })
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("exposes scenario-specific independent and resilient double-leaf value pins on the candidate trace", () => {
    expectDoubleLeafSurfaceTrace(INDEPENDENT_ABSORBED_CONTEXT, {
      C: -1,
      Ctr: -6.1,
      Rw: 45,
      STC: 45,
      errorBudgetDb: 7
    });
    expectDoubleLeafSurfaceTrace(RESILIENT_BOTH_SIDES_CONTEXT, {
      C: -1.1,
      Ctr: -6.2,
      Rw: 46,
      STC: 46,
      errorBudgetDb: 8
    });
    expectDoubleLeafSurfaceTrace(RESILIENT_ONE_SIDE_CONTEXT, {
      C: -1.1,
      Ctr: -6.2,
      Rw: 45,
      STC: 45,
      errorBudgetDb: 8
    });
  });

  it("keeps needs-input, wrong topology, field overlay, impact, and ASTM boundaries visible", () => {
    const missingSideCount = calculateWall(RESILIENT_MISSING_SIDE_COUNT_CONTEXT);
    const directFixed = calculateAssembly(DIRECT_FIXED_EMPTY_STACK, {
      airborneContext: DIRECT_FIXED_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const field = calculateWall(FIELD_CONTEXT, FIELD_OUTPUTS);
    const impact = calculateWall(INDEPENDENT_ABSORBED_CONTEXT, IMPACT_OUTPUTS);

    expect(missingSideCount.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(missingSideCount.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );

    expect(directFixed.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_multileaf_screening_fallback",
      selectedOrigin: "screening_fallback"
    });
    expect(directFixed.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );

    expect(field.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(field.warnings.join("\n")).toContain("Airborne field-side overlay active.");
    expect(field.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 45 },
        { metric: "STC", value: 45 }
      ])
    });

    expect(impact.impact).toBeNull();
    expect(impact.supportedImpactOutputs ?? []).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual(expect.arrayContaining(["Ln,w", "CI", "IIC"]));
  });

  it("keeps docs, exports, and current-gate runner aligned with double-leaf surface parity", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_LANDED_GATE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTION_STATUS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID);
      expect(content, path).toContain("Rw 45");
      expect(content, path).toContain("Rw 46");
      expect(content, path).toContain("scenario-specific");
      expect(normalized, path).toContain("double-leaf");
      expect(normalized, path).toContain("surface parity");
      expect(normalized, path).toContain("candidate trace");
      expect(normalized, path).toContain("local saved replay");
      expect(normalized, path).toContain("server snapshot replay");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./layer-combination-resolver-double-leaf-framed-wall-banded-surface-parity";'
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/layer-combination-resolver-double-leaf-framed-wall-banded-surface-parity-contract.test.ts"
    );
  });
});
