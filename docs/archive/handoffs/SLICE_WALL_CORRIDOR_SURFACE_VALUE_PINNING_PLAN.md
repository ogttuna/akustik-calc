# Slice Plan — Wall Corridor Surface Value Pinning

Slice id: `wall_corridor_surface_value_pinning_v1`
Status: OPEN (authored 2026-04-22)
Master-plan step: 7b (inserted between step 7 closed
`mixed_floor_wall_edge_case_hardening_v1` and step 8 final audit)
Selected by: 2026-04-22 post-step-7 re-analysis (see Pressure-
Test section) — the step-7 post-contract selected step 8 as
next, but a re-pressure-test showed the corridor surface
VALUE-pin gap (C2 + C3 🟡 preset-only) should close **before**
the final audit so step 8 audits a fully-green C2/C3, not a
documented-deferred partial.
Next after close: `good_calculator_final_audit_v1` (master-plan
step 8).

## Pressure-Test — Why 7b And Not Straight To 8

Post-step-7 ROI re-analysis weighed five candidates on
2026-04-22 against the core mission (coverage + accuracy
advance together):

| Option | Coverage ROI | Accuracy ROI | Mission fit |
|---|---|---|---|
| **7b — this slice: `wall_corridor_surface_value_pinning_v1`** | 0 (families already detected) | **~160 new numerical pins** across 6 corridor families × 3 contexts × 9 outputs → C2 + C3 🟡 → 🟢 | Pure accuracy discipline, zero risk. Converts narrative guards to numerical contracts. |
| Step 8 `good_calculator_final_audit_v1` | 0 | 0 (executable grid-consistency test only) | Administrative close. Runs more meaningfully on a fully-green grid. |
| Floor field continuation audit | 0 | Medium — audit on already-defended floor surface | Integrity-checking, not expansion. Deferred per MASTER_PLAN §5. |
| `dynamic_airborne_split_refactor_v2` | 0 | 0 (architectural hygiene) | Non-primary. No user-facing delta. Blocks no work. |
| F3 board-facing warning drift fix | 0 | 0 (cosmetic) | Negligible. Deferred. |

**Decision: 7b wins.** Reasons ordered:

1. The only available move that advances ACCURACY on the
   wall surface today. Every other non-zero-accuracy option is
   either source-blocked (step 6 timber stud widening) or
   administrative.
2. C2 + C3 are the only remaining 🟡 signals that are
   actionable without external evidence. Closing them turns
   step 8 into a true audit of a fully-green grid rather than
   a checkpoint on a documented-deferred state.
3. Low risk — pure test-coverage expansion, no engine changes
   needed (the engine already computes these values; we just
   pin them).
4. The re-selection overrides (not erases) the step-7
   post-contract's "selected step 8" line because the
   post-contract locks what CLOSED, not what MUST come next —
   a fresh analysis with better information can revise the
   selection (AP4-compatible since nothing is loosened).

## Implementation Recon (2026-04-22)

Concrete code references so the next agent does not re-research.
Every file path is relative to repo root; every line range is
from the 2026-04-22 state (commit `61e2730`).

### R1 — Current corridor test surface

File: `packages/engine/src/dynamic-airborne-wall-selector-trace-matrix.test.ts`

The `CASES` array at lines 80-233 contains **6 `WallSelectorTraceCase`
entries** that test **3 distinct `dynamicFamily` ids** (the corridor
"labels" in the plan below are TEST CATEGORIES, not all distinct
family ids):

| Case id (lines) | `detectedFamily` | Context | Pinned outputs (current) |
|---|---|---|---|
| `clear-double-leaf-field` (82) | `double_leaf` | `FIELD_CONTEXT` | `rwDb=46`, `rwPrimeDb=46`, `dnTwDb=47` |
| `held-aac-boundary-field` (102) | `lined_massive_wall` | `FIELD_CONTEXT` | `rwDb=44`, `rwPrimeDb=44`, `dnTwDb=45` |
| `clear-lined-massive-field` (133) | `lined_massive_wall` | `FIELD_CONTEXT` | `rwDb=47`, `rwPrimeDb=47`, `dnTwDb=47` |
| `held-g5-sibling-building` (153) | `lined_massive_wall` *(boundary ambiguity — labelled g5_sibling)* | `BUILDING_CONTEXT` | `rwDb=45`, `rwPrimeDb=45`, `dnTwDb=47` |
| `non-aac-heavy-core-trim-control` (183) | `lined_massive_wall` | `BUILDING_CONTEXT` | `rwDb=47`, `rwPrimeDb=47`, `dnTwDb=49` |
| `strong-double-stud-lab-control` (211) | `double_stud_system` | `LAB_DOUBLE_STUD_CONTEXT` | `rwDb=61` |

**Current coverage**: ~18 pinned cells total (6 cases × 3 outputs
max). The 6 corridor LABELS in the plan's scope are represented
but only under **ONE context each**, not the full 3 (lab × field
× building). `aac_boundary`, `g5_sibling`, `heavy_core_trim`,
`lab_double_stud` are not separate family ids — they are
narrative labels mapped to `lined_massive_wall` or
`double_stud_system` family detection via specific layer shapes.

Context constants (same file):
- `FIELD_CONTEXT` (14-22): panelHeight 2700, RT 0.5, V=30 m³
- `BUILDING_CONTEXT` (24-30): panelHeight 2800, RT 0.6, V=45 m³
- `LAB_DOUBLE_STUD_CONTEXT` (32-39): `element_lab` + studType +
  sharedTrack=independent

### R2 — Engine output plumbing per context

File: `packages/engine/src/calculate-assembly.ts:1112-1123`

`AssemblyCalculation.metrics` field mapping for the 9 wall
outputs:

| Output | Metric field | Available in lab | Available in field | Available in building |
|---|---|---|---|---|
| Rw | `estimatedRwDb` | ✅ | ✅ | ✅ |
| R'w | `estimatedRwPrimeDb` | ❌ (null) | ✅ | ✅ |
| Dn,w | `estimatedDnWDb` | ❌ (null) | ✅ | ✅ |
| Dn,A | `estimatedDnADb` | ❌ (null) | ✅ | ✅ |
| DnT,w | `estimatedDnTwDb` | ❌ (null) | ✅ | ✅ |
| DnT,A | `estimatedDnTADb` | ❌ (null) | ✅ | ✅ |
| STC | `estimatedStc` | ✅ | ✅ | ✅ |
| C | `estimatedCDb` | ✅ | ✅ | ✅ |
| Ctr | `estimatedCtrDb` | ✅ | ✅ | ✅ |

Lab context only produces **4 outputs** (Rw/STC/C/Ctr); field +
building produce all **9**. Realistic pin target:

**6 corridors × (4 lab + 9 field + 9 building) = 132 numerical
pins** (not 162 — the plan's earlier estimate was a worst-case
count that did not account for lab being field-output-null).

### R3 — Workbench parallel surface

File: `apps/web/features/workbench/wall-selector-output-origin-card-matrix.test.ts:73-248`

Mirrors the engine trace matrix: pins card-level `value`
strings + `status` + `tone` but **does not** pin the underlying
numeric metrics. Dimension C of this slice is where the
workbench-side VALUE pins land (optional stretch per plan
scope).

### R4 — Deep-hybrid swap files (out of scope confirmed)

Four files under `packages/engine/src/dynamic-airborne-deep-hybrid-swap-*.test.ts`
(heavy_core, aac_d700_100, aac_d700_120, aac_g5). All pin the
**no-silent-≥8-dB-adjacent-swap-jump invariant** only — not
per-cell VALUEs. Cohorts cover porotherm, silka, concrete,
ytong; do NOT overlap with the 6 corridor labels in this
slice's scope. Safe to exclude per Dimension B deferral.

### R5 — Sub-finding risk per corridor

Predicted probability of surfacing an engine bug during VALUE
discovery (based on step-7 F1 + F2 patterns):

| Corridor | Risk | Why |
|---|---|---|
| `lined_massive_wall` (AAC / porotherm cases) | **high** | F1 + F2 both apply: AAC D700 masonry-calibrator gates on `solidLayers.length === 3` (coalesce-sensitive); exact catalog anchor on board type matters. Three of the 6 current cases pin this family — drift probability compounds. |
| `g5_sibling` | **high** | Case `held-g5-sibling-building` already exhibits family-boundary ambiguity (detected as `lined_massive_wall` not a distinct `g5_sibling` family). New pins on this corridor may surface formula drift. |
| `aac_boundary` | **medium** | Boundary-hold logic (line 114-120 of trace matrix) implies ambiguous catalog matching near the decision surface. Not currently pinned under lab OR building — new pins will reveal order sensitivity. |
| `double_leaf` | **medium** | F2 catalog-match order sensitivity risk — gypsum vs. diamond board swap could flip catalog rank. |
| `heavy_core_trim` | **low** | Trim logic (line 201-203) is defensive; outer rockwool/glasswool layers are not exact-catalog-gated. Formula-owned lane is stable. |
| `lab_double_stud` | **low** | Framed-wall blend `double_stud_surrogate_blend+double_stud_calibration` is not order-sensitive. Lab-only context avoids field geometry gates. |

### R6 — Physical plausibility windows (ISO 717-1:2020)

External acoustics knowledge — use as sanity ceilings when
discovering pins. A cell outside these windows is a candidate
sub-finding.

| Output | Plausibility window (lightweight + masonry walls) | Invariant |
|---|---|---|
| Rw (lab) | 35–65 dB | — |
| R'w (field) | Rw − 2 to −6 dB | **I1: R'w ≤ Rw** |
| Dn,w | Rw − 3 to −8 dB | — |
| Dn,A | Dn,w − 5 to −10 dB | **I2: \|Dn,A − (Dn,w + C)\| ≤ 1 dB** |
| DnT,w | Dn,w + 0 to +5 dB (V=30-45m³ RT=0.5-0.6 s) | **I3: DnT,w ≥ Dn,w for V>30m³** |
| DnT,A | DnT,w − 5 to −10 dB | — |
| STC | Rw ± 3 dB (ASTM tracks ISO loosely) | — |
| C | −1 to −5 dB | — |
| Ctr | −3 to −8 dB (Ctr < C typically) | — |

Outlier flags (block slice close until explained):
- R'w > Rw
- Rw, R'w, DnT,w outside [30, 70] dB
- C > 0 dB OR C < −10 dB
- Ctr > C (traffic noise usually penalizes more than pink)
- STC drift > 3 dB vs. Rw

### R7 — Focused gate entry point

File: `tools/dev/run-calculator-current-gate.ts:105` (the line
that added the step-7 post-contract). Append this slice's new
files to the same engine args block.

## Why This Slice Exists

Primary objective alignment: **accuracy discipline on the
corridor surface**. C2 (source-backed audit) and C3 (field
continuation completeness) are preset-surface-complete but
corridor-surface-deferred from slice 5 closeout
(`wall_field_continuation_value_pinning_v1`). The corridor
families live in
`packages/engine/src/dynamic-airborne-wall-selector-trace-matrix.test.ts`
(and the workbench-side equivalent
`apps/web/features/workbench/wall-selector-output-origin-card-matrix.test.ts`)
and carry **narrative pins** (family id + support classifier +
origin string) plus **partial VALUE pins** on `rwDb` /
`rwPrimeDb` / `dnTwDb` only. The gap: 6 more field outputs
(Dn,w, Dn,A, DnT,A, STC, C, Ctr) and 2 context modes are not
systematically pinned.

A silent calibration drift in any of the unPinned output
dimensions would not be caught by the narrative pins or the
existing partial VALUE pins. This slice closes that gap.

## Scope

Three dimensions.

### Dimension A — Engine corridor VALUE matrix (primary)

File: `packages/engine/src/dynamic-airborne-wall-selector-value-pins.test.ts` (new)

Coverage: **6 corridor labels × 3 contexts × up to 9 outputs =
132 realistic pins** (lab produces only 4 of 9; field + building
each produce 9). The source layer stacks are lifted directly
from the existing trace matrix `CASES` array (§R1) so behaviour
is identical to what's already tested — this slice adds
missing output + context combinations rather than inventing
new stacks.

| Corridor label | Layer fixture source | Detected family (per §R1) | Lab (4 outputs) | Field (9 outputs) | Building (9 outputs) |
|---|---|---|---|---|---|
| `double_leaf` | `CASES[0]` clear-double-leaf | `double_leaf` | Rw, STC, C, Ctr | all 9 | all 9 |
| `lined_massive_wall` | `CASES[2]` clear-lined-massive | `lined_massive_wall` | same | all 9 | all 9 |
| `aac_boundary` | `CASES[1]` held-aac-boundary | `lined_massive_wall` | same | all 9 | all 9 |
| `g5_sibling` | `CASES[3]` held-g5-sibling | `lined_massive_wall` (boundary) | same | all 9 | all 9 |
| `heavy_core_trim` | `CASES[4]` non-aac-heavy-core-trim | `lined_massive_wall` | same | all 9 | all 9 |
| `lab_double_stud` | `CASES[5]` strong-double-stud-lab | `double_stud_system` | same | all 9 | all 9 |

For each cell, pin the exact value (`toBe(exactValue)`, not
`toBeGreaterThanOrEqual`). Lab cells that are null-by-design
(R'w, Dn,w, etc.) pin as `toBeNull()` — this is ALSO a drift
guard because a surprising non-null value would flag a lab-
side leak.

Contexts used:
- Lab: `LAB_DOUBLE_STUD_CONTEXT` (or a pared-down `ELEMENT_LAB_CONTEXT`
  for non-stud corridors — define locally if `LAB_DOUBLE_STUD_CONTEXT`'s
  studType/studSpacingMm leak into non-stud corridor results).
- Field: `FIELD_CONTEXT` (V=30 m³ RT=0.5 s) — already used in
  the trace matrix.
- Building: `BUILDING_CONTEXT` (V=45 m³ RT=0.6 s) — already
  used in the trace matrix.

### Dimension B — Deep-hybrid swap corridor VALUE pins

Four `dynamic-airborne-deep-hybrid-swap-*.test.ts` files
already exist (`heavy_core`, `aac_d700_100`, `aac_d700_120`,
`aac_g5`). Currently they pin the no-silent-jump invariant
("finds no silent ≥8 dB adjacent-swap jumps") but not per-cell
VALUEs.

**Scope decision**: skip deep-hybrid in this slice. The
no-silent-jump guard is already a defended invariant, and
VALUE pins on the swap-grid cells are high-noise. Document as
follow-up (F5 candidate) if future ROI justifies.

### Dimension C — Workbench card surface cross-check

File: `apps/web/features/workbench/wall-selector-output-origin-card-value-pins.test.ts` (new)

For each corridor family, pin the output card's `value`
formatted string + `status` + `tone`. This is the user-visible
surface — ensures the engine-level VALUE pins don't silently
diverge from the displayed values. ~6 families × 3 contexts ×
4 card fields = ~72 cells.

**Scope decision**: include if time allows, but Dimension A is
the primary deliverable. If A takes longer than expected, C
moves to a follow-up slice.

## Deliverables

1. **`dynamic-airborne-wall-selector-value-pins.test.ts`**
   (engine, Dimension A) — full VALUE matrix on 6 corridor
   families × 3 contexts × 9 outputs.
2. **Updated `dynamic-airborne-wall-selector-trace-matrix.test.ts`**
   — remove partial VALUE pins that Dimension A now supersedes
   (or leave them as "narrative pin + quick-check pin"
   depending on which reads cleaner).
3. **`wall-selector-output-origin-card-value-pins.test.ts`**
   (workbench, Dimension C — optional) — card-surface cross-
   check.
4. **Accuracy findings ledger** — any corridor × context ×
   output cell where the engine produces a suspicious value
   (R'w > Rw, Dn,A drift > 1 dB from Dn,w+C, DnT,w < Dn,w, etc.)
   surfaces as a sub-finding and blocks slice close — same
   discipline step 7 used for F1/F2.
5. **Post-contract**
   `post-wall-corridor-surface-value-pinning-v1-next-slice-selection-contract.test.ts`
   — pins what closed + selects step 8
   `good_calculator_final_audit_v1` (now genuinely audit-able
   on a fully-green grid).
6. **Triangle + grid updates** —
   - CURRENT_STATE: C2 + C3 flip to ✅
   - MASTER_PLAN §3 grid: corridor row status flips
   - NEXT_IMPLEMENTATION_PLAN: active slice → step 8
7. **Focused gate update** — add the new matrix + post-contract
   to the gate's engine args block.

## Implementation Steps (Atomic Order)

Each numbered step is its own commit unless noted. Steps 3-5
(skeleton → discovery → pin) should land as three separate
commits so bisect is easy if a late sub-finding surfaces.

1. **Author this plan doc** (done, commit `61e2730` + recon
   iteration 2026-04-22 further refined scope).
2. **Pre-slice baseline snapshot** — `pnpm calculator:gate:current`
   + `pnpm check` both green. Verified 2026-04-22 (engine
   197/197 files + 1108/1108 tests; broad check exit 0; focused
   gate 5/5). Rollback target per AP1.
3. **Dimension A skeleton** — author
   `packages/engine/src/dynamic-airborne-wall-selector-value-pins.test.ts`.
   Structure: `describe.each(CORRIDOR_LABELS)` × `describe.each(CONTEXTS)`
   × `it('pins 9 outputs', ...)`. Each assertion initially
   `toBeDefined()` (non-null field outputs in field/building
   context; null-tolerant in lab). Lift layer fixtures from
   `CASES[0..5]` in the existing trace matrix (§R1) so behaviour
   stays identical to what's already tested. Run focused gate —
   must stay green.
4. **Discovery run** — replace `toBeDefined()` with
   `console.log` + `expect(snapshotCaptured).toBe(true)`. Run
   in verbose mode. Capture every output value. Build the
   `EXPECTED[corridor][context]` table locally. Do not commit
   with console.logs — this is a scratch step.
5. **Value-pin commit** — replace assertions with
   `toBe(exactValue)` for every non-null cell and
   `toBeNull()` for null-by-design lab cells. Before pinning,
   cross-check each value against the §R6 plausibility window:
   any outlier becomes a sub-finding before the pin lands.
6. **Sub-finding remediation (if any)** — for each flagged
   cell, either (a) explain + inline-comment + pin the
   observed value (if it has a defended physical explanation),
   or (b) open an engine fix sub-slice (pattern: F1/F2 from
   step 7). Close the sub-finding ledger before proceeding.
   Full engine suite green after each fix.
7. **Dimension C (optional stretch)** — if time budget allows,
   author
   `apps/web/features/workbench/wall-selector-output-origin-card-value-pins.test.ts`
   pinning card-level `value`/`status`/`tone` for each corridor
   × context cell. Cross-checks engine-to-workbench
   consistency. Skip if (a) sub-finding remediation consumed
   the budget OR (b) Dimension A already landed the accuracy
   discipline without needing a card-surface audit.
8. **Post-contract authoring** —
   `packages/engine/src/post-wall-corridor-surface-value-pinning-v1-next-slice-selection-contract.test.ts`.
   Follow the step-7 post-contract shape. Selects
   `good_calculator_final_audit_v1` (step 8).
9. **Focused gate config update** —
   `tools/dev/run-calculator-current-gate.ts` engine args block
   (after line 105 per §R7) gets 2 new entries: the new matrix
   + the new post-contract. If Dimension C lands, add the
   workbench file to the web args block too.
10. **Triangle + grid updates** — CURRENT_STATE (active slice
    → step 8; findings ledger; test counts); MASTER_PLAN §3
    grid (flip wall selector families row 🟡 Family narrative
    → 🟡 Family VALUE-pinned, deep-hybrid row noted as
    deferred; C2/C3 rows flip to ✅); MASTER_PLAN §4 sequence
    (step 7b marked ✅ landed; step 8 marked ⭐ next);
    NEXT_IMPLEMENTATION_PLAN (active slice → step 8 with plan
    doc TBD); docs/README supporting-reads swap.
11. **Broad `pnpm check`** end-to-end green.
12. **Slice plan archive move** — `git mv` this file from
    `docs/calculator/` to `docs/archive/handoffs/`.
13. **Atomic closing commit** with the slice summary. Expected
    delta: +1 engine test file (~160 assertions over 18 cells
    + sub-assertions), +1 post-contract (4 assertions), +0 to
    +1 workbench test file, ~5 doc file edits.

## Expected Outcomes

| Test | Expected | If Fails |
|---|---|---|
| Dimension A matrix (162 cells) | green on every cell with exact VALUE pins | sub-finding per failure; investigate engine OR pin surprising value with inline comment |
| I1 invariant across corridor surface (R'w ≤ Rw) | green on every cell where both pinned | real engine bug; sub-slice (pattern: masonry flanking inversion fix) |
| I2 invariant (Dn,A ≈ Dn,w + C) | green on every cell where all three pinned | ISO 717 C-weighting drift; engine fix |
| Dimension C workbench cards | green on every cell | workbench-engine divergence; wire-up fix |
| Post-contract | 4 tests green | standard |
| Focused gate after update | 5/5 tasks green | sanity |
| `pnpm check` final | green end-to-end | sanity |

## Stop Conditions (Do NOT Ship If)

- Any corridor × context × output cell produces a physically
  unexpected value that cannot be explained.
- Any I1/I2/I3 invariant violation on a corridor cell.
- Any existing corridor VALUE pin (in the current trace matrix)
  regresses or requires softening to a range assertion.
- Post-contract selects anything other than
  `good_calculator_final_audit_v1` without a documented
  reason.

## Risk & Rollback

- **Risk**: a sub-finding opens engine remediation work that
  balloons scope. Mitigation: sub-findings have their own
  commits; the slice close blocks until ledger is empty but
  engine-remediation commits are revertable independently.
- **Risk**: VALUE pins become a maintenance tax — every future
  calibration change requires updating dozens of cells.
  Mitigation: this is the accuracy-preservation contract (AP3
  — no defended value changes silently) working as intended.
  Explicit pin updates are a feature, not a cost.
- **Rollback**: if a catastrophic issue surfaces, revert the
  new test files; engine state unchanged (no engine edits
  expected in this slice unless a sub-finding requires one).

## Non-Obvious Notes For The Next Agent

1. **Contexts matter precisely**. The existing trace matrix
   uses custom `FIELD_CONTEXT` (panelHeight 2700, RT 0.5,
   V=30 m³) for some cases and `BUILDING_CONTEXT` (panelHeight
   2800, RT 0.6, V=45 m³) for others. The workbench default
   builds V=55 m³ RT=0.7s. The matrix must specify its context
   explicitly per case — don't assume workbench defaults.
2. **Deep-hybrid deferred**: the `deep_hybrid_swap_*` files
   are adjacent-jump guards, not VALUE matrices. Do not merge
   them into this slice's surface.
3. **The step-7 `coalesceAdjacentSameMaterialLayers`** now
   applies at the catalog-match layer — if a corridor VALUE
   drifts surprisingly vs. the pre-step-7 behaviour, check
   whether the input stack has adjacent same-material runs
   that now coalesce. The helper is symmetric so baseline
   behaviour is preserved, but any corner case should be
   verified.
4. **Test ordering**: put per-family describe blocks in the
   same order as the master-plan §3 grid so the grid row
   updates map 1:1 to test-file sections.

## Out Of Scope For This Slice

- Engine accuracy widening for timber stud (step 6 conditional,
  still source-blocked).
- `dynamic_airborne_split_refactor_v2` (composer injection,
  still deferred).
- F3 framed-wall monotonic-floor warning drift (cosmetic,
  deferred).
- Deep-hybrid swap VALUE matrices (out of scope — narrative
  guard sufficient).
- Floor field continuation audit (parallel track, not coupled).

## Next Slice (After This Closes)

**`good_calculator_final_audit_v1`** (master-plan step 8). Now
genuinely audit-able because C2 + C3 close on this slice.

## Resume Checklist For The Next Agent

1. Read this file top-to-bottom.
2. Check `git log --oneline main..HEAD` — which deliverables
   landed?
3. Run `pnpm calculator:gate:current` — confirm green baseline
   (5/5 tasks).
4. Continue from the first un-landed deliverable in Atomic
   Order.
5. When all three dimensions (A mandatory, C optional) land
   green and the post-contract is written, `git mv` this file
   to `docs/archive/handoffs/`.
