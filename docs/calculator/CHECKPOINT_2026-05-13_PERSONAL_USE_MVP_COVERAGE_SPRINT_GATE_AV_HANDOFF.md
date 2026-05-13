# Gate AV Post-Release Accuracy And Adapter Roadmap - 2026-05-13

Landed action:

`gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_plan`

Selection status:

`gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_landed_no_runtime_selected_source_absent_solver_gap_cartography_gate_aw`

Selected next action:

`gate_aw_personal_use_mvp_source_absent_solver_gap_cartography_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aw-source-absent-solver-gap-cartography-contract.test.ts`

## Summary

Gate AV lands as a no-runtime roadmap gate after the Gate AU
company-internal daily-use handoff. It does not change runtime values,
source rows, tolerance/error budgets, workbench inputs, API payload
values, cards, reports, or basis labels.

The roadmap preserves the calculator-first rule:

- exact measured/source rows win only when route, topology, metric, and
  basis truly match;
- source-absent assemblies should calculate from the best owned
  family-specific model when the physical input contract is complete;
- missing physical owner fields return `needs_input`;
- lab, field, building-prediction, ISO, and ASTM bases stay separate;
- broad source-row crawling is lower priority than mapping and closing
  source-absent solver gaps.

Gate AV selects Gate AW source-absent solver gap cartography so the next
implementation pass maps realistic wall and floor layer combinations
before any new runtime formula corridor is promoted.

## Next Gate

Gate AW should add:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aw-source-absent-solver-gap-cartography-contract.test.ts`

Gate AW must be executable cartography, not runtime movement. It should
enumerate current exact-source, formula-supported, `needs_input`, and
unsupported surfaces across wall lab, wall field/building,
opening/leak, floor impact lab, floor field, ASTM boundaries, and
hostile mixed-layer assemblies. It should rank the highest-ROI
source-absent solver gap by coverage impact and accuracy risk.

## Validation

Validation completed on 2026-05-13:

1. focused Gate AV engine contract passed: 1 file / 7 tests;
2. Gate AU + Gate AV continuity passed: 2 files / 13 tests;
3. `pnpm calculator:gate:current` passed with engine 389 files / 2247
   tests, web 75 files / 321 passed + 18 skipped, and build 5/5;
4. `git diff --check` passed.
