import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_floor_user_material_impact_context_field_only_adapter_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_floor_user_material_impact_context_field_only_adapter_owner_landed_runtime_selected_coverage_refresh";

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_impact_context_field_only_adapter_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const GAP_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts";
const GAP_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_IMPACT_CONTEXT_FIELD_ONLY_ADAPTER_PLAN_2026-06-15.md";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_impact_context_field_only_adapter_landed_no_runtime_selected_floor_user_material_low_density_floating_floor_family_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_low_density_floating_floor_family_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-floating-floor-family-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_FLOATING_FLOOR_FAMILY_OWNER_PLAN_2026-06-15.md";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material low-density floating-floor family owner";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_low_density_floating_floor_family_owner";

const GAP_COUNTERS = {
  candidateCount: 9,
  estimatedNextCalculableLayerTemplates: 1,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextCalculableTargetOutputs: 6,
  estimatedNextRuntimeValuesMoved: 6,
  frontendImplementationFilesTouched: 0,
  immediateRuntimeValuesMoved: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const ROI_ANALYSIS_ITERATIONS = [
  {
    conclusion:
      "Subtract all closed wall user-material lanes, context-owned heavy floating-floor dynamic stiffness, and field-only heavy floating-floor adapter work because those runtime routes are already owned.",
    iteration: 1
  },
  {
    conclusion:
      "Reject CI50 defaulting and generic IIC/AIIC aliasing: missing low-frequency input stays needs_input, while ASTM ratings require exact ASTM bands or rating ownership.",
    iteration: 2
  },
  {
    conclusion:
      "Re-probe custom low-density concrete floor stacks: existing lightweight-concrete family and DeltaLw corridors are live, but visible custom low-density base materials are blocked by base-structure/family ownership.",
    iteration: 3
  },
  {
    conclusion:
      "Select the low-density user-material floor owner because it can move real Rw, Ln,w, DeltaLw, L'n,w, L'nT,w, and L'nT,50 values through existing owned formulas and field adapters, without source import or formula retune.",
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
      expectedNextRuntimeValuesMoved: 6,
      id: SELECTED_CANDIDATE_ID,
      reason:
        "Custom visible low-density concrete floating-floor stacks already have enough physical inputs for the live lightweight-concrete family, DeltaLw, and field-adapter corridors; the missing piece is routing user material ownership to that family instead of treating it as an invalid heavy-concrete base.",
      score: 95,
      selected: true,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_missing_ci50_low_frequency_default",
      reason:
        "Defaulting CI50 would invent a low-frequency value; keep L'nT,50 tied to explicit ci50_2500Db or an owned spectrum.",
      score: 62,
      selected: false,
      sliceKind: "input_surface_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_heavy_floating_field_only_closed_lane",
      reason:
        "The previous owner already computes heavy custom field-only L'n,w, L'nT,w, and L'nT,50 when dynamic stiffness, load basis, field K, volume, and CI50 are supplied.",
      score: 18,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.astm_iic_aiic_generic_alias_boundary",
      reason:
        "Generic ISO impact outputs must not become ASTM IIC/AIIC aliases; exact ASTM E492/E1007/E989 band/rating ownership remains separate.",
      score: 55,
      selected: false,
      sliceKind: "input_surface_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "broad_source_crawl_for_custom_floor_holdouts",
      reason:
        "Same-family holdouts can tighten budgets later, but broad crawling does not unlock the ready custom low-density calculator route.",
      score: 4,
      selected: false,
      sliceKind: "source_research",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "Ln,w", "DeltaLw"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextRuntimeValuesMoved: 0,
      id: "material_editor_or_ui_cleanup",
      reason:
        "UI/catalog management work does not itself increase this numeric formula route's supported layer combinations.",
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
    throw new Error("Numeric gap after field-only adapter must select low-density floor user-material ownership.");
  }

  return {
    counters: GAP_COUNTERS,
    landedGate: GAP_ACTION,
    noRuntimeValueMovement: true,
    previousCoverageRefresh: {
      selectedNextAction: GAP_ACTION,
      selectedNextFile: GAP_FILE,
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

describe("post-V1 next numeric coverage gap after floor user-material impact context field-only adapter", () => {
  it("lands the no-runtime rerank and selects low-density user-material floor ownership next", () => {
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
    expect(ROI_ANALYSIS_ITERATIONS).toHaveLength(4);
  });

  it("keeps the selected runtime owner ahead of CI50 defaulting, ASTM aliasing, source crawl, and UI work", () => {
    const candidates = rankNumericCoverageCandidates();
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));
    const selected = byId.get(SELECTED_CANDIDATE_ID);

    expect(selected).toMatchObject({
      currentFormulaInputsAvailable: true,
      expectedNextRuntimeValuesMoved: 6,
      selected: true,
      sliceKind: "runtime_owner",
      sourceRowsRequiredForRuntimeSelection: false
    });
    expect(selected?.score).toBeGreaterThan(byId.get("floor.user_material_missing_ci50_low_frequency_default")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("floor.astm_iic_aiic_generic_alias_boundary")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("broad_source_crawl_for_custom_floor_holdouts")?.score ?? 0);
    expect(selected?.score).toBeGreaterThan(byId.get("material_editor_or_ui_cleanup")?.score ?? 0);
  });

  it("ties the active plan and runner to the selected owner", () => {
    for (const path of [
      GAP_PLAN_DOC,
      SELECTED_NEXT_PLAN_DOC,
      "tools/dev/run-calculator-current-gate.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }

    const plan = readRepoFile(GAP_PLAN_DOC);
    expect(plan).toContain(PREVIOUS_COVERAGE_REFRESH_ACTION);
    expect(plan).toContain(PREVIOUS_COVERAGE_REFRESH_FILE);
    expect(plan).toContain(PREVIOUS_COVERAGE_REFRESH_STATUS);
    expect(plan).toContain(GAP_ACTION);
    expect(plan).toContain(GAP_FILE);
    expect(plan).toContain(GAP_STATUS);
    expect(plan).toContain(SELECTED_NEXT_ACTION);
    expect(plan).toContain(SELECTED_NEXT_FILE);
    expect(plan).toContain(SELECTED_NEXT_PLAN_DOC);
    expect(plan).toContain(SELECTED_CANDIDATE_ID);
    expect(plan).toContain("candidateCount 9");
    expect(plan).toContain("roiAnalysisIterations: 4");

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-next-numeric-coverage-gap-after-floor-user-material-impact-context-field-only-adapter-contract.test.ts");
  });
});
