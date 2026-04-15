import type { RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
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

type HistoryVariant = {
  id: string;
  planOrder: "asc" | "desc";
  rebuildPiece: "leading" | "trailing";
  reverseParts: boolean;
};

const HISTORY_VARIANTS: readonly HistoryVariant[] = [
  {
    id: "ascending-reversed-leading-rebuild",
    planOrder: "asc",
    rebuildPiece: "leading",
    reverseParts: true
  },
  {
    id: "ascending-direct-trailing-rebuild",
    planOrder: "asc",
    rebuildPiece: "trailing",
    reverseParts: false
  },
  {
    id: "descending-reversed-leading-rebuild",
    planOrder: "desc",
    rebuildPiece: "leading",
    reverseParts: true
  },
  {
    id: "descending-direct-trailing-rebuild",
    planOrder: "desc",
    rebuildPiece: "trailing",
    reverseParts: false
  }
];

const SELECTED_DUPLICATE_SWAP_HISTORY_VARIANTS: readonly HistoryVariant[] = [
  {
    id: "ascending-direct-leading-rebuild",
    planOrder: "asc",
    rebuildPiece: "leading",
    reverseParts: false
  },
  {
    id: "ascending-reversed-leading-rebuild",
    planOrder: "asc",
    rebuildPiece: "leading",
    reverseParts: true
  },
  {
    id: "ascending-direct-trailing-rebuild",
    planOrder: "asc",
    rebuildPiece: "trailing",
    reverseParts: false
  },
  {
    id: "ascending-reversed-trailing-rebuild",
    planOrder: "asc",
    rebuildPiece: "trailing",
    reverseParts: true
  },
  {
    id: "descending-direct-leading-rebuild",
    planOrder: "desc",
    rebuildPiece: "leading",
    reverseParts: false
  },
  {
    id: "descending-reversed-leading-rebuild",
    planOrder: "desc",
    rebuildPiece: "leading",
    reverseParts: true
  },
  {
    id: "descending-direct-trailing-rebuild",
    planOrder: "desc",
    rebuildPiece: "trailing",
    reverseParts: false
  },
  {
    id: "descending-reversed-trailing-rebuild",
    planOrder: "desc",
    rebuildPiece: "trailing",
    reverseParts: true
  }
];

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

function formatThicknessMm(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace(/\.0$/u, "");
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

function bounceRow(store: StoreHandle, rowId: string) {
  const rows = store.getState().rows;
  const currentIndex = rows.findIndex((row) => row.id === rowId);

  expect(currentIndex).toBeGreaterThanOrEqual(0);

  const targetIndex =
    currentIndex <= rows.length - 3
      ? currentIndex + 2
      : currentIndex >= 2
        ? currentIndex - 2
        : currentIndex === 0 && rows.length > 1
          ? 1
          : currentIndex > 0
            ? currentIndex - 1
            : currentIndex;

  if (targetIndex === currentIndex) {
    return;
  }

  moveCurrentRowToIndex(store, rowId, targetIndex);
  moveCurrentRowToIndex(store, rowId, currentIndex);
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

function applyPartialSplitToStore(store: StoreHandle, testCase: RouteMixedGeneratedCase, variant: HistoryVariant) {
  const baselineRows = [...store.getState().rows];
  const targetPlan =
    variant.planOrder === "asc"
      ? [...testCase.splitPlans].sort((left, right) => left.rowIndex - right.rowIndex)[0]
      : [...testCase.splitPlans].sort((left, right) => right.rowIndex - left.rowIndex)[0];

  if (!targetPlan) {
    throw new Error(`Expected at least one split plan for ${testCase.id}.`);
  }

  const target = baselineRows[targetPlan.rowIndex];

  if (!target) {
    throw new Error(`Cannot partially split missing route row at index ${targetPlan.rowIndex}.`);
  }

  if (targetPlan.parts.length !== 2) {
    throw new Error(`Expected a 2-part split for ${testCase.id}, got ${targetPlan.parts.length}.`);
  }

  store.getState().duplicateRow(target.id);

  const currentRows = store.getState().rows;
  const targetIndex = currentRows.findIndex((row) => row.id === target.id);

  expect(targetIndex).toBeGreaterThanOrEqual(0);

  const originalId = currentRows[targetIndex]!.id;
  const duplicateId = currentRows[targetIndex + 1]!.id;

  if (variant.reverseParts) {
    store.getState().updateThickness(originalId, targetPlan.parts[1]!);
    store.getState().updateThickness(duplicateId, targetPlan.parts[0]!);
    moveCurrentRowToIndex(store, duplicateId, targetIndex);
  } else {
    store.getState().updateThickness(originalId, targetPlan.parts[0]!);
    store.getState().updateThickness(duplicateId, targetPlan.parts[1]!);
  }

  bounceRow(store, variant.rebuildPiece === "leading" ? duplicateId : originalId);
}

function applyHistoryVariantToStore(store: StoreHandle, testCase: RouteMixedGeneratedCase, variant: HistoryVariant) {
  const baselineRows = [...store.getState().rows];
  const sorted = [...testCase.splitPlans].sort((left, right) =>
    variant.planOrder === "asc" ? left.rowIndex - right.rowIndex : right.rowIndex - left.rowIndex
  );

  for (const plan of sorted) {
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

    const originalId = currentRows[targetIndex]!.id;
    const duplicateId = currentRows[targetIndex + 1]!.id;

    if (variant.reverseParts) {
      store.getState().updateThickness(originalId, plan.parts[1]!);
      store.getState().updateThickness(duplicateId, plan.parts[0]!);
      moveCurrentRowToIndex(store, duplicateId, targetIndex);
    } else {
      store.getState().updateThickness(originalId, plan.parts[0]!);
      store.getState().updateThickness(duplicateId, plan.parts[1]!);
    }

    currentRows = store.getState().rows;
    targetIndex = currentRows.findIndex((row) => row.id === originalId || row.id === duplicateId);

    const leadingId = currentRows[targetIndex]!.thicknessMm === plan.parts[0]! ? currentRows[targetIndex]!.id : currentRows[targetIndex + 1]!.id;
    const trailingId = leadingId === originalId ? duplicateId : originalId;

    bounceRow(store, variant.rebuildPiece === "leading" ? trailingId : leadingId);

    const rebuildId = variant.rebuildPiece === "leading" ? leadingId : trailingId;
    const rebuildIndex = store.getState().rows.findIndex((row) => row.id === rebuildId);

    expect(rebuildIndex).toBeGreaterThanOrEqual(0);

    store.getState().removeRow(rebuildId);
    rebuildRowAtIndex(
      store,
      {
        floorRole: target.floorRole,
        materialId: target.materialId,
        thicknessMm: variant.rebuildPiece === "leading" ? plan.parts[0]! : plan.parts[1]!
      },
      rebuildIndex
    );
  }
}

function applyOppositeModeNoiseChain(
  store: StoreHandle,
  studyMode: "floor" | "wall",
  failures: string[],
  label: string
) {
  const rows = store.getState().rows;
  const target = rows[1] ?? rows[0];

  expect(target).toBeTruthy();

  store.getState().duplicateRow(target!.id);

  let currentRows = store.getState().rows;
  const targetIndex = currentRows.findIndex((row) => row.id === target!.id);

  expect(targetIndex).toBeGreaterThanOrEqual(0);

  const originalId = currentRows[targetIndex]!.id;
  const duplicateId = currentRows[targetIndex + 1]!.id;
  const originalThickness = Number.parseFloat(currentRows[targetIndex]!.thicknessMm);
  const firstPart = Number.isFinite(originalThickness) ? formatThicknessMm(Math.max(1, originalThickness * 0.4)) : currentRows[targetIndex]!.thicknessMm;
  const secondPart =
    Number.isFinite(originalThickness)
      ? formatThicknessMm(Math.max(1, originalThickness - Number.parseFloat(firstPart)))
      : currentRows[targetIndex]!.thicknessMm;

  store.getState().updateThickness(originalId, firstPart);
  store.getState().updateThickness(duplicateId, secondPart);
  bounceRow(store, duplicateId);

  const appendTemplate = rows.at(-1) ?? target;

  store.getState().addRow();
  const appended = store.getState().rows.at(-1)!;
  store.getState().updateMaterial(appended.id, appendTemplate!.materialId);
  if (appendTemplate!.floorRole !== undefined) {
    store.getState().updateFloorRole(appended.id, appendTemplate!.floorRole);
  }
  store.getState().updateThickness(appended.id, appendTemplate!.thicknessMm);
  moveCurrentRowToIndex(store, appended.id, Math.min(2, store.getState().rows.length - 1));
  store.getState().removeRow(appended.id);

  currentRows = store.getState().rows;
  const removable = currentRows.find((row) => row.id !== originalId && row.id !== duplicateId && row.id !== target!.id);
  if (removable && currentRows.length > 3) {
    const removableIndex = currentRows.findIndex((row) => row.id === removable.id);
    store.getState().removeRow(removable.id);
    rebuildRowAtIndex(
      store,
      {
        floorRole: removable.floorRole,
        materialId: removable.materialId,
        thicknessMm: removable.thicknessMm
      },
      removableIndex
    );
  }

  const oppositeScenario = evaluateCurrentScenario(store, `${studyMode}-noise-chain`, studyMode);
  assertScenarioSupportSurface({
    failures,
    label: `${label} opposite noise chain lab`,
    outputs: studyMode === "floor" ? FLOOR_OUTPUTS : WALL_LAB_OUTPUTS,
    scenario: oppositeScenario.lab,
    studyMode
  });
  assertScenarioSupportSurface({
    failures,
    label: `${label} opposite noise chain field`,
    outputs: studyMode === "floor" ? FLOOR_OUTPUTS : WALL_FIELD_OUTPUTS,
    scenario: oppositeScenario.field,
    studyMode
  });
}

function evaluateCurrentScenario(store: StoreHandle, id: string, studyMode: "floor" | "wall") {
  return studyMode === "floor"
    ? evaluateFloorScenario(id, store.getState().rows)
    : evaluateWallScenario(id, store.getState().rows);
}

describe("mixed study-mode generated history grid", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps generated floor and wall final rows stable across a wider duplicate/swap/rebuild history grid", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");
    const failures: string[] = [];

    for (const testCase of ROUTE_MIXED_GENERATED_CASES) {
      const directFinalRows = buildDirectFinalRows(testCase);

      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode(testCase.studyMode);
      useWorkbenchStore.getState().appendRows(directFinalRows);

      const directScenario = evaluateCurrentScenario(
        useWorkbenchStore as unknown as StoreHandle,
        `${testCase.id}-grid-direct`,
        testCase.studyMode
      );
      const directLabSnapshot = scenarioSnapshot(directScenario.lab, testCase.studyMode);
      const directFieldSnapshot = scenarioSnapshot(directScenario.field, testCase.studyMode);

      for (const variant of HISTORY_VARIANTS) {
        useWorkbenchStore.getState().reset();
        useWorkbenchStore.getState().startStudyMode(testCase.studyMode);
        useWorkbenchStore.getState().appendRows(
          buildGeneratedRows(testCase).map(({ floorRole, materialId, thicknessMm }) => ({
            floorRole,
            materialId,
            thicknessMm
          }))
        );
        applyHistoryVariantToStore(useWorkbenchStore as unknown as StoreHandle, testCase, variant);

        if (
          JSON.stringify(normalizeRows(useWorkbenchStore.getState().rows)) !==
          JSON.stringify(normalizeAppendableRows(directFinalRows))
        ) {
          failures.push(`${testCase.label} ${variant.id} final rows should match direct split rows`);
        }

        const variantScenario = evaluateCurrentScenario(
          useWorkbenchStore as unknown as StoreHandle,
          `${testCase.id}-${variant.id}`,
          testCase.studyMode
        );

        if (JSON.stringify(scenarioSnapshot(variantScenario.lab, testCase.studyMode)) !== JSON.stringify(directLabSnapshot)) {
          failures.push(`${testCase.label} ${variant.id} lab snapshot should match direct final snapshot`);
        }

        if (JSON.stringify(scenarioSnapshot(variantScenario.field, testCase.studyMode)) !== JSON.stringify(directFieldSnapshot)) {
          failures.push(`${testCase.label} ${variant.id} field snapshot should match direct final snapshot`);
        }

        assertScenarioSupportSurface({
          failures,
          label: `${testCase.label} ${variant.id} lab`,
          outputs: testCase.studyMode === "floor" ? FLOOR_OUTPUTS : WALL_LAB_OUTPUTS,
          scenario: variantScenario.lab,
          studyMode: testCase.studyMode
        });
        assertScenarioSupportSurface({
          failures,
          label: `${testCase.label} ${variant.id} field`,
          outputs: testCase.studyMode === "floor" ? FLOOR_OUTPUTS : WALL_FIELD_OUTPUTS,
          scenario: variantScenario.field,
          studyMode: testCase.studyMode
        });
      }
    }

    expect(failures).toEqual([]);
  }, 30_000);

  it("restores generated floor and wall final snapshots cleanly after longer cross-mode partial-edit chains", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");
    const failures: string[] = [];

    for (const testCase of ROUTE_MIXED_GENERATED_CASES) {
      const directFinalRows = buildDirectFinalRows(testCase);

      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode(testCase.studyMode);
      useWorkbenchStore.getState().appendRows(directFinalRows);

      const directScenario = evaluateCurrentScenario(
        useWorkbenchStore as unknown as StoreHandle,
        `${testCase.id}-long-chain-direct`,
        testCase.studyMode
      );
      const directLabSnapshot = scenarioSnapshot(directScenario.lab, testCase.studyMode);
      const directFieldSnapshot = scenarioSnapshot(directScenario.field, testCase.studyMode);

      for (const variant of HISTORY_VARIANTS) {
        useWorkbenchStore.getState().reset();
        useWorkbenchStore.getState().startStudyMode(testCase.studyMode);
        useWorkbenchStore.getState().appendRows(
          buildGeneratedRows(testCase).map(({ floorRole, materialId, thicknessMm }) => ({
            floorRole,
            materialId,
            thicknessMm
          }))
        );
        applyPartialSplitToStore(useWorkbenchStore as unknown as StoreHandle, testCase, variant);

        const partialScenario = evaluateCurrentScenario(
          useWorkbenchStore as unknown as StoreHandle,
          `${testCase.id}-${variant.id}-partial`,
          testCase.studyMode
        );
        assertScenarioSupportSurface({
          failures,
          label: `${testCase.label} ${variant.id} partial lab`,
          outputs: testCase.studyMode === "floor" ? FLOOR_OUTPUTS : WALL_LAB_OUTPUTS,
          scenario: partialScenario.lab,
          studyMode: testCase.studyMode
        });
        assertScenarioSupportSurface({
          failures,
          label: `${testCase.label} ${variant.id} partial field`,
          outputs: testCase.studyMode === "floor" ? FLOOR_OUTPUTS : WALL_FIELD_OUTPUTS,
          scenario: partialScenario.field,
          studyMode: testCase.studyMode
        });

        const oppositeMode = testCase.studyMode === "floor" ? "wall" : "floor";
        useWorkbenchStore.getState().startStudyMode(oppositeMode);
        useWorkbenchStore.getState().appendRows(oppositeMode === "floor" ? FLOOR_DETOUR_ROWS : WALL_DETOUR_ROWS);
        applyOppositeModeNoiseChain(
          useWorkbenchStore as unknown as StoreHandle,
          oppositeMode,
          failures,
          `${testCase.label} ${variant.id}`
        );

        useWorkbenchStore.getState().startStudyMode(testCase.studyMode);
        useWorkbenchStore.getState().appendRows(
          buildGeneratedRows(testCase).map(({ floorRole, materialId, thicknessMm }) => ({
            floorRole,
            materialId,
            thicknessMm
          }))
        );
        applyHistoryVariantToStore(useWorkbenchStore as unknown as StoreHandle, testCase, variant);

        if (
          JSON.stringify(normalizeRows(useWorkbenchStore.getState().rows)) !==
          JSON.stringify(normalizeAppendableRows(directFinalRows))
        ) {
          failures.push(`${testCase.label} ${variant.id} restored rows should match direct split rows after long chain`);
        }

        const restoredScenario = evaluateCurrentScenario(
          useWorkbenchStore as unknown as StoreHandle,
          `${testCase.id}-${variant.id}-restored`,
          testCase.studyMode
        );

        if (JSON.stringify(scenarioSnapshot(restoredScenario.lab, testCase.studyMode)) !== JSON.stringify(directLabSnapshot)) {
          failures.push(`${testCase.label} ${variant.id} restored lab snapshot should match direct final snapshot`);
        }

        if (JSON.stringify(scenarioSnapshot(restoredScenario.field, testCase.studyMode)) !== JSON.stringify(directFieldSnapshot)) {
          failures.push(`${testCase.label} ${variant.id} restored field snapshot should match direct final snapshot`);
        }
      }
    }

    expect(failures).toEqual([]);
  }, 30_000);

  it("preserves the selected seeded boundary routes through expanded duplicate/swap save-load roundtrips after long cross-mode chains", async () => {
    expectSelectedRouteCasesCovered();

    const { useWorkbenchStore } = await import("./workbench-store");
    const failures: string[] = [];

    for (const testCase of SELECTED_ROUTE_MIXED_GENERATED_CASES) {
      const directFinalRows = buildDirectFinalRows(testCase);
      const selectedRequestedOutputs = customRequestedOutputsForStudyMode(testCase.studyMode);
      const expectedDefaultOutputs =
        testCase.studyMode === "floor" ? DEFAULT_FLOOR_REQUESTED_OUTPUTS : DEFAULT_WALL_REQUESTED_OUTPUTS;

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
        `${testCase.id}-save-load-direct`,
        testCase.studyMode
      );
      const directLabSnapshot = scenarioSnapshot(directScenario.lab, testCase.studyMode);
      const directFieldSnapshot = scenarioSnapshot(directScenario.field, testCase.studyMode);

      for (const variant of SELECTED_DUPLICATE_SWAP_HISTORY_VARIANTS) {
        useWorkbenchStore.getState().reset();
        useWorkbenchStore.getState().startStudyMode(testCase.studyMode);
        useWorkbenchStore.getState().appendRows(
          buildGeneratedRows(testCase).map(({ floorRole, materialId, thicknessMm }) => ({
            floorRole,
            materialId,
            thicknessMm
          }))
        );
        useWorkbenchStore.getState().setRequestedOutputs(selectedRequestedOutputs);
        applyPartialSplitToStore(useWorkbenchStore as unknown as StoreHandle, testCase, variant);

        const oppositeMode = testCase.studyMode === "floor" ? "wall" : "floor";
        useWorkbenchStore.getState().startStudyMode(oppositeMode);
        useWorkbenchStore.getState().appendRows(oppositeMode === "floor" ? FLOOR_DETOUR_ROWS : WALL_DETOUR_ROWS);
        applyOppositeModeNoiseChain(
          useWorkbenchStore as unknown as StoreHandle,
          oppositeMode,
          failures,
          `${testCase.label} ${variant.id} save-load`
        );

        useWorkbenchStore.getState().startStudyMode(testCase.studyMode);
        useWorkbenchStore.getState().appendRows(
          buildGeneratedRows(testCase).map(({ floorRole, materialId, thicknessMm }) => ({
            floorRole,
            materialId,
            thicknessMm
          }))
        );
        useWorkbenchStore.getState().setRequestedOutputs(selectedRequestedOutputs);
        applyHistoryVariantToStore(useWorkbenchStore as unknown as StoreHandle, testCase, variant);

        if (!requestedOutputsMatch(useWorkbenchStore.getState().requestedOutputs, selectedRequestedOutputs)) {
          failures.push(
            `${testCase.label} ${variant.id} should keep the selected custom requested-output bundle through the long replay chain`
          );
        }

        useWorkbenchStore.getState().saveCurrentScenario();
        const savedScenarioId = useWorkbenchStore.getState().savedScenarios[0]?.id;

        if (!savedScenarioId) {
          failures.push(`${testCase.label} ${variant.id} should create a saved scenario id`);
          continue;
        }

        useWorkbenchStore.getState().startStudyMode(oppositeMode);
        useWorkbenchStore.getState().appendRows(oppositeMode === "floor" ? FLOOR_DETOUR_ROWS : WALL_DETOUR_ROWS);
        useWorkbenchStore.getState().loadSavedScenario(savedScenarioId);

        if (!requestedOutputsMatch(useWorkbenchStore.getState().requestedOutputs, selectedRequestedOutputs)) {
          failures.push(
            `${testCase.label} ${variant.id} save-load should restore the selected custom requested-output bundle after the long replay chain`
          );
        }

        if (
          JSON.stringify(normalizeRows(useWorkbenchStore.getState().rows)) !==
          JSON.stringify(normalizeAppendableRows(directFinalRows))
        ) {
          failures.push(`${testCase.label} ${variant.id} save-load rows should match direct split rows after reload`);
        }

        const restoredScenario = evaluateCurrentScenario(
          useWorkbenchStore as unknown as StoreHandle,
          `${testCase.id}-${variant.id}-save-load-restored`,
          testCase.studyMode
        );

        if (JSON.stringify(scenarioSnapshot(restoredScenario.lab, testCase.studyMode)) !== JSON.stringify(directLabSnapshot)) {
          failures.push(`${testCase.label} ${variant.id} save-load lab snapshot should match direct final snapshot`);
        }

        if (JSON.stringify(scenarioSnapshot(restoredScenario.field, testCase.studyMode)) !== JSON.stringify(directFieldSnapshot)) {
          failures.push(`${testCase.label} ${variant.id} save-load field snapshot should match direct final snapshot`);
        }

        assertScenarioSupportSurface({
          failures,
          label: `${testCase.label} ${variant.id} save-load lab`,
          outputs: testCase.studyMode === "floor" ? FLOOR_OUTPUTS : WALL_LAB_OUTPUTS,
          scenario: restoredScenario.lab,
          studyMode: testCase.studyMode
        });
        assertScenarioSupportSurface({
          failures,
          label: `${testCase.label} ${variant.id} save-load field`,
          outputs: testCase.studyMode === "floor" ? FLOOR_OUTPUTS : WALL_FIELD_OUTPUTS,
          scenario: restoredScenario.field,
          studyMode: testCase.studyMode
        });
      }
    }

    expect(failures).toEqual([]);
  }, 30_000);
});
