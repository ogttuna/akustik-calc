import type { RequestedOutputId } from "@dynecho/shared";

import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ch";

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_LANDED_GATE =
  "post_v1_next_numeric_coverage_gap_gate_ci_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTION_STATUS =
  "post_v1_next_numeric_coverage_gap_gate_ci_landed_no_runtime_selected_wall_common_auto_topology_expansion_gate_cj" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_ACTION =
  "post_v1_wall_common_auto_topology_expansion_gate_cj_plan" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-common-auto-topology-expansion-gate-cj-contract.test.ts" as const;

export const POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_LABEL =
  "post-V1 wall common auto-topology expansion Gate CJ" as const;

export const POST_V1_GATE_CI_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_GATE_CI_CJ_ENGINE_PLAN_2026-06-05.md" as const;

export const POST_V1_GATE_CI_HIGH_ROI_PLAN_DOC_PATH =
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md" as const;

export const POST_V1_GATE_CI_ASTM_TARGETS = [
  "IIC",
  "AIIC"
] as const satisfies readonly RequestedOutputId[];

export const POST_V1_GATE_CI_WALL_AUTO_TOPOLOGY_TARGETS = [
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

export const POST_V1_GATE_CI_NO_RUNTIME_COUNTERS = {
  evaluatedIsoImpactRoutes: 4,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeCorrectedRequestShapes: 0,
  wrongAliasOrFallbackBlocks: [
    "ISO Ln,w must not become ASTM IIC",
    "ISO L'n,w / L'nT,w / L'nT,50 must not become ASTM AIIC",
    "source-absent direct+flanking field adapters must not publish ASTM aliases",
    "formula-derived impact routes need true ASTM band ownership before IIC/AIIC"
  ]
} as const;

export type PostV1GateCICandidateId =
  | "floor.astm_iic_aiic_owner_expansion_beyond_exact_bands"
  | "input_surface.user_supplied_astm_impact_bands"
  | "wall.common_auto_topology_expansion"
  | "wall.opening_leak_composite_adapters";

export type PostV1GateCICandidate = {
  readonly calculationScopeImpact: number;
  readonly candidateOrder: number;
  readonly expectedBeforeAfter: readonly string[];
  readonly id: PostV1GateCICandidateId;
  readonly implementationEvidencePaths: readonly string[];
  readonly metricBoundaryRisk: number;
  readonly reason: string;
  readonly score: number;
  readonly selected: boolean;
  readonly selectedNextActionIfSelected: string | null;
  readonly selectedNextFileIfSelected: string | null;
  readonly targetMetrics: readonly RequestedOutputId[];
  readonly runtimeAdmissibleNow: boolean;
  readonly touchesFrontendOrSharedSurface: boolean;
};

export type PostV1GateCISummary = {
  readonly astmExactBandBaselineAlreadyOwned: true;
  readonly astmFormulaRuntimeAdmitted: false;
  readonly candidates: readonly PostV1GateCICandidate[];
  readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_LANDED_GATE;
  readonly noRuntimeCounters: typeof POST_V1_GATE_CI_NO_RUNTIME_COUNTERS;
  readonly noRuntimeValueMovement: true;
  readonly planDocPath: typeof POST_V1_GATE_CI_PLAN_DOC_PATH;
  readonly previousGateCH: {
    readonly landedGate: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_LANDED_GATE;
    readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_ACTION;
    readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_FILE;
    readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTION_STATUS;
  };
  readonly selectedCandidateId: "wall.common_auto_topology_expansion";
  readonly selectedNextAction: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_ACTION;
  readonly selectedNextFile: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_FILE;
  readonly selectedNextLabel: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_LABEL;
  readonly selectionStatus: typeof POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTION_STATUS;
  readonly userSuppliedAstmBandInputDeferred: true;
};

export function rankPostV1GateCINumericCoverageCandidates(): readonly PostV1GateCICandidate[] {
  return [
    {
      calculationScopeImpact: 0.32,
      candidateOrder: 1,
      expectedBeforeAfter: [
        "exact ASTM E492 and E1007 one-third-octave sources already calculate IIC/AIIC",
        "no current source-absent formula route owns a complete ASTM 100..3150 Hz impact curve",
        "ISO single-number impact results must stay outside ASTM ratings"
      ],
      id: "floor.astm_iic_aiic_owner_expansion_beyond_exact_bands",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        "packages/engine/src/post-v1-floor-astm-iic-aiic-contour-rating-gate-f-contract.test.ts",
        "packages/engine/src/post-v1-floor-astm-iic-aiic-surface-parity-gate-g-contract.test.ts"
      ],
      metricBoundaryRisk: 0.98,
      reason:
        "Safe exact ASTM support already exists; expanding formulas without true ASTM bands would create a wrong metric-basis answer.",
      runtimeAdmissibleNow: false,
      score: 2.28,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      targetMetrics: POST_V1_GATE_CI_ASTM_TARGETS,
      touchesFrontendOrSharedSurface: false
    },
    {
      calculationScopeImpact: 0.55,
      candidateOrder: 2,
      expectedBeforeAfter: [
        "explicit user ASTM bands could calculate additional IIC/AIIC cases",
        "the route requires API, workbench, report, and replay ownership before it is safe",
        "frontend work is currently owned by other agents and should not be disturbed by this engine slice"
      ],
      id: "input_surface.user_supplied_astm_impact_bands",
      implementationEvidencePaths: [
        "packages/engine/src/impact-astm-e989.ts",
        POST_V1_GATE_CI_PLAN_DOC_PATH
      ],
      metricBoundaryRisk: 0.24,
      reason:
        "Useful later, but it is an input-surface program rather than the current engine-only formula-selection move.",
      runtimeAdmissibleNow: false,
      score: 3.04,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      targetMetrics: POST_V1_GATE_CI_ASTM_TARGETS,
      touchesFrontendOrSharedSurface: true
    },
    {
      calculationScopeImpact: 0.92,
      candidateOrder: 3,
      expectedBeforeAfter: [
        "common flat wall layer stacks can remain artificially blocked even when formulas exist",
        "existing Gate O-S topology and field companions prove the implementation corridor is ready",
        "Gate CJ can calculate more wall layer combinations while preserving ambiguity and missing-input boundaries"
      ],
      id: "wall.common_auto_topology_expansion",
      implementationEvidencePaths: [
        "packages/engine/src/wall-flat-multicavity-auto-topology.ts",
        "packages/engine/src/post-v1-wall-double-leaf-auto-topology-gate-p-contract.test.ts",
        "packages/engine/src/post-v1-wall-full-fill-multicavity-auto-topology-gate-q-contract.test.ts",
        "packages/engine/src/post-v1-wall-field-auto-topology-gate-r-contract.test.ts",
        "packages/engine/src/post-v1-wall-double-leaf-field-auto-topology-gate-s-contract.test.ts"
      ],
      metricBoundaryRisk: 0.18,
      reason:
        "Highest engine-only ROI after Gate CI: route more realistic wall layer combinations into already-owned formula families.",
      runtimeAdmissibleNow: true,
      score: 4.94,
      selected: true,
      selectedNextActionIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_ACTION,
      selectedNextFileIfSelected: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_FILE,
      targetMetrics: POST_V1_GATE_CI_WALL_AUTO_TOPOLOGY_TARGETS,
      touchesFrontendOrSharedSurface: false
    },
    {
      calculationScopeImpact: 0.74,
      candidateOrder: 4,
      expectedBeforeAfter: [
        "opening and leakage adapters are valuable but not as immediately connected to the current Gate CI audit",
        "weak-path energy combination requires its own explicit owner and input boundary sweep"
      ],
      id: "wall.opening_leak_composite_adapters",
      implementationEvidencePaths: [
        "packages/engine/src/dynamic-airborne-gate-r-opening-leak-composite-transmission-loss-formula-corridor.ts",
        "packages/engine/src/dynamic-airborne-gate-s-opening-leak-composite-transmission-loss-runtime-corridor.ts"
      ],
      metricBoundaryRisk: 0.42,
      reason:
        "Still high value, but Gate CJ is the more direct formula-selection scope expansion for common layer stacks.",
      runtimeAdmissibleNow: true,
      score: 3.86,
      selected: false,
      selectedNextActionIfSelected: null,
      selectedNextFileIfSelected: null,
      targetMetrics: POST_V1_GATE_CI_WALL_AUTO_TOPOLOGY_TARGETS,
      touchesFrontendOrSharedSurface: false
    }
  ] as const satisfies readonly PostV1GateCICandidate[];
}

export function summarizePostV1GateCINumericCoverageGap(): PostV1GateCISummary {
  if (
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_ACTION !==
    POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_LANDED_GATE
  ) {
    throw new Error("Gate CI can only land after Gate CH selects Gate CI.");
  }

  return {
    astmExactBandBaselineAlreadyOwned: true,
    astmFormulaRuntimeAdmitted: false,
    candidates: rankPostV1GateCINumericCoverageCandidates(),
    landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_LANDED_GATE,
    noRuntimeCounters: POST_V1_GATE_CI_NO_RUNTIME_COUNTERS,
    noRuntimeValueMovement: true,
    planDocPath: POST_V1_GATE_CI_PLAN_DOC_PATH,
    previousGateCH: {
      landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_LANDED_GATE,
      selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTED_NEXT_FILE,
      selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CH_SELECTION_STATUS
    },
    selectedCandidateId: "wall.common_auto_topology_expansion",
    selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_ACTION,
    selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_FILE,
    selectedNextLabel: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTED_NEXT_LABEL,
    selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_CI_SELECTION_STATUS,
    userSuppliedAstmBandInputDeferred: true
  };
}
