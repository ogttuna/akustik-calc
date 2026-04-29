# Checkpoint - Internal Use Acceptance Rehearsal Gate C Closeout Handoff

Date: 2026-04-29

Status: Gate C landed no-runtime. `internal_use_acceptance_rehearsal_v1`
is closed and `internal_use_pilot_handoff_v1` is selected.

## What Closed

`packages/engine/src/post-internal-use-acceptance-rehearsal-v1-next-slice-selection-contract.test.ts`
closes the acceptance rehearsal after Gate A landed the 20-scenario
company-internal matrix.

The closeout confirms:

- no acoustic formula or runtime value changed;
- no support, confidence, evidence tier, API shape, route-card value,
  output-card status, proposal/report copy, or workbench input behavior
  moved;
- the acceptance matrix is evidence for controlled company use, not a
  permission to promote source-gated families;
- no concrete acceptance defect was found;
- no source-ready accuracy pack is available for immediate runtime
  import.

## Selected Next Slice

Selected slice:

`internal_use_pilot_handoff_v1`

Next implementation file:

`packages/engine/src/internal-use-pilot-handoff-v1-gate-a-contract.test.ts`

Planning surface:

`docs/calculator/SLICE_INTERNAL_USE_PILOT_HANDOFF_V1_PLAN.md`

Gate A should prepare a no-runtime company-internal pilot handoff pack:
scenario buckets, validation evidence, known gaps, and an operator
checklist. It should not change runtime behavior or promote any
low-confidence/source-gated/screening family.

## Preserved Evidence

Gate A proof:

`packages/engine/src/internal-use-acceptance-rehearsal-v1-gate-a-contract.test.ts`

The landed acceptance matrix covers:

- ready wall benchmarks and exact/bound floor source corridors;
- caveated timber, CLT, lined/heavy-core, and generated floor fallback
  routes;
- many-layer and layer-reorder guardrails;
- invalid thickness fail-closed behavior;
- unsupported-output partitioning;
- cross-package proof owners for missing-input, API, route-card, and
  save/load replay surfaces.

## Source-Ready Accuracy Decision

Runtime import remains blocked for:

- timber double-board stud walls;
- CLT / mass-timber walls;
- lined/heavy-core walls;
- no-stud double-leaf walls;
- generated floor fallback families;
- historical blocked floor families such as `GDMTXA04A`, `C11c`, and
  raw open-box/open-web.

Each still lacks at least one required source-ready element: exact
topology and material-thickness mapping, metric owner, tolerance owner,
negative boundary tests, or paired engine/web visible tests.

## Validation

Completed for this checkpoint:

- targeted Gate C contract: green, 1 file / 5 tests;
- `pnpm calculator:gate:current`: green, engine 138 files / 661 tests,
  web 45 files / 216 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean;
- `git diff --check`: clean.

Reserve `pnpm check` for the selected pilot handoff release-candidate
gate or any runtime/web-visible behavior movement.
