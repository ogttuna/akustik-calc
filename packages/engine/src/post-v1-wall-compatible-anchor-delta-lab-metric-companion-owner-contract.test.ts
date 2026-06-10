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
  GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD
} from "./dynamic-airborne-gate-dv-lsf-exact-source-mixed-companion";
import {
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_WARNING,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING
} from "./post-v1-wall-compatible-anchor-delta";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_SURFACE_PARITY_ACTION =
  "post_v1_wall_compatible_anchor_delta_surface_parity_input_acceptance_plan";
const PREVIOUS_SURFACE_PARITY_FILE =
  "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-field-building-surface-parity.test.ts";
const PREVIOUS_SURFACE_PARITY_STATUS =
  "post_v1_wall_compatible_anchor_delta_surface_parity_input_acceptance_landed_no_runtime_selected_lab_metric_companion_owner";

const LAB_COMPANION_ACTION = "post_v1_wall_compatible_anchor_delta_lab_metric_companion_owner_plan";
const LAB_COMPANION_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-owner-contract.test.ts";
const LAB_COMPANION_STATUS =
  "post_v1_wall_compatible_anchor_delta_lab_metric_companion_owner_landed_runtime_selected_surface_parity";

const SELECTED_NEXT_ACTION = "post_v1_wall_compatible_anchor_delta_lab_metric_companion_surface_parity_plan";
const SELECTED_NEXT_FILE =
  "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-lab-metric-companion-surface-parity.test.ts";
const SELECTED_NEXT_LABEL = "post-V1 wall compatible anchor-delta lab metric companion surface parity";

const LAB_COMPANION_COUNTERS = {
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 1,
  newCalculableTargetOutputs: 3,
  runtimeBasisPromotions: 1,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = ["R'w", "Dn,w", "DnT,w"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_WITH_LAB_COMPANIONS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

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
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SYSTEM_MAP.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function summarizeLabMetricCompanionOwner() {
  return {
    counters: LAB_COMPANION_COUNTERS,
    landedGate: LAB_COMPANION_ACTION,
    previousSurfaceParity: {
      selectedNextAction: LAB_COMPANION_ACTION,
      selectedNextFile: LAB_COMPANION_FILE,
      selectionStatus: PREVIOUS_SURFACE_PARITY_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectionStatus: LAB_COMPANION_STATUS
  };
}

describe("post-V1 wall compatible anchor-delta lab metric companion owner", () => {
  it("lands after surface parity and selects lab metric companion surface parity next", () => {
    expect(summarizeLabMetricCompanionOwner()).toMatchObject({
      counters: LAB_COMPANION_COUNTERS,
      landedGate: LAB_COMPANION_ACTION,
      previousSurfaceParity: {
        selectedNextAction: LAB_COMPANION_ACTION,
        selectedNextFile: LAB_COMPANION_FILE,
        selectionStatus: PREVIOUS_SURFACE_PARITY_STATUS
      },
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectionStatus: LAB_COMPANION_STATUS
    });
  });

  it("promotes compatible anchor-delta Rw/STC/C/Ctr to direct-Rw plus calculated lab companions", () => {
    const result = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const selectedCandidate = result.airborneCandidateResolution?.candidates.find(
      (candidate: { id: string; selected?: boolean }) =>
        candidate.id === POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
    );
    const anchoredCandidate = result.airborneCandidateResolution?.candidates.find(
      (candidate: { id: string; selected?: boolean }) =>
        candidate.id === "candidate_dynamic_exact_subassembly_plus_calculated_delta"
    );

    expect(result.supportedTargetOutputs).toEqual(WALL_LAB_OUTPUTS);
    expect(result.unsupportedTargetOutputs).toEqual([]);
    expect(result.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6,
      estimatedRwDb: 59,
      estimatedStc: 59
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
        "calculatedTransmissionLossCurve",
        "ISO717-1 C/Ctr rating adapter",
        "ASTM E413 STC rating adapter"
      ])
    );
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(selectedCandidate).toMatchObject({
      metricIds: [...WALL_LAB_OUTPUTS],
      origin: "family_physics_prediction",
      outputIds: [...WALL_LAB_OUTPUTS],
      rejectionReasons: [],
      selected: true
    });
    expect(anchoredCandidate).toMatchObject({
      selected: false,
      rejectionReasons: expect.arrayContaining([
        expect.objectContaining({ code: "lower_precedence_than_selected" })
      ])
    });
    expect(result.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "source_absent_family_solver",
      errorBudgetMetrics: ["STC", "C", "Ctr"],
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: [...WALL_LAB_OUTPUTS],
      valuePins: [
        { metric: "Rw", value: 59 },
        { metric: "STC", value: 59 },
        { metric: "C", value: -1.1 },
        { metric: "Ctr", value: -6 }
      ]
    });
    expect(result.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_WARNING);
    expect(result.warnings).not.toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING);
  });

  it("keeps single Rw, STC-only, exact-stack, and field/building aliases on their existing owners", () => {
    const rwOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const stcOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["STC"]
    });
    const exactStackMixed = calculateAssembly(EXACT_LSF_LAB_STACK, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const buildingMixed = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_BUILDING_WITH_LAB_COMPANIONS
    });

    expect(rwOnly.supportedTargetOutputs).toEqual(["Rw"]);
    expect(rwOnly.unsupportedTargetOutputs).toEqual([]);
    expect(rwOnly.airborneBasis).toMatchObject({
      method: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
      origin: "measured_exact_subassembly_plus_calculated_delta"
    });

    expect(stcOnly.supportedTargetOutputs).toEqual([]);
    expect(stcOnly.unsupportedTargetOutputs).toEqual(["STC"]);
    expect(stcOnly.airborneBasis).toMatchObject({
      method: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
      origin: "measured_exact_subassembly_plus_calculated_delta"
    });

    expect(exactStackMixed.supportedTargetOutputs).toEqual(WALL_LAB_OUTPUTS);
    expect(exactStackMixed.unsupportedTargetOutputs).toEqual([]);
    expect(exactStackMixed.airborneBasis?.method).toBe(
      GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD
    );
    expect(exactStackMixed.airborneBasis?.method).not.toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD
    );

    expect(buildingMixed.supportedTargetOutputs).toEqual(FIELD_BUILDING_OUTPUTS);
    expect(buildingMixed.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr"]);
    expect(buildingMixed.airborneBasis?.method).toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(buildingMixed.airborneBasis?.method).not.toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD
    );
  });

  it("keeps docs and current-gate runner aligned with the lab companion owner and selected surface parity", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(PREVIOUS_SURFACE_PARITY_ACTION);
      expect(contents, path).toContain(PREVIOUS_SURFACE_PARITY_FILE);
      expect(contents, path).toContain(PREVIOUS_SURFACE_PARITY_STATUS);
      expect(contents, path).toContain(LAB_COMPANION_ACTION);
      expect(contents, path).toContain(LAB_COMPANION_FILE);
      expect(contents, path).toContain(LAB_COMPANION_STATUS);
      expect(contents, path).toContain(SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(SELECTED_NEXT_FILE);
      expect(contents, path).toContain(SELECTED_NEXT_LABEL);
      expect(contents, path).toContain("newCalculableTargetOutputs: 3");
      expect(contents, path).toContain("runtimeValuesMoved: 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(LAB_COMPANION_FILE.replace("packages/engine/", ""));
  });
});
