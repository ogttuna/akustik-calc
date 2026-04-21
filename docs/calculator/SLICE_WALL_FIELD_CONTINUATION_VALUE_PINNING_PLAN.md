# Slice Plan — Wall Field Continuation Value Pinning

Slice id: `wall_field_continuation_value_pinning_v1`
Status: CLOSED 2026-04-21 (closeout contract
`packages/engine/src/post-wall-field-continuation-value-pinning-v1-next-slice-selection-contract.test.ts`)
Authored: 2026-04-21
Updated: 2026-04-21 (closed)
Outcome: preset surface (dimension A) landed clean — 18 cells
VALUE-pinned, I1/I2/I3 green everywhere, no new accuracy findings.
Next: `mixed_floor_wall_edge_case_hardening_v1` (step 7).
Follow-up: dimension B corridor VALUE pins + timber stud accuracy
gap + split v2 composer injection.

## Why This Slice Exists

Primary objective alignment: **accuracy + coverage**. This is the
highest-ROI next slice because:

- Completion signal **C3 (field continuation completeness)** is
  currently blocked. Every defended wall corridor produces
  *some* field output (R'w, Dn,w, Dn,A, DnT,w, DnT,A, STC, C,
  Ctr) under `field_between_rooms` and `building_prediction`
  contexts, but we do not have VALUE pins for them. The value
  could silently drift across slices and we would only notice
  when a user complains about a field output changing.
- The 2026-04-21 **masonry flanking inversion fix** showed that
  physical invariants (R'w ≤ Rw) can surface real engine
  accuracy bugs. Extending VALUE pins to every corridor × context
  × output is the natural continuation — VALUE pins catch
  numerical drift that invariants do not (e.g. a value that moves
  from 43 → 42 dB without crossing the Rw ceiling).
- Step 5 findings gate the conditional **step 6
  `wall_formula_family_widening_v1`**. If the audit surfaces
  defendable gaps (e.g. the timber stud accuracy gap parked
  during slice 2), step 6 opens; if everything pins cleanly,
  step 6 stays conditional.

## Scope

Two dimensions of coverage expansion:

### Dimension A — Preset surface (complete 6/6 preset × 3/3 context × N outputs)

Current preset VALUE pins (from slice 2):

| Preset | Lab Rw | Field R'w | Building R'w | Building DnT,w |
|---|---|---|---|---|
| `concrete_wall` | screening | — | — | — |
| `aac_single_leaf_wall` | 47 | 45 | 45 | 46 |
| `masonry_brick_wall` | 43 | 41 | 41 | 43 |
| `clt_wall` | 40 | 38 | 38 | 39 |
| `light_steel_stud_wall` | 55 | 48 | 48 | 49 |
| `timber_stud_wall` | 31 | 24 | 24 | 25 |

Gaps to pin:
- Every preset × every context × **Dn,w / Dn,A / STC / C / Ctr**
  (currently only Rw / R'w / DnT,w are pinned).
- `concrete_wall` screening-lane field outputs (currently
  screening-only Rw pin; field-side outputs not pinned).
- Field VALUE behaviour under boundary inputs (studSpacingMm
  overrides, connectionType switches, sharedTrack explicit
  track).

### Dimension B — Corridor surface (beyond presets)

`dynamic-airborne-wall-selector-trace-matrix.test.ts` already
pins family + support + origin strings for a representative
corridor set. This slice adds VALUE pins on the same corridors:

- `double_leaf`
- `lined_massive_wall`
- `aac_boundary`
- `g5_sibling`
- `heavy_core_trim`
- `lab_double_stud`
- `deep_hybrid_swap_*` (heavy_core, aac_d700_100, aac_d700_120,
  aac_g5 — one representative per file)

Each corridor × (lab, field_between_rooms, building_prediction)
× every available output gets a VALUE pin.

## Deliverables

1. **`wall-field-continuation-completeness-matrix.test.ts`**
   (web workbench side) — full preset × context × output matrix
   covering dimension A. Shape: the existing invariants matrix
   shape extended with VALUE pins (toBe, not toBeLessThanOrEqual).
2. **`dynamic-airborne-wall-selector-value-pins.test.ts`** (engine
   side) — dimension B corridor × context × output matrix. Uses
   the selector trace matrix fixture set so corridor coverage
   remains parallel between the narrative-pin (existing) and
   VALUE-pin (new) layers.
3. **Accuracy findings ledger** — any preset × context × output
   where the engine produces a value that is unexpected (e.g.
   R'w > Rw after anchor, Dn,A that doesn't match Dn,w + C by
   more than 1 dB, DnT,w < Dn,w under reasonable geometry) is
   surfaced as a sub-finding and blocks slice close until
   addressed. Similar discipline to the masonry flanking
   inversion fix.
4. **Post-contract**
   `post-wall-field-continuation-value-pinning-v1-next-slice-selection-contract.test.ts`
   — pins what closed + selects the next slice. Two realistic
   selections depending on findings:
   - If the audit found defendable accuracy gaps →
     `wall_formula_family_widening_v1` (master-plan step 6)
   - If every cell pinned cleanly →
     `mixed_floor_wall_edge_case_hardening_v1` (step 7) or
     `good_calculator_final_audit_v1` (step 8)
5. **Focused gate update** — add the two new matrices + the
   post-contract.
6. **Triangle + cartography docs update** — record the slice
   closeout and next selection.

## Implementation Steps (Atomic Order)

1. **Author this plan doc** (done).
2. **`wall-field-continuation-completeness-matrix.test.ts`**
   skeleton: write the matrix shape + `it.each` over presets ×
   contexts × outputs; initial assertions are `toBeDefined()` +
   `Number.isFinite`. Land + run green first.
3. **Discover VALUE pins**: run the skeleton in verbose mode,
   capture every output value, pin with `toBe(exactValue)`. Any
   value that looks physically suspect is flagged as a
   sub-finding.
4. **Sub-finding remediation** (iterative): for each flagged
   cell, either explain + pin (comment in the test) or open an
   engine fix sub-slice. Close sub-findings before moving on.
5. **`dynamic-airborne-wall-selector-value-pins.test.ts`** —
   same test-first → discover → pin → remediate cycle for the
   engine-side corridor matrix.
6. **Run the focused gate + spot regression sweep** after every
   cell pin.
7. **Post-contract authoring** with the correct next-slice
   selection based on sub-finding outcomes.
8. **Triangle + cartography + master-plan grid updates.**
9. **Broad `pnpm check` + `git diff --check`** clean.
10. **Atomic closing commit** with the slice summary.

## Expected Outcomes

| Test | Expected Result | If Fails |
|---|---|---|
| completeness matrix I1 (R'w ≤ Rw per preset) | green | real engine bug — open remediation sub-slice |
| completeness matrix I2 (Dn,A ≈ Dn,w + C within 1 dB) | green | ISO 717 C-weighting drift — engine fix needed |
| completeness matrix I3 (DnT,w − Dn,w ∈ [2, 10] dB) | green | volume normalisation broken |
| new VALUE pins | `toBe(exactValue)` each cell | discovered — pin initial value; if it's suspicious, open finding |
| wall selector VALUE pins | `toBe(exactValue)` each cell | same; may surface corridor-specific gaps like the masonry flanking inversion |
| concrete_wall screening-lane field VALUEs | pinned or explicit "screening-only in field" note | if the screening carrier unexpectedly emits values, document the lane |
| LSF / timber stud `studSpacingMm` / `connectionType` sensitivity | stable under default → override | if changing explicit sensitivity flips the Rw, that's a family-detection inconsistency |

## Stop Conditions (Do NOT Ship If)

- Any preset × context × output cell produces a value that is
  physically unexpected and we cannot explain it.
- Wall selector VALUE pins flag a corridor that produces R'w >
  Rw (analogous to masonry flanking inversion) — treat as real
  engine accuracy bug.
- Timber stud value still pins to 24-31 dB (current engine
  output) without a formula-family-widening context note — if
  this slice closes without surfacing the timber stud gap
  explicitly, the accuracy discipline is weaker than it should be.

## Risk & Rollback

- **Risk**: sub-findings open faster than they close. Mitigation:
  each sub-finding gets its own commit + explicit test, and
  slice-close blocks until the ledger is empty.
- **Risk**: VALUE pins need frequent updates as future slices
  iterate calibration tables. Mitigation: every table change
  lands with an explicit "affects these preset / corridor
  pins" comment; reviewers see pin diffs alongside calibration
  diffs.
- **Rollback**: individual pin commits are revertable; the
  matrix test files are append-only.

## Non-Obvious Notes For The Next Agent

1. **Use the split modules directly**: the post-split engine
   layout gives us bounded imports — the completeness matrix can
   pull `summarizeAirborneTopology`, `detectDynamicFamily`, and
   specific estimators from their new locations. Don't re-import
   from `dynamic-airborne.ts` when a narrower import exists.
2. **The invariants matrix is the guardrail, not the pin**: I1 /
   I2 / I3 are ≤/≥ relations. VALUE pins are exact values. Both
   need to co-exist; if a pin drifts and the invariant still
   holds, that's a finding but not a physics violation.
3. **`concrete_wall` is screening-only**. Its Rw is a mass-law
   seed; the field-side outputs are meaningful only after the
   invariant matrix enforces the standard `R'w ≤ Rw` relation.
4. **Floor analog** — the wall completeness matrix is the model;
   a follow-up slice can mirror it on floor corridors. Out of
   scope for this slice.
5. **Composer injection lurks**: the deferred
   `dynamic_airborne_split_refactor_v2` is the composer-
   parameterization slice. This slice's VALUE pins should stay
   behavior-neutral when that refactor lands.

## Out Of Scope For This Slice

- Refactoring the composer injection (separate slice).
- Fixing the timber stud accuracy gap (step 6, conditional).
- Adding new wall preset archetypes (C1 is already 6/6).
- Floor corridor VALUE pinning (follow-up slice).

## Next Slice (After This Closes)

Selection depends on findings:

- **If accuracy gaps found** →
  `wall_formula_family_widening_v1` (step 6). Address the timber
  stud accuracy gap + any other defendable corridor widening
  revealed by the audit.
- **If every cell pins cleanly** →
  `mixed_floor_wall_edge_case_hardening_v1` (step 7). Cross-mode
  torture matrix extension.

## Resume Checklist For The Next Agent

1. Read this file top-to-bottom.
2. Check `git log --oneline main..HEAD` — which deliverables
   landed?
3. Run `pnpm calculator:gate:current` — see which tests are
   green / red / missing.
4. Continue from the first un-landed deliverable.
5. When the completeness matrix + corridor VALUE pins + any
   sub-findings all land green, write the post-contract + commit.
