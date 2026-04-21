# Dynamic Calculator Current State

Document role: short-lived snapshot of what is stable **right
now** on the calculator surface. If you need "how did we get
here" read the latest checkpoint under `docs/archive/handoffs/`.
If you need the strategic plan read [MASTER_PLAN.md](./MASTER_PLAN.md).
If you need the tactical detail on the active slice read
[NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).

---

## Revalidated Snapshot

Last revalidation cycle: `2026-04-21` (session-close checkpoint
[CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md](./CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md)).

- **Engine full suite**: 193 / 193 files, 1068 / 1068 tests green
- **Web full suite**: 137 / 137 files, 792 / 792 tests green + 18
  discovery helpers intentionally skipped
- **Focused calculator gate** (`pnpm calculator:gate:current`):
  5 / 5 tasks green

## Active Slice

`mixed_floor_wall_edge_case_hardening_v1` (master-plan step 7).
Selected `2026-04-21` by the
`wall_field_continuation_value_pinning_v1` closeout. Plan doc
not yet authored — the next agent writes
`SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md` before
starting implementation, mirroring the shape of the preceding
slice plans (archived under `docs/archive/handoffs/SLICE_*`).

## Latest Closed Slices

| Slice | Master-plan step | Closed | Post-contract |
|---|---|---|---|
| `wall_field_continuation_value_pinning_v1` | 5 | 2026-04-21 | `post-wall-field-continuation-value-pinning-v1-next-slice-selection-contract.test.ts` |
| `dynamic_airborne_split_refactor_v1` | 4 | 2026-04-21 | `post-dynamic-airborne-split-refactor-v1-next-slice-selection-contract.test.ts` |
| `wall_hostile_input_matrix_with_airborne_cartography_v1` | 3 | 2026-04-21 | `post-wall-hostile-input-matrix-with-airborne-cartography-v1-next-slice-selection-contract.test.ts` |
| `wall_lsf_timber_preset_pack_with_invariants_v1` | 2 | 2026-04-21 | `post-wall-lsf-timber-preset-pack-with-invariants-v1-next-slice-selection-contract.test.ts` |
| `masonry_flanking_inversion_fix_v1` | 1b | 2026-04-21 | `post-masonry-flanking-inversion-fix-next-slice-selection-contract.test.ts` |
| `wall_reorder_output_set_consistency_v1` | 1 | 2026-04-21 | `post-wall-reorder-output-set-consistency-v1-next-slice-selection-contract.test.ts` |

## Completion Signals

| # | Signal | Status | Anchor |
|---|---|---|---|
| C1 | Wall preset coverage ≥ 6 distinct archetypes | ✅ 6/6 | `preset-definitions.ts` + `wall-preset-expansion-benchmarks.test.ts` + `wall-lsf-timber-stud-preset-benchmarks.test.ts` |
| C2 | Every defended wall corridor source/benchmark audited | 🟡 preset surface ✓ · corridor surface deferred | `wall-full-preset-contract-matrix.test.ts` + `wall-field-continuation-completeness-matrix.test.ts` |
| C3 | Field continuation completeness | 🟡 preset surface VALUE-pinned · corridor surface deferred | `wall-field-continuation-completeness-matrix.test.ts` |
| C4 | Floor + wall hostile-input discipline | ✅ both green | `raw-floor-hostile-input-answer-matrix.test.ts` + `raw-wall-hostile-input-answer-matrix.test.ts` |
| C5 | Reorder invariance symmetric + asymmetric | ✅ | `wall-reorder-invariance-matrix.test.ts` |
| C6 | Architectural hygiene (≤2000 line files) | 🟡 split v1 landed (6630 → 3214) · v2 deferred | `dynamic-airborne-*.ts` module family |

## Physical Invariants (First-Class Accuracy Contract)

| Invariant | Definition | Test | Coverage |
|---|---|---|---|
| I1 | `R'w ≤ Rw` (ISO 140-4 flanking non-negativity) | `wall-physical-invariants-matrix.test.ts` | 6 wall presets × (field_between_rooms, building_prediction) = 12 cells, all green |
| I2 | `|Dn,A − (Dn,w + C)| ≤ 1 dB` (ISO 717 C-weighting consistency) | `wall-physical-invariants-matrix.test.ts` | 6 presets × field = 6 cells, all green |
| I3 | `DnT,w − Dn,w ∈ [2, 10] dB` for V=55 m³ RT=0.7 s (volume normalisation) | `wall-physical-invariants-matrix.test.ts` | 6 presets × building = 6 cells, all green |

## Engine Architectural Posture

`packages/engine/src/dynamic-airborne.ts` is 3214 lines (down
from 6630) after the 15-commit split refactor on 2026-04-21.
Seven bounded modules live alongside:

- `dynamic-airborne-helpers.ts` (287) — pure math, spectrum
  weights, physical constants, delegate blending, curve anchoring,
  shared types (`DynamicAirborneOptions`, `DynamicAirborneResult`,
  `DelegateCurve`, `DelegateBlend`)
- `dynamic-airborne-family-detection.ts` (257) — material + board
  predicates + framing hint helpers
- `dynamic-airborne-davy-masonry.ts` (270) — Davy/Cremer masonry
  coincidence cap
- `dynamic-airborne-mixed-plain-templates.ts` (237) — mixed-plain
  premium/moderate lab-target Rw tables + template resolvers
- `dynamic-airborne-cavity-topology.ts` (460) — cavity +
  reinforcement + single-leaf masonry profile + trim helpers
- `dynamic-airborne-masonry-calibration.ts` (1057) — all 9 masonry
  estimators (AAC / silicate / unfinished aircrete / Celcon
  finished / Porotherm / HELUZ / Ytong Massief / Ytong
  Separatiepaneel / Ytong Cellenbetonblok)
- `dynamic-airborne-framed-wall.ts` (1251) — 8 framed wall
  summarizers + `estimateStudWallTargetRw`

Remaining `dynamic-airborne.ts` (3214 lines) hosts the 14
`apply*` floor / cap guards + `calculateDynamicAirborneResult` +
`detectDynamicFamily` + `chooseBlend`. The split stops here
because the guards recursively call the composer — the v2
follow-up (`dynamic_airborne_split_refactor_v2`) uses composer
injection to finish the move.

Blueprint:
[DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./DYNAMIC_AIRBORNE_CARTOGRAPHY.md).

## Deferred Follow-Up Tracks

Explicitly planned, not done, documented — safe to resume any
time without context loss:

1. **`dynamic_airborne_split_refactor_v2`** — composer injection
   to unblock the last ~3200 lines of `dynamic-airborne.ts`.
   Blueprint in `DYNAMIC_AIRBORNE_CARTOGRAPHY.md` "Remaining Work
   Deferred" section.
2. **`wall_formula_family_widening_v1`** (master-plan step 6,
   conditional) — timber stud accuracy gap. Engine currently
   produces Rw=31 / field R'w=24 under the composed lab context
   for the `timber_stud_wall` preset; manufacturer field data
   for similar stacks is typically 45-50 dB. Parked because the
   value is VALUE-pinned as a drift guard with an explicit
   inline comment, so no silent regression can occur.
3. **Dimension B corridor VALUE pins** — extend the VALUE-pin
   discipline from the preset surface (landed) to the
   `dynamic-airborne-wall-selector-trace-matrix` corridors
   (`double_leaf`, `lined_massive_wall`, `aac_boundary`, etc.).
   Narrative pins already cover these corridors.

## Frozen Posture — Do Not Reopen By Inertia

- Every upstream closeout before 2026-04-21 remains sealed
  (reinforced-concrete follow-up, raw terminal-concrete helper,
  CLT-local combined evidence, broad audit, blocked-source
  refresh).
- Blocked-source queue — `GDMTXA04A` direct exact, `C11c` exact
  import, raw bare open-box/open-web impact, wall-selector
  widening — remains fail-closed pending external evidence.
- The 2026-04-21 masonry flanking inversion fix + lab-fallback
  anchor lane is load-bearing. Any future engine edit that
  touches `applyVerifiedAirborneCatalogAnchor` or the field
  flanking overlay must keep the invariants matrix green.

## Resume Order For The Next Agent

1. Read [CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md](./CHECKPOINT_2026-04-21_SESSION_CLOSE_HANDOFF.md)
   for the session narrative.
2. Confirm the triangle (this file +
   [MASTER_PLAN.md](./MASTER_PLAN.md) +
   [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md))
   agrees on the active slice, completion signals, and deferred
   tracks. If it does not, fix the drift before starting work.
3. Run `pnpm calculator:gate:current` — confirm green baseline.
4. Author `SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md`
   before writing any implementation code for the step 7 slice.
