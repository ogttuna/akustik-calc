# Slice Plan — Mixed Floor/Wall Edge-Case Hardening

Slice id: `mixed_floor_wall_edge_case_hardening_v1`
Status: CLOSED (implemented 2026-04-22; archived as historical plan)
Master-plan step: 7
Selected by: `wall_field_continuation_value_pinning_v1` closeout
contract on 2026-04-21 (step 5 audit closed clean → step 6 stays
conditional → step 7 is the direct path to step 8 final audit).
Next after close: `good_calculator_final_audit_v1` (master-plan
step 8).

## Pressure-Test — Why This Slice And Not Another

Before authoring this doc, the four candidate next-moves were
weighed against the core mission (coverage + accuracy advance
together) on 2026-04-22. Findings:

| Option | Coverage ROI | Accuracy ROI | Blocker |
|---|---|---|---|
| **(a) Open step 6 `wall_formula_family_widening_v1`** — close the timber stud Rw=31 vs manufacturer 45-50 dB gap (14-19 dB, largest known wall gap) | + | ++ | **Source-blocked.** `estimateStudWallTargetRw` (packages/engine/src/dynamic-airborne-framed-wall.ts) has no wood-stud coupling lever that does not need external lab data to defend. Reopening violates AP4 (blocked-source posture). MASTER_PLAN §4 step 6 is conditional *only* if step 5 audit reveals a defendable gap — step 5 closed clean. |
| **(b) Dimension B corridor VALUE pins** — extend VALUE pinning from preset surface to `dynamic-airborne-wall-selector-trace-matrix` corridors (`double_leaf`, `lined_massive_wall`, etc.) | 0 | + (drift guard) | Interior routing logic, not a user-visible surface. Narrative pins already guard; VALUE pins catch tighter calibration drift only. Selector already VALUE-pins `rwDb` on representative corridors. Deferred follow-up per step 5 closeout — strictly lower-ROI than step 7 right now. |
| **(c) Floor field continuation audit** — parallel to wall step 5 but on floor corridors | 0 | + | MASTER_PLAN §5 decision explicitly folds floor field audit into step 6. Floor already has 30 engine cases + hostile-input matrix + reorder invariance — no dormant accuracy gap documented. |
| **(d) Step 7 as planned — this slice** | + (consolidation) | + (cross-mode torture) | **No blocker.** Gap-close pass flips `ENGINE_MIXED_GENERATED_CASES` wall surface from 3 → 7 cases, matching preset parity from slice 2. Cross-mode torture matrix proves C4 (hostile input) + C5 (reorder invariance) + lab-fallback anchor + split-v1 engine layout all hold *together* against the new corridors. Mandatory pre-audit for step 8. |

**Decision: (d).** Reasons, ordered:

1. Option (a) is the single biggest accuracy move available but
   requires external lab data — violating AP4 by reopening on
   the current evidence is not acceptable.
2. Option (b) and (c) are lower-ROI than (d) for the mission
   because neither expands coverage; both are validation of
   existing lanes.
3. Step 8 (final audit) cannot run without a coherent wall
   engine surface. Slice 2 expanded presets to 6/6 but the
   engine-level cross-mode torture grid was never updated. That
   drift is exactly what (d) closes.
4. The 2026-04-21 masonry flanking inversion fix added a new
   lab-fallback anchor lane that has never been exercised under
   the duplicate-swap + reorder torture. (d) proves it under
   cross-mode stress.

Reconsider (a) if new wood-stud lab data lands between now and
step 8 — the timber stud case authored in this slice will serve
as the drift guard that future slice anchors against.

## Why This Slice Exists

Primary objective alignment: **coverage + accuracy + architectural
readiness** consolidated into one cross-mode torture gate.

- Completion signal **C4 (hostile input discipline)** and **C5
  (reorder invariance)** are green as isolated surfaces but have
  never been proved *together* against the new wall corridors
  (masonry brick lab-fallback, CLT wall, LSF exact-row, timber
  stud formula-owned).
- The 6/6 preset parity landed in slice 2
  (`wall_lsf_timber_preset_pack_with_invariants_v1`) added LSF +
  timber stud to the preset surface, but the engine-level
  cross-mode torture matrix (`mixed-floor-wall-generated-matrix`)
  still reflects the pre-slice-2 wall surface. This slice closes
  that drift.
- The 2026-04-21 **masonry flanking inversion fix** introduced a
  new lab-fallback anchor lane
  (`applyVerifiedAirborneCatalogAnchor`). The torture matrix has
  never exercised this lane; adding a masonry brick wall case is
  how we prove the anchor behaves deterministically under
  duplicate-swap + reorder + save-load.
- Step 7 is the final non-audit slice before
  `good_calculator_final_audit_v1` (step 8). This is the last
  chance to surface cross-mode bugs before the completion-signal
  gate.

## First Implementation Question — Answered

`NEXT_IMPLEMENTATION_PLAN.md` posed the gating question: *do
existing `mixed-floor-wall-*` tests still cover the new wall
corridors (LSF, timber stud) + the post-split engine layout + the
lab-fallback anchor?*

**Answer: NO.** Verified 2026-04-22 by scanning
`packages/engine/src/mixed-floor-wall-generated-test-helpers.ts`:

| Mode | Cases in `ENGINE_MIXED_GENERATED_CASES` | Covered preset archetypes |
|---|---|---|
| Floor | 30 | UBIQ steel, Knauf timber, heavy concrete, reinforced concrete, CLT (Dataholz/TUAS), open-box, Regupol, Getzner, hollow-core, etc. |
| Wall | **3 only** — `wall-screening-concrete`, `wall-held-aac`, `wall-heavy-composite-hint-suppression` | concrete screening, AAC only |

Missing archetypes: **masonry brick** (would exercise the new
lab-fallback anchor), **CLT wall** (would exercise the
`dynamic-airborne-framed-wall.ts` split boundary), **LSF**
(would exercise the `studType=light_steel_stud` airborne context
threading through the split engine), **timber stud** (would
exercise the formula-owned drift guard + confirm behaviour
stability under the parked accuracy gap).

Implication: the torture matrix's generated-variant grid +
duplicate-swap grid + the 26 `post-mixed-floor-wall-*` closeout
contracts all run on a wall surface that is out of sync with the
current preset pack. **A gap-close pass lands first** in this
slice, then the cross-mode torture extension builds on top.

## Implementation Recon (2026-04-22)

Concrete code references so the next agent does not re-research.
Every file path is relative to repo root; every line range is
from the 2026-04-22 state (commit `51e560c`).

### R1 — Existing wall cases in `ENGINE_MIXED_GENERATED_CASES`

File: `packages/engine/src/mixed-floor-wall-generated-test-helpers.ts`

| Case id | Lines | Rows fixture | splitPlans |
|---|---|---|---|
| `wall-screening-concrete` | 894-902 | `SCREENING_WALL_ROWS` (line 396) — 4 layers: gypsum_board 12.5, rockwool 50, air_gap 50, concrete 100 | `[{parts:[20,30], rowIndex:1}, {parts:[40,60], rowIndex:3}]` |
| `wall-held-aac` | 904-918 | `HELD_WALL_ROWS` (line 403) — 8 layers around ytong_aac_d700 100 + air_gap 50 + rockwool 40 | `[{parts:[15,35], rowIndex:1}, {parts:[6,6.5], rowIndex:6}]` |
| `wall-heavy-composite-hint-suppression` | 920-935 | `HEAVY_COMPOSITE_WALL_ROWS` (line 414) — concrete 80 + pumice_block 100 + air_gap 50 + gypsum 12.5 + concrete 80 | `[{parts:[40,40], rowIndex:0}, {parts:[50,50], rowIndex:1}]` |

Context constants (same file):
- `WALL_FIELD_CONTEXT` (lines 23-29): `building_prediction`, 2800×3600 mm panel, RT=0.6 s, V=45 m³
- `WALL_LAB_OUTPUTS` (line 7): `["Rw", "STC", "C", "Ctr"]`
- `WALL_FIELD_OUTPUTS` (line 8): `["R'w", "Dn,w", "DnT,w", "DnT,A"]`

All three wall cases use the same `labOptions` shape `{ calculator:
"dynamic", targetOutputs: WALL_LAB_OUTPUTS }` (no airborneContext
on lab — defaults apply) and `fieldOptions` shape `{
airborneContext: WALL_FIELD_CONTEXT, calculator: "dynamic",
targetOutputs: WALL_FIELD_OUTPUTS }`.

### R2 — `calculateAssembly` options signature

File: `packages/engine/src/calculate-assembly.ts`, `CalculateAssemblyOptions`
(lines 93-101):

```
airborneContext?: AirborneContext | null
calculator?: AirborneCalculatorId | null
catalog?: readonly MaterialDefinition[]
exactImpactSource?: ExactImpactSource | null
impactFieldContext?: ImpactFieldContext | null
impactPredictorInput?: ImpactPredictorInput | null
targetOutputs?: readonly RequestedOutputId[]
```

`AirborneContext` fields used by new cases: `contextMode`,
`panelHeightMm`, `panelWidthMm`, `receivingRoomRt60S`,
`receivingRoomVolumeM3`, `airtightness`, `connectionType`,
`studType`, `studSpacingMm` (+ optional field modifiers).

### R3 — Target preset definitions

File: `apps/web/features/workbench/preset-definitions.ts`

| Preset | Lines | Rows (materialId × thicknessMm) | `airborneDefaults` |
|---|---|---|---|
| `masonry_brick_wall` | 114-124 | dense_plaster 13 + wienerberger_porotherm_100 100 + dense_plaster 13 | `undefined` (defaults suffice) |
| `clt_wall` | 127-137 | gypsum_board 12.5 + clt_140 140 + gypsum_board 12.5 | `undefined` |
| `light_steel_stud_wall` | 140-159 | acoustic_gypsum 12.5 ×2 + air_gap 5 + glasswool 70 + acoustic_gypsum 12.5 ×2 (6 rows) | `{ airtightness:"good", connectionType:"line_connection", studSpacingMm:"600", studType:"light_steel_stud" }` |
| `timber_stud_wall` | 162-181 | gypsum_board 12.5 ×2 + rockwool 50 + air_gap 50 + gypsum_board 12.5 ×2 (6 rows) | `{ airtightness:"good", connectionType:"line_connection", studSpacingMm:"600", studType:"wood_stud" }` |

Note: the `timber_stud_wall` `studType` value is `"wood_stud"`,
NOT `"timber_stud"`. This is the canonical engine identifier —
the slice plan's earlier table had `"timber_stud"` which is
wrong and must not propagate into the test case.

### R4 — `airborneDefaults` → engine plumbing trace

1. `apps/web/features/workbench/workbench-store.ts` `loadPreset`
   (lines 630-662) reads `preset.airborneDefaults` and assigns
   into store fields: `airborneAirtightness`, `airborneStudType`,
   `airborneStudSpacingMm`, `airborneConnectionType`.
2. `apps/web/features/workbench/workbench-shell.tsx`
   `liveAirborneContext` (lines 284-302) composes store fields
   into `AirborneContext` object under wall-mode branch, then
   passes to `calculateAssembly`.

**For engine-only test cases (Dimension A), skip the workbench
trace and construct `AirborneContext` directly in the test
fixture — the preset's `airborneDefaults` object shape maps 1:1
into `AirborneContext`.**

### R5 — Ground-truth benchmark pins

Lab context defaults apply (no explicit `airborneContext` in
`labOptions`).

Field context = `WALL_FIELD_CONTEXT` (building_prediction).

| Preset | Lab Rw | Field R'w | Building DnT,w | Tolerance | Source test |
|---|---|---|---|---|---|
| `masonry_brick_wall` | 43 | 41 | 43 | ±1 dB | `wall-preset-expansion-benchmarks.test.ts` 131-168 |
| `clt_wall` | 40 | 38 | 39 | ±0 dB | same |
| `light_steel_stud_wall` | 55 | 48 | 49 | ±0 dB | `wall-lsf-timber-stud-preset-benchmarks.test.ts` 147-177 |
| `timber_stud_wall` | 31 | 24 | 25 | ±0 dB | same (drift guard) |

Snapshot equality in `mixed-floor-wall-generated-matrix.test.ts`
(the generated-variant stability loop) does NOT re-assert these
values — it just proves baseline equals every variant. The
benchmark tests above are the ground-truth source.

### R6 — Post-contract hardcoded dependencies

26 `post-mixed-floor-wall-*.test.ts` files under
`packages/engine/src/`. Confirmed hardcoded-count surface found
in `post-mixed-floor-wall-duplicate-swap-grid-next-slice-selection-contract.test.ts`
lines 82-105: `currentSeededBoundaryRoutes` array with 6 entries
including only **2 wall routes** (`route-wall-held-aac`,
`route-wall-heavy-composite-hint-suppression`).

**Search pattern for the grep sweep step**: `ENGINE_MIXED_GENERATED_CASES`,
`SELECTED_ENGINE_MIXED_GENERATED_ROUTE_CASES`, `currentSeededBoundaryRoutes`,
`.length ===` on these, `toEqual([` listing the current case ids.
Update any contract asserting exactly 3 wall cases / 33 total /
6-route subset to the new exact counts (7 wall cases / 37 total /
6-route subset remains frozen unless new routes are added for
the new cases).

### R7 — Dimension C overlay primitives (already on disk)

| Overlay | Primitive | File:line |
|---|---|---|
| Hostile input | `evaluateAssemblyInputGuard()` returning `{ kind:"fail"; warnings }` | `packages/engine/src/assembly-input-guardrail.ts` 50-95 |
| Reorder | Forward/reverse `rows` array + re-`calculateAssembly` comparison | pattern in `apps/web/features/workbench/wall-reorder-invariance-matrix.test.ts` 40-57 |
| Save-load | `JSON.parse(JSON.stringify({ rows, airborneContext }))` round-trip — no explicit serializer needed since inputs are already JSON-safe | plain structuredClone / JSON round-trip |
| Duplicate-swap | `buildDuplicateSwapGridVariants(testCase)` returning `2^N` reverse-mask variants | `packages/engine/src/mixed-floor-wall-generated-matrix.test.ts` 31-54 |
| Edit-history replay | `calculateAssembly` called 3 times with `airborneContext.studType` toggle (`light_steel_stud` → `wood_stud` → `light_steel_stud`) — assert final equals direct first call | engine-side construction; no workbench store needed |

### R8 — Focused gate entry point

File: `tools/dev/run-calculator-current-gate.ts`, args array
around lines 42-111 (engine tests) and 116-150 (web tests).
Hardcoded list of test file paths. Append the two new engine
test files to the engine args block before the `--maxWorkers=1`
flag:

- `src/mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts`
- `src/post-mixed-floor-wall-edge-case-hardening-v1-next-slice-selection-contract.test.ts`

## Scope

Four dimensions, now with concrete references to §R above.

### Dimension A — Engine wall case gap-close

Add four new wall cases to `ENGINE_MIXED_GENERATED_CASES`,
mirroring the shape of the existing three:

| New case id | Rows (mirrors §R3 preset) | `airborneContext` (field + building) | Why |
|---|---|---|---|
| `wall-masonry-brick` | dense_plaster 13 + wienerberger_porotherm_100 100 + dense_plaster 13 (3 layers) | `WALL_FIELD_CONTEXT` only (preset `airborneDefaults` is `undefined`) | Exercises the 2026-04-21 lab-fallback anchor — `applyVerifiedAirborneCatalogAnchor` R'w ≤ Rw guard under field + building contexts |
| `wall-clt-local` | gypsum_board 12.5 + clt_140 140 + gypsum_board 12.5 (3 layers) | `WALL_FIELD_CONTEXT` only | Exercises the framed-wall split module boundary + formula-owned lane for CLT (no exact catalog row) |
| `wall-lsf-knauf` | acoustic_gypsum 12.5 ×2 + air_gap 5 + glasswool 70 + acoustic_gypsum 12.5 ×2 (6 layers) | `WALL_FIELD_CONTEXT` + `{ airtightness:"good", connectionType:"line_connection", studSpacingMm:"600", studType:"light_steel_stud" }` | Anchors Knauf exact row `knauf_lsf_2x2_12_5_70_glasswool_lab_416702_2026` → Rw=55; proves `studType` plumbing through the generated-variant loop |
| `wall-timber-stud` | gypsum_board 12.5 ×2 + rockwool 50 + air_gap 50 + gypsum_board 12.5 ×2 (6 layers) | `WALL_FIELD_CONTEXT` + `{ airtightness:"good", connectionType:"line_connection", studSpacingMm:"600", studType:"wood_stud" }` | Drift guard on the parked formula-family-widening gap (Rw=31 must remain stable across split variants + duplicate swaps under the `wood_stud` lane) |

**Canonical identifier gotcha**: the timber-stud preset's
`studType` is `"wood_stud"`, not `"timber_stud"` (verified in
`preset-definitions.ts:181`). Hardcode `"wood_stud"` in the
fixture, not the preset-id short form.

Each new case must include `splitPlans` that produce both
neutral variants (thickness repartitioning) and duplicate-swap
variants (final-row permutations) — same discipline the existing
three wall cases use (§R1 shapes).

Proposed `splitPlans` per new case (chosen to exercise both a
cavity row and a board row):

- `wall-masonry-brick`: `[{parts:[50,50], rowIndex:1}]` — split
  the 100 mm porotherm core into two 50 mm halves.
- `wall-clt-local`: `[{parts:[70,70], rowIndex:1}]` — split the
  140 mm CLT into two 70 mm halves.
- `wall-lsf-knauf`: `[{parts:[35,35], rowIndex:3}, {parts:[6.25,6.25], rowIndex:5}]`
  — split the 70 mm glasswool fill AND one of the 12.5 mm
  acoustic gypsum facings.
- `wall-timber-stud`: `[{parts:[25,25], rowIndex:2}, {parts:[6.25,6.25], rowIndex:4}]`
  — split the 50 mm rockwool fill AND one of the 12.5 mm gypsum
  facings.

### Dimension B — Closeout contract reconciliation

Run the 26 existing `post-mixed-floor-wall-*` closeout contracts
against the expanded `ENGINE_MIXED_GENERATED_CASES`. Concrete
hardcoded dependencies confirmed by §R6 recon:

- `post-mixed-floor-wall-duplicate-swap-grid-next-slice-selection-contract.test.ts`
  lines 82-105: `currentSeededBoundaryRoutes` array with 6
  entries, 2 wall (`route-wall-held-aac`,
  `route-wall-heavy-composite-hint-suppression`).
- Any contract using `ENGINE_MIXED_GENERATED_CASES.length` or
  `.filter((c) => c.studyMode === "wall")` with a hardcoded
  count expectation.
- `toEqual([...])` on a case-id array listing all current case
  ids.

The grep-sweep command for this step is:

```
grep -nE 'ENGINE_MIXED_GENERATED_CASES|SELECTED_ENGINE_MIXED_GENERATED_ROUTE_CASES|currentSeededBoundaryRoutes|studyMode: ?"wall"' packages/engine/src/post-mixed-floor-wall-*.test.ts
```

Update each affected contract to accept the new cases without
loosening its assertion (no `toBeGreaterThanOrEqual` softening —
pin the new exact count with an inline comment linking to this
slice). Expected counts post-slice:

- `ENGINE_MIXED_GENERATED_CASES.length`: 33 → 37
- Wall cases: 3 → 7
- `currentSeededBoundaryRoutes`: unchanged (new cases add
  routes only if we extend `SELECTED_ENGINE_MIXED_GENERATED_ROUTE_CASES`;
  default posture is to leave that frozen).

### Dimension C — Cross-mode torture extension

Author `mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts`
(engine side) combining five overlays on the four new wall
cases. Each overlay's concrete primitive is already on disk per
§R7:

1. **Hostile input overlay** — for each new case, swap exactly
   one layer's `thicknessMm` with each of {`NaN`, `Infinity`,
   `-5`, `0`, `100001`}. Call `calculateAssembly`. Assert the
   engine returns a fail-closed result (no crash, no `NaN` in
   any output) with a specific warning mentioning the offending
   layer. Primitive: `evaluateAssemblyInputGuard()` in
   `assembly-input-guardrail.ts:50-95`.
2. **Reorder overlay** — for each new case, apply `[...rows].reverse()`
   and compare `Rw`, `C`, `Ctr`, `supportedTargetOutputs` to the
   forward baseline. Non-asymmetric wall stacks must produce
   identical values; asymmetric stacks (e.g. lined-massive) must
   produce identical `supportedTargetOutputs` and either
   identical values (symmetric invariance) or values within the
   family's tolerance window. Pattern mirror:
   `wall-reorder-invariance-matrix.test.ts:40-57`.
3. **Save-load overlay** — for each new case, run
   `JSON.parse(JSON.stringify({ rows, airborneContext }))` then
   recompute; assert `resultSnapshot()` equality to the direct
   call. Confirms input types are actually JSON-safe.
4. **Duplicate-swap overlay** — for each new case, call
   `buildDuplicateSwapGridVariants(testCase)` and assert every
   variant's `resultSnapshot()` equals the baseline. Primitive:
   `mixed-floor-wall-generated-matrix.test.ts:31-54`.
5. **Edit-history replay overlay** — for `wall-lsf-knauf` and
   `wall-timber-stud` only, run three `calculateAssembly` calls
   in sequence with `airborneContext.studType` toggled
   `light_steel_stud` → `wood_stud` → `light_steel_stud` (same
   rows). Assert the third call's `resultSnapshot()` equals the
   first call's. Engine idempotency under reversible context
   mutation.

All five overlays iterate independently (`overlay × newCase`
=  5 × 4 = 20 assertions minimum). A sixth composite overlay —
"duplicate-swap grid with hostile-input on one layer" — is
optional stretch; skip unless time budget allows, because the
four independent overlays already cover the primary risks.

### Dimension D — Final audit prep (step 8 seed)

Without authoring the final-audit slice (that is step 8's own
scope), leave the following seeds in place so step 8 starts from
a clean baseline:

- `MASTER_PLAN.md` §3 wall grid row updates reflecting the new
  `ENGINE_MIXED_GENERATED_CASES` coverage (`🟡 Family (partial)` on
  the wall field continuation row flips to `🟢 Benchmark` iff no
  sub-findings open; otherwise documents the surviving gap).
- `CURRENT_STATE.md` completion signal table — C4 and C5 stay
  green, C2 + C3 corridor-surface deferrals remain documented
  verbatim.
- `NEXT_IMPLEMENTATION_PLAN.md` → active slice flips to
  `good_calculator_final_audit_v1` (step 8) with plan-doc-TBD
  note, mirroring the shape this doc was authored under.

The executable `coverage-grid-consistency.test.ts` (§7 test
strategy item for step 10 — renumbered as step 8 finalisation
test) is **out of scope for this slice**; it is authored by step
8.

## Accuracy Findings Ledger

Live log of real engine bugs surfaced by this slice. Each entry
lists what the torture matrix caught + how it was fixed + the
regression guard that pins the fix.

### F2 — Exact catalog match stopped firing when same-material layers split (2026-04-22, landed)

- **Surfaced by**: Atomic order step 5 (adding `wall-lsf-knauf`
  with `splitPlans` splitting the 70 mm glasswool fill into
  35+35). The `mixed-floor-wall-generated-matrix` snapshot-
  equality loop saw Rw=55 on the intact 6-layer baseline
  (Knauf exact anchor `knauf_lsf_2x2_12_5_70_glasswool_lab_416702_2026`
  firing) but Rw=60 on the 7-layer split — the exact match
  stopped firing.
- **Root cause**: `layersApproximatelyMatch` in
  `packages/engine/src/airborne-verified-catalog.ts:866` required
  strict `inputLayers.length === referenceLayers.length`
  before the per-position material+thickness check. A same-
  material split produced 7 input layers vs. the catalog's
  6-layer reference.
- **Fix**: added `coalesceAdjacentSameMaterialLayers` as an
  exported helper in `packages/engine/src/airborne-topology.ts`.
  Merges consecutive layers that share `material.id`, summing
  `thicknessMm` + `surfaceMassKgM2`, preserving the first
  fragment's material reference. Applied **only** at
  `layersApproximatelyMatch` — symmetrically to both input and
  reference stacks before the length + per-position check.
  Scope is deliberately narrow: the catalog match is the only
  site where strict-length equality is load-bearing and false-
  match risk is bounded (catalog entries are hand-curated and
  symmetric coalesce preserves their intended matching range).
- **Regression guard**:
  `airborne-verified-catalog-same-material-split-invariance.test.ts`
  pins Rw=55 for the Knauf LSF stack under two splits — 70 mm
  glasswool → 35+35 and one acoustic_gypsum_board facing →
  6.25+6.25. Both must match the intact 6-layer Rw=55.
- **What was tried and reverted**: applying the coalesce at the
  engine entry (`calculateDynamicAirborneResult`) to fix the
  downstream monotonic-floor warning drift also — that landed
  18 test failures across 8 files in the full engine suite
  because the framed-wall benchmarks are physically calibrated
  on the non-coalesced input distinction between `2×12.5 mm
  gypsum` (double-board topology, shear-damping) and `1×25 mm
  gypsum` (single-board topology). Collapsing those is
  physically incorrect even though the total mass and
  thickness are identical. The engine-entry coalesce was
  reverted; the monotonic-floor warning divergence on board-
  layer splits is tracked as **F3 (deferred)**.
- **Behaviour preservation**: the scoped coalesce at
  `layersApproximatelyMatch` is a no-op on every catalog-match
  call whose input does not contain adjacent same-material
  runs. Confirmed by full engine suite green after the scoped
  landing (194 files, 1070 tests).

### F3 — Framed-wall monotonic-floor guard emits extra warning on board-facing splits (2026-04-22, deferred)

- **Surfaced by**: same step-7 work as F2, during the engine-
  entry-coalesce experiment. When a framed-wall acoustic
  gypsum facing is split into equal halves (e.g. `12.5 → 6.25 +
  6.25`), the numeric outputs (Rw, R'w, C, Ctr, DnT) stay
  byte-identical to the intact baseline, but
  `dynamic-airborne.ts:903`'s "framed reinforcement monotonic
  floor" guard picks different sibling-variant comparison
  stacks (7 layers vs. 6) and emits an extra diagnostic
  warning on the split. The `resultSnapshot()` matrix
  comparator does byte-exact warnings-array equality so the
  split variant fails the matrix even though numbers are
  correct.
- **Why not fixed now**: the only surgical fix that
  eliminates the warning-drift without regressing benchmarks
  is either (a) a targeted topology-aware siblings generator
  that canonicalizes by material-id runs OR (b) a warning
  filter that suppresses the monotonic-floor diagnostic when
  it fires due to layer-count-only sibling divergence. Both
  are out of scope for the wall-lsf-knauf case landing — the
  studType-plumbing proof is already served by the glasswool-
  only split.
- **Current mitigation**: `wall-lsf-knauf`'s `splitPlans`
  splits only the 70 mm glasswool fill (porous cavity; safely
  coalesces at the catalog match layer, never triggers the
  framed monotonic-floor guard). The facing-split torture is
  deferred until F3 can be properly fixed at the guard level.
  Inline comment on the splitPlans entry documents the
  deferral.
- **Open path to close F3**: audit the monotonic-floor guard
  in `dynamic-airborne.ts:~2985-2995` to make its sibling-
  variant generation layer-count-invariant. Low priority —
  cosmetic drift only, numeric outputs already correct.

### F4 — Reorder overlay assumption "all preset stacks are symmetric" was wrong (2026-04-22, test refined)

- **Surfaced by**: Atomic order step 7 (authoring
  `mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts`
  with the O2 reorder overlay). Initial implementation asserted
  strict bit-equality of Rw/C/Ctr/R'w/DnT under row reversal
  for all four step-7 wall cases. `wall-lsf-knauf` failed with
  Rw=55 → 60 drift under reversal (5 dB).
- **Root cause (test, not engine)**: The LSF + timber-stud
  preset rows are NOT geometrically symmetric — the internal
  cavity is `[air_gap 5, glasswool 70]` (LSF) or
  `[rockwool 50, air_gap 50]` (timber-stud). Reversing the
  row order physically swaps the fill-side and gap-side inside
  the cavity, which the exact-catalog matcher picks up (F2
  coalesce still sees them as different sequences because the
  material order between non-same-material neighbours is
  preserved). The engine is behaving correctly; the test
  assumption was naïve.
- **Fix (test, targeted)**: `SYMMETRIC_REORDER_CASE_IDS` const
  lists the two truly-symmetric cases (`wall-masonry-brick`,
  `wall-clt-local`). For those, strict bit-equality is asserted.
  For the asymmetric LSF + timber-stud cases, structural
  invariance is asserted instead: `dynamicFamily` +
  `supportedTargetOutputs` stay stable (reversal never changes
  the topology class), and all metrics stay finite (no
  fail-closed drop). This is the correct semantic: "reorder
  of a symmetric assembly = no-op; reorder of an asymmetric
  assembly = different but defended answer."
- **No regression guard needed**: the torture matrix IS the
  guard. The symmetric/asymmetric split encodes the physical
  contract per-case.
- **Why not fix the engine's asymmetry detection**: the engine
  IS correctly distinguishing the two arrangements; that is the
  right physics. A user who drag-flips `[gyp, air, fill, gyp]`
  into `[gyp, fill, air, gyp]` has built a physically different
  assembly, and the engine should say so. Papering over that
  with a "reorder-invariance under any permutation" promise
  would be accuracy-regressing.

### F1 — Masonry calibration fell off lane when same-material core split (2026-04-22, landed)

- **Surfaced by**: Atomic order step 3 (adding `wall-masonry-brick`
  to `ENGINE_MIXED_GENERATED_CASES`). The `mixed-floor-wall-generated-matrix`
  snapshot-equality loop saw Rw=43 on the intact `porotherm_pls_100` 100 mm
  core but Rw=47 when the split-plan `[{parts:[50,50], rowIndex:1}]`
  fragmented the core into two 50 mm layers. Physically equivalent
  stack, +4 dB engine drift — real accuracy bug.
- **Root cause**: the nine calibrators in
  `packages/engine/src/dynamic-airborne-masonry-calibration.ts`
  (AAC massive, Silicate, Celcon finished, unfinished aircrete,
  Ytong Massief, Ytong Separatiepaneel, Ytong Cellenbetonblok,
  Porotherm plastered, HELUZ plastered) gate on
  `solidLayers.length === 3` to recognize the "finish + core +
  finish" topology. A same-material split of the core produces 4
  solid leaves and the calibration returns `targetRw: null`,
  dropping back to the generic single-leaf lane that overestimates
  Rw by ~4 dB on Porotherm geometry.
- **Fix**: added `coalesceSameMaterialSolidLeaves(layers)` helper
  at the top of `dynamic-airborne-masonry-calibration.ts`. Merges
  consecutive solid-leaf layers that share `material.id` by
  summing `thicknessMm` and `surfaceMassKgM2`, preserving non-
  solid layers (gaps, porous fills) so downstream multi-leaf
  topology detection stays intact. Wired into all nine calibrators
  via `coalesceSameMaterialSolidLeaves(layers).filter(...)` before
  the `.length === 3` check.
- **Regression guard**:
  `dynamic-airborne-masonry-same-material-split-invariance.test.ts`
  pins Rw=43 for Porotherm 100 mm intact, 50+50 symmetric split,
  40+60 asymmetric split, and 6.5+6.5 plaster-finish split —
  every configuration must match intact.
- **Behaviour preservation**: the coalesce pass is a no-op on
  stacks without adjacent same-material solid leaves (the existing
  benchmark tests). Confirmed by the preset-surface benchmark
  tests staying green end-to-end after the fix (Rw=43 Porotherm
  still pinned, other materials untouched).

## Deliverables

1. **`mixed-floor-wall-generated-test-helpers.ts`** — four new
   wall cases added under `ENGINE_MIXED_GENERATED_CASES`
   (dimension A). Each with matching split plans + the correct
   lab/field option context containing the preset's
   `airborneDefaults`.
2. **`mixed-floor-wall-generated-matrix.test.ts`** — passes
   unchanged; the existing `for (const testCase of
   ENGINE_MIXED_GENERATED_CASES)` loop picks up the new cases
   automatically.
3. **Updated post-contract closeouts** (dimension B) — 0 to ~6 of
   the 26 contracts will need updates; the exact count discovered
   during implementation and recorded in the slice close commit.
4. **`mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts`**
   — dimension C, five-overlay torture matrix on the new cases.
5. **`post-mixed-floor-wall-edge-case-hardening-v1-next-slice-selection-contract.test.ts`**
   — post-contract pinning what closed + selecting
   `good_calculator_final_audit_v1` (step 8).
6. **Triangle updates** — CURRENT_STATE + NEXT_IMPLEMENTATION_PLAN
   + MASTER_PLAN §3 grid + §4 master sequence step 7 → step 8
   transition, plus `docs/README.md` fast-path if any wording
   drift surfaces.
7. **Plan archival** — this file moves from
   `docs/calculator/` to `docs/archive/handoffs/` on close, same
   convention the three prior slice plan docs followed.
8. **Focused gate update** — new matrix + post-contract added to
   the gate's test-file list so the slice ships with a green
   focused gate, not just a green broad `pnpm check`.

## Implementation Steps (Atomic Order)

1. **Author this plan doc + baseline drift fix.** (done — single
   bundled commit, see 2026-04-22 baseline verification below).
2. **Pre-slice baseline snapshot — verified 2026-04-22.** `pnpm
   calculator:gate:current` passed green on 2026-04-21, but
   broad `pnpm check` surfaced two previously-undetected drift
   items that the focused gate does not run: (a) 54 unused-import
   lint errors in `dynamic-airborne.ts` +
   `dynamic-airborne-masonry-calibration.ts` (dead imports left
   from the 2026-04-21 split refactor), and (b) a
   `formattedValue` → `value` type-only typo in
   `raw-wall-hostile-input-route-card-matrix.test.ts`. Both
   fixed in the same bundled commit that authors this plan.
   `dynamic-airborne.ts` now at 3152 lines (was 3214). `pnpm
   check` green end-to-end. This is the real rollback target per
   AP1.
3. **Add `wall-masonry-brick` case** to `ENGINE_MIXED_GENERATED_CASES`
   with its split plans + field options. Run the matrix test.
   Expected: green (case iterates cleanly through the existing
   snapshot-equality loop). If any post-contract fails, land the
   contract update in the same commit.
4. **Add `wall-clt-local` case.** Same pattern.
5. **Add `wall-lsf-knauf` case.** Same pattern. This is the first
   case that threads `studType` through; if the workbench-side
   `loadPreset` → engine `airborneContext` plumbing reveals a
   gap, land the fix here (not in a separate slice).
6. **Add `wall-timber-stud` case.** Same pattern. Record the
   expected Rw=31 / R'w=24 drift-guard values in an inline comment
   linking to the slice 2 closeout.
7. **Author `mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts`**
   with the five overlays iterating the new cases. Land red →
   engine/workbench fix if any → land green.
8. **Broad sweep** — `pnpm check` to catch any snapshot or
   coverage-count drift in unrelated test files.
9. **Triangle + grid + master-plan §4 sequence updates** to
   reflect the new active slice (step 8).
10. **Post-contract authoring.** Pin the
    `good_calculator_final_audit_v1` selection + the four new
    engine case ids + the new overlay matrix test as closure
    evidence.
11. **Plan doc archive move** — `git mv
    docs/calculator/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md
    docs/archive/handoffs/`.
12. **Focused gate config update** — add the new matrix + the new
    post-contract to the gate's test list.
13. **Broad final check** — `pnpm calculator:gate:current` + `pnpm
    check` green; `git diff --check` clean.
14. **Atomic closing commit** with the slice summary (new cases,
    new matrix, updated contracts, triangle updates).

## Expected Outcomes

| Test | Expected | If Fails |
|---|---|---|
| Existing `mixed-floor-wall-generated-matrix` on new cases | green (snapshot stability under all split + duplicate-swap variants) | real mixed-mode engine instability — block close and investigate |
| `wall-masonry-brick` I1 (R'w ≤ Rw) under field + building context | green (lab-fallback anchor holds) | lab-fallback anchor lane regressed — emergency revert or patch |
| `wall-lsf-knauf` Rw = 55 on baseline + all split variants | green (exact catalog anchor) | `studType` plumbing broken between `loadPreset` and engine |
| `wall-timber-stud` Rw = 31 / R'w = 24 on baseline + all variants | green (drift guard holds) | formula-owned lane became unstable — sub-finding blocks close |
| 5-overlay cross-mode matrix | green on all 4 × 5 = 20 combinations | overlay interaction bug — investigate case-by-case |
| Post-contract closeout contracts | green (hardcoded counts updated if needed) | count drift — update contract with inline link to this plan |
| `pnpm check` broad | green | out-of-scope regression — fix before close |

## Stop Conditions (Do NOT Ship If)

- Any new wall case produces a value that differs from its
  preset-level pin without an explicit engine reason (would
  indicate the preset surface and the torture matrix disagree).
- The lab-fallback anchor lane (masonry brick) shows R'w > Rw
  under any variant — same posture as the 2026-04-21 flanking
  inversion fix; treat as real engine accuracy bug.
- The timber stud case pins drift below 31 / 24 under any variant
  (the parked accuracy gap getting worse is not acceptable even
  as a known-low lane).
- Any of the 26 existing post-contract closeouts softens its
  assertion (`toBeGreaterThanOrEqual` instead of `toBe`) to
  accommodate the new cases — pin the exact new count instead.
- Broad `pnpm check` surfaces a snapshot-drift failure in a test
  file that does not import `ENGINE_MIXED_GENERATED_CASES` (would
  indicate a genuine unrelated regression).

## Risk & Rollback

- **Risk**: the wall surface of `ENGINE_MIXED_GENERATED_CASES` was
  intentionally thin during floor-first development. Adding four
  cases may surface dormant snapshot instabilities in corridors
  that never ran the generated variant grid before. Mitigation:
  land cases one at a time (steps 3-6), commit each atomically,
  so any surprise is bisect-friendly.
- **Risk**: the `studType` plumbing from `loadPreset` into the
  engine's `airborneContext` was proven on the preset-surface
  benchmarks in slice 2 but not end-to-end through the
  generated-variant loop. If the loop strips or overrides the
  context, the LSF case will drift. Mitigation: the
  `FLOOR_AIRBORNE_CONTEXT` and `WALL_FIELD_CONTEXT` constants in
  the helpers file already accept arbitrary fields — extend them
  with preset defaults explicitly rather than relying on implicit
  merging.
- **Risk**: post-contract contracts with hardcoded case counts
  could drift silently if a contract asserts `.length >= N`
  instead of `.length === N`. Mitigation: grep for `.length` +
  `toBeGreaterThan` on `ENGINE_MIXED_GENERATED_CASES` usages
  before running; tighten any soft asserts as part of dimension B.
- **Rollback**: each new case lands in its own commit (one for
  masonry brick, one for CLT, one for LSF, one for timber stud).
  The cross-mode matrix lands separately. Any commit is
  independently revertable if a post-slice regression surfaces.

## Non-Obvious Notes For The Next Agent

1. **Lab-fallback anchor is physical, not a workaround.** When
   the masonry brick case exercises `applyVerifiedAirborneCatalogAnchor`'s
   lab-fallback branch, that is the intended path — do not
   circumvent it with a direct mode-override. The invariants
   matrix (I1) is the safety net.
2. **Timber stud is formula-owned by design.** The Rw=31 value is
   pinned as a drift guard with an inline comment linking to the
   step 6 conditional slice. This slice's job is to prove it
   stays stable across the mixed-mode torture matrix, not to fix
   it. Step 6 opens separately if external wood-stud evidence
   ever lands.
3. **The split engine layout must be honoured.** When importing
   test fixtures, pull from the narrow split modules
   (`dynamic-airborne-framed-wall.ts`,
   `dynamic-airborne-masonry-calibration.ts`) rather than from
   `dynamic-airborne.ts`. The facade re-export still works, but
   direct imports document the module boundary crossing.
4. **Edit-history replay overlay is the subtlest.** Simulating
   `studType` toggles exercises the workbench-store round-trip,
   not the engine directly. If this overlay fails, the fix is
   most likely in `features/workbench/workbench-shell.tsx`
   `liveAirborneContext` merging, not in the engine.
5. **Step 8 is not a cleanup pass.** The final audit slice
   (`good_calculator_final_audit_v1`) is a signal-verification
   slice — every completion signal must hold with an executable
   assertion. This slice prepares the surfaces for that audit
   but does not itself verify the signals.

## Out Of Scope For This Slice

- Fixing the timber stud accuracy gap (step 6, conditional; only
  opens if external evidence lands).
- `dynamic_airborne_split_refactor_v2` (composer-injection; low
  priority per checkpoint deferral ledger).
- Dimension B corridor VALUE pins on
  `dynamic-airborne-wall-selector-trace-matrix` (deferred
  follow-up from slice 5).
- Floor-side edge-case hardening (already covered by the 30-case
  floor surface; no identified gap).
- Authoring `coverage-grid-consistency.test.ts` (step 8's job).
- Any blocked-source reopen (`GDMTXA04A`, `C11c`, bare-carrier
  impact, wall-selector widening) — fail-closed posture stays.

## Next Slice (After This Closes)

**`good_calculator_final_audit_v1`** (master-plan step 8).

Why: every non-conditional move on the master sequence (steps 1,
1b, 2, 3, 4, 5, 7) will have closed with green post-contracts.
Step 6 stays conditional pending external evidence. The final
audit is the direct path to shipping the "done calculator"
milestone per `MASTER_PLAN.md` §8.

The step 8 slice will:

- Author `coverage-grid-consistency.test.ts` that asserts the §3
  grid matches the engine's defended corridor list.
- Verify C1-C6 each with an executable assertion.
- Archive the full resume triangle into a session-close checkpoint
  + open a fresh triangle describing the post-calculator
  roadmap (productization, desktop app, multi-user — explicit
  non-goals until calculator is done).

## Resume Checklist For The Next Agent

1. Read this file top-to-bottom.
2. Read `CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md` for the
   full session narrative leading into step 7.
3. Check `git log --oneline 4d80ddb..HEAD` — which deliverables
   have landed since the 2026-04-21 session-close checkpoint?
4. Run `pnpm calculator:gate:current` — confirm green baseline
   matches the checkpoint (1068 engine + 792 web tests).
5. Start from the first un-landed deliverable in the Atomic
   Order above; commit each atomically; gate after every commit.
6. When dimensions A-D all land green and the post-contract is
   written, `git mv` this plan doc to `docs/archive/handoffs/`
   as part of the closing commit.
