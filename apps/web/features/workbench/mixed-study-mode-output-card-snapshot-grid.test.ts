import type { RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  applySplitPlansToStore,
  buildGeneratedRows,
  createMemoryStorage,
  evaluateFloorScenario,
  evaluateWallScenario,
  FLOOR_DETOUR_ROWS,
  FLOOR_OUTPUTS,
  ROUTE_MIXED_GENERATED_CASES,
  WALL_DETOUR_ROWS,
  WALL_FIELD_OUTPUTS,
  WALL_LAB_OUTPUTS,
  type RouteMixedGeneratedCase,
} from "./mixed-study-mode-generated-test-helpers";
import { buildOutputCard } from "./simple-workbench-output-model";
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
    reset: () => void;
    rows: LayerDraft[];
    saveCurrentScenario: () => void;
    savedScenarios: Array<{ id: string }>;
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

type EvaluatedScenario = ReturnType<typeof evaluateFloorScenario>["lab"];

type OutputCardProjectionSnapshot = {
  cards: Record<string, { status: string; value: string }>;
  supportedTargetOutputs: readonly RequestedOutputId[] | null;
  unsupportedTargetOutputs: readonly RequestedOutputId[] | null;
  floorSystemMatchId: string | null;
  boundFloorSystemMatchId: string | null;
  floorSystemEstimateKind: string | null;
  boundFloorSystemEstimateKind: string | null;
  warnings: readonly string[];
};

type ScenarioOutputCardSnapshots = {
  lab: OutputCardProjectionSnapshot;
  field: OutputCardProjectionSnapshot;
};

const REQUIRED_CARD_GRID_CASE_IDS = [
  "route-tuas-c11c-fail-closed",
  "route-dataholz-gdmtxa04a-boundary",
  "route-open-box-exact",
  "route-open-web-200-exact",
  "route-open-web-400-exact",
  "route-open-web-bound",
  "route-wall-held-aac",
] as const;

// The wider history-grid test covers all four path variants; this projection
// guard uses one representative noisy path so card regressions stay cheap.
const CARD_HISTORY_VARIANT: HistoryVariant = {
  id: "ascending-reversed-leading-rebuild",
  planOrder: "asc",
  rebuildPiece: "leading",
  reverseParts: true,
};

function normalizeRows(rows: readonly LayerDraft[]): AppendableRow[] {
  return rows.map(({ floorRole, materialId, thicknessMm }) => ({
    floorRole,
    materialId,
    thicknessMm,
  }));
}

function normalizeAppendableRows(rows: readonly AppendableRow[]): AppendableRow[] {
  return rows.map(({ floorRole, materialId, thicknessMm }) => ({
    floorRole,
    materialId,
    thicknessMm,
  }));
}

function formatThicknessMm(value: number): string {
  const rounded = Math.round(value * 10) / 10;

  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace(/\.0$/u, "");
}

function moveCurrentRowToIndex(store: StoreHandle, rowId: string, targetIndex: number): void {
  while (true) {
    const currentIndex = store.getState().rows.findIndex((row) => row.id === rowId);

    expect(currentIndex).toBeGreaterThanOrEqual(0);

    if (currentIndex === targetIndex) {
      return;
    }

    store.getState().moveRow(rowId, currentIndex > targetIndex ? "up" : "down");
  }
}

function rebuildRowAtIndex(store: StoreHandle, row: AppendableRow, targetIndex: number): void {
  store.getState().addRow();

  const rebuilt = store.getState().rows.at(-1)!;
  store.getState().updateMaterial(rebuilt.id, row.materialId);
  if (row.floorRole !== undefined) {
    store.getState().updateFloorRole(rebuilt.id, row.floorRole);
  }
  store.getState().updateThickness(rebuilt.id, row.thicknessMm);
  moveCurrentRowToIndex(store, rebuilt.id, targetIndex);
}

function bounceRow(store: StoreHandle, rowId: string): void {
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

function generatedAppendableRows(testCase: RouteMixedGeneratedCase): AppendableRow[] {
  return normalizeRows(buildGeneratedRows(testCase));
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
        thicknessMm,
      })),
    );
  }

  return current;
}

function applyPartialSplitToStore(store: StoreHandle, testCase: RouteMixedGeneratedCase): void {
  const baselineRows = [...store.getState().rows];
  const targetPlan =
    CARD_HISTORY_VARIANT.planOrder === "asc"
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

  if (CARD_HISTORY_VARIANT.reverseParts) {
    store.getState().updateThickness(originalId, targetPlan.parts[1]!);
    store.getState().updateThickness(duplicateId, targetPlan.parts[0]!);
    moveCurrentRowToIndex(store, duplicateId, targetIndex);
  } else {
    store.getState().updateThickness(originalId, targetPlan.parts[0]!);
    store.getState().updateThickness(duplicateId, targetPlan.parts[1]!);
  }

  bounceRow(store, CARD_HISTORY_VARIANT.rebuildPiece === "leading" ? duplicateId : originalId);
}

function applyHistoryVariantToStore(store: StoreHandle, testCase: RouteMixedGeneratedCase): void {
  const orderedPlans =
    CARD_HISTORY_VARIANT.planOrder === "asc"
      ? [...testCase.splitPlans].sort((left, right) => left.rowIndex - right.rowIndex)
      : [...testCase.splitPlans].sort((left, right) => right.rowIndex - left.rowIndex);
  const baselineRows = [...store.getState().rows];

  for (const plan of orderedPlans) {
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

    if (CARD_HISTORY_VARIANT.reverseParts) {
      store.getState().updateThickness(originalId, plan.parts[1]!);
      store.getState().updateThickness(duplicateId, plan.parts[0]!);
      moveCurrentRowToIndex(store, duplicateId, targetIndex);
    } else {
      store.getState().updateThickness(originalId, plan.parts[0]!);
      store.getState().updateThickness(duplicateId, plan.parts[1]!);
    }

    currentRows = store.getState().rows;
    targetIndex = currentRows.findIndex((row) => row.id === originalId || row.id === duplicateId);

    const leadingId =
      currentRows[targetIndex]!.thicknessMm === plan.parts[0]!
        ? currentRows[targetIndex]!.id
        : currentRows[targetIndex + 1]!.id;
    const trailingId = leadingId === originalId ? duplicateId : originalId;

    bounceRow(store, CARD_HISTORY_VARIANT.rebuildPiece === "leading" ? trailingId : leadingId);

    const rebuildId = CARD_HISTORY_VARIANT.rebuildPiece === "leading" ? leadingId : trailingId;
    const rebuildIndex = store.getState().rows.findIndex((row) => row.id === rebuildId);

    expect(rebuildIndex).toBeGreaterThanOrEqual(0);

    store.getState().removeRow(rebuildId);
    rebuildRowAtIndex(
      store,
      {
        floorRole: target.floorRole,
        materialId: target.materialId,
        thicknessMm: CARD_HISTORY_VARIANT.rebuildPiece === "leading" ? plan.parts[0]! : plan.parts[1]!,
      },
      rebuildIndex,
    );
  }
}

function runOppositeModeNoiseChain(
  store: StoreHandle,
  testCase: RouteMixedGeneratedCase,
): ScenarioOutputCardSnapshots {
  const oppositeMode = testCase.studyMode === "floor" ? "wall" : "floor";
  const detourRows = oppositeMode === "floor" ? FLOOR_DETOUR_ROWS : WALL_DETOUR_ROWS;

  store.getState().startStudyMode(oppositeMode);
  store.getState().appendRows(detourRows);

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
  const firstPart = Number.isFinite(originalThickness)
    ? formatThicknessMm(Math.max(1, originalThickness * 0.4))
    : currentRows[targetIndex]!.thicknessMm;
  const secondPart = Number.isFinite(originalThickness)
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
  const removable = currentRows.find(
    (row) => row.id !== originalId && row.id !== duplicateId && row.id !== target!.id,
  );

  if (removable && currentRows.length > 3) {
    const removableIndex = currentRows.findIndex((row) => row.id === removable.id);

    store.getState().removeRow(removable.id);
    rebuildRowAtIndex(
      store,
      {
        floorRole: removable.floorRole,
        materialId: removable.materialId,
        thicknessMm: removable.thicknessMm,
      },
      removableIndex,
    );
  }

  return cardSnapshotsForStore(store, `${testCase.id}:opposite-mode-detour`, oppositeMode);
}

function evaluateCurrentScenario(store: StoreHandle, id: string, studyMode: "floor" | "wall") {
  const rows = store.getState().rows;

  if (studyMode === "floor") {
    return evaluateFloorScenario(`${id}:current`, rows);
  }

  return evaluateWallScenario(`${id}:current`, rows);
}

function outputCardSnapshot(
  scenario: EvaluatedScenario,
  outputs: readonly RequestedOutputId[],
  studyMode: "floor" | "wall",
): OutputCardProjectionSnapshot {
  const result = scenario.result;

  if (!result) {
    throw new Error(`Cannot project output cards for failed scenario ${scenario.id}`);
  }

  return {
    boundFloorSystemEstimateKind: result.boundFloorSystemEstimate?.kind ?? null,
    boundFloorSystemMatchId: result.boundFloorSystemMatchId ?? null,
    cards: Object.fromEntries(
      outputs.map((output) => {
        const card = buildOutputCard({ output, result, studyMode });

        return [
          output,
          {
            status: card.status,
            value: card.value,
          },
        ];
      }),
    ),
    floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
    floorSystemMatchId: result.floorSystemMatchId ?? null,
    supportedTargetOutputs: result.supportedTargetOutputs ?? null,
    unsupportedTargetOutputs: result.unsupportedTargetOutputs ?? null,
    warnings: result.warnings,
  };
}

function scenarioOutputCardSnapshots(
  scenario: ReturnType<typeof evaluateCurrentScenario>,
  studyMode: "floor" | "wall",
): ScenarioOutputCardSnapshots {
  return {
    field: outputCardSnapshot(
      scenario.field,
      studyMode === "floor" ? FLOOR_OUTPUTS : WALL_FIELD_OUTPUTS,
      studyMode,
    ),
    lab: outputCardSnapshot(
      scenario.lab,
      studyMode === "floor" ? FLOOR_OUTPUTS : WALL_LAB_OUTPUTS,
      studyMode,
    ),
  };
}

function cardSnapshotsForAppendableRows(
  store: StoreHandle,
  id: string,
  rows: readonly AppendableRow[],
  studyMode: "floor" | "wall",
): ScenarioOutputCardSnapshots {
  store.getState().reset();
  store.getState().startStudyMode(studyMode);
  store.getState().appendRows(rows);

  return cardSnapshotsForStore(store, `${id}:direct`, studyMode);
}

function cardSnapshotsForStore(
  store: StoreHandle,
  id: string,
  studyMode: "floor" | "wall",
): ScenarioOutputCardSnapshots {
  return scenarioOutputCardSnapshots(evaluateCurrentScenario(store, id, studyMode), studyMode);
}

function appendGeneratedRows(store: StoreHandle, testCase: RouteMixedGeneratedCase): void {
  store.getState().appendRows(generatedAppendableRows(testCase));
}

function appendDirectRows(store: StoreHandle, testCase: RouteMixedGeneratedCase): void {
  store.getState().appendRows(testCase.rows);
}

function expectRequiredCasesCovered(): void {
  const caseIds = new Set(ROUTE_MIXED_GENERATED_CASES.map((testCase) => testCase.id));

  for (const id of REQUIRED_CARD_GRID_CASE_IDS) {
    expect(caseIds.has(id), `${id} must remain in the output-card snapshot grid`).toBe(true);
  }
}

function assertProjectionEqual(
  failures: string[],
  label: string,
  actual: ScenarioOutputCardSnapshots,
  expected: ScenarioOutputCardSnapshots,
): void {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    return;
  }

  failures.push(
    `${label}\nexpected=${JSON.stringify(expected, null, 2)}\nactual=${JSON.stringify(
      actual,
      null,
      2,
    )}`,
  );
}

function assertRowsEqual(
  failures: string[],
  label: string,
  actual: readonly LayerDraft[],
  expected: readonly AppendableRow[],
): void {
  const normalizedActual = normalizeRows(actual);
  const normalizedExpected = normalizeAppendableRows(expected);

  if (JSON.stringify(normalizedActual) === JSON.stringify(normalizedExpected)) {
    return;
  }

  failures.push(
    `${label}\nexpectedRows=${JSON.stringify(
      normalizedExpected,
      null,
      2,
    )}\nactualRows=${JSON.stringify(normalizedActual, null, 2)}`,
  );
}

describe("mixed study-mode output-card snapshot grid", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps output cards stable across direct split detours and noisy edit-history replay", async () => {
    expectRequiredCasesCovered();

    const { useWorkbenchStore } = await import("./workbench-store");
    const store = useWorkbenchStore as StoreHandle;
    const failures: string[] = [];

    for (const testCase of ROUTE_MIXED_GENERATED_CASES) {
      const directFinalRows = buildDirectFinalRows(testCase);
      const expected = cardSnapshotsForAppendableRows(
        store,
        `${testCase.id}:expected-final`,
        directFinalRows,
        testCase.studyMode,
      );

      store.getState().reset();
      store.getState().startStudyMode(testCase.studyMode);
      appendDirectRows(store, testCase);
      applySplitPlansToStore(store, testCase.splitPlans);
      assertRowsEqual(
        failures,
        `${testCase.id}:direct-split-detour:rows`,
        store.getState().rows,
        directFinalRows,
      );
      assertProjectionEqual(
        failures,
        `${testCase.id}:direct-split-detour:cards`,
        cardSnapshotsForStore(store, `${testCase.id}:direct-split-detour`, testCase.studyMode),
        expected,
      );

      store.getState().reset();
      store.getState().startStudyMode(testCase.studyMode);
      appendGeneratedRows(store, testCase);
      applyHistoryVariantToStore(store, testCase);
      assertRowsEqual(
        failures,
        `${testCase.id}:${CARD_HISTORY_VARIANT.id}:rows`,
        store.getState().rows,
        directFinalRows,
      );
      assertProjectionEqual(
        failures,
        `${testCase.id}:${CARD_HISTORY_VARIANT.id}:cards`,
        cardSnapshotsForStore(store, `${testCase.id}:${CARD_HISTORY_VARIANT.id}`, testCase.studyMode),
        expected,
      );
    }

    expect(failures, failures.join("\n\n")).toEqual([]);
  });

  it("keeps output cards stable after partial-edit restore and save-load roundtrips", async () => {
    expectRequiredCasesCovered();

    const { useWorkbenchStore } = await import("./workbench-store");
    const store = useWorkbenchStore as StoreHandle;
    const failures: string[] = [];

    for (const testCase of ROUTE_MIXED_GENERATED_CASES) {
      const directFinalRows = buildDirectFinalRows(testCase);
      const expected = cardSnapshotsForAppendableRows(
        store,
        `${testCase.id}:expected-final`,
        directFinalRows,
        testCase.studyMode,
      );

      store.getState().reset();
      store.getState().startStudyMode(testCase.studyMode);
      appendGeneratedRows(store, testCase);
      applyPartialSplitToStore(store, testCase);
      runOppositeModeNoiseChain(store, testCase);
      store.getState().startStudyMode(testCase.studyMode);
      appendGeneratedRows(store, testCase);
      applyHistoryVariantToStore(store, testCase);
      assertRowsEqual(
        failures,
        `${testCase.id}:partial-restore:${CARD_HISTORY_VARIANT.id}:rows`,
        store.getState().rows,
        directFinalRows,
      );
      assertProjectionEqual(
        failures,
        `${testCase.id}:partial-restore:${CARD_HISTORY_VARIANT.id}:cards`,
        cardSnapshotsForStore(
          store,
          `${testCase.id}:partial-restore:${CARD_HISTORY_VARIANT.id}`,
          testCase.studyMode,
        ),
        expected,
      );

      store.getState().reset();
      store.getState().startStudyMode(testCase.studyMode);
      appendGeneratedRows(store, testCase);
      applyPartialSplitToStore(store, testCase);
      runOppositeModeNoiseChain(store, testCase);
      store.getState().startStudyMode(testCase.studyMode);
      appendGeneratedRows(store, testCase);
      applyHistoryVariantToStore(store, testCase);
      store.getState().saveCurrentScenario();

      const savedScenario = store.getState().savedScenarios[0];

      if (!savedScenario) {
        failures.push(`${testCase.id}:save-load missing saved scenario`);
        continue;
      }

      runOppositeModeNoiseChain(store, testCase);
      store.getState().loadSavedScenario(savedScenario.id);
      assertRowsEqual(
        failures,
        `${testCase.id}:save-load:${CARD_HISTORY_VARIANT.id}:rows`,
        store.getState().rows,
        directFinalRows,
      );
      assertProjectionEqual(
        failures,
        `${testCase.id}:save-load:${CARD_HISTORY_VARIANT.id}:cards`,
        cardSnapshotsForStore(
          store,
          `${testCase.id}:save-load:${CARD_HISTORY_VARIANT.id}`,
          testCase.studyMode,
        ),
        expected,
      );
    }

    expect(failures, failures.join("\n\n")).toEqual([]);
  });
});
