# Gate AQ Plan Revalidation and Implementation-Ready Handoff - 2026-05-12

## Purpose

This checkpoint is a second analysis/planning pass after the
company-internal daily-use final path handoff. It re-reads the live
implementation, checks the relevant public official references, and
turns Gate AQ into an implementation-ready plan.

No runtime behavior moved in the planning checkpoint. Gate AQ has since
landed as the no-runtime uncertainty-budget owner and selected Gate AR.
See
[CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_HANDOFF.md](./CHECKPOINT_2026-05-12_PERSONAL_USE_MVP_COVERAGE_SPRINT_GATE_AQ_HANDOFF.md).

## Implementation Read

Live implementation and docs still agree:

- Gate AP is landed in
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ap.ts`.
- Gate AP's contract coverage is
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ap-airborne-building-prediction-room-standardization-owner-contract.test.ts`.
- Gate AP imports/preserves Gate AL owner gaps, Gate AM direct curve,
  Gate AN flanking path energy, Gate AO junction vibration, Gate O's
  `+/-9 dB` design budget, and Gate P's no-runtime runtime-corridor
  blocker.
- `tools/dev/run-calculator-current-gate.ts` includes Gate AL through
  Gate AP.
- Complete airborne `building_prediction` requests still return
  `unsupported`; partial building contexts still return `needs_input`;
  field/lab/opening routes remain separate.
- The selected Gate AQ file existed after implementation:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aq-airborne-building-prediction-uncertainty-budget-owner-contract.test.ts`.

## External Reference Check

This pass checked current official/public references only to validate
planning assumptions, not to import copyrighted formulas:

- [ISO 12354-1:2017](https://www.iso.org/standard/70242.html) is still
  the relevant airborne building-prediction reference. ISO's public
  abstract confirms calculation models for airborne insulation between
  adjacent rooms using measured direct/indirect flanking data and
  theoretically-derived structural propagation methods. It also
  distinguishes detailed frequency-band calculation from a restricted
  simplified single-number model with uncertainty.
- [ISO 10848-1:2017](https://www.iso.org/standard/67226.html) remains
  relevant for flanking/junction evidence. ISO's public abstract says
  flanking quantities, including junction/vibration-related quantities,
  can be used as input data for prediction methods such as ISO 12354-1
  and ISO 12354-2.
- [ISO 717-1:2020](https://www.iso.org/standard/77435.html) remains the
  current airborne single-number rating context and was confirmed in
  2026.
- [INSUL technical info](https://www.insul.co.nz/tech-info/) and the
  public [INSUL Version 10 summary](https://www.insul.co.nz/media/43149/INSUL-Version10-November-2023.pdf)
  reinforce the local strategy: family-specific wall/floor prediction is
  useful, but building flanking and rating basis still need explicit
  owner terms. DynEcho should not treat an element-lab prediction as a
  building prediction.

Planning consequence: Gate AQ should not promote runtime. It should own
the uncertainty-budget term that makes a later all-owner runtime corridor
honest. That is the implemented Gate AQ posture.

## Gate AQ Implementation Contract

Target test file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aq-airborne-building-prediction-uncertainty-budget-owner-contract.test.ts`

Recommended helper file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aq.ts`

Gate AQ should define:

- landed action:
  `gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_contract_plan`;
- selection status:
  `gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_landed_no_runtime_selected_all_owner_runtime_corridor_gate_ar`;
- selected next action:
  `gate_ar_personal_use_mvp_airborne_building_prediction_all_owner_runtime_corridor_plan`;
- selected next file:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ar-airborne-building-prediction-all-owner-runtime-corridor-contract.test.ts`.

Gate AQ owner requirements:

- Gate AP room standardization owner dependency;
- Gate O `+/-9 dB` budget preserved for both `R'w` and `DnT,w`;
- metric-specific apparent/standardized budget decomposition;
- direct family-curve residual budget term;
- flanking-energy path simplification budget term;
- junction vibration reduction surrogate budget term;
- input geometry / room-standardization precision budget term;
- same-building holdout absence term;
- source-absent design-budget posture;
- not-measured-evidence posture;
- basis-compatible metric scope.

Gate AQ rejected signals:

- lab `Rw` / `STC` tolerance copied into building metrics;
- Gate I field runtime budget copied into building metrics;
- opening/leak lab adapter budget copied into building metrics;
- source single-number row without building/flanking/room terms;
- STC/IIC/product-only evidence;
- generic safety factor without term decomposition;
- exact source row with no same-building metric basis;
- any budget that claims measured-evidence status without a
  source-owned same-building holdout.

Gate AQ runtime posture:

- `runtimePromotionAllowedInGateAQ: false`;
- `runtimeValueMovement: false`;
- complete building requests still `unsupported`;
- partial building requests still `needs_input`;
- all formula owners may be classified as ready for the next runtime
  corridor, but not selected as runtime in Gate AQ;
- broad source crawling remains lower priority than the source-absent
  owner contract.

## Gate AQ Tests To Write

The Gate AQ contract test should prove:

1. Gate AQ lands the uncertainty-budget owner and selects Gate AR.
2. The Gate AQ owner consumes Gate AP and leaves no Gate AL owner gap
   unaccounted for.
3. Both building metrics preserve the Gate O `+/-9 dB` budget with
   metric-specific decomposition and not-measured posture.
4. Lab, field, opening/leak, source-single-number, STC/IIC, and generic
   safety-factor aliases are rejected.
5. Complete building requests still return `unsupported` through the
   existing runtime adapter until Gate AR.
6. Partial building contexts still return exact `needs_input` fields.
7. Field-context `R'w` / `DnT,w` stays on the Gate I/J/K field route.
8. Docs and `tools/dev/run-calculator-current-gate.ts` align after Gate
   AQ is executable.

## Gate AR Boundary

Gate AR should be the first place where runtime can be considered. It
must not start until Gate AQ is green. Gate AR may promote complete
building prediction only if it can:

- use an owned direct separating-element frequency/rating curve;
- compute or conservatively bound flanking-path energy terms;
- apply owned junction vibration / coupling terms;
- apply owned room absorption / standardization terms;
- attach the Gate AQ uncertainty-budget payload visibly;
- preserve exact-source precedence and basis-compatible metric scope;
- fail closed on missing owners, missing fields, aliases, or hostile
  topology.

If this is too large, split Gate AR into a no-runtime readiness gate and
a runtime-promotion gate. Do not collapse Gate AS surface parity into
Gate AR unless the runtime change is trivial and fully visible.

## Validation Plan

After implementing Gate AQ:

1. focused Gate AQ:
   `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-aq-airborne-building-prediction-uncertainty-budget-owner-contract.test.ts --maxWorkers=1`;
2. Gate AP + Gate AQ continuity;
3. engine typecheck;
4. `pnpm calculator:gate:current`;
5. broad `pnpm check` if docs/runner/shared surface changed;
6. `git diff --check`.

Validation completed on 2026-05-12:

- focused Gate AQ passed 1 file / 6 tests;
- Gate AP + Gate AQ continuity passed 2 files / 12 tests;
- engine typecheck passed;
- `pnpm calculator:gate:current` passed with engine 384 files /
  2217 tests, web 74 files / 318 passed + 18 skipped, repo build 5/5,
  and whitespace guard clean;
- broad `pnpm check` passed with lint/typecheck clean, engine 509 files /
  3019 tests, web 180 files / 993 passed + 18 skipped, and repo build
  5/5;
- `git diff --check` passed after validation-note sync.

This checkpoint remains no-runtime and documentation-only. The Gate AQ
implementation handoff records the executable closeout and Gate AR
selection.
