# Checkpoint - 2026-05-04 Field Output Lab / Screening Leakage Guard Gate B

Slice id: `field_output_lab_screening_leakage_guard_v1`

Status:

`gate_b_strengthened_visible_field_output_basis_copy_no_runtime_selected_source_gap_revalidation_with_rockwool_and_misclassification_blockers`

Implementation file:

`apps/web/features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts`

Selected next slice:

`calculator_source_gap_revalidation_v21`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v21-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_gap_order_after_field_output_guard_and_company_internal_blocker`

## What Landed

Gate B is a visible copy / posture guard only. It does not change
runtime values, support, confidence, evidence promotion, API shape,
route-card values, output-card status, or workbench input behavior.

Visible output-card details now make field-style outputs explicit:

- airborne `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, and `DnT,A,k`
  are described as field continuations from the active lab, screening,
  or apparent lane, not independent exact field measurements;
- impact `L'n,w`, `L'nT,w`, and `L'nT,50` live cards are described as
  field-impact continuations, not independent exact field measurements;
- bound field-impact cards stay conservative one-sided supports and
  are not framed as exact measurements;
- the shared output posture now says field continuation outputs are not
  independent exact source rows or measured field results.

## Guarded Scenarios

The web Gate B test proves:

1. Low-confidence grouped split-rockwool triple-leaf still stays on
   `multileaf_screening_blend`, with `R'w 34` and `DnT,w 36` visible
   but caveated as apparent field continuations.
2. Exact UBIQ open-web floor rows can carry `L'n,w`, `L'nT,w`, and
   `L'nT,50`, but those companions remain field-impact continuations,
   not independent exact field measurements.
3. Missing receiving-room volume keeps standardized airborne field
   outputs parked as needs-input.
4. Missing field `K` keeps field-impact outputs parked as needs-input
   instead of deriving them from adjacent live `Ln,w` values.
5. Proposal/report coverage text carries both the field-continuation
   copy and the standard warning that the issue sheet does not replace
   accredited laboratory or site measurements.

## Rockwool / Triple-Leaf Status

This gate does not fix rockwool triple-leaf. The grouped
split-rockwool / gypsum / MLV path remains low-confidence screening
unless a later source-gap slice closes topology, material mapping,
source curve, tolerance, negative-boundary, and paired visible tests.

## Validation

Focused validation completed:

`pnpm --filter @dynecho/web exec vitest run features/workbench/field-output-lab-screening-leakage-gate-b-card-copy.test.ts --maxWorkers=1`

Result: 1 file / 4 tests passed.

Continuity validation completed:

`pnpm --filter @dynecho/web exec vitest run features/workbench/simple-workbench-output-model.test.ts features/workbench/wall-flat-list-multileaf-family-guard-route-card.test.ts features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts features/workbench/floor-field-continuation-gate-a-card-matrix.test.ts --maxWorkers=1`

Result: 4 files / 24 tests passed.

`tools/dev/run-calculator-current-gate.ts` now includes the Gate B web
test in the current-gate web focused suite.

Current-gate validation completed:

`pnpm calculator:gate:current`

Result: engine 241 files / 1388 tests passed; web 50 files / 238
passed + 18 skipped; repo build 5 / 5 tasks passed with the known
non-fatal `sharp/@img` warnings; whitespace guard passed. The first
build attempt in this pass hit a transient missing
`next-font-manifest.json` artifact during Next page-data collection;
the immediate standalone web build rerun and full current-gate rerun
passed without calculator/runtime changes, so this was treated as build
artifact drift, not an acoustic lane/value regression.
