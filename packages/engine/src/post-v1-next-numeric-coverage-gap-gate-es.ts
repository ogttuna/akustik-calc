import type { AcousticInputFieldId, RequestedOutputId } from "@dynecho/shared";

import {
  evaluateGateBOCompleteFormulaRuntime,
  evaluateGateBOIncompleteExplicitRuntime,
  evaluateGateBOVisibleDerivedNeedsInputRuntime
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bo";
import {
  POST_V1_GATE_ER_COUNTERS,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_LANDED_GATE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_ACTION,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_FILE,
  POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTION_STATUS,
  summarizePostV1WallDirectFixedDoubleLeafFieldBuildingAdapterRuntimeGateER
} from "./post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_es_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_es_landed_no_runtime_selected_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_ACTION =
  "post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_LABEL =
  "post-V1 floor reinforced-concrete visible-derived missing-input boundary Gate ET" as const;

export const POST_V1_GATE_ES_SELECTED_CANDIDATE_ID =
  "floor.reinforced_concrete_visible_derived_missing_input_boundary_refresh" as const;

export const POST_V1_GATE_ES_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_ES_ET_REINFORCED_CONCRETE_VISIBLE_DERIVED_BOUNDARY_PLAN_2026-06-08.md" as const;

export const POST_V1_GATE_ES_SELECTED_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_ES_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "Gate ER closed the direct-fixed double-leaf field/building runtime gap, so Gate ES must subtract that now-live wall route, closed Gate EO/EQ/ER repeats, and correct missing-input boundaries before selecting new work.",
    rejectedDirections: [
      "repeating the direct-fixed field/building adapter runtime that Gate ER just landed",
      "reopening Gate EO lab values or Gate EQ adapter owners as fresh scope",
      "counting missing support spacing or room RT60 as calculable scope"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "The highest ROI is the reinforced-concrete visible-derived missing-input boundary refresh: current runtime already derives the lower assembly from visible layers and correctly asks only for dynamic stiffness plus load, while historical contracts still demand ceilingOrLowerAssembly and keep the current gate red.",
    rejectedDirections: [
      "forcing ceilingOrLowerAssembly when visible layer roles already define the lower treatment",
      "retuning the heavy-concrete combined formula without new same-family holdouts",
      "source crawling, confidence wording, or frontend polish without a selected calculator boundary"
    ]
  }
] as const;

export const POST_V1_GATE_ES_NO_RUNTIME_COUNTERS = {
  candidateCount: 10,
  estimatedNextBoundaryLedgers: 1,
  estimatedNextCurrentGateFailuresCleared: 6,
  estimatedNextFrontendImplementationFilesTouched: 1,
  estimatedNextStaleExpectationRowsCorrected: 6,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: POST_V1_GATE_ES_ROI_ANALYSIS_ITERATIONS.length,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

export type PostV1GateESCandidateId =
  | typeof POST_V1_GATE_ES_SELECTED_CANDIDATE_ID
  | "broad_source_crawl_frontend_confidence_non_goal"
  | "floor.astm_iic_aiic_exact_band_closed_repeat"
  | "floor.lower_treatment_delta_lw_cross_family_subtraction_rejected"
  | "floor.reinforced_concrete_complete_formula_already_live"
  | "floor.reinforced_concrete_explicit_partial_ceiling_owner_stays"
  | "floor.reinforced_concrete_formula_retune_without_holdouts"
  | "wall.direct_fixed_field_building_closed_by_er"
  | "wall.visible_route_repeats_closed_after_el"
  | "wall_or_floor_source_holdout_tightening_without_owner";

export type PostV1GateESSliceKind =
  | "already_live"
  | "blocked_metric_derivation"
  | "blocked_non_goal"
  | "closed_runtime_repeat"
  | "formula_retune_blocked"
  | "input_surface_closed"
  | "needs_input_boundary_accuracy"
  | "source_or_holdout_blocked";

export type PostV1GateESCandidate = {
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateESCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeValues: boolean;
  readonly ownerProofRequiredBeforeRuntime: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateESSliceKind;
  readonly sourceRowsRequiredForRuntimeSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementationNow: boolean;
  readonly touchesSharedOrApiSurfaceNow: boolean;
};

export type PostV1GateESReinforcedConcreteBoundaryEvidence = {
  readonly completeFormulaBasisId: string | null;
  readonly completeFormulaMissingPhysicalInputs: readonly AcousticInputFieldId[];
  readonly completeFormulaValuePins: Readonly<Record<"DeltaLw" | "Ln,w", number | null>>;
  readonly explicitPartialMissingPhysicalInputs: readonly AcousticInputFieldId[];
  readonly explicitPartialOrigin: "formula_corridor" | "needs_input";
  readonly visibleDerivedMissingPhysicalInputs: readonly AcousticInputFieldId[];
  readonly visibleDerivedOrigin: "formula_corridor" | "needs_input";
  readonly visibleDerivedSupportedOutputs: readonly RequestedOutputId[];
  readonly visibleDerivedUnsupportedOutputs: readonly RequestedOutputId[];
  readonly visibleLayerLowerAssemblyAlreadyPresent: true;
  readonly staleHistoricalVisibleDerivedMissingPhysicalInputs: readonly AcousticInputFieldId[];
};

export type PostV1GateESSummary = {
  readonly candidates: readonly PostV1GateESCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_ES_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_ES_PLAN_DOC_PATH;
  readonly previousGateER: {
    readonly counters: typeof POST_V1_GATE_ER_COUNTERS;
    readonly landedGate: typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTION_STATUS;
  };
  readonly reinforcedConcreteBoundaryEvidence: PostV1GateESReinforcedConcreteBoundaryEvidence;
  readonly roiAnalysisIterations: typeof POST_V1_GATE_ES_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_ES_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTION_STATUS;
};

export function buildPostV1GateESReinforcedConcreteBoundaryEvidence():
  PostV1GateESReinforcedConcreteBoundaryEvidence {
  const visibleDerived = evaluateGateBOVisibleDerivedNeedsInputRuntime();
  const explicitPartial = evaluateGateBOIncompleteExplicitRuntime();
  const completeFormula = evaluateGateBOCompleteFormulaRuntime();

  return {
    completeFormulaBasisId: completeFormula.basisId,
    completeFormulaMissingPhysicalInputs: completeFormula.missingPhysicalInputs,
    completeFormulaValuePins: completeFormula.valuePins,
    explicitPartialMissingPhysicalInputs: explicitPartial.missingPhysicalInputs,
    explicitPartialOrigin: explicitPartial.origin,
    staleHistoricalVisibleDerivedMissingPhysicalInputs: [
      "resilientLayerDynamicStiffnessMNm3",
      "loadBasisKgM2",
      "ceilingOrLowerAssembly"
    ],
    visibleDerivedMissingPhysicalInputs: visibleDerived.missingPhysicalInputs,
    visibleDerivedOrigin: visibleDerived.origin,
    visibleDerivedSupportedOutputs: visibleDerived.supportedTargetOutputs,
    visibleDerivedUnsupportedOutputs: visibleDerived.unsupportedTargetOutputs,
    visibleLayerLowerAssemblyAlreadyPresent: true
  };
}

export function rankPostV1GateESNumericCoverageCandidates(): readonly PostV1GateESCandidate[] {
  return [
    {
      candidateOrder: 1,
      expectedBeforeAfter: [
        "Gate ER closed the direct-fixed wall field/building runtime gap and selected this fresh rerank",
        "the current reinforced-concrete visible-derived stack already contains lower-treatment layers, so the runtime asks for resilientLayerDynamicStiffnessMNm3 and loadBasisKgM2 only",
        "historical BO/BP/BQ/final-rehearsal expectations still demand ceilingOrLowerAssembly and keep the repo-wide current gate red",
        "Gate ET should pin the narrower needs_input boundary without moving formulas or values"
      ],
      id: POST_V1_GATE_ES_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bo.ts",
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bp.ts",
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bq.ts",
        "packages/engine/src/heavy-concrete-combined-impact-formula-corridor.ts",
        "packages/engine/src/calculate-assembly.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate ER: it restores the exact needs_input boundary for a visible reinforced-concrete floor subset, clears the known current-gate red condition, and avoids weakening formula or metric boundaries.",
      score: 3.28,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_FILE,
      sliceKind: "needs_input_boundary_accuracy",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_ES_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 2,
      expectedBeforeAfter: [
        "complete direct-fixed field_between_rooms now selects Gate I through Gate ER",
        "complete direct-fixed building_prediction now selects Gate AR through Gate ER",
        "repeating Gate ER would not increase scope"
      ],
      id: "wall.direct_fixed_field_building_closed_by_er",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already live after Gate ER.",
      score: 2.04,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_repeat",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 3,
      expectedBeforeAfter: [
        "complete reinforced-concrete combined upper/lower explicit input already calculates Ln,w and DeltaLw",
        "Gate ET must not retune or republish those values",
        "the stale gap is only the visible-derived missing-input expectation"
      ],
      id: "floor.reinforced_concrete_complete_formula_already_live",
      implementationEvidencePaths: [
        "packages/engine/src/heavy-concrete-combined-impact-formula-corridor.ts",
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bo-reinforced-concrete-low-confidence-cleanup-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      reason: "Already live through the heavy-concrete combined formula corridor.",
      score: 1.96,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "already_live",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_ES_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 4,
      expectedBeforeAfter: [
        "explicit partial predictor input has no visible layer schedule to derive a complete lower assembly",
        "it must continue asking for loadBasisKgM2 and ceilingOrLowerAssembly",
        "Gate ET is visible-derived-only and must not weaken this explicit boundary"
      ],
      id: "floor.reinforced_concrete_explicit_partial_ceiling_owner_stays",
      implementationEvidencePaths: [
        "packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bo.ts",
        "packages/engine/src/heavy-concrete-combined-impact-formula-corridor.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      reason: "Correct adjacent needs_input boundary.",
      score: 1.47,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "needs_input_boundary_accuracy",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_ES_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 5,
      expectedBeforeAfter: [
        "retuning the heavy-concrete combined formula would change live Ln,w/DeltaLw values",
        "same-family holdouts for this visible-derived boundary are not the selected blocker",
        "Gate ES should first restore the exact missing-input boundary"
      ],
      id: "floor.reinforced_concrete_formula_retune_without_holdouts",
      implementationEvidencePaths: [
        "packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts",
        "packages/engine/src/heavy-concrete-combined-impact-formula-corridor.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      reason: "Formula retune is blocked until a selected holdout/calibration owner names evidence.",
      score: 1.03,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "formula_retune_blocked",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: POST_V1_GATE_ES_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 6,
      expectedBeforeAfter: [
        "ASTM exact-band input surface and owner work are already closed by Gate EH/EJ",
        "Gate ES has a known non-ASTM missing-input boundary failure",
        "reselecting ASTM would not clear the current boundary drift"
      ],
      id: "floor.astm_iic_aiic_exact_band_closed_repeat",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed input-surface repeat.",
      score: 0.82,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "input_surface_closed",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["IIC", "AIIC"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 7,
      expectedBeforeAfter: [
        "Gate EL found no fresh visible-wall runtime candidate after reconciling current wall routes",
        "Gate ER has since closed the selected direct-fixed wall subset",
        "reopening wall repeats is lower ROI than clearing the known floor boundary drift"
      ],
      id: "wall.visible_route_repeats_closed_after_el",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-visible-layer-formula-route-second-pass-gate-el-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      reason: "Closed wall route repeat.",
      score: 0.76,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_repeat",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 8,
      expectedBeforeAfter: [
        "cross-family lower-treatment DeltaLw subtraction has repeatedly been rejected as wrong metric derivation",
        "the selected visible-derived boundary does not need a new subtraction lane",
        "unsafe derivation would weaken answer-basis correctness"
      ],
      id: "floor.lower_treatment_delta_lw_cross_family_subtraction_rejected",
      implementationEvidencePaths: [
        "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eb-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: false,
      reason: "Blocked wrong-metric derivation.",
      score: 0.54,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_metric_derivation",
      sourceRowsRequiredForRuntimeSelection: false,
      targetMetrics: POST_V1_GATE_ES_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 9,
      expectedBeforeAfter: [
        "source rows and holdouts can improve calibration only after a selected route names the evidence need",
        "Gate ES has a current implementation boundary mismatch that needs no new source rows",
        "broad holdout work would leave the current gate red"
      ],
      id: "wall_or_floor_source_holdout_tightening_without_owner",
      implementationEvidencePaths: [
        "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      reason: "Useful later, blocked for this slice.",
      score: 0.41,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "source_or_holdout_blocked",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: POST_V1_GATE_ES_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      candidateOrder: 10,
      expectedBeforeAfter: [
        "source crawling, confidence wording, and frontend polish do not choose a formula route or missing-input owner",
        "Gate ES can prove the current boundary from runtime evidence",
        "these directions remain out of the calculator slice"
      ],
      id: "broad_source_crawl_frontend_confidence_non_goal",
      implementationEvidencePaths: ["AGENTS.md", "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: false,
      reason: "Non-calculator work for the current slice.",
      score: 0.2,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsRequiredForRuntimeSelection: true,
      targetMetrics: POST_V1_GATE_ES_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    }
  ] as const satisfies readonly PostV1GateESCandidate[];
}

export function summarizePostV1GateESNumericCoverageGap(): PostV1GateESSummary {
  if (
    POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_LANDED_GATE
  ) {
    throw new Error("Gate ES can only land after Gate ER selects the next numeric coverage rerank.");
  }

  const previousGateER = summarizePostV1WallDirectFixedDoubleLeafFieldBuildingAdapterRuntimeGateER();
  const candidates = rankPostV1GateESNumericCoverageCandidates();
  const selected = candidates.filter((candidate) => candidate.selected);
  const reinforcedConcreteBoundaryEvidence = buildPostV1GateESReinforcedConcreteBoundaryEvidence();

  if (selected.length !== 1 || selected[0]?.id !== POST_V1_GATE_ES_SELECTED_CANDIDATE_ID) {
    throw new Error("Gate ES must select exactly the reinforced-concrete visible-derived boundary refresh.");
  }

  if (
    reinforcedConcreteBoundaryEvidence.visibleDerivedMissingPhysicalInputs.includes("ceilingOrLowerAssembly")
  ) {
    throw new Error("Gate ES cannot select ET if the visible-derived lower assembly is still missing.");
  }

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_ES_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_ES_PLAN_DOC_PATH,
    previousGateER: {
      counters: previousGateER.counters,
      landedGate: POST_V1_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_RUNTIME_GATE_ER_LANDED_GATE,
      selectedNextAction: previousGateER.selectedNextAction,
      selectedNextFile: previousGateER.selectedNextFile,
      selectionStatus: previousGateER.selectionStatus
    },
    reinforcedConcreteBoundaryEvidence,
    roiAnalysisIterations: POST_V1_GATE_ES_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: POST_V1_GATE_ES_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTION_STATUS
  };
}

export const POST_V1_GATE_ES_BOUNDARY_ASSERTIONS = {
  completeFormulaExpectedValuePins: {
    "DeltaLw": 13.7,
    "Ln,w": 58.1
  },
  explicitPartialExpectedMissingPhysicalInputs: ["loadBasisKgM2", "ceilingOrLowerAssembly"],
  staleHistoricalVisibleDerivedMissingPhysicalInputs: [
    "resilientLayerDynamicStiffnessMNm3",
    "loadBasisKgM2",
    "ceilingOrLowerAssembly"
  ],
  visibleDerivedExpectedMissingPhysicalInputs: [
    "resilientLayerDynamicStiffnessMNm3",
    "loadBasisKgM2"
  ],
  visibleDerivedExpectedSupportedOutputs: ["Rw", "Ctr"],
  visibleDerivedExpectedUnsupportedOutputs: ["Ln,w", "DeltaLw"]
} as const;
