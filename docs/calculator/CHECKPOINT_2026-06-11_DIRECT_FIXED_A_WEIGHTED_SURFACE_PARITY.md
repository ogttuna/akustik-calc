# Checkpoint - Direct-Fixed A-Weighted Surface Parity - 2026-06-11

## Purpose

This checkpoint reconciles the current documentation, implementation,
and validation state after the direct-fixed double-leaf/framed
A-weighted field/building surface parity slice.

DynEcho's calculator direction remains unchanged: expand defensible
calculator scope and accuracy for user-entered layer stacks. This
checkpoint is not a new source crawl, catalog lane, UI polish task, or
process-only objective.

## Current Landed State

The latest landed slice is:

`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_plan`

Implementation file:

`apps/web/features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts`

Status:

`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_surface_parity_landed_no_runtime_selected_coverage_refresh`

It follows the runtime owner:

`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_owner_plan`

Runtime owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts`

The engine and workbench agree on the direct-fixed A-only field/building
values:

- empty direct-fixed: `Dn,A 24.9` / `DnT,A 27`;
- full context-owned absorptive cavity: `Dn,A 28.9` / `DnT,A 31`;
- partial context-owned absorptive cavity: `Dn,A 26.9` / `DnT,A 29`.

Field requests use
`gate_i_airborne_field_apparent_context_adapter_runtime`. Building
requests use
`gate_ar_airborne_building_prediction_all_owner_runtime_corridor`. Both
use
`wall.direct_fixed_double_leaf.equivalent_coupled_mass_bridge_loss_owner`
as the Gate EO direct separating-element curve.

## Implementation Reconciliation

The implementation matches the active handoff docs:

- `tools/dev/run-calculator-current-gate.ts` includes the direct-fixed
  A-weighted engine owner and web surface parity tests.
- The engine owner test pins field and building `Dn,A` / `DnT,A` for
  empty, full absorptive, and partial absorptive direct-fixed contexts.
- The web surface parity test verifies live calculation, calculator API
  payloads, saved replay, server snapshot replay, output cards,
  target-output status, and report summaries.
- Boundary rows remain explicit: missing absorber ownership, Gate AY
  panelized input, non-direct-fixed absorptive stacks, ASTM/IIC/AIIC,
  impact outputs, and lab aliases stay outside the A-weighted
  field/building owner.
- The workbench advanced-wall surface now admits context-owned
  cavity-only input so the typed absorber flow-resistivity ownership can
  reach the direct-fixed formula route without using the broader Gate AY
  source-absent panel route.

No source rows were imported and no formula was retuned in the surface
parity slice.

## Open Gap

The selected next action is still the right next action:

`post_v1_wall_double_leaf_framed_direct_fixed_a_weighted_field_building_coverage_refresh_plan`

Selected next file:

`packages/engine/src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-coverage-refresh-contract.test.ts`

As of this checkpoint, that selected next contract file has not landed.
This is expected. It should be the next implementation slice before
reranking a new high-ROI candidate.

The coverage refresh should re-probe the three A-weighted value groups,
assert the Gate I / Gate AR runtime bases and Gate EO direct curve stay
registered, and keep the boundary rows outside the route. It should not
move new runtime values, import source rows, retune formulas, or touch
frontend implementation.

## Validation

The checkpoint state was validated with:

- `pnpm --filter @dynecho/web exec vitest run features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts --maxWorkers=1`
  - result: 4 tests passed;
- `pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-owner-contract.test.ts --maxWorkers=1`
  - result: 5 tests passed;
- `pnpm --filter @dynecho/web exec vitest run features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-context-absorptive-cavity-field-building-adapter-surface-parity.test.ts features/workbench/post-v1-wall-double-leaf-framed-direct-fixed-a-weighted-field-building-surface-parity.test.ts --maxWorkers=1`
  - result: 8 tests passed;
- `pnpm calculator:gate:current`
  - result: passed;
  - engine: 703 test files, 3885 tests passed;
  - web: 126 test files, 492 tests passed, 18 skipped;
  - build: 5 tasks successful;
- `git diff --check`
  - result: passed.

The only observed non-fatal validation noise was the known optional
`sharp` / `@img` warning emitted through `@turbodocx/html-to-docx`,
plus existing `zustand persist middleware` storage-unavailable stderr
from saved-replay web tests. Both occurred with passing exit status.

## Commit Posture

This is a reasonable stopping point after committing the calculator
code, tests, and docs that belong to the current checkpoint.

Do not include unrelated workspace artifacts in the checkpoint commit,
including local PDFs, generated `output/`, `tmp/`, `.playwright-cli/`,
or Next TypeScript build-info files.
