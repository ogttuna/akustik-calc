# Checkpoint - 2026-05-02 - Wall Triple Leaf Accuracy Recovery Gate T

Slice:

`wall_triple_leaf_accuracy_recovery_v1`

Gate T status:

`gate_t_paused_uris_2006_source_lane_no_runtime_selected_source_gap_revalidation_v8`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts`

## Summary

Gate T lands the manual source-packet acquisition handoff with no
runtime movement. It adds:

- `packages/engine/src/wall-triple-leaf-manual-source-packet-handoff.ts`
- `packages/engine/src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts`

Gate T confirms that the Uris 2006 source lane cannot move while the
rights-safe source packet remains absent. The lane is paused with a
manual acquisition checklist, and the calculator should re-rank to the
next implementable accuracy slice through source-gap revalidation v8.

## Acquisition Checklist

Required before this Uris 2006 lane can reopen:

1. `authorized_source_file_or_tdm_payload`
2. `rights_and_storage_note`
3. `source_identity_metadata`
4. `page_figure_table_locator`
5. `curve_identity_map`
6. `band_vector_or_digitization_payload`
7. `rating_derivation_and_uncertainty`
8. `chain_of_custody_review`

The source-lane disposition is:

`paused_waiting_rights_safe_source_packet`

Metadata, public summaries, adjacent NRC graph packets, user repro PDFs,
and unrelated local PDFs are not enough to satisfy this checklist.
Copied source text or source images must not be embedded into runtime
code. Runtime may only reopen after source-packet, mapping, topology,
and paired visible tests all pass together.

## Runtime Posture

Runtime remains fail-closed:

- split-rockwool grouped stack: `multileaf_screening_blend`, `Rw 41`,
  low confidence;
- no rights-safe Uris 2006 packet available now;
- no source-owned band vectors available now;
- no digitization selected now;
- no runtime import selected now;
- no support, confidence, or evidence promotion;
- no API, route-card, output-card, proposal/report, or workbench input
  behavior movement.

Do not present `Rw 41` as fixed, correct, or source-validated. Gate T
only closes the current Uris 2006 lane as an external acquisition
dependency and selects source-gap revalidation v8.

## Source Gap Revalidation v8 Selection

Next implementation should start at:

`packages/engine/src/calculator-source-gap-revalidation-v8-gate-a-contract.test.ts`

The v8 revalidation should compare the paused Uris 2006 lane against
the remaining calculator accuracy backlog and select the next
implementable, source-defensible slice without runtime promotion unless
all source, mapping, tolerance, topology, and visible-test owners are
present.

## Validation

Focused Gate T validation:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts --maxWorkers=1`
  green on 2026-05-02: 1 file / 7 tests.

Continuity validation:

- `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-manual-source-packet-handoff-gate-t.test.ts src/wall-triple-leaf-source-packet-availability-gate-s.test.ts src/wall-triple-leaf-manual-source-packet-gate-r.test.ts src/wall-triple-leaf-source-access-followup-gate-q.test.ts src/wall-triple-leaf-source-access-gate-p.test.ts src/wall-triple-leaf-source-locator-provenance-gate-o.test.ts src/wall-triple-leaf-source-locator-intake-gate-n.test.ts src/wall-triple-leaf-source-evidence-acquisition-gate-m.test.ts src/wall-triple-leaf-runtime-promotion-readiness-gate-k.test.ts --maxWorkers=1`
  green on 2026-05-02: 9 files / 63 tests.
- `pnpm --filter @dynecho/web exec vitest run features/workbench/wall-triple-leaf-company-internal-acceptance-rehearsal.test.ts --maxWorkers=1`
  green on 2026-05-02: 1 file / 7 tests.
- `pnpm calculator:gate:current`
  green on 2026-05-02 after adding Gate T to the runner: engine 188
  files / 995 tests, web 47 files / 227 passed + 18 skipped, build
  5/5 with the known non-fatal `sharp/@img` warnings, whitespace guard
  clean.
- `git diff --check`
  green on 2026-05-02.
