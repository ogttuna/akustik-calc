# Checkpoint - Wall Triple-Leaf Accuracy Recovery Gate M Handoff

Date: 2026-05-01

Slice: `wall_triple_leaf_accuracy_recovery_v1`

Gate: M

Status: LANDED / SOURCE EVIDENCE ACQUISITION / NO RUNTIME

Gate M status:

`gate_m_selected_rockwool_two_cavity_source_evidence_first_no_runtime_selected_source_locator_intake_gate_n`

Next implementation file:

`packages/engine/src/wall-triple-leaf-source-locator-intake-gate-n.test.ts`

## Decision

Gate M adds the executable source evidence acquisition decision for the
user-reported triple-leaf / rockwool reorder defect. It does not move
runtime numbers, support status, confidence, evidence tier, API shape,
output-card status/value, route-card values, workbench behavior, or
proposal/report metric claims.

The Gate M contract is:

`packages/engine/src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts`

The Gate M decision model is:

`packages/engine/src/wall-triple-leaf-source-evidence-acquisition.ts`

Runtime remains fail-closed on `multileaf_screening_blend`.

## Selected Evidence Path

Gate M selects `rockwool_two_cavity_band_curve_source_pack` as the
first source evidence path. It is the highest-leverage path because it
targets both of the source gaps most directly tied to the user symptom:

- `rockwool_absorber_equivalence_or_measured_row`; and
- `local_50mm_rockwool_cavity_source_row`.

Gate N should intake direct measured rows, reproducibly graph-digitized
rows, or flow-resistivity/density equivalence packs for a triple-leaf
two-cavity wall with rockwool/mineral-wool fill, 50 mm-class cavities,
fill coverage, one-third-octave TL curves, Rw/STC derivation, and
source-owned uncertainty.

## Follow-On Blockers

Gate M keeps these tracks open and runtime-blocking:

- `local_type_c_board_product_mapping_pack`;
- `support_topology_input_owner_pack`;
- `mlv_limp_mass_effect_model_pack`;
- `gypsum_plaster_face_finish_delta_pack`.

These follow-on tracks must be handled by later mapping/tolerance or
effect-model gates before any exact runtime claim.

## Runtime Hold

The live split-rockwool PDF repro remains low-confidence
`multileaf_screening_blend` `Rw 41`. Gate M selects a source evidence
path; it does not prove that `Rw 41` is correct and does not close the
local source gaps.

Do not present the current answer as fixed or validated. It is still a
fail-closed screening result with explicit diagnostics.

## Gate N Selection

Gate M selects rockwool two-cavity source locator intake as the next
bounded step:

`packages/engine/src/wall-triple-leaf-source-locator-intake-gate-n.test.ts`

Gate N must classify source locators for
`rockwool_two_cavity_band_curve_source_pack` without runtime movement.
Runtime must stay frozen unless a later gate proves all local
material/source-pack/tolerance/topology/test prerequisites together.

## Validation

Focused Gate M validation completed:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts --maxWorkers=1`
  green on 2026-05-01: 1 file / 7 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-gap-closure-gate-l.test.ts --maxWorkers=1`
  green on 2026-05-01 after preserving Gate L doc continuity: 1 file /
  7 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts --maxWorkers=1`
  green on 2026-05-01 after preserving Gate K doc continuity: 1 file /
  7 tests.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts --maxWorkers=1`
  green on 2026-05-01 after preserving Gate J web continuity: 1 file /
  7 tests.
- `pnpm --filter @dynecho/engine lint`
  green on 2026-05-01.

Gate M current-gate validation completed:

- `pnpm calculator:gate:current`
  green on 2026-05-01 after adding Gate M to the current runner:
  engine 181 files / 946 tests, web 47 files / 227 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
