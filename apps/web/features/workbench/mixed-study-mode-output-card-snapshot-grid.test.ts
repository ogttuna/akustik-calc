import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  applySplitPlansToStore,
  createMemoryStorage,
  ROUTE_MIXED_GENERATED_CASES,
  SELECTED_DUPLICATE_SWAP_HISTORY_VARIANTS,
  SELECTED_ROUTE_MIXED_GENERATED_CASES,
} from "./mixed-study-mode-generated-test-helpers";
import {
  appendDirectRows,
  appendGeneratedRows,
  applyHistoryVariantToStore,
  applyPartialSplitToStore,
  assertProjectionEqual,
  assertRowsEqual,
  buildDirectFinalRows,
  cardSnapshotsForAppendableRows,
  cardSnapshotsForStore,
  CARD_HISTORY_VARIANTS,
  expectRequiredCasesCovered,
  expectSelectedCardGridCasesCovered,
  representativeRequiredCardGridCases,
  REQUIRED_CARD_GRID_CASE_IDS,
  runOppositeModeNoiseChain,
  type StoreHandle,
} from "./mixed-study-mode-output-card-snapshot-test-helpers";
import {
  runBroadRequestedOutputCompactReplayGrid,
  runBroadRequestedOutputEditHistoryRestoreGrid,
  runBroadRequestedOutputPartialRestoreGrid,
  runBroadRequestedOutputRestoreAfterCompactReplayGrid,
  runRepresentativeRequestedOutputEditHistoryRestoreGrid,
  runRepresentativeRequestedOutputPartialRestoreGrid,
  runRepresentativeRequestedOutputRestoreGrid,
  runSelectedRequestedOutputEditHistoryRestoreGrid,
  runSelectedRequestedOutputGeneratedHistoryRestoreGrid,
  runSelectedRequestedOutputPartialRestoreGrid,
} from "./mixed-study-mode-output-card-snapshot-requested-output-runners";

describe("mixed study-mode output-card snapshot grid", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps output cards stable across direct split detours and the compact broad replay grid", async () => {
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
      for (const variant of CARD_HISTORY_VARIANTS) {
        store.getState().reset();
        store.getState().startStudyMode(testCase.studyMode);
        appendGeneratedRows(store, testCase);
        applyHistoryVariantToStore(store, testCase, variant);
        assertRowsEqual(
          failures,
          `${testCase.id}:${variant.id}:rows`,
          store.getState().rows,
          directFinalRows,
        );
        assertProjectionEqual(
          failures,
          `${testCase.id}:${variant.id}:cards`,
          cardSnapshotsForStore(store, `${testCase.id}:${variant.id}`, testCase.studyMode),
          expected,
        );
      }
    }

    expect(failures, failures.join("\n\n")).toEqual([]);
  });

  it("keeps broad requested-output card routes stable across the compact replay grid", async () => {
    await runBroadRequestedOutputCompactReplayGrid();
  });

  it("keeps broad requested-output card routes stable across opposite-mode detours and save-load restores after compact replay", async () => {
    await runBroadRequestedOutputRestoreAfterCompactReplayGrid();
  });

  it("keeps broad requested-output card routes stable across edit-history replay and save-load restores", async () => {
    await runBroadRequestedOutputEditHistoryRestoreGrid();
  });

  it("keeps broad requested-output card routes stable after expanded partial-edit restore and save-load roundtrips", async () => {
    await runBroadRequestedOutputPartialRestoreGrid();
  }, 10000);

  it("keeps selected seeded boundary route output cards stable after expanded partial-edit restore and save-load roundtrips", async () => {
    expectRequiredCasesCovered();
    expectSelectedCardGridCasesCovered();

    const { useWorkbenchStore } = await import("./workbench-store");
    const store = useWorkbenchStore as StoreHandle;
    const failures: string[] = [];

    for (const testCase of SELECTED_ROUTE_MIXED_GENERATED_CASES) {
      const directFinalRows = buildDirectFinalRows(testCase);
      const expected = cardSnapshotsForAppendableRows(
        store,
        `${testCase.id}:expected-final`,
        directFinalRows,
        testCase.studyMode,
      );

      for (const variant of SELECTED_DUPLICATE_SWAP_HISTORY_VARIANTS) {
        store.getState().reset();
        store.getState().startStudyMode(testCase.studyMode);
        appendGeneratedRows(store, testCase);
        applyPartialSplitToStore(store, testCase, variant);
        runOppositeModeNoiseChain(store, testCase);
        store.getState().startStudyMode(testCase.studyMode);
        appendGeneratedRows(store, testCase);
        applyHistoryVariantToStore(store, testCase, variant);
        assertRowsEqual(
          failures,
          `${testCase.id}:partial-restore:${variant.id}:rows`,
          store.getState().rows,
          directFinalRows,
        );
        assertProjectionEqual(
          failures,
          `${testCase.id}:partial-restore:${variant.id}:cards`,
          cardSnapshotsForStore(
            store,
            `${testCase.id}:partial-restore:${variant.id}`,
            testCase.studyMode,
          ),
          expected,
        );

        store.getState().reset();
        store.getState().startStudyMode(testCase.studyMode);
        appendGeneratedRows(store, testCase);
        applyPartialSplitToStore(store, testCase, variant);
        runOppositeModeNoiseChain(store, testCase);
        store.getState().startStudyMode(testCase.studyMode);
        appendGeneratedRows(store, testCase);
        applyHistoryVariantToStore(store, testCase, variant);
        store.getState().saveCurrentScenario();

        const savedScenario = store.getState().savedScenarios[0];

        if (!savedScenario) {
          failures.push(`${testCase.id}:save-load:${variant.id} missing saved scenario`);
          continue;
        }

        runOppositeModeNoiseChain(store, testCase);
        store.getState().loadSavedScenario(savedScenario.id);
        assertRowsEqual(
          failures,
          `${testCase.id}:save-load:${variant.id}:rows`,
          store.getState().rows,
          directFinalRows,
        );
        assertProjectionEqual(
          failures,
          `${testCase.id}:save-load:${variant.id}:cards`,
          cardSnapshotsForStore(
            store,
            `${testCase.id}:save-load:${variant.id}`,
            testCase.studyMode,
          ),
          expected,
        );
      }
    }

    expect(failures, failures.join("\n\n")).toEqual([]);
  });

  it("keeps selected seeded boundary route requested-output cards stable after expanded partial-edit restore and save-load roundtrips", async () => {
    await runSelectedRequestedOutputPartialRestoreGrid();
  });

  it("keeps selected seeded boundary route requested-output card posture stable across long generated-history replay and save-load restores", async () => {
    await runSelectedRequestedOutputGeneratedHistoryRestoreGrid();
  });

  it("keeps selected seeded boundary route requested-output card posture stable across edit-history replay and save-load restores", async () => {
    await runSelectedRequestedOutputEditHistoryRestoreGrid();
  });

  it("keeps representative broad output-card routes stable across opposite-mode detours and save-load restores after compact replay", async () => {
    expectRequiredCasesCovered();

    const { useWorkbenchStore } = await import("./workbench-store");
    const store = useWorkbenchStore as StoreHandle;
    const failures: string[] = [];
    const requiredCases = representativeRequiredCardGridCases();

    expect(requiredCases.map((testCase) => testCase.id)).toEqual(REQUIRED_CARD_GRID_CASE_IDS);

    for (const testCase of requiredCases) {
      const directFinalRows = buildDirectFinalRows(testCase);
      const expected = cardSnapshotsForAppendableRows(
        store,
        `${testCase.id}:representative-restore-direct`,
        directFinalRows,
        testCase.studyMode,
      );

      for (const variant of CARD_HISTORY_VARIANTS) {
        store.getState().reset();
        store.getState().startStudyMode(testCase.studyMode);
        appendGeneratedRows(store, testCase);
        applyHistoryVariantToStore(store, testCase, variant);
        store.getState().saveCurrentScenario();

        const savedScenario = store.getState().savedScenarios[0];

        if (!savedScenario) {
          failures.push(`${testCase.id}:${variant.id}: representative restore save should create a scenario`);
          continue;
        }

        runOppositeModeNoiseChain(store, testCase);
        store.getState().startStudyMode(testCase.studyMode);
        appendGeneratedRows(store, testCase);
        applyHistoryVariantToStore(store, testCase, variant);

        assertRowsEqual(
          failures,
          `${testCase.id}:${variant.id}:representative-restore-after-detour:rows`,
          store.getState().rows,
          directFinalRows,
        );
        assertProjectionEqual(
          failures,
          `${testCase.id}:${variant.id}:representative-restore-after-detour:cards`,
          cardSnapshotsForStore(
            store,
            `${testCase.id}:${variant.id}:representative-restore-after-detour`,
            testCase.studyMode,
          ),
          expected,
        );

        runOppositeModeNoiseChain(store, testCase);
        store.getState().loadSavedScenario(savedScenario.id);

        assertRowsEqual(
          failures,
          `${testCase.id}:${variant.id}:representative-save-load-restore:rows`,
          store.getState().rows,
          directFinalRows,
        );
        assertProjectionEqual(
          failures,
          `${testCase.id}:${variant.id}:representative-save-load-restore:cards`,
          cardSnapshotsForStore(
            store,
            `${testCase.id}:${variant.id}:representative-save-load-restore`,
            testCase.studyMode,
          ),
          expected,
        );
      }
    }

    expect(failures, failures.join("\n\n")).toEqual([]);
  });

  it("keeps representative requested-output cards stable across opposite-mode detours and save-load restores after compact replay", async () => {
    await runRepresentativeRequestedOutputRestoreGrid();
  });

  it("keeps representative requested-output cards stable across edit-history replay and save-load restores", async () => {
    await runRepresentativeRequestedOutputEditHistoryRestoreGrid();
  });

  it("keeps representative requested-output cards stable after expanded partial-edit restore and save-load roundtrips", async () => {
    await runRepresentativeRequestedOutputPartialRestoreGrid();
  });


});
