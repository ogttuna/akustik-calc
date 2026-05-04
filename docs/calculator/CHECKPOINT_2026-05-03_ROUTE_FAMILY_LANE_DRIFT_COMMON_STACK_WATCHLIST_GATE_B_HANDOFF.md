# Checkpoint - 2026-05-03 - Route Family Lane Drift Common Stack Watchlist Gate B

Slice:

`route_family_lane_drift_common_stack_watchlist_v1`

Gate landed:

`gate_b_reprobe_common_stack_route_family_and_value_drift_no_runtime`

Status:

`common_stack_lane_drift_reprobes_landed_no_runtime_selected_gate_c_classification`

Selected next action:

`gate_c_classify_reprobe_findings_and_select_bounded_fix_or_closeout_no_runtime`

Selected next file:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts`

Implementation artifact:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts`

Prior Gate A status:

`common_stack_lane_drift_inventory_landed_no_runtime_selected_gate_b_reprobes`

Prior Gate A file:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-a-contract.test.ts`

Planning surface:

`docs/calculator/SLICE_ROUTE_FAMILY_LANE_DRIFT_COMMON_STACK_WATCHLIST_PLAN.md`

## Summary

Gate B lands focused no-runtime reprobes for the common-stack
route-family/source-lane watchlist selected by Gate A. It does not move
runtime, support, confidence, evidence, API, route-card, output-card,
proposal/report, or workbench-input behavior.

Gate B confirms three wrong-lane/value findings that are close to the
original rockwool reorder failure pattern:

- `split_rockwool_flat_swap_3_4_wrong_lane_reproduced`: the
  split-rockwool grouped and flat stacks remain low-confidence
  `multileaf_screening_blend`, `Rw 41`, but a small flat-list
  rockwool/internal-board swap moves the same stack to medium-confidence
  `double_leaf`, `Rw 51`. Field values also move from `R'w 39` /
  `DnT,w 40` to `R'w 49` / `DnT,w 51`.
- `ordinary_classic_triple_leaf_swap_wrong_lane_reproduced`: a common
  framed wall moves from low-confidence `multileaf_screening_blend`,
  `Rw 32`, to medium-confidence `double_leaf`, `Rw 44`.
- `heavy_multileaf_lined_massive_boundary_reproduced`: an AAC / board /
  fill / gap hybrid moves from `multileaf_screening_blend`, `Rw 39`, to
  `lined_massive_wall`, `Rw 49`, with `family-boundary hold`.

These are documented defects, not fixes. Gate B selects Gate C so the
findings can be classified into either a bounded fix gate with negative
boundaries and paired web-visible tests, or documented/fail-closed
follow-up work.

## Other Reprobes

- Duplicate classic and heavy stacks remain finite, but drift from
  `Rw 32` to `Rw 37` and from `Rw 39` to `Rw 46`; they remain on the
  duplicate/many-layer watchlist.
- Known raw CLT dry floor input remains green: raw, tagged, and reversed
  variants match `dataholz_gdmtxn01_dry_clt_lab_2026`, `Rw 62`,
  `Ln,w 50`. Ambiguous raw imports still need explicit role/tag or exact
  row handling before any value promotion.
- Generic gypsum / gypsum board / firestop aliases remain formula-owned
  context only; they do not promote to Knauf, British Gypsum, NRC, or
  other near-source exact source rows.
- Field outputs remain a visible-policy risk: `R'w` / `DnT,w` values can
  be produced from screening/lab bases, but route/output cards must not
  make them look source-exact without policy and paired web tests.
- Hostile API/import inputs still fail closed for unknown material,
  infinite thickness, and negative thickness before route or value
  selection.
- Curve digitization / provenance stays blocked until a source gate
  supplies locked axes, band values, rating derivation, and uncertainty
  payload.

## Rockwool Status

The original rockwool issue is still open. The Uris 2006 source lane
remains `paused_waiting_rights_safe_source_packet`; the current grouped
`Rw 41` `multileaf_screening_blend` answer must not be presented as
fixed, correct, or source-validated.

Gate B makes the defect sharper: a small flat-list swap can now be
pointed to as `split_rockwool_flat_swap_3_4_wrong_lane_reproduced`,
where `Rw 41` becomes `Rw 51` because the route family changes to
`double_leaf`.

## Standing Rule

`standing_lane_misclassification_monitoring_mandate`

Every future calculator slice must keep looking for route-family or
source-lane mistakes on frequent wall/floor stacks. If a common stack
falls into the wrong lane, jumps after a small layer edit, promotes a
near-source row as exact, leaks field metrics, or returns an absurd
value, apply `note_test_document_or_easy_fix`: reproduce with a focused
test, fix only when bounded, or document and keep output fail-closed.

## Gate C Scope

Gate C should add:

`packages/engine/src/route-family-lane-drift-common-stack-watchlist-gate-c-classification.test.ts`

Gate C should run:

`gate_c_classify_reprobe_findings_and_select_bounded_fix_or_closeout_no_runtime`

Gate C must decide whether the three confirmed wrong-lane findings can
receive a bounded implementation fix now. A fix gate is only acceptable
if it has:

- route-family negative boundaries for ordinary double-leaf, simple
  stud, lined-massive, grouped triple-leaf, many-layer, and known floor
  exact rows;
- paired engine and web-visible route/output tests if any user-facing
  family, support, confidence, or copy can move;
- no source promotion, confidence promotion, or value retune hidden
  inside the classification.

## Validation

Required validation for this checkpoint:

- focused Gate B reprobe contract:
  `pnpm --filter @dynecho/engine exec vitest run src/route-family-lane-drift-common-stack-watchlist-gate-b-reprobes.test.ts --maxWorkers=1`;
- continuity with Gate A, v15 Gate A, and route-source risk register;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Completed validation on 2026-05-03:

- focused Gate B: 1 file / 10 tests passed;
- continuity with v15 Gate A, watchlist Gate A, watchlist Gate B, and
  route-source risk register: 4 files / 32 tests passed;
- `pnpm calculator:gate:current`: engine 221 files / 1241 tests passed,
  web 47 files / 227 passed + 18 skipped, repo build 5 / 5 passed with
  known non-fatal `sharp/@img` warnings;
- `apps/web/next-env.d.ts` restored to `.next-typecheck` after the
  Next build side-effect;
- `git diff --check` passed.
