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
