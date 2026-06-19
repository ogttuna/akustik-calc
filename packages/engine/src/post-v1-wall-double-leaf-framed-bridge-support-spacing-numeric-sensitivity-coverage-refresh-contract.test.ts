import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD } from "./dynamic-airborne-gate-s-double-leaf-framed";
import { buildGateRDoubleLeafFramedBridgeSolverContract } from "./dynamic-calculator-double-leaf-framed-bridge-solver-contract";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-bridge-support-spacing-numeric-sensitivity-owner-contract.test.ts";
const PREVIOUS_OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_BRIDGE_SUPPORT_SPACING_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "wall.double_leaf_framed.bridge_support_spacing_numeric_sensitivity_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-bridge-support-spacing-numeric-sensitivity-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_BRIDGE_SUPPORT_SPACING_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_absorber_thickness_numeric_sensitivity_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_THICKNESS_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed porous absorber thickness numeric sensitivity owner";

const COVERAGE_REFRESH_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
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

const DIRECT_FIXED_EMPTY_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 45 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  COVERAGE_REFRESH_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function contextOwnedPorousCavity(input: {
  contextMode?: AirborneContext["contextMode"];
  flowResistivityPaSM2?: number;
  ratio?: number;
  spacingMm?: number;
}): AirborneContext {
  const contextMode = input.contextMode ?? "element_lab";

  return {
    advancedWall: {
      cavities: [
        {
          ...(typeof input.ratio === "number" ? { absorberCoverageRatio: input.ratio } : {}),
          ...(typeof input.flowResistivityPaSM2 === "number"
            ? { absorberFlowResistivityPaSM2: input.flowResistivityPaSM2 }
            : {}),
          absorberThicknessMm: 90,
          depthMm: 90,
          id: "cavity-1",
          sealState: "sealed"
        }
      ]
    },
    contextMode,
    sharedTrack: "independent",
    ...(typeof input.spacingMm === "number" ? { studSpacingMm: input.spacingMm } : {}),
    wallTopology: {
      cavity1AbsorptionClass: "porous_absorptive",
      cavity1DepthMm: 90,
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

function directFixedContext(spacingMm: number): AirborneContext {
  return {
    connectionType: "direct_fix",
    contextMode: "element_lab",
    studSpacingMm: spacingMm,
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

function summarizeCoverageRefresh() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
    noRuntimeValueMovement: true,
    previousOwnerAction: PREVIOUS_OWNER_ACTION,
    previousOwnerFile: PREVIOUS_OWNER_FILE,
    previousOwnerStatus: PREVIOUS_OWNER_STATUS,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

describe("post-V1 wall double-leaf/framed bridge support-spacing numeric sensitivity coverage refresh", () => {
  it("lands the no-runtime refresh and selects absorber thickness numeric sensitivity next", () => {
    expect(summarizeCoverageRefresh()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      previousOwnerAction: PREVIOUS_OWNER_ACTION,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      PREVIOUS_OWNER_FILE,
      PREVIOUS_OWNER_PLAN_DOC,
      COVERAGE_REFRESH_FILE,
      COVERAGE_REFRESH_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("re-probes support-spacing-sensitive lab values without formula retuning", () => {
    const tight = calculateContextOwnedWall(
      contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1, spacingMm: 400 })
    );
    const baseline = calculateContextOwnedWall(
      contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1, spacingMm: 600 })
    );
    const wide = calculateContextOwnedWall(
      contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1, spacingMm: 1200 })
    );
    const tightSolver = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1, spacingMm: 400 }),
      layers: CONTEXT_ONLY_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });
    const wideSolver = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1, spacingMm: 1200 }),
      layers: CONTEXT_ONLY_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });

    expect(tight.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 45,
      estimatedStc: 45
    });
    expect(baseline.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(wide.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 47,
      estimatedStc: 47
    });
    expect(tightSolver.benchmarkRange?.bridgeCouplingDeltaDb).toBe(3);
    expect(wideSolver.benchmarkRange?.bridgeCouplingDeltaDb).toBe(5.5);
    expect(baseline.airborneBasis?.requiredInputs).toContain("supportSpacingMm");
  });

  it("re-probes field and building adapters deriving from the spacing-sensitive owned lab curve", () => {
    const fieldTight = calculateContextOwnedWall(
      contextOwnedPorousCavity({
        contextMode: "field_between_rooms",
        flowResistivityPaSM2: 15000,
        ratio: 1,
        spacingMm: 400
      }),
      FIELD_BUILDING_OUTPUTS
    );
    const buildingWide = calculateContextOwnedWall(
      contextOwnedPorousCavity({
        contextMode: "building_prediction",
        flowResistivityPaSM2: 15000,
        ratio: 1,
        spacingMm: 1200
      }),
      FIELD_BUILDING_OUTPUTS
    );

    expect(fieldTight.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(fieldTight.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedDnADb: 38.5,
      estimatedDnTADb: 40.9,
      estimatedDnTwDb: 42,
      estimatedDnWDb: 40,
      estimatedRwDb: 45,
      estimatedRwPrimeDb: 39,
      estimatedStc: 45
    });
    expect(fieldTight.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);

    expect(buildingWide.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(buildingWide.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedDnADb: 40.5,
      estimatedDnTADb: 42.9,
      estimatedDnTwDb: 44,
      estimatedDnWDb: 42,
      estimatedRwDb: 47,
      estimatedRwPrimeDb: 41,
      estimatedStc: 47
    });
    expect(buildingWide.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
  });

  it("preserves missing support spacing, unowned impact aliases, and direct-fixed ownership", () => {
    const missingSpacingSolver = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1 }),
      layers: CONTEXT_ONLY_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });
    const impact = calculateContextOwnedWall(
      contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1, spacingMm: 600 }),
      IMPACT_OUTPUTS
    );
    const direct = calculateAssembly(DIRECT_FIXED_EMPTY_STACK, {
      airborneContext: directFixedContext(1200),
      calculator: "dynamic",
      targetOutputs: LAB_OUTPUTS
    });

    expect(missingSpacingSolver.readinessStatus).toBe("needs_input");
    expect(missingSpacingSolver.missingPhysicalInputs).toContain("supportSpacingMm");
    expect(missingSpacingSolver.benchmarkRange).toBeNull();
    expect(missingSpacingSolver.candidateBasis).toBeNull();

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
    expect(impact.airborneBasis).toMatchObject({
      method: "dynamic_calculator_unsupported_output_guard",
      origin: "unsupported"
    });

    expect(direct.airborneBasis?.method).toBe(GATE_EO_DIRECT_FIXED_DOUBLE_LEAF_BRIDGE_LOSS_RUNTIME_METHOD);
  });

  it("keeps docs and current-gate aligned with the refresh closeout and selected owner", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-bridge-support-spacing-numeric-sensitivity-coverage-refresh-contract.test.ts"
    );
  });
});
