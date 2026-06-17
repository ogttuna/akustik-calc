import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_floor_user_material_visible_floating_load_basis_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_floor_user_material_visible_floating_load_basis_owner_landed_runtime_selected_coverage_refresh";

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_visible_floating_load_basis_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_visible_floating_load_basis_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const GAP_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_load_basis_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-load-basis-contract.test.ts";
const GAP_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_LOAD_BASIS_PLAN_2026-06-16.md";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_load_basis_landed_no_runtime_selected_floor_user_material_visible_floating_mixed_lab_companion_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_visible_floating_mixed_lab_companion_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-mixed-lab-companion-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_MIXED_LAB_COMPANION_OWNER_PLAN_2026-06-16.md";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material visible floating mixed lab-companion owner";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_visible_floating_mixed_lab_companion_owner";

const GAP_COUNTERS = {
  candidateCount: 7,
  estimatedNextCalculableLayerTemplates: 0,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextCalculableTargetOutputs: 3,
  estimatedNextRuntimeValuesMoved: 3,
  frontendImplementationFilesTouched: 0,
  immediateRuntimeValuesMoved: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const ROI_ANALYSIS_ITERATIONS = [
  {
    conclusion:
      "Subtract all closed user-material wall lanes, field-only heavy floating-floor adapter work, low-density floating-floor family ownership, and visible floating load-basis derivation.",
    iteration: 1
  },
  {
    conclusion:
      "Re-probe mixed impact target sets. Custom visible heavy floating floors can calculate lab-side CI, CI,50-2500, and Ln,w+CI from explicit user inputs, but a missing field output currently withholds the whole impact lane.",
    iteration: 2
  },
  {
    conclusion:
      "Reject silent CI50 defaults, generic IIC/AIIC aliasing, building-prediction impact promotion without owned inputs, and broad source crawling because they would weaken metric/basis integrity.",
    iteration: 3
  },
  {
    conclusion:
      "Select the mixed lab-companion owner because it moves already-owned lab impact companion values inside a real user-entered mixed request while leaving unsupported field metrics explicit.",
    iteration: 4
  }
] as const;

type CandidateKind =
  | "blocked_non_goal"
  | "closed_lane"
  | "input_surface_owner"
  | "runtime_owner"
  | "source_research";

type NumericGapCandidate = {
  readonly currentFormulaInputsAvailable: boolean;
  readonly expectedNextRuntimeValuesMoved: number;
  readonly id: string;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly sliceKind: CandidateKind;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
};

function rankNumericCoverageCandidates(): readonly NumericGapCandidate[] {
  return [
    {
      currentFormulaInputsAvailable: true,
      expectedNextRuntimeValuesMoved: 3,
      id: SELECTED_CANDIDATE_ID,
      reason:
        "A custom visible heavy floating-floor stack with explicit CI and CI,50-2500 can calculate lab-side companions, but mixed field requests with incomplete field context currently lose those supported values. The owner should preserve the lab values and keep only the unowned field output unsupported.",
      score: 94,
      selected: true,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["CI", "CI,50-2500", "Ln,w+CI", "L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_visible_floating_load_basis_owner_closed_lane",
      reason:
        "The previous owner and refresh already derive floating load basis from visible upper-package mass for custom low-density and heavy floating-floor stacks.",
      score: 16,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_missing_ci50_low_frequency_default",
      reason:
        "L'nT,50 must stay tied to explicit CI,50-2500 or an owned spectrum; a default would fabricate low-frequency performance.",
      score: 61,
      selected: false,
      sliceKind: "input_surface_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.astm_iic_aiic_generic_alias_boundary",
      reason:
        "ASTM IIC/AIIC cannot be aliased from ISO Ln,w outputs without exact ASTM band or rating ownership.",
      score: 54,
      selected: false,
      sliceKind: "input_surface_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.building_prediction_impact_promotion_without_owned_context",
      reason:
        "Building-prediction impact values need owned project context inputs and should not be promoted from lab/field outputs by assumption.",
      score: 43,
      selected: false,
      sliceKind: "input_surface_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "broad_source_crawl_for_floor_holdouts",
      reason:
        "Same-stack source holdouts are valuable later, but broad crawling does not unlock this ready formula-route ownership gap.",
      score: 5,
      selected: false,
      sliceKind: "source_research",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Ln,w", "DeltaLw"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "material_editor_or_ui_cleanup",
      reason:
        "UI/catalog management work does not itself increase this calculator route's supported layer combinations or metric integrity.",
      score: 0,
      selected: false,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: []
    }
  ];
}

function summarizeNumericGap() {
  const selected = rankNumericCoverageCandidates().find((candidate) => candidate.selected);
  if (!selected || selected.id !== SELECTED_CANDIDATE_ID) {
    throw new Error("Numeric gap after visible floating load-basis must select the mixed lab-companion owner.");
  }

  return {
    counters: GAP_COUNTERS,
    landedGate: GAP_ACTION,
    noRuntimeValueMovement: true,
    previousCoverageRefresh: {
      landedGate: PREVIOUS_COVERAGE_REFRESH_ACTION,
      refreshFile: PREVIOUS_COVERAGE_REFRESH_FILE,
      selectionStatus: PREVIOUS_COVERAGE_REFRESH_STATUS
    },
    previousOwner: {
      landedGate: PREVIOUS_OWNER_ACTION,
      ownerFile: PREVIOUS_OWNER_FILE,
      selectionStatus: PREVIOUS_OWNER_STATUS
    },
    roiAnalysisIterations: ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: SELECTED_CANDIDATE_ID,
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
    selectionStatus: GAP_STATUS
  };
}

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 next numeric coverage gap after floor user-material visible floating load-basis", () => {
  it("lands the no-runtime rerank and selects the mixed lab-companion runtime owner next", () => {
    expect(summarizeNumericGap()).toMatchObject({
      counters: GAP_COUNTERS,
      landedGate: GAP_ACTION,
      noRuntimeValueMovement: true,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: GAP_STATUS
    });

    for (const path of [
      PREVIOUS_OWNER_FILE,
      PREVIOUS_COVERAGE_REFRESH_FILE,
      GAP_FILE,
      GAP_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the selected candidate calculator-scoped and runtime-moving", () => {
    const ranked = rankNumericCoverageCandidates();
    const selected = ranked.find((candidate) => candidate.selected);

    expect(ranked).toHaveLength(GAP_COUNTERS.candidateCount);
    expect(ROI_ANALYSIS_ITERATIONS).toHaveLength(4);
    expect(selected).toMatchObject({
      currentFormulaInputsAvailable: true,
      expectedNextRuntimeValuesMoved: 3,
      id: SELECTED_CANDIDATE_ID,
      selected: true,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["CI", "CI,50-2500", "Ln,w+CI", "L'nT,50"]
    });
  });

  it("rejects non-goal or unsafe candidates before implementation", () => {
    const rejectedIds = rankNumericCoverageCandidates()
      .filter((candidate) => !candidate.selected)
      .map((candidate) => candidate.id);

    expect(rejectedIds).toEqual([
      "floor.user_material_visible_floating_load_basis_owner_closed_lane",
      "floor.user_material_missing_ci50_low_frequency_default",
      "floor.astm_iic_aiic_generic_alias_boundary",
      "floor.building_prediction_impact_promotion_without_owned_context",
      "broad_source_crawl_for_floor_holdouts",
      "material_editor_or_ui_cleanup"
    ]);
  });

  it("documents the selected next runtime owner and anti-drift rules", () => {
    const plan = readRepoFile(GAP_PLAN_DOC);

    expect(plan).toContain(SELECTED_CANDIDATE_ID);
    expect(plan).toContain(GAP_STATUS);
    expect(plan).toContain(SELECTED_NEXT_ACTION);
    expect(plan).toContain("not a UI polish pass");
    expect(plan).toContain("leaving unsupported field metrics");
  });
});
