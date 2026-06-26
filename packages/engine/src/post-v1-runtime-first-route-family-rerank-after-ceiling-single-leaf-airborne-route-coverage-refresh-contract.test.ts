import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_ceiling_single_leaf_airborne_route_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_ceiling_single_leaf_airborne_route_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_SINGLE_LEAF_AIRBORNE_ROUTE_COVERAGE_REFRESH_PLAN_2026-06-26.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_airborne_route_coverage_refresh_landed_no_runtime_selected_ceiling_single_leaf_field_building_context_adapter_owner";

const SELECTED_CANDIDATE_ID =
  "ceiling.single_leaf_field_building_context_adapter_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_ceiling_single_leaf_field_building_context_adapter_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_OWNER_PLAN_2026-06-26.md";
const SELECTED_NEXT_LABEL =
  "post-V1 ceiling single-leaf field/building context adapter owner";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableRequestShapes: 2,
  estimatedNextCalculableTargetOutputs: 6,
  estimatedNextRequiredPhysicalInputsCaptured: 3,
  estimatedNextRuntimeBasisPromotions: 2,
  estimatedNextRuntimeValuesMoved: 11,
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
  | "rejected_lower_roi"
  | "rejected_support_only"
  | "selected_runtime_owner";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly estimatedRuntimeValuesMoved: number;
  readonly id: string;
  readonly reason: string;
  readonly routeFamily: string;
  readonly selected: boolean;
  readonly targetOutputs: readonly RequestedOutputId[];
  readonly unsupportedBoundaries: readonly string[];
};

const CEILING_FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const CEILING_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const CANDIDATES = [
  {
    decision: "selected_runtime_owner",
    estimatedRuntimeValuesMoved: RERANK_COUNTERS.estimatedNextRuntimeValuesMoved,
    id: SELECTED_CANDIDATE_ID,
    reason:
      "After the ceiling lab route was protected, complete ceiling-only field and building requests still needed route-owned resolver candidates. Runtime already has the direct curve, field overlay, and ISO 12354-1 building corridor; the safe scope gain is to publish those values on route=ceiling instead of falling through floor/wall ownership.",
    routeFamily: "ceiling.single_leaf_airborne.field_building_context",
    selected: true,
    targetOutputs: CEILING_FIELD_BUILDING_OUTPUTS,
    unsupportedBoundaries: [
      "no ceiling field/building value without explicit room context",
      "no lab Rw/STC copy into field or building outputs",
      "no floor impact alias from ceiling boards",
      "no OITC value before outdoor-indoor rating adapter ownership",
      "no ASTM IIC/AIIC alias",
      "no source-row proximity import"
    ]
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "ceiling.single_leaf_airborne_mass_law.source_absent",
    reason:
      "The ceiling element-lab Rw/STC/C/Ctr owner and its coverage refresh already landed.",
    routeFamily: "ceiling.single_leaf_airborne.element_lab",
    selected: false,
    targetOutputs: CEILING_LAB_OUTPUTS,
    unsupportedBoundaries: ["no stale repeat of the landed element-lab ceiling owner"]
  },
  {
    decision: "rejected_direct_runtime_unsafe",
    estimatedRuntimeValuesMoved: 1,
    id: "opening.facade_outdoor_indoor_oitc_direct_spectral_runtime_owner",
    reason:
      "OITC remains high-value, but direct value publication still lacks a named outdoor-indoor OITC rating contour and adapter.",
    routeFamily: "opening.facade_outdoor_indoor.oitc_direct_spectral_runtime",
    selected: false,
    targetOutputs: ["OITC"],
    unsupportedBoundaries: ["no STC-to-OITC alias", "no Rw-to-OITC alias", "no indoor DnT-to-OITC alias"]
  },
  {
    decision: "rejected_lower_roi",
    estimatedRuntimeValuesMoved: 4,
    id: "floor.astm_iic_aiic_exact_band_generalization",
    reason:
      "Explicit ASTM exact-band IIC/AIIC already works on the accepted estimate and impact-only surfaces; the remaining work is not the next highest scope move.",
    routeFamily: "floor.impact.astm_e989",
    selected: false,
    targetOutputs: ["IIC", "AIIC"],
    unsupportedBoundaries: ["no ISO Ln,w or DeltaLw alias into IIC/AIIC"]
  },
  {
    decision: "rejected_lower_roi",
    estimatedRuntimeValuesMoved: 6,
    id: "wall.double_leaf_frequency_backbone_second_pass",
    reason:
      "Frequency-first wall scope remains important, but the current route-owned gap after the ceiling slice is narrower and safer to close.",
    routeFamily: "wall.double_leaf_frequency_backbone",
    selected: false,
    targetOutputs: CEILING_LAB_OUTPUTS,
    unsupportedBoundaries: ["no lab-to-building copy"]
  },
  {
    decision: "rejected_lower_roi",
    estimatedRuntimeValuesMoved: 3,
    id: "floor.user_material_impact_next_depth_variant",
    reason:
      "Floor impact lower-treatment depth has just landed; repeating adjacent floor depth work would be lower immediate route-family ROI than completing ceiling field/building ownership.",
    routeFamily: "floor.user_material_impact",
    selected: false,
    targetOutputs: IMPACT_OUTPUTS,
    unsupportedBoundaries: ["no repeat of the landed lower-treatment depth owner"]
  },
  {
    decision: "rejected_support_only",
    estimatedRuntimeValuesMoved: 0,
    id: "opening.facade_outdoor_indoor_oitc_rating_adapter_basis_owner",
    reason:
      "A future OITC rating adapter is needed, but selecting another support-only adapter would violate the current runtime-first pressure.",
    routeFamily: "opening.facade_outdoor_indoor.oitc_rating_adapter",
    selected: false,
    targetOutputs: ["OITC"],
    unsupportedBoundaries: ["defer until the adapter can move values safely"]
  },
  {
    decision: "rejected_lower_roi",
    estimatedRuntimeValuesMoved: 0,
    id: "broad_source_crawl_or_frontend_polish",
    reason:
      "Broad source crawling, docs-only work, and frontend polish do not directly expand owned calculator scope.",
    routeFamily: "support.parallel_non_runtime",
    selected: false,
    targetOutputs: [],
    unsupportedBoundaries: ["no support-only drift"]
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

describe("post-V1 runtime-first route-family rerank after ceiling single-leaf airborne route coverage refresh", () => {
  it("lands the fresh rerank and selects the ceiling single-leaf field/building context adapter owner", () => {
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    expect(CANDIDATES).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(CANDIDATES.filter((candidate) => candidate.selected)).toHaveLength(1);
    expect(CANDIDATES.find((candidate) => candidate.selected)).toMatchObject({
      decision: "selected_runtime_owner",
      id: SELECTED_CANDIDATE_ID,
      targetOutputs: CEILING_FIELD_BUILDING_OUTPUTS
    });
    expect(RERANK_COUNTERS).toMatchObject({
      estimatedNextCalculableRequestShapes: 2,
      estimatedNextCalculableTargetOutputs: 6,
      estimatedNextRuntimeBasisPromotions: 2,
      estimatedNextRuntimeValuesMoved: 11,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("rejects OITC, ASTM aliases, landed repeats, and support-only work for this selection", () => {
    expect(CANDIDATES.find((candidate) => candidate.id.includes("oitc_direct"))).toMatchObject({
      decision: "rejected_direct_runtime_unsafe"
    });
    expect(CANDIDATES.find((candidate) => candidate.id.includes("astm"))?.unsupportedBoundaries).toEqual(
      expect.arrayContaining(["no ISO Ln,w or DeltaLw alias into IIC/AIIC"])
    );
    expect(CANDIDATES.find((candidate) => candidate.id === "ceiling.single_leaf_airborne_mass_law.source_absent")).toMatchObject({
      decision: "rejected_already_landed"
    });
    expect(CANDIDATES.find((candidate) => candidate.id.includes("rating_adapter"))).toMatchObject({
      decision: "rejected_support_only"
    });
  });

  it("keeps current docs aligned with the selected runtime owner", () => {
    for (const path of CURRENT_AUTHORITY_DOCS) {
      const content = readRepoFile(path);

      expect(content, path).toContain(PREVIOUS_COVERAGE_ACTION);
      expect(content, path).toContain(PREVIOUS_COVERAGE_STATUS);
      expect(content, path).toContain(RERANK_ACTION);
      expect(content, path).toContain(RERANK_STATUS);
      expect(content, path).toContain(SELECTED_CANDIDATE_ID);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(SELECTED_NEXT_LABEL);
      expect(content, path).toContain("estimatedNextCalculableRequestShapes: 2");
      expect(content, path).toContain("estimatedNextCalculableTargetOutputs: 6");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 11");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("not a broad source crawl");
    }
  });
});
