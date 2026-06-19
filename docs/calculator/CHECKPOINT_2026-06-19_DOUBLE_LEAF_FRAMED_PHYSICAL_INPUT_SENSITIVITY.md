# Checkpoint 2026-06-19 Double-Leaf/Framed Physical Input Sensitivity

## Purpose

This checkpoint reconciles the current calculator implementation,
active docs, and test posture after the double-leaf/framed physical
input sensitivity slice. It is a calculator checkpoint, not a broad
source crawl or UI polish pass.

The product direction remains unchanged: DynEcho must calculate more
user-entered acoustic layer combinations with defensible physics,
correct metric bases, explicit route-required inputs, and precise
`needs_input` / `unsupported` boundaries.

## Current Implementation State

The latest landed no-runtime refresh is:

`post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_coverage_refresh_plan`

Landed file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-coverage-refresh-contract.test.ts`

Landed status:

`post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_coverage_refresh_landed_no_runtime_selected_cavity_depth_numeric_sensitivity_owner`

It protects the previously landed runtime owner:

`post_v1_wall_double_leaf_framed_porous_absorber_thickness_numeric_sensitivity_owner_plan`

Owner file:

`packages/engine/src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-owner-contract.test.ts`

Runtime implementation files involved in the physical-input sensitivity
chain:

- `packages/engine/src/dynamic-calculator-double-leaf-framed-bridge-solver-contract.ts`
- `packages/engine/src/dynamic-airborne-gate-s-double-leaf-framed.ts`
- `packages/engine/src/layer-combination-resolver-double-leaf-framed-wall-banded-formula-corridor.ts`
- `tools/dev/run-calculator-current-gate.ts`

## Implementation vs Documentation

The implementation and live docs are aligned on the current state:

- `absorberThicknessMm` is numerically active only in the owned
  double-leaf/framed porous damping route.
- Full-depth `90 mm` absorber in a `90 mm` cavity keeps lab
  `Rw/STC 46`, `C -1`, and `Ctr -6.1`.
- Half-depth `45 mm` returns lab `Rw/STC 44`.
- Thin `20 mm` returns lab `Rw/STC 43`.
- Field/building outputs derive from the same owned lab curve.
- No-thickness input preserves legacy behavior and does not add
  `absorberThicknessMm` to `requiredInputs`.
- Missing `flowResistivityPaSM2` and missing `supportSpacingMm` remain
  `needs_input`.
- Impact aliases such as `IIC` and `AIIC` remain `unsupported`.
- Direct-fixed double-leaf stays on the existing direct-fixed owner and
  does not receive independent-frame mass-air-mass boost.

The current selected next plan is still correct:

`post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CAVITY_DEPTH_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md`

This is a high-ROI continuation of the same user-material physical input
coverage stream. `cavityDepthMm` is already used by the owned formula
route through `massAirMassResonanceHz` and bounded cavity-depth credit.
A probe confirmed depth-sensitive values on the same stack:

- `60 mm` cavity: lab `Rw 44`, `STC 44`, `C -1.2`, `Ctr -6.4`
- `90 mm` cavity: lab `Rw 46`, `STC 46`, `C -1`, `Ctr -6.1`
- `140 mm` cavity: lab `Rw 47`, `STC 48`, `C -0.8`, `Ctr -5.8`

## Remaining Gaps

- The selected cavity-depth owner is planned but not implemented yet.
  It should formalize or correct depth sensitivity, required-input
  honesty, depth-source alignment, and field/building propagation.
- The broad strategic gaps remain: building/flanking runtime depth,
  frequency-band backbone, companion metric completeness where curve
  basis exists, calibrated same-family holdouts, and residual families
  such as opening/leak/common-wall/open-web. They should not displace
  the current selected physical-input owner unless a concrete blocker is
  found.
- Existing unrelated worktree changes from other agents are not part of
  this checkpoint and should be committed separately.

## Validation

Latest checkpoint validation:

- Targeted coverage refresh:
  `pnpm --filter @dynecho/engine exec vitest run src/post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-coverage-refresh-contract.test.ts --maxWorkers=1`
  passed with `1` file and `6` tests.
- Targeted owner/coverage chain:
  `post-v1-wall-double-leaf-framed-bridge-support-spacing-numeric-sensitivity-coverage-refresh-contract.test.ts`,
  `post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-owner-contract.test.ts`,
  and
  `post-v1-wall-double-leaf-framed-porous-absorber-thickness-numeric-sensitivity-coverage-refresh-contract.test.ts`
  passed with `3` files and `17` tests.
- Current calculator gate:
  `pnpm calculator:gate:current` passed with shared `2` files /
  `19` tests, engine `786` files / `4311` tests, web `127` files /
  `505` passed and `18` skipped, and repo build `5/5` packages.
- `git diff --check` passed.

Known non-fatal validation noise:

- Web focused tests may print Zustand persist storage warnings in the
  test environment.
- Next build may print optional `sharp/@img` package resolution warnings
  through `@turbodocx/html-to-docx`.

## Commit Boundary

Safe checkpoint commit scope:

- double-leaf/framed physical-input sensitivity runtime files,
- the new absorber-thickness coverage refresh contract,
- double-leaf/framed physical-input sensitivity plan docs,
- live calculator handoff docs,
- current gate runner.

Do not include unrelated report-assistant, proposal PDF, workbench
assistant, generated PDF/output, `.playwright-cli`, or other agent-owned
changes in this checkpoint commit.
