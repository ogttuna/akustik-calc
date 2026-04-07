import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  applySplitPlansToStore,
  assertScenarioSupportSurface,
  buildGeneratedRows,
  createMemoryStorage,
  DEFAULT_FLOOR_REQUESTED_OUTPUTS,
  DEFAULT_WALL_REQUESTED_OUTPUTS,
  evaluateFloorScenario,
  evaluateWallScenario,
  FLOOR_DETOUR_ROWS,
  FLOOR_OUTPUTS,
  ROUTE_MIXED_GENERATED_CASES,
  scenarioSnapshot,
  WALL_DETOUR_ROWS,
  WALL_FIELD_OUTPUTS,
  WALL_LAB_OUTPUTS
} from "./mixed-study-mode-generated-test-helpers";

describe("mixed study-mode generated matrix", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps generated floor and wall split-detours stable across mixed study-mode resets", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");
    const failures: string[] = [];

    for (const testCase of ROUTE_MIXED_GENERATED_CASES) {
      const baselineRows = buildGeneratedRows(testCase);
      const baseline =
        testCase.studyMode === "floor"
          ? evaluateFloorScenario(`${testCase.id}-baseline`, baselineRows)
          : evaluateWallScenario(`${testCase.id}-baseline`, baselineRows);
      const baselineLabSnapshot = scenarioSnapshot(baseline.lab, testCase.studyMode);
      const baselineFieldSnapshot = scenarioSnapshot(baseline.field, testCase.studyMode);

      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode(testCase.studyMode);
      expect(useWorkbenchStore.getState().requestedOutputs).toEqual(
        testCase.studyMode === "floor" ? DEFAULT_FLOOR_REQUESTED_OUTPUTS : DEFAULT_WALL_REQUESTED_OUTPUTS
      );
      useWorkbenchStore.getState().appendRows(testCase.rows);
      applySplitPlansToStore(useWorkbenchStore, testCase.splitPlans);

      const detourRows = useWorkbenchStore.getState().rows;
      const detour =
        testCase.studyMode === "floor"
          ? evaluateFloorScenario(`${testCase.id}-detour`, detourRows)
          : evaluateWallScenario(`${testCase.id}-detour`, detourRows);
      const detourLabSnapshot = scenarioSnapshot(detour.lab, testCase.studyMode);
      const detourFieldSnapshot = scenarioSnapshot(detour.field, testCase.studyMode);

      if (JSON.stringify(detourLabSnapshot) !== JSON.stringify(baselineLabSnapshot)) {
        failures.push(
          `${testCase.label} lab detour: expected ${JSON.stringify(baselineLabSnapshot)}, got ${JSON.stringify(detourLabSnapshot)}`
        );
      }

      if (JSON.stringify(detourFieldSnapshot) !== JSON.stringify(baselineFieldSnapshot)) {
        failures.push(
          `${testCase.label} field detour: expected ${JSON.stringify(baselineFieldSnapshot)}, got ${JSON.stringify(detourFieldSnapshot)}`
        );
      }

      assertScenarioSupportSurface({
        failures,
        label: `${testCase.label} lab detour`,
        outputs: testCase.studyMode === "floor" ? FLOOR_OUTPUTS : WALL_LAB_OUTPUTS,
        scenario: detour.lab,
        studyMode: testCase.studyMode
      });
      assertScenarioSupportSurface({
        failures,
        label: `${testCase.label} field detour`,
        outputs: testCase.studyMode === "floor" ? FLOOR_OUTPUTS : WALL_FIELD_OUTPUTS,
        scenario: detour.field,
        studyMode: testCase.studyMode
      });

      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode(testCase.studyMode === "floor" ? "wall" : "floor");
      useWorkbenchStore.getState().appendRows(testCase.studyMode === "floor" ? WALL_DETOUR_ROWS : FLOOR_DETOUR_ROWS);

      const oppositeDetour =
        testCase.studyMode === "floor"
          ? evaluateWallScenario(`${testCase.id}-wall-detour`, useWorkbenchStore.getState().rows)
          : evaluateFloorScenario(`${testCase.id}-floor-detour`, useWorkbenchStore.getState().rows);

      assertScenarioSupportSurface({
        failures,
        label: `${testCase.label} opposite lab detour`,
        outputs: testCase.studyMode === "floor" ? WALL_LAB_OUTPUTS : FLOOR_OUTPUTS,
        scenario: oppositeDetour.lab,
        studyMode: testCase.studyMode === "floor" ? "wall" : "floor"
      });
      assertScenarioSupportSurface({
        failures,
        label: `${testCase.label} opposite field detour`,
        outputs: testCase.studyMode === "floor" ? WALL_FIELD_OUTPUTS : FLOOR_OUTPUTS,
        scenario: oppositeDetour.field,
        studyMode: testCase.studyMode === "floor" ? "wall" : "floor"
      });

      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode(testCase.studyMode);
      useWorkbenchStore.getState().appendRows(testCase.rows);

      const restored =
        testCase.studyMode === "floor"
          ? evaluateFloorScenario(`${testCase.id}-restored`, useWorkbenchStore.getState().rows)
          : evaluateWallScenario(`${testCase.id}-restored`, useWorkbenchStore.getState().rows);

      if (JSON.stringify(scenarioSnapshot(restored.lab, testCase.studyMode)) !== JSON.stringify(baselineLabSnapshot)) {
        failures.push(`${testCase.label} lab should restore cleanly after opposite-mode detour`);
      }

      if (JSON.stringify(scenarioSnapshot(restored.field, testCase.studyMode)) !== JSON.stringify(baselineFieldSnapshot)) {
        failures.push(`${testCase.label} field should restore cleanly after opposite-mode detour`);
      }
    }

    expect(failures).toEqual([]);
  }, 30_000);
});
