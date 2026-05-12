# Post-Gate AP Checkpoint and Broad Revalidation Handoff - 2026-05-12

## Checkpoint Status

This checkpoint was taken after Gate AP landed the airborne
building-prediction room absorption / standardization owner and before
starting Gate AQ. It is intended as a clean stopping point: docs,
implementation, current-gate coverage, and broad repository validation
should all agree before the uncertainty-budget owner is implemented.

Current selected status remains:

`gate_ap_personal_use_mvp_airborne_building_prediction_room_standardization_owner_landed_no_runtime_selected_uncertainty_budget_gate_aq`

Selected next action remains:

`gate_aq_personal_use_mvp_airborne_building_prediction_uncertainty_budget_owner_contract_plan`

Selected next file remains:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aq-airborne-building-prediction-uncertainty-budget-owner-contract.test.ts`

## Docs vs Implementation Read

The implementation and plan are aligned:

- Gate AP implementation exists in
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ap.ts`.
- Gate AP contract coverage exists in
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-ap-airborne-building-prediction-room-standardization-owner-contract.test.ts`.
- Gate AP's contract imports and preserves Gate AL owner gaps, Gate AM
  direct curve ownership, Gate AN flanking path energy ownership, Gate
  AO junction vibration ownership, Gate O's `+/-9 dB` design budget,
  and Gate P's no-runtime runtime-corridor blocker.
- `tools/dev/run-calculator-current-gate.ts` includes Gate AL through
  Gate AP building-prediction owner contracts.
- `AGENTS.md`, `docs/calculator/README.md`,
  `docs/calculator/CURRENT_STATE.md`, and
  `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md` all name Gate AP as
  landed and Gate AQ as the selected next owner contract.
- The selected Gate AQ test file intentionally does not exist yet at
  this checkpoint; it is the next implementation step, not a missing
  committed artifact.

No stale implementation/doc mismatch was found. The useful cleanup is to
add this checkpoint so a future agent can start from a single
post-Gate-AP revalidation handoff instead of reconstructing the state
from older Gate AP closeout notes.

## Runtime Posture

Gate AP remains no-runtime:

- complete airborne `building_prediction` requests for `R'w` and
  `DnT,w` remain `unsupported` through the building-prediction runtime
  adapter owner boundary;
- partial building requests remain `needs_input` with precise missing
  physical fields;
- Gate I/J/K field-context `R'w` / `DnT,w` remains a separate field
  route, not building prediction evidence;
- lab `Rw` / `STC`, opening/leak lab adapters, source single-number
  rows without room terms, and generic room labels remain blocked as
  building room-standardization aliases;
- Gate O's `+/-9 dB` uncertainty corridor remains a source-absent
  design budget, not runtime evidence;
- broad source crawling remains blocked because it does not create the
  missing source-absent uncertainty-budget owner.

No runtime formula, tolerance, source-promotion, workbench input,
route-card, API, report, or lab/field/building basis behavior moved in
this checkpoint.

## Next Gate AQ

Gate AQ should implement a no-runtime airborne building-prediction
uncertainty-budget owner contract:

1. create
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-aq-airborne-building-prediction-uncertainty-budget-owner-contract.test.ts`;
2. add a small helper module only if the test needs reusable structured
   owner data beyond Gate AP's lane selection;
3. define the Gate O `+/-9 dB` uncertainty-budget owner for `R'w` and
   `DnT,w` without selecting building runtime;
4. require metric-specific apparent/standardized budget decomposition,
   same-building holdout absence ownership, source-absent
   design-budget posture, and basis-compatible metric scope;
5. prove Gate AM direct curve, Gate AN flanking path energy, Gate AO
   junction vibration, and Gate AP room standardization owners still
   cannot promote `R'w` or `DnT,w` without the uncertainty owner and a
   later all-owner runtime corridor;
6. keep lab, field, opening/leak, STC-only, source-single-number, and
   wrong-budget aliases blocked;
7. update `tools/dev/run-calculator-current-gate.ts`, `AGENTS.md`,
   `README.md`, `CURRENT_STATE.md`, and `NEXT_IMPLEMENTATION_PLAN.md`
   only after the Gate AQ contract is executable.

Do not promote building-prediction runtime in Gate AQ. Runtime promotion
belongs in a later all-owner runtime corridor after all formula owners,
visibility surfaces, and uncertainty posture are executable.

## Validation

Validation passed before commit:

- Focused Gate AP:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-ap-airborne-building-prediction-room-standardization-owner-contract.test.ts --maxWorkers=1`
  passed with 1 file / 6 tests.
- Current gate:
  `pnpm calculator:gate:current` passed. Focused engine gate passed
  383 files / 2211 tests, focused web gate passed 74 files /
  318 passed + 18 skipped, repo build passed 5/5 packages, and the
  whitespace guard passed.
- Full repo:
  `pnpm check` passed. Lint passed 5/5 packages, typecheck passed 5/5
  packages, engine Vitest passed 508 files / 3013 tests, web Vitest
  passed 180 files / 993 passed + 18 skipped, and repo build passed
  5/5 packages.

Known non-fatal warnings remain unchanged: optional `sharp/@img`
resolution warnings in the DOCX/PDF build path and unavailable Zustand
test-storage warnings in workbench persistence tests.
