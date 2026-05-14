# Company-Internal Checkpoint Review And Validation

Date: 2026-05-15

## Current Position

This checkpoint freezes the project state after the opening/leak
A-weighted owner contract review. The active slice remains:

`company_internal_calculation_grade_mainline`

The latest landed gate remains:

`company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_plan`

Selection status:

`company_internal_opening_leak_a_weighted_spectrum_adapter_owner_contract_landed_no_runtime_selected_formula_corridor`

Current selected next action:

`company_internal_opening_leak_a_weighted_spectrum_adapter_formula_corridor_plan`

Current selected next file:

`packages/engine/src/company-internal-opening-leak-a-weighted-spectrum-adapter-formula-corridor-contract.test.ts`

Current selected next label:

opening/leak Dn,A / DnT,A spectrum-adapter formula corridor

## Implementation Versus Docs Review

The implementation, current-gate runner, and living docs are aligned on
the same stopping point:

- Matrix V5 selected the opening/leak A-weighted owner contract.
- The A-weighted owner contract has landed as a no-runtime gate.
- Field opening/leak remains `R'w 36.4` / `Dn,w 36.7` / `DnT,w 36.9`
  with `+/-8 dB`.
- Building opening/leak remains `R'w 31.6` / `DnT,w 32.1` with
  `+/-10 dB`.
- Field `Dn,A` / `DnT,A` and building `DnT,A` remain unsupported until
  the formula corridor owns `frequencyBandSet`, same-route spectrum
  curves, ISO 717 C or A-weighted adapter policy, uncertainty budget,
  exact A-weighted packet precedence, and lab `Rw` / `STC` alias
  guards.
- Building `Dn,A` remains outside the current building opening/leak
  route because that route owns apparent `R'w` and standardized
  `DnT,w`, not local `Dn,w`.

The plan is still sensible: the next implementation should define the
formula corridor before any runtime promotion. Do not skip directly to
runtime or UI work for `Dn,A` / `DnT,A`.

## Remaining Gaps

- The selected formula-corridor file does not exist yet. That is the
  expected next implementation work.
- No A-weighted runtime values have been promoted yet.
- No exact A-weighted opening/leak source packet has been promoted.
- ASTM `IIC` / `AIIC` remains parked as boundary history.
- Broad source crawling remains out of scope unless a later active plan
  explicitly selects it.

## Validation

Recorded validation:

```bash
pnpm --filter @dynecho/engine exec vitest run src/company-internal-calculation-grade-mainline-matrix-v5-contract.test.ts src/company-internal-opening-leak-a-weighted-spectrum-adapter-owner-contract.test.ts src/company-internal-opening-leak-building-runtime-corridor-contract.test.ts src/company-internal-opening-leak-building-surface-parity-contract.test.ts --maxWorkers=1
pnpm calculator:gate:current
git diff --check
```

Results:

- Focused neighbor suite: 4 files / 20 tests passed.
- Current calculator gate:
  - engine focused gate: 429 files / 2484 tests passed;
  - web focused gate: 82 files / 346 passed + 18 skipped;
  - repo build: 5 / 5 tasks passed.
- `git diff --check`: passed.

Known non-fatal warnings remain unchanged: Zustand persist storage is
unavailable in selected web tests, and the Next build reports optional
`sharp/@img` module warnings through `@turbodocx/html-to-docx`.
