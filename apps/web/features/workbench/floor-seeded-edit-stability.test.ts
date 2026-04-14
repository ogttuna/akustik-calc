import type { AirborneContext, ImpactFieldContext, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getPresetById, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";

const FLOOR_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "DnT,w",
  "Ln,w",
  "DeltaLw",
  "Ln,w+CI",
  "L'n,w",
  "L'nT,w",
  "L'nT,50"
];

const AIRBORNE_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

const IMPACT_FIELD_CONTEXT: ImpactFieldContext = {
  fieldKDb: 3,
  receivingRoomVolumeM3: 60
};

const PRESET_IDS: readonly PresetId[] = [
  "heavy_concrete_impact_floor",
  "dataholz_clt_dry_exact",
  "ubiq_open_web_300_bound",
  "steel_suspended_fallback",
  "timber_bare_impact_only_fallback",
  "tuas_open_box_dry_exact"
];

const BASE_REPLACEMENTS = [
  { materialId: "concrete", thicknessMm: "150" },
  { materialId: "clt_panel", thicknessMm: "140" },
  { materialId: "open_box_timber_slab", thicknessMm: "370" },
  { materialId: "open_web_steel_floor", thicknessMm: "250" },
  { materialId: "hollow_core_plank", thicknessMm: "200" }
] as const;

const APPENDABLE_MATERIALS = [
  { materialId: "generic_resilient_underlay", thicknessMm: "8" },
  { materialId: "dry_floating_gypsum_fiberboard", thicknessMm: "25" },
  { materialId: "screed", thicknessMm: "30" },
  { materialId: "rockwool", thicknessMm: "90" },
  { materialId: "gypsum_board", thicknessMm: "13" }
] as const;

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

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pickIndex(rng: () => number, length: number) {
  return Math.floor(rng() * length);
}

function formatThicknessMm(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace(/\.0$/u, "");
}

function getOutputValue(
  result: NonNullable<ReturnType<typeof evaluateScenario>["result"]>,
  output: RequestedOutputId
): number | null | undefined {
  switch (output) {
    case "Rw":
      return result.floorSystemRatings?.Rw ?? result.metrics.estimatedRwDb;
    case "R'w":
      return result.metrics.estimatedRwPrimeDb;
    case "DnT,w":
      return result.metrics.estimatedDnTwDb;
    case "Ln,w":
      return result.impact?.LnW ?? result.lowerBoundImpact?.LnWUpperBound;
    case "DeltaLw":
      return result.impact?.DeltaLw ?? result.lowerBoundImpact?.DeltaLwLowerBound;
    case "Ln,w+CI":
      return result.impact?.LnWPlusCI ?? result.lowerBoundImpact?.LnWPlusCIUpperBound;
    case "L'n,w":
      return result.impact?.LPrimeNW ?? result.lowerBoundImpact?.LPrimeNWUpperBound;
    case "L'nT,w":
      return result.impact?.LPrimeNTw ?? result.lowerBoundImpact?.LPrimeNTwUpperBound;
    case "L'nT,50":
      return result.impact?.LPrimeNT50 ?? result.lowerBoundImpact?.LPrimeNT50UpperBound;
    default:
      return undefined;
  }
}

function isInsideBroadCorridor(output: RequestedOutputId, value: number) {
  switch (output) {
    case "Rw":
    case "R'w":
    case "DnT,w":
      return value >= 15 && value <= 95;
    case "DeltaLw":
      return value >= 0 && value <= 50;
    case "Ln,w":
    case "Ln,w+CI":
    case "L'n,w":
    case "L'nT,w":
    case "L'nT,50":
      return value >= 20 && value <= 100;
    default:
      return false;
  }
}

describe("floor seeded edit stability", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it(
    "keeps seeded floor edit sequences numerically sane across exact, family, bound, and fallback presets",
    async () => {
      const { useWorkbenchStore } = await import("./workbench-store");

      const evaluateCurrentFloor = (id: string) =>
        evaluateScenario({
          airborneContext: AIRBORNE_CONTEXT,
          id,
          impactFieldContext: IMPACT_FIELD_CONTEXT,
          name: id,
          rows: useWorkbenchStore.getState().rows,
          source: "current",
          studyMode: "floor",
          targetOutputs: FLOOR_OUTPUTS
        });

      const failures: string[] = [];
      const seeds = [2026040201, 2026040202, 2026040203, 2026040204] as const;

      for (const presetId of PRESET_IDS) {
        const preset = getPresetById(presetId);

        for (const seed of seeds) {
          const rng = mulberry32(seed);
          useWorkbenchStore.getState().reset();
          useWorkbenchStore.getState().loadPreset(presetId);

          for (let step = 0; step < 12; step += 1) {
            const state = useWorkbenchStore.getState();
            const rows = state.rows;
            const actionPool =
              rows.length >= 9 ? ["move", "tweak", "replaceBase", "remove"] : ["duplicate", "move", "tweak", "append", "replaceBase"];
            const action = actionPool[pickIndex(rng, actionPool.length)]!;

            if (action === "duplicate" && rows.length > 0) {
              state.duplicateRow(rows[pickIndex(rng, rows.length)]!.id);
            }

            if (action === "move" && rows.length > 1) {
              const rowIndex = pickIndex(rng, rows.length);
              const direction =
                rowIndex === 0 ? "down" : rowIndex === rows.length - 1 ? "up" : rng() < 0.5 ? "up" : "down";
              state.moveRow(rows[rowIndex]!.id, direction);
            }

            if (action === "tweak" && rows.length > 0) {
              const row = rows[pickIndex(rng, rows.length)]!;
              const thickness = Number.parseFloat(row.thicknessMm);
              if (Number.isFinite(thickness)) {
                const factor = [0.6, 0.8, 1.15, 1.35][pickIndex(rng, 4)]!;
                const nextThickness = formatThicknessMm(Math.min(450, Math.max(1, thickness * factor)));
                state.updateThickness(row.id, nextThickness);
              }
            }

            if (action === "append") {
              const next = APPENDABLE_MATERIALS[pickIndex(rng, APPENDABLE_MATERIALS.length)]!;
              state.appendMaterial(next.materialId, next.thicknessMm);
            }

            if (action === "replaceBase") {
              const replacement = BASE_REPLACEMENTS[pickIndex(rng, BASE_REPLACEMENTS.length)]!;
              state.replaceSingleBaseStructure(replacement.materialId, replacement.thicknessMm);
            }

            if (action === "remove" && rows.length > 2) {
              const removableRows = rows.filter((row) => row.floorRole !== "base_structure");
              const targetRows = removableRows.length > 0 ? removableRows : rows.slice(0, -1);
              state.removeRow(targetRows[pickIndex(rng, targetRows.length)]!.id);
            }

            const scenario = evaluateCurrentFloor(`${preset.id}-seed-${seed}-step-${step}`);

            if (!scenario.result) {
              failures.push(`${preset.label} seed=${seed} step=${step}: scenario result should stay available after ${action}`);
              continue;
            }

            if (!scenario.result.ok) {
              failures.push(`${preset.label} seed=${seed} step=${step}: engine result should remain ok after ${action}`);
            }

            if (scenario.result.supportedTargetOutputs.length === 0) {
              failures.push(`${preset.label} seed=${seed} step=${step}: expected at least one supported output after ${action}`);
            }

            const supported = new Set(scenario.result.supportedTargetOutputs);
            const unsupported = new Set(scenario.result.unsupportedTargetOutputs);

            for (const output of FLOOR_OUTPUTS) {
              if (supported.has(output) === unsupported.has(output)) {
                failures.push(
                  `${preset.label} seed=${seed} step=${step}: output ${output} should belong to exactly one support bucket after ${action}`
                );
              }

              if (supported.has(output)) {
                const value = getOutputValue(scenario.result, output);
                if (!(typeof value === "number" && Number.isFinite(value) && isInsideBroadCorridor(output, value))) {
                  failures.push(
                    `${preset.label} seed=${seed} step=${step}: supported output ${output} should stay finite and inside a broad corridor after ${action}, got ${String(value)}`
                  );
                }
              }

              const card = buildOutputCard({
                output,
                result: scenario.result,
                studyMode: "floor"
              });

              if ((card.status === "live" || card.status === "bound") && /not ready/i.test(card.value)) {
                failures.push(
                  `${preset.label} seed=${seed} step=${step}: ${output} card should not show "Not ready" when status is ${card.status} after ${action}`
                );
              }
            }
          }
        }
      }

      expect(failures).toEqual([]);
    },
    20000
  );
});
