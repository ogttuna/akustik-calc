import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
import type { LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildFloorTestLayersFromCriteria } from "./floor-system-test-layer-builders";
import { maybeInferFloorRoleLayerStack } from "./impact-predictor-input";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const TARGET_OUTPUTS = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w"
] as const satisfies readonly RequestedOutputId[];

const FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_B = {
  apiShapeChange: false,
  confidencePromotion: false,
  evidencePromotion: false,
  landedGate: "gate_b_design_raw_floor_role_prompt_and_negative_boundary_guard_no_runtime",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  outputSupportChange: false,
  previousGate: "gate_a_inventory_raw_floor_role_inference_guardrail_no_runtime",
  proposalReportCopyChange: false,
  routeCardValueChange: false,
  runtimeImportSelectedNow: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedNextAction: "gate_c_implement_raw_floor_role_prompt_guard_with_engine_web_visible_tests",
  selectedNextFile: "packages/engine/src/floor-raw-role-inference-guardrail-gate-c-implementation.test.ts",
  selectionStatus:
    "floor_raw_role_inference_prompt_guard_design_landed_no_runtime_selected_gate_c_implementation",
  sliceId: "floor_raw_role_inference_guardrail_v1",
  supportPromotion: false,
  warningCopyChange: false,
  workbenchInputBehaviorChange: false
} as const;

const REQUIRED_PLANNING_SURFACES = [
  "packages/engine/src/floor-raw-role-inference-guardrail-gate-b-design-contract.test.ts",
  "packages/engine/src/floor-raw-role-inference-guardrail-gate-a-contract.test.ts",
  "docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md",
  "docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_B_HANDOFF.md",
  "docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_A_HANDOFF.md",
  "docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md",
  "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md",
  "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "AGENTS.md"
] as const;

const FLOOR_ROLE_PROMPT_GUARD_RULES = [
  {
    exactOutputPromotionNow: true,
    id: "role_tagged_exact_floor_row",
    promptBeforeExactPromotion: false,
    requiredBeforePromotion: [
      "explicit_floor_roles_present",
      "source_row_material_thickness_tolerance_match",
      "role_tagged_reorder_negative_test"
    ]
  },
  {
    exactOutputPromotionNow: true,
    id: "raw_parity_green_control",
    promptBeforeExactPromotion: false,
    requiredBeforePromotion: [
      "current_raw_inference_equals_role_tagged_snapshot",
      "route_card_must_not_claim_arbitrary_raw_floor_reorder_value_invariance",
      "raw_order_negative_test_keeps_claim_bounded"
    ]
  },
  {
    exactOutputPromotionNow: false,
    id: "raw_tagged_drift_inventory",
    promptBeforeExactPromotion: true,
    requiredBeforePromotion: [
      "user_confirms_floor_roles",
      "role_tagged_snapshot_matches_exact_row",
      "raw_drift_negative_test_blocks_support_confidence_route_card_exact_copy"
    ]
  },
  {
    exactOutputPromotionNow: false,
    id: "raw_no_safe_inference",
    promptBeforeExactPromotion: true,
    requiredBeforePromotion: [
      "user_assigns_missing_floor_roles",
      "no_safe_inference_negative_test_keeps_impact_outputs_unsupported",
      "route_card_names_missing_role_prompt"
    ]
  },
  {
    exactOutputPromotionNow: false,
    id: "duplicate_or_disjoint_single_entry_role",
    promptBeforeExactPromotion: true,
    requiredBeforePromotion: [
      "duplicate_role_warning_remains_visible",
      "family_general_lane_does_not_become_exact",
      "paired_engine_and_web_visible_tests_before_warning_or_route_card_movement"
    ]
  }
] as const;

const GATE_C_VISIBLE_TEST_PLAN = {
  engineRequiredTests: [
    "engine_role_tagged_exact_positive_control",
    "engine_raw_parity_green_no_arbitrary_reorder_invariance_claim",
    "engine_raw_tagged_drift_requires_floor_role_prompt",
    "engine_raw_no_safe_inference_requires_floor_role_prompt",
    "engine_duplicate_single_entry_role_requires_floor_role_prompt",
    "engine_many_layer_duplicate_stays_finite_no_exact_promotion",
    "engine_hostile_input_stays_fail_closed_before_prompt_guard"
  ],
  routeCardCopyMovementAllowedInGateB: false,
  selectedGateCAction: FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_B.selectedNextAction,
  selectedGateCFile: FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_B.selectedNextFile,
  webRequiredTests: [
    "web_route_card_shows_floor_role_prompt_for_raw_drift",
    "web_output_card_does_not_promote_lnw_or_lnw_ci_without_roles",
    "web_raw_parity_green_route_card_does_not_claim_arbitrary_reorder_invariance",
    "web_duplicate_role_warning_stays_visible_before_exact_copy"
  ],
  warningCopyMovementAllowedInGateB: false
} as const;

const FLOOR_RAW_ROLE_PROMPT_NEGATIVE_BOUNDARIES = [
  "raw_floor_role_inference",
  "arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed",
  "raw_tagged_drift_requires_floor_role_prompt",
  "raw_no_safe_inference_requires_floor_role_prompt",
  "duplicate_single_entry_role_requires_floor_role_prompt",
  "many_layer_duplicate_floor_stack_stays_finite_no_exact_promotion",
  "hostile_api_input_stays_fail_closed_before_prompt_guard",
  "paired_engine_and_web_visible_tests_before_route_card_output_card_or_warning_copy_movement",
  "standing_lane_misclassification_monitoring_mandate",
  "note_test_document_or_easy_fix",
  "paused_waiting_rights_safe_source_packet",
  "multileaf_screening_blend_fail_closed_until_grouped_topology"
] as const;

type FloorSnapshot = {
  basis: string | null;
  estimateKind: string | null;
  matchId: string | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
  warnings: readonly string[];
};

type PromptDecision = {
  exactOutputPromotionNow: boolean;
  floorRolePromptRequired: boolean;
  id: string;
  matchId: string | null;
  reason: string;
  supported: readonly RequestedOutputId[];
};

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function exactSystem(id: string): (typeof EXACT_FLOOR_SYSTEMS)[number] {
  const system = EXACT_FLOOR_SYSTEMS.find((entry) => entry.id === id);
  if (!system) {
    throw new Error(`Missing exact floor system ${id}`);
  }

  return system;
}

function buildExactLayers(id: string, mode: "raw" | "tagged"): LayerInput[] {
  return buildFloorTestLayersFromCriteria(exactSystem(id).match, mode);
}

function snapshot(layers: readonly LayerInput[]): FloorSnapshot {
  const result = calculateAssembly(layers, { targetOutputs: TARGET_OUTPUTS });

  return {
    basis: result.impact?.basis ?? result.lowerBoundImpact?.basis ?? null,
    estimateKind: result.floorSystemEstimate?.kind ?? result.boundFloorSystemEstimate?.kind ?? null,
    matchId: result.floorSystemMatch?.system.id ?? null,
    supported: result.supportedTargetOutputs,
    unsupported: result.unsupportedTargetOutputs,
    warnings: result.warnings
  };
}

function includesWarning(snap: FloorSnapshot, pattern: RegExp): boolean {
  return snap.warnings.some((warning) => pattern.test(warning));
}

function promptDecision(id: string, layers: readonly LayerInput[]): PromptDecision {
  const snap = snapshot(layers);
  const inferred = maybeInferFloorRoleLayerStack(layers);
  const hasExplicitRoles = layers.some((layer) => Boolean(layer.floorRole));
  const hasDuplicateRoleWarning = includesWarning(snap, /single-entry floor roles are duplicated/i);

  if (hasExplicitRoles && snap.matchId) {
    return {
      exactOutputPromotionNow: true,
      floorRolePromptRequired: false,
      id,
      matchId: snap.matchId,
      reason: "role_tagged_exact_floor_row",
      supported: snap.supported
    };
  }

  if (!inferred) {
    return {
      exactOutputPromotionNow: false,
      floorRolePromptRequired: true,
      id,
      matchId: snap.matchId,
      reason: "raw_no_safe_inference_requires_floor_role_prompt",
      supported: snap.supported
    };
  }

  if (hasDuplicateRoleWarning) {
    return {
      exactOutputPromotionNow: false,
      floorRolePromptRequired: true,
      id,
      matchId: snap.matchId,
      reason: "duplicate_single_entry_role_requires_floor_role_prompt",
      supported: snap.supported
    };
  }

  if (snap.matchId) {
    return {
      exactOutputPromotionNow: true,
      floorRolePromptRequired: false,
      id,
      matchId: snap.matchId,
      reason: "raw_parity_green_control_no_arbitrary_reorder_invariance_claim",
      supported: snap.supported
    };
  }

  return {
    exactOutputPromotionNow: false,
    floorRolePromptRequired: true,
    id,
    matchId: snap.matchId,
    reason: "raw_tagged_drift_requires_floor_role_prompt",
    supported: snap.supported
  };
}

describe("floor raw role inference guardrail Gate B design contract", () => {
  it("lands Gate B as a no-runtime prompt/guard design decision", () => {
    expect(FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_B).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_b_design_raw_floor_role_prompt_and_negative_boundary_guard_no_runtime",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      outputSupportChange: false,
      previousGate: "gate_a_inventory_raw_floor_role_inference_guardrail_no_runtime",
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportSelectedNow: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedNextAction: "gate_c_implement_raw_floor_role_prompt_guard_with_engine_web_visible_tests",
      selectedNextFile: "packages/engine/src/floor-raw-role-inference-guardrail-gate-c-implementation.test.ts",
      selectionStatus:
        "floor_raw_role_inference_prompt_guard_design_landed_no_runtime_selected_gate_c_implementation",
      sliceId: "floor_raw_role_inference_guardrail_v1",
      supportPromotion: false,
      warningCopyChange: false,
      workbenchInputBehaviorChange: false
    });

    for (const path of REQUIRED_PLANNING_SURFACES) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("defines exact floor promotion rules before route-card, support, or confidence movement", () => {
    expect(FLOOR_ROLE_PROMPT_GUARD_RULES).toEqual([
      {
        exactOutputPromotionNow: true,
        id: "role_tagged_exact_floor_row",
        promptBeforeExactPromotion: false,
        requiredBeforePromotion: [
          "explicit_floor_roles_present",
          "source_row_material_thickness_tolerance_match",
          "role_tagged_reorder_negative_test"
        ]
      },
      {
        exactOutputPromotionNow: true,
        id: "raw_parity_green_control",
        promptBeforeExactPromotion: false,
        requiredBeforePromotion: [
          "current_raw_inference_equals_role_tagged_snapshot",
          "route_card_must_not_claim_arbitrary_raw_floor_reorder_value_invariance",
          "raw_order_negative_test_keeps_claim_bounded"
        ]
      },
      {
        exactOutputPromotionNow: false,
        id: "raw_tagged_drift_inventory",
        promptBeforeExactPromotion: true,
        requiredBeforePromotion: [
          "user_confirms_floor_roles",
          "role_tagged_snapshot_matches_exact_row",
          "raw_drift_negative_test_blocks_support_confidence_route_card_exact_copy"
        ]
      },
      {
        exactOutputPromotionNow: false,
        id: "raw_no_safe_inference",
        promptBeforeExactPromotion: true,
        requiredBeforePromotion: [
          "user_assigns_missing_floor_roles",
          "no_safe_inference_negative_test_keeps_impact_outputs_unsupported",
          "route_card_names_missing_role_prompt"
        ]
      },
      {
        exactOutputPromotionNow: false,
        id: "duplicate_or_disjoint_single_entry_role",
        promptBeforeExactPromotion: true,
        requiredBeforePromotion: [
          "duplicate_role_warning_remains_visible",
          "family_general_lane_does_not_become_exact",
          "paired_engine_and_web_visible_tests_before_warning_or_route_card_movement"
        ]
      }
    ]);
  });

  it("maps representative current runtime snapshots into the Gate B prompt decisions", () => {
    const roleTaggedExact = promptDecision(
      "tuas_x3_tagged_exact_positive",
      buildExactLayers("tuas_x3_clt140_measured_2026", "tagged")
    );
    const rawParityGreen = promptDecision(
      "tuas_r5b_raw_parity_green",
      buildExactLayers("tuas_r5b_open_box_timber_measured_2026", "raw")
    );
    const rawTaggedDrift = promptDecision(
      "tuas_x3_raw_tagged_drift",
      buildExactLayers("tuas_x3_clt140_measured_2026", "raw")
    );
    const rawNoSafeInference = promptDecision(
      "dataholz_gdsnxn01a_raw_no_safe_inference",
      buildExactLayers("dataholz_gdsnxn01a_timber_frame_lab_2026", "raw")
    );
    const duplicateSingleEntryRole = promptDecision(
      "tuas_r7b_duplicate_single_entry_role",
      buildExactLayers("tuas_r7b_open_box_timber_measured_2026", "raw")
    );

    expect(roleTaggedExact).toEqual({
      exactOutputPromotionNow: true,
      floorRolePromptRequired: false,
      id: "tuas_x3_tagged_exact_positive",
      matchId: "tuas_x3_clt140_measured_2026",
      reason: "role_tagged_exact_floor_row",
      supported: ["Rw", "Ln,w", "Ln,w+CI"]
    });
    expect(rawParityGreen).toEqual({
      exactOutputPromotionNow: true,
      floorRolePromptRequired: false,
      id: "tuas_r5b_raw_parity_green",
      matchId: "tuas_r5b_open_box_timber_measured_2026",
      reason: "raw_parity_green_control_no_arbitrary_reorder_invariance_claim",
      supported: ["Rw", "Ln,w", "Ln,w+CI"]
    });
    expect(rawTaggedDrift).toEqual({
      exactOutputPromotionNow: false,
      floorRolePromptRequired: true,
      id: "tuas_x3_raw_tagged_drift",
      matchId: null,
      reason: "duplicate_single_entry_role_requires_floor_role_prompt",
      supported: ["Rw"]
    });
    expect(rawNoSafeInference).toEqual({
      exactOutputPromotionNow: false,
      floorRolePromptRequired: true,
      id: "dataholz_gdsnxn01a_raw_no_safe_inference",
      matchId: null,
      reason: "raw_no_safe_inference_requires_floor_role_prompt",
      supported: ["Rw"]
    });
    expect(duplicateSingleEntryRole).toEqual({
      exactOutputPromotionNow: false,
      floorRolePromptRequired: true,
      id: "tuas_r7b_duplicate_single_entry_role",
      matchId: null,
      reason: "duplicate_single_entry_role_requires_floor_role_prompt",
      supported: ["Rw", "Ln,w", "Ln,w+CI"]
    });
  });

  it("keeps raw drift and duplicate-role representatives on current fail-closed runtime paths", () => {
    const rawDrift = snapshot(buildExactLayers("tuas_x3_clt140_measured_2026", "raw"));
    const rawNoSafeInference = snapshot(buildExactLayers("dataholz_gdsnxn01a_timber_frame_lab_2026", "raw"));
    const duplicateSingleEntryRole = snapshot(buildExactLayers("tuas_r7b_open_box_timber_measured_2026", "raw"));

    expect(rawDrift).toMatchObject({
      basis: null,
      estimateKind: null,
      matchId: null,
      supported: ["Rw"],
      unsupported: ["R'w", "DnT,w", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w"]
    });
    expect(includesWarning(rawDrift, /ceiling board x2/i)).toBe(true);

    expect(rawNoSafeInference).toMatchObject({
      basis: null,
      estimateKind: null,
      matchId: null,
      supported: ["Rw"],
      unsupported: ["R'w", "DnT,w", "Ln,w", "Ln,w+CI", "L'n,w", "L'nT,w"]
    });

    expect(duplicateSingleEntryRole).toMatchObject({
      basis: "predictor_floor_system_family_general_estimate",
      estimateKind: "family_general",
      matchId: null,
      supported: ["Rw", "Ln,w", "Ln,w+CI"],
      unsupported: ["R'w", "DnT,w", "L'n,w", "L'nT,w"]
    });
    expect(includesWarning(duplicateSingleEntryRole, /ceiling cavity x2/i)).toBe(true);
    expect(includesWarning(duplicateSingleEntryRole, /floor covering x2/i)).toBe(true);
  });

  it("requires paired engine and web visible tests before any Gate C copy movement", () => {
    expect(GATE_C_VISIBLE_TEST_PLAN).toEqual({
      engineRequiredTests: [
        "engine_role_tagged_exact_positive_control",
        "engine_raw_parity_green_no_arbitrary_reorder_invariance_claim",
        "engine_raw_tagged_drift_requires_floor_role_prompt",
        "engine_raw_no_safe_inference_requires_floor_role_prompt",
        "engine_duplicate_single_entry_role_requires_floor_role_prompt",
        "engine_many_layer_duplicate_stays_finite_no_exact_promotion",
        "engine_hostile_input_stays_fail_closed_before_prompt_guard"
      ],
      routeCardCopyMovementAllowedInGateB: false,
      selectedGateCAction: "gate_c_implement_raw_floor_role_prompt_guard_with_engine_web_visible_tests",
      selectedGateCFile: "packages/engine/src/floor-raw-role-inference-guardrail-gate-c-implementation.test.ts",
      webRequiredTests: [
        "web_route_card_shows_floor_role_prompt_for_raw_drift",
        "web_output_card_does_not_promote_lnw_or_lnw_ci_without_roles",
        "web_raw_parity_green_route_card_does_not_claim_arbitrary_reorder_invariance",
        "web_duplicate_role_warning_stays_visible_before_exact_copy"
      ],
      warningCopyMovementAllowedInGateB: false
    });
  });

  it("keeps negative boundaries explicit for future source-lane and prompt-guard work", () => {
    expect(FLOOR_RAW_ROLE_PROMPT_NEGATIVE_BOUNDARIES).toEqual([
      "raw_floor_role_inference",
      "arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed",
      "raw_tagged_drift_requires_floor_role_prompt",
      "raw_no_safe_inference_requires_floor_role_prompt",
      "duplicate_single_entry_role_requires_floor_role_prompt",
      "many_layer_duplicate_floor_stack_stays_finite_no_exact_promotion",
      "hostile_api_input_stays_fail_closed_before_prompt_guard",
      "paired_engine_and_web_visible_tests_before_route_card_output_card_or_warning_copy_movement",
      "standing_lane_misclassification_monitoring_mandate",
      "note_test_document_or_easy_fix",
      "paused_waiting_rights_safe_source_packet",
      "multileaf_screening_blend_fail_closed_until_grouped_topology"
    ]);
  });

  it("keeps active docs aligned on Gate B design, Gate C selection, and rockwool posture", () => {
    const docs = [
      readRepoFile("AGENTS.md"),
      readRepoFile("docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"),
      readRepoFile("docs/calculator/CURRENT_STATE.md"),
      readRepoFile("docs/calculator/SLICE_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_PLAN.md"),
      readRepoFile("docs/calculator/CHECKPOINT_2026-05-03_FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_B_HANDOFF.md"),
      readRepoFile("docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"),
      readRepoFile("docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md"),
      readRepoFile("docs/calculator/CALCULATOR_ROUTE_SOURCE_RISK_REGISTER_2026-05-01.md")
    ];

    for (const doc of docs) {
      expect(doc).toContain(FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_B.selectionStatus);
      expect(doc).toContain(FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_B.selectedNextFile);
      expect(doc).toContain(FLOOR_RAW_ROLE_INFERENCE_GUARDRAIL_GATE_B.selectedNextAction);
      expect(doc).toContain("raw_floor_role_inference");
      expect(doc).toContain("raw_tagged_drift_requires_floor_role_prompt");
      expect(doc).toContain("raw_no_safe_inference_requires_floor_role_prompt");
      expect(doc).toContain("duplicate_single_entry_role_requires_floor_role_prompt");
      expect(doc).toContain("paired_engine_and_web_visible_tests_before_route_card_output_card_or_warning_copy_movement");
      expect(doc).toContain("arbitrary_raw_floor_reorder_value_invariance_remains_unclaimed");
      expect(doc).toContain("standing_lane_misclassification_monitoring_mandate");
      expect(doc).toContain("note_test_document_or_easy_fix");
      expect(doc).toContain("paused_waiting_rights_safe_source_packet");
      expect(doc).toContain("multileaf_screening_blend_fail_closed_until_grouped_topology");
    }
  });
});
