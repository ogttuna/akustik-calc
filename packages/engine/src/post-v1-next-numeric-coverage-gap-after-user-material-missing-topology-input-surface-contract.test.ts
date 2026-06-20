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

const PREVIOUS_OWNER_ACTION =
  "post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_wall_double_leaf_framed_user_material_missing_topology_input_surface_owner_landed_no_runtime_selected_next_numeric_coverage_gap";

const GAP_ACTION =
  "post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_user_material_missing_topology_input_surface_landed_no_runtime_selected_user_material_porous_flow_resistivity_input_owner";
const GAP_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_MISSING_TOPOLOGY_INPUT_SURFACE_PLAN_2026-06-12.md";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed user-material porous flow-resistivity input owner";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_OWNER_PLAN_2026-06-12.md";
const SELECTED_CANDIDATE_ID =
  "wall.double_leaf_framed.user_material_porous_flow_resistivity_input_owner";

const GAP_COUNTERS = {
  candidateCount: 10,
  closedCompatibleAnchorDeltaRowsRechecked: 12,
  closedDefaultCatalogDoubleLeafRowsRechecked: 9,
  closedDirectFixedRowsRechecked: 24,
  closedUserMaterialExplicitRuntimeRowsRechecked: 3,
  closedUserMaterialMissingTopologyRowsRechecked: 4,
  estimatedFollowOnRuntimeValuesProtectedAfterInputCapture: 12,
  estimatedNextAccuracyBoundaryRowsMoved: 2,
  estimatedNextRuntimeValuesMoved: 0,
  flowResistivityRiskRowsRechecked: 3,
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
      "Subtract compatible anchor-delta, direct-fixed, default-catalog double-leaf/framed, explicit user-material, and missing-topology input-surface lanes because those are already closed or deliberately held at needs_input.",
    iteration: 1
  },
  {
    conclusion:
      "Re-probe user-material calculator readiness from numeric behavior, not UI work: custom single-leaf mass law and explicit custom double-leaf/framed topology already calculate, while broad source crawling and material-editor UI do not improve the engine route.",
    iteration: 2
  },
  {
    conclusion:
      "Select the porous flow-resistivity input owner because the route requires absorberFlowResistivityOrDefault, yet a user-supplied porous absorber with no numeric flow value can still publish as if no default or extra uncertainty was used.",
    iteration: 3
  }
] as const;

type CandidateKind =
  | "accuracy_boundary_owner"
  | "accuracy_holdout"
  | "blocked_non_goal"
  | "closed_lane"
  | "formula_scope"
  | "input_surface_owner"
  | "route_input_owner"
  | "source_research";

type NumericGapCandidate = {
  readonly currentFormulaInputsAvailable: boolean;
  readonly expectedFollowOnRuntimeValuesProtectedAfterInputCapture: number;
  readonly expectedNextAccuracyBoundaryRowsMoved: number;
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
const IMPACT_OUTPUTS = ["Ln,w", "L'n,w"] as const satisfies readonly RequestedOutputId[];

const CUSTOM_PANEL_ID = "custom_panel_leaf";
const CUSTOM_ABSORBER_ID = "custom_porous_absorber";
const CUSTOM_SINGLE_LEAF_STACK = [{ materialId: CUSTOM_PANEL_ID, thicknessMm: 100 }] as const satisfies readonly LayerInput[];
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function buildCustomMaterialCatalog(
  flow: "engineering_default" | "missing_user_supplied" | "user_supplied"
): readonly MaterialDefinition[] {
  const absorberAcoustic =
    flow === "missing_user_supplied"
      ? {
          absorberClass: "porous_absorptive" as const,
          behavior: "porous_absorber" as const,
          notes: [],
          propertySourceStatus: "user_supplied" as const
        }
      : {
          absorberClass: "porous_absorptive" as const,
          behavior: "porous_absorber" as const,
          flowResistivityPaSM2: 15000,
          notes: [],
          propertySourceStatus: flow
        };

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
      acoustic: absorberAcoustic,
      category: "insulation",
      densityKgM3: 45,
      id: CUSTOM_ABSORBER_ID,
      name: "Custom Porous Absorber",
      tags: ["porous", "rockwool", "mineral_wool", "custom"]
    }
  ];
}

function calculateCustomDoubleLeaf(
  flow: "engineering_default" | "missing_user_supplied" | "user_supplied",
  targetOutputs: readonly RequestedOutputId[] = LAB_OUTPUTS
) {
  return calculateAssembly(CUSTOM_DOUBLE_LEAF_STACK, {
    airborneContext: EXPLICIT_DOUBLE_LEAF_CONTEXT,
    calculator: "dynamic",
    catalog: buildCustomMaterialCatalog(flow),
    targetOutputs
  });
}

function calculateCustomSingleLeaf() {
  return calculateAssembly(CUSTOM_SINGLE_LEAF_STACK, {
    airborneContext: { contextMode: "element_lab" },
    calculator: "dynamic",
    catalog: buildCustomMaterialCatalog("user_supplied"),
    targetOutputs: LAB_OUTPUTS
  });
}

function rankNumericCoverageCandidates(): readonly NumericGapCandidate[] {
  return [
    {
      currentFormulaInputsAvailable: true,
      expectedFollowOnRuntimeValuesProtectedAfterInputCapture: 12,
      expectedNextAccuracyBoundaryRowsMoved: 2,
      expectedNextRuntimeValuesMoved: 0,
      id: SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-input-contract.ts",
        "packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-solver-contract.ts",
        "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-formula-corridor.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "User-created porous absorbers need either a numeric flowResistivityPaSM2 or an explicit engineering-default posture before porous damping can be published with the right value and budget.",
      requiredInputs: ["flowResistivityPaSM2", "explicitEngineeringDefaultAdoption"],
      score: 96,
      selected: true,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: SELECTED_NEXT_FILE,
      selectedNextPlanDocIfSelected: SELECTED_NEXT_PLAN_DOC,
      sliceKind: "accuracy_boundary_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: [...LAB_OUTPUTS, ...FIELD_BUILDING_OUTPUTS],
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: true,
      expectedFollowOnRuntimeValuesProtectedAfterInputCapture: 0,
      expectedNextAccuracyBoundaryRowsMoved: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.double_leaf_framed.user_material_explicit_topology_closed_lane",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Explicit custom panel_leaf / porous_absorber / panel_leaf lab, field, and building requests are already calculable when the absorber has numeric flow evidence.",
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
      expectedFollowOnRuntimeValuesProtectedAfterInputCapture: 0,
      expectedNextAccuracyBoundaryRowsMoved: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.double_leaf_framed.user_material_missing_topology_closed_lane",
      implementationEvidencePaths: [PREVIOUS_OWNER_FILE],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "The missing-topology owner already keeps no-topology and partial-topology custom stacks at needs_input instead of guessing support details.",
      requiredInputs: [
        "sideALeafGroup",
        "cavity1DepthMm",
        "sideBLeafGroup",
        "frameBridgeClass",
        "supportTopology",
        "supportSpacingMm"
      ],
      score: 8,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "closed_lane",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: LAB_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: true,
      expectedFollowOnRuntimeValuesProtectedAfterInputCapture: 0,
      expectedNextAccuracyBoundaryRowsMoved: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.single_leaf.user_material_mass_law_closed_lane",
      implementationEvidencePaths: [
        "packages/engine/src/layer-combination-resolver-single-leaf-mass-law-banded-runtime-corridor-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Custom single-leaf dense or panel materials already calculate through the mass-law source-absent route from density and thickness.",
      requiredInputs: ["densityKgM3", "thicknessMm"],
      score: 7,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "closed_lane",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: LAB_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: true,
      expectedFollowOnRuntimeValuesProtectedAfterInputCapture: 0,
      expectedNextAccuracyBoundaryRowsMoved: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.double_leaf_framed.silent_user_material_flow_default",
      implementationEvidencePaths: [
        "packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-solver-contract.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: false,
      reason:
        "Silently treating a user-supplied porous absorber with no flow value as complete would keep overstating damping confidence across arbitrary user materials.",
      requiredInputs: ["guessedFlowResistivityPaSM2"],
      score: 1,
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
      expectedFollowOnRuntimeValuesProtectedAfterInputCapture: 0,
      expectedNextAccuracyBoundaryRowsMoved: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.triple_leaf_user_material_runtime_promotion",
      implementationEvidencePaths: [
        "packages/engine/src/wall-triple-leaf-frequency-solver.ts",
        "packages/engine/src/dynamic-calculator-route-input-topology.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Triple-leaf user-material scope is valuable but still needs grouped topology, owner limits, and same-basis holdout posture before runtime widening.",
      requiredInputs: ["groupedTripleLeafTopology", "sameBasisHoldouts"],
      score: 62,
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
      expectedFollowOnRuntimeValuesProtectedAfterInputCapture: 0,
      expectedNextAccuracyBoundaryRowsMoved: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_impact_dynamic_stiffness_owner",
      implementationEvidencePaths: [
        "packages/engine/src/impact-estimate.ts",
        "packages/engine/src/dynamic-calculator-floor-impact-dynamic-stiffness-contract.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "User-material impact scope matters, but it is a separate floor route and lower immediate ROI than fixing the wall user-material route's own required precision input.",
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
      expectedFollowOnRuntimeValuesProtectedAfterInputCapture: 0,
      expectedNextAccuracyBoundaryRowsMoved: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.double_leaf_budget_tightening_holdout",
      implementationEvidencePaths: [
        "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Budget tightening would improve accuracy, but it remains holdout-gated and should not be inferred from source-absent formula outputs.",
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
      expectedFollowOnRuntimeValuesProtectedAfterInputCapture: 0,
      expectedNextAccuracyBoundaryRowsMoved: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "broad_source_crawl_for_user_material_assemblies",
      implementationEvidencePaths: ["docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: false,
      reason:
        "Broad source crawling cannot cover arbitrary user-entered materials and is not the selected calculator-engine slice.",
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
      expectedFollowOnRuntimeValuesProtectedAfterInputCapture: 0,
      expectedNextAccuracyBoundaryRowsMoved: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "material_editor_ui_or_catalog_management",
      implementationEvidencePaths: ["docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: false,
      reason:
        "Material-editor UI and catalog-management work are parallel-agent territory and do not themselves change calculator physics.",
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
    throw new Error("Numeric gap after missing-topology input surface must select porous flow-resistivity ownership.");
  }

  return {
    counters: GAP_COUNTERS,
    landedGate: GAP_ACTION,
    noRuntimeValueMovement: true,
    planDocPath: GAP_PLAN_DOC_PATH,
    previousOwner: {
      selectedNextAction: GAP_ACTION,
      selectedNextFile: GAP_FILE,
      selectionStatus: PREVIOUS_OWNER_STATUS
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

describe("post-V1 next numeric coverage gap after user-material missing-topology input surface", () => {
  it("lands the no-runtime rerank and selects porous flow-resistivity input ownership next", () => {
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

    expect(existsSync(join(REPO_ROOT, PREVIOUS_OWNER_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, GAP_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, GAP_PLAN_DOC_PATH))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);
  });

  it("ranks the flow-resistivity boundary above lower-readiness formula and non-calculator work", () => {
    const candidates = rankNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(GAP_COUNTERS.candidateCount);
    expect(ROI_ANALYSIS_ITERATIONS).toHaveLength(3);
    expect(selected).toMatchObject({
      currentFormulaInputsAvailable: true,
      expectedFollowOnRuntimeValuesProtectedAfterInputCapture: 12,
      expectedNextAccuracyBoundaryRowsMoved: 2,
      expectedNextRuntimeValuesMoved: 0,
      id: SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: SELECTED_NEXT_FILE,
      selectedNextPlanDocIfSelected: SELECTED_NEXT_PLAN_DOC,
      sliceKind: "accuracy_boundary_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      touchesFrontendImplementationNow: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("wall.triple_leaf_user_material_runtime_promotion")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("floor.user_material_impact_dynamic_stiffness_owner")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.double_leaf_budget_tightening_holdout")?.score ?? 0);
    expect(byId.get("wall.double_leaf_framed.silent_user_material_flow_default")).toMatchObject({
      preservesBoundaryCorrectness: false,
      selected: false,
      sliceKind: "blocked_non_goal"
    });
    expect(byId.get("material_editor_ui_or_catalog_management")).toMatchObject({
      selected: false,
      sliceKind: "blocked_non_goal",
      touchesFrontendImplementationNow: true
    });
  });

  it("probes the closed user-material routes and the selected porous-flow risk without freezing the future owner outcome", () => {
    const singleLeaf = calculateCustomSingleLeaf();
    const explicitUserFlow = calculateCustomDoubleLeaf("user_supplied");
    const engineeringDefaultFlow = calculateCustomDoubleLeaf("engineering_default");
    const missingUserFlow = calculateCustomDoubleLeaf("missing_user_supplied");

    expect(singleLeaf.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(singleLeaf.airborneBasis?.method).toContain("single_leaf_mass_law");

    expect(explicitUserFlow.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(explicitUserFlow.metrics).toMatchObject({
      estimatedCDb: -1,
      estimatedCtrDb: -6.1,
      estimatedRwDb: 46,
      estimatedStc: 46
    });
    expect(explicitUserFlow.airborneBasis).toMatchObject({
      errorBudgetDb: 6,
      method: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      origin: "family_physics_prediction",
      propertyDefaults: []
    });
    expect(explicitUserFlow.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_FORMULA_CORRIDOR_BASIS,
      selectedCandidateId: LAYER_COMBINATION_RESOLVER_DOUBLE_LEAF_FRAMED_WALL_BANDED_RUNTIME_CORRIDOR_SELECTED_CANDIDATE_ID
    });

    expect(engineeringDefaultFlow.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(engineeringDefaultFlow.metrics).toMatchObject({
      estimatedRwDb: 45,
      estimatedStc: 45
    });
    expect(engineeringDefaultFlow.airborneBasis).toMatchObject({
      errorBudgetDb: 7,
      propertyDefaults: [
        {
          field: "porousFill.flowResistivityPaSM2",
          source: "engineering_default"
        }
      ]
    });

    const missingFlowNeedsInput = missingUserFlow.airborneBasis?.origin === "needs_input";
    const missingFlowPublishesWithoutDefaultDisclosure =
      missingUserFlow.supportedTargetOutputs.length > 0 &&
      (missingUserFlow.airborneBasis?.propertyDefaults ?? []).length === 0;

    expect(missingFlowNeedsInput || missingFlowPublishesWithoutDefaultDisclosure).toBe(true);
  });

  it("ties docs and current gate runner to the rerank closeout and selected flow-resistivity owner", () => {
    for (const candidate of rankNumericCoverageCandidates()) {
      for (const path of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${candidate.id}:${path}`).toBe(true);
      }
    }

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(content, path).toContain(PREVIOUS_OWNER_FILE);
      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(GAP_ACTION);
      expect(content, path).toContain(GAP_FILE);
      expect(content, path).toContain(GAP_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain("candidateCount 10");
      expect(content, path).toContain("roiAnalysisIterations: 3");
      expect(content, path).toContain("estimatedNextAccuracyBoundaryRowsMoved: 2");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 0");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts"
    );
    expect(currentGateRunner).toContain(
      "src/post-v1-next-numeric-coverage-gap-after-user-material-missing-topology-input-surface-contract.test.ts"
    );
  });
});
