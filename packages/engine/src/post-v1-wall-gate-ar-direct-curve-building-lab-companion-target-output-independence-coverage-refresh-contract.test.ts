import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD } from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_rerank_after_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-rerank-after-wall-user-material-double-leaf-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_rerank_after_wall_user_material_double_leaf_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_owner";

const OWNER_ACTION =
  "post_v1_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-gate-ar-direct-curve-building-lab-companion-target-output-independence-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_GATE_AR_DIRECT_CURVE_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-24.md";
const OWNER_STATUS =
  "post_v1_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_owner_landed_runtime_accuracy_selected_coverage_refresh";
const OWNER_CANDIDATE_ID =
  "wall.gate_ar_direct_curve_building_lab_companion_target_output_independence_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-gate-ar-direct-curve-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_GATE_AR_DIRECT_CURVE_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-24.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_coverage_refresh";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_rerank_after_wall_gate_ar_direct_curve_building_lab_companion_target_output_independence_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-rerank-after-wall-gate-ar-direct-curve-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_GATE_AR_DIRECT_CURVE_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-24.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first rerank after wall Gate AR direct-curve building lab-companion target-output independence coverage refresh";

// Coordination note, 2026-06-24: this coverage refresh intentionally locks the
// landed Gate AR direct-curve behavior without changing formulas, source rows,
// or frontend files, so parallel agents can distinguish it from runtime work.
const COVERAGE_REFRESH_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  newCalculableTargetOutputs: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const WALL_STACK = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const WALL_TOPOLOGY = {
  cavity1AbsorptionClass: "porous_absorptive",
  cavity1DepthMm: 50,
  cavity1FillCoverage: "full",
  cavity1LayerIndices: [1],
  sideALeafLayerIndices: [0],
  sideBLeafLayerIndices: [2],
  supportTopology: "independent_frames",
  topologyMode: "double_leaf_framed"
} as const satisfies NonNullable<AirborneContext["wallTopology"]>;

const BUILDING_CONTEXT = {
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "single_conservative_path",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_cross_junction",
  junctionCouplingLengthM: 12,
  panelHeightMm: 2600,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 50,
  sourceRoomVolumeM3: 55,
  studSpacingMm: 600,
  wallTopology: WALL_TOPOLOGY
} as const satisfies AirborneContext;

const INCOMPLETE_BUILDING_CONTEXT = {
  ...BUILDING_CONTEXT,
  receivingRoomVolumeM3: undefined
} as const satisfies AirborneContext;

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const MIXED_OUTPUTS = [
  ...LAB_OUTPUTS,
  ...FIELD_BUILDING_OUTPUTS
] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const EXPECTED_LAB_COMPANIONS = {
  C: -1.3,
  Ctr: -6.4,
  Rw: 44,
  STC: 44
} as const;

const EXPECTED_FIELD_BUILDING_COMPANIONS = {
  DnA: 37.8,
  DnTA: 39.8,
  DnTAk: 36.7,
  DnTw: 41,
  DnW: 39,
  RwPrime: 38
} as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  COVERAGE_REFRESH_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function calculateWall(
  targetOutputs: readonly RequestedOutputId[],
  airborneContext: AirborneContext = BUILDING_CONTEXT
) {
  return calculateAssembly(WALL_STACK, {
    airborneContext,
    calculator: "dynamic",
    targetOutputs
  });
}

function metricSnapshot(result: ReturnType<typeof calculateWall>) {
  return {
    C: result.metrics.estimatedCDb,
    Ctr: result.metrics.estimatedCtrDb,
    DnA: result.metrics.estimatedDnADb,
    DnTA: result.metrics.estimatedDnTADb,
    DnTAk: result.metrics.estimatedDnTAkDb,
    DnTw: result.metrics.estimatedDnTwDb,
    DnW: result.metrics.estimatedDnWDb,
    Rw: result.metrics.estimatedRwDb,
    RwPrime: result.metrics.estimatedRwPrimeDb,
    STC: result.metrics.estimatedStc
  };
}

function coverageRefreshSummary() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
    noRuntimeValueMovement: true,
    ownerCandidateId: OWNER_CANDIDATE_ID,
    previousOwner: {
      action: OWNER_ACTION,
      file: OWNER_FILE,
      status: OWNER_STATUS
    },
    previousRerank: {
      action: PREVIOUS_RERANK_ACTION,
      file: PREVIOUS_RERANK_FILE,
      status: PREVIOUS_RERANK_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

describe("post-V1 wall Gate AR direct-curve building lab-companion target-output independence coverage refresh", () => {
  it("lands the no-runtime coverage refresh and selects the runtime-first rerank", () => {
    expect(coverageRefreshSummary()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      ownerCandidateId: OWNER_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      PREVIOUS_RERANK_FILE,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      COVERAGE_REFRESH_FILE,
      COVERAGE_REFRESH_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("re-probes mixed and single-output requests on the same Gate AR direct curve", () => {
    const mixed = calculateWall(MIXED_OUTPUTS);

    expect(mixed.supportedTargetOutputs).toEqual([...MIXED_OUTPUTS]);
    expect(mixed.unsupportedTargetOutputs).toEqual([]);
    expect(mixed.airborneBasis).toMatchObject({
      curveBasis: "calculated_frequency_curve",
      method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
      missingPhysicalInputs: [],
      origin: "family_physics_prediction"
    });
    expect(metricSnapshot(mixed)).toMatchObject({
      ...EXPECTED_LAB_COMPANIONS,
      ...EXPECTED_FIELD_BUILDING_COMPANIONS
    });

    for (const output of MIXED_OUTPUTS) {
      const single = calculateWall([output]);

      expect(single.supportedTargetOutputs, output).toEqual([output]);
      expect(single.unsupportedTargetOutputs, output).toEqual([]);
      expect(single.airborneBasis, output).toMatchObject({
        curveBasis: "calculated_frequency_curve",
        method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
        missingPhysicalInputs: [],
        origin: "family_physics_prediction"
      });
      expect(metricSnapshot(single), output).toMatchObject({
        ...EXPECTED_LAB_COMPANIONS,
        ...EXPECTED_FIELD_BUILDING_COMPANIONS
      });
    }
  });

  it("re-probes partial requests without widening supported outputs", () => {
    const characteristicOnly = calculateWall(["DnT,A,k"]);
    const cOnly = calculateWall(["C"]);
    const partialMixed = calculateWall(["Ctr", "Dn,w", "DnT,A"]);

    expect(characteristicOnly.supportedTargetOutputs).toEqual(["DnT,A,k"]);
    expect(characteristicOnly.unsupportedTargetOutputs).toEqual([]);
    expect(metricSnapshot(characteristicOnly)).toMatchObject({
      ...EXPECTED_LAB_COMPANIONS,
      ...EXPECTED_FIELD_BUILDING_COMPANIONS
    });

    expect(cOnly.supportedTargetOutputs).toEqual(["C"]);
    expect(cOnly.unsupportedTargetOutputs).toEqual([]);
    expect(metricSnapshot(cOnly)).toMatchObject({
      ...EXPECTED_LAB_COMPANIONS,
      ...EXPECTED_FIELD_BUILDING_COMPANIONS
    });

    expect(partialMixed.supportedTargetOutputs).toEqual(["Ctr", "Dn,w", "DnT,A"]);
    expect(partialMixed.unsupportedTargetOutputs).toEqual([]);
    expect(metricSnapshot(partialMixed)).toMatchObject({
      Ctr: EXPECTED_LAB_COMPANIONS.Ctr,
      DnTA: EXPECTED_FIELD_BUILDING_COMPANIONS.DnTA,
      DnW: EXPECTED_FIELD_BUILDING_COMPANIONS.DnW,
      Rw: EXPECTED_LAB_COMPANIONS.Rw,
      STC: EXPECTED_LAB_COMPANIONS.STC
    });
  });

  it("keeps missing building context and impact aliases outside the refresh", () => {
    const missingRoom = calculateWall(MIXED_OUTPUTS, INCOMPLETE_BUILDING_CONTEXT);
    const impact = calculateWall(IMPACT_OUTPUTS);

    expect(missingRoom.supportedTargetOutputs).not.toEqual([...MIXED_OUTPUTS]);
    expect(missingRoom.airborneBasis?.origin).toBe("needs_input");
    expect(missingRoom.airborneBasis?.missingPhysicalInputs).toEqual(
      expect.arrayContaining(["receivingRoomVolumeM3"])
    );

    expect(impact.supportedTargetOutputs).toEqual([]);
    expect(impact.unsupportedTargetOutputs).toEqual([...IMPACT_OUTPUTS]);
  });

  it("keeps docs and current-gate runner aligned with the refresh closeout", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(PREVIOUS_RERANK_FILE);
      expect(content, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(OWNER_CANDIDATE_ID);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(content, path).toContain("Rw 44");
      expect(content, path).toContain("STC 44");
      expect(content, path).toContain("Ctr -6.4");
      expect(content, path).toContain("R'w 38");
      expect(content, path).toContain("DnT,A,k 36.7");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const gateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(gateRunner).toContain(OWNER_FILE.replace("packages/engine/", ""));
    expect(gateRunner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
