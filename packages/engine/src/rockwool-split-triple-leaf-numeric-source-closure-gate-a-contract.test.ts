import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import { FLAT_LIST_MULTILEAF_GUARD_STRATEGY } from "./dynamic-airborne-flat-list-multileaf-guard";
import {
  evaluateRockwoolSplitTripleLeafNumericSourceClosure,
  ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_DECISION,
  ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A,
  type RockwoolSplitTripleLeafNumericSnapshot
} from "./rockwool-split-triple-leaf-numeric-source-closure";
import { ROCKWOOL_TRIPLE_LEAF_SOURCE_REQUIRED_RUNTIME_BLOCKERS } from "./rockwool-triple-leaf-source-required-boundary";
import { evaluateWallTripleLeafCalibrationGate } from "./wall-triple-leaf-calibration-regime";
import { WALL_TRIPLE_LEAF_SOURCE_PACK_CANDIDATES } from "./wall-triple-leaf-source-pack";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const WALL_LAB_CONTEXT: AirborneContext = {
  contextMode: "element_lab"
};

const WALL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "field_between_rooms",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const WALL_LAB_OUTPUTS = ["Rw", "STC", "C", "Ctr"] as const satisfies readonly RequestedOutputId[];
const WALL_FIELD_OUTPUTS = ["R'w", "DnT,w", "DnT,A", "Dn,w", "Dn,A"] as const satisfies readonly RequestedOutputId[];

const PDF_LIKE_ADJACENT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

const PDF_LIKE_SPLIT_ROCKWOOL_STACK: readonly LayerInput[] = [
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "mlv", thicknessMm: 4 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "rockwool", thicknessMm: 50 },
  { materialId: "gypsum_board", thicknessMm: 12.5 },
  { materialId: "gypsum_plaster", thicknessMm: 10 },
  { materialId: "gypsum_board", thicknessMm: 12.5 }
];

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function sourceCandidate(id: string) {
  const candidate = WALL_TRIPLE_LEAF_SOURCE_PACK_CANDIDATES.find((source) => source.id === id);

  if (!candidate) {
    throw new Error(`Missing source-pack candidate ${id}`);
  }

  return candidate;
}

function wallSnapshot(input: {
  airborneContext: AirborneContext;
  layers: readonly LayerInput[];
  outputs: readonly RequestedOutputId[];
}): RockwoolSplitTripleLeafNumericSnapshot & { warnings: string } {
  const result = calculateAssembly(input.layers, {
    airborneContext: input.airborneContext,
    calculator: "dynamic",
    targetOutputs: input.outputs
  });

  return {
    confidence: result.dynamicAirborneTrace?.confidenceClass,
    dnTw: result.metrics.estimatedDnTwDb,
    family: result.dynamicAirborneTrace?.detectedFamily,
    rw: result.metrics.estimatedRwDb,
    rwPrime: result.metrics.estimatedRwPrimeDb,
    stc: result.metrics.estimatedStc,
    strategy: result.dynamicAirborneTrace?.strategy,
    warnings: result.warnings.join("\n")
  };
}

describe("Rockwool split triple-leaf numeric source closure Gate A", () => {
  it("lands Gate A as a numeric correctness decision, not a confidence wording pass", () => {
    expect(ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A).toEqual({
      apiShapeChange: false,
      confidencePromotion: false,
      evidencePromotion: false,
      landedGate: "gate_a_decided_split_internal_leaf_requires_source_owned_topology_before_exact_numeric_closure",
      numericRuntimeBehaviorChange: false,
      outputCardStatusChange: false,
      proposalReportCopyChange: false,
      routeCardValueChange: false,
      runtimeImportReadyNow: false,
      runtimeImportSelectedNow: false,
      selectedNextAction:
        "gate_b_withhold_flat_list_split_internal_leaf_exact_outputs_until_grouped_topology_or_source_owned_model",
      selectedNextFile: "packages/engine/src/rockwool-split-triple-leaf-numeric-source-closure-gate-b-runtime.test.ts",
      selectionStatus:
        "gate_a_kept_split_internal_leaf_finite_screening_diagnostic_but_rejected_exact_numeric_closure_selected_runtime_withhold_gate_b",
      sliceId: "rockwool_split_triple_leaf_numeric_source_closure_v1",
      supportPromotion: false,
      workbenchInputBehaviorChange: false
    });
    expect(ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_DECISION).toEqual({
      adjacentFlatListDefendedValue: "Rw 51 / R'w 49 / DnT,w 51",
      decision:
        "flat-list split/internal gypsum leaf cannot be treated as a defended physical triple-leaf penalty without grouped topology and a source-owned calibrated model",
      rejectedShortcut:
        "do not import NRC/Uris weighted deltas or the current multileaf screening blend as a fixed Rockwool runtime penalty",
      splitCurrentDiagnosticValue: "Rw 41 / R'w 39 / DnT,w 40",
      splitExactNumericClosedNow: false
    });
  });

  it("keeps adjacent Rockwool recovered while rejecting the split/internal-leaf value as exact closure", () => {
    const adjacentLab = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: PDF_LIKE_ADJACENT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const adjacentField = wallSnapshot({
      airborneContext: WALL_FIELD_CONTEXT,
      layers: PDF_LIKE_ADJACENT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });
    const splitLab = wallSnapshot({
      airborneContext: WALL_LAB_CONTEXT,
      layers: PDF_LIKE_SPLIT_ROCKWOOL_STACK,
      outputs: WALL_LAB_OUTPUTS
    });
    const splitField = wallSnapshot({
      airborneContext: WALL_FIELD_CONTEXT,
      layers: PDF_LIKE_SPLIT_ROCKWOOL_STACK,
      outputs: WALL_FIELD_OUTPUTS
    });
    const evaluation = evaluateRockwoolSplitTripleLeafNumericSourceClosure({
      adjacentField,
      adjacentLab,
      splitField,
      splitLab
    });

    expect(adjacentLab).toMatchObject({
      confidence: "medium",
      family: "double_leaf",
      rw: 51,
      stc: 51,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY
    });
    expect(adjacentField).toMatchObject({
      confidence: "medium",
      dnTw: 51,
      family: "double_leaf",
      rwPrime: 49,
      strategy: FLAT_LIST_MULTILEAF_GUARD_STRATEGY
    });
    expect(splitLab).toMatchObject({
      confidence: "low",
      family: "multileaf_multicavity",
      rw: 41,
      stc: 41,
      strategy: "multileaf_screening_blend"
    });
    expect(splitField).toMatchObject({
      confidence: "low",
      dnTw: 40,
      family: "multileaf_multicavity",
      rwPrime: 39,
      strategy: "multileaf_screening_blend"
    });
    expect(evaluation).toMatchObject({
      adjacentFlatListRecovered: true,
      exactNumericClosedNow: false,
      flatListSplitInternalLeafPhysicalPenaltyAllowedNow: false,
      groupedTopologyRequiredBeforePhysicalPenalty: true,
      selectedNextAction: ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A.selectedNextAction,
      selectedNextFile: ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A.selectedNextFile,
      sourceOwnedExactRuntimeReadyNow: false,
      splitCurrentFiniteDiagnostic: true
    });
    expect(evaluation.requiredBeforeExactNumericClosure).toEqual(
      expect.arrayContaining([
        ...ROCKWOOL_TRIPLE_LEAF_SOURCE_REQUIRED_RUNTIME_BLOCKERS,
        "no_digitized_triple_leaf_source_rows",
        "no_source_owned_holdout_rows",
        "insufficient_source_owned_calibration_rows",
        "insufficient_source_owned_holdout_rows"
      ])
    );
  });

  it("rejects available NRC/Uris/Ballagh material as a source-owned fixed penalty for this Rockwool stack", () => {
    const nrc2024 = sourceCandidate("nrc_2024_internal_gypsum_double_stud");
    const uris2006 = sourceCandidate("uris_2006_internal_gypsum_double_frame");
    const ballagh2013 = sourceCandidate("ballagh_2013_triple_panel_low_frequency_model");
    const calibrationGate = evaluateWallTripleLeafCalibrationGate();
    const evaluation = evaluateRockwoolSplitTripleLeafNumericSourceClosure({
      adjacentField: { family: "double_leaf", dnTw: 51, rwPrime: 49 },
      adjacentLab: { family: "double_leaf", rw: 51, stc: 51 },
      calibrationGate,
      splitField: { family: "multileaf_multicavity", dnTw: 40, rwPrime: 39, strategy: "multileaf_screening_blend" },
      splitLab: { family: "multileaf_multicavity", rw: 41, stc: 41, strategy: "multileaf_screening_blend" }
    });

    expect(nrc2024).toMatchObject({
      bandDataStatus: "plotted_curve_requires_digitization",
      directRuntimeReadyNow: false,
      hasNumericBandCurve: false,
      protectedBoundary:
        "nrc_2024_internal_board_stc_rows_do_not_authorize_a_fixed_7_to_17_db_penalty_or_exact_rw_for_user_stack"
    });
    expect(nrc2024.reportedMetrics).toEqual(
      expect.arrayContaining([
        "Base double-stud wall STC 64",
        "Assembly C STC 57",
        "reported low-frequency transmission-loss decrease on the order of 14-17 dB"
      ])
    );
    expect(uris2006).toMatchObject({
      bandDataStatus: "abstract_or_metadata_only",
      directRuntimeReadyNow: false,
      hasNumericBandCurve: false,
      protectedBoundary:
        "reported_7_to_8_db_weighted_decrease_is_not_a_substitute_for_local_rw_or_band_curve_ownership"
    });
    expect(uris2006.reportedMetrics).toContain("weighted sound reduction index decrease reported as 7-8 dB");
    expect(ballagh2013).toMatchObject({
      directRuntimeReadyNow: false,
      hasNumericBandCurve: false,
      metricOwner: "solver_model_no_measured_metric",
      protectedBoundary:
        "published_solver_shape_does_not_authorize_runtime_rw_without_measured_row_calibration"
    });
    expect(calibrationGate).toMatchObject({
      runtimeEligibleNow: false,
      sourceOwnedCalibrationPass: false
    });
    expect(calibrationGate.blockers).toEqual(
      expect.arrayContaining([
        "no_digitized_triple_leaf_source_rows",
        "no_source_owned_holdout_rows",
        "insufficient_source_owned_calibration_rows",
        "insufficient_source_owned_holdout_rows"
      ])
    );
    expect(evaluation.blockedSourceEvidence.map((source) => source.id)).toEqual([
      "nrc_2024_internal_gypsum_double_stud",
      "uris_2006_internal_gypsum_double_frame",
      "ballagh_2013_triple_panel_low_frequency_model"
    ]);
    expect(evaluation.blockedSourceEvidence.every((source) => source.firstMissingBlocker.length > 0)).toBe(true);
  });

  it("keeps active docs aligned with the selected runtime-withhold next gate", () => {
    const requiredFiles = [
      "AGENTS.md",
      "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
      "docs/calculator/CURRENT_STATE.md",
      "docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_V1_PLAN.md",
      "docs/calculator/TRIPLE_LEAF_ROCKWOOL_REORDER_DEFECT_HANDOFF.md",
      "docs/calculator/CHECKPOINT_2026-05-05_ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A_HANDOFF.md"
    ] as const;

    for (const path of requiredFiles) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
    }

    const docs = requiredFiles.map(readRepoFile);

    for (const doc of docs) {
      expect(doc).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A.landedGate);
      expect(doc).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A.selectionStatus);
      expect(doc).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A.selectedNextFile);
      expect(doc).toContain(ROCKWOOL_SPLIT_TRIPLE_LEAF_NUMERIC_SOURCE_CLOSURE_GATE_A.selectedNextAction);
      expect(doc).toContain("rockwool_split_internal_leaf_exact_numeric_rejected_without_source_owned_topology");
      expect(doc).toContain("Rw 41 / R'w 39 / DnT,w 40");
      expect(doc).toContain("Rw 51 / R'w 49 / DnT,w 51");
    }
  });
});
