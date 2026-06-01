import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_LANDED_GATE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTION_STATUS,
  POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_CONTEXT,
  POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS
} from "./post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf";
import {
  POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
  POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS
} from "./post-v1-floor-suspended-ceiling-lower-treatment-gate-bb";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_LABEL,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTION_STATUS,
  rankPostV1GateBGNumericCoverageCandidates,
  summarizePostV1GateBGNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-bg";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const REQUIRED_GATE_BG_SURFACES = [
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg.ts",
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg-contract.test.ts",
  "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-field-companion-gate-bf.ts",
  "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb.ts",
  "packages/engine/src/broad-accuracy-reference-benchmark-expansion.ts",
  "packages/engine/src/broad-accuracy-floor-system-similarity-anchor.ts",
  "docs/calculator/POST_V1_GATE_BG_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md",
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
  "docs/calculator/POST_V1_GATE_BG_NUMERIC_COVERAGE_AND_ACCURACY_RERANK_PLAN_2026-06-01.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap Gate BG", () => {
  it("lands Gate BG after Gate BF and selects mixed-support family owner boundary Gate BH", () => {
    const summary = summarizePostV1GateBGNumericCoverageGap();

    expect(POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTION_STATUS).toBe(
      "post_v1_floor_suspended_ceiling_lower_treatment_field_companion_gate_bf_landed_selected_next_numeric_coverage_gap_gate_bg"
    );
    expect(POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_ACTION).toBe(
      POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_LANDED_GATE
    );
    expect(POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-bg-contract.test.ts"
    );
    expect(summary).toMatchObject({
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_LANDED_GATE,
      noRuntimeValueMovement: true,
      previousGateBF: {
        landedGate: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_LANDED_GATE,
        selectedNextAction:
          POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_ACTION,
        selectedNextFile:
          POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_FLOOR_SUSPENDED_CEILING_LOWER_TREATMENT_FIELD_COMPANION_GATE_BF_SELECTION_STATUS
      },
      selectedCandidateId: "floor.mixed_support_family.multi_family_solver_gap",
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTION_STATUS,
      targetMetricsForSelectedSlice: ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]
    });

    for (const path of REQUIRED_GATE_BG_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ranks calculator scope and correctness above source crawling, wording, scenarios, and UI work", () => {
    const candidates = rankPostV1GateBGNumericCoverageCandidates();
    const selected = candidates.find((candidate) => candidate.selected);

    expect(candidates.map((candidate) => candidate.id)).toEqual([
      "floor.mixed_support_family.multi_family_solver_gap",
      "post_v1_current_accuracy_residual_and_holdout_gap",
      "metric_basis_adapter_boundary_gap",
      "source_absent_formula_family_runtime_gap",
      "broad_source_row_crawl",
      "confidence_wording_or_low_confidence_surface",
      "finite_scenario_pack",
      "generic_ui_or_report_storage_work"
    ]);
    expect(selected).toMatchObject({
      id: "floor.mixed_support_family.multi_family_solver_gap",
      score: 1.96,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_FILE,
      sliceKind: "owner_boundary",
      sourceRowsRequiredForSelection: false,
      wrongNumberRisk: 0.98
    });
    expect(candidates.filter((candidate) => candidate.selected)).toHaveLength(1);
    expect(
      candidates
        .filter((candidate) => candidate.sliceKind === "blocked_non_goal")
        .map((candidate) => candidate.id)
    ).toEqual([
      "broad_source_row_crawl",
      "confidence_wording_or_low_confidence_surface",
      "finite_scenario_pack",
      "generic_ui_or_report_storage_work"
    ]);
  });

  it("reuses current implementation evidence for mixed-support and accuracy gaps", () => {
    const summary = summarizePostV1GateBGNumericCoverageGap();
    const mixedSupportSource = readRepoFile("packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb.ts");

    expect(summary.evidence.carriedMixedSupportEvidence).toEqual({
      currentStop: "fail_closed_mixed_family",
      missingOwnerField: "duplicateOwnershipGuard",
      sourcePath: "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bb.ts"
    });
    expect(mixedSupportSource).toContain("fail_closed_mixed_family");
    expect(mixedSupportSource).toContain("duplicateOwnershipGuard");
    expect(summary.evidence.broadAccuracy).toEqual({
      canClaimBroadAccuracyReady: false,
      holdoutResidualRows: 6,
      selectedSimilarityCandidateId: "open_web_steel_supported_resilient_ceiling_similarity",
      weakLaneDebtRows: 6
    });
    expect(summary.evidence.gateBfPinsPreserved).toEqual([
      {
        id: "acoustic_hanger_assembly_field_only",
        lPrimeNT50Db: 48.8,
        lPrimeNTwDb: 44.8,
        lPrimeNWDb: 47.6
      },
      {
        id: "resilient_stud_assembly_field_only",
        lPrimeNT50Db: 47.8,
        lPrimeNTwDb: 43.8,
        lPrimeNWDb: 46.6
      },
      {
        id: "acoustic_hanger_impact_only_field_only",
        lPrimeNT50Db: 48.8,
        lPrimeNTwDb: 44.8,
        lPrimeNWDb: 47.6
      }
    ]);
  });

  it("preserves Gate BF runtime pins and ASTM unsupported boundaries during the no-runtime rerank", () => {
    const result = calculateAssembly(POST_V1_GATE_BB_VISIBLE_HEAVY_CONCRETE_ACOUSTIC_HANGER_LAYERS, {
      calculator: "dynamic",
      floorImpactContext: POST_V1_GATE_BB_COMPLETE_FLOOR_IMPACT_CONTEXT,
      impactFieldContext: POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_CONTEXT,
      targetOutputs: [...POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS, "IIC", "AIIC"]
    });

    expect(result.impact).toMatchObject({
      LPrimeNT50: 48.8,
      LPrimeNTw: 44.8,
      LPrimeNW: 47.6,
      LnW: 45.6
    });
    expect(result.supportedTargetOutputs).toEqual([...POST_V1_GATE_BF_LOWER_TREATMENT_FIELD_OUTPUTS]);
    expect(result.unsupportedTargetOutputs).toEqual(["IIC", "AIIC"]);
    expect(result.impact?.IIC).toBeUndefined();
    expect(result.impact?.AIIC).toBeUndefined();
  });

  it("keeps docs and current-gate runner aligned with Gate BG closeout and Gate BH selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_BG_SELECTED_NEXT_FILE);
      expect(contents, path).toContain("floor.mixed_support_family.multi_family_solver_gap");
      expect(contents, path).toContain("scope/accuracy");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-gate-bg-contract.test.ts");
  });
});
