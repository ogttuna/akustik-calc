import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
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
  WALL_LAB_OUTPUTS,
  type RouteMixedGeneratedCase
} from "./mixed-study-mode-generated-test-helpers";
import type { LayerDraft } from "./workbench-store";

type AppendableRow = Omit<LayerDraft, "id">;

type StoreHandle = {
  getState: () => {
    addRow: () => void;
    appendRows: (rows: readonly AppendableRow[]) => void;
    duplicateRow: (id: string) => void;
    moveRow: (id: string, direction: "up" | "down") => void;
    removeRow: (id: string) => void;
    requestedOutputs: readonly string[];
    reset: () => void;
    rows: LayerDraft[];
    startStudyMode: (studyMode: "floor" | "wall") => void;
    updateFloorRole: (id: string, floorRole?: LayerDraft["floorRole"]) => void;
    updateMaterial: (id: string, materialId: string) => void;
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

function normalizeAppendableRows(rows: readonly AppendableRow[]) {
  return rows.map((row) => ({
    floorRole: row.floorRole,
    materialId: row.materialId,
    thicknessMm: row.thicknessMm
  }));
}

function moveCurrentRowToIndex(store: StoreHandle, rowId: string, targetIndex: number) {
  while (true) {
    const currentIndex = store.getState().rows.findIndex((row) => row.id === rowId);

    expect(currentIndex).toBeGreaterThanOrEqual(0);

    if (currentIndex === targetIndex) {
      return;
    }

    store.getState().moveRow(rowId, currentIndex > targetIndex ? "up" : "down");
  }
}

function rebuildRowAtIndex(store: StoreHandle, row: AppendableRow, targetIndex: number) {
  store.getState().addRow();

  const rebuilt = store.getState().rows.at(-1)!;
  store.getState().updateMaterial(rebuilt.id, row.materialId);
  if (row.floorRole !== undefined) {
    store.getState().updateFloorRole(rebuilt.id, row.floorRole);
  }
  store.getState().updateThickness(rebuilt.id, row.thicknessMm);
  moveCurrentRowToIndex(store, rebuilt.id, targetIndex);
}

function buildDirectFinalRows(testCase: RouteMixedGeneratedCase): AppendableRow[] {
  const current = [...testCase.rows];
  const sorted = [...testCase.splitPlans].sort((left, right) => right.rowIndex - left.rowIndex);

  for (const plan of sorted) {
    const target = current[plan.rowIndex];

    if (!target) {
      throw new Error(`Cannot split missing direct-final row at index ${plan.rowIndex}.`);
    }

    current.splice(
      plan.rowIndex,
      1,
      ...plan.parts.map((thicknessMm) => ({
        ...target,
        thicknessMm
      }))
    );
  }

  return current;
}

function applyEditHistoryToStore(store: StoreHandle, testCase: RouteMixedGeneratedCase) {
  const baselineRows = [...store.getState().rows];
  const sorted = [...testCase.splitPlans].sort((left, right) => right.rowIndex - left.rowIndex);

  for (const [planIndex, plan] of sorted.entries()) {
    const target = baselineRows[plan.rowIndex];

    if (!target) {
      throw new Error(`Cannot split missing route row at index ${plan.rowIndex}.`);
    }

    if (plan.parts.length !== 2) {
      throw new Error(`Expected a 2-part split for ${testCase.id}, got ${plan.parts.length}.`);
    }

    store.getState().duplicateRow(target.id);

    let currentRows = store.getState().rows;
    let targetIndex = currentRows.findIndex((row) => row.id === target.id);

    expect(targetIndex).toBeGreaterThanOrEqual(0);

    let firstId = currentRows[targetIndex]!.id;
    let secondId = currentRows[targetIndex + 1]!.id;

    store.getState().updateThickness(firstId, plan.parts[0]!);
    store.getState().updateThickness(secondId, plan.parts[1]!);

    currentRows = store.getState().rows;
    targetIndex = currentRows.findIndex((row) => row.id === secondId);
    const canMoveDown = targetIndex < currentRows.length - 1;
    const noiseDirection = canMoveDown ? "down" : "up";

    store.getState().moveRow(secondId, noiseDirection);
    store.getState().moveRow(secondId, noiseDirection === "down" ? "up" : "down");

    if (planIndex % 2 === 0) {
      currentRows = store.getState().rows;
      const rebuildIndex = currentRows.findIndex((row) => row.id === firstId);

      expect(rebuildIndex).toBeGreaterThanOrEqual(0);

      store.getState().removeRow(firstId);
      rebuildRowAtIndex(
        store,
        {
          floorRole: target.floorRole,
          materialId: target.materialId,
          thicknessMm: plan.parts[0]!
        },
        rebuildIndex
      );

      firstId = store.getState().rows[rebuildIndex]!.id;
      secondId = store.getState().rows[rebuildIndex + 1]!.id;
      store.getState().updateThickness(firstId, plan.parts[0]!);
      store.getState().updateThickness(secondId, plan.parts[1]!);
    }
  }
}

function evaluateCurrentScenario(store: StoreHandle, id: string, studyMode: "floor" | "wall") {
  return studyMode === "floor"
    ? evaluateFloorScenario(id, store.getState().rows)
    : evaluateWallScenario(id, store.getState().rows);
}

describe("mixed study-mode generated edit-history matrix", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps generated floor and wall final rows stable across duplicate/swap/remove/rebuild history and opposite-mode resets", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");
    const failures: string[] = [];

    for (const testCase of ROUTE_MIXED_GENERATED_CASES) {
      const directFinalRows = buildDirectFinalRows(testCase);
      const directBaselineRows = buildGeneratedRows(testCase);

      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode(testCase.studyMode);
      expect(useWorkbenchStore.getState().requestedOutputs).toEqual(
        testCase.studyMode === "floor" ? DEFAULT_FLOOR_REQUESTED_OUTPUTS : DEFAULT_WALL_REQUESTED_OUTPUTS
      );
      useWorkbenchStore.getState().appendRows(directFinalRows);

      const directScenario = evaluateCurrentScenario(
        useWorkbenchStore as unknown as StoreHandle,
        `${testCase.id}-direct`,
        testCase.studyMode
      );
      const directLabSnapshot = scenarioSnapshot(directScenario.lab, testCase.studyMode);
      const directFieldSnapshot = scenarioSnapshot(directScenario.field, testCase.studyMode);

      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode(testCase.studyMode);
      useWorkbenchStore.getState().appendRows(directBaselineRows.map(({ floorRole, materialId, thicknessMm }) => ({
        floorRole,
        materialId,
        thicknessMm
      })));
      applyEditHistoryToStore(useWorkbenchStore as unknown as StoreHandle, testCase);

      if (
        JSON.stringify(normalizeRows(useWorkbenchStore.getState().rows)) !==
        JSON.stringify(normalizeAppendableRows(directFinalRows))
      ) {
        failures.push(
          `${testCase.label} final rows should match direct split rows after edit-history detour`
        );
      }

      const historyScenario = evaluateCurrentScenario(
        useWorkbenchStore as unknown as StoreHandle,
        `${testCase.id}-history`,
        testCase.studyMode
      );
      const historyLabSnapshot = scenarioSnapshot(historyScenario.lab, testCase.studyMode);
      const historyFieldSnapshot = scenarioSnapshot(historyScenario.field, testCase.studyMode);

      if (JSON.stringify(historyLabSnapshot) !== JSON.stringify(directLabSnapshot)) {
        failures.push(`${testCase.label} lab history detour should match direct final snapshot`);
      }

      if (JSON.stringify(historyFieldSnapshot) !== JSON.stringify(directFieldSnapshot)) {
        failures.push(`${testCase.label} field history detour should match direct final snapshot`);
      }

      assertScenarioSupportSurface({
        failures,
        label: `${testCase.label} lab history detour`,
        outputs: testCase.studyMode === "floor" ? FLOOR_OUTPUTS : WALL_LAB_OUTPUTS,
        scenario: historyScenario.lab,
        studyMode: testCase.studyMode
      });
      assertScenarioSupportSurface({
        failures,
        label: `${testCase.label} field history detour`,
        outputs: testCase.studyMode === "floor" ? FLOOR_OUTPUTS : WALL_FIELD_OUTPUTS,
        scenario: historyScenario.field,
        studyMode: testCase.studyMode
      });

      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode(testCase.studyMode === "floor" ? "wall" : "floor");
      expect(useWorkbenchStore.getState().requestedOutputs).toEqual(
        testCase.studyMode === "floor" ? DEFAULT_WALL_REQUESTED_OUTPUTS : DEFAULT_FLOOR_REQUESTED_OUTPUTS
      );
      useWorkbenchStore.getState().appendRows(testCase.studyMode === "floor" ? WALL_DETOUR_ROWS : FLOOR_DETOUR_ROWS);

      const oppositeScenario = evaluateCurrentScenario(
        useWorkbenchStore as unknown as StoreHandle,
        `${testCase.id}-opposite`,
        testCase.studyMode === "floor" ? "wall" : "floor"
      );

      assertScenarioSupportSurface({
        failures,
        label: `${testCase.label} opposite lab detour`,
        outputs: testCase.studyMode === "floor" ? WALL_LAB_OUTPUTS : FLOOR_OUTPUTS,
        scenario: oppositeScenario.lab,
        studyMode: testCase.studyMode === "floor" ? "wall" : "floor"
      });
      assertScenarioSupportSurface({
        failures,
        label: `${testCase.label} opposite field detour`,
        outputs: testCase.studyMode === "floor" ? WALL_FIELD_OUTPUTS : FLOOR_OUTPUTS,
        scenario: oppositeScenario.field,
        studyMode: testCase.studyMode === "floor" ? "wall" : "floor"
      });

      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode(testCase.studyMode);
      useWorkbenchStore.getState().appendRows(directFinalRows);

      const restoredScenario = evaluateCurrentScenario(
        useWorkbenchStore as unknown as StoreHandle,
        `${testCase.id}-restored`,
        testCase.studyMode
      );

      if (JSON.stringify(scenarioSnapshot(restoredScenario.lab, testCase.studyMode)) !== JSON.stringify(directLabSnapshot)) {
        failures.push(`${testCase.label} lab should restore cleanly after opposite-mode detour`);
      }

      if (JSON.stringify(scenarioSnapshot(restoredScenario.field, testCase.studyMode)) !== JSON.stringify(directFieldSnapshot)) {
        failures.push(`${testCase.label} field should restore cleanly after opposite-mode detour`);
      }
    }

    expect(failures).toEqual([]);
  }, 30_000);
});
