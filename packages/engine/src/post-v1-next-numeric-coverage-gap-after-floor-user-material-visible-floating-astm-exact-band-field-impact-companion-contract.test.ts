import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_owner_landed_runtime_selected_coverage_refresh";

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const GAP_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-visible-floating-astm-exact-band-field-impact-companion-contract.test.ts";
const GAP_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_VISIBLE_FLOATING_ASTM_EXACT_BAND_FIELD_IMPACT_COMPANION_PLAN_2026-06-16.md";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_visible_floating_astm_exact_band_field_impact_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_companion_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_companion_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_OWNER_PLAN_2026-06-16.md";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material low-density exact ASTM companion owner";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_low_density_exact_astm_companion_owner";

const GAP_COUNTERS = {
  candidateCount: 11,
  estimatedNextCalculableLayerTemplates: 0,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextCalculableTargetOutputs: 10,
  estimatedNextRuntimeBasisPromotions: 4,
  estimatedNextRuntimeValuesMoved: 12,
  frontendImplementationFilesTouched: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const ROI_ANALYSIS_ITERATIONS = [
  {
    conclusion:
      "Subtract closed visible floating load-basis, mixed lab-companion, heavy airborne companion, exact ASTM mixed ISO companion, and exact ASTM field-impact companion lanes.",
    iteration: 1
  },
  {
    conclusion:
      "Probe the already-owned low-density/lightweight custom floating-floor family with exact ASTM bands. The physical route is owned, but exact ASTM currently parks lightweight ISO/field companions and falls back to screening airborne basis.",
    iteration: 2
  },
  {
    conclusion:
      "Reject generic ASTM aliasing, missing-input defaults, non-ASTM exact method promotion, UI work, broad source crawling, and formula retunes without measured holdout evidence.",
    iteration: 3
  },
  {
    conclusion:
      "Select the low-density exact ASTM companion owner because it can move twelve runtime values across lab/field exact ASTM request shapes using already-owned lightweight family and ASTM E989 routes.",
    iteration: 4
  }
] as const;

type CandidateKind =
  | "blocked_non_goal"
  | "boundary_owner"
  | "closed_lane"
  | "input_surface_owner"
  | "runtime_owner"
  | "source_research";

type NumericGapCandidate = {
  readonly currentFormulaInputsAvailable: boolean;
  readonly expectedNextCalculableRequestShapes: number;
  readonly expectedNextRuntimeBasisPromotions: number;
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
      expectedNextCalculableRequestShapes: 2,
      expectedNextRuntimeBasisPromotions: 4,
      expectedNextRuntimeValuesMoved: 12,
      id: SELECTED_CANDIDATE_ID,
      reason:
        "Low-density custom visible floating floors already own the lightweight family Ln,w/Rw route, DeltaLw dynamic-improvement route, field adapter, and exact ASTM E989 rating route. Exact ASTM source currently suppresses those companions; merging them moves real runtime values without aliasing ASTM and ISO.",
      score: 96,
      selected: true,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50", "IIC", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_visible_floating_astm_exact_band_field_impact_companion_owner",
      reason: "Closed by the previous runtime owner and protected by the just-landed coverage refresh.",
      score: 20,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50", "IIC", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_visible_floating_astm_exact_band_mixed_iso_companion_owner",
      reason: "Closed by the mixed ASTM/ISO companion owner and coverage refresh.",
      score: 18,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr", "Ln,w", "DeltaLw", "IIC", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_low_density_floating_floor_family_owner",
      reason: "The low-density base route is already closed; only the exact ASTM companion merge remains open.",
      score: 17,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.generic_iic_aiic_aliasing",
      reason:
        "Rejected because generic IIC/AIIC without exact ASTM E492/E1007 bands would substitute metric families instead of calculating an owned ASTM rating.",
      score: -100,
      selected: false,
      sliceKind: "boundary_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.visible_floating_missing_ci50_default",
      reason:
        "Rejected because inventing CI50 for L'nT,50 would weaken low-frequency field metric ownership.",
      score: -80,
      selected: false,
      sliceKind: "input_surface_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.visible_floating_formula_retune_without_holdout",
      reason:
        "Rejected because coefficient retuning without measured holdouts would reduce calculator defensibility.",
      score: -90,
      selected: false,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.visible_floating_broad_source_crawl",
      reason:
        "Rejected because source crawling without a selected formula/anchor route is not the highest-ROI calculator slice.",
      score: -50,
      selected: false,
      sliceKind: "source_research",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Ln,w", "DeltaLw", "IIC", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.visible_floating_ui_only_surface_copy",
      reason: "Rejected because UI polish does not increase calculator scope or accuracy in this slice.",
      score: -40,
      selected: false,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: []
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_visible_floating_heavy_airborne_companion_owner",
      reason: "Closed by the heavy airborne companion owner and coverage refresh.",
      score: 15,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_visible_floating_mixed_lab_companion_owner",
      reason: "Closed by the mixed lab-companion owner and coverage refresh.",
      score: 14,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["CI", "CI,50-2500", "Ln,w+CI"]
    }
  ];
}

function summarizeGapRerank() {
  const candidates = rankNumericCoverageCandidates();
  const selected = candidates.find((candidate) => candidate.selected);

  return {
    candidates,
    counters: GAP_COUNTERS,
    landedGate: GAP_ACTION,
    previousCoverageRefreshAction: PREVIOUS_COVERAGE_REFRESH_ACTION,
    previousCoverageRefreshFile: PREVIOUS_COVERAGE_REFRESH_FILE,
    previousCoverageRefreshStatus: PREVIOUS_COVERAGE_REFRESH_STATUS,
    previousOwnerAction: PREVIOUS_OWNER_ACTION,
    previousOwnerFile: PREVIOUS_OWNER_FILE,
    previousOwnerStatus: PREVIOUS_OWNER_STATUS,
    roiAnalysisIterations: ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: selected?.id,
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

describe("post-V1 next numeric coverage gap after floor user-material visible floating ASTM exact-band field impact companion", () => {
  it("selects the low-density exact ASTM companion owner after four ROI iterations", () => {
    const summary = summarizeGapRerank();

    expect(summary).toMatchObject({
      counters: GAP_COUNTERS,
      landedGate: GAP_ACTION,
      selectedCandidateId: SELECTED_CANDIDATE_ID,
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectedNextPlanDoc: SELECTED_NEXT_PLAN_DOC,
      selectionStatus: GAP_STATUS
    });
    expect(summary.roiAnalysisIterations).toHaveLength(4);
    expect(summary.candidates).toHaveLength(GAP_COUNTERS.candidateCount);
    expect(summary.candidates.filter((candidate) => candidate.selected)).toHaveLength(1);
  });

  it("rejects non-calculator and metric-alias candidates", () => {
    const candidates = summarizeGapRerank().candidates;

    expect(candidates.find((candidate) => candidate.id === "floor.generic_iic_aiic_aliasing")).toMatchObject({
      expectedNextRuntimeValuesMoved: 0,
      selected: false,
      sliceKind: "boundary_owner",
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(candidates.find((candidate) => candidate.id === "floor.visible_floating_ui_only_surface_copy")).toMatchObject({
      selected: false,
      sliceKind: "blocked_non_goal"
    });
    expect(candidates.find((candidate) => candidate.id === "floor.visible_floating_broad_source_crawl")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
  });

  it("ties the selected owner to runtime value movement, not another docs-only pass", () => {
    const selected = summarizeGapRerank().candidates.find((candidate) => candidate.selected);

    expect(selected).toMatchObject({
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 2,
      expectedNextRuntimeBasisPromotions: 4,
      expectedNextRuntimeValuesMoved: 12,
      selected: true,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selected?.targetMetrics).toEqual([
      "Rw",
      "Ln,w",
      "DeltaLw",
      "L'n,w",
      "L'nT,w",
      "L'nT,50",
      "IIC",
      "AIIC"
    ]);
  });

  it("keeps docs and current-gate runner aligned with the rerank closeout", () => {
    const requiredDocs = [
      "AGENTS.md",
      "README.md",
      "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
      "docs/calculator/CURRENT_STATE.md",
      "docs/calculator/DOCUMENTATION_MAP.md",
      "docs/calculator/NEXT_AGENT_BRIEF.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/README.md",
      "docs/calculator/SYSTEM_MAP.md",
      GAP_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC
    ] as const;

    for (const path of requiredDocs) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const content = readRepoFile(path);
      const normalized = content.replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_OWNER_ACTION);
      expect(content, path).toContain(PREVIOUS_OWNER_FILE);
      expect(content, path).toContain(PREVIOUS_OWNER_STATUS);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(GAP_ACTION);
      expect(content, path).toContain(GAP_FILE);
      expect(content, path).toContain(GAP_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_PLAN_DOC);
      expect(content, path).toContain("candidateCount: 11");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 12");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("runtimeFormulaRetunes: 0");
      expect(content, path).toContain("sourceRowsImported: 0");
      expect(content, path).toContain("frontendImplementationFilesTouched: 0");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(PREVIOUS_COVERAGE_REFRESH_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(GAP_FILE.replace("packages/engine/", ""));
  });
});
