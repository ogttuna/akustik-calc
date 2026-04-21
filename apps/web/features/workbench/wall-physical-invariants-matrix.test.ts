// Physical invariants matrix for every defended wall preset × three
// airborne context modes (element_lab, field_between_rooms,
// building_prediction). Establishes the first-class physics contract
// that later wall slices build on.
//
// These are NOT numerical drift guards (those live in
// `wall-preset-expansion-benchmarks.test.ts` and
// `wall-lsf-timber-stud-preset-benchmarks.test.ts`). They are ISO-
// defined physical relations between outputs that must hold for
// any realistic wall assembly. A failure here is always a real
// engine accuracy finding — investigate before closing a slice.
//
// Invariants:
//   I1 — R'w <= Rw (field flanking cannot increase insulation,
//        ISO 140-4 apparent-sound-reduction-index definition).
//   I2 — Dn,A ≈ Dn,w + C within +/- 1 dB (ISO 717 C-weighting
//        consistency).
//   I3 — For a receiving room larger than the reference absorption
//        (V ≈ 16 m³ @ RT=0.5 s), DnT,w exceeds Dn,w by 2-10 dB
//        (volume normalisation term).
//
// Tolerances are set above floating-point round-trip noise but
// below any physically meaningful drift.

import type { AirborneContext } from "@dynecho/shared";
import { describe, expect, it } from "vitest";

import { getPresetById, WORKBENCH_PRESETS, type PresetId } from "./preset-definitions";
import { evaluateScenario } from "./scenario-analysis";

const WALL_OUTPUTS = ["Rw", "R'w", "Dn,w", "Dn,A", "DnT,w", "DnT,A", "STC", "C", "Ctr"] as const;

// Mirror the workbench-shell `liveAirborneContext` composition for
// each context mode. These are the contexts a user actually sees
// when they switch the airborne context panel's context-mode
// dropdown with all other fields at their defaults.
const LAB_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "element_lab"
};
const FIELD_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "field_between_rooms",
  panelHeightMm: 3000,
  panelWidthMm: 4200
};
const BUILDING_CONTEXT: AirborneContext = {
  airtightness: "good",
  contextMode: "building_prediction",
  panelHeightMm: 3000,
  panelWidthMm: 4200,
  receivingRoomRt60S: 0.7,
  receivingRoomVolumeM3: 55
};

type PresetSnapshot = {
  rw: number | null;
  rwPrime: number | null;
  c: number | null;
  ctr: number | null;
  dnW: number | null;
  dnA: number | null;
  dnC: number | null;
  dnTw: number | null;
  dnTA: number | null;
};

function evaluatePresetContext(presetId: PresetId, airborneContext: AirborneContext): PresetSnapshot {
  const preset = getPresetById(presetId);
  const rows = preset.rows.map((row, index) => ({ ...row, id: `${presetId}-${airborneContext.contextMode}-${index + 1}` }));
  const scenario = evaluateScenario({
    id: `${presetId}-${airborneContext.contextMode}`,
    name: preset.label,
    rows,
    source: "current",
    studyMode: "wall",
    airborneContext,
    targetOutputs: WALL_OUTPUTS
  });
  const r = scenario.result;
  return {
    rw: r?.ratings?.iso717?.Rw ?? null,
    rwPrime:
      r?.ratings?.field?.RwPrime ??
      (r?.ratings?.iso717 && "RwPrime" in r.ratings.iso717
        ? (r.ratings.iso717 as { RwPrime?: number }).RwPrime ?? null
        : null),
    c: r?.ratings?.iso717?.C ?? null,
    ctr: r?.ratings?.iso717?.Ctr ?? null,
    dnW: r?.ratings?.field?.DnW ?? null,
    dnA: r?.ratings?.field?.DnA ?? null,
    dnC: r?.ratings?.field?.DnC ?? null,
    dnTw: r?.ratings?.field?.DnTw ?? null,
    dnTA: r?.ratings?.field?.DnTA ?? null
  };
}

const WALL_PRESET_IDS = WORKBENCH_PRESETS.filter((preset) => preset.studyMode === "wall").map(
  (preset) => preset.id
);

describe("wall physical invariants matrix", () => {
  describe("I1 — R'w <= Rw (flanking non-negative)", () => {
    // Field Rw (R'w) must never exceed lab Rw. ISO 140-4 apparent
    // sound reduction index definition: R'w includes flanking
    // transmission which reduces the effective insulation.
    //
    // Allowance: 0.5 dB for floating-point round-trip tolerance.
    const TOLERANCE_DB = 0.5;

    for (const presetId of WALL_PRESET_IDS) {
      it(`${presetId}: field_between_rooms R'w is not larger than lab Rw`, () => {
        const lab = evaluatePresetContext(presetId, LAB_CONTEXT);
        const field = evaluatePresetContext(presetId, FIELD_CONTEXT);

        expect(lab.rw, `${presetId}: lab Rw must be defined`).not.toBeNull();
        expect(field.rwPrime, `${presetId}: field R'w must be defined`).not.toBeNull();

        expect(
          field.rwPrime ?? Number.POSITIVE_INFINITY,
          `${presetId}: R'w (${field.rwPrime}) <= Rw (${lab.rw}) + ${TOLERANCE_DB} dB`
        ).toBeLessThanOrEqual((lab.rw ?? 0) + TOLERANCE_DB);
      });

      it(`${presetId}: building_prediction R'w is not larger than lab Rw`, () => {
        const lab = evaluatePresetContext(presetId, LAB_CONTEXT);
        const building = evaluatePresetContext(presetId, BUILDING_CONTEXT);

        expect(lab.rw, `${presetId}: lab Rw must be defined`).not.toBeNull();
        expect(building.rwPrime, `${presetId}: building R'w must be defined`).not.toBeNull();

        expect(
          building.rwPrime ?? Number.POSITIVE_INFINITY,
          `${presetId}: building R'w (${building.rwPrime}) <= lab Rw (${lab.rw}) + ${TOLERANCE_DB} dB`
        ).toBeLessThanOrEqual((lab.rw ?? 0) + TOLERANCE_DB);
      });
    }
  });

  describe("I2 — Dn,A ≈ Dn,w + C within ±1 dB (ISO 717 C-weighting consistency)", () => {
    // Dn,A is the A-weighted single-number rating. ISO 717 defines
    // it as Dn,w + C (where C is the 100-3150 Hz spectrum adaptation
    // term). Implementations can round independently, which produces
    // at most 1 dB of single-number rounding drift.
    const TOLERANCE_DB = 1.0;

    for (const presetId of WALL_PRESET_IDS) {
      it(`${presetId}: field Dn,A stays within 1 dB of Dn,w + C`, () => {
        const field = evaluatePresetContext(presetId, FIELD_CONTEXT);

        // Only assert when the engine produced all three values.
        // If Dn,A is unsupported for this preset in field mode,
        // skip the assertion — that is a different discipline
        // (availability, not consistency).
        if (field.dnA === null || field.dnW === null || field.dnC === null) {
          return;
        }

        const derivedDnA = field.dnW + field.dnC;
        expect(
          Math.abs(field.dnA - derivedDnA),
          `${presetId}: |Dn,A (${field.dnA}) - (Dn,w (${field.dnW}) + C (${field.dnC}) = ${derivedDnA})| <= ${TOLERANCE_DB}`
        ).toBeLessThanOrEqual(TOLERANCE_DB);
      });
    }
  });

  describe("I3 — DnT,w > Dn,w by 2-10 dB for V=55 m³, RT=0.7 s (volume normalisation)", () => {
    // DnT,w applies 10·log10(0.32·V/S) relative to the reference
    // absorption area. For the building-prediction preset context
    // used here (V=55 m³, panel 4.2m×3m → S=12.6 m², RT=0.7 s) the
    // reference uplift is about 4.3 dB, well inside 2-10 dB.
    const MIN_DELTA_DB = 2;
    const MAX_DELTA_DB = 10;

    for (const presetId of WALL_PRESET_IDS) {
      it(`${presetId}: DnT,w exceeds Dn,w by 2-10 dB under the building-prediction preset context`, () => {
        const building = evaluatePresetContext(presetId, BUILDING_CONTEXT);

        if (building.dnTw === null || building.dnW === null) {
          return;
        }

        const delta = building.dnTw - building.dnW;
        expect(
          delta,
          `${presetId}: DnT,w (${building.dnTw}) - Dn,w (${building.dnW}) = ${delta}, want in [${MIN_DELTA_DB}, ${MAX_DELTA_DB}]`
        ).toBeGreaterThanOrEqual(MIN_DELTA_DB);
        expect(
          delta,
          `${presetId}: DnT,w - Dn,w = ${delta} must be <= ${MAX_DELTA_DB}`
        ).toBeLessThanOrEqual(MAX_DELTA_DB);
      });
    }
  });
});
