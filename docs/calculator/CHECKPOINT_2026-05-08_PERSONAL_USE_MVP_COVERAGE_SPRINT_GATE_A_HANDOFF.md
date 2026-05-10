# Checkpoint - 2026-05-08 - Personal-Use MVP Coverage Sprint Gate A

Gate:

`gate_a_personal_use_mvp_coverage_matrix_plan`

Implemented file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-a-scenario-matrix-contract.test.ts`

Helper:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint.ts`

Status:

Gate A landed as a no-runtime executable scenario matrix for the
post-Gate-BI Personal-Use MVP Coverage Sprint.

Summary:

- Gate A adds 24 executable wall/floor scenario rows through current
  engine entry points:
  `calculateAssembly`, `calculateImpactOnly`,
  `buildDynamicCalculatorRouteInputTopologyAssessment`, and
  `buildSteelFloorFormulaPredictorInputFromSurface`;
- every row records route, family, requested metrics, output basis,
  input completeness, current posture, target personal-use posture,
  value or blocked reason, origin/support bucket, tolerance or error
  budget, visible-surface parity target, hostile variant, failure class,
  and next action;
- numeric rows pin current values and basis, including:
  - heavy concrete wall `Rw 58` / `STC 59`;
  - grouped triple-leaf `Rw 50` and non-50/50 grouped triple-leaf
    `Rw 55`;
  - heavy concrete floating floor `Ln,w 44.9` / `DeltaLw 26.9`;
  - lightweight-steel formula corridor `Ln,w 55.6` / `DeltaLw 22.4`;
  - exact steel source precedence `Ln,w 51`;
  - exact timber field-impact continuation `L'n,w 53` /
    `L'nT,w 50.6`;
- blocked rows pin missing inputs or unsupported boundaries instead of
  emitting fake high-confidence values;
- ASTM `IIC` / `AIIC` remains unsupported and is not aliased from
  `Ln,w`;
- field impact stays separated from lab impact, and exact lab evidence
  is carried through a named field guide continuation only when field
  context is explicit;
- hostile duplicate steel carriers and zero-thickness input fail closed;
- broad source crawling remains blocked.

Selection status:

`gate_a_personal_use_mvp_coverage_matrix_landed_no_runtime_selected_timber_clt_floor_impact_delta_lw_gate_b`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-b-timber-clt-floor-impact-delta-lw-contract.test.ts`

Selected next action:

`gate_b_personal_use_mvp_timber_clt_floor_impact_delta_lw_input_contract_plan`

Why this Gate B lane:

Gate A's ROI ranking uses:

`user_frequency * current_failure_risk * solver_readiness / (implementation_cost + basis_leakage_risk)`

The selected lane is `timber_clt_floor_impact_delta_lw` with score
`16.0`. The matrix evidence rows are:

- `floor.timber_joist_impact.lab`: exact `Ln,w` is available but
  `DeltaLw` is unsupported;
- `floor.clt_mass_timber_impact.lab`: family `Ln,w` is available but
  `DeltaLw` is unsupported;
- `floor.complete_field_impact_context.lprime`: exact lab impact can
  continue to field `L'n,w` / `L'nT,w` only when context is explicit,
  proving the next lane must preserve lab/field separation.

Deferred lanes:

- generalized wall multi-cavity / triple-leaf routing remains important,
  but the grouped 50/50 and non-50/50 cases now calculate and the flat
  ambiguous case correctly returns `needs_input`;
- lined masonry / CLT wall upgrade remains a follow-up because AAC,
  lined massive, and CLT wall rows still show screening posture;
- field/building continuation remains a follow-up because complete
  context rows calculate and missing-context rows correctly prompt, so
  its current failure risk is lower than the timber/CLT floor `DeltaLw`
  gap.

Next step:

Gate B should define the timber/CLT floor-impact `DeltaLw` input and
physics contract. It must not scrape broad source rows as a substitute
for a solver. It should name the physical inputs required to estimate
`DeltaLw` for timber joist and CLT/mass-timber floors, preserve exact
`Ln,w` source precedence, preserve field/basis separation, and keep
unsupported or missing-input behavior explicit until the formula route
is owned.

Validation result:

Focused Gate A validation completed on 2026-05-08: Gate A passed 1 file
/ 7 tests. Focused Gate BI/Gate A continuity passed 2 files / 14 tests.
Engine typecheck passed. Full `pnpm calculator:gate:current` passed with
engine 342 files / 1979 tests, web 66 files / 286 passed + 18 skipped,
repo build 5/5 successful, and whitespace guard clean. Known warnings
were the existing Zustand unavailable test-storage warnings in focused
web tests and optional `sharp/@img` package resolution warnings during
web build.
