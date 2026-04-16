import type { RequestedOutputId } from "@dynecho/shared";

import { buildGeneratedRows, type RouteMixedGeneratedCase } from "./mixed-study-mode-generated-test-helpers";
import {
  appendGeneratedRows,
  applyEditHistoryVariantToStore,
  applyHistoryVariantToStore,
  applyPartialSplitToStore,
  assertProjectionEqual,
  assertRowsEqual,
  requestedCardSnapshotsForStore,
  requestedOutputsMatch,
  runOppositeModeNoiseChain,
  type AppendableRow,
  type StoreHandle,
} from "./mixed-study-mode-output-card-snapshot-test-helpers";

type StudyMode = RouteMixedGeneratedCase["studyMode"];
type StoreRows = readonly AppendableRow[];
type VariantProjection = ReturnType<typeof requestedCardSnapshotsForStore>;
type HistoryVariant = Parameters<typeof applyHistoryVariantToStore>[2];
type EditHistoryVariant = Parameters<typeof applyEditHistoryVariantToStore>[2];

type ResetRequestedOutputBranchArgs = {
  expectedDefaultOutputs: readonly RequestedOutputId[];
  failures: string[];
  openDefaultMessage: string;
  store: StoreHandle;
  studyMode: StudyMode;
};

type CompactReplayVariantBranchArgs = ResetRequestedOutputBranchArgs & {
  keepSelectedMessage: string;
  selectedRequestedOutputs: RequestedOutputId[];
  testCase: RouteMixedGeneratedCase;
  variant: HistoryVariant;
};

type EditHistoryVariantBranchArgs = ResetRequestedOutputBranchArgs & {
  keepSelectedMessage: string;
  selectedRequestedOutputs: RequestedOutputId[];
  testCase: RouteMixedGeneratedCase;
  variant: EditHistoryVariant;
};

type PartialRestoreVariantBranchArgs = ResetRequestedOutputBranchArgs & {
  keepSelectedMessage: string;
  selectedRequestedOutputs: RequestedOutputId[];
  testCase: RouteMixedGeneratedCase;
  variant: HistoryVariant;
};

type RequestedOutputProjectionArgs = {
  cardsLabel: string;
  directFinalRows: StoreRows;
  expected: VariantProjection;
  failures: string[];
  rowsLabel: string;
  snapshotLabel: string;
  store: StoreHandle;
  studyMode: StudyMode;
};

export function recordRequestedOutputMismatch(
  failures: string[],
  actual: readonly RequestedOutputId[],
  expected: readonly RequestedOutputId[],
  message: string,
): void {
  if (!requestedOutputsMatch(actual, expected)) {
    failures.push(message);
  }
}

export function resetRequestedOutputBranch({
  expectedDefaultOutputs,
  failures,
  openDefaultMessage,
  store,
  studyMode,
}: ResetRequestedOutputBranchArgs): void {
  store.getState().reset();
  store.getState().startStudyMode(studyMode);
  recordRequestedOutputMismatch(
    failures,
    store.getState().requestedOutputs,
    expectedDefaultOutputs,
    openDefaultMessage,
  );
}

export function appendGeneratedBaselineRows(store: StoreHandle, testCase: RouteMixedGeneratedCase): void {
  store.getState().appendRows(
    buildGeneratedRows(testCase).map(({ floorRole, materialId, thicknessMm }) => ({
      floorRole,
      materialId,
      thicknessMm,
    })),
  );
}

export function runCompactReplayVariantBranch({
  expectedDefaultOutputs,
  failures,
  keepSelectedMessage,
  openDefaultMessage,
  selectedRequestedOutputs,
  store,
  studyMode,
  testCase,
  variant,
}: CompactReplayVariantBranchArgs): void {
  resetRequestedOutputBranch({
    expectedDefaultOutputs,
    failures,
    openDefaultMessage,
    store,
    studyMode,
  });
  appendGeneratedRows(store, testCase);
  applyHistoryVariantToStore(store, testCase, variant);
  store.getState().setRequestedOutputs(selectedRequestedOutputs);
  recordRequestedOutputMismatch(
    failures,
    store.getState().requestedOutputs,
    selectedRequestedOutputs,
    keepSelectedMessage,
  );
}

export function runEditHistoryVariantBranch({
  expectedDefaultOutputs,
  failures,
  keepSelectedMessage,
  openDefaultMessage,
  selectedRequestedOutputs,
  store,
  studyMode,
  testCase,
  variant,
}: EditHistoryVariantBranchArgs): void {
  resetRequestedOutputBranch({
    expectedDefaultOutputs,
    failures,
    openDefaultMessage,
    store,
    studyMode,
  });
  appendGeneratedBaselineRows(store, testCase);
  store.getState().setRequestedOutputs(selectedRequestedOutputs);
  applyEditHistoryVariantToStore(store, testCase, variant);
  recordRequestedOutputMismatch(
    failures,
    store.getState().requestedOutputs,
    selectedRequestedOutputs,
    keepSelectedMessage,
  );
}

export function runPartialRestoreVariantBranch({
  expectedDefaultOutputs,
  failures,
  keepSelectedMessage,
  openDefaultMessage,
  selectedRequestedOutputs,
  store,
  studyMode,
  testCase,
  variant,
}: PartialRestoreVariantBranchArgs): void {
  resetRequestedOutputBranch({
    expectedDefaultOutputs,
    failures,
    openDefaultMessage,
    store,
    studyMode,
  });
  appendGeneratedRows(store, testCase);
  store.getState().setRequestedOutputs(selectedRequestedOutputs);
  applyPartialSplitToStore(store, testCase, variant);
  runOppositeModeNoiseChain(store, testCase);

  store.getState().startStudyMode(testCase.studyMode);
  appendGeneratedRows(store, testCase);
  store.getState().setRequestedOutputs(selectedRequestedOutputs);
  applyHistoryVariantToStore(store, testCase, variant);
  recordRequestedOutputMismatch(
    failures,
    store.getState().requestedOutputs,
    selectedRequestedOutputs,
    keepSelectedMessage,
  );
}

export function assertRequestedOutputVariantProjection({
  cardsLabel,
  directFinalRows,
  expected,
  failures,
  rowsLabel,
  snapshotLabel,
  store,
  studyMode,
}: RequestedOutputProjectionArgs): void {
  assertRowsEqual(failures, rowsLabel, store.getState().rows, directFinalRows);
  assertProjectionEqual(
    failures,
    cardsLabel,
    requestedCardSnapshotsForStore(store, snapshotLabel, studyMode),
    expected,
  );
}
