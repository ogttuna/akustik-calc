import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import { GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD } from "./dynamic-airborne-gate-i-airborne-field-context";
import { buildGateRDoubleLeafFramedBridgeSolverContract } from "./dynamic-calculator-double-leaf-framed-bridge-solver-contract";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_coverage_refresh_plan";
const PREVIOUS_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-porous-flow-resistivity-numeric-sensitivity-coverage-refresh-contract.test.ts";
const PREVIOUS_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_FLOW_RESISTIVITY_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md";
const PREVIOUS_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_porous_flow_resistivity_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_coverage_ratio_numeric_sensitivity_owner";

const OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-coverage-ratio-numeric-sensitivity-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_COVERAGE_RATIO_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md";
const OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_owner_landed_runtime_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "wall.double_leaf_framed.porous_absorber_coverage_ratio_numeric_sensitivity_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_porous_absorber_coverage_ratio_numeric_sensitivity_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-coverage-ratio-numeric-sensitivity-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_POROUS_ABSORBER_COVERAGE_RATIO_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-19.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed porous absorber coverage-ratio numeric sensitivity coverage refresh";

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

const CONTEXT_OWNED_POROUS_CAVITY_BASE = {
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
  }
} satisfies Pick<AirborneContext, "sharedTrack" | "studSpacingMm" | "wallTopology">;

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
}): AirborneContext {
  const contextMode = input.contextMode ?? "element_lab";

  return {
    ...CONTEXT_OWNED_POROUS_CAVITY_BASE,
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
    previousRefreshFile: PREVIOUS_REFRESH_FILE,
    previousRefreshStatus: PREVIOUS_REFRESH_STATUS,
    selectedCandidateId: OWNER_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

describe("post-V1 wall double-leaf/framed porous absorber coverage-ratio numeric sensitivity owner", () => {
  it("lands a calculator runtime owner and selects its coverage refresh", () => {
    expect(summarizeOwner()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      previousRefreshAction: PREVIOUS_REFRESH_ACTION,
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

  it("uses advanced-wall absorberCoverageRatio as a numeric porous damping input for lab outputs", () => {
    const full = calculateContextOwnedWall(contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 1 }));
    const half = calculateContextOwnedWall(contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 0.5 }));
    const quarter = calculateContextOwnedWall(contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 0.25 }));

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
    expect(quarter.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 43,
      estimatedStc: 43
    });
    expect(half.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(half.airborneBasis?.requiredInputs).toContain("absorberCoverageRatio");
    expect(half.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    });

    const halfSolver = buildGateRDoubleLeafFramedBridgeSolverContract({
      airborneContext: contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 0.5 }),
      layers: CONTEXT_ONLY_LEAF_STACK,
      targetOutputs: LAB_OUTPUTS
    });
    expect(halfSolver.physicalInputs).toMatchObject({
      absorberCoverageRatio: 0.5,
      flowResistivityPaSM2: 15000,
      flowResistivitySource: "user_supplied"
    });
    expect(halfSolver.benchmarkRange).toMatchObject({
      dampingCreditDb: 1.8,
      estimatedRwDb: {
        center: 44
      }
    });
  });

  it("preserves no-ratio legacy behavior and keeps flow as the required physical input", () => {
    const noRatio = calculateContextOwnedWall(contextOwnedPorousCavity({ flowResistivityPaSM2: 15000 }));
    const missingFlow = calculateAssembly(CUSTOM_DOUBLE_LEAF_STACK, {
      airborneContext: EXPLICIT_DOUBLE_LEAF_CONTEXT,
      calculator: "dynamic",
      catalog: buildCustomMaterialCatalog(),
      targetOutputs: LAB_OUTPUTS
    });

    expect(noRatio.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(noRatio.airborneBasis?.requiredInputs).not.toContain("absorberCoverageRatio");

    expect(missingFlow.supportedTargetOutputs).toEqual([]);
    expect(missingFlow.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(missingFlow.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["flowResistivityPaSM2"],
      origin: "needs_input"
    });
  });

  it("propagates ratio-sensitive lab curves through owned field and building adapters", () => {
    const fieldHalf = calculateContextOwnedWall(
      contextOwnedPorousCavity({
        contextMode: "field_between_rooms",
        flowResistivityPaSM2: 15000,
        ratio: 0.5
      }),
      FIELD_BUILDING_OUTPUTS
    );
    const buildingQuarter = calculateContextOwnedWall(
      contextOwnedPorousCavity({
        contextMode: "building_prediction",
        flowResistivityPaSM2: 15000,
        ratio: 0.25
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

    expect(buildingQuarter.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(buildingQuarter.metrics).toMatchObject({
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
    expect(buildingQuarter.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
  });

  it("keeps unowned impact aliases unsupported", () => {
    const impact = calculateContextOwnedWall(
      contextOwnedPorousCavity({ flowResistivityPaSM2: 15000, ratio: 0.5 }),
      ["IIC", "AIIC"]
    );

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(impact.airborneBasis).toMatchObject({
      method: "dynamic_calculator_unsupported_output_guard",
      origin: "unsupported"
    });
  });

  it("keeps docs and current-gate aligned with the runtime owner and selected refresh", () => {
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
      "src/post-v1-wall-double-leaf-framed-porous-absorber-coverage-ratio-numeric-sensitivity-owner-contract.test.ts"
    );
  });
});
