import type { RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  applySplitPlansToStore,
  assertScenarioSupportSurface,
  buildGeneratedRows,
  customRequestedOutputsForStudyMode,
  createMemoryStorage,
  DEFAULT_FLOOR_REQUESTED_OUTPUTS,
  DEFAULT_WALL_REQUESTED_OUTPUTS,
  evaluateFloorScenario,
  evaluateWallScenario,
  FLOOR_DETOUR_ROWS,
  FLOOR_OUTPUTS,
  ROUTE_MIXED_GENERATED_CASES,
  SELECTED_ROUTE_MIXED_GENERATED_CASES,
  SELECTED_ROUTE_MIXED_GENERATED_CASE_IDS,
  scenarioSnapshot,
  WALL_DETOUR_ROWS,
  WALL_FIELD_OUTPUTS,
  WALL_LAB_OUTPUTS
} from "./mixed-study-mode-generated-test-helpers";
import type { LayerDraft } from "./workbench-store";

type StoreHandle = {
  getState: () => {
    appendRows: (rows: readonly Omit<LayerDraft, "id">[]) => void;
    duplicateRow: (id: string) => void;
    loadSavedScenario: (scenarioId: string) => void;
    requestedOutputs: readonly RequestedOutputId[];
    reset: () => void;
    rows: LayerDraft[];
    saveCurrentScenario: () => void;
    savedScenarios: Array<{ id: string }>;
    setRequestedOutputs: (outputs: RequestedOutputId[]) => void;
    startStudyMode: (studyMode: "floor" | "wall") => void;
    updateThickness: (id: string, thicknessMm: string) => void;
  };
};

function normalizeRows(rows: readonly LayerDraft[]) {
  return rows.map((row) => ({
    floorRole: row.floorRole,
    materialId: row.materialId,
    thicknessMm: row.thicknessMm
  }));
}

function expectSelectedRouteCasesCovered() {
  expect(SELECTED_ROUTE_MIXED_GENERATED_CASES.map((testCase) => testCase.id)).toEqual(
    SELECTED_ROUTE_MIXED_GENERATED_CASE_IDS
  );
}

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

  it("keeps the selected seeded boundary routes aligned across requested-output defaults, resets, and save-load restores", async () => {
    expectSelectedRouteCasesCovered();

    const { useWorkbenchStore } = await import("./workbench-store");
    const store = useWorkbenchStore as unknown as StoreHandle;
    const failures: string[] = [];

    for (const testCase of SELECTED_ROUTE_MIXED_GENERATED_CASES) {
      const selectedRequestedOutputs = customRequestedOutputsForStudyMode(testCase.studyMode);
      const oppositeMode = testCase.studyMode === "floor" ? "wall" : "floor";
      const expectedDefaultOutputs =
        testCase.studyMode === "floor" ? DEFAULT_FLOOR_REQUESTED_OUTPUTS : DEFAULT_WALL_REQUESTED_OUTPUTS;
      const expectedOppositeOutputs =
        oppositeMode === "floor" ? DEFAULT_FLOOR_REQUESTED_OUTPUTS : DEFAULT_WALL_REQUESTED_OUTPUTS;

      store.getState().reset();
      store.getState().startStudyMode(testCase.studyMode);
      expect(store.getState().requestedOutputs).toEqual(expectedDefaultOutputs);
      store.getState().appendRows(testCase.rows);
      applySplitPlansToStore(store, testCase.splitPlans);
      const directRows = normalizeRows(store.getState().rows);
      store.getState().setRequestedOutputs(selectedRequestedOutputs);

      if (JSON.stringify(store.getState().requestedOutputs) !== JSON.stringify(selectedRequestedOutputs)) {
        failures.push(`${testCase.label} should accept the selected requested-output posture before save`);
      }

      const directScenario =
        testCase.studyMode === "floor"
          ? evaluateFloorScenario(`${testCase.id}-selected-direct`, store.getState().rows)
          : evaluateWallScenario(`${testCase.id}-selected-direct`, store.getState().rows);
      const directLabSnapshot = scenarioSnapshot(directScenario.lab, testCase.studyMode);
      const directFieldSnapshot = scenarioSnapshot(directScenario.field, testCase.studyMode);

      store.getState().saveCurrentScenario();
      const savedScenarioId = store.getState().savedScenarios[0]?.id;

      if (!savedScenarioId) {
        failures.push(`${testCase.label} should create a saved scenario before reset`);
        continue;
      }

      store.getState().startStudyMode(oppositeMode);
      if (JSON.stringify(store.getState().requestedOutputs) !== JSON.stringify(expectedOppositeOutputs)) {
        failures.push(`${testCase.label} opposite-mode reset should open the expected default outputs`);
      }
      store.getState().appendRows(oppositeMode === "floor" ? FLOOR_DETOUR_ROWS : WALL_DETOUR_ROWS);

      store.getState().startStudyMode(testCase.studyMode);
      if (JSON.stringify(store.getState().requestedOutputs) !== JSON.stringify(expectedDefaultOutputs)) {
        failures.push(`${testCase.label} returning to ${testCase.studyMode} should reset to the default requested outputs`);
      }

      store.getState().loadSavedScenario(savedScenarioId);

      if (JSON.stringify(store.getState().requestedOutputs) !== JSON.stringify(selectedRequestedOutputs)) {
        failures.push(`${testCase.label} save-load restore should recover the selected requested-output posture`);
      }

      if (JSON.stringify(normalizeRows(store.getState().rows)) !== JSON.stringify(directRows)) {
        failures.push(`${testCase.label} save-load restore should recover the selected route rows`);
      }

      const restoredScenario =
        testCase.studyMode === "floor"
          ? evaluateFloorScenario(`${testCase.id}-selected-restored`, store.getState().rows)
          : evaluateWallScenario(`${testCase.id}-selected-restored`, store.getState().rows);

      if (JSON.stringify(scenarioSnapshot(restoredScenario.lab, testCase.studyMode)) !== JSON.stringify(directLabSnapshot)) {
        failures.push(`${testCase.label} lab save-load restore should match the selected direct snapshot`);
      }

      if (JSON.stringify(scenarioSnapshot(restoredScenario.field, testCase.studyMode)) !== JSON.stringify(directFieldSnapshot)) {
        failures.push(`${testCase.label} field save-load restore should match the selected direct snapshot`);
      }

      assertScenarioSupportSurface({
        failures,
        label: `${testCase.label} selected restore lab`,
        outputs: testCase.studyMode === "floor" ? FLOOR_OUTPUTS : WALL_LAB_OUTPUTS,
        scenario: restoredScenario.lab,
        studyMode: testCase.studyMode
      });
      assertScenarioSupportSurface({
        failures,
        label: `${testCase.label} selected restore field`,
        outputs: testCase.studyMode === "floor" ? FLOOR_OUTPUTS : WALL_FIELD_OUTPUTS,
        scenario: restoredScenario.field,
        studyMode: testCase.studyMode
      });
    }

    expect(failures).toEqual([]);
  }, 30_000);
});
