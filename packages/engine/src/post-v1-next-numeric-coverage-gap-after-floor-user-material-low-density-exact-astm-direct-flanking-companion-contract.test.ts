import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_landed_runtime_selected_coverage_refresh";

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const GAP_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_direct_flanking_companion_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-direct-flanking-companion-contract.test.ts";
const GAP_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_DIRECT_FLANKING_COMPANION_PLAN_2026-06-16.md";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_direct_flanking_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_FIELD_DIRECT_FLANKING_COMPANION_OWNER_PLAN_2026-06-16.md";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material low-density exact ASTM field direct-flanking companion owner";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_low_density_exact_astm_field_direct_flanking_companion_owner";

const GAP_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableLayerTemplates: 0,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextCalculableTargetOutputs: 6,
  estimatedNextRuntimeBasisPromotions: 2,
  estimatedNextRuntimeValuesMoved: 6,
  frontendImplementationFilesTouched: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const ROI_ANALYSIS_ITERATIONS = [
  {
    conclusion:
      "Subtract the just-closed low-density lab ASTM IIC direct+flanking route, its building airborne companions, and earlier low-density exact ASTM simple-K companions.",
    iteration: 1
  },
  {
    conclusion:
      "Probe exact field ASTM AIIC with the same custom low-density stack and complete direct+flanking field/building context. The engine already owns AIIC, Ln,w, DeltaLw, and building airborne companions, but parks L'n,w, L'nT,w, and L'nT,50.",
    iteration: 2
  },
  {
    conclusion:
      "Reject reusing ASTM E1007 field bands as direct+flanking input, generic AIIC/IIC aliasing, source crawling, and formula retunes. The physically bounded route is to keep ASTM field bands dedicated to AIIC and calculate ISO field companions from the same-stack ISO impact companion plus explicit path inputs.",
    iteration: 3
  },
  {
    conclusion:
      "Select the field direct-flanking companion owner because it moves six real runtime outputs across field and building request shapes without changing source rows, formulas, or frontend surfaces.",
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
      expectedNextRuntimeBasisPromotions: 2,
      expectedNextRuntimeValuesMoved: 6,
      id: SELECTED_CANDIDATE_ID,
      reason:
        "Exact field ASTM AIIC, lightweight-family Ln,w/DeltaLw companions, and explicit direct+flanking field/building inputs are already present. The remaining gap is runtime composition: publish ISO L'n,* companions from the same-stack ISO route while preserving the ASTM E989 AIIC basis.",
      score: 95,
      selected: true,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_low_density_exact_astm_direct_flanking_companion_owner",
      reason: "Closed by the previous runtime owner and protected by the direct-flanking coverage refresh.",
      score: 24,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "L'n,w", "L'nT,w", "L'nT,50", "IIC"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_low_density_exact_astm_simple_k_aiic_closed_lane",
      reason: "Closed by the low-density exact ASTM companion owner and coverage refresh for simple field-K contexts.",
      score: 20,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["AIIC", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_low_density_building_airborne_companion_closed_lane",
      reason: "Complete building airborne R'w/Dn,w/DnT,w companions are already live for the same low-density stack.",
      score: 18,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.field_astm_band_reuse_as_direct_flanking_curve",
      reason:
        "Rejected because ASTM E1007 field bands already include field measurement context; reusing them as direct+flanking source curves would double-count field effects.",
      score: -95,
      selected: false,
      sliceKind: "boundary_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.generic_astm_aiic_iic_aliasing",
      reason:
        "Rejected because generic AIIC/IIC without exact ASTM E1007/E492 bands would alias ASTM ratings from ISO impact metrics.",
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
      id: "floor.low_density_field_direct_flanking_formula_retune_without_holdout",
      reason: "Rejected because formula retuning without measured holdouts would reduce numeric defensibility.",
      score: -90,
      selected: false,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.low_density_field_direct_flanking_broad_source_crawl",
      reason: "Rejected because no source crawl is needed to calculate the selected same-stack formula route.",
      score: -50,
      selected: false,
      sliceKind: "source_research",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["AIIC", "L'n,w", "L'nT,w", "L'nT,50"]
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

describe("post-V1 next numeric coverage gap after floor user-material low-density exact ASTM direct-flanking companion", () => {
  it("selects the field direct-flanking AIIC companion owner after four ROI iterations", () => {
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

  it("keeps the selected owner runtime-moving and rejects unsafe field-band reuse", () => {
    const candidates = summarizeGapRerank().candidates;
    const selected = candidates.find((candidate) => candidate.selected);

    expect(selected).toMatchObject({
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 2,
      expectedNextRuntimeBasisPromotions: 2,
      expectedNextRuntimeValuesMoved: 6,
      selected: true,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(candidates.find((candidate) => candidate.id === "floor.field_astm_band_reuse_as_direct_flanking_curve")).toMatchObject({
      selected: false,
      sliceKind: "boundary_owner"
    });
    expect(candidates.find((candidate) => candidate.id === "floor.low_density_field_direct_flanking_broad_source_crawl")).toMatchObject({
      selected: false,
      sourceRowsRequiredForRuntimeSelection: true
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
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 6");
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
