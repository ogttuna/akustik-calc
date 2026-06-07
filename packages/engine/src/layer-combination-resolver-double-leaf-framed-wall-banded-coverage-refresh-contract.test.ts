import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
  GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-s-double-leaf-framed";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTION_STATUS,
  buildLayerCombinationResolverDoubleLeafFramedWallBandedCoverageRefreshContract
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTION_STATUS
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-surface-parity";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "CI"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const DOUBLE_LEAF_ABSORBED_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_EMPTY_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 45 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const GROUPED_SPLIT_ROCKWOOL_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
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

const GROUPED_SPLIT_ROCKWOOL_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab",
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
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
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh.ts",
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh-contract.test.ts",
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-surface-parity.ts",
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor.ts",
  "packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity.ts",
  "packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh.ts",
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

function expectPinnedRuntime(
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
    method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
    selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
    supportBucket: "source_absent_estimate",
    valuePins: expect.arrayContaining([
      { metric: "Rw", value: expected.Rw },
      { metric: "STC", value: expected.STC },
      { metric: "C", value: expected.C },
      { metric: "Ctr", value: expected.Ctr }
    ])
  });

  return result;
}

describe("layer combination resolver double-leaf framed wall banded coverage refresh contract", () => {
  it("lands no-runtime coverage refresh and selects post-double-leaf revalidation", () => {
    const contract = buildLayerCombinationResolverDoubleLeafFramedWallBandedCoverageRefreshContract();

    expect(contract).toMatchObject({
      landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousSurfaceParity: {
        landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_LANDED_GATE,
        selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_ACTION,
        selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTED_NEXT_FILE,
        selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_SURFACE_PARITY_SELECTION_STATUS
      },
      selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTION_STATUS
    });
    expect(contract.summary).toEqual({
      basisBoundaryRowIds: [
        "wall.double_leaf_framed.field_overlay.boundary",
        "wall.double_leaf_framed.building_prediction.boundary"
      ],
      exactPrecedenceBoundaryRowIds: ["wall.double_leaf_framed.exact_precedence.boundary"],
      failureClassCounts: {
        basis_boundary: 2,
        coverage_followup: 1,
        exact_precedence_boundary: 1,
        needs_input_boundary: 2,
        none: 3,
        separate_lane_boundary: 2,
        unsupported_boundary: 2
      },
      noRuntimeValueMovement: true,
      rankedFollowupRowIds: ["wall.double_leaf_framed.post_coverage_revalidation.next"],
      rowCount: 13,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE,
      selectedNextLabel: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_LABEL,
      separateLaneBoundaryRowIds: [
        "wall.double_leaf_framed.direct_fixed.boundary",
        "wall.double_leaf_framed.grouped_triple_leaf.boundary"
      ],
      supportedRuntimeRowIds: [
        "wall.double_leaf_framed.independent_absorbed.lab",
        "wall.double_leaf_framed.resilient_both_sides.lab",
        "wall.double_leaf_framed.resilient_one_side.lab"
      ],
      unsupportedRowIds: [
        "wall.double_leaf_framed.floor_impact.unsupported",
        "wall.double_leaf_framed.astm_iic.unsupported"
      ]
    });
    expect(contract.remainingFollowups).toEqual([
      expect.objectContaining({ id: "post_double_leaf_revalidation", selectedNow: true }),
      expect.objectContaining({ id: "double_leaf_holdout_acquisition", selectedNow: false }),
      expect.objectContaining({ id: "double_leaf_field_building_adapter", selectedNow: false }),
      expect.objectContaining({ id: "tolerance_retune", selectedNow: false }),
      expect.objectContaining({ id: "broad_source_crawl", selectedNow: false })
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the supported double-leaf/framed runtime rows pinned in the executable matrix", () => {
    const contract = buildLayerCombinationResolverDoubleLeafFramedWallBandedCoverageRefreshContract();

    expect(contract.matrixRows.slice(0, 3)).toEqual([
      expect.objectContaining({
        errorBudgetPins: expect.arrayContaining([
          { metric: "Rw", notMeasuredEvidence: true, toleranceDb: 7 },
          { metric: "STC", notMeasuredEvidence: true, toleranceDb: 7 }
        ]),
        expectedBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
        expectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
        id: "wall.double_leaf_framed.independent_absorbed.lab",
        valuePins: [
          { metric: "Rw", value: 45 },
          { metric: "STC", value: 45 },
          { metric: "C", value: -1 },
          { metric: "Ctr", value: -6.1 }
        ]
      }),
      expect.objectContaining({
        errorBudgetPins: expect.arrayContaining([
          { metric: "Rw", notMeasuredEvidence: true, toleranceDb: 8 },
          { metric: "STC", notMeasuredEvidence: true, toleranceDb: 8 }
        ]),
        id: "wall.double_leaf_framed.resilient_both_sides.lab",
        valuePins: [
          { metric: "Rw", value: 46 },
          { metric: "STC", value: 46 },
          { metric: "C", value: -1.1 },
          { metric: "Ctr", value: -6.2 }
        ]
      }),
      expect.objectContaining({
        id: "wall.double_leaf_framed.resilient_one_side.lab",
        valuePins: [
          { metric: "Rw", value: 45 },
          { metric: "STC", value: 45 },
          { metric: "C", value: -1.1 },
          { metric: "Ctr", value: -6.2 }
        ]
      })
    ]);

    expectPinnedRuntime(INDEPENDENT_ABSORBED_CONTEXT, { C: -1, Ctr: -6.1, Rw: 45, STC: 45, errorBudgetDb: 7 });
    expectPinnedRuntime(RESILIENT_BOTH_SIDES_CONTEXT, { C: -1.1, Ctr: -6.2, Rw: 46, STC: 46, errorBudgetDb: 8 });
    expectPinnedRuntime(RESILIENT_ONE_SIDE_CONTEXT, { C: -1.1, Ctr: -6.2, Rw: 45, STC: 45, errorBudgetDb: 8 });
  });

  it("keeps needs-input, separate-lane, field/building, impact, and ASTM boundaries executable", () => {
    const missingSideCount = calculateWall(RESILIENT_MISSING_SIDE_COUNT_CONTEXT);
    const directFixed = calculateAssembly(DIRECT_FIXED_EMPTY_STACK, {
      airborneContext: DIRECT_FIXED_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const groupedTripleLeaf = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const field = calculateWall(FIELD_CONTEXT, FIELD_OUTPUTS);
    const impact = calculateWall(INDEPENDENT_ABSORBED_CONTEXT, IMPACT_OUTPUTS);
    const astm = calculateWall(INDEPENDENT_ABSORBED_CONTEXT, ASTM_OUTPUTS);

    expect(missingSideCount.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(missingSideCount.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );

    expect(directFixed.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(directFixed.metrics).toMatchObject({ estimatedRwDb: 31, estimatedStc: 31 });
    expect(directFixed.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(directFixed.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );
    expect(groupedTripleLeaf.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );

    expect(field.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(field.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(field.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(field.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter",
      supportBucket: "field_adapter",
      valuePins: expect.arrayContaining([
        { metric: "R'w", value: 39 },
        { metric: "DnT,w", value: 42 }
      ])
    });

    expect(impact.impact).toBeNull();
    expect(impact.unsupportedTargetOutputs).toEqual(expect.arrayContaining(["Ln,w", "CI"]));
    expect(astm.unsupportedTargetOutputs).toEqual(expect.arrayContaining(["IIC", "AIIC"]));
  });

  it("keeps docs, exports, and current gate runner aligned with the double-leaf coverage refresh", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_LANDED_GATE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTION_STATUS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_FILE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID);
      expect(content, path).toContain("Rw 45");
      expect(content, path).toContain("Rw 46");
      expect(normalized, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_COVERAGE_REFRESH_SELECTED_NEXT_LABEL);
      expect(normalized, path).toContain("coverage refresh");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
      expect(normalized, path).toContain("broad source crawl");
      expect(normalized, path).toContain("no-runtime");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh";'
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh-contract.test.ts"
    );
  });
});
