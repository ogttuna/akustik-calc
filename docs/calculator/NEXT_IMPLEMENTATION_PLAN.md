# Next Implementation Plan

Last reviewed: 2026-04-21

Read this file for the tactical detail of the active slice. For the
strategic picture (what the next ten moves are and why), read
[MASTER_PLAN.md](./MASTER_PLAN.md). For the current snapshot (what just
closed, what is selected), read [CURRENT_STATE.md](./CURRENT_STATE.md).

These three docs are the agent resume triangle; if they disagree, the
disagreement is the first thing to fix.

## Resume Triangle

- [CURRENT_STATE.md](./CURRENT_STATE.md) — snapshot
- [MASTER_PLAN.md](./MASTER_PLAN.md) — strategic roadmap and next ten moves
- this file — tactical slice detail

Document role:

- authoritative current next-step plan for calculator work
- use this before any historical backlog note
- keep older long-form backlog detail in:
  - [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md)
  - [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md)
  - [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md)

Read together with:

- [CURRENT_STATE.md](./CURRENT_STATE.md)
- [SYSTEM_MAP.md](./SYSTEM_MAP.md)
- [CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md)
- [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md)
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

## Primary Objective

The primary product goal is not merely to make the calculator return more
answers. It is to make the calculator:

- support a broader set of floor and wall corridors
- stay numerically and physically tighter on the corridors it already owns
- preserve answer-origin honesty while coverage grows

In practice that means:

- every widening slice must preserve or improve accuracy on the same corridor
- every tightening slice must preserve or improve defended coverage
- no slice is complete if it gains coverage by creating fake confidence,
  weakening precedence, or blurring provenance

## Planning Model

Use this decision model for every next slice:

1. widen only inside a corridor that is already benchmark-backed,
   source-anchored, or formula-owned
2. pair each widening with a tightening pass on the same family whenever the
   widened lane still relies on low-confidence or broad family blending
3. re-rank blocked families only after the current corridor is both broader and
   still numerically honest

Project-level definition of progress:

- broader supported coverage on defended corridors
- fewer low-confidence results where same-family evidence exists
- stable exact/catalog/bound/formula precedence
- stable workbench/report/card origin wording under hostile history

## Immediate Execution Frame

Use this section first when deciding what to do next.

### Now

- active slice:
  `wall_field_continuation_completeness_v1` (selected and not started)
- latest closed implementation slice:
  `wall_reorder_output_set_consistency_v1` (closed `2026-04-21` on
  `packages/engine/src/post-wall-reorder-output-set-consistency-v1-next-slice-selection-contract.test.ts`)
- retraction note:
  the previously selected next slice `preset_airborne_context_injection_v1`
  was based on a false accuracy gap (preset Rw measured with
  `airborneContext: null` rather than the real workbench
  `liveAirborneContext`). Retraction recorded in
  `docs/calculator/SYSTEM_AUDIT_2026-04-20.md` finding 10. Presets
  already produce benchmark-matching Rw under the workbench default
  lab context.
- current highest-ROI task:
  produce `wall-field-continuation-completeness-matrix.test.ts` — a
  full sweep of every defended wall corridor × every `contextMode`
  (element_lab / field_between_rooms / building_prediction) × every
  airborne output to surface any untested gap or silent drift between
  lab and field/building mode. No engine change expected unless the
  audit finds a real accuracy artifact.
- latest checkpoint review on `2026-04-20`:
  reread the living plan/state/handoff set against the active Dataholz CLT
  audit and route tests, reran the focused gate plus the broad `pnpm check`
  baseline, and found no plan/implementation drift or new reason to change the
  selected slice
- selected next slice posture:
  the broad audit/replanning pass selected the guarded raw helper lane first,
  the raw helper closeout then selected the held CLT-local evidence slice,
  the CLT-local closeout then selected the guarded reinforced-concrete
  conditional follow-up, and the reinforced closeout has now selected the
  defended Dataholz CLT calibration corridor over another reinforced
  micro-pass and every closed blocked-source family
- selected route family:
  `mass_timber_clt_floor_lane`
- selected output surface:
  `dataholz_clt_calibration_tightening_matrix`
- selected scope:
  - landed: mixed seeded cross-mode edit-history, duplicate-swap, and
    requested-output replay closeout on the defended boundary routes
  - landed: blocked-source rerank refresh contract that keeps the explicit
    candidate order unchanged after the mixed seeded closeout
  - landed: blocked-source refresh closeout selection contract that chooses a
    rank-1 Dataholz follow-up instead of reopening a blocked runtime candidate
  - landed: shared `GDMTXA04A` composite-surface model facts plus an
    executable design contract that pins the current proxy boundary,
    convenience-surface posture, and fail-closed reopen requirements
  - landed: shared `C11c` exact-import readiness facts plus an executable
    design contract that pins the visible schedule, weak weighted tuple, and
    fail-closed import prerequisites
  - landed: explicit `C11c` fail-closed closeout selection that keeps exact
    import blocked and advances to the rank-3 raw bare family
  - landed: explicit raw bare family fail-closed closeout selection that keeps
    packaged-system evidence from reopening bare-carrier impact support and
    advances to the rank-4 wall-selector family
  - landed: explicit wall-selector fail-closed closeout selection that keeps
    the guarded wall trace posture blocked and advances to a broad
    audit/replanning pass
  - landed: broad audit/replanning closeout selection that reruns the broad
    repo validation baseline, keeps the blocked-source queue fail-closed, and
    selects one defended live corridor instead of another planning-only pass
  - landed: first raw helper widening matrix that pins furring, resilient
    stud, rigid hanger, resilient-channel, and clip-plus-board concrete helper
    variants while keeping board-only and helper-without-board concrete
    negatives fail-closed on the same route/card surface
  - landed: raw helper provenance/origin matrices that pin the same helper cut
    to the screening-owned floor-rating basis and the mixed predicted-plus-
    estimated field impact basis on both engine and workbench surfaces
  - landed: second raw helper widening matrix that pins split full-helper,
    split board-fill, and split board-cavity concrete helper topologies while
    keeping top-finish, wall-like, and weaker steel-joist negatives explicit
  - landed: split-topology provenance/card-origin matrices that pin the same
    second cut to the same screening-owned rating surface and keep the weaker
    steel-joist negative outside the concrete impact lane
  - landed: third raw helper widening matrix that pins board-and-cavity,
    board-and-fill, mixed-order, and disjoint board-fill-board helper
    topologies on the same concrete lane without reopening weaker carriers
  - landed: partial-order provenance/card-origin matrices that pin the same
    third cut to the same screening-owned rating surface and the same mixed
    predicted-plus-estimated field impact continuation on both engine and
    workbench surfaces
  - landed: explicit raw terminal-concrete helper closeout selection that
    freezes the now-complete defended helper topology pack and promotes the
    held CLT-local combined candidate to the next honest no-runtime slice
  - landed: first CLT-local combined evidence matrix that pins the exact `C4c`
    anchor, the predictor-backed visible `C5c` proxy, and one
    under-described fail-closed local combined boundary on the same field-side
    output surface
  - landed: remaining exact-anchor pack for `C2c`, `C3c`, and `C7c` on the
    same local CLT combined evidence surface across engine and workbench
  - landed: explicit CLT-local closeout selection that freezes the now-explicit
    exact/predictor/fail-closed local evidence surface and promotes the
    guarded reinforced-concrete conditional follow-up as the next honest move
  - landed: first reinforced-concrete follow-up engine/workbench matrices that
    pin the explicit predictor-input baseline, the same visible-derived
    low-confidence route, and the heavy bare / heavy floating formula
    boundaries on one guarded surface
  - landed: reinforced-concrete provenance/origin engine/workbench matrices
    that pin the same guarded surface to its low-confidence published-family
    fallback packet versus adjacent formula-owned concrete boundaries, without
    inventing extra nearby-row evidence or silently changing output-origin
    wording
  - landed: reinforced-concrete diagnostics-dossier and consultant-trail
    matrices that pin the same guarded surface on user-facing audit/report
    wording, so the low-confidence reinforced route stays screening-only while
    adjacent formula-owned concrete boundaries stay scoped-estimate only
  - landed: explicit reinforced-concrete closeout selection that freezes the
    bounded low-confidence corridor once its matrix, provenance, and
    audit/report surfaces are explicit and promotes the defended Dataholz CLT
    tightening corridor as the next honest runtime move
  - active: Dataholz CLT exact-vs-estimate calibration/source-truth tightening
    on the defended mass-timber floor lane, starting from the landed
    source-truth audit, calibration audit, and workbench source-truth route
    without treating visible `GDMTXA04A` rows as a direct exact reopen
  - the closed rank-1 Dataholz design stays available as fail-closed evidence,
    not as the active selected slice
  - the closed rank-2 `C11c` design stays available as fail-closed evidence,
    not as the active selected slice
  - the closed rank-3 raw bare family stays available as fail-closed evidence,
    not as the active selected slice
- remaining blocked runtime candidate posture stays explicit:
  - no blocked source-backed family is currently active
  - `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector remain
    closed fail-closed until genuinely new evidence appears

### Next

1. Keep the landed `GDMTXA04A`, `C11c`, raw bare, and wall-selector closeouts
   fail-closed unless genuinely new evidence appears.
2. Keep the broad repo validation baseline green now that the reinforced
   closeout has landed and the Dataholz CLT tightening slice is active.
3. Keep the reinforced-concrete, raw-helper, and CLT-local closeouts frozen;
   do not reopen those slices or drift back into bare open-box/open-web from
   nearby green tests.
4. Work only on the defended Dataholz CLT calibration/source-truth corridor;
   do not treat visible `GDMTXA04A` rows as a direct exact reopen merely
   because nearby CLT tests are green.
5. Close this slice only after one explicit next-slice contract says whether
   the remaining Dataholz CLT slack is now fully bounded or whether one more
   same-family tightening move still deserves selection.

### Later

1. raw helper widening stays closed as solved program evidence unless a future
   trace shows another defended topology that is not already pinned.
2. a fresh runtime reopen only if a closed family produces defended new
   evidence instead of proximity to already-green routes.

### Explicit Non-Goals Right Now

- do not reopen wall-selector widening, raw bare open-box/open-web, `C11c`, or
  `GDMTXA04A` just because those closeouts are now green
- do not switch back to the reinforced-concrete low-confidence corridor or any
  other previously closed slice without an explicit new next-slice decision
- do not treat `GDMTXA04A` visible stacks as direct exact matches until the
  composite surface problem is actually solved
- do not create another broad mixed generated family grid just because the
  shared torture pass is active
- do not reopen heavy-concrete parity widening or another CLT/concrete
  micro-pass by inertia while the selected Dataholz CLT tightening slice is
  active

## Verified Against Implementation - 2026-04-20

- latest reinforced-concrete low-confidence follow-up matrix landing on
  `2026-04-20`:
  - landed
    `packages/engine/src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts`
  - landed
    `apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-route-card-matrix.test.ts`
  - pinned one explicit guarded reinforced-concrete follow-up surface across
    engine and workbench:
    explicit predictor-input low-confidence baseline, visible-derived
    low-confidence route, expanded-board heavy bare-floor boundary, and
    upper-only heavy-floating formula boundary
  - confirmed the guarded corridor stays honest:
    the low-confidence route keeps the mixed nearby-row candidate pack and
    proxy-airborne wording, while the two adjacent formula lanes stay outside
    the follow-up surface instead of collapsing into it
  - updated the focused current gate to carry the new engine/web reinforced
    follow-up matrix pair
  - `pnpm calculator:gate:current`: green with focused engine `43/43` files
    and `164/164` tests plus focused web `16/16` files and `24/24` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest reinforced-concrete low-confidence provenance/origin landing on
  `2026-04-20`:
  - landed
    `packages/engine/src/reinforced-concrete-low-confidence-follow-up-origin-matrix.test.ts`
  - landed
    `apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-provenance-matrix.test.ts`
  - pinned the same guarded reinforced-concrete follow-up surface to one
    explicit provenance split across engine and workbench:
    low-confidence published-family fallback stays on the nearby-row packet,
    while expanded-board and upper-only boundaries stay on the heavy bare /
    heavy floating formula-owned evidence surfaces
  - confirmed the reinforced packet stays honest:
    the visible low-confidence route now snapshots the real five-citation
    nearby-row packet instead of a stale extra-summary citation, and the
    adjacent formula lanes keep their single-anchor evidence
  - updated the focused current gate to carry the reinforced engine/web
    provenance pair
  - `pnpm calculator:gate:current`: green with focused engine `44/44` files
    and `169/169` tests plus focused web `17/17` files and `28/28` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest reinforced-concrete diagnostics/trail surface landing on
  `2026-04-20`:
  - landed
    `apps/web/features/workbench/reinforced-concrete-low-confidence-diagnostics-dossier-matrix.test.ts`
  - landed
    `apps/web/features/workbench/reinforced-concrete-low-confidence-consultant-trail-matrix.test.ts`
  - pinned the same reinforced follow-up corridor on user-facing audit
    surfaces:
    the visible low-confidence route stays screening-only in the diagnostics
    dossier and consultant decision trail, while expanded-board and upper-only
    boundaries stay on scoped-formula wording
  - confirmed the reporting split stays honest:
    the low-confidence route carries the five-citation screening package and
    warning-heavy delivery posture, while the adjacent formula lanes keep the
    one-citation scoped package and distinct output-coverage tones
  - updated the focused current gate to carry the new reinforced dossier/trail
    pair
  - `pnpm calculator:gate:current`: green with focused engine `44/44` files
    and `169/169` tests plus focused web `19/19` files and `36/36` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest reinforced-concrete closeout selection on `2026-04-20`:
  - landed
    `packages/engine/src/post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts`
  - closed `reinforced_concrete_accuracy_reopen`
  - selected `dataholz_clt_calibration_tightening` as the next honest runtime
    tightening slice because the bounded reinforced low-confidence corridor is
    now explicitly closed and no fourth defended boundary remained inside it
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    fail-closed after the closeout and kept raw-helper / CLT-local evidence
    closed as solved program input
  - updated the focused current gate with the new reinforced closeout
    selection contract plus the Dataholz CLT audit/source-truth pack
  - `pnpm calculator:gate:current`: green with focused engine `47/47` files
    and `179/179` tests plus focused web `20/20` files and `38/38` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest CLT-local combined evidence triad landing on `2026-04-20`:
  - landed
    `packages/engine/src/clt-local-combined-interaction-evidence-matrix.test.ts`
  - kept the first CLT-local no-runtime artefact narrow and explicit:
    exact `C4c`, predictor-backed visible `C5c`, and one under-described
    fail-closed local combined boundary
  - confirmed the triad stays honest on the engine evidence surface:
    exact rows keep the mixed exact field continuation, the predictor row
    stays on the dedicated CLT dry interaction basis, and the under-described
    shape keeps impact outputs fail-closed with screening-only `Rw`
  - updated the focused current gate to carry the new engine matrix plus the
    existing workbench history-replay CLT guard
  - `pnpm calculator:gate:current`: green with focused engine `35/35` files
    and `134/134` tests plus focused web `13/13` files and `14/14` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest CLT-local combined exact-anchor pack landing on `2026-04-20`:
  - landed
    `packages/engine/src/clt-local-combined-exact-anchor-pack.test.ts`
  - landed
    `apps/web/features/workbench/clt-local-combined-exact-anchor-route-card-matrix.test.ts`
  - pinned the remaining exact local CLT combined anchors on the same evidence
    surface:
    `C2c`, `C3c`, and `C7c`
  - confirmed the pack stays honest across engine/workbench surfaces:
    all three rows remain exact, keep the mixed exact field continuation, and
    do not blur into the predictor-only `C5c` lane or the fail-closed
    under-described boundary
  - updated the focused current gate to carry the new engine/web exact-anchor
    pair
  - `pnpm calculator:gate:current`: green with focused engine `35/35` files
    and `134/134` tests plus focused web `13/13` files and `14/14` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest CLT-local combined closeout selection on `2026-04-20`:
  - landed
    `packages/engine/src/post-clt-local-combined-interaction-evidence-next-slice-selection-contract.test.ts`
  - closed `clt_local_combined_interaction_evidence_v1`
  - selected `reinforced_concrete_accuracy_reopen` as the next honest active
    follow-up because the current local CLT surface is now explicit across the
    exact-anchor pack, the predictor-backed visible proxy, and the same
    under-described fail-closed boundary
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    fail-closed after the closeout and kept raw helper closed as solved
    evidence
  - updated the focused current gate with the new CLT closeout selection
    contract plus the reinforced-concrete guard pack
  - `pnpm calculator:gate:current`: green with focused engine `42/42` files
    and `159/159` tests plus focused web `15/15` files and `20/20` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest raw terminal-concrete helper closeout selection on `2026-04-20`:
  - landed
    `packages/engine/src/post-raw-terminal-concrete-helper-family-widening-next-slice-selection-contract.test.ts`
  - closed `raw_terminal_concrete_helper_family_widening_v1`
  - selected `clt_local_combined_interaction_evidence_v1` as the next honest
    no-runtime slice because the raw helper support-baseline shapes are now
    explicitly pinned and another raw-helper widening cut would be sprawl
    rather than a clean ROI move
  - kept reinforced-concrete reopening plus every closed blocked-source family
    fail-closed after the closeout
  - updated the focused current gate to carry the new raw-helper closeout
    selection contract
  - `pnpm calculator:gate:current`: green with focused engine `31/31` files
    and `73/73` tests plus focused web `11/11` files and `12/12` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest raw terminal-concrete helper partial-order widening landing on
  `2026-04-20`:
  - landed
    `packages/engine/src/raw-terminal-concrete-helper-partial-order-matrix.test.ts`
  - landed
    `apps/web/features/workbench/raw-terminal-concrete-helper-partial-order-route-card-matrix.test.ts`
  - landed
    `packages/engine/src/raw-terminal-concrete-helper-partial-order-origin-matrix.test.ts`
  - landed
    `apps/web/features/workbench/raw-terminal-concrete-helper-partial-order-output-origin-card-matrix.test.ts`
  - pinned the remaining defended partial/order helper shapes from the raw
    screening support baseline on the same formula-owned terminal-concrete
    lane: board-and-cavity, board-and-fill, mixed-order, and disjoint
    board-fill-board packages
  - confirmed the same four shapes stay on the same screening-owned rating
    surface and the same mixed predicted-plus-estimated field impact
    continuation across engine and workbench
  - updated the focused current gate to carry the new partial-order
    engine/web matrix and provenance pair
  - `pnpm calculator:gate:current`: green with focused engine `30/30` files
    and `70/70` tests plus focused web `11/11` files and `12/12` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest raw terminal-concrete helper split-topology widening landing on
  `2026-04-20`:
  - landed
    `packages/engine/src/raw-terminal-concrete-helper-split-topology-matrix.test.ts`
  - landed
    `apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-route-card-matrix.test.ts`
  - landed
    `packages/engine/src/raw-terminal-concrete-helper-split-topology-origin-matrix.test.ts`
  - landed
    `apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-output-origin-card-matrix.test.ts`
  - pinned one more defended widening cut on the same concrete lane across
    split full-helper, split board-fill, and split board-cavity topologies
  - kept the adjacent top-finish and wall-like negatives on the same
    formula-owned provenance surface while keeping the weaker steel-joist raw
    carrier outside the concrete impact lane
  - updated the focused current gate to carry the new split-topology
    engine/web matrix and provenance pair
  - `pnpm calculator:gate:current`: green with focused engine `28/28` files
    and `68/68` tests plus focused web `9/9` files and `10/10` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest raw terminal-concrete helper provenance/origin guard landing on
  `2026-04-20`:
  - landed
    `packages/engine/src/raw-terminal-concrete-helper-origin-matrix.test.ts`
  - landed
    `apps/web/features/workbench/raw-terminal-concrete-helper-output-origin-card-matrix.test.ts`
  - pinned the same first helper-family widening cut to one defended
    provenance surface: no exact/source-family reopening, no lower-bound
    fallback, floor ratings remain screening-owned, and field impact remains
    on the mixed predicted-plus-estimated continuation
  - kept the board-only and helper-without-board negatives on the same
    provenance surface while `Rw` stays fail-closed
  - updated the focused current gate to carry the new engine/web provenance
    matrix pair
  - `pnpm calculator:gate:current`: green with focused engine `26/26` files
    and `66/66` tests plus focused web `7/7` files and `8/8` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest raw terminal-concrete helper widening matrix landing on `2026-04-20`:
  - landed
    `packages/engine/src/raw-terminal-concrete-helper-widening-matrix.test.ts`
  - landed
    `apps/web/features/workbench/raw-terminal-concrete-helper-route-card-matrix.test.ts`
  - pinned the first defended helper-family widening cut on the already-live
    concrete lane across furring, resilient stud, rigid hanger,
    resilient-channel, and clip-plus-board cavity variants
  - kept board-only and helper-without-board concrete lower-treatment shapes
    fail-closed for field-side `Rw` while leaving the existing impact field
    continuation explicit
  - updated the focused current gate to carry the new engine/web matrix pair
  - `pnpm calculator:gate:current`: green with focused engine `25/25` files
    and `65/65` tests plus focused web `6/6` files and `7/7` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest broad audit and replanning closeout selection on `2026-04-20`:
  - landed
    `packages/engine/src/post-broad-audit-and-replanning-pass-v2-next-slice-selection-contract.test.ts`
  - closed `broad_audit_and_replanning_pass_v2`
  - selected `raw_terminal_concrete_helper_family_widening_v1` as the next
    honest active slice because the raw terminal-concrete helper corridor is
    already live, formula-owned, and now defended by answer/support/history
    guards while CLT-local work and all blocked-source families still require
    new evidence
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    fail-closed after the audit closeout
  - reran `pnpm check`: green with full engine `182/182` files and `1015/1015`
    tests plus full web `129/129` files and `699/699` tests
  - reran `pnpm build`: green with the known optional `sharp/@img` DOCX
    warnings

- latest wall-selector fail-closed closeout selection on `2026-04-20`:
  - landed
    `packages/engine/src/post-wall-selector-behavior-widening-next-slice-selection-contract.test.ts`
  - closed `wall_selector_behavior_widening`
  - selected `broad_audit_and_replanning_pass_v2` as the next honest no-runtime
    slice because the last remaining blocked family also did not yield a fresh
    classified wall red
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    widening closed fail-closed after the closeout
  - added the new closeout selection contract to the focused current gate
  - `pnpm calculator:gate:current`: green with focused engine `20/20` files
    and `58/58` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest C11c exact-import readiness design landing on `2026-04-20`:
  - landed
    `packages/engine/src/tuas-c11c-exact-import-readiness.ts`
  - landed
    `packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts`
  - centralized the visible `C11c` schedule, weak weighted tuple, nearby exact
    anchors, and exact-import prerequisites into one shared fact surface
  - rewired the active `C11c` blocker evidence tests onto the shared fact
    surface so the active slice no longer duplicates its source stack across
    isolated files
  - kept visible `C11c` rows screening-only with `Rw` support only and left
    exact import blocked because the landed design still does not produce an
    honest source-backed import rule
  - added the new C11c design contract to the focused current gate
  - `pnpm calculator:gate:current`: green with focused engine `17/17` files
    and `49/49` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green
- latest Dataholz composite-surface design landing on `2026-04-20`:
  - landed
    `packages/engine/src/dataholz-gdmtxa04a-composite-surface-model.ts`
  - landed
    `packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts`
  - extracted the shared `GDMTXA04A` visible proxy boundary and impact cap out
    of `floor-system-estimate.ts` so the active slice now has one executable
    source of truth for its convenience-surface posture
  - kept visible `GDMTXA04A` rows estimate-only and kept exact visible reopen
    blocked because the landed design still does not yield an honest composite
    surface equivalence
  - added the new Dataholz design contract to the focused current gate
  - `pnpm calculator:gate:current`: green with focused engine `14/14` files
    and `40/40` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green
- latest blocked-source refresh closeout selection on `2026-04-20`:
  - landed
    `packages/engine/src/post-blocked-source-backed-widening-rerank-refresh-next-slice-selection-contract.test.ts`
  - closed `blocked_source_backed_widening_rerank_refresh_v2`
  - selected `dataholz_gdmtxa04a_composite_surface_model_design_v1` as the
    next honest no-runtime slice because `GDMTXA04A` stayed rank 1 after the
    refresh and its remaining blocker is still local composite-surface design,
    not missing source truth
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    widening explicit blocked runtime holds after the closeout
  - added the new closeout selection contract to the focused current gate
  - `pnpm calculator:gate:current`: green with focused engine `13/13` files
    and `37/37` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green
- latest focused gate revalidation on `2026-04-20`:
  - reran `pnpm calculator:gate:current` after the broad audit selected the
    raw terminal-concrete helper widening slice
  - focused engine gate: `24/24` test files passed, `64/64` tests passed
  - focused web gate: `5/5` test files passed, `6/6` tests passed
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green
  - revalidation confirmed the current docs should describe the selected raw
    helper widening slice rather than the completed broad audit pass

- latest slice closeout selection on `2026-04-19`:
  - landed
    `packages/engine/src/post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts`
  - closed `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2`
  - selected `blocked_source_backed_widening_rerank_refresh_v2` as the next
    honest no-runtime slice because the mixed seeded closeout produced no
    fresh classified runtime red
  - kept `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
    widening explicit blocked holds after the closeout
  - added the new closeout selection contract to the focused current gate
  - `pnpm calculator:gate:current`: green with focused engine `11/11` files
    and `31/31` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest broad validation pass on `2026-04-19`:
  - reran `pnpm check` after the blocked-source refresh landing and current
    living-doc refresh
  - full engine suite: `161/161` test files passed, `964/964` tests passed
  - full web suite: `118/118` test files passed, `676/676` tests passed
  - reran `pnpm build`: green with the known optional `sharp/@img` DOCX
    warnings
  - the full green pass confirmed the landed blocked-source refresh contract
    without reopening any blocked runtime candidate or changing the explicit
    rerank order

- latest blocked-source refresh landing on `2026-04-19`:
  - landed
    `packages/engine/src/blocked-source-backed-widening-rerank-refresh-contract.test.ts`
  - re-scored the blocked candidate order against the closed mixed seeded
    floor/wall evidence pack and kept the order unchanged:
    `GDMTXA04A`, `C11c`, raw bare open-box/open-web, wall-selector
  - confirmed the mixed seeded closeout added no fresh classified runtime red,
    no new direct source truth, and no wall trace red that could honestly
    reopen a blocked runtime candidate
  - added the refresh contract to the focused current gate
  - `pnpm calculator:gate:current`: green with focused engine `12/12` files
    and `34/34` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- earlier active-slice mixed floor/wall seeded-chain landing on `2026-04-19`:
  - split the requested-output partial-restore branch so broad and
    representative requested-output surfaces keep the compact replay variants
    while the selected seeded requested-output surfaces carry the explicit
    reverse-mask variants
  - landed
    `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.test.ts`
    and added it to the focused current gate so the branch split stays pinned
  - `pnpm calculator:gate:current`: green with focused engine `10/10` files
    and `28/28` tests plus focused web `5/5` files and `25/25` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green
- earlier active-slice mixed floor/wall seeded-chain landing on `2026-04-19`:
  - widened the selected web duplicate/swap replay family from a single
    global reverse toggle to explicit per-plan reverse-mask variants on the
    defended seeded boundary routes
  - aligned
    `apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts`
    and
    `apps/web/features/workbench/mixed-study-mode-output-card-snapshot-test-helpers.ts`
    so partial-restore and save-load replay can reverse individual split plans
    without leaking that broader contract into the compact broad replay lanes
  - kept broad and representative requested-output/output-card replay on the
    compact direct-vs-global-reverse contract while the selected seeded lane
    adopted per-plan reverse masks
  - `pnpm calculator:gate:current`: green with focused engine `10/10` files
    and `28/28` tests plus focused web `4/4` files and `23/23` tests
  - focused repo build: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green
- latest active-slice mixed floor/wall seeded-chain progress on `2026-04-19`:
  - widened
    `apps/web/features/workbench/mixed-study-mode-generated-test-helpers.ts`
    selected edit-history variants from the prior direct-only quartet to an
    eight-variant selected-only replay set with reversed split-order chains
  - kept broad and representative requested-output edit-history descriptors on
    their previous direct-only contract while the selected requested-output
    lane adopted the broader selected replay set
  - normalized the selected generated edit-history helper and the selected
    requested-output output-card helper so reversed hostile replay still
    collapses onto the canonical direct-final row order before snapshot and
    save-load assertions
  - widened
    `packages/engine/src/mixed-floor-wall-generated-matrix.test.ts`
    selected duplicate/swap reverse-mask pressure from the prior
    direct-plus-single/all-reversal coverage to exhaustive reverse-mask
    combinations on the defended seeded boundary routes
  - `pnpm calculator:gate:current`: green with focused engine `10/10` files
    and `28/28` tests plus focused web `4/4` files and `23/23` tests
  - repo build inside the focused gate: green with the known optional
    `sharp/@img` DOCX warnings
  - `git diff --check`: green

- latest blocked-source rerank closeout selection on `2026-04-18`:
  - landed
    `packages/engine/src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts`
  - closed `blocked_source_backed_widening_rerank_v1` after all four ranked
    runtime candidates stayed explicitly blocked
  - selected `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2` as the
    next honest no-runtime slice on the shared seeded floor/wall boundary
    routes
  - updated the focused gate to pair the rerank closeout contract with the
    existing mixed floor/wall seeded-chain engine/web anchors
  - targeted closeout engine pack: `10/10` test files passed, `28/28` tests
    passed
  - targeted closeout web pack: `4/4` test files passed, `23/23` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm check`: green with full engine `160/160` files and `960/960` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest broad validation stability pass on `2026-04-18`:
  - isolated the broad-gate failure to two throughput-only web deep-hybrid
    swap timeouts, not a runtime regression
  - widened
    `apps/web/features/workbench/dynamic-route-deep-hybrid-test-helpers.ts`
    swap timeout headroom from `90_000` to `150_000`
  - kept calculator/runtime behavior unchanged
  - confirmed the focused gate stayed green with engine `10/10` files and
    `28/28` tests plus web `4/4` files and `23/23` tests
  - reran `pnpm check`: green with full engine `160/160` files and `960/960`
    tests plus full web `117/117` files and `674/674` tests
  - reran `pnpm build`: green with the known optional `sharp/@img` DOCX
    warnings
  - `git diff --check`: green

- latest active-slice CLT calibration closeout on `2026-04-17`:
  - landed `packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts`
  - the visible `GDMTXA04A`-like composite dry-screed boundary stays
    estimate-only with candidate `dataholz_gdmtxa01a_clt_lab_2026`
  - lab-side impact outputs are now capped against the direct official exact
    row on `Ln,w`, `CI`, `CI,50-2500`, and `Ln,w+CI`
  - the visible field-side boundary now uses the standardized
    `L'nT,50` companion path instead of the weaker local-guide fallback
  - the direct `GDMTXA04A` exact reopen stays blocked as a material-surface
    decision
- latest CLT closeout validation on `2026-04-17`:
  - targeted CLT engine pack: `5/5` test files passed, `17/17` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm check`: green with full engine `155/155` files and `949/949` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest blocked-source rerank order update on `2026-04-17`:
  - refreshed the explicit no-runtime candidate order to:
    `GDMTXA04A`, `C11c`, raw bare open-box/open-web, wall-selector
  - kept the selected slice on `blocked_source_backed_widening_rerank_v1`
    without selecting a runtime widening yet
  - kept every blocked family fail-closed while making the order executable in
    `packages/engine/src/source-gap-candidate-re-rank-contract.test.ts`
  - targeted rerank engine pack: `6/6` test files passed, `23/23` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `8/8` files and
    `29/29` tests plus focused web `3/3` files and `9/9` tests
  - `pnpm check`: green with full engine `155/155` files and `949/949` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest blocked-source rerank progress update on `2026-04-17`:
  - landed
    `packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts`
  - froze rank-1 `GDMTXA04A` as still blocked after an explicit feasibility
    audit instead of letting the rerank drift toward a silent exact reopen
  - advanced the rerank comparison target to `tuas_c11c_exact_import` without
    changing runtime behavior or the blocked candidate order
  - targeted rerank engine pack: `4/4` test files passed, `10/10` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `9/9` files and
    `31/31` tests plus focused web `3/3` files and `9/9` tests
  - `pnpm check`: green with full engine `156/156` files and `951/951` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest blocked-source rank-2 progress update on `2026-04-17`:
  - landed
    `packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts`
  - froze rank-2 `C11c` as still blocked after an explicit feasibility audit
    because its combined wet tuple remains anomalous and cannot be imported
    honestly
  - advanced the rerank comparison target to
    `raw_bare_open_box_open_web_impact_widening` without changing runtime
    behavior or the blocked candidate order
  - targeted rerank engine pack: `5/5` test files passed, `15/15` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `10/10` files
    and `33/33` tests plus focused web `3/3` files and `9/9` tests
  - `pnpm check`: green with full engine `157/157` files and `953/953` tests
    plus full web `117/117` files and `674/674` tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- latest broad audit and replanning pass on `2026-04-17`:
  - reran `pnpm calculator:gate:current`, `pnpm check`, and `pnpm build`
  - found no hidden runtime regressions beyond the already-landed rank-2
    `C11c` feasibility hold
  - revalidated that the active rerank order still matches implementation and
    that the honest first move is the rank-3 raw bare open-box/open-web
    feasibility audit rather than a direct widening
  - full engine suite: `157/157` test files passed, `953/953` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - focused engine gate: `10/10` test files passed, `33/33` tests passed
  - focused web gate: `3/3` test files passed, `9/9` tests passed
  - `git diff --check`: green
- latest blocked-source rank-3 progress update on `2026-04-18`:
  - landed
    `packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts`
  - froze rank-3 raw bare open-box/open-web as still blocked after an explicit
    feasibility audit because current TUAS and UBIQ rows remain packaged-system
    evidence, not true bare-carrier impact evidence
  - advanced the rerank comparison target to `wall_selector_behavior_widening`
    without changing runtime behavior or the blocked candidate order
  - targeted rerank engine pack: `6/6` test files passed, `18/18` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `11/11` files
    and `35/35` tests plus focused web `3/3` files and `9/9` tests
  - `git diff --check`: green
- latest blocked-source rank-4 progress update on `2026-04-18`:
  - landed
    `packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts`
  - kept rank-4 wall-selector behavior blocked after an explicit feasibility
    audit because the current wall trace/card guard is already closed and no
    fresh classified wall red exists
  - exhausted the comparison queue inside
    `blocked_source_backed_widening_rerank_v1` without changing runtime
    behavior, so the next honest move is rerank closeout selection
  - targeted rerank engine pack: `7/7` test files passed, `20/20` tests
    passed
  - `pnpm calculator:gate:current`: green with focused engine `12/12` files
    and `37/37` tests plus focused web `3/3` files and `9/9` tests
  - `git diff --check`: green
- latest closed implementation slice:
  `heavy_concrete_formula_family_widening_v1`
- latest focused active-slice verification on `2026-04-17`:
  - targeted heavy-concrete engine pack: `4/4` test files passed,
    `312/312` tests passed
  - `pnpm calculator:gate:current`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this closeout pass:
  - focused engine gate: `4/4` test files passed, `14/14` tests passed
  - focused web gate: `3/3` test files passed, `6/6` tests passed
  - `pnpm calculator:gate:current`: green
  - full engine suite: `147/147` test files passed, `923/923` tests passed
  - full web suite: `113/113` test files passed, `655/655` tests passed
  - `pnpm typecheck`: green
  - `pnpm lint`: green
  - `pnpm check`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this final-probe pass:
  - targeted concrete closeout/benchmark/regression pack:
    `3/3` test files passed, `114/114` tests passed
  - `pnpm calculator:gate:current`: green with `4/4` test files passed and
    `15/15` tests passed in the focused engine/web gate
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this slice-closeout selection pass:
  - focused engine gate: `5/5` test files passed, `23/23` tests passed
  - focused web gate: `3/3` test files passed, `6/6` tests passed
  - `pnpm calculator:gate:current`: green
  - full engine suite: `148/148` test files passed, `930/930` tests passed
  - full web suite: `113/113` test files passed, `655/655` tests passed
  - `pnpm check`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this visible-stack continuity pass:
  - targeted reinforced-concrete visible continuity pack: `2/2` test files
    passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `3/3` web files and `7/7` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this high-visibility low-confidence lane-label pass:
  - targeted web honesty pack: `2/2` test files passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `6/6` web files and `13/13` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this proposal/diagnostics honesty pass:
  - targeted reinforced-concrete proposal honesty pack: `1/1` test file
    passed, `2/2` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `15/15` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this source-lineage honesty pass:
  - targeted reinforced-concrete lineage/provenance pack: `3/3` test files
    passed, `8/8` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this nearby-row carry-through pass:
  - targeted reinforced-concrete nearby-row honesty pack: `3/3` test files
    passed, `10/10` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this nearby-row ranking-label pass:
  - targeted reinforced-concrete nearby-row ranking pack: `2/2` test files
    passed, `6/6` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this same-ceiling candidate-order pass:
  - targeted reinforced-concrete order-regression pack: `8/8` test files
    passed, `20/20` tests passed
  - `pnpm calculator:gate:current`: green with `8/8` engine files and
    `29/29` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this same-ceiling score-rationale pass:
  - targeted reinforced-concrete ranking-helper pack: `1/1` test file passed,
    `4/4` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this nearby-row ranking-rationale surface pass:
  - targeted reinforced-concrete rationale pack: `3/3` test files passed,
    `9/9` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this solver-side low-confidence note-honesty pass:
  - targeted reinforced-concrete note-honesty pack: `3/3` test files passed,
    `17/17` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this support-note rationale carry-through pass:
  - targeted reinforced-concrete support-note pack: `5/5` test files passed,
    `314/314` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this evidence-ranked-row carry-through pass:
  - targeted reinforced-concrete evidence/proposal pack: `2/2` test files
    passed, `7/7` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this evidence-citation-prioritization pass:
  - targeted reinforced-concrete evidence/proposal pack: `2/2` test files
    passed, `7/7` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this screening-package wording pass:
  - targeted reinforced-concrete proposal/dossier pack: `2/2` test files
    passed, `4/4` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this consultant-trail screening pass:
  - targeted reinforced-concrete consultant/proposal trail pack: `2/2` test
    files passed, `7/7` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this proposal-recommendation screening pass:
  - targeted reinforced-concrete proposal brief pack: `2/2` test files passed,
    `5/5` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this consultant-emphasis screening pass:
  - targeted reinforced-concrete consultant/proposal pack: `2/2` test files
    passed, `7/7` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this proposal-summary screening pass:
  - targeted reinforced-concrete proposal summary pack: `3/3` test files
    passed, `6/6` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this diagnostics-screening posture pass:
  - targeted reinforced-concrete diagnostics/proposal pack: `2/2` test files
    passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this broad repo revalidation pass:
  - `pnpm check`: green
  - full engine suite: `152/152` test files passed, `942/942` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `33/33` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- broad-pass conclusion from this revalidation:
  - repo-wide validation surfaced one stale lint leak, one stale typecheck
    leak, and three stale engine expectation/parity contracts
  - all five drifts were aligned without reopening concrete widening or
    changing the intended reinforced-concrete low-confidence corridor posture
  - the next high-ROI move is no longer wording-only screening polish; it is a
    solver-side residual evidence/fit decision on the same reinforced-concrete
    branch
- local verification in this solver-side overlap-removal pass:
  - targeted engine overlap pack: `4/4` test files passed, `35/35` tests
    passed
  - `pnpm calculator:gate:current`: green with `9/9` engine files and
    `34/34` engine tests plus `7/7` web files and `16/16` web tests
  - `pnpm check`: green
  - full engine suite: `152/152` test files passed, `942/942` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green
- local verification in this reinforced-concrete closeout selection pass:
  - focused engine gate: `5/5` test files passed, `23/23` tests passed
  - focused web gate: `2/2` test files passed, `5/5` tests passed
  - `pnpm calculator:gate:current`: green
  - full engine suite: `153/153` test files passed, `945/945` tests passed
  - full web suite: `117/117` test files passed, `674/674` tests passed
  - `pnpm check`: green
  - `pnpm build`: green with the known optional `sharp/@img` DOCX warnings
  - `git diff --check`: green

## Closeout Summary

The requested-output harness chain remains frozen. The no-runtime rerank and
the heavy-concrete widening that followed it are now both closed.

Heavy-concrete closeout result:

- latest closed implementation slice:
  `heavy_concrete_formula_family_widening_v1`
- closeout basis:
  - six defended predictor / visible parity substeps landed
  - the final explicit carpet-plus-generic-underlay probe closed as a negative
    guard
  - the reinforced-concrete formula-vs-family ownership matrix is now pinned in
    executable tests
  - no seventh defended parity widening remains proven
  - blocked branches stayed blocked
- selected next tightening direction:
  `dataholz_clt_calibration_tightening`
- closed but still guarded candidate:
  `reinforced_concrete_accuracy_tightening_follow_up_v1`
- why Dataholz CLT moves up now:
  - reinforced-concrete overlap and solver-side honesty risk are now explicitly
    closed
  - the defended CLT exact/estimate corridor is already benchmarked and
    source-truth pinned
  - the only remaining exact-only CLT slack is `GDMTXA04A`, which stays a
    blocked material-surface decision rather than a reason to delay CLT
    calibration work
  - blocked source-family widening still has lower ROI than tightening the
    defended CLT corridor next
- why reinforced-concrete does not stay active:
  - the corridor is now intentionally frozen on the low-confidence branch
    without a hidden helper overlap
  - remaining work there is no longer the best next runtime return
- no runtime or numeric calculator behavior changed in the closeout selection
  itself

## Current Position

- latest committed checkpoint:
  `CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md`
- latest closed implementation slice:
  `wall_preset_expansion_v1`
- closed planning action in this pass:
  `post_wall_preset_expansion_v1_next_slice_selection_v1`
- preset-expansion cut landed:
  three new benchmark-backed wall presets (`aac_single_leaf_wall`,
  `masonry_brick_wall`, `clt_wall`) pinned canonical Rw values under lab /
  field / building contexts with no engine runtime change; the previous
  `concrete_wall` preset now shares the preset surface with three
  additional defendable wall types
- selected next implementation slice:
  `wall_reorder_output_set_consistency_v1`
- slice type:
  runtime tightening on the engine airborne C derivation to make the
  supported output set order-invariant on physically-equivalent asymmetric
  light-heavy wall stacks
- implementation status:
  selected and not started; the preset expansion surfaced a real but
  deferred bug — same four materials in reversed order give identical Rw
  but different `supportedOutputs` (C missing vs C live). Investigation
  anchors: `dynamic-airborne.ts`, `estimate-rw.ts`. User-trust
  implication: moving a layer in the workbench UI should not change which
  outputs the user sees.
- explicit not-done item at this checkpoint:
  the reorder consistency fix has not been started; a wall reorder
  invariance test matrix must land first to pin the current inconsistency,
  then the engine fix, then a passing matrix. No wall corridor guard test
  may regress during the fix.

## Selected Next Slice

- slice id:
  `dataholz_clt_calibration_tightening` (second pass)
- workstream:
  `defended_clt_calibration_tightening`
- route family:
  `mass_timber_clt_floor_lane`
- output surface:
  `dataholz_clt_calibration_tightening_matrix`
- engine companion surface:
  `dataholz_clt_calibration_tightening_audit`
- behavior class:
  runtime tightening inside the already-defended Dataholz CLT
  exact-vs-estimate corridor, without treating visible `GDMTXA04A` rows as a
  direct exact reopen

### Scope

- tighten exact-vs-estimate and capped-visible boundaries on the defended
  Dataholz CLT mass-timber floor lane, starting from the landed source-truth
  and calibration audits
- preserve every upstream closeout: reinforced-concrete low-confidence,
  raw terminal-concrete helper, CLT-local combined evidence, broad
  audit/replanning, wall-selector, raw bare open-box/open-web, `C11c`
  readiness, and `GDMTXA04A` composite-surface design all stay frozen
- keep `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
  fail-closed; do not reopen them by proximity to CLT work
- close this slice with an explicit planning contract that either declares
  the remaining Dataholz CLT slack fully bounded or selects exactly one more
  same-family tightening cut

### Closeout Selection Result

Selected now:

- `dataholz_clt_calibration_tightening` (second pass)
  - posture: selected after the reinforced-concrete accuracy reopen closed
    cleanly on the bounded low-confidence corridor
  - reason: the reinforced-concrete low-confidence corridor is now explicitly
    closed, the defended CLT exact/estimate corridor is already benchmarked
    and source-truth pinned, and CLT has higher ROI than another reinforced
    micro-pass or any blocked source-family reopen
  - selection evidence:
    `packages/engine/src/post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts`

Conditionally reopen only if new proof appears:

- `reinforced_concrete_accuracy_reopen`
  - posture: closed as explicit low-confidence closeout input, not active
  - reason: no fourth defended boundary remained after matrix/provenance and
    audit/report surfaces pinned the bounded low-confidence corridor

Still blocked:

- `dataholz_gdmtxa04a_visible_exact_reopen`
  - blocked until the composite dry-screed surface is modeled honestly, not
    just matched on direct id
- `tuas_c11c_exact_import`
  - blocked until the frequency/source anomaly is explained
- `raw_bare_open_box_open_web_impact_widening`
  - blocked until bare-carrier impact source evidence exists
- `wall_selector_behavior_widening`
  - blocked until a fresh classified wall-selector red exists

### Current Implementation Anchors

- selection planning contract:
  `packages/engine/src/post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts`
- prior first-pass CLT closeout (frozen evidence):
  `packages/engine/src/post-dataholz-clt-calibration-tightening-next-slice-selection-contract.test.ts`
- defended CLT evidence:
  - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
  - `packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts`
  - `packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts`
  - `packages/engine/src/floor-source-corpus-contract.test.ts`
  - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
- runtime edit anchors for this tightening slice:
  - `packages/engine/src/predictor-published-family-estimate.ts`
  - `packages/engine/src/predictor-floor-system-estimate.ts`
  - `packages/engine/src/floor-system-estimate.ts`
  - `packages/engine/src/calculate-assembly.ts`
- closed reinforced-concrete guard evidence (stays frozen):
  - `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts`
  - `packages/engine/src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts`
  - `packages/engine/src/reinforced-concrete-low-confidence-follow-up-origin-matrix.test.ts`
  - `apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts`
- closed upstream slice evidence (stays frozen):
  - `packages/engine/src/raw-terminal-concrete-helper-widening-matrix.test.ts`
  - `packages/engine/src/clt-local-combined-interaction-evidence-matrix.test.ts`
  - `packages/engine/src/clt-local-combined-exact-anchor-pack.test.ts`
- likely next planning contract (to be authored by this slice):
  a `post_dataholz_clt_calibration_tightening_next_slice_selection` successor
  contract that either declares the remaining CLT slack fully bounded or
  selects exactly one more same-family tightening cut
- focused gate entrypoint:
  `tools/dev/run-calculator-current-gate.ts`
- source-backed boundary ledger:
  `docs/calculator/SOURCE_GAP_LEDGER.md`

### Current Tightening Audit Map

Use this map before touching runtime logic. It separates what is already
landed as first-pass CLT evidence, what stays frozen as upstream closeout
input, and what remains fail-closed during the second-pass tightening.

1. First-pass CLT evidence already landed (baseline)
   - `dataholz-clt-source-truth-audit`: exact-vs-estimate and
     exact-visible-vs-estimate-only source truth pinned on the active
     mass-timber lane
   - `dataholz-clt-calibration-tightening-audit`: visible `GDMTXA04A`
     estimate boundary capped against the direct official exact row on
     `Ln,w`, `CI`, `CI,50-2500`, and `Ln,w+CI`
   - workbench: `dataholz-clt-source-truth-route` keeps the same surfaces
     honest on the card/route side
2. Upstream closeouts kept frozen during pass 2
   - reinforced-concrete low-confidence corridor closed on
     `reinforced-concrete-formula-family-closeout-audit` and
     `reinforced-concrete-family-formula-fit-audit`
   - raw terminal-concrete helper lane closed across widening, split
     topology, and partial order matrices and their
     provenance/card-origin pairs
   - CLT-local combined interaction evidence closed on the triad matrix
     plus the remaining exact-anchor pack
   - broad audit / replanning, wall-selector, raw bare open-box/open-web,
     `C11c` readiness, and `GDMTXA04A` composite-surface design all
     closed as fail-closed evidence
3. Fail-closed runtime candidates (must stay blocked during pass 2)
   - `dataholz_gdmtxa04a_visible_exact_reopen`
   - `tuas_c11c_exact_import`
   - `raw_bare_open_box_open_web_impact_widening`
   - `wall_selector_behavior_widening`
4. Hard-stop rules during this tightening pass
   - do not reopen any blocked candidate by proximity to CLT work
   - do not treat nearby green tests as proof of a direct exact reopen
   - do not blur exact, bound, family, formula, or low-confidence
     ownership to make the CLT surface look cleaner than it is
   - do not silently widen support semantics on the workbench CLT route

### Latest Parity Audit Conclusion - 2026-04-17

The current re-read of the reinforced-concrete corridor still does not prove a
seventh defended parity widening.

- confirmed still-defended and already landed:
  - wet ceramic-tile + elastic gypsum ceiling
  - wet ceramic-tile + rigid gypsum ceiling
  - visible-stack `generic_gypsum_board` parity on the same bounded gypsum
    corridor
  - `fire_board` alias parity on defended concrete firestop-board archetype
    inputs
  - split `engineered_timber_flooring + generic resilient underlay` parity on
    the defended timber-underlay archetype lane
- explicitly rechecked and still not safe to widen from nearby green tests
  alone:
  - split carpet/soft-cover plus generic underlay concrete inputs
  - there is no current runtime canonicalization or visible-stack topology rule
    that proves those split inputs are the same physical system as the bounded
    carpet archetype lane
  - treat those cases as unproven, not as missed parity fixes
- final explicit defended-equivalence probe now completed:
  - canonical concrete carpet inputs still stay on the bounded
    `knauf_cc60_1a_concrete150_carpet_lab_2026` archetype lane
  - adding an extra generic resilient underlay does not preserve that
    equivalence
  - the route falls back to the bare-floor impact formula and only keeps the
    heavy-concrete airborne companion estimate
  - this is now pinned in:
    - `packages/engine/src/impact-heavy-floor-planned-scope-benchmark.test.ts`
    - `packages/engine/src/calculate-impact-only.test.ts`
    - `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`
- planning consequence:
  - the heavy-concrete widening is now closed
  - keep the parity queue shut unless a new already-proven equivalent
    representation appears later
  - use the closed audit as the entry point for reinforced-concrete accuracy
    tightening instead of inventing a new corridor

### Direction Correctness Checklist

Every next widening/parity step must pass this checklist before code changes
are kept.

1. There is already a stronger defended lane for the same physical system.
   - if the system does not already own an exact/family lane, a formula or
     low-confidence result is not automatically wrong
2. The alternative representation is proven equivalent by runtime
   canonicalization, visible-stack derivation, or source-backed topology rules.
   - examples already landed:
     `fire_board -> firestop_board`,
     `engineered_timber_flooring + generic underlay -> engineered_timber_with_acoustic_underlay`,
     `generic_gypsum_board -> bounded gypsum ceiling corridor`
3. The patch stays inside the currently selected Dataholz CLT corridor.
   - no new source family, no reinforced-concrete/open-web/open-box/
     wall-selector widening, and no reopening blocked anomalies
     (`GDMTXA04A`, `C11c`, raw bare, wall-selector)
4. The patch does not overclaim supported outputs.
   - if `DeltaLw`, `CI`, field continuations, or companion airborne outputs are
     not owned by the stronger lane, they remain formula-owned or unsupported
5. The route is pinned in tests before and after the change.
   - benchmark basis
   - candidate ids
   - support buckets
   - main-route regression on `calculate-impact-only` and `calculate-assembly`
6. If any of the above is ambiguous, stop and keep the branch on its current
   formula or low-confidence posture.

### Execution Plan For This Slice

1. Freeze every upstream closeout as entry contracts for pass 2.
   - reinforced-concrete low-confidence:
     keep
     `packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts`,
     `packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts`,
     `packages/engine/src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts`,
     and
     `packages/engine/src/reinforced-concrete-low-confidence-follow-up-origin-matrix.test.ts`
     green so the closed low-confidence corridor does not silently reopen
   - raw terminal-concrete helper:
     keep the widening, split-topology, and partial-order matrices plus
     their provenance/card-origin pairs green
   - CLT-local combined evidence:
     keep
     `packages/engine/src/clt-local-combined-interaction-evidence-matrix.test.ts`
     and
     `packages/engine/src/clt-local-combined-exact-anchor-pack.test.ts`
     green
   - blocked source families:
     keep the closed `GDMTXA04A`, `C11c`, raw bare, and wall-selector
     fail-closed posture unchanged
2. Start from the pass 1 Dataholz CLT baseline already landed on this repo.
   - treat
     `packages/engine/src/dataholz-clt-source-truth-audit.test.ts` and
     `packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts`
     as the baseline to tighten from, not as a reason to reopen the corridor
   - use
     `packages/engine/src/predictor-published-family-estimate.ts`,
     `packages/engine/src/predictor-floor-system-estimate.ts`,
     `packages/engine/src/floor-system-estimate.ts`, and
     `packages/engine/src/calculate-assembly.ts` as the primary runtime edit
     anchors for any pass 2 numerical tightening
   - do not treat visible `GDMTXA04A` rows as a direct exact reopen, and do
     not drift into reinforced-concrete, raw open-box/open-web, `C11c`,
     selector behavior, or parity probes
3. Keep exact-vs-estimate provenance explicit while tightening.
   - preserve exact-vs-family wording on engine and workbench surfaces
   - keep
     `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
     green without broadening support semantics
4. Close pass 2 with an explicit planning contract.
   - land a successor `post_dataholz_clt_calibration_tightening_next_slice_selection`
     contract that either declares the remaining CLT slack fully bounded or
     selects exactly one more same-family tightening cut
   - update the planning contract only after any tightening edits land
   - keep `pnpm calculator:gate:current` green throughout
   - rerun the broad repo gate (`pnpm check`) before calling the slice
     closed

### Tightening Queue

Pass 2 only works through these in order; each step must stay inside the
already-defended Dataholz CLT corridor.

1. Remaining exact-vs-estimate slack audit
   - re-read the landed
     `packages/engine/src/dataholz-clt-source-truth-audit.test.ts` and
     `packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts`
   - identify any remaining exact-vs-estimate or exact-vs-family wording
     slack that is still defendable without reopening visible `GDMTXA04A`
     direct exact matching
2. Capped-visible boundary recheck
   - re-read the capped visible `GDMTXA04A`-like dry-screed estimate route
     against the direct official exact row for `Ln,w`, `CI`, `CI,50-2500`,
     and `Ln,w+CI`
   - confirm the `L'nT,50` companion path and any other capped-visible
     outputs stay explicit on the estimate side
3. Workbench/source carry-through audit
   - confirm
     `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
     still reflects the tightened boundaries without broadening support
     semantics
4. Slice-close decision audit
   - decide whether the remaining CLT slack is fully bounded (close pass 2
     with a "no further tightening defendable" planning contract) or
     whether one more same-family cut is defendable (author that cut as
     part of pass 2, then close with a planning contract that names it)

### Queue Status Right Now

1. Dataholz CLT tightening queue (pass 2)
   - current status: selected and not started
   - first pass already landed the source-truth audit, the calibration
     tightening audit (visible `GDMTXA04A`-like dry-screed caps on `Ln,w`,
     `CI`, `CI,50-2500`, and `Ln,w+CI`), and the workbench source-truth
     route
   - pass 2 must tighten any remaining exact-vs-estimate slack without
     reopening visible `GDMTXA04A` direct exact matching
2. Reinforced-concrete closeout queue
   - current status: closed as explicit low-confidence closeout evidence
   - reopen only if a new helper-vs-solver overlap or proof-backed
     equivalent lane appears later
3. Raw terminal-concrete helper queue
   - current status: closed across widening, split-topology, and
     partial-order matrices plus their provenance/card-origin pairs
   - reopen only if a future trace shows another defended helper topology
     that is not already pinned
4. CLT-local combined interaction queue
   - current status: closed on the triad matrix and remaining exact-anchor
     pack
   - reopen only if a new exact or predictor-backed local combined row
     appears later
5. Blocked source-anomaly queue
   - current status: closed as explicit fail-closed evidence after the
     refresh contract kept the order unchanged
   - order still explicit:
     `GDMTXA04A`, `C11c`, raw bare open-box/open-web, wall-selector
   - all four stay blocked until genuinely new evidence appears

### Step Transition Rule

1. Start with the landed CLT source-truth and calibration audits, not with
   a runtime code change.
2. Propose a tightening cut only if all of the following are true:
   - the targeted slack is already visible in the existing audits or can be
     pinned in a new audit without reopening the corridor
   - the tightening does not touch visible `GDMTXA04A` direct exact matching
   - the tightening does not silently widen support semantics on any
     engine or workbench surface
   - the tightening does not reopen reinforced-concrete, raw-helper,
     CLT-local, or any blocked source-family closeout
3. If any one of those checks fails, keep the branch on its current
   capped-visible or estimate posture.
4. End pass 2 only when exactly one of the following is explicit:
   - the remaining CLT slack is declared fully bounded in a successor
     planning contract, or
   - exactly one more same-family tightening cut has landed and been
     closed with its own planning contract

### Execution Loop From Here

1. Re-read the already-landed first-pass CLT evidence to map the remaining
   slack:
   - `packages/engine/src/dataholz-clt-source-truth-audit.test.ts`
   - `packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts`
   - `apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts`
2. Enumerate every remaining exact-vs-estimate or capped-visible wording
   slack inside the defended corridor; reject any slack whose tightening
   would require reopening visible `GDMTXA04A` direct exact matching or
   broadening support semantics.
3. If no remaining slack is defendable, skip to step 7 and close pass 2
   with a "no further tightening defendable" planning contract.
4. Otherwise, pick exactly one same-family tightening cut. Land the
   smallest runtime edit that tightens that slack. Runtime anchors:
   - `packages/engine/src/predictor-published-family-estimate.ts`
   - `packages/engine/src/predictor-floor-system-estimate.ts`
   - `packages/engine/src/floor-system-estimate.ts`
   - `packages/engine/src/calculate-assembly.ts`
5. Land or update the engine audit test that pins the tightened boundary
   on the defended mass-timber lane; land or update the workbench route
   test if the tightening surfaces to the card/route side.
6. Run the targeted engine/web pack plus `pnpm calculator:gate:current` and
   `pnpm check`; reject the cut if any previously green corridor regresses
   or any upstream closeout loosens.
7. Land a successor
   `post_dataholz_clt_calibration_tightening_next_slice_selection`
   contract. The contract must record whether the slack is now fully
   bounded, what evidence supports that conclusion, and which slice is
   selected next.
8. Update `NEXT_IMPLEMENTATION_PLAN.md` and `CURRENT_STATE.md` to reflect
   the new closed slice and the new selected next slice.
9. Stop pass 2 when exactly one of step 3 or step 7 has landed cleanly.

### Validation Commands For This Checkpoint

1. `pnpm --filter @dynecho/engine exec vitest run src/post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts src/post-dataholz-clt-calibration-tightening-next-slice-selection-contract.test.ts src/dataholz-clt-source-truth-audit.test.ts src/dataholz-clt-calibration-tightening-audit.test.ts src/dataholz-gdmtxa04a-material-surface-recheck.test.ts src/floor-source-corpus-contract.test.ts --maxWorkers=1`
2. `pnpm --filter @dynecho/web exec vitest run features/workbench/dataholz-clt-source-truth-route.test.ts --maxWorkers=1`
3. `pnpm calculator:gate:current`
4. `pnpm check`
5. `pnpm build`
6. `git diff --check`

### Slice Stop Conditions

- stop if the tightening quietly widens runtime behavior instead of only
  tightening the already-defended corridor
- stop if exact, catalog, product-delta, lower-bound, family, formula, or
  low-confidence ownership is blurred to make the result look cleaner
- stop if field/report/provenance surfaces become less explicit about answer
  origin
- stop if `GDMTXA04A`, `C11c`, raw bare open-box/open-web, or wall-selector
  behavior is implicitly reopened by the same change
- stop if any upstream closeout (reinforced-concrete, raw-helper, CLT-local,
  blocked-source refresh) loosens in the process
- stop if the tightening lands without a successor planning contract that
  names the next slice

## Explicitly Deferred Until This Tightening Closes

- direct raw bare open-box/open-web impact widening
- direct Dataholz `GDMTXA04A` visible exact reopen
- direct TUAS `C11c` exact import
- direct wall-selector behavior widening
- direct reinforced-concrete reopening
- any new raw-helper or CLT-local widening slice

## Provisional Next Phase Order

This order is provisional and should be revalidated when the active slice
closes, but it is the current safest program sequence.

1. `dataholz_clt_calibration_tightening`
   - selected now as the defended runtime tightening slice after the
     reinforced-concrete closeout landed cleanly
2. `reinforced_concrete_accuracy_reopen`
   - now closed as explicit low-confidence closeout input, not as an active
     reopening lane
3. `clt_local_combined_interaction_evidence_v1`
   - now closed as explicit program evidence, not as an active widening lane
4. blocked-source reopen candidates
   - raw bare open-box/open-web, `GDMTXA04A`, `C11c`, and wall-selector work
     remain fail-closed until their evidence posture genuinely changes

## ROI-Ranked Order From Here

Use this order when choosing the next implementation action. The point is not
just “what is technically next”, but “what buys the most defended progress per
unit of risk and engineering time”.

1. `dataholz_clt_calibration_tightening`
   - ROI: high
   - why:
     - the Dataholz CLT source-truth and calibration corridor is already
       benchmark-backed, source-pinned, and route-visible on both engine and
       workbench surfaces
     - the reinforced-concrete low-confidence corridor is now explicitly
       closed, so the next defended tightening return sits inside CLT rather
       than in another concrete micro-pass
2. `reinforced_concrete_accuracy_reopen`
   - ROI: conditional / closed
   - why:
     - the low-confidence corridor is now explicit and frozen as closeout
       evidence
     - reopen it only if genuinely new same-family proof appears later
3. blocked-source reopen candidates only if new proof appears
   - ROI: conditional / next
   - why:
     - every blocked-source family is already explicitly fail-closed
     - no blocked candidate should be reopened before a genuinely new
       evidence change appears
4. Reopen `GDMTXA04A` or another closed corridor only if a new proof-backed
   equivalence appears
   - ROI: conditional / opportunistic
   - why:
     - those boundaries are intentionally closed rather than forgotten
     - reopen them only if canonicalization, visible-stack derivation, or a
       source-backed material/topology rule changes

## Decision Gates From Here

This is the mechanical sequence from the current checkpoint.

1. Keep every upstream closeout frozen: reinforced-concrete low-confidence,
   raw terminal-concrete helper (widening, split-topology, partial-order),
   CLT-local combined evidence, broad audit / replanning, wall-selector,
   raw bare open-box/open-web, `C11c` readiness, and `GDMTXA04A`
   composite-surface design all stay closed as fail-closed or frozen
   evidence.
2. Keep the direct `GDMTXA04A` exact row plus the defended visible estimate
   boundary frozen as the current truth surfaces; no direct exact reopen.
3. Re-read the already-landed first-pass CLT audits
   (`dataholz-clt-source-truth-audit`,
   `dataholz-clt-calibration-tightening-audit`) as the baseline for pass 2.
4. Enumerate every remaining exact-vs-estimate or capped-visible wording
   slack inside the defended Dataholz CLT corridor.
5. Either close pass 2 with a "no further tightening defendable" planning
   contract, or pick exactly one same-family tightening cut, land the
   smallest runtime edit that tightens that slack, and pin the tightened
   boundary in an engine audit (and workbench route test if it surfaces
   there).
6. Land a successor
   `post_dataholz_clt_calibration_tightening_next_slice_selection`
   planning contract that names the next selected slice explicitly.
7. Keep `GDMTXA04A`, `C11c`, raw bare open-box/open-web, and wall-selector
   fail-closed unless fresh evidence explicitly reorders them.

## Immediate Next Steps

1. Keep this file as the authoritative immediate plan until the
   second-pass `dataholz_clt_calibration_tightening` is explicitly closed
   or superseded by a successor planning contract.
2. Treat every upstream closeout as closed and frozen (reinforced-concrete
   follow-up, raw terminal-concrete helper, CLT-local combined evidence,
   broad audit / replanning, wall-selector, raw bare, `C11c` readiness,
   `GDMTXA04A` composite-surface design, blocked-source refresh).
3. Keep the blocked runtime-candidate posture explicit:
   `GDMTXA04A`, `C11c`, raw bare open-box/open-web, wall-selector.
4. Re-read the first-pass CLT source-truth and calibration audits and
   enumerate every remaining defendable exact-vs-estimate or capped-visible
   wording slack.
5. Either close pass 2 with a "no further tightening defendable" planning
   contract, or land exactly one more same-family tightening cut and close
   with a planning contract that names the new selected slice.
6. Keep the focused current gate aligned with the landed
   `post-reinforced-concrete-accuracy-reopen` closeout selection contract
   while pass 2 is active; carry pass 2 audit evidence into the gate as it
   lands.
7. Update [CURRENT_STATE.md](./CURRENT_STATE.md), the relevant
   checkpoint/handoff note, and [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)
   together whenever pass 2 lands evidence or the selected next slice
   moves.
8. Do not reopen reinforced-concrete, heavy-concrete parity, raw-helper,
   CLT-local, `GDMTXA04A`, `C11c`, raw open-box/open-web, or wall-selector
   work unless pass 2 produces an explicit defended reopen candidate or a
   later contract reorders them.
