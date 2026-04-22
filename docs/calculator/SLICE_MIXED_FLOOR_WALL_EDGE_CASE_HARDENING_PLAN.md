# Slice Plan — Mixed Floor/Wall Edge-Case Hardening

Slice id: `mixed_floor_wall_edge_case_hardening_v1`
Status: OPEN (authored 2026-04-22)
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

## Scope

Four dimensions.

### Dimension A — Engine wall case gap-close

Add four new wall cases to `ENGINE_MIXED_GENERATED_CASES`,
mirroring the shape of the existing three:

| New case id | Archetype | Why | Airborne context hook |
|---|---|---|---|
| `wall-masonry-brick` | Single-leaf brick + plaster | Exercises the 2026-04-21 lab-fallback anchor (R'w ≤ Rw invariant under field + building contexts) | `xella_ytong_d700_150_plaster10_official_2026` neighbour row; lab-fallback path |
| `wall-clt-local` | CLT wall + gypsum | Exercises the framed-wall split module boundary + formula-owned lane for CLT | No explicit `studType`; family detection via CLT predicate |
| `wall-lsf-knauf` | 2×12.5 gyp + 70 mm glasswool + LSF + 2×12.5 gyp | Anchors Knauf exact catalog row (`knauf_lsf_2x2_12_5_70_glasswool_lab_416702_2026`) → Rw=55 | `studType=light_steel_stud`, `studSpacingMm=600`, `connectionType=direct`, `airtightness=good` |
| `wall-timber-stud` | Same geometry, wood studs | Drift guard on the parked formula-family-widening gap (Rw=31 must remain stable across split variants + duplicate swaps) | `studType=timber_stud`, `studSpacingMm=600`, `connectionType=direct`, `airtightness=good` |

Each new case must include `splitPlans` that produce both
neutral variants (thickness repartitioning) and duplicate-swap
variants (final-row permutations) — same discipline the existing
three wall cases use.

### Dimension B — Closeout contract reconciliation

Run the 26 existing `post-mixed-floor-wall-*` closeout contracts
against the expanded `ENGINE_MIXED_GENERATED_CASES`. Identify
which contracts encode:

- Hardcoded case counts (e.g. "expected 33 cases")
- Hardcoded wall subset iteration
- Snapshot comparisons pinned to the 3-case wall surface

Update each affected contract to accept the new cases without
loosening its assertion (no `toBeGreaterThanOrEqual(33)` softening
— pin the new exact count with an inline comment linking to this
slice).

### Dimension C — Cross-mode torture extension

Author `mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts`
(engine side) that combines on the new wall cases:

1. **Hostile input overlay** — swap one layer of the stack with an
   invalid `thicknessMm` (NaN, Infinity, negative, zero) and
   assert the guardrail converts to a deterministic fail-closed
   output; the *other* layers' defended outputs stay identical to
   the baseline.
2. **Reorder overlay** — apply the symmetric reversal test from
   `wall-reorder-invariance-matrix` to each new case; assert the
   supportedOutputs / Rw / C / Ctr invariants hold.
3. **Save-load overlay** — serialize the case's `rows` +
   `airborneContext`, deserialize, recompute; assert byte-exact
   snapshot equality.
4. **Duplicate-swap overlay** — exercise the full reverse-mask
   grid (already in `buildDuplicateSwapGridVariants`) on the new
   cases.
5. **Edit-history replay overlay** — for the LSF + timber stud
   cases specifically, simulate `studType` toggling (e.g. LSF →
   timber stud → LSF) and assert the final engine output matches
   the direct LSF computation (idempotency under reversible edits).

All five overlays must compose without cross-contamination — the
test matrix iterates `overlay × newCase`.

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
