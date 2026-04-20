# Checkpoint 2026-04-19 Mixed Floor Wall Seeded Chain Closeout Handoff

Document role:

- define the current checkpoint after the mixed seeded floor/wall no-runtime
  follow-up and the blocked-source refresh close out cleanly
- map the living plan to implemented work without pretending a blocked runtime
  candidate has reopened
- give the next agent a short restart path, a fresh validation gate, and an
  explicit not-done list

This is a checkpoint document, not a new solver plan.

Use [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md) as the current
next-step authority.
Use [CURRENT_STATE.md](./CURRENT_STATE.md) as the short verified snapshot.
Use [SYSTEM_MAP.md](./SYSTEM_MAP.md) for the live runtime/file map.

## Two-Minute Restart

1. Read this file first.
2. Open [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Confirm the active selected slice is now
   `dataholz_clt_calibration_tightening`.
4. Open:
   - [post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts](../../packages/engine/src/post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts)
   - [post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts](../../packages/engine/src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts)
   - [blocked-source-backed-widening-rerank-refresh-contract.test.ts](../../packages/engine/src/blocked-source-backed-widening-rerank-refresh-contract.test.ts)
   - [post-blocked-source-backed-widening-rerank-refresh-next-slice-selection-contract.test.ts](../../packages/engine/src/post-blocked-source-backed-widening-rerank-refresh-next-slice-selection-contract.test.ts)
   - [source-gap-candidate-re-rank-contract.test.ts](../../packages/engine/src/source-gap-candidate-re-rank-contract.test.ts)
   - [blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts)
   - [dataholz-gdmtxa04a-material-surface-recheck.test.ts](../../packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts)
   - [tuas-c11c-exact-import-readiness.ts](../../packages/engine/src/tuas-c11c-exact-import-readiness.ts)
   - [tuas-c11c-exact-import-readiness-design.test.ts](../../packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts)
   - [post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts](../../packages/engine/src/post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts)
   - [post-raw-bare-open-box-open-web-impact-widening-next-slice-selection-contract.test.ts](../../packages/engine/src/post-raw-bare-open-box-open-web-impact-widening-next-slice-selection-contract.test.ts)
   - [post-wall-selector-behavior-widening-next-slice-selection-contract.test.ts](../../packages/engine/src/post-wall-selector-behavior-widening-next-slice-selection-contract.test.ts)
   - [post-broad-audit-and-replanning-pass-v2-next-slice-selection-contract.test.ts](../../packages/engine/src/post-broad-audit-and-replanning-pass-v2-next-slice-selection-contract.test.ts)
   - [clt-local-combined-interaction-evidence-matrix.test.ts](../../packages/engine/src/clt-local-combined-interaction-evidence-matrix.test.ts)
   - [clt-local-combined-exact-anchor-pack.test.ts](../../packages/engine/src/clt-local-combined-exact-anchor-pack.test.ts)
   - [post-clt-local-combined-interaction-evidence-next-slice-selection-contract.test.ts](../../packages/engine/src/post-clt-local-combined-interaction-evidence-next-slice-selection-contract.test.ts)
   - [post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts](../../packages/engine/src/post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts)
   - [reinforced-concrete-formula-family-closeout-audit.test.ts](../../packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts)
   - [reinforced-concrete-low-confidence-follow-up-matrix.test.ts](../../packages/engine/src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts)
   - [reinforced-concrete-low-confidence-follow-up-origin-matrix.test.ts](../../packages/engine/src/reinforced-concrete-low-confidence-follow-up-origin-matrix.test.ts)
   - [reinforced-concrete-family-formula-fit-audit.test.ts](../../packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts)
   - [reinforced-concrete-low-confidence-edge-continuity.test.ts](../../packages/engine/src/reinforced-concrete-low-confidence-edge-continuity.test.ts)
   - [reinforced-concrete-visible-low-confidence-edge-continuity.test.ts](../../packages/engine/src/reinforced-concrete-visible-low-confidence-edge-continuity.test.ts)
   - [reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.test.ts](../../packages/engine/src/reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.test.ts)
   - [dataholz-clt-source-truth-audit.test.ts](../../packages/engine/src/dataholz-clt-source-truth-audit.test.ts)
   - [dataholz-clt-calibration-tightening-audit.test.ts](../../packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts)
   - [floor-source-corpus-contract.test.ts](../../packages/engine/src/floor-source-corpus-contract.test.ts)
   - [tuas-clt-backlog-decision-contract.test.ts](../../packages/engine/src/tuas-clt-backlog-decision-contract.test.ts)
   - [clt-combined-anchor-history-replay-matrix.test.ts](../../apps/web/features/workbench/clt-combined-anchor-history-replay-matrix.test.ts)
   - [clt-local-combined-exact-anchor-route-card-matrix.test.ts](../../apps/web/features/workbench/clt-local-combined-exact-anchor-route-card-matrix.test.ts)
   - [reinforced-concrete-low-confidence-impact-panels.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts)
   - [reinforced-concrete-low-confidence-follow-up-route-card-matrix.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-route-card-matrix.test.ts)
   - [reinforced-concrete-low-confidence-follow-up-provenance-matrix.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-provenance-matrix.test.ts)
   - [reinforced-concrete-low-confidence-diagnostics-dossier-matrix.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-diagnostics-dossier-matrix.test.ts)
   - [reinforced-concrete-low-confidence-consultant-trail-matrix.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-consultant-trail-matrix.test.ts)
   - [reinforced-concrete-low-confidence-proposal-honesty.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts)
   - [dataholz-clt-source-truth-route.test.ts](../../apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts)
   - [raw-floor-screening-carrier-support.test.ts](../../packages/engine/src/raw-floor-screening-carrier-support.test.ts)
   - [raw-concrete-helper-answer-guard.test.ts](../../packages/engine/src/raw-concrete-helper-answer-guard.test.ts)
   - [raw-floor-hostile-input-answer-matrix.test.ts](../../packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts)
   - [raw-floor-safe-bare-split-parity.test.ts](../../packages/engine/src/raw-floor-safe-bare-split-parity.test.ts)
   - [output-origin-trace-matrix.test.ts](../../packages/engine/src/output-origin-trace-matrix.test.ts)
   - [raw-floor-screening-route-support.test.ts](../../apps/web/features/workbench/raw-floor-screening-route-support.test.ts)
   - [raw-concrete-helper-route-card-guard.test.ts](../../apps/web/features/workbench/raw-concrete-helper-route-card-guard.test.ts)
   - [raw-floor-hostile-input-route-card-matrix.test.ts](../../apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts)
   - [raw-floor-safe-bare-split-parity.test.ts](../../apps/web/features/workbench/raw-floor-safe-bare-split-parity.test.ts)
5. Run `pnpm calculator:gate:current` before touching behavior code.

Do not reopen `GDMTXA04A`, raw open-box/open-web, `C11c`, heavy-concrete
parity, or wall-selector widening first. Dataholz CLT calibration is now the
selected tightening slice, but it must start from the defended source-truth
and calibration surfaces, not from nearby exact-visible hope or blocked-family
pressure alone.

## Current Answer In One Screen

- latest closed implementation slice:
  `reinforced_concrete_accuracy_reopen`
- latest selected next slice:
  `dataholz_clt_calibration_tightening`
- current checkpoint rule:
  the blocked-source refresh, the Dataholz fail-closed closeout, the `C11c`
  fail-closed closeout, the raw bare fail-closed closeout, and the
  wall-selector fail-closed closeout are all closed; the broad audit, raw
  helper closeout, CLT-local closeout, and reinforced closeout are also
  closed, and the next move is the defended Dataholz CLT calibration
  tightening slice
- latest CLT-local evidence artifact pack:
  exact `C4c`, predictor-backed visible `C5c`, and one under-described
  fail-closed local combined boundary are now explicit on the engine/workbench
  evidence surface; runtime widening is still closed
- latest CLT-local closeout result:
  the remaining exact `C2c/C3c/C7c` local combined anchors are now explicit on
  the same engine/workbench evidence surface, the slice is closed, and the
  selected next work is reinforced-concrete follow-up rather than more
  CLT-local sprawl
- latest reinforced-concrete closeout result:
  the explicit engine/workbench matrix, provenance, diagnostics-dossier, and
  consultant-trail surfaces are now all landed for the bounded reinforced
  low-confidence corridor; no fourth defended boundary remained, so the slice
  closed honestly and selected the defended Dataholz CLT calibration corridor
  next
- explicit not-done item:
  no blocked runtime/source candidate has been reopened; the selected next work
  is Dataholz CLT calibration tightening from defended source-truth and
  calibration surfaces, not a blocked-family reopen or another
  reinforced/CLT-local/raw-helper pass by inertia

## What Closed In This Checkpoint

- `mixed_floor_wall_seeded_cross_mode_chain_expansion_v2`
  - widened selected seeded edit-history replay to longer reversed split-order
    chains
  - widened selected duplicate/swap replay from a single global reverse toggle
    to explicit per-plan reverse-mask variants
  - widened selected requested-output restore lanes onto the same reverse-mask
    branch while keeping broad and representative requested-output surfaces on
    their compact branch
  - added a descriptor contract so the requested-output branch split stays
    pinned in the focused gate
  - no solver, catalog, selector, or numeric calculator behavior changed
- closeout selection result:
  - selected `blocked_source_backed_widening_rerank_refresh_v2`
  - reason: the shared seeded follow-up is now closed cleanly and still did
    not produce a fresh classified runtime red, so the honest next step is to
    refresh the blocked-source order instead of reopening a candidate by
    inertia
- blocked-source refresh closeout result:
  - closed `blocked_source_backed_widening_rerank_refresh_v2`
  - selected `dataholz_gdmtxa04a_composite_surface_model_design_v1`
  - reason: the refresh kept `GDMTXA04A` rank 1, and its remaining blocker is
    still a local composite-surface design problem rather than missing source
    truth
- Dataholz design closeout result:
  - closed `dataholz_gdmtxa04a_composite_surface_model_design_v1`
  - selected `tuas_c11c_exact_import_readiness_design_v1`
  - reason: the landed Dataholz design stayed fail-closed, so the next honest
    blocked family is the rank-2 `C11c` exact-import readiness question
- C11c design closeout result:
  - landed `packages/engine/src/tuas-c11c-exact-import-readiness.ts`
  - landed
    `packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts`
  - closed `tuas_c11c_exact_import_readiness_design_v1`
  - selected `raw_bare_open_box_open_web_impact_widening`
  - reason: the landed readiness design pinned the visible schedule and weak
    weighted tuple, but it still did not yield an honest exact-import
    candidate
- raw bare family closeout result:
  - closed `raw_bare_open_box_open_web_impact_widening`
  - selected `wall_selector_behavior_widening`
  - reason: the landed raw blocker pack pinned packaged-system source posture,
    but it still did not yield any honest bare-carrier impact candidate
- wall-selector closeout result:
  - closed `wall_selector_behavior_widening`
  - selected `broad_audit_and_replanning_pass_v2`
  - reason: the landed wall feasibility audit also stayed fail-closed, so the
    next honest move is a fresh validation baseline and plan refresh rather
    than a forced reopen
- broad audit/replanning closeout result:
  - closed `broad_audit_and_replanning_pass_v2`
  - selected `raw_terminal_concrete_helper_family_widening_v1`
  - reason: the full validation baseline stayed green, the blocked-source
    queue remained fail-closed, and the raw terminal-concrete helper lane is
    the best already-live guarded corridor for the next bounded widening step

No solver, catalog, selector, or numeric calculator behavior changed in the
closeout selection step itself.

## File Map For This Checkpoint

- closeout planning contract:
  [post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts](../../packages/engine/src/post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts)
- blocked-source rerank and refresh evidence:
  - [post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts](../../packages/engine/src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts)
  - [post-blocked-source-backed-widening-rerank-refresh-next-slice-selection-contract.test.ts](../../packages/engine/src/post-blocked-source-backed-widening-rerank-refresh-next-slice-selection-contract.test.ts)
  - [source-gap-candidate-re-rank-contract.test.ts](../../packages/engine/src/source-gap-candidate-re-rank-contract.test.ts)
  - [blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts)
  - [dataholz-gdmtxa04a-material-surface-recheck.test.ts](../../packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts)
  - [tuas-c11c-exact-import-readiness.ts](../../packages/engine/src/tuas-c11c-exact-import-readiness.ts)
  - [tuas-c11c-exact-import-readiness-design.test.ts](../../packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts)
  - [post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts](../../packages/engine/src/post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts)
  - [post-raw-bare-open-box-open-web-impact-widening-next-slice-selection-contract.test.ts](../../packages/engine/src/post-raw-bare-open-box-open-web-impact-widening-next-slice-selection-contract.test.ts)
  - [post-wall-selector-behavior-widening-next-slice-selection-contract.test.ts](../../packages/engine/src/post-wall-selector-behavior-widening-next-slice-selection-contract.test.ts)
  - [blocked-source-rank-2-c11c-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts)
  - [blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts)
  - [blocked-source-rank-4-wall-selector-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts)
- closed mixed seeded evidence anchors:
  - [mixed-floor-wall-complex-stack.test.ts](../../packages/engine/src/mixed-floor-wall-complex-stack.test.ts)
  - [mixed-floor-wall-generated-matrix.test.ts](../../packages/engine/src/mixed-floor-wall-generated-matrix.test.ts)
  - [mixed-study-mode-torture.test.ts](../../apps/web/features/workbench/mixed-study-mode-torture.test.ts)
  - [mixed-study-mode-generated-history-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-history-grid.test.ts)
  - [mixed-study-mode-generated-edit-history-matrix.test.ts](../../apps/web/features/workbench/mixed-study-mode-generated-edit-history-matrix.test.ts)
  - [mixed-study-mode-output-card-snapshot-grid.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-grid.test.ts)
  - [mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.test.ts](../../apps/web/features/workbench/mixed-study-mode-output-card-snapshot-requested-output-surface-descriptors.test.ts)
- current focused gate:
  [run-calculator-current-gate.ts](../../tools/dev/run-calculator-current-gate.ts)
- source-backed boundary ledger:
  [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md)

## What Is Planned But Not Done Now

- `dataholz_gdmtxa04a_composite_surface_model_design_v1`
  is no longer the active selected slice; it is now a landed fail-closed
  closeout input for the next selection
  - closed input:
    the blocked-source refresh closeout landed and selected this rank-1
    follow-up explicitly
  - landed design artefacts:
    - `packages/engine/src/dataholz-gdmtxa04a-composite-surface-model.ts`
    - `packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts`
  - closeout result:
    the landed model kept the `65 mm` surface as a convenience proxy and did
    not yield an honest visible exact-reopen candidate
- `tuas_c11c_exact_import_readiness_design_v1`
  is no longer the active selected slice; it is now a landed fail-closed
  closeout input for the next selection
  - landed design artefacts:
    - `packages/engine/src/tuas-c11c-exact-import-readiness.ts`
    - `packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts`
  - closeout result:
    the landed `C11c` design stayed fail-closed and did not yield an honest
    exact-import candidate
- `raw_bare_open_box_open_web_impact_widening`
  is no longer the active selected slice; it is now a landed fail-closed
  closeout input for the next selection
  - closeout result:
    the landed raw blocker pack stayed fail-closed and did not yield an honest
    bare-carrier impact candidate
- `wall_selector_behavior_widening`
  is no longer the active selected slice; it is now a landed fail-closed
  closeout input for the next selection
  - closeout result:
    the landed wall feasibility audit stayed fail-closed and did not yield an
    honest wall reopen candidate
- `raw_terminal_concrete_helper_family_widening_v1`
  is no longer the active selected slice; it is now a landed closeout input
  for the next selection
  - closeout result:
    the helper-family, split-topology, and partial-order matrices plus their
    matching provenance/card-origin guards fully pinned the current raw helper
    support-baseline shapes, so the next honest move became explicit closeout
    selection instead of another widening cut
- `clt_local_combined_interaction_evidence_v1`
  is no longer the active selected slice; it is now a landed closeout input
  for the next selection
  - closeout result:
    the exact anchors, predictor-backed visible proxy, and under-described
    fail-closed local boundary are now explicit on one shared evidence surface
- `reinforced_concrete_accuracy_reopen`
  is no longer the active selected slice; it is now a landed closeout input
  for the next selection
  - closeout result:
    the bounded low-confidence corridor is now explicit across matrix,
    provenance, and report surfaces, so the slice closed honestly and selected
    `dataholz_clt_calibration_tightening`
- `dataholz_clt_calibration_tightening`
  is now the active selected slice
  - active design question:
    which remaining Dataholz exact-vs-estimate or capped-visible slack is
    still defendable without reopening visible `GDMTXA04A` exact matching
- still blocked:
  - `dataholz_gdmtxa04a_visible_exact_reopen`
  - `tuas_c11c_exact_import`
  - `raw_bare_open_box_open_web_impact_widening`
  - `wall_selector_behavior_widening`

## Validation Gate For This Checkpoint

Revalidated on `2026-04-20` after the landed reinforced-concrete closeout
selection and Dataholz CLT focused-gate handoff:

- `pnpm calculator:gate:current`
  - green
  - focused engine gate: `47/47` test files passed, `179/179` tests passed
  - focused web gate: `20/20` test files passed, `38/38` tests passed
- `pnpm check`
  - green
  - full engine suite: `182/182` test files passed, `1015/1015` tests passed
  - full web suite: `129/129` test files passed, `699/699` tests passed
- `pnpm build`
  - green with the known optional `sharp/@img` warnings from the DOCX path
- `git diff --check`
  - green

No calculator/runtime behavior changed in this closeout pass; the landed code
is executable selection contract, focused-gate wiring, and documentation sync
only.

## Exact Resume Target

Keep the next scope on:

- reinforced closeout and active Dataholz CLT anchors:
  [post-raw-terminal-concrete-helper-family-widening-next-slice-selection-contract.test.ts](../../packages/engine/src/post-raw-terminal-concrete-helper-family-widening-next-slice-selection-contract.test.ts),
  [post-clt-local-combined-interaction-evidence-next-slice-selection-contract.test.ts](../../packages/engine/src/post-clt-local-combined-interaction-evidence-next-slice-selection-contract.test.ts),
  [clt-local-combined-interaction-evidence-matrix.test.ts](../../packages/engine/src/clt-local-combined-interaction-evidence-matrix.test.ts),
  [clt-local-combined-exact-anchor-pack.test.ts](../../packages/engine/src/clt-local-combined-exact-anchor-pack.test.ts),
  [tuas-clt-backlog-decision-contract.test.ts](../../packages/engine/src/tuas-clt-backlog-decision-contract.test.ts),
  [post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts](../../packages/engine/src/post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts),
  [reinforced-concrete-formula-family-closeout-audit.test.ts](../../packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts),
  [reinforced-concrete-low-confidence-follow-up-origin-matrix.test.ts](../../packages/engine/src/reinforced-concrete-low-confidence-follow-up-origin-matrix.test.ts),
  [reinforced-concrete-family-formula-fit-audit.test.ts](../../packages/engine/src/reinforced-concrete-family-formula-fit-audit.test.ts),
  [reinforced-concrete-low-confidence-edge-continuity.test.ts](../../packages/engine/src/reinforced-concrete-low-confidence-edge-continuity.test.ts),
  [reinforced-concrete-visible-low-confidence-edge-continuity.test.ts](../../packages/engine/src/reinforced-concrete-visible-low-confidence-edge-continuity.test.ts),
  [reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.test.ts](../../packages/engine/src/reinforced-concrete-combined-vinyl-elastic-ceiling-estimate.test.ts),
  [dataholz-clt-source-truth-audit.test.ts](../../packages/engine/src/dataholz-clt-source-truth-audit.test.ts),
  [dataholz-clt-calibration-tightening-audit.test.ts](../../packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts),
  [floor-source-corpus-contract.test.ts](../../packages/engine/src/floor-source-corpus-contract.test.ts),
  [clt-combined-anchor-history-replay-matrix.test.ts](../../apps/web/features/workbench/clt-combined-anchor-history-replay-matrix.test.ts),
  [clt-local-combined-exact-anchor-route-card-matrix.test.ts](../../apps/web/features/workbench/clt-local-combined-exact-anchor-route-card-matrix.test.ts),
  [reinforced-concrete-low-confidence-impact-panels.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-impact-panels.test.ts),
  [reinforced-concrete-low-confidence-follow-up-provenance-matrix.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-provenance-matrix.test.ts),
  [reinforced-concrete-low-confidence-diagnostics-dossier-matrix.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-diagnostics-dossier-matrix.test.ts),
  [reinforced-concrete-low-confidence-consultant-trail-matrix.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-consultant-trail-matrix.test.ts),
  [dataholz-clt-source-truth-route.test.ts](../../apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts),
  and
  [reinforced-concrete-low-confidence-proposal-honesty.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts)

Do not claim visible `GDMTXA04A` rows are direct exact matches until the
active Dataholz tightening slice produces that proof explicitly.
slice records that decision explicitly in a later executable selection
contract.
