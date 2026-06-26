import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-opening-facade-door-window-spectral-field-building-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-door-window-spectral-field-building-adapter-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_DOOR_WINDOW_SPECTRAL_FIELD_BUILDING_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-26.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh_landed_no_runtime_selected_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner";

const SELECTED_CANDIDATE_ID =
  "opening.facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_OWNER_PLAN_2026-06-26.md";
const SELECTED_NEXT_LABEL =
  "post-V1 opening/facade outdoor-indoor OITC metric schema and adapter bridge owner";

const RERANK_COUNTERS = {
  candidateCount: 9,
  estimatedNextCalculableRequestShapes: 0,
  estimatedNextCalculableTargetOutputs: 0,
  estimatedNextRequiredPhysicalInputsCaptured: 0,
  estimatedNextRuntimeBasisPromotions: 0,
  estimatedNextRuntimeValuesMoved: 0,
  estimatedNextTargetOutputSurfacePromotions: 1,
  estimatedNextUnsupportedBoundariesProtected: 6,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_already_landed"
  | "rejected_direct_runtime_unsafe"
  | "rejected_lower_scope"
  | "rejected_parallel_runtime_candidate"
  | "rejected_parallel_support_lane"
  | "selected_metric_schema_input_surface_owner";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly estimatedNextCalculableRequestShapes: number;
  readonly estimatedNextRuntimeValuesMoved: number;
  readonly estimatedNextTargetOutputSurfacePromotions: number;
  readonly id: string;
  readonly reason: string;
  readonly routeFamily: string;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected?: typeof SELECTED_NEXT_ACTION;
  readonly targetOutputs: readonly RequestedOutputId[];
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
    decision: "selected_metric_schema_input_surface_owner",
    estimatedNextCalculableRequestShapes: RERANK_COUNTERS.estimatedNextCalculableRequestShapes,
    estimatedNextRuntimeValuesMoved: RERANK_COUNTERS.estimatedNextRuntimeValuesMoved,
    estimatedNextTargetOutputSurfacePromotions:
      RERANK_COUNTERS.estimatedNextTargetOutputSurfacePromotions,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "The just-landed spectral field/building adapter closes the indoor partition curve-only gap. The next opening/facade blocker is that outdoor-indoor OITC is not yet a first-class requested output with a protected facade boundary. Selecting the schema and adapter bridge opens the target metric surface without aliasing OITC from STC, Rw, NISR/ISR, or indoor DnT,w.",
    routeFamily: "opening.facade_outdoor_indoor.oitc_metric_schema_adapter_bridge",
    selected: true,
    selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
    targetOutputs: ["OITC"],
    unsupportedBoundaries: [
      "no OITC calculation before an owned outdoor-indoor spectral rating adapter",
      "no STC-to-OITC alias",
      "no Rw-to-OITC alias",
      "no NISR/ISR reuse as facade OITC",
      "no indoor partition DnT,w reuse as facade output",
      "no source-row import"
    ]
  },
  {
    decision: "rejected_direct_runtime_unsafe",
    estimatedNextCalculableRequestShapes: 1,
    estimatedNextRuntimeValuesMoved: 1,
    estimatedNextTargetOutputSurfacePromotions: 0,
    id: "opening.facade_outdoor_indoor_oitc_direct_spectral_runtime_owner",
    reason:
      "A direct OITC runtime is the desired follow-up, but it is unsafe before the shared requested-output schema and facade boundary can carry OITC without falling back to STC, Rw, NISR/ISR, or indoor partition field metrics.",
    routeFamily: "opening.facade_outdoor_indoor.oitc_direct_spectral_runtime",
    selected: false,
    targetOutputs: ["OITC"],
    unsupportedBoundaries: ["no ASTM/outdoor-indoor spectral rating adapter shortcut"]
  },
  {
    decision: "rejected_already_landed",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    estimatedNextTargetOutputSurfacePromotions: 0,
    id: "opening.facade_door_window_spectral_field_building_adapter_owner",
    reason:
      "The spectral field/building adapter and its refresh are already landed and protected in the current gate.",
    routeFamily: "opening.facade_door_window.spectral_field_building_adapter",
    selected: false,
    targetOutputs: FIELD_BUILDING_OUTPUTS,
    unsupportedBoundaries: ["no stale repeat of landed spectral field/building owner"]
  },
  {
    decision: "rejected_lower_scope",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    estimatedNextTargetOutputSurfacePromotions: 0,
    id: "opening.facade_door_window_remaining_lab_companion_hygiene",
    reason:
      "Lab companion hygiene is now lower ROI than opening a missing facade/OITC target metric surface after the spectral field/building adapter landed.",
    routeFamily: "opening.facade_door_window.lab_companion_hygiene",
    selected: false,
    targetOutputs: LAB_OUTPUTS,
    unsupportedBoundaries: ["no support-only lab hygiene selected over OITC target surface"]
  },
  {
    decision: "rejected_lower_scope",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    estimatedNextTargetOutputSurfacePromotions: 0,
    id: "opening.facade_door_window_user_material_opening_element_input_model",
    reason:
      "User-material opening element depth remains important, but OITC currently cannot even be requested on the right facade basis. The schema bridge must land before deeper OITC-capable user-material opening inputs can be meaningful.",
    routeFamily: "opening.facade_door_window.user_material_opening_element",
    selected: false,
    targetOutputs: LAB_OUTPUTS,
    unsupportedBoundaries: ["no arbitrary user-material opening TL model before required output basis exists"]
  },
  {
    decision: "rejected_parallel_runtime_candidate",
    estimatedNextCalculableRequestShapes: 2,
    estimatedNextRuntimeValuesMoved: 6,
    estimatedNextTargetOutputSurfacePromotions: 0,
    id: "floor.user_material_impact_lower_treatment_depth_owner",
    reason:
      "Floor-impact user-material depth is a valid high-ROI runtime lane, but it is a parallel route. The current opening/facade chain has a blocking target-output surface issue that prevents any later OITC runtime from being represented safely.",
    routeFamily: "floor.user_material_impact.lower_treatment_depth",
    selected: false,
    targetOutputs: IMPACT_OUTPUTS,
    unsupportedBoundaries: ["defer to the next global rerank after OITC schema bridge"]
  },
  {
    decision: "rejected_parallel_runtime_candidate",
    estimatedNextCalculableRequestShapes: 1,
    estimatedNextRuntimeValuesMoved: 4,
    estimatedNextTargetOutputSurfacePromotions: 0,
    id: "ceiling.first_class_airborne_or_impact_route_owner",
    reason:
      "Ceiling first-class ownership is strategically important, but it is not the immediate blocker in the selected opening/facade current chain.",
    routeFamily: "ceiling.first_class_route_owner",
    selected: false,
    targetOutputs: ["Rw", "DnT,w", "Ln,w", "DeltaLw"],
    unsupportedBoundaries: ["defer to next global rerank after facade metric surface bridge"]
  },
  {
    decision: "rejected_direct_runtime_unsafe",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    estimatedNextTargetOutputSurfacePromotions: 0,
    id: "opening.facade_outdoor_indoor_nisr_isr_alias_owner",
    reason:
      "NISR/ISR are already requested outputs, but they cannot be treated as OITC or facade airborne aliases. Reusing them would hide the requested metric basis.",
    routeFamily: "opening.facade_outdoor_indoor.invalid_alias",
    selected: false,
    targetOutputs: ["NISR", "ISR"],
    unsupportedBoundaries: ["no NISR/ISR as OITC aliases"]
  },
  {
    decision: "rejected_parallel_support_lane",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    estimatedNextTargetOutputSurfacePromotions: 0,
    id: "broad_source_crawl_or_frontend_polish",
    reason:
      "Source crawling, docs-only work, and frontend polish do not unblock the missing OITC requested-output surface or a calculable facade adapter.",
    routeFamily: "support.parallel_non_runtime",
    selected: false,
    targetOutputs: [],
    unsupportedBoundaries: ["no support-only loop after coverage refresh"]
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

describe("post-V1 runtime-first route-family rerank after opening/facade door/window spectral field/building coverage refresh", () => {
  it("lands the no-runtime rerank and selects the OITC metric schema/adapter bridge owner", () => {
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    expect(PREVIOUS_COVERAGE_STATUS).toContain(
      "selected_runtime_first_route_family_rerank_after_opening_facade_door_window_spectral_field_building_adapter_coverage_refresh"
    );
    expect(RERANK_STATUS).toContain(
      "selected_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner"
    );
    expect(selectedCandidate()).toMatchObject({
      decision: "selected_metric_schema_input_surface_owner",
      id: SELECTED_CANDIDATE_ID,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION
    });
    expect(RERANK_COUNTERS).toMatchObject({
      candidateCount: CANDIDATES.length,
      estimatedNextCalculableRequestShapes: 0,
      estimatedNextCalculableTargetOutputs: 0,
      estimatedNextRuntimeBasisPromotions: 0,
      estimatedNextRuntimeValuesMoved: 0,
      estimatedNextTargetOutputSurfacePromotions: 1,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("rejects direct OITC runtime and alias routes until the metric surface is owned", () => {
    const decisionsById = new Map(CANDIDATES.map((candidate) => [candidate.id, candidate.decision]));

    expect(decisionsById.get(SELECTED_CANDIDATE_ID)).toBe("selected_metric_schema_input_surface_owner");
    expect(decisionsById.get("opening.facade_outdoor_indoor_oitc_direct_spectral_runtime_owner")).toBe(
      "rejected_direct_runtime_unsafe"
    );
    expect(decisionsById.get("opening.facade_outdoor_indoor_nisr_isr_alias_owner")).toBe(
      "rejected_direct_runtime_unsafe"
    );
    expect(decisionsById.get("floor.user_material_impact_lower_treatment_depth_owner")).toBe(
      "rejected_parallel_runtime_candidate"
    );
    expect(decisionsById.get("broad_source_crawl_or_frontend_polish")).toBe(
      "rejected_parallel_support_lane"
    );

    expect(selectedCandidate()?.targetOutputs).toEqual(["OITC"]);
    expect(selectedCandidate()?.unsupportedBoundaries).toEqual(
      expect.arrayContaining([
        "no OITC calculation before an owned outdoor-indoor spectral rating adapter",
        "no STC-to-OITC alias",
        "no Rw-to-OITC alias",
        "no NISR/ISR reuse as facade OITC"
      ])
    );
  });

  it("keeps current docs and current-gate runner aligned with the selected OITC bridge owner", () => {
    for (const path of CURRENT_AUTHORITY_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(content, path).toContain(RERANK_ACTION);
      expect(content, path).toContain(RERANK_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain("estimatedNextTargetOutputSurfacePromotions: 1");
      expect(content, path).toContain("no support-only loop");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain(RERANK_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(SELECTED_NEXT_FILE.replace("packages/engine/", ""));
  });
});
