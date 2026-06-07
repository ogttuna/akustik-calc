import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { findVerifiedAirborneAssemblyMatch } from "./airborne-verified-catalog";
import { calculateAssembly } from "./calculate-assembly";
import {
  GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
  GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-dt-masonry-exact-source-mixed-companion";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_GATE_DQ_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_DQ_PLAN_DOC_PATH,
  POST_V1_GATE_DQ_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DQ_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTION_STATUS,
  rankPostV1GateDQNumericCoverageCandidates,
  summarizePostV1GateDQNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-dq";
import {
  POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_LANDED_GATE,
  POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_ACTION,
  POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_FILE,
  POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTION_STATUS
} from "./post-v1-wall-clt-laminated-leaf-runtime-basis-gate-dp";

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
const MASONRY_EXACT_SOURCE_ID = "wienerberger_porotherm_100_dense_plaster_primary_2026" as const;
const MASONRY_MIXED_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

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

describe("post-V1 next numeric coverage gap Gate DQ", () => {
  it("lands the no-runtime Gate DQ rerank after Gate DP and selects exact-source zero-delta basis Gate DR", () => {
    const summary = summarizePostV1GateDQNumericCoverageGap();

    expect(POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTION_STATUS).toBe(
      "post_v1_wall_clt_laminated_leaf_runtime_basis_gate_dp_landed_runtime_basis_no_value_selected_next_numeric_coverage_gap_gate_dq"
    );
    expect(POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_LANDED_GATE
    );
    expect(POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-dq-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_DQ_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_DQ_PLAN_DOC_PATH,
      previousGateDP: {
        landedGate: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_LANDED_GATE,
        selectedNextAction: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_WALL_CLT_LAMINATED_LEAF_RUNTIME_BASIS_GATE_DP_SELECTION_STATUS
      },
      selectedCandidateId: POST_V1_GATE_DQ_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTION_STATUS
    });
  });

  it("selects the highest-ROI exact-source basis repair and rejects closed, blocked, or non-calculator work", () => {
    const candidates = rankPostV1GateDQNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

    expect(candidates).toHaveLength(POST_V1_GATE_DQ_NO_RUNTIME_COUNTERS.candidateCount);
    expect(selected).toMatchObject({
      id: POST_V1_GATE_DQ_SELECTED_CANDIDATE_ID,
      nextActionMovesRuntimeBasis: true,
      nextActionMovesRuntimeValues: false,
      passesCalculatorAdvancementTest: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_FILE,
      sliceKind: "runtime_basis_accuracy_repair",
      sourceRowsRequiredForSelection: false,
      targetMetrics: POST_V1_GATE_DQ_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementation: false,
      touchesSharedOrApiSurface: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("wall.lsf_exact_lab_anchor_field_input_surface_gap")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("wall.masonry_exact_source_mixed_metric_companion_policy_gap")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("floor.astm_iic_aiic_user_band_input_surface")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("opening_leak_common_wall_holdout_tightening")?.score ?? 0);

    expect(byId.get("wall.lsf_exact_lab_anchor_field_input_surface_gap")).toMatchObject({
      selected: false,
      sliceKind: "already_runtime_capable"
    });
    expect(byId.get("floor.impact_explicit_ci_surface_gap")).toMatchObject({
      selected: false,
      sliceKind: "already_runtime_capable"
    });
    expect(byId.get("wall.masonry_exact_source_mixed_metric_companion_policy_gap")).toMatchObject({
      selected: false,
      sliceKind: "accuracy_owner_contract"
    });

    for (const blockedId of ["broad_source_row_crawl", "confidence_wording"] as const) {
      expect(byId.get(blockedId)).toMatchObject({
        passesCalculatorAdvancementTest: false,
        selected: false,
        sliceKind: "blocked_non_goal"
      });
    }
  });

  it("records the former masonry Rw screening-basis gap and verifies the landed DR exact-source repair", () => {
    const gateDqSelected = rankPostV1GateDQNumericCoverageCandidates().find(
      (candidate) => candidate.id === POST_V1_GATE_DQ_SELECTED_CANDIDATE_ID
    );
    const testCase = generatedCase(MASONRY_GENERATED_CASE_ID);
    const options = {
      ...testCase.labOptions,
      targetOutputs: ["Rw"] as const
    };
    const result = calculateAssembly(testCase.rows, options);
    const snapshot = resultSnapshot(result);
    const exactMatch = findVerifiedAirborneAssemblyMatch(result.layers, options.airborneContext);

    expect(gateDqSelected?.expectedBeforeAfter).toEqual(
      expect.arrayContaining([
        expect.stringContaining("public basis stays screening_fallback"),
        expect.stringContaining("measured_exact_full_stack")
      ])
    );
    expect(snapshot).toMatchObject({
      c: -1,
      ctr: -5.5,
      dynamicFamily: "masonry_nonhomogeneous",
      rw: 43,
      rwDb: 43,
      stc: 43,
      supportedTargetOutputs: ["Rw"],
      unsupportedTargetOutputs: []
    });
    expect(exactMatch?.id).toBe(MASONRY_EXACT_SOURCE_ID);
    expect(result.airborneBasis).toMatchObject({
      curveBasis: "source_single_number_rating",
      exactSourceId: MASONRY_EXACT_SOURCE_ID,
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

  it("keeps mixed masonry companions calculated instead of treating Rw-only source as STC/C/Ctr ownership", () => {
    const testCase = generatedCase(MASONRY_GENERATED_CASE_ID);
    const result = calculateAssembly(testCase.rows, testCase.labOptions);
    const exactCandidate = result.airborneCandidateResolution?.candidates.find(
      (candidate) => candidate.id === "candidate_blocked_rockwool_exact_source"
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
      exactSourceId: MASONRY_EXACT_SOURCE_ID,
      method: GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_RUNTIME_METHOD,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(result.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: GATE_DT_MASONRY_EXACT_RW_CALCULATED_COMPANION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(exactCandidate).toMatchObject({
      selected: false,
      rejectionReasons: expect.arrayContaining([
        expect.objectContaining({ code: "missing_source_evidence" })
      ])
    });
  });

  it("keeps DQ/DR current-selection docs aligned without touching frontend implementation", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DQ_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DQ_SELECTED_CANDIDATE_ID);
      expect(contents, path).toContain(MASONRY_EXACT_SOURCE_ID);
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }
  });
});
