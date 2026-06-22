import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-double-leaf-framed";
import { buildGateRDoubleLeafFramedBridgeSolverContract } from "./dynamic-calculator-double-leaf-framed-bridge-solver-contract";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_DOUBLE_LEAF_FRAMED_CAVITY_DEPTH_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_leaf_surface_mass_numeric_sensitivity_owner";

const OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_LEAF_SURFACE_MASS_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-22.md";
const OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "wall.double_leaf_framed.leaf_surface_mass_numeric_sensitivity_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_leaf_surface_mass_numeric_sensitivity_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_LEAF_SURFACE_MASS_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-22.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed leaf surface-mass numeric sensitivity coverage refresh";

const OWNER_COUNTERS = {
  accuracyPromotedRequestShapes: 3,
  accuracyPromotedTargetOutputs: 13,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 13,
  sourceRowsImported: 0
} as const;

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const LIGHT_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 9.5 },
  { materialId: "gypsum_board", thicknessMm: 9.5 }
] as const satisfies readonly LayerInput[];
const BASELINE_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];
const HEAVY_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 18 },
  { materialId: "gypsum_board", thicknessMm: 18 }
] as const satisfies readonly LayerInput[];
const ASYMMETRIC_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 25 }
] as const satisfies readonly LayerInput[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  OWNER_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function contextOwnedPorousCavity(input: {
  contextMode?: AirborneContext["contextMode"];
  missingSideBGroup?: boolean;
} = {}): AirborneContext {
  const contextMode = input.contextMode ?? "element_lab";

  return {
    advancedWall: {
      cavities: [
        {
          absorberCoverageRatio: 1,
          absorberFlowResistivityPaSM2: 15000,
          absorberThicknessMm: 90,
          depthMm: 90,
          id: "cavity-1",
          sealState: "sealed"
        }
      ]
    },
    contextMode,
    sharedTrack: "independent",
    studSpacingMm: 600,
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: 90,
      cavity1FillCoverage: "full",
      sideALeafLayerIndices: [0],
      ...(input.missingSideBGroup ? {} : { sideBLeafLayerIndices: [1] }),
      supportTopology: "independent_frames",
      topologyMode: "double_leaf_framed"
    },
    ...(contextMode === "field_between_rooms"
      ? {
          panelHeightMm: 2800,
          panelWidthMm: 3200,
          receivingRoomRt60S: 0.6,
          receivingRoomVolumeM3: 55
        }
      : {}),
    ...(contextMode === "building_prediction"
      ? {
          buildingPredictionOutputBasis: "apparent_and_standardized",
          conservativeFlankingAssumption: "multi_path_conservative",
          flankingJunctionClass: "rigid_t_junction",
          junctionCouplingLengthM: 4.8,
          panelHeightMm: 2800,
          panelWidthMm: 3200,
          receivingRoomRt60S: 0.6,
          receivingRoomVolumeM3: 55,
          sourceRoomVolumeM3: 42
        }
      : {})
  };
}

function calculateContextOwnedWall(
  layers: readonly LayerInput[],
  context: AirborneContext = contextOwnedPorousCavity(),
  targetOutputs: readonly RequestedOutputId[] = LAB_OUTPUTS
) {
  return calculateAssembly(layers, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
}

function summarizeOwner() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    previousRerankAction: PREVIOUS_RERANK_ACTION,
    previousRerankStatus: PREVIOUS_RERANK_STATUS,
    selectedCandidateId: OWNER_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

describe("post-V1 wall double-leaf/framed leaf surface-mass numeric sensitivity owner", () => {
  it("lands the runtime owner and selects the coverage refresh next", () => {
    expect(summarizeOwner()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      previousRerankAction: PREVIOUS_RERANK_ACTION,
      previousRerankStatus: PREVIOUS_RERANK_STATUS,
      selectedCandidateId: OWNER_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    });

    for (const path of [
      PREVIOUS_RERANK_FILE,
      PREVIOUS_RERANK_PLAN_DOC,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses symmetric side-leaf surface mass as an owned numeric formula input for lab outputs", () => {
    const light = calculateContextOwnedWall(LIGHT_LEAF_STACK);
    const baseline = calculateContextOwnedWall(BASELINE_LEAF_STACK);
    const heavy = calculateContextOwnedWall(HEAVY_LEAF_STACK);
    const lightSolver = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity(),
      layers: LIGHT_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });
    const heavySolver = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity(),
      layers: HEAVY_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });

    expect(light.metrics).toMatchObject({
      estimatedCDb: -1.5,
      estimatedCtrDb: -6.7,
      estimatedRwDb: 43,
      estimatedStc: 43
    });
    expect(baseline.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(heavy.metrics).toMatchObject({
      estimatedCDb: -1.6,
      estimatedCtrDb: -6.7,
      estimatedRwDb: 49,
      estimatedStc: 49
    });
    expect(light.airborneBasis?.method).toBe(GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD);
    expect(light.airborneBasis?.requiredInputs).toEqual(
      expect.arrayContaining(["sideALeafMassKgM2", "sideBLeafMassKgM2", "massAirMassResonanceHz"])
    );
    expect(lightSolver.physicalInputs).toMatchObject({
      leafMassRatio: 1,
      sideALeafMassKgM2: 8.1,
      sideBLeafMassKgM2: 8.1
    });
    expect(lightSolver.benchmarkRange?.massAirMassResonanceHz).toBe(99.1);
    expect(heavySolver.physicalInputs).toMatchObject({
      leafMassRatio: 1,
      sideALeafMassKgM2: 15.3,
      sideBLeafMassKgM2: 15.3
    });
    expect(heavySolver.benchmarkRange?.massAirMassResonanceHz).toBe(72.1);
  });

  it("propagates the mass-sensitive direct curve through owned field and building adapters", () => {
    const fieldLight = calculateContextOwnedWall(
      LIGHT_LEAF_STACK,
      contextOwnedPorousCavity({ contextMode: "field_between_rooms" }),
      FIELD_BUILDING_OUTPUTS
    );
    const buildingHeavy = calculateContextOwnedWall(
      HEAVY_LEAF_STACK,
      contextOwnedPorousCavity({ contextMode: "building_prediction" }),
      FIELD_BUILDING_OUTPUTS
    );

    expect(fieldLight.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(fieldLight.metrics).toMatchObject({
      estimatedCDb: -1.5,
      estimatedCtrDb: -6.7,
      estimatedDnADb: 36,
      estimatedDnTADb: 38.4,
      estimatedDnTwDb: 40,
      estimatedDnWDb: 37,
      estimatedRwDb: 43,
      estimatedRwPrimeDb: 37,
      estimatedStc: 43
    });
    expect(fieldLight.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);

    expect(buildingHeavy.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(buildingHeavy.metrics).toMatchObject({
      estimatedCDb: -1.6,
      estimatedCtrDb: -6.7,
      estimatedDnADb: 41.8,
      estimatedDnTADb: 44.2,
      estimatedDnTwDb: 45,
      estimatedDnWDb: 43,
      estimatedRwDb: 49,
      estimatedRwPrimeDb: 42,
      estimatedStc: 49
    });
    expect(buildingHeavy.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
  });

  it("keeps asymmetric side-leaf mass ratio active without changing topology or source basis", () => {
    const asymmetric = calculateContextOwnedWall(ASYMMETRIC_LEAF_STACK);
    const asymmetricSolver = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity(),
      layers: ASYMMETRIC_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });

    expect(asymmetric.metrics).toMatchObject({
      estimatedCDb: -1.3,
      estimatedCtrDb: -6.4,
      estimatedRwDb: 49,
      estimatedStc: 49
    });
    expect(asymmetric.airborneBasis).toMatchObject({
      method: GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(asymmetricSolver.physicalInputs).toMatchObject({
      leafMassRatio: 2,
      sideALeafMassKgM2: 10.6,
      sideBLeafMassKgM2: 21.3
    });
    expect(asymmetricSolver.benchmarkRange?.massAirMassResonanceHz).toBe(74.9);
    expect(asymmetricSolver.benchmarkRange?.estimatedRwDb.center).toBe(49);
  });

  it("keeps missing side-leaf ownership and unowned impact aliases outside the route", () => {
    const missingSideBContext = contextOwnedPorousCavity({ missingSideBGroup: true });
    const missingSideB = calculateContextOwnedWall(BASELINE_LEAF_STACK, missingSideBContext);
    const missingSideBSolver = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: missingSideBContext,
      layers: BASELINE_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });
    const impact = calculateContextOwnedWall(BASELINE_LEAF_STACK, contextOwnedPorousCavity(), IMPACT_OUTPUTS);

    expect(missingSideB.supportedTargetOutputs).toEqual([]);
    expect(missingSideB.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(missingSideB.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(missingSideBSolver.readinessStatus).toBe("needs_input");
    expect(missingSideBSolver.missingPhysicalInputs).toContain("sideBLeafGroup");
    expect(missingSideBSolver.physicalInputs.sideBLeafMassKgM2).toBeNull();
    expect(missingSideBSolver.benchmarkRange).toBeNull();

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.airborneBasis).toMatchObject({
      method: "dynamic_calculator_unsupported_output_guard",
      origin: "unsupported"
    });
  });

  it("keeps docs and current-gate aligned with the runtime owner closeout", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(OWNER_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("runtimeValuesMoved 13");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-leaf-surface-mass-numeric-sensitivity-owner-contract.test.ts"
    );
  });
});
