import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
  LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
} from "./layer-combination-resolver-double-leaf-framed-wall-banded-runtime-constants";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const GAP_ACTION =
  "post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-a-weighted-field-building-contract.test.ts";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_direct_fixed_a_weighted_field_building_landed_no_runtime_selected_user_material_double_leaf_route_input_owner";
const GAP_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_PLAN_2026-06-12.md";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_user_material_route_input_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed user-material route-input owner";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_ROUTE_INPUT_OWNER_PLAN_2026-06-12.md";
const SELECTED_CANDIDATE_ID =
  "wall.double_leaf_framed.user_material_route_input_owner";

const GAP_COUNTERS = {
  candidateCount: 8,
  closedDirectFixedAWeightedRowsRechecked: 6,
  closedDirectFixedBaseAndLabRowsRechecked: 9,
  closedNonDirectDoubleLeafRowsRechecked: 9,
  estimatedNextCalculableRequestShapes: 3,
  estimatedNextRuntimeValuesMoved: 12,
  frontendImplementationFilesTouched: 0,
  immediateRuntimeValuesMoved: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  sourceRowsImported: 0,
  userMaterialBoundaryRowsRechecked: 3
} as const;

const ROI_ANALYSIS_ITERATIONS = [
  {
    conclusion:
      "Subtract direct-fixed lab Rw/STC/C/Ctr, base field/building R'w/Dn,w/DnT,w, and A-weighted Dn,A/DnT,A because the owner, surface, and coverage refresh chain already closed them.",
    iteration: 1
  },
  {
    conclusion:
      "Subtract non-direct explicit double-leaf/framed lab, field, building, and A-weighted lanes because the banded formula corridor plus Gate I/Gate AR already calculate them for default catalog materials.",
    iteration: 2
  },
  {
    conclusion:
      "Select the user-material route-input owner because a user-supplied panel_leaf / porous_absorber catalog stack has the physical inputs needed for the same double-leaf/framed formula route but was still parked or screened when resolver and solver code lost catalog ownership.",
    iteration: 3
  }
] as const;

type CandidateKind =
  | "accuracy_holdout"
  | "blocked_non_goal"
  | "closed_lane"
  | "formula_scope"
  | "route_input_owner"
  | "source_research";

type NumericGapCandidate = {
  readonly currentFormulaInputsAvailable: boolean;
  readonly expectedNextRuntimeValuesMoved: number;
  readonly id: string;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeValues: boolean;
  readonly preservesBoundaryCorrectness: boolean;
  readonly reason: string;
  readonly requiredInputs: readonly string[];
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly selectedNextPlanDocIfSelected: string | null;
  readonly sliceKind: CandidateKind;
  readonly sourceRowsImportedNow: boolean;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementationNow: boolean;
};

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const DEFAULT_DOUBLE_LEAF_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 90 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const CUSTOM_PANEL_ID = "custom_panel_leaf";
const CUSTOM_ABSORBER_ID = "custom_porous_absorber";
const CUSTOM_DOUBLE_LEAF_STACK = [
  { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 },
  { materialId: CUSTOM_ABSORBER_ID, thicknessMm: 90 },
  { materialId: CUSTOM_PANEL_ID, thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const CUSTOM_MATERIAL_CATALOG: readonly MaterialDefinition[] = [
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
      flowResistivityPaSM2: 15000,
      notes: [],
      propertySourceStatus: "user_supplied"
    },
    category: "insulation",
    densityKgM3: 45,
    id: CUSTOM_ABSORBER_ID,
    name: "Custom Porous Absorber",
    tags: ["porous", "rockwool", "mineral_wool", "custom"]
  }
] as const;

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

const FIELD_CONTEXT: AirborneContext = {
  ...EXPLICIT_DOUBLE_LEAF_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateWall(
  layers: readonly LayerInput[],
  context: AirborneContext,
  targetOutputs: readonly RequestedOutputId[],
  catalog?: readonly MaterialDefinition[]
) {
  return calculateAssembly(layers, {
    airborneContext: context,
    calculator: "dynamic",
    catalog,
    targetOutputs
  });
}

function rankNumericCoverageCandidates(): readonly NumericGapCandidate[] {
  return [
    {
      currentFormulaInputsAvailable: true,
      expectedNextRuntimeValuesMoved: 12,
      id: SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts",
        "packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-input-contract.ts",
        "packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-solver-contract.ts"
      ],
      nextActionMovesRuntimeValues: true,
      preservesBoundaryCorrectness: true,
      reason:
        "The user supplied density, panel_leaf behavior, porous_absorber behavior, absorber class, flow resistivity, leaf groups, cavity depth, support topology, and support spacing. The existing double-leaf/framed formula can calculate it once catalog ownership reaches resolver and solver contracts.",
      requiredInputs: [
        "customMaterialCatalog",
        "densityKgM3",
        "acoustic.behavior=panel_leaf",
        "acoustic.behavior=porous_absorber",
        "flowResistivityPaSM2",
        "sideALeafGroup",
        "cavity1LayerIndices",
        "sideBLeafGroup",
        "cavity1DepthMm",
        "supportTopology",
        "supportSpacingMm"
      ],
      score: 98,
      selected: true,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: SELECTED_NEXT_FILE,
      selectedNextPlanDocIfSelected: SELECTED_NEXT_PLAN_DOC,
      sliceKind: "route_input_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: [...LAB_OUTPUTS, ...FIELD_BUILDING_OUTPUTS],
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.direct_fixed_double_leaf.lab_base_and_a_weighted_closed_lane",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Direct-fixed lab, base field/building, and A-weighted field/building are closed by owner and coverage refresh.",
      requiredInputs: ["none"],
      score: 8,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "closed_lane",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: [...LAB_OUTPUTS, ...FIELD_BUILDING_OUTPUTS],
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.non_direct_double_leaf_default_catalog_closed_lane",
      implementationEvidencePaths: [
        "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Default-catalog gypsum/rockwool double-leaf stacks already calculate lab, field, building, and A-weighted metrics through the existing route.",
      requiredInputs: ["none"],
      score: 9,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "closed_lane",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: [...LAB_OUTPUTS, ...FIELD_BUILDING_OUTPUTS],
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.triple_leaf_user_material_runtime_promotion",
      implementationEvidencePaths: [
        "packages/engine/src/wall-triple-leaf-frequency-solver.ts",
        "packages/engine/src/dynamic-calculator-route-input-topology.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Triple-leaf custom-material support is valuable but needs separate grouped topology and calibration boundaries before runtime promotion.",
      requiredInputs: ["groupedTripleLeafTopology", "sameBasisHoldouts"],
      score: 61,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "formula_scope",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: LAB_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_impact_dynamic_stiffness_owner",
      implementationEvidencePaths: [
        "packages/engine/src/impact-predictor-input.ts",
        "packages/engine/src/dynamic-calculator-floor-impact-dynamic-stiffness-contract.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Custom floor impact materials can be high ROI later, but dynamic stiffness and floor-role inputs are a separate route from the current wall double-leaf gap.",
      requiredInputs: ["floorRole", "dynamicStiffnessMNm3", "loadBasisKgM2"],
      score: 55,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "route_input_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Ln,w"],
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.double_leaf_budget_tightening_holdout",
      implementationEvidencePaths: [
        "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Budget tightening is accuracy-positive but blocked until same-basis measured holdouts exist.",
      requiredInputs: ["sameBasisMeasuredHoldouts", "residualBudgetOwner"],
      score: 58,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "accuracy_holdout",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: LAB_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "broad_source_crawl_for_custom_material_assemblies",
      implementationEvidencePaths: ["docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: false,
      reason:
        "Broad source crawling would not unlock arbitrary user-entered materials; exact rows remain preferred evidence but are not the product.",
      requiredInputs: ["none"],
      score: 3,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "source_research",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: LAB_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "material_editor_ui_or_catalog_management",
      implementationEvidencePaths: ["docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: false,
      reason:
        "Material-editor UI work is useful but parallel-agent territory and does not by itself make the engine calculate more combinations.",
      requiredInputs: ["none"],
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ASTM_OUTPUTS,
      touchesFrontendImplementationNow: false
    }
  ];
}

function summarizeNumericGap() {
  const selected = rankNumericCoverageCandidates().find((candidate) => candidate.selected);
  if (!selected || selected.id !== SELECTED_CANDIDATE_ID) {
    throw new Error("Numeric gap after direct-fixed A-weighted closeout must select user-material route input ownership.");
  }

  return {
    counters: GAP_COUNTERS,
    landedGate: GAP_ACTION,
    noRuntimeValueMovement: true,
    planDocPath: GAP_PLAN_DOC_PATH,
    previousCoverageRefresh: {
      selectedNextAction: GAP_ACTION,
      selectedNextFile: GAP_FILE,
      selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
    },
    roiAnalysisIterations: ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: selected.id,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: GAP_STATUS
  };
}

describe("post-V1 next numeric coverage gap after direct-fixed A-weighted field/building", () => {
  it("lands the no-runtime rerank and selects user-material double-leaf route input ownership next", () => {
    expect(summarizeNumericGap()).toMatchObject({
      counters: GAP_COUNTERS,
      landedGate: GAP_ACTION,
      noRuntimeValueMovement: true,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: GAP_STATUS
    });

    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_REFRESH_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, GAP_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, GAP_PLAN_DOC_PATH))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);
  });

  it("ranks the user-material route-input owner above closed lanes, holdouts, source crawling, and UI work", () => {
    const candidates = rankNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(GAP_COUNTERS.candidateCount);
    expect(ROI_ANALYSIS_ITERATIONS).toHaveLength(3);
    expect(selected).toMatchObject({
      currentFormulaInputsAvailable: true,
      expectedNextRuntimeValuesMoved: 12,
      id: SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: true,
      preservesBoundaryCorrectness: true,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: SELECTED_NEXT_FILE,
      selectedNextPlanDocIfSelected: SELECTED_NEXT_PLAN_DOC,
      sliceKind: "route_input_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      touchesFrontendImplementationNow: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("wall.triple_leaf_user_material_runtime_promotion")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.double_leaf_budget_tightening_holdout")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("broad_source_crawl_for_custom_material_assemblies")?.score ?? 0);
    expect(byId.get("material_editor_ui_or_catalog_management")).toMatchObject({
      preservesBoundaryCorrectness: false,
      selected: false,
      sliceKind: "blocked_non_goal"
    });
  });

  it("proves closed default-catalog double-leaf rows and the selected custom-material route are distinct", () => {
    const defaultResult = calculateWall(DEFAULT_DOUBLE_LEAF_STACK, EXPLICIT_DOUBLE_LEAF_CONTEXT, LAB_OUTPUTS);
    const customLabResult = calculateWall(
      CUSTOM_DOUBLE_LEAF_STACK,
      EXPLICIT_DOUBLE_LEAF_CONTEXT,
      LAB_OUTPUTS,
      CUSTOM_MATERIAL_CATALOG
    );
    const customFieldResult = calculateWall(
      CUSTOM_DOUBLE_LEAF_STACK,
      FIELD_CONTEXT,
      FIELD_BUILDING_OUTPUTS,
      CUSTOM_MATERIAL_CATALOG
    );
    const unknownCustomResult = calculateWall(CUSTOM_DOUBLE_LEAF_STACK, EXPLICIT_DOUBLE_LEAF_CONTEXT, LAB_OUTPUTS);

    expect(defaultResult.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      origin: "family_physics_prediction"
    });
    expect(defaultResult.metrics.estimatedRwDb).toBe(45);

    expect(customLabResult.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(customLabResult.unsupportedTargetOutputs).toEqual([]);
    expect(customLabResult.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      origin: "family_physics_prediction"
    });
    expect(customLabResult.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    });

    expect(customFieldResult.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(customFieldResult.unsupportedTargetOutputs).toEqual([]);
    expect(customFieldResult.layerCombinationResolverTrace).toMatchObject({
      selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter"
    });

    expect(unknownCustomResult.supportedTargetOutputs).toEqual([]);
    expect(unknownCustomResult.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(unknownCustomResult.warnings.join("\n")).toContain("unknown material");
  });

  it("ties docs and current gate runner to the rerank closeout and selected owner", () => {
    for (const candidate of rankNumericCoverageCandidates()) {
      for (const path of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${candidate.id}:${path}`).toBe(true);
      }
    }

    const requiredDocs = [
      "AGENTS.md",
      "README.md",
      "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
      "docs/calculator/CURRENT_STATE.md",
      "docs/calculator/NEXT_AGENT_BRIEF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/README.md",
      "docs/calculator/SYSTEM_MAP.md",
      GAP_PLAN_DOC_PATH,
      SELECTED_NEXT_PLAN_DOC
    ] as const;

    for (const path of requiredDocs) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(GAP_ACTION);
      expect(content, path).toContain(GAP_FILE);
      expect(content, path).toContain(GAP_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain("roiAnalysisIterations: 3");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 12");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts"
    );
    expect(currentGateRunner).toContain(
      "src/post-v1-next-numeric-coverage-gap-after-direct-fixed-a-weighted-field-building-contract.test.ts"
    );
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts"
    );
  });
});
