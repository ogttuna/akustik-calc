# Slice Plan — LSF + Timber Stud Preset Pack With Physical Invariants

Slice id: `wall_lsf_timber_preset_pack_with_invariants_v1`
Status: CLOSED 2026-04-21 (closeout contract
`packages/engine/src/post-wall-lsf-timber-preset-pack-with-invariants-v1-next-slice-selection-contract.test.ts`)
Authored: 2026-04-21
Updated: 2026-04-21 (closed)
Owner: historical — next agent works from
`SLICE_WALL_HOSTILE_INPUT_WITH_CARTOGRAPHY_PLAN.md`

## Why This Slice Exists

Goal is to advance all three project priority axes in one slice:

- **Coverage (C1)** — wall preset archetypes move from 4 → 6 (LSF and
  timber stud added). Directly hits the `≥6 wall presets across
  distinct archetypes` completion signal in MASTER_PLAN §8 C1.
- **Accuracy (D2 / principle P1)** — physical invariants (R'w ≤ Rw,
  Dn,A ≈ Dn,w + C, DnT,w > Dn,w under normal room geometry) are
  asserted for the first time, across all 6 presets × 3 context
  modes. Field VALUE pinning extends to AAC / masonry / CLT so future
  drift is captured in tests, not in proposal PDFs.
- **Architecture readiness** — preset → workbench-state wiring
  pattern matures so later preset work (masonry variant, CLT wet, etc.)
  inherits a clean path. No `dynamic-airborne.ts` change; split slice
  lands separately after this.

## Pre-Slice Analysis (verified 2026-04-21)

- LSF engine path already benchmarked in
  `packages/engine/src/airborne-framed-wall-benchmark.test.ts`
  (official_primary dataset, 6 cases, MAE ≤1.5 dB, max ≤4 dB on
  ratings.iso717.Rw). Required context: `studType="light_steel_stud"`,
  `studSpacingMm=600`, `connectionType="line_connection"`,
  `airtightness="good"`. Canonical stack: two `acoustic_gypsum_board`
  12.5 mm + `air_gap` 5 mm + `glasswool` 70 mm + two
  `acoustic_gypsum_board` 12.5 mm (Rw=55 ±4 dB benchmark target).
- Timber stud engine path exists via
  `packages/engine/src/dynamic-airborne.ts` line 2463 plus
  `packages/engine/src/apply-airborne-context.ts` line 194 frame
  coupling penalty of −0.4 dB. No published benchmark row — treated
  as formula-owned with mass-law + frame-coupling composition.
- `PresetDefinition` type today only carries `rows` +
  `studyMode`. `loadPreset` in `apps/web/features/workbench/workbench-store.ts`
  line 630 only sets `rows`, `studyMode`, `activePresetId`. Pattern
  for forwarding airborne fields exists already in
  `loadSavedScenario` (lines 640-680) — can mirror its shape.
- Physical invariants are not currently asserted anywhere. The
  existing `dynamic-airborne-instability-repro.test.ts` tests R'w
  *spread/stability* under layer duplication (a different invariant
  class). `R'w ≤ Rw` (field flanking cannot increase Rw) is
  untested; this slice establishes it as a first-class invariant.

## Deliverables

1. **Preset definitions**: two new wall presets added to
   `apps/web/features/workbench/preset-definitions.ts` with optional
   `airborneDefaults` field.
2. **Workbench store wiring**: `loadPreset` in `workbench-store.ts`
   applies `preset.airborneDefaults` to the relevant `airborne*`
   store slots when present.
3. **Preset benchmark tests**: `wall-lsf-timber-stud-preset-benchmarks.test.ts`
   pins the canonical Rw (LSF: within LSF benchmark tolerance;
   timber stud: current engine VALUE as formula-owned drift guard)
   under the real workbench default lab context + LSF-specific
   context when `light_steel_stud`/`wood_stud` is injected.
4. **Physical invariants matrix**: `wall-physical-invariants-matrix.test.ts`
   asserts three classes of invariant across all six wall presets ×
   three context modes.
5. **Field VALUE pinning**: `wall-preset-expansion-benchmarks.test.ts`
   extended so AAC / masonry / CLT field_between_rooms and
   building_prediction Rw / R'w / DnT,w values are pinned (drift
   guard for future regressions).
6. **Wall full preset contract matrix**: updated to 6 wall presets
   (existing test already iterates presets; only conditional
   branches may need cleanup).
7. **Post-contract**: `post-wall-lsf-timber-preset-pack-with-invariants-v1-next-slice-selection-contract.test.ts`
   closes the slice and selects the next one
   (`wall_hostile_input_matrix_with_airborne_cartography_v1`).
8. **Doc updates**: MASTER_PLAN §3 grid (6 preset rows), §4 master
   sequence (slice list), §8 C1 completion signal tick; CURRENT_STATE
   §Operator Snapshot; NEXT_IMPLEMENTATION_PLAN §Now.
9. **Focused gate**: new tests added to
   `tools/dev/run-calculator-current-gate.ts`.

## Preset Definitions (Exact)

### `light_steel_stud_wall`

```ts
{
  id: "light_steel_stud_wall",
  label: "LSF Wall",
  note: "2+2 acoustic gypsum on light-steel stud with mineral-wool cavity",
  summary:
    "Light-steel stud wall benchmarked against the Knauf official primary dataset (Rw ~55 dB). " +
    "Demonstrates the framed-wall family lane with an explicit studType context.",
  studyMode: "wall",
  rows: [
    { materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
    { materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
    { materialId: "air_gap",              thicknessMm: "5"    },
    { materialId: "glasswool",            thicknessMm: "70"   },
    { materialId: "acoustic_gypsum_board", thicknessMm: "12.5" },
    { materialId: "acoustic_gypsum_board", thicknessMm: "12.5" }
  ],
  airborneDefaults: {
    studType: "light_steel_stud",
    studSpacingMm: "600",
    connectionType: "line_connection",
    airtightness: "good"
  }
}
```

Expected Rw under this context: ~55 dB (Knauf lab 416702 reference).
Target tolerance: ±4 dB per the framed-wall benchmark primary threshold
(MAE actual target ≤1.5 dB in practice). Field Rw switches to R'w;
`R'w ≤ Rw` invariant must hold.

### `timber_stud_wall`

```ts
{
  id: "timber_stud_wall",
  label: "Timber Stud Wall",
  note: "2+2 gypsum on timber stud with mineral-wool cavity",
  summary:
    "Timber stud wall using the mass-timber frame-coupling penalty lane. " +
    "No published exact reference in the catalog today, so the Rw is " +
    "formula-owned with drift-guard pinning.",
  studyMode: "wall",
  rows: [
    { materialId: "gypsum_board", thicknessMm: "12.5" },
    { materialId: "gypsum_board", thicknessMm: "12.5" },
    { materialId: "rockwool",     thicknessMm: "50"   },
    { materialId: "air_gap",      thicknessMm: "50"   },
    { materialId: "gypsum_board", thicknessMm: "12.5" },
    { materialId: "gypsum_board", thicknessMm: "12.5" }
  ],
  airborneDefaults: {
    studType: "wood_stud",
    studSpacingMm: "600",
    connectionType: "line_connection",
    airtightness: "good"
  }
}
```

Expected Rw: whatever the engine produces today under this context.
Pin the actual engine output as a drift guard (formula-owned, no
published reference to check against — this is honest: catalog has no
timber-stud row, so the test documents `what the engine does`).

### PresetDefinition type addition

```ts
export type PresetAirborneDefaults = {
  airtightness?: AirtightnessClass;
  connectionType?: AirborneConnectionType;
  contextMode?: AirborneContextMode;
  studSpacingMm?: string; // stored as string in workbench state
  studType?: AirborneStudType;
};

export type PresetDefinition = {
  id: PresetId;
  label: string;
  note: string;
  summary: string;
  studyMode: StudyMode;
  rows: Array<{ materialId: string; thicknessMm: string; floorRole?: FloorRole }>;
  airborneDefaults?: PresetAirborneDefaults; // NEW, optional, backward-compatible
};
```

Backward-compatible: existing 4 presets (without `airborneDefaults`)
keep behaviour. `loadPreset` only mutates airborne store slots when
`preset.airborneDefaults` is defined.

## Physical Invariants (Test Definitions)

Landed in `wall-physical-invariants-matrix.test.ts` as a
`describe.each` matrix over (6 presets × {lab, field_between_rooms,
building_prediction}).

### Invariant I1 — Field Rw is not larger than lab Rw (flanking non-negative)

Claim: for any wall preset, `R'w` produced under
`field_between_rooms` or `building_prediction` context must be
≤ `Rw` produced under `element_lab` context. ISO 140-4 definition:
apparent sound reduction index `R'w` includes flanking transmission,
which can only reduce the effective insulation, never increase it.

Assertion:
```
expect(field.ratings.iso717.RwPrime ?? field.ratings.field?.RwPrime)
  .toBeLessThanOrEqual(lab.ratings.iso717.Rw + TOLERANCE_DB);
```
Tolerance: 0 dB for the hard ceiling; +0.5 dB allowance for
floating-point round-trip stability.

**If this fails**: real engine accuracy bug — field flanking model is
increasing Rw, which violates physics. Stop, investigate, do not
ship.

### Invariant I2 — Dn,A consistency with Dn,w + C

Claim: `Dn,A` (A-weighted single-number) must equal `Dn,w + C` within
the ISO 717 rounding bound (≤1 dB). ISO 717 defines Dn,A = Dn,w +
C_{100-3150}.

Assertion:
```
expect(Math.abs(field.ratings.field.DnA - (field.ratings.field.DnW + field.ratings.field.DnC)))
  .toBeLessThanOrEqual(1.0);
```
Only asserted when field mode produces both values (lab mode has no
Dn,A).

**If this fails**: inconsistency between C spectrum adaptation and
the A-weighted derivation. Engine fix required.

### Invariant I3 — DnT,w > Dn,w for normal receiving rooms

Claim: `DnT,w` includes the 10·log10(V/V_ref) normalisation term
which is positive for receiving rooms larger than the reference
absorption (10 m²·RT=0.5 s, i.e. V≈16 m³·RT=0.5 s). For the
`building_prediction` context (V=55 m³, RT60=0.7 s) used in the
preset tests, `DnT,w` should always exceed `Dn,w` by 2-6 dB.

Assertion:
```
expect(building.ratings.field.DnTw).toBeGreaterThan(building.ratings.field.DnW);
expect(building.ratings.field.DnTw - building.ratings.field.DnW).toBeGreaterThanOrEqual(2);
expect(building.ratings.field.DnTw - building.ratings.field.DnW).toBeLessThanOrEqual(10);
```

**If this fails**: DnT volume/RT normalisation is broken. Engine fix
required.

### Field VALUE pinning additions

On the existing benchmark spec for AAC / masonry / CLT:

```
field_between_rooms Rw: unsupported
field_between_rooms R'w: <pin engine VALUE>
field_between_rooms DnT,w: needs_input (parked, no room volume)
building_prediction R'w: <pin engine VALUE>
building_prediction DnT,w: <pin engine VALUE>
building_prediction DnT,A: <pin engine VALUE>
```

These pins are drift guards. They start as `toBeDefined()` +
`toBeFinite()` in the first draft, then get real numbers pinned once
the tests run green for the first time.

## Implementation Steps (Atomic Order)

Each step closes on `pnpm calculator:gate:current` green.

**Landed inside `masonry_flanking_inversion_fix_v1` (2026-04-21):**

1. ✅ **Extend `PresetDefinition` type** — `PresetAirborneDefaults`
   type now carries airborne defaults; backwards-compatible optional
   field on `PresetDefinition`.
2. ✅ **Extend `loadPreset`** in `workbench-store.ts` — airborne
   defaults forward to `airborneAirtightness`, `airborneConnectionType`,
   `airborneContextMode`, `airborneStudSpacingMm`, `airborneStudType`
   when present.
3. ✅ **Write `wall-physical-invariants-matrix.test.ts`** with I1 /
   I2 / I3 — landed green across 4 existing wall presets × 3 context
   modes after the masonry flanking inversion engine fix; 24 of
   eventual 36 cells pinned (LSF + timber stud cells land with
   their presets).

**Remaining inside this slice:**

4. **Add LSF preset** (`light_steel_stud_wall`) with
   `airborneDefaults` = `{ studType: "light_steel_stud",
   studSpacingMm: "600", connectionType: "line_connection",
   airtightness: "good" }`. Verify engine produces Rw within the
   framed-wall benchmark tolerance.
5. **Add timber stud preset** (`timber_stud_wall`) with
   `airborneDefaults` = `{ studType: "wood_stud", studSpacingMm:
   "600", connectionType: "line_connection", airtightness: "good" }`.
6. **Write `wall-lsf-timber-stud-preset-benchmarks.test.ts`** with
   LSF benchmark fit (tolerance from the framed-wall benchmark audit)
   and timber stud drift-guard VALUE pin (formula-owned, no published
   reference — pin the engine's current output as a drift guard).
7. **Extend `wall-preset-expansion-benchmarks.test.ts`** with field
   / building VALUE pins for AAC / masonry / CLT (drift guards for
   the 2026-04-21 invariants behaviour).
8. **Re-run invariants matrix** with LSF + timber stud rows — 6
   presets × 3 contexts = 36 cells. Fail-stop if any new cell
   violates I1 / I2 / I3.
9. **Verify `wall-full-preset-contract-matrix.test.ts`** — likely
   passes unchanged because it iterates `WORKBENCH_PRESETS`; confirm
   and adjust the `isScreeningConcreteWall` conditional only if a
   new preset is classified as screening.
10. **Post-contract** — `post-wall-lsf-timber-preset-pack-with-invariants-v1-next-slice-selection-contract.test.ts`.
11. **Focused gate update** — add the new benchmark test file plus
    anything the previous fix did not already register.
12. **Docs update** — MASTER_PLAN §3 grid (add 2 preset rows, flip
    C1 closer to done), §4 sequence (slice 2 closes → slice 3 becomes
    next), §8 C1 status; CURRENT_STATE §Operator Snapshot;
    NEXT_IMPLEMENTATION_PLAN §Now.
13. **Full validation** — `pnpm check` green, `git diff --check`
    clean, build green.
14. **Commit** — single commit for the remaining deliverables.

## Expected Test Outcomes

| Test | Expected Result | If Fails |
|---|---|---|
| `wall-lsf-timber-stud-preset-benchmarks.test.ts` LSF Rw | ~55 dB lab, R'w reduced in field | LSF context not flowing — fix `loadPreset` wiring |
| `wall-lsf-timber-stud-preset-benchmarks.test.ts` timber stud Rw | drift-guard pin | If value shifts silently in later slices, this catches it |
| `wall-physical-invariants-matrix.test.ts` I1 | all 6 presets × (field, building) satisfy R'w ≤ Rw | Engine flanking model broken — investigate, do not ship |
| `wall-physical-invariants-matrix.test.ts` I2 | Dn,A ≈ Dn,w + C within 1 dB | ISO 717 C-weighting inconsistency |
| `wall-physical-invariants-matrix.test.ts` I3 | DnT,w − Dn,w ∈ [2, 10] dB for V=55 m³ | Volume normalisation broken |
| `wall-preset-expansion-benchmarks.test.ts` (extended) field/building VALUE pins | defined + finite + drift-guard | Drift into silent value change — explicit test update |
| `wall-full-preset-contract-matrix.test.ts` | 6 presets × 3 contexts pass | New presets misclassified — refine conditional |
| `post-*-next-slice-selection-contract.test.ts` | selects `wall_hostile_input_matrix_with_airborne_cartography_v1` | Contract shape mismatch |

## Success Criteria

All of:

- `pnpm calculator:gate:current` green
- `pnpm check` green (engine 187/? web 137/? expected counts after
  new tests land)
- Physical invariants I1–I3 hold for all 6 presets × 3 contexts
- LSF preset Rw within the framed-wall benchmark primary tolerance
- Timber stud preset Rw pinned as formula-owned drift guard
- AAC / masonry / CLT field and building VALUEs pinned
- MASTER_PLAN §3 grid updated (6 preset rows, accurate evidence
  pointers)
- MASTER_PLAN §8 C1 now reads "6/6 ✓" (up from "4/6")
- Post-contract `selectedImplementationSlice` =
  `wall_hostile_input_matrix_with_airborne_cartography_v1`

## Stop Conditions (Do NOT Ship If)

- **I1 fails** for any preset: engine flanking model is wrong.
  Blocking — fix engine before closing slice.
- **I2 fails** for any preset: ISO 717 C-weighting derivation is
  inconsistent. Blocking.
- **I3 fails** for any preset: DnT volume normalisation is broken.
  Blocking.
- **LSF benchmark fit out of tolerance** (|error| > 4 dB): LSF context
  injection not flowing through to engine family detection. Fix
  wiring or reconsider stack before closing.
- Any existing test regresses: investigate root cause before closing.

## Risk & Rollback

- **Risk**: invariant failure reveals deeper engine bug. Mitigation:
  treat invariant failure as a real finding — stop, open a
  remediation sub-slice, document, only then close.
- **Rollback**: if the slice lands and a downstream wall slice
  reveals an issue, revert via `git revert <slice commit>` — the
  slice is atomic (single commit).
- **Backward-compat risk**: `PresetDefinition.airborneDefaults` is
  optional. Existing 4 presets keep working. No risk to persisted
  scenarios (they already store airborne state separately via
  `loadSavedScenario`).

## Non-Obvious Notes For The Next Agent

1. **`loadPreset` currently only sets `rows + studyMode +
   activePresetId`.** If you add `airborneDefaults` wiring, mirror
   the `loadSavedScenario` spread pattern (line ~660), don't invent
   a new one.
2. **Workbench store stores studSpacingMm as a string**, not a
   number, because it maps directly to the input field. Preset
   defaults must match — use `"600"` not `600`.
3. **`wall-full-preset-contract-matrix.test.ts` has an
   `isScreeningConcreteWall` conditional** that gates the Rw-vs-R'w
   availability split. LSF and timber stud presets should land as
   non-screening (the framed-wall benchmark path). If the matrix
   fails, the new presets may be getting classified screening —
   investigate `dynamic-airborne.ts` family detection entry point
   rather than tweaking the test.
4. **Physical invariants are NOT currently tested anywhere.** This is
   a first. Treat any failure as genuine engine finding, not test
   noise. `dynamic-airborne-instability-repro.test.ts` tests a
   different class (stability under duplication) and is not a proxy.
5. **Timber stud has no published benchmark row.** The drift-guard
   pin is the engine's current output, not a manufacturer spec.
   Future work could source a Dataholz timber-stud wall row (there's
   a Dataholz CLT floor pattern already) but that is separate.
6. **LSF benchmark uses `acoustic_gypsum_board`** (the sound-rated
   variant), not plain `gypsum_board`. Both materials exist in the
   catalog; if the preset uses the wrong one the Rw will drift.
7. **Focused gate file list order matters** only cosmetically
   (alphabetical keeps the file scannable). New entries can go at
   the end of each step's array.
8. **`preset-context-verification` probe** was deleted in a previous
   slice; if a future probe is needed, the same `WORKBENCH_DEFAULT_LAB_CONTEXT`
   mirror pattern from `wall-preset-expansion-benchmarks.test.ts`
   should be reused — don't use `airborneContext: null` in preset
   tests (see `SYSTEM_AUDIT_2026-04-20.md` finding 10 retraction).

## Out Of Scope For This Slice

- Adding exact catalog wall rows (Dataholz wall, Knauf wall, etc.).
- `dynamic-airborne.ts` split — separate slice
  (`dynamic_airborne_split_refactor_v1`).
- Wall hostile-input matrix — next slice after this one
  (`wall_hostile_input_matrix_with_airborne_cartography_v1`).
- Engine thickness guardrail — opportunistic, can land inside
  hostile-input slice.
- Floor regression work — floor is already deep, no source-backed
  work unblocked.
- UI/UX changes to the preset selector — data shape changes only.

## Next Slice (After This Closes)

`wall_hostile_input_matrix_with_airborne_cartography_v1` will:

- Mirror floor hostile-input matrices on wall mode
- Add engine thickness guardrail (cross-cutting floor+wall)
- Map `dynamic-airborne.ts` code-paths exercised by hostile input
  (preparation for the subsequent split slice)

Plan doc will be authored at the start of that slice, same structure
as this one.

## Resume Checklist For The Next Agent

If you pick this slice up mid-flight:

1. Read this file top-to-bottom.
2. Check `git log --oneline main..HEAD` — which of steps 1–14 have
   landed?
3. Run `pnpm calculator:gate:current` — see which tests are green /
   red / missing.
4. Continue from the first un-landed step.
5. When all steps green, write the post-contract and commit.
6. Update MASTER_PLAN §3 grid, §8 C1 before declaring slice done.
