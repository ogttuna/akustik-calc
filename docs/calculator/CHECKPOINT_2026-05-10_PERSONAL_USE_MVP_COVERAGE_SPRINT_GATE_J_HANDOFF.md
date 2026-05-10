# Checkpoint 2026-05-10 - Personal-Use MVP Coverage Sprint Gate J

## Status

Gate J has landed:

`gate_j_personal_use_mvp_airborne_field_context_surface_parity_plan`

Selection status:

`gate_j_personal_use_mvp_airborne_field_context_surface_parity_landed_selected_input_surface_gate_k`

Selected next action:

`gate_k_personal_use_mvp_airborne_field_context_input_surface_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-k-airborne-field-context-input-surface-contract.test.ts`

## What Changed

- Added the Gate J engine contract:
  `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts`.
- Added web surface parity coverage:
  `apps/web/features/workbench/airborne-field-context-surface-parity.test.ts`.
- Added `apps/web/features/workbench/airborne-field-context-surface.ts` so output cards, posture, provenance, corridor/method dossiers, saved replay, report text, and API assertions all read the same Gate I field-basis facts.
- Exported the Gate I field-context constants from `@dynecho/engine` so web parity tests can prove the duplicated web identifiers have not drifted.
- Updated the current-gate runner to include the Gate J engine and web tests.

## Runtime Result

No acoustic numeric values were retuned. Gate J only makes the already
landed Gate I field-context basis visible.

- Lined massive/masonry field result remains `R'w 58 / DnT,w 59`.
- CLT/mass-timber field result remains `R'w 40 / DnT,w 41`.
- Grouped mineral-wool triple-leaf field result remains
  `R'w 50 / DnT,w 51`.
- The visible uncertainty copy reads the actual
  `airborneBasis.errorBudgetDb`: current lined massive/masonry and CLT
  examples surface `+/-8 dB`; the grouped triple-leaf example surfaces
  `+/-7 dB`.
- All Gate J surfaces show
  `candidate_airborne_field_context_family_physics_prediction`,
  `gate_i_airborne_field_apparent_context_adapter_runtime`, the Gate I
  warning, and "not measured field evidence" language.

## Guardrails Still Active

- Missing field context remains `needs_input` and does not receive a
  Gate I field budget.
- Building-prediction/flanking requests remain outside the Gate I/J
  field surface claim.
- Lab `Rw` / `STC` cards are not relabelled as `R'w` / `DnT,w`.
- Exact source precedence remains owned by Gate I and still outranks the
  field family adapter.

## Validation

Completed:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-j-airborne-field-context-surface-parity-contract.test.ts --maxWorkers=1`
  passed 1 file / 4 tests.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/airborne-field-context-surface-parity.test.ts --maxWorkers=1`
  passed 1 file / 4 tests.
- Gate I/J engine continuity passed 2 files / 10 tests.
- Web surface continuity passed 2 files / 8 tests.
- `pnpm --filter @dynecho/engine typecheck` passed.
- `pnpm --filter @dynecho/web typecheck` passed.
- `pnpm calculator:gate:current` passed with engine 351 files / 2034
  tests, web 69 files / 298 passed + 18 skipped, repo build 5/5, and
  whitespace guard clean.

Known non-fatal warnings remain the existing Zustand unavailable
test-storage messages and optional `sharp/@img` package resolution
warnings during the Next build.

## Next Step

Gate K should make the same airborne field-context physical inputs
first-class on the Dynamic Calculator input surface. The runtime now
exists and Gate J proves the visible outputs are honest, but the user
still needs a clearer first-class wall-field input surface for
`contextMode`, panel width/height or partition area, receiving-room
volume, RT60, and route-specific missing-input warnings.
