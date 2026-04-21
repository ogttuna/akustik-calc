// Wall field-continuation completeness matrix — the VALUE-pin
// layer that complements `wall-physical-invariants-matrix.test.ts`
// (the ≤ / ≥ invariants) and the preset benchmark tests (Rw + a
// handful of field VALUEs per preset). This matrix pins EVERY
// defended wall preset × EVERY airborne context mode × EVERY field
// output to an exact value so silent numerical drift cannot slip
// past a future slice without an explicit test update.
//
// Coverage classes:
//   1. Lab context (`element_lab`) — Rw, C, Ctr, STC live; field
//      outputs (R'w, Dn,w, Dn,A, DnT,w, DnT,A) parked.
//   2. Field context (`field_between_rooms`) — Rw may be
//      unsupported on screening routes; R'w, Dn,w, Dn,A, STC,
//      C, Ctr live; DnT,w, DnT,A parked (no receiving-room
//      volume in the default field context).
//   3. Building context (`building_prediction`) — everything
//      live; matrix reaches full breadth.
//
// The preset's `airborneDefaults` (studType, studSpacingMm,
// connectionType) are folded into the composed context so LSF
// and timber stud hit their framed-wall family lanes exactly as
// the workbench would when the user clicks the preset chip.
//
// This is the file that turns ACCURACY from "invariants hold" to
// "invariants hold AND every cell's exact value is contract".

import type { AirborneContext } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getPresetById, WORKBENCH_PRESETS, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";

const WALL_OUTPUTS = ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"] as const;

// Mirror the workbench-shell `liveAirborneContext` composition with
// each preset's `airborneDefaults` folded in — that is what happens
// the moment a user clicks the preset chip.
function composeContextForPreset(
  presetId: PresetId,
  contextMode: AirborneContext["contextMode"]
): AirborneContext {
  const preset = getPresetById(presetId);
  const defaults = preset.airborneDefaults ?? {};
  const base: AirborneContext = {
    airtightness: defaults.airtightness ?? "good",
    contextMode
  };
  if (defaults.connectionType) base.connectionType = defaults.connectionType;
  if (defaults.studType) base.studType = defaults.studType;
  if (defaults.studSpacingMm) {
    base.studSpacingMm = Number.parseFloat(defaults.studSpacingMm);
  }
  if (contextMode !== "element_lab") {
    base.panelHeightMm = 3000;
    base.panelWidthMm = 4200;
  }
  if (contextMode === "building_prediction") {
    base.receivingRoomRt60S = 0.7;
    base.receivingRoomVolumeM3 = 55;
  }
  return base;
}

type RatingSnapshot = {
  rw: number | null;
  rwPrime: number | null;
  c: number | null;
  ctr: number | null;
  stc: number | null;
  dnW: number | null;
  dnA: number | null;
  dnTw: number | null;
  dnTA: number | null;
  dnC: number | null;
};

function snapshotRatings(presetId: PresetId, airborneContext: AirborneContext): RatingSnapshot {
  const preset = getPresetById(presetId);
  const rows = preset.rows.map((row, index) => ({
    ...row,
    id: `${presetId}-${airborneContext.contextMode}-${index + 1}`
  }));
  const scenario = evaluateScenario({
    airborneContext,
    id: `${presetId}-${airborneContext.contextMode}`,
    impactFieldContext: null,
    name: preset.label,
    rows,
    source: "current",
    studyMode: "wall",
    targetOutputs: WALL_OUTPUTS
  });
  const r = scenario.result;
  return {
    rw: r?.ratings?.iso717?.Rw ?? null,
    rwPrime:
      r?.ratings?.field?.RwPrime ??
      (r?.ratings?.iso717 as { RwPrime?: number } | undefined)?.RwPrime ??
      null,
    c: r?.ratings?.iso717?.C ?? null,
    ctr: r?.ratings?.iso717?.Ctr ?? null,
    stc: r?.ratings?.astmE413?.STC ?? null,
    dnW: r?.ratings?.field?.DnW ?? null,
    dnA: r?.ratings?.field?.DnA ?? null,
    dnTw: r?.ratings?.field?.DnTw ?? null,
    dnTA: r?.ratings?.field?.DnTA ?? null,
    dnC: r?.ratings?.field?.DnC ?? null
  };
}

const WALL_PRESET_IDS = WORKBENCH_PRESETS.filter((preset) => preset.studyMode === "wall").map(
  (preset) => preset.id
);

describe("wall field continuation completeness matrix", () => {
  // Phase 1 (current): every preset × every context × every output
  // returns a FINITE value or a deliberate null. The skeleton
  // passes with `toBeDefined` + `Number.isFinite` so we can
  // capture the engine's current output across the matrix, then
  // upgrade to `toBe(exactValue)` in the next commit once the
  // initial pin snapshot is accepted.
  //
  // Phase 2 (follow-up commit): each cell moves from "defined +
  // finite" to an exact VALUE pin.
  //
  // Any cell where the engine returns an unexpected value
  // (physically implausible, violates a side invariant the
  // invariants matrix does not catch) gets surfaced as a
  // sub-finding in `SLICE_WALL_FIELD_CONTINUATION_VALUE_PINNING_PLAN.md`
  // and blocks slice close until addressed.

  describe("lab context — Rw / STC / C / Ctr live, field outputs parked", () => {
    for (const presetId of WALL_PRESET_IDS) {
      it(`${presetId}: lab ratings are finite on the supported outputs`, () => {
        const context = composeContextForPreset(presetId, "element_lab");
        const snap = snapshotRatings(presetId, context);

        expect(snap.rw, `${presetId}: lab Rw`).not.toBeNull();
        expect(Number.isFinite(snap.rw ?? NaN), `${presetId}: lab Rw finite`).toBe(true);
        expect(snap.stc, `${presetId}: lab STC`).not.toBeNull();
        expect(Number.isFinite(snap.stc ?? NaN), `${presetId}: lab STC finite`).toBe(true);
        expect(snap.c, `${presetId}: lab C`).not.toBeNull();
        expect(Number.isFinite(snap.c ?? NaN), `${presetId}: lab C finite`).toBe(true);
        expect(snap.ctr, `${presetId}: lab Ctr`).not.toBeNull();
        expect(Number.isFinite(snap.ctr ?? NaN), `${presetId}: lab Ctr finite`).toBe(true);
      });
    }
  });

  describe("field_between_rooms context — R'w / Dn,w / Dn,A / STC / C / Ctr live", () => {
    for (const presetId of WALL_PRESET_IDS) {
      it(`${presetId}: field ratings are finite on the supported outputs`, () => {
        const context = composeContextForPreset(presetId, "field_between_rooms");
        const snap = snapshotRatings(presetId, context);

        // Field context supports R'w. Screening-only routes (e.g.
        // `concrete_wall` before the reorder fix propagated) may
        // return null on field R'w — phase 1 captures whichever is
        // true today.
        if (snap.rwPrime !== null) {
          expect(Number.isFinite(snap.rwPrime ?? NaN), `${presetId}: field R'w finite`).toBe(true);
        }
        expect(snap.stc, `${presetId}: field STC`).not.toBeNull();
        expect(snap.c, `${presetId}: field C`).not.toBeNull();
        expect(snap.ctr, `${presetId}: field Ctr`).not.toBeNull();
      });
    }
  });

  describe("building_prediction context — all field outputs live", () => {
    for (const presetId of WALL_PRESET_IDS) {
      it(`${presetId}: building ratings produce finite R'w + DnT,w + DnT,A`, () => {
        const context = composeContextForPreset(presetId, "building_prediction");
        const snap = snapshotRatings(presetId, context);

        expect(snap.rwPrime, `${presetId}: building R'w`).not.toBeNull();
        expect(Number.isFinite(snap.rwPrime ?? NaN), `${presetId}: building R'w finite`).toBe(true);
        expect(snap.dnTw, `${presetId}: building DnT,w`).not.toBeNull();
        expect(Number.isFinite(snap.dnTw ?? NaN), `${presetId}: building DnT,w finite`).toBe(true);
        expect(snap.dnTA, `${presetId}: building DnT,A`).not.toBeNull();
        expect(Number.isFinite(snap.dnTA ?? NaN), `${presetId}: building DnT,A finite`).toBe(true);
      });
    }
  });

  // Phase 2 — exact VALUE pins. Each cell pinned to the engine's
  // current output. Future calibration / refactor work that would
  // shift any cell must land with an explicit test update, making
  // silent accuracy drift impossible.
  //
  // Pin discovery protocol: these values were captured by running
  // the preset × context composition against the engine on the
  // post-split main branch (head commit `5688ead`). Each pin is a
  // drift guard — if a later slice deliberately changes engine
  // output, update the pin AND document the change in that slice's
  // post-contract.
  describe("phase 2 — exact VALUE pins (drift guards)", () => {
    type ExpectedPin = {
      // Null = output is unsupported / parked for this cell and
      // must stay that way. Number = exact value pin.
      rw: number | null;
      rwPrime: number | null;
      c: number | null;
      ctr: number | null;
      stc: number | null;
      dnW: number | null;
      dnA: number | null;
      dnTw: number | null;
      dnTA: number | null;
      dnC: number | null;
    };

    type ExpectedRow = {
      presetId: PresetId;
      context: AirborneContext["contextMode"];
      expected: ExpectedPin;
    };

    const ROWS: readonly ExpectedRow[] = [
      // --- concrete_wall (screening mass-law seed lane)
      {
        presetId: "concrete_wall",
        context: "element_lab",
        expected: {
          rw: 52, rwPrime: null, c: -1.4, ctr: -6.2, stc: 52,
          dnW: null, dnA: null, dnTw: null, dnTA: null, dnC: null
        }
      },
      {
        presetId: "concrete_wall",
        context: "field_between_rooms",
        expected: {
          rw: 50, rwPrime: 50, c: -1.3, ctr: -6, stc: 50,
          dnW: 49, dnA: 47.7, dnTw: null, dnTA: null, dnC: -1.3
        }
      },
      {
        presetId: "concrete_wall",
        context: "building_prediction",
        expected: {
          rw: 50, rwPrime: 50, c: -1.3, ctr: -6, stc: 50,
          dnW: 49, dnA: 47.7, dnTw: 51, dnTA: 50.2, dnC: -1.3
        }
      },
      // --- aac_single_leaf_wall (lab-anchored to Xella Ytong D700)
      {
        presetId: "aac_single_leaf_wall",
        context: "element_lab",
        expected: {
          rw: 47, rwPrime: null, c: -1.1, ctr: -5.9, stc: 47,
          dnW: null, dnA: null, dnTw: null, dnTA: null, dnC: null
        }
      },
      {
        presetId: "aac_single_leaf_wall",
        context: "field_between_rooms",
        expected: {
          rw: 45, rwPrime: 45, c: -1.2, ctr: -5.9, stc: 45,
          dnW: 44, dnA: 42.8, dnTw: null, dnTA: null, dnC: -1.2
        }
      },
      {
        presetId: "aac_single_leaf_wall",
        context: "building_prediction",
        expected: {
          rw: 45, rwPrime: 45, c: -1.2, ctr: -5.9, stc: 45,
          dnW: 44, dnA: 42.8, dnTw: 46, dnTA: 45.3, dnC: -1.2
        }
      },
      // --- masonry_brick_wall (Wienerberger Porotherm anchor
      // + 2026-04-21 lab-fallback anchor drives R'w=41 in field)
      {
        presetId: "masonry_brick_wall",
        context: "element_lab",
        expected: {
          rw: 43, rwPrime: null, c: -0.9, ctr: -5.7, stc: 43,
          dnW: null, dnA: null, dnTw: null, dnTA: null, dnC: null
        }
      },
      {
        presetId: "masonry_brick_wall",
        context: "field_between_rooms",
        expected: {
          rw: 41, rwPrime: 41, c: -1, ctr: -5.7, stc: 41,
          dnW: 40, dnA: 39, dnTw: null, dnTA: null, dnC: -1
        }
      },
      {
        presetId: "masonry_brick_wall",
        context: "building_prediction",
        expected: {
          rw: 41, rwPrime: 41, c: -1, ctr: -5.7, stc: 41,
          dnW: 40, dnA: 39, dnTw: 43, dnTA: 41.5, dnC: -1
        }
      },
      // --- clt_wall (formula-owned; no exact CLT wall row)
      {
        presetId: "clt_wall",
        context: "element_lab",
        expected: {
          rw: 40, rwPrime: null, c: -1.4, ctr: -6.3, stc: 40,
          dnW: null, dnA: null, dnTw: null, dnTA: null, dnC: null
        }
      },
      {
        presetId: "clt_wall",
        context: "field_between_rooms",
        expected: {
          rw: 38, rwPrime: 38, c: -1.4, ctr: -6.1, stc: 38,
          dnW: 37, dnA: 35.6, dnTw: null, dnTA: null, dnC: -1.4
        }
      },
      {
        presetId: "clt_wall",
        context: "building_prediction",
        expected: {
          rw: 38, rwPrime: 38, c: -1.4, ctr: -6.1, stc: 38,
          dnW: 37, dnA: 35.6, dnTw: 39, dnTA: 38.1, dnC: -1.4
        }
      },
      // --- light_steel_stud_wall (Knauf LSF exact catalog row
      // Rw=55; field R'w drops to 48 via flanking overlay)
      {
        presetId: "light_steel_stud_wall",
        context: "element_lab",
        expected: {
          rw: 55, rwPrime: null, c: -1.4, ctr: -6.2, stc: 55,
          dnW: null, dnA: null, dnTw: null, dnTA: null, dnC: null
        }
      },
      {
        presetId: "light_steel_stud_wall",
        context: "field_between_rooms",
        expected: {
          rw: 48, rwPrime: 48, c: -1.2, ctr: -5.7, stc: 48,
          dnW: 47, dnA: 45.8, dnTw: null, dnTA: null, dnC: -1.2
        }
      },
      {
        presetId: "light_steel_stud_wall",
        context: "building_prediction",
        expected: {
          rw: 48, rwPrime: 48, c: -1.2, ctr: -5.7, stc: 48,
          dnW: 47, dnA: 45.8, dnTw: 49, dnTA: 48.3, dnC: -1.2
        }
      },
      // --- timber_stud_wall (formula-owned frame-coupling lane;
      // engine Rw=31 is lower than manufacturer field data ~45-50
      // for similar stacks — flagged as accuracy gap parked for
      // `wall_formula_family_widening_v1` step 6)
      {
        presetId: "timber_stud_wall",
        context: "element_lab",
        expected: {
          rw: 31, rwPrime: null, c: -1, ctr: -5.8, stc: 31,
          dnW: null, dnA: null, dnTw: null, dnTA: null, dnC: null
        }
      },
      {
        presetId: "timber_stud_wall",
        context: "field_between_rooms",
        expected: {
          rw: 24, rwPrime: 24, c: -1.3, ctr: -5.9, stc: 24,
          dnW: 23, dnA: 21.7, dnTw: null, dnTA: null, dnC: -1.3
        }
      },
      {
        presetId: "timber_stud_wall",
        context: "building_prediction",
        expected: {
          rw: 24, rwPrime: 24, c: -1.3, ctr: -5.9, stc: 24,
          dnW: 23, dnA: 21.7, dnTw: 25, dnTA: 24.2, dnC: -1.3
        }
      }
    ];

    for (const row of ROWS) {
      it(`${row.presetId} × ${row.context}: exact VALUE pins`, () => {
        const context = composeContextForPreset(row.presetId, row.context);
        const snap = snapshotRatings(row.presetId, context);

        expect(snap.rw, `${row.presetId} ${row.context}: Rw`).toBe(row.expected.rw);
        expect(snap.rwPrime, `${row.presetId} ${row.context}: R'w`).toBe(row.expected.rwPrime);
        expect(snap.c, `${row.presetId} ${row.context}: C`).toBe(row.expected.c);
        expect(snap.ctr, `${row.presetId} ${row.context}: Ctr`).toBe(row.expected.ctr);
        expect(snap.stc, `${row.presetId} ${row.context}: STC`).toBe(row.expected.stc);
        expect(snap.dnW, `${row.presetId} ${row.context}: Dn,w`).toBe(row.expected.dnW);
        expect(snap.dnA, `${row.presetId} ${row.context}: Dn,A`).toBe(row.expected.dnA);
        expect(snap.dnTw, `${row.presetId} ${row.context}: DnT,w`).toBe(row.expected.dnTw);
        expect(snap.dnTA, `${row.presetId} ${row.context}: DnT,A`).toBe(row.expected.dnTA);
        expect(snap.dnC, `${row.presetId} ${row.context}: Dn,C`).toBe(row.expected.dnC);
      });
    }

    // Discovery helper — intentionally kept as a test that logs
    // every cell so the next agent can populate ROWS above with
    // real values. Remove this `describe.skip` block once ROWS is
    // populated and the exact pins are authoritative.
    describe.skip("discovery (unskip, run, copy into ROWS, re-skip)", () => {
      const CONTEXTS = ["element_lab", "field_between_rooms", "building_prediction"] as const;
      for (const presetId of WALL_PRESET_IDS) {
        for (const contextMode of CONTEXTS) {
          it(`${presetId} × ${contextMode}: logs actual engine values`, () => {
            const context = composeContextForPreset(presetId, contextMode);
            const snap = snapshotRatings(presetId, context);
            // eslint-disable-next-line no-console
            console.log(
              `{ presetId: "${presetId}", context: "${contextMode}", expected: ${JSON.stringify(snap, null, 2)} },`
            );
            expect(snap).toBeDefined();
          });
        }
      }
    });
  });
});
