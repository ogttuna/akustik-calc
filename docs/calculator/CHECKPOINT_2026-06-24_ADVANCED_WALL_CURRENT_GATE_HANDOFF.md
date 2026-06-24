# Checkpoint 2026-06-24 Advanced-Wall Current Gate Handoff

## Purpose

This checkpoint records the docs/implementation reconciliation after
the wall Gate AR direct-curve building lab-companion
target-output-independence owner chain and the advanced-wall
source-absent field/building lab-companion target-output-independence
coverage refresh were wired into the current calculator gate.

It is a checkpoint, not a new runtime owner. It protects the current
calculator-first direction and makes the stop point explicit for other
agents working in the same tree.

## Documents Reviewed

- `AGENTS.md`
- `docs/calculator/DOCUMENTATION_MAP.md`
- `docs/calculator/CALCULATOR_SOURCE_OF_TRUTH.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/NEXT_AGENT_BRIEF.md`
- `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-18.md`
- `docs/calculator/POST_V1_WALL_ADVANCED_WALL_SOURCE_ABSENT_FIELD_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-18.md`
- `docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_GATE_AR_DIRECT_CURVE_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-24.md`
- `docs/calculator/POST_V1_WALL_GATE_AR_DIRECT_CURVE_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_OWNER_PLAN_2026-06-24.md`
- `docs/calculator/POST_V1_WALL_GATE_AR_DIRECT_CURVE_BUILDING_LAB_COMPANION_TARGET_OUTPUT_INDEPENDENCE_COVERAGE_REFRESH_PLAN_2026-06-24.md`

## Implementation Comparison

The active top-level docs select:

`post_v1_wall_advanced_wall_source_absent_field_building_lab_companion_target_output_independence_coverage_refresh_plan`

with implementation file:

`packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

The current gate runner includes the selected owner and refresh:

- `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-owner-contract.test.ts`
- `packages/engine/src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts`

The owner remains the runtime movement. Complete source-absent
advanced-wall `field_between_rooms` and `building_prediction` contexts
publish Gate AY lab companions for lab-only requests:

- `Rw 65`
- `STC 65`
- `C -1.1`
- `Ctr -6.4`

Mixed requests remain basis-separated: field `R'w 63`, building
`DnT,w 66`, and Gate AY lab companions stay on the lab basis.

The coverage refresh is still a valid support slice. It moves no runtime
values and protects the landed owner against regression. Missing
field/building context, incomplete Gate AY physical input, impact
metrics, ASTM/IIC/AIIC, OITC, broad source crawling, formula retuning,
and frontend changes remain outside this slice.

## Plan Reconciliation

The active plan is still logically valid as a no-runtime coverage
refresh for the advanced-wall owner. It is a good checkpoint boundary:
the selected behavior is in the current gate, the targeted owner/refresh
contract is green, and the full current gate is green.

Older sections in active docs and historical 2026-06-18 / 2026-06-19
plans contain further already-landed chains such as project/user
measured frequency lab companions and context-owned porous-cavity lab
companions. Treat those sections as historical evidence unless the
top-level source-of-truth, current-state, documentation-map, and
next-agent brief name them as current.

After this checkpoint, do not blindly resume an old selected-next note
from the middle of those historical sections. The next calculator task
should start with a fresh runtime-first rerank against the current
post-gate state, unless the user explicitly selects a known historical
owner.

## Validation

Targeted engine validation:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-owner-contract.test.ts \
  src/post-v1-wall-advanced-wall-source-absent-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts \
  --maxWorkers=1
```

Result: `2 files / 10 tests` passed.

Full current gate:

```bash
pnpm calculator:gate:current
```

Result:

- shared: `2 files / 23 tests` passed
- engine: `843 files / 4604 tests` passed
- web: `127 files / 508 passed / 18 skipped`
- repo build: `5/5 tasks` passed

Known non-fatal warnings:

- Zustand persist storage warnings in focused web tests.
- optional `sharp/@img` package warnings through
  `@turbodocx/html-to-docx` during Next build.

Whitespace guard:

```bash
git diff --check
```

Result: passed.

## Worktree Boundary

The worktree also contains concurrent unrelated changes from other
agents, especially Workbench V2 route-input presentation, impact
product catalog, material seed, and seed data files. Those are not part
of this checkpoint unless a later commit explicitly stages them.

## Progress Ledger

- Calculator behavior opened: no new runtime behavior in this
  checkpoint; it records and protects the already-landed advanced-wall
  source-absent lab-companion target-output independence owner.
- New calculable request shapes: `0` in this checkpoint; the protected
  owner remains `2`.
- New calculable target outputs: `0` in this checkpoint; the protected
  owner remains `8`.
- Required inputs captured: no new input fields; existing Gate AY
  advanced-wall physical inputs and field/building context requirements
  remain enforced.
- Runtime/formula values moved: `0` in this checkpoint; the protected
  owner remains `runtimeValuesMoved 8`.
- Support work done: active docs/implementation reconciliation,
  current-gate validation, and checkpoint handoff.
- Stop reason: this is a clean stop point because the current selected
  support slice is validated, runtime behavior is already protected by
  contracts, and the next runtime owner should be chosen by a fresh
  current-state rerank rather than by stale historical selected-next
  prose.
