import type { RequestedOutputId } from "@dynecho/shared";
import { expect } from "vitest";

import {
  buildGeneratedRows,
  type EditHistoryVariant,
  evaluateFloorScenario,
  evaluateWallScenario,
  FLOOR_DETOUR_ROWS,
  FLOOR_OUTPUTS,
  type GeneratedHistoryVariant as HistoryVariant,
  ROUTE_MIXED_GENERATED_CASES,
  SELECTED_ROUTE_MIXED_GENERATED_CASES,
  SELECTED_ROUTE_MIXED_GENERATED_CASE_IDS,
  WALL_DETOUR_ROWS,
  WALL_FIELD_OUTPUTS,
  WALL_LAB_OUTPUTS,
  type RouteMixedGeneratedCase,
} from "./mixed-study-mode-generated-test-helpers";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

export type AppendableRow = Omit<LayerDraft, "id">;

export type StoreHandle = {
  getState: () => {
    addRow: () => void;
    appendRows: (rows: readonly AppendableRow[]) => void;
    duplicateRow: (id: string) => void;
    loadSavedScenario: (scenarioId: string) => void;
    moveRow: (id: string, direction: "up" | "down") => void;
    removeRow: (id: string) => void;
    reset: () => void;
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

export type EvaluatedScenario = ReturnType<typeof evaluateFloorScenario>["lab"];

export type OutputCardProjectionSnapshot = {
  cards: Record<string, { status: string; value: string }>;
  supportedTargetOutputs: readonly RequestedOutputId[] | null;
  unsupportedTargetOutputs: readonly RequestedOutputId[] | null;
  floorSystemMatchId: string | null;
  boundFloorSystemMatchId: string | null;
  floorSystemEstimateKind: string | null;
  boundFloorSystemEstimateKind: string | null;
  warnings: readonly string[];
};

export type ScenarioOutputCardSnapshots = {
  lab: OutputCardProjectionSnapshot;
  field: OutputCardProjectionSnapshot;
};

export const REQUIRED_CARD_GRID_CASE_IDS = [
  "route-tuas-c11c-fail-closed",
  "route-dataholz-gdmtxa04a-boundary",
  "route-open-box-exact",
  "route-open-web-200-exact",
  "route-open-web-400-exact",
  "route-open-web-bound",
  "route-wall-held-aac",
  "route-wall-heavy-composite-hint-suppression",
] as const;

export const CARD_HISTORY_VARIANTS: readonly HistoryVariant[] = [
  {
    id: "ascending-direct-leading-rebuild",
    planOrder: "asc",
    rebuildPiece: "leading",
    reverseParts: false,
  },
  {
    id: "ascending-reversed-trailing-rebuild",
    planOrder: "asc",
    rebuildPiece: "trailing",
    reverseParts: true,
  },
  {
    id: "descending-direct-trailing-rebuild",
    planOrder: "desc",
    rebuildPiece: "trailing",
    reverseParts: false,
  },
  {
    id: "descending-reversed-leading-rebuild",
    planOrder: "desc",
    rebuildPiece: "leading",
    reverseParts: true,
  },
];

export function expectSelectedCardGridCasesCovered(): void {
  expect(SELECTED_ROUTE_MIXED_GENERATED_CASES.map((testCase) => testCase.id)).toEqual(
    SELECTED_ROUTE_MIXED_GENERATED_CASE_IDS,
  );
}

export function normalizeRows(rows: readonly LayerDraft[]): AppendableRow[] {
  return rows.map(({ floorRole, materialId, thicknessMm }) => ({
    floorRole,
    materialId,
    thicknessMm,
  }));
}

export function normalizeAppendableRows(rows: readonly AppendableRow[]): AppendableRow[] {
  return rows.map(({ floorRole, materialId, thicknessMm }) => ({
    floorRole,
    materialId,
    thicknessMm,
  }));
}

export function requestedOutputsMatch(
  actual: readonly RequestedOutputId[],
  expected: readonly RequestedOutputId[],
): boolean {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

export function formatThicknessMm(value: number): string {
  const rounded = Math.round(value * 10) / 10;

  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace(/\.0$/u, "");
}

export function moveCurrentRowToIndex(store: StoreHandle, rowId: string, targetIndex: number): void {
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
  reverseParts: boolean,
): void {
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

export function rebuildRowAtIndex(store: StoreHandle, row: AppendableRow, targetIndex: number): void {
  store.getState().addRow();

  const rebuilt = store.getState().rows.at(-1)!;
  store.getState().updateMaterial(rebuilt.id, row.materialId);
  if (row.floorRole !== undefined) {
    store.getState().updateFloorRole(rebuilt.id, row.floorRole);
  }
  store.getState().updateThickness(rebuilt.id, row.thicknessMm);
  moveCurrentRowToIndex(store, rebuilt.id, targetIndex);
}

export function bounceRow(store: StoreHandle, rowId: string): void {
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

export function generatedAppendableRows(testCase: RouteMixedGeneratedCase): AppendableRow[] {
  return normalizeRows(buildGeneratedRows(testCase));
}

export function buildDirectFinalRows(testCase: RouteMixedGeneratedCase): AppendableRow[] {
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

export function applyPartialSplitToStore(
  store: StoreHandle,
  testCase: RouteMixedGeneratedCase,
  variant: HistoryVariant,
): void {
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

export function applyHistoryVariantToStore(
  store: StoreHandle,
  testCase: RouteMixedGeneratedCase,
  variant: HistoryVariant,
): void {
  const orderedPlans =
    variant.planOrder === "asc"
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

    const leadingId =
      currentRows[targetIndex]!.thicknessMm === plan.parts[0]!
        ? currentRows[targetIndex]!.id
        : currentRows[targetIndex + 1]!.id;
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
          thicknessMm: variant.rebuildPiece === "leading" ? plan.parts[0]! : plan.parts[1]!,
        },
        rebuildIndex,
      );
  }
}

export function applyEditHistoryVariantToStore(
  store: StoreHandle,
  testCase: RouteMixedGeneratedCase,
  variant: EditHistoryVariant,
): void {
  const baselineRows = [...store.getState().rows];
  const orderedPlans = [...testCase.splitPlans].sort((left, right) =>
    variant.planOrder === "asc" ? left.rowIndex - right.rowIndex : right.rowIndex - left.rowIndex,
  );

  for (const [planIndex, plan] of orderedPlans.entries()) {
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
          thicknessMm: firstPart,
        },
        rebuildIndex,
      );

      firstId = store.getState().rows[rebuildIndex]!.id;
      secondId = store.getState().rows[rebuildIndex + 1]!.id;
      store.getState().updateThickness(firstId, firstPart);
      store.getState().updateThickness(secondId, secondPart);
    }

    // Keep the replay path hostile while restoring the canonical direct-final
    // pair order expected by the seeded route output-card surfaces.
    normalizeSplitPairOrder(store, firstId, secondId, variant.reverseParts);
  }
}

export function runOppositeModeNoiseChain(
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

export function evaluateCurrentScenario(store: StoreHandle, id: string, studyMode: "floor" | "wall") {
  const rows = store.getState().rows;

  if (studyMode === "floor") {
    return evaluateFloorScenario(`${id}:current`, rows);
  }

  return evaluateWallScenario(`${id}:current`, rows);
}

export function outputCardSnapshot(
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

export function scenarioOutputCardSnapshots(
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

export function scenarioRequestedOutputCardSnapshots(
  scenario: ReturnType<typeof evaluateCurrentScenario>,
  requestedOutputs: readonly RequestedOutputId[],
  studyMode: "floor" | "wall",
): ScenarioOutputCardSnapshots {
  return {
    field: outputCardSnapshot(scenario.field, requestedOutputs, studyMode),
    lab: outputCardSnapshot(scenario.lab, requestedOutputs, studyMode),
  };
}

export function cardSnapshotsForAppendableRows(
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

export function cardSnapshotsForStore(
  store: StoreHandle,
  id: string,
  studyMode: "floor" | "wall",
): ScenarioOutputCardSnapshots {
  return scenarioOutputCardSnapshots(evaluateCurrentScenario(store, id, studyMode), studyMode);
}

export function requestedCardSnapshotsForStore(
  store: StoreHandle,
  id: string,
  studyMode: "floor" | "wall",
): ScenarioOutputCardSnapshots {
  return scenarioRequestedOutputCardSnapshots(
    evaluateCurrentScenario(store, id, studyMode),
    store.getState().requestedOutputs,
    studyMode,
  );
}

export function appendGeneratedRows(store: StoreHandle, testCase: RouteMixedGeneratedCase): void {
  store.getState().appendRows(generatedAppendableRows(testCase));
}

export function appendDirectRows(store: StoreHandle, testCase: RouteMixedGeneratedCase): void {
  store.getState().appendRows(testCase.rows);
}

export function expectRequiredCasesCovered(): void {
  const caseIds = new Set(ROUTE_MIXED_GENERATED_CASES.map((testCase) => testCase.id));

  for (const id of REQUIRED_CARD_GRID_CASE_IDS) {
    expect(caseIds.has(id), `${id} must remain in the output-card snapshot grid`).toBe(true);
  }
}

export function representativeRequiredCardGridCases(): RouteMixedGeneratedCase[] {
  return REQUIRED_CARD_GRID_CASE_IDS.map((id) => {
    const testCase = ROUTE_MIXED_GENERATED_CASES.find((candidate) => candidate.id === id);

    expect(testCase, `${id} must remain resolvable from the mixed generated route matrix`).toBeTruthy();

    return testCase!;
  });
}

export function assertProjectionEqual(
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

export function assertRowsEqual(
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
