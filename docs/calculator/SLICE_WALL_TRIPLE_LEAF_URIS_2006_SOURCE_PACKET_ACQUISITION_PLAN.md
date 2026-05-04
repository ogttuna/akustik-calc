# Slice Plan - Wall Triple-Leaf Uris 2006 Source Packet Acquisition v1

Slice id: `wall_triple_leaf_uris_2006_rights_safe_source_packet_acquisition_v1`

Status: GATE U LANDED / CLOSED NO-RUNTIME / V20 NEXT

Selected by:

`calculator_source_gap_revalidation_v19` Gate A

Selection status:

`selected_uris_2006_rights_safe_source_packet_acquisition_after_v19_rerank_prioritized_unfixed_split_rockwool_and_found_no_runtime_ready_candidate`

Selected first file:

`packages/engine/src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts`

Selected first action:

`gate_u_acquire_or_reject_rights_safe_uris_2006_source_packet_no_runtime`

Gate U status:

`gate_u_rechecked_uris_2006_rights_safe_source_packet_absent_no_runtime_selected_source_gap_revalidation_v20`

Gate U checkpoint:

`docs/calculator/CHECKPOINT_2026-05-04_WALL_TRIPLE_LEAF_URIS_2006_SOURCE_PACKET_ACQUISITION_GATE_U_HANDOFF.md`

Selected next slice:

`calculator_source_gap_revalidation_v20`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v20-gate-a-contract.test.ts`

Selected next action:

`gate_a_revalidate_source_accuracy_gap_order_after_uris_2006_acquisition_attempt`

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

## Gate U Result - 2026-05-04

Gate U confirmed the source identity but did not find a runtime-ready
source packet.

Inspected acquisition candidates:

- `crossref_metadata_record`: confirms DOI/PII/title/journal identity
  only; it does not supply page images, curve identity, band vectors, or
  rating derivation.
- `elsevier_tdm_endpoint_for_pii_s0003682x05001799`: authorized access
  path only; no authorized local payload is present.
- `sciencedirect_article_page`: concrete article locator only; no local
  rights-safe PDF, page image, table, or authorized TDM output is
  present.
- `local_uris_2006_source_packet_path`: absent in the local rights-safe
  corpus.
- `opendeved_catalog_metadata_mirror`: public catalogue metadata only;
  not source-owned curve payload.

Equivalent payload scan:

- `nrc_2024_comparator_boundary_still_not_local_runtime`
- `uris_2008_perforated_facing_not_uris_2006_internal_board_runtime`
- `near_source_manufacturer_rows_do_not_fix_uris_2006_split_rockwool`
- `metadata_only_not_source_packet`

First runtime blocker:

`rights_safe_source_owned_curve_payload_absent`

The result is a hard no-runtime closeout. Gate U selected
`calculator_source_gap_revalidation_v20` so the project can re-rank the
remaining accuracy backlog while keeping the Uris source packet absence
explicit.

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
