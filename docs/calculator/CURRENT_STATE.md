# Dynamic Calculator Current State

Document role: short-lived snapshot of what is stable **right
now** on the calculator surface. If you need "how did we get
here" read the latest checkpoint named below before older handoffs.
If you need the strategic plan read [MASTER_PLAN.md](./MASTER_PLAN.md).
If you need the tactical detail on the active slice read
[NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md). If you
need the private-use readiness chain read
[PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md).

---

## Revalidated Snapshot

Last revalidation cycle: `2026-04-27`
(`realistic_layer_combination_coverage_cartography_v1` Gate A landed;
heavy-core/concrete Gate B closed no-runtime; timber stud + CLT wall
accuracy pass Gate A landed no-runtime; broad validation remains green
from the heavy-core closeout run;
latest checkpoint:
[CHECKPOINT_2026-04-27_WALL_TIMBER_STUD_CLT_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-27_WALL_TIMBER_STUD_CLT_GATE_A_HANDOFF.md)).
Step 8 closed the calculator runtime audit: `MASTER_PLAN.md` §3/§8
was reconciled to implementation reality, `coverage-grid-consistency.test.ts`
now maps the grid and C1-C6 signals to executable evidence, the
focused calculator gate includes the final-audit tests, and
`POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md` opens productization. The
first four productization slices then closed server-backed project
storage v1, project/proposal route authorization, auth-session
hardening, and the pure team-access policy model.

- **Engine broad suite**: latest broad `pnpm check` on 2026-04-27 was
  223 / 223 files, 1232 / 1232 tests green
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
  under the Vitest worker timeout; Gate B and Gate C then added focused
  planning/value contract files).
- **Web broad suite**: latest broad `pnpm check` on 2026-04-27 kept
  all 150 / 150 files in scope through `tools/dev/run-web-vitest.ts`:
  864 / 864 tests green + 18 discovery helpers intentionally skipped.
  The runner isolates six long route-scan files and batches the
  remaining 144 files, preserving coverage while avoiding Vitest worker
  RPC timeout failures on the heavy family-boundary scans.
  The 2026-04-23
  productization pass added focused server project storage/API,
  proposal-audit, route-authorization, auth-session, login/logout,
  server project restore snapshot, and project access policy tests. The
  2026-04-24 broad revalidation also hardened the side-count Gate A
  input contract so it asserts parse behavior instead of calling
  `.keyof()` on the exported shared `AirborneContextSchema` `ZodType`.
- **Broad `pnpm check`**: lint + typecheck + tests + build green on the
  latest broad run after heavy-core/concrete Gate B no-runtime closeout
  and timber+CLT next-slice selection; build still emits
  the known non-fatal optional `sharp/@img` warnings through
  `@turbodocx/html-to-docx`.
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
  `wall-resilient-bar-side-count-input-contract.test.ts`, plus
  `post-wall-resilient-side-count-gate-b-v1-next-slice-selection-contract.test.ts`
  and
  `post-wall-resilient-side-count-gate-c-v1-next-slice-selection-contract.test.ts`
  for the Gate B/Gate C closeout and next-slice contracts, plus the new
  floor continuation Gate A surfaces:
  `floor-field-continuation-gate-a-matrix.test.ts` and
  `floor-field-continuation-gate-a-card-matrix.test.ts`, plus
  `post-floor-field-continuation-gate-c-v1-next-slice-selection-contract.test.ts`
  for the closeout and next-slice selection, plus the new floor
  many-layer Gate A surfaces:
  `floor-many-layer-stress-gate-a-matrix.test.ts` and
  `floor-many-layer-stress-gate-a-card-matrix.test.ts`, plus
  `post-floor-many-layer-gate-c-v1-next-slice-selection-contract.test.ts`
  for the closeout and next-slice selection, plus the new floor
  layer-order Gate A surfaces:
  `floor-layer-order-edit-stability-gate-a-matrix.test.ts` and
  `floor-layer-order-edit-stability-gate-a-card-matrix.test.ts`, plus
  `post-floor-layer-order-gate-c-v1-next-slice-selection-contract.test.ts`
  for the no-runtime closeout and invalid-thickness guard selection, plus
  `all-caller-invalid-thickness-guard-gate-a-matrix.test.ts` for direct
  floor/wall invalid-thickness caller coverage, plus
  `post-all-caller-invalid-thickness-gate-c-v1-next-slice-selection-contract.test.ts`
  for the closeout and dynamic-airborne split v2 selection, plus
  `dynamic-airborne-split-v2-gate-b-eleventh-carve-contract.test.ts`
  for the v2 Gate B eleventh-carve contract, plus
  `post-dynamic-airborne-split-refactor-v2-gate-c-next-slice-selection-contract.test.ts`
  for the Gate C closeout and realistic layer-combination cartography
  selection, plus
  `realistic-layer-combination-coverage-cartography.test.ts` for the
  active slice Gate A matrix, plus
  `wall-heavy-core-concrete-gate-b-audit-contract.test.ts` for the
  first no-runtime Gate B heavy-core/concrete audit contract, plus
  `post-wall-heavy-core-concrete-gate-b-next-slice-selection-contract.test.ts`
  for the no-runtime closeout and timber+CLT next-slice selection, plus
  `wall-timber-stud-clt-gate-a-audit-contract.test.ts` for the active
  slice no-runtime Gate A audit and timber-first Gate B selection.
  Latest focused gate run after the timber+CLT Gate A audit contract:
  91 engine files / 416 tests,
  36 web files / 170 passed +
  18 skipped, build 5/5 tasks, whitespace guard clean.

## Active Slice

`wall_timber_stud_clt_accuracy_pass_v1` (calculator wall accuracy,
active). Planning surface:
[SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md](./SLICE_WALL_TIMBER_STUD_CLT_ACCURACY_PASS_PLAN.md).

The previous cartography Gate A landed no-runtime in
`packages/engine/src/realistic-layer-combination-coverage-cartography.test.ts`.
The matrix executes 29 representative floor/wall cells, pins output
support, origin/basis, confidence posture, invariants, and candidate
type, and selects `wall.concrete_heavy_core_screening.field` as the
highest-ROI runtime candidate. No new paired web matrix was added
because the selected cells already point at existing card/route evidence
or engine-only stress artifacts.
The 2026-04-27 plan/implementation reconciliation confirmed that this
Gate B did not change runtime code. The no-runtime audit contract
`packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts`
now pins the generated `wall-screening-concrete` candidate as
screening-tier, `lined_massive_wall`, with field `R'w = 55` and
supported `R'w` / `Dn,w` / `DnT,w` / `DnT,A`. The same contract now
also pins the verified-catalog non-match, lab-fallback non-match, local
formula components, and the blocker: no source row or
topology-specific tolerance exists for the selected concrete lining
stack. The closeout contract keeps the lane screening and selects
`wall_timber_stud_clt_accuracy_pass_v1`.

Gate A for `wall_timber_stud_clt_accuracy_pass_v1` has now landed
no-runtime in
`packages/engine/src/wall-timber-stud-clt-gate-a-audit-contract.test.ts`.
It pins generated `wall-timber-stud` at lab `Rw=50`, field `R'w=42`,
low-confidence `stud_wall_system`, with no verified exact,
lab-fallback, or landed exact timber row topology match. It pins
generated `wall-clt-local` at lab `Rw=42`, field `R'w=41`,
medium-confidence `laminated_single_leaf`, with no verified exact,
lab-fallback, or floor-system/source truth import. The next bounded
implementation step is Gate B for `wall.timber_stud_formula.field`:
write the timber-stud runtime/source contract first, then change math
only if a named source row, documented formula-owned timber rule, or
bounded family rule supports it.

Personal-use readiness is now explicitly tracked in
[PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md).
The current priority chain is timber stud + CLT wall accuracy, floor
fallback/low-confidence cleanup, then UI/input/output honesty.
Productization remains deferred until this calculator readiness chain
closes or priority explicitly changes.

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
The just-closed invalid-thickness slice landed without runtime change:
`packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts`
pins direct wall lab, wall field, explicit-role floor field, and raw
floor pre-inference callers across `0`, negative, `NaN`, `Infinity`, and
non-numeric runtime thickness values. The matrix found no crash,
non-finite output, support/card mismatch, unsupported live leakage, or
defended-looking invalid answer, so Gate B was not required. Gate C then
updated the master grid and coverage-grid contract, moving engine
thickness validity out of partial. Gate A of
`dynamic_airborne_split_refactor_v2` then inventoried the remaining
`dynamic-airborne.ts` floor/cap guard call graph without runtime
changes. Gate B first carve added `DynamicAirborneComposer`, created
`dynamic-airborne-correction-guards.ts`, and moved
`applyMicroGapFillEquivalenceGuard` with the composer injected. Gate B
second carve moved `applyHeavyUnframedCavityScreeningCap` into the same
module. Gate B third carve moved
`applyMixedSecurityBoardDoubleStudFieldTrim`. Gate B fourth carve moved
`applyHighFillSingleBoardStudFieldLift`. Gate B fifth carve moved
`applyMixedBoardEmptyCavityFieldMidbandLift`. Gate B sixth carve moved
`applyMixedPremiumSplitFieldLift`. Gate B seventh carve moved
`applyDiamondHybridResilientFieldMidbandTrim`. Gate B eighth carve moved
`applyMixedPlainModerateSingleBoardLabTemplate`. Gate B ninth carve
moved `applyPremiumSingleBoardFieldCorrection`. Gate B tenth carve moved
`applySingleLeafMasonryMonotonicFloor` with `DynamicAirborneComposer`
injection. Gate B eleventh carve moved
`applyNarrowHeavyDoubleLeafGapCap` with `DynamicAirborneComposer`
injection. Gate C then closed after broad validation because
`dynamic-airborne.ts` is below 2000 lines. The active next decision is
now timber-stud Gate B inside the timber stud + CLT wall accuracy pass.

Checkpoint refinement `2026-04-24`: the post-commit baseline was
re-read against implementation and revalidated before Gate A. No drift
was found between `AGENTS.md`, `NEXT_IMPLEMENTATION_PLAN.md`,
`MASTER_PLAN.md`, `CURRENT_STATE.md`, `coverage-grid-consistency.test.ts`,
and the active slice plan. `pnpm calculator:gate:current`, broad
`pnpm check`, and post-build web typecheck were green at that baseline.
Gate A then added the all-caller invalid-thickness matrix, broad
`pnpm check` stayed green, and Gate C selected
`dynamic_airborne_split_refactor_v2` because the remaining source-family
gaps are blocked or optional while C6 architecture hygiene still has a
3152-line `dynamic-airborne.ts` deferral.

Implementation refinement `2026-04-24` (dynamic-airborne split v2
Gate A): the no-runtime inventory pinned the original 14 top-level
`apply*` guards in `packages/engine/src/dynamic-airborne.ts` before the
first carve. The source was 3152 physical lines. Six guards called
`calculateDynamicAirborneResult`
directly on variant/equivalent stacks:
`applySingleLeafMasonryMonotonicFloor`,
`applyNarrowHeavyDoubleLeafGapCap`,
`applyLinedMassiveMasonryMonotonicFloor`,
`applyFramedReinforcementMonotonicFloor`,
`applyMicroGapFillEquivalenceGuard`, and
`applyAmbiguousFamilyBoundaryHold`. Eight guards are non-recursive
corrections. Gate A selected `applyMicroGapFillEquivalenceGuard` as the
smallest recursive first carve into
`dynamic-airborne-correction-guards.ts` with an injected
`DynamicAirborneComposer`. Runtime code was not moved in Gate A.

Implementation refinement `2026-04-24` (dynamic-airborne split v2
Gate B first carve): the first-carve contract pinned the initial
mechanical move and was later superseded by the second-carve contract.
`DynamicAirborneComposer` lives in `dynamic-airborne-helpers.ts`;
`applyMicroGapFillEquivalenceGuard` lives in
`dynamic-airborne-correction-guards.ts` and calls `composer(...)`
instead of importing the composer. `dynamic-airborne.ts` imports the
moved guard and passes `calculateDynamicAirborneResult` at the existing
call site.

Implementation refinement `2026-04-24` (dynamic-airborne split v2
Gate B second carve): `packages/engine/src/dynamic-airborne-split-v2-gate-b-second-carve-contract.test.ts`
now pins the second mechanical carve. `applyHeavyUnframedCavityScreeningCap`
also lives in `dynamic-airborne-correction-guards.ts`; it stayed
non-recursive and does not take a composer parameter. The composer file
is down to 2950 lines with 12 in-file guards and five remaining direct
recursive composer guards. Next carve:
`applyMixedSecurityBoardDoubleStudFieldTrim`.

Implementation refinement `2026-04-24` (dynamic-airborne split v2
Gate B third carve): `packages/engine/src/dynamic-airborne-split-v2-gate-b-third-carve-contract.test.ts`
now pins the third mechanical carve. `applyMixedSecurityBoardDoubleStudFieldTrim`
also lives in `dynamic-airborne-correction-guards.ts`; it stayed
non-recursive and does not take a composer parameter. The composer file
is down to 2880 lines with 11 in-file guards and five remaining direct
recursive composer guards. Next carve:
`applyHighFillSingleBoardStudFieldLift`.

Implementation refinement `2026-04-24` (dynamic-airborne split v2
Gate B fourth carve): `packages/engine/src/dynamic-airborne-split-v2-gate-b-fourth-carve-contract.test.ts`
now pins the fourth mechanical carve. `applyHighFillSingleBoardStudFieldLift`
also lives in `dynamic-airborne-correction-guards.ts`; it stayed
non-recursive and does not take a composer parameter. The composer file
is down to 2808 lines with 10 in-file guards and five remaining direct
recursive composer guards. It was superseded by the fifth-carve
contract. The queued carve at fourth closeout was
`applyMixedBoardEmptyCavityFieldMidbandLift`.

Implementation refinement `2026-04-24` (dynamic-airborne split v2
Gate B fifth carve): `packages/engine/src/dynamic-airborne-split-v2-gate-b-fifth-carve-contract.test.ts`
now pins the fifth mechanical carve.
`applyMixedBoardEmptyCavityFieldMidbandLift` also lives in
`dynamic-airborne-correction-guards.ts`; it stayed non-recursive and
does not take a composer parameter. The composer file is down to 2722
lines with 9 in-file guards and five remaining direct recursive
composer guards. It was superseded by the sixth-carve contract. The
queued carve at fifth closeout was `applyMixedPremiumSplitFieldLift`.

Implementation refinement `2026-04-24` (dynamic-airborne split v2
Gate B sixth carve): `packages/engine/src/dynamic-airborne-split-v2-gate-b-sixth-carve-contract.test.ts`
now pins the sixth mechanical carve. `applyMixedPremiumSplitFieldLift`
also lives in `dynamic-airborne-correction-guards.ts`; it stayed
non-recursive and does not take a composer parameter. The composer file
is down to 2625 lines with 8 in-file guards and five remaining direct
recursive composer guards. It was superseded by the seventh-carve
contract. The queued carve at sixth closeout was
`applyDiamondHybridResilientFieldMidbandTrim`.

Implementation refinement `2026-04-24` (dynamic-airborne split v2
Gate B seventh carve): `packages/engine/src/dynamic-airborne-split-v2-gate-b-seventh-carve-contract.test.ts`
now pins the seventh mechanical carve.
`applyDiamondHybridResilientFieldMidbandTrim` also lives in
`dynamic-airborne-correction-guards.ts`; it stayed non-recursive and
does not take a composer parameter. The composer file is down to 2538
lines with 7 in-file guards and five remaining direct recursive
composer guards. Next carve:
`applyMixedPlainModerateSingleBoardLabTemplate`.

Implementation refinement `2026-04-26` (dynamic-airborne split v2
Gate B eighth carve): `packages/engine/src/dynamic-airborne-split-v2-gate-b-eighth-carve-contract.test.ts`
now pins the eighth mechanical carve.
`applyMixedPlainModerateSingleBoardLabTemplate` also lives in
`dynamic-airborne-correction-guards.ts`; it stayed non-recursive and
does not take a composer parameter. The composer file is down to 2387
lines with 6 in-file guards and five remaining direct recursive
composer guards. Next carve:
`applyPremiumSingleBoardFieldCorrection`.

Implementation refinement `2026-04-26` (dynamic-airborne split v2
Gate B ninth carve): `packages/engine/src/dynamic-airborne-split-v2-gate-b-ninth-carve-contract.test.ts`
now pins the ninth mechanical carve.
`applyPremiumSingleBoardFieldCorrection` also lives in
`dynamic-airborne-correction-guards.ts`; it stayed non-recursive and
does not take a composer parameter. The composer file is down to 2105
lines with 5 in-file guards and five remaining direct recursive
composer guards. Next carve:
`applySingleLeafMasonryMonotonicFloor`.

Implementation refinement `2026-04-26` (dynamic-airborne split v2
Gate B tenth carve): `packages/engine/src/dynamic-airborne-split-v2-gate-b-tenth-carve-contract.test.ts`
now pins the first remaining recursive carve.
`applySingleLeafMasonryMonotonicFloor` also lives in
`dynamic-airborne-correction-guards.ts`; it takes an injected
`DynamicAirborneComposer` for reduced-thickness sibling probes. The
composer file is down to 1952 lines with 4 in-file guards and four
remaining direct recursive composer guards. Next decision: Gate C
closeout after validation, or the next recursive carve
`applyNarrowHeavyDoubleLeafGapCap`.

Implementation refinement `2026-04-26` (dynamic-airborne split v2
Gate B eleventh carve): `packages/engine/src/dynamic-airborne-split-v2-gate-b-eleventh-carve-contract.test.ts`
now pins the narrow-gap recursive cap carve.
`applyNarrowHeavyDoubleLeafGapCap` also lives in
`dynamic-airborne-correction-guards.ts`; it takes an injected
`DynamicAirborneComposer` for contact-equivalent sibling probes. The
composer file is down to 1793 lines with 3 in-file guards and three
remaining direct recursive composer guards. Gate C later closed after
broad validation; `applyLinedMassiveMasonryMonotonicFloor` is optional
future architecture backlog.

General revalidation `2026-04-24` after the seventh carve: focused
`pnpm calculator:gate:current` stayed green, broad `pnpm check` stayed
green (engine 219 / 219 files, 1216 / 1216 tests; web 150 / 150 files,
864 / 864 passed + 18 skipped; build 5/5 with the known non-fatal
`sharp/@img` warnings), and no implementation/plan drift was found.
Gate C was still open at that checkpoint because the active file was
above the C6 threshold. It is now closed after the eleventh carve and
broad validation.

Post-commit checkpoint `2026-04-24`: commit `eba9859` was treated as a
clean stopping point and re-audited. The authority docs still match the
implementation line counts, remaining guard inventory, carved guard
module, recursive composer callers, and current-gate static contract.
`pnpm calculator:gate:current` and broad `pnpm check` are green at this
checkpoint. No new implementation work is required before the eighth
Gate B carve.

Eighth-carve validation `2026-04-26`: targeted eighth-carve contract +
coverage-grid contract passed 2 files / 10 tests. Focused dynamic
airborne / hostile-input behavior sweep passed 13 files / 239 tests.
`pnpm calculator:gate:current` passed with engine 86 files / 396 tests,
web 36 files / 170 passed + 18 skipped, build 5/5, and whitespace guard
clean. The only build warnings were the known non-fatal `sharp/@img`
optional-package warnings. Gate C remains open because
`dynamic-airborne.ts` is still 2387 lines.

Ninth-carve validation `2026-04-26`: targeted ninth-carve contract +
coverage-grid contract passed 2 files / 10 tests. Focused dynamic
airborne / hostile-input behavior sweep passed 13 files / 239 tests.
`pnpm calculator:gate:current` passed with engine 86 files / 396 tests,
web 36 files / 170 passed + 18 skipped, build 5/5, and whitespace guard
clean. The only build warnings were the known non-fatal `sharp/@img`
optional-package warnings. Gate C remains open because
`dynamic-airborne.ts` is still 2105 lines.

Tenth-carve validation `2026-04-26`: targeted tenth-carve contract +
coverage-grid contract passed 2 files / 10 tests. Focused dynamic
airborne / hostile-input behavior sweep passed 13 files / 239 tests.
`pnpm calculator:gate:current` passed with engine 86 files / 396 tests,
web 36 files / 170 passed + 18 skipped, build 5/5, and whitespace guard
clean. The only build warnings were the known non-fatal `sharp/@img`
optional-package warnings. Gate C can now be considered because
`dynamic-airborne.ts` is 1952 lines.

Eleventh-carve validation `2026-04-26`: targeted eleventh-carve
contract + coverage-grid contract passed 2 files / 10 tests. Focused
dynamic airborne / hostile-input behavior sweep passed 13 files /
239 tests. `pnpm calculator:gate:current` passed with engine 86 files /
396 tests, web 36 files / 170 passed + 18 skipped, build 5/5, and
whitespace guard clean. The only build warnings were the known
non-fatal `sharp/@img` optional-package warnings. Gate C can now be
considered because `dynamic-airborne.ts` is 1793 lines.

Gate C closeout `2026-04-26`: `pnpm calculator:gate:current` passed
with 87 engine files / 401 tests, 36 web files / 170 passed + 18
skipped, build 5/5, and whitespace guard clean. Broad `pnpm check`
passed with engine 219 files / 1216 tests, web 150 files / 864 passed +
18 skipped, build 5/5, and only the known non-fatal `sharp/@img`
warnings. C6 is closed,
`post-dynamic-airborne-split-refactor-v2-gate-c-next-slice-selection-contract.test.ts`
pins the closeout, and
`realistic_layer_combination_coverage_cartography_v1` is selected next.

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
rows. At that source-corpus closeout the 5 resilient/proprietary rows
remained benchmark-only, the 2 linked lightweight holdouts remained
holdout-only, and the live timber preset still did not exact-match either
landed direct row.

Implementation refinement `2026-04-23` (side-count slice selection):
the highest-ROI remaining common-wall source gap was explicit resilient
bar side count. At selection time the wall context could express
`connectionType`/`studType`, but not one-side vs both-sides resilient
mounting. That made side-count modeling the right next slice instead of
another timber formula retune.

Implementation refinement `2026-04-24` (resilient side-count Gate A):
`packages/engine/src/wall-resilient-bar-side-count-blind-audit.test.ts`
now proves the four official RB1/RB2 timber rows remain collapsed onto
identical engine outputs even though each source-backed pair publishes a
3 dB `Rw` delta. The paired web matrix
`apps/web/features/workbench/wall-resilient-bar-side-count-route-card-matrix.test.ts`
pins the same user-visible branch/card collapse across lab, field, and
building contexts, while
`apps/web/features/workbench/wall-resilient-bar-side-count-input-contract.test.ts`
initially proved the shared schema and workbench store were still blind to
`resilientBarSideCount`. Gate A changed no calculator runtime values; it
made the missing dimension executable and explicit.

Implementation refinement `2026-04-24` (resilient side-count Gate B):
`packages/shared/src/domain/airborne-context.ts` now exposes
`AirborneResilientBarSideCountSchema` and optional
`resilientBarSideCount`; `apps/web/features/workbench/workbench-store.ts`
persists `airborneResilientBarSideCount` with legacy `auto` fallback; both
workbench shells pass it into runtime context; server-backed snapshots
preserve valid values and drop invalid values before restore; both
framed-wall UI surfaces expose `Auto / One side / Both sides`; and engine
metadata helpers now carry/match the dimension without letting side-count
alone trigger a framed-wall route. The Gate B tests prove schema
recognition, invalid-value rejection, store/snapshot round-trip, explicit
propagation, and `auto`/explicit value-stability. Gate B changed no exact
classification or user-visible calculator value.

Implementation refinement `2026-04-24` (resilient side-count Gate C):
the four official RB1/RB2 timber rows are now promoted to
`exact_import_landed` with reason
`resilient_bar_side_count_topology_exactly_representable`.
`packages/engine/src/airborne-verified-catalog.ts` now requires explicit
`resilientBarSideCount` to match those rows, so legacy `auto` remains on
the old side-count-blind path. The exact explicit lab anchors are:
Knauf RB1 one-side `Rw 56`, Knauf RB2 both-sides `Rw 59`, British
Gypsum A046005 one-side `Rw 55`, and British Gypsum A046006 both-sides
`Rw 58`. Field/building contexts use the existing curated lab-fallback
path and are pinned in the web route/card matrix. The proprietary
FireLine timber row remains `secondary_benchmark`, and the live direct
double-board timber preset still does not inherit exact rows by
adjacency.

Implementation refinement `2026-04-24` (broad revalidation hardening):
the first broad `pnpm check` pass after Gate A surfaced two non-runtime
test issues, not calculator value drift. The shared-schema contract test
was switched from `.keyof()` to parse-based assertions because
`AirborneContextSchema` is exported as a `ZodType`, and the heavy
`calculate-assembly` split-cavity left/right gap-swap invariant sweep
was reduced from a full 4x4 gap grid to a representative
small/mid/large asymmetry matrix so the full single-worker suite stays
below the Vitest worker timeout while preserving the intended invariant.

Implementation refinement `2026-04-24` (floor field-continuation Gate A):
`packages/engine/src/floor-field-continuation-gate-a-matrix.test.ts`
now pins lab, field-between-rooms, and building-prediction support,
origin, and value surfaces for six representative floor families: UBIQ
exact supported-band open-web, Knauf acoustic timber exact, Dataholz CLT
dry exact, reinforced-concrete low-confidence/formula, raw terminal
concrete helper, and raw bare open-web impact-blocked. The paired web
matrix
`apps/web/features/workbench/floor-field-continuation-gate-a-card-matrix.test.ts`
pins the visible card statuses and values for the same surfaces. The
inventory confirms that lab cards correctly park field airborne outputs,
field-between-rooms geometry unlocks `R'w`/`Dn,w`/`Dn,A`, `DnT,w` and
`DnT,A` remain volume-gated until building context, and blocked bare
open-web impact stays fail-closed while formula-owned airborne field
companions remain live.

Implementation refinement `2026-04-24` (floor field-continuation
closeout): `floor_field_continuation_expansion_v1` is closed
no-runtime. Gate A did not find a required Gate B fix, and
`packages/engine/src/post-floor-field-continuation-gate-c-v1-next-slice-selection-contract.test.ts`
selects `floor_many_layer_stress_regression_v1` next. The reason is
explicitly operator-facing: wall 50+ layer behavior is already pinned,
but the master plan still names floor 50+ stress coverage as a deferred
hardening gap. At selection time, that slice had to start with a
no-runtime Gate A matrix and avoid treating arbitrary floor layer
reorders as value-invariant.

Implementation refinement `2026-04-24` (floor many-layer Gate A):
`packages/engine/src/floor-many-layer-stress-gate-a-matrix.test.ts`
now pins five 50+ floor stress stacks: UBIQ split exact, Dataholz CLT dry
split exact, raw terminal concrete helper, raw open-web impact-blocked,
and reinforced-concrete low-confidence/formula. The paired web matrix
`apps/web/features/workbench/floor-many-layer-stress-gate-a-card-matrix.test.ts`
pins the visible route/card posture for exact, helper/formula, and
blocked-impact 50+ stacks. The inventory confirms exact split-equivalent
stacks stay exact, supported helper/formula stacks stay finite, and
unsupported impact lanes remain `unsupported` or `needs_input` instead
of leaking live values. Gate A found no required Gate B runtime fix.

Implementation refinement `2026-04-24` (floor many-layer closeout):
`floor_many_layer_stress_regression_v1` is closed no-runtime. Gate A did
not find a required Gate B fix, and
`packages/engine/src/post-floor-many-layer-gate-c-v1-next-slice-selection-contract.test.ts`
selects `floor_layer_order_edit_stability_v1` next. The reason is
explicitly operator-facing: after very large stacks, layer move/reorder
editing is the next high-risk user behavior. The new slice must audit
explicit-role reorder stability separately from raw/order-sensitive
support changes, and it must not claim arbitrary floor order value
invariance.

Implementation refinement `2026-04-24` (floor layer-order Gate A):
`packages/engine/src/floor-layer-order-edit-stability-gate-a-matrix.test.ts`
now pins explicit-role exact reorder stability for UBIQ FL-28 and
Dataholz GDMTXN01, order-sensitive raw terminal-concrete helper support
changes, and raw open-web impact fail-closed behavior. The paired web
matrix
`apps/web/features/workbench/floor-layer-order-edit-stability-gate-a-card-matrix.test.ts`
pins matching card status/value posture and proves unsupported cards do
not leak `live` or `bound`. The inventory found no required Gate B
runtime/card fix. Gate C later closed no-runtime, and broad arbitrary
floor order value invariance remains unclaimed.

Implementation refinement `2026-04-24` (floor layer-order closeout):
`floor_layer_order_edit_stability_v1` is closed no-runtime.
`packages/engine/src/post-floor-layer-order-gate-c-v1-next-slice-selection-contract.test.ts`
records the closeout and selects
`all_caller_invalid_thickness_guard_v1` next. The reason is
cross-cutting and accuracy-honesty focused: workbench normalization and
wall hostile-input paths are guarded, but the master-plan grid still
marks direct engine thickness validity as partial for floor/wall callers
that bypass workbench normalization.

Implementation refinement `2026-04-24` (all-caller invalid-thickness
Gate A): `packages/engine/src/all-caller-invalid-thickness-guard-gate-a-matrix.test.ts`
now directly calls `calculateAssembly` without workbench normalization
or scenario helpers and covers 4 caller surfaces x 5 invalid thickness
classes: wall lab, wall field, explicit-role floor field, and raw floor
pre-inference callers across `0`, `-5`, `Number.NaN`,
`Number.POSITIVE_INFINITY`, and a non-numeric runtime value. Every cell
fail-closed with finite metrics/ratings/curves, empty supported target
outputs, requested outputs marked unsupported, no impact/floor-system
lane leakage, and a thickness-specific warning. No runtime guard was
needed, and Gate B is not required by the current findings.

Implementation refinement `2026-04-24` (all-caller invalid-thickness
closeout): `all_caller_invalid_thickness_guard_v1` is closed
no-runtime. `packages/engine/src/post-all-caller-invalid-thickness-gate-c-v1-next-slice-selection-contract.test.ts`
records the closeout, the "Gate B not required" decision, the
`MASTER_PLAN.md` engine thickness validity flip from partial to
benchmark, and the next slice selection:
`dynamic_airborne_split_refactor_v2`. The reason is architecture and
future accuracy hygiene: once direct invalid thickness is pinned, the
largest remaining non-source-blocked calculator risk is the 3152-line
`dynamic-airborne.ts` file and its documented composer-injection blocker.

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
| `dynamic_airborne_split_refactor_v2` | 4b | 2026-04-26 | `post-dynamic-airborne-split-refactor-v2-gate-c-next-slice-selection-contract.test.ts` |
| `all_caller_invalid_thickness_guard_v1` | post-step-8 follow-up | 2026-04-24 | `post-all-caller-invalid-thickness-gate-c-v1-next-slice-selection-contract.test.ts` |
| `floor_layer_order_edit_stability_v1` | post-step-8 follow-up | 2026-04-24 | `post-floor-layer-order-gate-c-v1-next-slice-selection-contract.test.ts` |
| `floor_many_layer_stress_regression_v1` | post-step-8 follow-up | 2026-04-24 | `post-floor-many-layer-gate-c-v1-next-slice-selection-contract.test.ts` |
| `floor_field_continuation_expansion_v1` | post-step-8 follow-up | 2026-04-24 | `post-floor-field-continuation-gate-c-v1-next-slice-selection-contract.test.ts` |
| `wall_resilient_bar_side_count_modeling_v1` | post-step-6 follow-up | 2026-04-24 | `post-wall-resilient-side-count-gate-c-v1-next-slice-selection-contract.test.ts` |
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
| C4 | Floor + wall hostile-input discipline | ✅ both green + all-caller direct thickness guard + torture-matrix O1 overlay | `all-caller-invalid-thickness-guard-gate-a-matrix.test.ts` + `raw-floor-hostile-input-answer-matrix.test.ts` + `raw-wall-hostile-input-answer-matrix.test.ts` + `mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts` |
| C5 | Reorder and split invariance on defended surfaces | ✅ wall reorder + floor split/parity surfaces; arbitrary floor reorder not claimed | `wall-reorder-invariance-matrix.test.ts` + `mixed-floor-wall-cross-mode-wall-extension-matrix.test.ts` O2 overlay + `floor-split-layer-parity.test.ts` + `coverage-grid-consistency.test.ts` |
| C6 | Architectural hygiene (≤2000 line files) | ✅ `dynamic_airborne_split_refactor_v2` Gate C closed; `dynamic-airborne.ts` is 1793 lines after broad validation | `dynamic-airborne-*.ts` module family + `DYNAMIC_AIRBORNE_CARTOGRAPHY.md` + `dynamic-airborne-split-v2-gate-b-eleventh-carve-contract.test.ts` + `post-dynamic-airborne-split-refactor-v2-gate-c-next-slice-selection-contract.test.ts` + `coverage-grid-consistency.test.ts` |

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

`packages/engine/src/dynamic-airborne.ts` is 1793 lines (down
from 6630) after the 15-commit split refactor on 2026-04-21, the
2026-04-22 dead-import sweep (52 unused imports from the v1 split left
in place; caught by broad `pnpm check` lint that the focused gate does
not run), and the 2026-04-26 v2 first eleven carves. Eight bounded
modules live alongside:

- `dynamic-airborne-helpers.ts` (337) — pure math, spectrum
  weights, physical constants, delegate blending, curve anchoring,
  shared types (`DynamicAirborneOptions`, `DynamicAirborneResult`,
  `DelegateCurve`, `DelegateBlend`)
- `dynamic-airborne-family-detection.ts` (258) — material + board
  predicates + framing hint helpers
- `dynamic-airborne-davy-masonry.ts` (271) — Davy/Cremer masonry
  coincidence cap
- `dynamic-airborne-mixed-plain-templates.ts` (237) — mixed-plain
  premium/moderate lab-target Rw tables + template resolvers
- `dynamic-airborne-cavity-topology.ts` (460) — cavity +
  reinforcement + single-leaf masonry profile + trim helpers
- `dynamic-airborne-masonry-calibration.ts` (1137) — all 9 masonry
  estimators (AAC / silicate / unfinished aircrete / Celcon
  finished / Porotherm / HELUZ / Ytong Massief / Ytong
  Separatiepaneel / Ytong Cellenbetonblok)
- `dynamic-airborne-framed-wall.ts` (1251) — 8 framed wall
  summarizers + `estimateStudWallTargetRw`
- `dynamic-airborne-correction-guards.ts` (1422) — first eleven v2
  correction guard carves: `applyMicroGapFillEquivalenceGuard` with
  injected `DynamicAirborneComposer`,
  `applyHeavyUnframedCavityScreeningCap`,
  `applyMixedSecurityBoardDoubleStudFieldTrim`, and
  `applyHighFillSingleBoardStudFieldLift`, and
  `applyMixedBoardEmptyCavityFieldMidbandLift`,
  `applyMixedPremiumSplitFieldLift`, and
  `applyDiamondHybridResilientFieldMidbandTrim`, and
  `applyMixedPlainModerateSingleBoardLabTemplate`, and
  `applyPremiumSingleBoardFieldCorrection`, and
  `applySingleLeafMasonryMonotonicFloor`, and
  `applyNarrowHeavyDoubleLeafGapCap`

Remaining `dynamic-airborne.ts` (1793 lines) hosts 3 in-file
`apply*` floor / cap / correction guards + `calculateDynamicAirborneResult` +
`detectDynamicFamily` + `chooseBlend`. The split may continue only as
optional future architecture work because three remaining guards still
recursively call the composer, but C6 is closed. Gate A pinned the exact
call graph. Gate B first carve moved
`applyMicroGapFillEquivalenceGuard` into
`dynamic-airborne-correction-guards.ts`; Gate B second carve moved
`applyHeavyUnframedCavityScreeningCap`; Gate B third carve moved
`applyMixedSecurityBoardDoubleStudFieldTrim`; Gate B fourth carve moved
`applyHighFillSingleBoardStudFieldLift`; Gate B fifth carve moved
`applyMixedBoardEmptyCavityFieldMidbandLift`; Gate B sixth carve moved
`applyMixedPremiumSplitFieldLift`; Gate B seventh carve moved
`applyDiamondHybridResilientFieldMidbandTrim`; Gate B eighth carve moved
`applyMixedPlainModerateSingleBoardLabTemplate`; Gate B ninth carve
moved `applyPremiumSingleBoardFieldCorrection`; Gate B tenth carve moved
`applySingleLeafMasonryMonotonicFloor`; Gate B eleventh carve moved
`applyNarrowHeavyDoubleLeafGapCap`. Gate C closed after broad
validation.

Blueprint:
[DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./DYNAMIC_AIRBORNE_CARTOGRAPHY.md).

## Deferred Follow-Up Tracks

Explicitly planned, not done, documented — safe to resume any
time without context loss:

1. **Remaining dynamic-airborne recursive guard carves** — optional
   architecture backlog. Gate B of the closed v2 slice
   first carve moved `applyMicroGapFillEquivalenceGuard`; second carve
   moved `applyHeavyUnframedCavityScreeningCap`; third carve moved
   `applyMixedSecurityBoardDoubleStudFieldTrim`; fourth carve moved
   `applyHighFillSingleBoardStudFieldLift`; fifth carve moved
   `applyMixedBoardEmptyCavityFieldMidbandLift`; sixth carve moved
   `applyMixedPremiumSplitFieldLift`; seventh carve moved
   `applyDiamondHybridResilientFieldMidbandTrim`; eighth carve moved
   `applyMixedPlainModerateSingleBoardLabTemplate`; ninth carve moved
   `applyPremiumSingleBoardFieldCorrection`; tenth carve moved
   `applySingleLeafMasonryMonotonicFloor`; eleventh carve moved
   `applyNarrowHeavyDoubleLeafGapCap`; C6 is closed, and any remaining
   guard carve needs a new selected architecture slice. Blueprint in
   `DYNAMIC_AIRBORNE_CARTOGRAPHY.md` "Gate C Closeout - 2026-04-26"
   section.
2. **Deep-hybrid swap VALUE pins** — optional per-cell VALUE pins
   for the deep-hybrid swap grids. Existing narrative/invariant pins
   already guard the surface.
3. **Workbench card-level selector VALUE pins** — optional unless a
   user-visible card drift appears.
4. **F3 framed-wall monotonic-floor warning drift** — warning-only;
   numeric outputs unchanged.
5. **Full floor field-continuation expansion** — closed no-runtime as
   `floor_field_continuation_expansion_v1`.
6. **Floor layer-order edit stability** — closed no-runtime as
   `floor_layer_order_edit_stability_v1`; broad arbitrary floor reorder
   value invariance remains unclaimed.
7. **Standalone all-caller invalid-thickness guard** — closed no-runtime
   as `all_caller_invalid_thickness_guard_v1`.
8. **Dedicated floor 50+ layer regression** — closed no-runtime as
   `floor_many_layer_stress_regression_v1`.
9. **Realistic layer-combination coverage cartography** — active. It
   maps realistic wall/floor layer combinations by evidence tier before
   selecting the next runtime widening target. Plan:
   `SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md`.

## Frozen Posture — Do Not Reopen By Inertia

- Every upstream calculator closeout through 2026-04-23 remains sealed
  (reinforced-concrete follow-up, raw terminal-concrete helper,
  CLT-local combined evidence, broad audit, blocked-source
  refresh, wall formula-family widening runtime trim).
- Blocked-source queue — `GDMTXA04A` direct exact, `C11c` exact
  import, raw bare open-box/open-web impact, wall-selector
  widening — remains fail-closed pending external evidence.
- Timber wall runtime widening is no longer an open heuristic question.
  The source-corpus slice is closed; Gate B added the missing
  resilient-bar side-count input/model dimension; Gate C promoted the four
  RB1/RB2 timber rows to explicit side-count exact imports.
  The live direct double-board timber preset still stays parked until a
  true exact topology row exists.
- Productization work may improve persistence, auth, billing, reports,
  and deployment, but must not change calculator runtime/source posture
  without a selected calculator slice.
- The 2026-04-21 masonry flanking inversion fix + lab-fallback
  anchor lane is load-bearing. Any future engine edit that
  touches `applyVerifiedAirborneCatalogAnchor` or the field
  flanking overlay must keep the invariants matrix green.

## Resume Order For The Next Agent

1. Read [CHECKPOINT_2026-04-27_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-27_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_GATE_A_HANDOFF.md)
   for the latest active-slice handoff.
2. Read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md),
   [SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md](./SLICE_REALISTIC_LAYER_COMBINATION_COVERAGE_CARTOGRAPHY_PLAN.md),
   and [SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md](./SLICE_WALL_HEAVY_CORE_CONCRETE_TIGHTENING_PLAN.md).
   Start the Gate B source/formula audit for
   `wall.concrete_heavy_core_screening.field`.
3. Read [PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md)
   for the calculator-priority chain that should stay ahead of
   productization.
4. Read [DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./DYNAMIC_AIRBORNE_CARTOGRAPHY.md)
   for the split-v1/v2 map, remaining optional guard list, and Gate C
   closeout.
5. Confirm the triangle (this file +
   [MASTER_PLAN.md](./MASTER_PLAN.md) +
   [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md))
   agrees on the active slice, completion signals, and deferred tracks.
   If it does not, fix the drift before starting work.
6. Run `pnpm calculator:gate:current` as the focused baseline.
7. Re-read the heavy-core/concrete wall implementation path and write
   the Gate B source/formula, tolerance, support/origin, and web-card
   plan before changing runtime math.
8. Treat [CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_ELEVENTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_ELEVENTH_CARVE_HANDOFF.md),
   [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_A_HANDOFF.md),
   [CHECKPOINT_2026-04-24_INVALID_THICKNESS_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_INVALID_THICKNESS_CLOSEOUT_HANDOFF.md),
   [CHECKPOINT_2026-04-24_INVALID_THICKNESS_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_INVALID_THICKNESS_GATE_A_HANDOFF.md),
   [SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md](./SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md),
   and older floor/wall slice handoffs as closed reference context only.
   Productization work should keep its own app/API tests current and use
   `pnpm check` when shared contracts or app routes move.
