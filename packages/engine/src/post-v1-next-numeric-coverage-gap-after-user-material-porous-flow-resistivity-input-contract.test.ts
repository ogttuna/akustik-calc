import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { LayerInput, MaterialDefinition, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS } from "./impact-estimate";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_user_material_porous_flow_resistivity_input_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const GAP_ACTION =
  "post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_user_material_porous_flow_resistivity_input_landed_no_runtime_selected_floor_user_material_impact_context_dynamic_stiffness_owner";
const GAP_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_USER_MATERIAL_POROUS_FLOW_RESISTIVITY_INPUT_PLAN_2026-06-12.md";

const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material impact context dynamic-stiffness owner";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_OWNER_PLAN_2026-06-12.md";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_impact_context_dynamic_stiffness_owner";

const GAP_COUNTERS = {
  candidateCount: 11,
  closedCompatibleAnchorDeltaRowsRechecked: 12,
  closedDefaultCatalogDoubleLeafRowsRechecked: 9,
  closedDirectFixedRowsRechecked: 24,
  closedUserMaterialExplicitRuntimeRowsRechecked: 3,
  closedUserMaterialMissingTopologyRowsRechecked: 4,
  closedUserMaterialPorousFlowRowsRechecked: 4,
  estimatedNextCalculableRequestShapes: 1,
  estimatedNextCalculableTargetOutputs: 2,
  estimatedNextRuntimeValuesMoved: 2,
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
      "Subtract compatible anchor-delta, direct-fixed, default-catalog double-leaf/framed, explicit user-material, missing-topology, and porous flow-resistivity lanes because those are closed or intentionally held at needs_input.",
    iteration: 1
  },
  {
    conclusion:
      "Re-probe arbitrary user-material scope across wall and floor routes: embedded floor impact dynamic stiffness already calculates, but context/manual dynamic stiffness on a custom visible underlay still does not feed the owned heavy floating-floor formula.",
    iteration: 2
  },
  {
    conclusion:
      "Select the floor user-material impact context dynamic-stiffness owner because it can move real Ln,w and DeltaLw runtime values for arbitrary custom floor stacks with explicit physical inputs, without source-row import or formula retune.",
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
  | "runtime_owner"
  | "source_research";

type NumericGapCandidate = {
  readonly currentFormulaInputsAvailable: boolean;
  readonly expectedNextCalculableRequestShapes: number;
  readonly expectedNextCalculableTargetOutputs: number;
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
const IMPACT_LAB_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const IMPACT_FIELD_OUTPUTS = ["L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const CUSTOM_HEAVY_CONCRETE_ID = "custom_floor_heavy_concrete";
const CUSTOM_UNDERLAY_ID = "custom_floor_resilient_underlay";
const CUSTOM_SCREED_ID = "custom_floor_screed";
const CUSTOM_TILE_ID = "custom_floor_tile";

const CUSTOM_HEAVY_FLOATING_FLOOR_STACK = [
  { floorRole: "floor_covering", materialId: CUSTOM_TILE_ID, thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: CUSTOM_SCREED_ID, thicknessMm: 30 },
  { floorRole: "resilient_layer", materialId: CUSTOM_UNDERLAY_ID, thicknessMm: 8 },
  { floorRole: "base_structure", materialId: CUSTOM_HEAVY_CONCRETE_ID, thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

type CustomUnderlayMode = "embedded_dynamic_stiffness" | "missing_dynamic_stiffness";

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function buildCustomFloorCatalog(mode: CustomUnderlayMode): readonly MaterialDefinition[] {
  return [
    ...getDefaultMaterialCatalog(),
    {
      acoustic: {
        behavior: "rigid_mass",
        notes: [],
        propertySourceStatus: "user_supplied"
      },
      category: "mass",
      densityKgM3: 2400,
      id: CUSTOM_HEAVY_CONCRETE_ID,
      name: "Custom Floor Heavy Concrete",
      tags: ["custom", "reinforced_concrete", "concrete", "heavy-base"]
    },
    {
      acoustic: {
        behavior: "resilient_layer",
        notes: [],
        propertySourceStatus: "user_supplied"
      },
      category: "support",
      densityKgM3: 650,
      id: CUSTOM_UNDERLAY_ID,
      impact:
        mode === "embedded_dynamic_stiffness"
          ? {
              dynamicStiffnessMNm3: 30
            }
          : undefined,
      name: "Custom Floor Resilient Underlay",
      tags: ["custom", "resilient", "impact"]
    },
    {
      acoustic: {
        behavior: "rigid_mass",
        notes: [],
        propertySourceStatus: "user_supplied"
      },
      category: "mass",
      densityKgM3: 2000,
      id: CUSTOM_SCREED_ID,
      name: "Custom Floor Screed",
      tags: ["custom", "floor", "mass"]
    },
    {
      acoustic: {
        behavior: "rigid_mass",
        notes: [],
        propertySourceStatus: "user_supplied"
      },
      category: "finish",
      densityKgM3: 2200,
      id: CUSTOM_TILE_ID,
      name: "Custom Floor Tile",
      tags: ["custom", "floor", "finish"]
    }
  ];
}

function calculateCustomFloor(input: {
  mode: CustomUnderlayMode;
  passContextDynamicStiffness?: boolean;
  targetOutputs?: readonly RequestedOutputId[];
}) {
  return calculateAssembly(CUSTOM_HEAVY_FLOATING_FLOOR_STACK, {
    calculator: "dynamic",
    catalog: buildCustomFloorCatalog(input.mode),
    floorImpactContext: input.passContextDynamicStiffness
      ? {
          loadBasisKgM2: 76,
          resilientLayerDynamicStiffnessMNm3: 30
        }
      : undefined,
    targetOutputs: input.targetOutputs ?? IMPACT_LAB_OUTPUTS
  });
}

function rankNumericCoverageCandidates(): readonly NumericGapCandidate[] {
  return [
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 1,
      expectedNextCalculableTargetOutputs: 2,
      expectedNextRuntimeValuesMoved: 2,
      id: SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/dynamic-calculator-floor-impact-dynamic-stiffness-contract.ts",
        "packages/engine/src/impact-estimate.ts",
        "packages/engine/src/impact-predictor-input.ts"
      ],
      nextActionMovesRuntimeValues: true,
      preservesBoundaryCorrectness: true,
      reason:
        "Custom floor stacks with explicit floor roles and manual/context resilientLayerDynamicStiffnessMNm3 should feed the same owned heavy floating-floor formula that already works when the value is embedded on the material.",
      requiredInputs: [
        "floorRole=base_structure",
        "floorRole=resilient_layer",
        "floorRole=floating_screed or floor_covering",
        "resilientLayerDynamicStiffnessMNm3",
        "loadBasisKgM2 or visible upper-load mass"
      ],
      score: 94,
      selected: true,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: SELECTED_NEXT_FILE,
      selectedNextPlanDocIfSelected: SELECTED_NEXT_PLAN_DOC,
      sliceKind: "runtime_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: IMPACT_LAB_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_impact_embedded_dynamic_stiffness_closed_lane",
      implementationEvidencePaths: [
        "packages/engine/src/impact-estimate.ts",
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-w-floor-impact-runtime-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "A custom resilient material that already stores impact.dynamicStiffnessMNm3 calculates Ln,w and DeltaLw through the heavy floating-floor estimate today.",
      requiredInputs: ["impact.dynamicStiffnessMNm3", "floor roles", "visible upper load"],
      score: 10,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "closed_lane",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: IMPACT_LAB_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_impact_missing_dynamic_stiffness_boundary_closed_lane",
      implementationEvidencePaths: [
        "packages/engine/src/dynamic-calculator-floor-impact-dynamic-stiffness-contract.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "When both material and context dynamic stiffness are missing, the route already asks for resilientLayerDynamicStiffnessMNm3 instead of guessing DeltaLw.",
      requiredInputs: ["resilientLayerDynamicStiffnessMNm3"],
      score: 9,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "closed_lane",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: IMPACT_LAB_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.double_leaf_framed.user_material_porous_flow_resistivity_closed_lane",
      implementationEvidencePaths: [PREVIOUS_COVERAGE_REFRESH_FILE],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "The just-landed coverage refresh freezes numeric user flow, explicit engineering-default flow, context-owned absorber flow, and missing-flow needs_input boundaries.",
      requiredInputs: ["flowResistivityPaSM2 or explicit engineering default"],
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
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.double_leaf_framed.user_material_route_input_closed_lane",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Explicit custom panel_leaf / porous_absorber / panel_leaf lab, field, and building requests already calculate when route topology and absorber properties are present.",
      requiredInputs: ["explicit double_leaf_framed topology", "numeric absorber properties"],
      score: 7,
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
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.double_leaf_framed.user_material_missing_topology_closed_lane",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-missing-topology-input-surface-owner-contract.test.ts"
      ],
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
      score: 6,
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
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.triple_leaf_user_material_runtime_promotion",
      implementationEvidencePaths: [
        "packages/engine/src/wall-triple-leaf-frequency-solver.ts",
        "packages/engine/src/dynamic-calculator-route-input-topology.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Triple-leaf user-material scope is still valuable, but it remains grouped-topology, owner-limit, and same-basis holdout gated before runtime widening.",
      requiredInputs: ["groupedTripleLeafTopology", "sameBasisHoldouts"],
      score: 63,
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
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.impact_field_building_context_adapter",
      implementationEvidencePaths: [
        "packages/engine/src/dynamic-calculator-floor-impact-field-context-contract.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Field/building impact outputs are important, but the context dynamic-stiffness lab owner is the smaller prerequisite that first produces the lab anchor for arbitrary custom floor stacks.",
      requiredInputs: ["impactFieldContext", "lab impact anchor"],
      score: 60,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "input_surface_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: IMPACT_FIELD_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
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
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "broad_source_crawl_for_user_material_floor_impact",
      implementationEvidencePaths: ["docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: false,
      reason:
        "Broad source crawling cannot cover arbitrary custom floor materials and is not the selected calculator-engine slice.",
      requiredInputs: ["none"],
      score: 3,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "source_research",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: IMPACT_LAB_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
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
    throw new Error(
      "Numeric gap after user-material porous flow-resistivity input must select floor user-material impact context dynamic stiffness ownership."
    );
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

describe("post-V1 next numeric coverage gap after user-material porous flow-resistivity input", () => {
  it("lands the no-runtime rerank and selects floor user-material impact context dynamic-stiffness ownership next", () => {
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

  it("ranks context dynamic stiffness above lower-readiness formula and non-calculator work", () => {
    const candidates = rankNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(GAP_COUNTERS.candidateCount);
    expect(ROI_ANALYSIS_ITERATIONS).toHaveLength(3);
    expect(selected).toMatchObject({
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 1,
      expectedNextCalculableTargetOutputs: 2,
      expectedNextRuntimeValuesMoved: 2,
      id: SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: true,
      preservesBoundaryCorrectness: true,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: SELECTED_NEXT_FILE,
      selectedNextPlanDocIfSelected: SELECTED_NEXT_PLAN_DOC,
      sliceKind: "runtime_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      touchesFrontendImplementationNow: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("wall.triple_leaf_user_material_runtime_promotion")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("floor.impact_field_building_context_adapter")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.double_leaf_budget_tightening_holdout")?.score ?? 0);
    expect(byId.get("floor.user_material_impact_embedded_dynamic_stiffness_closed_lane")).toMatchObject({
      selected: false,
      sliceKind: "closed_lane"
    });
    expect(byId.get("material_editor_ui_or_catalog_management")).toMatchObject({
      selected: false,
      sliceKind: "blocked_non_goal",
      touchesFrontendImplementationNow: true
    });
  });

  it("probes the custom floor dynamic-stiffness gap without weakening missing-input boundaries", () => {
    const embeddedDynamic = calculateCustomFloor({
      mode: "embedded_dynamic_stiffness",
      passContextDynamicStiffness: true
    });
    const contextOnlyDynamic = calculateCustomFloor({
      mode: "missing_dynamic_stiffness",
      passContextDynamicStiffness: true
    });
    const missingDynamic = calculateCustomFloor({
      mode: "missing_dynamic_stiffness"
    });

    expect(embeddedDynamic.impact).toMatchObject({
      basis: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS
    });
    expect(typeof embeddedDynamic.impact?.LnW).toBe("number");
    expect(typeof embeddedDynamic.impact?.DeltaLw).toBe("number");
    expect(embeddedDynamic.supportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);

    const contextOnlyGapStillOpen =
      contextOnlyDynamic.impact === null &&
      contextOnlyDynamic.supportedTargetOutputs.length === 0 &&
      contextOnlyDynamic.unsupportedTargetOutputs.includes("Ln,w") &&
      contextOnlyDynamic.unsupportedTargetOutputs.includes("DeltaLw");
    const contextOnlyFutureOwned =
      contextOnlyDynamic.impact?.basis === HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS &&
      contextOnlyDynamic.supportedTargetOutputs.includes("Ln,w") &&
      contextOnlyDynamic.supportedTargetOutputs.includes("DeltaLw");

    expect(contextOnlyGapStillOpen || contextOnlyFutureOwned).toBe(true);

    expect(missingDynamic.impact).toBeNull();
    expect(missingDynamic.supportedTargetOutputs).toEqual([]);
    expect(missingDynamic.unsupportedTargetOutputs).toEqual(["Ln,w", "DeltaLw"]);
    expect(missingDynamic.acousticAnswerBoundary).toMatchObject({
      missingPhysicalInputs: ["resilientLayerDynamicStiffnessMNm3"],
      origin: "needs_input",
      unsupportedOutputs: ["Ln,w", "DeltaLw"]
    });
  });

  it("ties docs and current gate runner to the rerank closeout and selected floor owner", () => {
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
      expect(content, path).toContain("candidateCount 11");
      expect(content, path).toContain("roiAnalysisIterations: 3");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 2");
      expect(content, path).toContain("estimatedNextCalculableRequestShapes: 1");
      expect(content, path).toContain("estimatedNextCalculableTargetOutputs: 2");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts"
    );
    expect(currentGateRunner).toContain(
      "src/post-v1-next-numeric-coverage-gap-after-user-material-porous-flow-resistivity-input-contract.test.ts"
    );
  });
});
