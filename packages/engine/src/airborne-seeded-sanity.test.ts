import { describe, expect, it } from "vitest";

import { calculateAssembly } from "./calculate-assembly";

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, values: readonly T[]): T {
  return values[Math.floor(rng() * values.length)]!;
}

function layer(materialId: string, thicknessMm: number) {
  return { materialId, thicknessMm };
}

function layerFrom(entry: readonly [string, number]) {
  return layer(entry[0], entry[1]);
}

function makeLeaf(
  rng: () => number,
  boardCount: number,
  boardIds: readonly string[],
  boardThicknesses: readonly number[]
) {
  const out: Array<{ materialId: string; thicknessMm: number }> = [];
  for (let index = 0; index < boardCount; index += 1) {
    out.push(layer(pick(rng, boardIds), pick(rng, boardThicknesses)));
  }
  return out;
}

function makeRealisticTwoLeafAssembly(rng: () => number) {
  const boardIds = ["gypsum_board", "firestop_board", "diamond_board", "silentboard", "acoustic_gypsum_board"] as const;
  const boardThicknesses = [12.5, 15] as const;
  const leftBoards = 1 + Math.floor(rng() * 3);
  const rightBoards = 1 + Math.floor(rng() * 3);
  const cavityMode = pick(rng, ["gap_fill", "fill_only", "split"] as const);
  const layers = [...makeLeaf(rng, leftBoards, boardIds, boardThicknesses)];

  if (cavityMode === "fill_only") {
    layers.push(layer("rockwool", pick(rng, [40, 50, 60, 75, 90] as const)));
  } else if (cavityMode === "split") {
    const totalThickness = pick(rng, [90, 120, 150] as const);
    const fillThickness = pick(rng, [40, 50, 60] as const);
    const remaining = Math.max(totalThickness - fillThickness, 20);
    const leftGap = Math.round(remaining / 2);
    const rightGap = remaining - leftGap;
    layers.push(layer("air_gap", leftGap));
    layers.push(layer("rockwool", fillThickness));
    layers.push(layer("air_gap", rightGap));
  } else {
    layers.push(layer("air_gap", pick(rng, [25, 42, 50, 75, 90] as const)));
    layers.push(layer("rockwool", pick(rng, [40, 50, 60, 75, 90] as const)));
  }

  layers.push(...makeLeaf(rng, rightBoards, boardIds, boardThicknesses));
  return layers;
}

function makePathologicalHybrid(rng: () => number) {
  const outerThin = [
    ["gypsum_board", 12.5],
    ["firestop_board", 15],
    ["security_board", 12.5]
  ] as const;
  const mids = [
    ["ytong_aac_d700", 50],
    ["pumice_block", 80],
    ["concrete", 80],
    ["cement_plaster", 15],
    ["skim_plaster", 5]
  ] as const;
  const fills = [
    ["rockwool", 50],
    ["air_gap", 25]
  ] as const;
  const leftOuter = pick(rng, outerThin);
  const rightOuter = pick(rng, outerThin);
  const midA = pick(rng, mids);
  const midB = pick(rng, mids);
  const fillA = pick(rng, fills);
  const fillB = pick(rng, fills);

  return [
    layer(leftOuter[0], leftOuter[1]),
    layer(fillA[0], fillA[1]),
    layer(midA[0], midA[1]),
    layer(fillB[0], fillB[1]),
    layer(midB[0], midB[1]),
    layer(rightOuter[0], rightOuter[1])
  ];
}

function makeMixedAssembly(rng: () => number) {
  const solids = [
    ["gypsum_board", 12.5],
    ["firestop_board", 15],
    ["diamond_board", 12.5],
    ["ytong_aac_d700", 50],
    ["pumice_block", 80],
    ["concrete", 80],
    ["cement_plaster", 15],
    ["skim_plaster", 5],
    ["security_board", 12.5]
  ] as const;
  const compliant = [
    ["air_gap", 25],
    ["air_gap", 50],
    ["rockwool", 50]
  ] as const;
  const layerCount = 4 + Math.floor(rng() * 5);
  const layers = [layerFrom(pick(rng, solids))];

  for (let index = 1; index < layerCount - 1; index += 1) {
    if (rng() < 0.35) {
      layers.push(layerFrom(pick(rng, compliant)));
    } else {
      layers.push(layerFrom(pick(rng, solids)));
    }
  }

  layers.push(layerFrom(pick(rng, solids)));
  return layers;
}

describe("airborne seeded sanity", () => {
  it("keeps seeded realistic field sweeps inside the broad apparent-vs-lab corridor", () => {
    const rng = mulberry32(20260402);
    let minDelta = Number.POSITIVE_INFINITY;
    let maxDelta = Number.NEGATIVE_INFINITY;

    for (let index = 0; index < 60; index += 1) {
      const layers = makeRealisticTwoLeafAssembly(rng);
      const lab = calculateAssembly(layers, {
        calculator: "dynamic",
        airborneContext: {
          contextMode: "element_lab",
          connectionType: "line_connection",
          studType: "light_steel_stud",
          studSpacingMm: 600,
          airtightness: "good"
        }
      });
      const field = calculateAssembly(layers, {
        calculator: "dynamic",
        airborneContext: {
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
        }
      });
      const rwPrime = field.ratings.iso717.RwPrime ?? -Infinity;
      const delta = rwPrime - lab.ratings.iso717.Rw;
      minDelta = Math.min(minDelta, delta);
      maxDelta = Math.max(maxDelta, delta);

      expect(rwPrime).toBeLessThanOrEqual(lab.ratings.iso717.Rw + 0.25);
      expect(rwPrime).toBeGreaterThanOrEqual(lab.ratings.iso717.Rw - 20);
    }

    expect(minDelta).toBeGreaterThanOrEqual(-20);
    expect(maxDelta).toBeLessThanOrEqual(0.25);
  }, 15000);

  it("keeps seeded pathological hybrids monotonic under reinforcement in lab and field", () => {
    const rng = mulberry32(20260403);

    for (let index = 0; index < 60; index += 1) {
      const baseLayers = makePathologicalHybrid(rng);
      const reinforcedLayers = [
        layer(pick(rng, ["gypsum_board", "firestop_board"] as const), pick(rng, [12.5, 15] as const)),
        ...baseLayers
      ];
      const base = calculateAssembly(baseLayers, {
        calculator: "dynamic",
        airborneContext: {
          contextMode: "element_lab",
          airtightness: "good"
        }
      });
      const reinforced = calculateAssembly(reinforcedLayers, {
        calculator: "dynamic",
        airborneContext: {
          contextMode: "element_lab",
          airtightness: "good"
        }
      });
      const baseField = calculateAssembly(baseLayers, {
        calculator: "dynamic",
        airborneContext: {
          contextMode: "field_between_rooms",
          airtightness: "good",
          perimeterSeal: "good",
          penetrationState: "none",
          junctionQuality: "good",
          panelWidthMm: 3000,
          panelHeightMm: 2600,
          receivingRoomVolumeM3: 30,
          receivingRoomRt60S: 0.5
        }
      });
      const reinforcedField = calculateAssembly(reinforcedLayers, {
        calculator: "dynamic",
        airborneContext: {
          contextMode: "field_between_rooms",
          airtightness: "good",
          perimeterSeal: "good",
          penetrationState: "none",
          junctionQuality: "good",
          panelWidthMm: 3000,
          panelHeightMm: 2600,
          receivingRoomVolumeM3: 30,
          receivingRoomRt60S: 0.5
        }
      });

      expect(reinforced.ratings.iso717.Rw).toBeGreaterThanOrEqual(base.ratings.iso717.Rw);
      expect(reinforcedField.ratings.field?.DnTw ?? -Infinity).toBeGreaterThanOrEqual(baseField.ratings.field?.DnTw ?? -Infinity);
      expect(reinforcedField.ratings.iso717.RwPrime ?? -Infinity).toBeGreaterThanOrEqual(
        (baseField.ratings.iso717.RwPrime ?? -Infinity) - 1
      );
    }
  });

  it("keeps seeded realistic assembly reverse-order symmetry inside a broad tolerance band", () => {
    const rng = mulberry32(20260415);
    let maxDrift = 0;

    for (let index = 0; index < 72; index += 1) {
      const layers = makeRealisticTwoLeafAssembly(rng);
      const airborneContext = pick(rng, [
        {
          contextMode: "element_lab",
          airtightness: "good"
        },
        {
          contextMode: "element_lab",
          connectionType: "line_connection",
          studType: "light_steel_stud",
          studSpacingMm: 600,
          airtightness: "good"
        },
        {
          contextMode: "element_lab",
          connectionType: "resilient_channel",
          studType: "resilient_stud",
          studSpacingMm: 625,
          airtightness: "good"
        },
        {
          contextMode: "field_between_rooms",
          connectionType: "line_connection",
          studType: "light_steel_stud",
          studSpacingMm: 600,
          airtightness: "good",
          perimeterSeal: "good",
          penetrationState: "none",
          junctionQuality: "good",
          panelWidthMm: 2800,
          panelHeightMm: 2600,
          receivingRoomVolumeM3: 34,
          receivingRoomRt60S: 0.5
        },
        {
          contextMode: "field_between_rooms",
          connectionType: "resilient_channel",
          studType: "resilient_stud",
          studSpacingMm: 625,
          airtightness: "good",
          perimeterSeal: "good",
          penetrationState: "none",
          junctionQuality: "good",
          panelWidthMm: 2800,
          panelHeightMm: 2600,
          receivingRoomVolumeM3: 34,
          receivingRoomRt60S: 0.5
        }
      ] as const);
      const reversed = [...layers].reverse();
      const base = calculateAssembly(layers, { calculator: "dynamic", airborneContext });
      const mirrored = calculateAssembly(reversed, { calculator: "dynamic", airborneContext });
      const baseMetric =
        airborneContext.contextMode === "field_between_rooms"
          ? (base.ratings.iso717.RwPrime ?? -Infinity)
          : base.ratings.iso717.Rw;
      const mirroredMetric =
        airborneContext.contextMode === "field_between_rooms"
          ? (mirrored.ratings.iso717.RwPrime ?? -Infinity)
          : mirrored.ratings.iso717.Rw;
      const drift = Math.abs(baseMetric - mirroredMetric);
      maxDrift = Math.max(maxDrift, drift);

      expect(drift).toBeLessThanOrEqual(3);
    }

    expect(maxDrift).toBeLessThanOrEqual(3);
  }, 15000);

  it("keeps seeded mixed assemblies numerically sane in lab and field", () => {
    const rng = mulberry32(20260404);
    let minLab = Number.POSITIVE_INFINITY;
    let maxLab = Number.NEGATIVE_INFINITY;
    let minField = Number.POSITIVE_INFINITY;
    let maxField = Number.NEGATIVE_INFINITY;

    for (let index = 0; index < 60; index += 1) {
      const layers = makeMixedAssembly(rng);
      const lab = calculateAssembly(layers, {
        calculator: "dynamic",
        airborneContext: {
          contextMode: "element_lab",
          airtightness: pick(rng, ["good", "average"] as const)
        }
      });
      const field = calculateAssembly(layers, {
        calculator: "dynamic",
        airborneContext: {
          contextMode: "field_between_rooms",
          airtightness: "good",
          perimeterSeal: pick(rng, ["good", "average"] as const),
          penetrationState: pick(rng, ["none", "minor"] as const),
          junctionQuality: pick(rng, ["good", "average"] as const),
          panelWidthMm: 2800,
          panelHeightMm: 2600,
          receivingRoomVolumeM3: 34,
          receivingRoomRt60S: 0.5
        }
      });

      minLab = Math.min(minLab, lab.ratings.iso717.Rw);
      maxLab = Math.max(maxLab, lab.ratings.iso717.Rw);
      minField = Math.min(minField, field.ratings.iso717.RwPrime ?? -Infinity);
      maxField = Math.max(maxField, field.ratings.iso717.RwPrime ?? -Infinity);

      expect(Number.isFinite(lab.ratings.iso717.Rw)).toBe(true);
      expect(Number.isFinite(field.ratings.iso717.RwPrime ?? NaN)).toBe(true);
      expect(lab.ratings.iso717.Rw).toBeGreaterThanOrEqual(0);
      expect(lab.ratings.iso717.Rw).toBeLessThanOrEqual(95);
      expect(field.ratings.iso717.RwPrime ?? -Infinity).toBeGreaterThanOrEqual(0);
      expect(field.ratings.iso717.RwPrime ?? Infinity).toBeLessThanOrEqual(95);
    }

    expect(minLab).toBeGreaterThanOrEqual(0);
    expect(maxLab).toBeLessThanOrEqual(95);
    expect(minField).toBeGreaterThanOrEqual(0);
    expect(maxField).toBeLessThanOrEqual(95);
  });
});
