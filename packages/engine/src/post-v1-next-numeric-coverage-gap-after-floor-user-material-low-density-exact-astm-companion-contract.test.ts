import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_companion_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_floor_user_material_low_density_exact_astm_companion_owner_landed_runtime_selected_coverage_refresh";

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-companion-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_low_density_exact_astm_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const GAP_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_companion_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-companion-contract.test.ts";
const GAP_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_COMPANION_PLAN_2026-06-16.md";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_direct_flanking_companion_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-direct-flanking-companion-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_DIRECT_FLANKING_COMPANION_OWNER_PLAN_2026-06-16.md";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material low-density exact ASTM direct-flanking companion owner";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_low_density_exact_astm_direct_flanking_companion_owner";

const GAP_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableLayerTemplates: 0,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextCalculableTargetOutputs: 17,
  estimatedNextRuntimeBasisPromotions: 2,
  estimatedNextRuntimeValuesMoved: 17,
  frontendImplementationFilesTouched: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const ROI_ANALYSIS_ITERATIONS = [
  {
    conclusion:
      "Subtract the just-closed low-density exact ASTM ISO/field-K companion lane and all earlier heavy visible floating-floor ASTM lanes.",
    iteration: 1
  },
  {
    conclusion:
      "Probe exact ASTM plus explicit direct+flanking field/building context. The construction has owned exact ASTM bands, lightweight-family ISO companions, and direct+flanking path inputs, but the current direct-flanking adapter breaks ASTM metric-basis integrity.",
    iteration: 2
  },
  {
    conclusion:
      "Reject generic IIC/AIIC aliases, source crawling, invented flanking defaults, building prediction without junction/room context, and formula retunes without holdout evidence.",
    iteration: 3
  },
  {
    conclusion:
      "Select the direct-flanking companion owner because it turns a schema exception into calculated field/building impact companions while preserving the ASTM E989 IIC basis.",
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
      expectedNextRuntimeValuesMoved: 17,
      id: SELECTED_CANDIDATE_ID,
      reason:
        "Exact ASTM lab bands, lightweight-family ISO companions, complete direct+flanking impact context, and complete building room/junction context are already present. The open gap is runtime composition: direct-flanking field/building companions must not overwrite the ASTM E989 IIC basis.",
      score: 97,
      selected: true,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: [
        "R'w",
        "Dn,w",
        "Dn,A",
        "DnT,w",
        "DnT,A",
        "Ln,w",
        "DeltaLw",
        "L'n,w",
        "L'nT,w",
        "L'nT,50",
        "IIC"
      ]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_low_density_exact_astm_companion_owner",
      reason: "Closed by the previous owner and protected by the just-landed coverage refresh.",
      score: 24,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50", "IIC", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_low_density_exact_astm_airborne_companion_closed_lane",
      reason: "Re-probe showed low-density exact ASTM requests already surface STC, C, and Ctr where lab/field context allows them.",
      score: 20,
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
      id: "floor.user_material_low_density_exact_astm_embedded_dynamic_stiffness_closed_lane",
      reason: "Re-probe showed the alternate material-level dynamic-stiffness input surface already reaches the live lightweight route.",
      score: 18,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.low_density_building_prediction_without_flanking_context",
      reason:
        "Rejected because building outputs require explicit room, junction, and direct+flanking context; using defaults would weaken ISO 12354 ownership.",
      score: -85,
      selected: false,
      sliceKind: "input_surface_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.generic_astm_iic_aiic_aliasing",
      reason:
        "Rejected because generic IIC/AIIC without exact ASTM E492/E1007 bands would alias standards instead of calculating an owned ASTM rating.",
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
      id: "floor.low_density_formula_retune_without_holdout",
      reason: "Rejected because formula retuning without measured holdouts would reduce numeric defensibility.",
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
      id: "floor.low_density_broad_source_crawl",
      reason: "Rejected because source crawling without a selected formula/anchor route is not the highest-ROI calculator slice.",
      score: -50,
      selected: false,
      sliceKind: "source_research",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Ln,w", "DeltaLw", "IIC", "AIIC"]
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

describe("post-V1 next numeric coverage gap after floor user-material low-density exact ASTM companion", () => {
  it("selects the direct-flanking companion owner after four ROI iterations", () => {
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

  it("ties the selected owner to runtime value movement and rejects non-goal work", () => {
    const candidates = summarizeGapRerank().candidates;
    const selected = candidates.find((candidate) => candidate.selected);

    expect(selected).toMatchObject({
      currentFormulaInputsAvailable: true,
      expectedNextCalculableRequestShapes: 2,
      expectedNextRuntimeBasisPromotions: 2,
      expectedNextRuntimeValuesMoved: 17,
      selected: true,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(candidates.find((candidate) => candidate.id === "floor.generic_astm_iic_aiic_aliasing")).toMatchObject({
      selected: false,
      sliceKind: "boundary_owner"
    });
    expect(candidates.find((candidate) => candidate.id === "floor.low_density_broad_source_crawl")).toMatchObject({
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
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 17");
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
