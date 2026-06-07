import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
  GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-dv-lsf-exact-source-mixed-companion";
import {
  GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-dx-exact-source-family-field-context";
import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_GATE_DU_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-du";
import {
  POST_V1_GATE_DV_COUNTERS,
  POST_V1_GATE_DV_EXACT_SOURCE_ID,
  POST_V1_GATE_DV_NEGATIVE_BOUNDARIES,
  POST_V1_GATE_DV_RUNTIME_BASIS,
  POST_V1_GATE_DV_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DV_TARGET_OUTPUTS,
  POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_LANDED_GATE,
  POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_ACTION,
  POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_FILE,
  POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_LABEL,
  POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTION_STATUS,
  summarizePostV1WallLsfExactSourceMixedMetricCompanionGateDV
} from "./post-v1-wall-lsf-exact-source-mixed-metric-companion-gate-dv";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

const LSF_GENERATED_CASE_ID = "wall-lsf-knauf" as const;
const LSF_MIXED_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const LSF_FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];

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

describe("post-V1 wall LSF exact-source mixed-metric companion Gate DV", () => {
  it("lands after Gate DU and returns the chain to numeric coverage rerank", () => {
    const summary = summarizePostV1WallLsfExactSourceMixedMetricCompanionGateDV();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_du_landed_no_runtime_selected_wall_lsf_exact_source_mixed_metric_companion_gate_dv"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DU_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-lsf-exact-source-mixed-metric-companion-gate-dv-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_DV_COUNTERS,
      exactSourceId: POST_V1_GATE_DV_EXACT_SOURCE_ID,
      landedGate: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_LANDED_GATE,
      negativeBoundaries: POST_V1_GATE_DV_NEGATIVE_BOUNDARIES,
      noNumericValueMovement: true,
      runtimeBasis: POST_V1_GATE_DV_RUNTIME_BASIS,
      selectedCandidateId: POST_V1_GATE_DV_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_DV_TARGET_OUTPUTS
    });
    expect(POST_V1_GATE_DV_SELECTED_CANDIDATE_ID).toBe(POST_V1_GATE_DU_SELECTED_CANDIDATE_ID);
    expect(POST_V1_GATE_DV_COUNTERS).toMatchObject({
      newCalculableLayerTemplates: 1,
      newCalculableRequestShapes: 1,
      newCalculableTargetOutputs: 3,
      runtimeBasisPromotions: 1,
      runtimeValuesMoved: 0
    });
  });

  it("promotes mixed LSF Rw/STC/C/Ctr to exact-Rw plus calculated companion support", () => {
    const testCase = generatedCase(LSF_GENERATED_CASE_ID);
    const result = calculateAssembly(testCase.rows, testCase.labOptions);
    const exactCandidate = result.airborneCandidateResolution?.candidates.find(
      (candidate) => candidate.id === "candidate_blocked_rockwool_exact_source"
    );
    const selectedCandidate = result.airborneCandidateResolution?.candidates.find(
      (candidate) => candidate.id === GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID
    );

    expect(resultSnapshot(result)).toMatchObject({
      c: -1.5,
      ctr: -6.4,
      dynamicFamily: "stud_wall_system",
      rw: 55,
      rwDb: 55,
      stc: 55,
      supportedTargetOutputs: [...LSF_MIXED_LAB_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(result.airborneBasis).toMatchObject({
      exactSourceId: POST_V1_GATE_DV_EXACT_SOURCE_ID,
      kind: "airborne_physics_prediction",
      method: GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_DV_LSF_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(selectedCandidate).toMatchObject({
      metricIds: [...LSF_MIXED_LAB_OUTPUTS],
      origin: "family_physics_prediction",
      outputIds: [...LSF_MIXED_LAB_OUTPUTS],
      rejectionReasons: [],
      selected: true
    });
    expect(exactCandidate).toMatchObject({
      selected: false,
      rejectionReasons: expect.arrayContaining([
        expect.objectContaining({ code: "lower_precedence_than_selected" })
      ])
    });
  });

  it("keeps single-output LSF Rw on the exact measured route", () => {
    const testCase = generatedCase(LSF_GENERATED_CASE_ID);
    const result = calculateAssembly(testCase.rows, {
      ...testCase.labOptions,
      targetOutputs: ["Rw"] as const
    });

    expect(resultSnapshot(result)).toMatchObject({
      dynamicFamily: "stud_wall_system",
      rw: 55,
      rwDb: 55,
      supportedTargetOutputs: ["Rw"],
      unsupportedTargetOutputs: []
    });
    expect(result.airborneBasis).toMatchObject({
      exactSourceId: POST_V1_GATE_DV_EXACT_SOURCE_ID,
      kind: "airborne_measured_exact",
      method: "verified_airborne_catalog_exact_match",
      origin: "measured_exact_full_stack",
      toleranceClass: "exact_source"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: true,
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
  });

  it("keeps LSF field outputs calculated through the Gate DX field route instead of aliasing lab exact Rw", () => {
    const testCase = generatedCase(LSF_GENERATED_CASE_ID);
    const result = calculateAssembly(testCase.rows, testCase.fieldOptions);

    expect(resultSnapshot(result)).toMatchObject({
      c: -1.4,
      ctr: -6.4,
      dnTA: 51.1,
      dnTw: 52,
      dnW: 51,
      dynamicFamily: "stud_wall_system",
      rw: 51,
      rwDb: 51,
      rwPrimeDb: 51,
      stc: 51,
      supportedTargetOutputs: [...LSF_FIELD_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(result.airborneBasis).toMatchObject({
      method: GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_DX_EXACT_SOURCE_FAMILY_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
  });

  it("keeps current docs and current-gate runner aligned to Gate DW after DV", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_WALL_LSF_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DV_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DV_EXACT_SOURCE_ID);
      expect(contents, path).toContain("newCalculableTargetOutputs: 3");
      expect(contents, path).toContain("runtimeValuesMoved: 0");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-du-contract.test.ts");
    expect(runner).toContain("src/post-v1-wall-lsf-exact-source-mixed-metric-companion-gate-dv-contract.test.ts");
  });
});
