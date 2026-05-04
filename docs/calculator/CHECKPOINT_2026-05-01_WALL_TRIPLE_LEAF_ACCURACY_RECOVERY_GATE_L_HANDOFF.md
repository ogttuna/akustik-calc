# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate L Handoff

Date: 2026-05-01

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: L

Status: LANDED / SOURCE-GAP CLOSURE / NO RUNTIME

Gate L status:

`gate_l_confirmed_source_gaps_remain_open_no_runtime_selected_source_evidence_acquisition_gate_m`

Next implementation file:

`packages/engine/src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts`

## Decision

Gate L adds the executable source-gap closure decision for the
user-reported triple-leaf / rockwool reorder defect. It does not move
runtime numbers, support status, confidence, evidence tier, API shape,
output-card status/value, route-card values, workbench behavior, or
proposal/report metric claims.

The Gate L contract is:

`packages/engine/src/wall-triple-leaf-source-gap-closure-gate-l.test.ts`

The Gate L decision model is:

`packages/engine/src/wall-triple-leaf-source-gap-closure.ts`

Runtime remains fail-closed on `multileaf_screening_blend`.

## Closure Result

Gate L starts from the Gate K source-gap closure plan and confirms that
none of the six local gaps can be closed from the currently available
repo evidence.

Open gaps:

- `local_type_c_board_product_mapping`:
  `open_missing_local_product_mapping`;
- `rockwool_absorber_equivalence_or_measured_row`:
  `open_missing_direct_row_or_equivalence`;
- `local_50mm_rockwool_cavity_source_row`:
  `open_adjacent_reference_only`;
- `mlv_limp_mass_triple_leaf_effect_model`:
  `open_missing_bounded_effect_model`;
- `gypsum_plaster_face_finish_effect_model`:
  `open_missing_bounded_effect_model`;
- `support_gauge_depth_and_spacing_mapping`:
  `open_missing_topology_input_owner`.

Gate L explicitly refuses to treat adjacent NRC 2024 Type C board,
glass-fiber batt, 92.1 mm cavity, or double-stud support references as
local runtime evidence for the user stack.

## Runtime Hold

The live split-rockwool PDF repro remains low-confidence
`multileaf_screening_blend` `Rw 41`. Gate L proves that source gaps
remain open; it does not prove that `Rw 41` is correct.

Do not present the current answer as fixed or validated. It is still a
fail-closed screening result with explicit diagnostics.

## Gate M Selection

Gate L selects source evidence acquisition as the next bounded step:

`packages/engine/src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts`

Gate M should decide which evidence acquisition path is concrete enough
to pursue first for the still-open local gaps. Runtime must stay frozen
unless a later gate proves all local material/source-pack/tolerance/
topology/test prerequisites together.

The immediate evidence acquisition targets are:

- local gypsum-board Type C product identity and mass/thickness
  tolerance;
- rockwool/mineral-wool measured row or flow-resistivity/density
  equivalence;
- 50 mm two-cavity rockwool triple-leaf one-third-octave row;
- MLV limp-mass triple-leaf effect model or same-position measured row;
- gypsum plaster face-finish delta row or bounded damping model;
- support gauge/depth/spacing and frame-independence input ownership.

## Validation

Focused Gate L validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-gap-closure-gate-l.test.ts --maxWorkers=1`
  green on 2026-05-01: 1 file / 7 tests.
- `pnpm --filter @dynecho/engine lint`
  green on 2026-05-01.

Gate L current-gate validation completed:

- `pnpm calculator:gate:current`
  green on 2026-05-01 after adding Gate L to the current runner:
  engine 180 files / 939 tests, web 47 files / 227 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
