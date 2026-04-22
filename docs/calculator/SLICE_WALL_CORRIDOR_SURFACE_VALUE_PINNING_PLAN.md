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

Coverage: 6 corridor families × 3 contexts × all 9 wall
outputs = ~162 cells. Extend from the current partial pins to
a full matrix:

| Family | Representative layer stack | Lab context | Field context | Building context |
|---|---|---|---|---|
| `double_leaf` | from existing trace matrix case | Rw + STC + C + Ctr | R'w + Dn,w + Dn,A + DnT,w + DnT,A | same + building anchor |
| `lined_massive_wall` | from existing trace matrix case | same | same | same |
| `aac_boundary` | from existing trace matrix case | same | same | same |
| `g5_sibling` | from existing trace matrix case | same | same | same |
| `heavy_core_trim` | from existing trace matrix case | same | same | same |
| `lab_double_stud` | from existing trace matrix case | same | same | same |

For each cell, pin the exact value (`toBe(exactValue)`, not
`toBeGreaterThanOrEqual`).

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

1. **Author this plan doc** (done, this commit).
2. **Pre-slice baseline snapshot** — `pnpm calculator:gate:current`
   + `pnpm check` both green (verified 2026-04-22 ahead of plan
   authoring — 5/5 and exit 0).
3. **Dimension A skeleton** — author
   `dynamic-airborne-wall-selector-value-pins.test.ts` with
   `it.each` over corridor families × contexts × outputs; each
   assertion initially `toBeDefined()` + `Number.isFinite`.
   Land + run green first.
4. **Discover VALUE pins** — run skeleton in verbose mode,
   capture every output value, pin with `toBe(exactValue)`.
   Flag any physically suspect cell as a sub-finding.
5. **Sub-finding remediation** — each flagged cell either
   (a) explain + inline-comment + pin, or (b) open an engine
   fix sub-slice. Close sub-findings before slice close.
6. **Focused gate + engine full suite** after every cell pin
   batch.
7. **Dimension C (optional)** — if time budget allows, author
   the workbench card-surface test.
8. **Post-contract authoring** — record closure + select step 8.
9. **Triangle + grid + master-plan updates.**
10. **Focused gate config update** — add new test files.
11. **Broad `pnpm check`** end-to-end green.
12. **Slice plan archive move** — `git mv` this file to
    `docs/archive/handoffs/`.
13. **Atomic closing commit** with the slice summary.

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
