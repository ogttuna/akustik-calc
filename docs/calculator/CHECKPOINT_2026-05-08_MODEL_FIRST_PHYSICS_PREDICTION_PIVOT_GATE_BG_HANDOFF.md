# Checkpoint - 2026-05-08 - Model-First Physics Prediction Pivot Gate BG

Gate:

`gate_bg_steel_floor_formula_same_stack_iso_delta_lw_field_building_basis_owner_closure_plan`

Implemented file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bg-steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure-contract.test.ts`

Helper:

`packages/engine/src/steel-floor-formula-same-stack-iso-delta-lw-field-building-basis-owner-closure.ts`

Status:

Gate BG landed as a no-runtime field/building basis owner closure for
the same-stack ISO lab `DeltaLw` steel-floor formula residual path.

Summary:

- Gate BG consumes Gate BF's selected field/building basis owner closure
  lane;
- field apparent impact and building-prediction owners are separate:
  field packets must own `L'n,w` / `L'nT,w` context, while building
  packets must own building-prediction context;
- both basis owner families require receiving room geometry/volume,
  separating element area, junction/flanking context,
  reverberation/normalization basis, and rights-safe locator or
  project-context metadata;
- complete future basis owner packets count only as residual-policy
  readiness evidence;
- missing owner fields, missing context values, missing locator/project
  metadata, wrong basis, lab-corridor alias attempts, wrong metric
  family, product/inferred claims, and rights-blocked packets remain
  rejected;
- residual policy closed-owner revalidation is selected for Gate BH
  because all ranked blocker-closure lanes can now be represented as
  closed in the no-runtime owner map;
- broad source crawl, source text/document ingestion, exact-source
  promotion, tolerance movement, formula retune, field/building alias,
  and runtime movement remain blocked;
- runtime values remain `Ln,w 55.6` / `DeltaLw 22.4`, tolerances remain
  `+/-4.5 dB` / `+/-2.0 dB`, exact-source precedence is unchanged, and
  lab/field/building bases remain separate.

Selection status:

`gate_bg_same_stack_iso_delta_lw_field_building_basis_owner_closure_landed_no_runtime_selected_residual_policy_revalidation_gate_bh`

Selected next file:

`packages/engine/src/calculator-model-first-physics-prediction-pivot-gate-bh-steel-floor-formula-same-stack-iso-delta-lw-residual-policy-closed-owner-revalidation-contract.test.ts`

Selected next action:

`gate_bh_steel_floor_formula_same_stack_iso_delta_lw_residual_policy_closed_owner_revalidation_plan`

Next step:

Gate BH should revalidate the residual-policy decision after the
holdout-count, paired-negative, open-web input ownership, and
field/building owner blockers have closure evidence. It must keep the
closure rows evidence-only, preserve lab/field/building separation, and
not move runtime values or tolerances unless a later gate owns measured
residual evidence and explicitly selects retune/tighten/widen.

Validation result:

Focused Gate BG validation completed on 2026-05-08. Gate BG passed 1
file / 9 tests, focused Gate BF/BG continuity passed 2 files / 18 tests,
engine typecheck passed, engine DTS build passed, and full `pnpm
calculator:gate:current` passed with engine 339 files / 1957 tests, web
66 files / 286 passed + 18 skipped, repo build 5/5 successful, and
whitespace guard clean. Known warnings were the existing Zustand
unavailable test-storage warnings and optional sharp package resolution
warnings during web build. Broad `pnpm check` was not rerun because Gate
BG has no runtime/API/UI surface change.
