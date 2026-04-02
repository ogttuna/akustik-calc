import type { AirborneContext, RequestedOutputId } from "@dynecho/shared";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { evaluateScenario } from "./scenario-analysis";
import { buildOutputCard } from "./simple-workbench-output-model";

const WALL_LAB_OUTPUTS: readonly RequestedOutputId[] = ["Rw", "STC", "C", "Ctr"];
const WALL_FIELD_OUTPUTS: readonly RequestedOutputId[] = ["R'w", "Dn,w", "DnT,w", "DnT,A"];

const WALL_FIELD_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

const APPENDABLE_MATERIALS = [
  { materialId: "gypsum_board", thicknessMm: "12.5" },
  { materialId: "firestop_board", thicknessMm: "15" },
  { materialId: "diamond_board", thicknessMm: "12.5" },
  { materialId: "rockwool", thicknessMm: "50" },
  { materialId: "air_gap", thicknessMm: "50" },
  { materialId: "concrete", thicknessMm: "80" }
] as const;

const REPLACEMENT_MATERIALS = [
  "gypsum_board",
  "firestop_board",
  "diamond_board",
  "security_board",
  "rockwool",
  "air_gap",
  "concrete",
  "ytong_aac_d700",
  "pumice_block",
  "cement_plaster"
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

function getWallOutputValue(
  result: NonNullable<ReturnType<typeof evaluateScenario>["result"]>,
  output: RequestedOutputId
): number | null | undefined {
  switch (output) {
    case "Rw":
      return result.metrics.estimatedRwDb;
    case "STC":
      return result.metrics.estimatedStc;
    case "C":
      return result.metrics.estimatedCDb;
    case "Ctr":
      return result.metrics.estimatedCtrDb;
    case "R'w":
      return result.metrics.estimatedRwPrimeDb;
    case "Dn,w":
      return result.metrics.estimatedDnWDb;
    case "DnT,w":
      return result.metrics.estimatedDnTwDb;
    case "DnT,A":
      return result.metrics.estimatedDnTADb;
    default:
      return undefined;
  }
}

function isInsideBroadCorridor(output: RequestedOutputId, value: number) {
  switch (output) {
    case "Rw":
    case "STC":
    case "R'w":
    case "Dn,w":
    case "DnT,w":
    case "DnT,A":
      return value >= 15 && value <= 95;
    case "C":
    case "Ctr":
      return value >= -25 && value <= 10;
    default:
      return false;
  }
}

describe("wall seeded edit stability", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal("localStorage", createMemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps seeded wall edit sequences numerically sane across lab and field outputs", async () => {
    const { useWorkbenchStore } = await import("./workbench-store");
    const failures: string[] = [];
    const seeds = [2026040211, 2026040212, 2026040213, 2026040214] as const;

    const evaluateCurrentWall = (id: string, targetOutputs: readonly RequestedOutputId[], airborneContext?: AirborneContext | null) =>
      evaluateScenario({
        airborneContext: airborneContext ?? null,
        id,
        name: id,
        rows: useWorkbenchStore.getState().rows,
        source: "current",
        studyMode: "wall",
        targetOutputs
      });

    for (const seed of seeds) {
      const rng = mulberry32(seed);
      useWorkbenchStore.getState().reset();
      useWorkbenchStore.getState().startStudyMode("wall");
      useWorkbenchStore.getState().loadPreset("concrete_wall");

      for (let step = 0; step < 14; step += 1) {
        const state = useWorkbenchStore.getState();
        const rows = state.rows;
        const actionPool =
          rows.length >= 9 ? ["move", "tweak", "replaceMaterial", "remove"] : ["duplicate", "move", "tweak", "append", "replaceMaterial", "remove"];
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
            const nextThickness = formatThicknessMm(Math.min(300, Math.max(1, thickness * factor)));
            state.updateThickness(row.id, nextThickness);
          }
        }

        if (action === "append") {
          const next = APPENDABLE_MATERIALS[pickIndex(rng, APPENDABLE_MATERIALS.length)]!;
          state.appendMaterial(next.materialId, next.thicknessMm);
        }

        if (action === "replaceMaterial" && rows.length > 0) {
          const row = rows[pickIndex(rng, rows.length)]!;
          const materialId = REPLACEMENT_MATERIALS[pickIndex(rng, REPLACEMENT_MATERIALS.length)]!;
          state.updateMaterial(row.id, materialId);
        }

        if (action === "remove" && rows.length > 2) {
          state.removeRow(rows[pickIndex(rng, rows.length)]!.id);
        }

        const labScenario = evaluateCurrentWall(`wall-lab-seed-${seed}-step-${step}`, WALL_LAB_OUTPUTS);
        const fieldScenario = evaluateCurrentWall(`wall-field-seed-${seed}-step-${step}`, WALL_FIELD_OUTPUTS, WALL_FIELD_CONTEXT);

        for (const [label, scenario, outputs] of [
          ["lab", labScenario, WALL_LAB_OUTPUTS],
          ["field", fieldScenario, WALL_FIELD_OUTPUTS]
        ] as const) {
          if (!scenario.result) {
            failures.push(`seed=${seed} step=${step} ${label}: scenario result should stay available after ${action}`);
            continue;
          }

          if (!scenario.result.ok) {
            failures.push(`seed=${seed} step=${step} ${label}: engine result should remain ok after ${action}`);
          }

          if (scenario.result.supportedTargetOutputs.length === 0) {
            failures.push(`seed=${seed} step=${step} ${label}: expected at least one supported output after ${action}`);
          }

          const supported = new Set(scenario.result.supportedTargetOutputs);
          const unsupported = new Set(scenario.result.unsupportedTargetOutputs);

          for (const output of outputs) {
            if (supported.has(output) === unsupported.has(output)) {
              failures.push(`seed=${seed} step=${step} ${label}: output ${output} should belong to exactly one support bucket after ${action}`);
            }

            if (supported.has(output)) {
              const value = getWallOutputValue(scenario.result, output);
              if (!(typeof value === "number" && Number.isFinite(value) && isInsideBroadCorridor(output, value))) {
                failures.push(
                  `seed=${seed} step=${step} ${label}: supported output ${output} should stay finite and inside a broad corridor after ${action}, got ${String(value)}`
                );
              }
            }

            const card = buildOutputCard({
              output,
              result: scenario.result,
              studyMode: "wall"
            });

            if (card.status === "live" && /not ready/i.test(card.value)) {
              failures.push(`seed=${seed} step=${step} ${label}: ${output} card should not show "Not ready" when live after ${action}`);
            }
          }
        }
      }
    }

    expect(failures).toEqual([]);
  }, 20000);
});
