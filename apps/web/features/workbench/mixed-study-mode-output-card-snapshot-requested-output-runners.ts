import type { RequestedOutputId } from "@dynecho/shared";
import { expect } from "vitest";

import {
  customRequestedOutputsForStudyMode,
  DEFAULT_FLOOR_REQUESTED_OUTPUTS,
  DEFAULT_WALL_REQUESTED_OUTPUTS,
  FLOOR_DETOUR_ROWS,
  ROUTE_MIXED_GENERATED_CASES,
  SELECTED_DUPLICATE_SWAP_HISTORY_VARIANTS,
  SELECTED_EDIT_HISTORY_VARIANTS,
  SELECTED_ROUTE_MIXED_GENERATED_CASES,
  WALL_DETOUR_ROWS,
  type RouteMixedGeneratedCase,
} from "./mixed-study-mode-generated-test-helpers";
import {
  assertRequestedOutputVariantProjection,
  recordRequestedOutputMismatch,
  resetRequestedOutputBranch,
  runCompactReplayVariantBranch,
  runEditHistoryVariantBranch,
  runPartialRestoreVariantBranch,
} from "./mixed-study-mode-output-card-snapshot-requested-output-variant-drivers";
import {
  buildDirectFinalRows,
  CARD_HISTORY_VARIANTS,
  expectRequiredCasesCovered,
  expectSelectedCardGridCasesCovered,
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

function representativeRequestedOutputCases(): ReturnType<typeof representativeRequiredCardGridCases> {
  const requiredCases = representativeRequiredCardGridCases();

  expect(requiredCases.map((testCase) => testCase.id)).toEqual(REQUIRED_CARD_GRID_CASE_IDS);
  return requiredCases;
}

export async function runBroadRequestedOutputCompactReplayGrid(): Promise<void> {
  expectRequiredCasesCovered();

  const store = await loadSnapshotStore();
  const failures: string[] = [];

  for (const testCase of ROUTE_MIXED_GENERATED_CASES) {
    const directFinalRows = buildDirectFinalRows(testCase);
    const { expected, expectedDefaultOutputs, selectedRequestedOutputs } = prepareRequestedOutputDirectExpectation({
      acceptSelectedMessage: `${testCase.id}: broad requested-output replay should accept the selected bundle`,
      directFinalRows,
      directSnapshotLabel: `${testCase.id}:broad-requested-output-direct`,
      failures,
      openDefaultMessage:
        `${testCase.id}: broad requested-output replay should open with the study-mode default requested outputs`,
      store,
      testCase,
    });

    for (const variant of CARD_HISTORY_VARIANTS) {
      runCompactReplayVariantBranch({
        expectedDefaultOutputs,
        failures,
        keepSelectedMessage:
          `${testCase.id}:${variant.id}: broad requested-output replay should accept the selected bundle`,
        openDefaultMessage:
          `${testCase.id}:${variant.id}: broad requested-output replay branch should open with default requested outputs`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
        testCase,
        variant,
      });
      assertRequestedOutputVariantProjection({
        cardsLabel: `${testCase.id}:${variant.id}:broad-requested-output-replay:cards`,
        directFinalRows,
        expected,
        failures,
        rowsLabel: `${testCase.id}:${variant.id}:broad-requested-output-replay:rows`,
        snapshotLabel: `${testCase.id}:${variant.id}:broad-requested-output-replay`,
        store,
        studyMode: testCase.studyMode,
      });
    }
  }

  expect(failures, failures.join("\n\n")).toEqual([]);
}

export async function runBroadRequestedOutputRestoreAfterCompactReplayGrid(): Promise<void> {
  expectRequiredCasesCovered();

  const store = await loadSnapshotStore();
  const failures: string[] = [];

  for (const testCase of ROUTE_MIXED_GENERATED_CASES) {
    const directFinalRows = buildDirectFinalRows(testCase);
    const {
      expected,
      expectedDefaultOutputs,
      expectedOppositeOutputs,
      selectedRequestedOutputs,
    } = prepareRequestedOutputDirectExpectation({
      acceptSelectedMessage: `${testCase.id}: broad requested-output restore should accept the selected bundle`,
      directFinalRows,
      directSnapshotLabel: `${testCase.id}:broad-requested-output-restore-direct`,
      failures,
      openDefaultMessage:
        `${testCase.id}: broad requested-output restore should open with the study-mode default requested outputs`,
      store,
      testCase,
    });

    for (const variant of CARD_HISTORY_VARIANTS) {
      runCompactReplayVariantBranch({
        expectedDefaultOutputs,
        failures,
        keepSelectedMessage:
          `${testCase.id}:${variant.id}: broad requested-output restore replay should accept the selected bundle`,
        openDefaultMessage:
          `${testCase.id}:${variant.id}: broad requested-output restore branch should open with default requested outputs`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
        testCase,
        variant,
      });
      assertRequestedOutputVariantProjection({
        cardsLabel: `${testCase.id}:${variant.id}:broad-requested-output-restore-replay:cards`,
        directFinalRows,
        expected,
        failures,
        rowsLabel: `${testCase.id}:${variant.id}:broad-requested-output-restore-replay:rows`,
        snapshotLabel: `${testCase.id}:${variant.id}:broad-requested-output-restore-replay`,
        store,
        studyMode: testCase.studyMode,
      });

      restoreRequestedOutputSaveLoadRoundtrip({
        applyOppositeDetour: () => runOppositeModeNoiseChain(store, testCase),
        directFinalRows,
        expected,
        expectedOppositeOutputs,
        failures,
        oppositeDefaultMessage:
          `${testCase.id}:${variant.id}: broad requested-output restore opposite-mode detour should reset to the opposite default requested outputs`,
        restoreSelectedMessage:
          `${testCase.id}:${variant.id}: broad requested-output restore save-load should restore the selected bundle`,
        saveFailureMessage:
          `${testCase.id}:${variant.id}: broad requested-output restore save should create a scenario`,
        saveLoadCardsLabel: `${testCase.id}:${variant.id}:broad-requested-output-restore-save-load:cards`,
        saveLoadRowsLabel: `${testCase.id}:${variant.id}:broad-requested-output-restore-save-load:rows`,
        saveLoadSnapshotLabel: `${testCase.id}:${variant.id}:broad-requested-output-restore-save-load`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
      });
    }
  }

  expect(failures, failures.join("\n\n")).toEqual([]);
}

export async function runBroadRequestedOutputEditHistoryRestoreGrid(): Promise<void> {
  expectRequiredCasesCovered();

  const store = await loadSnapshotStore();
  const failures: string[] = [];

  for (const testCase of ROUTE_MIXED_GENERATED_CASES) {
    const directFinalRows = buildDirectFinalRows(testCase);
    const {
      expected,
      expectedDefaultOutputs,
      expectedOppositeOutputs,
      oppositeMode,
      selectedRequestedOutputs,
    } = prepareRequestedOutputDirectExpectation({
      acceptSelectedMessage:
        `${testCase.id}: broad edit-history restore should accept the selected requested-output bundle`,
      directFinalRows,
      directSnapshotLabel: `${testCase.id}:broad-requested-output-edit-history-direct`,
      failures,
      openDefaultMessage: `${testCase.id}: broad edit-history restore should open with default requested outputs`,
      store,
      testCase,
    });

    for (const variant of SELECTED_EDIT_HISTORY_VARIANTS) {
      runEditHistoryVariantBranch({
        expectedDefaultOutputs,
        failures,
        keepSelectedMessage:
          `${testCase.id}:${variant.id}: broad edit-history replay should keep the selected requested-output bundle`,
        openDefaultMessage:
          `${testCase.id}:${variant.id}: broad edit-history replay should open with default requested outputs`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
        testCase,
        variant,
      });
      assertRequestedOutputVariantProjection({
        cardsLabel: `${testCase.id}:${variant.id}:broad-requested-output-edit-history:cards`,
        directFinalRows,
        expected,
        failures,
        rowsLabel: `${testCase.id}:${variant.id}:broad-requested-output-edit-history:rows`,
        snapshotLabel: `${testCase.id}:${variant.id}:broad-requested-output-edit-history`,
        store,
        studyMode: testCase.studyMode,
      });

      restoreRequestedOutputSaveLoadRoundtrip({
        applyOppositeDetour: () => {
          store.getState().startStudyMode(oppositeMode);
          appendOppositeDetourRows(store, oppositeMode);
        },
        directFinalRows,
        expected,
        expectedOppositeOutputs,
        failures,
        oppositeDefaultMessage:
          `${testCase.id}:${variant.id}: broad edit-history opposite-mode detour should reset to the opposite default requested outputs`,
        restoreSelectedMessage:
          `${testCase.id}:${variant.id}: broad edit-history save-load should restore the selected requested-output bundle`,
        saveFailureMessage:
          `${testCase.id}:${variant.id}: broad edit-history restore save should create a scenario`,
        saveLoadCardsLabel: `${testCase.id}:${variant.id}:broad-requested-output-edit-history-save-load:cards`,
        saveLoadRowsLabel: `${testCase.id}:${variant.id}:broad-requested-output-edit-history-save-load:rows`,
        saveLoadSnapshotLabel: `${testCase.id}:${variant.id}:broad-requested-output-edit-history-save-load`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
      });
    }
  }

  expect(failures, failures.join("\n\n")).toEqual([]);
}

export async function runBroadRequestedOutputPartialRestoreGrid(): Promise<void> {
  expectRequiredCasesCovered();

  const store = await loadSnapshotStore();
  const failures: string[] = [];

  for (const testCase of ROUTE_MIXED_GENERATED_CASES) {
    const directFinalRows = buildDirectFinalRows(testCase);
    const {
      expected,
      expectedDefaultOutputs,
      expectedOppositeOutputs,
      oppositeMode,
      selectedRequestedOutputs,
    } = prepareRequestedOutputDirectExpectation({
      acceptSelectedMessage:
        `${testCase.id}: broad partial-restore should accept the selected requested-output bundle`,
      directFinalRows,
      directSnapshotLabel: `${testCase.id}:broad-requested-output-partial-restore-direct`,
      failures,
      openDefaultMessage: `${testCase.id}: broad partial-restore branch should open with default requested outputs`,
      store,
      testCase,
    });

    for (const variant of SELECTED_DUPLICATE_SWAP_HISTORY_VARIANTS) {
      runPartialRestoreVariantBranch({
        expectedDefaultOutputs,
        failures,
        keepSelectedMessage:
          `${testCase.id}:${variant.id}: broad partial-restore replay should keep the selected requested-output bundle`,
        openDefaultMessage:
          `${testCase.id}:${variant.id}: broad partial-restore replay should open with default requested outputs`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
        testCase,
        variant,
      });
      assertRequestedOutputVariantProjection({
        cardsLabel: `${testCase.id}:${variant.id}:broad-requested-output-partial-restore:cards`,
        directFinalRows,
        expected,
        failures,
        rowsLabel: `${testCase.id}:${variant.id}:broad-requested-output-partial-restore:rows`,
        snapshotLabel: `${testCase.id}:${variant.id}:broad-requested-output-partial-restore`,
        store,
        studyMode: testCase.studyMode,
      });

      runPartialRestoreVariantBranch({
        expectedDefaultOutputs,
        failures,
        keepSelectedMessage:
          `${testCase.id}:${variant.id}: broad partial-restore replay should keep the selected requested-output bundle`,
        openDefaultMessage:
          `${testCase.id}:${variant.id}: broad partial-restore replay should open with default requested outputs`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
        testCase,
        variant,
      });
      restoreRequestedOutputSaveLoadRoundtrip({
        applyOppositeDetour: () => {
          store.getState().startStudyMode(oppositeMode);
          appendOppositeDetourRows(store, oppositeMode);
        },
        directFinalRows,
        expected,
        expectedOppositeOutputs,
        failures,
        oppositeDefaultMessage:
          `${testCase.id}:${variant.id}: broad partial-restore opposite-mode detour should reset to the opposite default requested outputs`,
        restoreSelectedMessage:
          `${testCase.id}:${variant.id}: broad partial-restore save-load should restore the selected requested-output bundle`,
        saveFailureMessage: `${testCase.id}:${variant.id}: broad partial-restore save should create a scenario`,
        saveLoadCardsLabel: `${testCase.id}:${variant.id}:broad-requested-output-partial-restore-save-load:cards`,
        saveLoadRowsLabel: `${testCase.id}:${variant.id}:broad-requested-output-partial-restore-save-load:rows`,
        saveLoadSnapshotLabel: `${testCase.id}:${variant.id}:broad-requested-output-partial-restore-save-load`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
      });
    }
  }

  expect(failures, failures.join("\n\n")).toEqual([]);
}

export async function runSelectedRequestedOutputPartialRestoreGrid(): Promise<void> {
  expectRequiredCasesCovered();
  expectSelectedCardGridCasesCovered();

  const store = await loadSnapshotStore();
  const failures: string[] = [];

  for (const testCase of SELECTED_ROUTE_MIXED_GENERATED_CASES) {
    const directFinalRows = buildDirectFinalRows(testCase);
    const {
      expected,
      expectedDefaultOutputs,
      expectedOppositeOutputs,
      oppositeMode,
      selectedRequestedOutputs,
    } = prepareRequestedOutputDirectExpectation({
      acceptSelectedMessage: `${testCase.id}: partial-restore should accept the selected requested-output bundle`,
      directFinalRows,
      directSnapshotLabel: `${testCase.id}:requested-output-partial-restore-direct`,
      failures,
      openDefaultMessage: `${testCase.id}: partial-restore should open with the study-mode default requested outputs`,
      store,
      testCase,
    });

    for (const variant of SELECTED_DUPLICATE_SWAP_HISTORY_VARIANTS) {
      runPartialRestoreVariantBranch({
        expectedDefaultOutputs,
        failures,
        keepSelectedMessage:
          `${testCase.id}:${variant.id}: partial-restore replay should keep the selected requested-output bundle`,
        openDefaultMessage:
          `${testCase.id}:${variant.id}: partial-restore branch should open with default requested outputs`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
        testCase,
        variant,
      });
      assertRequestedOutputVariantProjection({
        cardsLabel: `${testCase.id}:${variant.id}:requested-output-partial-restore:cards`,
        directFinalRows,
        expected,
        failures,
        rowsLabel: `${testCase.id}:${variant.id}:requested-output-partial-restore:rows`,
        snapshotLabel: `${testCase.id}:${variant.id}:requested-output-partial-restore`,
        store,
        studyMode: testCase.studyMode,
      });

      runPartialRestoreVariantBranch({
        expectedDefaultOutputs,
        failures,
        keepSelectedMessage:
          `${testCase.id}:${variant.id}: partial-restore replay should keep the selected requested-output bundle`,
        openDefaultMessage:
          `${testCase.id}:${variant.id}: partial-restore branch should open with default requested outputs`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
        testCase,
        variant,
      });
      restoreRequestedOutputSaveLoadRoundtrip({
        applyOppositeDetour: () => {
          store.getState().startStudyMode(oppositeMode);
          appendOppositeDetourRows(store, oppositeMode);
        },
        directFinalRows,
        expected,
        expectedOppositeOutputs,
        failures,
        oppositeDefaultMessage:
          `${testCase.id}:${variant.id}: requested-output partial-restore opposite-mode detour should reset to the opposite defaults`,
        restoreSelectedMessage:
          `${testCase.id}:${variant.id}: requested-output partial-restore save-load should restore the selected bundle`,
        saveFailureMessage:
          `${testCase.id}:${variant.id}: requested-output partial-restore save should create a scenario`,
        saveLoadCardsLabel: `${testCase.id}:${variant.id}:requested-output-partial-restore-save-load:cards`,
        saveLoadRowsLabel: `${testCase.id}:${variant.id}:requested-output-partial-restore-save-load:rows`,
        saveLoadSnapshotLabel: `${testCase.id}:${variant.id}:requested-output-partial-restore-save-load`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
      });
    }
  }

  expect(failures, failures.join("\n\n")).toEqual([]);
}

export async function runSelectedRequestedOutputGeneratedHistoryRestoreGrid(): Promise<void> {
  expectRequiredCasesCovered();
  expectSelectedCardGridCasesCovered();

  const store = await loadSnapshotStore();
  const failures: string[] = [];

  for (const testCase of SELECTED_ROUTE_MIXED_GENERATED_CASES) {
    const directFinalRows = buildDirectFinalRows(testCase);
    const {
      expected,
      expectedDefaultOutputs,
      expectedOppositeOutputs,
      oppositeMode,
      selectedRequestedOutputs,
    } = prepareRequestedOutputDirectExpectation({
      acceptSelectedMessage: `${testCase.id}: selected requested-output bundle should be accepted before replay`,
      directFinalRows,
      directSnapshotLabel: `${testCase.id}:requested-output-direct`,
      failures,
      openDefaultMessage: `${testCase.id}: default requested-output bundle should match the study-mode default`,
      store,
      testCase,
    });

    for (const variant of SELECTED_DUPLICATE_SWAP_HISTORY_VARIANTS) {
      runPartialRestoreVariantBranch({
        expectedDefaultOutputs,
        failures,
        keepSelectedMessage:
          `${testCase.id}:${variant.id}: long replay chain should keep the selected requested-output bundle`,
        openDefaultMessage:
          `${testCase.id}:${variant.id}: generated-history replay should open with default requested outputs`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
        testCase,
        variant,
      });
      assertRequestedOutputVariantProjection({
        cardsLabel: `${testCase.id}:${variant.id}:requested-output-generated-history:cards`,
        directFinalRows,
        expected,
        failures,
        rowsLabel: `${testCase.id}:${variant.id}:requested-output-generated-history:rows`,
        snapshotLabel: `${testCase.id}:${variant.id}:requested-output-generated-history`,
        store,
        studyMode: testCase.studyMode,
      });

      restoreRequestedOutputSaveLoadRoundtrip({
        applyOppositeDetour: () => {
          store.getState().startStudyMode(oppositeMode);
          appendOppositeDetourRows(store, oppositeMode);
        },
        directFinalRows,
        expected,
        expectedOppositeOutputs,
        failures,
        oppositeDefaultMessage:
          `${testCase.id}:${variant.id}: opposite-mode reset should open the opposite default requested outputs`,
        restoreSelectedMessage:
          `${testCase.id}:${variant.id}: save-load should restore the selected requested-output bundle after long replay`,
        saveFailureMessage:
          `${testCase.id}:${variant.id}: requested-output generated-history save should create a scenario`,
        saveLoadCardsLabel: `${testCase.id}:${variant.id}:requested-output-generated-history-save-load:cards`,
        saveLoadRowsLabel: `${testCase.id}:${variant.id}:requested-output-generated-history-save-load:rows`,
        saveLoadSnapshotLabel: `${testCase.id}:${variant.id}:requested-output-generated-history-save-load`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
      });
    }
  }

  expect(failures, failures.join("\n\n")).toEqual([]);
}

export async function runSelectedRequestedOutputEditHistoryRestoreGrid(): Promise<void> {
  expectRequiredCasesCovered();
  expectSelectedCardGridCasesCovered();

  const store = await loadSnapshotStore();
  const failures: string[] = [];

  for (const testCase of SELECTED_ROUTE_MIXED_GENERATED_CASES) {
    const directFinalRows = buildDirectFinalRows(testCase);
    const {
      expected,
      expectedDefaultOutputs,
      expectedOppositeOutputs,
      oppositeMode,
      selectedRequestedOutputs,
    } = prepareRequestedOutputDirectExpectation({
      acceptSelectedMessage:
        `${testCase.id}: selected requested-output bundle should be accepted before edit-history replay`,
      directFinalRows,
      directSnapshotLabel: `${testCase.id}:requested-output-edit-history-direct`,
      failures,
      openDefaultMessage: `${testCase.id}: edit-history replay should open with default requested outputs`,
      store,
      testCase,
    });

    for (const variant of SELECTED_EDIT_HISTORY_VARIANTS) {
      runEditHistoryVariantBranch({
        expectedDefaultOutputs,
        failures,
        keepSelectedMessage:
          `${testCase.id}:${variant.id}: edit-history replay should keep the selected requested-output bundle`,
        openDefaultMessage:
          `${testCase.id}:${variant.id}: edit-history branch should open with default requested outputs`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
        testCase,
        variant,
      });
      assertRequestedOutputVariantProjection({
        cardsLabel: `${testCase.id}:${variant.id}:requested-output-edit-history:cards`,
        directFinalRows,
        expected,
        failures,
        rowsLabel: `${testCase.id}:${variant.id}:requested-output-edit-history:rows`,
        snapshotLabel: `${testCase.id}:${variant.id}:requested-output-edit-history`,
        store,
        studyMode: testCase.studyMode,
      });

      restoreRequestedOutputSaveLoadRoundtrip({
        applyOppositeDetour: () => {
          store.getState().startStudyMode(oppositeMode);
          appendOppositeDetourRows(store, oppositeMode);
        },
        directFinalRows,
        expected,
        expectedOppositeOutputs,
        failures,
        oppositeDefaultMessage:
          `${testCase.id}:${variant.id}: opposite-mode detour should reset to the opposite default requested outputs`,
        restoreSelectedMessage:
          `${testCase.id}:${variant.id}: edit-history save-load should restore the selected requested-output bundle`,
        saveFailureMessage:
          `${testCase.id}:${variant.id}: requested-output edit-history save should create a scenario`,
        saveLoadCardsLabel: `${testCase.id}:${variant.id}:requested-output-edit-history-save-load:cards`,
        saveLoadRowsLabel: `${testCase.id}:${variant.id}:requested-output-edit-history-save-load:rows`,
        saveLoadSnapshotLabel: `${testCase.id}:${variant.id}:requested-output-edit-history-save-load`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
      });
    }
  }

  expect(failures, failures.join("\n\n")).toEqual([]);
}

export async function runRepresentativeRequestedOutputRestoreGrid(): Promise<void> {
  expectRequiredCasesCovered();

  const store = await loadSnapshotStore();
  const failures: string[] = [];

  for (const testCase of representativeRequestedOutputCases()) {
    const directFinalRows = buildDirectFinalRows(testCase);
    const {
      expected,
      expectedDefaultOutputs,
      expectedOppositeOutputs,
      oppositeMode,
      selectedRequestedOutputs,
    } = prepareRequestedOutputDirectExpectation({
      acceptSelectedMessage:
        `${testCase.id}: representative requested-output bundle should be accepted before replay restore`,
      directFinalRows,
      directSnapshotLabel: `${testCase.id}:representative-requested-output-direct`,
      failures,
      openDefaultMessage:
        `${testCase.id}: representative requested-output replay should open with default requested outputs`,
      store,
      testCase,
    });

    for (const variant of CARD_HISTORY_VARIANTS) {
      runCompactReplayVariantBranch({
        expectedDefaultOutputs,
        failures,
        keepSelectedMessage:
          `${testCase.id}:${variant.id}: representative replay should accept the selected requested-output bundle`,
        openDefaultMessage:
          `${testCase.id}:${variant.id}: representative replay branch should open with default requested outputs`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
        testCase,
        variant,
      });
      assertRequestedOutputVariantProjection({
        cardsLabel: `${testCase.id}:${variant.id}:representative-requested-output-replay:cards`,
        directFinalRows,
        expected,
        failures,
        rowsLabel: `${testCase.id}:${variant.id}:representative-requested-output-replay:rows`,
        snapshotLabel: `${testCase.id}:${variant.id}:representative-requested-output-replay`,
        store,
        studyMode: testCase.studyMode,
      });

      restoreRequestedOutputSaveLoadRoundtrip({
        applyOppositeDetour: () => {
          store.getState().startStudyMode(oppositeMode);
          appendOppositeDetourRows(store, oppositeMode);
        },
        directFinalRows,
        expected,
        expectedOppositeOutputs,
        failures,
        oppositeDefaultMessage:
          `${testCase.id}:${variant.id}: representative opposite-mode detour should reset to the opposite default requested outputs`,
        restoreSelectedMessage:
          `${testCase.id}:${variant.id}: representative save-load should restore the selected requested-output bundle`,
        saveFailureMessage:
          `${testCase.id}:${variant.id}: representative requested-output restore save should create a scenario`,
        saveLoadCardsLabel: `${testCase.id}:${variant.id}:representative-requested-output-save-load:cards`,
        saveLoadRowsLabel: `${testCase.id}:${variant.id}:representative-requested-output-save-load:rows`,
        saveLoadSnapshotLabel: `${testCase.id}:${variant.id}:representative-requested-output-save-load`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
      });
    }
  }

  expect(failures, failures.join("\n\n")).toEqual([]);
}

export async function runRepresentativeRequestedOutputEditHistoryRestoreGrid(): Promise<void> {
  expectRequiredCasesCovered();

  const store = await loadSnapshotStore();
  const failures: string[] = [];

  for (const testCase of representativeRequestedOutputCases()) {
    const directFinalRows = buildDirectFinalRows(testCase);
    const {
      expected,
      expectedDefaultOutputs,
      expectedOppositeOutputs,
      oppositeMode,
      selectedRequestedOutputs,
    } = prepareRequestedOutputDirectExpectation({
      acceptSelectedMessage:
        `${testCase.id}: representative edit-history should accept the selected requested-output bundle`,
      directFinalRows,
      directSnapshotLabel: `${testCase.id}:representative-requested-output-edit-history-direct`,
      failures,
      openDefaultMessage:
        `${testCase.id}: representative edit-history branch should open with default requested outputs`,
      store,
      testCase,
    });

    for (const variant of SELECTED_EDIT_HISTORY_VARIANTS) {
      runEditHistoryVariantBranch({
        expectedDefaultOutputs,
        failures,
        keepSelectedMessage:
          `${testCase.id}:${variant.id}: representative edit-history replay should keep the selected requested-output bundle`,
        openDefaultMessage:
          `${testCase.id}:${variant.id}: representative edit-history replay should open with default requested outputs`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
        testCase,
        variant,
      });
      assertRequestedOutputVariantProjection({
        cardsLabel: `${testCase.id}:${variant.id}:representative-requested-output-edit-history:cards`,
        directFinalRows,
        expected,
        failures,
        rowsLabel: `${testCase.id}:${variant.id}:representative-requested-output-edit-history:rows`,
        snapshotLabel: `${testCase.id}:${variant.id}:representative-requested-output-edit-history`,
        store,
        studyMode: testCase.studyMode,
      });

      restoreRequestedOutputSaveLoadRoundtrip({
        applyOppositeDetour: () => {
          store.getState().startStudyMode(oppositeMode);
          appendOppositeDetourRows(store, oppositeMode);
        },
        directFinalRows,
        expected,
        expectedOppositeOutputs,
        failures,
        oppositeDefaultMessage:
          `${testCase.id}:${variant.id}: representative edit-history opposite-mode detour should reset to the opposite default requested outputs`,
        restoreSelectedMessage:
          `${testCase.id}:${variant.id}: representative edit-history save-load should restore the selected requested-output bundle`,
        saveFailureMessage:
          `${testCase.id}:${variant.id}: representative requested-output edit-history save should create a scenario`,
        saveLoadCardsLabel: `${testCase.id}:${variant.id}:representative-requested-output-edit-history-save-load:cards`,
        saveLoadRowsLabel: `${testCase.id}:${variant.id}:representative-requested-output-edit-history-save-load:rows`,
        saveLoadSnapshotLabel: `${testCase.id}:${variant.id}:representative-requested-output-edit-history-save-load`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
      });
    }
  }

  expect(failures, failures.join("\n\n")).toEqual([]);
}

export async function runRepresentativeRequestedOutputPartialRestoreGrid(): Promise<void> {
  expectRequiredCasesCovered();

  const store = await loadSnapshotStore();
  const failures: string[] = [];

  for (const testCase of representativeRequestedOutputCases()) {
    const directFinalRows = buildDirectFinalRows(testCase);
    const {
      expected,
      expectedDefaultOutputs,
      expectedOppositeOutputs,
      oppositeMode,
      selectedRequestedOutputs,
    } = prepareRequestedOutputDirectExpectation({
      acceptSelectedMessage:
        `${testCase.id}: representative partial-restore should accept the selected requested-output bundle`,
      directFinalRows,
      directSnapshotLabel: `${testCase.id}:representative-requested-output-partial-restore-direct`,
      failures,
      openDefaultMessage:
        `${testCase.id}: representative partial-restore branch should open with default requested outputs`,
      store,
      testCase,
    });

    for (const variant of SELECTED_DUPLICATE_SWAP_HISTORY_VARIANTS) {
      runPartialRestoreVariantBranch({
        expectedDefaultOutputs,
        failures,
        keepSelectedMessage:
          `${testCase.id}:${variant.id}: representative partial-restore replay should keep the selected requested-output bundle`,
        openDefaultMessage:
          `${testCase.id}:${variant.id}: representative partial-restore replay should open with default requested outputs`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
        testCase,
        variant,
      });
      assertRequestedOutputVariantProjection({
        cardsLabel: `${testCase.id}:${variant.id}:representative-requested-output-partial-restore:cards`,
        directFinalRows,
        expected,
        failures,
        rowsLabel: `${testCase.id}:${variant.id}:representative-requested-output-partial-restore:rows`,
        snapshotLabel: `${testCase.id}:${variant.id}:representative-requested-output-partial-restore`,
        store,
        studyMode: testCase.studyMode,
      });

      runPartialRestoreVariantBranch({
        expectedDefaultOutputs,
        failures,
        keepSelectedMessage:
          `${testCase.id}:${variant.id}: representative partial-restore replay should keep the selected requested-output bundle`,
        openDefaultMessage:
          `${testCase.id}:${variant.id}: representative partial-restore replay should open with default requested outputs`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
        testCase,
        variant,
      });
      restoreRequestedOutputSaveLoadRoundtrip({
        applyOppositeDetour: () => {
          store.getState().startStudyMode(oppositeMode);
          appendOppositeDetourRows(store, oppositeMode);
        },
        directFinalRows,
        expected,
        expectedOppositeOutputs,
        failures,
        oppositeDefaultMessage:
          `${testCase.id}:${variant.id}: representative partial-restore opposite-mode detour should reset to the opposite default requested outputs`,
        restoreSelectedMessage:
          `${testCase.id}:${variant.id}: representative partial-restore save-load should restore the selected requested-output bundle`,
        saveFailureMessage:
          `${testCase.id}:${variant.id}: representative partial-restore save should create a scenario`,
        saveLoadCardsLabel: `${testCase.id}:${variant.id}:representative-requested-output-partial-restore-save-load:cards`,
        saveLoadRowsLabel: `${testCase.id}:${variant.id}:representative-requested-output-partial-restore-save-load:rows`,
        saveLoadSnapshotLabel: `${testCase.id}:${variant.id}:representative-requested-output-partial-restore-save-load`,
        selectedRequestedOutputs,
        store,
        studyMode: testCase.studyMode,
      });
    }
  }

  expect(failures, failures.join("\n\n")).toEqual([]);
}
