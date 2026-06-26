import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_floor_user_material_impact_lower_treatment_depth_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-floor-user-material-impact-lower-treatment-depth-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_COVERAGE_REFRESH_PLAN_2026-06-26.md";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_floor_user_material_impact_lower_treatment_depth_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh";

const PREVIOUS_OWNER_ACTION =
  "post_v1_floor_user_material_impact_lower_treatment_depth_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-floor-user-material-impact-lower-treatment-depth-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_floor_user_material_impact_lower_treatment_depth_owner_landed_runtime_selected_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-floor-user-material-impact-lower-treatment-depth-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_FLOOR_USER_MATERIAL_IMPACT_LOWER_TREATMENT_DEPTH_COVERAGE_REFRESH_PLAN_2026-06-26.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_floor_user_material_impact_lower_treatment_depth_coverage_refresh_landed_no_runtime_selected_ceiling_single_leaf_airborne_route_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_ceiling_single_leaf_airborne_route_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_SINGLE_LEAF_AIRBORNE_ROUTE_OWNER_PLAN_2026-06-26.md";
const SELECTED_NEXT_LABEL =
  "post-V1 ceiling single-leaf airborne route owner";
const SELECTED_CANDIDATE_ID =
  "ceiling.single_leaf_airborne_route_owner";

const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];
const ASTM_IMPACT_OUTPUTS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];
const OPENING_OITC_OUTPUTS = ["OITC"] as const satisfies readonly RequestedOutputId[];
const OPENING_FIELD_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

type CandidateDecision =
  | "rejected_already_landed"
  | "rejected_lower_roi"
  | "rejected_prerequisite_only"
  | "rejected_unsafe_without_adapter"
  | "requires_runtime_owner_before_selection"
  | "selected_next";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly id: string;
  readonly reason: string;
  readonly routeFamily: string;
  readonly targetOutputs: readonly RequestedOutputId[];
  readonly unsupportedBoundaries: readonly string[];
};

const CANDIDATES = [
  {
    decision: "selected_next",
    id: SELECTED_CANDIDATE_ID,
    reason:
      "Standalone ceiling-only gypsum board stacks now have enough owned single-leaf mass-law backbone to move real Rw/STC/C/Ctr values while separating the route from floor impact.",
    routeFamily: "ceiling.single_leaf_airborne",
    targetOutputs: ["Rw", "STC", "C", "Ctr"],
    unsupportedBoundaries: [
      "impact outputs remain floor needs_input",
      "field/building ceiling metrics remain unsupported until room/plenum context is owned",
      "OITC remains unsupported without outdoor-indoor contour adapter"
    ]
  },
  {
    decision: "rejected_already_landed",
    id: "floor.user_material_impact_lower_treatment_depth_owner",
    reason:
      "The floor user-material lower-treatment depth owner already moved values and its coverage refresh re-probes those pins.",
    routeFamily: "floor.user_material_impact.lower_treatment_depth",
    targetOutputs: IMPACT_OUTPUTS,
    unsupportedBoundaries: ["do not reopen the same landed owner without a distinct adjacent runtime scope"]
  },
  {
    decision: "rejected_unsafe_without_adapter",
    id: "opening.facade_outdoor_indoor_oitc_direct_spectral_runtime_owner",
    reason:
      "OITC is a high-value facade/opening target, but direct runtime remains unsafe unless the rerank can name an owned outdoor-indoor spectral rating adapter.",
    routeFamily: "opening.facade_outdoor_indoor.oitc_spectral_runtime",
    targetOutputs: OPENING_OITC_OUTPUTS,
    unsupportedBoundaries: ["no STC-to-OITC alias", "no Rw-to-OITC alias", "no NISR/ISR-to-OITC alias"]
  },
  {
    decision: "rejected_prerequisite_only",
    id: "opening.facade_outdoor_indoor_oitc_rating_adapter_basis_owner",
    reason:
      "A rating-adapter owner may be necessary before OITC values can move, but selecting it must be justified against value-moving alternatives.",
    routeFamily: "opening.facade_outdoor_indoor.oitc_rating_adapter_basis",
    targetOutputs: OPENING_OITC_OUTPUTS,
    unsupportedBoundaries: ["no calculated OITC until contour and basis are owned"]
  },
  {
    decision: "requires_runtime_owner_before_selection",
    id: "floor.astm_iic_aiic_rating_adapter_owner",
    reason:
      "North American impact coverage matters, but ASTM ratings need a real rating adapter rather than ISO single-number aliases.",
    routeFamily: "floor.impact.astm_rating_adapter",
    targetOutputs: ASTM_IMPACT_OUTPUTS,
    unsupportedBoundaries: ["no IIC/AIIC alias from ISO Ln,w or DeltaLw"]
  },
  {
    decision: "rejected_already_landed",
    id: "opening.facade_door_window_user_material_opening_element_owner",
    reason:
      "User-material opening/facade spectral element runtime and field/building adapter owners are already landed; the remaining OITC gap is a separate rating contour problem.",
    routeFamily: "opening.facade_door_window.user_material_opening_element",
    targetOutputs: [...WALL_LAB_OUTPUTS, ...OPENING_FIELD_OUTPUTS],
    unsupportedBoundaries: ["no scalar STC/Rw shortcut for arbitrary opening elements"]
  },
  {
    decision: "rejected_lower_roi",
    id: "wall.double_leaf_or_multileaf_user_material_frequency_backbone_owner",
    reason:
      "Frequency-first wall backbone remains important, but the current already-landed multileaf/local-substitution owners leave less immediate value movement than the first-class ceiling route.",
    routeFamily: "wall.user_material.frequency_backbone",
    targetOutputs: WALL_LAB_OUTPUTS,
    unsupportedBoundaries: ["no lab value copy into field/building metrics"]
  }
] as const satisfies readonly Candidate[];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 runtime-first route-family rerank after floor user-material impact lower-treatment depth coverage refresh plan", () => {
  it("lands the fresh rerank and selects the ceiling single-leaf airborne route owner", () => {
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, PREVIOUS_OWNER_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    const plan = readRepoFile(RERANK_PLAN_DOC);
    expect(plan).toContain(RERANK_ACTION);
    expect(plan).toContain(RERANK_FILE);
    expect(plan).toContain(RERANK_STATUS);
    expect(plan).toContain(PREVIOUS_COVERAGE_ACTION);
    expect(plan).toContain(PREVIOUS_COVERAGE_STATUS);
    expect(plan).toContain(PREVIOUS_OWNER_ACTION);
    expect(plan).toContain(PREVIOUS_OWNER_STATUS);
    expect(plan).toContain(SELECTED_CANDIDATE_ID);
    expect(plan).toContain(SELECTED_NEXT_ACTION);
    expect(plan).toContain(SELECTED_NEXT_FILE);
    expect(plan).toContain(SELECTED_NEXT_LABEL);
    expect(plan).toContain("estimatedNextCalculableRequestShapes: 1");
    expect(plan).toContain("estimatedNextCalculableTargetOutputs: 4");
    expect(plan).toContain("estimatedNextRuntimeValuesMoved: 4");
    expect(plan).toContain("runtimeValuesMoved 0");
    expect(plan).toContain("not a broad source crawl");
  });

  it("keeps the candidate set runtime-first and rejects stale or unsafe repetitions", () => {
    expect(CANDIDATES).toHaveLength(7);
    expect(CANDIDATES.filter((candidate) => candidate.decision === "selected_next")).toHaveLength(1);
    expect(CANDIDATES.find((candidate) => candidate.id === SELECTED_CANDIDATE_ID)).toMatchObject({
      decision: "selected_next",
      targetOutputs: ["Rw", "STC", "C", "Ctr"]
    });
    expect(CANDIDATES.find((candidate) => candidate.id === "floor.user_material_impact_lower_treatment_depth_owner")).toMatchObject({
      decision: "rejected_already_landed"
    });
    expect(CANDIDATES.find((candidate) => candidate.id.includes("oitc_direct"))).toMatchObject({
      decision: "rejected_unsafe_without_adapter"
    });
  });

  it("keeps metric/basis boundaries explicit for candidates that may be selected later", () => {
    expect(CANDIDATES.find((candidate) => candidate.id.includes("oitc_direct"))?.unsupportedBoundaries).toEqual(
      expect.arrayContaining(["no STC-to-OITC alias", "no Rw-to-OITC alias"])
    );
    expect(CANDIDATES.find((candidate) => candidate.id.includes("astm_iic_aiic"))?.unsupportedBoundaries).toEqual(
      expect.arrayContaining(["no IIC/AIIC alias from ISO Ln,w or DeltaLw"])
    );
    expect(CANDIDATES.find((candidate) => candidate.id === SELECTED_CANDIDATE_ID)?.unsupportedBoundaries).toEqual(
      expect.arrayContaining([
        "impact outputs remain floor needs_input",
        "field/building ceiling metrics remain unsupported until room/plenum context is owned"
      ])
    );
  });
});
