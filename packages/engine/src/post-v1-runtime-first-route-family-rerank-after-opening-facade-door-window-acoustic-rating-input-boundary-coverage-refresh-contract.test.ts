import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-acoustic-rating-input-boundary-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-acoustic-rating-input-boundary-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_acoustic_rating_input_boundary_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_spectral_opening_curve_runtime_owner";

const SELECTED_CANDIDATE_ID =
  "opening.facade_door_window_spectral_opening_curve_runtime_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_door_window_spectral_opening_curve_runtime_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-spectral-opening-curve-runtime-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_OWNER_PLAN_2026-06-25.md";
const SELECTED_NEXT_LABEL =
  "post-V1 opening/facade door/window spectral opening-curve runtime owner";

const RERANK_COUNTERS = {
  candidateCount: 10,
  estimatedNextCalculableRequestShapes: 3,
  estimatedNextCalculableTargetOutputs: 4,
  estimatedNextRequiredPhysicalInputsCaptured: 1,
  estimatedNextRuntimeBasisPromotions: 3,
  estimatedNextRuntimeValuesMoved: 12,
  estimatedNextUnsupportedBoundariesProtected: 6,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_already_landed"
  | "rejected_lower_roi_after_boundary"
  | "rejected_missing_schema_or_adapter"
  | "rejected_missing_admissible_holdout"
  | "rejected_parallel_support_lane"
  | "selected_runtime_owner";

type Candidate = {
  readonly actionItems: readonly string[];
  readonly decision: CandidateDecision;
  readonly estimatedNextCalculableRequestShapes: number;
  readonly estimatedNextRuntimeValuesMoved: number;
  readonly id: string;
  readonly implementationEvidencePaths: readonly string[];
  readonly reason: string;
  readonly routeFamily: string;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected?: typeof SELECTED_NEXT_ACTION;
  readonly targetOutputs: readonly (RequestedOutputId | "OITC")[];
  readonly unsupportedBoundaries: readonly string[];
};

const OPENING_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const OPENING_FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const CANDIDATES = [
  {
    actionItems: ["action_1_frequency_first_backbone", "action_3_openings_facades"],
    decision: "selected_runtime_owner",
    estimatedNextCalculableRequestShapes: RERANK_COUNTERS.estimatedNextCalculableRequestShapes,
    estimatedNextRuntimeValuesMoved: RERANK_COUNTERS.estimatedNextRuntimeValuesMoved,
    id: SELECTED_CANDIDATE_ID,
    implementationEvidencePaths: [
      "packages/shared/src/domain/rating.ts",
      "packages/shared/src/domain/airborne-context.ts",
      "packages/engine/src/dynamic-airborne-gate-r-opening-leak-composite-transmission-loss-formula-corridor.ts",
      "packages/engine/src/dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor.ts",
      "packages/engine/src/dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter.ts",
      "packages/engine/src/post-v1-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-owner.ts"
    ],
    reason:
      "The acoustic-rating boundary now blocks missing scalar openingElementRwDb safely. The highest-ROI calculator expansion is to accept an explicit door/window/facade opening transmission-loss curve and run the area-energy composite route frequency-first, so user-entered manufacturer or measured band data can calculate Rw/STC/C/Ctr without a scalar Rw alias.",
    routeFamily: "opening.facade_door_window.spectral_opening_curve_runtime",
    selected: true,
    selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
    targetOutputs: OPENING_LAB_OUTPUTS,
    unsupportedBoundaries: [
      "no scalar STC-to-Rw shortcut",
      "no outdoor-indoor facade or OITC promotion",
      "no field/building copy from lab-only spectral curve",
      "no source-row import",
      "no broad catalog crawl",
      "no impact fallback"
    ]
  },
  {
    actionItems: ["action_3_openings_facades", "action_6_input_capture"],
    decision: "rejected_already_landed",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_acoustic_rating_input_boundary_owner",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-opening-facade-door-window-acoustic-rating-input-boundary-owner-contract.test.ts",
      PREVIOUS_COVERAGE_FILE
    ],
    reason:
      "The acoustic-rating boundary is already landed and refreshed; repeating it would not expand calculable layer combinations.",
    routeFamily: "opening.facade_door_window.acoustic_rating_input_boundary",
    selected: false,
    targetOutputs: [...OPENING_LAB_OUTPUTS, ...OPENING_FIELD_BUILDING_OUTPUTS],
    unsupportedBoundaries: ["no repeat of landed openingElementRwDb boundary"]
  },
  {
    actionItems: ["action_3_openings_facades"],
    decision: "rejected_already_landed",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_c_ctr_lab_companion_target_output_independence_owner",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-owner-contract.test.ts",
      "packages/engine/src/post-v1-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-coverage-refresh-contract.test.ts"
    ],
    reason:
      "C/Ctr lab companions are already live for scalar Rw inputs; the next improvement should change the opening input model from scalar to spectral.",
    routeFamily: "opening.facade_door_window.c_ctr_lab_companion_target_output_independence",
    selected: false,
    targetOutputs: ["C", "Ctr"],
    unsupportedBoundaries: ["no stale repeat of C/Ctr owner"]
  },
  {
    actionItems: ["action_3_openings_facades", "action_4_building_flanking"],
    decision: "rejected_already_landed",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_indoor_field_building_adapter_owner",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-opening-facade-door-window-indoor-field-building-adapter-owner-contract.test.ts",
      "packages/engine/src/post-v1-opening-facade-door-window-indoor-field-building-adapter-coverage-refresh-contract.test.ts"
    ],
    reason:
      "Indoor field/building output adapters are already live when the scalar opening rating is complete. Spectral curve support must land before widening that adapter.",
    routeFamily: "opening.facade_door_window.indoor_partition_field_building_adapter",
    selected: false,
    targetOutputs: OPENING_FIELD_BUILDING_OUTPUTS,
    unsupportedBoundaries: ["no lab curve copied into field/building outputs"]
  },
  {
    actionItems: ["action_3_openings_facades"],
    decision: "rejected_lower_roi_after_boundary",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_scalar_stc_rating_input_boundary",
    implementationEvidencePaths: [
      "packages/shared/src/domain/airborne-context.ts",
      "packages/engine/src/dynamic-airborne-gate-r-opening-leak-composite-transmission-loss-formula-corridor.ts"
    ],
    reason:
      "A scalar STC input boundary would improve prompts but not calculation scope. A full TL curve is the better industry-grade input because it preserves frequency content and avoids STC-to-Rw aliases.",
    routeFamily: "opening.element_lab.stc_single_number_boundary",
    selected: false,
    targetOutputs: ["STC"],
    unsupportedBoundaries: ["no scalar STC opening rating alias"]
  },
  {
    actionItems: ["action_3_openings_facades", "action_4_building_flanking"],
    decision: "rejected_missing_schema_or_adapter",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_outdoor_facade_oitc_owner",
    implementationEvidencePaths: [
      "packages/shared/src/domain/output.ts",
      "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-owner.ts"
    ],
    reason:
      "Outdoor-indoor facade and OITC still need a dedicated output/schema and facade normalization adapter. Selecting it before spectral opening input support would risk reusing indoor partition leakage values.",
    routeFamily: "opening.facade_outdoor_indoor.oitc",
    selected: false,
    targetOutputs: ["OITC"],
    unsupportedBoundaries: ["no OITC shortcut from indoor partition opening/leak values"]
  },
  {
    actionItems: ["action_2_floor_impact_depth"],
    decision: "rejected_already_landed",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "floor.astm_iic_aiic_exact_band_input_owner",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh-contract.test.ts",
      "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts"
    ],
    reason:
      "Exact ASTM band input is already owned. This rerank is specifically opening/facade runtime-first after the acoustic-rating boundary.",
    routeFamily: "floor.astm_iic_aiic.exact_band_input",
    selected: false,
    targetOutputs: ["IIC", "AIIC"],
    unsupportedBoundaries: ["no ISO Ln,w to ASTM IIC/AIIC alias"]
  },
  {
    actionItems: ["action_2_floor_impact_depth"],
    decision: "rejected_already_landed",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "floor.user_material_dynamic_stiffness_load_basis_field_lanes",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts",
      "packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-owner-contract.test.ts",
      "packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts"
    ],
    reason:
      "The dynamic-stiffness, load-basis, and field-only user-material impact lanes are already landed for their selected stacks.",
    routeFamily: "floor.user_material.impact_context",
    selected: false,
    targetOutputs: IMPACT_OUTPUTS,
    unsupportedBoundaries: ["no repeat of landed floor user-material impact owners"]
  },
  {
    actionItems: ["action_5_calibration_holdout"],
    decision: "rejected_missing_admissible_holdout",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "floor.raw_bare_and_floating_same_basis_holdout",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts"
    ],
    reason:
      "Gate FD already rejected this route because admissible same-basis holdouts were absent.",
    routeFamily: "floor.raw_bare_floating.same_basis_holdout",
    selected: false,
    targetOutputs: ["Ln,w", "DeltaLw"],
    unsupportedBoundaries: ["no budget tightening without admissible same-basis holdout rows"]
  },
  {
    actionItems: ["action_7_rerank_stop_conditions"],
    decision: "rejected_parallel_support_lane",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "broad_source_crawl_or_frontend_polish",
    implementationEvidencePaths: [
      "docs/calculator/INDUSTRY_GRADE_CALCULATOR_GAP_ANALYSIS_AND_ROUTE_SELECTION_GUARD_2026-06-25.md"
    ],
    reason:
      "Source crawling and frontend polish do not outrank a ready frequency-first opening/facade runtime owner.",
    routeFamily: "support.parallel_non_runtime",
    selected: false,
    targetOutputs: [],
    unsupportedBoundaries: ["no support-only loop after a no-runtime coverage refresh"]
  }
] as const satisfies readonly Candidate[];

const CURRENT_AUTHORITY_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/DOCUMENTATION_MAP.md",
  "docs/calculator/NEXT_AGENT_BRIEF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/README.md",
  "docs/calculator/SYSTEM_MAP.md",
  RERANK_PLAN_DOC,
  SELECTED_NEXT_PLAN_DOC
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function selectedCandidate() {
  return CANDIDATES.find((candidate) => candidate.selected);
}

describe("post-V1 runtime-first route-family rerank after opening/facade door/window acoustic-rating coverage refresh", () => {
  it("lands the no-runtime rerank and selects the spectral opening-curve runtime owner", () => {
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    expect(PREVIOUS_COVERAGE_STATUS).toContain(
      "selected_runtime_first_route_family_rerank_after_opening_facade_door_window_acoustic_rating"
    );
    expect(RERANK_STATUS).toContain(
      "selected_opening_facade_door_window_spectral_opening_curve_runtime_owner"
    );
    expect(selectedCandidate()).toMatchObject({
      decision: "selected_runtime_owner",
      id: SELECTED_CANDIDATE_ID,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION
    });
    expect(RERANK_COUNTERS).toMatchObject({
      candidateCount: CANDIDATES.length,
      estimatedNextCalculableRequestShapes: 3,
      estimatedNextCalculableTargetOutputs: 4,
      estimatedNextRequiredPhysicalInputsCaptured: 1,
      estimatedNextRuntimeBasisPromotions: 3,
      estimatedNextRuntimeValuesMoved: 12,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("ranks frequency-first opening curve runtime above scalar aliases, stale repeats, holdout work, and support lanes", () => {
    const decisionsById = new Map(CANDIDATES.map((candidate) => [candidate.id, candidate.decision]));

    expect(decisionsById.get(SELECTED_CANDIDATE_ID)).toBe("selected_runtime_owner");
    expect(decisionsById.get("opening.facade_door_window_acoustic_rating_input_boundary_owner")).toBe(
      "rejected_already_landed"
    );
    expect(decisionsById.get("opening.facade_door_window_scalar_stc_rating_input_boundary")).toBe(
      "rejected_lower_roi_after_boundary"
    );
    expect(decisionsById.get("opening.facade_door_window_outdoor_facade_oitc_owner")).toBe(
      "rejected_missing_schema_or_adapter"
    );
    expect(decisionsById.get("floor.raw_bare_and_floating_same_basis_holdout")).toBe(
      "rejected_missing_admissible_holdout"
    );
    expect(decisionsById.get("broad_source_crawl_or_frontend_polish")).toBe(
      "rejected_parallel_support_lane"
    );

    expect(selectedCandidate()?.reason).toMatch(/transmission-loss curve/i);
    expect(selectedCandidate()?.unsupportedBoundaries).toEqual(
      expect.arrayContaining([
        "no scalar STC-to-Rw shortcut",
        "no outdoor-indoor facade or OITC promotion",
        "no field/building copy from lab-only spectral curve"
      ])
    );
  });

  it("keeps current docs and current-gate runner aligned with the selected spectral owner", () => {
    for (const path of CURRENT_AUTHORITY_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(content, path).toContain(RERANK_ACTION);
      expect(content, path).toContain(RERANK_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 12");
      expect(content, path).toContain("opening transmission-loss curve");
      expect(content, path).toContain("no support-only loop");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(RERANK_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(SELECTED_NEXT_FILE.replace("packages/engine/", ""));
  });
});
