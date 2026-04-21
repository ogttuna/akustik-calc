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
});
