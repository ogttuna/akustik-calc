# Post-V1 Gate CA Numeric Coverage And Accuracy Rerank Plan

Date: 2026-06-01

Authority: [CALCULATOR_SOURCE_OF_TRUTH.md](./CALCULATOR_SOURCE_OF_TRUTH.md)
and [USABLE_V1_EXECUTION_PLAN.md](./USABLE_V1_EXECUTION_PLAN.md).

## Goal

Gate CA is a no-runtime calculator selection gate. Its job is to choose
the next implementation only if the next slice increases calculator
scope or correctness.

The selected candidate is:

`floor.open_box_timber_eps_screed_hybrid.full_mixed_field_building_gap`

This is not formula invention, catalog work, low-confidence wording, or
surface polish. The EPS/screed hybrid route already calculates field
impact companions from explicit `impactFieldContext` on the field-only
route. Gate BZ exposed the same EPS/screed lab impact tuple beside
building airborne outputs, but the full mixed building route still
bypassed the field-impact adapter. Gate CB is therefore the highest-ROI
follow-up because the same complete user input should calculate more
valid outputs.

## Landed Selection

Gate CA has now landed:

`post_v1_next_numeric_coverage_gap_gate_ca_plan`

Gate CA status:

`post_v1_next_numeric_coverage_gap_gate_ca_landed_no_runtime_selected_floor_open_box_eps_screed_full_mixed_field_building_gate_cb`

Selected next action:

`post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_plan`

Selected next file:

`packages/engine/src/post-v1-floor-open-box-eps-screed-full-mixed-field-building-gate-cb-contract.test.ts`

Gate CB has now landed as:

`post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_plan`

Gate CB status:

`post_v1_floor_open_box_eps_screed_full_mixed_field_building_gate_cb_landed_selected_next_numeric_coverage_gap_gate_cc`

Gate CB selected next action:

`post_v1_next_numeric_coverage_gap_gate_cc_plan`

## Expected Before And After

Gate CB must open only the owned EPS/screed field-impact companions in a
complete full mixed building/impact request:

- EPS/screed hybrid remains `Rw 72 / C -1.3` and
  `R'w 70 / DnT,w 73`;
- lab impact remains
  `Ln,w 47 / CI 0 / CI,50-2500 1 / Ln,w+CI 47`;
- explicit `impactFieldContext` must add
  `L'n,w 49 / L'nT,w 46.6 / L'nT,50 47.6`;
- missing `impactFieldContext` must still leave `L'n,w`, `L'nT,w`, and
  `L'nT,50` unsupported;
- `Ctr`, ASTM `IIC`, and ASTM `AIIC` must remain unsupported because
  their metric-basis owners are separate.

## Blocked Non-Goals

Gate CA keeps these out of the selected slice:

- broad source-row crawl;
- finite scenario pack;
- confidence wording or low-confidence surface;
- generic UI, report, auth, storage, or persistence work.

## Validation

Gate CA is covered by:

`packages/engine/src/post-v1-next-numeric-coverage-gap-gate-ca-contract.test.ts`

Full validation evidence is recorded in the Gate CB plan after the
runtime closeout. Gate CB full closeout passed
`pnpm calculator:gate:current` with engine 592 files / 3267 tests, web
113 files / 437 passed + 18 skipped, repo build 5 / 5, and whitespace
guard passed.
