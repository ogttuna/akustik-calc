import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-spectral-opening-curve-runtime-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-spectral-opening-curve-runtime-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_OPENING_CURVE_RUNTIME_COVERAGE_REFRESH_PLAN_2026-06-25.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_opening_curve_runtime_coverage_refresh_landed_no_runtime_selected_opening_facade_door_window_spectral_field_building_adapter_owner";

const SELECTED_CANDIDATE_ID =
  "opening.facade_door_window_spectral_field_building_adapter_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_door_window_spectral_field_building_adapter_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-spectral-field-building-adapter-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_OWNER_PLAN_2026-06-25.md";
const SELECTED_NEXT_LABEL =
  "post-V1 opening/facade door/window spectral field/building adapter owner";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextCalculableTargetOutputs: 6,
  estimatedNextRequiredPhysicalInputsCaptured: 0,
  estimatedNextRuntimeBasisPromotions: 2,
  estimatedNextRuntimeValuesMoved: 11,
  estimatedNextUnsupportedBoundariesProtected: 5,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_already_landed"
  | "rejected_lower_scope"
  | "rejected_missing_schema_or_adapter"
  | "rejected_parallel_support_lane"
  | "selected_runtime_owner";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly estimatedNextCalculableRequestShapes: number;
  readonly estimatedNextRuntimeValuesMoved: number;
  readonly id: string;
  readonly reason: string;
  readonly routeFamily: string;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected?: typeof SELECTED_NEXT_ACTION;
  readonly targetOutputs: readonly (RequestedOutputId | "OITC")[];
  readonly unsupportedBoundaries: readonly string[];
};

const SPECTRAL_FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];

const CANDIDATES = [
  {
    decision: "selected_runtime_owner",
    estimatedNextCalculableRequestShapes: RERANK_COUNTERS.estimatedNextCalculableRequestShapes,
    estimatedNextRuntimeValuesMoved: RERANK_COUNTERS.estimatedNextRuntimeValuesMoved,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "The spectral opening curve runtime now owns lab Rw/STC/C/Ctr from openingElementTransmissionLossCurve. The largest immediate calculator-scope gain is to adapt that curve-derived composite anchor through the existing field/building physics corridor so indoor door/window/facade requests can calculate apparent and standardized outputs instead of staying unsupported.",
    routeFamily: "opening.facade_door_window.spectral_field_building_adapter",
    selected: true,
    selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
    targetOutputs: SPECTRAL_FIELD_BUILDING_OUTPUTS,
    unsupportedBoundaries: [
      "no lab curve copied directly to field/building outputs",
      "no outdoor-indoor facade or OITC promotion",
      "no impact fallback",
      "no scalar STC-to-Rw shortcut",
      "no source-row import"
    ]
  },
  {
    decision: "rejected_lower_scope",
    estimatedNextCalculableRequestShapes: 1,
    estimatedNextRuntimeValuesMoved: 2,
    id: "opening.facade_door_window_spectral_c_ctr_only_target_output_independence_owner",
    reason:
      "C/Ctr-only spectral lab independence is useful, but it moves fewer request shapes and no field/building outputs. It should follow the broader spectral field/building adapter unless field/building proves unsafe.",
    routeFamily: "opening.facade_door_window.spectral_c_ctr_target_output_independence",
    selected: false,
    targetOutputs: ["C", "Ctr"],
    unsupportedBoundaries: ["no field/building widening"]
  },
  {
    decision: "rejected_already_landed",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_spectral_opening_curve_runtime_owner",
    reason:
      "The spectral opening-curve lab runtime and its coverage refresh are already landed and current-gate protected.",
    routeFamily: "opening.facade_door_window.spectral_opening_curve_runtime",
    selected: false,
    targetOutputs: ["Rw", "STC", "C", "Ctr"],
    unsupportedBoundaries: ["no repeat of landed lab runtime"]
  },
  {
    decision: "rejected_already_landed",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_indoor_field_building_adapter_owner",
    reason:
      "The scalar indoor opening field/building adapter is already landed; this slice must widen the curve-only spectral input model.",
    routeFamily: "opening.facade_door_window.scalar_indoor_field_building_adapter",
    selected: false,
    targetOutputs: SPECTRAL_FIELD_BUILDING_OUTPUTS,
    unsupportedBoundaries: ["no scalar-only repeat"]
  },
  {
    decision: "rejected_missing_schema_or_adapter",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_outdoor_facade_oitc_owner",
    reason:
      "Outdoor-indoor facade and OITC still need a dedicated output/schema and facade-normalization adapter. Selecting it now would risk reusing indoor partition opening/leak values.",
    routeFamily: "opening.facade_outdoor_indoor.oitc",
    selected: false,
    targetOutputs: ["OITC"],
    unsupportedBoundaries: ["no OITC shortcut from indoor partition values"]
  },
  {
    decision: "rejected_already_landed",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_acoustic_rating_input_boundary_owner",
    reason:
      "The scalar acoustic-rating needs_input boundary is already landed and refreshed.",
    routeFamily: "opening.facade_door_window.acoustic_rating_input_boundary",
    selected: false,
    targetOutputs: ["Rw"],
    unsupportedBoundaries: ["no repeat of landed input boundary"]
  },
  {
    decision: "rejected_missing_schema_or_adapter",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "floor_or_ceiling_parallel_runtime_owner",
    reason:
      "Floor/ceiling expansion remains important, but the current selected chain has a ready opening spectral runtime with a direct adapter gap and no support-only loop.",
    routeFamily: "floor.ceiling.parallel_candidate",
    selected: false,
    targetOutputs: ["Ln,w", "DeltaLw", "IIC", "AIIC"],
    unsupportedBoundaries: ["no chain jump before current runtime owner"]
  },
  {
    decision: "rejected_parallel_support_lane",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "broad_source_crawl_or_frontend_polish",
    reason:
      "Broad source crawling, docs-only work, and frontend polish do not outrank a ready runtime owner that opens more field/building outputs.",
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

describe("post-V1 runtime-first route-family rerank after opening/facade door/window spectral opening-curve coverage refresh", () => {
  it("lands the no-runtime rerank and selects the spectral field/building adapter owner", () => {
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    expect(PREVIOUS_COVERAGE_STATUS).toContain(
      "selected_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral"
    );
    expect(RERANK_STATUS).toContain(
      "selected_opening_facade_door_window_spectral_field_building_adapter_owner"
    );
    expect(selectedCandidate()).toMatchObject({
      decision: "selected_runtime_owner",
      id: SELECTED_CANDIDATE_ID,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION
    });
    expect(RERANK_COUNTERS).toMatchObject({
      candidateCount: CANDIDATES.length,
      estimatedNextCalculableRequestShapes: 2,
      estimatedNextCalculableTargetOutputs: 6,
      estimatedNextRuntimeBasisPromotions: 2,
      estimatedNextRuntimeValuesMoved: 11,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("ranks scope-opening field/building output support above lab-only hygiene and support lanes", () => {
    const decisionsById = new Map(CANDIDATES.map((candidate) => [candidate.id, candidate.decision]));

    expect(decisionsById.get(SELECTED_CANDIDATE_ID)).toBe("selected_runtime_owner");
    expect(decisionsById.get("opening.facade_door_window_spectral_c_ctr_only_target_output_independence_owner")).toBe(
      "rejected_lower_scope"
    );
    expect(decisionsById.get("opening.facade_door_window_outdoor_facade_oitc_owner")).toBe(
      "rejected_missing_schema_or_adapter"
    );
    expect(decisionsById.get("broad_source_crawl_or_frontend_polish")).toBe(
      "rejected_parallel_support_lane"
    );

    expect(selectedCandidate()?.targetOutputs).toEqual([...SPECTRAL_FIELD_BUILDING_OUTPUTS]);
    expect(selectedCandidate()?.unsupportedBoundaries).toEqual(
      expect.arrayContaining([
        "no lab curve copied directly to field/building outputs",
        "no outdoor-indoor facade or OITC promotion",
        "no impact fallback"
      ])
    );
  });

  it("keeps current docs and current-gate runner aligned with the selected runtime owner", () => {
    for (const path of CURRENT_AUTHORITY_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(content, path).toContain(RERANK_ACTION);
      expect(content, path).toContain(RERANK_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 11");
      expect(content, path).toContain("spectral field/building adapter");
      expect(content, path).toContain("no support-only loop");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(RERANK_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(SELECTED_NEXT_FILE.replace("packages/engine/", ""));
  });
});
