import type { RequestedOutputId } from "@dynecho/shared";

import {
  GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
  GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-h-lined-masonry-clt";
import {
  GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
  GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID
} from "./dynamic-airborne-gate-i-airborne-field-context";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-de";

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_LANDED_GATE =
  "post_v1_wall_heavy_core_lined_massive_bounded_rule_gate_df_plan" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTION_STATUS =
  "post_v1_wall_heavy_core_lined_massive_bounded_rule_gate_df_landed_no_runtime_selected_bounded_runtime_basis_gate_dg" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_ACTION =
  "post_v1_wall_heavy_core_lined_massive_bounded_runtime_basis_gate_dg_plan" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts" as const;

export const POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_LABEL =
  "post-V1 wall heavy-core / lined-massive bounded runtime-basis Gate DG" as const;

export const POST_V1_GATE_DF_BOUNDED_RULE_OWNER_CANDIDATE_ID =
  "wall.heavy_core_lined_massive.bounded_rule_owner_contract" as const;

export const POST_V1_GATE_DF_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DF_LAB_BOUNDED_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DF_FIELD_ADAPTER_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export type PostV1GateDFEnvelopeField = {
  readonly fieldId:
    | "absorberClass"
    | "cavityDepthMm"
    | "cavityFillCoverage"
    | "heavyMasonryLeafMassKgM2"
    | "lightLiningLeafMassKgM2"
    | "selectedDelegateCurve"
    | "wallTopologyFamily";
  readonly rule: string;
};

export type PostV1GateDFNegativeBoundary = {
  readonly boundaryId:
    | "aac_or_multicavity_grouped_topology"
    | "direct_value_retune"
    | "field_or_building_metric_adapter"
    | "floor_rows_or_workbench_presets"
    | "heavy_composite_double_leaf_sibling"
    | "source_or_exact_promotion";
  readonly runtimeMovementAllowedNow: false;
  readonly reason: string;
};

export const POST_V1_GATE_DF_BOUNDED_RULE_ENVELOPE = [
  {
    fieldId: "wallTopologyFamily",
    rule: "element_lab lined_massive_wall only: two visible leaves, one compliant cavity, no support layer"
  },
  {
    fieldId: "lightLiningLeafMassKgM2",
    rule: "one board/lining leaf must stay light enough for the lined-massive detector, currently <= 35 kg/m2"
  },
  {
    fieldId: "heavyMasonryLeafMassKgM2",
    rule: "one masonry/concrete leaf must provide the heavy core, currently >= 80 kg/m2"
  },
  {
    fieldId: "cavityDepthMm",
    rule: "explicit compliant cavity thickness must be present and at least 20 mm"
  },
  {
    fieldId: "cavityFillCoverage",
    rule: "porous fill/gap state is read from visible layers; no hidden default fill may be injected"
  },
  {
    fieldId: "absorberClass",
    rule: "absorber behavior is inherited only from route-visible layer materials and nominal material properties"
  },
  {
    fieldId: "selectedDelegateCurve",
    rule: "current numeric curve remains the Gate H 0.75 mass_law + 0.25 screening seed lined_massive_blend"
  }
] as const satisfies readonly PostV1GateDFEnvelopeField[];

export const POST_V1_GATE_DF_NEGATIVE_BOUNDARIES = [
  {
    boundaryId: "direct_value_retune",
    reason: "Gate DF names the bounded-rule envelope but does not change wall-screening-concrete Rw, STC, C, Ctr, R'w, Dn,w, DnT,w, or DnT,A values.",
    runtimeMovementAllowedNow: false
  },
  {
    boundaryId: "source_or_exact_promotion",
    reason: "Exact/calibrated promotion still requires a rights-safe same-stack wall source or calibration holdout; Gate DF does not import source rows.",
    runtimeMovementAllowedNow: false
  },
  {
    boundaryId: "field_or_building_metric_adapter",
    reason: "Field and building metrics remain owned by their explicit adapters; the lab bounded rule must not alias lab Rw/STC into R'w/Dn/DnT.",
    runtimeMovementAllowedNow: false
  },
  {
    boundaryId: "heavy_composite_double_leaf_sibling",
    reason: "Balanced heavy composite cavity walls stay on the double-leaf/heavy-composite lane instead of borrowing the lined-massive bounded rule.",
    runtimeMovementAllowedNow: false
  },
  {
    boundaryId: "aac_or_multicavity_grouped_topology",
    reason: "AAC, deep-hybrid, grouped, or multicavity boundary cases are not promoted by the narrow heavy-core lined-massive owner.",
    runtimeMovementAllowedNow: false
  },
  {
    boundaryId: "floor_rows_or_workbench_presets",
    reason: "Knauf CC60 floor rows, workbench presets, selector pins, and deep-hybrid guards remain evidence boundaries, not wall rule calibration rows.",
    runtimeMovementAllowedNow: false
  }
] as const satisfies readonly PostV1GateDFNegativeBoundary[];

export const POST_V1_GATE_DF_COUNTERS = {
  boundedOwnerLedgers: 1,
  boundedRuntimeBasisPromotions: 0,
  directSourceRowsPromoted: 0,
  fieldAdapterRetunes: 0,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  protectedRuntimePins: 8,
  runtimeValuesMoved: 0
} as const;

export type PostV1WallHeavyCoreLinedMassiveBoundedRuleGateDFSummary = {
  readonly boundedRuleEnvelope: typeof POST_V1_GATE_DF_BOUNDED_RULE_ENVELOPE;
  readonly counters: typeof POST_V1_GATE_DF_COUNTERS;
  readonly existingFieldAdapterCandidateId: typeof GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID;
  readonly existingFieldAdapterRuntimeBasisId: typeof GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD;
  readonly existingLabRuntimeBasisId: typeof GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD;
  readonly existingLabSelectedCandidateId: typeof GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID;
  readonly landedGate: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_LANDED_GATE;
  readonly labBoundedOutputs: typeof POST_V1_GATE_DF_LAB_BOUNDED_OUTPUTS;
  readonly negativeBoundaries: typeof POST_V1_GATE_DF_NEGATIVE_BOUNDARIES;
  readonly noRuntimeValueMovement: true;
  readonly previousGateDE: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTION_STATUS;
  };
  readonly selectedCandidateId: typeof POST_V1_GATE_DF_BOUNDED_RULE_OWNER_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_DF_TARGET_OUTPUTS;
};

export function summarizePostV1WallHeavyCoreLinedMassiveBoundedRuleGateDF():
  PostV1WallHeavyCoreLinedMassiveBoundedRuleGateDFSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_LANDED_GATE
  ) {
    throw new Error("Gate DF can only land after Gate DE selects the heavy-core / lined-massive bounded-rule owner.");
  }

  return {
    boundedRuleEnvelope: POST_V1_GATE_DF_BOUNDED_RULE_ENVELOPE,
    counters: POST_V1_GATE_DF_COUNTERS,
    existingFieldAdapterCandidateId: GATE_I_AIRBORNE_FIELD_CONTEXT_SELECTED_CANDIDATE_ID,
    existingFieldAdapterRuntimeBasisId: GATE_I_AIRBORNE_FIELD_CONTEXT_RUNTIME_METHOD,
    existingLabRuntimeBasisId: GATE_H_LINED_MASSIVE_WALL_RUNTIME_METHOD,
    existingLabSelectedCandidateId: GATE_H_LINED_MASSIVE_WALL_SELECTED_CANDIDATE_ID,
    landedGate: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_LANDED_GATE,
    labBoundedOutputs: POST_V1_GATE_DF_LAB_BOUNDED_OUTPUTS,
    negativeBoundaries: POST_V1_GATE_DF_NEGATIVE_BOUNDARIES,
    noRuntimeValueMovement: true,
    previousGateDE: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DE_SELECTION_STATUS
    },
    selectedCandidateId: POST_V1_GATE_DF_BOUNDED_RULE_OWNER_CANDIDATE_ID,
    selectedNextAction: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_BOUNDED_RULE_GATE_DF_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_DF_TARGET_OUTPUTS
  };
}
