import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
  GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-ar-airborne-building-prediction-runtime-corridor";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_landed_no_runtime_selected_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner";

const OWNER_ACTION =
  "post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-17.md";
const OWNER_STATUS =
  "post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "wall.timber_stud_clt_formula_building_lab_companion_basis_integrity_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-17.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall timber-stud + CLT formula building lab-companion basis integrity coverage refresh";

const OWNER_COUNTERS = {
  accuracyPromotedRequestShapes: 4,
  accuracyPromotedTargetOutputs: 8,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 4,
  newCalculableTargetOutputs: 8,
  runtimeBasisPromotions: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 16,
  sourceRowsImported: 0
} as const;

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const BUILDING_OUTPUTS = ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const MIXED_OUTPUTS = [...LAB_OUTPUTS, ...BUILDING_OUTPUTS] as const satisfies readonly RequestedOutputId[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  OWNER_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

function buildingContext(testCase: ReturnType<typeof generatedCase>): AirborneContext {
  return {
    ...testCase.fieldOptions.airborneContext,
    buildingPredictionOutputBasis: "apparent_and_standardized",
    conservativeFlankingAssumption: "multi_path_conservative",
    contextMode: "building_prediction",
    flankingJunctionClass: "rigid_t_junction",
    junctionCouplingLengthM: 4.8,
    sourceRoomVolumeM3: 42
  };
}

function calculateBuilding(id: string, targetOutputs: readonly RequestedOutputId[]) {
  const testCase = generatedCase(id);

  return calculateAssembly(testCase.rows, {
    ...testCase.fieldOptions,
    airborneContext: buildingContext(testCase),
    targetOutputs
  });
}

function ownerSummary() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    previousRerank: {
      landedGate: PREVIOUS_RERANK_ACTION,
      selectedNextFile: PREVIOUS_RERANK_FILE,
      selectionStatus: PREVIOUS_RERANK_STATUS
    },
    runtimeValueMovement: true,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

function expectGateARBasis(result: ReturnType<typeof calculateAssembly>) {
  expect(result.airborneBasis).toMatchObject({
    method: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD,
    missingPhysicalInputs: [],
    origin: "family_physics_prediction"
  });
  expect(result.airborneCandidateResolution).toMatchObject({
    runtimeValueMovement: true,
    selectedCandidateId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_SELECTED_CANDIDATE_ID,
    selectedOrigin: "family_physics_prediction"
  });
  expect(result.layerCombinationResolverTrace).toMatchObject({
    candidateKind: "field_building_adapter",
    runtimeBasisId: GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD
  });
}

describe("post-V1 wall timber-stud + CLT formula building lab-companion basis integrity owner", () => {
  it("lands the runtime owner without source import, formula retune, or frontend changes", () => {
    expect(ownerSummary()).toMatchObject({
      counters: OWNER_COUNTERS,
      landedGate: OWNER_ACTION,
      runtimeValueMovement: true,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: OWNER_STATUS
    });

    for (const path of [
      PREVIOUS_RERANK_FILE,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses direct lab companions for generated timber-stud building requests while preserving Gate AR values", () => {
    const labOnly = calculateBuilding("wall-timber-stud", LAB_OUTPUTS);
    const rwOnly = calculateBuilding("wall-timber-stud", ["Rw"]);
    const cOnly = calculateBuilding("wall-timber-stud", ["C"]);
    const partialMixed = calculateBuilding("wall-timber-stud", ["Rw", "R'w"]);
    const mixed = calculateBuilding("wall-timber-stud", MIXED_OUTPUTS);

    expect(labOnly.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(labOnly.unsupportedTargetOutputs).toEqual([]);
    expect(labOnly.metrics).toMatchObject({
      estimatedCDb: 0.5,
      estimatedCtrDb: -4.2,
      estimatedRwDb: 50,
      estimatedStc: 50
    });
    expectGateARBasis(labOnly);

    expect(rwOnly.supportedTargetOutputs).toEqual(["Rw"]);
    expect(rwOnly.metrics.estimatedRwDb).toBe(50);
    expect(cOnly.supportedTargetOutputs).toEqual(["C"]);
    expect(cOnly.metrics.estimatedCDb).toBe(0.5);
    expect(partialMixed.supportedTargetOutputs).toEqual(["Rw", "R'w"]);
    expect(partialMixed.metrics).toMatchObject({
      estimatedRwDb: 50,
      estimatedRwPrimeDb: 42
    });

    expect(mixed.supportedTargetOutputs).toEqual([...MIXED_OUTPUTS]);
    expect(mixed.unsupportedTargetOutputs).toEqual([]);
    expect(mixed.metrics).toMatchObject({
      estimatedCDb: 0.5,
      estimatedCtrDb: -4.2,
      estimatedDnADb: 42.4,
      estimatedDnTADb: 43.9,
      estimatedDnTwDb: 43,
      estimatedDnWDb: 42,
      estimatedRwDb: 50,
      estimatedRwPrimeDb: 42,
      estimatedStc: 50
    });
    expectGateARBasis(mixed);
  });

  it("uses direct lab companions for generated CLT building requests while preserving Gate AR values", () => {
    const labOnly = calculateBuilding("wall-clt-local", LAB_OUTPUTS);
    const rwOnly = calculateBuilding("wall-clt-local", ["Rw"]);
    const cOnly = calculateBuilding("wall-clt-local", ["C"]);
    const partialMixed = calculateBuilding("wall-clt-local", ["Rw", "R'w"]);
    const mixed = calculateBuilding("wall-clt-local", MIXED_OUTPUTS);

    expect(labOnly.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(labOnly.unsupportedTargetOutputs).toEqual([]);
    expect(labOnly.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -7.1,
      estimatedRwDb: 42,
      estimatedStc: 43
    });
    expectGateARBasis(labOnly);

    expect(rwOnly.supportedTargetOutputs).toEqual(["Rw"]);
    expect(rwOnly.metrics.estimatedRwDb).toBe(42);
    expect(cOnly.supportedTargetOutputs).toEqual(["C"]);
    expect(cOnly.metrics.estimatedCDb).toBe(-1.1);
    expect(partialMixed.supportedTargetOutputs).toEqual(["Rw", "R'w"]);
    expect(partialMixed.metrics).toMatchObject({
      estimatedRwDb: 42,
      estimatedRwPrimeDb: 41
    });

    expect(mixed.supportedTargetOutputs).toEqual([...MIXED_OUTPUTS]);
    expect(mixed.unsupportedTargetOutputs).toEqual([]);
    expect(mixed.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -7.1,
      estimatedDnADb: 39.2,
      estimatedDnTADb: 40.7,
      estimatedDnTwDb: 42,
      estimatedDnWDb: 41,
      estimatedRwDb: 42,
      estimatedRwPrimeDb: 41,
      estimatedStc: 43
    });
    expectGateARBasis(mixed);
  });

  it("keeps building-only outputs on building basis and leaves field/lab contexts to previous owners", () => {
    const timberBuildingOnly = calculateBuilding("wall-timber-stud", BUILDING_OUTPUTS);
    const cltBuildingOnly = calculateBuilding("wall-clt-local", BUILDING_OUTPUTS);
    const timber = generatedCase("wall-timber-stud");
    const clt = generatedCase("wall-clt-local");
    const timberFieldMixed = calculateAssembly(timber.rows, {
      ...timber.fieldOptions,
      targetOutputs: ["Rw", "STC", "C", "Ctr", "R'w", "Dn,w", "DnT,w", "DnT,A"]
    });
    const cltLab = calculateAssembly(clt.rows, {
      ...clt.labOptions,
      targetOutputs: LAB_OUTPUTS
    });

    expect(resultSnapshot(timberBuildingOnly)).toMatchObject({
      c: 0.5,
      ctr: -4.2,
      dnTA: 43.9,
      dnTw: 43,
      dnW: 42,
      rw: 42,
      rwPrimeDb: 42,
      stc: 50,
      supportedTargetOutputs: [...BUILDING_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(resultSnapshot(cltBuildingOnly)).toMatchObject({
      c: -1.1,
      ctr: -7.1,
      dnTA: 40.7,
      dnTw: 42,
      dnW: 41,
      rw: 41,
      rwPrimeDb: 41,
      stc: 43,
      supportedTargetOutputs: [...BUILDING_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(resultSnapshot(timberFieldMixed)).toMatchObject({
      rwDb: 50,
      rwPrimeDb: 42,
      stc: 50,
      supportedTargetOutputs: ["Rw", "STC", "C", "Ctr", "R'w", "Dn,w", "DnT,w", "DnT,A"],
      unsupportedTargetOutputs: []
    });
    expect(resultSnapshot(cltLab)).toMatchObject({
      c: -1.1,
      ctr: -7.1,
      rw: 42,
      stc: 43,
      supportedTargetOutputs: [...LAB_OUTPUTS],
      unsupportedTargetOutputs: []
    });
  });

  it("keeps docs and current-gate runner aligned with owner closeout and coverage refresh selection", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("runtimeValuesMoved 16");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(
      "src/post-v1-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-owner-contract.test.ts"
    );
  });
});
