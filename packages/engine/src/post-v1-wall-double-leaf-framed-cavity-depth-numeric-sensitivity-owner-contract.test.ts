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

const PREVIOUS_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_coverage_refresh_plan";
const PREVIOUS_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-coverage-refresh-contract.test.ts";
const PREVIOUS_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_THICKNESS_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md";
const PREVIOUS_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_cavity_depth_numeric_sensitivity_owner";

const OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CAVITY_DEPTH_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md";
const OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "wall.double_leaf_framed.cavity_depth_numeric_sensitivity_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CAVITY_DEPTH_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-20.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed cavity-depth numeric sensitivity coverage refresh";

const OWNER_COUNTERS = {
  accuracyPromotedRequestShapes: 6,
  accuracyPromotedTargetOutputs: 26,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 3,
  newCalculableTargetOutputs: 13,
  runtimeBasisPromotions: 3,
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

const CONTEXT_ONLY_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
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
  advancedDepthMm?: number | null;
  contextMode?: AirborneContext["contextMode"];
  depthMm: number;
  topologyDepthMm?: number | null;
}): AirborneContext {
  const contextMode = input.contextMode ?? "element_lab";
  const topologyDepthMm = input.topologyDepthMm === undefined ? input.depthMm : input.topologyDepthMm;
  const advancedDepthMm = input.advancedDepthMm === undefined ? input.depthMm : input.advancedDepthMm;

  return {
    advancedWall: {
      cavities: [
        {
          absorberCoverageRatio: 1,
          absorberFlowResistivityPaSM2: 15000,
          absorberThicknessMm: 90,
          ...(advancedDepthMm === null ? {} : { depthMm: advancedDepthMm }),
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
      ...(topologyDepthMm === null ? {} : { cavity1DepthMm: topologyDepthMm }),
      cavity1FillCoverage: "full",
      sideALeafLayerIndices: [0],
      sideBLeafLayerIndices: [1],
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
  context: AirborneContext,
  targetOutputs: readonly RequestedOutputId[] = LAB_OUTPUTS
) {
  return calculateAssembly(CONTEXT_ONLY_LEAF_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
}

function summarizeOwner() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    previousRefreshAction: PREVIOUS_REFRESH_ACTION,
    previousRefreshStatus: PREVIOUS_REFRESH_STATUS,
    selectedCandidateId: OWNER_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

describe("post-V1 wall double-leaf/framed cavity-depth numeric sensitivity owner", () => {
  it("lands the runtime owner and selects the coverage refresh next", () => {
    expect(summarizeOwner()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      previousRefreshAction: PREVIOUS_REFRESH_ACTION,
      previousRefreshStatus: PREVIOUS_REFRESH_STATUS,
      selectedCandidateId: OWNER_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    });

    for (const path of [
      PREVIOUS_REFRESH_FILE,
      PREVIOUS_REFRESH_PLAN_DOC,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses topology cavity depth as an owned numeric formula input for lab outputs", () => {
    const shallow = calculateContextOwnedWall(contextOwnedPorousCavity({ depthMm: 60 }));
    const nominal = calculateContextOwnedWall(contextOwnedPorousCavity({ depthMm: 90 }));
    const deep = calculateContextOwnedWall(contextOwnedPorousCavity({ depthMm: 140 }));
    const shallowSolver = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity({ depthMm: 60 }),
      layers: CONTEXT_ONLY_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });
    const deepSolver = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity({ depthMm: 140 }),
      layers: CONTEXT_ONLY_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });

    expect(shallow.metrics).toMatchObject({
      estimatedCDb: -1.2,
      estimatedCtrDb: -6.4,
      estimatedRwDb: 44,
      estimatedStc: 44
    });
    expect(nominal.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(deep.metrics).toMatchObject({
      estimatedCDb: -0.8,
      estimatedCtrDb: -5.8,
      estimatedRwDb: 47,
      estimatedStc: 48
    });
    expect(shallowSolver.physicalInputs.cavityDepthMm).toBe(60);
    expect(shallowSolver.benchmarkRange?.massAirMassResonanceHz).toBe(106);
    expect(deepSolver.physicalInputs.cavityDepthMm).toBe(140);
    expect(deepSolver.benchmarkRange?.massAirMassResonanceHz).toBe(69.4);
    expect(deep.airborneBasis?.requiredInputs).toContain("cavity1DepthMm");
  });

  it("uses advancedWall cavity depth when topology depth is omitted", () => {
    const lab = calculateContextOwnedWall(
      contextOwnedPorousCavity({ depthMm: 140, topologyDepthMm: null })
    );
    const field = calculateContextOwnedWall(
      contextOwnedPorousCavity({
        contextMode: "field_between_rooms",
        depthMm: 140,
        topologyDepthMm: null
      }),
      FIELD_BUILDING_OUTPUTS
    );
    const building = calculateContextOwnedWall(
      contextOwnedPorousCavity({
        contextMode: "building_prediction",
        depthMm: 60,
        topologyDepthMm: null
      }),
      FIELD_BUILDING_OUTPUTS
    );
    const advancedOnlySolver = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity({ depthMm: 140, topologyDepthMm: null }),
      layers: CONTEXT_ONLY_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });

    expect(lab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(lab.metrics).toMatchObject({
      estimatedCDb: -0.8,
      estimatedCtrDb: -5.8,
      estimatedRwDb: 47,
      estimatedStc: 48
    });
    expect(lab.airborneBasis?.method).toBe(GATE_S_DOUBLE_LEAF_FRAMED_BRIDGE_RUNTIME_METHOD);

    expect(field.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(field.metrics).toMatchObject({
      estimatedCDb: -0.8,
      estimatedCtrDb: -5.8,
      estimatedDnADb: 40.6,
      estimatedDnTADb: 43,
      estimatedDnTwDb: 44,
      estimatedDnWDb: 42,
      estimatedRwDb: 47,
      estimatedRwPrimeDb: 41,
      estimatedStc: 48
    });
    expect(field.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);

    expect(building.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(building.metrics).toMatchObject({
      estimatedCDb: -1.2,
      estimatedCtrDb: -6.4,
      estimatedDnADb: 37.3,
      estimatedDnTADb: 39.7,
      estimatedDnTwDb: 41,
      estimatedDnWDb: 38,
      estimatedRwDb: 44,
      estimatedRwPrimeDb: 38,
      estimatedStc: 44
    });
    expect(building.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);

    expect(advancedOnlySolver.readinessStatus).toBe("solver_candidate_ready");
    expect(advancedOnlySolver.missingPhysicalInputs).toEqual([]);
    expect(advancedOnlySolver.physicalInputs.cavityDepthMm).toBe(140);
  });

  it("fails closed when cavity depth is missing or non-positive", () => {
    const missing = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity({
        advancedDepthMm: null,
        depthMm: 90,
        topologyDepthMm: null
      }),
      layers: CONTEXT_ONLY_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });
    const nonPositive = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity({
        advancedDepthMm: 0,
        depthMm: 90,
        topologyDepthMm: null
      }),
      layers: CONTEXT_ONLY_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });

    for (const contract of [missing, nonPositive]) {
      expect(contract.readinessStatus).toBe("needs_input");
      expect(contract.missingPhysicalInputs).toContain("cavity1DepthMm");
      expect(contract.physicalInputs.cavityDepthMm).toBeNull();
      expect(contract.benchmarkRange).toBeNull();
    }
  });

  it("keeps topology depth authoritative when both depth sources are supplied", () => {
    const mismatched = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity({
        advancedDepthMm: 140,
        depthMm: 90,
        topologyDepthMm: 90
      }),
      layers: CONTEXT_ONLY_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });

    expect(mismatched.readinessStatus).toBe("solver_candidate_ready");
    expect(mismatched.missingPhysicalInputs).toEqual([]);
    expect(mismatched.physicalInputs.cavityDepthMm).toBe(90);
    expect(mismatched.physicalInputs.absorberThicknessMm).toBeNull();
    expect(mismatched.benchmarkRange?.estimatedRwDb.center).toBe(46);
  });

  it("keeps unowned impact aliases outside this wall route", () => {
    const impact = calculateContextOwnedWall(
      contextOwnedPorousCavity({ depthMm: 140, topologyDepthMm: null }),
      IMPACT_OUTPUTS
    );

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

      expect(content, path).toContain(PREVIOUS_REFRESH_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(OWNER_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("runtimeValuesMoved 13");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-owner-contract.test.ts"
    );
  });
});
