# Checkpoint - Company-Internal Mainline Realignment

Date: 2026-05-14

## Summary

The ASTM `IIC` / `AIIC` chain through Gate BV is preserved as
no-runtime boundary history, but it is no longer the active next lane.
The active calculator work is back on the company-internal mainline:
ISO floor-impact accuracy, wall topology solver coverage,
field/building missing-input safety, and cleanup of common
`screening_fallback` / `low_confidence` answers.

## Runtime Change

Partial airborne `building_prediction` requests now park all requested
wall airborne outputs when required physical owners are missing. The
resolver already returned `needs_input`, but `calculateAssembly` only
moved outputs out of the supported set when
`buildingPredictionOutputBasis` was present. That meant the missing
output-basis field could still leave values looking supported.

Current behavior:

- incomplete building context returns selected origin `needs_input`;
- missing inputs include source-room volume, flanking/junction class,
  conservative flanking assumption, junction coupling length, and
  building output basis as applicable;
- requested wall outputs move to `unsupportedTargetOutputs`;
- field/building cards render them as pending/missing-input instead of
  live values;
- `R'w` / `Dn*` metrics, `ratings.field`, and `iso717.RwPrime` are
  suppressed while the building route is parked;
- complete Gate AR building-prediction runtime remains unchanged.

## Validation

Focused regression passed:

```bash
pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-l-airborne-building-prediction-boundary-contract.test.ts --maxWorkers=1
```

Result: 1 file / 5 tests passed.

Current focused calculator gate passed after the stricter parked-building
surface updates:

```bash
pnpm calculator:gate:current
```

Result:

- engine: 415 files / 2409 tests passed
- web: 78 files / 334 passed + 18 skipped
- repo build: 5 / 5 tasks passed

## Active Plan

Read next:

- `docs/calculator/SLICE_COMPANY_INTERNAL_CALCULATION_GRADE_MAINLINE_PLAN.md`

Immediate next implementation target:

1. Move to the wall heavy-core / heavy-composite screening cleanup lane.
2. Convert the selected common wall lane to a named family solver with
   explicit error budget, or fail closed with exact missing topology
   inputs.
3. Refresh the company-internal coverage matrix after that lane so
   supported, `needs_input`, `unsupported`, and remaining screening rows
   are explicit.

## Parked Work

Gate BV / Gate BW ASTM `IIC` / `AIIC` contour-rating work remains
documented for future use, but it is not the active mainline because the
current product priority is ISO `Ln,w` / `DeltaLw`, wall `Rw` / `R'w` /
`DnT,w`, and field/building context correctness.
