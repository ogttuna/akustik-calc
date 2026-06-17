import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_landed_runtime_selected_coverage_refresh";

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const GAP_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-contract.test.ts";
const GAP_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_COMPANION_BASIS_INTEGRITY_PLAN_2026-06-16.md";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-impact-target-output-independence-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_IMPACT_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-16.md";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material low-density exact ASTM lab-airborne impact target-output independence owner";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_low_density_exact_astm_lab_airborne_impact_target_output_independence_owner";

const GAP_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableLayerTemplates: 0,
  estimatedNextCalculableRequestShapes: 4,
  estimatedNextCalculableTargetOutputs: 7,
  estimatedNextRuntimeBasisPromotions: 4,
  estimatedNextRuntimeValuesMoved: 7,
  frontendImplementationFilesTouched: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const CURRENT_RUNTIME_EVIDENCE = {
  buildingPredictionPartialOutputSuppression: {
    requestedOutputs: ["Rw", "C", "R'w", "DnT,w", "L'nT,50", "AIIC"] as const,
    currentSupportedOutputs: ["R'w", "DnT,w", "AIIC"] as const,
    currentUnsupportedOutputs: ["Rw", "C", "L'nT,50"] as const,
    dormantOwnedValues: {
      AIIC: 50,
      C: -5.5,
      LPrimeNT50: 66.7,
      Rw: 53
    }
  },
  singleOutputSuppression: {
    currentUnsupportedOutputShapes: [["Rw"], ["C"], ["Ln,w"]] as const,
    dormantOwnedValues: {
      C: -5.5,
      DeltaLw: 24.3,
      LnW: 64.3,
      Rw: 53
    }
  }
} as const;

const ROI_ANALYSIS_ITERATIONS = [
  {
    conclusion:
      "Subtract the just-closed low-density exact ASTM lab-airborne basis-integrity owner and coverage refresh.",
    iteration: 1
  },
  {
    conclusion:
      "Probe the same custom low-density exact ASTM stack by target-output subset. The full mixed request is live, but single-output and partial mixed requests suppress the owned lightweight companion.",
    iteration: 2
  },
  {
    conclusion:
      "Classify the gap as target-output independence, not formula accuracy: the existing same-stack companion already owns Rw 53, C -5.5, Ln,w 64.3, DeltaLw 24.3, and field impact companions when DeltaLw is in the request.",
    iteration: 3
  },
  {
    conclusion:
      "Select a bounded runtime owner that materializes the same owned companion for low-density exact ASTM Rw/C/Ln,w/field-building subsets while preserving STC/Ctr and generic ASTM alias boundaries.",
    iteration: 4
  }
] as const;

type CandidateKind =
  | "blocked_non_goal"
  | "boundary_owner"
  | "closed_lane"
  | "coverage_refresh"
  | "runtime_owner"
  | "source_research";

type NumericGapCandidate = {
  readonly currentFormulaInputsAvailable: boolean;
  readonly expectedNextCalculableRequestShapes: number;
  readonly expectedNextCalculableTargetOutputs: number;
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
      expectedNextCalculableRequestShapes: 4,
      expectedNextCalculableTargetOutputs: 7,
      expectedNextRuntimeBasisPromotions: 4,
      expectedNextRuntimeValuesMoved: 7,
      id: SELECTED_CANDIDATE_ID,
      reason:
        "The same custom low-density exact ASTM stack already calculates the lightweight-family companion when DeltaLw is present, but suppresses Rw, C, Ln,w, and L'nT,50 when those owned outputs are requested alone or in a partial mixed request. The owner should remove target-output ordering dependence without retuning formulas.",
      score: 98,
      selected: true,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "C", "Ln,w", "L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner",
      reason: "Closed by the previous owner and coverage refresh for full mixed request shapes.",
      score: 26,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "C"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_low_density_exact_astm_field_direct_flanking_companion_owner",
      reason: "Closed by the earlier direct+flanking field-impact owner and refresh.",
      score: 22,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_low_density_exact_astm_simple_k_companion_closed_lane",
      reason: "Closed by the earlier low-density exact ASTM impact companion owner and refresh.",
      score: 20,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["AIIC", "Ln,w", "DeltaLw"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.low_density_exact_astm_stc_ctr_companion_promotion",
      reason:
        "Rejected because the lightweight-family companion carries Rw + C semantics, not an STC or Ctr basis.",
      score: -88,
      selected: false,
      sliceKind: "boundary_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["STC", "Ctr"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.generic_astm_iic_aiic_aliasing",
      reason:
        "Rejected because generic ASTM IIC/AIIC without exact E492/E1007 bands would substitute metrics instead of preserving ASTM E989 ownership.",
      score: -100,
      selected: false,
      sliceKind: "boundary_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.low_density_broad_source_crawl_or_formula_retune",
      reason:
        "Rejected because the next movement is already physically owned by the existing same-stack companion; crawling rows or retuning formulas would not close the target-output independence bug faster.",
      score: -60,
      selected: false,
      sliceKind: "source_research",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "C", "Ln,w", "DeltaLw"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextCalculableTargetOutputs: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "ui_or_report_assistant_followup",
      reason:
        "Rejected for this slice because it does not increase calculator scope, accuracy, formula-route ownership, or metric/basis integrity.",
      score: -90,
      selected: false,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: []
    }
  ];
}

function summarizeGapRerank() {
  const candidates = rankNumericCoverageCandidates();
  const selected = candidates.find((candidate) => candidate.selected);

  return {
    candidates,
    counters: GAP_COUNTERS,
    currentRuntimeEvidence: CURRENT_RUNTIME_EVIDENCE,
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

describe("post-V1 next numeric coverage gap after floor user-material low-density exact ASTM lab-airborne companion basis-integrity", () => {
  it("selects the bounded target-output independence owner after four ROI iterations", () => {
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

  it("pins the current numeric evidence as calculator runtime scope, not process cleanup", () => {
    const evidence = summarizeGapRerank().currentRuntimeEvidence;

    expect(evidence.singleOutputSuppression).toMatchObject({
      currentUnsupportedOutputShapes: [["Rw"], ["C"], ["Ln,w"]],
      dormantOwnedValues: {
        C: -5.5,
        DeltaLw: 24.3,
        LnW: 64.3,
        Rw: 53
      }
    });
    expect(evidence.buildingPredictionPartialOutputSuppression).toMatchObject({
      currentSupportedOutputs: ["R'w", "DnT,w", "AIIC"],
      currentUnsupportedOutputs: ["Rw", "C", "L'nT,50"],
      dormantOwnedValues: {
        AIIC: 50,
        C: -5.5,
        LPrimeNT50: 66.7,
        Rw: 53
      }
    });
  });

  it("keeps the selected owner runtime-moving while blocking metric aliasing and non-goal work", () => {
    const candidates = summarizeGapRerank().candidates;
    const selected = candidates.find((candidate) => candidate.selected);

    expect(selected).toMatchObject({
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 4,
      expectedNextCalculableTargetOutputs: 7,
      expectedNextRuntimeBasisPromotions: 4,
      expectedNextRuntimeValuesMoved: 7,
      selected: true,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "C", "Ln,w", "L'nT,50"]
    });
    expect(candidates.find((candidate) => candidate.id === "floor.low_density_exact_astm_stc_ctr_companion_promotion")).toMatchObject({
      selected: false,
      sliceKind: "boundary_owner"
    });
    expect(candidates.find((candidate) => candidate.id === "floor.low_density_broad_source_crawl_or_formula_retune")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
    });
    expect(candidates.find((candidate) => candidate.id === "ui_or_report_assistant_followup")).toMatchObject({
      selected: false,
      sliceKind: "blocked_non_goal"
    });
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
      expect(content, path).toContain("candidateCount: 8");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 7");
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
