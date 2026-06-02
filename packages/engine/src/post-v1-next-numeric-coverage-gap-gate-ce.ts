import type { RequestedOutputId } from "@dynecho/shared";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_ce_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_ce_landed_no_runtime_selected_target_output_independence_sweep_gate_cf" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_ACTION =
  "post_v1_target_output_independence_sweep_gate_cf_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-target-output-independence-sweep-gate-cf-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_LABEL =
  "post-V1 target-output independence sweep Gate CF" as const;

const PREVIOUS_GATE_CD_LANDED_GATE =
  "post_v1_floor_open_box_target_output_independence_gate_cd_plan" as const;
const PREVIOUS_GATE_CD_SELECTION_STATUS =
  "post_v1_floor_open_box_target_output_independence_gate_cd_landed_selected_next_numeric_coverage_gap_gate_ce" as const;
const PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;
const SOURCE_OF_TRUTH_PATH = "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md" as const;

export type PostV1GateCECandidateId =
  | "field_building.direct_flanking_adapters"
  | "floor.astm_iic_aiic_owner_expansion_beyond_exact_bands"
  | "floor.common_floating_covering_expansion"
  | "input_surface.selected_route_physical_fields"
  | "residual_accuracy_holdout_program"
  | "target_output_independence_sweep"
  | "wall.common_auto_topology_expansion"
  | "wall.opening_leak_composite_adapters";

export type PostV1GateCENonGoalId =
  | "broad_source_row_crawl"
  | "confidence_wording_or_low_confidence_surface"
  | "finite_scenario_pack"
  | "generic_ui_report_storage_auth_work";

export type PostV1GateCESliceKind =
  | "accuracy_holdout"
  | "basis_owner_expansion"
  | "field_building_adapter"
  | "input_surface_unlock"
  | "scope_accuracy_bridge"
  | "scope_expansion"
  | "wrong_number_prevention";

export type PostV1GateCECoverageCounterEstimate = {
  readonly accuracyOnlyTemplates: readonly [number, number];
  readonly newCalculableLayerTemplates: readonly [number, number];
  readonly newCalculableRequestShapes: readonly [number, number];
  readonly newMetricBasisOwners: readonly [number, number];
  readonly requiredPhysicalInputFields: readonly string[];
  readonly surfaceParityRequired: boolean;
  readonly wrongAliasOrFallbackBlocks: readonly string[];
};

export type PostV1GateCECandidate = {
  readonly accuracyImpact: number;
  readonly candidateOrder: number;
  readonly coverageCounters: PostV1GateCECoverageCounterEstimate;
  readonly coverageImpact: number;
  readonly evidencePaths: readonly string[];
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateCECandidateId;
  readonly implementationReadiness: number;
  readonly passesCalculatorAdvancementTest: boolean;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly sliceKind: PostV1GateCESliceKind;
  readonly sourceRowsRequiredForSelection: boolean;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly userFrequency: number;
  readonly wrongNumberRiskReduction: number;
};

export type PostV1GateCESummary = {
  readonly blockedNonGoalIds: readonly PostV1GateCENonGoalId[];
  readonly candidateCount: number;
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_LANDED_GATE;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof PLAN_DOC_PATH;
  readonly previousGateCD: {
    readonly landedGate: typeof PREVIOUS_GATE_CD_LANDED_GATE;
    readonly selectionStatus: typeof PREVIOUS_GATE_CD_SELECTION_STATUS;
  };
  readonly selectedCandidateId: PostV1GateCECandidateId;
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_LABEL;
  readonly selectionCandidates: readonly PostV1GateCECandidate[];
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTION_STATUS;
  readonly sourceOfTruthPath: typeof SOURCE_OF_TRUTH_PATH;
};

const FULL_SWEEP_TARGETS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "Ln,w",
  "DeltaLw",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const FLOOR_IMPACT_TARGETS = [
  "Ln,w",
  "DeltaLw",
  "CI",
  "CI,50-2500",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const FIELD_BUILDING_TARGETS = [
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
] as const satisfies readonly RequestedOutputId[];

const WALL_TARGETS = [
  "Rw",
  "STC",
  "C",
  "Ctr",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A"
] as const satisfies readonly RequestedOutputId[];

const ASTM_TARGETS = ["IIC", "AIIC"] as const satisfies readonly RequestedOutputId[];

function counters(input: PostV1GateCECoverageCounterEstimate): PostV1GateCECoverageCounterEstimate {
  return input;
}

export function rankPostV1GateCENumericCoverageCandidates(): readonly PostV1GateCECandidate[] {
  return [
    {
      accuracyImpact: 0.82,
      candidateOrder: 1,
      coverageCounters: counters({
        accuracyOnlyTemplates: [0, 0],
        newCalculableLayerTemplates: [0, 4],
        newCalculableRequestShapes: [20, 60],
        newMetricBasisOwners: [0, 0],
        requiredPhysicalInputFields: [],
        surfaceParityRequired: false,
        wrongAliasOrFallbackBlocks: ["IIC/AIIC from ISO routes", "field outputs without field context"]
      }),
      coverageImpact: 0.96,
      evidencePaths: [
        PLAN_DOC_PATH,
        "packages/engine/src/target-output-support.ts",
        "packages/engine/src/calculate-assembly.ts",
        "packages/engine/src/post-v1-floor-open-box-target-output-independence-gate-cd-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "Gate CD proved already-owned values can be hidden only because a user asks for one output instead of a mixed set",
        "Gate CF must audit existing runtime families and make each owned metric independently publish when required inputs are present",
        "new formulas are not required for this first value-moving slice",
        "unsupported ASTM, field, building, and Ctr companions must stay stopped unless their own owner exists"
      ],
      id: "target_output_independence_sweep",
      implementationReadiness: 0.95,
      passesCalculatorAdvancementTest: true,
      reason:
        "Highest ROI after Gate CD: it directly increases calculable request coverage for already-owned routes with low formula risk and strong regression proof.",
      score: 5.28,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_FILE,
      sliceKind: "scope_accuracy_bridge",
      sourceRowsRequiredForSelection: false,
      targetMetrics: FULL_SWEEP_TARGETS,
      userFrequency: 0.92,
      wrongNumberRiskReduction: 0.78
    },
    {
      accuracyImpact: 0.88,
      candidateOrder: 2,
      coverageCounters: counters({
        accuracyOnlyTemplates: [0, 1],
        newCalculableLayerTemplates: [8, 15],
        newCalculableRequestShapes: [40, 120],
        newMetricBasisOwners: [0, 2],
        requiredPhysicalInputFields: [
          "resilientLayerDynamicStiffnessMNm3",
          "loadBasisKgM2",
          "ceilingOrLowerAssembly"
        ],
        surfaceParityRequired: true,
        wrongAliasOrFallbackBlocks: ["DeltaLw without dynamic stiffness/load basis", "lab impact as field impact"]
      }),
      coverageImpact: 0.9,
      evidencePaths: [
        PLAN_DOC_PATH,
        "packages/shared/src/domain/impact-predictor-input.ts",
        "packages/shared/src/domain/layer.ts",
        "packages/engine/src/post-v1-floor-suspended-ceiling-lower-treatment-gate-bb-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "common floors use base carrier plus resilient layer, floating screed, floor covering, and lower treatment",
        "complete physical inputs can unlock more Ln,w, DeltaLw, CI, and field impact routes",
        "missing dynamic stiffness, load basis, or lower assembly must stop instead of defaulting"
      ],
      id: "floor.common_floating_covering_expansion",
      implementationReadiness: 0.8,
      passesCalculatorAdvancementTest: true,
      reason:
        "Very high scope ROI, but it touches more physical owner fields than Gate CF and should follow the lower-risk publication sweep.",
      score: 4.88,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "scope_expansion",
      sourceRowsRequiredForSelection: false,
      targetMetrics: FLOOR_IMPACT_TARGETS,
      userFrequency: 0.9,
      wrongNumberRiskReduction: 0.84
    },
    {
      accuracyImpact: 0.9,
      candidateOrder: 3,
      coverageCounters: counters({
        accuracyOnlyTemplates: [0, 2],
        newCalculableLayerTemplates: [8, 14],
        newCalculableRequestShapes: [50, 120],
        newMetricBasisOwners: [1, 4],
        requiredPhysicalInputFields: [
          "receivingRoomVolumeM3",
          "receivingRoomRt60S",
          "flankingPaths",
          "junctionCouplingLengthM"
        ],
        surfaceParityRequired: true,
        wrongAliasOrFallbackBlocks: ["lab Rw as R'w", "direct-only result hiding supplied flanking paths"]
      }),
      coverageImpact: 0.88,
      evidencePaths: [
        PLAN_DOC_PATH,
        "packages/shared/src/domain/impact-field-context.ts",
        "packages/shared/src/domain/impact-flanking.ts",
        "packages/engine/src/impact-direct-flanking.ts"
      ],
      expectedBeforeAfter: [
        "ISO 12354 field/building use depends on direct and flanking paths, not lab metric aliases",
        "complete room and flanking inputs should publish more R'w, DnT,w, L'n,w, and L'nT,w outputs",
        "missing room or flanking inputs must report exact needs_input fields"
      ],
      id: "field_building.direct_flanking_adapters",
      implementationReadiness: 0.7,
      passesCalculatorAdvancementTest: true,
      reason:
        "High accuracy and field-use value, but broader basis separation makes it riskier than the target-output sweep.",
      score: 4.62,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "field_building_adapter",
      sourceRowsRequiredForSelection: false,
      targetMetrics: FIELD_BUILDING_TARGETS,
      userFrequency: 0.84,
      wrongNumberRiskReduction: 0.92
    },
    {
      accuracyImpact: 0.78,
      candidateOrder: 4,
      coverageCounters: counters({
        accuracyOnlyTemplates: [0, 0],
        newCalculableLayerTemplates: [0, 4],
        newCalculableRequestShapes: [2, 20],
        newMetricBasisOwners: [0, 2],
        requiredPhysicalInputFields: ["astmImpactBands100To3150Hz", "astmSourceMethod"],
        surfaceParityRequired: true,
        wrongAliasOrFallbackBlocks: ["ISO Ln,w as IIC", "ISO L'nT,w as AIIC"]
      }),
      coverageImpact: 0.58,
      evidencePaths: [
        PLAN_DOC_PATH,
        "packages/engine/src/impact-astm-e989.ts",
        "packages/shared/src/domain/rating-adapter.ts",
        "packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts"
      ],
      expectedBeforeAfter: [
        "exact ASTM E492/E1007 E989 runtime already exists and must remain baseline",
        "only true ASTM band owners or explicit ASTM band inputs can expand IIC/AIIC coverage",
        "ISO one-number routes must remain unsupported for ASTM ratings"
      ],
      id: "floor.astm_iic_aiic_owner_expansion_beyond_exact_bands",
      implementationReadiness: 0.52,
      passesCalculatorAdvancementTest: true,
      reason:
        "Important for North American metric scope, but current exact-band ASTM support is already landed; expansion requires a new true ASTM band owner/input route.",
      score: 3.32,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "basis_owner_expansion",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ASTM_TARGETS,
      userFrequency: 0.74,
      wrongNumberRiskReduction: 0.96
    },
    {
      accuracyImpact: 0.82,
      candidateOrder: 5,
      coverageCounters: counters({
        accuracyOnlyTemplates: [0, 1],
        newCalculableLayerTemplates: [10, 18],
        newCalculableRequestShapes: [60, 150],
        newMetricBasisOwners: [0, 2],
        requiredPhysicalInputFields: ["studType", "studSpacingMm", "supportContext", "resilientBarSideCount"],
        surfaceParityRequired: true,
        wrongAliasOrFallbackBlocks: ["single-leaf route stealing double-leaf stacks", "ambiguous flat order guessed"]
      }),
      coverageImpact: 0.88,
      evidencePaths: [
        PLAN_DOC_PATH,
        "packages/engine/src/post-v1-wall-double-leaf-auto-topology-gate-p-contract.test.ts",
        "packages/engine/src/post-v1-wall-full-fill-multicavity-auto-topology-gate-q-contract.test.ts",
        "apps/web/features/workbench/flat-multicavity-topology-surface-parity.test.ts"
      ],
      expectedBeforeAfter: [
        "several explicit-support flat wall topologies already calculate",
        "remaining common flat gypsum/stud/liner topologies can expand scope when support inputs are explicit",
        "ambiguous flat layers must remain stopped"
      ],
      id: "wall.common_auto_topology_expansion",
      implementationReadiness: 0.68,
      passesCalculatorAdvancementTest: true,
      reason:
        "Large wall scope upside, but existing partial auto-topology means it should be targeted after the lower-risk cross-route output sweep.",
      score: 4.28,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "scope_expansion",
      sourceRowsRequiredForSelection: false,
      targetMetrics: WALL_TARGETS,
      userFrequency: 0.86,
      wrongNumberRiskReduction: 0.8
    },
    {
      accuracyImpact: 0.9,
      candidateOrder: 6,
      coverageCounters: counters({
        accuracyOnlyTemplates: [0, 2],
        newCalculableLayerTemplates: [6, 12],
        newCalculableRequestShapes: [30, 80],
        newMetricBasisOwners: [0, 2],
        requiredPhysicalInputFields: ["componentAreaM2", "openingAreaM2", "leakagePathDescriptor"],
        surfaceParityRequired: true,
        wrongAliasOrFallbackBlocks: ["base wall ignoring supplied opening", "A-weighted output without spectrum owner"]
      }),
      coverageImpact: 0.76,
      evidencePaths: [
        PLAN_DOC_PATH,
        "packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-runtime-corridor-contract.test.ts",
        "apps/web/features/workbench/company-internal-opening-leak-a-weighted-surface-parity.test.ts"
      ],
      expectedBeforeAfter: [
        "opening/leak surfaces already exist in company-internal lanes",
        "broader weak-path adapters can reduce optimistic wall outputs when explicit areas and leakage data are supplied",
        "missing component area or spectrum owner must stop"
      ],
      id: "wall.opening_leak_composite_adapters",
      implementationReadiness: 0.62,
      passesCalculatorAdvancementTest: true,
      reason:
        "High wrong-number prevention value, but input ownership and weak-path energy combination make it a later runtime selection than Gate CF.",
      score: 3.94,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "wrong_number_prevention",
      sourceRowsRequiredForSelection: false,
      targetMetrics: WALL_TARGETS,
      userFrequency: 0.8,
      wrongNumberRiskReduction: 0.94
    },
    {
      accuracyImpact: 0.95,
      candidateOrder: 7,
      coverageCounters: counters({
        accuracyOnlyTemplates: [2, 8],
        newCalculableLayerTemplates: [0, 3],
        newCalculableRequestShapes: [0, 15],
        newMetricBasisOwners: [0, 1],
        requiredPhysicalInputFields: [],
        surfaceParityRequired: false,
        wrongAliasOrFallbackBlocks: ["calibration row reused as holdout", "budget tightening without holdout"]
      }),
      coverageImpact: 0.45,
      evidencePaths: [
        PLAN_DOC_PATH,
        "packages/engine/src/steel-floor-formula-source-owned-delta-lw-holdout.ts",
        "packages/engine/src/wall-timber-lightweight-source-audit.test.ts"
      ],
      expectedBeforeAfter: [
        "holdouts can tighten source-absent error budgets when source-owned evidence exists",
        "if holdouts are absent or failing, the wider budget must stay visible",
        "this improves accuracy posture more than immediate request coverage"
      ],
      id: "residual_accuracy_holdout_program",
      implementationReadiness: 0.56,
      passesCalculatorAdvancementTest: true,
      reason:
        "Important accuracy work, but it should be selected when a specific family has ready calibration and holdout rows.",
      score: 3.56,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "accuracy_holdout",
      sourceRowsRequiredForSelection: true,
      targetMetrics: ["Rw", "Ln,w", "DeltaLw"],
      userFrequency: 0.7,
      wrongNumberRiskReduction: 0.88
    },
    {
      accuracyImpact: 0.7,
      candidateOrder: 8,
      coverageCounters: counters({
        accuracyOnlyTemplates: [0, 0],
        newCalculableLayerTemplates: [0, 0],
        newCalculableRequestShapes: [5, 20],
        newMetricBasisOwners: [0, 0],
        requiredPhysicalInputFields: ["selected-runtime-route-specific"],
        surfaceParityRequired: true,
        wrongAliasOrFallbackBlocks: ["hidden UI default moving formula output"]
      }),
      coverageImpact: 0.5,
      evidencePaths: [
        PLAN_DOC_PATH,
        "packages/shared/src/api/estimate.ts",
        "packages/shared/src/api/impact-only.ts",
        "apps/web/features/workbench"
      ],
      expectedBeforeAfter: [
        "input-surface parity is high ROI only after a runtime gate names fields users cannot enter",
        "surface work must preserve exact needs_input rather than saving hidden defaults"
      ],
      id: "input_surface.selected_route_physical_fields",
      implementationReadiness: 0.74,
      passesCalculatorAdvancementTest: true,
      reason:
        "Useful unlock work, but conditional on the selected runtime gate and not the best first Gate CF value movement.",
      score: 3.22,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      sliceKind: "input_surface_unlock",
      sourceRowsRequiredForSelection: false,
      targetMetrics: FULL_SWEEP_TARGETS,
      userFrequency: 0.68,
      wrongNumberRiskReduction: 0.72
    }
  ];
}

export function getPostV1GateCEBlockedNonGoals(): readonly PostV1GateCENonGoalId[] {
  return [
    "broad_source_row_crawl",
    "finite_scenario_pack",
    "confidence_wording_or_low_confidence_surface",
    "generic_ui_report_storage_auth_work"
  ];
}

export function summarizePostV1GateCENumericCoverageGap(): PostV1GateCESummary {
  const selectionCandidates = rankPostV1GateCENumericCoverageCandidates();
  const selectedCandidates = selectionCandidates.filter((candidate) => candidate.selected);
  if (selectedCandidates.length !== 1) {
    throw new Error("Gate CE requires exactly one selected calculator coverage/correctness candidate.");
  }

  const selected = selectedCandidates[0];

  return {
    blockedNonGoalIds: getPostV1GateCEBlockedNonGoals(),
    candidateCount: selectionCandidates.length,
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_LANDED_GATE,
    noRuntimeValueMovement: true,
    planDocPath: PLAN_DOC_PATH,
    previousGateCD: {
      landedGate: PREVIOUS_GATE_CD_LANDED_GATE,
      selectionStatus: PREVIOUS_GATE_CD_SELECTION_STATUS
    },
    selectedCandidateId: selected.id,
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTED_NEXT_LABEL,
    selectionCandidates,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CE_SELECTION_STATUS,
    sourceOfTruthPath: SOURCE_OF_TRUTH_PATH
  };
}
