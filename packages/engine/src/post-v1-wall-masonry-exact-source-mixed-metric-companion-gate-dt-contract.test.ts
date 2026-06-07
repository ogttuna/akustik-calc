import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import {
  GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
  GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-dt-masonry-exact-source-mixed-companion";
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
  POST_V1_GATE_DS_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ds";
import {
  POST_V1_GATE_DT_COUNTERS,
  POST_V1_GATE_DT_EXACT_SOURCE_ID,
  POST_V1_GATE_DT_NEGATIVE_BOUNDARIES,
  POST_V1_GATE_DT_RUNTIME_BASIS,
  POST_V1_GATE_DT_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DT_TARGET_OUTPUTS,
  POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_LANDED_GATE,
  POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_ACTION,
  POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_FILE,
  POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_LABEL,
  POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTION_STATUS,
  summarizePostV1WallMasonryExactSourceMixedMetricCompanionGateDT
} from "./post-v1-wall-masonry-exact-source-mixed-metric-companion-gate-dt";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

const MASONRY_GENERATED_CASE_ID = "wall-masonry-brick" as const;
const MASONRY_MIXED_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const MASONRY_FIELD_OUTPUTS = ["R'w", "Dn,w", "DnT,w", "DnT,A"] as const satisfies readonly RequestedOutputId[];

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

describe("post-V1 wall masonry exact-source mixed-metric companion Gate DT", () => {
  it("lands after Gate DS and returns the chain to numeric coverage rerank without moving values", () => {
    const summary = summarizePostV1WallMasonryExactSourceMixedMetricCompanionGateDT();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ds_landed_no_runtime_selected_wall_masonry_exact_source_mixed_metric_companion_gate_dt"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DS_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-masonry-exact-source-mixed-metric-companion-gate-dt-contract.test.ts"
    );
    expect(summary).toMatchObject({
      counters: POST_V1_GATE_DT_COUNTERS,
      exactSourceId: POST_V1_GATE_DT_EXACT_SOURCE_ID,
      landedGate: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_LANDED_GATE,
      negativeBoundaries: POST_V1_GATE_DT_NEGATIVE_BOUNDARIES,
      noNumericValueMovement: true,
      runtimeBasis: POST_V1_GATE_DT_RUNTIME_BASIS,
      selectedCandidateId: POST_V1_GATE_DT_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_DT_TARGET_OUTPUTS
    });
    expect(POST_V1_GATE_DT_SELECTED_CANDIDATE_ID).toBe(POST_V1_GATE_DS_SELECTED_CANDIDATE_ID);
    expect(POST_V1_GATE_DT_COUNTERS).toMatchObject({
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 1,
      runtimeValuesMoved: 0
    });
  });

  it("promotes mixed masonry Rw/STC/C/Ctr to exact-Rw plus calculated companion basis without changing pins", () => {
    const testCase = generatedCase(MASONRY_GENERATED_CASE_ID);
    const result = calculateAssembly(testCase.rows, testCase.labOptions);
    const exactCandidate = result.airborneCandidateResolution?.candidates.find(
      (candidate) => candidate.id === "candidate_blocked_rockwool_exact_source"
    );
    const selectedCandidate = result.airborneCandidateResolution?.candidates.find(
      (candidate) => candidate.id === GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID
    );

    expect(resultSnapshot(result)).toMatchObject({
      c: -1,
      ctr: -5.5,
      dynamicFamily: "masonry_nonhomogeneous",
      rw: 43,
      rwDb: 43,
      stc: 43,
      supportedTargetOutputs: [...MASONRY_MIXED_LAB_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(result.airborneBasis).toMatchObject({
      exactSourceId: POST_V1_GATE_DT_EXACT_SOURCE_ID,
      kind: "airborne_physics_prediction",
      method: GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(selectedCandidate).toMatchObject({
      metricIds: [...MASONRY_MIXED_LAB_OUTPUTS],
      origin: "family_physics_prediction",
      outputIds: [...MASONRY_MIXED_LAB_OUTPUTS],
      rejectionReasons: [],
      selected: true
    });
    expect(exactCandidate).toMatchObject({
      selected: false,
      rejectionReasons: expect.arrayContaining([
        expect.objectContaining({ code: "missing_source_evidence" })
      ])
    });
  });

  it("keeps single-output masonry Rw on the Gate DR exact measured route", () => {
    const testCase = generatedCase(MASONRY_GENERATED_CASE_ID);
    const result = calculateAssembly(testCase.rows, {
      ...testCase.labOptions,
      targetOutputs: ["Rw"] as const
    });

    expect(resultSnapshot(result)).toMatchObject({
      dynamicFamily: "masonry_nonhomogeneous",
      rw: 43,
      rwDb: 43,
      supportedTargetOutputs: ["Rw"],
      unsupportedTargetOutputs: []
    });
    expect(result.airborneBasis).toMatchObject({
      exactSourceId: POST_V1_GATE_DT_EXACT_SOURCE_ID,
      kind: "airborne_measured_exact",
      method: "verified_airborne_catalog_exact_match",
      origin: "measured_exact_full_stack",
      toleranceClass: "exact_source"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: "candidate_blocked_rockwool_exact_source",
      selectedOrigin: "measured_exact_full_stack"
    });
  });

  it("keeps masonry field outputs calculated through the Gate DX field route instead of aliasing lab exact Rw", () => {
    const testCase = generatedCase(MASONRY_GENERATED_CASE_ID);
    const result = calculateAssembly(testCase.rows, testCase.fieldOptions);

    expect(resultSnapshot(result)).toMatchObject({
      c: -0.2,
      ctr: -4.7,
      dnTA: 41.3,
      dnTw: 42,
      dnW: 40,
      dynamicFamily: "masonry_nonhomogeneous",
      rw: 40,
      rwDb: 40,
      rwPrimeDb: 40,
      stc: 40,
      supportedTargetOutputs: [...MASONRY_FIELD_OUTPUTS],
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

  it("keeps current docs and current-gate runner aligned to Gate DU after DT", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_WALL_MASONRY_EXACT_SOURCE_MIXED_METRIC_COMPANION_GATE_DT_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DT_EXACT_SOURCE_ID);
      expect(contents, path).toContain("runtimeBasisPromotions: 1");
      expect(contents, path).toContain("runtimeValuesMoved: 0");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ds-contract.test.ts");
    expect(runner).toContain("src/post-v1-wall-masonry-exact-source-mixed-metric-companion-gate-dt-contract.test.ts");
  });
});
