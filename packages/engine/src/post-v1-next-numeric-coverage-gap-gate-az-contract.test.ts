import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_LANDED_GATE,
  POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTION_STATUS
} from "./post-v1-floor-tuas-c11c-iso-impact-gate-ay";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTION_STATUS,
  rankPostV1GateAZNumericCoverageCandidates,
  summarizePostV1GateAZNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-az";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_AZ_SURFACES = [
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-az.ts",
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-az-contract.test.ts",
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ay-contract.test.ts",
  "packages/engine/src/impact-lane.ts",
  "packages/engine/src/dynamic-impact.ts",
  "packages/shared/src/domain/impact-predictor-input.ts",
  "packages/shared/src/domain/input-completeness.ts",
  "apps/web/features/workbench/simple-workbench-output-model.ts",
  "apps/web/features/workbench/impact-metric-basis-view.ts",
  "docs/calculator/POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/README.md",
  "docs/README.md",
  "AGENTS.md",
  "tools/dev/run-calculator-current-gate.ts"
] as const;

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_GATE_AZ_NUMERIC_COVERAGE_GAP_PLAN_2026-05-27.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate AZ", () => {
  it("lands Gate AZ as a no-runtime numeric coverage selection and selects Gate BA", () => {
    expect(POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_LANDED_GATE).toBe(
      "post_v1_floor_tuas_c11c_iso_impact_gate_ay_plan"
    );
    expect(POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTION_STATUS).toBe(
      "post_v1_floor_tuas_c11c_iso_impact_gate_ay_landed_selected_next_numeric_coverage_gap_gate_az"
    );
    expect(POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_LANDED_GATE
    );
    expect(POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-az-contract.test.ts"
    );

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_LANDED_GATE).toBe(
      "post_v1_next_numeric_coverage_gap_gate_az_plan"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_az_landed_no_runtime_selected_floor_dynamic_stiffness_load_basis_owner_gate_ba"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_ACTION).toBe(
      "post_v1_floor_dynamic_stiffness_load_basis_owner_gate_ba_plan"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-dynamic-stiffness-load-basis-owner-gate-ba-contract.test.ts"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_LABEL).toBe(
      "post-V1 floor dynamic stiffness/load basis owner Gate BA"
    );

    for (const path of REQUIRED_GATE_AZ_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ranks the floor-impact source-absent physical-owner gap ahead of catalog and wording work", () => {
    const summary = summarizePostV1GateAZNumericCoverageGap();
    const candidates = rankPostV1GateAZNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);

    expect(summary).toMatchObject({
      blockedNonGoalIds: [
        "broad_source_row_crawl",
        "confidence_wording_or_low_confidence_surface"
      ],
      broadSourceCrawlSelected: false,
      candidateCount: 5,
      currentGapEvidenceIds: [
        "floor.material_owner_gap.dynamic_stiffness_load_basis",
        "floor.suspended_ceiling.lower_treatment_coupling_gap",
        "floor.mixed_support_family.multi_family_solver_gap"
      ],
      currentPostV1GateAySelectedNextAction: POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_ACTION,
      currentPostV1GateAySelectedNextFile: POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTED_NEXT_FILE,
      currentPostV1GateAySelectionStatus: POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_SELECTION_STATUS,
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousLandedGate: POST_V1_FLOOR_TUAS_C11C_ISO_IMPACT_GATE_AY_LANDED_GATE,
      selectedCandidateId: "floor.material_owner_gap.dynamic_stiffness_load_basis",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTION_STATUS,
      targetMetricsForSelectedSlice: [
        "Ln,w",
        "DeltaLw",
        "CI",
        "CI,50-2500",
        "Ln,w+CI",
        "L'n,w",
        "L'nT,w",
        "L'nT,50"
      ]
    });
    expect(selected).toMatchObject({
      broadSourceCrawl: false,
      coverageImpact: 0.96,
      id: "floor.material_owner_gap.dynamic_stiffness_load_basis",
      score: 1.77,
      selected: true,
      sliceKind: "input_owner_contract",
      sourceRowsRequiredForSelection: false
    });
    expect(candidates.map((candidate) => candidate.id)).toEqual([
      "floor.material_owner_gap.dynamic_stiffness_load_basis",
      "floor.suspended_ceiling.lower_treatment_coupling_gap",
      "floor.mixed_support_family.multi_family_solver_gap",
      "broad_source_row_crawl",
      "confidence_wording_or_low_confidence_surface"
    ]);
    expect(candidates.filter((candidate) => candidate.selected)).toHaveLength(1);
  });

  it("records the implementation surfaces Gate BA must use instead of inventing a parallel calculator path", () => {
    const summary = summarizePostV1GateAZNumericCoverageGap();

    expect(summary.surfaces.map((surface) => surface.path)).toEqual([
      "packages/engine/src/impact-lane.ts",
      "packages/engine/src/dynamic-impact.ts",
      "packages/shared/src/domain/impact-predictor-input.ts",
      "packages/shared/src/domain/input-completeness.ts",
      "apps/web/features/workbench/simple-workbench-output-model.ts",
      "apps/web/features/workbench/impact-metric-basis-view.ts"
    ]);
    expect(summary.selectionCandidates[0]?.expectedBeforeAfter).toEqual([
      "partial resilient-layer or floor-covering stacks stay needs_input with exact missing physical fields",
      "complete dynamic-stiffness and load-basis stacks become eligible for the next named source-absent owner/runtime slice",
      "unsafe default s' or load assumptions remain blocked"
    ]);
    expect(summary.selectionCandidates[1]).toMatchObject({
      id: "floor.suspended_ceiling.lower_treatment_coupling_gap",
      selected: false,
      sliceKind: "runtime_corridor"
    });
    expect(summary.selectionCandidates[2]).toMatchObject({
      id: "floor.mixed_support_family.multi_family_solver_gap",
      selected: false,
      sliceKind: "fail_closed_boundary"
    });
  });

  it("keeps docs and current-gate runner aligned with Gate AZ closeout and Gate BA selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_AZ_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("floor.material_owner_gap.dynamic_stiffness_load_basis");
      expect(contents, path).toContain("floor.suspended_ceiling.lower_treatment_coupling_gap");
      expect(contents, path).toContain("floor.mixed_support_family.multi_family_solver_gap");
      expect(contents, path).toContain("no-runtime");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-next-numeric-coverage-gap-gate-az-contract.test.ts"
    );
  });
});
