# Checkpoint - 2026-06-07 Docs / Implementation Sync After Gate EP

## Scope

This checkpoint records the post-V1 engine state after
`post_v1_next_numeric_coverage_gap_gate_ep_plan` and the docs /
implementation reconciliation before starting Gate EQ.

This is calculator planning and verification work only. It is not source
crawling, confidence wording, frontend work, report polish, storage/auth
work, or a finite scenario pack.

## Current Selected Action

Current selected next action:

`post_v1_wall_direct_fixed_double_leaf_field_building_adapter_owner_gate_eq_plan`

Selected Gate EQ file:

`packages/engine/src/post-v1-wall-direct-fixed-double-leaf-field-building-adapter-owner-gate-eq-contract.test.ts`

Selected candidate:

`wall.direct_fixed_double_leaf_field_building_adapter_owner_gap`

Gate EP/EQ plan:

`docs/calculator/POST_V1_GATE_EP_EQ_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_PLAN_2026-06-07.md`

Gate EP is a no-runtime numeric coverage/accuracy rerank. It selected
Gate EQ after two ROI plan iterations and moved no runtime values.

## Implementation Evidence

Gate EO closed the element-lab direct-fixed double-leaf bridge-loss
route. The representative direct-fixed empty-cavity stack now selects
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
and calculates:

- `Rw 31`
- `STC 31`
- `C -1.2`
- `Ctr -5.9`

The same complete direct-fixed wall still has the exact Gate EP gap:

- complete `field_between_rooms` `R'w` / `Dn,w` / `DnT,w` requests are
  supported, but still select `candidate_multileaf_screening_fallback`
  with method `screening_mass_law_curve_seed_v3`;
- complete `building_prediction` `R'w` / `Dn,w` / `DnT,w` requests are
  still unsupported with method
  `dynamic_calculator_building_prediction_runtime_adapter_owner_missing`;
- missing `receivingRoomRt60S` remains `needs_input`;
- missing `supportSpacingMm` remains the Gate EO `needs_input`
  boundary;
- lab `Rw` / STC / `C` / `Ctr` still do not alias into field/building
  `R'w` / `Dn,w` / `DnT,w`.

This confirms Gate EQ is still the right next gate. It should prove the
direct-fixed double-leaf field/building adapter owner before any runtime
field/building value movement.

## Docs Compared And Updated

The following docs were reconciled against the current implementation
and Gate EP/EO contract evidence:

- `AGENTS.md`
- `docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/POST_V1_CALCULATOR_CAPABILITY_PLAN_2026-05-25.md`
- `docs/calculator/POST_V1_HIGH_ROI_SCOPE_ACCURACY_GATES_AFTER_GATE_CD_PLAN_2026-06-02.md`
- `docs/calculator/POST_V1_GATE_EP_EQ_WALL_DIRECT_FIXED_DOUBLE_LEAF_FIELD_BUILDING_ADAPTER_PLAN_2026-06-07.md`

Stale historical selected-next warnings were adjusted so Gate EL and
Gate CO are not treated as the active next action. The active next action
is Gate EQ.

## Open Gaps

1. Gate EQ is not implemented yet. It must be no-runtime and must prove
   the direct-fixed double-leaf field/building adapter owner and exact
   required physical inputs.
2. The future runtime gate after Gate EQ is not implemented yet. That
   gate should be the value-moving step that corrects complete
   field_between_rooms fallback and opens complete building_prediction
   for the selected direct-fixed subset.
3. The repo-wide current gate is red on a reinforced-concrete
   visible-derived missing-input expectation. This is independent of the
   Gate EP selection but blocks a clean checkpoint commit.
4. The worktree contains many unrelated frontend, shared, and historical
   engine files from other work. Do not stage broad changes blindly.

## Validation

Focused Gate EO/EP validation passed:

`pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-runtime-gate-eo-contract.test.ts src/post-v1-next-numeric-coverage-gap-gate-ep-contract.test.ts --maxWorkers=1`

Result: 2 files / 10 tests passed.

Focused Gate EM/EN/EO/EP chain validation passed:

`pnpm --filter @dynecho/engine exec vitest run src/post-v1-next-numeric-coverage-gap-gate-em-contract.test.ts src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-owner-gate-en-contract.test.ts src/post-v1-wall-direct-fixed-double-leaf-bridge-loss-runtime-gate-eo-contract.test.ts src/post-v1-next-numeric-coverage-gap-gate-ep-contract.test.ts --maxWorkers=1`

Result: 4 files / 20 tests passed.

Repo-wide current gate was attempted:

`NEXT_DIST_DIR=.next-gate-ep pnpm calculator:gate:current`

Result: failed in the engine final-audit focused gate. Summary:
4 failed files / 655 passed files, 4 failed tests / 3605 passed tests.

Failing files:

- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bo-reinforced-concrete-low-confidence-cleanup-contract.test.ts`
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bp-reinforced-concrete-cleanup-surface-parity-contract.test.ts`
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bq-coverage-matrix-refresh-after-reinforced-concrete-cleanup-contract.test.ts`
- `packages/engine/src/company-internal-final-internal-use-rehearsal-contract.test.ts`

Failure shape: reinforced-concrete visible-derived needs-input rows
expected `ceilingOrLowerAssembly` in `missingPhysicalInputs`, but the
runtime now reports only `resilientLayerDynamicStiffnessMNm3` and
`loadBasisKgM2`.

`git diff --check` passed after this checkpoint docs sync.

## Commit Decision

Do not create a checkpoint commit from this state. The focused Gate EP
chain is green, but the repo-wide current gate is red and the worktree
contains many unrelated modified/untracked files. A commit should wait
until the reinforced-concrete visible-derived expectation is triaged or
the user explicitly requests a partial checkpoint commit.
