import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_opening_facade_door_window_frequency_input_boundary_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_frequency_input_boundary_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-frequency-input-boundary-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_FREQUENCY_INPUT_BOUNDARY_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_frequency_input_boundary_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_building_lab_companion_target_output_independence_owner";

const SELECTED_CANDIDATE_ID =
  "opening.facade_door_window_building_lab_companion_target_output_independence_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_door_window_building_lab_companion_target_output_independence_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-building-lab-companion-target-output-independence-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-25.md";
const SELECTED_NEXT_LABEL =
  "post-V1 opening/facade door/window building lab-companion target-output independence owner";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableRequestShapes: 4,
  estimatedNextCalculableTargetOutputs: 2,
  estimatedNextRequiredPhysicalInputsCaptured: 0,
  estimatedNextRuntimeBasisPromotions: 4,
  estimatedNextRuntimeValuesMoved: 8,
  estimatedNextUnsupportedBoundariesProtected: 6,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_already_landed"
  | "rejected_holdout_not_admissible"
  | "rejected_missing_schema_or_adapter"
  | "rejected_parallel_support_lane"
  | "rejected_stale_repeat"
  | "selected_runtime_basis_owner";

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

const LAB_OUTPUTS = ["Rw", "STC"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_OUTPUTS = [
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
    actionItems: ["action_1_frequency_first_backbone", "action_3_openings_facades", "action_4_building_flanking"],
    decision: "selected_runtime_basis_owner",
    estimatedNextCalculableRequestShapes: RERANK_COUNTERS.estimatedNextCalculableRequestShapes,
    estimatedNextRuntimeValuesMoved: RERANK_COUNTERS.estimatedNextRuntimeValuesMoved,
    id: SELECTED_CANDIDATE_ID,
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-owner.ts",
      "packages/engine/src/dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor.ts",
      "packages/engine/src/dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter.ts",
      "packages/engine/src/calculate-assembly.ts"
    ],
    reason:
      "The just-landed boundary captures complete indoor door/window/facade physical inputs and keeps field/building facade outputs unsupported, but current field/building contexts still park the owned Gate S/Gate AH lab Rw/STC companions. A cloned element-lab companion route moves real runtime values without copying lab values into R'w, Dn,w, DnT,w, OITC, or impact outputs.",
    routeFamily: "opening.facade_door_window.building_lab_companion_target_output_independence",
    selected: true,
    selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
    targetOutputs: [...LAB_OUTPUTS, ...FIELD_BUILDING_OUTPUTS],
    unsupportedBoundaries: [
      "no facade field/building promotion without owned adapter",
      "no outdoor-indoor or OITC promotion without owned spectrum adapter",
      "no ASTM/ISO metric aliasing",
      "no impact fallback",
      "no support widening beyond requested lab companions",
      "no source-row import"
    ]
  },
  {
    actionItems: ["action_6_input_capture"],
    decision: "rejected_stale_repeat",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_frequency_input_boundary_owner",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-owner-contract.test.ts",
      PREVIOUS_COVERAGE_FILE
    ],
    reason:
      "The frequency-input boundary and coverage refresh have already landed. Repeating them would be a support-only loop with no new calculator behavior.",
    routeFamily: "opening.facade_door_window.frequency_input_boundary",
    selected: false,
    targetOutputs: [...LAB_OUTPUTS, ...FIELD_BUILDING_OUTPUTS, "OITC"],
    unsupportedBoundaries: ["no stale repeat of the just-landed boundary owner"]
  },
  {
    actionItems: ["action_3_openings_facades"],
    decision: "rejected_missing_schema_or_adapter",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_outdoor_indoor_oitc_runtime_owner",
    implementationEvidencePaths: [
      "packages/shared/src/api/estimate.ts",
      "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-owner.ts"
    ],
    reason:
      "OITC-like outdoor-indoor prediction is strategically important, but requested outputs and the owned outdoor-indoor spectral adapter are not present yet. Selecting it now would invite scalar facade aliasing.",
    routeFamily: "opening.facade_outdoor_indoor.oitc",
    selected: false,
    targetOutputs: ["OITC"],
    unsupportedBoundaries: ["no OITC schema or outdoor-indoor adapter shortcut"]
  },
  {
    actionItems: ["action_3_openings_facades"],
    decision: "rejected_missing_schema_or_adapter",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.stc_single_number_scalar_rating_owner",
    implementationEvidencePaths: [
      "packages/shared/src/domain/airborne-context.ts",
      "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ah-opening-leak-stc-spectrum-adapter-contract.test.ts"
    ],
    reason:
      "The shared input model intentionally has elementRwDb rather than elementStcDb, and Gate AH owns STC only from the shifted spectrum. A scalar STC opening rating route would be an ASTM/ISO alias until a separate conversion owner exists.",
    routeFamily: "opening.element_lab.stc_single_number",
    selected: false,
    targetOutputs: ["STC"],
    unsupportedBoundaries: ["no STC scalar opening rating alias"]
  },
  {
    actionItems: ["action_2_floor_impact_depth"],
    decision: "rejected_already_landed",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "floor.helper_only_timber_open_web_impact_stack",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-floor-helper-only-timber-open-web-impact-stack-runtime-corridor-contract.test.ts",
      "packages/engine/src/post-v1-floor-helper-only-timber-open-web-impact-stack-coverage-refresh-contract.test.ts"
    ],
    reason:
      "The helper-only timber/open-web impact stack formula, runtime corridor, surface parity, and coverage refresh are already landed.",
    routeFamily: "floor.helper_only_timber_open_web.impact",
    selected: false,
    targetOutputs: IMPACT_OUTPUTS,
    unsupportedBoundaries: ["no repeat of landed floor impact owner"]
  },
  {
    actionItems: ["action_2_floor_impact_depth"],
    decision: "rejected_already_landed",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "floor.steel_suspended_ceiling_delta_lw_owner",
    implementationEvidencePaths: [
      "packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-surface-parity-contract.ts"
    ],
    reason:
      "The steel suspended-ceiling DeltaLw path already has a visible surface parity contract with unsupported IIC and L'nT,50 boundaries.",
    routeFamily: "floor.steel_suspended_ceiling.delta_lw",
    selected: false,
    targetOutputs: ["Ln,w", "DeltaLw", "IIC"],
    unsupportedBoundaries: ["no repeat of landed steel DeltaLw owner"]
  },
  {
    actionItems: ["action_5_calibration_holdout"],
    decision: "rejected_holdout_not_admissible",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.common_wall_same_basis_holdout_retune",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-wall-opening-leak-common-wall-same-basis-holdout-packet-contract.test.ts",
      "packages/engine/src/post-v1-opening-leak-common-wall-same-basis-residual-owner-gate-fb-contract.test.ts"
    ],
    reason:
      "The local holdout packet did not admit a same-basis tolerance retune. Retuning from catalog-like rows would violate the evidence semantics.",
    routeFamily: "opening.leak.same_basis_holdout",
    selected: false,
    targetOutputs: LAB_OUTPUTS,
    unsupportedBoundaries: ["no calibration retune without admissible same-family same-basis holdouts"]
  },
  {
    actionItems: ["action_7_rerank_stop_conditions"],
    decision: "rejected_parallel_support_lane",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "broad_source_crawl_or_frontend_input_polish",
    implementationEvidencePaths: [
      "docs/calculator/INDUSTRY_GRADE_CALCULATOR_GAP_ANALYSIS_AND_ROUTE_SELECTION_GUARD_2026-06-25.md",
      "docs/calculator/WORKBENCH_V2_ROUTE_INPUT_VALIDATION_AND_NEEDS_INPUT_FIX_PLAN_2026-06-24.md"
    ],
    reason:
      "Source discovery and input-surface polish are useful support lanes, but the current slice needs a bounded runtime/basis owner rather than another support-only loop.",
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

describe("post-V1 runtime-first route-family rerank after opening/facade door/window frequency-input boundary coverage refresh", () => {
  it("lands the no-runtime rerank and selects the building lab-companion owner", () => {
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    expect(PREVIOUS_COVERAGE_ACTION).toBe(
      "post_v1_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan"
    );
    expect(PREVIOUS_COVERAGE_STATUS).toContain(
      "selected_runtime_first_route_family_rerank_after_opening_facade_door_window_frequency_input_boundary_coverage_refresh"
    );
    expect(RERANK_ACTION).toBe(
      "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_frequency_input_boundary_coverage_refresh_plan"
    );
    expect(RERANK_STATUS).toContain(
      "selected_opening_facade_door_window_building_lab_companion_target_output_independence_owner"
    );
    expect(selectedCandidate()).toMatchObject({
      decision: "selected_runtime_basis_owner",
      id: SELECTED_CANDIDATE_ID,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION
    });
    expect(RERANK_COUNTERS).toMatchObject({
      candidateCount: CANDIDATES.length,
      estimatedNextCalculableRequestShapes: 4,
      estimatedNextCalculableTargetOutputs: 2,
      estimatedNextRuntimeBasisPromotions: 4,
      estimatedNextRuntimeValuesMoved: 8,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("ranks a bounded runtime/basis owner above stale repeats, aliases, holdout retunes, and support work", () => {
    const decisionsById = new Map(CANDIDATES.map((candidate) => [candidate.id, candidate.decision]));

    expect(decisionsById.get(SELECTED_CANDIDATE_ID)).toBe("selected_runtime_basis_owner");
    expect(decisionsById.get("opening.facade_door_window_frequency_input_boundary_owner")).toBe(
      "rejected_stale_repeat"
    );
    expect(decisionsById.get("opening.facade_outdoor_indoor_oitc_runtime_owner")).toBe(
      "rejected_missing_schema_or_adapter"
    );
    expect(decisionsById.get("opening.stc_single_number_scalar_rating_owner")).toBe(
      "rejected_missing_schema_or_adapter"
    );
    expect(decisionsById.get("opening.common_wall_same_basis_holdout_retune")).toBe(
      "rejected_holdout_not_admissible"
    );
    expect(decisionsById.get("broad_source_crawl_or_frontend_input_polish")).toBe(
      "rejected_parallel_support_lane"
    );

    expect(selectedCandidate()?.reason).toMatch(/without copying lab values into R'w, Dn,w, DnT,w, OITC, or impact/i);
    expect(selectedCandidate()?.unsupportedBoundaries).toEqual(
      expect.arrayContaining([
        "no facade field/building promotion without owned adapter",
        "no outdoor-indoor or OITC promotion without owned spectrum adapter",
        "no impact fallback"
      ])
    );
  });

  it("keeps current docs and current-gate runner aligned with the selected owner", () => {
    for (const path of CURRENT_AUTHORITY_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(RERANK_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-frequency-input-boundary-coverage-refresh-contract.test.ts");
    expect(runner).toContain("src/post-v1-opening-facade-door-window-building-lab-companion-target-output-independence-owner-contract.test.ts");
  });
});
