import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID
} from "./post-v1-wall-compatible-anchor-delta";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_compatible_anchor_delta_a_weighted_field_building_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap_after_a_weighted_field_building";

const GAP_ACTION = "post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-a-weighted-field-building-contract.test.ts";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_a_weighted_field_building_landed_no_runtime_selected_compatible_anchor_delta_building_dn_a_owner";
const PLAN_DOC_PATH =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_A_WEIGHTED_FIELD_BUILDING_PLAN_2026-06-10.md";

const SELECTED_NEXT_ACTION = "post_v1_wall_compatible_anchor_delta_building_dn_a_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-owner-contract.test.ts";
const SELECTED_NEXT_LABEL = "post-V1 wall compatible anchor-delta building Dn,A owner";
const SELECTED_CANDIDATE_ID = "wall.compatible_anchor_delta.building_dn_a_owner";

const GAP_COUNTERS = {
  accuracyHoldoutCandidatesEvaluated: 1,
  buildingDnAUnsupportedRowsRechecked: 2,
  candidateCount: 6,
  closedAWeightedRowsRechecked: 4,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextRuntimeValuesMoved: 2,
  formulaScopeCandidatesEvaluated: 1,
  frontendImplementationFilesTouched: 0,
  immediateRuntimeValuesMoved: 0,
  routeInputCandidatesEvaluated: 1,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  sourceRowsImported: 0
} as const;

const ROI_ANALYSIS_ITERATIONS = [
  {
    conclusion:
      "Subtract the closed compatible anchor-delta Rw, field/building base, lab companion, one-side lab companion, A-weighted field, and building DnT,A lanes before selecting any new work.",
    iteration: 1
  },
  {
    conclusion:
      "The only same-route value still computed but unsupported is building Dn,A for the paired and one-side Knauf 416889 compatible anchor-delta building route.",
    iteration: 2
  },
  {
    conclusion:
      "Select the building Dn,A owner next because it can move two bounded runtime values without source import, formula retune, frontend work, or broad source crawl.",
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
  readonly sliceKind: CandidateKind;
  readonly sourceRowsImportedNow: boolean;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementationNow: boolean;
};

const BUILDING_DN_A_OUTPUT = ["Dn,A"] as const satisfies readonly RequestedOutputId[];
const BUILDING_DN_T_A_OUTPUT = ["DnT,A"] as const satisfies readonly RequestedOutputId[];
const FIELD_A_WEIGHTED_OUTPUTS = ["Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const ASTM_BOUNDARY_OUTPUTS = ["Dn,A", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const BUILDING_DN_A_OWNER_WARNING =
  "Compatible anchor-delta A-weighted field/building owner active: DynEcho used the same shifted direct curve and calculated ISO 717 C adapter term with the owned Gate I / Gate AR route. Field Dn,A / DnT,A and building Dn,A / DnT,A are calculated route values.";

const EXACT_LSF_LAB_STACK = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  ...EXACT_LSF_LAB_STACK,
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_PLUS_OUTER_BOARD_END = [
  ...EXACT_LSF_LAB_STACK,
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const NON_SELECTED_COMPATIBLE_ANCHOR_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const EXACT_LSF_FIELD_CONTEXT: AirborneContext = {
  ...EXACT_LSF_LAB_CONTEXT,
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55
};

const EXACT_LSF_BUILDING_CONTEXT: AirborneContext = {
  ...EXACT_LSF_LAB_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 48
};

const EXACT_LSF_BUILDING_MISSING_BASIS_CONTEXT: AirborneContext = {
  ...EXACT_LSF_BUILDING_CONTEXT,
  buildingPredictionOutputBasis: undefined
};

const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SYSTEM_MAP.md",
  PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function rankNumericCoverageCandidates(): readonly NumericGapCandidate[] {
  return [
    {
      currentValuesAvailableButUnsupported: true,
      expectedNextRuntimeValuesMoved: 2,
      id: SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/post-v1-wall-compatible-anchor-delta.ts",
        "packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-adapter-owner-contract.test.ts",
        "packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-coverage-refresh-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: true,
      preservesBoundaryCorrectness: true,
      reason:
        "The Gate AR compatible anchor-delta building route already carries paired and one-side Dn,A values, but they remain unsupported behind an explicit separate-owner warning.",
      requiredInputs: [
        "exactReducedStackSourceRow:Rw",
        "compatibleExteriorBoardDelta",
        "GateARBuildingPredictionBasis",
        "buildingPredictionOutputBasis=apparent_and_standardized",
        "partitionAreaM2_or_panelWidthHeight",
        "sourceRoomVolumeM3",
        "receivingRoomVolumeM3",
        "receivingRoomRt60S",
        "flankingJunctionClass",
        "junctionCouplingLengthM",
        "ISO717-1_C_adapter_term"
      ],
      score: 91,
      selected: true,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: SELECTED_NEXT_FILE,
      sliceKind: "route_metric_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: BUILDING_DN_A_OUTPUT,
      touchesFrontendImplementationNow: false
    },
    {
      currentValuesAvailableButUnsupported: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.compatible_anchor_delta_a_weighted_field_and_building_dnt_a_closed_lane",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-adapter-owner-contract.test.ts",
        "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-surface-parity.test.ts",
        "packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-coverage-refresh-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Field Dn,A/DnT,A and building DnT,A are closed by owner, surface parity, and coverage refresh; reselecting them would not expand calculator scope.",
      requiredInputs: ["none"],
      score: 12,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_lane",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: FIELD_A_WEIGHTED_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentValuesAvailableButUnsupported: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.generic_non_knauf_a_weighted_building_formula_widening",
      implementationEvidencePaths: [
        "packages/engine/src/layer-combination-resolver-registry.ts",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-after-one-side-lab-companion-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Wider non-Knauf A-weighted formula coverage is valuable, but it needs owned family anchors or holdouts before promoting runtime values.",
      requiredInputs: [
        "nonKnaufMeasuredAWeightedHoldout",
        "boardFamilyMassAndStiffness",
        "sameBasisFieldOrBuildingCurve",
        "explicitUncertaintyBudget"
      ],
      score: 62,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "formula_scope",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: FIELD_A_WEIGHTED_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentValuesAvailableButUnsupported: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.double_leaf_route_input_surface_residual_after_a_weighted_closeout",
      implementationEvidencePaths: [
        "packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts",
        "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-surface-parity.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Route-input surface work still matters, but it does not beat the already-computed same-route building Dn,A residual.",
      requiredInputs: ["wallTopology", "studSpacingMm", "explicitSideLayerGroups", "resilientBarSideCount"],
      score: 54,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "route_input",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "R'w", "Dn,w", "DnT,w"],
      touchesFrontendImplementationNow: false
    },
    {
      currentValuesAvailableButUnsupported: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.compatible_anchor_delta_a_weighted_budget_tightening_holdout",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-adapter-owner-contract.test.ts",
        "packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-coverage-refresh-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Accuracy tightening is real but blocked until same-basis measured field/building A-weighted holdouts exist for the paired and one-side Knauf variants.",
      requiredInputs: ["sameBasisMeasuredAWeightedHoldouts", "residualBudgetSplit"],
      score: 49,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_holdout",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: FIELD_A_WEIGHTED_OUTPUTS,
      touchesFrontendImplementationNow: false
    },
    {
      currentValuesAvailableButUnsupported: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "broad_source_crawl_or_report_ui_after_a_weighted_closeout",
      implementationEvidencePaths: ["docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: false,
      reason:
        "Broad source crawling, report polish, auth/storage, and generic UI work do not improve current calculator scope or accuracy.",
      requiredInputs: ["none"],
      score: 0,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: [],
      touchesFrontendImplementationNow: false
    }
  ];
}

function summarizeNumericGap() {
  const selected = rankNumericCoverageCandidates().find((candidate) => candidate.selected);
  if (!selected || selected.id !== SELECTED_CANDIDATE_ID) {
    throw new Error("Numeric gap after A-weighted field/building must select the building Dn,A owner.");
  }

  return {
    counters: GAP_COUNTERS,
    landedGate: GAP_ACTION,
    noRuntimeValueMovement: true,
    planDocPath: PLAN_DOC_PATH,
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
    selectionStatus: GAP_STATUS
  };
}

function calculateBuildingDnAProbe(layers: readonly LayerInput[]) {
  return calculateAssembly(layers, {
    airborneContext: EXACT_LSF_BUILDING_CONTEXT,
    calculator: "dynamic",
    targetOutputs: BUILDING_DN_A_OUTPUT
  });
}

describe("post-V1 next numeric coverage gap after A-weighted field/building", () => {
  it("lands the no-runtime rerank and selects the compatible anchor-delta building Dn,A owner next", () => {
    expect(summarizeNumericGap()).toMatchObject({
      counters: GAP_COUNTERS,
      landedGate: GAP_ACTION,
      noRuntimeValueMovement: true,
      planDocPath: PLAN_DOC_PATH,
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
      selectionStatus: GAP_STATUS
    });

    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_REFRESH_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, GAP_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, PLAN_DOC_PATH))).toBe(true);
  });

  it("ranks building Dn,A above closed lanes, wider formula scope, route-input work, and accuracy holdouts", () => {
    const candidates = rankNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(GAP_COUNTERS.candidateCount);
    expect(ROI_ANALYSIS_ITERATIONS).toHaveLength(3);
    expect(selected).toMatchObject({
      currentValuesAvailableButUnsupported: true,
      expectedNextRuntimeValuesMoved: 2,
      id: SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: true,
      preservesBoundaryCorrectness: true,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: SELECTED_NEXT_FILE,
      sliceKind: "route_metric_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: BUILDING_DN_A_OUTPUT,
      touchesFrontendImplementationNow: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.generic_non_knauf_a_weighted_building_formula_widening")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.double_leaf_route_input_surface_residual_after_a_weighted_closeout")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.compatible_anchor_delta_a_weighted_budget_tightening_holdout")?.score ?? 0
    );
    expect(byId.get("wall.compatible_anchor_delta_a_weighted_field_and_building_dnt_a_closed_lane")).toMatchObject({
      selected: false,
      sliceKind: "closed_lane"
    });
    expect(byId.get("broad_source_crawl_or_report_ui_after_a_weighted_closeout")).toMatchObject({
      preservesBoundaryCorrectness: false,
      selected: false,
      sliceKind: "blocked_non_goal"
    });
  });

  it("proves paired and one-side building Dn,A are now supported after the selected owner landed", () => {
    const paired = calculateBuildingDnAProbe(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES);
    const oneSide = calculateBuildingDnAProbe(EXACT_LSF_PLUS_OUTER_BOARD_END);

    expect(paired.supportedTargetOutputs).toEqual(BUILDING_DN_A_OUTPUT);
    expect(paired.unsupportedTargetOutputs).toEqual([]);
    expect(paired.metrics).toMatchObject({
      estimatedDnADb: 49.5,
      estimatedDnTADb: 51.9,
      estimatedDnTwDb: 53,
      estimatedDnWDb: 51,
      estimatedRwPrimeDb: 50
    });
    expect(paired.airborneBasis).toMatchObject({
      anchorSourceId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID,
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      origin: "family_physics_prediction"
    });
    expect(paired.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: BUILDING_DN_A_OUTPUT,
      valuePins: expect.arrayContaining([{ metric: "Dn,A", value: 49.5 }])
    });
    expect(paired.warnings).toContain(BUILDING_DN_A_OWNER_WARNING);
    expect(paired.warnings).not.toEqual(
      expect.arrayContaining([expect.stringContaining("kept Dn,A out")])
    );

    expect(oneSide.supportedTargetOutputs).toEqual(BUILDING_DN_A_OUTPUT);
    expect(oneSide.unsupportedTargetOutputs).toEqual([]);
    expect(oneSide.metrics).toMatchObject({
      estimatedDnADb: 48,
      estimatedDnTADb: 50.4,
      estimatedDnTwDb: 51,
      estimatedDnWDb: 49,
      estimatedRwPrimeDb: 49
    });
    expect(oneSide.airborneBasis).toMatchObject({
      anchorSourceId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LSF_SOURCE_ID,
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
    });
    expect(oneSide.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
      supportedMetrics: BUILDING_DN_A_OUTPUT,
      valuePins: expect.arrayContaining([{ metric: "Dn,A", value: 48 }])
    });
    expect(oneSide.warnings).toContain(BUILDING_DN_A_OWNER_WARNING);
    expect(oneSide.warnings).not.toEqual(
      expect.arrayContaining([expect.stringContaining("kept Dn,A out")])
    );
  });

  it("keeps closed A-weighted field/building DnT,A lanes and boundary rows out of the new selection", () => {
    const pairedField = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_A_WEIGHTED_OUTPUTS
    });
    const pairedBuildingDnTA = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_DN_T_A_OUTPUT
    });
    const labAWeighted = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_A_WEIGHTED_OUTPUTS
    });
    const missingBasis = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_MISSING_BASIS_CONTEXT,
      calculator: "dynamic",
      targetOutputs: BUILDING_DN_A_OUTPUT
    });
    const nonKnauf = calculateAssembly(NON_SELECTED_COMPATIBLE_ANCHOR_STACK, {
      airborneContext: EXACT_LSF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_A_WEIGHTED_OUTPUTS
    });
    const astmBoundary = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ASTM_BOUNDARY_OUTPUTS
    });

    expect(pairedField.supportedTargetOutputs).toEqual(FIELD_A_WEIGHTED_OUTPUTS);
    expect(pairedField.unsupportedTargetOutputs).toEqual([]);
    expect(pairedField.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(pairedField.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_A_WEIGHTED_FIELD_BUILDING_ADAPTER_WARNING);

    expect(pairedBuildingDnTA.supportedTargetOutputs).toEqual(BUILDING_DN_T_A_OUTPUT);
    expect(pairedBuildingDnTA.unsupportedTargetOutputs).toEqual([]);
    expect(pairedBuildingDnTA.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);

    expect(labAWeighted.supportedTargetOutputs).toEqual([]);
    expect(labAWeighted.unsupportedTargetOutputs).toEqual(FIELD_A_WEIGHTED_OUTPUTS);

    expect(missingBasis.supportedTargetOutputs).toEqual([]);
    expect(missingBasis.unsupportedTargetOutputs).toEqual(BUILDING_DN_A_OUTPUT);
    expect(missingBasis.airborneBasis).toMatchObject({
      method: "dynamic_calculator_route_input_contract_missing_physical_fields",
      missingPhysicalInputs: ["buildingPredictionOutputBasis"],
      origin: "needs_input"
    });

    expect(nonKnauf.supportedTargetOutputs).toEqual([]);
    expect(nonKnauf.unsupportedTargetOutputs).toEqual(FIELD_A_WEIGHTED_OUTPUTS);

    expect(astmBoundary.supportedTargetOutputs).toEqual(BUILDING_DN_A_OUTPUT);
    expect(astmBoundary.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
  });

  it("ties candidates to implementation evidence and keeps docs/current gate aligned", () => {
    for (const candidate of rankNumericCoverageCandidates()) {
      for (const path of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${candidate.id}:${path}`).toBe(true);
      }
    }

    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(GAP_ACTION);
      expect(content, path).toContain(GAP_FILE);
      expect(content, path).toContain(GAP_STATUS);
      expect(content, path).toContain(PLAN_DOC_PATH);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL.toLowerCase());
      expect(content, path).toContain("roiAnalysisIterations: 3");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 2");
      expect(content, path).toContain("immediateRuntimeValuesMoved: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("building dn,a");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(GAP_FILE.replace("packages/engine/", ""));
  });
});
