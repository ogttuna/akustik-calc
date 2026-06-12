import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract } from "./layer-combination-resolver-candidate-coverage-matrix-refresh";
import { buildLayerCombinationResolverCompanyInternalV0RehearsalContract } from "./layer-combination-resolver-company-internal-v0-rehearsal";
import { buildLayerCombinationResolverRegistryContract } from "./layer-combination-resolver-registry";
import { buildLayerCombinationResolverRuntimeCandidateAdapterContract } from "./layer-combination-resolver-runtime-candidate-adapter";
import { buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract } from "./layer-combination-resolver-runtime-candidate-surface-parity";
import {
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_WARNING,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID,
  POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING
} from "./post-v1-wall-compatible-anchor-delta";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const PREVIOUS_SURFACE_PARITY_ACTION =
  "post_v1_wall_compatible_anchor_delta_lab_metric_companion_surface_parity_plan";
const PREVIOUS_SURFACE_PARITY_FILE =
  "apps/web/features/workbench/post-v1-wall-compatible-anchor-delta-lab-metric-companion-surface-parity.test.ts";
const PREVIOUS_SURFACE_PARITY_STATUS =
  "post_v1_wall_compatible_anchor_delta_lab_metric_companion_surface_parity_landed_no_runtime_selected_coverage_refresh";

const COVERAGE_REFRESH_ACTION =
  "post_v1_wall_compatible_anchor_delta_lab_metric_companion_coverage_refresh_plan";
const COVERAGE_REFRESH_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-coverage-refresh-contract.test.ts";
const COVERAGE_REFRESH_STATUS =
  "post_v1_wall_compatible_anchor_delta_lab_metric_companion_coverage_refresh_landed_no_runtime_selected_one_side_lab_metric_companion_owner";

const SELECTED_NEXT_ACTION =
  "post_v1_wall_compatible_anchor_delta_one_side_lab_metric_companion_owner_plan";
const SELECTED_NEXT_FILE =
  "packages/engine/src/post-v1-wall-compatible-anchor-delta-one-side-lab-metric-companion-owner-contract.test.ts";
const SELECTED_NEXT_LABEL = "post-V1 wall compatible anchor-delta one-side lab metric companion owner";

const COVERAGE_REFRESH_COUNTERS = {
  coverageRefreshContractFilesTouched: 1,
  frontendImplementationFilesTouched: 0,
  newCalculableLayerTemplates: 0,
  newCalculableRequestShapes: 0,
  runtimeBasisPromotions: 0,
  runtimeFormulaRetunes: 0,
  runtimeValuesMoved: 0,
  sourceRowsImported: 0
} as const;

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const FIELD_BUILDING_WITH_LAB_COMPANIONS = [
  "R'w",
  "Dn,w",
  "DnT,w",
  "STC",
  "C",
  "Ctr"
] as const satisfies readonly RequestedOutputId[];

const EXACT_LSF_LAB_STACK = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "air_gap", thicknessMm: 5 },
  { materialId: "glasswool", thicknessMm: 70 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES = [
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 },
  ...EXACT_LSF_LAB_STACK,
  { materialId: "acoustic_gypsum_board", thicknessMm: 12.5 }
] as const satisfies readonly LayerInput[];

const EXACT_LSF_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const EXACT_LSF_BUILDING_CONTEXT: AirborneContext = {
  ...EXACT_LSF_LAB_CONTEXT,
  buildingPredictionOutputBasis: "apparent_and_standardized",
  conservativeFlankingAssumption: "multi_path_conservative",
  contextMode: "building_prediction",
  flankingJunctionClass: "rigid_t_junction",
  junctionCouplingLengthM: 4.8,
  panelHeightMm: 2800,
  panelWidthMm: 3200,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 55,
  sourceRoomVolumeM3: 48
};

const REQUIRED_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/SYSTEM_MAP.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function getById<Row extends { readonly id: string }>(rows: readonly Row[], id: string, label: string): Row {
  const row = rows.find((entry) => entry.id === id);
  if (!row) {
    throw new Error(`Missing ${label} row ${id}.`);
  }
  return row;
}

function getByCandidateId<Row extends { readonly candidateId: string }>(
  rows: readonly Row[],
  candidateId: string,
  label: string
): Row {
  const row = rows.find((entry) => entry.candidateId === candidateId);
  if (!row) {
    throw new Error(`Missing ${label} candidate row ${candidateId}.`);
  }
  return row;
}

function getBySelectedCandidateId<Row extends { readonly selectedCandidateId: string }>(
  rows: readonly Row[],
  selectedCandidateId: string,
  label: string
): Row {
  const row = rows.find((entry) => entry.selectedCandidateId === selectedCandidateId);
  if (!row) {
    throw new Error(`Missing ${label} selected-candidate row ${selectedCandidateId}.`);
  }
  return row;
}

function summarizeCoverageRefresh() {
  return {
    counters: COVERAGE_REFRESH_COUNTERS,
    landedGate: COVERAGE_REFRESH_ACTION,
    noRuntimeValueMovement: true,
    previousSurfaceParity: {
      selectedNextAction: COVERAGE_REFRESH_ACTION,
      selectedNextFile: COVERAGE_REFRESH_FILE,
      selectionStatus: PREVIOUS_SURFACE_PARITY_STATUS
    },
    selectedNextAction: SELECTED_NEXT_ACTION,
    selectedNextFile: SELECTED_NEXT_FILE,
    selectedNextLabel: SELECTED_NEXT_LABEL,
    selectionStatus: COVERAGE_REFRESH_STATUS
  };
}

describe("post-V1 wall compatible anchor-delta lab metric companion coverage refresh", () => {
  it("lands no-runtime coverage refresh and selects one-side lab companion owner next", () => {
    expect(summarizeCoverageRefresh()).toMatchObject({
      counters: COVERAGE_REFRESH_COUNTERS,
      landedGate: COVERAGE_REFRESH_ACTION,
      noRuntimeValueMovement: true,
      previousSurfaceParity: {
        selectedNextAction: COVERAGE_REFRESH_ACTION,
        selectedNextFile: COVERAGE_REFRESH_FILE,
        selectionStatus: PREVIOUS_SURFACE_PARITY_STATUS
      },
      selectedNextAction: SELECTED_NEXT_ACTION,
      selectedNextFile: SELECTED_NEXT_FILE,
      selectedNextLabel: SELECTED_NEXT_LABEL,
      selectionStatus: COVERAGE_REFRESH_STATUS
    });

    for (const path of [
      PREVIOUS_SURFACE_PARITY_FILE,
      COVERAGE_REFRESH_FILE,
      "packages/engine/src/layer-combination-resolver-registry.ts",
      "packages/engine/src/layer-combination-resolver-candidate-coverage-matrix-refresh.ts",
      "packages/engine/src/layer-combination-resolver-company-internal-v0-rehearsal.ts",
      "packages/engine/src/layer-combination-resolver-runtime-candidate-adapter.ts",
      "packages/engine/src/layer-combination-resolver-runtime-candidate-surface-parity.ts",
      "tools/dev/run-calculator-current-gate.ts"
    ]) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }
  });

  it("keeps the lab companion candidate visible in registry, adapter, surface, coverage matrix, and V0 envelope", () => {
    const registry = buildLayerCombinationResolverRegistryContract();
    const adapter = buildLayerCombinationResolverRuntimeCandidateAdapterContract();
    const surfaceParity = buildLayerCombinationResolverRuntimeCandidateSurfaceParityContract();
    const coverageMatrix = buildLayerCombinationResolverCandidateCoverageMatrixRefreshContract();
    const companyV0 = buildLayerCombinationResolverCompanyInternalV0RehearsalContract();

    const declaration = getById(
      registry.candidateDeclarations,
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      "registry"
    );
    const adapterRow = getBySelectedCandidateId(
      adapter.adapterRows,
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      "adapter"
    );
    const surfaceRow = getBySelectedCandidateId(
      surfaceParity.surfaceRows,
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      "surface parity"
    );
    const matrixRow = getByCandidateId(
      coverageMatrix.coverageMatrixRows,
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      "coverage matrix"
    );
    const v0Row = getByCandidateId(
      companyV0.operatingEnvelopeRows,
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      "company V0"
    );

    expect(declaration).toMatchObject({
      basis: "element_lab",
      id: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      kind: "source_absent_family_solver",
      ownedRuntimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      route: "wall",
      runtimeSelectionState: "active_runtime_existing",
      supportedMetrics: [...WALL_LAB_OUTPUTS],
      valuePins: []
    });
    expect(declaration.errorBudgetTerms).toEqual(
      expect.arrayContaining([
        { metric: "STC", notMeasuredEvidence: true, toleranceDb: 6 },
        { metric: "C", notMeasuredEvidence: true, toleranceDb: 3 },
        { metric: "Ctr", notMeasuredEvidence: true, toleranceDb: 3 }
      ])
    );
    expect(declaration.exactPrecedenceRules).toEqual(
      expect.arrayContaining([
        "same_stack_sources_reporting_stc_c_ctr_would_win_before_this_companion",
        "compatible_anchor_delta_direct_rw_stays_rank_one_for_single_output_rw",
        "mixed_lab_companions_use_shifted_direct_curve_terms_not_source_aliases"
      ])
    );
    expect(declaration.hardCompatibilityGates).toEqual(
      expect.arrayContaining([
        "source_id=knauf_lab_416889_primary_2026",
        "source_metric=Rw",
        "compatible_exterior_board_delta_applied",
        "no_field_or_building_metric_promotion"
      ])
    );

    expect(adapterRow).toMatchObject({
      noRuntimeValueMovement: true,
      requestedBasis: "element_lab",
      route: "wall",
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      selectedCandidate: {
        id: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
        kind: "source_absent_family_solver",
        ownedRuntimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
        supportedMetrics: [...WALL_LAB_OUTPUTS]
      },
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
    });
    expect(adapterRow.rejectedCandidateIds).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_SELECTED_CANDIDATE_ID);

    expect(surfaceRow).toMatchObject({
      basis: "element_lab",
      candidateKind: "source_absent_family_solver",
      noRuntimeValueMovement: true,
      requestedBasis: "element_lab",
      route: "wall",
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: [...WALL_LAB_OUTPUTS],
      valuePins: []
    });

    expect(matrixRow).toMatchObject({
      basis: "element_lab",
      candidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      candidateKind: "source_absent_family_solver",
      hasVisibleCandidateTrace: true,
      noRuntimeValueMovement: true,
      readinessBucket: "ready_with_budget",
      route: "wall",
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      supportBucket: "source_absent_estimate",
      supportedMetrics: [...WALL_LAB_OUTPUTS],
      valuePins: []
    });
    expect(matrixRow.surfaceTargets).toEqual(
      expect.arrayContaining([
        "candidate_trace",
        "calculator_api_payload",
        "local_saved_replay",
        "markdown_report",
        "output_cards",
        "server_snapshot_replay"
      ])
    );

    expect(v0Row).toMatchObject({
      basis: "element_lab",
      budgetMetrics: ["STC", "C", "Ctr"],
      candidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      companyInternalUse: "allowed_with_budget",
      hasVisibleCandidateTrace: true,
      noRuntimeValueMovement: true,
      readinessBucket: "ready_with_budget",
      route: "wall",
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      supportBucket: "source_absent_estimate",
      supportedMetrics: [...WALL_LAB_OUTPUTS],
      valuePins: []
    });
    expect(v0Row.visibleReason).toContain("allowed for company-internal V0 with visible not-measured");
  });

  it("re-probes the live paired-board route and keeps non-selected boundary requests off the lab companion", () => {
    const pairedMixed = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: WALL_LAB_OUTPUTS
    });
    const rwOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["Rw"]
    });
    const stcOnly = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_LAB_CONTEXT,
      calculator: "dynamic",
      targetOutputs: ["STC"]
    });
    const buildingMixed = calculateAssembly(EXACT_LSF_PLUS_OUTER_BOARD_BOTH_SIDES, {
      airborneContext: EXACT_LSF_BUILDING_CONTEXT,
      calculator: "dynamic",
      targetOutputs: FIELD_BUILDING_WITH_LAB_COMPANIONS
    });

    expect(pairedMixed.supportedTargetOutputs).toEqual(WALL_LAB_OUTPUTS);
    expect(pairedMixed.unsupportedTargetOutputs).toEqual([]);
    expect(pairedMixed.metrics).toMatchObject({
      estimatedCDb: -1.1,
      estimatedCtrDb: -6,
      estimatedRwDb: 59,
      estimatedStc: 59
    });
    expect(pairedMixed.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(pairedMixed.layerCombinationResolverTrace).toMatchObject({
      candidateKind: "source_absent_family_solver",
      errorBudgetMetrics: ["STC", "C", "Ctr"],
      noRuntimeValueMovement: true,
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      supportBucket: "source_absent_estimate",
      supportedMetrics: [...WALL_LAB_OUTPUTS],
      valuePins: [
        { metric: "Rw", value: 59 },
        { metric: "STC", value: 59 },
        { metric: "C", value: -1.1 },
        { metric: "Ctr", value: -6 }
      ]
    });
    expect(pairedMixed.warnings).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_WARNING);
    expect(pairedMixed.warnings).not.toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_WARNING);

    expect(rwOnly.supportedTargetOutputs).toEqual(["Rw"]);
    expect(rwOnly.unsupportedTargetOutputs).toEqual([]);
    expect(rwOnly.airborneBasis).toMatchObject({
      method: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_RUNTIME_METHOD,
      origin: "measured_exact_subassembly_plus_calculated_delta"
    });
    expect(rwOnly.airborneCandidateResolution?.selectedCandidateId).not.toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
    );

    expect(stcOnly.supportedTargetOutputs).toEqual(["STC"]);
    expect(stcOnly.unsupportedTargetOutputs).toEqual([]);
    expect(stcOnly.airborneCandidateResolution).toMatchObject({
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      selectedOrigin: "family_physics_prediction"
    });
    expect(stcOnly.layerCombinationResolverTrace).toMatchObject({
      runtimeBasisId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD,
      selectedCandidateId: POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID,
      supportedMetrics: ["STC"],
      valuePins: [{ metric: "STC", value: 59 }]
    });

    expect(buildingMixed.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w"]);
    expect(buildingMixed.unsupportedTargetOutputs).toEqual(["STC", "C", "Ctr"]);
    expect(buildingMixed.layerCombinationResolverTrace?.selectedCandidateId).not.toBe(
      POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID
    );
  });

  it("keeps docs and the current-gate runner aligned with the landed coverage refresh and selected next plan", () => {
    for (const path of REQUIRED_DOCS) {
      const content = readRepoFile(path);
      const normalized = content.toLowerCase().replace(/\s+/g, " ");

      expect(content, path).toContain(PREVIOUS_SURFACE_PARITY_ACTION);
      expect(content, path).toContain(PREVIOUS_SURFACE_PARITY_STATUS);
      expect(content, path).toContain(COVERAGE_REFRESH_ACTION);
      expect(content, path).toContain(COVERAGE_REFRESH_FILE);
      expect(content, path).toContain(COVERAGE_REFRESH_STATUS);
      expect(content, path).toContain(SELECTED_NEXT_ACTION);
      expect(content, path).toContain(SELECTED_NEXT_FILE);
      expect(content, path).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_RUNTIME_METHOD);
      expect(content, path).toContain(POST_V1_WALL_COMPATIBLE_ANCHOR_DELTA_LAB_COMPANION_SELECTED_CANDIDATE_ID);
      expect(content, path).toContain("Rw 59 / STC 59 / C -1.1 / Ctr -6");
      expect(normalized, path).toContain(SELECTED_NEXT_LABEL.toLowerCase());
      expect(normalized, path).toContain("ready_with_budget");
      expect(normalized, path).toContain("allowed_with_budget");
      expect(normalized, path).toContain("one-side exterior-board");
      expect(normalized, path).toContain("not a broad source crawl");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-wall-compatible-anchor-delta-lab-metric-companion-coverage-refresh-contract.test.ts");
  });
});
