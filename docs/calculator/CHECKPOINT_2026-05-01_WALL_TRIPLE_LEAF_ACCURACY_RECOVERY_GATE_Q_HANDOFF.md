# Checkpoint - 2026-05-01 - Wall Triple Leaf Accuracy Recovery Gate Q

Slice:

`wall_triple_leaf_accuracy_recovery_v1`

Gate Q status:

`gate_q_landed_source_access_backlog_and_blocker_revalidation_no_runtime_selected_manual_source_packet_gate_r`

Selected next file:

`packages/engine/src/wall-triple-leaf-manual-source-packet-gate-r.test.ts`

## Summary

Gate Q lands source-access backlog and runtime-blocker revalidation with
no runtime movement. It adds:

- `packages/engine/src/wall-triple-leaf-source-access-followup.ts`
- `packages/engine/src/wall-triple-leaf-source-access-followup-gate-q.test.ts`

The gate turns the Gate P access decision into an ordered manual/source
backlog, maps each Gate P runtime blocker to concrete follow-up
ownership, and confirms every blocker remains open.

## Backlog Decision

Ordered backlog:

1. `uris_2006_authorized_curve_packet`
2. `uris_2006_digitization_qc_packet`
3. `local_material_and_effect_mapping_packet`
4. `support_topology_mapping_packet`
5. `paired_visible_runtime_acceptance_packet`
6. `uris_2008_perforated_facing_separate_lane`

The first item is a manual source packet for
`uris_2006_internal_gypsum_50mm_mineral_wool_double_frame`. It must
provide a rights-safe source PDF/page image or authorized TDM output,
page/figure/table locator, source-owned one-third-octave TL vectors or
reproducible plot evidence, and a reported/derived Rw/STC plus
uncertainty owner.

The Uris 2008 perforated-facing source remains a separate lane and
negative boundary. It does not replace the Uris 2006 internal-board
source row.

## Runtime Blocker Revalidation

Still open:

- `missing_source_owned_numeric_curves_or_table`
- `missing_uris_2006_authorized_pdf_or_page_image`
- `accessible_alternative_has_perforated_facing_topology`
- `alternative_rows_are_context_or_glazing_only`
- `near_source_promotion_rejected`
- `missing_local_material_support_mapping`
- `missing_paired_visible_runtime_tests`

No blocker is closed by Gate Q. No runtime, support, confidence,
evidence, API, route-card, output-card, proposal/report, or workbench
input behavior moves.

## Runtime Posture

Runtime remains fail-closed:

- split-rockwool grouped stack: `multileaf_screening_blend`, `Rw 41`,
  low confidence;
- no support promotion;
- no confidence promotion;
- no evidence promotion;
- no route-card or output-card value/status movement;
- no proposal/report copy movement;
- no API or workbench input behavior movement.

Do not present `Rw 41` as fixed, correct, or source-validated. Gate Q
only organizes the work needed before a future runtime claim can be
considered.

## Gate R Selection

Gate R should formalize manual source-packet intake:

`packages/engine/src/wall-triple-leaf-manual-source-packet-gate-r.test.ts`

Gate R must keep runtime frozen unless it can name:

- a rights-safe Uris 2006 source packet;
- source PDF/page image or authorized TDM output;
- page/figure/table locator and curve identity;
- source-owned one-third-octave curves/table data or reproducible
  digitization evidence;
- Rw/STC derivation and uncertainty owner;
- local material/support mapping, source-gap closure, topology guards,
  and paired visible tests.

## Validation

Focused Gate Q validation:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-access-followup-gate-q.test.ts --maxWorkers=1`
  green on 2026-05-01: 1 file / 7 tests.

Continuity validation:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-source-access-gate-p.test.ts src/wall-triple-leaf-source-locator-provenance-gate-o.test.ts src/wall-triple-leaf-source-locator-intake-gate-n.test.ts src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts --maxWorkers=1`
  green on 2026-05-01: 5 files / 35 tests.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts --maxWorkers=1`
  green on 2026-05-01: 1 file / 7 tests.
- `pnpm calculator:gate:current`
  green on 2026-05-01 after adding Gate Q after Gate P: engine 185
  files / 974 tests, web 47 files / 227 passed + 18 skipped, build
  5/5 with the known non-fatal `sharp/@img` warnings, whitespace guard
  clean.
- `git diff --check`
  green on 2026-05-01.
