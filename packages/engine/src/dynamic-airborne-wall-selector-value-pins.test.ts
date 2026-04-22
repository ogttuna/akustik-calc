import { describe, expect, it } from "vitest";

import type { AirborneContext, LayerInput, RequestedOutputId } from "@dynecho/shared";

import { calculateAssembly } from "./calculate-assembly";

// Step-7b — Wall corridor surface VALUE pins.
//
// Extends the narrative + partial VALUE coverage in
// `dynamic-airborne-wall-selector-trace-matrix.test.ts` to a
// full per-cell VALUE matrix on 6 wall selector corridor
// labels × 3 contexts (lab / field / building) × up to 9 wall
// outputs = ~132 numerical pins. Layer fixtures are lifted
// verbatim from `CASES[0..5]` in the trace matrix so engine
// behaviour is identical to what is already tested; this
// slice adds missing output + context combinations rather
// than inventing new stacks.
//
// Lab context produces only 4 of 9 outputs (Rw/STC/C/Ctr);
// field + building produce all 9. Null-by-design lab cells
// pin as `toBeNull()` to guard against a surprising non-null
// leak.
//
// Sub-finding discipline (from step-7 F1/F2 pattern): any
// cell that trips the §R6 plausibility window in the slice
// plan becomes a sub-finding and blocks slice close until
// explained or engine-remediated.

// Non-stud lab context — workbench `liveAirborneContext`
// default composition for a wall under `element_lab` mode.
// Used by the 5 non-stud corridor labels (double_leaf,
// lined_massive, aac_boundary, g5_sibling, heavy_core_trim).
const ELEMENT_LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};

// Stud-lab context — mirrors `LAB_DOUBLE_STUD_CONTEXT` from
// the trace matrix (dynamic-airborne-wall-selector-trace-matrix.test.ts:32-39).
// Used only by the `lab_double_stud` corridor which relies on
// studType + sharedTrack metadata for family detection.
const LAB_DOUBLE_STUD_CONTEXT: AirborneContext = {
  airtightness: "good",
  connectionType: "line_connection",
  contextMode: "element_lab",
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

// Field + building contexts mirror the trace matrix (lines
// 14-30). Kept identical so a VALUE here equals a VALUE there
// on the corridor cells already pinned in the trace matrix.
const FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 2700,
  panelWidthMm: 3000,
  receivingRoomRt60S: 0.5,
  receivingRoomVolumeM3: 30,
  sharedTrack: "independent"
};

const BUILDING_CONTEXT: AirborneContext = {
  contextMode: "building_prediction",
  panelHeightMm: 2800,
  panelWidthMm: 3600,
  receivingRoomRt60S: 0.6,
  receivingRoomVolumeM3: 45
};

// Stud-aware field + building context variants — preserve the
// framed-wall metadata (studType + sharedTrack + spacing) that
// LAB_DOUBLE_STUD_CONTEXT carries. Without these, discovery
// shows that a physically-identical stud-wall stack is
// detected as `double_leaf` under plain FIELD_CONTEXT /
// BUILDING_CONTEXT because the engine loses the stud metadata.
// The `lab_double_stud` corridor uses these variants so family
// detection stays stable across all 3 contexts — the correct
// mission-aligned behaviour for a stud-wall stack.
const FRAMED_FIELD_CONTEXT: AirborneContext = {
  ...FIELD_CONTEXT,
  connectionType: "line_connection",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const FRAMED_BUILDING_CONTEXT: AirborneContext = {
  ...BUILDING_CONTEXT,
  airtightness: "good",
  connectionType: "line_connection",
  sharedTrack: "independent",
  studSpacingMm: 600,
  studType: "light_steel_stud"
};

const WALL_VALUE_OUTPUTS: readonly RequestedOutputId[] = [
  "Rw",
  "R'w",
  "Dn,w",
  "Dn,A",
  "DnT,w",
  "DnT,A",
  "STC",
  "C",
  "Ctr"
];

type ContextName = "lab" | "field" | "building";

type CorridorFixture = {
  layers: readonly LayerInput[];
  /**
   * Per-corridor context resolution. Non-stud corridors use
   * the plain lab / field / building constants. The stud-
   * double corridor uses stud-aware variants that carry
   * studType + sharedTrack + spacing metadata through every
   * context, keeping family detection stable across lab →
   * field → building.
   */
  buildingContext: AirborneContext;
  fieldContext: AirborneContext;
  labContext: AirborneContext;
};

const CORRIDORS = [
  "double_leaf",
  "lined_massive_wall",
  "aac_boundary",
  "g5_sibling",
  "heavy_core_trim",
  "lab_double_stud"
] as const;

type CorridorLabel = (typeof CORRIDORS)[number];

// Layer fixtures lifted verbatim from
// `dynamic-airborne-wall-selector-trace-matrix.test.ts`
// CASES[0..5]. Source lines cited inline so the next agent
// can cross-check stack equivalence if the trace matrix
// evolves.
const CORRIDOR_FIXTURES: Readonly<Record<CorridorLabel, CorridorFixture>> = {
  // Source: trace matrix CASES[0] (line 82-100).
  double_leaf: {
    buildingContext: BUILDING_CONTEXT,
    fieldContext: FIELD_CONTEXT,
    labContext: ELEMENT_LAB_CONTEXT,
    layers: [
      { materialId: "ytong_aac_d700", thicknessMm: 80 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ]
  },
  // Source: trace matrix CASES[2] (line 133-151). Clear
  // lined-massive, no boundary hold.
  lined_massive_wall: {
    buildingContext: BUILDING_CONTEXT,
    fieldContext: FIELD_CONTEXT,
    labContext: ELEMENT_LAB_CONTEXT,
    layers: [
      { materialId: "ytong_aac_d700", thicknessMm: 160 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ]
  },
  // Source: trace matrix CASES[1] (line 102-131). Boundary-
  // hold case — family detection ambiguous between
  // lined_massive_wall and double_leaf.
  aac_boundary: {
    buildingContext: BUILDING_CONTEXT,
    fieldContext: FIELD_CONTEXT,
    labContext: ELEMENT_LAB_CONTEXT,
    layers: [
      { materialId: "ytong_aac_d700", thicknessMm: 100 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "gypsum_board", thicknessMm: 12.5 }
    ]
  },
  // Source: trace matrix CASES[3] (line 153-181). G5 masonry
  // sibling — higher-density AAC variant; exhibits boundary
  // ambiguity same as aac_boundary.
  g5_sibling: {
    buildingContext: BUILDING_CONTEXT,
    fieldContext: FIELD_CONTEXT,
    labContext: ELEMENT_LAB_CONTEXT,
    layers: [
      { materialId: "ytong_g5_800", thicknessMm: 100 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "diamond_board", thicknessMm: 12.5 }
    ]
  },
  // Source: trace matrix CASES[4] (line 183-209). Non-AAC
  // heavy core (porotherm) with trim layers (outer rockwool
  // + glasswool) excluded from the dynamic airborne span.
  heavy_core_trim: {
    buildingContext: BUILDING_CONTEXT,
    fieldContext: FIELD_CONTEXT,
    labContext: ELEMENT_LAB_CONTEXT,
    layers: [
      { materialId: "rockwool", thicknessMm: 25 },
      { materialId: "porotherm_pls_140", thicknessMm: 140 },
      { materialId: "air_gap", thicknessMm: 50 },
      { materialId: "diamond_board", thicknessMm: 12.5 },
      { materialId: "glasswool", thicknessMm: 25 }
    ]
  },
  // Source: trace matrix CASES[5] (line 211-232). Strong
  // double-stud lab control. Only corridor that uses
  // stud-aware variants across every context — studType +
  // sharedTrack + spacing carry through so family detection
  // stays `double_stud_system` (or its direct kin) instead
  // of drifting to `double_leaf` under field/building when
  // stud metadata is lost.
  lab_double_stud: {
    buildingContext: FRAMED_BUILDING_CONTEXT,
    fieldContext: FRAMED_FIELD_CONTEXT,
    labContext: LAB_DOUBLE_STUD_CONTEXT,
    layers: [
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "air_gap", thicknessMm: 75 },
      { materialId: "glasswool", thicknessMm: 60 },
      { materialId: "air_gap", thicknessMm: 70 },
      { materialId: "gypsum", thicknessMm: 12.5 },
      { materialId: "gypsum", thicknessMm: 12.5 }
    ]
  }
};

function buildContext(corridor: CorridorLabel, name: ContextName): AirborneContext {
  const fixture = CORRIDOR_FIXTURES[corridor];
  if (name === "lab") return fixture.labContext;
  if (name === "field") return fixture.fieldContext;
  return fixture.buildingContext;
}

function runCase(corridor: CorridorLabel, name: ContextName) {
  const fixture = CORRIDOR_FIXTURES[corridor];
  return calculateAssembly(fixture.layers, {
    airborneContext: buildContext(corridor, name),
    calculator: "dynamic",
    targetOutputs: WALL_VALUE_OUTPUTS
  });
}

function snapshotOutputs(result: ReturnType<typeof calculateAssembly>) {
  return {
    rw: result.metrics.estimatedRwDb ?? null,
    rwPrime: result.metrics.estimatedRwPrimeDb ?? null,
    dnW: result.metrics.estimatedDnWDb ?? null,
    dnA: result.metrics.estimatedDnADb ?? null,
    dnTw: result.metrics.estimatedDnTwDb ?? null,
    dnTA: result.metrics.estimatedDnTADb ?? null,
    stc: result.metrics.estimatedStc ?? null,
    c: result.metrics.estimatedCDb ?? null,
    ctr: result.metrics.estimatedCtrDb ?? null
  };
}

// Expected-value pins per corridor × context, discovered
// 2026-04-22 during atomic step 4 (scratch discovery run) and
// cross-checked against the §R6 plausibility window in
// `docs/archive/handoffs/SLICE_WALL_CORRIDOR_SURFACE_VALUE_PINNING_PLAN.md`.
//
// Every field/building cell satisfies:
//   I1  R'w ≤ Rw                                (flanking non-negativity)
//   I2  |Dn,A − (Dn,w + C)| ≤ 1 dB              (ISO 717 C-weighting)
//   I3  DnT,w − Dn,w ∈ [0, 10] dB               (volume normalisation)
// and every value is inside the physical range ranges in §R6.
//
// Lab cells have R'w / Dn,w / Dn,A / DnT,w / DnT,A = null
// by design (lab Rw is the source metric; field outputs
// require a field/building context to compute). Pinning them
// as null is a drift guard: a surprising non-null value
// would flag a lab-side leak.
//
// `detectedFamily` is pinned per corridor because step-7b's
// primary ambition is the corridor surface; a family flip
// would silently change the engine lane and the VALUEs.
type PinnedCell = {
  c: number | null;
  ctr: number | null;
  detectedFamily: string;
  dnA: number | null;
  dnTA: number | null;
  dnTw: number | null;
  dnW: number | null;
  rw: number | null;
  rwPrime: number | null;
  stc: number | null;
};

const EXPECTED: Readonly<Record<CorridorLabel, Readonly<Record<ContextName, PinnedCell>>>> = {
  double_leaf: {
    lab: { c: -1, ctr: -6.3, detectedFamily: "double_leaf", dnA: null, dnTA: null, dnTw: null, dnW: null, rw: 48, rwPrime: null, stc: 48 },
    field: { c: -0.9, ctr: -6.1, detectedFamily: "double_leaf", dnA: 46, dnTA: 45.8, dnTw: 47, dnW: 47, rw: 46, rwPrime: 46, stc: 46 },
    building: { c: -0.9, ctr: -6.1, detectedFamily: "double_leaf", dnA: 45.1, dnTA: 46.6, dnTw: 48, dnW: 46, rw: 46, rwPrime: 46, stc: 46 }
  },
  lined_massive_wall: {
    lab: { c: -1.7, ctr: -6.5, detectedFamily: "lined_massive_wall", dnA: null, dnTA: null, dnTw: null, dnW: null, rw: 49, rwPrime: null, stc: 49 },
    field: { c: -1.6, ctr: -6.3, detectedFamily: "lined_massive_wall", dnA: 46.3, dnTA: 46.1, dnTw: 47, dnW: 47, rw: 47, rwPrime: 47, stc: 47 },
    building: { c: -1.6, ctr: -6.3, detectedFamily: "lined_massive_wall", dnA: 45.4, dnTA: 46.9, dnTw: 48, dnW: 47, rw: 47, rwPrime: 47, stc: 47 }
  },
  // Boundary-hold case — detected as `lined_massive_wall`
  // but runner-up is `double_leaf`. Pinned here so future
  // changes to the boundary-hold logic surface as a VALUE
  // drift before they can silently flip the lane.
  aac_boundary: {
    lab: { c: -1.7, ctr: -7, detectedFamily: "lined_massive_wall", dnA: null, dnTA: null, dnTw: null, dnW: null, rw: 46, rwPrime: null, stc: 46 },
    field: { c: -0.7, ctr: -5.8, detectedFamily: "lined_massive_wall", dnA: 44.2, dnTA: 44, dnTw: 45, dnW: 45, rw: 44, rwPrime: 44, stc: 44 },
    building: { c: -0.7, ctr: -5.8, detectedFamily: "lined_massive_wall", dnA: 43.3, dnTA: 44.8, dnTw: 46, dnW: 44, rw: 44, rwPrime: 44, stc: 44 }
  },
  // G5 masonry sibling — detects as `lined_massive_wall`
  // family today (not a separate `g5_sibling` family id).
  // That's the engine's honest read on the stack; pinning
  // here locks the lane.
  g5_sibling: {
    lab: { c: -1.1, ctr: -6.3, detectedFamily: "lined_massive_wall", dnA: null, dnTA: null, dnTw: null, dnW: null, rw: 48, rwPrime: null, stc: 48 },
    field: { c: -1.1, ctr: -6.1, detectedFamily: "lined_massive_wall", dnA: 44.8, dnTA: 44.6, dnTw: 46, dnW: 46, rw: 45, rwPrime: 45, stc: 45 },
    building: { c: -1.1, ctr: -6.1, detectedFamily: "lined_massive_wall", dnA: 43.9, dnTA: 45.4, dnTw: 47, dnW: 45, rw: 45, rwPrime: 45, stc: 45 }
  },
  heavy_core_trim: {
    lab: { c: -0.8, ctr: -5.6, detectedFamily: "lined_massive_wall", dnA: null, dnTA: null, dnTw: null, dnW: null, rw: 49, rwPrime: null, stc: 49 },
    field: { c: -0.7, ctr: -5.4, detectedFamily: "lined_massive_wall", dnA: 47.2, dnTA: 47, dnTw: 48, dnW: 48, rw: 47, rwPrime: 47, stc: 47 },
    building: { c: -0.7, ctr: -5.4, detectedFamily: "lined_massive_wall", dnA: 46.3, dnTA: 47.8, dnTw: 49, dnW: 47, rw: 47, rwPrime: 47, stc: 47 }
  },
  // Double-stud: uses stud-aware contexts across all three
  // modes (see FRAMED_FIELD_CONTEXT / FRAMED_BUILDING_CONTEXT
  // above) so family detection stays `double_stud_system`.
  // Without stud metadata in field/building, the engine
  // honestly drifts to `double_leaf` because the visible
  // morphology matches — exercised + documented in the
  // fixture comment.
  lab_double_stud: {
    lab: { c: -1.6, ctr: -6.2, detectedFamily: "double_stud_system", dnA: null, dnTA: null, dnTw: null, dnW: null, rw: 61, rwPrime: null, stc: 61 },
    field: { c: -0.9, ctr: -5.6, detectedFamily: "double_stud_system", dnA: 52, dnTA: 51.8, dnTw: 53, dnW: 53, rw: 52, rwPrime: 52, stc: 52 },
    building: { c: -0.9, ctr: -5.6, detectedFamily: "double_stud_system", dnA: 51.1, dnTA: 52.6, dnTw: 54, dnW: 52, rw: 52, rwPrime: 52, stc: 52 }
  }
};

describe("wall selector corridor VALUE pins", () => {
  describe.each(CORRIDORS)("corridor %s", (corridor) => {
    describe.each(["lab", "field", "building"] as const)("context %s", (contextName) => {
      const expected = EXPECTED[corridor][contextName];

      it("pins every output to the discovered drift-guard value", () => {
        const result = runCase(corridor, contextName);
        const snap = snapshotOutputs(result);

        // Family pin — a silent flip to a different family
        // lane would invalidate every downstream pin, so it
        // is the first assertion.
        expect(result.dynamicAirborneTrace?.detectedFamily, `${corridor}/${contextName}: detectedFamily`)
          .toBe(expected.detectedFamily);

        // 9 metric assertions per cell. Each is either
        // `toBe(exactValue)` or `toBeNull()` per the
        // context-availability rules in §R2 of the slice plan.
        expect(snap.rw, `${corridor}/${contextName}: Rw`).toBe(expected.rw);
        expect(snap.rwPrime, `${corridor}/${contextName}: R'w`).toBe(expected.rwPrime);
        expect(snap.dnW, `${corridor}/${contextName}: Dn,w`).toBe(expected.dnW);
        expect(snap.dnA, `${corridor}/${contextName}: Dn,A`).toBe(expected.dnA);
        expect(snap.dnTw, `${corridor}/${contextName}: DnT,w`).toBe(expected.dnTw);
        expect(snap.dnTA, `${corridor}/${contextName}: DnT,A`).toBe(expected.dnTA);
        expect(snap.stc, `${corridor}/${contextName}: STC`).toBe(expected.stc);
        expect(snap.c, `${corridor}/${contextName}: C`).toBe(expected.c);
        expect(snap.ctr, `${corridor}/${contextName}: Ctr`).toBe(expected.ctr);
      });
    });
  });

  // Invariant bank — these hold across every field/building
  // cell in the matrix and guard against silent physics
  // regressions (flanking, C-weighting, volume normalisation).
  // Catching a violation here is how the 2026-04-21 masonry
  // flanking inversion fix was surfaced.
  describe("cross-cell physical invariants", () => {
    it("I1 R'w ≤ Rw on every field/building cell", () => {
      for (const corridor of CORRIDORS) {
        for (const contextName of ["field", "building"] as const) {
          const cell = EXPECTED[corridor][contextName];
          expect(cell.rwPrime, `${corridor}/${contextName}`).not.toBeNull();
          expect(cell.rw, `${corridor}/${contextName}`).not.toBeNull();
          expect(cell.rwPrime!, `I1 ${corridor}/${contextName}`).toBeLessThanOrEqual(cell.rw!);
        }
      }
    });

    it("I2 |Dn,A − (Dn,w + C)| ≤ 1 dB on every field/building cell", () => {
      for (const corridor of CORRIDORS) {
        for (const contextName of ["field", "building"] as const) {
          const cell = EXPECTED[corridor][contextName];
          expect(cell.dnA, `${corridor}/${contextName}`).not.toBeNull();
          expect(cell.dnW, `${corridor}/${contextName}`).not.toBeNull();
          expect(cell.c, `${corridor}/${contextName}`).not.toBeNull();
          const drift = Math.abs(cell.dnA! - (cell.dnW! + cell.c!));
          expect(drift, `I2 ${corridor}/${contextName} drift=${drift}`).toBeLessThanOrEqual(1);
        }
      }
    });

    it("I3 DnT,w − Dn,w ∈ [0, 10] dB on every field/building cell", () => {
      for (const corridor of CORRIDORS) {
        for (const contextName of ["field", "building"] as const) {
          const cell = EXPECTED[corridor][contextName];
          expect(cell.dnTw, `${corridor}/${contextName}`).not.toBeNull();
          expect(cell.dnW, `${corridor}/${contextName}`).not.toBeNull();
          const delta = cell.dnTw! - cell.dnW!;
          expect(delta, `I3 ${corridor}/${contextName} delta=${delta}`).toBeGreaterThanOrEqual(0);
          expect(delta, `I3 ${corridor}/${contextName} delta=${delta}`).toBeLessThanOrEqual(10);
        }
      }
    });

    it("Ctr ≤ C on every cell (traffic-noise spectrum penalises harder than pink)", () => {
      for (const corridor of CORRIDORS) {
        for (const contextName of ["lab", "field", "building"] as const) {
          const cell = EXPECTED[corridor][contextName];
          expect(cell.ctr, `${corridor}/${contextName}`).not.toBeNull();
          expect(cell.c, `${corridor}/${contextName}`).not.toBeNull();
          expect(cell.ctr!, `${corridor}/${contextName} Ctr=${cell.ctr} C=${cell.c}`)
            .toBeLessThanOrEqual(cell.c!);
        }
      }
    });

    it("STC tracks Rw within ±3 dB on every cell (ASTM E413 ~ ISO 717 loose parity)", () => {
      for (const corridor of CORRIDORS) {
        for (const contextName of ["lab", "field", "building"] as const) {
          const cell = EXPECTED[corridor][contextName];
          expect(cell.stc, `${corridor}/${contextName}`).not.toBeNull();
          expect(cell.rw, `${corridor}/${contextName}`).not.toBeNull();
          const drift = Math.abs(cell.stc! - cell.rw!);
          expect(drift, `STC↔Rw drift ${corridor}/${contextName} = ${drift}`).toBeLessThanOrEqual(3);
        }
      }
    });
  });
});
