import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EstimateRequestSchema, type AirborneContext, type LayerInput, type RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type PromotionSurface = {
  currentDisposition: "exact_source_ready" | "context_only" | "screening_only" | "fail_closed" | "blocked";
  id: string;
  missingForPromotion: readonly string[];
  runtimeEvidenceAllowedNow: boolean;
  visibleClaimAllowedNow: boolean;
};

type NextCandidate = {
  firstMissingRequirement: string;
  id: string;
  reason: string;
  runtimeBehaviorChange: false;
  selectedNext: boolean;
  targetFile: string;
};

const SOURCE_PROMOTION_OWNER_SET_GATE_A = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_a_inventory_source_promotion_owner_set_after_v24_rerank",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  selectedImplementationSlice: "rockwool_triple_leaf_resolution_v1",
  selectedNextAction: "gate_a_decide_rockwool_triple_leaf_exact_source_or_fail_closed_path",
  selectedPlanningSurface: "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_V1_PLAN.md",
  selectedRouteFamily: "rockwool_triple_leaf_resolution_after_owner_set_guard",
  selectionStatus: "gate_a_locked_source_promotion_owner_set_no_runtime_selected_rockwool_triple_leaf_resolution",
  sliceId: "source_promotion_owner_set_readiness_guard_v1",
  sourcePromotionOwnerSetRuntimeReadyNow: false,
  supportPromotion: false,
  targetFirstGateFile: "packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts",
  visibleBehaviorChange: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_SURFACES = [
  "packages/engine/src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts",
  "packages/engine/src/calculator-source-gap-revalidation-v24-gate-a-contract.test.ts",
  "packages/engine/src/source-promotion-hostile-input-readiness-guard-gate-a-contract.test.ts",
  "packages/engine/src/post-source-promotion-hostile-input-readiness-guard-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/post-rockwool-triple-leaf-explicit-screening-only-policy-v1-next-slice-selection-contract.test.ts",
  "packages/engine/src/company-internal-frequent-combination-lane-snapshot-guard-gate-a-contract.test.ts",
  "apps/web/features/workbench/company-internal-frequent-combination-lane-snapshot-guard-gate-b-visible.test.ts",
  "docs/calculator/SLICE_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_GATE_A_HANDOFF.md",
  "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_CALCULATOR_SOURCE_GAP_REVALIDATION_V24_GATE_A_HANDOFF.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "tools/dev/run-calculator-current-gate.ts",
  "AGENTS.md"
] as const;

const REQUIRED_DOCS = [
  "AGENTS.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/SLICE_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_V1_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-05_SOURCE_PROMOTION_OWNER_SET_READINESS_GUARD_GATE_A_HANDOFF.md",
  "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_V1_PLAN.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
] as const;

const REQUIRED_OWNER_SET = [
  "source_provenance",
  "topology_owner",
  "material_mapping_owner",
  "metric_context_owner",
  "tolerance_owner",
  "negative_boundaries",
  "paired_engine_tests",
  "paired_visible_tests"
] as const;

const SOURCE_PROMOTION_OWNER_SET_INVENTORY = {
  artifact: "source_promotion_owner_set_inventory",
  completeOwnerSetRequiredForFuturePromotion: REQUIRED_OWNER_SET,
  exactSourceRowsMayStayExactOnlyWhenOwnerSetIsAlreadyNamed: true,
  ownerlessPromotionAllowedNow: false,
  runtimePromotionReadyNow: false
} as const;

const OWNERLESS_SOURCE_PROMOTION_BLOCKED = {
  artifact: "ownerless_source_promotion_blocked",
  importedSnapshotCanPromoteRuntime: false,
  nearSourceAliasCanPromoteRuntime: false,
  officialLocatorCanPromoteRuntime: false,
  sourceLikeMaterialNameCanPromoteRuntime: false,
  visibleCopyCanPromoteRuntime: false
} as const;

const HOSTILE_IMPORT_SNAPSHOT_NOT_EVIDENCE_CARRY_FORWARD = {
  artifact: "hostile_import_snapshot_not_evidence_carry_forward",
  estimateJson1e309RejectedByFiniteLayerSchema: true,
  finiteImportedNumberIsNotSourceProvenance: true,
  hostileApiImportGuardGreen: true,
  importSnapshotCannotSeedExactRuntime: true
} as const;

const ROCKWOOL_RESOLUTION_SELECTED_AS_NEXT_ACCURACY_TARGET = {
  artifact: "rockwool_resolution_selected_as_next_accuracy_target",
  exactFixAllowedOnlyWithCompleteSourcePacket: true,
  groupedScreeningAnswer: "Rw 41",
  nextSlice: "rockwool_triple_leaf_resolution_v1",
  selectedReason:
    "source_promotion_owner_set_is_now_locked_so_the_next_correct_direction_is_the_user_reported_rockwool_triple_leaf_resolution_decision_not_another_generic_guard_chain",
  targetFirstGateFile: "packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts"
} as const;

const PROMOTION_SURFACES: readonly PromotionSurface[] = [
  {
    currentDisposition: "exact_source_ready",
    id: "existing_lsf_exact_catalog_row",
    missingForPromotion: [],
    runtimeEvidenceAllowedNow: true,
    visibleClaimAllowedNow: true
  },
  {
    currentDisposition: "context_only",
    id: "near_source_lsf_material_substitution",
    missingForPromotion: REQUIRED_OWNER_SET,
    runtimeEvidenceAllowedNow: false,
    visibleClaimAllowedNow: false
  },
  {
    currentDisposition: "context_only",
    id: "official_sounding_material_alias_stack",
    missingForPromotion: REQUIRED_OWNER_SET,
    runtimeEvidenceAllowedNow: false,
    visibleClaimAllowedNow: false
  },
  {
    currentDisposition: "blocked",
    id: "rockwool_uris_2006_source_locator_without_rights_safe_packet",
    missingForPromotion: [
      "rights_safe_source_owned_curve_payload",
      "source_provenance",
      "material_mapping_owner",
      "metric_context_owner",
      "tolerance_owner",
      "negative_boundaries",
      "paired_visible_tests"
    ],
    runtimeEvidenceAllowedNow: false,
    visibleClaimAllowedNow: false
  },
  {
    currentDisposition: "fail_closed",
    id: "hostile_api_non_finite_layer_payload",
    missingForPromotion: ["finite_schema_acceptance"],
    runtimeEvidenceAllowedNow: false,
    visibleClaimAllowedNow: false
  },
  {
    currentDisposition: "screening_only",
    id: "grouped_split_rockwool_triple_leaf_current_output",
    missingForPromotion: [
      "rights_safe_source_owned_curve_payload",
      "topology_owner",
      "material_mapping_owner",
      "metric_context_owner",
      "tolerance_owner",
      "negative_boundaries",
      "paired_visible_tests"
    ],
    runtimeEvidenceAllowedNow: false,
    visibleClaimAllowedNow: true
  }
] as const;

const NEXT_SELECTION_MATRIX: readonly NextCandidate[] = [
  {
    firstMissingRequirement: "rockwool_resolution_decision_gate_to_choose_exact_source_or_fail_closed_path",
    id: "rockwool_triple_leaf_resolution_v1",
    reason:
      "owner_set_guard_is_locked_and_the_highest_visible_accuracy_defect_is_still_rockwool_triple_leaf_so_the_next_slice_must_decide_source_backed_exactness_or_make_the_screening_failure_mode_explicit",
    runtimeBehaviorChange: false,
    selectedNext: true,
    targetFile: "packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts"
  },
  {
    firstMissingRequirement: "new_uncovered_source_promotion_surface",
    id: "continue_generic_source_promotion_guard_chain",
    reason:
      "not_selected_because_gate_a_found_no_new_generic_owner_set_gap_that_should outrank_the_user_reported_rockwool_resolution_decision",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md"
  },
  {
    firstMissingRequirement: "rights_safe_source_owned_curve_payload_and_owner_set",
    id: "direct_rockwool_exact_runtime_promotion_now",
    reason:
      "not_selected_as_immediate_runtime_movement_because_uris_2006_payload_is_still_absent_and_the_next_step_must_make_an_explicit_exact_vs_fail_closed_decision",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"
  },
  {
    firstMissingRequirement: "correctness_blocker_resolution_before_trust_increasing_polish",
    id: "productization_or_report_polish",
    reason: "not_selected_until_rockwool_resolution_path_is_decided",
    runtimeBehaviorChange: false,
    selectedNext: false,
    targetFile: "docs/calculator/POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md"
  }
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

const STUD_EXACT_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const GROUPED_SPLIT_ROCKWOOL_CONTEXT: AirborneContext = {
  ...WALL_LAB_CONTEXT,
  wallTopology: {
    cavity1AbsorptionClass: "porous_absorptive",
    cavity1DepthMm: 50,
    cavity1FillCoverage: "full",
    cavity1LayerIndices: [3],
    cavity2AbsorptionClass: "porous_absorptive",
    cavity2DepthMm: 50,
    cavity2FillCoverage: "full",
    cavity2LayerIndices: [5],
    internalLeafCoupling: "independent",
    internalLeafLayerIndices: [4],
    sideALeafLayerIndices: [0, 1, 2],
    sideBLeafLayerIndices: [6, 7, 8],
    supportTopology: "independent_frames",
    topologyMode: "grouped_triple_leaf"
  }
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];

const SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const LSF_EXACT_SOURCE_STACK: readonly LayerInput[] = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const;

const LSF_NEAR_SOURCE_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "rockwool", thicknessMm: 70 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
] as const;

const NEAR_SOURCE_ALIAS_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum", thicknessMm: 12.5 },
  { materialId: "firestop_board", thicknessMm: 15 }
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function wallSnapshot(input: {
  airborneContext: AirborneContext;
  layers: readonly LayerInput[];
  outputs: readonly RequestedOutputId[];
}) {
  const result = calculateAssembly(input.layers, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.outputs
  });

  return {
    confidence: result.dynamicAirborneTrace?.confidenceClass ?? null,
    family: result.dynamicAirborneTrace?.detectedFamily ?? null,
    rw: result.metrics.estimatedRwDb ?? null,
    stc: result.metrics.estimatedStc ?? null,
    strategy: result.dynamicAirborneTrace?.strategy ?? null,
    supported: result.supportedTargetOutputs,
    warnings: result.warnings.join("\n")
  };
}

function issuePaths(parseResult: { success: false; error: { issues: Array<{ path: Array<number | string> }> } }) {
  return parseResult.error.issues.map((issue) => issue.path.map(String).join("."));
}

describe("source-promotion owner-set readiness guard Gate A", () => {
  it("lands owner-set guard no-runtime and selects Rockwool triple-leaf resolution", () => {
    expect(SOURCE_PROMOTION_OWNER_SET_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_inventory_source_promotion_owner_set_after_v24_rerank",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      selectedImplementationSlice: "rockwool_triple_leaf_resolution_v1",
      selectedNextAction: "gate_a_decide_rockwool_triple_leaf_exact_source_or_fail_closed_path",
      selectedPlanningSurface: "docs/calculator/SLICE_ROCKWOOL_TRIPLE_LEAF_RESOLUTION_V1_PLAN.md",
      selectedRouteFamily: "rockwool_triple_leaf_resolution_after_owner_set_guard",
      selectionStatus: "gate_a_locked_source_promotion_owner_set_no_runtime_selected_rockwool_triple_leaf_resolution",
      sliceId: "source_promotion_owner_set_readiness_guard_v1",
      sourcePromotionOwnerSetRuntimeReadyNow: false,
      supportPromotion: false,
      targetFirstGateFile: "packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts",
      visibleBehaviorChange: false,
      workbenchInputBehaviorChange: false
    });

    for (const relativePath of REQUIRED_SURFACES) {
      expect(existsSync(join(REPO_ROOT, relativePath)), relativePath).toBe(true);
    }
  });

  it("requires the complete owner set before source-like surfaces can promote runtime evidence", () => {
    expect(SOURCE_PROMOTION_OWNER_SET_INVENTORY).toEqual({
      artifact: "source_promotion_owner_set_inventory",
      completeOwnerSetRequiredForFuturePromotion: [
        "source_provenance",
        "topology_owner",
        "material_mapping_owner",
        "metric_context_owner",
        "tolerance_owner",
        "negative_boundaries",
        "paired_engine_tests",
        "paired_visible_tests"
      ],
      exactSourceRowsMayStayExactOnlyWhenOwnerSetIsAlreadyNamed: true,
      ownerlessPromotionAllowedNow: false,
      runtimePromotionReadyNow: false
    });

    expect(PROMOTION_SURFACES).toEqual([
      expect.objectContaining({
        currentDisposition: "exact_source_ready",
        id: "existing_lsf_exact_catalog_row",
        missingForPromotion: [],
        runtimeEvidenceAllowedNow: true,
        visibleClaimAllowedNow: true
      }),
      expect.objectContaining({
        currentDisposition: "context_only",
        id: "near_source_lsf_material_substitution",
        missingForPromotion: REQUIRED_OWNER_SET,
        runtimeEvidenceAllowedNow: false
      }),
      expect.objectContaining({
        currentDisposition: "context_only",
        id: "official_sounding_material_alias_stack",
        missingForPromotion: REQUIRED_OWNER_SET,
        runtimeEvidenceAllowedNow: false
      }),
      expect.objectContaining({
        currentDisposition: "blocked",
        id: "rockwool_uris_2006_source_locator_without_rights_safe_packet",
        runtimeEvidenceAllowedNow: false
      }),
      expect.objectContaining({
        currentDisposition: "fail_closed",
        id: "hostile_api_non_finite_layer_payload",
        runtimeEvidenceAllowedNow: false
      }),
      expect.objectContaining({
        currentDisposition: "screening_only",
        id: "grouped_split_rockwool_triple_leaf_current_output",
        runtimeEvidenceAllowedNow: false,
        visibleClaimAllowedNow: true
      })
    ]);
  });

  it("keeps exact rows near-source rows material aliases and Rockwool screening separated", () => {
    const exact = wallSnapshot({
      airborneContext: STUD_EXACT_CONTEXT,
      layers: LSF_EXACT_SOURCE_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const near = wallSnapshot({
      airborneContext: STUD_EXACT_CONTEXT,
      layers: LSF_NEAR_SOURCE_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const alias = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: NEAR_SOURCE_ALIAS_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const rockwool = wallSnapshot({
      airborneContext: GROUPED_SPLIT_ROCKWOOL_CONTEXT,
      layers: SPLIT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });

    expect(OWNERLESS_SOURCE_PROMOTION_BLOCKED).toEqual({
      artifact: "ownerless_source_promotion_blocked",
      importedSnapshotCanPromoteRuntime: false,
      nearSourceAliasCanPromoteRuntime: false,
      officialLocatorCanPromoteRuntime: false,
      sourceLikeMaterialNameCanPromoteRuntime: false,
      visibleCopyCanPromoteRuntime: false
    });

    expect(exact).toMatchObject({
      confidence: "low",
      family: "stud_wall_system",
      rw: 55,
      strategy: "stud_surrogate_blend+framed_wall_calibration"
    });
    expect(exact.warnings).toMatch(/Curated exact airborne lab match active/i);

    expect(near).toMatchObject({
      confidence: "low",
      family: "stud_wall_system",
      rw: 53
    });
    expect(near.warnings).not.toMatch(/Curated exact airborne lab match active/i);

    expect(alias).toMatchObject({
      confidence: "medium",
      family: "laminated_single_leaf",
      rw: 37,
      strategy: "laminated_leaf_sharp_delegate"
    });
    expect(alias.warnings).not.toMatch(/Curated exact airborne lab match active/i);

    expect(rockwool).toMatchObject({
      confidence: "medium",
      family: "multileaf_multicavity",
      rw: 50,
      stc: 55,
      strategy: "triple_leaf_two_cavity_frequency_solver_family_physics_prediction",
      supported: ["Rw", "STC", "C", "Ctr"]
    });
  });

  it("carries forward hostile import fail-closed behavior without treating finite snapshots as provenance", () => {
    const parsedEstimateHugeJson = JSON.parse(
      '{"layers":[{"materialId":"gypsum_board","thicknessMm":1e309}],"targetOutputs":["Rw"]}'
    ) as unknown;
    const estimateNonFinite = EstimateRequestSchema.safeParse(parsedEstimateHugeJson);

    expect(HOSTILE_IMPORT_SNAPSHOT_NOT_EVIDENCE_CARRY_FORWARD).toEqual({
      artifact: "hostile_import_snapshot_not_evidence_carry_forward",
      estimateJson1e309RejectedByFiniteLayerSchema: true,
      finiteImportedNumberIsNotSourceProvenance: true,
      hostileApiImportGuardGreen: true,
      importSnapshotCannotSeedExactRuntime: true
    });
    expect(estimateNonFinite.success).toBe(false);
    if (!estimateNonFinite.success) {
      expect(issuePaths(estimateNonFinite)).toContain("layers.0.thicknessMm");
    }
  });

  it("selects Rockwool resolution and explicitly avoids another generic guard chain", () => {
    expect(NEXT_SELECTION_MATRIX.filter((candidate) => candidate.selectedNext)).toEqual([
      {
        firstMissingRequirement: "rockwool_resolution_decision_gate_to_choose_exact_source_or_fail_closed_path",
        id: "rockwool_triple_leaf_resolution_v1",
        reason:
          "owner_set_guard_is_locked_and_the_highest_visible_accuracy_defect_is_still_rockwool_triple_leaf_so_the_next_slice_must_decide_source_backed_exactness_or_make_the_screening_failure_mode_explicit",
        runtimeBehaviorChange: false,
        selectedNext: true,
        targetFile: "packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts"
      }
    ]);
    expect(NEXT_SELECTION_MATRIX.every((candidate) => candidate.runtimeBehaviorChange === false)).toBe(true);

    expect(ROCKWOOL_RESOLUTION_SELECTED_AS_NEXT_ACCURACY_TARGET).toEqual({
      artifact: "rockwool_resolution_selected_as_next_accuracy_target",
      exactFixAllowedOnlyWithCompleteSourcePacket: true,
      groupedScreeningAnswer: "Rw 41",
      nextSlice: "rockwool_triple_leaf_resolution_v1",
      selectedReason:
        "source_promotion_owner_set_is_now_locked_so_the_next_correct_direction_is_the_user_reported_rockwool_triple_leaf_resolution_decision_not_another_generic_guard_chain",
      targetFirstGateFile: "packages/engine/src/rockwool-triple-leaf-resolution-gate-a-contract.test.ts"
    });
  });

  it("keeps docs and current-gate runner aligned with the Rockwool resolution selection", () => {
    const docs = REQUIRED_DOCS.map((relativePath) => readRepoFile(relativePath)).join("\n\n");

    for (const token of [
      SOURCE_PROMOTION_OWNER_SET_GATE_A.selectionStatus,
      SOURCE_PROMOTION_OWNER_SET_GATE_A.selectedImplementationSlice,
      SOURCE_PROMOTION_OWNER_SET_GATE_A.targetFirstGateFile,
      SOURCE_PROMOTION_OWNER_SET_GATE_A.selectedPlanningSurface,
      SOURCE_PROMOTION_OWNER_SET_INVENTORY.artifact,
      OWNERLESS_SOURCE_PROMOTION_BLOCKED.artifact,
      HOSTILE_IMPORT_SNAPSHOT_NOT_EVIDENCE_CARRY_FORWARD.artifact,
      ROCKWOOL_RESOLUTION_SELECTED_AS_NEXT_ACCURACY_TARGET.artifact
    ]) {
      expect(docs, token).toContain(token);
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/source-promotion-owner-set-readiness-guard-gate-a-contract.test.ts");
  });
});
