import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_GATE_EW_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EW_OWNER_DECISION_ID,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_LANDED_GATE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTION_STATUS,
  summarizePostV1WallHeavyCoreLinedMassiveCalibrationOwnerGateEW
} from "./post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_ex_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_ex_landed_no_runtime_selected_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_ACTION =
  "post_v1_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_LABEL =
  "post-V1 wall heavy-core / lined-massive targeted evidence acquisition Gate EY" as const;

export const POST_V1_GATE_EX_SELECTED_CANDIDATE_ID =
  "wall.heavy_core_lined_massive_targeted_evidence_acquisition_after_owner_rejection" as const;

export const POST_V1_GATE_EX_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_EX_EY_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_PLAN_2026-06-09.md" as const;

export const POST_V1_GATE_EX_SELECTED_TARGET_OUTPUTS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_EX_ROI_ANALYSIS_ITERATIONS = [
  {
    iteration: 1,
    conclusion:
      "Gate EW rejected the calibration owner because the route lacks wall-specific source evidence or a named bounded wall lining rule, so Gate EX must not jump to runtime retune and must not restart a broad source crawl.",
    rejectedDirections: [
      "runtime retune of the Gate DG bounded_prediction curve",
      "authoring a bounded wall lining rule from formula context without coefficient scope, local tolerance, holdouts, and negative boundaries",
      "broad source-row crawling or finite scenario-pack collection"
    ]
  },
  {
    iteration: 2,
    conclusion:
      "The highest ROI next action is a targeted evidence-acquisition gate: it is the smallest no-runtime step that can unblock a future lined-massive/heavy-core wall calibration owner while preserving current values and source/catalog drift guards.",
    rejectedDirections: [
      "repeating closed Gate ER/ET/EJ/DK/EL/thick-board work",
      "opening holdout tightening for an unrelated route without a selected owner",
      "moving source rows directly into runtime before owner proof"
    ]
  }
] as const;

export const POST_V1_GATE_EX_NO_RUNTIME_COUNTERS = {
  broadSourceCrawlSelected: false,
  candidateCount: 10,
  estimatedNextBoundedRuleCriteriaLedgers: 1,
  estimatedNextRuntimeCandidateFamiliesIfEvidenceAccepted: 1,
  estimatedNextTargetedEvidenceLedgers: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  roiAnalysisIterations: POST_V1_GATE_EX_ROI_ANALYSIS_ITERATIONS.length,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0,
  targetedEvidenceAcquisitionSelected: true
} as const;

export type PostV1GateEXCandidateId =
  | typeof POST_V1_GATE_EX_SELECTED_CANDIDATE_ID
  | "broad_source_crawl_confidence_frontend_non_goal"
  | "floor.astm_iic_aiic_exact_band_closed_repeat"
  | "floor.reinforced_concrete_visible_derived_closed_repeat"
  | "floor.steel_visible_formula_input_surface_closed_repeat"
  | "opening_leak_common_wall_holdout_tightening_still_blocked"
  | "wall.direct_fixed_field_building_closed_repeat"
  | "wall.heavy_core_lined_massive_bounded_rule_authoring_without_evidence_blocked"
  | "wall.heavy_core_lined_massive_runtime_retune_still_blocked"
  | "wall.thick_board_auto_family_closed_safety_repeat";

export type PostV1GateEXSliceKind =
  | "blocked_bounded_rule_authoring"
  | "blocked_holdout_tightening"
  | "blocked_non_goal"
  | "blocked_runtime_retune"
  | "closed_boundary_repeat"
  | "closed_input_surface_repeat"
  | "closed_runtime_repeat"
  | "targeted_evidence_acquisition";

export type PostV1GateEXCandidate = {
  readonly broadSourceCrawl: boolean;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateEXCandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly nextActionMovesRuntimeValues: boolean;
  readonly ownerProofRequiredBeforeRuntime: boolean;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly preservesBoundaryCorrectness: boolean;
  readonly requiredEvidence: readonly string[];
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateEXSliceKind;
  readonly sourceRowsImportedNow: boolean;
  readonly sourceRowsMayBeResearchedInNextGate: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly touchesFrontendImplementationNow: boolean;
  readonly touchesSharedOrApiSurfaceNow: boolean;
};

export type PostV1GateEXSummary = {
  readonly candidates: readonly PostV1GateEXCandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_EX_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_EX_PLAN_DOC_PATH;
  readonly previousGateEW: {
    readonly counters: typeof POST_V1_GATE_EW_NO_RUNTIME_COUNTERS;
    readonly landedGate: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_LANDED_GATE;
    readonly ownerDecisionId: typeof POST_V1_GATE_EW_OWNER_DECISION_ID;
    readonly selectedNextAction: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTION_STATUS;
  };
  readonly roiAnalysisIterations: typeof POST_V1_GATE_EX_ROI_ANALYSIS_ITERATIONS;
  readonly selectedCandidateId: typeof POST_V1_GATE_EX_SELECTED_CANDIDATE_ID;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTION_STATUS;
};

export function rankPostV1GateEXNumericCoverageCandidates(): readonly PostV1GateEXCandidate[] {
  return [
    {
      broadSourceCrawl: false,
      expectedBeforeAfter: [
        "Gate EW proves runtime retune is unsafe without wall-specific evidence or a bounded wall lining rule",
        "Gate EY should search only for that named evidence, not for a general source catalog",
        "current Gate DG bounded_prediction lab/field values remain frozen until owner proof accepts evidence"
      ],
      id: POST_V1_GATE_EX_SELECTED_CANDIDATE_ID,
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts",
        "packages/engine/src/wall-lined-massive-heavy-core-source-research-gate-a-contract.test.ts",
        "docs/calculator/SOURCE_READY_INTAKE_BACKLOG.md"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      requiredEvidence: [
        "wall-specific lined concrete or heavy-masonry source row with measured airborne metric, stack, topology, basis, standard, and locator",
        "or a named bounded wall lining rule with coefficient scope, local tolerance, holdouts, and negative boundaries",
        "floor-only CC60, generic manufacturer context, selector pins, confidence wording, and broad source inventories remain rejected"
      ],
      score: 3.41,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_FILE,
      sliceKind: "targeted_evidence_acquisition",
      sourceRowsImportedNow: false,
      sourceRowsMayBeResearchedInNextGate: true,
      targetMetrics: POST_V1_GATE_EX_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      broadSourceCrawl: false,
      expectedBeforeAfter: [
        "Gate EW rejected the owner",
        "retuning the bounded curve would move live values",
        "source or bounded-rule evidence must be accepted before runtime"
      ],
      id: "wall.heavy_core_lined_massive_runtime_retune_still_blocked",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      requiredEvidence: ["accepted Gate EY evidence and a later runtime owner"],
      score: 2.12,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_runtime_retune",
      sourceRowsImportedNow: false,
      sourceRowsMayBeResearchedInNextGate: false,
      targetMetrics: POST_V1_GATE_EX_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      broadSourceCrawl: false,
      expectedBeforeAfter: [
        "ISO/Sharp/Davy context is useful",
        "Gate EW found no local coefficient/tolerance owner",
        "writing a bounded rule without evidence would be formula drift"
      ],
      id: "wall.heavy_core_lined_massive_bounded_rule_authoring_without_evidence_blocked",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df.ts",
        "packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      requiredEvidence: ["coefficient scope", "local tolerance", "holdout residuals", "negative boundaries"],
      score: 1.78,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_bounded_rule_authoring",
      sourceRowsImportedNow: false,
      sourceRowsMayBeResearchedInNextGate: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      broadSourceCrawl: false,
      expectedBeforeAfter: [
        "Gate ER already made complete direct-fixed field/building requests calculable",
        "missing RT60/support spacing boundaries remain correct"
      ],
      id: "wall.direct_fixed_field_building_closed_repeat",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-runtime-gate-er-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      requiredEvidence: [],
      score: 1.32,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_runtime_repeat",
      sourceRowsImportedNow: false,
      sourceRowsMayBeResearchedInNextGate: false,
      targetMetrics: ["R'w", "Dn,w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      broadSourceCrawl: false,
      expectedBeforeAfter: [
        "Gate ET already pins the reinforced-concrete visible-derived lower-assembly boundary",
        "repeating it does not increase current scope"
      ],
      id: "floor.reinforced_concrete_visible_derived_closed_repeat",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      requiredEvidence: [],
      score: 1.05,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_boundary_repeat",
      sourceRowsImportedNow: false,
      sourceRowsMayBeResearchedInNextGate: false,
      targetMetrics: ["Ln,w", "DeltaLw"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      broadSourceCrawl: false,
      expectedBeforeAfter: [
        "the thick-board Auto guard already closed generic board mass-only promotion",
        "true massive-core lanes remain live"
      ],
      id: "wall.thick_board_auto_family_closed_safety_repeat",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      requiredEvidence: [],
      score: 0.94,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_boundary_repeat",
      sourceRowsImportedNow: false,
      sourceRowsMayBeResearchedInNextGate: false,
      targetMetrics: ["Rw", "STC", "C", "Ctr"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      broadSourceCrawl: false,
      expectedBeforeAfter: [
        "Gate EJ already exposes explicit ASTM exact-band IIC/AIIC",
        "ISO impact and missing-standard boundaries remain correct"
      ],
      id: "floor.astm_iic_aiic_exact_band_closed_repeat",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-astm-iic-aiic-exact-band-input-surface-gate-ej-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      requiredEvidence: [],
      score: 0.82,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_input_surface_repeat",
      sourceRowsImportedNow: false,
      sourceRowsMayBeResearchedInNextGate: false,
      targetMetrics: ["IIC", "AIIC"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      broadSourceCrawl: false,
      expectedBeforeAfter: [
        "steel visible formula input surface is already live after Gate DK",
        "DeltaLw/IIC metric boundaries remain separate"
      ],
      id: "floor.steel_visible_formula_input_surface_closed_repeat",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-floor-steel-visible-formula-input-surface-parity-gate-dk-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: false,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      requiredEvidence: [],
      score: 0.61,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "closed_input_surface_repeat",
      sourceRowsImportedNow: false,
      sourceRowsMayBeResearchedInNextGate: false,
      targetMetrics: ["Ln,w", "DeltaLw"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      broadSourceCrawl: false,
      expectedBeforeAfter: [
        "opening/leak holdout tightening may matter later",
        "Gate EX has a more direct owner rejection to resolve first"
      ],
      id: "opening_leak_common_wall_holdout_tightening_still_blocked",
      implementationEvidencePaths: [
        "packages/engine/src/post-v1-next-numeric-coverage-gap-gate-cl-contract.test.ts"
      ],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: true,
      preservesBoundaryCorrectness: true,
      requiredEvidence: ["selected opening/leak owner", "holdout residual set"],
      score: 0.44,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_holdout_tightening",
      sourceRowsImportedNow: false,
      sourceRowsMayBeResearchedInNextGate: false,
      targetMetrics: ["Rw", "R'w", "DnT,w"] as const,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    },
    {
      broadSourceCrawl: true,
      expectedBeforeAfter: [
        "broad source crawling, confidence wording, frontend polish, and finite scenario packs do not name a route owner",
        "Gate EY must be targeted to the Gate EW missing evidence, not open-ended collection"
      ],
      id: "broad_source_crawl_confidence_frontend_non_goal",
      implementationEvidencePaths: ["AGENTS.md", "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md"],
      nextActionMovesRuntimeValues: false,
      ownerProofRequiredBeforeRuntime: true,
      passesCalculatorAdvancementTest: false,
      preservesBoundaryCorrectness: false,
      requiredEvidence: [],
      score: 0.12,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "blocked_non_goal",
      sourceRowsImportedNow: false,
      sourceRowsMayBeResearchedInNextGate: false,
      targetMetrics: POST_V1_GATE_EX_SELECTED_TARGET_OUTPUTS,
      touchesFrontendImplementationNow: false,
      touchesSharedOrApiSurfaceNow: false
    }
  ] as const satisfies readonly PostV1GateEXCandidate[];
}

export function summarizePostV1GateEXNumericCoverageGap(): PostV1GateEXSummary {
  if (
    POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_LANDED_GATE
  ) {
    throw new Error("Gate EX can only land after Gate EW selects the next numeric coverage/accuracy rerank.");
  }

  const previousGateEW = summarizePostV1WallHeavyCoreLinedMassiveCalibrationOwnerGateEW();
  const candidates = rankPostV1GateEXNumericCoverageCandidates();
  const selected = candidates.filter((candidate) => candidate.selected);

  if (selected.length !== 1 || selected[0]?.id !== POST_V1_GATE_EX_SELECTED_CANDIDATE_ID) {
    throw new Error("Gate EX must select exactly the targeted lined-massive evidence acquisition candidate.");
  }

  if (selected.some((candidate) => candidate.nextActionMovesRuntimeValues)) {
    throw new Error("Gate EX is a no-runtime rerank and cannot move formula values.");
  }

  return {
    candidates,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_EX_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_EX_PLAN_DOC_PATH,
    previousGateEW: {
      counters: previousGateEW.noRuntimeCounters,
      landedGate: previousGateEW.landedGate,
      ownerDecisionId: previousGateEW.ownerDecision.decisionId,
      selectedNextAction: previousGateEW.selectedNextAction,
      selectedNextFile: previousGateEW.selectedNextFile,
      selectionStatus: previousGateEW.selectionStatus
    },
    roiAnalysisIterations: POST_V1_GATE_EX_ROI_ANALYSIS_ITERATIONS,
    selectedCandidateId: POST_V1_GATE_EX_SELECTED_CANDIDATE_ID,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTION_STATUS
  };
}
