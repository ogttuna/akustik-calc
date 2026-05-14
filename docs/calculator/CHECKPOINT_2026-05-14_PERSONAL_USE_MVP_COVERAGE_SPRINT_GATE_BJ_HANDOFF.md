# Personal-Use MVP Coverage Sprint Gate BJ Handoff

Date: 2026-05-14

Gate BJ has now landed:

`gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_plan`

Gate BJ selection status:

`gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_landed_selected_steel_floor_low_confidence_cleanup_gate_bk`

Selected Gate BK action:

`gate_bk_personal_use_mvp_steel_floor_low_confidence_fallback_cleanup_plan`

Selected Gate BK file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bk-steel-floor-low-confidence-fallback-cleanup-contract.test.ts`

Next plain label: steel-floor low-confidence fallback cleanup.

## What Landed

Gate BJ promotes the floor-impact field/building runtime corridor that
Gate BI selected. It is a runtime-producing slice, but it is still
strict about measurement basis:

- complete source-absent field-apparent floor impact returns
  `L'n,w 52.3` and `L'nT,w 49.9` on
  `mixed_predicted_plus_estimated_standardized_field_volume_normalization`;
- complete building-prediction direct+flanking input returns
  `L'nT,w 52.4` on
  `mixed_predicted_plus_estimated_standardized_direct_flanking_energy_sum`;
- exact-band impact-only direct+flanking input can support
  `L'n,w 57`, `L'nT,w 55`, and `L'nT,50 54` because that packet owns the
  low-frequency band input;
- direct+flanking field/building bases now resolve to medium confidence
  instead of falling through to the default low-confidence bucket.

The new structured adapter budget origin is:

`source_absent_field_building_adapter_error_budget`

Budget pins:

- field-volume `L'n,w`: `+/-5 dB`;
- field-volume `L'nT,w`: `+/-5.5 dB`;
- direct+flanking `L'n,w`: `+/-6 dB`;
- direct+flanking `L'nT,w`: `+/-6.5 dB`.

These budgets are visible not-measured runtime budgets. They are not
source-owned holdouts and they do not tighten lab `Ln,w` / `DeltaLw`
corridors.

## Protected Boundaries

Gate BJ keeps these boundaries closed:

- missing field/building impact context still returns `needs_input`;
- source-absent `L'nT,50` stays blocked until
  `lowFrequencyImpactSpectrumOrCI50_2500Owner` exists;
- `IIC` / `AIIC` remain unsupported ASTM boundaries;
- lab `Ln,w` / `DeltaLw`, field `L'n,w` / `L'nT,w`, building
  prediction, and low-frequency outputs remain basis-separated;
- exact source precedence and existing lab runtime values are unchanged.

## Why Gate BK Next

Gate BJ removes one live low-confidence fallback by giving owned
field/building floor-impact routes named runtime bases and structured
budgets. The next highest-value company-internal calculation-grade issue
is the steel-floor low-confidence fallback cleanup.

Gate BK should target complete steel-floor inputs that still fall back
to vague low-confidence or screening behavior. It should either promote
a named basis-compatible runtime corridor where physical owners are
complete, or return precise `needs_input` / `unsupported` boundaries.
It should not retune the existing Gate AD steel lab values
`Ln,w 55.6` / `DeltaLw 22.4`, tighten tolerances, add broad source-row
crawling, or alias lab, field, building, and ASTM outputs.

## Validation Target

Gate BJ validation completed on 2026-05-14:

- focused Gate BJ engine contract: 1 file / 6 tests;
- Gate BI + Gate BJ + affected field-impact regression guard set:
  6 files / 123 tests;
- engine typecheck;
- `pnpm calculator:gate:current` with engine 403 files / 2331 tests,
  web 77 files / 328 passed + 18 skipped, repo build 5/5, and
  whitespace guard clean;
- final `git diff --check`.

Known non-fatal warnings remain the optional `sharp/@img` warnings from
`@turbodocx/html-to-docx` during Next build and the unavailable Zustand
test-storage warnings in web tests. The Next build rewrote
`apps/web/next-env.d.ts`; it was restored to the repo-standard
`.next-typecheck` route-type reference after validation.
