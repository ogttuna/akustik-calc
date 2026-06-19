import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { buildGateRDoubleLeafFramedBridgeSolverContract } from "./dynamic-calculator-double-leaf-framed-bridge-solver-contract";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_coverage_refresh_plan";
const PREVIOUS_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-bridge-support-spacing-numeric-sensitivity-coverage-refresh-contract.test.ts";
const PREVIOUS_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_BRIDGE_SUPPORT_SPACING_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md";
const PREVIOUS_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_bridge_support_spacing_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_absorber_thickness_numeric_sensitivity_owner";

const OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_THICKNESS_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md";
const OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "wall.double_leaf_framed.porous_absorber_thickness_numeric_sensitivity_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_THICKNESS_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed porous absorber thickness numeric sensitivity coverage refresh";

const OWNER_COUNTERS = {
  accuracyPromotedRequestShapes: 3,
  accuracyPromotedTargetOutputs: 13,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 1,
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

const CUSTOM_PANEL_ID = "custom_panel_leaf";
const CUSTOM_ABSORBER_ID = "custom_porous_absorber_missing_flow";
const CUSTOM_DOUBLE_LEAF_STACK = [
  { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 },
  { materialId: CUSTOM_ABSORBER_ID, thicknessMm: 90 },
  { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXPLICIT_DOUBLE_LEAF_CONTEXT: AirborneContext = {
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

function buildCustomMaterialCatalog(): readonly MaterialDefinition[] {
  return [
    ...getDefaultMaterialCatalog(),
    {
      acoustic: {
        behavior: "panel_leaf",
        notes: [],
        propertySourceStatus: "user_supplied"
      },
      category: "finish",
      densityKgM3: 848,
      id: CUSTOM_PANEL_ID,
      name: "Custom Panel Leaf",
      tags: ["gypsum", "board", "custom"]
    },
    {
      acoustic: {
        absorberClass: "porous_absorptive",
        behavior: "porous_absorber",
        notes: [],
        propertySourceStatus: "user_supplied"
      },
      category: "insulation",
      densityKgM3: 45,
      id: CUSTOM_ABSORBER_ID,
      name: "Custom Porous Absorber Missing Flow",
      tags: ["porous", "rockwool", "mineral_wool", "custom"]
    }
  ];
}

function contextOwnedPorousCavity(input: {
  contextMode?: AirborneContext["contextMode"];
  flowResistivityPaSM2?: number;
  ratio?: number;
  thicknessMm?: number;
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
          ...(typeof input.thicknessMm === "number" ? { absorberThicknessMm: input.thicknessMm } : {}),
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

describe("post-V1 wall double-leaf/framed porous absorber thickness numeric sensitivity owner", () => {
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

  it("uses absorber thickness as a bounded porous damping input for lab outputs", () => {
    const full = calculateContextOwnedWall(
      contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1, thicknessMm: 90 })
    );
    const half = calculateContextOwnedWall(
      contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1, thicknessMm: 45 })
    );
    const thin = calculateContextOwnedWall(
      contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1, thicknessMm: 20 })
    );
    const halfSolver = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1, thicknessMm: 45 }),
      layers: CONTEXT_ONLY_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });
    const thinSolver = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1, thicknessMm: 20 }),
      layers: CONTEXT_ONLY_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });

    expect(full.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(half.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 44,
      estimatedStc: 44
    });
    expect(thin.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 43,
      estimatedStc: 43
    });
    expect(halfSolver.physicalInputs.absorberThicknessMm).toBe(45);
    expect(halfSolver.benchmarkRange?.dampingCreditDb).toBe(1.8);
    expect(thinSolver.physicalInputs.absorberThicknessMm).toBe(20);
    expect(thinSolver.benchmarkRange?.dampingCreditDb).toBe(0.8);
    expect(half.airborneBasis?.requiredInputs).toContain("absorberThicknessMm");
  });

  it("propagates the thickness-sensitive lab curve through owned field and building adapters", () => {
    const fieldHalf = calculateContextOwnedWall(
      contextOwnedPorousCavity({
        contextMode: "field_between_rooms",
        flowResistivityPaSM2: 15000,
        ratio: 1,
        thicknessMm: 45
      }),
      FIELD_BUILDING_OUTPUTS
    );
    const buildingThin = calculateContextOwnedWall(
      contextOwnedPorousCavity({
        contextMode: "building_prediction",
        flowResistivityPaSM2: 15000,
        ratio: 1,
        thicknessMm: 20
      }),
      FIELD_BUILDING_OUTPUTS
    );

    expect(fieldHalf.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(fieldHalf.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedDnADb: 37.5,
      estimatedDnTADb: 39.9,
      estimatedDnTwDb: 41,
      estimatedDnWDb: 39,
      estimatedRwDb: 44,
      estimatedRwPrimeDb: 38,
      estimatedStc: 44
    });
    expect(fieldHalf.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);

    expect(buildingThin.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(buildingThin.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedDnADb: 36.5,
      estimatedDnTADb: 38.9,
      estimatedDnTwDb: 40,
      estimatedDnWDb: 38,
      estimatedRwDb: 43,
      estimatedRwPrimeDb: 37,
      estimatedStc: 43
    });
    expect(buildingThin.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
  });

  it("preserves no-thickness legacy behavior and names thickness only when supplied", () => {
    const noThickness = calculateContextOwnedWall(
      contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1 }),
      LAB_OUTPUTS
    );
    const noThicknessSolver = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1 }),
      layers: CONTEXT_ONLY_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });

    expect(noThickness.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(noThickness.airborneBasis?.requiredInputs).toContain("absorberCoverageRatio");
    expect(noThickness.airborneBasis?.requiredInputs).not.toContain("absorberThicknessMm");
    expect(noThicknessSolver.physicalInputs.absorberThicknessMm).toBeNull();
    expect(noThicknessSolver.benchmarkRange?.dampingCreditDb).toBe(3.5);
  });

  it("keeps missing route inputs and unowned impact aliases outside the route", () => {
    const missingFlow = calculateAssembly(CUSTOM_DOUBLE_LEAF_STACK, {
      airborneContext: EXPLICIT_DOUBLE_LEAF_CONTEXT,
      calculator: "dynamic",
      catalog: buildCustomMaterialCatalog(),
      targetOutputs: LAB_OUTPUTS
    });
    const missingSpacingSolver = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: {
        ...contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1, thicknessMm: 45 }),
        studSpacingMm: undefined
      },
      layers: CONTEXT_ONLY_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });
    const impact = calculateContextOwnedWall(
      contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1, thicknessMm: 45 }),
      IMPACT_OUTPUTS
    );

    expect(missingFlow.supportedTargetOutputs).toEqual([]);
    expect(missingFlow.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(missingFlow.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["flowResistivityPaSM2"],
      origin: "needs_input"
    });

    expect(missingSpacingSolver.readinessStatus).toBe("needs_input");
    expect(missingSpacingSolver.missingPhysicalInputs).toContain("supportSpacingMm");

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
      expect(content, path).toContain("runtimeFormulaRetunes: 1");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-owner-contract.test.ts"
    );
  });
});
