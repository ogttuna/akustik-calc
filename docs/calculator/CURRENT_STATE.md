# Dynamic Calculator Current State

Document role: short-lived snapshot of what is stable **right
now** on the calculator surface. If you need "how did we get
here" read the latest checkpoint under `docs/archive/handoffs/`.
If you need the strategic plan read [MASTER_PLAN.md](./MASTER_PLAN.md).
If you need the tactical detail on the active slice read
[NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).

---

## Revalidated Snapshot

Last revalidation cycle: `2026-04-24` (resilient side-count Gate A
still selected; focused gate and broad `pnpm check` both revalidated
green after the planning refresh — latest checkpoint
[CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_B_READY_HANDOFF.md](./CHECKPOINT_2026-04-24_RESILIENT_SIDE_COUNT_GATE_B_READY_HANDOFF.md)).
Step 8 closed the calculator runtime audit: `MASTER_PLAN.md` §3/§8
was reconciled to implementation reality, `coverage-grid-consistency.test.ts`
now maps the grid and C1-C6 signals to executable evidence, the
focused calculator gate includes the final-audit tests, and
`POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md` opens productization. The
first four productization slices then closed server-backed project
storage v1, project/proposal route authorization, auth-session
hardening, and the pure team-access policy model.

- **Engine full suite**: 208 / 208 files, 1175 / 1175 tests green
  (up from 193/1068 pre-session; step-7 landed 4 wall cases +
  F1/F2 engine fixes + 32-assertion cross-mode torture matrix
  + 2 regression guards + post-contract; step-7b landed the
  18-cell corridor VALUE matrix + 5 cross-cell invariants +
  post-contract; step 8 landed final-audit grid consistency and
  next-slice contract tests; source-corpus Gate A/B then added the
  contract + executable audit; one flake fix on
  `floor-library-sweep.test.ts` timeout; 2026-04-24 broad revalidation
  then added the side-count Gate A surfaces plus a representative
  split-cavity field swap matrix that keeps the full single-worker suite
  under the Vitest worker timeout)
- **Web full suite**: 147 / 147 files, 845 / 845 tests green + 18
  discovery helpers intentionally skipped. The 2026-04-23
  productization pass added focused server project storage/API,
  proposal-audit, route-authorization, auth-session, login/logout,
  server project restore snapshot, and project access policy tests. The
  2026-04-24 broad revalidation also hardened the side-count Gate A
  input contract so it asserts parse behavior instead of calling
  `.keyof()` on the exported shared `AirborneContextSchema` `ZodType`.
- **Broad `pnpm check`**: lint + typecheck + tests + build green
  (2026-04-24 verification after the Gate A side-count closeout and the
  non-runtime test hardening above; build still emits the known
  non-fatal optional
  `sharp/@img` warnings through `@turbodocx/html-to-docx`)
- **Focused calculator gate** (`pnpm calculator:gate:current`):
  includes the final-audit grid + post-contract tests and the
  calculator-refocus contract; now also includes
  `wall-formula-family-widening-audit.test.ts` and
  `wall-live-dynamic-preset-route-card-matrix.test.ts` for the closed
  wall formula-family slice plus the new
  `post-wall-formula-family-widening-v1-next-slice-selection-contract.test.ts`
  planning contract and
  `wall-timber-lightweight-source-corpus-contract.test.ts`,
  `wall-timber-lightweight-source-audit.test.ts`,
  `airborne-verified-catalog.test.ts`, and
  `wall-direct-timber-exact-route-card-matrix.test.ts` for the latest
  closed source-corpus slice plus
  `post-wall-timber-lightweight-source-corpus-v1-next-slice-selection-contract.test.ts`
  for the active next-slice contract and the new Gate A side-count
  surface trio:
  `wall-resilient-bar-side-count-blind-audit.test.ts`,
  `wall-resilient-bar-side-count-route-card-matrix.test.ts`, and
  `wall-resilient-bar-side-count-input-contract.test.ts`. Latest
  focused expectation: 75 engine files / 355 tests, 33 web files /
  153 passed + 18 skipped, build 5/5 tasks, whitespace guard clean on
  the 2026-04-24 post-hardening revalidation run.

## Active Slice

`wall_resilient_bar_side_count_modeling_v1` (common resilient
framed-wall input/model expansion, selected).
Selected `2026-04-23` immediately after
`wall_timber_lightweight_source_corpus_v1` closed. Gate A is now
landed with no runtime change; Gate B explicit input/model plumbing is
next.
Planning surface:
[SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md](./SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md).

Calculator runtime status: final audit closed and green. The just-closed
wall formula-family widening slice completed Gate A and Gate B with
no runtime changes and then closed Gate C honestly:
`packages/engine/src/wall-formula-family-widening-audit.test.ts` pins
current outputs, traces, negative cases, and exact/benchmark precedence,
while `apps/web/features/workbench/wall-live-dynamic-preset-route-card-matrix.test.ts`
proves the live workbench preset path already uses the dynamic route and
pins the visible branch/card values. Gate C then kept runtime math
unchanged because the source pack still defines only a broad timber
corridor, not a precise trim target for the current preset topology.
The active next step is Gate B of the resilient side-count slice:
add the explicit resilient-bar side-count dimension to the shared wall
context and workbench/store flow without changing legacy defaults when
the new field is unset.

Implementation refinement `2026-04-23`: the Gate A audit found that the
timber-stud gap has two current surfaces. Existing no-calculator preset
matrices pin lab Rw 31.1 / field R'w 24 / building DnT,w 25 through the
screening seed, while the same stack with `calculator: "dynamic"` gives
lab Rw 50 / field R'w 42 / building DnT,w 43 with a low-confidence
framed-wall trace. Gate B then proved that the live workbench preset
path already uses `calculator: "dynamic"`, so the screening matrices
remain non-user-visible drift guards. Gate C then closed no-runtime:
official direct and resilient timber rows make `Rw 50` plausible, but
not precise enough for a defended trim.

Implementation refinement `2026-04-23` (source-corpus Gate A): the new
typed module
`packages/engine/src/wall-timber-lightweight-source-corpus.ts`
now records 7 official timber rows plus 2 linked lightweight steel
holdout companions. The current classification is explicit: 2 landed
exact imports (direct timber + generic wallboard), 5 secondary
benchmarks (resilient-bar or proprietary-board ambiguity), and 2
holdout-only links back to the active Knauf lightweight steel holdout
dataset. Gate A itself only authored the corpus; Gate C later promoted
the two direct rows to landed exact imports.

Implementation refinement `2026-04-23` (source-corpus Gate B):
`packages/engine/src/wall-timber-lightweight-source-audit.test.ts`
now proves all 9 corpus rows sit inside the defended current-engine
`Rw` corridor. The 2 direct timber rows stay within the
single-board calibration lane, the 5 resilient/proprietary rows stay
within the current double-board/resilient benchmark lane, and the 2
linked lightweight holdouts remain exact against their existing dataset
rows. The negative surface also proves the live timber preset is
family-adjacent but not exact-topology-equal to any landed direct row,
which made Gate C defensible.

Implementation refinement `2026-04-23` (source-corpus Gate C): the 2
direct timber rows are now promoted to `exact_import_landed` and
imported into `packages/engine/src/airborne-verified-catalog.ts`.
`packages/engine/src/airborne-verified-catalog.test.ts` pins the exact
lab anchor, `packages/engine/src/wall-timber-lightweight-source-audit.test.ts`
now expects those rows on the exact lane, and
`apps/web/features/workbench/wall-direct-timber-exact-route-card-matrix.test.ts`
pins the user-visible lab/field/building card surface for the two exact
rows. The 5 resilient/proprietary rows remain benchmark-only, the 2
linked lightweight holdouts remain holdout-only, and the live timber
preset still does not exact-match either landed direct row.

Implementation refinement `2026-04-23` (next selected slice): the
highest-ROI remaining common-wall source gap is now explicit resilient
bar side count. The current wall context can express
`connectionType`/`studType`, but not one-side vs both-sides resilient
mounting, so four official timber rows cannot be promoted honestly yet.
That is the active slice, not another timber formula retune.

Implementation refinement `2026-04-24` (resilient side-count Gate A):
`packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts`
now proves the four official RB1/RB2 timber rows remain collapsed onto
identical engine outputs even though each source-backed pair publishes a
3 dB `Rw` delta. The paired web matrix
`apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts`
pins the same user-visible branch/card collapse across lab, field, and
building contexts, while
`apps/web/features/workbench/wall-resilient-bar-side-count-input-contract.test.ts`
proves the shared schema and workbench store still have
`connectionType`/`studType`/`studSpacingMm` only and strip any
unmodeled `resilientBarSideCount` field. Gate A changed no calculator
runtime values; it made the missing dimension executable and explicit.

Planning refresh `2026-04-24`: the active Gate B write scope has now
been rechecked against implementation reality. The shared/model/UI
surfaces still have no resilient-bar side-count field:
`packages/shared/src/domain/airborne-context.ts`,
`apps/web/features/workbench/workbench-store.ts`,
`apps/web/features/workbench/preset-definitions.ts`,
`apps/web/features/workbench/workbench-shell.tsx`,
`apps/web/features/workbench/simple-workbench-shell.tsx`, and
`apps/web/features/workbench/simple-workbench-route-panel.tsx`.
Official source evidence remains aligned with the current corpus and
keeps the prioritization stable: Knauf GB still publishes the defended
RB1/RB2 56/59 dB split for the same timber family, and British Gypsum
still publishes the matching A046005/A046006 55/58 dB split. That means
the missing modeled dimension is still the best next accuracy/coverage
lever; no competing implementation review reopened a higher-ROI runtime
formula retune.

Implementation refinement `2026-04-24` (broad revalidation hardening):
the first broad `pnpm check` pass after Gate A surfaced two non-runtime
test issues, not calculator value drift. The shared-schema contract test
was switched from `.keyof()` to parse-based assertions because
`AirborneContextSchema` is exported as a `ZodType`, and the heavy
`calculate-assembly` split-cavity left/right gap-swap invariant sweep
was reduced from a full 4x4 gap grid to a representative
small/mid/large asymmetry matrix so the full single-worker suite stays
below the Vitest worker timeout while preserving the intended invariant.

Storage status: `server_backed_project_storage_v1` is closed. Shared
server-project schemas, owner-scoped filesystem storage, `/api/projects`
routes, local-scenario import, default workbench server project
sync/list/load, and proposal export audit append have landed. The
workbench still edits local-first; server persistence is explicit via
sync/load, not silent shared multi-user editing.

Access status: `project_access_authorization_v1` is closed. Project and
proposal routes now share route auth helpers, and tests cover
configured-auth rejection, configured owner success,
preview/configured isolation, and cross-owner proposal audit denial.

Auth status: `auth_session_hardening_v1` is closed. Auth helper and
route tests cover signed session cookie readback, tamper/expiry/wrong
user rejection, configured credential failure, safe redirect
normalization, secure login cookie creation, and logout cookie clearing.

Team access policy status: `team_access_model_v1` is closed. Shared
project roles/actions and `apps/web/lib/project-access-policy.ts` now
define owner/editor/reviewer/viewer project-action decisions with stable
denial reasons.

Productization route integration status:
`project_access_policy_route_integration_v1` is deferred, not cancelled.
Route behavior remains owner-scoped until that productization slice
resumes and wires the policy through an owner-only adapter.

## Latest Closed Slices

| Slice | Master-plan step | Closed | Post-contract |
|---|---|---|---|
| `wall_timber_lightweight_source_corpus_v1` | post-step-6 follow-up | 2026-04-23 | `post-wall-timber-lightweight-source-corpus-v1-next-slice-selection-contract.test.ts` |
| `wall_formula_family_widening_v1` | 6 | 2026-04-23 | engine audit: `wall-formula-family-widening-audit.test.ts`; live-route proof: `wall-live-dynamic-preset-route-card-matrix.test.ts`; next-slice contract: `post-wall-formula-family-widening-v1-next-slice-selection-contract.test.ts` |
| `team_access_model_v1` | productization 4 | 2026-04-23 | app policy tests: `project-access-policy.test.ts`; route/storage regressions: `server-project-routes.test.ts`, `server-project-storage.test.ts` |
| `auth_session_hardening_v1` | productization 3 | 2026-04-23 | app/API tests: `auth.test.ts`, `auth-routes.test.ts`, `server-project-routes.test.ts` |
| `project_access_authorization_v1` | productization 2 | 2026-04-23 | app/API tests: `server-project-routes.test.ts` |
| `server_backed_project_storage_v1` | productization 1 | 2026-04-23 | app/API tests: `server-project-storage.test.ts`, `server-project-routes.test.ts`, `server-project-workbench-snapshot.test.ts` |
| `good_calculator_final_audit_v1` | 8 | 2026-04-23 | `post-good-calculator-final-audit-v1-next-slice-selection-contract.test.ts` |
| `wall_corridor_surface_value_pinning_v1` | 7b | 2026-04-22 | `post-wall-corridor-surface-value-pinning-v1-next-slice-selection-contract.test.ts` |
| `mixed_floor_wall_edge_case_hardening_v1` | 7 | 2026-04-22 | `post-mixed-floor-wall-edge-case-hardening-v1-next-slice-selection-contract.test.ts` |
| `wall_field_continuation_value_pinning_v1` | 5 | 2026-04-21 | `post-wall-field-continuation-value-pinning-v1-next-slice-selection-contract.test.ts` |
| `dynamic_airborne_split_refactor_v1` | 4 | 2026-04-21 | `post-dynamic-airborne-split-refactor-v1-next-slice-selection-contract.test.ts` |
| `wall_hostile_input_matrix_with_airborne_cartography_v1` | 3 | 2026-04-21 | `post-wall-hostile-input-matrix-with-airborne-cartography-v1-next-slice-selection-contract.test.ts` |
| `wall_lsf_timber_preset_pack_with_invariants_v1` | 2 | 2026-04-21 | `post-wall-lsf-timber-preset-pack-with-invariants-v1-next-slice-selection-contract.test.ts` |
| `masonry_flanking_inversion_fix_v1` | 1b | 2026-04-21 | `post-masonry-flanking-inversion-fix-next-slice-selection-contract.test.ts` |
| `wall_reorder_output_set_consistency_v1` | 1 | 2026-04-21 | `post-wall-reorder-output-set-consistency-v1-next-slice-selection-contract.test.ts` |

## Completion Signals

| # | Signal | Status | Anchor |
|---|---|---|---|
| C1 | Wall preset coverage ≥ 6 distinct archetypes with honest evidence tiering | ✅ 6/6 | `preset-definitions.ts` + `wall-preset-expansion-benchmarks.test.ts` + `wall-lsf-timber-stud-preset-benchmarks.test.ts` + `coverage-grid-consistency.test.ts` |
| C2 | Every defended wall corridor source/benchmark audited | ✅ preset + corridor surfaces both VALUE-pinned (7b closeout 2026-04-22) | `wall-full-preset-contract-matrix.test.ts` + `wall-field-continuation-completeness-matrix.test.ts` + `dynamic-airborne-wall-selector-value-pins.test.ts` + `coverage-grid-consistency.test.ts` |
| C3 | Wall field-continuation completeness | ✅ preset + corridor surfaces both VALUE-pinned; floor expansion non-blocking | `wall-field-continuation-completeness-matrix.test.ts` + `dynamic-airborne-wall-selector-value-pins.test.ts` + `coverage-grid-consistency.test.ts` |
| C4 | Floor + wall hostile-input discipline | ✅ both green + torture-matrix O1 overlay | `raw-floor-hostile-input-answer-matrix.test.ts` + `raw-wall-hostile-input-answer-matrix.test.ts` + `mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts` |
| C5 | Reorder and split invariance on defended surfaces | ✅ wall reorder + floor split/parity surfaces; arbitrary floor reorder not claimed | `wall-reorder-invariance-matrix.test.ts` + `mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts` O2 overlay + `floor-split-layer-parity.test.ts` + `coverage-grid-consistency.test.ts` |
| C6 | Architectural hygiene (≤2000 line files) | 🟡 documented deferral: split v1 landed (6630 → 3152) · v2 deferred | `dynamic-airborne-*.ts` module family + `DYNAMIC_AIRBORNE_CARTOGRAPHY.md` + `coverage-grid-consistency.test.ts` |

## Step-7 Findings Ledger (live)

Real engine accuracy bugs surfaced by step 7's cross-mode torture
matrix. Source-of-truth detail lives in the archived slice plan
[SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md](../archive/handoffs/SLICE_MIXED_FLOOR_WALL_EDGE_CASE_HARDENING_PLAN.md)
"Accuracy Findings Ledger".

| Id | Finding | Landed | Fix |
|---|---|---|---|
| F1 | Masonry calibrators fell off lane when a same-material core was split into equal halves (engine Rw drifted +4 dB on Porotherm 50+50) | 2026-04-22 | `coalesceSameMaterialSolidLeaves` helper in `dynamic-airborne-masonry-calibration.ts`; regression guard `dynamic-airborne-masonry-same-material-split-invariance.test.ts` |
| F2 | Verified-catalog exact match stopped firing when a same-material layer split (Rw drifted +5 dB on Knauf LSF 70 mm glasswool → 35+35) | 2026-04-22 | `coalesceAdjacentSameMaterialLayers` helper in `airborne-topology.ts`; applied symmetrically at `layersApproximatelyMatch` only (engine-entry application reverted — broke framed-wall benchmarks because 2×12.5 vs 1×25 gyp board distinction is physically meaningful); regression guard `airborne-verified-catalog-same-material-split-invariance.test.ts` |
| F3 | Framed-wall monotonic-floor guard emits an extra diagnostic warning when a board-layer is split (numeric outputs unchanged; warning drift only) | 2026-04-22 deferred | Scoped `wall-lsf-knauf` splitPlans to the porous glasswool fill only; facing-split torture deferred until the monotonic-floor guard's sibling-variant generator is made layer-count invariant |
| F4 | Reorder overlay test initially assumed all wall cases were physically symmetric — LSF + timber-stud are NOT (internal cavity `[gap, fill]` vs. `[fill, gap]` are distinguishable); engine was correctly detecting the difference | 2026-04-22 | Test refined: `SYMMETRIC_REORDER_CASE_IDS` lists cases where strict bit-equality holds; asymmetric cases assert structural invariance (`dynamicFamily` + `supportedTargetOutputs` stable, metrics stay finite) |

## Physical Invariants (First-Class Accuracy Contract)

| Invariant | Definition | Test | Coverage |
|---|---|---|---|
| I1 | `R'w ≤ Rw` (ISO 140-4 flanking non-negativity) | `wall-physical-invariants-matrix.test.ts` | 6 wall presets × (field_between_rooms, building_prediction) = 12 cells, all green |
| I2 | `|Dn,A − (Dn,w + C)| ≤ 1 dB` (ISO 717 C-weighting consistency) | `wall-physical-invariants-matrix.test.ts` | 6 presets × field = 6 cells, all green |
| I3 | `DnT,w − Dn,w ∈ [2, 10] dB` for V=55 m³ RT=0.7 s (volume normalisation) | `wall-physical-invariants-matrix.test.ts` | 6 presets × building = 6 cells, all green |

## Engine Architectural Posture

`packages/engine/src/dynamic-airborne.ts` is 3152 lines (down
from 6630) after the 15-commit split refactor on 2026-04-21
plus a dead-import sweep on 2026-04-22 (52 unused imports from
the v1 split left in place; caught by broad `pnpm check` lint
that the focused gate does not run). Seven bounded modules live
alongside:

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
- `dynamic-airborne-masonry-calibration.ts` (1055) — all 9 masonry
  estimators (AAC / silicate / unfinished aircrete / Celcon
  finished / Porotherm / HELUZ / Ytong Massief / Ytong
  Separatiepaneel / Ytong Cellenbetonblok)
- `dynamic-airborne-framed-wall.ts` (1251) — 8 framed wall
  summarizers + `estimateStudWallTargetRw`

Remaining `dynamic-airborne.ts` (3152 lines) hosts the 14
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
2. **Deep-hybrid swap VALUE pins** — optional per-cell VALUE pins
   for the deep-hybrid swap grids. Existing narrative/invariant pins
   already guard the surface.
3. **Workbench card-level selector VALUE pins** — optional unless a
   user-visible card drift appears.
4. **F3 framed-wall monotonic-floor warning drift** — warning-only;
   numeric outputs unchanged.
5. **Full floor field-continuation expansion** — non-blocking for
   the closed wall final audit.
6. **Arbitrary floor reorder expansion** — not claimed beyond the
   defended floor split/parity surfaces.
7. **Standalone all-caller invalid-thickness guard** — direct engine
   hardening for floor/wall callers that bypass workbench
   normalization.
8. **Dedicated floor 50+ layer regression** — wall 50-layer behavior
   is pinned; floor stress coverage remains a future hardening track.

## Frozen Posture — Do Not Reopen By Inertia

- Every upstream calculator closeout through 2026-04-23 remains sealed
  (reinforced-concrete follow-up, raw terminal-concrete helper,
  CLT-local combined evidence, broad audit, blocked-source
  refresh, wall formula-family widening runtime trim).
- Blocked-source queue — `GDMTXA04A` direct exact, `C11c` exact
  import, raw bare open-box/open-web impact, wall-selector
  widening — remains fail-closed pending external evidence.
- Timber wall runtime widening is no longer an open heuristic question.
  The source-corpus slice is closed; the current active work is the
  missing resilient-bar side-count input/model dimension, while the
  live direct double-board timber preset still stays parked until a
  true exact topology row exists.
- Productization work may improve persistence, auth, billing, reports,
  and deployment, but must not change calculator runtime/source posture
  without a selected calculator slice.
- The 2026-04-21 masonry flanking inversion fix + lab-fallback
  anchor lane is load-bearing. Any future engine edit that
  touches `applyVerifiedAirborneCatalogAnchor` or the field
  flanking overlay must keep the invariants matrix green.

## Resume Order For The Next Agent

1. Read [CHECKPOINT_2026-04-23_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-23_WALL_TIMBER_LIGHTWEIGHT_SOURCE_CORPUS_CLOSEOUT_HANDOFF.md)
   for the source-corpus closeout and next slice selection.
2. Confirm the triangle (this file +
   [MASTER_PLAN.md](./MASTER_PLAN.md) +
   [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md))
   agrees on the active slice, completion signals, and deferred
   tracks. If it does not, fix the drift before starting work.
3. Read [SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md](./SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md).
4. Read [POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md](./POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md) only for deferred productization context.
5. Continue `wall_resilient_bar_side_count_modeling_v1` from
   [SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md](./SLICE_WALL_RESILIENT_BAR_SIDE_COUNT_MODELING_PLAN.md).
   Start at Gate A no-runtime side-count audit + input/model contract. Run
   `pnpm calculator:gate:current` before calculator runtime changes;
   productization work should keep its own app/API tests current and
   use `pnpm check` when shared contracts or app routes move.
