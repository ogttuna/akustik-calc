import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  findVerifiedAirborneAssemblyMatch,
  findVerifiedAirborneAssemblyMatchWithLabFallback
} from "./airborne-verified-catalog";
import { calculateAssembly } from "./calculate-assembly";
import {
  ENGINE_MIXED_GENERATED_CASES,
  resultSnapshot
} from "./mixed-floor-wall-generated-test-helpers";
import {
  POST_V1_GATE_EX_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EX_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-ex";
import {
  POST_V1_GATE_EY_EVIDENCE_DECISION_ID,
  POST_V1_GATE_EY_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_EY_PLAN_DOC_PATH,
  POST_V1_GATE_EY_TARGET_OUTPUTS,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_LANDED_GATE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_LABEL,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTION_STATUS,
  buildPostV1GateEYTargetedEvidenceLedgers,
  summarizePostV1WallHeavyCoreLinedMassiveTargetedEvidenceGateEY
} from "./post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey";

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
  POST_V1_GATE_EY_PLAN_DOC_PATH
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

describe("post-V1 wall heavy-core / lined-massive targeted evidence acquisition Gate EY", () => {
  it("lands after Gate EX, keeps the owner rejected, and selects Gate EZ", () => {
    const summary = summarizePostV1WallHeavyCoreLinedMassiveTargetedEvidenceGateEY();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_ex_landed_no_runtime_selected_wall_heavy_core_lined_massive_targeted_evidence_acquisition_gate_ey"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts"
    );

    expect(summary).toMatchObject({
      decision: {
        acceptedBoundedWallLiningRules: 0,
        acceptedTargetedEvidenceLedgers: 2,
        decisionId: POST_V1_GATE_EY_EVIDENCE_DECISION_ID,
        ownerRemainsRejected: true,
        runtimeAdmissibleEvidenceLedgers: 0,
        selectedNextAction:
          POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_ACTION,
        selectedNextFile:
          POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_FILE
      },
      landedGate: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_LANDED_GATE,
      noRuntimeCounters: POST_V1_GATE_EY_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_EY_PLAN_DOC_PATH,
      previousGateEX: {
        counters: POST_V1_GATE_EX_NO_RUNTIME_COUNTERS,
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_LANDED_GATE,
        selectedCandidateId: POST_V1_GATE_EX_SELECTED_CANDIDATE_ID,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_EX_SELECTION_STATUS
      },
      selectedNextAction:
        POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_FILE,
      selectedNextLabel:
        POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_EY_TARGET_OUTPUTS
    });
  });

  it("accepts only MWI.2A and B226010 as targeted evidence contexts, not runtime owners", () => {
    const evidence = buildPostV1GateEYTargetedEvidenceLedgers();
    const byId = new Map(evidence.map((row) => [row.id, row]));

    expect(evidence).toHaveLength(POST_V1_GATE_EY_NO_RUNTIME_COUNTERS.targetedEvidenceLedgers);
    expect(evidence.filter((row) => row.acceptedAsTargetedEvidence)).toHaveLength(2);
    expect(evidence.filter((row) => row.runtimeAdmissibleNow)).toHaveLength(0);
    expect(evidence.filter((row) => row.ownerReopenAllowedNow)).toHaveLength(0);
    expect(evidence.filter((row) => row.boundedWallLiningRuleAccepted)).toHaveLength(0);
    expect(evidence.some((row) => row.broadSourceCrawl)).toBe(false);

    expect(byId.get("knauf_mwi2a_lined_concrete_panel_block_rows_context_only")).toMatchObject({
      acceptedAsTargetedEvidence: true,
      acceptedForRuntimeOwner: false,
      decision: "accepted_targeted_context_not_runtime_admissible",
      kind: "wall_specific_lined_concrete_source_context",
      runtimeAdmissibleNow: false
    });
    expect(byId.get("knauf_mwi2a_lined_concrete_panel_block_rows_context_only")?.sourceLocator)
      .toContain("MWI.2A");
    expect(byId.get("knauf_mwi2a_lined_concrete_panel_block_rows_context_only")?.topologyBoundary)
      .toContain("generic gypsum_board 12.5 / rockwool 50 / air_gap 50 / concrete 100");

    expect(byId.get("british_gypsum_b226010_lined_brick_row_context_only")).toMatchObject({
      acceptedAsTargetedEvidence: true,
      acceptedForRuntimeOwner: false,
      decision: "accepted_targeted_context_not_runtime_admissible",
      kind: "wall_specific_lined_brick_source_context",
      runtimeAdmissibleNow: false
    });
    expect(byId.get("british_gypsum_b226010_lined_brick_row_context_only")?.sourceLocator)
      .toContain("B226010");
    expect(byId.get("british_gypsum_b226010_lined_brick_row_context_only")?.topologyBoundary)
      .toContain("103 mm solid brick");
  });

  it("rejects adjacent contexts that would create source/catalog or formula drift", () => {
    const byId = new Map(buildPostV1GateEYTargetedEvidenceLedgers().map((row) => [row.id, row]));

    expect(byId.get("knauf_cc60_floor_rows_rejected_for_wall_truth")).toMatchObject({
      acceptedAsTargetedEvidence: false,
      kind: "floor_only_source_context",
      runtimeAdmissibleNow: false
    });
    expect(byId.get("iso_sharp_davy_formula_context_rejected_as_bounded_wall_lining_rule"))
      .toMatchObject({
        acceptedAsTargetedEvidence: false,
        boundedWallLiningRuleAccepted: false,
        kind: "formula_framework_context"
      });
    expect(byId.get("current_gate_dg_bounded_prediction_rejected_as_calibration_holdout"))
      .toMatchObject({
        acceptedAsTargetedEvidence: false,
        kind: "current_runtime_pin_context",
        runtimeAdmissibilityReason: "A current runtime pin cannot prove its own calibration owner or tolerance."
      });
    expect(byId.get("presets_selector_deep_hybrid_rejected_as_source_truth"))
      .toMatchObject({
        acceptedAsTargetedEvidence: false,
        kind: "selector_preset_stability_context"
      });
  });

  it("keeps the live Gate DG values and exact-source absence frozen", () => {
    const testCase = generatedCase("wall-screening-concrete");
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);

    expect(findVerifiedAirborneAssemblyMatch(lab.layers, testCase.labOptions?.airborneContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatch(field.layers, testCase.fieldOptions?.airborneContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(field.layers, testCase.fieldOptions?.airborneContext))
      .toBeNull();

    expect(resultSnapshot(lab)).toMatchObject({
      c: -1.6,
      ctr: -6.5,
      dynamicFamily: "lined_massive_wall",
      rw: 57,
      rwDb: 57,
      stc: 57,
      supportedTargetOutputs: ["Rw", "STC", "C", "Ctr"],
      unsupportedTargetOutputs: []
    });
    expect(lab.airborneBasis).toMatchObject({
      origin: "bounded_prediction",
      toleranceClass: "bounded_prediction"
    });
    expect(lab.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "bounded_prediction"
    });

    expect(resultSnapshot(field)).toMatchObject({
      c: -1.6,
      ctr: -6.3,
      dnTA: 54.9,
      dnTw: 56,
      dnW: 55,
      dynamicFamily: "lined_massive_wall",
      rw: 55,
      rwPrimeDb: 55,
      stc: 55,
      supportedTargetOutputs: ["R'w", "Dn,w", "DnT,w", "DnT,A"],
      unsupportedTargetOutputs: []
    });
    expect(field.airborneBasis).toMatchObject({
      origin: "family_physics_prediction",
      toleranceClass: "uncalibrated_prediction"
    });
    expect(field.airborneCandidateResolution).toMatchObject({
      runtimeValueMovement: false,
      selectedOrigin: "family_physics_prediction"
    });
  });

  it("ties every evidence item to source locators, metric boundaries, and local evidence paths", () => {
    for (const row of buildPostV1GateEYTargetedEvidenceLedgers()) {
      expect(row.sourceLocator.length, row.id).toBeGreaterThan(20);
      expect(row.metricBasisBoundary.length, row.id).toBeGreaterThan(20);
      expect(row.topologyBoundary.length, row.id).toBeGreaterThan(20);
      expect(row.runtimeAdmissibilityReason.length, row.id).toBeGreaterThan(20);
      expect(row.protectedNegativeBoundaries.length, row.id).toBeGreaterThanOrEqual(2);

      for (const path of row.evidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${row.id}:${path}`).toBe(true);
      }
    }
  });

  it("keeps docs and current-gate runner aligned with Gate EY closeout and Gate EZ selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(
        POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_TARGETED_EVIDENCE_GATE_EY_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain(POST_V1_GATE_EY_EVIDENCE_DECISION_ID);
      expect(contents, path).toContain("Gate EZ");
      expect(normalizedWhitespaceContent, path).toContain("owner remains rejected");
      expect(normalizedWhitespaceContent, path).toContain("MWI.2A");
      expect(normalizedWhitespaceContent, path).toContain("B226010");
      expect(normalizedWhitespaceContent, path).toContain("not a broad source crawl");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 0");
    }

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-ex-contract.test.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-wall-heavy-core-lined-massive-targeted-evidence-acquisition-gate-ey-contract.test.ts"
    );
  });
});
