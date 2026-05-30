import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildDynamicCalculatorCandidateResolverRuntime } from "./dynamic-calculator-candidate-resolver-runtime";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-formula-corridor";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_LANDED_GATE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_WARNING,
  buildLayerCombinationResolverDoubleLeafFramedWallBandedRuntimeCorridorContract
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor";
import { buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract } from "./layer-combination-resolver-candidate-coverage-matrix-refresh";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import {
  adaptLayerCombinationRuntimeCandidate,
  buildLayerCombinationResolverRuntimeCandidateAdapterContract
} from "./layer-combination-resolver-runtime-candidate-adapter";
import { buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract } from "./layer-combination-resolver-runtime-candidate-surface-parity";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "CI", "IIC"] as const satisfies readonly RequestedOutputId[];

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

const DOC_ALIGNMENT_SURFACES = [
  "AGENTS.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md",
  "docs/calculator/INSUL_COMPETITOR_RESEARCH_2026-05-20.md"
] as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants.ts",
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor.ts",
  "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor-contract.test.ts",
  "packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts",
  "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
  "packages/engine/src/layer-combination-resolver-registry.ts",
  "packages/engine/src/layer-combination-resolver-runtime-candidate-adapter.ts",
  "packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity.ts",
  "packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh.ts",
  "packages/engine/src/index.ts",
  "tools/dev/run-calculator-current-gate.ts",
  ...DOC_ALIGNMENT_SURFACES
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

function expectRuntimeWall(
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
    calculationStandard: "engine_double_leaf_cavity",
    errorBudgetDb: expected.errorBudgetDb,
    method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
    origin: "family_physics_prediction",
    ratingStandard: "ISO 717-1"
  });
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: false,
    selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction",
    selectedBasis: {
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
    }
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
    selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
    supportBucket: "source_absent_estimate"
  });
  expect(result.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.warnings).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_WARNING);

  return result;
}

describe("layer combination resolver double-leaf framed wall banded runtime corridor contract", () => {
  it("lands runtime basis promotion and selects double-leaf/framed surface parity next", () => {
    const contract = buildLayerCombinationResolverDoubleLeafFramedWallBandedRuntimeCorridorContract();

    expect(contract).toMatchObject({
      basis: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      exactMeasuredRowsRemainPrecedence: true,
      landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_LANDED_GATE,
      numericRuntimeValueMovementThisGate: false,
      previousFormulaCorridor: {
        landedGate: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_LANDED_GATE,
        selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_ACTION,
        selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTED_NEXT_FILE,
        selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_SELECTION_STATUS
      },
      runtimeBasisMovementThisGate: true,
      runtimeCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID,
      selectedNextAction: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION,
      selectedNextFile: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE,
      selectedNextLabel: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_LABEL,
      selectionStatus: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS,
      warning: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_WARNING
    });
    expect(contract.blockedAliases).toEqual([
      "unowned_field_airborne_R_prime_and_DnT_alias_outputs",
      "building_prediction_outputs",
      "floor_impact_Ln_w_CI_DeltaLw_outputs",
      "ASTM_IIC_AIIC_aliases",
      "new_Rw_to_STC_alias_promotion"
    ]);
    expect(contract.supportedScenarios.map((scenario) => [scenario.id, scenario.currentRuntimeMetrics])).toEqual([
      ["wall_independent_absorbed_double_leaf_framed", { C: -1, Ctr: -6.1, Rw: 45, STCCompatibility: 45 }],
      ["wall_resilient_both_sides_double_leaf_framed", { C: -1.1, Ctr: -6.2, Rw: 46, STCCompatibility: 46 }],
      ["wall_resilient_one_side_double_leaf_framed", { C: -1.1, Ctr: -6.2, Rw: 45, STCCompatibility: 45 }]
    ]);

    for (const path of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes complete source-absent double-leaf/framed wall variants through the formula basis without numeric movement", () => {
    expectRuntimeWall(INDEPENDENT_ABSORBED_CONTEXT, {
      C: -1,
      Ctr: -6.1,
      Rw: 45,
      STC: 45,
      errorBudgetDb: 7
    });
    expectRuntimeWall(RESILIENT_BOTH_SIDES_CONTEXT, {
      C: -1.1,
      Ctr: -6.2,
      Rw: 46,
      STC: 46,
      errorBudgetDb: 8
    });
    expectRuntimeWall(RESILIENT_ONE_SIDE_CONTEXT, {
      C: -1.1,
      Ctr: -6.2,
      Rw: 45,
      STC: 45,
      errorBudgetDb: 8
    });
  });

  it("keeps exact source precedence above the source-absent runtime candidate", () => {
    const runtime = expectRuntimeWall(INDEPENDENT_ABSORBED_CONTEXT, {
      C: -1,
      Ctr: -6.1,
      Rw: 45,
      STC: 45,
      errorBudgetDb: 7
    });
    const resolution = buildDynamicCalculatorCandidateResolverRuntime({
      airborneContext: INDEPENDENT_ABSORBED_CONTEXT,
      layers: DOUBLE_LEAF_ABSORBED_STACK,
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
          id: "rights_safe_double_leaf_exact_lab_row",
          label: "Rights-safe double-leaf lab row",
          metricLabel: "Rw",
          metricValue: 47,
          sourceMode: "lab"
        }
      },
      targetOutputs: WALL_OUTPUTS
    });

    expect(resolution.resolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
    expect(resolution.resolution.selectedBasis).toMatchObject({
      exactSourceId: "rights_safe_double_leaf_exact_lab_row",
      origin: "measured_exact_full_stack"
    });
  });

  it("keeps missing inputs, wrong topologies, building, impact, and ASTM aliases out while preserving explicit field context", () => {
    const missingSideCount = calculateWall(RESILIENT_MISSING_SIDE_COUNT_CONTEXT);
    const directFixed = calculateAssembly(DIRECT_FIXED_EMPTY_STACK, {
      airborneContext: DIRECT_FIXED_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const grouped = calculateAssembly(GROUPED_SPLIT_ROCKWOOL_STACK, {
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_OUTPUTS
    });
    const field = calculateWall(FIELD_CONTEXT, FIELD_OUTPUTS);
    const building = calculateWall(
      {
        ...FIELD_CONTEXT,
        contextMode: "building_prediction"
      },
      FIELD_OUTPUTS
    );
    const impact = calculateWall(INDEPENDENT_ABSORBED_CONTEXT, IMPACT_OUTPUTS);

    expect(missingSideCount.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(missingSideCount.airborneBasis).toMatchObject({
      missingPhysicalInputs: ["resilientBarSideCount"],
      origin: "needs_input"
    });
    expect(missingSideCount.airborneBasis?.method).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
    );

    expect(directFixed.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_multileaf_screening_fallback",
      selectedOrigin: "screening_fallback"
    });
    expect(directFixed.airborneBasis?.method).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
    );

    expect(grouped.airborneBasis?.method).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
    );
    expect(grouped.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );

    expect(field.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(field.airborneBasis).toMatchObject({
      method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(field.airborneBasis?.assumptions).toEqual(
      expect.arrayContaining([
        `base lab-family method remains ${LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS}`
      ])
    );
    expect(field.layerCombinationResolverTrace).toMatchObject({
      requestedBasis: "field_apparent",
      runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter",
      supportBucket: "field_adapter"
    });
    expect(field.supportedTargetOutputs).toEqual(["R'w", "DnT,w"]);
    expect(field.warnings.join("\n")).toContain("Airborne field-side overlay active.");
    expect(building.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: "candidate_dynamic_needs_input",
      selectedOrigin: "needs_input"
    });
    expect(building.airborneBasis?.method).not.toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
    );
    expect(impact.impact).toBeNull();
    expect(impact.supportedImpactOutputs ?? []).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual(expect.arrayContaining(["Ln,w", "CI", "IIC"]));
  });

  it("registers the runtime candidate through adapter, surface, and coverage matrix without merging bases", () => {
    const registry = buildLayerCombinationResolverRegistryContract();
    const adapter = buildLayerCombinationResolverRuntimeCandidateAdapterContract();
    const surface = buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract();
    const coverage = buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract();
    const registryCandidate = registry.candidateDeclarations.find(
      (candidate) => candidate.id === LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );
    const adapterRow = adapter.adapterRows.find(
      (row) => row.runtimeBasisId === LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
    );
    const surfaceRow = surface.surfaceRows.find(
      (row) => row.selectedCandidateId === LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );
    const coverageRow = coverage.coverageMatrixRows.find(
      (row) => row.candidateId === LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );
    const directAdapter = adaptLayerCombinationRuntimeCandidate({
      requestedBasis: "element_lab",
      route: "wall",
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS
    });

    expect(registryCandidate).toMatchObject({
      basis: "element_lab",
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      priorityRank: 3,
      route: "wall",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: ["Rw", "C", "Ctr", "STC"]
    });
    expect(adapterRow).toMatchObject({
      requestedBasis: "element_lab",
      route: "wall",
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    });
    expect(directAdapter.selectedCandidateId).toBe(
      LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    );
    expect(surfaceRow).toMatchObject({
      candidateKind: "source_absent_family_solver",
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      supportBucket: "source_absent_estimate",
      valuePins: expect.arrayContaining([
        { metric: "Rw", value: 45 },
        { metric: "STC", value: 45 },
        { metric: "C", value: -1 },
        { metric: "Ctr", value: -6.1 }
      ])
    });
    expect(coverageRow).toMatchObject({
      candidateKind: "source_absent_family_solver",
      readinessBucket: "ready_with_budget",
      route: "wall",
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      supportBucket: "source_absent_estimate"
    });
  });

  it("keeps docs, exports, and current-gate runner aligned with the runtime corridor closeout", () => {
    for (const path of DOC_ALIGNMENT_SURFACES) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_LANDED_GATE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTION_STATUS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_ACTION);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_NEXT_FILE);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS);
      expect(content, path).toContain(LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID);
      expect(content, path).toContain("Rw 45");
      expect(content, path).toContain("Rw 46");
      expect(content, path).toContain("+/-7 dB");
      expect(content, path).toContain("+/-8 dB");
      expect(normalized, path).toContain("double-leaf");
      expect(normalized, path).toContain("runtime corridor");
      expect(normalized, path).toContain("field/building");
      expect(normalized, path).toContain("astm/iic");
      expect(normalized, path).toContain("surface parity");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    expect(readRepoFile("packages/engine/src/index.ts")).toContain(
      'export * from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor";'
    );
    expect(readRepoFile("tools/dev/run-calculator-current-gate.ts")).toContain(
      "src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor-contract.test.ts"
    );
  });
});
