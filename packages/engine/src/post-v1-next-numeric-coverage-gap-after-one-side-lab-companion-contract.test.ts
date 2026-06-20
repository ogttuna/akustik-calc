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
import {
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_FIELD_BUILDING_ADAPTER_WARNING,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID
} from "./post-v1-wall-compatible-anchor-delta";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap_after_one_side_lab_companion";

const GAP_ACTION = "post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-one-side-lab-companion-contract.test.ts";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_one_side_lab_companion_landed_no_runtime_selected_compatible_anchor_delta_a_weighted_owner";
const PLAN_DOC_PATH =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_ONE_SIDE_LAB_COMPANION_PLAN_2026-06-10.md";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_compatible_anchor_delta_a_weighted_field_building_adapter_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-a-weighted-field-building-adapter-owner-contract.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall compatible anchor-delta A-weighted field/building adapter owner";
const SELECTED_CANDIDATE_ID =
  "wall.compatible_anchor_delta.a_weighted_field_building_adapter_owner";

const GAP_COUNTERS = {
  accuracyHoldoutCandidatesEvaluated: 1,
  candidateCount: 6,
  closedCompatibleAnchorDeltaRowsRechecked: 4,
  estimatedNextCalculableRequestShapes: 4,
  estimatedNextRuntimeValuesMoved: 6,
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
      "Subtract the closed compatible anchor-delta direct Rw, field/building R'w/Dn,w/DnT,w, paired lab companions, and one-side lab companions before considering any new work.",
    iteration: 1
  },
  {
    conclusion:
      "The compatible anchor-delta A-weighted lane has same-route base values and calculated C terms already present, while non-Knauf formula widening and budget tightening both need new evidence.",
    iteration: 2
  },
  {
    conclusion:
      "Select the A-weighted field/building owner as the next value-moving slice, with building Dn,A, STC/C/Ctr field aliases, ASTM, and non-Knauf rows kept outside the owner.",
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

const FIELD_TARGETS = ["R'w", "Dn,w", "DnT,w", "Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const LAB_COMPANION_TARGETS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

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

const NON_KNAUF_ONE_SIDE_BOARD_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

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
      expectedNextRuntimeValuesMoved: 6,
      id: SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/post-v1-wall-compatible-anchor-delta.ts",
        "packages/engine/src/post-v1-wall-compatible-anchor-delta-field-building-adapter-owner-contract.test.ts",
        "packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-coverage-refresh-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: true,
      preservesBoundaryCorrectness: true,
      reason:
        "Highest ROI after the one-side lab companion closeout: the same compatible anchor-delta field/building route already calculates Dn,A/DnT,A companions but intentionally withholds them until a metric owner lands.",
      requiredInputs: [
        "exactReducedStackSourceRow:Rw",
        "compatibleExteriorBoardDelta",
        "oneSideCompatibleExteriorBoardDelta",
        "sameRouteFieldOrBuildingBaseValues",
        "calculatedCAdapterTerm",
        "fieldContext.receivingRoomRt60S",
        "buildingPredictionOutputBasis"
      ],
      score: 96,
      selected: true,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: SELECTED_NEXT_FILE,
      sliceKind: "route_metric_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Dn,A", "DnT,A"],
      touchesFrontendImplementationNow: false
    },
    {
      currentValuesAvailableButUnsupported: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.generic_non_knauf_one_side_lab_companion_formula_widening",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-owner-contract.test.ts",
        "packages/engine/src/layer-combination-resolver-registry.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Useful formula-scope direction, but non-Knauf one-side rows lack an owned anchor/source family and must stay outside the Knauf compatible anchor-delta companion.",
      requiredInputs: [
        "nonKnaufMeasuredAnchorOrHoldout",
        "boardFamilyMassAndStiffness",
        "cavityAndStudFamilyOwnership"
      ],
      score: 61,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "formula_scope",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "STC", "C", "Ctr"],
      touchesFrontendImplementationNow: false
    },
    {
      currentValuesAvailableButUnsupported: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.double_leaf_role_input_surface_residual_after_anchor_delta",
      implementationEvidencePaths: [
        "packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts",
        "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-field-building-surface-parity.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Route-input work remains valuable, but the current web surface already carries the compatible anchor-delta field/building inputs; this is lower ROI than exposing already-computed A-weighted outputs.",
      requiredInputs: ["wallTopology", "studSpacingMm", "resilientBarSideCount", "explicitSideLayerGroups"],
      score: 53,
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
      id: "wall.compatible_anchor_delta_lab_companion_budget_tightening_holdout",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-coverage-refresh-contract.test.ts",
        "packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-coverage-refresh-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Accuracy work is real but blocked: no same-basis measured STC/C/Ctr or A-weighted holdouts exist for the paired and one-side Knauf anchor-delta variants.",
      requiredInputs: ["sameBasisMeasuredCompanionHoldouts", "residualBudgetSplit"],
      score: 47,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_holdout",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["STC", "C", "Ctr", "Dn,A", "DnT,A"],
      touchesFrontendImplementationNow: false
    },
    {
      currentValuesAvailableButUnsupported: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall.compatible_anchor_delta_one_side_lab_companion_closed_lane",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-coverage-refresh-contract.test.ts",
        "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-surface-parity.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: true,
      reason:
        "Closed by the previous owner, surface parity, and coverage refresh; reselecting it would be no calculator progress.",
      requiredInputs: ["none"],
      score: 8,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_lane",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"],
      touchesFrontendImplementationNow: false
    },
    {
      currentValuesAvailableButUnsupported: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "broad_source_crawl_or_report_ui_after_anchor_delta",
      implementationEvidencePaths: ["docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      nextActionMovesRuntimeValues: false,
      preservesBoundaryCorrectness: false,
      reason:
        "Broad source crawling, report polish, auth/storage, and generic UI work do not improve formula scope or accuracy for the current selected calculator slice.",
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
    throw new Error("Numeric gap after one-side lab companion must select the compatible anchor-delta A-weighted owner.");
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

function calculateFieldBuildingProbe(layers: readonly LayerInput[], context: AirborneContext) {
  return calculateAssembly(layers, {
    airborneContext: context,
    calculator: "dynamic",
    targetOutputs: FIELD_TARGETS
  });
}

describe("post-V1 next numeric coverage gap after one-side lab companion", () => {
  it("lands the no-runtime rerank and selects compatible anchor-delta A-weighted owner next", () => {
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

  it("ranks A-weighted compatible anchor-delta owner above formula-scope, route-input, and accuracy holdout alternatives", () => {
    const candidates = rankNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(GAP_COUNTERS.candidateCount);
    expect(ROI_ANALYSIS_ITERATIONS).toHaveLength(3);
    expect(selected).toMatchObject({
      currentValuesAvailableButUnsupported: true,
      expectedNextRuntimeValuesMoved: 6,
      id: SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeValues: true,
      preservesBoundaryCorrectness: true,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: SELECTED_NEXT_FILE,
      sliceKind: "route_metric_owner",
      sourceRowsImportedNow: false,
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Dn,A", "DnT,A"],
      touchesFrontendImplementationNow: false
    });
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.generic_non_knauf_one_side_lab_companion_formula_widening")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.double_leaf_role_input_surface_residual_after_anchor_delta")?.score ?? 0
    );
    expect(selected?.score).toBeGreaterThan(
      byId.get("wall.compatible_anchor_delta_lab_companion_budget_tightening_holdout")?.score ?? 0
    );
    expect(byId.get("wall.compatible_anchor_delta_one_side_lab_companion_closed_lane")).toMatchObject({
      selected: false,
      sliceKind: "closed_lane"
    });
    expect(byId.get("broad_source_crawl_or_report_ui_after_anchor_delta")).toMatchObject({
      preservesBoundaryCorrectness: false,
      selected: false,
      sliceKind: "blocked_non_goal"
    });
  });

  it("proves the selected A-weighted owner now moves the planned values and the later building Dn,A owner is landed", () => {
    const pairedField = calculateFieldBuildingProbe(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, EXACT_LSF_FIELD_CONTEXT);
    const pairedBuilding = calculateFieldBuildingProbe(
      EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES,
      EXACT_LSF_BUILDING_CONTEXT
    );
    const oneSideField = calculateFieldBuildingProbe(EXACT_LSF_PLUS_OUTER_BOARD_END, EXACT_LSF_FIELD_CONTEXT);
    const oneSideBuilding = calculateFieldBuildingProbe(EXACT_LSF_PLUS_OUTER_BOARD_END, EXACT_LSF_BUILDING_CONTEXT);

    expect(pairedField.supportedTargetOutputs).toEqual(FIELD_TARGETS);
    expect(pairedField.unsupportedTargetOutputs).toEqual([]);
    expect(pairedField.metrics).toMatchObject({
      estimatedDnADb: 49.5,
      estimatedDnTADb: 51.9,
      estimatedDnTwDb: 53,
      estimatedDnWDb: 51,
      estimatedRwPrimeDb: 50
    });
    expect(pairedField.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);

    expect(pairedBuilding.supportedTargetOutputs).toEqual(FIELD_TARGETS);
    expect(pairedBuilding.unsupportedTargetOutputs).toEqual([]);
    expect(pairedBuilding.metrics).toMatchObject({
      estimatedDnADb: 49.5,
      estimatedDnTADb: 51.9,
      estimatedDnTwDb: 53,
      estimatedDnWDb: 51,
      estimatedRwPrimeDb: 50
    });
    expect(pairedBuilding.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);

    expect(oneSideField.supportedTargetOutputs).toEqual(FIELD_TARGETS);
    expect(oneSideField.unsupportedTargetOutputs).toEqual([]);
    expect(oneSideField.metrics).toMatchObject({
      estimatedDnADb: 48,
      estimatedDnTADb: 50.4,
      estimatedDnTwDb: 51,
      estimatedDnWDb: 49,
      estimatedRwPrimeDb: 49
    });
    expect(oneSideField.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);

    expect(oneSideBuilding.supportedTargetOutputs).toEqual(FIELD_TARGETS);
    expect(oneSideBuilding.unsupportedTargetOutputs).toEqual([]);
    expect(oneSideBuilding.metrics).toMatchObject({
      estimatedDnADb: 48,
      estimatedDnTADb: 50.4,
      estimatedDnTwDb: 51,
      estimatedDnWDb: 49,
      estimatedRwPrimeDb: 49
    });
    expect(oneSideBuilding.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);

    for (const result of [pairedField, pairedBuilding, oneSideField, oneSideBuilding]) {
      expect(result.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_FIELD_BUILDING_ADAPTER_WARNING);
    }
  });

  it("keeps lab companion, direct Rw, non-Knauf, and wrong-basis rows out of the selected A-weighted work", () => {
    const labCompanion = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: LAB_COMPANION_TARGETS
    });
    const directRw = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const nonKnauf = calculateAssembly(NON_KNAUF_ONE_SIDE_BOARD_STACK, {
      airborneContext: EXACT_LSF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_TARGETS
    });
    const astm = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_FIELD_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["R'w", "DnT,A", "IIC", "AIIC"]
    });

    expect(labCompanion.supportedTargetOutputs).toEqual(LAB_COMPANION_TARGETS);
    expect(labCompanion.airborneBasis?.method).toBe(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD);
    expect(labCompanion.layerCombinationResolverTrace?.selectedCandidateId).toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
    );

    expect(directRw.supportedTargetOutputs).toEqual(["Rw"]);
    expect(directRw.airborneBasis?.method).toBe(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD);
    expect(directRw.layerCombinationResolverTrace?.selectedCandidateId).toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID
    );

    expect(nonKnauf.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w"]);
    expect(nonKnauf.unsupportedTargetOutputs).toEqual(["Dn,A", "DnT,A"]);
    expect(nonKnauf.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
    );

    expect(astm.supportedTargetOutputs).toEqual(["R'w", "DnT,A"]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
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
      expect(content, path).toContain(SELECTED_NEXT_LABEL);
      expect(content, path).toContain("roiAnalysisIterations: 3");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 6");
      expect(content, path).toContain("immediateRuntimeValuesMoved: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
      expect(normalized, path).toContain("dn,a");
      expect(normalized, path).toContain("dnt,a");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-next-numeric-coverage-gap-after-one-side-lab-companion-contract.test.ts"
    );
  });
});
