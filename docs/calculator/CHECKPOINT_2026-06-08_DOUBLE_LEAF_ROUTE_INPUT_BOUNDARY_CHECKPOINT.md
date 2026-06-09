# Checkpoint 2026-06-08 - Double-Leaf Route-Input Boundary

Document role: docs/implementation reconciliation after commit
`fb0ea67 Fix double-leaf route input boundary`. This checkpoint
supersedes
[CHECKPOINT_2026-06-08_GATE_ET_BOUNDARY_HANDOFF.md](./CHECKPOINT_2026-06-08_GATE_ET_BOUNDARY_HANDOFF.md)
only for the current pause point and validation evidence. It does not
replace the Gate ES/ET plan and does not claim Gate EU has landed.

## Product Guard

DynEcho remains an acoustic calculator. The product goal is not to crawl
every source row, build a finite layer-combination library, or tune
confidence wording. Users enter wall/floor layers plus the physical
inputs required by the selected route; the engine should first use an
owned exact measured answer when one truly matches, then a compatible
anchor when physically valid, then the best owned family formula. If the
formula route needs physical inputs, the answer must stop as
`needs_input` with exact fields instead of publishing a diagnostic or
screening value.

This checkpoint is a boundary-preservation fix in that product goal: it
prevents incomplete flat double-leaf-like wall stacks from showing a
screening answer while the required double-leaf topology/support inputs
are missing.

## Landed Implementation

Landed commit:

`fb0ea67 Fix double-leaf route input boundary`

Touched implementation files:

- `packages/engine/src/calculate-assembly.ts`
- `packages/engine/src/acoustic-calculator-answer-engine-v1-contract.test.ts`

Runtime posture:

- flat `leaf / porous absorber / leaf` wall stacks without explicit
  double-leaf topology now park requested wall airborne outputs as
  `needs_input`;
- the boundary no longer applies only to `gypsum_board` /
  `acoustic_gypsum_board`; it uses physical leaf-like material behavior
  and category checks for board/mass/membrane leaves;
- partial route input such as cavity depth alone keeps route inputs
  visible and keeps the answer parked until leaf groups, support
  topology, and support spacing are supplied;
- complete topology still calculates through the owned double-leaf /
  framed formula route;
- this moved no formula values, imported no source rows, and did not
  turn broad measured-row inventory into the product direction.

Pinned examples:

- `gypsum_board / rockwool / gypsum_board` missing topology stays
  `needs_input`;
- `gypsum_board / rockwool / acoustic_gypsum_board` missing topology
  stays `needs_input`;
- `diamond_board / rockwool / silentboard` missing topology stays
  `needs_input`, while complete topology calculates;
- `cement_board / rockwool / cement_board` missing topology stays
  `needs_input`;
- `gypsum_board / rockwool / firestop_board` missing topology stays
  `needs_input`.

## Follow-Up Analysis - Thick Board Vs Lined Massive Ambiguity

After the checkpoint, a workbench probe found a related route-family
ambiguity:

`gypsum_board 12.5 / rockwool 50 / gypsum_board 100`

With no explicit wall topology, thin and moderate right-leaf gypsum
variants stay in the post-checkpoint double-leaf `needs_input` lane.
Once the right gypsum leaf reaches about 82.4 mm, the engine can select
`lined_massive_wall` with basis `screening_mass_law_curve_seed_v3`
instead. The immediate reason is surface mass: the catalog density for
`gypsum_board` is 850 kg/m3, so 100 mm is about 85 kg/m2 and crosses the
dominant-leaf signal used by the lined-massive selector.

This is not a simple "the current behavior is always wrong" finding. If
the user intended a massive gypsum substrate with a light lining, the
lined-massive family can be physically plausible and some double-leaf
support inputs may matter less. But the generic `gypsum_board` material
still has board/panel semantics. A flat board / porous absorber / board
stack can still depend on cavity depth, absorber state, support
topology, bridge class, and support spacing through mass-air-mass and
stud/support coupling behavior. Therefore, a thickness threshold alone
is not a safe reason to hide route inputs or publish a screening answer.

Blast-radius probe:

- a broad "park every flat leaf / absorber / leaf screening fallback"
  guard is too aggressive;
- it would affect legitimate or historically pinned lined-massive /
  heavy-core paths such as concrete, AAC, brick, CLT/mass-timber, or
  membrane-on-massive-substrate stacks;
- the safer future fix is to refine family classification or the
  boundary so board-like panel leaves do not become massive substrates
  from surface mass alone, while true massive-core substrates keep their
  current lined-massive behavior.

Any implementation of this follow-up must pin at least:

- thick `gypsum_board` / rockwool / `gypsum_board` without explicit
  topology does not silently lose required route-input visibility;
- concrete/AAC/brick/CLT lined-massive or heavy-core rows stay on their
  existing owned or pinned runtime/boundary posture;
- explicit double-leaf topology still calculates or asks only for the
  remaining route-required support fields.

Dedicated implementation-safety plan:
[POST_V1_THICK_BOARD_AUTO_FAMILY_BOUNDARY_SAFETY_PLAN_2026-06-09.md](./POST_V1_THICK_BOARD_AUTO_FAMILY_BOUNDARY_SAFETY_PLAN_2026-06-09.md).
That plan must be read before any runtime or UI change for this
ambiguity. It keeps the first step no-runtime, requires a before/after
matrix, preserves concrete/AAC/brick/CLT massive-core pins, and defines
stop conditions if the blast radius is broader than generic board/panel
Auto classification.

References used during the follow-up review:

- NRC, "The transmission loss of double stud walls with layers of
  gypsum board installed inside the wall cavity":
  https://nrc-publications.canada.ca/eng/view/object/?id=768bf32f-8313-435f-ab85-8680efba61b2
- "Airborne sound insulation performance of lightweight double leaf
  walls with different stud types":
  https://pmc.ncbi.nlm.nih.gov/articles/PMC11666719/
- "Analysis of the transmission loss of double-leaf panels with an
  equivalent spring-mass model for studs":
  https://academic.oup.com/jom/article/doi/10.1093/jom/ufaa020/6042103

## Validation Evidence

Focused validation after the fix:

- `pnpm --dir packages/engine exec vitest run --maxWorkers=1 src/acoustic-calculator-answer-engine-v1-contract.test.ts`
- `pnpm --dir packages/engine typecheck`
- `git diff --check`
- focused adjacent wall/double-leaf route groups:
  `layer-combination-resolver-double-leaf-framed-wall-banded-runtime-corridor-contract.test.ts`,
  `calculator-model-first-physics-prediction-pivot-gate-q-double-leaf-framed-bridge-input-contract.test.ts`,
  `calculator-model-first-physics-prediction-pivot-gate-s-double-leaf-framed-bridge-runtime-contract.test.ts`,
  `calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts`,
  `post-v1-wall-heavy-core-lined-massive-bounded-runtime-basis-gate-dg-contract.test.ts`,
  `post-v1-wall-heavy-core-lined-massive-bounded-rule-gate-df-contract.test.ts`,
  `realistic-layer-combination-coverage-cartography.test.ts`, and
  `route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts`.

Broad validation:

- `pnpm calculator:gate:current` passed on 2026-06-08 with engine
  663 test files / 3629 tests passing, web 114 test files / 443 tests
  passing + 18 skipped, repo build 5 / 5, and whitespace guard passing.
- `pnpm build` passed on 2026-06-08. The known optional
  `sharp/@img` warnings from the proposal DOCX path remained non-fatal.

Additional matrix/browser checks:

- engine matrix over 5929 leaf-like left/right material pairs found
  `suspicious: 0` for incomplete topology publishing `Rw` while complete
  topology was calculable;
- Playwright desktop click-through checked gypsum/rockwool/gypsum,
  acoustic gypsum, thickness changes, diamond/silentboard, cement board,
  complete topology, and a non-leaf right-edge case;
- Playwright mobile viewport checked the core
  gypsum/rockwool/gypsum route-input visibility and cavity-entry flow.

## Docs/Implementation Sync Findings

The current post-V1 plan remains directionally correct: Gate ET is
closed, and Gate EU remains the selected next calculator step:

`post_v1_next_numeric_coverage_gap_gate_eu_plan`

However, the selected Gate EU contract file named by the docs is not
present in the current implementation tree:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-eu-contract.test.ts`

This is an open docs/implementation handoff gap, not proof that Gate EU
has landed. The next Gate EU turn must either create that selected
contract file as part of the rerank or update the selected-next
documentation if a fresh source-of-truth review changes the selected
action.

## Selected Next

The next calculator action remains Gate EU numeric coverage/accuracy
rerank. It should subtract:

- the now-closed Gate ER direct-fixed field/building runtime;
- the Gate ET reinforced-concrete visible-derived boundary refresh;
- the `fb0ea67` double-leaf route-input boundary preservation fix;
- closed repeats, source crawling, finite scenario packs, confidence
  wording, and generic UI polish.

Gate EU should then select the highest-ROI calculator scope/accuracy
slice. It must improve calculable scope or numeric/boundary correctness
without weakening existing `needs_input` / `unsupported` boundaries.
