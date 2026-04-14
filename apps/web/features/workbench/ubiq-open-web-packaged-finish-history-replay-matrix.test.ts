import type { ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";
import type { LayerDraft } from "./workbench-store";

type AppendableRow = Omit<LayerDraft, "id">;

type StoreHandle = {
  getState: () => {
    appendRows: (rows: readonly AppendableRow[]) => void;
    duplicateRow: (id: string) => void;
    loadSavedScenario: (scenarioId: string) => void;
    moveRow: (id: string, direction: "up" | "down") => void;
    reset: () => void;
    rows: LayerDraft[];
    saveCurrentScenario: () => void;
    savedScenarios: Array<{ id: string }>;
    startStudyMode: (studyMode: "floor" | "wall") => void;
    updateMaterial: (id: string, materialId: string) => void;
    updateThickness: (id: string, thicknessMm: string) => void;
  };
};

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type TargetOutput = (typeof TARGET_OUTPUTS)[number];

type RouteSnapshot = {
  boundMatchId: string | null;
  cards: Record<TargetOutput, CardSnapshot>;
  exactMatchId: string | null;
  floorSystemEstimateKind: string | null;
  impactBasis: string | null;
  lowerBoundBasis: string | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];

const IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const WEAK_CARPET_EXACT_ID = "ubiq_fl27_open_web_steel_400_19mm_carpet_underlay_exact_lab_2026";
const SUPPORTED_TIMBER_EXACT_ID = "ubiq_fl28_open_web_steel_300_exact_lab_2026";
const SUPPORTED_CARPET_BOUND_ID = "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026";

const WEAK_CARPET_ROWS: readonly AppendableRow[] = [
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: "15" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "400" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" }
];

const SUPPORTED_CARPET_BOUND_ROWS: readonly AppendableRow[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: "12" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
];

const SUPPORTED_TIMBER_ROWS: readonly AppendableRow[] = [
  ...SUPPORTED_CARPET_BOUND_ROWS.slice(0, 5),
  { floorRole: "floor_covering", materialId: "engineered_timber_with_acoustic_underlay", thicknessMm: "12" },
  ...SUPPORTED_CARPET_BOUND_ROWS.slice(6)
];

const WALL_DETOUR_ROWS: readonly AppendableRow[] = [
  { materialId: "security_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "security_board", thicknessMm: "12.5" },
  { materialId: "ytong_aac_d700", thicknessMm: "100" },
  { materialId: "air_gap", thicknessMm: "50" },
  { materialId: "rockwool", thicknessMm: "40" },
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "gypsum_board", thicknessMm: "12.5" }
];

const FAIL_CLOSED_IMPACT_CARDS = {
  "Ln,w": { status: "unsupported", value: "Not ready" },
  CI: { status: "unsupported", value: "Not ready" },
  "Ln,w+CI": { status: "unsupported", value: "Not ready" },
  "L'n,w": { status: "needs_input", value: "Not ready" },
  "L'nT,w": { status: "needs_input", value: "Not ready" },
  "L'nT,50": { status: "needs_input", value: "Not ready" }
} as const satisfies Omit<Record<TargetOutput, CardSnapshot>, "Rw">;

const EXPECTED_WEAK_CARPET_EXACT_ROUTE: RouteSnapshot = {
  boundMatchId: null,
  cards: {
    Rw: { status: "live", value: "55 dB" },
    "Ln,w": { status: "live", value: "63 dB" },
    CI: { status: "live", value: "-1 dB" },
    "Ln,w+CI": { status: "live", value: "62 dB" },
    "L'n,w": { status: "live", value: "65 dB" },
    "L'nT,w": { status: "live", value: "62.6 dB" },
    "L'nT,50": { status: "live", value: "62 dB" }
  },
  exactMatchId: WEAK_CARPET_EXACT_ID,
  floorSystemEstimateKind: null,
  impactBasis: "mixed_exact_plus_estimated_local_guide",
  lowerBoundBasis: null,
  supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
  unsupported: []
};

const EXPECTED_SUPPORTED_CARPET_BOUND_ROUTE: RouteSnapshot = {
  boundMatchId: SUPPORTED_CARPET_BOUND_ID,
  cards: {
    Rw: { status: "live", value: "64 dB" },
    "Ln,w": { status: "unsupported", value: "Not ready" },
    CI: { status: "unsupported", value: "Not ready" },
    "Ln,w+CI": { status: "bound", value: "<= 45 dB" },
    "L'n,w": { status: "needs_input", value: "Not ready" },
    "L'nT,w": { status: "needs_input", value: "Not ready" },
    "L'nT,50": { status: "needs_input", value: "Not ready" }
  },
  exactMatchId: null,
  floorSystemEstimateKind: null,
  impactBasis: null,
  lowerBoundBasis: "official_floor_system_bound_support",
  supported: ["Rw", "Ln,w+CI"],
  unsupported: ["Ln,w", "CI", "L'n,w", "L'nT,w", "L'nT,50"]
};

const EXPECTED_SUPPORTED_TIMBER_EXACT_ROUTE: RouteSnapshot = {
  boundMatchId: null,
  cards: {
    Rw: { status: "live", value: "64 dB" },
    "Ln,w": { status: "live", value: "51 dB" },
    CI: { status: "live", value: "-2 dB" },
    "Ln,w+CI": { status: "live", value: "49 dB" },
    "L'n,w": { status: "live", value: "53 dB" },
    "L'nT,w": { status: "live", value: "50.6 dB" },
    "L'nT,50": { status: "live", value: "49 dB" }
  },
  exactMatchId: SUPPORTED_TIMBER_EXACT_ID,
  floorSystemEstimateKind: null,
  impactBasis: "mixed_exact_plus_estimated_local_guide",
  lowerBoundBasis: null,
  supported: ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"],
  unsupported: []
};

const EXPECTED_SUPPORTED_TIMBER_FALLBACK_ROUTE: RouteSnapshot = {
  ...EXPECTED_SUPPORTED_TIMBER_EXACT_ROUTE,
  exactMatchId: null,
  floorSystemEstimateKind: "family_archetype",
  impactBasis: "mixed_predicted_plus_estimated_local_guide"
};

const EXPECTED_SUPPORTED_TIMBER_SPLIT_WRONG_DECK_FALLBACK_ROUTE: RouteSnapshot = {
  ...EXPECTED_SUPPORTED_TIMBER_FALLBACK_ROUTE,
  cards: {
    Rw: { status: "live", value: "63.9 dB" },
    "Ln,w": { status: "live", value: "51.1 dB" },
    CI: { status: "live", value: "-1.9 dB" },
    "Ln,w+CI": { status: "live", value: "49.2 dB" },
    "L'n,w": { status: "live", value: "53.1 dB" },
    "L'nT,w": { status: "live", value: "50.7 dB" },
    "L'nT,50": { status: "live", value: "49.2 dB" }
  }
};

const EXPECTED_SUPPORTED_BOUND_FAIL_CLOSED_ROUTE: RouteSnapshot = {
  boundMatchId: null,
  cards: {
    Rw: { status: "live", value: "74 dB" },
    ...FAIL_CLOSED_IMPACT_CARDS
  },
  exactMatchId: null,
  floorSystemEstimateKind: null,
  impactBasis: null,
  lowerBoundBasis: null,
  supported: ["Rw"],
  unsupported: ["Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]
};

function createMemoryStorage(): Storage {
  const values = new Map<string, string>();

  return {
    clear() {
      values.clear();
    },
    getItem(key: string) {
      return values.has(key) ? values.get(key)! : null;
    },
    key(index: number) {
      return Array.from(values.keys())[index] ?? null;
    },
    get length() {
      return values.size;
    },
    removeItem(key: string) {
      values.delete(key);
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    }
  };
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

function splitFirstMatchingRowThroughHistory(
  store: StoreHandle,
  match: (row: LayerDraft) => boolean,
  parts: readonly [string, string]
) {
  const targetIndex = store.getState().rows.findIndex(match);

  expect(targetIndex).toBeGreaterThanOrEqual(0);

  const targetId = store.getState().rows[targetIndex]!.id;
  store.getState().duplicateRow(targetId);

  const rowsAfterDuplicate = store.getState().rows;
  const firstId = rowsAfterDuplicate[targetIndex]!.id;
  const secondId = rowsAfterDuplicate[targetIndex + 1]!.id;

  store.getState().updateThickness(firstId, parts[0]);
  store.getState().updateThickness(secondId, parts[1]);

  if (targetIndex + 2 < rowsAfterDuplicate.length) {
    moveCurrentRowToIndex(store, secondId, targetIndex + 2);
    moveCurrentRowToIndex(store, secondId, targetIndex + 1);
  }
}

function duplicateFirstMatchingRowThroughHistory(store: StoreHandle, match: (row: LayerDraft) => boolean) {
  const targetIndex = store.getState().rows.findIndex(match);

  expect(targetIndex).toBeGreaterThanOrEqual(0);

  const targetId = store.getState().rows[targetIndex]!.id;
  store.getState().duplicateRow(targetId);

  const duplicateId = store.getState().rows[targetIndex + 1]!.id;
  if (targetIndex + 2 < store.getState().rows.length) {
    moveCurrentRowToIndex(store, duplicateId, targetIndex + 2);
    moveCurrentRowToIndex(store, duplicateId, targetIndex + 1);
  }
}

function splitWeakExactStackThroughHistory(store: StoreHandle) {
  splitFirstMatchingRowThroughHistory(store, (row) => row.floorRole === "floor_covering", ["7", "8"]);
  splitFirstMatchingRowThroughHistory(store, (row) => row.floorRole === "base_structure", ["200", "200"]);
}

function splitSupportedStackThroughHistory(store: StoreHandle) {
  splitFirstMatchingRowThroughHistory(store, (row) => row.floorRole === "ceiling_fill", ["50", "95"]);
  splitFirstMatchingRowThroughHistory(store, (row) => row.floorRole === "ceiling_cavity", ["30", "35"]);
  splitFirstMatchingRowThroughHistory(store, (row) => row.floorRole === "floor_covering", ["4", "8"]);
  splitFirstMatchingRowThroughHistory(store, (row) => row.floorRole === "floating_screed", ["9", "10"]);
  splitFirstMatchingRowThroughHistory(store, (row) => row.floorRole === "base_structure", ["120", "180"]);
}

function updateMatchingMaterials(store: StoreHandle, match: (row: LayerDraft) => boolean, materialId: string) {
  const targets = store.getState().rows.filter(match);

  expect(targets.length).toBeGreaterThan(0);

  for (const target of targets) {
    store.getState().updateMaterial(target.id, materialId);
  }
}

function updateFirstMatchingThickness(store: StoreHandle, match: (row: LayerDraft) => boolean, thicknessMm: string) {
  const target = store.getState().rows.find(match);

  if (!target) {
    throw new Error(`Expected row for thickness switch to ${thicknessMm}.`);
  }

  store.getState().updateThickness(target.id, thicknessMm);
}

function roundTripThroughMixedMode(store: StoreHandle) {
  store.getState().saveCurrentScenario();

  const floorScenarioId = store.getState().savedScenarios.at(0)?.id;
  if (!floorScenarioId) {
    throw new Error("Expected a saved floor scenario id.");
  }

  store.getState().startStudyMode("wall");
  store.getState().appendRows(WALL_DETOUR_ROWS);
  store.getState().saveCurrentScenario();
  store.getState().startStudyMode("floor");
  store.getState().loadSavedScenario(floorScenarioId);
}

function snapshot(id: string, rows: readonly LayerDraft[]): {
  route: RouteSnapshot;
  warnings: readonly string[];
} {
  const evaluated = evaluateScenario({
    id,
    impactFieldContext: IMPACT_FIELD_CONTEXT,
    name: id,
    rows,
    source: "current",
    studyMode: "floor",
    targetOutputs: TARGET_OUTPUTS
  });

  expect(evaluated.result, `${id} should evaluate`).not.toBeNull();
  if (!evaluated.result) {
    throw new Error(`${id} did not evaluate.`);
  }

  const result = evaluated.result;

  return {
    route: {
      boundMatchId: result.boundFloorSystemMatch?.system.id ?? null,
      cards: Object.fromEntries(
        TARGET_OUTPUTS.map((output) => {
          const card = buildOutputCard({
            output,
            result,
            studyMode: "floor"
          });

          return [output, { status: card.status, value: card.value }];
        })
      ) as RouteSnapshot["cards"],
      exactMatchId: result.floorSystemMatch?.system.id ?? null,
      floorSystemEstimateKind: result.floorSystemEstimate?.kind ?? null,
      impactBasis: result.impact?.basis ?? null,
      lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
      supported: result.supportedTargetOutputs,
      unsupported: result.unsupportedTargetOutputs
    },
    warnings: evaluated.warnings
  };
}

async function setupFloorStore(rows: readonly AppendableRow[]): Promise<StoreHandle> {
  const { useWorkbenchStore } = await import("./workbench-store");
  const store = useWorkbenchStore as unknown as StoreHandle;

  store.getState().reset();
  store.getState().startStudyMode("floor");
  store.getState().appendRows(rows);

  return store;
}

describe("UBIQ open-web packaged finish history replay matrix", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps exact, bound, near-miss, and valid finish-switch routes stable after realistic workbench history", async () => {
    const cases: Array<{
      expected: RouteSnapshot;
      id: string;
      prepare: (store: StoreHandle) => void;
      rows: readonly AppendableRow[];
      warning?: RegExp;
    }> = [
      {
        id: "weak-carpet-exact-source-equivalent-split-history",
        rows: WEAK_CARPET_ROWS,
        prepare: splitWeakExactStackThroughHistory,
        expected: EXPECTED_WEAK_CARPET_EXACT_ROUTE,
        warning: /Curated exact floor-system match active: UBIQ FL-27/i
      },
      {
        id: "supported-carpet-bound-source-equivalent-split-history",
        rows: SUPPORTED_CARPET_BOUND_ROWS,
        prepare: splitSupportedStackThroughHistory,
        expected: EXPECTED_SUPPORTED_CARPET_BOUND_ROUTE,
        warning: /Curated bound-only floor-system match active: UBIQ FL-28/i
      },
      {
        id: "supported-carpet-bound-extra-board-history",
        rows: SUPPORTED_CARPET_BOUND_ROWS,
        prepare: (store) => {
          splitSupportedStackThroughHistory(store);
          duplicateFirstMatchingRowThroughHistory(store, (row) => row.floorRole === "ceiling_board");
        },
        expected: EXPECTED_SUPPORTED_BOUND_FAIL_CLOSED_ROUTE
      },
      {
        id: "supported-carpet-bound-to-timber-exact-switch-history",
        rows: SUPPORTED_CARPET_BOUND_ROWS,
        prepare: (store) => {
          splitSupportedStackThroughHistory(store);
          updateMatchingMaterials(
            store,
            (row) => row.floorRole === "floor_covering",
            "engineered_timber_with_acoustic_underlay"
          );
        },
        expected: EXPECTED_SUPPORTED_TIMBER_EXACT_ROUTE,
        warning: /Curated exact floor-system match active: UBIQ FL-28/i
      },
      {
        id: "supported-timber-wrong-deck-fallback-history",
        rows: SUPPORTED_TIMBER_ROWS,
        prepare: (store) => {
          splitSupportedStackThroughHistory(store);
          updateFirstMatchingThickness(store, (row) => row.floorRole === "base_structure", "125");
        },
        expected: EXPECTED_SUPPORTED_TIMBER_SPLIT_WRONG_DECK_FALLBACK_ROUTE
      }
    ];

    const failures: string[] = [];

    for (const testCase of cases) {
      const store = await setupFloorStore(testCase.rows);

      testCase.prepare(store);
      roundTripThroughMixedMode(store);

      const actual = snapshot(testCase.id, store.getState().rows);

      if (JSON.stringify(actual.route) !== JSON.stringify(testCase.expected)) {
        failures.push(`${testCase.id}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual.route)}`);
      }

      if (testCase.warning && !actual.warnings.some((warning) => testCase.warning?.test(warning))) {
        failures.push(`${testCase.id}: missing expected warning ${testCase.warning}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
