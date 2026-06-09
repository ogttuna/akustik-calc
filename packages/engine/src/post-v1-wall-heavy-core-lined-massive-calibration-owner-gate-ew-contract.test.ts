import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_LANDED_GATE,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_ACTION,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_FILE,
  POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTION_STATUS,
  POST_V1_GATE_EV_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EV_SELECTED_GAP_ID
} from "./post-v1-current-coverage-accuracy-gap-ledger-gate-ev";
import {
  POST_V1_GATE_DD_EVIDENCE_BOUNDARIES,
  POST_V1_GATE_DD_UNLOCK_REQUIREMENTS
} from "./post-v1-wall-heavy-core-lined-massive-accuracy-gate-dd";
import {
  POST_V1_GATE_EW_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EW_OWNER_DECISION_ID,
  POST_V1_GATE_EW_PLAN_DOC_PATH,
  POST_V1_GATE_EW_TARGET_OUTPUTS,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_LANDED_GATE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_LABEL,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTION_STATUS,
  buildPostV1GateEWCalibrationOwnerEvidence,
  summarizePostV1WallHeavyCoreLinedMassiveCalibrationOwnerGateEW
} from "./post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "README.md",
  "docs/README.md",
  "docs/calculator/README.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/SYSTEM_MAP.md",
  "docs/calculator/USABLE_V1_EXECUTION_PLAN.md",
  POST_V1_GATE_EW_PLAN_DOC_PATH
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

describe("post-V1 wall heavy-core / lined-massive calibration owner Gate EW", () => {
  it("lands after Gate EV and rejects owner acceptance before selecting Gate EX", () => {
    const summary = summarizePostV1WallHeavyCoreLinedMassiveCalibrationOwnerGateEW();

    expect(POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTION_STATUS).toBe(
      "post_v1_current_coverage_accuracy_gap_ledger_gate_ev_landed_no_runtime_selected_wall_heavy_core_lined_massive_calibration_owner_gate_ew"
    );
    expect(POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_LANDED_GATE
    );
    expect(POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts"
    );

    expect(summary).toMatchObject({
      landedGate: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_EW_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      ownerDecision: {
        accepted: false,
        decisionId: POST_V1_GATE_EW_OWNER_DECISION_ID,
        missingRequirements: POST_V1_GATE_DD_UNLOCK_REQUIREMENTS,
        selectedNextAction:
          POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_ACTION,
        selectedNextFile:
          POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_FILE
      },
      previousGateEV: {
        counters: POST_V1_GATE_EV_NO_RUNTIME_COUNTERS,
        landedGate: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_LANDED_GATE,
        selectedGapId: POST_V1_GATE_EV_SELECTED_GAP_ID,
        selectedNextAction: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_CURRENT_COVERAGE_ACCURACY_GAP_LEDGER_GATE_EV_SELECTION_STATUS
      },
      selectedNextAction:
        POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_FILE,
      selectedNextLabel:
        POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_EW_TARGET_OUTPUTS
    });
  });

  it("pins the exact missing owner evidence and rejects every adjacent near miss", () => {
    const evidence = buildPostV1GateEWCalibrationOwnerEvidence();
    const byId = new Map(evidence.map((row) => [row.id, row]));

    expect(evidence).toHaveLength(POST_V1_GATE_EW_NO_RUNTIME_COUNTERS.evidenceBoundaryLedgersPinned);
    expect(evidence.every((row) => row.acceptedForCalibrationOwner === false)).toBe(true);
    expect(evidence.map((row) => row.id)).toEqual([
      "wall_specific_source_row_missing",
      "bounded_wall_lining_rule_missing",
      "current_bounded_prediction_not_calibration_holdout",
      "floor_only_cc60_rows_rejected",
      "manufacturer_context_missing_mounting_and_tolerance",
      "formula_context_without_local_tolerance_rejected",
      "presets_selector_and_deep_hybrid_rejected",
      "metric_basis_boundary_pinned"
    ]);

    expect(byId.get("wall_specific_source_row_missing")).toMatchObject({
      protectsBoundary: "source_locator",
      requiredBeforeRuntime: true
    });
    expect(byId.get("bounded_wall_lining_rule_missing")).toMatchObject({
      protectsBoundary: "formula_tolerance_owner",
      requiredBeforeRuntime: true
    });
    expect(byId.get("floor_only_cc60_rows_rejected")).toMatchObject({
      protectsBoundary: "floor_only_rejection",
      requiredBeforeRuntime: false
    });
    expect(byId.get("metric_basis_boundary_pinned")).toMatchObject({
      protectsBoundary: "metric_basis",
      requiredBeforeRuntime: true
    });
  });

  it("keeps the Gate DG bounded_prediction route and all live values frozen", () => {
    const summary = summarizePostV1WallHeavyCoreLinedMassiveCalibrationOwnerGateEW();
    const testCase = generatedCase(summary.liveRoutePins.generatedCaseId);
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);

    expect(resultSnapshot(lab)).toMatchObject({
      c: summary.liveRoutePins.labPins.C,
      ctr: summary.liveRoutePins.labPins.Ctr,
      rw: summary.liveRoutePins.labPins.Rw,
      stc: summary.liveRoutePins.labPins.STC,
      supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      unsupportedTargetOutputs: []
    });
    expect(lab.airborneBasis).toMatchObject({
      kind: summary.labRuntimeBasis.kind,
      method: summary.labRuntimeBasis.method,
      origin: "bounded_prediction",
      toleranceClass: "bounded_prediction"
    });
    expect(lab.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "bounded_prediction"
    });

    expect(resultSnapshot(field)).toMatchObject({
      c: summary.liveRoutePins.fieldPins.C,
      ctr: summary.liveRoutePins.fieldPins.Ctr,
      dnTA: summary.liveRoutePins.fieldPins.DnTADb,
      dnTw: summary.liveRoutePins.fieldPins.DnTwDb,
      dnW: summary.liveRoutePins.fieldPins.DnWDb,
      rwPrimeDb: summary.liveRoutePins.fieldPins.RwPrimeDb,
      supportedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      unsupportedTargetOutputs: []
    });
    expect(field.airborneBasis).toMatchObject({
      kind: summary.fieldRuntimeBasis.kind,
      method: summary.fieldRuntimeBasis.method,
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(field.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "family_physics_prediction"
    });
  });

  it("keeps Gate DD evidence boundaries closed and source/runtime counters at zero", () => {
    const summary = summarizePostV1WallHeavyCoreLinedMassiveCalibrationOwnerGateEW();

    expect(POST_V1_GATE_DD_EVIDENCE_BOUNDARIES.every((boundary) => boundary.runtimeMovementAllowedNow === false))
      .toBe(true);
    for (const boundary of POST_V1_GATE_DD_EVIDENCE_BOUNDARIES) {
      for (const path of boundary.evidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${boundary.id}:${path}`).toBe(true);
      }
    }

    expect(summary.noRuntimeCounters).toMatchObject({
      acceptedOwnerLedgers: 0,
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0,
      wallSpecificPositiveRowsAccepted: 0
    });
    expect(summary.sourceRuntimeBasisCounters).toMatchObject({
      boundedRuntimeBasisPromotions: 1,
      runtimeValuesMoved: 0
    });
  });

  it("keeps docs and current-gate runner aligned with Gate EW closeout and Gate EX selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(
        POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_CALIBRATION_OWNER_GATE_EW_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain(POST_V1_GATE_EW_OWNER_DECISION_ID);
      expect(contents, path).toContain("Gate EX");
      expect(normalizedWhitespaceContent, path).toContain("owner rejected");
      expect(normalizedWhitespaceContent, path).toContain(
        "wall-specific lined concrete or heavy-masonry source row"
      );
      expect(normalizedWhitespaceContent, path).toContain("bounded_prediction values frozen");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-current-coverage-accuracy-gap-ledger-gate-ev-contract.test.ts");
    expect(runner).toContain(
      "src/post-v1-wall-heavy-core-lined-massive-calibration-owner-gate-ew-contract.test.ts"
    );
  });
});
