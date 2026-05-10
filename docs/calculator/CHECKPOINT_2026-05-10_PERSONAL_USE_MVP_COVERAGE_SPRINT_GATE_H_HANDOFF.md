# Checkpoint 2026-05-10 - Personal-Use MVP Coverage Sprint Gate H

Status:

`gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_landed_selected_airborne_field_context_gate_i`

Landed file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-h-lined-masonry-clt-wall-upgrade-contract.test.ts`

Landed action:

`gate_h_personal_use_mvp_lined_masonry_clt_wall_upgrade_plan`

Selected next file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-i-airborne-field-context-continuation-contract.test.ts`

Selected next action:

`gate_i_personal_use_mvp_airborne_field_context_continuation_plan`

## What Landed

- Complete source-absent lab lined massive/masonry wall remains
  `Rw 60 / STC 60`, but now reports
  `family_physics_prediction` through
  `gate_h_lined_massive_wall_cavity_aware_family_physics_runtime`
  instead of generic `screening_fallback`.
- Complete source-absent lab CLT/mass-timber wall remains
  `Rw 42 / STC 42`, with `Ctr` still unsupported, but now reports
  `family_physics_prediction` through
  `gate_h_clt_mass_timber_wall_single_leaf_family_physics_runtime`.
- Exact full-stack source rows remain higher precedence than the Gate H
  formula corridors.
- Explicit partial lined-wall or mass-timber intent returns
  `needs_input` with physical fields; source absence remains an
  exact/calibration blocker only.
- Ordinary single leaf, double/framed, grouped triple-leaf, and field
  outputs stay outside the Gate H lab-only promotion.

## Implementation Surfaces

- `packages/engine/src/dynamic-airborne-gate-h-lined-masonry-clt.ts`
- `packages/engine/src/dynamic-airborne.ts`
- `packages/engine/src/dynamic-calculator-candidate-resolver-runtime.ts`
- `packages/engine/src/dynamic-calculator-route-input-topology.ts`
- `packages/shared/src/domain/airborne-context.ts`
- `packages/shared/src/domain/input-completeness.ts`
- `tools/dev/run-calculator-current-gate.ts`
- `AGENTS.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/README.md`

## Gate I Handoff

Gate I should start from the field-output negatives now protected by
Gate G and Gate H. The target is a narrow airborne field/apparent context
continuation for already-owned lab family routes. Required physical
fields must include `contextMode`, partition area, receiving-room volume,
and RT60 for standardized outputs. Lab `Rw` must not be relabelled as
`R'w` or `DnT,w`, and building-prediction/flanking outputs stay blocked
until junction/flanking ownership lands.

## Validation

Validation completed on 2026-05-10:

- focused Gate H engine contract passed 1 file / 7 tests;
- Gate A/G/H plus Gate O CLT continuity passed 4 files / 26 tests;
- Gate P CLT continuity plus dynamic-airborne split line-count guard
  passed 2 files / 10 tests after aligning historical expectations with
  the Gate H CLT origin promotion;
- engine typecheck passed;
- final `pnpm calculator:gate:current` passed with engine 349 files /
  2024 tests, web 68 files / 294 passed + 18 skipped, repo build 5/5
  successful, and whitespace guard clean. The build still emits the
  known optional `sharp/@img` warnings through the DOCX route.
- `git diff --check` passed after validation-result doc updates.
