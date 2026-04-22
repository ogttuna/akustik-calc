# Checkpoint — 2026-04-21 Session Close

Document role: end-of-day handoff + session-wide progress snapshot.
Next agent resumes from the triangle (CURRENT_STATE +
NEXT_IMPLEMENTATION_PLAN + MASTER_PLAN) but reads this first for
the session narrative and the explicit "planned but not done"
ledger.

## Session Summary

**Commits landed: 27** (all on `main`, no branches in flight).

Five master-plan slices moved from "selected" to "closed" in this
session:

| Slice | Master-plan step | Closed |
|---|---|---|
| `masonry_flanking_inversion_fix_v1` | 1b | `a210c66` |
| `wall_lsf_timber_preset_pack_with_invariants_v1` | 2 | `0985039` |
| `wall_hostile_input_matrix_with_airborne_cartography_v1` | 3 | `f93d723` |
| `dynamic_airborne_split_refactor_v1` | 4 | `5688ead` |
| `wall_field_continuation_value_pinning_v1` | 5 | `28ec6e9` |

MASTER_PLAN completion signals as of session close:

| # | Signal | Before session | After session |
|---|---|---|---|
| C1 | Wall preset coverage ≥ 6 archetypes | 4/6 | **6/6 ✓** |
| C2 | Source-backed + benchmark audits | partial | **partial — preset surface done, corridor surface deferred** |
| C3 | Field continuation completeness | open | **preset surface done, corridor surface deferred** |
| C4 | Hostile input discipline floor + wall | floor-only | **both ✓** |
| C5 | Reorder invariance | ✓ (pre-session) | ✓ |
| C6 | Architectural hygiene (files ≤2000 lines) | ⚪ `dynamic-airborne.ts` 6630 lines | **🟡 3214 lines, split v2 deferred** |

## What Shipped Today

### Engine Accuracy Fix

`a210c66` — **masonry flanking inversion fix**. The physical
invariants matrix caught Wienerberger Porotherm assemblies producing
field R'w greater than lab Rw (ISO 140-4 violation).
`applyVerifiedAirborneCatalogAnchor` now falls back to lab-mode
catalog entries when no field-mode entry exists for the layer
stack, anchoring the apparent curve at
`lab_benchmark − flanking_penalty_db`. Material-agnostic — every
future lab-only benchmark where mass-law overestimates reality
is covered automatically.

### Coverage Expansion

`0985039` — **LSF + timber stud preset pack**. Added two framed
wall presets with `airborneDefaults` wiring so `loadPreset`
forwards `studType`, `studSpacingMm`, `connectionType`,
`airtightness` into the workbench store. Physical invariants
matrix (I1 R'w ≤ Rw, I2 Dn,A ≈ Dn,w + C, I3 DnT,w − Dn,w ∈
[2, 10] dB) now green across all 6 wall presets × 3 context
modes (24 cells). Field + building VALUE pins extend to AAC,
masonry, CLT, LSF, timber stud.

### Hostile Input Discipline

`f93d723` — **wall hostile-input matrix + engine guardrail +
cartography**. 13 engine cases + 6 workbench route-card cases pin
deterministic behaviour on 50-layer stacks, unknown `materialId`,
invalid thickness (NaN / Infinity / negative / extreme).
`assembly-input-guardrail.ts` converts hostile inputs into a
deterministic fail-closed `AssemblyCalculation` with a specific
warning instead of a raw Zod / Error throw. API / CLI callers
that bypass the workbench normaliser are now safe.

### Architectural Split

`c0a5068` → `5688ead` — **15-commit incremental split of
`dynamic-airborne.ts`**. Main file fell from 6630 → 3214 lines
(−52%) into seven bounded modules:

| Module | Lines | Purpose |
|---|---|---|
| `dynamic-airborne-helpers.ts` | 287 | Pure math, spectrum weights, physical constants, delegate blending, curve anchoring, shared types (`DynamicAirborneOptions`, `DynamicAirborneResult`, `DelegateCurve`, `DelegateBlend`) |
| `dynamic-airborne-family-detection.ts` | 257 | Material predicates + framing hint helpers + board predicates |
| `dynamic-airborne-davy-masonry.ts` | 270 | Davy/Cremer single-leaf masonry coincidence cap |
| `dynamic-airborne-mixed-plain-templates.ts` | 237 | Mixed-plain premium/moderate lab-target Rw tables + template id resolvers + fill interpolation |
| `dynamic-airborne-cavity-topology.ts` | 460 | Cavity + reinforcement + single-leaf masonry profile + trim helpers |
| `dynamic-airborne-masonry-calibration.ts` | 1057 | All 9 masonry estimators |
| `dynamic-airborne-framed-wall.ts` | 1251 | Framed wall summary types + 8 summarizers + `estimateStudWallTargetRw` |

Zero behaviour change verified by the focused gate + regression
sweep on every commit.

### Value-Pin Audit

`7fc383e` → `28ec6e9` — **wall field continuation value pinning**.
Every defended wall preset × every airborne context mode × every
field output pinned to an exact VALUE (18 cells × 10 outputs =
180 numeric assertions). Invariants I1/I2/I3 confirmed green on
every cell. The audit surfaced no new accuracy gaps — timber
stud remains the only known gap, already parked.

## Planned But Not Done (Explicit Deferral Ledger)

Three follow-up tracks explicitly deferred and documented:

### Track 1 — `dynamic_airborne_split_refactor_v2`

- **What is left**: the 14 `apply*` floor / cap guards and the
  composition scaffolding (`calculateDynamicAirborneResult`,
  `detectDynamicFamily`, `chooseBlend`) — ~3200 lines still in
  `dynamic-airborne.ts`.
- **Blocker**: the guards recursively call
  `calculateDynamicAirborneResult` on variant layer stacks to
  build their monotonic floors. A mechanical carve creates a
  circular import between guards and composer.
- **Fix path**: refactor the guards to accept the composer as a
  function parameter (dependency injection). Behaviour-preserving
  when done carefully, but NOT a mechanical move.
- **Blueprint doc**:
  `docs/calculator/DYNAMIC_AIRBORNE_CARTOGRAPHY.md`.
- **Priority**: low-medium. Unlocks the final C6 signal tick but
  delivers no user-facing accuracy. Can ride alongside a future
  slice that already touches the composer.

### Track 2 — `wall_formula_family_widening_v1` (master-plan step 6, conditional)

- **What triggers it**: the `timber_stud_wall` preset currently
  produces `Rw = 31 dB` under the composed lab context; published
  field data for similar 2+2 gypsum / 50 mm rockwool / 50 mm air
  gap / 2+2 gypsum stacks on a wood-stud frame is typically
  45-50 dB. Approximately 14-19 dB low.
- **Fix path options**:
  - Add a dedicated wood-stud formula lane (Sharp / Davy /
    INSUL-style) calibrated against manufacturer test reports.
  - Source an exact Dataholz / Knauf / Rockwool wood-stud wall
    row for the verified airborne catalog and anchor against it.
  - Re-weight the existing framed-wall predictor so wood studs
    are scored against the same curve shape as light-steel studs
    (research needed first — wood studs are typically MORE
    acoustically coupled than steel, not less).
- **Priority**: medium. Not blocking because the current value is
  pinned as a drift guard with an explicit "formula-owned, known
  low, source-widening candidate" note, so no silent
  user-facing accuracy regression can happen.

### Track 3 — Dimension B corridor VALUE pins

- **What is left**: extend VALUE pins from the preset surface
  (currently landed) to the
  `dynamic-airborne-wall-selector-trace-matrix` corridors
  (`double_leaf`, `lined_massive_wall`, `aac_boundary`,
  `g5_sibling`, `heavy_core_trim`, `lab_double_stud`,
  `deep_hybrid_swap_*`).
- **Why deferred**: each corridor needs an explicit layer
  configuration (the preset surface already provided these via
  `preset-definitions.ts`; the selector corridors do not). Proper
  coverage needs one cartography pass before the VALUE pin pass.
- **Priority**: low-medium. Narrative pins already guard the
  corridor surface. VALUE pins would catch tighter calibration
  drift.

## System Posture At Session Close

- **Branch**: `main`, clean working tree (post checkpoint commit).
- **Frozen upstream closeouts**: every pre-session closeout
  (reinforced-concrete follow-up, raw terminal-concrete helper,
  CLT-local combined evidence, broad audit, blocked-source
  refresh) untouched.
- **Blocked-source queue**: `GDMTXA04A` direct exact, `C11c` exact
  import, raw bare open-box/open-web impact, wall-selector
  widening — all still fail-closed awaiting external evidence.
- **Masonry flanking inversion fix**: sealed by the completeness
  matrix (I1 green on every cell including Porotherm masonry in
  field + building contexts).
- **Engine thickness guardrail**: live for API / CLI callers.
- **Physical invariants matrix**: 24 cells across 6 presets × 3
  contexts, I1/I2/I3 all green.
- **Completeness matrix**: 18 cells × 10 outputs VALUE-pinned.
- **dynamic-airborne.ts**: 3214 lines, split v2 deferred with a
  documented design note in cartography doc.

## Final Validation Results

Engine + web full suites + focused calculator gate — all three
re-ran after the full session landed. Broad validation counts:

- **Engine full suite**: 193 test files, 1068 / 1068 tests green
  (830.67 s)
- **Web full suite**: 137 test files, 792 / 792 tests green + 18
  discovery helpers intentionally skipped (689.92 s)
- **Focused gate** (`pnpm calculator:gate:current`): 5 / 5 tasks
  green (engine gate + web gate + repo build + whitespace guard,
  108 s)

No test failures. No deferred fixes. No flakes detected.

## Next Active Slice

`mixed_floor_wall_edge_case_hardening_v1` (master-plan step 7).

Why it is next:
- Step 5 audit closed clean — step 6 stays conditional.
- Step 7 consolidates progress from slices 1-5 under cross-mode
  torture (hostile input + reorder + save-load + duplicate-swap +
  edit-history replay combined).
- Step 7 is the direct path to step 8 (final audit) without
  reopening new accuracy work.

First implementation question for the next agent:
- Do the existing `mixed-floor-wall-*` tests (see
  `packages/engine/src/mixed-floor-wall-generated-matrix.test.ts`
  and the ~20 `post-mixed-floor-wall-*` closeout contracts) still
  cover the new wall corridors (LSF, timber stud) + the post-split
  engine layout + the lab-fallback anchor? If not, the torture
  extension is the scope.

Plan doc for step 7 is TBD — the next agent authors it as the
first slice action, following the shape of
`SLICE_WALL_HOSTILE_INPUT_WITH_CARTOGRAPHY_PLAN.md` /
`SLICE_WALL_FIELD_CONTINUATION_VALUE_PINNING_PLAN.md`.

## Resume Checklist For The Next Agent

1. Read this checkpoint top-to-bottom.
2. Read `CURRENT_STATE.md` + `NEXT_IMPLEMENTATION_PLAN.md` + the
   MASTER_PLAN §3 grid + the three deferred-track notes above.
3. Run `pnpm calculator:gate:current` — confirm green baseline
   matches this checkpoint.
4. Author `SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md`
   before starting implementation. Pattern from the two earlier
   slice plan docs.
5. Execute the slice with the same discipline: test-first, gate
   on every commit, frozen upstream closeouts, atomic commits.
