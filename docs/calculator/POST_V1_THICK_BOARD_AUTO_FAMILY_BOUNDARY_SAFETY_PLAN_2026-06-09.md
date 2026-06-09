# Post-V1 Thick Board Auto Family Boundary Safety Plan - 2026-06-09

Status: implemented and validated in the local worktree. The focused
safety contract, narrow runtime classifier guard, split-refactor line
pin update, and documentation sync are complete. Gate EU remains the
selected next numeric coverage/accuracy rerank; this is a bounded
route-family safety follow-up, not a replacement for Gate EU.

Related authority:

- Source of truth:
  [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
- Current checkpoint:
  [CHECKPOINT_2026-06-08_DOUBLE_LEAF_ROUTE_INPUT_BOUNDARY_CHECKPOINT.md](./CHECKPOINT_2026-06-08_DOUBLE_LEAF_ROUTE_INPUT_BOUNDARY_CHECKPOINT.md)
- Tactical selected-next plan:
  [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md)

## Purpose

This plan handles the post-checkpoint ambiguity where a flat wall stack
such as:

`gypsum_board 12.5 / rockwool 50 / gypsum_board 100`

can leave the double-leaf `needs_input` lane and publish a
`lined_massive_wall` screening answer in Auto mode because the thick
right board crosses the dominant leaf surface-mass threshold.

The goal is not to prove that 100 mm gypsum can never be massive. The
goal is to keep generic board/panel inputs from silently losing
route-required physical inputs unless the stack has true massive-core
semantics or the user supplies explicit topology/material intent.

Any implementation must improve calculator correctness without turning
the project into a finite scenario catalog, confidence wording pass, or
source-row crawl.

## Runtime Implementation Summary

The accepted local implementation is intentionally narrow:

- `packages/engine/src/dynamic-airborne.ts` keeps the existing
  dominant-mass threshold but now requires the dominant visible leaf to
  have massive-substrate semantics before Auto can promote to
  `lined_massive_wall`;
- `packages/engine/src/dynamic-airborne-family-detection.ts` owns the
  dominant visible-leaf and material-semantics helpers so the main
  dynamic composer does not absorb another predicate block;
- explicit `topologyMode: lined_massive_wall` remains an explicit user
  intent path and is not broken by the Auto guard;
- no curve math, calibration coefficients, candidate precedence,
  field/building adapters, source rows, confidence wording, or frontend
  visibility conditions were changed.

The only intended runtime movement is for ambiguous generic
board/panel/membrane Auto stacks that previously crossed the
lined-massive mass threshold and silently published
`screening_mass_law_curve_seed_v3`. Those stacks now stay on the
double-leaf `needs_input` boundary until route-required physical inputs
are supplied.

## Implementation Reading

Current behavior comes from the engine, not from a standalone frontend
visibility bug:

- The workbench shows wall topology inputs when the user is in a
  non-auto topology mode or when the result reports missing wall topology
  physical inputs. If the engine publishes a supported answer, the
  topology inputs can disappear.
  Relevant implementation:
  `apps/web/features/workbench-rebuild/calculator-workbench.tsx`.
- `packages/engine/src/dynamic-airborne.ts` chooses
  `lined_massive_wall` for two visible leaves when the dominant visible
  leaf is at least 70 kg/m2, the light leaf is at most 20 kg/m2, the
  visible leaf mass ratio is at least 4, and framed evidence is absent.
- `packages/engine/src/airborne-topology.ts` collapses visible leaf
  groups and rounds visible leaf surface masses. With `gypsum_board`
  density 850 kg/m3, the right leaf reaches the 70 kg/m2 trigger at
  about 82.4 mm.
- `packages/engine/src/calculate-assembly.ts` already parks flat
  `leaf / porous absorber / leaf` stacks as `needs_input`, but that
  boundary currently applies only after the detected family is
  `double_leaf`. Once Auto detection picks `lined_massive_wall`, the
  double-leaf boundary is bypassed.
- The material catalog gives `gypsum_board`, acoustic gypsum,
  silentboard, and related boards `finish` / `panel_leaf` / board-like
  semantics. `concrete`, AAC/Ytong, brick/block/masonry, and CLT carry
  massive-core or structural semantics and have separate intended
  lined-massive/heavy-core coverage.

Existing intended lanes to preserve include generated/pinned
lined-massive or heavy-core stacks such as
`gypsum_board 12.5 / rockwool 50 / air_gap 50 / concrete 100`, AAC,
brick/masonry, and CLT/mass-timber follow-ups.

## Verified Current Observations

The 2026-06-09 analysis pass reproduced the root cause with assertion
probes. No implementation files were changed.

Threshold behavior for
`gypsum_board 12.5 / rockwool 50 / gypsum_board T` in Auto mode:

| Right gypsum thickness | Approx. right surface mass | Family | Origin | Route inputs visible |
| --- | ---: | --- | --- | --- |
| 12.5 mm | 10.6 kg/m2 | `double_leaf` | `needs_input` | yes |
| 50 mm | 42.5 kg/m2 | `double_leaf` | `needs_input` | yes |
| 75 mm | 63.8 kg/m2 | `double_leaf` | `needs_input` | yes |
| 82.29 mm | 69.9 kg/m2 | `double_leaf` | `needs_input` | yes |
| 82.30 mm | 70.0 kg/m2 | `lined_massive_wall` | `screening_fallback` | no |
| 100 mm | 85.0 kg/m2 | `lined_massive_wall` | `screening_fallback` | no |

This confirms that the visible input change is caused by the engine
family/origin flip at the dominant-leaf mass threshold, not by an
independent frontend condition.

Topology comparison for
`gypsum_board 12.5 / rockwool 50 / gypsum_board 100`:

| Input state | Family/origin | Expected route-input behavior |
| --- | --- | --- |
| Auto topology | `lined_massive_wall` / `screening_fallback` | no missing wall inputs, workbench hides topology fields |
| Partial explicit topology | `needs_input` | asks for `frameBridgeClass`, `supportTopology`, `supportSpacingMm` |
| Complete independent topology | `family_physics_prediction` | calculates through `layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor` |

Control for true massive-core intent:

- `gypsum_board 12.5 / rockwool 50 / air_gap 50 / concrete 100`
  remains `lined_massive_wall` with `bounded_prediction` and method
  `gate_h_lined_massive_wall_cavity_aware_family_physics_runtime`.

The current board/panel-like Auto surface is broader than gypsum only.
The probe also found Auto `lined_massive_wall` / `screening_fallback`
for sufficiently heavy `acoustic_gypsum_board`, `silentboard`,
`security_board`, `diamond_board`, `cement_board`, MLV, and similar
board/panel/membrane inputs. Any fix that targets only `gypsum_board`
would therefore be an incomplete product-id patch.

## Why This Is Not A Simple Bug

The current answer is not automatically wrong for every physical
construction. If the user meant a massive gypsum substrate with a light
lining, a lined-massive interpretation can be physically plausible.

The unsafe part is the automatic inference. Generic `gypsum_board`
means a board/panel lining in the catalog. A thick board-like layer can
also represent a user-entered shorthand for a multi-board double-leaf
or framed cavity system, where cavity depth, absorber state, support
topology, bridge class, and support spacing remain route-required
physical inputs.

Therefore the safe product rule is:

- do not classify a flat board/panel double-leaf intent as a true
  massive-substrate wall from surface mass alone;
- do preserve true massive-core intent for concrete, AAC, masonry,
  brick, CLT/mass-timber, and any future explicit massive gypsum
  substrate material or topology.

## Expected Outcome Matrix

The expected behavior must stay explicit before and after the code
changes.

| Scenario | Expected after a safe guard | Why |
| --- | --- | --- |
| `gypsum_board 12.5 / rockwool 50 / gypsum_board 100`, Auto | `needs_input` or an explicit ambiguity/input-surface stop, not silent supported screening | Generic gypsum board has board/panel semantics; support/cavity inputs may matter |
| Same stack with partial topology | `needs_input` for remaining route-required fields | Partial user intent should not publish a guessed answer |
| Same stack with complete independent double-leaf topology | owned double-leaf/framed calculation | User supplied the required physical route inputs |
| Same stack with explicit lined-massive topology | existing explicit-intent behavior is preserved; this gate must not use Auto safety to break a user-selected topology | Massive gypsum intent must be explicit, not inferred from generic board thickness alone |
| `gypsum_board / rockwool / air_gap / concrete`, Auto | unchanged `lined_massive_wall` / Gate H posture | Concrete is a true massive-core substrate |
| AAC/Ytong, brick/masonry, CLT/mass-timber lined-heavy controls | unchanged family, origin, method, supported outputs, and pins | Existing intended lanes must not be broken |
| Field/building contexts | no output movement unless the same selected owner already supports that basis | Avoid accidental field/building basis promotion |
| Exact measured or verified catalog match | unchanged precedence over formula/screening routes | Exact/anchor precedence outranks this family heuristic |

If the desired product decision changes and generic 100 mm gypsum should
remain calculable as massive by default, do not implement the classifier
guard. Instead, leave runtime unchanged and add an explicit route-card or
input-surface explanation plan.

## Safety Strategy

Proceed in gates. Do not start with a runtime edit.

### Gate 0 - No-Runtime Snapshot Matrix

Create a focused probe or contract that records the current behavior
without changing the calculator:

- board/panel candidates:
  `gypsum_board`, `acoustic_gypsum_board`, `silentboard`,
  `security_board`, `diamond_board`, `cement_board`, plywood/OSB-like
  panels, and MLV where present;
- massive-core candidates:
  `concrete`, AAC/Ytong, Porotherm/brick/masonry, CLT/mass-timber;
- thicknesses around the boundary:
  12.5, 50, 75, 82.35, 100, 140, and 150 mm;
- contexts:
  element lab first, then field/building only if the lab matrix shows a
  bounded route change.

Record for each probe:

- detected family;
- selected candidate id and origin;
- airborne basis method;
- supported and unsupported outputs;
- missing physical inputs;
- whether wall topology inputs would be visible in the workbench.

Gate 0 must move no runtime values, import no source rows, and touch no
frontend implementation. Its only output is evidence for a narrow
runtime decision.

Gate 0 deliverable should be an assertion-backed contract or snapshot,
not only an ad hoc console table. At minimum it must assert:

- 82.29 mm gypsum stays `double_leaf` / `needs_input`;
- pre-guard 82.30 mm gypsum flipped to `lined_massive_wall` /
  `screening_fallback`;
- partial topology asks for the remaining support/bridge inputs;
- complete independent topology reaches the owned double-leaf/framed
  route;
- concrete control remains Gate H lined-massive/heavy-core.

### Gate 1 - Contract The Intended Boundaries

Before runtime changes, add focused tests that lock both sides of the
decision:

- generic thick board / porous absorber / generic board in Auto mode
  must not silently lose route-input visibility if the product decision
  is to treat it as ambiguous board intent;
- complete explicit double-leaf topology must still calculate through
  the owned double-leaf/framed route or ask only for remaining
  route-required support fields;
- concrete/AAC/brick/CLT massive-core stacks must stay on their current
  intended lined-massive/heavy-core posture;
- explicit lined-massive topology or a future explicit massive gypsum
  material must remain available for users who really mean a massive
  gypsum substrate;
- source-absent screening values must not be relabelled as exact,
  measured, or benchmark-backed values.

If these contracts cannot be written without broad ambiguous changes,
stop and do not implement the runtime guard.

Recommended contract location:

- add a focused new file such as
  `packages/engine/src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts`;
- keep the test independent of web rendering;
- assert `supportedTargetOutputs`, `unsupportedTargetOutputs`,
  `airborneCandidateResolution.selectedOrigin`,
  `dynamicAirborneTrace.detectedFamily`, `airborneBasis.method`, and
  `missingPhysicalInputs`;
- include a small helper that mirrors workbench input visibility by
  checking whether missing physical inputs include wall topology fields.

Do not add broad fixture catalogs or scrape external layer combinations
for this gate.

#### Gate 1 Contract Added In This Implementation Turn

The focused contract now exists at:

`packages/engine/src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts`

It is intentionally engine-first. It does not render the workbench. The
engine-side workbench visibility risk is represented by a helper that
returns true when the selected answer or answer boundary reports one of
the wall topology fields that makes the workbench show the ownership
inputs.

The engine contract has 47 tests grouped around the most likely breakage
surfaces:

| Coverage group | Exact representative | Required signal | Breakage caught immediately |
| --- | --- | --- | --- |
| Threshold edge | `gypsum_board 12.5 / rockwool 50 / gypsum_board 82.29` and `82.30` | both stay `double_leaf` / `needs_input`, no supported outputs, wall topology inputs visible | the original 82.30 mm mass-threshold flip reappears |
| User-reported gypsum thickness sweep | right gypsum leaf `8`, `12.5`, `50`, `75`, `82.29`, `82.30`, `90`, `100`, `140`, and `150` mm | every Auto state stays `double_leaf` / `needs_input`, no screening fallback, wall topology inputs visible | the input panel disappears again at a new or old thickness threshold |
| Board/panel/membrane Auto family | `gypsum_board 100`, `acoustic_gypsum_board 75`, `silentboard 50`, `security_board 100`, `diamond_board 75`, `cement_board 50`, `mlv 50`, `plywood 150` | `candidate_dynamic_needs_input`, method `acoustic_calculator_answer_engine_v1_flat_double_leaf_missing_topology`, missing `sideALeafGroup`, `cavity1DepthMm`, `sideBLeafGroup`, `frameBridgeClass`, `supportTopology`, `supportSpacingMm` | the fix overfits only `gypsum_board`, or another dense board-like material still publishes screening without route inputs |
| User-reported last-layer substitutions | high-mass `gypsum_board`, `acoustic_gypsum_board`, `silentboard`, `cement_board`, and `plywood` right leaves | Auto stays parked with the same missing topology field surface | swapping the last layer makes the panel disappear by selecting another board-like screening route |
| Mirrored high-mass board order | the same high-mass board-like leaves on side A instead of side B | Auto stays parked with the same missing topology field surface | the guard depends on leaf order instead of dominant board/panel semantics |
| Cavity-entry intermediate states | topology mode only, cavity-depth-only, cavity-depth plus absorption/fill | `dynamic_calculator_route_input_contract_missing_physical_fields`; completed fields disappear from the missing list, remaining wall topology fields stay visible | typing into the cavity field collapses the input panel or publishes a guessed answer |
| Partial double-leaf topology | same generic board stack with side/cavity ownership but without support/bridge ownership | `needs_input` with exactly `frameBridgeClass`, `supportTopology`, `supportSpacingMm` | partial user intent starts publishing a guessed answer or loses the remaining prompts |
| Role-owned high-thickness variants | right gypsum leaf `82.30`, `100`, and `150` mm with layer groups and cavity owned | still parked only on `frameBridgeClass`, `supportTopology`, and `supportSpacingMm` | role assignment is bypassed by high surface mass |
| Acoustic gypsum plus typed cavity | `acoustic_gypsum_board 100` with cavity depth, absorption, and fill set | still asks for side groups and support/bridge fields; no screening fallback | the exact user-reported substitution reopens the disappearing-input route |
| Typed-cavity field/building requests | `R'w`, `Dn,w`, and `DnT,w` for field/building contexts with cavity already typed | no supported field/building outputs, no screening fallback, wall topology plus field/building route inputs remain missing | the fix accidentally promotes field/building basis or hides remaining wall ownership fields |
| Auto field/building requests | `R'w`, `Dn,w`, and `DnT,w` for field/building contexts without topology ownership | no supported field/building outputs and no screening fallback | generic thick board Auto starts publishing apparent/standardized answers without adapter ownership |
| Complete independent double-leaf topology | same generic board stack with independent-frame support inputs complete | `family_physics_prediction`, method `layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`, all wall outputs supported | owned double-leaf/framed calculation is accidentally parked or rerouted |
| Explicit lined-massive topology | same generic board stack with explicit `topologyMode: lined_massive_wall` and direct-fixed support | existing explicit-intent lined-massive posture remains available | the Auto-only guard becomes too broad and breaks user-selected topology intent |
| True massive-core Auto controls | concrete, AAC/Ytong, Porotherm, and current CLT posture | existing detected family, origin, method, supported outputs, and missing-input state are unchanged | a broad board guard parks legitimate massive-core lined-wall routes |

The test is deliberately strict about `supportedTargetOutputs` and
`unsupportedTargetOutputs`. A future change that still returns the right
family but publishes the wrong output set should fail immediately.

The test is also deliberately strict about `missingPhysicalInputs`. A
future change that returns `needs_input` but drops one of the route
ownership fields should fail immediately, because that is how the
frontend input disappearance bug would come back under a different
route.

The user-reported cavity-entry cases are intentionally pinned as engine
contracts rather than browser-only assertions. The workbench visibility
condition is derived from the result's missing physical inputs, so the
calculator must keep publishing the remaining route-required wall
topology fields after a user types cavity depth, absorption, or fill.

The workbench payload surface is also pinned by:

`apps/web/features/workbench/thick-board-wall-topology-input-visibility.test.ts`

That 4-test web contract does not render the full UI. It verifies that
the workbench wall-topology draft builder carries typed cavity fields,
layer-role ownership, acoustic gypsum substitution, and complete
independent topology into the engine request surface without reopening
the screening fallback or breaking the owned double-leaf formula route.

The test is not a finite scenario library. Each representative is there
because it maps to a material-semantics class that can cross the same
surface-mass threshold: generic gypsum, enhanced gypsum, dense acoustic
board, cement board, limp-mass membrane, and wood panel.

### Gate 2 - Narrow Runtime Guard, Only If Gate 1 Is Green

If the product decision is to stop generic board/panel materials from
auto-promoting to `lined_massive_wall`, implement the guard at the
family classifier boundary rather than in the UI.

Preferred implementation shape:

- add a local predicate for the dominant visible leaf, for example
  `isMassiveSubstrateLikeVisibleLeaf`;
- use the existing visible-leaf layout utilities in
  `airborne-topology.ts` to identify the dominant visible leaf material
  behind the mass threshold;
- allow automatic `lined_massive_wall` promotion only when the dominant
  heavy leaf has massive-substrate semantics, such as category `mass`,
  acoustic behavior `rigid_mass` or `mass_timber`, and/or material text
  pointing to concrete, AAC/Ytong, brick, block, masonry, stone,
  silicate, pumice/bims, CLT, mass-timber, structural, heavy-base, or
  dense-mineral;
- do not count `finish` board/panel/membrane leaves as massive
  substrates from mass alone when their material text indicates board,
  lining, acoustic board, gypsum board, silentboard, plywood/OSB, or
  limp-mass membrane semantics;
- keep explicit topology/material intent as a separate route. If a
  user chooses a lined-massive topology or a future
  `massive_gypsum_panel` / `gypsum_block` material, that route can be
  owned independently without weakening generic board safety.

Implementation shape used in this turn:

- `packages/engine/src/dynamic-airborne.ts` now identifies the dominant
  visible leaf with `detectLeafCoreLayout`;
- automatic `lined_massive_wall` promotion now requires the dominant
  visible leaf to be massive-substrate-like, or the user to have
  explicitly selected `topologyMode: lined_massive_wall`;
- board/panel/membrane-like leaves are recognized from catalog acoustic
  behavior (`panel_leaf`, `limp_mass_membrane`) and material text
  (`gypsum`, `board`, `plywood`, `osb`, `membrane`, `mlv`, and known
  enhanced board terms);
- massive-substrate-like leaves are recognized from massive-core text
  (`concrete`, AAC/Ytong, aircrete, Porotherm/Wienerberger,
  brick/block/masonry/stone/silicate, pumice/bims, CLT/mass-timber,
  heavy-base, dense-mineral) or acoustic behavior `mass_timber`;
- category `mass` plus behavior `rigid_mass` remains a fallback only
  after board/panel/membrane semantics are excluded.

The guard intentionally does not touch curve math, candidate precedence,
field/building adapters, exact catalog matching, or the workbench
visibility condition.

Do not change curve math, calibration coefficients, field/building
adapters, metric aliases, or confidence labels in this gate.

Implementation touchpoints should stay narrow:

- likely touch:
  `packages/engine/src/dynamic-airborne.ts`;
- possible helper-only touch if needed:
  `packages/engine/src/airborne-topology.ts` to expose a safe dominant
  visible-leaf descriptor;
- test touch:
  the new focused contract plus any expectation updates that are
  directly caused by generic board/panel Auto ambiguity being corrected.

Do not touch:

- frontend visibility logic unless the engine still returns the wrong
  missing-input surface after the classifier guard;
- formula curves, coefficients, frequency bands, field/building
  adapters, exact catalog matching, source imports, or confidence copy;
- concrete/AAC/brick/CLT source or bounded-prediction route values.

Implementation risk to watch: `collapseContiguousSolidLeafLayers` can
produce a `composite_leaf` when contiguous solid layers differ. A
dominant visible leaf predicate must not accidentally erase massive-core
semantics from a composite concrete/plaster or AAC/finish leaf. If the
dominant visible leaf is composite, inspect the original layer group or
material text before deciding that it is only a board/panel leaf.

### Gate 3 - User Intent Surface, Only If Needed

If Gate 2 would hide a physically valid use case, prefer explicit user
intent over silent Auto inference:

- add or map a true massive gypsum material if product/domain review
  says that construction is common enough;
- or add UI wording/control that lets the user choose whether a thick
  board-like layer is a board leaf or a massive substrate;
- do not make this a generic UI polish slice unless it preserves the
  calculator boundary and is selected as input-surface correctness work.

## Validation Plan

Focused validation after any runtime guard:

- targeted thick-board safety contract;
- `packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`;
- `packages/engine/src/dynamic-airborne-family-boundary.test.ts`;
- `packages/engine/src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts`;
- `packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df-contract.test.ts`;
- `packages/engine/src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts`;
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts`;
- `pnpm --dir packages/engine typecheck`;
- `pnpm calculator:gate:current` before finalizing a runtime behavior
  change;
- Playwright workbench smoke only if the surfaced input visibility or
  route card text changes.

The 2026-06-09 analysis pass already ran the following no-change
validation successfully:

- `pnpm --dir packages/engine exec vitest run --maxWorkers=1 src/acoustic-calculator-answer-engine-v1-contract.test.ts src/dynamic-airborne-family-boundary.test.ts src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts src/post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df-contract.test.ts src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts`
  - 5 files / 42 tests passed.
- `pnpm --dir packages/engine exec vitest run --maxWorkers=1 src/dynamic-airborne-family-boundary-scan.test.ts src/realistic-layer-combination-coverage-cartography.test.ts src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor-contract.test.ts`
  - 3 files / 15 tests passed.

Any runtime implementation must rerun the same groups after the change
and compare the snapshot matrix before/after.

Required before/after evidence:

- generic thick board Auto examples are the only expected behavior
  changes;
- concrete/AAC/brick/masonry/CLT intended lanes do not change family,
  origin, method, supported outputs, or pinned values;
- explicit double-leaf topology still calculates;
- no source rows are imported;
- no formula retunes occur;
- no metric/basis aliases are promoted.

Minimum acceptance criteria for a runtime guard:

- all added safety tests pass;
- all listed existing focused tests pass;
- `pnpm --dir packages/engine typecheck` passes;
- `git diff --check` passes;
- before/after matrix shows no unintended movement in massive-core
  controls;
- any user-visible input-surface change is explainable only by
  `needs_input` reappearing for ambiguous generic board/panel Auto
  stacks.

### Runtime Validation Completed On 2026-06-09

Post-implementation validation passed:

- `pnpm --dir packages/engine exec vitest run --maxWorkers=1 src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts src/dynamic-airborne-split-v2-gate-b-eleventh-carve-contract.test.ts`
  - 2 files / 21 tests passed.
- Additional user-repro-specific expansion:
  `pnpm --dir packages/engine exec vitest run --maxWorkers=1 src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts`
  - 1 file / 38 tests passed.
- Additional confidence expansion after mirrored/field/building and
  workbench payload tests:
  `pnpm --dir packages/engine exec vitest run --maxWorkers=1 src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts`
  - 1 file / 47 tests passed.
  `pnpm --dir apps/web exec vitest run --maxWorkers=1 features/workbench/thick-board-wall-topology-input-visibility.test.ts`
  - 1 file / 4 tests passed.
- Expanded focused regression after the user-repro-specific cases:
  `pnpm --dir packages/engine exec vitest run --maxWorkers=1 src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts src/dynamic-airborne-split-v2-gate-b-eleventh-carve-contract.test.ts src/acoustic-calculator-answer-engine-v1-contract.test.ts src/dynamic-airborne-family-boundary.test.ts src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts src/post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df-contract.test.ts src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts`
  - 8 files / 92 tests passed.
- Expanded focused regression after the mirrored/field/building
  confidence expansion:
  `pnpm --dir packages/engine exec vitest run --maxWorkers=1 src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts src/dynamic-airborne-split-v2-gate-b-eleventh-carve-contract.test.ts src/acoustic-calculator-answer-engine-v1-contract.test.ts src/dynamic-airborne-family-boundary.test.ts src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts src/post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df-contract.test.ts src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts`
  - 8 files / 101 tests passed.
- Web payload/route-card focused regression:
  `pnpm --dir apps/web exec vitest run --maxWorkers=1 features/workbench/thick-board-wall-topology-input-visibility.test.ts features/workbench/wall-double-leaf-framed-bridge-runtime-route-card-matrix.test.ts features/workbench/layer-combination-resolver-candidate-surface-parity.test.ts`
  - 3 files / 20 tests passed.
- `pnpm --dir packages/engine exec vitest run --maxWorkers=1 src/acoustic-calculator-answer-engine-v1-contract.test.ts src/dynamic-airborne-family-boundary.test.ts src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts src/post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df-contract.test.ts src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts`
  - 6 files / 49 tests passed.
- `pnpm --dir packages/engine exec vitest run --maxWorkers=1 src/dynamic-airborne-family-boundary-scan.test.ts src/realistic-layer-combination-coverage-cartography.test.ts src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor-contract.test.ts`
  - 3 files / 15 tests passed.
- `pnpm --dir packages/engine typecheck`
  - passed.
- `git diff --check`
  - passed.
- `pnpm calculator:gate:current`
  - engine focused gate: 663 files / 3629 tests passed;
  - web focused gate: 114 files / 443 tests passed, 18 skipped;
  - repo build: 5 tasks successful;
  - whitespace guard: passed.

The full `pnpm calculator:gate:current` command was rerun after the
user-repro-specific expansion and passed with the same counts:

- engine focused gate: 663 files / 3629 tests passed;
- web focused gate: 114 files / 443 tests passed, 18 skipped;
- repo build: 5 tasks successful;
- whitespace guard: passed.

It was rerun again after the mirrored/field/building and web payload
confidence expansion and passed with the same current-gate counts:

- engine focused gate: 663 files / 3629 tests passed;
- web focused gate: 114 files / 443 tests passed, 18 skipped;
- repo build: 5 tasks successful;
- whitespace guard: passed.

Note: `pnpm --dir apps/web typecheck` was also attempted as a
non-current-gate check and failed in existing test files unrelated to
this slice (`layer-combination-resolver-candidate-surface-parity`,
`post-v1-floor-explicit-ci*`, `post-v1-floor-field-a-weighted`, and
`report-assistant-patch`). The new thick-board web payload test produced
no typecheck errors, and the current-gate web build typecheck passed.

Known non-fatal output remains unchanged:

- `zustand persist middleware` storage-unavailable warnings in web
  tests;
- optional `sharp/@img` module warnings during the Next build through
  the proposal DOCX/PDF dependency path.

The first full current-gate attempt failed only on the split-refactor
physical line-count pin after the classifier guard grew
`dynamic-airborne.ts`. The helper predicate body was moved to
`dynamic-airborne-family-detection.ts`, the split contract was updated
to the new 2085-line composer count, and the full current gate then
passed.

## Stop Conditions

Stop and do not land the runtime guard if any of the following happen:

- a concrete, AAC, brick/masonry, CLT, or existing heavy-core pin moves
  unexpectedly;
- a field/building output moves without an explicitly selected adapter
  owner;
- the guard requires broad special-casing by product id instead of a
  defensible material-semantics predicate;
- the change would require retuning formulas or altering confidence
  wording to make the result acceptable;
- the matrix shows that the issue is primarily user intent/input-surface
  ambiguity rather than a safe classifier boundary.

In those cases, keep runtime unchanged and move the issue to an explicit
material/topology input-surface plan instead.

## Rollback-To-Commit Conditions

Initial documentation checkpoint:

`264ab7a Document thick-board auto family boundary plan`

This commit is the safe documentation checkpoint before the rollback
criteria were added. After this section is committed, the default
runtime rollback target is the latest committed documentation checkpoint
that contains these rollback conditions. If a future implementation
cannot satisfy the conditions below, stop the implementation and return
to that documentation checkpoint. On a shared branch, prefer reverting
the implementation commits after that checkpoint. On a disposable
implementation branch, resetting the branch back to that checkpoint is
acceptable only with explicit user approval.

### Tests That Must Exist Before Runtime Implementation

Add a focused contract before changing the classifier, for example:

`packages/engine/src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts`

The contract must cover:

- threshold repro:
  `gypsum_board 12.5 / rockwool 50 / gypsum_board 82.29` remains the
  pre-existing `double_leaf` / `needs_input` control;
- threshold flip evidence:
  the current 82.30 mm / 100 mm generic gypsum Auto behavior is
  documented before the guard changes it;
- post-guard expected behavior:
  generic thick `gypsum_board` Auto does not publish supported
  `Rw` / `STC` / `C` / `Ctr` via
  `screening_mass_law_curve_seed_v3` without route-required physical
  inputs;
- nearby board/panel/membrane representatives:
  acoustic gypsum, silent/security/diamond board, cement board, MLV, and
  plywood/OSB-like panels where present in the catalog;
- partial topology:
  missing `frameBridgeClass`, `supportTopology`, and
  `supportSpacingMm` stay visible as `needs_input`;
- complete independent double-leaf topology:
  routes through the owned double-leaf/framed formula corridor;
- explicit lined-massive topology:
  remains available as a separate explicit-intent route if its route
  input contract is satisfied;
- true massive-core controls:
  concrete, AAC/Ytong, Porotherm/brick/masonry, and CLT/mass-timber keep
  their existing family/origin/method/support posture;
- exact/verified catalog controls:
  exact measured or verified catalog matches still win before
  source-absent formulas or screening helpers.

The new test must assert at least:

- `dynamicAirborneTrace.detectedFamily`;
- `airborneCandidateResolution.selectedCandidateId`;
- `airborneCandidateResolution.selectedOrigin`;
- `airborneBasis.origin`;
- `airborneBasis.method`;
- `supportedTargetOutputs`;
- `unsupportedTargetOutputs`;
- `airborneBasis.missingPhysicalInputs` or
  `acousticAnswerBoundary.missingPhysicalInputs`;
- a helper-derived `wouldWorkbenchShowWallTopologyInputs` boolean based
  on missing wall topology fields.

### Required Test Commands Before Accepting Runtime Changes

Run these after the implementation:

- `pnpm --dir packages/engine exec vitest run --maxWorkers=1 src/post-v1-thick-board-auto-family-boundary-safety-contract.test.ts`
- `pnpm --dir packages/engine exec vitest run --maxWorkers=1 src/acoustic-calculator-answer-engine-v1-contract.test.ts src/dynamic-airborne-family-boundary.test.ts src/wall-heavy-core-concrete-gate-b-audit-contract.test.ts src/post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df-contract.test.ts src/post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts`
- `pnpm --dir packages/engine exec vitest run --maxWorkers=1 src/dynamic-airborne-family-boundary-scan.test.ts src/realistic-layer-combination-coverage-cartography.test.ts src/layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor-contract.test.ts`
- `pnpm --dir packages/engine typecheck`
- `git diff --check`

Run `pnpm calculator:gate:current` before finalizing if any runtime
behavior changed outside the focused generic board/panel Auto surface or
if field/building behavior moved.

### Roll Back If Any Of These Fail

Return to the baseline checkpoint if any of the following occur:

- any required test command fails and the failure is not an obviously
  unrelated pre-existing environmental issue;
- concrete, AAC/Ytong, Porotherm/brick/masonry, CLT/mass-timber, or
  `wall-screening-concrete` changes family, origin, method, supported
  outputs, or pinned values unexpectedly;
- exact measured or verified catalog precedence changes;
- a field/building output moves without a selected adapter owner and
  explicit test coverage;
- complete independent double-leaf topology stops calculating through
  the owned double-leaf/framed corridor;
- partial topology stops exposing the missing support/bridge fields;
- generic board/panel Auto stacks still publish supported screening
  answers without route-required physical inputs after the guard;
- the implementation requires formula retuning, confidence wording,
  source-row imports, or broad UI changes to make the result acceptable;
- the implementation becomes a product-id blacklist instead of a
  defensible material-semantics predicate;
- a broad `screening_fallback` guard parks legitimate massive-core
  lined-massive or heavy-core routes.

### How To Recognize A Bad Direction Early

Stop before finishing the implementation if the before/after matrix
shows any of these patterns:

- more than the generic board/panel/membrane Auto ambiguity surface
  changes;
- massive-core controls change from `bounded_prediction` or their
  currently pinned screening posture to `needs_input`;
- support fields disappear for partial topology;
- UI-visible behavior would need a frontend workaround while the API
  still returns a supported screening result;
- the only way to preserve existing tests is to loosen metric/basis
  assertions or remove missing-input assertions.

If the guard fails these checks, the next safe path is not another
classifier patch. Keep runtime at the baseline checkpoint and write an
explicit material/topology input-surface plan for massive gypsum intent
instead.

## Risk Register

| Risk | How it could happen | Mitigation |
| --- | --- | --- |
| Breaking true lined-massive/heavy-core routes | Guard treats concrete/AAC/brick/CLT as board-like because the visible leaf was collapsed or composite | Preserve massive-core positive tests and inspect original/material text for composite leaves |
| Hiding a valid massive gypsum use case | Generic `gypsum_board 100` may represent a real massive gypsum substrate | Keep explicit lined-massive topology path; consider future `massive_gypsum_panel` / `gypsum_block` material |
| Moving field/building outputs unexpectedly | Lab family change leaks into field/building adapters | Include field/building controls only after lab matrix is understood; do not change adapters |
| Overfitting to one material id | A `gypsum_board` blacklist misses acoustic gypsum, silentboard, MLV, plywood, etc. | Use material semantics, not one product id |
| Broadly parking all screening fallbacks | A boundary patch catches concrete/AAC/brick/CLT screening lanes too | Do not patch by `screening_fallback` alone; guard the Auto family selection or board-only boundary |
| UI-only fix masks engine issue | Workbench displays inputs while API still publishes supported screening | Fix/contract engine behavior first; UI smoke is secondary |
| Formula retune sneaks in | Attempt to make old/new values line up by changing curve math | Retunes are out of scope; stop if formulas need changes |

## Similar-Surface Watchlist

After any accepted guard, run or add representative probes for:

- thick enhanced gypsum/acoustic boards;
- high-density silent/security/diamond boards;
- cement board and other dense lining boards;
- plywood/OSB-like panels if present in the material catalog;
- limp-mass membrane layers such as MLV;
- composite visible leaves where a finish layer is contiguous with a
  true massive substrate;
- field/building variants of the lab controls if the lab classifier
  moves.

The expected pattern is not that all these stacks become unsupported.
The expected pattern is that ambiguous board/panel Auto stacks stop
publishing a supported answer without route-required physical inputs,
while true massive-substrate stacks remain calculable through their
owned/pinned routes.

## Selected Next Status

This safety implementation does not supersede the current selected Gate
EU numeric coverage/accuracy rerank. It is a bounded follow-up fix for
the thick-board route-family ambiguity. Future work can continue the
active selected-next chain unless another source-of-truth review selects
a new calculator slice.
