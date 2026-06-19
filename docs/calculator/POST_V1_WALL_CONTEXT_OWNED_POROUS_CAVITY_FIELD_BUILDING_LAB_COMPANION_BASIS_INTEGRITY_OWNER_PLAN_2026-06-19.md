# Post-V1 Wall Context-Owned Porous-Cavity Field/Building Lab-Companion Basis Integrity Owner - 2026-06-19

## Purpose

This is the selected runtime owner after
`post_v1_runtime_first_route_family_rerank_after_project_user_measured_wall_airborne_frequency_field_building_lab_companion_target_output_independence_coverage_refresh_plan`.

The owner fixes a narrow calculator accuracy gap in the double-leaf /
framed wall formula route. When the user enters a context-only
absorptive cavity through `advancedWall.cavities` instead of a visible
porous layer, the engine already owns the source-absent lab formula and
the Gate I / Gate AR field-building adapters. Field/building requests
for lab companions must therefore publish lab `Rw`, `STC`, `C`, and
`Ctr` from the owned direct lab curve, not the apparent field/building
adapter value.

This is a calculator runtime/basis-integrity slice. It is not a source
crawl, UI/report change, formula retune, or generic cleanup.

Owner action:

`post_v1_wall_context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner_plan`

## Selected Candidate

`wall.context_owned_porous_cavity_field_building_lab_companion_basis_integrity_owner`

## Selection Card

- User construction / formula family:
  context-owned double-leaf/framed wall with two leaf groups and an
  absorptive cavity declared through `advancedWall.cavities`.
- Target outputs to correct:
  `Rw`, `STC`, `C`, and `Ctr` for field-only, building-only, mixed
  field, and mixed building requests.
- Formula / adapter route:
  existing double-leaf/framed source-absent formula lab curve plus
  existing Gate I / Gate AR field-building adapters.
- Required physical inputs:
  side A/B leaf groups, cavity depth, support topology, support spacing,
  cavity fill coverage, cavity absorption class, and
  `absorberFlowResistivityPaSM2`.
- `needs_input` behavior:
  context-only absorptive cavities without owned flow resistivity remain
  `needs_input` for `cavity1FillCoverage`, `absorberClass`, or
  `flowResistivityPaSM2` as applicable.
- Unsupported boundaries:
  impact/ASTM outputs, opening/leak paths, source-row crawling, and
  generic lab-to-field aliasing stay blocked.

## Expected Counters

- `accuracyPromotedRequestShapes: 4`
- `accuracyPromotedTargetOutputs: 16`
- `runtimeBasisPromotions: 4`
- `runtimeValuesMoved: 16`
- `runtimeFormulaRetunes: 0`
- `sourceRowsImported: 0`
- `frontendImplementationFilesTouched: 0`

## Implementation Files

Owner contract:

`packages/engine/src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-owner-contract.test.ts`

Runtime file:

`packages/engine/src/calculate-assembly.ts`

## Validation

Run:

```bash
pnpm --filter @dynecho/engine exec vitest run \
  src/post-v1-runtime-first-route-family-rerank-after-project-user-measured-wall-airborne-frequency-field-building-lab-companion-target-output-independence-coverage-refresh-contract.test.ts \
  src/post-v1-wall-context-owned-porous-cavity-field-building-lab-companion-basis-integrity-owner-contract.test.ts \
  --maxWorkers=1
git diff --check
```
