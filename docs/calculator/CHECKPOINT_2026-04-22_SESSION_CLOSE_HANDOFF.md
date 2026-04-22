# Checkpoint — 2026-04-22 Session Close

Document role: end-of-day handoff + session-wide progress
snapshot. Next agent resumes from the resume triangle
(CURRENT_STATE + NEXT_IMPLEMENTATION_PLAN + MASTER_PLAN) but
reads this first for the session narrative and the explicit
"planned but not done" ledger.

## Session Summary

**Commits landed: 12** (all on `main`, no branches in flight;
branch is ahead of `origin/main` by 20 commits total since the
2026-04-21 session close).

Two master-plan slices moved from "selected" to "closed" in
this session, plus one strategic re-selection:

| Slice | Master-plan step | Closed | Key finding |
|---|---|---|---|
| `mixed_floor_wall_edge_case_hardening_v1` | 7 | `dede459` | F1 masonry calibrator + F2 verified-catalog same-material-split fixes |
| `wall_corridor_surface_value_pinning_v1` | 7b (re-selected ahead of step 8) | `9e3793f` | C2 + C3 corridor surfaces flipped 🟡 → ✅, no engine changes needed |

MASTER_PLAN completion signals as of session close:

| # | Signal | Before session | After session |
|---|---|---|---|
| C1 | Wall preset coverage ≥ 6 archetypes | ✅ 6/6 (preset surface) | **✅ 6/6 (preset + engine torture + selector surfaces all parity)** |
| C2 | Source-backed + benchmark audits | 🟡 preset ✓ · corridor deferred | **✅ preset + corridor both VALUE-pinned** |
| C3 | Field continuation completeness | 🟡 preset ✓ · corridor deferred | **✅ preset + corridor both VALUE-pinned** |
| C4 | Hostile input discipline floor + wall | ✅ | ✅ extended with 8-overlay torture O1 |
| C5 | Reorder invariance | ✅ | ✅ extended with torture O2 (strict symmetric + bounded asymmetric) |
| C6 | Architectural hygiene (files ≤2000 lines) | 🟡 3214 lines, split v2 deferred | **🟡 3152 lines, split v2 still deferred — cleaner baseline but no new progress** |

## What Shipped Today

### Step 7 — `mixed_floor_wall_edge_case_hardening_v1`

7 atomic commits bringing the engine wall torture surface to
6/6 preset parity + authoring the 8-overlay cross-mode torture
matrix + surfacing and fixing two real engine accuracy bugs.

**Four new cases added to `ENGINE_MIXED_GENERATED_CASES`**:

| Case id | Commit | What it tests |
|---|---|---|
| `wall-masonry-brick` | `c8ec763` | Porotherm masonry + lab-fallback anchor |
| `wall-clt-local` | `f0b2c3e` | CLT formula-owned lane + framed-wall split boundary |
| `wall-lsf-knauf` | `eb46603` | Knauf exact anchor + studType=light_steel_stud plumbing |
| `wall-timber-stud` | `e2a72b5` | wood_stud formula-owned drift guard |

Case count: 33 → 37 total (floor 30 unchanged, wall 3 → 7).

**Two real engine accuracy bugs caught and fixed**:

- **F1** (landed in `c8ec763`): The nine masonry calibrators
  in `dynamic-airborne-masonry-calibration.ts` gated on
  `solidLayers.length === 3` and fell off lane when a
  same-material core was split into equal halves. Porotherm
  100 mm → 50+50 drifted Rw 43 → 47 (+4 dB). Fixed with
  `coalesceSameMaterialSolidLeaves` helper applied across all
  nine calibrators. Regression guard:
  `dynamic-airborne-masonry-same-material-split-invariance.test.ts`.
- **F2** (landed in `eb46603`): `layersApproximatelyMatch` in
  `airborne-verified-catalog.ts` required strict input/reference
  length equality. A same-material split on the Knauf LSF stack
  (70 mm glasswool → 35+35) drifted Rw 55 → 60. Fixed with
  `coalesceAdjacentSameMaterialLayers` helper applied
  symmetrically at the catalog match site only. An
  engine-entry coalesce experiment was reverted — it broke 18
  framed-wall benchmark tests because `2×12.5 mm` vs.
  `1×25 mm` is a physically meaningful distinction
  (double-board shear damping vs. single-board topology).
  Regression guard:
  `airborne-verified-catalog-same-material-split-invariance.test.ts`.

**8-overlay cross-mode torture matrix** (commit `1d3c145` +
`dede459`): 32 assertions iterating 4 new wall cases × 8
overlays — hostile input / reorder / save-load /
duplicate-swap / history-replay / physical invariants /
engine-direct drift guard / many-layer stability. Two test-
discipline findings (F3 cosmetic warning drift on board-layer
splits, deferred; F4 reorder-asymmetry test refinement,
landed).

Closed in `dede459` with post-contract
`post-mixed-floor-wall-edge-case-hardening-v1-next-slice-selection-contract.test.ts`.

### Strategic re-selection (2026-04-22)

Post-step-7 ROI re-analysis concluded the corridor-surface
VALUE-pin gap (C2 + C3 🟡 preset-only) should close **before**
the final audit so step 8 audits a fully-green grid, not a
documented-deferred partial. The step-7 post-contract selected
step 8; this re-selection superseded (not erased) that line
because post-contracts lock what CLOSED, not what MUST come
next.

Documented in `61e2730` (plan authoring) + `980f173` (recon
detailing).

### Step 7b — `wall_corridor_surface_value_pinning_v1`

4 atomic commits closing the corridor-surface VALUE-pin gap.
Zero engine changes — every cell landed inside the ISO
717-1:2020 plausibility window the plan pre-registered.

**VALUE-pin matrix landed** (`67deee1`):
`dynamic-airborne-wall-selector-value-pins.test.ts` — 6
corridor labels × 3 contexts × 9 outputs = 18 cells with
detected family + 9 metric pins each (lab cells `toBeNull()`
the 5 field-only outputs as drift guards). Plus a 5-test
cross-cell invariant bank (I1 R'w ≤ Rw, I2 |Dn,A − (Dn,w +
C)| ≤ 1 dB, I3 DnT,w − Dn,w ∈ [0, 10] dB, Ctr ≤ C, STC ≈ Rw
within ±3 dB).

Source layer fixtures lifted verbatim from
`CASES[0..5]` in the existing trace matrix so engine
behaviour stays identical to what is already tested.

**Stud-context plumbing hardened**: discovery surfaced that
`lab_double_stud` detected as `double_leaf` under plain
FIELD_CONTEXT / BUILDING_CONTEXT because those contexts did
not carry `studType`. Fixed by introducing
`FRAMED_FIELD_CONTEXT` + `FRAMED_BUILDING_CONTEXT` variants
that preserve stud metadata across all 3 contexts — family
detection now stays `double_stud_system` consistently.
Pattern matches the step-6 preset-benchmark wiring.

**Test-infrastructure flake fixed**: the full-suite serial
run surfaced a 5-second timeout flake on
`floor-library-sweep.test.ts`'s field-bundle high-split test
(ran 7499 ms under CPU contention; standalone ran 2816 ms).
Raised that one test's timeout to 15 s with an inline
explanation. No other tests affected.

Closed in `9e3793f` with post-contract
`post-wall-corridor-surface-value-pinning-v1-next-slice-selection-contract.test.ts`.

## 2026-04-21 Drift Correction (Baseline Hygiene)

First commit of this session (`51e560c`) also corrected two
drift items the 2026-04-21 session-close checkpoint had missed
— the focused gate (`pnpm calculator:gate:current`) never ran
package-wide lint or tsc, so both slipped past:

1. **54 unused-import lint errors** in `dynamic-airborne.ts`
   (52) and `dynamic-airborne-masonry-calibration.ts` (2) —
   dead imports left over from the 2026-04-21 split refactor
   v1. Removed. Main file now 3152 lines (was 3214, 6630
   pre-split).
2. **`formattedValue` → `value` type-only typo** in
   `raw-wall-hostile-input-route-card-matrix.test.ts` line 65.
   `BaseOutputCardModel` has `value`, not `formattedValue`.
   Vitest (esbuild) stripped types and produced the fallback
   `""` at runtime so tests were green; tsc caught the type
   error.

Both fixes are behaviour-preserving per AP3.

## Planned But Not Done (Explicit Deferral Ledger)

Six follow-up tracks explicitly deferred and documented:

### Track 1 — `dynamic_airborne_split_refactor_v2`

- **What is left**: the 14 `apply*` floor / cap guards + the
  composition scaffolding (~3150 lines) in `dynamic-airborne.ts`.
- **Blocker**: guards recursively call
  `calculateDynamicAirborneResult` → circular-import blocker
  needs composer injection.
- **Fix path**: refactor guards to accept composer as function
  parameter (dependency injection).
- **Blueprint doc**:
  `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`.
- **Priority**: low-medium. Unlocks the final C6 signal tick
  but delivers no user-facing accuracy.
- **Extra caution** (added 2026-04-22): an engine-entry
  coalesce experiment during step 7 showed that broad
  normalization at the top of the engine breaks framed-wall
  benchmarks because the `2×12.5 mm` vs. `1×25 mm` distinction
  is physically meaningful. Split v2 should NOT try to
  normalize — just reorganize — unless the normalization is
  gated behind a context flag.

### Track 2 — `wall_formula_family_widening_v1` (master-plan step 6, conditional)

- **What triggers it**: `timber_stud_wall` preset currently
  produces `Rw = 31 dB` under auto-select calculator; published
  field data for similar 2+2 gyp / 50 mm rockwool / 50 mm air /
  2+2 gyp stacks on wood studs is typically 45-50 dB.
- **Fix path options** (unchanged from 2026-04-21 checkpoint):
  dedicated wood-stud formula lane, Dataholz/Knauf/Rockwool
  exact row import, or re-weight existing framed predictor.
- **Priority**: medium. **Source-blocked**: stays conditional
  pending external wood-stud coupling evidence. AP4 (blocked-
  source posture never loosened) respected. A quick spike on
  2026-04-22 confirmed the gap is genuinely source-blocked,
  not engine-addressable with existing evidence.

### Track 3 — Dimension B deep-hybrid swap VALUE pins

- **What is left**: VALUE pins on the four
  `dynamic-airborne-deep-hybrid-swap-*.test.ts` files'
  swap-grid cells. They currently guard
  no-silent-≥8-dB-adjacent-swap-jump only.
- **Why deferred**: per-cell VALUE pins on the swap grid are
  high-noise and would multiply the matrix by N⁴ variants
  with no clear ROI argument.
- **Priority**: low. Narrative + invariant guards already
  cover the surface.

### Track 4 — Dimension C workbench card VALUE pins

- **What is left**:
  `apps/web/features/workbench/wall-selector-output-origin-card-value-pins.test.ts`
  cross-checking card-level `value` / `status` / `tone` against
  the engine VALUE pins per corridor × context.
- **Why deferred**: optional stretch deliverable of step 7b;
  skipped to keep the slice scoped to the engine-side accuracy-
  discipline delivery.
- **Priority**: low-medium. Good follow-up slice when the
  workbench card surface needs independent audit.

### Track 5 — F3 framed-wall monotonic-floor warning drift

- **What is left**: a diagnostic-warning drift when a
  framed-wall board layer is split into equal halves. Numeric
  outputs (Rw, R'w, C, Ctr, DnT) stay byte-identical to the
  intact baseline, but the monotonic-floor guard in
  `dynamic-airborne.ts` picks different sibling-variant
  comparison stacks and emits an extra diagnostic warning.
- **Mitigation active**: `wall-lsf-knauf` torture case
  splits only the porous glasswool fill; facing-split torture
  is deferred.
- **Priority**: negligible. Cosmetic drift only.

### Track 6 — Floor field continuation audit (parallel track)

- **What it would be**: a systematic pin pass on floor
  corridors parallel to the wall work landed in slices 5 +
  7b (new
  `raw-floor-field-continuation-completeness-matrix.test.ts`).
- **Why deferred**: MASTER_PLAN §5 explicitly folds floor
  field audit into step 6 (conditional). Floor is already
  well-defended per the §3 grid; this is an integrity check,
  not a coverage-expanding move.
- **Priority**: low-medium. Worth a ~1-2 d spike if the next
  agent wants to tighten floor surface without opening a
  source-blocked dependency.

## System Posture At Session Close

- **Branch**: `main`, clean working tree (post checkpoint
  commit).
- **Frozen upstream closeouts**: every pre-session closeout
  (reinforced-concrete follow-up, raw terminal-concrete helper,
  CLT-local combined evidence, broad audit, blocked-source
  refresh) untouched. The 2026-04-21 masonry flanking inversion
  fix + lab-fallback anchor remain load-bearing.
- **Blocked-source queue**: `GDMTXA04A` direct exact, `C11c`
  exact import, raw bare open-box/open-web impact, wall-selector
  widening — all still fail-closed awaiting external evidence.
- **Engine thickness guardrail**: live.
- **Physical invariants matrix**: 24 cells across 6 presets × 3
  contexts, I1/I2/I3 all green. **Extended by step 7b**: 18
  cells across 6 corridors × 3 contexts also I1/I2/I3 green.
- **Completeness matrix**: 18 cells × 10 outputs VALUE-pinned
  (preset surface, slice 5) + **18 cells × 9 outputs VALUE-
  pinned (corridor surface, step 7b)**.
- **`dynamic-airborne.ts`**: 3152 lines (down from 6630), split
  v2 still deferred.

## Final Validation Results

Engine + web full suites + focused calculator gate — all three
re-ran after the full session landed. Broad validation counts:

- **Engine full suite**: 199 test files, 1135 / 1135 tests
  green
- **Web full suite**: unchanged (step 7b did not touch web)
- **Focused gate** (`pnpm calculator:gate:current`): 5 / 5
  tasks green — now covers the corridor VALUE matrix + 7b
  post-contract + F1/F2 regression guards + step-7 torture
  matrix + step-7 post-contract alongside the prior gate
  surface
- **Broad `pnpm check`**: lint + typecheck + tests + build
  green end-to-end, exit 0

No test failures. No deferred fixes pending. No flakes
detected post-timeout-bump on floor-library-sweep.

## Next Active Slice

`good_calculator_final_audit_v1` (master-plan step 8).

Why it is next:

- Step 7 + 7b closed together on 2026-04-22.
- The last remaining non-source-blocked accuracy work
  (corridor VALUE pins) landed in 7b.
- Step 6 timber-stud widening is genuinely source-blocked (see
  Track 2 above) — cannot be closed without external lab data.
- Step 8 is the final audit slice; it now audits a fully-green
  C1-C5 grid (C6 split v2 remains documented-deferred per
  architectural scope — that deferral is acceptable because
  it does not affect user-facing accuracy or coverage).

First implementation question for the next agent:

- Does `coverage-grid-consistency.test.ts` need to iterate the
  engine's defended corridor list via reflection, or can it
  use a hardcoded snapshot of the §3 grid rows? (Pattern
  suggestion: hardcoded snapshot that the next grid-editor
  must update alongside the engine code — matches the
  VALUE-pin discipline precedent.)

Plan doc for step 8 is TBD — the next agent authors
`SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md` as the first
slice action, following the shape of the five prior slice
plan docs (now all archived under
`docs/archive/handoffs/SLICE_*`).

## Resume Checklist For The Next Agent

1. Read this checkpoint top-to-bottom.
2. Read `CURRENT_STATE.md` + `NEXT_IMPLEMENTATION_PLAN.md` +
   the MASTER_PLAN §3 grid + the six deferred-track notes
   above.
3. Run `pnpm calculator:gate:current` — confirm green baseline
   matches this checkpoint (5/5 tasks, ~85 s).
4. Author `SLICE_GOOD_CALCULATOR_FINAL_AUDIT_PLAN.md` before
   starting implementation. Pattern from the two step-7 /
   step-7b slice plan docs.
5. Execute the slice with the same discipline: test-first,
   gate on every commit, frozen upstream closeouts, atomic
   commits. Keep the "engine-entry coalesce" cautionary tale
   in mind if you're tempted to do broad normalisation work.

## Key Non-Obvious Notes

1. **Re-selecting after a post-contract is legitimate**. The
   step-7 post-contract selected step 8, then we re-selected
   7b ahead of it. The key discipline: document the
   re-analysis, keep the prior post-contract visible as
   history, never loosen AP4 (blocked-source posture).
2. **Symmetry is physical, not test-arbitrary**. F4 from step
   7 showed that LSF + timber-stud walls are asymmetric
   (cavity fill vs. air gap are on different sides); reversing
   rows changes the physics, not just the test snapshot.
3. **Lab vs. field output availability is designed, not
   accidental**. Lab context produces only Rw/STC/C/Ctr; field
   + building produce all 9. Pinning lab-null outputs as
   `toBeNull()` is a drift guard against lab-side leaks.
4. **Engine-entry normalisation is dangerous**. The 18-test
   regression from the attempted engine-entry coalesce
   (step 7) is a cautionary tale — framed-wall benchmarks
   rely on the physical `2×12.5 mm` vs. `1×25 mm` distinction.
   Apply normalisation locally at the specific gate site, not
   globally.
5. **Focused gate ≠ broad check**. The 2026-04-21 lint + tsc
   drift that slipped past the focused gate shows the gate is
   a FAST path for iterative work, not a standalone quality
   bar. `pnpm check` stays the last-mile authoritative signal.

## Watch-Outs For The Next Agent

Subtle things that caused real pain in this session. Each is
a tripwire someone WILL hit again if they don't read these
first.

### W1 — DO NOT re-apply `coalesceAdjacentSameMaterialLayers` at engine entry

The step-7 F2 fix applies the coalesce helper only at
`layersApproximatelyMatch` (catalog match site), symmetrically
on both input and reference. An attempt to also apply it at
`calculateDynamicAirborneResult` entry — to silence F3's
cosmetic warning drift — caused **18 failures across 8
files** because the framed-wall benchmarks are physically
calibrated on the `2×12.5 mm` vs. `1×25 mm` distinction. The
engine correctly treats those as different topologies
(double-board shear damping vs. single-board). If split v2
ever wants to do normalisation work, it must be:

- gated behind a context flag that benchmarks can opt out of,
- or applied ONLY at specific sites where the benchmarks
  don't look (catalog match, masonry calibrator gates — both
  already done).

Do NOT "generalise the coalesce" without a concrete sub-
slice plan that re-greens the framed-wall benchmarks.

### W2 — `calculator: "dynamic"` ≠ `calculator: null` for formula-owned walls

The torture matrix uses `calculator: "dynamic"`. The
preset-benchmark tests use `calculator: null` (auto-select).
These produce **different Rw** on formula-owned cases:

| Preset | dynamic lane | auto-select lane | delta |
|---|---|---|---|
| `clt_wall` | 42 | 40 | 2 dB |
| `timber_stud_wall` | 50 | 31 | **19 dB** |
| `aac_single_leaf_wall` / `masonry_brick_wall` / `light_steel_stud_wall` | same | same | 0 (catalog anchor fires regardless) |

Both lanes are defended. If someone reads
`EXPECTED_DYNAMIC_LAB_RW_BY_CASE` in
`mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts`
(`timber-stud = 50`) and compares it to the preset-benchmark
pin (`timber_stud_wall = 31`) they may think the engine has
drifted 19 dB. **It hasn't** — they're measuring different
lanes. The comment on that constant documents this; do NOT
"fix" either pin to match the other without understanding why
they differ.

### W3 — `lab_double_stud` corridor uses stud-aware FIELD + BUILDING variants

In `dynamic-airborne-wall-selector-value-pins.test.ts`:

- `FIELD_CONTEXT` + `BUILDING_CONTEXT` → plain, no stud
  metadata. Used by the 5 non-stud corridors.
- `FRAMED_FIELD_CONTEXT` + `FRAMED_BUILDING_CONTEXT` → spread
  stud metadata (`studType`, `sharedTrack`, `connectionType`,
  `studSpacingMm`). Used ONLY by `lab_double_stud`.

Without the stud variants, `lab_double_stud` detects as
`double_leaf` in field/building (the engine honestly loses
the stud metadata). Do NOT "simplify" this by unifying
context variants — that would silently drift the family
detection on one corridor.

Conversely: do NOT add `FRAMED_*` variants to non-stud
corridors. That would leak stud semantics into masonry and
change those pinned values.

### W4 — timber stud Rw=31 is a drift guard, NOT a target

The `timber_stud_wall` preset pins `labRw=31` / `fieldRwPrime=24`.
Published field data for similar stacks (2+2 gyp / 50 mm
rockwool / 50 mm air / 2+2 gyp on wood studs) is typically
**45-50 dB**. Someone will look at Rw=31 and say "this is
obviously wrong, fix it."

**It is pinned intentionally as a known-low drift guard**
pending external wood-stud coupling lab data. Closing the
gap (step 6 `wall_formula_family_widening_v1`) is
source-blocked per AP4. Do NOT re-weight the wood-stud
formula without external evidence — that would be opening a
blocked source under speculation, which the accuracy
preservation contract explicitly forbids.

A 2026-04-22 spike confirmed the gap is genuinely
source-blocked:
`packages/engine/src/dynamic-airborne-framed-wall.ts`
`estimateStudWallTargetRw` has no lever that defends a
re-weight without new catalog rows.

### W5 — `wall-lsf-knauf` torture case's splitPlans MUST stay glasswool-only

In `mixed-floor-wall-generated-test-helpers.ts` the
`wall-lsf-knauf` case pins:

```ts
splitPlans: [
  { parts: [35, 35], rowIndex: 3 }   // glasswool fill split only
]
```

Do NOT extend this to split the acoustic_gypsum facings
(e.g. `{ parts: [6.25, 6.25], rowIndex: 5 }`). The framed-
wall monotonic-floor guard in `dynamic-airborne.ts` will
emit an extra diagnostic warning on board-layer splits (F3,
cosmetic only — numeric outputs stay identical) and the
snapshot-equality loop in
`mixed-floor-wall-generated-matrix.test.ts` will fail on the
warnings array mismatch. F3 remediation is a future slice
that makes the monotonic-floor guard's sibling-variant
generator layer-count invariant.

### W6 — Post-contract selection is advisory, not binding

The step-7 post-contract line
`selectedImplementationSlice: "good_calculator_final_audit_v1"`
was superseded within the same day by the 2026-04-22
re-analysis that opened step 7b instead. This is a FEATURE,
not a bug. Post-contracts lock what CLOSED (the executable
evidence of prior work), but the next-slice selection is
advisory — a fresh analysis with better information can
revise it.

However: re-selection requires an explicit doc trail. The
step-7b plan (`61e2730`) has a "Pressure-Test — Why 7b And
Not Straight To 8" section that records the five candidates
weighed and why 7b won. If you re-select again, write the
same kind of doc trail. Do NOT silently skip a selected
slice.

### W7 — The branch is 13 commits ahead of `origin/main` as of session close

No auto-push. Do NOT force-push or reset without checking with
the user first. If you want to push, ask.

### W8 — Focused gate must stay in sync with new test files

`tools/dev/run-calculator-current-gate.ts` is a hardcoded args
list. Every new test file that's load-bearing for the active
slice's contracts must be added. In this session:

- step 7 added 4 files to the gate
- step 7b added 2 files to the gate

Miss this step and the focused gate becomes a lying "fast
path" that reports green while actually missing the new
coverage. `pnpm check` catches this because it runs
package-wide, but the focused gate will silently drift.

### W9 — Invariants bank caught F1. Keep authoring invariants banks.

The step-7 physical-invariants matrix was the thing that
surfaced F1 (masonry flanking inversion). The step-7b cross-
cell invariants bank caught nothing new — but that's the
point: **absence of finding is evidence of correctness** only
if the invariants actually cover the physics. The 5
invariants pinned in
`dynamic-airborne-wall-selector-value-pins.test.ts` are
extensible; if a future finding surfaces on a cell that the
existing invariants didn't catch, add a 6th invariant to
close that gap. The invariants bank is not "complete" — it
grows with findings.

### W10 — Discovery runs (atomic order step 4) are scratch-only

When pinning VALUE matrices, the workflow is:

1. Write skeleton with `toBeDefined()` / `Number.isFinite`
   stubs (step 3).
2. Run discovery script (external, scratch, `tsx`-driven) to
   capture engine outputs — DO NOT commit.
3. Hardcode the captured values into the test file, cross-
   check against plausibility windows, pin with `toBe()` /
   `toBeNull()` (step 5).

Step 4 discovery scripts that write to `/tmp/discover-*.ts`
are ephemeral; never commit them. If they're useful for later
audits, promote them into a proper repo test file with
cleanup afterwards.
