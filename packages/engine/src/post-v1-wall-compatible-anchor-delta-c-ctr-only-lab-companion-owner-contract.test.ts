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
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_WARNING,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING
} from "./post-v1-wall-compatible-anchor-delta";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_coverage_refresh_landed_no_runtime_selected_c_ctr_only_lab_companion_owner";

const C_CTR_ONLY_OWNER_ACTION =
  "post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_owner_plan";
const C_CTR_ONLY_OWNER_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-owner-contract.test.ts";
const C_CTR_ONLY_OWNER_STATUS =
  "post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_owner_landed_runtime_selected_surface_parity";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_compatible_anchor_delta_c_ctr_only_lab_companion_surface_parity_plan";
const SELECTED_NEXT_FILE =
  "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-c-ctr-only-lab-companion-surface-parity.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall compatible anchor-delta C/Ctr-only lab companion surface parity";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_SURFACE_PARITY_PLAN_2026-06-11.md";

const C_CTR_ONLY_OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 4,
  newCalculableTargetOutputs: 2,
  runtimeBasisPromotions: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const DIRECT_RW_OUTPUT = ["Rw"] as const satisfies readonly RequestedOutputId[];
const STC_ONLY_OUTPUT = ["STC"] as const satisfies readonly RequestedOutputId[];
const C_ONLY_OUTPUT = ["C"] as const satisfies readonly RequestedOutputId[];
const CTR_ONLY_OUTPUT = ["Ctr"] as const satisfies readonly RequestedOutputId[];
const C_CTR_PAIR_OUTPUT = ["C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_WITH_LAB_COMPANIONS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const A_WEIGHTED_OUTPUTS = ["Rw", "Dn,A", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["Rw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

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

const EXACT_LSF_PLUS_OUTER_BOARD_START = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  ...EXACT_LSF_LAB_STACK
] as const satisfies readonly LayerInput[];

const EXACT_LSF_PLUS_OUTER_BOARD_END = [
  ...EXACT_LSF_LAB_STACK,
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const NON_KNAUF_ONE_SIDE_BOARD_STACK = [
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

const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SYSTEM_MAP.md",
  "docs/calculator/CALCULATOR_NEXT_VALUE_MOVEMENT_ALIGNMENT_2026-06-11.md",
  "docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_C_CTR_ONLY_LAB_COMPANION_OWNER_PLAN_2026-06-11.md",
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function summarizeCOrCtrOnlyOwner() {
  return {
    counters: C_CTR_ONLY_OWNER_COUNTERS,
    landedGate: C_CTR_ONLY_OWNER_ACTION,
    previousCoverageRefresh: {
      selectedNextAction: C_CTR_ONLY_OWNER_ACTION,
      selectedNextFile: C_CTR_ONLY_OWNER_FILE,
      selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: C_CTR_ONLY_OWNER_STATUS
  };
}

function expectedMetricValue(metric: "C" | "Ctr", result: ReturnType<typeof calculateAssembly>): number | undefined {
  return metric === "C" ? result.metrics.estimatedCDb : result.metrics.estimatedCtrDb;
}

function expectCOrCtrOnlyLabCompanionResult(
  result: ReturnType<typeof calculateAssembly>,
  output: "C" | "Ctr",
  expectedValue: number,
  expectedScopeInput: "oneSideCompatibleExteriorBoardDelta" | "pairedCompatibleExteriorBoardDelta"
) {
  const selectedCandidate = result.airborneCandidateResolution?.candidates.find(
    (candidate: { id: string; selected?: boolean }) =>
      candidate.id === POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
  );

  expect(result.supportedTargetOutputs).toEqual([output]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(expectedMetricValue(output, result)).toBe(expectedValue);
  expect(result.airborneBasis).toMatchObject({
    anchorSourceId: "knauf_lab_416889_primary_2026",
    errorBudgetDb: 6,
    kind: "airborne_physics_prediction",
    method: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
    origin: "family_physics_prediction",
    toleranceClass: "uncalibrated_prediction"
  });
  expect(result.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining([
      "exactReducedStackSourceRow:Rw",
      "compatibleExteriorBoardDelta",
      expectedScopeInput,
      "calculatedTransmissionLossCurve",
      "ISO717-1 C/Ctr rating adapter"
    ])
  );
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: false,
    selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(selectedCandidate).toMatchObject({
    metricIds: [output],
    origin: "family_physics_prediction",
    outputIds: [output],
    rejectionReasons: [],
    selected: true
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "source_absent_family_solver",
    errorBudgetMetrics: ["STC", "C", "Ctr"],
    noRuntimeValueMovement: true,
    runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
    selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
    supportBucket: "source_absent_estimate",
    supportedMetrics: [output],
    valuePins: [{ metric: output, value: expectedValue }]
  });
  expect(result.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_WARNING);
  expect(result.warnings).not.toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING);
}

function expectCAndCtrPairLabCompanionResult(
  result: ReturnType<typeof calculateAssembly>,
  expectedC: number,
  expectedCtr: number,
  expectedScopeInput: "oneSideCompatibleExteriorBoardDelta" | "pairedCompatibleExteriorBoardDelta"
) {
  const selectedCandidate = result.airborneCandidateResolution?.candidates.find(
    (candidate: { id: string; selected?: boolean }) =>
      candidate.id === POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
  );

  expect(result.supportedTargetOutputs).toEqual(["C", "Ctr"]);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics).toMatchObject({
    estimatedCDb: expectedC,
    estimatedCtrDb: expectedCtr
  });
  expect(result.airborneBasis).toMatchObject({
    anchorSourceId: "knauf_lab_416889_primary_2026",
    errorBudgetDb: 6,
    kind: "airborne_physics_prediction",
    method: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
    origin: "family_physics_prediction",
    toleranceClass: "uncalibrated_prediction"
  });
  expect(result.airborneBasis?.requiredInputs).toEqual(
    expect.arrayContaining([
      "exactReducedStackSourceRow:Rw",
      "compatibleExteriorBoardDelta",
      expectedScopeInput,
      "calculatedTransmissionLossCurve",
      "ISO717-1 C/Ctr rating adapter"
    ])
  );
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: false,
    selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(selectedCandidate).toMatchObject({
    metricIds: ["C", "Ctr"],
    origin: "family_physics_prediction",
    outputIds: ["C", "Ctr"],
    rejectionReasons: [],
    selected: true
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "source_absent_family_solver",
    errorBudgetMetrics: ["STC", "C", "Ctr"],
    noRuntimeValueMovement: true,
    runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
    selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
    supportBucket: "source_absent_estimate",
    supportedMetrics: ["C", "Ctr"],
    valuePins: [
      { metric: "C", value: expectedC },
      { metric: "Ctr", value: expectedCtr }
    ]
  });
  expect(result.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_WARNING);
  expect(result.warnings).not.toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING);
}

describe("post-V1 wall compatible anchor-delta C/Ctr-only lab companion owner", () => {
  it("lands after STC-only coverage refresh and selects C/Ctr-only surface parity next", () => {
    expect(summarizeCOrCtrOnlyOwner()).toMatchObject({
      counters: C_CTR_ONLY_OWNER_COUNTERS,
      landedGate: C_CTR_ONLY_OWNER_ACTION,
      previousCoverageRefresh: {
        selectedNextAction: C_CTR_ONLY_OWNER_ACTION,
        selectedNextFile: C_CTR_ONLY_OWNER_FILE,
        selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
      },
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: C_CTR_ONLY_OWNER_STATUS
    });

    for (const path of [PREVIOUS_COVERAGE_REFRESH_FILE, C_CTR_ONLY_OWNER_FILE, SELECTED_NEXT_PLAN_DOC]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes paired and one-side exterior-board C-only/Ctr-only requests to calculated lab companions", () => {
    const pairedC = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: C_ONLY_OUTPUT
    });
    const pairedCtr = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: CTR_ONLY_OUTPUT
    });
    const pairedCAndCtr = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: C_CTR_PAIR_OUTPUT
    });
    const oneSideStartC = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_START, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: C_ONLY_OUTPUT
    });
    const oneSideStartCtr = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_START, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: CTR_ONLY_OUTPUT
    });
    const oneSideEndC = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: C_ONLY_OUTPUT
    });
    const oneSideEndCtr = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: CTR_ONLY_OUTPUT
    });
    const oneSideEndCAndCtr = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: C_CTR_PAIR_OUTPUT
    });

    expectCOrCtrOnlyLabCompanionResult(pairedC, "C", -1.1, "pairedCompatibleExteriorBoardDelta");
    expectCOrCtrOnlyLabCompanionResult(pairedCtr, "Ctr", -6, "pairedCompatibleExteriorBoardDelta");
    expectCAndCtrPairLabCompanionResult(pairedCAndCtr, -1.1, -6, "pairedCompatibleExteriorBoardDelta");
    expectCOrCtrOnlyLabCompanionResult(oneSideStartC, "C", -0.6, "oneSideCompatibleExteriorBoardDelta");
    expectCOrCtrOnlyLabCompanionResult(oneSideStartCtr, "Ctr", -5.5, "oneSideCompatibleExteriorBoardDelta");
    expectCOrCtrOnlyLabCompanionResult(oneSideEndC, "C", -0.6, "oneSideCompatibleExteriorBoardDelta");
    expectCOrCtrOnlyLabCompanionResult(oneSideEndCtr, "Ctr", -5.5, "oneSideCompatibleExteriorBoardDelta");
    expectCAndCtrPairLabCompanionResult(oneSideEndCAndCtr, -0.6, -5.5, "oneSideCompatibleExteriorBoardDelta");
  });

  it("keeps direct Rw, STC-only, mixed lab, field/building, A-weighted, ASTM, and non-Knauf boundaries pinned", () => {
    const rwOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: DIRECT_RW_OUTPUT
    });
    const stcOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: STC_ONLY_OUTPUT
    });
    const mixedLab = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const cCtrPair = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: C_CTR_PAIR_OUTPUT
    });
    const buildingMixed = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_BUILDING_WITH_LAB_COMPANIONS
    });
    const aWeighted = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: A_WEIGHTED_OUTPUTS
    });
    const astm = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ASTM_OUTPUTS
    });
    const nonKnaufC = calculateAssembly(NON_KNAUF_ONE_SIDE_BOARD_STACK, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: C_ONLY_OUTPUT
    });

    expect(rwOnly.supportedTargetOutputs).toEqual(DIRECT_RW_OUTPUT);
    expect(rwOnly.metrics.estimatedRwDb).toBe(59);
    expect(rwOnly.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Rw"],
      valuePins: [{ metric: "Rw", value: 59 }]
    });

    expect(stcOnly.supportedTargetOutputs).toEqual(STC_ONLY_OUTPUT);
    expect(stcOnly.metrics.estimatedStc).toBe(59);
    expect(stcOnly.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["STC"],
      valuePins: [{ metric: "STC", value: 59 }]
    });

    expect(mixedLab.supportedTargetOutputs).toEqual(WALL_LAB_OUTPUTS);
    expect(mixedLab.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6,
      estimatedRwDb: 59,
      estimatedStc: 59
    });

    expectCAndCtrPairLabCompanionResult(cCtrPair, -1.1, -6, "pairedCompatibleExteriorBoardDelta");

    expect(buildingMixed.supportedTargetOutputs).toEqual(FIELD_BUILDING_OUTPUTS);
    expect(buildingMixed.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr"]);
    expect(buildingMixed.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);

    expect(aWeighted.supportedTargetOutputs).toEqual(["Rw"]);
    expect(aWeighted.unsupportedTargetOutputs).toEqual(["Dn,A", "DnT,A"]);
    expect(astm.supportedTargetOutputs).toEqual(["Rw"]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);

    expect(nonKnaufC.supportedTargetOutputs).toEqual([]);
    expect(nonKnaufC.unsupportedTargetOutputs).toEqual(["C"]);
    expect(nonKnaufC.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
    );
  });

  it("keeps docs and current-gate runner aligned with the C/Ctr-only owner and selected surface parity", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(C_CTR_ONLY_OWNER_ACTION);
      expect(content, path).toContain(C_CTR_ONLY_OWNER_FILE);
      expect(content, path).toContain(C_CTR_ONLY_OWNER_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL);
      expect(content, path).toContain("C -1.1");
      expect(content, path).toContain("Ctr -6");
      expect(content, path).toContain("C -0.6");
      expect(content, path).toContain("Ctr -5.5");
      expect(content, path).toContain("newCalculableRequestShapes: 4");
      expect(content, path).toContain("newCalculableTargetOutputs: 2");
      expect(content, path).toContain("runtimeBasisPromotions: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(normalized, path).toContain("value-moving");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(C_CTR_ONLY_OWNER_FILE.replace("packages/engine/", ""));
  });
});
