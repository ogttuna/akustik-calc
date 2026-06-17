import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD } from "./dynamic-airborne-gate-dn-timber-stud-bounded";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD
} from "./dynamic-airborne-gate-h-lined-masonry-clt";
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

const SELECTED_NEXT_ACTION =
  "post_v1_wall_timber_stud_clt_formula_field_lab_companion_target_output_independence_coverage_refresh_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_WALL_TIMBER_STUD_CLT_FORMULA_FIELD_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-17.md";
const SELECTED_NEXT_LABEL =
  "post-V1 wall timber-stud + CLT formula field lab-companion target-output independence coverage refresh";

const OWNER_COUNTERS = {
  accuracyPromotedRequestShapes: 4,
  accuracyPromotedTargetOutputs: 8,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 3,
  newCalculableTargetOutputs: 3,
  runtimeBasisPromotions: 2,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 6,
  sourceRowsImported: 0
} as const;

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];
const MIXED_OUTPUTS = [...LAB_OUTPUTS, ...FIELD_OUTPUTS] as const satisfies readonly RequestedOutputId[];

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

function ownerSummary() {
  return {
    counters: OWNER_COUNTERS,
    landedGate: OWNER_ACTION,
    previousCoverageRefreshAction: PREVIOUS_COVERAGE_REFRESH_ACTION,
    previousCoverageRefreshFile: PREVIOUS_COVERAGE_REFRESH_FILE,
    previousCoverageRefreshStatus: PREVIOUS_COVERAGE_REFRESH_STATUS,
    previousRerankAction: PREVIOUS_RERANK_ACTION,
    previousRerankFile: PREVIOUS_RERANK_FILE,
    previousRerankStatus: PREVIOUS_RERANK_STATUS,
    runtimeValueMovement: true,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: OWNER_STATUS
  };
}

describe("post-V1 wall timber-stud + CLT formula field lab-companion target-output independence owner", () => {
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
      PREVIOUS_COVERAGE_REFRESH_FILE,
      PREVIOUS_RERANK_FILE,
      OWNER_FILE,
      OWNER_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("uses direct Gate DN lab companions for generated timber-stud field requests", () => {
    const testCase = generatedCase("wall-timber-stud");
    const labOnly = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: LAB_OUTPUTS
    });
    const mixed = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: MIXED_OUTPUTS
    });

    for (const result of [labOnly, mixed]) {
      expect(result.metrics).toMatchObject({
        estimatedCDb: 0.5,
        estimatedCtrDb: -4.2,
        estimatedDnTADb: 43.9,
        estimatedDnTwDb: 43,
        estimatedDnWDb: 42,
        estimatedRwDb: 50,
        estimatedRwPrimeDb: 42,
        estimatedStc: 50
      });
      expect(result.airborneBasis).toMatchObject({
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        missingPhysicalInputs: [],
        origin: "family_physics_prediction"
      });
      expect(result.airborneBasis?.assumptions).toEqual(
        expect.arrayContaining([
          `base lab-family method remains ${GATE_DN_TIMBER_STUD_BOUNDED_RUNTIME_METHOD}`
        ])
      );
      expect(result.layerCombinationResolverTrace).toMatchObject({
        requestedBasis: "field_apparent",
        runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter"
      });
      expect(result.airborneCandidateResolution).toMatchObject({
        selectedCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
        selectedOrigin: "family_physics_prediction"
      });
    }

    expect(labOnly.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(labOnly.unsupportedTargetOutputs).toEqual([]);
    expect(mixed.supportedTargetOutputs).toEqual([...MIXED_OUTPUTS]);
    expect(mixed.unsupportedTargetOutputs).toEqual([]);
  });

  it("uses direct Gate H/Gate Y lab companions for generated CLT field requests", () => {
    const testCase = generatedCase("wall-clt-local");
    const labOnly = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: LAB_OUTPUTS
    });
    const mixed = calculateAssembly(testCase.rows, {
      ...testCase.fieldOptions,
      targetOutputs: MIXED_OUTPUTS
    });

    for (const result of [labOnly, mixed]) {
      expect(result.metrics).toMatchObject({
        estimatedCDb: -1.1,
        estimatedCtrDb: -7.1,
        estimatedDnTADb: 40.7,
        estimatedDnTwDb: 42,
        estimatedDnWDb: 41,
        estimatedRwDb: 42,
        estimatedRwPrimeDb: 41,
        estimatedStc: 43
      });
      expect(result.airborneBasis).toMatchObject({
        method: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        missingPhysicalInputs: [],
        origin: "family_physics_prediction"
      });
      expect(result.airborneBasis?.assumptions).toEqual(
        expect.arrayContaining([
          `base lab-family method remains ${GATE_H_CLT_MASS_TIMBER_WALL_RUNTIME_METHOD}`
        ])
      );
      expect(result.layerCombinationResolverTrace).toMatchObject({
        requestedBasis: "field_apparent",
        runtimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
        selectedCandidateId: "wall.airborne_field_context.field_apparent_adapter"
      });
    }

    expect(labOnly.supportedTargetOutputs).toEqual([...LAB_OUTPUTS]);
    expect(labOnly.unsupportedTargetOutputs).toEqual([]);
    expect(mixed.supportedTargetOutputs).toEqual([...MIXED_OUTPUTS]);
    expect(mixed.unsupportedTargetOutputs).toEqual([]);
  });

  it("keeps field-only requests and element-lab requests on their existing bases", () => {
    const timber = generatedCase("wall-timber-stud");
    const clt = generatedCase("wall-clt-local");
    const timberFieldOnly = calculateAssembly(timber.rows, {
      ...timber.fieldOptions,
      targetOutputs: FIELD_OUTPUTS
    });
    const cltFieldOnly = calculateAssembly(clt.rows, {
      ...clt.fieldOptions,
      targetOutputs: FIELD_OUTPUTS
    });
    const timberLab = calculateAssembly(timber.rows, {
      ...timber.labOptions,
      targetOutputs: LAB_OUTPUTS
    });
    const cltLab = calculateAssembly(clt.rows, {
      ...clt.labOptions,
      targetOutputs: LAB_OUTPUTS
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
    expect(resultSnapshot(cltLab)).toMatchObject({
      c: -1.1,
      ctr: -7.1,
      rw: 42,
      stc: 43,
      supportedTargetOutputs: [...LAB_OUTPUTS],
      unsupportedTargetOutputs: []
    });
  });

  it("keeps exact/source LSF outside the source-absent timber/CLT formula owner", () => {
    const lsf = generatedCase("wall-lsf-knauf");
    const labOnly = calculateAssembly(lsf.rows, {
      ...lsf.fieldOptions,
      targetOutputs: LAB_OUTPUTS
    });
    const fieldOnly = calculateAssembly(lsf.rows, {
      ...lsf.fieldOptions,
      targetOutputs: FIELD_OUTPUTS
    });

    expect(resultSnapshot(labOnly)).toMatchObject({
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
    expect(labOnly.airborneBasis?.method).not.toBe(GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD);
    expect(resultSnapshot(fieldOnly)).toMatchObject({
      dnTA: 51.1,
      dnTw: 52,
      dnW: 51,
      rwPrimeDb: 51,
      supportedTargetOutputs: [...FIELD_OUTPUTS],
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
      expect(content, path).toContain("runtimeValuesMoved 6");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-wall-timber-stud-clt-formula-field-lab-companion-target-output-independence-owner-contract.test.ts");
  });
});
