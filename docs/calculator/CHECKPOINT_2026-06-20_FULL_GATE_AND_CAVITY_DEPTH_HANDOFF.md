# Checkpoint 2026-06-20 Full Gate And Cavity-Depth Handoff

## Purpose

This checkpoint reconciles the live calculator documents, current
implementation posture, and broad test gate after the route-input
effectiveness UI work and the latest workbench test expectation fixes.
It is a calculator checkpoint, not a replacement for the selected runtime
implementation slice.

The product direction remains unchanged: DynEcho must calculate more
user-entered acoustic layer combinations with defensible physics, correct
metric bases, explicit route-required inputs, and precise `needs_input`
/ `unsupported` boundaries.

## Post-Checkpoint Implementation Supersession - 2026-06-20

This checkpoint is now historical for the cavity-depth owner status. The
section below that says the selected owner contract file is not present
was true at checkpoint creation, but it is no longer the current
implementation state.

Current implementation state:

- `post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_owner_plan`
  has landed in
  `packages/engine/src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-owner-contract.test.ts`.
- `tools/dev/run-calculator-current-gate.ts` includes the owner contract
  in the current calculator gate.
- The owner opens advanced-only
  `advancedWall.cavities[0].depthMm` for the owned double-leaf/framed
  Gate S / Gate I / Gate AR route while keeping topology depth
  authoritative when both depth sources are supplied.
- Latest full `pnpm calculator:gate:current` after the owner landed
  passed: shared `2 files / 19 tests`, engine `787 files / 4318 tests`,
  web `127 files / 505 passed + 18 skipped`, and repo build `5/5`.
  Known non-fatal noise remains the existing Zustand persist storage
  warnings in web tests and optional `sharp/@img` warnings in Next build.
- Current selected next is now
  `post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_coverage_refresh_plan`
  /
  `packages/engine/src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-coverage-refresh-contract.test.ts`
  /
  `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CAVITY_DEPTH_NUMERIC_SENSITIVITY_COVERAGE_REFRESH_PLAN_2026-06-20.md`.
- That coverage-refresh contract is not implemented yet. It is the next
  short no-runtime regression boundary before the next runtime-first
  route-family rerank.

## Documents Reviewed

- `docs/calculator/DOCUMENTATION_MAP.md`
- `docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_AGENT_BRIEF.md`
- `docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CAVITY_DEPTH_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md`
- `docs/calculator/WORKBENCH_ROUTE_INPUT_EFFECTIVENESS_INDICATOR_PLAN_2026-06-19.md`
- `docs/calculator/CHECKPOINT_2026-06-19_DOUBLE_LEAF_FRAMED_PHYSICAL_INPUT_SENSITIVITY.md`

## Implementation vs Documentation

At checkpoint creation, the live authority docs agreed on the selected
next implementation:

`post_v1_wall_double_leaf_framed_cavity_depth_numeric_sensitivity_owner_plan`
/
`packages/engine/src/post-v1-wall-double-leaf-framed-cavity-depth-numeric-sensitivity-owner-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_DOUBLE_LEAF_FRAMED_CAVITY_DEPTH_NUMERIC_SENSITIVITY_OWNER_PLAN_2026-06-19.md`

At checkpoint creation, the selected plan was the right next calculator
move. It continued the user-material physical input coverage stream by
hardening
`cavity1DepthMm` / `advancedWall.cavities[].depthMm` as a numerically
active owned double-leaf/framed formula input. This improves calculator
accuracy for arbitrary user-entered double-leaf/framed stacks rather
than adding source rows or UI-only polish.

At checkpoint creation, the selected owner contract file was not present
yet. That gap has since been closed by the landed owner described in the
post-checkpoint supersession section above. The remaining current task is
the no-runtime coverage refresh, not the runtime owner.

At checkpoint creation, the latest landed calculator behavior was the
double-leaf/framed absorber-thickness numeric-sensitivity runtime owner
and its no-runtime coverage refresh. Those remain aligned with docs, but
they are no longer the latest landed behavior after the cavity-depth
owner:

- `absorberThicknessMm = 90`, `45`, and `20` remain protected lab pins.
- Field/building adapters derive from the same owned lab curve.
- Missing `flowResistivityPaSM2` and missing `supportSpacingMm` remain
  `needs_input`.
- Impact aliases such as `IIC` and `AIIC` remain `unsupported`.
- Direct-fixed double-leaf remains on the direct-fixed owner.

The recent workbench test expectation fixes are consistent with the
calculator rules:

- Composite-panel validation posture now matches the engine matrix as
  `Broadly covered`.
- Wall-selector output cards keep ready lab `Rw` visible while incomplete
  field/building outputs remain `needs_input`; lab values are not copied
  into field/building metrics.
- Long async workbench-store tests received explicit timeouts only; no
  calculator behavior moved.

## Remaining Gaps

- The selected cavity-depth numeric-sensitivity owner has since landed.
  The current immediate gap is its no-runtime coverage refresh contract.
- Keep support-only work bounded. The next slice should move or protect
  calculator behavior through a contract; do not start another docs-only
  loop unless a concrete blocker is found.
- The strategic gaps remain after the selected owner: building/flanking
  runtime, frequency-band backbone, companion metric completeness where
  curve basis exists, calibrated same-family holdouts, and residual
  families such as opening/leak/common-wall/open-web.
- The worktree still contains many unrelated changes from other agents.
  They are outside this checkpoint and must be committed separately by
  their owners.

## Validation

Latest broad validation:

- `pnpm check` passed on 2026-06-20 after the workbench expectation
  fixes. This covered lint, typecheck, engine/web tests, and build.
- Known non-fatal validation noise remains the optional `sharp/@img`
  package warnings during the Next build through
  `@turbodocx/html-to-docx`.

Focused validation behind the selected physical-input handoff is still
the 2026-06-19 checkpoint:

- targeted absorber-thickness coverage refresh passed;
- targeted bridge-support / absorber-thickness owner and coverage chain
  passed;
- `pnpm calculator:gate:current` passed;
- `git diff --check` passed.

## Commit Boundary

Safe checkpoint commit scope:

- this checkpoint document;
- live calculator handoff pointer updates;
- the three workbench test expectation/stability fixes that were
  verified by `pnpm check`.

Do not include unrelated report-assistant, proposal PDF, workbench
assistant, generated PDF/output, `.playwright-cli`, route-input
effectiveness implementation files, or other agent-owned changes in this
checkpoint commit unless their owner explicitly asks for that commit.
