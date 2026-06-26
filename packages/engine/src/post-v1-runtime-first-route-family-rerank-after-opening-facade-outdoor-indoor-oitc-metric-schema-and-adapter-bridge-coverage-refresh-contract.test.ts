import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_OPENING_FACADE_OUTDOOR_INDOOR_OITC_METRIC_SCHEMA_AND_ADAPTER_BRIDGE_COVERAGE_REFRESH_PLAN_2026-06-26.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh_landed_no_runtime_selected_floor_user_material_impact_lower_treatment_depth_owner";

const SELECTED_CANDIDATE_ID =
  "floor.user_material_impact_lower_treatment_depth_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_floor_user_material_impact_lower_treatment_depth_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-user-material-impact-lower-treatment-depth-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_OWNER_PLAN_2026-06-26.md";
const SELECTED_NEXT_LABEL =
  "post-V1 floor user-material impact lower-treatment depth owner";

const RERANK_COUNTERS = {
  candidateCount: 9,
  estimatedNextCalculableRequestShapes: 3,
  estimatedNextCalculableTargetOutputs: 4,
  estimatedNextRequiredPhysicalInputsCaptured: 2,
  estimatedNextRuntimeBasisPromotions: 3,
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
  | "rejected_direct_runtime_unsafe"
  | "rejected_lower_roi"
  | "rejected_support_prerequisite_deferred"
  | "selected_runtime_scope_owner";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly estimatedNextCalculableRequestShapes: number;
  readonly estimatedNextRuntimeValuesMoved: number;
  readonly id: string;
  readonly reason: string;
  readonly routeFamily: string;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected?: typeof SELECTED_NEXT_ACTION;
  readonly targetOutputs: readonly RequestedOutputId[];
  readonly unsupportedBoundaries: readonly string[];
};

const LAB_AIRBORNE_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const OPENING_FIELD_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
const ASTM_IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const CANDIDATES = [
  {
    decision: "selected_runtime_scope_owner",
    estimatedNextCalculableRequestShapes: RERANK_COUNTERS.estimatedNextCalculableRequestShapes,
    estimatedNextRuntimeValuesMoved: RERANK_COUNTERS.estimatedNextRuntimeValuesMoved,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "After the OITC bridge refresh, direct OITC value calculation is blocked by the missing outdoor-indoor spectral rating adapter. The highest ROI calculator move is to make common user-entered floor impact stacks with explicit lower-treatment depth and support usable through the existing owned impact formula corridors, while missing dynamic stiffness/load/lower-treatment inputs stay needs_input.",
    routeFamily: "floor.user_material_impact.lower_treatment_depth",
    selected: true,
    selectedNextActionIfSelected: SELECTED_NEXT_ACTION,
    targetOutputs: IMPACT_OUTPUTS,
    unsupportedBoundaries: [
      "no ASTM IIC/AIIC alias from ISO Ln,w or DeltaLw",
      "no source-row proximity import for floor improvements",
      "no lower-treatment default when depth or support form is missing",
      "no field L'n,w/L'nT,w without explicit impactFieldContext",
      "no retune of existing heavy/steel formula corridors",
      "no airborne Rw/STC promotion from impact-only inputs",
      "no OITC runtime before ASTM/outdoor-indoor rating adapter ownership"
    ]
  },
  {
    decision: "rejected_direct_runtime_unsafe",
    estimatedNextCalculableRequestShapes: 1,
    estimatedNextRuntimeValuesMoved: 1,
    id: "opening.facade_outdoor_indoor_oitc_direct_spectral_runtime_owner",
    reason:
      "OITC is now requestable and routed to the facade boundary, but the implementation still lacks an ASTM/outdoor-indoor OITC rating procedure, reference contour, and rating-adapter entry. Publishing a value now would require aliasing STC, Rw, NISR/ISR, or indoor DnT,w.",
    routeFamily: "opening.facade_outdoor_indoor.oitc_direct_spectral_runtime",
    selected: false,
    targetOutputs: ["OITC"],
    unsupportedBoundaries: [
      "no STC-to-OITC alias",
      "no Rw-to-OITC alias",
      "no NISR/ISR as OITC aliases",
      "no indoor partition field metric as outdoor-indoor facade metric"
    ]
  },
  {
    decision: "rejected_support_prerequisite_deferred",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_outdoor_indoor_oitc_rating_adapter_basis_owner",
    reason:
      "A dedicated OITC rating adapter is a valid prerequisite, but it is another non-value-moving support slice. Because the user explicitly prioritizes scope, the next selected slice should move calculable floor-impact runtime coverage instead.",
    routeFamily: "opening.facade_outdoor_indoor.oitc_rating_adapter_basis",
    selected: false,
    targetOutputs: ["OITC"],
    unsupportedBoundaries: ["defer until a later OITC runtime chain can move values"]
  },
  {
    decision: "rejected_already_landed",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_owner",
    reason:
      "The metric schema and boundary bridge has landed and the coverage refresh re-probes it; selecting it again would be support-loop drift.",
    routeFamily: "opening.facade_outdoor_indoor.oitc_metric_schema_adapter_bridge",
    selected: false,
    targetOutputs: ["OITC"],
    unsupportedBoundaries: ["no stale repeat of landed OITC input-surface owner"]
  },
  {
    decision: "rejected_already_landed",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "opening.facade_door_window_spectral_field_building_adapter_owner",
    reason:
      "The indoor partition spectral field/building adapter already landed and moved values; the next scope gain must come from another route family.",
    routeFamily: "opening.facade_door_window.spectral_field_building_adapter",
    selected: false,
    targetOutputs: OPENING_FIELD_OUTPUTS,
    unsupportedBoundaries: ["no stale repeat of landed spectral field/building owner"]
  },
  {
    decision: "rejected_lower_roi",
    estimatedNextCalculableRequestShapes: 1,
    estimatedNextRuntimeValuesMoved: 2,
    id: "ceiling.first_class_airborne_or_impact_route_owner",
    reason:
      "Ceiling first-class ownership is strategically important, but current implementation evidence is less ready than floor-impact lower-treatment routing through existing owned corridors.",
    routeFamily: "ceiling.first_class_route_owner",
    selected: false,
    targetOutputs: ["Rw", "DnT,w", "Ln,w", "DeltaLw"],
    unsupportedBoundaries: ["defer until floor user-material impact route has moved"]
  },
  {
    decision: "rejected_lower_roi",
    estimatedNextCalculableRequestShapes: 1,
    estimatedNextRuntimeValuesMoved: 3,
    id: "opening.facade_door_window_user_material_opening_element_input_model",
    reason:
      "User-material openings remain important, but after OITC is blocked on rating-procedure ownership, floor-impact lower-treatment depth opens broader layer-combination coverage with already-owned formulas.",
    routeFamily: "opening.facade_door_window.user_material_opening_element",
    selected: false,
    targetOutputs: LAB_AIRBORNE_OUTPUTS,
    unsupportedBoundaries: ["no arbitrary opening material TL model without a spectral owner"]
  },
  {
    decision: "rejected_lower_roi",
    estimatedNextCalculableRequestShapes: 1,
    estimatedNextRuntimeValuesMoved: 2,
    id: "floor.astm_iic_aiic_user_band_input_surface",
    reason:
      "ASTM IIC/AIIC user-band capture is useful, but it is a cross-surface metric-basis program and should not displace ISO impact scope that can move runtime values now.",
    routeFamily: "floor.impact.astm_iic_aiic_input_surface",
    selected: false,
    targetOutputs: ASTM_IMPACT_OUTPUTS,
    unsupportedBoundaries: ["no IIC/AIIC alias from ISO impact values"]
  },
  {
    decision: "rejected_lower_roi",
    estimatedNextCalculableRequestShapes: 0,
    estimatedNextRuntimeValuesMoved: 0,
    id: "broad_source_crawl_or_frontend_polish",
    reason:
      "Broad source crawling, docs-only work, and frontend polish do not directly expand physically owned calculator scope.",
    routeFamily: "support.parallel_non_runtime",
    selected: false,
    targetOutputs: [],
    unsupportedBoundaries: ["no support-only loop after OITC coverage refresh"]
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

describe("post-V1 runtime-first route-family rerank after opening/facade outdoor-indoor OITC bridge coverage refresh", () => {
  it("lands the no-runtime rerank and selects the floor user-material impact lower-treatment depth owner", () => {
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    expect(PREVIOUS_COVERAGE_STATUS).toContain(
      "selected_runtime_first_route_family_rerank_after_opening_facade_outdoor_indoor_oitc_metric_schema_and_adapter_bridge_coverage_refresh"
    );
    expect(RERANK_STATUS).toContain(
      "selected_floor_user_material_impact_lower_treatment_depth_owner"
    );
    expect(selectedCandidate()).toMatchObject({
      decision: "selected_runtime_scope_owner",
      id: SELECTED_CANDIDATE_ID,
      selectedNextActionIfSelected: SELECTED_NEXT_ACTION
    });
    expect(RERANK_COUNTERS).toMatchObject({
      candidateCount: CANDIDATES.length,
      estimatedNextCalculableRequestShapes: 3,
      estimatedNextCalculableTargetOutputs: 4,
      estimatedNextRuntimeBasisPromotions: 3,
      estimatedNextRuntimeValuesMoved: 8,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("rejects direct OITC runtime until an owned outdoor-indoor rating adapter exists", () => {
    const decisionsById = new Map(CANDIDATES.map((candidate) => [candidate.id, candidate.decision]));

    expect(decisionsById.get(SELECTED_CANDIDATE_ID)).toBe("selected_runtime_scope_owner");
    expect(decisionsById.get("opening.facade_outdoor_indoor_oitc_direct_spectral_runtime_owner")).toBe(
      "rejected_direct_runtime_unsafe"
    );
    expect(decisionsById.get("opening.facade_outdoor_indoor_oitc_rating_adapter_basis_owner")).toBe(
      "rejected_support_prerequisite_deferred"
    );
    expect(decisionsById.get("broad_source_crawl_or_frontend_polish")).toBe("rejected_lower_roi");

    const oitcDirect = CANDIDATES.find(
      (candidate) => candidate.id === "opening.facade_outdoor_indoor_oitc_direct_spectral_runtime_owner"
    );
    expect(oitcDirect?.unsupportedBoundaries).toEqual(
      expect.arrayContaining([
        "no STC-to-OITC alias",
        "no Rw-to-OITC alias",
        "no NISR/ISR as OITC aliases",
        "no indoor partition field metric as outdoor-indoor facade metric"
      ])
    );
  });

  it("proves the selected floor owner is a runtime scope move with explicit input and alias boundaries", () => {
    expect(selectedCandidate()?.targetOutputs).toEqual(["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"]);
    expect(selectedCandidate()?.unsupportedBoundaries).toEqual(
      expect.arrayContaining([
        "no ASTM IIC/AIIC alias from ISO Ln,w or DeltaLw",
        "no source-row proximity import for floor improvements",
        "no lower-treatment default when depth or support form is missing",
        "no field L'n,w/L'nT,w without explicit impactFieldContext",
        "no retune of existing heavy/steel formula corridors"
      ])
    );
    expect(selectedCandidate()?.estimatedNextCalculableRequestShapes).toBeGreaterThan(0);
    expect(selectedCandidate()?.estimatedNextRuntimeValuesMoved).toBeGreaterThan(0);
  });

  it("keeps current docs and current-gate runner aligned with the selected floor owner", () => {
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
    expect(runner).toContain(PREVIOUS_COVERAGE_FILE.replace("packages/engine/", ""));
    expect(runner).toContain(RERANK_FILE.replace("packages/engine/", ""));
  });
});
