# Personal-Use MVP Coverage Sprint Gate K Handoff

Date: 2026-05-10

Landed gate:

`gate_k_personal_use_mvp_airborne_field_context_input_surface_plan`

Selection status:

`gate_k_personal_use_mvp_airborne_field_context_input_surface_landed_selected_building_prediction_boundary_gate_l`

Selected next implementation file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-l-airborne-building-prediction-boundary-contract.test.ts`

Selected next action:

`gate_l_personal_use_mvp_airborne_building_prediction_boundary_plan`

## Summary

Gate K makes the Gate I/J airborne field-context physical inputs
first-class on the Dynamic Calculator wall input surface. The calculator
now treats `field_between_rooms`, panel width/height, receiving-room
volume, receiving-room RT60, and optional airtightness as owned UI input
state for field airborne outputs rather than hidden raw context wiring.

No acoustic runtime values moved. Complete UI-derived lined
massive/masonry, CLT/mass-timber, and grouped triple-leaf wall field
contexts continue to use the Gate I runtime method and Gate J visible
surface:

- lined massive/masonry: `R'w 58 / DnT,w 59`;
- CLT/mass-timber: `R'w 40 / DnT,w 41`;
- grouped triple-leaf: `R'w 50 / DnT,w 51`.

Partial field contexts now stay parked. If RT60, receiving-room volume,
or partition geometry is missing, selected output state remains
`needs_input`, visible field cards show "Not ready", and the Gate I
field uncertainty budget is not displayed. This closes the prior UI
risk where legacy sidecar metrics could look live even while the engine
selected `candidate_dynamic_needs_input`.

## Implementation Surfaces

- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-k-airborne-field-context-input-surface-contract.test.ts`
- `apps/web/features/workbench/airborne-field-context-input-surface.ts`
- `apps/web/features/workbench/airborne-field-context-input-surface.test.ts`
- `apps/web/features/workbench/scenario-analysis.ts`
- `apps/web/features/workbench/simple-workbench-shell.tsx`
- `apps/web/features/workbench/simple-workbench-route-panel.tsx`
- `apps/web/features/workbench/guided-output-unlocks.ts`
- `apps/web/features/workbench/field-airborne-output.ts`
- `apps/web/features/workbench/simple-workbench-output-model.ts`
- `apps/web/features/workbench/simple-workbench-constants.ts`
- `apps/web/features/workbench/airborne-context-panel.tsx`
- `packages/engine/src/dynamic-calculator-route-input-topology.ts`
- `tools/dev/run-calculator-current-gate.ts`

## Behavior Locked

- Wall field preset includes `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`,
  `STC`, and `Ctr`.
- `DnT,w` / `DnT,A` require receiving-room RT60 as well as room volume
  before the Gate I field-context adapter can defend a result.
- Missing field-context inputs produce precise warnings naming the
  blocked physical fields.
- Saved replay, scenario analysis, Markdown report payload, calculator
  API payload, and hostile UI edits preserve explicit field context.
- `building_prediction` remains unsupported or `needs_input` until a
  later flanking/junction owner exists.
- Lab `Rw` / `STC`, field `R'w` / `DnT,w`, and future
  building-prediction outputs remain separate basis families.

## Validation

Validation completed on 2026-05-10:

- focused Gate K engine contract passed 1 file / 5 tests;
- focused Gate K web input-surface acceptance plus guided unlocks
  passed 2 files / 9 tests;
- Gate I/J/K engine continuity passed 3 files / 15 tests;
- Gate J/K web surface continuity plus guided unlocks passed 3 files /
  13 tests;
- engine typecheck and web typecheck passed;
- targeted field-output route-card regression pack passed 6 files / 42
  tests;
- final `pnpm calculator:gate:current` passed with engine 352 files /
  2039 tests, web 70 files / 303 passed + 18 skipped, repo build 5/5,
  and whitespace guard clean.

Known non-fatal warnings remain the existing Zustand unavailable
test-storage warnings and optional `sharp/@img` package resolution
warnings during the Next build.

## Next Gate

Gate L should be a boundary/readiness gate for airborne
`building_prediction`. It should prove building-prediction requests
cannot borrow Gate I field budgets, selected candidates, warnings, or
card/report posture until flanking/junction ownership and
building-prediction output contracts exist.
