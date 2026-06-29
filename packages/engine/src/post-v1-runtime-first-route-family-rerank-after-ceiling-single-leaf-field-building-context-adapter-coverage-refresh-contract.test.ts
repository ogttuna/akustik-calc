import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_COVERAGE_ACTION =
  "post_v1_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_plan";
const PREVIOUS_COVERAGE_FILE =
  "packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts";
const PREVIOUS_COVERAGE_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-26.md";
const PREVIOUS_COVERAGE_STATUS =
  "post_v1_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_landed_no_runtime_selected_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh";

const PREVIOUS_OWNER_ACTION =
  "post_v1_ceiling_single_leaf_field_building_context_adapter_owner_plan";
const PREVIOUS_OWNER_FILE =
  "packages/engine/src/post-v1-ceiling-single-leaf-field-building-context-adapter-owner-contract.test.ts";
const PREVIOUS_OWNER_STATUS =
  "post_v1_ceiling_single_leaf_field_building_context_adapter_owner_landed_runtime_basis_selected_coverage_refresh";

const RERANK_ACTION =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_plan";
const RERANK_FILE =
  "packages/engine/src/post-v1-runtime-first-route-family-rerank-after-ceiling-single-leaf-field-building-context-adapter-coverage-refresh-contract.test.ts";
const RERANK_PLAN_DOC =
  "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-29.md";
const RERANK_STATUS =
  "post_v1_runtime_first_route_family_rerank_after_ceiling_single_leaf_field_building_context_adapter_coverage_refresh_landed_no_runtime_selected_ceiling_multileaf_airborne_plenum_input_boundary_owner";

const SELECTED_CANDIDATE_ID =
  "ceiling.multileaf_airborne_plenum_input_boundary_owner";
const SELECTED_NEXT_ACTION =
  "post_v1_ceiling_multileaf_airborne_plenum_input_boundary_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-ceiling-multileaf-airborne-plenum-input-boundary-owner-contract.test.ts";
const SELECTED_NEXT_PLAN_DOC =
  "docs/calculator/POST_V1_CEILING_MULTILEAF_AIRBORNE_PLENUM_INPUT_BOUNDARY_OWNER_PLAN_2026-06-29.md";
const SELECTED_NEXT_LABEL =
  "post-V1 ceiling multileaf airborne plenum input-boundary owner";

const RERANK_COUNTERS = {
  candidateCount: 8,
  estimatedNextCalculableRequestShapes: 0,
  estimatedNextCalculableTargetOutputs: 0,
  estimatedNextRequiredPhysicalInputsCaptured: 5,
  estimatedNextRuntimeBasisPromotions: 0,
  estimatedNextRuntimeValuesMoved: 0,
  estimatedNextUnsupportedBoundariesProtected: 7,
  frontendImplementationFilesTouched: 0,
  roiAnalysisIterations: 4,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

type CandidateDecision =
  | "rejected_already_landed"
  | "rejected_lower_roi"
  | "rejected_no_same_basis_evidence"
  | "rejected_runtime_unsafe_without_inputs"
  | "rejected_support_loop"
  | "selected_input_boundary_owner";

type Candidate = {
  readonly decision: CandidateDecision;
  readonly estimatedRuntimeValuesMoved: number;
  readonly id: string;
  readonly implementationEvidencePaths: readonly string[];
  readonly reason: string;
  readonly requiredPhysicalInputs: readonly string[];
  readonly routeFamily: string;
  readonly selected: boolean;
  readonly targetOutputsToUnlock: readonly RequestedOutputId[];
  readonly unsupportedBoundaries: readonly string[];
};

const CEILING_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const CEILING_FIELD_BUILDING_OUTPUTS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "DnT,A,k"
] as const satisfies readonly RequestedOutputId[];
const IMPACT_OUTPUTS = ["Ln,w", "DeltaLw", "IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

const SELECTED_REQUIRED_INPUTS = [
  "ceilingLeafGrouping",
  "ceilingLeafSurfaceMassKgM2",
  "ceilingCavityOrPlenumDepthMm",
  "ceilingAbsorberThicknessAndFlowResistivity",
  "ceilingSupportCouplingOrHangerClass"
] as const;

const CANDIDATES = [
  {
    decision: "selected_input_boundary_owner",
    estimatedRuntimeValuesMoved: RERANK_COUNTERS.estimatedNextRuntimeValuesMoved,
    id: SELECTED_CANDIDATE_ID,
    implementationEvidencePaths: [
      PREVIOUS_COVERAGE_FILE,
      PREVIOUS_OWNER_FILE,
      "packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-owner-contract.test.ts",
      "packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh-contract.test.ts"
    ],
    reason:
      "The ceiling single-leaf lab and field/building routes are now protected, but arbitrary user-entered ceiling stacks quickly become multi-leaf or suspended plenum assemblies. Runtime publication is not safe until the route owns leaf grouping, cavity/plenum, absorber, and coupling inputs, so the next highest-ROI calculator move is the bounded input-boundary owner that prevents floor-impact aliasing and prepares the formula route.",
    requiredPhysicalInputs: SELECTED_REQUIRED_INPUTS,
    routeFamily: "ceiling.multileaf_airborne.plenum_input_boundary",
    selected: true,
    targetOutputsToUnlock: CEILING_LAB_OUTPUTS,
    unsupportedBoundaries: [
      "no ceiling multi-leaf Rw/STC/C/Ctr value until the formula owner consumes the complete inputs",
      "no floor-impact Ln,w or DeltaLw alias from a suspended ceiling label",
      "no field/building output without explicit room and flanking context",
      "no roof or facade route promotion",
      "no OITC value before outdoor-indoor spectral rating ownership",
      "no ASTM IIC/AIIC alias",
      "no source-row proximity substitution"
    ]
  },
  {
    decision: "rejected_runtime_unsafe_without_inputs",
    estimatedRuntimeValuesMoved: 4,
    id: "ceiling.multileaf_airborne_plenum_direct_runtime_owner",
    implementationEvidencePaths: [
      "packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh-contract.test.ts",
      "docs/calculator/POST_V1_RUNTIME_FIRST_ROUTE_FAMILY_RERANK_AFTER_CEILING_SINGLE_LEAF_FIELD_BUILDING_CONTEXT_ADAPTER_COVERAGE_REFRESH_PLAN_2026-06-29.md"
    ],
    reason:
      "Direct multi-leaf/suspended-ceiling runtime would need the same physical inputs selected above. Publishing values first would infer topology and coupling.",
    requiredPhysicalInputs: SELECTED_REQUIRED_INPUTS,
    routeFamily: "ceiling.multileaf_airborne.direct_runtime",
    selected: false,
    targetOutputsToUnlock: CEILING_LAB_OUTPUTS,
    unsupportedBoundaries: ["no topology inference", "no defaulted plenum depth", "no defaulted absorber properties"]
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "ceiling.single_leaf_field_building_context_adapter_owner",
    implementationEvidencePaths: [PREVIOUS_OWNER_FILE, PREVIOUS_COVERAGE_FILE],
    reason:
      "The ceiling single-leaf field/building owner and its coverage refresh are the immediate predecessor, not a fresh next slice.",
    requiredPhysicalInputs: ["elementAreaM2", "receivingRoomVolumeM3", "normalizationOrReverberationContext"],
    routeFamily: "ceiling.single_leaf_airborne.field_building_context",
    selected: false,
    targetOutputsToUnlock: CEILING_FIELD_BUILDING_OUTPUTS,
    unsupportedBoundaries: ["no repeat of the landed field/building owner"]
  },
  {
    decision: "rejected_already_landed",
    estimatedRuntimeValuesMoved: 0,
    id: "floor.lightweight_steel_suspended_ceiling_delta_lw_runtime_corridor",
    implementationEvidencePaths: [
      "packages/engine/src/company-internal-steel-suspended-ceiling-delta-lw-runtime-corridor-contract.test.ts",
      "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bl-steel-floor-suspended-ceiling-input-surface-contract.test.ts"
    ],
    reason:
      "Steel floor suspended-ceiling Ln,w/DeltaLw ownership exists on the floor-impact route. Reusing it as a ceiling airborne owner would cross route families.",
    requiredPhysicalInputs: ["toppingOrFloatingLayer", "resilientLayerDynamicStiffnessMNm3", "loadBasisKgM2"],
    routeFamily: "floor.lightweight_steel.suspended_ceiling_impact",
    selected: false,
    targetOutputsToUnlock: ["Ln,w", "DeltaLw"],
    unsupportedBoundaries: ["no floor-impact formula promotion to ceiling airborne Rw/STC"]
  },
  {
    decision: "rejected_lower_roi",
    estimatedRuntimeValuesMoved: 6,
    id: "opening.facade_door_window_spectral_field_building_adapter_followup",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-opening-facade-door-window-spectral-field-building-adapter-owner-contract.test.ts"
    ],
    reason:
      "The spectral opening field/building adapter already moved values. Remaining facade/OITC work is a separate outdoor-indoor rating issue and should not outrank the newly exposed ceiling input boundary.",
    requiredPhysicalInputs: ["openingElementTransmissionLossCurve", "elementAreaM2", "receivingRoomVolumeM3"],
    routeFamily: "opening.facade_door_window.spectral_field_building_adapter",
    selected: false,
    targetOutputsToUnlock: CEILING_FIELD_BUILDING_OUTPUTS,
    unsupportedBoundaries: ["no OITC alias from indoor opening field/building outputs"]
  },
  {
    decision: "rejected_runtime_unsafe_without_inputs",
    estimatedRuntimeValuesMoved: 1,
    id: "opening.facade_outdoor_indoor_oitc_direct_spectral_runtime_owner",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-opening-facade-outdoor-indoor-oitc-metric-schema-and-adapter-bridge-owner-contract.test.ts"
    ],
    reason:
      "OITC remains high value, but the bridge currently makes OITC requestable while keeping complete outdoor-indoor facade requests unsupported until a spectral rating adapter is owned.",
    requiredPhysicalInputs: ["outdoorIndoorTransmissionLossCurve", "facadeAreaAndOpeningContext", "roomNormalizationContext"],
    routeFamily: "opening.facade_outdoor_indoor.oitc_spectral_runtime",
    selected: false,
    targetOutputsToUnlock: ["OITC"],
    unsupportedBoundaries: ["no STC-to-OITC alias", "no Rw-to-OITC alias", "no NISR/ISR-to-OITC alias"]
  },
  {
    decision: "rejected_no_same_basis_evidence",
    estimatedRuntimeValuesMoved: 0,
    id: "ceiling.single_leaf_mass_law_retune_holdout_packet",
    implementationEvidencePaths: [
      "packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-owner-contract.test.ts",
      "packages/engine/src/post-v1-ceiling-single-leaf-airborne-route-coverage-refresh-contract.test.ts"
    ],
    reason:
      "A calibration packet could improve accuracy later, but no same-family same-basis holdout packet is selected in this slice. The current higher-ROI gap is input ownership for new ceiling assemblies.",
    requiredPhysicalInputs: ["sameFamilySameBasisCeilingHoldoutRows"],
    routeFamily: "ceiling.single_leaf_airborne.calibration_holdout",
    selected: false,
    targetOutputsToUnlock: CEILING_LAB_OUTPUTS,
    unsupportedBoundaries: ["no retune from source-absent formula outputs"]
  },
  {
    decision: "rejected_support_loop",
    estimatedRuntimeValuesMoved: 0,
    id: "broad_source_crawl_confidence_or_frontend_polish",
    implementationEvidencePaths: ["AGENTS.md", "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
    reason:
      "Broad source crawling, confidence-label work, and frontend polish do not directly move or unlock the selected calculator formula route.",
    requiredPhysicalInputs: [],
    routeFamily: "support.non_calculator_drift",
    selected: false,
    targetOutputsToUnlock: IMPACT_OUTPUTS,
    unsupportedBoundaries: ["no support-only drift after this rerank"]
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

describe("post-V1 runtime-first route-family rerank after ceiling single-leaf field/building context adapter coverage refresh", () => {
  it("lands the fresh rerank and selects the ceiling multileaf airborne plenum input-boundary owner", () => {
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, PREVIOUS_COVERAGE_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, PREVIOUS_OWNER_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_FILE))).toBe(true);
    expect(existsSync(join(REPO_ROOT, RERANK_PLAN_DOC))).toBe(true);
    expect(existsSync(join(REPO_ROOT, SELECTED_NEXT_PLAN_DOC))).toBe(true);

    expect(CANDIDATES).toHaveLength(RERANK_COUNTERS.candidateCount);
    expect(CANDIDATES.filter((candidate) => candidate.selected)).toHaveLength(1);
    expect(CANDIDATES.find((candidate) => candidate.selected)).toMatchObject({
      decision: "selected_input_boundary_owner",
      id: SELECTED_CANDIDATE_ID,
      requiredPhysicalInputs: SELECTED_REQUIRED_INPUTS,
      targetOutputsToUnlock: CEILING_LAB_OUTPUTS
    });
    expect(RERANK_COUNTERS).toMatchObject({
      estimatedNextCalculableRequestShapes: 0,
      estimatedNextCalculableTargetOutputs: 0,
      estimatedNextRequiredPhysicalInputsCaptured: 5,
      estimatedNextRuntimeBasisPromotions: 0,
      estimatedNextRuntimeValuesMoved: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("ties every candidate decision to present implementation evidence", () => {
    for (const candidate of CANDIDATES) {
      expect(candidate.implementationEvidencePaths.length, candidate.id).toBeGreaterThan(0);

      for (const evidencePath of candidate.implementationEvidencePaths) {
        expect(existsSync(join(REPO_ROOT, evidencePath)), `${candidate.id}: ${evidencePath}`).toBe(true);
      }
    }
  });

  it("rejects unsafe direct runtime, OITC aliases, already-landed owners, and support drift", () => {
    expect(CANDIDATES.find((candidate) => candidate.id === "ceiling.multileaf_airborne_plenum_direct_runtime_owner"))
      .toMatchObject({ decision: "rejected_runtime_unsafe_without_inputs" });
    expect(CANDIDATES.find((candidate) => candidate.id === "ceiling.single_leaf_field_building_context_adapter_owner"))
      .toMatchObject({ decision: "rejected_already_landed" });
    expect(CANDIDATES.find((candidate) => candidate.id.includes("oitc_direct"))).toMatchObject({
      decision: "rejected_runtime_unsafe_without_inputs"
    });
    expect(CANDIDATES.find((candidate) => candidate.id.includes("confidence_or_frontend"))).toMatchObject({
      decision: "rejected_support_loop"
    });
    expect(CANDIDATES.find((candidate) => candidate.id.includes("delta_lw"))?.unsupportedBoundaries).toEqual(
      expect.arrayContaining(["no floor-impact formula promotion to ceiling airborne Rw/STC"])
    );
  });

  it("keeps current docs aligned with the selected input-boundary owner", () => {
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
      expect(content, path).toContain("candidateCount: 8");
      expect(content, path).toContain("estimatedNextRequiredPhysicalInputsCaptured: 5");
      expect(content, path).toContain("estimatedNextRuntimeValuesMoved: 0");
      expect(content, path).toContain("runtimeValuesMoved 0");
      expect(content, path).toContain("not a broad source crawl");
    }
  });
});
