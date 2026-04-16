import type { RequestedOutputId } from "@dynecho/shared";
import { expect } from "vitest";

import {
  customRequestedOutputsForStudyMode,
  DEFAULT_FLOOR_REQUESTED_OUTPUTS,
  DEFAULT_WALL_REQUESTED_OUTPUTS,
  FLOOR_DETOUR_ROWS,
  WALL_DETOUR_ROWS,
  type RouteMixedGeneratedCase,
} from "./mixed-study-mode-generated-test-helpers";
import {
  assertRequestedOutputVariantProjection,
  recordRequestedOutputMismatch,
  resetRequestedOutputBranch,
} from "./mixed-study-mode-output-card-snapshot-requested-output-variant-drivers";
import {
  buildDirectFinalRows,
  requestedCardSnapshotsForStore,
  representativeRequiredCardGridCases,
  REQUIRED_CARD_GRID_CASE_IDS,
  runOppositeModeNoiseChain,
  type StoreHandle,
} from "./mixed-study-mode-output-card-snapshot-test-helpers";

type StudyMode = RouteMixedGeneratedCase["studyMode"];

type RequestedOutputExpectations = {
  expectedDefaultOutputs: readonly RequestedOutputId[];
  expectedOppositeOutputs: readonly RequestedOutputId[];
  oppositeMode: StudyMode;
  selectedRequestedOutputs: RequestedOutputId[];
};

type RequestedOutputDirectExpectation = RequestedOutputExpectations & {
  expected: ReturnType<typeof requestedCardSnapshotsForStore>;
};

type RequestedOutputSaveLoadRestoreArgs = {
  applyOppositeDetour: () => void;
  directFinalRows: ReturnType<typeof buildDirectFinalRows>;
  expected: ReturnType<typeof requestedCardSnapshotsForStore>;
  expectedOppositeOutputs: readonly RequestedOutputId[];
  failures: string[];
  oppositeDefaultMessage: string;
  restoreSelectedMessage: string;
  saveFailureMessage: string;
  saveLoadCardsLabel: string;
  saveLoadRowsLabel: string;
  saveLoadSnapshotLabel: string;
  selectedRequestedOutputs: RequestedOutputId[];
  store: StoreHandle;
  studyMode: StudyMode;
};

type PrepareRequestedOutputDirectExpectationArgs = {
  acceptSelectedMessage: string;
  directFinalRows: ReturnType<typeof buildDirectFinalRows>;
  directSnapshotLabel: string;
  failures: string[];
  openDefaultMessage: string;
  store: StoreHandle;
  testCase: RouteMixedGeneratedCase;
};

export type RequestedOutputSurfaceDirectMessages = {
  acceptSelectedMessage: (testCase: RouteMixedGeneratedCase) => string;
  openDefaultMessage: (testCase: RouteMixedGeneratedCase) => string;
  snapshotLabel: (testCase: RouteMixedGeneratedCase) => string;
};

export type RequestedOutputSurfaceReplayMessages<TVariant> = {
  cardsLabel: (testCase: RouteMixedGeneratedCase, variant: TVariant) => string;
  keepSelectedMessage: (testCase: RouteMixedGeneratedCase, variant: TVariant) => string;
  openDefaultMessage: (testCase: RouteMixedGeneratedCase, variant: TVariant) => string;
  rowsLabel: (testCase: RouteMixedGeneratedCase, variant: TVariant) => string;
  snapshotLabel: (testCase: RouteMixedGeneratedCase, variant: TVariant) => string;
};

export type RequestedOutputSurfaceRestoreMessages<TVariant> = {
  detourStrategy: "noise_chain" | "opposite_mode_rows";
  oppositeDefaultMessage: (testCase: RouteMixedGeneratedCase, variant: TVariant) => string;
  rerunVariantBeforeRestore?: boolean;
  restoreSelectedMessage: (testCase: RouteMixedGeneratedCase, variant: TVariant) => string;
  saveFailureMessage: (testCase: RouteMixedGeneratedCase, variant: TVariant) => string;
  saveLoadCardsLabel: (testCase: RouteMixedGeneratedCase, variant: TVariant) => string;
  saveLoadRowsLabel: (testCase: RouteMixedGeneratedCase, variant: TVariant) => string;
  saveLoadSnapshotLabel: (testCase: RouteMixedGeneratedCase, variant: TVariant) => string;
};

export type RequestedOutputVariantBranchArgs<TVariant> = {
  expectedDefaultOutputs: readonly RequestedOutputId[];
  failures: string[];
  keepSelectedMessage: string;
  openDefaultMessage: string;
  selectedRequestedOutputs: RequestedOutputId[];
  store: StoreHandle;
  studyMode: StudyMode;
  testCase: RouteMixedGeneratedCase;
  variant: TVariant;
};

export type RequestedOutputSurfaceDescriptor<TVariant> = {
  beforeLoop: () => void;
  cases: () => readonly RouteMixedGeneratedCase[];
  direct: RequestedOutputSurfaceDirectMessages;
  replay: RequestedOutputSurfaceReplayMessages<TVariant>;
  restore?: RequestedOutputSurfaceRestoreMessages<TVariant>;
  runVariantBranch: (args: RequestedOutputVariantBranchArgs<TVariant>) => void;
  variants: readonly TVariant[];
};

async function loadSnapshotStore(): Promise<StoreHandle> {
  const { useWorkbenchStore } = await import("./workbench-store");

  return useWorkbenchStore as StoreHandle;
}

function requestedOutputExpectationsForStudyMode(studyMode: StudyMode): RequestedOutputExpectations {
  const expectedDefaultOutputs =
    studyMode === "floor" ? DEFAULT_FLOOR_REQUESTED_OUTPUTS : DEFAULT_WALL_REQUESTED_OUTPUTS;
  const oppositeMode = studyMode === "floor" ? "wall" : "floor";
  const expectedOppositeOutputs =
    oppositeMode === "floor" ? DEFAULT_FLOOR_REQUESTED_OUTPUTS : DEFAULT_WALL_REQUESTED_OUTPUTS;

  return {
    expectedDefaultOutputs,
    expectedOppositeOutputs,
    oppositeMode,
    selectedRequestedOutputs: customRequestedOutputsForStudyMode(studyMode),
  };
}

function appendOppositeDetourRows(store: StoreHandle, oppositeMode: StudyMode): void {
  store.getState().appendRows(oppositeMode === "floor" ? FLOOR_DETOUR_ROWS : WALL_DETOUR_ROWS);
}

function prepareRequestedOutputDirectExpectation({
  acceptSelectedMessage,
  directFinalRows,
  directSnapshotLabel,
  failures,
  openDefaultMessage,
  store,
  testCase,
}: PrepareRequestedOutputDirectExpectationArgs): RequestedOutputDirectExpectation {
  const expectations = requestedOutputExpectationsForStudyMode(testCase.studyMode);

  resetRequestedOutputBranch({
    expectedDefaultOutputs: expectations.expectedDefaultOutputs,
    failures,
    openDefaultMessage,
    store,
    studyMode: testCase.studyMode,
  });
  store.getState().appendRows(directFinalRows);
  store.getState().setRequestedOutputs(expectations.selectedRequestedOutputs);
  recordRequestedOutputMismatch(
    failures,
    store.getState().requestedOutputs,
    expectations.selectedRequestedOutputs,
    acceptSelectedMessage,
  );

  return {
    ...expectations,
    expected: requestedCardSnapshotsForStore(store, directSnapshotLabel, testCase.studyMode),
  };
}

function restoreRequestedOutputSaveLoadRoundtrip({
  applyOppositeDetour,
  directFinalRows,
  expected,
  expectedOppositeOutputs,
  failures,
  oppositeDefaultMessage,
  restoreSelectedMessage,
  saveFailureMessage,
  saveLoadCardsLabel,
  saveLoadRowsLabel,
  saveLoadSnapshotLabel,
  selectedRequestedOutputs,
  store,
  studyMode,
}: RequestedOutputSaveLoadRestoreArgs): void {
  store.getState().saveCurrentScenario();
  const savedScenario = store.getState().savedScenarios[0];

  if (!savedScenario) {
    failures.push(saveFailureMessage);
    return;
  }

  applyOppositeDetour();
  recordRequestedOutputMismatch(
    failures,
    store.getState().requestedOutputs,
    expectedOppositeOutputs,
    oppositeDefaultMessage,
  );

  store.getState().loadSavedScenario(savedScenario.id);
  recordRequestedOutputMismatch(
    failures,
    store.getState().requestedOutputs,
    selectedRequestedOutputs,
    restoreSelectedMessage,
  );
  assertRequestedOutputVariantProjection({
    cardsLabel: saveLoadCardsLabel,
    directFinalRows,
    expected,
    failures,
    rowsLabel: saveLoadRowsLabel,
    snapshotLabel: saveLoadSnapshotLabel,
    store,
    studyMode,
  });
}

function runRestoreDetour(
  store: StoreHandle,
  testCase: RouteMixedGeneratedCase,
  oppositeMode: StudyMode,
  detourStrategy: "noise_chain" | "opposite_mode_rows",
): void {
  if (detourStrategy === "noise_chain") {
    runOppositeModeNoiseChain(store, testCase);
    return;
  }

  store.getState().startStudyMode(oppositeMode);
  appendOppositeDetourRows(store, oppositeMode);
}

export function representativeRequestedOutputCases(): ReturnType<typeof representativeRequiredCardGridCases> {
  const requiredCases = representativeRequiredCardGridCases();

  expect(requiredCases.map((testCase) => testCase.id)).toEqual(REQUIRED_CARD_GRID_CASE_IDS);
  return requiredCases;
}

export async function runRequestedOutputSurfaceGrid<TVariant>(
  descriptor: RequestedOutputSurfaceDescriptor<TVariant>,
): Promise<void> {
  descriptor.beforeLoop();

  const store = await loadSnapshotStore();
  const failures: string[] = [];

  for (const testCase of descriptor.cases()) {
    const directFinalRows = buildDirectFinalRows(testCase);
    const {
      expected,
      expectedDefaultOutputs,
      expectedOppositeOutputs,
      oppositeMode,
      selectedRequestedOutputs,
    } = prepareRequestedOutputDirectExpectation({
      acceptSelectedMessage: descriptor.direct.acceptSelectedMessage(testCase),
      directFinalRows,
      directSnapshotLabel: descriptor.direct.snapshotLabel(testCase),
      failures,
      openDefaultMessage: descriptor.direct.openDefaultMessage(testCase),
      store,
      testCase,
    });

    for (const variant of descriptor.variants) {
      const runVariant = () =>
        descriptor.runVariantBranch({
          expectedDefaultOutputs,
          failures,
          keepSelectedMessage: descriptor.replay.keepSelectedMessage(testCase, variant),
          openDefaultMessage: descriptor.replay.openDefaultMessage(testCase, variant),
          selectedRequestedOutputs,
          store,
          studyMode: testCase.studyMode,
          testCase,
          variant,
        });

      runVariant();
      assertRequestedOutputVariantProjection({
        cardsLabel: descriptor.replay.cardsLabel(testCase, variant),
        directFinalRows,
        expected,
        failures,
        rowsLabel: descriptor.replay.rowsLabel(testCase, variant),
        snapshotLabel: descriptor.replay.snapshotLabel(testCase, variant),
        store,
        studyMode: testCase.studyMode,
      });

      if (!descriptor.restore) {
        continue;
      }

      if (descriptor.restore.rerunVariantBeforeRestore) {
        runVariant();
      }

      restoreRequestedOutputSaveLoadRoundtrip({
        applyOppositeDetour: () =>
          runRestoreDetour(store, testCase, oppositeMode, descriptor.restore!.detourStrategy),
        directFinalRows,
        expected,
        expectedOppositeOutputs,
        failures,
        oppositeDefaultMessage: descriptor.restore.oppositeDefaultMessage(testCase, variant),
        restoreSelectedMessage: descriptor.restore.restoreSelectedMessage(testCase, variant),
        saveFailureMessage: descriptor.restore.saveFailureMessage(testCase, variant),
        saveLoadCardsLabel: descriptor.restore.saveLoadCardsLabel(testCase, variant),
        saveLoadRowsLabel: descriptor.restore.saveLoadRowsLabel(testCase, variant),
        saveLoadSnapshotLabel: descriptor.restore.saveLoadSnapshotLabel(testCase, variant),
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
      });
    }
  }

  expect(failures, failures.join("\n\n")).toEqual([]);
}
