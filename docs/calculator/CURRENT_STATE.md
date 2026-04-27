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
accuracy pass Gate C closed no-runtime; floor fallback Gate C closed
no-runtime; `ui_input_output_honesty_v1` Gate C closed; calculator
personal/internal-use readiness chain is closed;
`project_access_policy_route_integration_v1` closed;
`proposal_report_polish_v1` closed;
`calculator_source_gap_revalidation_v1` Gate A closed no-runtime;
`wall_coverage_expansion_planning_v2` Gate A closed no-runtime;
`wall_single_leaf_mass_law_calibration_v1` Gate C closed no-runtime;
`wall_double_leaf_sharp_davy_scoping_v1` Gate A landed no-runtime;
Gate A contract type-hygiene revalidated under broad typecheck;
latest checkpoint:
[CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_HANDOFF.md](./CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_HANDOFF.md)).
Step 8 closed the calculator runtime audit: `MASTER_PLAN.md` §3/§8
was reconciled to implementation reality, `coverage-grid-consistency.test.ts`
now maps the grid and C1-C6 signals to executable evidence, the
focused calculator gate includes the final-audit tests, and
`POST_CALCULATOR_PRODUCTIZATION_ROADMAP.md` opens productization. The
first four productization slices then closed server-backed project
storage v1, project/proposal route authorization, auth-session
hardening, and the pure team-access policy model.

- **Engine broad suite**: latest broad `pnpm check` on 2026-04-27 was
  238 / 238 files, 1300 / 1300 tests green
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
  all 155 / 155 files in scope through `tools/dev/run-web-vitest.ts`:
  885 / 885 tests green + 18 discovery helpers intentionally skipped.
  The runner isolates six long route-scan files and batches the
  remaining 148 files, preserving coverage while avoiding Vitest worker
  RPC timeout failures on the heavy family-boundary scans.
  The 2026-04-23
  productization pass added focused server project storage/API,
  proposal-audit, route-authorization, auth-session, login/logout,
  server project restore snapshot, and project access policy tests. The
  2026-04-24 broad revalidation also hardened the side-count Gate A
  input contract so it asserts parse behavior instead of calling
  `.keyof()` on the exported shared `AirborneContextSchema` `ZodType`.
- **Broad `pnpm check`**: lint + typecheck + tests + build green on the
  latest broad run after wall double-leaf Gate A checkpoint
  revalidation; build
  still emits the known non-fatal optional `sharp/@img` warnings through
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
  slice no-runtime Gate A audit and timber-first Gate B selection, plus
  `wall-timber-stud-gate-b-source-contract.test.ts` for the no-runtime
  timber Gate B source/formula contract and CLT-next selection, plus
  `wall-clt-gate-b-source-contract.test.ts` for the no-runtime CLT wall
  source/formula contract and Gate C-next selection, plus
  `post-wall-timber-stud-clt-gate-c-next-slice-selection-contract.test.ts`
  for the no-runtime wall pass closeout and floor fallback selection,
  plus
  `floor-fallback-low-confidence-gate-a-audit-contract.test.ts` for
  the closed floor fallback no-runtime Gate A audit, plus
  `floor-fallback-low-confidence-gate-b-source-contract.test.ts` for
  the no-runtime Gate B source/formula decision, plus
  `post-floor-fallback-low-confidence-gate-c-next-slice-selection-contract.test.ts`
  for the no-runtime Gate C closeout and UI honesty next-slice
  selection, plus
  `ui-input-output-honesty-gate-a-inventory.test.ts` for the active
  UI honesty Gate A inventory, plus
  `simple-workbench-output-model.test.ts` and
  `calculator-api-validation.test.ts` for the Gate B API/card honesty
  fixes, plus
  `post-ui-input-output-honesty-gate-c-next-slice-selection-contract.test.ts`
  for the private/internal-use readiness closeout and productization
  route-policy selection, plus
  `project-route-auth.test.ts`, `server-project-routes.test.ts`, and
  `post-project-access-policy-route-integration-next-slice-selection-contract.test.ts`
  for the owner-only route-policy adapter closeout and proposal-report
  polish selection, plus
  `post-proposal-report-polish-next-slice-selection-contract.test.ts`
  for proposal-report polish closeout and calculator source-gap
  revalidation selection, plus
  `calculator-source-gap-revalidation-gate-a-contract.test.ts` for the
  no-runtime Gate A closeout and wall coverage planning v2 selection,
  plus
  `wall-coverage-expansion-planning-v2-gate-a-contract.test.ts` for
  the no-runtime wall coverage inventory and single-leaf mass-law
  calibration selection, plus
  `wall-single-leaf-mass-law-calibration-gate-a-contract.test.ts` for
  the no-runtime source/formula contract, candidate matrix, exact/
  lab-fallback precedence, and adjacent-lane boundaries, plus
  `wall-single-leaf-mass-law-calibration-gate-b-contract.test.ts` for
  the no-runtime bounded runtime-candidate matrix and closeout blocker,
  plus
  `post-wall-single-leaf-mass-law-calibration-v1-next-slice-selection-contract.test.ts`
  for the no-runtime Gate C closeout and double-leaf Sharp/Davy scoping
  selection, plus
  `wall-double-leaf-sharp-davy-scoping-gate-a-contract.test.ts` for
  the no-runtime Gate A current-value/route-ownership inventory and
  Gate B bounded-matrix decision. The Gate A contract now also passes
  the broad repo typecheck after explicit callback typing and optional
  expected-field guards. Latest focused gate run after the Gate A
  contract update: 105 engine files / 480 tests,
  43 web files / 211 passed +
  18 skipped, build 5/5 tasks, whitespace guard clean.

## Active Slice

`wall_double_leaf_sharp_davy_scoping_v1` (wall double-leaf / stud /
double-stud / cavity formula applicability scoping, Gate A has landed
no-runtime and Gate B bounded matrix or no-runtime closeout is next).
Planning surface:
[SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md](./SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md).

`wall_coverage_expansion_planning_v2` Gate A is now closed
no-runtime. It added
`packages/engine/src/wall-coverage-expansion-planning-v2-gate-a-contract.test.ts`
and selected `wall_single_leaf_mass_law_calibration_v1`.

`proposal_report_polish_v1` is now closed. It landed the simple
PDF/DOCX output coverage register, generated-document honesty tests for
real reinforced-concrete floor fallback and dynamic field-airborne wall
workbench outputs, and a 53-row UBIQ long-label / many-layer report
regression with wrapping guards and simple short-form layer-cap
disclosure. It did not change acoustic formulas, runtime values,
support classifications, confidence scores, result rounding, or engine
routes.

Source-gap revalidation Gate A confirmed the historical blocked-source
queue has no runtime-eligible candidate: `GDMTXA04A`, `C11c`, raw bare
open-box/open-web impact, and wall-selector behavior remain closed
fail-closed. Wall coverage planning Gate A then inventoried current wall
coverage and selected the unmatched massive single-leaf wall lane as the
next no-runtime source/formula contract. Heavy-core/concrete, timber
stud, CLT wall, and floor fallback remain in their current
screening/formula/low-confidence posture. Gate A of
`wall_single_leaf_mass_law_calibration_v1` has landed:
`packages/engine/src/wall-single-leaf-mass-law-calibration-gate-a-contract.test.ts`
defines candidate signatures, formula/source basis, positive cases,
negative cases, exact/lab-fallback precedence, and UI/card coverage
requirements before any runtime value movement. Gate B has now landed
no-runtime:
`packages/engine/src/wall-single-leaf-mass-law-calibration-gate-b-contract.test.ts`
pins 150 mm concrete at `R'w=53`, 150 mm solid brick at `R'w=51`, and
150 mm generic AAC at `R'w=38`, plus 100/150/200 mm monotonic
sensitivity. Current values remain defensible formula-owned estimates,
but runtime movement is blocked because there is no stack-specific wall
source row or bounded tolerance pack. Gate C has now closed the slice
no-runtime in
`packages/engine/src/post-wall-single-leaf-mass-law-calibration-v1-next-slice-selection-contract.test.ts`
and selected `wall_double_leaf_sharp_davy_scoping_v1`. The next action
was Gate A no-runtime scoping for double-leaf, stud/double-stud, and
cavity wall Sharp/Davy/framed-wall applicability and guardrails.
Gate A has now landed in
`packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-a-contract.test.ts`.
It pins current representative field values for empty double-leaf
(`R'w=46`), porous double-leaf without stud metadata (`R'w=41`),
explicit single-stud (`R'w=37`), and explicit double-stud /
split-cavity (`R'w=52`). It also records that the same porous board/fill
stack changes family only when explicit stud metadata is supplied, and
keeps lined-massive and triple-leaf shapes as negative boundaries. Gate
B is now the next decision: build the bounded current-value/source
tolerance matrix, or close no-runtime if the source/tolerance basis is
not defensible. A follow-up planning reconciliation in
[CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_HANDOFF.md](./CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_HANDOFF.md)
confirmed that Gate B is still unimplemented and should start with
`packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts`.

Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
heavy-concrete formula parity, reinforced-concrete reopening,
wall-selector behavior, timber-stud widening, floor fallback, or wall
exact-row follow-ups from nearby green tests alone.

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

Timber-stud Gate B has now landed no-runtime in
`packages/engine/src/wall-timber-stud-gate-b-source-contract.test.ts`.
It keeps generated `wall-timber-stud` at lab `Rw=50`, field `R'w=42`,
low-confidence `stud_wall_system`, and blocks runtime tightening because
no verified exact or lab-fallback match exists; direct timber exact rows
are single-board only; resilient exact rows require explicit side-count
and acoustic-board topology; the direct double-board row is only a
secondary benchmark; and linked holdouts are steel-framed companions.
CLT wall Gate B has also landed no-runtime in
`packages/engine/src/wall-clt-gate-b-source-contract.test.ts`. It keeps
generated `wall-clt-local` at lab `Rw=42`, field `R'w=41`,
medium-confidence `laminated_single_leaf`, strategy
`laminated_leaf_sharp_delegate`, and blocks runtime tightening because
no verified exact or lab-fallback match exists, the current catalog has
no wall-specific CLT exact row, Dataholz CLT rows are floor-system
source truth rather than wall exact truth, and the current laminated
lane is a Sharp-delegate formula. The next bounded implementation step
was Gate C closeout for `wall_timber_stud_clt_accuracy_pass_v1`.
Gate C has now landed no-runtime in
`packages/engine/src/post-wall-timber-stud-clt-gate-c-next-slice-selection-contract.test.ts`.
That selected `floor_fallback_low_confidence_cleanup_v1`.
Gate A has now landed no-runtime in
`packages/engine/src/floor-fallback-low-confidence-gate-a-audit-contract.test.ts`.
It pins generated `floor-steel-fallback` as no-exact/no-bound,
`low_confidence`, fit `28%`, origin
`predictor_floor_system_low_confidence_estimate`, lab `Rw=61` /
`Ln,w=58.3`, field `R'w=70` / `Ln,w=58.3` /
`L'n,w=61.3` / `L'nT,w=58.5`, and keeps `L'nT,50`
unsupported. Pliteq steel joist rows and UBIQ FL-32 bound rows remain
lineage / near misses, not promotion evidence. Gate B has now landed
no-runtime in
`packages/engine/src/floor-fallback-low-confidence-gate-b-source-contract.test.ts`.
It proves source precedence already works on the true Pliteq exact stack
and true UBIQ FL-32 bound stack, but the generated stack lacks the
critical source topology for both paths. It also finds no fail-closed
correction because unsupported `L'nT,50`, lab `Ln,w+CI`, and lab
`DeltaLw` already stay explicit. Gate C then landed no-runtime in
`packages/engine/src/post-floor-fallback-low-confidence-gate-c-next-slice-selection-contract.test.ts`.
It closed `floor_fallback_low_confidence_cleanup_v1`, kept
`floor-steel-fallback` low-confidence with unchanged field values, and
selected `ui_input_output_honesty_v1`.

Gate A for `ui_input_output_honesty_v1` has now landed no-runtime in
`apps/web/features/workbench/ui-input-output-honesty-gate-a-inventory.test.ts`.
It pins structured schema issue paths for missing estimate and
impact-only inputs, field airborne geometry vs room-volume blockers, and
non-numeric handling for explicitly unsupported requested outputs. It
found no defended-looking unsupported live/bound value. The next bounded
implementation step was Gate B. Gate B is now implemented:
`apps/web/lib/calculator-api-validation.ts` normalizes invalid calculator
API payloads into concrete `nextField` guidance while preserving raw
schema `issues`, and `simple-workbench-output-model.ts` now separates
genuine missing field-impact inputs from engine-rejected current-path
companions. Active field-continuation `L'nT,50` remains non-numeric but
now displays as `unsupported` rather than `needs_input`. The next bounded
step is Gate C closeout; focused current gate and broad `pnpm check` are
green for the Gate B behavior. Gate C then landed no-runtime in
`packages/engine/src/post-ui-input-output-honesty-gate-c-next-slice-selection-contract.test.ts`.
It closed the private/internal-use readiness chain with evidence-tier
caveats and selected `project_access_policy_route_integration_v1`.

Personal-use readiness is now explicitly tracked in
[PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md).
That chain is closed. Productization route-policy integration has also
closed, and `proposal_report_polish_v1` has closed no-runtime report
honesty. `calculator_source_gap_revalidation_v1` Gate A has closed
no-runtime, and `wall_coverage_expansion_planning_v2` Gate A has closed
no-runtime. `wall_single_leaf_mass_law_calibration_v1` has closed
no-runtime, and `wall_double_leaf_sharp_davy_scoping_v1` Gate A has now
landed no-runtime. Calculator runtime/source posture remains frozen
until Gate B deliberately names a source-backed, benchmark-backed,
formula-tolerance-owned, or bounded family rule for a double-leaf /
stud-cavity movement.

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
now Gate C closeout for the timber stud + CLT wall accuracy pass.

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
`project_access_policy_route_integration_v1` is closed. Route decisions
now flow through `apps/web/lib/project-route-auth.ts`, which adapts the
resolved owner scope into the pure access policy while keeping routes
owner-only. Team roles remain policy vocabulary only; routes do not
enable them until membership storage exists.

Proposal/report polish status: `proposal_report_polish_v1` is closed.
PDF/DOCX/workbench report honesty now preserves visible output posture
for representative wall/floor scenarios without changing calculator
runtime values, support, confidence, or formulas.

Calculator source-gap revalidation status:
`calculator_source_gap_revalidation_v1` Gate A is closed no-runtime.
Wall coverage planning status:
`wall_coverage_expansion_planning_v2` Gate A is closed no-runtime. The
selected single-leaf slice has now closed no-runtime at Gate C. The
next selected slice, `wall_double_leaf_sharp_davy_scoping_v1`, has
landed Gate A no-runtime and must now proceed to Gate B bounded matrix
or no-runtime closeout before any runtime movement.

## Latest Closed Slices

| Slice | Master-plan step | Closed | Post-contract |
|---|---|---|---|
| `wall_double_leaf_sharp_davy_scoping_v1` Gate A | calculator wall coverage planning | 2026-04-27 | `wall-double-leaf-sharp-davy-scoping-gate-a-contract.test.ts` |
| `wall_single_leaf_mass_law_calibration_v1` Gate C | calculator wall coverage planning | 2026-04-27 | `post-wall-single-leaf-mass-law-calibration-v1-next-slice-selection-contract.test.ts` |
| `wall_coverage_expansion_planning_v2` Gate A | calculator wall coverage planning | 2026-04-27 | `wall-coverage-expansion-planning-v2-gate-a-contract.test.ts` |
| `calculator_source_gap_revalidation_v1` Gate A | calculator revalidation | 2026-04-27 | `calculator-source-gap-revalidation-gate-a-contract.test.ts` |
| `proposal_report_polish_v1` | productization 6 | 2026-04-27 | `post-proposal-report-polish-next-slice-selection-contract.test.ts` |
| `project_access_policy_route_integration_v1` | productization 5 | 2026-04-27 | `post-project-access-policy-route-integration-next-slice-selection-contract.test.ts` |
| `ui_input_output_honesty_v1` | personal-use readiness | 2026-04-27 | `post-ui-input-output-honesty-gate-c-next-slice-selection-contract.test.ts` |
| `floor_fallback_low_confidence_cleanup_v1` | personal-use readiness | 2026-04-27 | `post-floor-fallback-low-confidence-gate-c-next-slice-selection-contract.test.ts` |
| `wall_timber_stud_clt_accuracy_pass_v1` | personal-use readiness | 2026-04-27 | `post-wall-timber-stud-clt-gate-c-next-slice-selection-contract.test.ts` |
| `wall_heavy_core_concrete_gate_b_v1` | personal-use readiness | 2026-04-27 | `post-wall-heavy-core-concrete-gate-b-next-slice-selection-contract.test.ts` |
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
9. **Realistic layer-combination coverage cartography** — closed. It
   selected heavy-core/concrete first, then the no-runtime wall
   timber-stud + CLT pass, and then floor fallback cleanup through the
   follow-up planning contracts.
10. **Floor fallback / low-confidence cleanup** — closed no-runtime at
    Gate C. `floor-steel-fallback` remains low-confidence until new
    source evidence or a bounded steel/open-web family rule exists.
11. **UI / input / output honesty pass** — closed private-use readiness
    slice. Gate C selected productization route-policy integration.

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

1. Read [CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_HANDOFF.md](./CHECKPOINT_2026-04-27_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_B_READY_HANDOFF.md)
   for the latest active-slice handoff.
2. Read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md),
   [SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md](./SLICE_WALL_DOUBLE_LEAF_SHARP_DAVY_SCOPING_PLAN.md),
   [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md), and
   [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md).
   Continue `wall_double_leaf_sharp_davy_scoping_v1` at Gate B by
   writing
   `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts`
   as the bounded current-value/source-tolerance matrix, or close the
   slice no-runtime if that evidence basis is insufficient.
3. Read [PERSONAL_USE_READINESS_ROADMAP.md](./PERSONAL_USE_READINESS_ROADMAP.md)
   for the now-closed calculator-priority chain and its evidence-tier
   caveats.
4. Read [DYNAMIC_AIRBORNE_CARTOGRAPHY.md](./DYNAMIC_AIRBORNE_CARTOGRAPHY.md)
   for the split-v1/v2 map, remaining optional guard list, and Gate C
   closeout.
5. Confirm the triangle (this file +
   [MASTER_PLAN.md](./MASTER_PLAN.md) +
   [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md))
   agrees on the active slice, completion signals, and deferred tracks.
   If it does not, fix the drift before starting work.
6. Run `pnpm calculator:gate:current` as the focused baseline.
7. Do not change runtime math, source posture, output support,
   evidence tiers, or confidence scores during Gate B double-leaf wall
   matrix work unless the contract first names the source/tolerance
   basis for the movement.
8. Treat [CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_ELEVENTH_CARVE_HANDOFF.md](./CHECKPOINT_2026-04-26_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_B_ELEVENTH_CARVE_HANDOFF.md),
   [CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_DYNAMIC_AIRBORNE_SPLIT_V2_GATE_A_HANDOFF.md),
   [CHECKPOINT_2026-04-24_INVALID_THICKNESS_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-24_INVALID_THICKNESS_CLOSEOUT_HANDOFF.md),
   [CHECKPOINT_2026-04-24_INVALID_THICKNESS_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-24_INVALID_THICKNESS_GATE_A_HANDOFF.md),
   [SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md](./SLICE_ALL_CALLER_INVALID_THICKNESS_GUARD_PLAN.md),
   and older floor/wall slice handoffs as closed reference context only.
   Productization work should keep its own app/API tests current and use
   `pnpm check` when shared contracts or app routes move.
