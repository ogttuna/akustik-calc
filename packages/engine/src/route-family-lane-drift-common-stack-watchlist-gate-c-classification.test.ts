import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

type GateCClassification = {
  classification:
    | "blocked_source_qc"
    | "bounded_fix_candidate"
    | "guard_green"
    | "negative_boundary_for_fix"
    | "watch_only";
  id: string;
  requiredGateDProofs: readonly string[];
  runtimeBehaviorChange: false;
  selectedForGateD: boolean;
  sourcePromotionAllowedNow: false;
  valueRetuneAllowedNow: false;
  webVisibleProofRequiredBeforeRuntime: boolean;
};

const ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_C = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_c_classify_reprobe_findings_and_select_bounded_fix_or_closeout_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  selectedNextAction: "gate_d_design_flat_list_multileaf_family_guard_with_negative_boundaries_no_runtime",
  selectedNextFile:
    "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts",
  selectedNextStatus:
    "common_stack_lane_drift_classification_landed_no_runtime_selected_gate_d_flat_list_family_guard_design",
  selectedPlanningSurface: "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
  sliceId: "route_family_lane_drift_common_stack_watchlist_v1",
  supportPromotion: false,
  thisGateFile: "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts",
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts",
  "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts",
  "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_C_HANDOFF.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const FROZEN_SURFACES = [
  "runtime",
  "support",
  "confidence",
  "evidence",
  "API",
  "route-card",
  "output-card",
  "proposal/report",
  "workbench-input"
] as const;

const GATE_D_REQUIRED_PROOFS = [
  "explicit_flat_list_multileaf_ambiguity_predicate",
  "ordinary_double_leaf_negative_boundary",
  "simple_stud_negative_boundary",
  "lined_massive_boundary_hold_negative_boundary",
  "grouped_triple_leaf_topology_negative_boundary",
  "duplicate_many_layer_finite_output_negative_boundary",
  "known_floor_exact_row_negative_boundary",
  "near_source_alias_no_promotion_boundary",
  "field_output_visible_policy_boundary",
  "paired_engine_and_web_visible_tests_before_runtime"
] as const;

const GATE_C_CLASSIFICATIONS: readonly GateCClassification[] = [
  {
    classification: "bounded_fix_candidate",
    id: "split_rockwool_flat_swap_3_4_wrong_lane_reproduced",
    requiredGateDProofs: GATE_D_REQUIRED_PROOFS,
    runtimeBehaviorChange: false,
    selectedForGateD: true,
    sourcePromotionAllowedNow: false,
    valueRetuneAllowedNow: false,
    webVisibleProofRequiredBeforeRuntime: true
  },
  {
    classification: "bounded_fix_candidate",
    id: "ordinary_classic_triple_leaf_swap_wrong_lane_reproduced",
    requiredGateDProofs: GATE_D_REQUIRED_PROOFS,
    runtimeBehaviorChange: false,
    selectedForGateD: true,
    sourcePromotionAllowedNow: false,
    valueRetuneAllowedNow: false,
    webVisibleProofRequiredBeforeRuntime: true
  },
  {
    classification: "negative_boundary_for_fix",
    id: "heavy_multileaf_lined_massive_boundary_reproduced",
    requiredGateDProofs: [
      "lined_massive_boundary_hold_negative_boundary",
      "do_not_force_heavy_masonry_hybrids_into_double_leaf_guard",
      "paired_engine_and_web_visible_tests_before_runtime"
    ],
    runtimeBehaviorChange: false,
    selectedForGateD: true,
    sourcePromotionAllowedNow: false,
    valueRetuneAllowedNow: false,
    webVisibleProofRequiredBeforeRuntime: true
  },
  {
    classification: "watch_only",
    id: "duplicate_many_layer_classic_stack_finite_watch",
    requiredGateDProofs: ["duplicate_many_layer_finite_output_negative_boundary"],
    runtimeBehaviorChange: false,
    selectedForGateD: false,
    sourcePromotionAllowedNow: false,
    valueRetuneAllowedNow: false,
    webVisibleProofRequiredBeforeRuntime: false
  },
  {
    classification: "watch_only",
    id: "duplicate_many_layer_heavy_stack_finite_watch",
    requiredGateDProofs: ["duplicate_many_layer_finite_output_negative_boundary"],
    runtimeBehaviorChange: false,
    selectedForGateD: false,
    sourcePromotionAllowedNow: false,
    valueRetuneAllowedNow: false,
    webVisibleProofRequiredBeforeRuntime: false
  },
  {
    classification: "guard_green",
    id: "raw_floor_known_role_inference_parity_green",
    requiredGateDProofs: ["known_floor_exact_row_negative_boundary"],
    runtimeBehaviorChange: false,
    selectedForGateD: false,
    sourcePromotionAllowedNow: false,
    valueRetuneAllowedNow: false,
    webVisibleProofRequiredBeforeRuntime: true
  },
  {
    classification: "blocked_source_qc",
    id: "near_source_gypsum_alias_context_only",
    requiredGateDProofs: ["near_source_alias_no_promotion_boundary"],
    runtimeBehaviorChange: false,
    selectedForGateD: false,
    sourcePromotionAllowedNow: false,
    valueRetuneAllowedNow: false,
    webVisibleProofRequiredBeforeRuntime: true
  },
  {
    classification: "watch_only",
    id: "field_output_copy_leakage_requires_visible_policy",
    requiredGateDProofs: ["field_output_visible_policy_boundary"],
    runtimeBehaviorChange: false,
    selectedForGateD: false,
    sourcePromotionAllowedNow: false,
    valueRetuneAllowedNow: false,
    webVisibleProofRequiredBeforeRuntime: true
  },
  {
    classification: "guard_green",
    id: "hostile_api_import_fail_closed_green",
    requiredGateDProofs: ["hostile_api_input_must_remain_fail_closed"],
    runtimeBehaviorChange: false,
    selectedForGateD: false,
    sourcePromotionAllowedNow: false,
    valueRetuneAllowedNow: false,
    webVisibleProofRequiredBeforeRuntime: false
  },
  {
    classification: "blocked_source_qc",
    id: "curve_digitization_provenance_no_new_payload",
    requiredGateDProofs: ["curve_digitization_payload_must_not_bypass_route_guard"],
    runtimeBehaviorChange: false,
    selectedForGateD: false,
    sourcePromotionAllowedNow: false,
    valueRetuneAllowedNow: false,
    webVisibleProofRequiredBeforeRuntime: false
  }
] as const;

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab",
  airtightness: "good"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  airtightness: "good",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

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
];

const CLASSIC_TRIPLE_LEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const HEAVY_MULTILEAF_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 25 },
  { materialId: "ytong_aac_d700", thicknessMm: 100 },
  { materialId: "air_gap", thicknessMm: 50 },
  { materialId: "diamond_board", thicknessMm: 12.5 }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function swap(stack: readonly LayerInput[], a: number, b: number): readonly LayerInput[] {
  const swapped = [...stack];
  [swapped[a], swapped[b]] = [swapped[b]!, swapped[a]!];
  return swapped;
}

function wallSnapshot(layers: readonly LayerInput[]) {
  const lab = calculateAssembly(layers, {
    airborneContext: WALL_LAB_CONTEXT,
    calculator: "dynamic",
    targetOutputs: ["Rw"]
  });
  const field = calculateAssembly(layers, {
    airborneContext: WALL_FIELD_CONTEXT,
    calculator: "dynamic",
    targetOutputs: ["R'w", "DnT,w"]
  });

  return {
    confidence: field.dynamicAirborneTrace?.confidenceClass ?? lab.dynamicAirborneTrace?.confidenceClass ?? null,
    dnTw: field.metrics.estimatedDnTwDb,
    family: field.dynamicAirborneTrace?.detectedFamily ?? lab.dynamicAirborneTrace?.detectedFamily ?? null,
    rw: lab.metrics.estimatedRwDb,
    rwPrime: field.metrics.estimatedRwPrimeDb,
    strategy: field.dynamicAirborneTrace?.strategy ?? lab.dynamicAirborneTrace?.strategy ?? null
  };
}

describe("route-family lane-drift common-stack watchlist Gate C classification", () => {
  it("lands Gate C as no-runtime classification and selects Gate D guard design", () => {
    expect(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_C).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_c_classify_reprobe_findings_and_select_bounded_fix_or_closeout_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      selectedNextAction: "gate_d_design_flat_list_multileaf_family_guard_with_negative_boundaries_no_runtime",
      selectedNextFile:
        "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-d-flat-list-family-guard-design.test.ts",
      selectedNextStatus:
        "common_stack_lane_drift_classification_landed_no_runtime_selected_gate_d_flat_list_family_guard_design",
      selectedPlanningSurface: "docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md",
      sliceId: "route_family_lane_drift_common_stack_watchlist_v1",
      supportPromotion: false,
      thisGateFile: "packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts",
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the confirmed wrong-lane history grounded while current runtime is fail-closed", () => {
    const splitBase = wallSnapshot(SPLIT_ROCKWOOL_STACK);
    const splitSwapped = wallSnapshot(swap(SPLIT_ROCKWOOL_STACK, 3, 4));
    const classicBase = wallSnapshot(CLASSIC_TRIPLE_LEAF_STACK);
    const classicSwapped = wallSnapshot(swap(CLASSIC_TRIPLE_LEAF_STACK, 1, 2));

    expect({
      confidence: splitBase.confidence,
      family: splitBase.family,
      rw: splitBase.rw,
      strategy: splitBase.strategy
    }).toEqual({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 41,
      strategy: "multileaf_screening_blend"
    });
    expect({
      confidence: splitSwapped.confidence,
      family: splitSwapped.family,
      rw: splitSwapped.rw,
      strategy: splitSwapped.strategy
    }).toEqual({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 42,
      strategy: "multileaf_screening_blend_fail_closed_until_grouped_topology"
    });
    expect(classicBase.rw).toBe(32);
    expect(classicSwapped).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 33,
      strategy: "multileaf_screening_blend_fail_closed_until_grouped_topology"
    });

    for (const id of [
      "split_rockwool_flat_swap_3_4_wrong_lane_reproduced",
      "ordinary_classic_triple_leaf_swap_wrong_lane_reproduced"
    ]) {
      expect(GATE_C_CLASSIFICATIONS.find((finding) => finding.id === id)).toMatchObject({
        classification: "bounded_fix_candidate",
        runtimeBehaviorChange: false,
        selectedForGateD: true,
        sourcePromotionAllowedNow: false,
        valueRetuneAllowedNow: false,
        webVisibleProofRequiredBeforeRuntime: true
      });
    }
  });

  it("keeps heavy masonry / lined-massive drift as a required negative boundary for the guard", () => {
    const heavyBase = wallSnapshot(HEAVY_MULTILEAF_STACK);
    const heavySwapped = wallSnapshot(swap(HEAVY_MULTILEAF_STACK, 1, 2));

    expect({
      confidence: heavyBase.confidence,
      family: heavyBase.family,
      rw: heavyBase.rw,
      strategy: heavyBase.strategy
    }).toEqual({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 39,
      strategy: "multileaf_screening_blend"
    });
    expect({
      confidence: heavySwapped.confidence,
      family: heavySwapped.family,
      rw: heavySwapped.rw,
      strategy: heavySwapped.strategy
    }).toEqual({
      confidence: "low",
      family: "lined_massive_wall",
      rw: 49,
      strategy: "lined_massive_blend+reinforcement_monotonic_floor+family_boundary_hold"
    });
    expect(
      GATE_C_CLASSIFICATIONS.find((finding) => finding.id === "heavy_multileaf_lined_massive_boundary_reproduced")
    ).toMatchObject({
      classification: "negative_boundary_for_fix",
      selectedForGateD: true,
      valueRetuneAllowedNow: false
    });
  });

  it("keeps watch-only, guard-green, and source-QC findings out of runtime selection", () => {
    expect(GATE_C_CLASSIFICATIONS.map((finding) => finding.id)).toEqual([
      "split_rockwool_flat_swap_3_4_wrong_lane_reproduced",
      "ordinary_classic_triple_leaf_swap_wrong_lane_reproduced",
      "heavy_multileaf_lined_massive_boundary_reproduced",
      "duplicate_many_layer_classic_stack_finite_watch",
      "duplicate_many_layer_heavy_stack_finite_watch",
      "raw_floor_known_role_inference_parity_green",
      "near_source_gypsum_alias_context_only",
      "field_output_copy_leakage_requires_visible_policy",
      "hostile_api_import_fail_closed_green",
      "curve_digitization_provenance_no_new_payload"
    ]);
    expect(GATE_C_CLASSIFICATIONS.every((finding) => finding.runtimeBehaviorChange === false)).toBe(true);
    expect(GATE_C_CLASSIFICATIONS.every((finding) => finding.sourcePromotionAllowedNow === false)).toBe(true);
    expect(GATE_C_CLASSIFICATIONS.every((finding) => finding.valueRetuneAllowedNow === false)).toBe(true);
    expect(GATE_C_CLASSIFICATIONS.filter((finding) => finding.classification === "bounded_fix_candidate")).toHaveLength(2);
    expect(GATE_C_CLASSIFICATIONS.filter((finding) => finding.classification === "negative_boundary_for_fix")).toHaveLength(1);
    expect(GATE_C_CLASSIFICATIONS.filter((finding) => finding.classification === "guard_green")).toHaveLength(2);
    expect(GATE_C_CLASSIFICATIONS.filter((finding) => finding.classification === "blocked_source_qc")).toHaveLength(2);
  });

  it("requires Gate D to prove a narrow flat-list ambiguity guard before any behavior moves", () => {
    for (const proof of GATE_D_REQUIRED_PROOFS) {
      expect(
        GATE_C_CLASSIFICATIONS
          .filter((finding) => finding.selectedForGateD)
          .some((finding) => finding.requiredGateDProofs.includes(proof)),
        proof
      ).toBe(true);
    }
    expect(
      GATE_C_CLASSIFICATIONS
        .filter((finding) => finding.selectedForGateD)
        .every((finding) => finding.webVisibleProofRequiredBeforeRuntime)
    ).toBe(true);
    expect(GATE_D_REQUIRED_PROOFS).toContain("ordinary_double_leaf_negative_boundary");
    expect(GATE_D_REQUIRED_PROOFS).toContain("grouped_triple_leaf_topology_negative_boundary");
    expect(GATE_D_REQUIRED_PROOFS).toContain("paired_engine_and_web_visible_tests_before_runtime");
  });

  it("keeps active docs aligned on Gate C landing and Gate D selection", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_C_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_C.sliceId);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_C.thisGateFile);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_C.selectedNextFile);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_C.selectedNextAction);
      expect(doc).toContain(ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_C.selectedNextStatus);
      expect(doc).toContain("split_rockwool_flat_swap_3_4_wrong_lane_reproduced");
      expect(doc).toContain("bounded_fix_candidate");
      expect(doc).toContain("negative_boundary_for_fix");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
    }
  });

  it("keeps frozen surfaces and validation expectations explicit", () => {
    const joinedDocs = [
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_GATE_C_HANDOFF.md"),
      readRepoFile("docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md")
    ].join("\n");

    for (const surface of FROZEN_SURFACES) {
      expect(joinedDocs, surface).toContain(surface);
    }

    expect(joinedDocs).toContain(
      "pnpm --filter @dynecho/engine exec vitest run src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts --maxWorkers=1"
    );
    expect(joinedDocs).toContain("pnpm calculator:gate:current");
    expect(joinedDocs).toContain("git diff --check");
  });
});
