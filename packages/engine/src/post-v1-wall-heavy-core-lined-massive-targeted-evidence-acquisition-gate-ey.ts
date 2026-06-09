import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_GATE_EX_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EX_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_EX_SELECTED_TARGET_OUTPUTS,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTION_STATUS,
  summarizePostV1GateEXNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-ex";

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_LANDED_GATE =
  "post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_plan" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTION_STATUS =
  "post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_landed_no_runtime_owner_remains_rejected_selected_next_numeric_coverage_gap_gate_ez" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_ez_plan" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ez-contract.test.ts" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage/accuracy gap Gate EZ" as const;

export const POST_V1_GATE_EY_EVIDENCE_DECISION_ID =
  "wall.heavy_core_lined_massive.targeted_evidence_acquired_owner_still_rejected_no_runtime_admissible_row_or_rule" as const;

export const POST_V1_GATE_EY_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_EY_EZ_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_CLOSEOUT_PLAN_2026-06-09.md" as const;

export const POST_V1_GATE_EY_TARGET_OUTPUTS = [
  ...POST_V1_GATE_EX_SELECTED_TARGET_OUTPUTS
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_EY_NO_RUNTIME_COUNTERS = {
  acceptedBoundedWallLiningRules: 0,
  acceptedTargetedEvidenceLedgers: 2,
  broadSourceCrawlSelected: false,
  calibrationOwnerReopened: false,
  calibrationOwnerRemainsRejected: true,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeAdmissibleEvidenceLedgers: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  targetedEvidenceLedgers: 6
} as const;

export type PostV1GateEYEvidenceId =
  | "british_gypsum_b226010_lined_brick_row_context_only"
  | "current_gate_dg_bounded_prediction_rejected_as_calibration_holdout"
  | "iso_sharp_davy_formula_context_rejected_as_bounded_wall_lining_rule"
  | "knauf_cc60_floor_rows_rejected_for_wall_truth"
  | "knauf_mwi2a_lined_concrete_panel_block_rows_context_only"
  | "presets_selector_deep_hybrid_rejected_as_source_truth";

export type PostV1GateEYEvidenceKind =
  | "current_runtime_pin_context"
  | "floor_only_source_context"
  | "formula_framework_context"
  | "selector_preset_stability_context"
  | "wall_specific_lined_brick_source_context"
  | "wall_specific_lined_concrete_source_context";

export type PostV1GateEYEvidenceDecision =
  | "accepted_targeted_context_not_runtime_admissible"
  | "rejected_adjacent_or_incomplete";

export type PostV1GateEYEvidenceLedger = {
  readonly acceptedAsTargetedEvidence: boolean;
  readonly acceptedForRuntimeOwner: boolean;
  readonly boundedWallLiningRuleAccepted: boolean;
  readonly broadSourceCrawl: boolean;
  readonly decision: PostV1GateEYEvidenceDecision;
  readonly evidencePaths: readonly string[];
  readonly id: PostV1GateEYEvidenceId;
  readonly kind: PostV1GateEYEvidenceKind;
  readonly metricBasisBoundary: string;
  readonly ownerReopenAllowedNow: boolean;
  readonly protectedNegativeBoundaries: readonly string[];
  readonly runtimeAdmissibilityReason: string;
  readonly runtimeAdmissibleNow: boolean;
  readonly sourceLocator: string;
  readonly topologyBoundary: string;
};

export type PostV1GateEYDecision = {
  readonly acceptedBoundedWallLiningRules: 0;
  readonly acceptedTargetedEvidenceLedgers: 2;
  readonly decisionId: typeof POST_V1_GATE_EY_EVIDENCE_DECISION_ID;
  readonly ownerRemainsRejected: true;
  readonly reason: string;
  readonly runtimeAdmissibleEvidenceLedgers: 0;
  readonly selectedNextAction: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_FILE;
};

export type PostV1GateEYSummary = {
  readonly decision: PostV1GateEYDecision;
  readonly evidence: readonly PostV1GateEYEvidenceLedger[];
  readonly landedGate: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_EY_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_EY_PLAN_DOC_PATH;
  readonly previousGateEX: {
    readonly counters: typeof POST_V1_GATE_EX_NO_RUNTIME_COUNTERS;
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_LANDED_GATE;
    readonly selectedCandidateId: typeof POST_V1_GATE_EX_SELECTED_CANDIDATE_ID;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTION_STATUS;
  };
  readonly selectedNextAction: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_EY_TARGET_OUTPUTS;
};

export function buildPostV1GateEYTargetedEvidenceLedgers():
  readonly PostV1GateEYEvidenceLedger[] {
  return [
    {
      acceptedAsTargetedEvidence: true,
      acceptedForRuntimeOwner: false,
      boundedWallLiningRuleAccepted: false,
      broadSourceCrawl: false,
      decision: "accepted_targeted_context_not_runtime_admissible",
      evidencePaths: [
        "packages/engine/src/lined-masonry-knauf-mwi2a-mapping-tolerance-gate-a-contract.test.ts",
        "packages/engine/src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts"
      ],
      id: "knauf_mwi2a_lined_concrete_panel_block_rows_context_only",
      kind: "wall_specific_lined_concrete_source_context",
      metricBasisBoundary:
        "MWI.2A reports lab Rw and Rw+Ctr context only; it does not own field R'w, Dn,w, DnT,w, DnT,A, STC, C, or Ctr publication for the live route.",
      ownerReopenAllowedNow: false,
      protectedNegativeBoundaries: [
        "does_not_promote_generic_gypsum_rockwool_concrete_stack_to_exact_knauf_source_row",
        "does_not_alias_lab_rw_plus_ctr_rows_into_field_or_building_outputs",
        "does_not_create_local_lining_tolerance_without_holdouts"
      ],
      runtimeAdmissibilityReason:
        "The source is wall-specific and useful evidence, but its Sheetrock One, furring/coupling, concrete panel/block, KI glasswool, side-order, and tolerance boundaries do not match the live generic lined-massive route.",
      runtimeAdmissibleNow: false,
      sourceLocator:
        "Knauf AU Systems+ Section F Masonry Upgrades MWI.2A, RT&A TE405-20S09(R4), https://knauf.com/api/download-center/v1/assets/16b8f406-a9be-47bd-9e7a-7212d6f19a28?country=AU&download=true&locale=en-AU",
      topologyBoundary:
        "1x13 mm SHEETROCK ONE adhesive fixed on one side and 1x13 mm on 28 mm furring channels on the other side over concrete panel/core-filled block variants, not the live generic gypsum_board 12.5 / rockwool 50 / air_gap 50 / concrete 100 stack."
    },
    {
      acceptedAsTargetedEvidence: true,
      acceptedForRuntimeOwner: false,
      boundedWallLiningRuleAccepted: false,
      broadSourceCrawl: false,
      decision: "accepted_targeted_context_not_runtime_admissible",
      evidencePaths: [
        "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-a-contract.test.ts",
        "packages/engine/src/british-gypsum-white-book-source-pack-extraction-gate-b-contract.test.ts",
        "packages/engine/src/post-british-gypsum-white-book-source-pack-extraction-v1-next-slice-selection-contract.test.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts"
      ],
      id: "british_gypsum_b226010_lined_brick_row_context_only",
      kind: "wall_specific_lined_brick_source_context",
      metricBasisBoundary:
        "B226010 reports lab Rw and Rw+Ctr for a specific lined brick system; it does not own field/building outputs or companion STC, C, and Ctr for generic lined concrete.",
      ownerReopenAllowedNow: false,
      protectedNegativeBoundaries: [
        "does_not_promote_solid_brick_plaster_gl1_apr_row_into_generic_lined_concrete",
        "does_not_alias_british_gypsum_lab_rwctr_to_field_or_building_metrics",
        "does_not_supply_local_tolerance_for_heavy_core_screening"
      ],
      runtimeAdmissibilityReason:
        "The row is targeted wall evidence, but its 103 mm solid brick, plaster, GL1 channels, APR insulation, and SoundBloc topology is a context-only near source, not a runtime owner for the live lined concrete/heavy-core route.",
      runtimeAdmissibleNow: false,
      sourceLocator:
        "British Gypsum White Book Specification Selector B226010, https://www.british-gypsum.com/Specification/White-Book-Specification-Selector/wall-linings/gyplyner-single/b226010-en",
      topologyBoundary:
        "103 mm solid brick at 1700 kg/m3 with 13 mm plaster each side, GL1 channels both sides, 35 mm cavities, 25 mm Isover APR, and 1x12.5 SoundBloc, not Knauf MWI.2A and not the live generic concrete stack."
    },
    {
      acceptedAsTargetedEvidence: false,
      acceptedForRuntimeOwner: false,
      boundedWallLiningRuleAccepted: false,
      broadSourceCrawl: false,
      decision: "rejected_adjacent_or_incomplete",
      evidencePaths: [
        "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
        "packages/catalogs/src/index.ts"
      ],
      id: "knauf_cc60_floor_rows_rejected_for_wall_truth",
      kind: "floor_only_source_context",
      metricBasisBoundary:
        "Floor/ceiling CC60 rows cannot define a wall airborne lining tolerance, even when a concrete carrier appears similar.",
      ownerReopenAllowedNow: false,
      protectedNegativeBoundaries: [
        "does_not_borrow_floor_ceiling_cc60_rows_for_wall_lining_truth",
        "does_not_convert_floor_impact_or_floor_airborne_context_to_wall_outputs"
      ],
      runtimeAdmissibilityReason:
        "The source family is floor-only and remains rejected for wall calibration ownership.",
      runtimeAdmissibleNow: false,
      sourceLocator: "Knauf CC60 concrete floor/ceiling rows from existing local source-corpus context",
      topologyBoundary:
        "Floor/ceiling carrier and lower-treatment topology is not a wall lined-massive side-lining topology."
    },
    {
      acceptedAsTargetedEvidence: false,
      acceptedForRuntimeOwner: false,
      boundedWallLiningRuleAccepted: false,
      broadSourceCrawl: false,
      decision: "rejected_adjacent_or_incomplete",
      evidencePaths: [
        "packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts",
        "packages/engine/src/dynamic-airborne-framed-wall.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts"
      ],
      id: "iso_sharp_davy_formula_context_rejected_as_bounded_wall_lining_rule",
      kind: "formula_framework_context",
      metricBasisBoundary:
        "Formula framework context is not a local single-number coefficient and tolerance owner for Rw/STC/C/Ctr or field/building derivatives.",
      ownerReopenAllowedNow: false,
      protectedNegativeBoundaries: [
        "does_not_author_bounded_wall_lining_rule_without_coefficient_scope",
        "does_not_retune_gate_dg_values_without_holdout_residuals",
        "does_not_weaken_negative_boundaries_for_non_matching_wall_topologies"
      ],
      runtimeAdmissibilityReason:
        "ISO/Sharp/Davy context remains useful background, but Gate EY found no named coefficient scope, local tolerance, holdouts, or negative-boundary proof.",
      runtimeAdmissibleNow: false,
      sourceLocator: "Local formula context from ISO/Sharp/Davy implementation notes and current wall formula audits",
      topologyBoundary:
        "Framework equations describe route families, not a bounded local rule for the specific live lined-massive/heavy-core stack."
    },
    {
      acceptedAsTargetedEvidence: false,
      acceptedForRuntimeOwner: false,
      boundedWallLiningRuleAccepted: false,
      broadSourceCrawl: false,
      decision: "rejected_adjacent_or_incomplete",
      evidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-accuracy-gate-dd.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts"
      ],
      id: "current_gate_dg_bounded_prediction_rejected_as_calibration_holdout",
      kind: "current_runtime_pin_context",
      metricBasisBoundary:
        "The existing bounded_prediction lab and family_physics_prediction field outputs are live behavior, not measured calibration evidence.",
      ownerReopenAllowedNow: false,
      protectedNegativeBoundaries: [
        "does_not_treat_runtime_pin_as_holdout_source_truth",
        "does_not_change_wall_screening_concrete_values_in_gate_ey"
      ],
      runtimeAdmissibilityReason:
        "A current runtime pin cannot prove its own calibration owner or tolerance.",
      runtimeAdmissibleNow: false,
      sourceLocator: "Gate DD/DG current runtime pins for wall-screening-concrete",
      topologyBoundary:
        "The live generic stack remains pinned only as source-absent bounded prediction until independent owner evidence exists."
    },
    {
      acceptedAsTargetedEvidence: false,
      acceptedForRuntimeOwner: false,
      boundedWallLiningRuleAccepted: false,
      broadSourceCrawl: false,
      decision: "rejected_adjacent_or_incomplete",
      evidencePaths: [
        "packages/engine/src/dynamic-airborne-wall-selector-value-pins.test.ts",
        "packages/engine/src/dynamic-airborne-deep-hybrid-swap-heavy-core.test.ts",
        "apps/web/features/workbench/wall-field-continuation-completeness-matrix.test.ts"
      ],
      id: "presets_selector_deep_hybrid_rejected_as_source_truth",
      kind: "selector_preset_stability_context",
      metricBasisBoundary:
        "Selector, preset, and continuation stability checks are implementation guards, not measured source rows or formula tolerance evidence.",
      ownerReopenAllowedNow: false,
      protectedNegativeBoundaries: [
        "does_not_promote_ui_or_selector_stability_to_acoustic_source_truth",
        "does_not_convert_deep_hybrid_guardrails_into_calibration_holdouts"
      ],
      runtimeAdmissibilityReason:
        "These artifacts protect route stability but cannot reopen the heavy-core/lined-massive calibration owner.",
      runtimeAdmissibleNow: false,
      sourceLocator: "Local selector, preset, deep-hybrid, and workbench continuation contracts",
      topologyBoundary:
        "UI and selector route guards do not define physical side-order, mounting, coupling, or measured wall source topology."
    }
  ] as const satisfies readonly PostV1GateEYEvidenceLedger[];
}

export function summarizePostV1WallHeavyCoreLinedMassiveTargetedEvidenceGateEY():
  PostV1GateEYSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_LANDED_GATE
  ) {
    throw new Error("Gate EY can only land after Gate EX selects the targeted evidence acquisition gate.");
  }

  const previousGateEX = summarizePostV1GateEXNumericCoverageGap();
  const evidence = buildPostV1GateEYTargetedEvidenceLedgers();

  const acceptedTargetedEvidence = evidence.filter((row) => row.acceptedAsTargetedEvidence);
  const runtimeAdmissibleEvidence = evidence.filter((row) => row.runtimeAdmissibleNow);
  const acceptedBoundedRules = evidence.filter((row) => row.boundedWallLiningRuleAccepted);

  if (acceptedTargetedEvidence.length !== POST_V1_GATE_EY_NO_RUNTIME_COUNTERS.acceptedTargetedEvidenceLedgers) {
    throw new Error("Gate EY must accept exactly the targeted MWI.2A and B226010 evidence contexts.");
  }

  if (runtimeAdmissibleEvidence.length > 0 || acceptedBoundedRules.length > 0) {
    throw new Error("Gate EY cannot reopen the owner without a runtime-admissible source row or bounded rule.");
  }

  const decision: PostV1GateEYDecision = {
    acceptedBoundedWallLiningRules: 0,
    acceptedTargetedEvidenceLedgers: POST_V1_GATE_EY_NO_RUNTIME_COUNTERS.acceptedTargetedEvidenceLedgers,
    decisionId: POST_V1_GATE_EY_EVIDENCE_DECISION_ID,
    ownerRemainsRejected: true,
    reason:
      "Gate EY found targeted wall-specific MWI.2A and B226010 evidence contexts, but neither is runtime-admissible for the live heavy-core / lined-massive route and no bounded wall lining rule was accepted.",
    runtimeAdmissibleEvidenceLedgers: 0,
    selectedNextAction:
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_FILE
  };

  return {
    decision,
    evidence,
    landedGate: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_EY_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_EY_PLAN_DOC_PATH,
    previousGateEX: {
      counters: previousGateEX.noRuntimeCounters,
      landedGate: previousGateEX.landedGate,
      selectedCandidateId: previousGateEX.selectedCandidateId,
      selectedNextAction: previousGateEX.selectedNextAction,
      selectedNextFile: previousGateEX.selectedNextFile,
      selectionStatus: previousGateEX.selectionStatus
    },
    selectedNextAction:
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_LABEL,
    selectionStatus:
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_EY_TARGET_OUTPUTS
  };
}
