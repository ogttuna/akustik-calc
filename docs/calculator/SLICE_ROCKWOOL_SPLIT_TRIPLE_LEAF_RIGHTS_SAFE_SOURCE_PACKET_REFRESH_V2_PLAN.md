# Slice Plan - Rockwool Split Triple-Leaf Rights-Safe Source Packet Refresh V2

Slice id: `rockwool_split_triple_leaf_rights_safe_source_packet_refresh_v2`

Status: SUPERSEDED AS ACTIVE NEXT STEP / RETAINED FOR EXACT-SOURCE BACKLOG

Selected by:

`calculator_source_gap_revalidation_v28` Gate A

Selection status:

`selected_rockwool_split_triple_leaf_rights_safe_source_packet_refresh_after_v28_rerank_no_runtime_candidates_after_ubiq_packaged_finish`

Gate A file:

`packages/engine/src/rockwool-split-triple-leaf-rights-safe-source-packet-refresh-v2-gate-a-contract.test.ts`

Gate A action:

`gate_a_refresh_rights_safe_rockwool_triple_leaf_source_packet_search_without_runtime`

Selected planning surface:

`docs/calculator/SLICE_ROCKWOOL_SPLIT_TRIPLE_LEAF_RIGHTS_SAFE_SOURCE_PACKET_REFRESH_V2_PLAN.md`

## Supersession Notice - 2026-05-05

This plan is no longer the active next implementation slice.

It was superseded by:

`docs/calculator/SLICE_CALCULATOR_MODEL_FIRST_PHYSICS_PREDICTION_PIVOT_V1_PLAN.md`

Reason:

The source-packet refresh path is valid only for measured-exact or
source-validated promotion. It is too narrow as the active path because
DynEcho must calculate unknown assemblies with family-specific acoustic
physics. A missing Rockwool/Uris source packet still blocks exact
source-backed promotion, but it must not block a labelled
`family_physics_prediction`.

Keep this document as backlog for later triple-leaf source calibration,
exact row promotion, and rights-safe packet acquisition. Do not use it
to block the model-first physics-prediction pivot.

## Objective

Make one bounded, rights-safe source-packet refresh for the Rockwool
split/internal gypsum-leaf triple-leaf blocker. The goal is to unblock a
future exact numeric runtime fix only if a source-owned payload can name
the required topology, material mapping, metrics, tolerance,
negative-boundary, calibration/holdout, and visible-test ownership.

This is not a runtime-promotion slice. It must not retune the current
`Rw 41` screening diagnostic, promote confidence, or expose the
flat-list split Rockwool outputs as supported.

## Current Blocker

First missing runtime requirement:

`rights_safe_source_owned_curve_payload_absent`

Inputs from V28:

- `ubiq_packaged_finish_current_gate_pack_preserved_after_v28`
- `rockwool_numeric_boundaries_after_v28`
- `rockwool_rights_safe_source_packet_refresh_selected_after_v28`
- `raw_open_web_and_company_internal_blockers_carry_forward_after_v28`

The previous Uris 2006 source-packet attempt confirmed source identity
but did not produce a rights-safe local payload. This V2 refresh is
selected only because the source-backed UBIQ open-web guard work is now
closed and Rockwool remains the highest user-visible correctness
blocker. It must avoid repeating the same metadata-only acquisition
loop.

## Gate A Work

Create:

`packages/engine/src/rockwool-split-triple-leaf-rights-safe-source-packet-refresh-v2-gate-a-contract.test.ts`

Gate A should:

1. Re-check existing local source-packet state and the previous Uris
   Gate U decision.
2. Decide whether any rights-safe local packet or authorized source
   payload is now available for the Rockwool/two-cavity/internal-board
   topology.
3. Search only for rights-safe source identities or packet acquisition
   paths; do not import copyrighted page images or curves into the repo
   without a permissible local payload.
4. Accept a payload only if it can name source identity, figure/table or
   curve locator, band vectors or reproducible digitization, `Rw`/field
   metric derivation, local Rockwool/material topology mapping,
   tolerance owner, negative boundaries, calibration/holdout owner, and
   paired engine/web test ownership.
5. If no payload exists, close the slice no-runtime with an explicit
   durable blocker and select the next bounded correctness step.

## Required Non-Promotion Rules

Do not treat these as enough for exact runtime:

- DOI, PII, abstract, citation, or publisher metadata.
- A reported weighted-index delta without curves/bands.
- NRC 2024 or Ballagh model context without local Rockwool mapping and
  tolerance ownership.
- Uris 2008 perforated-facing context.
- ROCKWOOL, USG, National Gypsum, Georgia-Pacific, PABCO, CertainTeed,
  or British Gypsum STC/OITC assemblies that do not own the exact
  two-cavity internal-board topology.
- user PDFs or miscellaneous local PDFs without source identity,
  rights-safe status, and extraction ownership.

## Carry-Forward Runtime Boundaries

- adjacent Rockwool remains supported at `Rw 51 / R'w 49 / DnT,w 51`.
- flat-list split/internal gypsum-leaf Rockwool remains unsupported for
  requested wall airborne outputs and diagnostic-only at
  `Rw 41 / R'w 39 / DnT,w 40`.
- grouped Rockwool remains screening-only/source-blocked at `Rw 41`.
- generic/raw open-web widening remains blocked by
  `source_owned_raw_carrier_negative_boundary_absent`.

## Validation Plan

Focused Gate A:

```sh
pnpm --filter @dynecho/engine exec vitest run src/rockwool-split-triple-leaf-rights-safe-source-packet-refresh-v2-gate-a-contract.test.ts --maxWorkers=1
```

Continuity:

```sh
pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v28-gate-a-contract.test.ts src/wall-triple-leaf-uris2006-source-packet-acquisition-gate-u.test.ts src/rockwool-split-triple-leaf-numeric-source-closure-gate-a-contract.test.ts src/rockwool-split-triple-leaf-numeric-source-closure-gate-b-runtime.test.ts src/post-rockwool-split-triple-leaf-numeric-source-closure-v1-next-slice-selection-contract.test.ts --maxWorkers=1
```

Final gate:

```sh
pnpm calculator:gate:current
git diff --check
```
