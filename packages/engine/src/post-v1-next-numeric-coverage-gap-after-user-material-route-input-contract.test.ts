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
  "post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_user_material_route_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const GAP_ACTION =
  "post_v1_next_numeric_coverage_gap_after_user_material_route_input_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_user_material_route_input_landed_no_runtime_selected_user_material_missing_topology_input_surface_owner";
const GAP_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_ROUTE_INPUT_PLAN_2026-06-12.md";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed user-material missing-topology input-surface owner";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_MISSING_TOPOLOGY_INPUT_SURFACE_OWNER_PLAN_2026-06-12.md";
const SELECTED_CANDIDATE_ID =
  "wall.double_leaf_framed.user_material_missing_topology_input_surface_owner";

const GAP_COUNTERS = {
  candidateCount: 9,
  closedDirectFixedRowsRechecked: 24,
  closedUserMaterialBoundaryRowsRechecked: 4,
  closedUserMaterialRuntimeRowsRechecked: 3,
  estimatedFollowOnRuntimeValuesMovedAfterInputCapture: 12,
  estimatedNextMissingInputRequestShapes: 3,
  estimatedNextRuntimeValuesMoved: 0,
  frontendImplementationFilesTouched: 0,
  immediateRuntimeValuesMoved: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const ROI_ANALYSIS_ITERATIONS = [
  {
    conclusion:
      "Subtract the explicit user-material double-leaf/framed lab, field, and building lane because it now calculates through the owned formula route when physical topology inputs are present.",
    iteration: 1
  },
  {
    conclusion:
      "Reject silent support-topology defaults, finite custom-material source packs, and material-editor UI because they either violate needs_input boundaries or do not make the calculator own more physics.",
    iteration: 2
  },
  {
    conclusion:
      "Select the missing-topology input-surface owner because many user-material panel_leaf / porous_absorber / panel_leaf stacks are one route-input step away from the already-live formula, and asking for the exact missing physical fields is higher confidence than widening formulas or crawling sources.",
    iteration: 3
  }
] as const;

type CandidateKind =
  | "accuracy_holdout"
  | "blocked_non_goal"
  | "closed_lane"
  | "formula_scope"
  | "input_surface_owner"
  | "route_input_owner"
  | "source_research";

type NumericGapCandidate = {
  readonly currentFormulaInputsAvailable: boolean;
  readonly expectedFollowOnRuntimeValuesMovedAfterInputCapture: number;
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
const IMPACT_OUTPUTS = ["Ln,w", "L'n,w"] as const satisfies readonly RequestedOutputId[];

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

const MISSING_TOPOLOGY_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  GAP_PLAN_DOC_PATH,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateCustomWall(context: AirborneContext, targetOutputs: readonly RequestedOutputId[]) {
  return calculateAssembly(CUSTOM_DOUBLE_LEAF_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    catalog: CUSTOM_MATERIAL_CATALOG,
    targetOutputs
  });
}

function rankNumericCoverageCandidates(): readonly NumericGapCandidate[] {
  return [
    {
      currentFormulaInputsAvailable: false,
      expectedFollowOnRuntimeValuesMovedAfterInputCapture: 12,
      expectedNextRuntimeValuesMoved: 0,
      id: SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-coverage-refresh-contract.test.ts",
        "packages/engine/src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts",
        "packages/engine/src/dynamic-calculator-route-input-topology.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "The live runtime already calculates user-material double-leaf/framed stacks once explicit topology is supplied; the highest-confidence gap is to own the missing-input surface for leaf groups, cavity depth, bridge class, support topology, and support spacing without guessing them.",
      requiredInputs: [
        "sideALeafGroup",
        "cavity1DepthMm",
        "sideBLeafGroup",
        "frameBridgeClass",
        "supportTopology",
        "supportSpacingMm"
      ],
      score: 94,
      selected: true,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: SELECTED_NEXT_FILE,
      selectedNextPlanDocIfSelected: SELECTED_NEXT_PLAN_DOC,
      sliceKind: "input_surface_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: [...LAB_OUTPUTS, ...FIELD_BUILDING_OUTPUTS],
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: true,
      expectedFollowOnRuntimeValuesMovedAfterInputCapture: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.double_leaf_framed.user_material_explicit_topology_closed_lane",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Explicit custom panel_leaf / porous_absorber / panel_leaf lab, field, and building requests are already calculable by the landed owner.",
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
      expectedFollowOnRuntimeValuesMovedAfterInputCapture: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.double_leaf_framed.user_material_auto_support_default_runtime",
      implementationEvidencePaths: [
        "docs/calculator/POST_V1_THICK_BOARD_AUTO_FAMILY_BOUNDARY_SAFETY_PLAN_2026-06-09.md"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: false,
      reason:
        "Silently defaulting support topology or support spacing would publish values for physically different double-leaf constructions and would violate the thick-board boundary guard.",
      requiredInputs: ["guessedSupportTopology", "guessedSupportSpacingMm"],
      score: 2,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: [...LAB_OUTPUTS, ...FIELD_BUILDING_OUTPUTS],
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedFollowOnRuntimeValuesMovedAfterInputCapture: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.triple_leaf_user_material_runtime_promotion",
      implementationEvidencePaths: [
        "packages/engine/src/wall-triple-leaf-frequency-solver.ts",
        "packages/engine/src/dynamic-calculator-route-input-topology.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Triple-leaf user-material support can be valuable, but it needs grouped topology and separate calibration boundaries before runtime widening.",
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
      expectedFollowOnRuntimeValuesMovedAfterInputCapture: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_impact_dynamic_stiffness_owner",
      implementationEvidencePaths: [
        "packages/engine/src/impact-estimate.ts",
        "packages/engine/src/impact-predictor-input.ts",
        "packages/engine/src/dynamic-calculator-floor-impact-dynamic-stiffness-contract.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "User-material impact is important, but it is a separate floor route that needs floor roles, dynamic stiffness, and load basis ownership rather than the just-opened wall user-material route.",
      requiredInputs: ["floorRole", "dynamicStiffnessMNm3", "loadBasisKgM2"],
      score: 58,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "route_input_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: IMPACT_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedFollowOnRuntimeValuesMovedAfterInputCapture: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.double_leaf_budget_tightening_holdout",
      implementationEvidencePaths: [
        "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Budget tightening would improve accuracy, but it remains blocked until same-basis measured holdouts exist.",
      requiredInputs: ["sameBasisMeasuredHoldouts", "residualBudgetOwner"],
      score: 57,
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
      expectedFollowOnRuntimeValuesMovedAfterInputCapture: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.user_material_astm_iic_aiic_aliasing",
      implementationEvidencePaths: ["packages/engine/src/target-output-support-contract.test.ts"],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: false,
      reason:
        "ASTM/IIC/AIIC aliases cannot be promoted from ISO wall formula outputs without an owned metric basis.",
      requiredInputs: ["ownedASTMBasis"],
      score: 6,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ASTM_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedFollowOnRuntimeValuesMovedAfterInputCapture: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "broad_source_crawl_for_user_material_assemblies",
      implementationEvidencePaths: ["docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: false,
      reason:
        "A broad source crawl would not solve arbitrary user-entered materials; exact rows remain preferred evidence but are not the product.",
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
      expectedFollowOnRuntimeValuesMovedAfterInputCapture: 0,
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
      targetMetrics: LAB_OUTPUTS,
      touchesFrontendImplementationNow: true
    }
  ];
}

function summarizeNumericGap() {
  const selected = rankNumericCoverageCandidates().find((candidate) => candidate.selected);
  if (!selected || selected.id !== SELECTED_CANDIDATE_ID) {
    throw new Error("Numeric gap after user-material route input must select the missing-topology input surface.");
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

describe("post-V1 next numeric coverage gap after user-material route input", () => {
  it("lands the no-runtime rerank and selects missing-topology input-surface ownership next", () => {
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

  it("ranks the missing-topology input surface above unsafe defaults, source crawling, and lower-readiness formulas", () => {
    const candidates = rankNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(GAP_COUNTERS.candidateCount);
    expect(ROI_ANALYSIS_ITERATIONS).toHaveLength(3);
    expect(selected).toMatchObject({
      currentFormulaInputsAvailable: false,
      expectedFollowOnRuntimeValuesMovedAfterInputCapture: 12,
      expectedNextRuntimeValuesMoved: 0,
      id: SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: SELECTED_NEXT_FILE,
      selectedNextPlanDocIfSelected: SELECTED_NEXT_PLAN_DOC,
      sliceKind: "input_surface_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      touchesFrontendImplementationNow: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("wall.triple_leaf_user_material_runtime_promotion")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("floor.user_material_impact_dynamic_stiffness_owner")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.double_leaf_budget_tightening_holdout")?.score ?? 0);
    expect(byId.get("wall.double_leaf_framed.user_material_auto_support_default_runtime")).toMatchObject({
      preservesBoundaryCorrectness: false,
      selected: false,
      sliceKind: "blocked_non_goal"
    });
    expect(byId.get("material_editor_ui_or_catalog_management")).toMatchObject({
      touchesFrontendImplementationNow: true,
      selected: false,
      sliceKind: "blocked_non_goal"
    });
  });

  it("keeps the closed explicit custom-material route calculable while missing topology stays needs_input", () => {
    const explicitLab = calculateCustomWall(EXPLICIT_DOUBLE_LEAF_CONTEXT, LAB_OUTPUTS);
    const explicitField = calculateCustomWall(FIELD_CONTEXT, FIELD_BUILDING_OUTPUTS);
    const missingTopology = calculateCustomWall(MISSING_TOPOLOGY_CONTEXT, LAB_OUTPUTS);

    expect(explicitLab.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(explicitLab.unsupportedTargetOutputs).toEqual([]);
    expect(explicitLab.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(explicitLab.airborneBasis).toMatchObject({
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      origin: "family_physics_prediction"
    });
    expect(explicitLab.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    });

    expect(explicitField.supportedTargetOutputs).toEqual([...FIELD_BUILDING_OUTPUTS]);
    expect(explicitField.unsupportedTargetOutputs).toEqual([]);
    expect(explicitField.metrics).toMatchObject({
      estimatedDnADb: 39.5,
      estimatedDnTADb: 41.9,
      estimatedDnTwDb: 43,
      estimatedDnWDb: 41,
      estimatedRwPrimeDb: 40
    });

    expect(missingTopology.supportedTargetOutputs).toEqual([]);
    expect(missingTopology.unsupportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(missingTopology.airborneBasis).toMatchObject({
      method: "acoustic_calculator_answer_engine_v1_flat_double_leaf_missing_topology",
      missingPhysicalInputs: [
        "sideALeafGroup",
        "cavity1DepthMm",
        "sideBLeafGroup",
        "frameBridgeClass",
        "supportTopology",
        "supportSpacingMm"
      ],
      origin: "needs_input"
    });
    expect(missingTopology.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: null,
      selectedCandidateId: "generic.required_input_owner.needs_input_boundary",
      supportBucket: "needs_input"
    });
  });

  it("ties docs and current gate runner to the rerank closeout and selected input-surface owner", () => {
    for (const candidate of rankNumericCoverageCandidates()) {
      for (const path of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${candidate.id}:${path}`).toBe(true);
      }
    }

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(GAP_ACTION);
      expect(content, path).toContain(GAP_FILE);
      expect(content, path).toContain(GAP_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain("roiAnalysisIterations: 3");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 0");
      expect(content, path).toContain("estimatedFollowOnRuntimeValuesMovedAfterInputCapture: 12");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-user-material-route-input-coverage-refresh-contract.test.ts"
    );
    expect(currentGateRunner).toContain(
      "src/post-v1-next-numeric-coverage-gap-after-user-material-route-input-contract.test.ts"
    );
  });
});
