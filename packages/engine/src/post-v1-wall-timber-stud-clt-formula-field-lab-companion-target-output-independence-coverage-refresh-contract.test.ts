import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD } from "./dynamic-airborne-gate-dn-timber-stud-bounded";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD
} from "./dynamic-airborne-gate-h-lined-masonry-clt";
import {
  GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD
} from "./dynamic-airborne-gate-y-clt-mass-timber-ctr-spectrum-adapter";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-user-material-formula-field-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_wall_user_material_formula_field_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const PREVIOUS_RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_target_output_independence_plan";
const PREVIOUS_RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-user-material-formula-field-lab-companion-target-output-independence-contract.test.ts";
const PREVIOUS_RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_wall_user_material_formula_field_lab_companion_target_output_independence_landed_no_runtime_selected_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner";

const OWNER_ACTION =
  "post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner_plan";
const OWNER_FILE =
  "packages/engine/src/post-v1-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-owner-contract.test.ts";
const OWNER_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-17.md";
const OWNER_STATUS =
  "post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_owner_landed_runtime_selected_coverage_refresh";
const SELECTED_CANDIDATE_ID =
  "wall.timber_stud_clt_formula_field_lab_companion_target_output_independence_owner";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-17.md";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank";

const SELECTED_NEXT_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_WALL_TIMBER_STUD_CLT_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_PLAN_2026-06-17.md";
const SELECTED_NEXT_LABEL =
  "post-V1 runtime-first route-family rerank after wall timber-stud + CLT formula field lab-companion target-output independence";

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
const FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const MIXED_OUTPUTS = [...LAB_OUTPUTS, ...FIELD_OUTPUTS] as const satisfies readonly RequestedOutputId[];
const ASTM_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw"] as const satisfies readonly RequestedOutputId[];

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

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

function calculateGeneratedWall(id: string, targetOutputs: readonly RequestedOutputId[]) {
  const testCase = generatedCase(id);

  return calculateAssembly(testCase.rows, {
    ...testCase.fieldOptions,
    targetOutputs
  });
}

function summarizeCoverageRefreshCloseout() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noFormulaRetune: true,
    noRuntimeValueMovement: true,
    previousCoverageRefreshAction: PREVIOUS_COVERAGE_REFRESH_ACTION,
    previousCoverageRefreshFile: PREVIOUS_COVERAGE_REFRESH_FILE,
    previousCoverageRefreshStatus: PREVIOUS_COVERAGE_REFRESH_STATUS,
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

describe("post-V1 wall timber-stud + CLT formula field lab-companion target-output independence coverage refresh", () => {
  it("lands the no-runtime refresh and selects the next runtime-first rerank", () => {
    expect(summarizeCoverageRefreshCloseout()).toMatchObject({
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
      PREVIOUS_COVERAGE_REFRESH_FILE,
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

  it("re-probes timber-stud and CLT lab-only field requests on direct lab formula values", () => {
    const cases = [
      {
        baseMethod: GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD,
        c: 0.5,
        ctr: -4.2,
        dnTA: 43.9,
        dnTw: 43,
        dnW: 42,
        id: "wall-timber-stud",
        rw: 50,
        rwPrime: 42,
        stc: 50
      },
      {
        baseMethod: GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD,
        c: -1.1,
        ctr: -7.1,
        dnTA: 40.7,
        dnTw: 42,
        dnW: 41,
        id: "wall-clt-local",
        rw: 42,
        rwPrime: 41,
        stc: 43
      }
    ] as const;

    for (const testCase of cases) {
      const labOnly = calculateGeneratedWall(testCase.id, LAB_OUTPUTS);
      const mixed = calculateGeneratedWall(testCase.id, MIXED_OUTPUTS);

      for (const result of [labOnly, mixed]) {
        expect(result.metrics, testCase.id).toMatchObject({
          estimatedCDb: testCase.c,
          estimatedCtrDb: testCase.ctr,
          estimatedDnTADb: testCase.dnTA,
          estimatedDnTwDb: testCase.dnTw,
          estimatedDnWDb: testCase.dnW,
          estimatedRwDb: testCase.rw,
          estimatedRwPrimeDb: testCase.rwPrime,
          estimatedStc: testCase.stc
        });
        expect(result.airborneBasis, testCase.id).toMatchObject({
          method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
          missingPhysicalInputs: [],
          origin: "family_physics_prediction"
        });
        expect(result.airborneBasis?.assumptions, testCase.id).toEqual(
          expect.arrayContaining([
            `base lab-family method remains ${testCase.baseMethod}`
          ])
        );
        expect(result.layerCombinationResolverTrace, testCase.id).toMatchObject({
          requestedBasis: "field_apparent",
          runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
          selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter"
        });
      }

      expect(labOnly.supportedTargetOutputs, testCase.id).toEqual([...LAB_OUTPUTS]);
      expect(labOnly.unsupportedTargetOutputs, testCase.id).toEqual([]);
      expect(mixed.supportedTargetOutputs, testCase.id).toEqual([...MIXED_OUTPUTS]);
      expect(mixed.unsupportedTargetOutputs, testCase.id).toEqual([]);
    }
  });

  it("re-probes single and partial lab-only field requests without output-order dependence", () => {
    const cases = [
      {
        c: 0.5,
        ctr: -4.2,
        id: "wall-timber-stud",
        rw: 50,
        stc: 50
      },
      {
        c: -1.1,
        ctr: -7.1,
        id: "wall-clt-local",
        rw: 42,
        stc: 43
      }
    ] as const;

    for (const testCase of cases) {
      const rwOnly = calculateGeneratedWall(testCase.id, ["Rw"]);
      const ctrOnly = calculateGeneratedWall(testCase.id, ["Ctr"]);
      const partial = calculateGeneratedWall(testCase.id, ["STC", "C"]);
      const reversedPartial = calculateGeneratedWall(testCase.id, ["C", "STC"]);

      expect(rwOnly.supportedTargetOutputs, testCase.id).toEqual(["Rw"]);
      expect(rwOnly.unsupportedTargetOutputs, testCase.id).toEqual([]);
      expect(rwOnly.metrics.estimatedRwDb, testCase.id).toBe(testCase.rw);

      expect(ctrOnly.supportedTargetOutputs, testCase.id).toEqual(["Ctr"]);
      expect(ctrOnly.unsupportedTargetOutputs, testCase.id).toEqual([]);
      expect(ctrOnly.metrics.estimatedCtrDb, testCase.id).toBe(testCase.ctr);

      for (const result of [partial, reversedPartial]) {
        expect(result.supportedTargetOutputs, testCase.id).toEqual(
          expect.arrayContaining(["STC", "C"])
        );
        expect(result.unsupportedTargetOutputs, testCase.id).toEqual([]);
        expect(result.metrics, testCase.id).toMatchObject({
          estimatedCDb: testCase.c,
          estimatedStc: testCase.stc
        });
      }
    }
  });

  it("preserves field-only, element-lab, and exact/source LSF boundaries", () => {
    const timber = generatedCase("wall-timber-stud");
    const clt = generatedCase("wall-clt-local");
    const lsf = generatedCase("wall-lsf-knauf");
    const timberFieldOnly = calculateGeneratedWall("wall-timber-stud", FIELD_OUTPUTS);
    const cltFieldOnly = calculateGeneratedWall("wall-clt-local", FIELD_OUTPUTS);
    const timberLab = calculateAssembly(timber.rows, {
      ...timber.labOptions,
      targetOutputs: LAB_OUTPUTS
    });
    const cltLab = calculateAssembly(clt.rows, {
      ...clt.labOptions,
      targetOutputs: LAB_OUTPUTS
    });
    const lsfLabOnly = calculateAssembly(lsf.rows, {
      ...lsf.fieldOptions,
      targetOutputs: LAB_OUTPUTS
    });
    const lsfFieldOnly = calculateAssembly(lsf.rows, {
      ...lsf.fieldOptions,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(resultSnapshot(timberFieldOnly)).toMatchObject({
      c: 0.4,
      ctr: -4.3,
      dnTA: 43.9,
      dnTw: 43,
      dnW: 42,
      rw: 42,
      rwPrimeDb: 42,
      stc: 42,
      supportedTargetOutputs: [...FIELD_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(resultSnapshot(cltFieldOnly)).toMatchObject({
      c: -1.8,
      ctr: -7.6,
      dnTA: 40.7,
      dnTw: 42,
      dnW: 41,
      rw: 41,
      rwPrimeDb: 41,
      stc: 41,
      supportedTargetOutputs: [...FIELD_OUTPUTS],
      unsupportedTargetOutputs: []
    });

    expect(resultSnapshot(timberLab)).toMatchObject({
      c: 0.5,
      ctr: -4.2,
      rw: 50,
      stc: 50,
      supportedTargetOutputs: [...LAB_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(timberLab.airborneBasis?.method).toBe(GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD);
    expect(resultSnapshot(cltLab)).toMatchObject({
      c: -1.1,
      ctr: -7.1,
      rw: 42,
      stc: 43,
      supportedTargetOutputs: [...LAB_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(cltLab.airborneBasis?.method).toBe(GATE_Y_CLT_MASS_TIMBER_CTR_SPECTRUM_ADAPTER_RUNTIME_METHOD);
    expect(cltLab.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);

    expect(resultSnapshot(lsfLabOnly)).toMatchObject({
      c: -1.4,
      ctr: -6.4,
      dnTA: 51.1,
      dnTw: 52,
      dnW: 51,
      rw: 51,
      stc: 51,
      supportedTargetOutputs: [...LAB_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(lsfLabOnly.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(resultSnapshot(lsfFieldOnly)).toMatchObject({
      dnTA: 51.1,
      dnTw: 52,
      dnW: 51,
      rwPrimeDb: 51,
      supportedTargetOutputs: [...FIELD_OUTPUTS],
      unsupportedTargetOutputs: []
    });
  });

  it("keeps ASTM and impact requests outside the wall timber/CLT lab companion owner", () => {
    for (const id of ["wall-timber-stud", "wall-clt-local"] as const) {
      const astm = calculateGeneratedWall(id, ASTM_OUTPUTS);
      const impact = calculateGeneratedWall(id, IMPACT_OUTPUTS);

      expect(astm.supportedTargetOutputs, id).toEqual([]);
      expect(astm.unsupportedTargetOutputs, id).toEqual([...ASTM_OUTPUTS]);
      expect(astm.airborneBasis).toMatchObject({
        method: "dynamic_calculator_unsupported_output_guard",
        origin: "unsupported"
      });
      expect(astm.layerCombinationResolverTrace).toMatchObject({
        selectedCandidateId: "generic.astm_iic_aiic.unsupported_boundary"
      });

      expect(impact.supportedTargetOutputs, id).toEqual([]);
      expect(impact.unsupportedTargetOutputs, id).toEqual([...IMPACT_OUTPUTS]);
      expect(impact.airborneBasis).toMatchObject({
        method: "dynamic_calculator_route_input_contract_missing_physical_fields",
        origin: "needs_input"
      });
      expect(impact.layerCombinationResolverTrace).toMatchObject({
        selectedCandidateId: "generic.required_input_owner.needs_input_boundary"
      });
    }
  });

  it("keeps docs and current-gate runner aligned with the refresh closeout", () => {
    for (const path of REQUIRED_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
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
