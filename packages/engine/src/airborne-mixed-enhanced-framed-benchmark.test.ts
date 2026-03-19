import { createRequire } from "node:module";
import { existsSync } from "node:fs";

import { describe, expect, it } from "vitest";
import type { LayerInput } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

const require = createRequire(import.meta.url);
const DEFAULT_UPSTREAM_PATH = "/home/ogttuna/Dev/Machinity/Acoustic2";
const UPSTREAM_PATH = process.env.DYNECHO_UPSTREAM_PATH ?? DEFAULT_UPSTREAM_PATH;
const core = existsSync(UPSTREAM_PATH) ? require(`${UPSTREAM_PATH}/core.js`) : null;

const DYNECHO_TO_UPSTREAM_ALIASES: Record<string, string> = {
  gypsum_board: "gypsum",
  resilient_support: "resilient_channel",
  screed: "generic_screed"
};

const LAB_RW_TOLERANCE_DB = 1.0;
const FIELD_RW_PRIME_TOLERANCE_DB = 0.5;
const FIELD_DNTW_TOLERANCE_DB = 1.0;
const FIELD_DNTA_TOLERANCE_DB = 2.5;

const FAMILIES = [
  ["acoustic_gypsum_board", "firestop_board", 15, 15],
  ["acoustic_gypsum_board", "fire_board", 15, 15],
  ["acoustic_gypsum_board", "diamond_board", 15, 18],
  ["acoustic_gypsum_board", "silentboard", 15, 12.5],
  ["diamond_board", "firestop_board", 18, 15],
  ["diamond_board", "fire_board", 18, 15],
  ["diamond_board", "silentboard", 18, 12.5],
  ["firestop_board", "silentboard", 15, 12.5],
  ["fire_board", "silentboard", 15, 12.5]
] as const;

const FILLS = [35, 42, 50, 60] as const;
const CONTEXTS = {
  steelLab: {
    contextMode: "element_lab",
    connectionType: "line_connection",
    studType: "light_steel_stud",
    studSpacingMm: 600,
    airtightness: "good"
  },
  resilientLab: {
    contextMode: "element_lab",
    connectionType: "resilient_channel",
    studType: "resilient_stud",
    studSpacingMm: 625,
    airtightness: "good"
  },
  steelField: {
    contextMode: "field_between_rooms",
    connectionType: "line_connection",
    studType: "light_steel_stud",
    studSpacingMm: 600,
    airtightness: "good",
    perimeterSeal: "good",
    penetrationState: "none",
    junctionQuality: "good",
    sharedTrack: "independent",
    electricalBoxes: "none",
    panelWidthMm: 3000,
    panelHeightMm: 2600,
    receivingRoomVolumeM3: 32,
    receivingRoomRt60S: 0.5
  },
  resilientField: {
    contextMode: "field_between_rooms",
    connectionType: "resilient_channel",
    studType: "resilient_stud",
    studSpacingMm: 625,
    airtightness: "good",
    perimeterSeal: "good",
    penetrationState: "none",
    junctionQuality: "good",
    sharedTrack: "independent",
    electricalBoxes: "none",
    panelWidthMm: 3000,
    panelHeightMm: 2600,
    receivingRoomVolumeM3: 32,
    receivingRoomRt60S: 0.5
  }
} as const;

type ContextKey = keyof typeof CONTEXTS;

function translateLayersForUpstream(layers: readonly LayerInput[]): LayerInput[] {
  return layers.map((layer) => ({
    ...layer,
    materialId: DYNECHO_TO_UPSTREAM_ALIASES[layer.materialId] ?? layer.materialId
  }));
}

describe.skipIf(!core)("airborne mixed enhanced framed benchmark", () => {
  it(
    "keeps mixed enhanced filled single-board framed hybrids inside the upstream lab and field corridor",
    () => {
      const failures: Array<Record<string, unknown>> = [];
      let caseCount = 0;

      for (const [leftId, rightId, leftThicknessMm, rightThicknessMm] of FAMILIES) {
        for (const fillThicknessMm of FILLS) {
          const layers = [
            { materialId: leftId, thicknessMm: leftThicknessMm },
            { materialId: "rockwool", thicknessMm: fillThicknessMm },
            { materialId: rightId, thicknessMm: rightThicknessMm }
          ] as const;
          const upstreamLayers = translateLayersForUpstream(layers);

          for (const contextKey of Object.keys(CONTEXTS) as ContextKey[]) {
            caseCount += 1;
            const context = CONTEXTS[contextKey];
            const local = calculateAssembly(layers, {
              calculator: "dynamic",
              airborneContext: context,
              targetOutputs: contextKey.endsWith("Lab") ? ["Rw"] : undefined
            });
            const upstream = core.calculateAssembly(upstreamLayers, {
              calculator: "dynamic",
              meta: context
            });

            if (contextKey.endsWith("Lab")) {
              const localRw = local.ratings.iso717.Rw;
              const upstreamRw = upstream?.ratings?.iso717?.Rw ?? upstream?.ratings?.Rw ?? null;
              const deltaRw = typeof upstreamRw === "number" ? Number((localRw - upstreamRw).toFixed(1)) : null;

              if (!(typeof upstreamRw === "number") || Math.abs(deltaRw ?? 0) > LAB_RW_TOLERANCE_DB) {
                failures.push({
                  contextKey,
                  deltaRw,
                  fillThicknessMm,
                  id: `${leftId}+${rightId}+${fillThicknessMm}`,
                  localRw,
                  upstreamRw
                });
              }
              continue;
            }

            const localRwPrime = local.ratings.field?.RwPrime ?? null;
            const upstreamRwPrime = upstream?.ratings?.field?.RwPrime ?? null;
            const localDnTw = local.ratings.field?.DnTw ?? null;
            const upstreamDnTw = upstream?.ratings?.field?.DnTw ?? null;
            const localDnTA = local.ratings.field?.DnTA ?? null;
            const upstreamDnTA = upstream?.ratings?.field?.DnTA ?? null;

            const deltaRwPrime =
              typeof localRwPrime === "number" && typeof upstreamRwPrime === "number"
                ? Number((localRwPrime - upstreamRwPrime).toFixed(1))
                : null;
            const deltaDnTw =
              typeof localDnTw === "number" && typeof upstreamDnTw === "number"
                ? Number((localDnTw - upstreamDnTw).toFixed(1))
                : null;
            const deltaDnTA =
              typeof localDnTA === "number" && typeof upstreamDnTA === "number"
                ? Number((localDnTA - upstreamDnTA).toFixed(1))
                : null;

            if (
              !(typeof upstreamRwPrime === "number" && typeof upstreamDnTw === "number" && typeof upstreamDnTA === "number") ||
              Math.abs(deltaRwPrime ?? 0) > FIELD_RW_PRIME_TOLERANCE_DB ||
              Math.abs(deltaDnTw ?? 0) > FIELD_DNTW_TOLERANCE_DB ||
              Math.abs(deltaDnTA ?? 0) > FIELD_DNTA_TOLERANCE_DB
            ) {
              failures.push({
                contextKey,
                deltaDnTA,
                deltaDnTw,
                deltaRwPrime,
                fillThicknessMm,
                id: `${leftId}+${rightId}+${fillThicknessMm}`,
                localDnTA,
                localDnTw,
                localRwPrime,
                upstreamDnTA,
                upstreamDnTw,
                upstreamRwPrime
              });
            }
          }
        }
      }

      expect(caseCount).toBe(144);
      expect(failures).toEqual([]);
    },
    120_000
  );
});
