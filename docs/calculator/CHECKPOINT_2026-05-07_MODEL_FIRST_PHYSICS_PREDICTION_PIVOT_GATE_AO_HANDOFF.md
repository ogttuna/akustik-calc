# Checkpoint - 2026-05-07 Model-First Physics Prediction Pivot Gate AO

Document role: handoff for the active Dynamic Calculator slice after
Gate AO.

## Scope

Gate AO follows Gate AN's source-absent steel-floor formula
error-budget contract. Gate AN made the uncertainty decomposition
executable; Gate AO carries that structured payload through runtime,
visible workbench surfaces, report text, and API payloads.

This gate does not retune the steel-floor formula and does not loosen
source-packet rules.

## Landed

- New Gate AO contract:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ao-steel-floor-formula-error-budget-surface-parity-contract.test.ts`.
- New Gate AO helper:
  `packages/engine/src/steel-floor-formula-error-budget-surface-parity.ts`.
- Shared impact schema now accepts optional structured `errorBudgets`
  with metric id, estimate, min/max, tolerance, total budget, origin,
  not-measured flag, and term list.
- Steel-floor formula runtime now attaches the same Gate AN budget
  payload to complete source-absent formula cases:
  - `Ln,w 55.6`, range `51.1..60.1`, `+/-4.5 dB`;
  - `DeltaLw 22.4`, range `20.4..24.4`, `+/-2.0 dB`.
- The `Ln,w` and `DeltaLw` runtime estimates did not move.
- Impact-support formula notes now include the structured Gate AN budget
  summary while keeping the source-absent / not-measured posture.
- Output cards, method dossier, corridor dossier, Markdown report,
  estimate API, and impact-only API all expose the same budget origin,
  `notMeasuredEvidence`, metric corridor, and terms.
- Exact-source precedence, needs-input cases, and unsafe-topology cases
  remain budget-free.
- Gate AK/AM source-packet rules remain strict, with zero accepted
  source-owned same-stack ISO lab `DeltaLw` holdouts.

## Selection

Gate AO landed status:

`gate_ao_error_budget_surface_parity_landed_no_runtime_selected_error_budget_hostile_input_gate_ap`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-ap-steel-floor-formula-error-budget-hostile-input-contract.test.ts`

Selected next action:

`gate_ap_steel_floor_formula_error_budget_hostile_input_plan`

Gate AP should harden the same budget surface against hostile inputs:
complete/safe-reorder/replay cases should preserve the structured
budget, while missing physical inputs, duplicate or ambiguous steel
carriers, exact-source precedence, unsafe topology, and field-output
requests must not leak a lab formula budget.

## Validation

Validation completed on 2026-05-07:

- Gate AE / Gate AN / Gate AO focused engine contracts passed after doc
  alignment: 3 files / 15 tests;
- focused web parity tests passed 3 files / 7 tests:
  `steel-floor-formula-card-report-parity.test.ts`,
  `steel-floor-formula-error-budget-surface-parity.test.ts`, and
  `steel-floor-formula-input-surface-acceptance.test.ts`.
- full `pnpm calculator:gate:current` passed with engine 321 files /
  1818 tests, web 66 files / 286 passed + 18 skipped, repo build 5/5
  successful, and whitespace guard clean.
- broad `pnpm check` passed after a transient Google Fonts fetch timeout
  was isolated by a successful build retry: lint, typecheck, engine 446
  files / 2620 tests, web 172 files / 961 passed + 18 skipped, and
  build all passed.
- `git diff --check` passed.

Known non-fatal warnings remain the Node/Vitest Zustand persist storage
warning and optional `sharp` / `@img` Next build warnings via the DOCX
export dependency.
