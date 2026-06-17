import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_OWNER_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_owner_landed_runtime_selected_coverage_refresh";

const PREVIOUS_COVERAGE_REFRESH_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_coverage_refresh_plan";
const PREVIOUS_COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_REFRESH_STATUS =
  "post_v1_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_coverage_refresh_landed_no_runtime_selected_next_numeric_coverage_gap";

const GAP_ACTION =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_plan";
const GAP_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-after-floor-user-material-low-density-exact-astm-field-direct-flanking-companion-contract.test.ts";
const GAP_PLAN_DOC =
  "docs/calculator/POST_V1_NEXT_NUMERIC_COVERAGE_GAP_AFTER_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_FIELD_DIRECT_FLANKING_COMPANION_PLAN_2026-06-16.md";
const GAP_STATUS =
  "post_v1_next_numeric_coverage_gap_after_floor_user_material_low_density_exact_astm_field_direct_flanking_companion_landed_no_runtime_selected_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-low-density-exact-astm-lab-airborne-companion-basis-integrity-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_LOW_DENSITY_EXACT_ASTM_LAB_AIRBORNE_COMPANION_BASIS_INTEGRITY_OWNER_PLAN_2026-06-16.md";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material low-density exact ASTM lab-airborne companion basis-integrity owner";
const SELECTED_CANDIDATE_ID =
  "floor.user_material_low_density_exact_astm_lab_airborne_companion_basis_integrity_owner";

const GAP_COUNTERS = {
  candidateCount: 9,
  estimatedNextAccuracyPromotedRequestShapes: 2,
  estimatedNextAccuracyPromotedTargetOutputs: 4,
  estimatedNextCalculableLayerTemplates: 0,
  estimatedNextCalculableRequestShapes: 1,
  estimatedNextCalculableTargetOutputs: 2,
  estimatedNextRuntimeBasisPromotions: 4,
  estimatedNextRuntimeValuesMoved: 4,
  frontendImplementationFilesTouched: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const CURRENT_RUNTIME_EVIDENCE = {
  buildingPredictionExactFieldAstm: {
    currentLabAirborneUnsupportedOutputs: ["Rw", "STC", "C", "Ctr"] as const,
    currentMetricValues: {
      C: -1.3,
      Ctr: -6.7,
      Rw: 51,
      STC: 51
    },
    floorSystemRatings: {
      C: -5.5,
      Ctr: null,
      Rw: 53,
      basis: "predictor_lightweight_concrete_family_estimate",
      companionSemantic: "rw_plus_c",
      rwPlusC: 47.5
    }
  },
  fieldBetweenRoomsExactFieldAstm: {
    currentMetricValues: {
      C: -1.3,
      Ctr: -6.7,
      Rw: 51,
      STC: 51
    },
    floorSystemRatings: {
      C: -5.5,
      Ctr: null,
      Rw: 53,
      basis: "predictor_lightweight_concrete_family_estimate",
      companionSemantic: "rw_plus_c",
      rwPlusC: 47.5
    },
    supportedByCurrentRuntime: ["Rw", "STC", "C", "Ctr"] as const
  }
} as const;

const ROI_ANALYSIS_ITERATIONS = [
  {
    conclusion:
      "Subtract the just-closed low-density exact ASTM field AIIC direct+flanking owner and its coverage refresh.",
    iteration: 1
  },
  {
    conclusion:
      "Probe the same custom low-density exact ASTM field stack with complete floor-impact, field, and building inputs. The engine now owns AIIC, ISO impact companions, direct+flanking impact companions, and building airborne companions.",
    iteration: 2
  },
  {
    conclusion:
      "Identify the remaining numeric gap: field/building lab-airborne outputs are still tied to the dynamic airborne curve or parked unsupported even though the same-stack floor-system companion carries Rw 53 and Rw + C 47.5.",
    iteration: 3
  },
  {
    conclusion:
      "Select the bounded lab-airborne companion basis-integrity owner for Rw/C only. Reject STC/Ctr companion promotion because the lightweight-family companion currently provides Rw + C, not an STC or Ctr basis.",
    iteration: 4
  }
] as const;

type CandidateKind =
  | "accuracy_owner"
  | "blocked_non_goal"
  | "boundary_owner"
  | "closed_lane"
  | "input_surface_owner"
  | "runtime_owner"
  | "source_research";

type NumericGapCandidate = {
  readonly currentFormulaInputsAvailable: boolean;
  readonly expectedNextAccuracyPromotedRequestShapes: number;
  readonly expectedNextAccuracyPromotedTargetOutputs: number;
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
      expectedNextAccuracyPromotedRequestShapes: 2,
      expectedNextAccuracyPromotedTargetOutputs: 4,
      expectedNextCalculableRequestShapes: 1,
      expectedNextRuntimeBasisPromotions: 4,
      expectedNextRuntimeValuesMoved: 4,
      id: SELECTED_CANDIDATE_ID,
      reason:
        "The same custom low-density exact ASTM stack already has a lightweight-family floor-system lab companion with Rw 53 and Rw + C 47.5. Current field requests return Rw 51/C -1.3 from the dynamic airborne curve, and complete building requests still park Rw/C despite the companion. The bounded owner should use the same-stack companion for Rw/C while keeping exact ASTM AIIC and ISO impact companions unchanged.",
      score: 96,
      selected: true,
      sliceKind: "accuracy_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "C"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextAccuracyPromotedRequestShapes: 0,
      expectedNextAccuracyPromotedTargetOutputs: 0,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_low_density_exact_astm_field_direct_flanking_companion_owner",
      reason: "Closed by the previous runtime owner and protected by the field direct-flanking coverage refresh.",
      score: 24,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["L'n,w", "L'nT,w", "L'nT,50", "AIIC"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextAccuracyPromotedRequestShapes: 0,
      expectedNextAccuracyPromotedTargetOutputs: 0,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_low_density_exact_astm_direct_flanking_companion_owner",
      reason: "Closed by the earlier lab ASTM direct-flanking owner and refresh.",
      score: 22,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "L'n,w", "L'nT,w", "L'nT,50", "IIC"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextAccuracyPromotedRequestShapes: 0,
      expectedNextAccuracyPromotedTargetOutputs: 0,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.user_material_low_density_exact_astm_simple_k_companion_closed_lane",
      reason: "Closed by the low-density exact ASTM companion owner and coverage refresh for simple field-K contexts.",
      score: 20,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w", "L'nT,50"]
    },
    {
      currentFormulaInputsAvailable: true,
      expectedNextAccuracyPromotedRequestShapes: 0,
      expectedNextAccuracyPromotedTargetOutputs: 0,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.visible_floating_exact_astm_mixed_iso_closed_lane",
      reason: "Closed by the visible floating exact-band mixed ISO companion owner and its field-impact follow-up.",
      score: 18,
      selected: false,
      sliceKind: "closed_lane",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC", "Ln,w", "DeltaLw", "Rw", "STC", "C", "Ctr"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextAccuracyPromotedRequestShapes: 0,
      expectedNextAccuracyPromotedTargetOutputs: 0,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.low_density_exact_astm_stc_ctr_companion_promotion",
      reason:
        "Rejected for this owner because the lightweight-family floor companion currently carries Rw + C semantics. Promoting STC or Ctr from it would invent a metric basis.",
      score: -88,
      selected: false,
      sliceKind: "boundary_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["STC", "Ctr"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextAccuracyPromotedRequestShapes: 0,
      expectedNextAccuracyPromotedTargetOutputs: 0,
      expectedNextCalculableRequestShapes: 0,
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
      expectedNextAccuracyPromotedRequestShapes: 0,
      expectedNextAccuracyPromotedTargetOutputs: 0,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "wall_family_runtime_gap_without_current_numeric_probe",
      reason:
        "Rejected for this immediate slice because the current low-density floor gap has complete inputs and exact current-vs-companion numeric evidence. Wall-family widening remains valid but lower confidence for this handoff.",
      score: 8,
      selected: false,
      sliceKind: "input_surface_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "R'w", "DnT,w"]
    },
    {
      currentFormulaInputsAvailable: false,
      expectedNextAccuracyPromotedRequestShapes: 0,
      expectedNextAccuracyPromotedTargetOutputs: 0,
      expectedNextCalculableRequestShapes: 0,
      expectedNextRuntimeBasisPromotions: 0,
      expectedNextRuntimeValuesMoved: 0,
      id: "floor.low_density_broad_source_crawl_or_formula_retune",
      reason:
        "Rejected because the next calculator movement uses an already-owned same-stack companion; no source crawl or formula retune is needed to close this bounded basis-integrity gap.",
      score: -60,
      selected: false,
      sliceKind: "source_research",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: ["Rw", "C", "STC", "Ctr"]
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

describe("post-V1 next numeric coverage gap after floor user-material low-density exact ASTM field direct-flanking companion", () => {
  it("selects the bounded lab-airborne companion basis-integrity owner after four ROI iterations", () => {
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

  it("pins the current numeric evidence that makes this an accuracy slice, not process cleanup", () => {
    const evidence = summarizeGapRerank().currentRuntimeEvidence;

    expect(evidence.fieldBetweenRoomsExactFieldAstm).toMatchObject({
      currentMetricValues: { C: -1.3, Ctr: -6.7, Rw: 51, STC: 51 },
      floorSystemRatings: {
        C: -5.5,
        Ctr: null,
        Rw: 53,
        basis: "predictor_lightweight_concrete_family_estimate",
        companionSemantic: "rw_plus_c",
        rwPlusC: 47.5
      }
    });
    expect(evidence.buildingPredictionExactFieldAstm).toMatchObject({
      currentLabAirborneUnsupportedOutputs: ["Rw", "STC", "C", "Ctr"],
      floorSystemRatings: {
        C: -5.5,
        Ctr: null,
        Rw: 53,
        basis: "predictor_lightweight_concrete_family_estimate",
        companionSemantic: "rw_plus_c"
      }
    });
  });

  it("keeps the selected owner runtime-moving while blocking unsupported metric aliasing", () => {
    const candidates = summarizeGapRerank().candidates;
    const selected = candidates.find((candidate) => candidate.selected);

    expect(selected).toMatchObject({
      currentFormulaInputsAvailable: true,
      expectedNextAccuracyPromotedRequestShapes: 2,
      expectedNextAccuracyPromotedTargetOutputs: 4,
      expectedNextCalculableRequestShapes: 1,
      expectedNextRuntimeBasisPromotions: 4,
      expectedNextRuntimeValuesMoved: 4,
      selected: true,
      sliceKind: "accuracy_owner",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "C"]
    });
    expect(candidates.find((candidate) => candidate.id === "floor.low_density_exact_astm_stc_ctr_companion_promotion")).toMatchObject({
      selected: false,
      sliceKind: "boundary_owner"
    });
    expect(candidates.find((candidate) => candidate.id === "floor.low_density_broad_source_crawl_or_formula_retune")).toMatchObject({
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
      expect(content, path).toContain("candidateCount: 9");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 4");
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
