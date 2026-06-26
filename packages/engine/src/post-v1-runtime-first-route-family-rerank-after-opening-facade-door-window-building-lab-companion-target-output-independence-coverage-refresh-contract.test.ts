import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_indoor_field_building_adapter_owner";

const SELECTED_CANDIDATE_ID =
  "opening.facade_door_window_indoor_field_building_adapter_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_door_window_indoor_field_building_adapter_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-indoor-field-building-adapter-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_INDOOR_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-25.md";
const SELECTED_NEXT_LABEL =
  "post-V1 opening/facade door/window indoor field/building adapter owner";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableRequestShapes: 4,
  estimatedNextCalculableTargetOutputs: 6,
  estimatedNextRequiredPhysicalInputsCaptured: 0,
  estimatedNextRuntimeBasisPromotions: 4,
  estimatedNextRuntimeValuesMoved: 22,
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
    decision: "selected_runtime_owner",
    estimatedNextCalculableRequestShapes: RERANK_COUNTERS.estimatedNextCalculableRequestShapes,
    estimatedNextRuntimeValuesMoved: RERANK_COUNTERS.estimatedNextRuntimeValuesMoved,
    id: SELECTED_CANDIDATE_ID,
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-owner.ts",
      "packages/engine/src/company-internal-opening-leak-building-runtime-corridor.ts",
      "packages/engine/src/dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor.ts",
      "packages/engine/src/calculate-assembly.ts"
    ],
    reason:
      "The lab-companion owner keeps Rw/STC visible, but complete indoor partition door/window/facade field/building requests still have all physical inputs needed by the existing opening/leak area-energy field/building runtime. Selecting this owner opens R'w, Dn,w, Dn,A, DnT,w, DnT,A, and building DnT,A,k without treating outdoor facade/OITC or impact outputs as aliases.",
    routeFamily: "opening.facade_door_window.indoor_partition_field_building_adapter",
    selected: true,
    selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
    targetOutputs: [...LAB_OUTPUTS, ...FIELD_BUILDING_OUTPUTS],
    unsupportedBoundaries: [
      "no outdoor-indoor facade or OITC promotion",
      "no missing-frequency bypass",
      "no impact fallback",
      "no scalar STC opening rating alias",
      "no source-row import",
      "no broad facade prediction"
    ]
  },
  {
    actionItems: ["action_3_openings_facades"],
    decision: "rejected_stale_repeat",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_building_lab_companion_target_output_independence_owner",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-opening-facade-door-window-building-lab-companion-target-output-independence-owner-contract.test.ts",
      PREVIOUS_COVERAGE_FILE
    ],
    reason:
      "The lab-companion owner and coverage refresh are already landed. Repeating them would keep Rw/STC visible but would not widen field/building calculator scope.",
    routeFamily: "opening.facade_door_window.building_lab_companion_target_output_independence",
    selected: false,
    targetOutputs: LAB_OUTPUTS,
    unsupportedBoundaries: ["no stale repeat of the just-landed lab companion owner"]
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
      "Outdoor-indoor facade and OITC support needs a separate output schema and spectral adapter. Selecting it now would invite facade scalar aliasing.",
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
    id: "opening.stc_single_number_scalar_rating_owner",
    implementationEvidencePaths: [
      "packages/shared/src/domain/airborne-context.ts",
      "packages/engine/src/dynamic-airborne-gate-ah-opening-leak-stc-spectrum-adapter.ts"
    ],
    reason:
      "Gate AH owns STC from a shifted transmission-loss spectrum. A scalar element STC route remains an ASTM/ISO alias until a separate conversion owner exists.",
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
      "The helper-only timber/open-web impact stack runtime and coverage refresh are already landed.",
    routeFamily: "floor.helper_only_timber_open_web.impact",
    selected: false,
    targetOutputs: IMPACT_OUTPUTS,
    unsupportedBoundaries: ["no repeat of landed floor impact owner"]
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
      "The local holdout packet did not admit a same-basis tolerance retune. It cannot outrank a current runtime owner.",
    routeFamily: "opening.leak.same_basis_holdout",
    selected: false,
    targetOutputs: LAB_OUTPUTS,
    unsupportedBoundaries: ["no calibration retune without admissible same-family same-basis holdouts"]
  },
  {
    actionItems: ["action_6_input_capture"],
    decision: "rejected_already_landed",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_frequency_input_boundary_owner",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-owner-contract.test.ts",
      "packages/engine/src/post-v1-opening-facade-door-window-frequency-input-boundary-coverage-refresh-contract.test.ts"
    ],
    reason:
      "The frequency-input boundary already captures door/window/facade required inputs and blocks missing-frequency claims.",
    routeFamily: "opening.facade_door_window.frequency_input_boundary",
    selected: false,
    targetOutputs: [...LAB_OUTPUTS, ...FIELD_BUILDING_OUTPUTS],
    unsupportedBoundaries: ["no repeat of landed input boundary owner"]
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
      "Source crawling and frontend input polish are useful support lanes, but the current slice has a bounded runtime owner with complete physical inputs.",
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

describe("post-V1 runtime-first route-family rerank after opening/facade door/window building lab-companion coverage refresh", () => {
  it("lands the no-runtime rerank and selects the indoor field/building adapter owner", () => {
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    expect(PREVIOUS_COVERAGE_STATUS).toContain(
      "selected_runtime_first_route_family_rerank_after_opening_facade_door_window_building_lab_companion_target_output_independence_coverage_refresh"
    );
    expect(RERANK_STATUS).toContain(
      "selected_opening_facade_door_window_indoor_field_building_adapter_owner"
    );
    expect(selectedCandidate()).toMatchObject({
      decision: "selected_runtime_owner",
      id: SELECTED_CANDIDATE_ID,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION
    });
    expect(RERANK_COUNTERS).toMatchObject({
      candidateCount: CANDIDATES.length,
      estimatedNextCalculableRequestShapes: 4,
      estimatedNextCalculableTargetOutputs: 6,
      estimatedNextRuntimeBasisPromotions: 4,
      estimatedNextRuntimeValuesMoved: 22,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("ranks the bounded indoor runtime owner above stale repeats, aliases, holdout retunes, and support work", () => {
    const decisionsById = new Map(CANDIDATES.map((candidate) => [candidate.id, candidate.decision]));

    expect(decisionsById.get(SELECTED_CANDIDATE_ID)).toBe("selected_runtime_owner");
    expect(decisionsById.get("opening.facade_door_window_building_lab_companion_target_output_independence_owner")).toBe(
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

    expect(selectedCandidate()?.reason).toMatch(/existing opening\/leak area-energy field\/building runtime/i);
    expect(selectedCandidate()?.unsupportedBoundaries).toEqual(
      expect.arrayContaining([
        "no outdoor-indoor facade or OITC promotion",
        "no missing-frequency bypass",
        "no impact fallback"
      ])
    );
  });

  it("keeps current docs and current-gate runner aligned with the selected owner", () => {
    for (const path of CURRENT_AUTHORITY_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(RERANK_ACTION);
      expect(content, path).toContain(RERANK_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 22");
      expect(content, path).toContain("no support-only loop");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(RERANK_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(SELECTED_NEXT_FILE.replace("packages/engine/", ""));
  });
});
