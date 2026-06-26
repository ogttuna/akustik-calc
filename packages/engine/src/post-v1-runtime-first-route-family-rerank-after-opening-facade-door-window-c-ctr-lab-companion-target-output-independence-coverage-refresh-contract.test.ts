import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_C_CTR_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_acoustic_rating_input_boundary_owner";

const SELECTED_CANDIDATE_ID =
  "opening.facade_door_window_acoustic_rating_input_boundary_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_door_window_acoustic_rating_input_boundary_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-acoustic-rating-input-boundary-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_ACOUSTIC_RATING_INPUT_BOUNDARY_OWNER_PLAN_2026-06-25.md";
const SELECTED_NEXT_LABEL =
  "post-V1 opening/facade door/window acoustic-rating input boundary owner";

const RERANK_COUNTERS = {
  candidateCount: 9,
  estimatedNextCalculableRequestShapes: 0,
  estimatedNextCalculableTargetOutputs: 0,
  estimatedNextRequiredPhysicalInputsCaptured: 1,
  estimatedNextRuntimeBasisPromotions: 0,
  estimatedNextRuntimeValuesMoved: 0,
  estimatedNextUnsupportedBoundariesProtected: 6,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_already_landed"
  | "rejected_missing_schema_or_adapter"
  | "rejected_missing_admissible_holdout"
  | "rejected_parallel_support_lane"
  | "selected_input_boundary_owner";

type Candidate = {
  readonly actionItems: readonly string[];
  readonly decision: CandidateDecision;
  readonly estimatedNextRequiredPhysicalInputsCaptured: number;
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
    actionItems: ["action_3_openings_facades", "action_6_input_capture"],
    decision: "selected_input_boundary_owner",
    estimatedNextRequiredPhysicalInputsCaptured:
      RERANK_COUNTERS.estimatedNextRequiredPhysicalInputsCaptured,
    estimatedNextRuntimeValuesMoved: RERANK_COUNTERS.estimatedNextRuntimeValuesMoved,
    id: SELECTED_CANDIDATE_ID,
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-owner.ts",
      "packages/engine/src/dynamic-airborne-gate-r-opening-leak-composite-transmission-loss-formula-corridor.ts",
      "packages/engine/src/dynamic-airborne-gate-q-opening-leak-composite-transmission-loss-input-contract.ts",
      "packages/shared/src/domain/input-completeness.ts"
    ],
    reason:
      "The C/Ctr owner made the spectrum companion route useful, but complete-looking door/window/facade requests without openingElementRwDb still fall through to generic unsupported or host-wall parking. The next safest calculator move is a vertical input-boundary owner that asks for the actual opening acoustic rating before Gate S, C/Ctr companions, or field/building leakage adapters can run.",
    routeFamily: "opening.facade_door_window.acoustic_rating_input_boundary",
    selected: true,
    selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
    targetOutputs: [...OPENING_LAB_OUTPUTS, ...OPENING_FIELD_BUILDING_OUTPUTS],
    unsupportedBoundaries: [
      "no host-wall value substitution for missing openingElementRwDb",
      "no generic door/window label shortcut",
      "no scalar STC opening rating alias",
      "no outdoor-indoor facade or OITC promotion",
      "no impact fallback",
      "no source-row import"
    ]
  },
  {
    actionItems: ["action_3_openings_facades"],
    decision: "rejected_already_landed",
    estimatedNextRequiredPhysicalInputsCaptured: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_c_ctr_lab_companion_target_output_independence_owner",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-owner-contract.test.ts",
      PREVIOUS_COVERAGE_FILE
    ],
    reason:
      "The C/Ctr lab-companion runtime and refresh are already landed; repeating them would not improve input capture or route scope.",
    routeFamily: "opening.facade_door_window.c_ctr_lab_companion_target_output_independence",
    selected: false,
    targetOutputs: ["C", "Ctr"],
    unsupportedBoundaries: ["no stale repeat of the just-landed C/Ctr owner"]
  },
  {
    actionItems: ["action_3_openings_facades", "action_4_building_flanking"],
    decision: "rejected_already_landed",
    estimatedNextRequiredPhysicalInputsCaptured: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_indoor_field_building_adapter_owner",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-opening-facade-door-window-indoor-field-building-adapter-owner-contract.test.ts",
      "packages/engine/src/post-v1-opening-facade-door-window-indoor-field-building-adapter-coverage-refresh-contract.test.ts"
    ],
    reason:
      "The indoor field/building adapter is already live for complete openingElementRwDb inputs. The remaining gap is missing acoustic rating capture, not another adapter repeat.",
    routeFamily: "opening.facade_door_window.indoor_partition_field_building_adapter",
    selected: false,
    targetOutputs: OPENING_FIELD_BUILDING_OUTPUTS,
    unsupportedBoundaries: ["no stale repeat of field/building owner"]
  },
  {
    actionItems: ["action_3_openings_facades"],
    decision: "rejected_missing_schema_or_adapter",
    estimatedNextRequiredPhysicalInputsCaptured: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_outdoor_facade_oitc_owner",
    implementationEvidencePaths: [
      "packages/shared/src/domain/output.ts",
      "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-owner.ts"
    ],
    reason:
      "Outdoor-indoor facade and OITC support still need a schema/output and spectral facade adapter lane. Selecting it before that would invite indoor opening leakage aliases.",
    routeFamily: "opening.facade_outdoor_indoor.oitc",
    selected: false,
    targetOutputs: ["OITC"],
    unsupportedBoundaries: ["no OITC shortcut from indoor partition opening/leak values"]
  },
  {
    actionItems: ["action_3_openings_facades"],
    decision: "rejected_missing_schema_or_adapter",
    estimatedNextRequiredPhysicalInputsCaptured: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_scalar_stc_rating_input_owner",
    implementationEvidencePaths: [
      "packages/shared/src/domain/airborne-context.ts",
      "packages/engine/src/dynamic-airborne-gate-r-opening-leak-composite-transmission-loss-formula-corridor.ts",
      "packages/engine/src/dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter.ts"
    ],
    reason:
      "The input model has elementRwDb, not elementStcDb. Gate AH owns STC from a shifted TL spectrum, so scalar STC opening input remains a conversion owner gap.",
    routeFamily: "opening.element_lab.stc_single_number",
    selected: false,
    targetOutputs: ["STC"],
    unsupportedBoundaries: ["no scalar STC opening rating alias"]
  },
  {
    actionItems: ["action_2_floor_impact_depth"],
    decision: "rejected_already_landed",
    estimatedNextRequiredPhysicalInputsCaptured: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "floor.astm_iic_aiic_exact_band_input_owner",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-owner-gate-eh-contract.test.ts",
      "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts"
    ],
    reason:
      "Exact ASTM E492/E1007/E989 band input and surface parity are already owned. Repeating that route would not address the current opening input capture gap.",
    routeFamily: "floor.astm_iic_aiic.exact_band_input",
    selected: false,
    targetOutputs: ["IIC", "AIIC"],
    unsupportedBoundaries: ["no ISO Ln,w to ASTM IIC/AIIC alias"]
  },
  {
    actionItems: ["action_2_floor_impact_depth"],
    decision: "rejected_already_landed",
    estimatedNextRequiredPhysicalInputsCaptured: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "floor.user_material_dynamic_stiffness_load_basis_field_lanes",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-floor-user-material-impact-context-dynamic-stiffness-owner-contract.test.ts",
      "packages/engine/src/post-v1-floor-user-material-visible-floating-load-basis-owner-contract.test.ts",
      "packages/engine/src/post-v1-floor-user-material-impact-context-field-only-adapter-owner-contract.test.ts"
    ],
    reason:
      "The dynamic-stiffness, visible load-basis, and field-only user-material impact lanes are already landed for their selected stacks.",
    routeFamily: "floor.user_material.impact_context",
    selected: false,
    targetOutputs: IMPACT_OUTPUTS,
    unsupportedBoundaries: ["no repeat of landed floor user-material impact owners"]
  },
  {
    actionItems: ["action_5_calibration_holdout"],
    decision: "rejected_missing_admissible_holdout",
    estimatedNextRequiredPhysicalInputsCaptured: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "floor.raw_bare_and_floating_same_basis_holdout",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-floor-raw-bare-and-floating-same-basis-holdout-gate-fd-contract.test.ts"
    ],
    reason:
      "Gate FD already rejected the candidate because admissible same-basis holdouts were absent. Reopening it now would be evidence theater.",
    routeFamily: "floor.raw_bare_floating.same_basis_holdout",
    selected: false,
    targetOutputs: ["Ln,w", "DeltaLw"],
    unsupportedBoundaries: ["no budget tightening without admissible same-basis holdout rows"]
  },
  {
    actionItems: ["action_7_rerank_stop_conditions"],
    decision: "rejected_parallel_support_lane",
    estimatedNextRequiredPhysicalInputsCaptured: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "broad_source_crawl_or_frontend_polish",
    implementationEvidencePaths: [
      "docs/calculator/INDUSTRY_GRADE_CALCULATOR_GAP_ANALYSIS_AND_ROUTE_SELECTION_GUARD_2026-06-25.md"
    ],
    reason:
      "Source crawling and frontend polish do not outrank a ready calculator input-boundary owner that prevents wrong opening/facade claims.",
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

describe("post-V1 runtime-first route-family rerank after opening/facade door/window C/Ctr coverage refresh", () => {
  it("lands the no-runtime rerank and selects the acoustic-rating input-boundary owner", () => {
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    expect(PREVIOUS_COVERAGE_STATUS).toContain(
      "selected_runtime_first_route_family_rerank_after_opening_facade_door_window_c_ctr_lab_companion"
    );
    expect(RERANK_STATUS).toContain(
      "selected_opening_facade_door_window_acoustic_rating_input_boundary_owner"
    );
    expect(selectedCandidate()).toMatchObject({
      decision: "selected_input_boundary_owner",
      id: SELECTED_CANDIDATE_ID,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION
    });
    expect(RERANK_COUNTERS).toMatchObject({
      candidateCount: CANDIDATES.length,
      estimatedNextRequiredPhysicalInputsCaptured: 1,
      estimatedNextRuntimeValuesMoved: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("ranks missing opening acoustic rating capture above stale repeats, aliases, schema gaps, and support work", () => {
    const decisionsById = new Map(CANDIDATES.map((candidate) => [candidate.id, candidate.decision]));

    expect(decisionsById.get(SELECTED_CANDIDATE_ID)).toBe("selected_input_boundary_owner");
    expect(decisionsById.get("opening.facade_door_window_c_ctr_lab_companion_target_output_independence_owner")).toBe(
      "rejected_already_landed"
    );
    expect(decisionsById.get("opening.facade_door_window_outdoor_facade_oitc_owner")).toBe(
      "rejected_missing_schema_or_adapter"
    );
    expect(decisionsById.get("opening.facade_door_window_scalar_stc_rating_input_owner")).toBe(
      "rejected_missing_schema_or_adapter"
    );
    expect(decisionsById.get("floor.raw_bare_and_floating_same_basis_holdout")).toBe(
      "rejected_missing_admissible_holdout"
    );
    expect(decisionsById.get("broad_source_crawl_or_frontend_polish")).toBe(
      "rejected_parallel_support_lane"
    );

    expect(selectedCandidate()?.reason).toMatch(/openingElementRwDb/i);
    expect(selectedCandidate()?.unsupportedBoundaries).toEqual(
      expect.arrayContaining([
        "no host-wall value substitution for missing openingElementRwDb",
        "no generic door/window label shortcut",
        "no scalar STC opening rating alias",
        "no outdoor-indoor facade or OITC promotion"
      ])
    );
  });

  it("keeps current docs and current-gate runner aligned with the selected owner", () => {
    for (const path of CURRENT_AUTHORITY_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(content, path).toContain(RERANK_ACTION);
      expect(content, path).toContain(RERANK_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("estimatedNextRequiredPhysicalInputsCaptured: 1");
      expect(content, path).toContain("openingElementRwDb");
      expect(content, path).toContain("no support-only loop");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(RERANK_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(SELECTED_NEXT_FILE.replace("packages/engine/", ""));
  });
});
