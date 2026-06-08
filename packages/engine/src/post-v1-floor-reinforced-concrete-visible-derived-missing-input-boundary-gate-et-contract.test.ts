import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  POST_V1_GATE_ES_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_ES_SELECTED_CANDIDATE_ID,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_LANDED_GATE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-es";
import {
  POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_LANDED_GATE,
  POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_ACTION,
  POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_FILE,
  POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_LABEL,
  POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTION_STATUS,
  POST_V1_GATE_ET_BOUNDARY_ASSERTIONS,
  POST_V1_GATE_ET_BOUNDARY_ID,
  POST_V1_GATE_ET_COUNTERS,
  POST_V1_GATE_ET_PLAN_DOC_PATH,
  POST_V1_GATE_ET_TARGET_OUTPUTS,
  buildPostV1GateETBoundaryEvidence,
  summarizePostV1FloorReinforcedConcreteVisibleDerivedMissingInputBoundaryGateET
} from "./post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et";

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
  POST_V1_GATE_ET_PLAN_DOC_PATH
] as const;

function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

describe("post-V1 floor reinforced-concrete visible-derived missing-input boundary Gate ET", () => {
  it("lands after Gate ES, pins the visible-derived boundary, and selects Gate EU", () => {
    const summary = summarizePostV1FloorReinforcedConcreteVisibleDerivedMissingInputBoundaryGateET();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_es_landed_no_runtime_selected_floor_reinforced_concrete_visible_derived_missing_input_boundary_gate_et"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_ACTION).toBe(
      POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts"
    );

    expect(summary).toMatchObject({
      boundaryId: POST_V1_GATE_ET_BOUNDARY_ID,
      counters: POST_V1_GATE_ET_COUNTERS,
      landedGate: POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_LANDED_GATE,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_ET_PLAN_DOC_PATH,
      previousGateES: {
        counters: POST_V1_GATE_ES_NO_RUNTIME_COUNTERS,
        landedGate: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_LANDED_GATE,
        selectedCandidateId: POST_V1_GATE_ES_SELECTED_CANDIDATE_ID,
        selectedNextAction: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_ACTION,
        selectedNextFile: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTED_NEXT_FILE,
        selectionStatus: POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_ES_SELECTION_STATUS
      },
      selectedNextAction:
        POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_ACTION,
      selectedNextFile:
        POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_FILE,
      selectedNextLabel:
        POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_LABEL,
      selectionStatus:
        POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTION_STATUS
    });
  });

  it("narrows only the visible-derived missing-input boundary", () => {
    const evidence = buildPostV1GateETBoundaryEvidence();

    expect(evidence).toMatchObject({
      boundaryId: POST_V1_GATE_ET_BOUNDARY_ID,
      explicitPartialStillRequiresCeilingOrLowerAssembly: true,
      targetOutputs: POST_V1_GATE_ET_TARGET_OUTPUTS,
      visibleDerivedOrigin: "needs_input",
      visibleLowerAssemblyDerivedFromLayerRoles: true
    });
    expect(evidence.visibleDerivedMissingPhysicalInputs).toEqual(
      POST_V1_GATE_ET_BOUNDARY_ASSERTIONS.visibleDerivedExpectedMissingPhysicalInputs
    );
    expect(evidence.visibleDerivedMissingPhysicalInputs).not.toContain("ceilingOrLowerAssembly");
    expect(evidence.visibleDerivedSupportedOutputs).toEqual(
      POST_V1_GATE_ET_BOUNDARY_ASSERTIONS.visibleDerivedExpectedSupportedOutputs
    );
    expect(evidence.visibleDerivedUnsupportedOutputs).toEqual(
      POST_V1_GATE_ET_BOUNDARY_ASSERTIONS.visibleDerivedExpectedUnsupportedOutputs
    );

    expect(evidence.explicitPartialMissingPhysicalInputs).toEqual(
      POST_V1_GATE_ET_BOUNDARY_ASSERTIONS.explicitPartialExpectedMissingPhysicalInputs
    );
    expect(evidence.explicitPartialMissingPhysicalInputs).toContain("ceilingOrLowerAssembly");
  });

  it("does not move formula values, source rows, shared schemas, or runtime scope", () => {
    const evidence = buildPostV1GateETBoundaryEvidence();

    expect(evidence.completeFormulaBasisId).toBe(
      POST_V1_GATE_ET_BOUNDARY_ASSERTIONS.completeFormulaExpectedBasisId
    );
    expect(evidence.completeFormulaValuePins).toEqual(
      POST_V1_GATE_ET_BOUNDARY_ASSERTIONS.completeFormulaExpectedValuePins
    );
    expect(POST_V1_GATE_ET_COUNTERS).toMatchObject({
      frontendImplementationFilesTouched: 1,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      runtimeBasisPromotions: 0,
      runtimeFormulaRetunes: 0,
      runtimeValuesMoved: 0,
      sourceRowsImported: 0
    });
  });

  it("keeps docs and current-gate runner aligned with Gate ET closeout and Gate EU selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      expect(existsSync(join(REPO_ROOT, path)), path).toBe(true);
      const contents = readRepoFile(path);
      const normalizedWhitespaceContent = contents.replace(/\s+/g, " ");

      expect(contents, path).toContain(
        POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTION_STATUS
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_ACTION
      );
      expect(contents, path).toContain(
        POST_V1_FLOOR_REINFORCED_CONCRETE_VISIBLE_DERIVED_MISSING_INPUT_BOUNDARY_GATE_ET_SELECTED_NEXT_FILE
      );
      expect(contents, path).toContain(POST_V1_GATE_ET_BOUNDARY_ID);
      expect(contents, path).toContain("Gate EU");
      expect(normalizedWhitespaceContent, path).toContain(
        "reinforced-concrete visible-derived missing-input boundary"
      );
      expect(contents, path).toContain("currentGateFailuresCleared 6");
      expect(contents, path).toContain("runtimeValuesMoved 0");
      expect(contents, path).toContain("sourceRowsImported: 0");
      expect(contents, path).toContain("frontendImplementationFilesTouched: 1");
    }

    const plan = readRepoFile(POST_V1_GATE_ET_PLAN_DOC_PATH);
    expect(plan).toContain("Gate ET Landed");
    expect(plan).toContain("Gate EU");
    expect(plan).toContain("currentGateFailuresCleared 6");
    expect(plan).toContain("runtimeValuesMoved 0");

    const currentGateRunner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(currentGateRunner).toContain("src/post-v1-next-numeric-coverage-gap-gate-es-contract.test.ts");
    expect(currentGateRunner).toContain(
      "src/post-v1-floor-reinforced-concrete-visible-derived-missing-input-boundary-gate-et-contract.test.ts"
    );
  });
});
