# Checkpoint 2026-05-07 - Broad Revalidation After Gate AK / Gate AL Handoff

Document role: broad validation, fix, and next-step handoff after Gate AK
and the report export/manual-edit checkpoint.

## Status

- Active slice:
  `calculator_model_first_physics_prediction_pivot_v1`.
- Landed gate remains Gate AK:
  `gate_ak_delta_lw_holdout_packet_contract_landed_selected_first_source_owned_holdout_gate_al`.
- Next gate remains Gate AL:
  `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts`
  should run
  `gate_al_steel_floor_formula_source_owned_delta_lw_first_holdout_plan`.
- Runtime calculator values were not retuned in this checkpoint.
- Report export/manual-edit behavior remains as validated in
  `docs/calculator/CHECKPOINT_2026-05-07_GATE_AK_REPORT_EXPORT_REVALIDATION_AND_PUSH_HANDOFF.md`.

## Broad Validation

`pnpm check` passed on 2026-05-07 after the fixes below:

- lint and typecheck passed;
- engine Vitest passed 442 files / 2600 tests;
- web Vitest passed 171 files / 959 tests with 18 skipped;
- repo production build passed 5/5 tasks.

Known non-fatal warnings remain unchanged: Node/Vitest Zustand persist
storage warnings in web tests and optional `sharp` / `@img` Next build
warnings through the DOCX export dependency.

## Fixes Landed During Revalidation

1. Removed stale lint blockers in the steel-floor formula files without
   changing runtime values:
   - `packages/engine/src/steel-floor-formula-accuracy-benchmark.ts`
   - `packages/engine/src/steel-floor-impact-formula-corridor.ts`
2. Aligned the impact validation corpus with the already-landed Gate AD
   steel-floor formula corridor. The validation fixture now includes an
   explicit predictor-input open-web steel estimate row with `Ln,w`,
   `DeltaLw`, basis, input mode, and tolerance checks, so the validation
   regime matrix no longer drifts from implemented coverage.
3. Kept hostile duplicate/disjoint lightweight-steel floor schedules
   fail-closed for impact outputs. When a second disjoint floor-covering
   schedule makes topology ambiguous, the workbench now expects the
   steel impact lane to remain unsupported/`needs_input` for impact
   outputs instead of reopening a broad `family_general` fallback. `Rw`
   screening remains available because it does not require the same
   steel impact package inputs.
4. Updated web validation expectations so route/regime summaries count
   the Gate AD steel formula corridor as an estimate lane.

## Decision

The next useful implementation step is still Gate AL, not a broad source
crawl and not a formula retune. Gate AK made source-owned lab `DeltaLw`
holdout ownership executable, but the accepted measured `DeltaLw`
holdout count is still zero. Gate AL should acquire or encode the first
real source-owned same-stack lab `DeltaLw` holdout packet only if all
formula-relevant owners are explicitly present in the source packet.

Gate AL must keep these boundaries:

- the packet is calibration/holdout evidence, not a product catalog row;
- exact measured rows keep precedence;
- inferred, product-only, field, ASTM, and building-basis values cannot
  tighten lab `DeltaLw`;
- runtime values stay frozen unless the residual policy later has enough
  measured holdouts and paired negative boundaries to promote a change.

## Next Steps

1. Create Gate AL contract:
   `packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-al-steel-floor-formula-source-owned-delta-lw-first-holdout-contract.test.ts`.
2. Add the first source-owned measured same-stack lab `DeltaLw` holdout
   candidate only if the source owns metric value, support family,
   carrier spacing, load basis, dynamic stiffness, lower support class,
   upper-resilient topology, and paired negative boundary ownership.
3. Add nearby negative cases for product-only, inferred, wrong-basis,
   and missing-owner variants.
4. Re-run residual policy contracts and keep runtime values frozen unless
   the explicit promotion policy is satisfied.
5. Re-run `pnpm calculator:gate:current` and `pnpm check` before any
   later runtime movement.
