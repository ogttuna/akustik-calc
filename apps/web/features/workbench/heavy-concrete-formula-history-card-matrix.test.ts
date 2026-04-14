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
    updateThickness: (id: string, thicknessMm: string) => void;
  };
};

type CardSnapshot = {
  status: "bound" | "live" | "needs_input" | "unsupported";
  value: string;
};

type TargetOutput = (typeof TARGET_OUTPUTS)[number];

type FormulaRouteSnapshot = {
  cards: Record<TargetOutput, CardSnapshot>;
  exactMatchId: string | null;
  estimateKind: string | null;
  floorSystemRatingsBasis: string | null;
  impactBasis: string | null;
  metricBasis: Partial<Record<TargetOutput | "LPrimeNW" | "LPrimeNTw" | "LnW", string>>;
  supported: readonly RequestedOutputId[];
  unsupported: readonly RequestedOutputId[];
  values: {
    deltaLw: number | null;
    lPrimeNTw: number | null;
    lPrimeNW: number | null;
    lnW: number | null;
    rw: number | null;
  };
};

const TARGET_OUTPUTS = ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"] as const satisfies readonly RequestedOutputId[];

const IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 2,
  receivingRoomVolumeM3: 55
};

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

const FORMULA_ROUTE_CASES: ReadonlyArray<{
  expected: FormulaRouteSnapshot;
  id: string;
  note: RegExp;
  rows: readonly AppendableRow[];
  split: {
    match: (row: LayerDraft) => boolean;
    parts: readonly [string, string];
  };
}> = [
  {
    id: "bare-concrete-formula-base-split-history",
    rows: [{ floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" }],
    split: {
      match: (row) => row.floorRole === "base_structure",
      parts: ["90", "90"]
    },
    note: /Bare heavy floor estimate used Ln,w .*164 - 35 log10/i,
    expected: {
      cards: {
        Rw: { status: "live", value: "58 dB" },
        "Ln,w": { status: "live", value: "71.8 dB" },
        DeltaLw: { status: "unsupported", value: "Not ready" },
        "L'n,w": { status: "live", value: "73.8 dB" },
        "L'nT,w": { status: "live", value: "71.4 dB" }
      },
      exactMatchId: null,
      estimateKind: null,
      floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      metricBasis: {
        LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
        LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
        LnW: "predictor_bare_massive_floor_iso12354_annexc_estimate"
      },
      supported: ["Rw", "Ln,w", "L'n,w", "L'nT,w"],
      unsupported: ["DeltaLw"],
      values: {
        deltaLw: null,
        lPrimeNTw: 71.4,
        lPrimeNW: 73.8,
        lnW: 71.8,
        rw: 58
      }
    }
  },
  {
    id: "laminate-eps-formula-covering-split-history",
    rows: [
      { floorRole: "floor_covering", materialId: "laminate_flooring", thicknessMm: "8" },
      { floorRole: "resilient_layer", materialId: "eps_underlay", thicknessMm: "3" },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" }
    ],
    split: {
      match: (row) => row.floorRole === "floor_covering",
      parts: ["3", "5"]
    },
    note: /Heavy floating-floor estimate used DeltaLw/i,
    expected: {
      cards: {
        Rw: { status: "live", value: "60 dB" },
        "Ln,w": { status: "live", value: "65.8 dB" },
        DeltaLw: { status: "live", value: "6 dB" },
        "L'n,w": { status: "live", value: "67.8 dB" },
        "L'nT,w": { status: "live", value: "65.4 dB" }
      },
      exactMatchId: null,
      estimateKind: null,
      floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      metricBasis: {
        DeltaLw: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
        LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
        LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
        LnW: "predictor_heavy_floating_floor_iso12354_annexc_estimate"
      },
      supported: ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"],
      unsupported: [],
      values: {
        deltaLw: 6,
        lPrimeNTw: 65.4,
        lPrimeNW: 67.8,
        lnW: 65.8,
        rw: 60
      }
    }
  },
  {
    id: "engineered-underlay-formula-covering-split-history",
    rows: [
      { floorRole: "floor_covering", materialId: "engineered_timber_flooring", thicknessMm: "15" },
      { floorRole: "resilient_layer", materialId: "generic_resilient_underlay", thicknessMm: "8" },
      { floorRole: "base_structure", materialId: "concrete", thicknessMm: "180" }
    ],
    split: {
      match: (row) => row.floorRole === "floor_covering",
      parts: ["5", "10"]
    },
    note: /Resonance check used f0/i,
    expected: {
      cards: {
        Rw: { status: "live", value: "60 dB" },
        "Ln,w": { status: "live", value: "51.5 dB" },
        DeltaLw: { status: "live", value: "20.3 dB" },
        "L'n,w": { status: "live", value: "53.5 dB" },
        "L'nT,w": { status: "live", value: "51.1 dB" }
      },
      exactMatchId: null,
      estimateKind: null,
      floorSystemRatingsBasis: "screening_mass_law_curve_seed_v3",
      impactBasis: "mixed_predicted_plus_estimated_standardized_field_volume_normalization",
      metricBasis: {
        DeltaLw: "predictor_heavy_floating_floor_iso12354_annexc_estimate",
        LPrimeNW: "estimated_field_lprimenw_from_lnw_plus_k",
        LPrimeNTw: "estimated_standardized_field_lprimentw_from_lprimenw_plus_room_volume",
        LnW: "predictor_heavy_floating_floor_iso12354_annexc_estimate"
      },
      supported: ["Rw", "Ln,w", "DeltaLw", "L'n,w", "L'nT,w"],
      unsupported: [],
      values: {
        deltaLw: 20.3,
        lPrimeNTw: 51.1,
        lPrimeNW: 53.5,
        lnW: 51.5,
        rw: 60
      }
    }
  }
];

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

function splitMatchingRowThroughHistory(
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
  notes: readonly string[];
  route: FormulaRouteSnapshot;
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
    notes: result.impact?.notes ?? [],
    route: {
      cards: Object.fromEntries(
        TARGET_OUTPUTS.map((output) => {
          const card = buildOutputCard({
            output,
            result,
            studyMode: "floor"
          });

          return [output, { status: card.status, value: card.value }];
        })
      ) as FormulaRouteSnapshot["cards"],
      exactMatchId: result.floorSystemMatch?.system.id ?? null,
      estimateKind: result.floorSystemEstimate?.kind ?? null,
      floorSystemRatingsBasis: result.floorSystemRatings?.basis ?? null,
      impactBasis: result.impact?.basis ?? null,
      metricBasis: result.impact?.metricBasis ?? {},
      supported: result.supportedTargetOutputs,
      unsupported: result.unsupportedTargetOutputs,
      values: {
        deltaLw: result.impact?.DeltaLw ?? null,
        lPrimeNTw: result.impact?.LPrimeNTw ?? null,
        lPrimeNW: result.impact?.LPrimeNW ?? null,
        lnW: result.impact?.LnW ?? null,
        rw: result.floorSystemRatings?.Rw ?? null
      }
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

describe("heavy concrete formula history card matrix", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each(FORMULA_ROUTE_CASES)(
    "keeps $id on its formula lane after source-equivalent splits and workbench history",
    async (testCase) => {
      const store = await setupFloorStore(testCase.rows);

      splitMatchingRowThroughHistory(store, testCase.split.match, testCase.split.parts);
      roundTripThroughMixedMode(store);

      const actual = snapshot(testCase.id, store.getState().rows);

      expect(actual.route).toEqual(testCase.expected);
      expect(actual.notes.some((note) => testCase.note.test(note))).toBe(true);
      expect(actual.warnings.some((warning) => /Screening estimate only/i.test(warning))).toBe(true);
    }
  );
});
