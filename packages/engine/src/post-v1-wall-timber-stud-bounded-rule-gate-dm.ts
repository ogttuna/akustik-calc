import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_GATE_DL_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-dl";

export const POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_LANDED_GATE =
  "post_v1_wall_timber_stud_bounded_rule_gate_dm_plan" as const;

export const POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTION_STATUS =
  "post_v1_wall_timber_stud_bounded_rule_gate_dm_landed_no_runtime_selected_timber_stud_bounded_runtime_basis_gate_dn" as const;

export const POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_ACTION =
  "post_v1_wall_timber_stud_bounded_runtime_basis_gate_dn_plan" as const;

export const POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-timber-stud-bounded-runtime-basis-gate-dn-contract.test.ts" as const;

export const POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_LABEL =
  "post-V1 wall timber-stud bounded runtime-basis Gate DN" as const;

export const POST_V1_GATE_DM_BOUNDED_RULE_OWNER_CANDIDATE_ID =
  "wall.timber_stud.bounded_rule_owner_contract" as const;

export const POST_V1_GATE_DM_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DM_LAB_BOUNDED_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_DM_FIELD_ADAPTER_OUTPUTS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export type PostV1GateDMEnvelopeField = {
  readonly fieldId:
    | "boardSystem"
    | "cavityFillCoverage"
    | "directConnection"
    | "metricBasis"
    | "selectedCoefficientCurve"
    | "studSpacingMm"
    | "studSupportOwner"
    | "tolerance"
    | "wallTopologyFamily";
  readonly rule: string;
};

export type PostV1GateDMNegativeBoundary = {
  readonly boundaryId:
    | "clt_or_mass_timber_panel"
    | "direct_value_retune"
    | "exact_or_benchmark_source_promotion"
    | "field_or_building_metric_adapter"
    | "light_steel_stud_or_resilient_bar"
    | "single_board_exact_imports"
    | "split_double_stud_or_grouped_multicavity";
  readonly runtimeMovementAllowedNow: false;
  readonly reason: string;
};

export const POST_V1_GATE_DM_BOUNDED_RULE_ENVELOPE = [
  {
    fieldId: "wallTopologyFamily",
    rule: "element_lab direct timber-stud wall corridor only: two visible board leaves, one compliant cavity, and no grouped multicavity or double-stud split"
  },
  {
    fieldId: "studSupportOwner",
    rule: "wood_stud owner evidence must be explicit through airborneContext.studType=wood_stud; visible steel/resilient support classes remain separate owners"
  },
  {
    fieldId: "boardSystem",
    rule: "current owned corridor is board-dominant double-board gypsum each side with left/right board count 2/2 and no acoustic-board premium lift"
  },
  {
    fieldId: "cavityFillCoverage",
    rule: "cavity/fill state is read from visible layers; the live corridor is 100 mm core depth with 50 mm mineral fill and no hidden default fill"
  },
  {
    fieldId: "studSpacingMm",
    rule: "stud spacing is an explicit owner input; the current coefficient scope pins the 600 mm direct timber-stud spacing correction"
  },
  {
    fieldId: "directConnection",
    rule: "line_connection only for this bounded rule; direct_fix, point_connection, resilient_channel, and side-count routes remain separate"
  },
  {
    fieldId: "selectedCoefficientCurve",
    rule: "current numeric curve remains the stud_surrogate_blend + framed_wall_calibration corridor: double-board base, mineral-fill lift, wood-stud correction, and spacing correction"
  },
  {
    fieldId: "metricBasis",
    rule: "lab Rw/STC/C/Ctr and field R'w/Dn,w/DnT,w/DnT,A stay separate; Gate DM does not alias lab Rw into field/building metrics"
  },
  {
    fieldId: "tolerance",
    rule: "bounded-rule ownership is source-absent and must keep a visible bounded error budget until same-stack calibration or holdouts justify tightening"
  }
] as const satisfies readonly PostV1GateDMEnvelopeField[];

export const POST_V1_GATE_DM_NEGATIVE_BOUNDARIES = [
  {
    boundaryId: "direct_value_retune",
    reason: "Gate DM names the timber-stud bounded-rule envelope but does not change Rw, STC, C, Ctr, R'w, Dn,w, DnT,w, or DnT,A values.",
    runtimeMovementAllowedNow: false
  },
  {
    boundaryId: "exact_or_benchmark_source_promotion",
    reason: "Single-board exact imports, resilient-bar exact rows, the secondary direct double-board row, and steel-framed holdouts do not become exact truth for the live double-board wood-stud stack.",
    runtimeMovementAllowedNow: false
  },
  {
    boundaryId: "single_board_exact_imports",
    reason: "Representable direct single-board timber rows stay on exact measured ownership before any formula corridor is considered.",
    runtimeMovementAllowedNow: false
  },
  {
    boundaryId: "light_steel_stud_or_resilient_bar",
    reason: "Light-steel stud, resilient one-side, and resilient both-sides wall rows have separate support owners and must not borrow the direct wood-stud bounded rule.",
    runtimeMovementAllowedNow: false
  },
  {
    boundaryId: "field_or_building_metric_adapter",
    reason: "Field and building metrics require their explicit adapters; Gate DM does not make lab Rw/STC a field or building answer.",
    runtimeMovementAllowedNow: false
  },
  {
    boundaryId: "split_double_stud_or_grouped_multicavity",
    reason: "Deep split-cavity double-stud, flat grouped multicavity, and unsafe flat-layer multicavity lists remain separate topology owners.",
    runtimeMovementAllowedNow: false
  },
  {
    boundaryId: "clt_or_mass_timber_panel",
    reason: "CLT and mass-timber single-leaf wall routes stay on their own laminated/mass-timber owner and do not inherit timber-stud coefficients.",
    runtimeMovementAllowedNow: false
  }
] as const satisfies readonly PostV1GateDMNegativeBoundary[];

export const POST_V1_GATE_DM_LIVE_ROUTE_PINS = {
  fieldPins: {
    DnTADb: 43.9,
    DnTwDb: 43,
    DnWDb: 42,
    RwPrimeDb: 42
  },
  generatedCaseId: "wall-timber-stud",
  labPins: {
    C: 0.5,
    Ctr: -4.2,
    Rw: 50,
    STC: 50
  },
  tracePins: {
    familyDecisionClass: "ambiguous",
    runnerUpFamily: "double_leaf",
    selectedMethod: "mass_law",
    strategy: "stud_surrogate_blend+framed_wall_calibration"
  }
} as const;

export const POST_V1_GATE_DM_COUNTERS = {
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

export type PostV1WallTimberStudBoundedRuleGateDMSummary = {
  readonly boundedRuleEnvelope: typeof POST_V1_GATE_DM_BOUNDED_RULE_ENVELOPE;
  readonly counters: typeof POST_V1_GATE_DM_COUNTERS;
  readonly landedGate: typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_LANDED_GATE;
  readonly labBoundedOutputs: typeof POST_V1_GATE_DM_LAB_BOUNDED_OUTPUTS;
  readonly negativeBoundaries: typeof POST_V1_GATE_DM_NEGATIVE_BOUNDARIES;
  readonly noRuntimeValueMovement: true;
  readonly previousGateDL: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_LANDED_GATE;
    readonly selectedCandidateId: typeof POST_V1_GATE_DL_SELECTED_CANDIDATE_ID;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTION_STATUS;
  };
  readonly selectedCandidateId: typeof POST_V1_GATE_DM_BOUNDED_RULE_OWNER_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTION_STATUS;
  readonly targetOutputs: typeof POST_V1_GATE_DM_TARGET_OUTPUTS;
};

export function summarizePostV1WallTimberStudBoundedRuleGateDM():
  PostV1WallTimberStudBoundedRuleGateDMSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_ACTION !==
    POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_LANDED_GATE
  ) {
    throw new Error("Gate DM can only land after Gate DL selects the timber-stud bounded-rule owner.");
  }

  return {
    boundedRuleEnvelope: POST_V1_GATE_DM_BOUNDED_RULE_ENVELOPE,
    counters: POST_V1_GATE_DM_COUNTERS,
    landedGate: POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_LANDED_GATE,
    labBoundedOutputs: POST_V1_GATE_DM_LAB_BOUNDED_OUTPUTS,
    negativeBoundaries: POST_V1_GATE_DM_NEGATIVE_BOUNDARIES,
    noRuntimeValueMovement: true,
    previousGateDL: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_LANDED_GATE,
      selectedCandidateId: POST_V1_GATE_DL_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTION_STATUS
    },
    selectedCandidateId: POST_V1_GATE_DM_BOUNDED_RULE_OWNER_CANDIDATE_ID,
    selectedNextAction: POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTION_STATUS,
    targetOutputs: POST_V1_GATE_DM_TARGET_OUTPUTS
  };
}
