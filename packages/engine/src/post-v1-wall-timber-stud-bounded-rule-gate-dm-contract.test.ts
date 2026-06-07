import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { AirborneContext, LayerInput } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { findVerifiedAirborneAssemblyMatch } from "./airborne-verified-catalog";
import { summarizeAirborneTopology } from "./airborne-topology";
import { calculateAssembly } from "./calculate-assembly";
import { describePrimaryCavity } from "./dynamic-airborne-cavity-topology";
import { normalizeFramingHint } from "./dynamic-airborne-family-detection";
import {
  estimateStudWallTargetRw,
  summarizeFramedBoardSystem,
  summarizeFramingEvidence
} from "./dynamic-airborne-framed-wall";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_GATE_DL_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-dl";
import {
  POST_V1_GATE_DM_BOUNDED_RULE_ENVELOPE,
  POST_V1_GATE_DM_BOUNDED_RULE_OWNER_CANDIDATE_ID,
  POST_V1_GATE_DM_COUNTERS,
  POST_V1_GATE_DM_FIELD_ADAPTER_OUTPUTS,
  POST_V1_GATE_DM_LAB_BOUNDED_OUTPUTS,
  POST_V1_GATE_DM_LIVE_ROUTE_PINS,
  POST_V1_GATE_DM_NEGATIVE_BOUNDARIES,
  POST_V1_GATE_DM_TARGET_OUTPUTS,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_LANDED_GATE,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_ACTION,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_FILE,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_LABEL,
  POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTION_STATUS,
  summarizePostV1WallTimberStudBoundedRuleGateDM
} from "./post-v1-wall-timber-stud-bounded-rule-gate-dm";
import {
  WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS,
  WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS,
  type WallTimberLightweightLinkedHoldoutRow,
  type WallTimberLightweightOfficialSourceRow
} from "./wall-timber-lightweight-source-corpus";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

function generatedCase(id: string) {
  const found = ENGINE_MIXED_GENERATED_CASES.find((testCase) => testCase.id === id);

  if (!found) {
    throw new Error(`Missing generated case ${id}`);
  }

  return found;
}

function context(options: Parameters<typeof calculateAssembly>[1], label: string): AirborneContext {
  const value = options?.airborneContext;

  if (!value) {
    throw new Error(`${label} airborne context missing`);
  }

  return value;
}

function hasExactLayerSignature(left: readonly LayerInput[], right: readonly LayerInput[]): boolean {
  return (
    left.length === right.length &&
    left.every(
      (layer, index) =>
        layer.materialId === right[index]?.materialId &&
        layer.thicknessMm === right[index]?.thicknessMm
    )
  );
}

function hasExactContextSignature(left: AirborneContext, right: Partial<AirborneContext>): boolean {
  return (
    left.contextMode === right.contextMode &&
    left.connectionType === right.connectionType &&
    left.studType === right.studType &&
    left.studSpacingMm === right.studSpacingMm &&
    left.resilientBarSideCount === right.resilientBarSideCount
  );
}

function officialTimberRows(): WallTimberLightweightOfficialSourceRow[] {
  return WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter(
    (entry): entry is WallTimberLightweightOfficialSourceRow => entry.kind === "official_row"
  );
}

function linkedTimberHoldoutRows(): WallTimberLightweightLinkedHoldoutRow[] {
  return WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS.filter(
    (entry): entry is WallTimberLightweightLinkedHoldoutRow => entry.kind === "linked_holdout"
  );
}

describe("post-V1 wall timber-stud bounded-rule Gate DM", () => {
  it("lands after Gate DL and selects bounded runtime-basis Gate DN without moving values", () => {
    const summary = summarizePostV1WallTimberStudBoundedRuleGateDM();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_dl_landed_no_runtime_selected_wall_timber_stud_bounded_rule_gate_dm"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DL_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-timber-stud-bounded-rule-gate-dm-contract.test.ts"
    );
    expect(summary).toMatchObject({
      boundedRuleEnvelope: POST_V1_GATE_DM_BOUNDED_RULE_ENVELOPE,
      counters: POST_V1_GATE_DM_COUNTERS,
      landedGate: POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_LANDED_GATE,
      labBoundedOutputs: POST_V1_GATE_DM_LAB_BOUNDED_OUTPUTS,
      negativeBoundaries: POST_V1_GATE_DM_NEGATIVE_BOUNDARIES,
      noRuntimeValueMovement: true,
      previousGateDL: {
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
    });
  });

  it("defines the bounded direct wood-stud envelope on the live formula route without retuning pins", () => {
    const testCase = generatedCase(POST_V1_GATE_DM_LIVE_ROUTE_PINS.generatedCaseId);
    const labContext = context(testCase.labOptions, testCase.id);
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const labSnapshot = resultSnapshot(lab);
    const fieldSnapshot = resultSnapshot(field);
    const topology = summarizeAirborneTopology(lab.layers);
    const cavity = describePrimaryCavity(lab.layers);
    const boardSystem = summarizeFramedBoardSystem(lab.layers);
    const framingHint = normalizeFramingHint(labContext);
    const framingEvidence = summarizeFramingEvidence(lab.layers, topology, framingHint);
    const coefficientRoute = estimateStudWallTargetRw(
      lab.layers,
      topology,
      framingHint,
      "stud_wall_system",
      31
    );

    expect(labSnapshot).toMatchObject({
      c: POST_V1_GATE_DM_LIVE_ROUTE_PINS.labPins.C,
      ctr: POST_V1_GATE_DM_LIVE_ROUTE_PINS.labPins.Ctr,
      rw: POST_V1_GATE_DM_LIVE_ROUTE_PINS.labPins.Rw,
      stc: POST_V1_GATE_DM_LIVE_ROUTE_PINS.labPins.STC,
      supportedTargetOutputs: [...POST_V1_GATE_DM_LAB_BOUNDED_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(fieldSnapshot).toMatchObject({
      dnTA: POST_V1_GATE_DM_LIVE_ROUTE_PINS.fieldPins.DnTADb,
      dnTw: POST_V1_GATE_DM_LIVE_ROUTE_PINS.fieldPins.DnTwDb,
      dnW: POST_V1_GATE_DM_LIVE_ROUTE_PINS.fieldPins.DnWDb,
      rwPrimeDb: POST_V1_GATE_DM_LIVE_ROUTE_PINS.fieldPins.RwPrimeDb,
      supportedTargetOutputs: [...POST_V1_GATE_DM_FIELD_ADAPTER_OUTPUTS],
      unsupportedTargetOutputs: []
    });
    expect(lab.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "stud_wall_system",
      familyDecisionClass: POST_V1_GATE_DM_LIVE_ROUTE_PINS.tracePins.familyDecisionClass,
      runnerUpFamily: POST_V1_GATE_DM_LIVE_ROUTE_PINS.tracePins.runnerUpFamily,
      selectedMethod: POST_V1_GATE_DM_LIVE_ROUTE_PINS.tracePins.selectedMethod,
      strategy: POST_V1_GATE_DM_LIVE_ROUTE_PINS.tracePins.strategy
    });
    expect(field.airborneBasis).toMatchObject({
      family: "stud_wall_system"
    });
    expect(boardSystem).toMatchObject({
      acousticBoardFraction: 0,
      boardTier: "double_board",
      leftLeafBoardCount: 2,
      primaryGapLayerCount: 1,
      rightLeafBoardCount: 2
    });
    expect(cavity).toEqual({
      coreThicknessMm: 100,
      gapThicknessMm: 50,
      porousThicknessMm: 50
    });
    expect(framingEvidence).toMatchObject({
      boardDominantFramedMorphology: true,
      explicitHint: true,
      explicitHintOnly: true,
      studEligible: true,
      supportEvidence: false
    });
    expect(coefficientRoute).toMatchObject({
      strategySuffix: "framed_wall_calibration",
      targetRw: 49.7
    });
    expect(POST_V1_GATE_DM_BOUNDED_RULE_ENVELOPE.map((field) => field.fieldId)).toEqual([
      "wallTopologyFamily",
      "studSupportOwner",
      "boardSystem",
      "cavityFillCoverage",
      "studSpacingMm",
      "directConnection",
      "selectedCoefficientCurve",
      "metricBasis",
      "tolerance"
    ]);
    expect(POST_V1_GATE_DM_COUNTERS.runtimeValuesMoved).toBe(0);
    expect(POST_V1_GATE_DM_COUNTERS.boundedRuntimeBasisPromotions).toBe(0);
  });

  it("keeps exact, benchmark, and holdout timber rows out of the live double-board owner", () => {
    const testCase = generatedCase(POST_V1_GATE_DM_LIVE_ROUTE_PINS.generatedCaseId);
    const labContext = context(testCase.labOptions, testCase.id);
    const fieldContext = context(testCase.fieldOptions, testCase.id);
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const exactTopologyMatches = WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS.filter(
      (row) =>
        hasExactLayerSignature(testCase.rows, row.layers) &&
        (
          hasExactContextSignature(labContext, row.airborneContext) ||
          hasExactContextSignature(fieldContext, row.airborneContext)
        )
    );
    const directSingleBoardExactRows = WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS.filter(
      (row) => row.topology === "timber_direct_single_board"
    );
    const resilientExactRows = WALL_TIMBER_LIGHTWEIGHT_EXACT_IMPORT_ROWS.filter(
      (row) =>
        row.topology === "timber_resilient_bar_one_side_double_board" ||
        row.topology === "timber_resilient_bar_both_sides_double_board"
    );
    const secondaryDirectDoubleBoardRows = officialTimberRows().filter(
      (row) =>
        row.classification === "secondary_benchmark" &&
        row.topology === "timber_direct_double_board"
    );
    const linkedHoldouts = linkedTimberHoldoutRows();

    expect(findVerifiedAirborneAssemblyMatch(lab.layers, labContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatch(field.layers, fieldContext)).toBeNull();
    expect(exactTopologyMatches).toEqual([]);
    expect(directSingleBoardExactRows.map((row) => row.expectedRw)).toEqual([35, 42]);
    expect(resilientExactRows.map((row) => row.airborneContext.resilientBarSideCount)).toEqual([
      "one_side",
      "both_sides",
      "one_side",
      "both_sides"
    ]);
    expect(secondaryDirectDoubleBoardRows).toHaveLength(1);
    expect(secondaryDirectDoubleBoardRows[0]).toMatchObject({
      expectedRw: 41,
      topology: "timber_direct_double_board"
    });
    expect(hasExactLayerSignature(testCase.rows, secondaryDirectDoubleBoardRows[0]?.layers ?? []))
      .toBe(false);
    expect(linkedHoldouts.map((row) => row.topology)).toEqual([
      "lightweight_steel_single_board_holdout",
      "lightweight_steel_double_board_holdout"
    ]);
    expect(POST_V1_GATE_DM_NEGATIVE_BOUNDARIES.map((boundary) => boundary.boundaryId)).toEqual([
      "direct_value_retune",
      "exact_or_benchmark_source_promotion",
      "single_board_exact_imports",
      "light_steel_stud_or_resilient_bar",
      "field_or_building_metric_adapter",
      "split_double_stud_or_grouped_multicavity",
      "clt_or_mass_timber_panel"
    ]);
  });

  it("keeps adjacent LSF, CLT, and grouped multicavity routes outside the timber-stud bounded owner", () => {
    const lsfCase = generatedCase("wall-lsf-knauf");
    const cltCase = generatedCase("wall-clt-local");
    const heldAacCase = generatedCase("wall-held-aac");
    const lsf = calculateAssembly(lsfCase.rows, lsfCase.labOptions);
    const clt = calculateAssembly(cltCase.rows, cltCase.labOptions);
    const heldAac = calculateAssembly(heldAacCase.rows, {
      ...heldAacCase.fieldOptions,
      targetOutputs: ["Rw", "R'w", "DnT,w"]
    });

    expect(context(lsfCase.labOptions, lsfCase.id)).toMatchObject({
      connectionType: "line_connection",
      studSpacingMm: 600,
      studType: "light_steel_stud"
    });
    expect(lsf.dynamicAirborneTrace).toMatchObject({
      detectedFamily: "stud_wall_system"
    });
    expect(clt.dynamicAirborneTrace?.detectedFamily).not.toBe("stud_wall_system");
    expect(clt.airborneBasis?.family).not.toBe("stud_wall_system");
    expect(heldAac.airborneBasis).toMatchObject({
      origin: "needs_input"
    });
    expect(heldAac.airborneBasis?.missingPhysicalInputs).toEqual([
      "sideALeafGroup",
      "cavity1DepthMm",
      "internalLeafGroup",
      "internalLeafCoupling",
      "cavity2DepthMm",
      "sideBLeafGroup",
      "supportTopology"
    ]);
    expect(POST_V1_GATE_DM_NEGATIVE_BOUNDARIES.every((boundary) => boundary.runtimeMovementAllowedNow === false))
      .toBe(true);
  });

  it("keeps docs and current-gate runner aligned with Gate DM closeout and Gate DN selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_WALL_TIMBER_STUD_BOUNDED_RULE_GATE_DM_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DM_BOUNDED_RULE_OWNER_CANDIDATE_ID);
      expect(contents, path).toContain("stud_surrogate_blend + framed_wall_calibration");
      expect(contents, path).toContain("light_steel_stud_or_resilient_bar");
    }

    expect(existsSync(join(REPO_ROOT, "packages/engine/src/post-v1-wall-timber-stud-bounded-rule-gate-dm.ts"))).toBe(true);
    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-wall-timber-stud-bounded-rule-gate-dm-contract.test.ts");
  });
});
