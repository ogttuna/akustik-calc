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
import { GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD } from "./dynamic-airborne-gate-dn-timber-stud-bounded";
import {
  GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD
} from "./dynamic-airborne-gate-h-lined-masonry-clt";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD
} from "./dynamic-airborne-gate-y-clt-mass-timber-ctr-spectrum-adapter";
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

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_COVERAGE_REFRESH_PLAN_2026-06-17.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_building_lab_companion_basis_integrity_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-building-lab-companion-basis-integrity-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_TIMBER_STUD_CLT_FORMULA_BUILDING_LAB_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-18.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after wall timber-stud + CLT formula building lab-companion basis integrity";

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

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const BUILDING_OUTPUTS = ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const MIXED_OUTPUTS = [...LAB_OUTPUTS, ...BUILDING_OUTPUTS] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/CHECKPOINT_2026-06-18_WALL_TIMBER_STUD_CLT_BUILDING_LAB_COMPANION_RERANK_READY.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/RUNTIME_FIRST_ROUTE_FAMILY_CAMPAIGN_PLAN_2026-06-17.md",
  COVERAGE_REFRESH_PLAN_DOC,
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

function completeBuildingContext(testCase: ReturnType<typeof generatedCase>): AirborneContext {
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

function missingBuildingOutputBasisContext(testCase: ReturnType<typeof generatedCase>): AirborneContext {
  const { buildingPredictionOutputBasis: _omitted, ...context } = completeBuildingContext(testCase);

  return context;
}

function calculateBuilding(
  id: string,
  targetOutputs: readonly RequestedOutputId[],
  contextBuilder: (testCase: ReturnType<typeof generatedCase>) => AirborneContext = completeBuildingContext
) {
  const testCase = generatedCase(id);

  return calculateAssembly(testCase.rows, {
    ...testCase.fieldOptions,
    airborneContext: contextBuilder(testCase),
    targetOutputs
  });
}

function calculateGeneratedWall(id: string, targetOutputs: readonly RequestedOutputId[]) {
  const testCase = generatedCase(id);

  return calculateAssembly(testCase.rows, {
    ...testCase.fieldOptions,
    targetOutputs
  });
}

function coverageRefreshSummary() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
    noRuntimeValueMovement: true,
    previousOwnerAction: OWNER_ACTION,
    previousOwnerFile: OWNER_FILE,
    previousOwnerStatus: OWNER_STATUS,
    previousRerankAction: PREVIOUS_RERANK_ACTION,
    previousRerankFile: PREVIOUS_RERANK_FILE,
    previousRerankStatus: PREVIOUS_RERANK_STATUS,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: COVERAGE_REFRESH_STATUS
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

describe("post-V1 wall timber-stud + CLT formula building lab-companion basis integrity coverage refresh", () => {
  it("lands the no-runtime refresh and selects the next runtime-first rerank", () => {
    expect(coverageRefreshSummary()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noFormulaRetune: true,
      noRuntimeValueMovement: true,
      previousOwnerAction: OWNER_ACTION,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
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

  it("re-probes timber-stud building lab companions on direct lab values and Gate AR building values", () => {
    const labOnly = calculateBuilding("wall-timber-stud", LAB_OUTPUTS);
    const rwOnly = calculateBuilding("wall-timber-stud", ["Rw"]);
    const cOnly = calculateBuilding("wall-timber-stud", ["C"]);
    const partialMixed = calculateBuilding("wall-timber-stud", ["Rw", "R'w"]);
    const reversedPartialMixed = calculateBuilding("wall-timber-stud", ["R'w", "Rw"]);
    const mixed = calculateBuilding("wall-timber-stud", MIXED_OUTPUTS);

    for (const result of [labOnly, mixed, partialMixed, reversedPartialMixed]) {
      expectGateARBasis(result);
    }

    expect(labOnly.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(labOnly.unsupportedTargetOutputs).toEqual([]);
    expect(labOnly.metrics).toMatchObject({
      estimatedCDb: 0.5,
      estimatedCtrDb: -4.2,
      estimatedRwDb: 50,
      estimatedStc: 50
    });

    expect(rwOnly.supportedTargetOutputs).toEqual(["Rw"]);
    expect(rwOnly.metrics.estimatedRwDb).toBe(50);
    expect(cOnly.supportedTargetOutputs).toEqual(["C"]);
    expect(cOnly.metrics.estimatedCDb).toBe(0.5);
    expect(partialMixed.supportedTargetOutputs).toEqual(["Rw", "R'w"]);
    expect(reversedPartialMixed.supportedTargetOutputs).toEqual(["R'w", "Rw"]);
    for (const result of [partialMixed, reversedPartialMixed]) {
      expect(result.metrics).toMatchObject({
        estimatedRwDb: 50,
        estimatedRwPrimeDb: 42
      });
    }

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
  });

  it("re-probes CLT building lab companions on direct lab values and Gate AR building values", () => {
    const labOnly = calculateBuilding("wall-clt-local", LAB_OUTPUTS);
    const rwOnly = calculateBuilding("wall-clt-local", ["Rw"]);
    const cOnly = calculateBuilding("wall-clt-local", ["C"]);
    const partialMixed = calculateBuilding("wall-clt-local", ["Rw", "R'w"]);
    const reversedPartialMixed = calculateBuilding("wall-clt-local", ["R'w", "Rw"]);
    const mixed = calculateBuilding("wall-clt-local", MIXED_OUTPUTS);

    for (const result of [labOnly, mixed, partialMixed, reversedPartialMixed]) {
      expectGateARBasis(result);
    }

    expect(labOnly.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(labOnly.unsupportedTargetOutputs).toEqual([]);
    expect(labOnly.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -7.1,
      estimatedRwDb: 42,
      estimatedStc: 43
    });

    expect(rwOnly.supportedTargetOutputs).toEqual(["Rw"]);
    expect(rwOnly.metrics.estimatedRwDb).toBe(42);
    expect(cOnly.supportedTargetOutputs).toEqual(["C"]);
    expect(cOnly.metrics.estimatedCDb).toBe(-1.1);
    expect(partialMixed.supportedTargetOutputs).toEqual(["Rw", "R'w"]);
    expect(reversedPartialMixed.supportedTargetOutputs).toEqual(["R'w", "Rw"]);
    for (const result of [partialMixed, reversedPartialMixed]) {
      expect(result.metrics).toMatchObject({
        estimatedRwDb: 42,
        estimatedRwPrimeDb: 41
      });
    }

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
  });

  it("keeps building-only outputs on building basis and field/lab contexts on previous owners", () => {
    const timberBuildingOnly = calculateBuilding("wall-timber-stud", BUILDING_OUTPUTS);
    const cltBuildingOnly = calculateBuilding("wall-clt-local", BUILDING_OUTPUTS);
    const timberFieldMixed = calculateGeneratedWall("wall-timber-stud", ["Rw", "STC", "C", "Ctr", "R'w", "Dn,w", "DnT,w", "DnT,A"]);
    const cltFieldMixed = calculateGeneratedWall("wall-clt-local", ["Rw", "STC", "C", "Ctr", "R'w", "Dn,w", "DnT,w", "DnT,A"]);
    const timber = generatedCase("wall-timber-stud");
    const clt = generatedCase("wall-clt-local");
    const timberLab = calculateAssembly(timber.rows, {
      ...timber.labOptions,
      targetOutputs: LAB_OUTPUTS
    });
    const cltLab = calculateAssembly(clt.rows, {
      ...clt.labOptions,
      targetOutputs: LAB_OUTPUTS
    });

    expect(resultSnapshot(timberBuildingOnly)).toMatchObject({
      c: 0.4,
      ctr: -4.3,
      dnTA: 43.9,
      dnTw: 43,
      dnW: 42,
      rw: 42,
      rwPrimeDb: 42,
      stc: 42,
      supportedTargetOutputs: [...BUILDING_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(resultSnapshot(cltBuildingOnly)).toMatchObject({
      c: -1.8,
      ctr: -7.6,
      dnTA: 40.7,
      dnTw: 42,
      dnW: 41,
      rw: 41,
      rwPrimeDb: 41,
      stc: 41,
      supportedTargetOutputs: [...BUILDING_OUTPUTS],
      unsupportedTargetOutputs: []
    });

    expect(timberFieldMixed.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(resultSnapshot(timberFieldMixed)).toMatchObject({
      c: 0.5,
      ctr: -4.2,
      rwDb: 50,
      rwPrimeDb: 42,
      stc: 50,
      supportedTargetOutputs: ["Rw", "STC", "C", "Ctr", "R'w", "Dn,w", "DnT,w", "DnT,A"],
      unsupportedTargetOutputs: []
    });
    expect(cltFieldMixed.airborneBasis?.method).toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(resultSnapshot(cltFieldMixed)).toMatchObject({
      c: -1.1,
      ctr: -7.1,
      rwDb: 42,
      rwPrimeDb: 41,
      stc: 43,
      supportedTargetOutputs: ["Rw", "STC", "C", "Ctr", "R'w", "Dn,w", "DnT,w", "DnT,A"],
      unsupportedTargetOutputs: []
    });

    expect(timberLab.airborneBasis?.method).toBe(GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD);
    expect(resultSnapshot(timberLab)).toMatchObject({
      c: 0.5,
      ctr: -4.2,
      rw: 50,
      stc: 50,
      supportedTargetOutputs: [...LAB_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(cltLab.airborneBasis?.method).toBe(GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD);
    expect(cltLab.airborneBasis?.method).not.toBe(GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD);
    expect(resultSnapshot(cltLab)).toMatchObject({
      c: -1.1,
      ctr: -7.1,
      rw: 42,
      stc: 43,
      supportedTargetOutputs: [...LAB_OUTPUTS],
      unsupportedTargetOutputs: []
    });
  });

  it("keeps exact/source LSF, missing building input, ASTM, and impact boundaries outside this owner", () => {
    const lsf = generatedCase("wall-lsf-knauf");
    const lsfFieldLabOnly = calculateAssembly(lsf.rows, {
      ...lsf.fieldOptions,
      targetOutputs: LAB_OUTPUTS
    });
    const lsfFieldOnly = calculateAssembly(lsf.rows, {
      ...lsf.fieldOptions,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(resultSnapshot(lsfFieldLabOnly)).toMatchObject({
      c: -1.4,
      ctr: -6.4,
      dnTA: 51.1,
      dnTw: 52,
      dnW: 51,
      rw: 51,
      stc: 51,
      supportedTargetOutputs: ["STC", "C", "Ctr"],
      unsupportedTargetOutputs: ["Rw"]
    });
    expect(lsfFieldLabOnly.airborneBasis?.method).not.toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);
    expect(resultSnapshot(lsfFieldOnly)).toMatchObject({
      dnTA: 51.1,
      dnTw: 52,
      dnW: 51,
      rwPrimeDb: 51,
      supportedTargetOutputs: [...FIELD_OUTPUTS],
      unsupportedTargetOutputs: []
    });

    for (const id of ["wall-timber-stud", "wall-clt-local"] as const) {
      const missing = calculateBuilding(id, ["Rw", "R'w"], missingBuildingOutputBasisContext);
      const astm = calculateBuilding(id, ASTM_OUTPUTS);
      const impact = calculateBuilding(id, IMPACT_OUTPUTS);

      expect(missing.supportedTargetOutputs, id).toEqual(["Rw"]);
      expect(missing.unsupportedTargetOutputs, id).toEqual(["R'w"]);
      expect(missing.metrics.estimatedRwDb, id).toBe(id === "wall-timber-stud" ? 42 : 41);
      expect(missing.airborneBasis).toMatchObject({
        origin: "needs_input"
      });
      expect(missing.airborneBasis?.missingPhysicalInputs, id).toContain("buildingPredictionOutputBasis");
      expect(missing.layerCombinationResolverTrace, id).toMatchObject({
        selectedCandidateId: "generic.required_input_owner.needs_input_boundary"
      });

      expect(astm.supportedTargetOutputs, id).toEqual([]);
      expect(astm.unsupportedTargetOutputs, id).toEqual([...ASTM_OUTPUTS]);
      expect(astm.airborneBasis).toMatchObject({
        origin: "unsupported"
      });
      expect(astm.airborneBasis?.method, id).not.toBe(GATE_AR_AIRBORNE_BUILDING_PREDICTION_RUNTIME_METHOD);

      expect(impact.supportedTargetOutputs, id).toEqual([]);
      expect(impact.unsupportedTargetOutputs, id).toEqual([...IMPACT_OUTPUTS]);
      expect(impact.airborneBasis).toMatchObject({
        method: "dynamic_calculator_route_input_contract_missing_physical_fields",
        origin: "needs_input"
      });
      expect(impact.layerCombinationResolverTrace, id).toMatchObject({
        selectedCandidateId: "generic.required_input_owner.needs_input_boundary"
      });
    }
  });

  it("keeps docs and current-gate runner aligned with the refresh closeout", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_RERANK_ACTION);
      expect(content, path).toContain(PREVIOUS_RERANK_FILE);
      expect(content, path).toContain(PREVIOUS_RERANK_STATUS);
      expect(content, path).toContain(OWNER_ACTION);
      expect(content, path).toContain(OWNER_FILE);
      expect(content, path).toContain(OWNER_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("coverageRefreshContractFilesTouched: 1");
      expect(content, path).toContain("runtimeBasisPromotions: 0");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(content, path).toContain("Rw 50");
      expect(content, path).toContain("STC 50");
      expect(content, path).toContain("Ctr -4.2");
      expect(content, path).toContain("Rw 42");
      expect(content, path).toContain("STC 43");
      expect(content, path).toContain("Ctr -7.1");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(OWNER_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
  });
});
