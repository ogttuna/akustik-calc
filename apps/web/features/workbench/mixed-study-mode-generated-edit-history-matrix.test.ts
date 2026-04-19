import type { RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  assertScenarioSupportSurface,
  buildGeneratedRows,
  customRequestedOutputsForStudyMode,
  createMemoryStorage,
  DEFAULT_FLOOR_REQUESTED_OUTPUTS,
  DEFAULT_EDIT_HISTORY_VARIANT,
  DEFAULT_WALL_REQUESTED_OUTPUTS,
  type EditHistoryVariant,
  evaluateFloorScenario,
  evaluateWallScenario,
  FLOOR_DETOUR_ROWS,
  FLOOR_OUTPUTS,
  ROUTE_MIXED_GENERATED_CASES,
  SELECTED_EDIT_HISTORY_VARIANTS,
  SELECTED_ROUTE_MIXED_GENERATED_CASES,
  SELECTED_ROUTE_MIXED_GENERATED_CASE_IDS,
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
    loadSavedScenario: (scenarioId: string) => void;
    moveRow: (id: string, direction: "up" | "down") => void;
    removeRow: (id: string) => void;
    requestedOutputs: readonly RequestedOutputId[];
    reset: () => void;
    rows: LayerDraft[];
    saveCurrentScenario: () => void;
    savedScenarios: Array<{ id: string }>;
    setRequestedOutputs: (outputs: RequestedOutputId[]) => void;
    startStudyMode: (studyMode: "floor" | "wall") => void;
    updateFloorRole: (id: string, floorRole?: LayerDraft["floorRole"]) => void;
    updateMaterial: (id: string, materialId: string) => void;
    updateThickness: (id: string, thicknessMm: string) => void;
  };
};

function expectSelectedRouteCasesCovered() {
  expect(SELECTED_ROUTE_MIXED_GENERATED_CASES.map((testCase) => testCase.id)).toEqual(
    SELECTED_ROUTE_MIXED_GENERATED_CASE_IDS
  );
}

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

function requestedOutputsMatch(
  actual: readonly RequestedOutputId[],
  expected: readonly RequestedOutputId[]
) {
  return JSON.stringify(actual) === JSON.stringify(expected);
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

function normalizeSplitPairOrder(
  store: StoreHandle,
  firstId: string,
  secondId: string,
  reverseParts: boolean
) {
  const currentRows = store.getState().rows;
  const firstIndex = currentRows.findIndex((row) => row.id === firstId);
  const secondIndex = currentRows.findIndex((row) => row.id === secondId);

  expect(firstIndex).toBeGreaterThanOrEqual(0);
  expect(secondIndex).toBeGreaterThanOrEqual(0);

  const pairStart = Math.min(firstIndex, secondIndex);
  const leadingId = reverseParts ? secondId : firstId;
  const trailingId = leadingId === firstId ? secondId : firstId;

  moveCurrentRowToIndex(store, leadingId, pairStart);
  moveCurrentRowToIndex(store, trailingId, pairStart + 1);
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

function applyEditHistoryToStore(
  store: StoreHandle,
  testCase: RouteMixedGeneratedCase,
  variant: EditHistoryVariant = DEFAULT_EDIT_HISTORY_VARIANT
) {
  const baselineRows = [...store.getState().rows];
  const sorted = [...testCase.splitPlans].sort((left, right) =>
    variant.planOrder === "asc" ? left.rowIndex - right.rowIndex : right.rowIndex - left.rowIndex
  );

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
    const firstPart = variant.reverseParts ? plan.parts[1]! : plan.parts[0]!;
    const secondPart = variant.reverseParts ? plan.parts[0]! : plan.parts[1]!;

    store.getState().updateThickness(firstId, firstPart);
    store.getState().updateThickness(secondId, secondPart);

    currentRows = store.getState().rows;
    targetIndex = currentRows.findIndex((row) => row.id === secondId);
    const canMovePreferred =
      variant.noiseDirection === "down" ? targetIndex < currentRows.length - 1 : targetIndex > 0;
    const noiseDirection = canMovePreferred
      ? variant.noiseDirection
      : variant.noiseDirection === "down"
        ? "up"
        : "down";

    store.getState().moveRow(secondId, noiseDirection);
    store.getState().moveRow(secondId, noiseDirection === "down" ? "up" : "down");

    const shouldRebuild =
      variant.rebuildParity === "even" ? planIndex % 2 === 0 : planIndex % 2 === 1;

    if (shouldRebuild) {
      currentRows = store.getState().rows;
      const rebuildIndex = currentRows.findIndex((row) => row.id === firstId);

      expect(rebuildIndex).toBeGreaterThanOrEqual(0);

      store.getState().removeRow(firstId);
      rebuildRowAtIndex(
        store,
        {
          floorRole: target.floorRole,
          materialId: target.materialId,
          thicknessMm: firstPart
        },
        rebuildIndex
      );

      firstId = store.getState().rows[rebuildIndex]!.id;
      secondId = store.getState().rows[rebuildIndex + 1]!.id;
      store.getState().updateThickness(firstId, firstPart);
      store.getState().updateThickness(secondId, secondPart);
    }

    // Keep hostile replay history pressure without letting reversed split rows
    // leak into the final canonical route order.
    normalizeSplitPairOrder(store, firstId, secondId, variant.reverseParts);
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

  it("keeps the selected seeded boundary routes stable across expanded edit-history replay variants and save-load restores", async () => {
    expectSelectedRouteCasesCovered();

    const { useWorkbenchStore } = await import("./workbench-store");
    const failures: string[] = [];

    for (const testCase of SELECTED_ROUTE_MIXED_GENERATED_CASES) {
      const directFinalRows = buildDirectFinalRows(testCase);
      const directBaselineRows = buildGeneratedRows(testCase);
      const selectedRequestedOutputs = customRequestedOutputsForStudyMode(testCase.studyMode);
      const expectedDefaultOutputs =
        testCase.studyMode === "floor" ? DEFAULT_FLOOR_REQUESTED_OUTPUTS : DEFAULT_WALL_REQUESTED_OUTPUTS;
      const oppositeMode = testCase.studyMode === "floor" ? "wall" : "floor";
      const expectedOppositeOutputs =
        oppositeMode === "floor" ? DEFAULT_FLOOR_REQUESTED_OUTPUTS : DEFAULT_WALL_REQUESTED_OUTPUTS;

      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode(testCase.studyMode);
      if (!requestedOutputsMatch(useWorkbenchStore.getState().requestedOutputs, expectedDefaultOutputs)) {
        failures.push(`${testCase.label} should open with the expected default requested outputs`);
      }
      useWorkbenchStore.getState().setRequestedOutputs(selectedRequestedOutputs);
      if (!requestedOutputsMatch(useWorkbenchStore.getState().requestedOutputs, selectedRequestedOutputs)) {
        failures.push(`${testCase.label} should accept the selected custom requested-output bundle`);
      }
      useWorkbenchStore.getState().appendRows(directFinalRows);

      const directScenario = evaluateCurrentScenario(
        useWorkbenchStore as unknown as StoreHandle,
        `${testCase.id}-selected-direct`,
        testCase.studyMode
      );
      const directLabSnapshot = scenarioSnapshot(directScenario.lab, testCase.studyMode);
      const directFieldSnapshot = scenarioSnapshot(directScenario.field, testCase.studyMode);

      for (const variant of SELECTED_EDIT_HISTORY_VARIANTS) {
        useWorkbenchStore.getState().reset();
        useWorkbenchStore.getState().startStudyMode(testCase.studyMode);
        useWorkbenchStore.getState().appendRows(
          directBaselineRows.map(({ floorRole, materialId, thicknessMm }) => ({
            floorRole,
            materialId,
            thicknessMm
          }))
        );
        useWorkbenchStore.getState().setRequestedOutputs(selectedRequestedOutputs);
        applyEditHistoryToStore(useWorkbenchStore as unknown as StoreHandle, testCase, variant);

        if (!requestedOutputsMatch(useWorkbenchStore.getState().requestedOutputs, selectedRequestedOutputs)) {
          failures.push(
            `${testCase.label} ${variant.id} should keep the selected custom requested-output bundle through edit-history replay`
          );
        }

        if (
          JSON.stringify(normalizeRows(useWorkbenchStore.getState().rows)) !==
          JSON.stringify(normalizeAppendableRows(directFinalRows))
        ) {
          failures.push(
            `${testCase.label} ${variant.id} final rows should match direct split rows after edit-history replay`
          );
        }

        const historyScenario = evaluateCurrentScenario(
          useWorkbenchStore as unknown as StoreHandle,
          `${testCase.id}-${variant.id}-selected-history`,
          testCase.studyMode
        );

        if (JSON.stringify(scenarioSnapshot(historyScenario.lab, testCase.studyMode)) !== JSON.stringify(directLabSnapshot)) {
          failures.push(`${testCase.label} ${variant.id} lab history replay should match direct final snapshot`);
        }

        if (JSON.stringify(scenarioSnapshot(historyScenario.field, testCase.studyMode)) !== JSON.stringify(directFieldSnapshot)) {
          failures.push(`${testCase.label} ${variant.id} field history replay should match direct final snapshot`);
        }

        assertScenarioSupportSurface({
          failures,
          label: `${testCase.label} ${variant.id} selected lab history replay`,
          outputs: testCase.studyMode === "floor" ? FLOOR_OUTPUTS : WALL_LAB_OUTPUTS,
          scenario: historyScenario.lab,
          studyMode: testCase.studyMode
        });
        assertScenarioSupportSurface({
          failures,
          label: `${testCase.label} ${variant.id} selected field history replay`,
          outputs: testCase.studyMode === "floor" ? FLOOR_OUTPUTS : WALL_FIELD_OUTPUTS,
          scenario: historyScenario.field,
          studyMode: testCase.studyMode
        });

        useWorkbenchStore.getState().saveCurrentScenario();
        const savedScenarioId = useWorkbenchStore.getState().savedScenarios[0]?.id;

        if (!savedScenarioId) {
          failures.push(`${testCase.label} ${variant.id} should create a saved scenario id`);
          continue;
        }

        useWorkbenchStore.getState().startStudyMode(oppositeMode);
        if (!requestedOutputsMatch(useWorkbenchStore.getState().requestedOutputs, expectedOppositeOutputs)) {
          failures.push(`${testCase.label} ${variant.id} opposite-mode detour should reset to the expected defaults`);
        }
        useWorkbenchStore.getState().appendRows(testCase.studyMode === "floor" ? WALL_DETOUR_ROWS : FLOOR_DETOUR_ROWS);
        useWorkbenchStore.getState().loadSavedScenario(savedScenarioId);

        if (!requestedOutputsMatch(useWorkbenchStore.getState().requestedOutputs, selectedRequestedOutputs)) {
          failures.push(
            `${testCase.label} ${variant.id} save-load restore should recover the selected custom requested-output bundle`
          );
        }

        if (
          JSON.stringify(normalizeRows(useWorkbenchStore.getState().rows)) !==
          JSON.stringify(normalizeAppendableRows(directFinalRows))
        ) {
          failures.push(
            `${testCase.label} ${variant.id} save-load rows should match direct split rows after replay restore`
          );
        }

        const restoredScenario = evaluateCurrentScenario(
          useWorkbenchStore as unknown as StoreHandle,
          `${testCase.id}-${variant.id}-selected-restored`,
          testCase.studyMode
        );

        if (JSON.stringify(scenarioSnapshot(restoredScenario.lab, testCase.studyMode)) !== JSON.stringify(directLabSnapshot)) {
          failures.push(`${testCase.label} ${variant.id} save-load lab replay should match direct final snapshot`);
        }

        if (JSON.stringify(scenarioSnapshot(restoredScenario.field, testCase.studyMode)) !== JSON.stringify(directFieldSnapshot)) {
          failures.push(`${testCase.label} ${variant.id} save-load field replay should match direct final snapshot`);
        }

        assertScenarioSupportSurface({
          failures,
          label: `${testCase.label} ${variant.id} selected save-load lab`,
          outputs: testCase.studyMode === "floor" ? FLOOR_OUTPUTS : WALL_LAB_OUTPUTS,
          scenario: restoredScenario.lab,
          studyMode: testCase.studyMode
        });
        assertScenarioSupportSurface({
          failures,
          label: `${testCase.label} ${variant.id} selected save-load field`,
          outputs: testCase.studyMode === "floor" ? FLOOR_OUTPUTS : WALL_FIELD_OUTPUTS,
          scenario: restoredScenario.field,
          studyMode: testCase.studyMode
        });
      }
    }

    expect(failures).toEqual([]);
  }, 30_000);
});
