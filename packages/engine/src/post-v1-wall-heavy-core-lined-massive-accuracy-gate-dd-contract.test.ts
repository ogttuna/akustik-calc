import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { EXACT_FLOOR_SYSTEMS } from "@dynecho/catalogs";
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
  POST_V1_GATE_DD_EVIDENCE_BOUNDARIES,
  POST_V1_GATE_DD_LIVE_ROUTE_PINS,
  POST_V1_GATE_DD_NO_RUNTIME_COUNTERS,
  POST_V1_GATE_DD_PLAN_DOC_PATH,
  POST_V1_GATE_DD_SELECTED_CANDIDATE_ID,
  POST_V1_GATE_DD_TARGET_OUTPUTS,
  POST_V1_GATE_DD_UNLOCK_REQUIREMENTS,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_LANDED_GATE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_ACTION,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_FILE,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_LABEL,
  POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTION_STATUS,
  summarizePostV1WallHeavyCoreLinedMassiveAccuracyGateDD
} from "./post-v1-wall-heavy-core-lined-massive-accuracy-gate-dd";
import {
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_ACTION,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_FILE,
  POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTION_STATUS
} from "./post-v1-next-numeric-coverage-gap-gate-dc";

const REPO_ROOT = fileURLToPath(new URL("../../..", import.meta.url));

const CURRENT_SELECTION_DOCS = [
  "AGENTS.md",
  "docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md",
  "docs/calculator/CURRENT_STATE.md",
  "docs/calculator/NEXT_IMPLEMENTATION_PLAN.md",
  "docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md",
  "docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md"
] as const;

const KNAUF_CONCRETE_FLOOR_ROW_IDS = [
  "knauf_cc60_1a_concrete150_timber_acoustic_underlay_lab_2026",
  "knauf_cc60_1a_concrete150_carpet_lab_2026",
  "knauf_cc60_1b_concrete200_tile_acoustic_underlay_lab_2026"
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

describe("post-V1 wall heavy-core / lined-massive accuracy Gate DD", () => {
  it("lands after Gate DC and selects the next numeric coverage rerank without moving runtime values", () => {
    const summary = summarizePostV1WallHeavyCoreLinedMassiveAccuracyGateDD();

    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTION_STATUS).toBe(
      "post_v1_next_numeric_coverage_gap_gate_dc_landed_no_runtime_selected_wall_heavy_core_lined_massive_accuracy_gate_dd"
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_ACTION).toBe(
      POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_LANDED_GATE
    );
    expect(POST_V1_NEXT_NUMERIC_COVERAGE_GAP_GATE_DC_SELECTED_NEXT_FILE).toBe(
      "packages/engine/src/post-v1-wall-heavy-core-lined-massive-accuracy-gate-dd-contract.test.ts"
    );
    expect(summary).toMatchObject({
      evidenceBoundaries: POST_V1_GATE_DD_EVIDENCE_BOUNDARIES,
      landedGate: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_LANDED_GATE,
      liveRoutePins: POST_V1_GATE_DD_LIVE_ROUTE_PINS,
      noRuntimeCounters: POST_V1_GATE_DD_NO_RUNTIME_COUNTERS,
      noRuntimeValueMovement: true,
      planDocPath: POST_V1_GATE_DD_PLAN_DOC_PATH,
      selectedCandidateId: POST_V1_GATE_DD_SELECTED_CANDIDATE_ID,
      selectedNextAction: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_ACTION,
      selectedNextFile: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_FILE,
      selectedNextLabel: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_LABEL,
      selectionStatus: POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTION_STATUS,
      targetOutputs: POST_V1_GATE_DD_TARGET_OUTPUTS,
      unlockRequirements: POST_V1_GATE_DD_UNLOCK_REQUIREMENTS
    });
  });

  it("pins the current heavy-core / lined-massive lab and field route as source-absent screening behavior", () => {
    const testCase = generatedCase(POST_V1_GATE_DD_LIVE_ROUTE_PINS.generatedCaseId);
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const labSnapshot = resultSnapshot(lab);
    const fieldSnapshot = resultSnapshot(field);

    expect(testCase.studyMode).toBe("wall");
    expect(lab.calculatorId).toBe("dynamic");
    expect(field.calculatorId).toBe("dynamic");
    expect(labSnapshot.supportedTargetOutputs).toEqual(["Rw", "STC", "C", "Ctr"]);
    expect(fieldSnapshot.supportedTargetOutputs).toEqual(["R'w", "Dn,w", "DnT,w", "DnT,A"]);
    expect(fieldSnapshot.unsupportedTargetOutputs).toEqual([]);

    expect(lab.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: POST_V1_GATE_DD_LIVE_ROUTE_PINS.dynamicFamily,
      selectedMethod: POST_V1_GATE_DD_LIVE_ROUTE_PINS.selectedMethod,
      strategy: POST_V1_GATE_DD_LIVE_ROUTE_PINS.routeStrategy
    });
    expect(field.dynamicAirborneTrace).toMatchObject({
      confidenceClass: "medium",
      detectedFamily: POST_V1_GATE_DD_LIVE_ROUTE_PINS.dynamicFamily,
      selectedMethod: POST_V1_GATE_DD_LIVE_ROUTE_PINS.selectedMethod,
      strategy: POST_V1_GATE_DD_LIVE_ROUTE_PINS.routeStrategy
    });

    expect(labSnapshot).toMatchObject({
      c: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.C,
      ctr: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.Ctr,
      dynamicFamily: POST_V1_GATE_DD_LIVE_ROUTE_PINS.dynamicFamily,
      rw: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.Rw,
      rwDb: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.Rw,
      stc: POST_V1_GATE_DD_LIVE_ROUTE_PINS.labPins.STC
    });
    expect(fieldSnapshot).toMatchObject({
      c: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.C,
      ctr: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.Ctr,
      dnTA: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.DnTADb,
      dnTw: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.DnTwDb,
      dnW: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.DnWDb,
      dynamicFamily: POST_V1_GATE_DD_LIVE_ROUTE_PINS.dynamicFamily,
      rw: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.RwPrimeDb,
      rwDb: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.RwPrimeDb,
      rwPrimeDb: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.RwPrimeDb,
      stc: POST_V1_GATE_DD_LIVE_ROUTE_PINS.fieldPins.STC
    });
  });

  it("proves no exact wall source or floor-system row can promote the live stack", () => {
    const testCase = generatedCase(POST_V1_GATE_DD_LIVE_ROUTE_PINS.generatedCaseId);
    const lab = calculateAssembly(testCase.rows, testCase.labOptions);
    const field = calculateAssembly(testCase.rows, testCase.fieldOptions);
    const concreteFloorRows = EXACT_FLOOR_SYSTEMS.filter((system) =>
      KNAUF_CONCRETE_FLOOR_ROW_IDS.includes(system.id as (typeof KNAUF_CONCRETE_FLOOR_ROW_IDS)[number])
    );

    expect(findVerifiedAirborneAssemblyMatch(lab.layers, testCase.labOptions?.airborneContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatch(field.layers, testCase.fieldOptions?.airborneContext)).toBeNull();
    expect(findVerifiedAirborneAssemblyMatchWithLabFallback(field.layers, testCase.fieldOptions?.airborneContext))
      .toBeNull();

    expect(field.floorSystemMatch).toBeNull();
    expect(field.floorSystemEstimate).toBeNull();
    expect(field.boundFloorSystemMatch).toBeNull();
    expect(field.boundFloorSystemEstimate).toBeNull();

    expect(concreteFloorRows.map((row) => row.id)).toEqual([...KNAUF_CONCRETE_FLOOR_ROW_IDS]);
    expect(concreteFloorRows.map((row) => row.airborneRatings.Rw)).toEqual([63, 63, 69]);
    expect(concreteFloorRows.map((row) => row.impactRatings.LnW)).toEqual([51, 31, 45]);
    expect(POST_V1_GATE_DD_EVIDENCE_BOUNDARIES.find((boundary) => boundary.id === "knauf_cc60_concrete_floor_rows"))
      .toMatchObject({
        runtimeMovementAllowedNow: false,
        reasonRuntimeCannotMove: [
          "the Knauf CC60 rows are floor-system source truth with floor covering and ceiling roles",
          "their floor airborne and impact ratings do not define a wall-lining Rw tolerance",
          "floor ceiling mounting roles do not match wall lining topology"
        ]
      });
  });

  it("keeps all adjacent evidence boundaries closed until a wall source row or bounded lining rule exists", () => {
    expect(POST_V1_GATE_DD_EVIDENCE_BOUNDARIES).toHaveLength(
      POST_V1_GATE_DD_NO_RUNTIME_COUNTERS.evidenceBoundariesPinned
    );
    expect(POST_V1_GATE_DD_EVIDENCE_BOUNDARIES.every((boundary) => boundary.runtimeMovementAllowedNow === false))
      .toBe(true);
    expect(POST_V1_GATE_DD_EVIDENCE_BOUNDARIES.map((boundary) => boundary.id)).toEqual([
      "current_source_absent_lined_massive_route",
      "verified_airborne_catalog_exact_or_lab_fallback",
      "knauf_cc60_concrete_floor_rows",
      "manufacturer_lining_adjacent_context",
      "selector_pins_and_deep_hybrid_heavy_core_guards",
      "workbench_concrete_wall_preset",
      "iso_sharp_davy_formula_context",
      "closed_wall_heavy_core_gate_b_audit"
    ]);
    expect(POST_V1_GATE_DD_UNLOCK_REQUIREMENTS).toEqual([
      "wall_specific_same_stack_source_row_with_route_topology_metric_basis_and_locator",
      "or_named_bounded_lined_massive_wall_rule_with_coefficient_scope_tolerance_and_negative_boundaries",
      "paired_lab_field_building_basis_tests_before_any_Rw_RPrime_Dn_or_DnT_value_moves",
      "floor_rows_presets_selector_pins_and_deep_hybrid_guards_remain_non_promotable"
    ]);
    expect(POST_V1_GATE_DD_NO_RUNTIME_COUNTERS).toEqual({
      boundedLiningRulesPromoted: 0,
      directSourceRowsPromoted: 0,
      evidenceBoundariesPinned: 8,
      frontendImplementationFilesTouched: 0,
      newCalculableLayerTemplates: 0,
      newCalculableRequestShapes: 0,
      protectedRuntimePins: 8,
      runtimeValuesMoved: 0,
      selectedNextRuntimeValuesMoved: 0
    });
  });

  it("keeps docs and current-gate runner aligned with Gate DD closeout and Gate DE selection", () => {
    for (const path of CURRENT_SELECTION_DOCS) {
      const contents = readRepoFile(path);

      expect(contents, path).toContain(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_LANDED_GATE);
      expect(contents, path).toContain(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTION_STATUS);
      expect(contents, path).toContain(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_ACTION);
      expect(contents, path).toContain(POST_V1_WALL_HEAVY_CORE_LINED_MASSIVE_ACCURACY_GATE_DD_SELECTED_NEXT_FILE);
      expect(contents, path).toContain(POST_V1_GATE_DD_SELECTED_CANDIDATE_ID);
    }

    for (const boundary of POST_V1_GATE_DD_EVIDENCE_BOUNDARIES) {
      for (const path of boundary.evidencePaths) {
        expect(existsSync(join(REPO_ROOT, path)), `${boundary.id} ${path}`).toBe(true);
      }
    }

    const runner = readRepoFile("tools/dev/run-calculator-current-gate.ts");
    expect(runner).toContain("src/post-v1-wall-heavy-core-lined-massive-accuracy-gate-dd-contract.test.ts");
  });
});
