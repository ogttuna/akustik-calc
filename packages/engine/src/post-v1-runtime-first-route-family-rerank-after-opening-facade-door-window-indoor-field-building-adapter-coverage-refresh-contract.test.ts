import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-indoor-field-building-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-indoor-field-building-adapter-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_owner";

const SELECTED_CANDIDATE_ID =
  "opening.facade_door_window_c_ctr_lab_companion_target_output_independence_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-c-ctr-lab-companion-target-output-independence-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_C_CTR_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-25.md";
const SELECTED_NEXT_LABEL =
  "post-V1 opening/facade door/window C/Ctr lab-companion target-output independence owner";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableRequestShapes: 4,
  estimatedNextCalculableTargetOutputs: 2,
  estimatedNextRequiredPhysicalInputsCaptured: 0,
  estimatedNextRuntimeBasisPromotions: 4,
  estimatedNextRuntimeValuesMoved: 8,
  estimatedNextUnsupportedBoundariesProtected: 7,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_already_landed"
  | "rejected_missing_schema_or_adapter"
  | "rejected_parallel_support_lane"
  | "rejected_stale_repeat"
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

const LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
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
    actionItems: ["action_1_frequency_first_backbone", "action_3_openings_facades"],
    decision: "selected_runtime_owner",
    estimatedNextCalculableRequestShapes: RERANK_COUNTERS.estimatedNextCalculableRequestShapes,
    estimatedNextRuntimeValuesMoved: RERANK_COUNTERS.estimatedNextRuntimeValuesMoved,
    id: SELECTED_CANDIDATE_ID,
    implementationEvidencePaths: [
      "packages/engine/src/dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor.ts",
      "packages/engine/src/dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter.ts",
      "packages/engine/src/curve-rating.ts",
      "packages/engine/src/calculate-assembly.ts"
    ],
    reason:
      "The indoor field/building adapter opened apparent and standardized outputs, but C/Ctr remain unsupported even though the existing Gate S opening/leak loss and host-wall transmission-loss curve can produce ISO 717-1 lab spectrum companions without copying lab values into field/building metrics.",
    routeFamily: "opening.facade_door_window.c_ctr_lab_companion_target_output_independence",
    selected: true,
    selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
    targetOutputs: ["C", "Ctr"],
    unsupportedBoundaries: [
      "no field/building C/Ctr alias",
      "no outdoor-indoor facade or OITC promotion",
      "no missing-frequency bypass",
      "no scalar STC rating shortcut",
      "no impact fallback",
      "no source-row import",
      "no broad catalog crawl"
    ]
  },
  {
    actionItems: ["action_3_openings_facades", "action_4_building_flanking"],
    decision: "rejected_stale_repeat",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_indoor_field_building_adapter_owner",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-opening-facade-door-window-indoor-field-building-adapter-owner-contract.test.ts",
      PREVIOUS_COVERAGE_FILE
    ],
    reason:
      "The indoor field/building adapter and coverage refresh are already landed. Repeating them would not open C/Ctr or any new target output.",
    routeFamily: "opening.facade_door_window.indoor_partition_field_building_adapter",
    selected: false,
    targetOutputs: FIELD_BUILDING_OUTPUTS,
    unsupportedBoundaries: ["no stale repeat of the just-landed field/building owner"]
  },
  {
    actionItems: ["action_3_openings_facades"],
    decision: "rejected_stale_repeat",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_building_lab_companion_target_output_independence_owner",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-opening-facade-door-window-building-lab-companion-target-output-independence-owner-contract.test.ts",
      "packages/engine/src/post-v1-opening-facade-door-window-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts"
    ],
    reason:
      "The Rw/STC lab-companion owner is already landed; C/Ctr need a separate companion owner so the support set stays request-scoped.",
    routeFamily: "opening.facade_door_window.rw_stc_lab_companion_target_output_independence",
    selected: false,
    targetOutputs: ["Rw", "STC"],
    unsupportedBoundaries: ["no repeat of landed Rw/STC lab companion owner"]
  },
  {
    actionItems: ["action_3_openings_facades"],
    decision: "rejected_missing_schema_or_adapter",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_outdoor_facade_boundary_owner",
    implementationEvidencePaths: [
      "packages/shared/src/domain/output.ts",
      "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-owner.ts"
    ],
    reason:
      "Outdoor-indoor facade and OITC support need a separate schema/adapter lane. The shared output schema does not currently expose OITC, so this cannot be the immediate runtime owner.",
    routeFamily: "opening.facade_outdoor_indoor.oitc",
    selected: false,
    targetOutputs: ["OITC"],
    unsupportedBoundaries: ["no OITC shortcut from indoor partition opening/leak values"]
  },
  {
    actionItems: ["action_3_openings_facades"],
    decision: "rejected_missing_schema_or_adapter",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_scalar_stc_rating_input_owner",
    implementationEvidencePaths: [
      "packages/shared/src/domain/airborne-context.ts",
      "packages/engine/src/dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter.ts"
    ],
    reason:
      "Gate AH owns STC from a shifted transmission-loss spectrum. A scalar opening STC input remains an alias risk until a conversion owner can prove the metric basis.",
    routeFamily: "opening.element_lab.stc_single_number",
    selected: false,
    targetOutputs: ["STC"],
    unsupportedBoundaries: ["no scalar STC opening rating alias"]
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
      "This impact stack runtime is already landed and is not the immediate opening/facade continuation.",
    routeFamily: "floor.helper_only_timber_open_web.impact",
    selected: false,
    targetOutputs: IMPACT_OUTPUTS,
    unsupportedBoundaries: ["no repeat of landed floor impact owner"]
  },
  {
    actionItems: ["action_6_input_capture"],
    decision: "rejected_missing_schema_or_adapter",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_user_material_opening_element_owner",
    implementationEvidencePaths: [
      "packages/shared/src/domain/airborne-context.ts",
      "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-owner.ts"
    ],
    reason:
      "User-entered opening element material/glazing/seal inputs remain important, but they need a deeper input model before they can safely outrank a calculable C/Ctr spectrum companion.",
    routeFamily: "opening.facade_door_window.user_material_opening_element",
    selected: false,
    targetOutputs: LAB_OUTPUTS,
    unsupportedBoundaries: ["no arbitrary opening-element material claim without required physical inputs"]
  },
  {
    actionItems: ["action_7_rerank_stop_conditions"],
    decision: "rejected_parallel_support_lane",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "broad_source_crawl_or_frontend_input_polish",
    implementationEvidencePaths: [
      "docs/calculator/INDUSTRY_GRADE_CALCULATOR_GAP_ANALYSIS_AND_ROUTE_SELECTION_GUARD_2026-06-25.md"
    ],
    reason:
      "Source crawling and frontend input polish are useful only when tied to an owned calculator slice; this rerank has a bounded runtime owner available now.",
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

describe("post-V1 runtime-first route-family rerank after opening/facade door/window indoor field/building adapter coverage refresh", () => {
  it("lands the no-runtime rerank and selects the C/Ctr lab-companion owner", () => {
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    expect(PREVIOUS_COVERAGE_STATUS).toContain(
      "selected_runtime_first_route_family_rerank_after_opening_facade_door_window_indoor_field_building_adapter_coverage_refresh"
    );
    expect(RERANK_STATUS).toContain(
      "selected_opening_facade_door_window_c_ctr_lab_companion_target_output_independence_owner"
    );
    expect(selectedCandidate()).toMatchObject({
      decision: "selected_runtime_owner",
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

  it("ranks the bounded spectrum companion above stale repeats, aliases, schema gaps, and support work", () => {
    const decisionsById = new Map(CANDIDATES.map((candidate) => [candidate.id, candidate.decision]));

    expect(decisionsById.get(SELECTED_CANDIDATE_ID)).toBe("selected_runtime_owner");
    expect(decisionsById.get("opening.facade_door_window_indoor_field_building_adapter_owner")).toBe(
      "rejected_stale_repeat"
    );
    expect(decisionsById.get("opening.facade_door_window_building_lab_companion_target_output_independence_owner")).toBe(
      "rejected_stale_repeat"
    );
    expect(decisionsById.get("opening.facade_door_window_outdoor_facade_boundary_owner")).toBe(
      "rejected_missing_schema_or_adapter"
    );
    expect(decisionsById.get("opening.facade_door_window_scalar_stc_rating_input_owner")).toBe(
      "rejected_missing_schema_or_adapter"
    );
    expect(decisionsById.get("broad_source_crawl_or_frontend_input_polish")).toBe(
      "rejected_parallel_support_lane"
    );

    expect(selectedCandidate()?.reason).toMatch(/Gate S opening\/leak loss and host-wall transmission-loss curve/i);
    expect(selectedCandidate()?.unsupportedBoundaries).toEqual(
      expect.arrayContaining([
        "no field/building C/Ctr alias",
        "no outdoor-indoor facade or OITC promotion",
        "no missing-frequency bypass",
        "no impact fallback"
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
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 8");
      expect(content, path).toContain("no support-only loop");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(RERANK_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(SELECTED_NEXT_FILE.replace("packages/engine/", ""));
  });
});
