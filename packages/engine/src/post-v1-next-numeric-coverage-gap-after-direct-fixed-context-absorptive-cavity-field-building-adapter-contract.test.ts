import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
} from "./dynamic-airborne-gate-i-airborne-field-context";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_double_leaf_framed_direct_fixed_context_absorptive_cavity_field_building_adapter_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const GAP_ACTION =
  "post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_direct_fixed_context_absorptive_cavity_field_building_adapter_landed_no_runtime_selected_direct_fixed_a_weighted_field_building_owner";
const GAP_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_PLAN_2026-06-11.md";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall double-leaf/framed direct-fixed A-weighted field/building owner";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_A_WEIGHTED_FIELD_BUILDING_OWNER_PLAN_2026-06-11.md";
const SELECTED_CANDIDATE_ID =
  "wall.direct_fixed_double_leaf.a_weighted_field_building_owner";

const GATE_ER_BASE_CURVE_ID =
  "wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner";

const GAP_COUNTERS = {
  aWeightedOnlyMisroutedRowsRechecked: 2,
  aWeightedOnlyUnsupportedRowsRechecked: 4,
  candidateCount: 7,
  closedDirectFixedBaseFieldBuildingRowsRechecked: 6,
  closedDirectFixedLabRowsRechecked: 3,
  estimatedNextCorrectedRequestShapes: 2,
  estimatedNextNewCalculableRequestShapes: 4,
  estimatedNextRuntimeValuesMoved: 12,
  frontendImplementationFilesTouched: 0,
  immediateRuntimeValuesMoved: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  sourceRowsImported: 0
} as const;

const ROI_ANALYSIS_ITERATIONS = [
  {
    conclusion:
      "Subtract the closed direct-fixed lab Rw/STC/C/Ctr, base field/building R'w/Dn,w/DnT,w, surface parity, and coverage-only lanes before selecting new work.",
    iteration: 1
  },
  {
    conclusion:
      "The same Gate ER route already calculates direct-fixed Dn,A/DnT,A when base field/building metrics are requested, but A-weighted-only requests are unsupported for full/partial absorptive cavities and misrouted for empty direct-fixed cavities.",
    iteration: 2
  },
  {
    conclusion:
      "Select the direct-fixed A-weighted field/building owner next because it opens four currently unsupported A-only request shapes and corrects two already-calculable empty-cavity A-only shapes without source import or formula retune.",
    iteration: 3
  }
] as const;

type CandidateKind =
  | "accuracy_holdout"
  | "blocked_non_goal"
  | "closed_lane"
  | "formula_scope"
  | "route_input"
  | "route_metric_owner";

type NumericGapCandidate = {
  readonly currentValuesAvailableButUnsupported: boolean;
  readonly currentValuesMisrouted: boolean;
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

const A_WEIGHTED_OUTPUTS = ["Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_WITH_A_WEIGHTED_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];
const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const TWO_BOARD_CONTEXT_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const DIRECT_FIXED_EMPTY_CONTEXT: AirborneContext = {
  connectionType: "direct_fix",
  contextMode: "element_lab",
  studSpacingMm: 400,
  wallTopology: {
    cavity1AbsorptionClass: "none",
    cavity1DepthMm: 45,
    cavity1FillCoverage: "empty",
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "direct_fixed",
    topologyMode: "double_leaf_framed"
  }
};

const DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT: AirborneContext = {
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 1,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 45,
        depthMm: 45,
        id: "cavity-1",
        sealState: "sealed"
      }
    ]
  },
  connectionType: "direct_fix",
  contextMode: "element_lab",
  studSpacingMm: 400,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 45,
    cavity1FillCoverage: "full",
    sideALeafLayerIndices: [0],
    sideBLeafLayerIndices: [1],
    supportTopology: "direct_fixed",
    topologyMode: "double_leaf_framed"
  }
};

const DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT,
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 0.5,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 22.5,
        depthMm: 45,
        id: "cavity-1",
        sealState: "sealed"
      }
    ]
  },
  wallTopology: {
    ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT.wallTopology,
    cavity1FillCoverage: "partial"
  }
};

const DIRECT_FIXED_ABSORPTIVE_WITHOUT_FLOW: AirborneContext = {
  ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT,
  advancedWall: undefined
};

const DIRECT_FIXED_GATE_AY_PANEL_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT,
  advancedWall: {
    cavities: [
      {
        absorberCoverageRatio: 1,
        absorberFlowResistivityPaSM2: 15000,
        absorberThicknessMm: 45,
        depthMm: 45,
        id: "cavity-1",
        sealState: "sealed"
      }
    ],
    panels: [
      {
        criticalFrequencyHz: 2500,
        id: "panel-a",
        lossFactor: 0.03,
        materialClass: "gypsum_board",
        sequence: 1,
        surfaceMassKgM2: 10.6,
        thicknessMm: 12.5
      }
    ],
    wallSolverIntent: "advanced_source_absent_wall"
  }
};

const NON_DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT: AirborneContext = {
  ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT,
  connectionType: undefined,
  sharedTrack: "independent",
  studSpacingMm: 600,
  wallTopology: {
    ...DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT.wallTopology,
    cavity1DepthMm: 90,
    supportTopology: "independent_frames"
  }
};

const REQUIRED_DOCS = [
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

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function withFieldContext(context: AirborneContext): AirborneContext {
  return {
    ...context,
    contextMode: "field_between_rooms",
    panelHeightMm: 2500,
    panelWidthMm: 3000,
    receivingRoomRt60S: 0.5,
    receivingRoomVolumeM3: 50
  };
}

function withBuildingContext(context: AirborneContext): AirborneContext {
  return {
    ...context,
    buildingPredictionOutputBasis: "apparent_and_standardized",
    conservativeFlankingAssumption: "multi_path_conservative",
    contextMode: "building_prediction",
    flankingJunctionClass: "rigid_t_junction",
    junctionCouplingLengthM: 4.8,
    panelHeightMm: 2500,
    panelWidthMm: 3000,
    receivingRoomRt60S: 0.5,
    receivingRoomVolumeM3: 50,
    sourceRoomVolumeM3: 45
  };
}

function calculateWall(
  context: AirborneContext,
  targetOutputs: readonly RequestedOutputId[] = A_WEIGHTED_OUTPUTS
) {
  return calculateAssembly(TWO_BOARD_CONTEXT_STACK, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs
  });
}

function rankNumericCoverageCandidates(): readonly NumericGapCandidate[] {
  return [
    {
      currentValuesAvailableButUnsupported: true,
      currentValuesMisrouted: true,
      expectedNextRuntimeValuesMoved: 12,
      id: SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts",
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts",
        "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-coverage-refresh-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: true,
      preservesBoundaryCorrectness: true,
      reason:
        "Gate ER already owns the direct-fixed field/building curve and computes Dn,A/DnT,A companions when base metrics are requested; A-only requests need a metric owner so full/partial absorptive rows calculate and empty direct-fixed rows stop falling through a wrong single-leaf path.",
      requiredInputs: [
        "GateEO_direct_fixed_double_leaf_direct_separating_element_curve_owner",
        "GateER_direct_fixed_field_building_adapter_owner",
        "GateI_or_GateAR_context_owner",
        "ISO717-1_C_adapter_term",
        "sideALeafGroup",
        "sideBLeafGroup",
        "cavity1DepthMm",
        "supportTopology=direct_fixed",
        "connectionType=direct_fix",
        "supportSpacingMm",
        "absorberFlowResistivityPaSM2_when_absorptive"
      ],
      score: 97,
      selected: true,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: SELECTED_NEXT_FILE,
      selectedNextPlanDocIfSelected: SELECTED_NEXT_PLAN_DOC,
      sliceKind: "route_metric_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: A_WEIGHTED_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentValuesAvailableButUnsupported: false,
      currentValuesMisrouted: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.direct_fixed_double_leaf.base_field_building_closed_lane",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-owner-contract.test.ts",
        "apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-surface-parity.test.ts",
        "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-coverage-refresh-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Base field/building R'w, Dn,w, and DnT,w are closed for empty, full absorptive, and partial absorptive direct-fixed rows.",
      requiredInputs: ["none"],
      score: 11,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "closed_lane",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: FIELD_BUILDING_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentValuesAvailableButUnsupported: false,
      currentValuesMisrouted: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.direct_fixed_double_leaf.lab_closed_lane",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-contract.test.ts",
        "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-owner-coverage-refresh-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Direct-fixed lab Rw/STC/C/Ctr is closed for empty, full absorptive, and partial absorptive cavities and should not be reselected.",
      requiredInputs: ["none"],
      score: 10,
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
      currentValuesAvailableButUnsupported: false,
      currentValuesMisrouted: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.direct_fixed_double_leaf_budget_tightening_holdout",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-coverage-refresh-contract.test.ts",
        "docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_DIRECT_FIXED_CONTEXT_ABSORPTIVE_CAVITY_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-11.md"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Budget tightening is accuracy-positive but blocked until same-basis measured direct-fixed field/building holdouts exist.",
      requiredInputs: ["sameBasisMeasuredDirectFixedFieldBuildingHoldouts", "residualBudgetSplit"],
      score: 58,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "accuracy_holdout",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: FIELD_BUILDING_WITH_A_WEIGHTED_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentValuesAvailableButUnsupported: false,
      currentValuesMisrouted: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.non_direct_double_leaf_absorptive_formula_widening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-double-leaf-framed-context-absorptive-cavity-input-owner-contract.test.ts",
        "packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Non-direct absorptive formula widening remains valuable, but it needs separate family boundaries and does not correct the live A-only direct-fixed misroute.",
      requiredInputs: ["nonDirectSupportTopologyOwner", "frameCouplingOwner", "sameBasisHoldouts"],
      score: 55,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "formula_scope",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: FIELD_BUILDING_WITH_A_WEIGHTED_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentValuesAvailableButUnsupported: false,
      currentValuesMisrouted: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.double_leaf_route_input_surface_residual_after_direct_fixed_closeout",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-double-leaf-framed-route-input-runtime-widening-contract.test.ts",
        "apps/web/features/workbench/post-v1-wall-double-leaf-framed-route-input-runtime-widening-surface-parity.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Route-input surface work remains useful, but the current high-confidence gap is already inside an owned runtime route.",
      requiredInputs: ["explicitSideLayerGroups", "supportTopology", "supportSpacingMm", "absorberOwnership"],
      score: 49,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      selectedNextPlanDocIfSelected: null,
      sliceKind: "route_input",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: FIELD_BUILDING_WITH_A_WEIGHTED_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentValuesAvailableButUnsupported: false,
      currentValuesMisrouted: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "broad_source_crawl_or_report_ui_after_direct_fixed_closeout",
      implementationEvidencePaths: ["docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: false,
      reason:
        "Broad source crawling, report polish, auth/storage, generic UI work, and finite scenario packs do not improve the selected calculator route.",
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
    throw new Error("Numeric gap after direct-fixed field/building closeout must select the A-weighted owner.");
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

describe("post-V1 next numeric coverage gap after direct-fixed context absorptive cavity field/building adapter", () => {
  it("lands the no-runtime rerank and selects the direct-fixed A-weighted field/building owner next", () => {
    expect(summarizeNumericGap()).toMatchObject({
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

  it("ranks the direct-fixed A-weighted owner above closed lanes, holdouts, formula widening, route-input work, and non-goal work", () => {
    const candidates = rankNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(GAP_COUNTERS.candidateCount);
    expect(ROI_ANALYSIS_ITERATIONS).toHaveLength(3);
    expect(selected).toMatchObject({
      currentValuesAvailableButUnsupported: true,
      currentValuesMisrouted: true,
      expectedNextRuntimeValuesMoved: 12,
      id: SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: true,
      preservesBoundaryCorrectness: true,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: SELECTED_NEXT_FILE,
      selectedNextPlanDocIfSelected: SELECTED_NEXT_PLAN_DOC,
      sliceKind: "route_metric_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: A_WEIGHTED_OUTPUTS,
      touchesFrontendImplementationNow: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.direct_fixed_double_leaf_budget_tightening_holdout")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.non_direct_double_leaf_absorptive_formula_widening")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.double_leaf_route_input_surface_residual_after_direct_fixed_closeout")?.score ?? 0
    );
    expect(byId.get("wall.direct_fixed_double_leaf.base_field_building_closed_lane")).toMatchObject({
      selected: false,
      sliceKind: "closed_lane"
    });
    expect(byId.get("broad_source_crawl_or_report_ui_after_direct_fixed_closeout")).toMatchObject({
      preservesBoundaryCorrectness: false,
      selected: false,
      sliceKind: "blocked_non_goal"
    });
  });

  it("proves the selected A-weighted owner now moves the planned A-only values onto Gate ER", () => {
    const probes = [
      {
        context: withFieldContext(DIRECT_FIXED_EMPTY_CONTEXT),
        expected: { DnA: 24.9, DnTA: 27 },
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
      },
      {
        context: withBuildingContext(DIRECT_FIXED_EMPTY_CONTEXT),
        expected: { DnA: 24.9, DnTA: 27 },
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
      },
      {
        context: withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT),
        expected: { DnA: 28.9, DnTA: 31 },
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
      },
      {
        context: withBuildingContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT),
        expected: { DnA: 28.9, DnTA: 31 },
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
      },
      {
        context: withFieldContext(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT),
        expected: { DnA: 26.9, DnTA: 29 },
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
      },
      {
        context: withBuildingContext(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT),
        expected: { DnA: 26.9, DnTA: 29 },
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
      }
    ] as const;

    for (const probe of probes) {
      const result = calculateWall(probe.context);
      expect(result.supportedTargetOutputs).toEqual([...A_WEIGHTED_OUTPUTS]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.metrics).toMatchObject({
        estimatedDnADb: probe.expected.DnA,
        estimatedDnTADb: probe.expected.DnTA
      });
      expect(result.airborneBasis).toMatchObject({
        method: probe.method,
        origin: "family_physics_prediction"
      });
      expect(result.layerCombinationResolverTrace).toMatchObject({
        candidateKind: "field_building_adapter",
        runtimeBasisId: probe.method,
        supportedMetrics: [...A_WEIGHTED_OUTPUTS]
      });
    }
  });

  it("proves the same route already has the A-weighted numbers when base field/building metrics are requested", () => {
    const probes = [
      {
        context: withFieldContext(DIRECT_FIXED_EMPTY_CONTEXT),
        expected: { DnA: 24.9, DnTA: 27, DnTw: 28, DnW: 26, RwPrime: 25 },
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
      },
      {
        context: withBuildingContext(DIRECT_FIXED_EMPTY_CONTEXT),
        expected: { DnA: 24.9, DnTA: 27, DnTw: 28, DnW: 26, RwPrime: 25 },
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
      },
      {
        context: withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT),
        expected: { DnA: 28.9, DnTA: 31, DnTw: 32, DnW: 30, RwPrime: 29 },
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
      },
      {
        context: withBuildingContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT),
        expected: { DnA: 28.9, DnTA: 31, DnTw: 32, DnW: 30, RwPrime: 29 },
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
      },
      {
        context: withFieldContext(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT),
        expected: { DnA: 26.9, DnTA: 29, DnTw: 30, DnW: 28, RwPrime: 27 },
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
      },
      {
        context: withBuildingContext(DIRECT_FIXED_PARTIAL_ABSORPTIVE_CONTEXT),
        expected: { DnA: 26.9, DnTA: 29, DnTw: 30, DnW: 28, RwPrime: 27 },
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
      }
    ] as const;

    for (const probe of probes) {
      const result = calculateWall(probe.context, FIELD_BUILDING_WITH_A_WEIGHTED_OUTPUTS);
      expect(result.supportedTargetOutputs).toEqual([...FIELD_BUILDING_WITH_A_WEIGHTED_OUTPUTS]);
      expect(result.unsupportedTargetOutputs).toEqual([]);
      expect(result.metrics).toMatchObject({
        estimatedDnADb: probe.expected.DnA,
        estimatedDnTADb: probe.expected.DnTA,
        estimatedDnTwDb: probe.expected.DnTw,
        estimatedDnWDb: probe.expected.DnW,
        estimatedRwPrimeDb: probe.expected.RwPrime
      });
      expect(result.airborneBasis).toMatchObject({
        method: probe.method,
        origin: "family_physics_prediction"
      });
      expect(result.layerCombinationResolverTrace).toMatchObject({
        candidateKind: "field_building_adapter",
        runtimeBasisId: probe.method
      });
    }
  });

  it("keeps boundary rows out of the selected direct-fixed A-weighted work", () => {
    const missingFlow = calculateWall(withFieldContext(DIRECT_FIXED_ABSORPTIVE_WITHOUT_FLOW));
    const gateAyPanels = calculateWall(withFieldContext(DIRECT_FIXED_GATE_AY_PANEL_CONTEXT));
    const nonDirect = calculateWall(
      { ...NON_DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT, contextMode: "element_lab" },
      LAB_OUTPUTS
    );
    const astm = calculateWall(withFieldContext(DIRECT_FIXED_FULL_ABSORPTIVE_CONTEXT), ASTM_OUTPUTS);

    expect(missingFlow.supportedTargetOutputs).toEqual([]);
    expect(missingFlow.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      origin: "needs_input"
    });
    expect(gateAyPanels.supportedTargetOutputs).toEqual([]);
    expect(gateAyPanels.airborneBasis).toMatchObject({
      method: "gate_ay_advanced_wall_source_absent_direct_curve_runtime_corridor",
      origin: "unsupported"
    });
    expect(nonDirect.airborneBasis).not.toMatchObject({
      method: GATE_ER_BASE_CURVE_ID
    });
    expect(astm.supportedTargetOutputs).toEqual([]);
    expect(astm.unsupportedTargetOutputs).toEqual([...ASTM_OUTPUTS]);
  });

  it("ties candidate evidence, docs, and current-gate runner to the rerank closeout and selected owner", () => {
    for (const candidate of rankNumericCoverageCandidates()) {
      for (const path of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${candidate.id}:${path}`).toBe(true);
      }
    }

    for (const path of REQUIRED_DOCS) {
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
      "src/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-coverage-refresh-contract.test.ts"
    );
    expect(currentGateRunner).toContain(
      "src/post-v1-next-numeric-coverage-gap-after-direct-fixed-context-absorptive-cavity-field-building-adapter-contract.test.ts"
    );
  });
});
