# Checkpoint 2026-05-21 - Layer Combination Resolver Double-Leaf Coverage Refresh Revalidation

Document role: clean resume point after the double-leaf/framed wall
coverage refresh landed and before the next post-double-leaf
revalidation gate starts. Read this after `CURRENT_STATE.md` and before
editing the next selected slice.

## Product Guardrail

DynEcho remains an acoustic calculator, not a source catalog. The
implementation path still matches the current plan:

1. exact same-topology, same-basis measured rows win first;
2. compatible measured rows can act as anchors only through owned
   similarity lanes;
3. source-absent family solvers must own the physical input contract,
   basis, value pins, rating adapter, and error budget;
4. missing or unowned physical context must return `needs_input` or
   `unsupported`, not a guessed high-confidence result.

The current line is the layer-combination resolver candidate surface,
not a broad source crawl.

## Landed Since The Prior Checkpoint

Latest landed gate:

`layer_combination_resolver_double_leaf_framed_wall_banded_coverage_refresh_plan`

Selection status:

`layer_combination_resolver_double_leaf_framed_wall_banded_coverage_refresh_landed_no_runtime_selected_post_double_leaf_revalidation`

Landed contract:

`packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh-contract.test.ts`

Runtime/export surface:

`packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-coverage-refresh.ts`

Current-gate runner:

`tools/dev/run-calculator-current-gate.ts`

The gate is no-runtime. It adds an executable coverage ledger for the
already promoted double-leaf/framed wall source-absent formula basis and
keeps public values frozen.

## Implementation vs Docs Reconciliation

Docs and implementation now agree on the active handoff:

- `AGENTS.md`, `CURRENT_STATE.md`, `NEXT_IMPLEMENTATION_PLAN.md`, this
  checkpoint, and
  `ACTIVE_LAYER_COMBINATION_GENERALIZATION_PLAN_2026-05-21.md` all say
  the coverage refresh has landed and the selected next action is the
  post-double-leaf revalidation gate.
- `packages/engine/src/index.ts` exports the coverage refresh module.
- `tools/dev/run-calculator-current-gate.ts` includes the coverage
  refresh contract in the current calculator gate.
- The planned next file does not exist yet, which is expected:
  `packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts`.

The only doc drift found during this checkpoint review was stale resume
copy in top-level docs that still pointed at earlier layer-combination
resolver gates. That copy has been updated to point at this checkpoint
and the post-double-leaf revalidation next action.

## Current Value Pins

All current values are element-lab, source-absent, not-measured family
physics values on:

`layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_formula_corridor`

Selected candidate:

`candidate_layer_combination_resolver_double_leaf_framed_wall_banded_source_absent_family_solver`

Pinned rows:

- independent absorbed double-leaf/framed wall: `Rw 45`, STC 45,
  `C -1`, `Ctr -6.1`, with `+/-7 dB` Rw/STC budget;
- resilient both-sides double-leaf/framed wall: `Rw 46`, STC 46,
  `C -1.1`, `Ctr -6.2`, with `+/-8 dB` Rw/STC budget;
- resilient one-side double-leaf/framed wall: `Rw 45`, STC 45,
  `C -1.1`, `Ctr -6.2`, with `+/-8 dB` Rw/STC budget.

These are not measured evidence. Exact measured rows still have
precedence when topology, basis, and metrics truly match.

## Explicit Boundaries Still In Force

The coverage refresh keeps these out of the runtime lane:

- missing `resilientBarSideCount` for resilient-channel double-leaf
  walls: `needs_input`;
- overlapping side/cavity/internal leaf layer ownership:
  `needs_input`;
- direct-fixed double-leaf walls: separate lane, not borrowed from the
  framed/resilient solver;
- grouped triple-leaf or multicavity walls: separate lane, not collapsed
  into double-leaf;
- `field_between_rooms` overlays: separate field basis, do not rewrite
  element-lab candidate trace pins;
- building prediction: unsupported until building/flanking owners exist;
- floor impact transfer from this wall lane: unsupported;
- ASTM/IIC/AIIC aliases from this wall lane: unsupported;
- tolerance retune and broad source crawl: blocked until selected by a
  later revalidation gate.

## Selected Next Action

Next gate:

`layer_combination_resolver_post_double_leaf_framed_wall_banded_coverage_revalidation_plan`

Next file:

`packages/engine/src/layer-combination-resolver-post-double-leaf-framed-wall-banded-coverage-revalidation-contract.test.ts`

Purpose:

- revalidate the resolver matrix after the double-leaf coverage refresh;
- confirm single-leaf, double-leaf, helper-only floor, open-box/open-web,
  field/building, and ASTM/IIC boundaries still line up;
- rank the next bounded solver-family owner or matrix refresh;
- avoid runtime value movement unless the contract explicitly selects it.

Do not start a broad source crawl from this checkpoint.

## Validation At Checkpoint

Latest validation from this checkpoint pass:

- focused double-leaf/resolver chain:
  `9 files / 46 tests` passed;
- `pnpm build` passed;
- `pnpm calculator:gate:current` passed with engine `508 files / 2889
  tests`, web `94 files / 388 passed + 18 skipped`, repo build `5 / 5`,
  and whitespace guard clean;
- `git diff --check` passed.

Known non-fatal warnings:

- optional `sharp/@img` warnings from the DOCX/PDF build path;
- Zustand storage warnings in Vitest runtime where browser storage is
  intentionally unavailable.

## Commit Hygiene Note

The working tree includes source/docs changes that belong to the
calculator checkpoint, plus unrelated generated or local artifacts that
must not be committed:

- `.playwright-cli/`;
- `apps/web/output/`;
- `output/`;
- `tmp/`;
- local PDF files at the repository root;
- generated `apps/web/tsconfig.tsbuildinfo` changes unless explicitly
  selected by a later build-artifact policy.

If committing this checkpoint, stage source, tests, runner, and docs
only.
