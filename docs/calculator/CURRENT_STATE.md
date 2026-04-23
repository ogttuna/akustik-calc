# Dynamic Calculator Current State

Document role: short-lived snapshot of what is stable **right
now** on the calculator surface. If you need "how did we get
here" read the latest checkpoint under `docs/archive/handoffs/`.
If you need the strategic plan read [MASTER_PLAN.md](./MASTER_PLAN.md).
If you need the tactical detail on the active slice read
[NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).

---

## Revalidated Snapshot

Last revalidation cycle: `2026-04-23` (broad revalidation and
calculator refocus — checkpoint
[CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md](./CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md)).
Step 8 closed the calculator runtime audit: `MASTER_PLAN.md` §3/§8
was reconciled to implementation reality, `coverage-grid-consistency.test.ts`
now maps the grid and C1-C6 signals to executable evidence, the
focused calculator gate includes the final-audit tests, and
`POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md` opens productization. The
first four productization slices then closed server-backed project
storage v1, project/proposal route authorization, auth-session
hardening, and the pure team-access policy model.

- **Engine full suite**: 202 / 202 files, 1150 / 1150 tests green
  (up from 193/1068 pre-session; step-7 landed 4 wall cases +
  F1/F2 engine fixes + 32-assertion cross-mode torture matrix
  + 2 regression guards + post-contract; step-7b landed the
  18-cell corridor VALUE matrix + 5 cross-cell invariants +
  post-contract; step 8 landed final-audit grid consistency and
  next-slice contract tests; one flake fix on
  `floor-library-sweep.test.ts` timeout)
- **Web full suite**: 143 / 143 files, 824 / 824 tests green + 18
  discovery helpers intentionally skipped. The 2026-04-23
  productization pass added focused server project storage/API,
  proposal-audit, route-authorization, auth-session, login/logout,
  server project restore snapshot, and project access policy tests.
- **Broad `pnpm check`**: lint + typecheck + tests + build green
  (2026-04-23 verification after the broad calculator refocus;
  build still emits the known non-fatal optional
  `sharp/@img` warnings through `@turbodocx/html-to-docx`)
- **Focused calculator gate** (`pnpm calculator:gate:current`):
  includes the final-audit grid + post-contract tests and the
  calculator-refocus contract; 68 engine files / 321 tests, 29 web
  files / 132 tests + 18 skipped, build
  5/5 tasks, whitespace guard clean on the 2026-04-23 closeout run.

## Active Slice

`wall_formula_family_widening_v1` (calculator accuracy/coverage re-entry,
selected).
Selected `2026-04-23` after a green broad revalidation and an explicit
priority reset to calculation accuracy and defensible coverage first.
Planning surface:
[SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md](./SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md).

Calculator runtime status: final audit closed and green. The next work
returns to calculator accuracy/coverage through wall formula-family
widening, starting with a no-runtime-value-change audit/anchor matrix.
Do not change timber-stud or double-leaf formula values before current
outputs, traces, negative cases, and exact/benchmark precedence are
pinned.

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
  refresh).
- Blocked-source queue — `GDMTXA04A` direct exact, `C11c` exact
  import, raw bare open-box/open-web impact, wall-selector
  widening — remains fail-closed pending external evidence.
- Productization work may improve persistence, auth, billing, reports,
  and deployment, but must not change calculator runtime/source posture
  without a selected calculator slice.
- The 2026-04-21 masonry flanking inversion fix + lab-fallback
  anchor lane is load-bearing. Any future engine edit that
  touches `applyVerifiedAirborneCatalogAnchor` or the field
  flanking overlay must keep the invariants matrix green.

## Resume Order For The Next Agent

1. Read [CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md](./CHECKPOINT_2026-04-23_BROAD_REVALIDATION_CALCULATOR_REFOCUS_HANDOFF.md)
   for the latest broad validation and calculator refocus handoff.
2. Confirm the triangle (this file +
   [MASTER_PLAN.md](./MASTER_PLAN.md) +
   [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md))
   agrees on the active slice, completion signals, and deferred
   tracks. If it does not, fix the drift before starting work.
3. Read [SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md](./SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md).
4. Read [POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md](./POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md) only for deferred productization context.
5. Continue `wall_formula_family_widening_v1` from
   [SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md](./SLICE_WALL_FORMULA_FAMILY_WIDENING_PLAN.md).
   Run `pnpm calculator:gate:current` before calculator runtime
   changes; productization work should keep its own app/API tests
   current and use `pnpm check` when shared contracts or app routes
   move.
