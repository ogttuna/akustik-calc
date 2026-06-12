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
  "post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-building-dn-a-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_compatible_anchor_delta_building_dn_a_coverage_refresh_landed_no_runtime_selected_stc_only_lab_companion_owner";

const STC_ONLY_OWNER_ACTION =
  "post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_plan";
const STC_ONLY_OWNER_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-owner-contract.test.ts";
const STC_ONLY_OWNER_STATUS =
  "post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_owner_landed_runtime_selected_surface_parity";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_compatible_anchor_delta_stc_only_lab_companion_surface_parity_plan";
const SELECTED_NEXT_FILE =
  "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-stc-only-lab-companion-surface-parity.test.ts";
const SELECTED_NEXT_LABEL =
  "post-V1 wall compatible anchor-delta STC-only lab companion surface parity";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_SURFACE_PARITY_PLAN_2026-06-11.md";

const STC_ONLY_OWNER_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 2,
  newCalculableTargetOutputs: 1,
  runtimeBasisPromotions: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const STC_ONLY_OUTPUT = ["STC"] as const satisfies readonly RequestedOutputId[];
const C_ONLY_OUTPUT = ["C"] as const satisfies readonly RequestedOutputId[];
const CTR_ONLY_OUTPUT = ["Ctr"] as const satisfies readonly RequestedOutputId[];
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
  "docs/calculator/POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_STC_ONLY_LAB_COMPANION_OWNER_PLAN_2026-06-11.md",
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function summarizeStcOnlyOwner() {
  return {
    counters: STC_ONLY_OWNER_COUNTERS,
    landedGate: STC_ONLY_OWNER_ACTION,
    previousCoverageRefresh: {
      selectedNextAction: STC_ONLY_OWNER_ACTION,
      selectedNextFile: STC_ONLY_OWNER_FILE,
      selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: STC_ONLY_OWNER_STATUS
  };
}

function expectStcOnlyLabCompanionResult(
  result: ReturnType<typeof calculateAssembly>,
  expectedStc: number,
  expectedScopeInput: "oneSideCompatibleExteriorBoardDelta" | "pairedCompatibleExteriorBoardDelta"
) {
  const selectedCandidate = result.airborneCandidateResolution?.candidates.find(
    (candidate: { id: string; selected?: boolean }) =>
      candidate.id === POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
  );

  expect(result.supportedTargetOutputs).toEqual(STC_ONLY_OUTPUT);
  expect(result.unsupportedTargetOutputs).toEqual([]);
  expect(result.metrics.estimatedStc).toBe(expectedStc);
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
      "ASTM E413 STC rating adapter"
    ])
  );
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: false,
    selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(selectedCandidate).toMatchObject({
    metricIds: [...STC_ONLY_OUTPUT],
    origin: "family_physics_prediction",
    outputIds: [...STC_ONLY_OUTPUT],
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
    supportedMetrics: [...STC_ONLY_OUTPUT],
    valuePins: [{ metric: "STC", value: expectedStc }]
  });
  expect(result.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_WARNING);
  expect(result.warnings).not.toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING);
}

describe("post-V1 wall compatible anchor-delta STC-only lab companion owner", () => {
  it("lands after building Dn,A coverage refresh and selects STC-only surface parity next", () => {
    expect(summarizeStcOnlyOwner()).toMatchObject({
      counters: STC_ONLY_OWNER_COUNTERS,
      landedGate: STC_ONLY_OWNER_ACTION,
      previousCoverageRefresh: {
        selectedNextAction: STC_ONLY_OWNER_ACTION,
        selectedNextFile: STC_ONLY_OWNER_FILE,
        selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
      },
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: STC_ONLY_OWNER_STATUS
    });

    for (const path of [PREVIOUS_COVERAGE_REFRESH_FILE, STC_ONLY_OWNER_FILE]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("promotes paired and one-side exterior-board STC-only requests to calculated lab companions", () => {
    const paired = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: STC_ONLY_OUTPUT
    });
    const oneSideStart = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_START, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: STC_ONLY_OUTPUT
    });
    const oneSideEnd = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_END, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: STC_ONLY_OUTPUT
    });

    expectStcOnlyLabCompanionResult(paired, 59, "pairedCompatibleExteriorBoardDelta");
    expectStcOnlyLabCompanionResult(oneSideStart, 57, "oneSideCompatibleExteriorBoardDelta");
    expectStcOnlyLabCompanionResult(oneSideEnd, 57, "oneSideCompatibleExteriorBoardDelta");
  });

  it("keeps direct Rw, mixed lab, C/Ctr-only, field/building, A-weighted, ASTM, and non-Knauf boundaries pinned", () => {
    const rwOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const mixedLab = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const cOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: C_ONLY_OUTPUT
    });
    const ctrOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: CTR_ONLY_OUTPUT
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
    const nonKnaufMixed = calculateAssembly(NON_KNAUF_ONE_SIDE_BOARD_STACK, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });

    expect(rwOnly.supportedTargetOutputs).toEqual(["Rw"]);
    expect(rwOnly.unsupportedTargetOutputs).toEqual([]);
    expect(rwOnly.metrics.estimatedRwDb).toBe(59);
    expect(rwOnly.airborneBasis).toMatchObject({
      method: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
      origin: "measured_exact_subassembly_plus_calculated_delta"
    });
    expect(rwOnly.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Rw"],
      valuePins: [{ metric: "Rw", value: 59 }]
    });

    expect(mixedLab.supportedTargetOutputs).toEqual(WALL_LAB_OUTPUTS);
    expect(mixedLab.unsupportedTargetOutputs).toEqual([]);
    expect(mixedLab.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6,
      estimatedRwDb: 59,
      estimatedStc: 59
    });
    expect(mixedLab.airborneBasis?.method).toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD
    );

    expect(cOnly.supportedTargetOutputs).toEqual(["C"]);
    expect(cOnly.unsupportedTargetOutputs).toEqual([]);
    expect(cOnly.metrics.estimatedCDb).toBe(-1.1);
    expect(cOnly.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["C"],
      valuePins: [{ metric: "C", value: -1.1 }]
    });
    expect(ctrOnly.supportedTargetOutputs).toEqual(["Ctr"]);
    expect(ctrOnly.unsupportedTargetOutputs).toEqual([]);
    expect(ctrOnly.metrics.estimatedCtrDb).toBe(-6);
    expect(ctrOnly.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["Ctr"],
      valuePins: [{ metric: "Ctr", value: -6 }]
    });

    expect(buildingMixed.supportedTargetOutputs).toEqual(FIELD_BUILDING_OUTPUTS);
    expect(buildingMixed.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr"]);
    expect(buildingMixed.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);

    expect(aWeighted.supportedTargetOutputs).toEqual(["Rw"]);
    expect(aWeighted.unsupportedTargetOutputs).toEqual(["Dn,A", "DnT,A"]);
    expect(astm.supportedTargetOutputs).toEqual(["Rw"]);
    expect(astm.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);

    expect(nonKnaufMixed.supportedTargetOutputs).toEqual(["Rw"]);
    expect(nonKnaufMixed.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr"]);
    expect(nonKnaufMixed.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
    );
  });

  it("keeps docs and current-gate runner aligned with the STC-only owner and selected surface parity", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(STC_ONLY_OWNER_ACTION);
      expect(content, path).toContain(STC_ONLY_OWNER_FILE);
      expect(content, path).toContain(STC_ONLY_OWNER_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL);
      expect(content, path).toContain("STC 59");
      expect(content, path).toContain("STC 57");
      expect(content, path).toContain("newCalculableRequestShapes: 2");
      expect(content, path).toContain("newCalculableTargetOutputs: 1");
      expect(content, path).toContain("runtimeBasisPromotions: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(normalized, path).toContain("value-moving");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(STC_ONLY_OWNER_FILE.replace("packages/engine/", ""));
  });
});
