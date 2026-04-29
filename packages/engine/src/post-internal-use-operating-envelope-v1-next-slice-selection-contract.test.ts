import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const POST_INTERNAL_USE_OPERATING_ENVELOPE_GATE_C_CLOSEOUT = {
  apiShapeChange: false,
  closedImplementationSlice: "internal_use_operating_envelope_v1",
  confidencePromotion: false,
  evidencePromotion: false,
  latestLandedGate: "gate_b_regular_internal_use_visibility_audit",
  nextExecutionAction: "gate_a_rank_source_pack_readiness_without_runtime_import",
  numericRuntimeBehaviorChange: false,
  outputCardStatusChange: false,
  routeCardValueChange: false,
  runtimeTightening: false,
  runtimeWidening: false,
  selectedImplementationSlice: "calculator_source_pack_readiness_triage_v1",
  selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md",
  selectedRouteFamily: "source_pack_readiness_triage_no_runtime",
  selectionStatus:
    "closed_internal_use_operating_envelope_no_runtime_and_selected_source_pack_readiness_triage_because_no_source_ready_accuracy_pack_exists",
  sliceId: "post_internal_use_operating_envelope_v1_next_slice_selection",
  supportPromotion: false
} as const;

const INTERNAL_USE_GATE_C_EVIDENCE = {
  gateA: {
    proof: "packages/engine/src/internal-use-operating-envelope-v1-gate-a-contract.test.ts",
    usageNote: "docs/calculator/INTERNAL_USE_PILOT_USAGE_NOTE.md"
  },
  gateB: {
    engineProof: "packages/engine/src/internal-use-operating-envelope-v1-gate-b-contract.test.ts",
    webProof: "apps/web/features/workbench/internal-use-operating-envelope-visibility-gate-b.test.ts"
  },
  latestReadinessCheck:
    "docs/calculator/CHECKPOINT_2026-04-28_INTERNAL_USE_OPERATING_ENVELOPE_CLEAN_STOP_GATE_C_READY_HANDOFF.md",
  closeoutHandoff:
    "docs/calculator/CHECKPOINT_2026-04-29_INTERNAL_USE_OPERATING_ENVELOPE_GATE_C_CLOSEOUT_HANDOFF.md"
} as const;

const PRESERVED_VISIBLE_POSTURE = {
  onlyBehaviorMovement:
    "gate_b_visible_copy_for_dynamic_wall_formula_routes_validation_evidence_and_proposal_surfaces",
  wallFormulaRoutes:
    "formula_owned_source_gated_scoped_estimates_until_a_later_source_slice_changes_the_contract",
  generatedSteelFloorFallback: {
    confidence: "low",
    deliveryPosture: "screening_only",
    unsupportedTargetOutputs: ["L'nT,50"]
  },
  unchangedSurfaces: [
    "acoustic_formula_values",
    "support_classes",
    "confidence_classes",
    "evidence_tiers",
    "api_shape",
    "route_card_values",
    "output_card_statuses"
  ]
} as const;

const SOURCE_READY_ACCURACY_PACK_REQUIREMENTS = [
  "exact_topology_and_material_thickness_mapping",
  "metric_owner_and_lab_or_field_context",
  "tolerance_owner",
  "protected_negative_boundaries",
  "paired_engine_and_web_route_card_or_report_tests"
] as const;

const SOURCE_PACK_READINESS_RANK = [
  {
    id: "timber_double_board_stud_wall",
    currentPosture: "formula_owned_low_confidence_source_gated",
    firstMissingRequirement: "direct_double_board_timber_topology_row_or_bounded_formula_tolerance_owner",
    selectedForRuntimeImportNow: false
  },
  {
    id: "clt_mass_timber_wall",
    currentPosture: "formula_owned_medium_confidence_source_gated",
    firstMissingRequirement: "wall_specific_clt_nlt_dlt_row_pack_or_laminated_leaf_tolerance_owner",
    selectedForRuntimeImportNow: false
  },
  {
    id: "lined_massive_heavy_core_wall",
    currentPosture: "screening_no_wall_source_or_bounded_lining_rule",
    firstMissingRequirement: "wall_specific_lined_concrete_heavy_masonry_row_or_bounded_lining_rule",
    selectedForRuntimeImportNow: false
  },
  {
    id: "no_stud_double_leaf_wall",
    currentPosture: "formula_owned_source_blocked",
    firstMissingRequirement: "no_stud_no_rail_direct_row_mapping_or_local_davy_sharp_tolerance_owner",
    selectedForRuntimeImportNow: false
  },
  {
    id: "generated_floor_fallback",
    currentPosture: "low_confidence_screening",
    firstMissingRequirement: "exact_pliteq_ubiq_topology_match_or_bounded_steel_open_web_family_rule",
    selectedForRuntimeImportNow: false
  },
  {
    id: "historical_blocked_families",
    currentPosture: "closed_fail_closed",
    firstMissingRequirement: "new_source_evidence_for_gdmtxa04a_c11c_or_true_bare_carrier_impact_behavior",
    selectedForRuntimeImportNow: false
  }
] as const;

const SELECTED_SOURCE_PACK_READINESS_TRIAGE_GATE_A = {
  firstGate: "gate_a_rank_source_pack_readiness_without_runtime_import",
  requiredCandidateFamilies: SOURCE_PACK_READINESS_RANK.map((candidate) => candidate.id),
  requiredEvidenceFields: [
    "candidate_id_current_posture_and_user_visible_risk",
    "candidate_source_or_formula_owner_if_any",
    "missing_topology_metric_tolerance_or_negative_boundary_prerequisite",
    "positive_and_negative_test_shape_required_before_runtime_import",
    "selected_next_action_or_roadmap_only_reason"
  ],
  requiredPlanningSurfaces: [
    "docs/calculator/SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md",
    "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
    "docs/calculator/SOURCE_GAP_LEDGER.md",
    "docs/calculator/CURRENT_STATE.md",
    "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"
  ],
  runtimeBehaviorChange: false,
  targetFirstGateFile: "packages/engine/src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts"
} as const;

describe("post internal-use operating envelope Gate C next-slice selection contract", () => {
  it("closes the internal-use operating envelope no-runtime and selects source-pack readiness triage", () => {
    expect(POST_INTERNAL_USE_OPERATING_ENVELOPE_GATE_C_CLOSEOUT).toEqual({
      apiShapeChange: false,
      closedImplementationSlice: "internal_use_operating_envelope_v1",
      confidencePromotion: false,
      evidencePromotion: false,
      latestLandedGate: "gate_b_regular_internal_use_visibility_audit",
      nextExecutionAction: "gate_a_rank_source_pack_readiness_without_runtime_import",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      routeCardValueChange: false,
      runtimeTightening: false,
      runtimeWidening: false,
      selectedImplementationSlice: "calculator_source_pack_readiness_triage_v1",
      selectedPlanningSurface: "docs/calculator/SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md",
      selectedRouteFamily: "source_pack_readiness_triage_no_runtime",
      selectionStatus:
        "closed_internal_use_operating_envelope_no_runtime_and_selected_source_pack_readiness_triage_because_no_source_ready_accuracy_pack_exists",
      sliceId: "post_internal_use_operating_envelope_v1_next_slice_selection",
      supportPromotion: false
    });

    for (const path of [
      POST_INTERNAL_USE_OPERATING_ENVELOPE_GATE_C_CLOSEOUT.selectedPlanningSurface,
      INTERNAL_USE_GATE_C_EVIDENCE.closeoutHandoff,
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("ties Gate C closeout to Gate A, Gate B, and the clean-stop readiness evidence", () => {
    for (const path of [
      INTERNAL_USE_GATE_C_EVIDENCE.gateA.proof,
      INTERNAL_USE_GATE_C_EVIDENCE.gateA.usageNote,
      INTERNAL_USE_GATE_C_EVIDENCE.gateB.engineProof,
      INTERNAL_USE_GATE_C_EVIDENCE.gateB.webProof,
      INTERNAL_USE_GATE_C_EVIDENCE.latestReadinessCheck
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("preserves visible honesty posture without promoting runtime, confidence, support, or evidence", () => {
    expect(PRESERVED_VISIBLE_POSTURE).toEqual({
      onlyBehaviorMovement:
        "gate_b_visible_copy_for_dynamic_wall_formula_routes_validation_evidence_and_proposal_surfaces",
      wallFormulaRoutes:
        "formula_owned_source_gated_scoped_estimates_until_a_later_source_slice_changes_the_contract",
      generatedSteelFloorFallback: {
        confidence: "low",
        deliveryPosture: "screening_only",
        unsupportedTargetOutputs: ["L'nT,50"]
      },
      unchangedSurfaces: [
        "acoustic_formula_values",
        "support_classes",
        "confidence_classes",
        "evidence_tiers",
        "api_shape",
        "route_card_values",
        "output_card_statuses"
      ]
    });
  });

  it("does not select a source-ready accuracy import because every candidate still misses a required pack element", () => {
    expect(SOURCE_READY_ACCURACY_PACK_REQUIREMENTS).toEqual([
      "exact_topology_and_material_thickness_mapping",
      "metric_owner_and_lab_or_field_context",
      "tolerance_owner",
      "protected_negative_boundaries",
      "paired_engine_and_web_route_card_or_report_tests"
    ]);
    expect(SOURCE_PACK_READINESS_RANK.every((candidate) => candidate.selectedForRuntimeImportNow === false)).toBe(
      true
    );
    expect(SOURCE_PACK_READINESS_RANK.every((candidate) => candidate.firstMissingRequirement.length > 40)).toBe(true);
  });

  it("defines the first gate of the selected source-pack readiness triage slice", () => {
    expect(SELECTED_SOURCE_PACK_READINESS_TRIAGE_GATE_A).toEqual({
      firstGate: "gate_a_rank_source_pack_readiness_without_runtime_import",
      requiredCandidateFamilies: [
        "timber_double_board_stud_wall",
        "clt_mass_timber_wall",
        "lined_massive_heavy_core_wall",
        "no_stud_double_leaf_wall",
        "generated_floor_fallback",
        "historical_blocked_families"
      ],
      requiredEvidenceFields: [
        "candidate_id_current_posture_and_user_visible_risk",
        "candidate_source_or_formula_owner_if_any",
        "missing_topology_metric_tolerance_or_negative_boundary_prerequisite",
        "positive_and_negative_test_shape_required_before_runtime_import",
        "selected_next_action_or_roadmap_only_reason"
      ],
      requiredPlanningSurfaces: [
        "docs/calculator/SLICE_CALCULATOR_SOURCE_PACK_READINESS_TRIAGE_PLAN.md",
        "docs/calculator/CALCULATOR_COMPREHENSIVE_ACCURACY_ROADMAP.md",
        "docs/calculator/SOURCE_GAP_LEDGER.md",
        "docs/calculator/CURRENT_STATE.md",
        "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md"
      ],
      runtimeBehaviorChange: false,
      targetFirstGateFile: "packages/engine/src/calculator-source-pack-readiness-triage-gate-a-contract.test.ts"
    });
  });

  it("keeps source-gated and productization boundaries closed after the internal-use slice closes", () => {
    expect(POST_INTERNAL_USE_OPERATING_ENVELOPE_GATE_C_CLOSEOUT.runtimeWidening).toBe(false);
    expect(POST_INTERNAL_USE_OPERATING_ENVELOPE_GATE_C_CLOSEOUT.confidencePromotion).toBe(false);
    expect(POST_INTERNAL_USE_OPERATING_ENVELOPE_GATE_C_CLOSEOUT.supportPromotion).toBe(false);
    expect(POST_INTERNAL_USE_OPERATING_ENVELOPE_GATE_C_CLOSEOUT.evidencePromotion).toBe(false);
    expect(POST_INTERNAL_USE_OPERATING_ENVELOPE_GATE_C_CLOSEOUT.selectedRouteFamily).toBe(
      "source_pack_readiness_triage_no_runtime"
    );
  });
});
