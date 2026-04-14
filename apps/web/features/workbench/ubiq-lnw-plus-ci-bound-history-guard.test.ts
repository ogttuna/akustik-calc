import type { RequestedOutputId } from "@dynecho/shared";
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
    updateThickness: (id: string, thicknessMm: string) => void;
  };
};

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type TargetOutput = (typeof TARGET_OUTPUTS)[number];

type RouteSnapshot = {
  boundFloorSystemMatchId: string | null;
  cards: Record<TargetOutput, CardSnapshot>;
  exactMatchId: string | null;
  floorSystemEstimateKind: string | null;
  impactBasis: string | null;
  lPrimeNT50: number | null;
  lPrimeNTw: number | null;
  lPrimeNW: number | null;
  lnW: number | null;
  lnWPlusCI: number | null;
  lnWPlusCIUpperBound: number | null;
  lnWUpperBound: number | null;
  lowerBoundBasis: string | null;
  rw: number | null;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
};

const UBIQ_CARPET_BOUND_ID = "ubiq_fl28_open_web_steel_300_19mm_carpet_lnw_plus_ci_bound_lab_2026";
const TARGET_OUTPUTS = ["Rw", "Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"] as const satisfies readonly RequestedOutputId[];
const IMPACT_FIELD_CONTEXT = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

const UBIQ_CARPET_ROWS: readonly AppendableRow[] = [
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_board", materialId: "firestop_board", thicknessMm: "16" },
  { floorRole: "ceiling_fill", materialId: "rockwool", thicknessMm: "145" },
  { floorRole: "ceiling_cavity", materialId: "ubiq_resilient_ceiling", thicknessMm: "65" },
  { floorRole: "floor_covering", materialId: "carpet_with_foam_underlay", thicknessMm: "12" },
  { floorRole: "floating_screed", materialId: "inex_floor_panel", thicknessMm: "19" },
  { floorRole: "base_structure", materialId: "open_web_steel_floor", thicknessMm: "300" }
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

const EXPECTED_EQUIVALENT_SPLIT_ROWS: readonly AppendableRow[] = [
  ...UBIQ_CARPET_ROWS.slice(0, 3),
  { ...UBIQ_CARPET_ROWS[3]!, thicknessMm: "50" },
  { ...UBIQ_CARPET_ROWS[3]!, thicknessMm: "95" },
  { ...UBIQ_CARPET_ROWS[4]!, thicknessMm: "30" },
  { ...UBIQ_CARPET_ROWS[4]!, thicknessMm: "35" },
  { ...UBIQ_CARPET_ROWS[5]!, thicknessMm: "4" },
  { ...UBIQ_CARPET_ROWS[5]!, thicknessMm: "8" },
  { ...UBIQ_CARPET_ROWS[6]!, thicknessMm: "9" },
  { ...UBIQ_CARPET_ROWS[6]!, thicknessMm: "10" },
  { ...UBIQ_CARPET_ROWS[7]!, thicknessMm: "120" },
  { ...UBIQ_CARPET_ROWS[7]!, thicknessMm: "180" }
];

const EXPECTED_OFFICIAL_ROUTE: RouteSnapshot = {
  boundFloorSystemMatchId: UBIQ_CARPET_BOUND_ID,
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
  lPrimeNT50: null,
  lPrimeNTw: null,
  lPrimeNW: null,
  lnW: null,
  lnWPlusCI: null,
  lnWPlusCIUpperBound: 45,
  lnWUpperBound: null,
  lowerBoundBasis: "official_floor_system_bound_support",
  rw: 64,
  supported: ["Rw", "Ln,w+CI"],
  unsupported: ["Ln,w", "CI", "L'n,w", "L'nT,w", "L'nT,50"]
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

function normalizeRows(rows: readonly LayerDraft[]): readonly AppendableRow[] {
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

function splitOfficialBoundStackThroughHistory(store: StoreHandle) {
  splitFirstMatchingRowThroughHistory(store, (row) => row.floorRole === "ceiling_fill", ["50", "95"]);
  splitFirstMatchingRowThroughHistory(store, (row) => row.floorRole === "ceiling_cavity", ["30", "35"]);
  splitFirstMatchingRowThroughHistory(store, (row) => row.floorRole === "floor_covering", ["4", "8"]);
  splitFirstMatchingRowThroughHistory(store, (row) => row.floorRole === "floating_screed", ["9", "10"]);
  splitFirstMatchingRowThroughHistory(store, (row) => row.floorRole === "base_structure", ["120", "180"]);
}

function roundTripThroughMixedMode(store: StoreHandle) {
  store.getState().saveCurrentScenario();

  const floorScenarioId = store.getState().savedScenarios.at(-1)?.id;
  if (!floorScenarioId) {
    throw new Error("Expected a saved floor scenario id.");
  }

  store.getState().startStudyMode("wall");
  store.getState().appendRows(WALL_DETOUR_ROWS);
  store.getState().saveCurrentScenario();
  store.getState().startStudyMode("floor");
  store.getState().loadSavedScenario(floorScenarioId);
}

function moveCeilingFillBetweenSplitCarpets(store: StoreHandle) {
  const fillId = store.getState().rows.find((row) => row.floorRole === "ceiling_fill")?.id;
  const firstCarpetIndex = store.getState().rows.findIndex((row) => row.floorRole === "floor_covering");

  if (!fillId || firstCarpetIndex < 0) {
    throw new Error("Expected ceiling fill and split carpet rows.");
  }

  moveCurrentRowToIndex(store, fillId, firstCarpetIndex);
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
      boundFloorSystemMatchId: result.boundFloorSystemMatch?.system.id ?? null,
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
      lPrimeNT50: result.impact?.LPrimeNT50 ?? null,
      lPrimeNTw: result.impact?.LPrimeNTw ?? null,
      lPrimeNW: result.impact?.LPrimeNW ?? null,
      lnW: result.impact?.LnW ?? null,
      lnWPlusCI: result.impact?.LnWPlusCI ?? null,
      lnWPlusCIUpperBound: result.lowerBoundImpact?.LnWPlusCIUpperBound ?? null,
      lnWUpperBound: result.lowerBoundImpact?.LnWUpperBound ?? null,
      lowerBoundBasis: result.lowerBoundImpact?.basis ?? null,
      rw: result.floorSystemRatings?.Rw ?? null,
      supported: result.supportedTargetOutputs,
      unsupported: result.unsupportedTargetOutputs
    },
    warnings: evaluated.warnings
  };
}

describe("UBIQ Ln,w+CI bound workbench history guard", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps equivalent split rows on the official combined bound through save/load and mode switches", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");
    const store = useWorkbenchStore as unknown as StoreHandle;

    store.getState().reset();
    store.getState().startStudyMode("floor");
    store.getState().appendRows(UBIQ_CARPET_ROWS);
    splitOfficialBoundStackThroughHistory(store);
    roundTripThroughMixedMode(store);

    const actualRows = normalizeRows(store.getState().rows);
    expect(actualRows).toEqual(EXPECTED_EQUIVALENT_SPLIT_ROWS);

    const actual = snapshot("ubiq-lnw-plus-ci-equivalent-split-history", store.getState().rows);

    expect(actual.route).toEqual(EXPECTED_OFFICIAL_ROUTE);
    expect(
      actual.warnings.some((warning) => /Curated bound-only floor-system match active: UBIQ FL-28/i.test(warning))
    ).toBe(true);
  });

  it("keeps disjoint carpet edits off official bound cards after history round-trip", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");
    const store = useWorkbenchStore as unknown as StoreHandle;

    store.getState().reset();
    store.getState().startStudyMode("floor");
    store.getState().appendRows(UBIQ_CARPET_ROWS);
    splitFirstMatchingRowThroughHistory(store, (row) => row.floorRole === "floor_covering", ["4", "8"]);
    moveCeilingFillBetweenSplitCarpets(store);
    roundTripThroughMixedMode(store);

    const actual = snapshot("ubiq-lnw-plus-ci-disjoint-carpet-history", store.getState().rows);

    expect(actual.route.boundFloorSystemMatchId).toBeNull();
    expect(actual.route.lowerBoundBasis).toBeNull();
    expect(actual.route.lnWPlusCIUpperBound).toBeNull();
    expect(actual.route.lnWUpperBound).toBeNull();
    expect(actual.route.impactBasis).toBeNull();
    expect(actual.route.lnW).toBeNull();
    expect(actual.route.lnWPlusCI).toBeNull();
    expect(actual.route.cards["Ln,w+CI"].status).toBe("unsupported");
    expect(actual.route.cards["Ln,w+CI"].value).toBe("Not ready");
    expect(actual.route.floorSystemEstimateKind).toBeNull();
    expect(actual.route.supported).toEqual(["Rw"]);
    expect(actual.route.unsupported).toEqual(["Ln,w", "CI", "Ln,w+CI", "L'n,w", "L'nT,w", "L'nT,50"]);
    expect(actual.warnings.some((warning) => /single-entry floor roles are duplicated: floor covering x2/i.test(warning))).toBe(
      true
    );
  });
});
