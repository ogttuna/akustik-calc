# Slice Plan - Wall Triple-Leaf Uris 2006 Source Packet Acquisition v1

Slice id: `wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1`

Status: SELECTED / GATE U NEXT

Selected by:

`calculator_source_gap_revalidation_v19` Gate A

Selection status:

`selected_uris_2006_rights_safe_source_packet_acquisition_after_v19_rerank_prioritized_unfixed_split_rockwool_and_found_no_runtime_ready_candidate`

Selected first file:

`packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts`

Selected first action:

`gate_u_acquire_or_reject_rights_safe_uris_2006_source_packet_no_runtime`

Prior v19 checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_CALCULATOR_SOURCE_GAP_REVALIDATION_V19_GATE_A_HANDOFF.md`

## Objective

Make a fresh, bounded source-acquisition decision for the original
split-rockwool triple-leaf defect. This slice must either locate a
rights-safe Uris 2006 packet or equivalent source-owned rockwool
two-cavity curve payload, or explicitly keep the lane paused without
runtime movement.

This is not a runtime-promotion slice. The live grouped split-rockwool
answer remains `multileaf_screening_blend`, `Rw 41`, low confidence,
and not fixed.

## Gate U Required Artifacts

Gate U must produce:

- `uris_2006_rights_safe_source_packet_acquisition_attempt`
- `equivalent_rockwool_two_cavity_source_payload_scan`
- `source_packet_runtime_readiness_or_rejection_reason`
- `nrc_2024_comparator_boundary_still_not_local_runtime`
- `rw41_screening_answer_remains_not_fixed_until_packet_mapping_and_visible_tests`
- `selected_next_gate_with_target_file_and_validation_scope`

## Required Packet Contents

No packet can influence runtime unless it contains or defensibly derives:

- rights-safe source file, page image, authorized TDM output, or numeric
  table;
- source identity metadata, DOI/PII/report locator, and page/figure/table
  locator;
- curve identity map for the exact rockwool/mineral-wool two-cavity
  internal-board row;
- one-third-octave band vectors or reproducible digitization payload;
- Rw/STC derivation and uncertainty owner;
- local `rockwool`, gypsum board, MLV, gypsum plaster, cavity, and
  support topology mapping plan;
- protected negative boundaries for NRC 2024, Uris 2008, manufacturer
  STC/OITC rows, ordinary double-leaf rows, and lined-masonry rows;
- paired engine and web-visible tests before any exact promotion.

## Non-Promotion Rules

Gate U must not treat any of these as enough:

- DOI, abstract, citation, or metadata without source-owned curves;
- the reported 7-8 dB weighted-index decrease as a reusable penalty;
- NRC 2024 graph rows as local rockwool runtime evidence;
- ROCKWOOL / USG / National Gypsum / Georgia-Pacific / PABCO /
  CertainTeed STC/OITC context rows as Uris two-cavity curves;
- user repro PDFs or miscellaneous local PDFs as source evidence;
- local material aliases without tolerance ownership.

## Validation

Required for Gate U:

1. focused Gate U contract:
   `pnpm --filter @dynecho/engine exec vitest run src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts --maxWorkers=1`
2. continuity with v19, Gate T manual source-packet handoff, source
   packet availability Gate S, route-source risk register, and the
   split-rockwool flat-list guard;
3. `pnpm calculator:gate:current` after adding Gate U to the runner;
4. `git diff --check`.
