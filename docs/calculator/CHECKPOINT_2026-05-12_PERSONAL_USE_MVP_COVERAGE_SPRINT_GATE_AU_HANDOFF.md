# Gate AU Daily-Use Release Handoff - 2026-05-12

Landed action:

`gate_au_personal_use_mvp_daily_use_release_handoff_plan`

Selection status:

`gate_au_personal_use_mvp_daily_use_release_handoff_landed_selected_post_release_accuracy_roadmap_gate_av`

Selected next action:

`gate_av_personal_use_mvp_post_release_accuracy_and_adapter_roadmap_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-av-post-release-accuracy-and-adapter-roadmap-contract.test.ts`

## Summary

Gate AU is the company-internal daily-use ready release handoff for the
Personal-Use MVP Coverage Sprint. It does not change runtime values,
workbench inputs, API shape, visible cards, source precedence, or
tolerance/error budgets.

Gate AU consumes the Gate AT 41-row acceptance matrix and records the
release decision as:

`company_internal_daily_use_ready_with_visible_basis_budgets_needs_input_and_unsupported_boundaries`

The handoff accepts:

- 26 rows with supported visible value pins;
- 16 rows that intentionally fail closed as `needs_input`,
  `unsupported`, basis-boundary, unsupported-metric, or hostile-input
  refusals;
- zero coverage gaps;
- zero daily-use release blockers.

The ready operating envelope covers wall and floor routes across lab,
field, and building-prediction bases where explicit owners exist. Lab,
field, building-prediction, and ASTM rating bases remain separate.
Missing owner fields still return `needs_input` with exact field names,
not guessed results.

## Residual Risks

These are post-release risks, not blockers for company-internal
daily-use ready status:

- source-absent formula budget tightening still requires source-owned
  holdouts and residual policy gates;
- opening/leak building `R'w` / `DnT,w` remains unsupported until a
  building-basis adapter owns that route;
- ASTM `IIC` / `AIIC` remains unsupported until a named rating adapter
  owns the basis;
- direct tolerance or formula retune without holdouts remains blocked.

Gate AU selects the post-release accuracy roadmap for Gate AV so the next
work ranks calibration, budget tightening, and adapter expansion without
moving runtime values prematurely.

## Validation

Validation completed on 2026-05-13:

1. focused Gate AU engine contract passed: 1 file / 6 tests;
2. Gate AT + Gate AU continuity passed: 2 files / 12 tests;
3. `pnpm --filter @dynecho/engine typecheck` passed;
4. `pnpm calculator:gate:current` passed with engine 388 files / 2240
   tests, web 75 files / 321 passed + 18 skipped, and build 5/5;
5. broad validation components passed after one transient web timeout:
   the first `pnpm check` run passed lint/typecheck and the full engine
   suite, engine 513 files / 3042 tests, then hit a timeout in the web
   deep-hybrid heavy-core scan; targeted rerun of that web file passed 3
   / 3 tests, full `pnpm --filter @dynecho/web test` passed 181 files /
   996 passed + 18 skipped, and `pnpm build` passed 5/5 with only the
   known optional `sharp/@img` warnings;
6. `git diff --check` passed after the validation-doc sync.
