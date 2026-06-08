import type { AcousticInputFieldId, RequestedOutputId } from "@dynecho/shared";

import {
  evaluateGateBOCompleteFormulaRuntime,
  evaluateGateBOIncompleteExplicitRuntime,
  evaluateGateBOVisibleDerivedNeedsInputRuntime
} from "./calculator-personal-use-mvp-coverage-sprint-gate-bo";
import {
  POST_V1_GATE_ES_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_ES_PLAN_DOC_PATH,
  POST_V1_GATE_ES_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTION_STATUS,
  summarizePostV1GateESNumericCoverageGap
} from "./post-v1-next-numeric-coverage-gap-gate-es";

export const POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_LANDED_GATE =
  "post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_plan" as const;

export const POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTION_STATUS =
  "post_v1_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et_landed_no_runtime_selected_next_numeric_coverage_gap_gate_eu" as const;

export const POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_ACTION =
  "post_v1_next_numeric_coverage_gap_gate_eu_plan" as const;

export const POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts" as const;

export const POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_LABEL =
  "post-V1 next numeric coverage gap Gate EU" as const;

export const POST_V1_GATE_ET_PLAN_DOC_PATH = POST_V1_GATE_ES_PLAN_DOC_PATH;

export const POST_V1_GATE_ET_BOUNDARY_ID =
  "floor.reinforced_concrete.visible_derived_lower_assembly_from_layers_missing_dynamic_stiffness_and_load" as const;

export const POST_V1_GATE_ET_TARGET_OUTPUTS = [
  "Ln,w",
  "DeltaLw"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_ET_COUNTERS = {
  boundaryLedgersPinned: 1,
  currentGateFailuresCleared: 6,
  frontendImplementationFilesTouched: 1,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  staleExpectationRowsCorrected: 6
} as const;

export type PostV1GateETBoundaryEvidence = {
  readonly boundaryId: typeof POST_V1_GATE_ET_BOUNDARY_ID;
  readonly completeFormulaBasisId: string | null;
  readonly completeFormulaValuePins: Readonly<Record<"DeltaLw" | "Ln,w", number | null>>;
  readonly explicitPartialMissingPhysicalInputs: readonly AcousticInputFieldId[];
  readonly explicitPartialStillRequiresCeilingOrLowerAssembly: true;
  readonly targetOutputs: typeof POST_V1_GATE_ET_TARGET_OUTPUTS;
  readonly visibleDerivedMissingPhysicalInputs: readonly AcousticInputFieldId[];
  readonly visibleDerivedOrigin: "formula_corridor" | "needs_input";
  readonly visibleDerivedSupportedOutputs: readonly RequestedOutputId[];
  readonly visibleDerivedUnsupportedOutputs: readonly RequestedOutputId[];
  readonly visibleLowerAssemblyDerivedFromLayerRoles: true;
};

export type PostV1GateETSummary = {
  readonly boundaryEvidence: PostV1GateETBoundaryEvidence;
  readonly boundaryId: typeof POST_V1_GATE_ET_BOUNDARY_ID;
  readonly counters: typeof POST_V1_GATE_ET_COUNTERS;
  readonly landedGate: typeof POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_ET_PLAN_DOC_PATH;
  readonly previousGateES: {
    readonly counters: typeof POST_V1_GATE_ES_NO_RUNTIME_COUNTERS;
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_LANDED_GATE;
    readonly selectedCandidateId: typeof POST_V1_GATE_ES_SELECTED_CANDIDATE_ID;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTION_STATUS;
  };
  readonly selectedNextAction:
    typeof POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_ACTION;
  readonly selectedNextFile:
    typeof POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_FILE;
  readonly selectedNextLabel:
    typeof POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_LABEL;
  readonly selectionStatus:
    typeof POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTION_STATUS;
};

export function buildPostV1GateETBoundaryEvidence(): PostV1GateETBoundaryEvidence {
  const visibleDerived = evaluateGateBOVisibleDerivedNeedsInputRuntime();
  const explicitPartial = evaluateGateBOIncompleteExplicitRuntime();
  const completeFormula = evaluateGateBOCompleteFormulaRuntime();

  return {
    boundaryId: POST_V1_GATE_ET_BOUNDARY_ID,
    completeFormulaBasisId: completeFormula.basisId,
    completeFormulaValuePins: completeFormula.valuePins,
    explicitPartialMissingPhysicalInputs: explicitPartial.missingPhysicalInputs,
    explicitPartialStillRequiresCeilingOrLowerAssembly: true,
    targetOutputs: POST_V1_GATE_ET_TARGET_OUTPUTS,
    visibleDerivedMissingPhysicalInputs: visibleDerived.missingPhysicalInputs,
    visibleDerivedOrigin: visibleDerived.origin,
    visibleDerivedSupportedOutputs: visibleDerived.supportedTargetOutputs,
    visibleDerivedUnsupportedOutputs: visibleDerived.unsupportedTargetOutputs,
    visibleLowerAssemblyDerivedFromLayerRoles: true
  };
}

export function summarizePostV1FloorReinforcedConcreteVisibleDerivedMissingInputBoundaryGateET():
  PostV1GateETSummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_ACTION !==
    POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_LANDED_GATE
  ) {
    throw new Error("Gate ET can only land after Gate ES selects the reinforced-concrete boundary refresh.");
  }

  const previousGateES = summarizePostV1GateESNumericCoverageGap();
  const boundaryEvidence = buildPostV1GateETBoundaryEvidence();

  if (
    boundaryEvidence.visibleDerivedMissingPhysicalInputs.length !== 2 ||
    boundaryEvidence.visibleDerivedMissingPhysicalInputs.includes("ceilingOrLowerAssembly") ||
    !boundaryEvidence.explicitPartialMissingPhysicalInputs.includes("ceilingOrLowerAssembly")
  ) {
    throw new Error("Gate ET must narrow only the visible-derived boundary and keep the explicit boundary intact.");
  }

  return {
    boundaryEvidence,
    boundaryId: POST_V1_GATE_ET_BOUNDARY_ID,
    counters: POST_V1_GATE_ET_COUNTERS,
    landedGate: POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_LANDED_GATE,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_ET_PLAN_DOC_PATH,
    previousGateES: {
      counters: previousGateES.noRuntimeCounters,
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_LANDED_GATE,
      selectedCandidateId: previousGateES.selectedCandidateId,
      selectedNextAction: previousGateES.selectedNextAction,
      selectedNextFile: previousGateES.selectedNextFile,
      selectionStatus: previousGateES.selectionStatus
    },
    selectedNextAction:
      POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_ACTION,
    selectedNextFile:
      POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_FILE,
    selectedNextLabel:
      POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_LABEL,
    selectionStatus:
      POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTION_STATUS
  };
}

export const POST_V1_GATE_ET_BOUNDARY_ASSERTIONS = {
  completeFormulaExpectedBasisId: "predictor_heavy_combined_upper_lower_floor_iso12354_annexc_estimate",
  completeFormulaExpectedValuePins: {
    "DeltaLw": 13.7,
    "Ln,w": 58.1
  },
  explicitPartialExpectedMissingPhysicalInputs: ["loadBasisKgM2", "ceilingOrLowerAssembly"],
  visibleDerivedExpectedMissingPhysicalInputs: [
    "resilientLayerDynamicStiffnessMNm3",
    "loadBasisKgM2"
  ],
  visibleDerivedExpectedSupportedOutputs: ["Rw", "Ctr"],
  visibleDerivedExpectedUnsupportedOutputs: ["Ln,w", "DeltaLw"]
} as const;
