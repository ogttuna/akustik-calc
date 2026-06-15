import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  AirborneContext,
  ImpactFieldContext,
  LayerInput,
  MaterialDefinition,
  RequestedOutputId
} from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import type { DynamicCalculatorFloorImpactContext } from "./dynamic-calculator-route-input-topology";
import { HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS } from "./impact-estimate";
import { LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS } from "./lightweight-concrete-family-runtime-constants";
import { getDefaultMaterialCatalog } from "./material-catalog";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_floor_user_material_impact_context_dynamic_stiffness_owner_landed_runtime_selected_coverage_refresh";

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_impact_context_dynamic_stiffness_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";
const PREVIOUS_COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_COVERAGE_REFRESH_PLAN_2026-06-12.md";

const GAP_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_dynamic_stiffness_landed_no_runtime_selected_floor_user_material_impact_context_field_only_adapter_owner";
const GAP_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_DYNAMIC_STIFFNESS_PLAN_2026-06-15.md";

const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material impact context field-only adapter owner";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_OWNER_PLAN_2026-06-15.md";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_impact_context_field_only_adapter_owner";

const GAP_COUNTERS = {
  candidateCount: 12,
  closedCompatibleAnchorDeltaRowsRechecked: 12,
  closedDefaultCatalogDoubleLeafRowsRechecked: 9,
  closedDirectFixedRowsRechecked: 24,
  closedFloorImpactContextDynamicStiffnessRowsRechecked: 6,
  closedFloorImpactMixedFieldRowsRechecked: 2,
  closedUserMaterialExplicitRuntimeRowsRechecked: 3,
  closedUserMaterialMissingTopologyRowsRechecked: 4,
  closedUserMaterialPorousFlowRowsRechecked: 4,
  estimatedNextCalculableRequestShapes: 1,
  estimatedNextCalculableTargetOutputs: 3,
  estimatedNextRuntimeValuesMoved: 3,
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
      "Subtract compatible anchor-delta, direct-fixed, default-catalog double-leaf/framed, explicit user-material, missing-topology, porous-flow, and floor impact dynamic-stiffness lanes because those are closed or intentionally held at needs_input.",
    iteration: 1
  },
  {
    conclusion:
      "Re-probe the just-opened custom floor impact context lane across mixed lab+field requests: the existing field adapter already calculates L'n,w / L'nT,w / L'nT,50 when a lab anchor output is also requested.",
    iteration: 2
  },
  {
    conclusion:
      "Re-probe field-only custom floor impact requests: the same physical inputs currently park L'n,w / L'nT,w / L'nT,50 because the custom context-owned lab anchor is not computed internally for the field-only selection path.",
    iteration: 3
  },
  {
    conclusion:
      "Select the floor user-material impact context field-only adapter owner because it unlocks real user-requested field impact outputs from an already-owned lab anchor and field adapter, without source-row import, formula retune, or ASTM aliasing.",
    iteration: 4
  }
] as const;

type CandidateKind =
  | "accuracy_holdout"
  | "blocked_non_goal"
  | "closed_lane"
  | "coverage_refresh"
  | "formula_scope"
  | "input_surface_owner"
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

const LAB_IMPACT_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];
const FIELD_IMPACT_OUTPUTS = ["L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const ASTM_IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

const CUSTOM_HEAVY_CONCRETE_ID = "custom_floor_heavy_concrete";
const CUSTOM_LOW_DENSITY_CONCRETE_ID = "custom_floor_low_density_concrete";
const CUSTOM_UNDERLAY_ID = "custom_floor_resilient_underlay";
const CUSTOM_SCREED_ID = "custom_floor_screed";
const CUSTOM_TILE_ID = "custom_floor_tile";

const FULL_FLOOR_IMPACT_CONTEXT = {
  loadBasisKgM2: 76,
  resilientLayerDynamicStiffnessMNm3: 30
} as const satisfies DynamicCalculatorFloorImpactContext;

const FULL_IMPACT_FIELD_CONTEXT = {
  ci50_2500Db: 3,
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
} as const satisfies ImpactFieldContext;

const AIRBORNE_FIELD_CONTEXT = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
} as const satisfies AirborneContext;

const CUSTOM_HEAVY_FLOATING_FLOOR_STACK = [
  { floorRole: "floor_covering", materialId: CUSTOM_TILE_ID, thicknessMm: 8 },
  { floorRole: "floating_screed", materialId: CUSTOM_SCREED_ID, thicknessMm: 30 },
  { floorRole: "resilient_layer", materialId: CUSTOM_UNDERLAY_ID, thicknessMm: 8 },
  { floorRole: "base_structure", materialId: CUSTOM_HEAVY_CONCRETE_ID, thicknessMm: 150 }
] as const satisfies readonly LayerInput[];

const CUSTOM_LOW_DENSITY_FLOOR_STACK = CUSTOM_HEAVY_FLOATING_FLOOR_STACK.map((layer) =>
  layer.materialId === CUSTOM_HEAVY_CONCRETE_ID
    ? { ...layer, materialId: CUSTOM_LOW_DENSITY_CONCRETE_ID }
    : layer
) as readonly LayerInput[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function customMaterial(input: {
  category: MaterialDefinition["category"];
  densityKgM3: number;
  id: string;
  name: string;
  tags: readonly string[];
}): MaterialDefinition {
  return {
    acoustic: {
      behavior: input.category === "support" ? "resilient_layer" : "rigid_mass",
      notes: [],
      propertySourceStatus: "user_supplied"
    },
    category: input.category,
    densityKgM3: input.densityKgM3,
    id: input.id,
    name: input.name,
    tags: [...input.tags]
  };
}

function buildCustomFloorCatalog(): readonly MaterialDefinition[] {
  return [
    ...getDefaultMaterialCatalog(),
    customMaterial({
      category: "mass",
      densityKgM3: 2400,
      id: CUSTOM_HEAVY_CONCRETE_ID,
      name: "Custom Floor Heavy Concrete",
      tags: ["custom", "reinforced_concrete", "concrete", "heavy-base"]
    }),
    customMaterial({
      category: "mass",
      densityKgM3: 1200,
      id: CUSTOM_LOW_DENSITY_CONCRETE_ID,
      name: "Custom Floor Low Density Concrete",
      tags: ["custom", "reinforced_concrete", "concrete", "heavy-base"]
    }),
    customMaterial({
      category: "support",
      densityKgM3: 650,
      id: CUSTOM_UNDERLAY_ID,
      name: "Custom Floor Resilient Underlay",
      tags: ["custom", "resilient", "impact"]
    }),
    customMaterial({
      category: "mass",
      densityKgM3: 2000,
      id: CUSTOM_SCREED_ID,
      name: "Custom Floor Screed",
      tags: ["custom", "floor", "mass"]
    }),
    customMaterial({
      category: "finish",
      densityKgM3: 2200,
      id: CUSTOM_TILE_ID,
      name: "Custom Floor Tile",
      tags: ["custom", "floor", "finish"]
    })
  ];
}

function calculateCustomFloor(input: {
  airborneContext?: AirborneContext | null;
  floorImpactContext?: DynamicCalculatorFloorImpactContext | null;
  impactFieldContext?: ImpactFieldContext | null;
  layers?: readonly LayerInput[];
  targetOutputs: readonly RequestedOutputId[];
}) {
  return calculateAssembly(input.layers ?? CUSTOM_HEAVY_FLOATING_FLOOR_STACK, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    catalog: buildCustomFloorCatalog(),
    floorImpactContext: input.floorImpactContext,
    impactFieldContext: input.impactFieldContext,
    targetOutputs: input.targetOutputs
  });
}

function rankNumericCoverageCandidates(): readonly NumericGapCandidate[] {
  return [
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 1,
      expectedNextCalculableTargetOutputs: 3,
      expectedNextRuntimeValuesMoved: 3,
      id: SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/dynamic-calculator-floor-impact-field-context-contract.ts",
        "packages/engine/src/impact-estimate.ts",
        "packages/engine/src/layer-combination-resolver-runtime-candidate-adapter-contract.test.ts",
        PREVIOUS_COVERAGE_REFRESH_FILE
      ],
      nextActionMovesRuntimeValues: true,
      preservesBoundaryCorrectness: true,
      reason:
        "The custom visible heavy floating-floor stack already has an owned context dynamic-stiffness lab anchor and field adapter; field-only requests should compute the lab anchor internally instead of requiring users to also request Ln,w.",
      requiredInputs: [
        "floorRole=base_structure",
        "floorRole=resilient_layer",
        "floorRole=floating_screed or floor_covering",
        "floorImpactContext.resilientLayerDynamicStiffnessMNm3",
        "floorImpactContext.loadBasisKgM2",
        "impactFieldContext.fieldKDb_or_guideMassRatio_or_directFlankingPaths",
        "impactFieldContext.receivingRoomVolumeM3 for L'nT,w",
        "impactFieldContext.ci50_2500Db for L'nT,50"
      ],
      score: 96,
      selected: true,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: SELECTED_NEXT_FILE,
      selectedNextPlanDocIfSelected: SELECTED_NEXT_PLAN_DOC,
      sliceKind: "runtime_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: FIELD_IMPACT_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_impact_context_mixed_field_adapter_closed_lane",
      implementationEvidencePaths: [
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/layer-combination-resolver-runtime-candidate-adapter-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Mixed Ln,w plus field requests already calculate L'n,w / L'nT,w / L'nT,50 from the custom context-owned lab anchor when impact field inputs are present.",
      requiredInputs: ["owned lab anchor", "impactFieldContext"],
      score: 20,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "closed_lane",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: [...LAB_IMPACT_OUTPUTS, ...FIELD_IMPACT_OUTPUTS],
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_impact_context_dynamic_stiffness_owner_closed_lane",
      implementationEvidencePaths: [
        PREVIOUS_OWNER_FILE,
        PREVIOUS_COVERAGE_REFRESH_FILE
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Context-owned dynamic stiffness and load basis now calculate Ln,w 50.3 and DeltaLw 24.3 for the custom heavy floating-floor stack.",
      requiredInputs: [
        "floorImpactContext.resilientLayerDynamicStiffnessMNm3",
        "floorImpactContext.loadBasisKgM2"
      ],
      score: 19,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "closed_lane",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: LAB_IMPACT_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_impact_missing_field_context_input_surface",
      implementationEvidencePaths: [
        "packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-y-floor-impact-field-context-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Missing field K, receiving-room volume, or low-frequency context should stay needs_input; this protects the selected runtime owner but should not be chosen before the ready field-only route.",
      requiredInputs: [
        "impactFieldContext.fieldKDb_or_guideMassRatio_or_directFlankingPaths",
        "impactFieldContext.receivingRoomVolumeM3",
        "impactFieldContext.ci50_2500Db"
      ],
      score: 81,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "input_surface_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: FIELD_IMPACT_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_low_density_floating_floor_formula_scope",
      implementationEvidencePaths: [
        "packages/engine/src/impact-estimate.ts",
        PREVIOUS_COVERAGE_REFRESH_FILE
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Low-density custom concrete tags remain outside the heavy concrete carrier route; useful future scope, but it needs a separate lightweight-carrier formula/evidence owner before runtime promotion.",
      requiredInputs: ["lightweight concrete carrier formula owner", "same-basis validation envelope"],
      score: 74,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "formula_scope",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: LAB_IMPACT_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.astm_iic_aiic_generic_alias_boundary",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh.ts",
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bv.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "ASTM IIC/AIIC remains metric-basis separated; generic ISO impact values must not be copied into ASTM ratings without exact ASTM E492/E1007/E989 curve ownership.",
      requiredInputs: ["ASTM impact band source or exact ASTM rating owner"],
      score: 70,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "input_surface_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ASTM_IMPACT_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.double_leaf_framed.user_material_route_input_closed_lane",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-owner-contract.test.ts",
        "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-route-input-coverage-refresh-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Explicit custom double-leaf/framed wall lab, field, and building requests already calculate through the landed route-input owner and refresh.",
      requiredInputs: ["explicit double_leaf_framed topology", "numeric absorber properties"],
      score: 18,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "closed_lane",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: [...WALL_LAB_OUTPUTS, ...WALL_FIELD_BUILDING_OUTPUTS],
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
        "Missing custom double-leaf wall topology now asks for explicit physical fields instead of guessing support topology.",
      requiredInputs: [
        "sideALeafGroup",
        "cavity1DepthMm",
        "sideBLeafGroup",
        "frameBridgeClass",
        "supportTopology",
        "supportSpacingMm"
      ],
      score: 17,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "closed_lane",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: WALL_LAB_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.double_leaf_framed.user_material_porous_flow_resistivity_closed_lane",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-owner-contract.test.ts",
        "packages/engine/src/post-v1-wall-double-leaf-framed-user-material-porous-flow-resistivity-input-coverage-refresh-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Numeric user flow, explicit engineering-default flow, and context-owned absorber flow are already protected by the landed porous flow-resistivity owner and refresh.",
      requiredInputs: ["flowResistivityPaSM2 or explicit engineering default"],
      score: 16,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "closed_lane",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: [...WALL_LAB_OUTPUTS, ...WALL_FIELD_BUILDING_OUTPUTS],
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
        "Triple-leaf user-material scope is valuable, but it still needs grouped-topology and same-basis owner work before runtime widening.",
      requiredInputs: ["groupedTripleLeafTopology", "sameBasisHoldouts"],
      score: 62,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "formula_scope",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: WALL_LAB_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "broad_source_crawl_for_floor_impact_field_holdouts",
      implementationEvidencePaths: ["docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: false,
      reason:
        "Field holdouts can tighten accuracy later, but broad source crawling is not the selected calculator-engine slice and does not unlock the ready field-only route.",
      requiredInputs: ["named same-stack field impact holdout target"],
      score: 4,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "source_research",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: FIELD_IMPACT_OUTPUTS,
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
        "Material-editor UI, auth/storage, reporting, and catalog management do not themselves improve calculator route ownership for this numeric gap.",
      requiredInputs: ["none"],
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: WALL_LAB_OUTPUTS,
      touchesFrontendImplementationNow: true
    }
  ];
}

function summarizeNumericGap() {
  const selected = rankNumericCoverageCandidates().find((candidate) => candidate.selected);
  if (!selected || selected.id !== SELECTED_CANDIDATE_ID) {
    throw new Error(
      "Numeric gap after floor user-material impact context dynamic stiffness must select the field-only adapter owner."
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

describe("post-V1 next numeric coverage gap after floor user-material impact context dynamic stiffness", () => {
  it("lands the no-runtime rerank and selects floor user-material impact context field-only adapter ownership next", () => {
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
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_REFRESH_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_REFRESH_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, GAP_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, GAP_PLAN_DOC_PATH))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);
  });

  it("ranks the field-only adapter owner above closed lanes, lower-readiness formula work, and non-calculator work", () => {
    const candidates = rankNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(GAP_COUNTERS.candidateCount);
    expect(ROI_ANALYSIS_ITERATIONS).toHaveLength(4);
    expect(selected).toMatchObject({
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 1,
      expectedNextCalculableTargetOutputs: 3,
      expectedNextRuntimeValuesMoved: 3,
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
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.user_material_impact_missing_field_context_input_surface")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.user_material_low_density_floating_floor_formula_scope")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("floor.astm_iic_aiic_generic_alias_boundary")?.score ?? 0
    );
    expect(byId.get("floor.user_material_impact_context_mixed_field_adapter_closed_lane")).toMatchObject({
      selected: false,
      sliceKind: "closed_lane"
    });
    expect(byId.get("material_editor_ui_or_catalog_management")).toMatchObject({
      selected: false,
      sliceKind: "blocked_non_goal",
      touchesFrontendImplementationNow: true
    });
  });

  it("probes the custom floor field-only gap while preserving the mixed field adapter and missing-input boundaries", () => {
    const mixedField = calculateCustomFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: FULL_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: FULL_IMPACT_FIELD_CONTEXT,
      targetOutputs: ["Ln,w", "DeltaLw", ...FIELD_IMPACT_OUTPUTS]
    });
    const fieldOnly = calculateCustomFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: FULL_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: FULL_IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_IMPACT_OUTPUTS
    });
    const missingFieldContext = calculateCustomFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: FULL_FLOOR_IMPACT_CONTEXT,
      targetOutputs: FIELD_IMPACT_OUTPUTS
    });
    const missingLabAnchor = calculateCustomFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      impactFieldContext: FULL_IMPACT_FIELD_CONTEXT,
      targetOutputs: FIELD_IMPACT_OUTPUTS
    });

    expect(mixedField.supportedTargetOutputs).toEqual([
      "Ln,w",
      "DeltaLw",
      "L'n,w",
      "L'nT,w",
      "L'nT,50"
    ]);
    expect(mixedField.unsupportedTargetOutputs).toEqual([]);
    expect(mixedField.impact).toMatchObject({
      CI50_2500: 3,
      DeltaLw: 24.3,
      LPrimeNT50: 52.9,
      LPrimeNTw: 49.9,
      LPrimeNW: 52.3,
      LnW: 50.3,
      metricBasis: {
        CI50_2500: "explicit_user_impact_ci50_2500_input",
        DeltaLw: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS,
        LPrimeNT50: "estimated_standardized_field_lpriment50_from_lprimentw_plus_ci50_2500",
        LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
        LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
        LnW: HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS
      }
    });

    const fieldOnlyGapStillOpen =
      fieldOnly.impact === null &&
      fieldOnly.supportedTargetOutputs.length === 0 &&
      FIELD_IMPACT_OUTPUTS.every((output) => fieldOnly.unsupportedTargetOutputs.includes(output));
    const fieldOnlyFutureOwned =
      fieldOnly.impact?.metricBasis?.LnW === HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS &&
      FIELD_IMPACT_OUTPUTS.every((output) => fieldOnly.supportedTargetOutputs.includes(output));

    expect(fieldOnlyGapStillOpen || fieldOnlyFutureOwned).toBe(true);
    if (fieldOnlyGapStillOpen) {
      expect(fieldOnly.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
        "floor.impact_field_context.field_building_adapter"
      );
    }

    expect(missingFieldContext.supportedTargetOutputs).toEqual([]);
    expect(missingFieldContext.unsupportedTargetOutputs).toEqual([...FIELD_IMPACT_OUTPUTS]);
    expect(missingFieldContext.acousticAnswerBoundary).toMatchObject({
      origin: "needs_input",
      route: "floor"
    });

    expect(missingLabAnchor.supportedTargetOutputs).toEqual([]);
    expect(missingLabAnchor.unsupportedTargetOutputs).toEqual([...FIELD_IMPACT_OUTPUTS]);
    expect(missingLabAnchor.impact).toBeNull();
  });

  it("keeps low-density custom concrete off the heavy-concrete basis and generic ASTM impact aliases outside the selected owner", () => {
    const lowDensityFieldOnly = calculateCustomFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: FULL_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: FULL_IMPACT_FIELD_CONTEXT,
      layers: CUSTOM_LOW_DENSITY_FLOOR_STACK,
      targetOutputs: FIELD_IMPACT_OUTPUTS
    });
    const astm = calculateCustomFloor({
      airborneContext: AIRBORNE_FIELD_CONTEXT,
      floorImpactContext: FULL_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: FULL_IMPACT_FIELD_CONTEXT,
      targetOutputs: ASTM_IMPACT_OUTPUTS
    });

    expect(lowDensityFieldOnly.supportedTargetOutputs).toEqual([...FIELD_IMPACT_OUTPUTS]);
    expect(lowDensityFieldOnly.unsupportedTargetOutputs).toEqual([]);
    expect(lowDensityFieldOnly.impact).toMatchObject({
      LPrimeNT50: 66.9,
      LPrimeNTw: 63.9,
      LPrimeNW: 66.3,
      LnW: 64.3,
      metricBasis: {
        LnW: LIGHTWEIGHT_CONCRETE_FAMILY_ESTIMATE_BASIS
      }
    });
    expect(lowDensityFieldOnly.impact?.basis).not.toBe(HEAVY_FLOATING_FLOOR_IMPACT_FORMULA_BASIS);

    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_IMPACT_OUTPUTS]);
    expect(astm.impact).toBeNull();
  });

  it("ties docs and current gate runner to the rerank closeout and selected field-only owner", () => {
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
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(GAP_ACTION);
      expect(content, path).toContain(GAP_FILE);
      expect(content, path).toContain(GAP_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain("candidateCount 12");
      expect(content, path).toContain("roiAnalysisIterations: 4");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 3");
      expect(content, path).toContain("estimatedNextCalculableRequestShapes: 1");
      expect(content, path).toContain("estimatedNextCalculableTargetOutputs: 3");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-user-material-impact-context-dynamic-stiffness-coverage-refresh-contract.test.ts"
    );
    expect(currentGateRunner).toContain(
      "src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-dynamic-stiffness-contract.test.ts"
    );
  });
});
