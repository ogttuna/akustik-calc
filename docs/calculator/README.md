# Calculator Docs

Use this folder for the current acoustic-calculator and workbench behavior.

This is the primary living doc set for dynamic calculator work. Read these files before using anything under `docs/archive`.

If the question is “what is still open and what executes next?”, start with
[NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md), then
[CURRENT_STATE.md](./CURRENT_STATE.md), then the latest committed checkpoint.

## New Agent Fast Start

1. Read [CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md).
2. Read [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md).
3. Run `pnpm calculator:gate:current`.
4. If green, keep the closed blocked-source family chain fail-closed and work
   only inside the selected Dataholz CLT calibration tightening corridor.

## Current Execution Snapshot

- primary product aim:
  broader corridor coverage plus higher numerical and provenance accuracy at the
  same time
- active next slice:
  `dataholz_clt_calibration_tightening`
- active next task:
  tighten the defended Dataholz CLT exact-vs-estimate corridor from the
  already-landed source-truth and calibration audits without drifting into a
  direct `GDMTXA04A` exact reopen claim
- current guardrail:
  the broad audit, raw-helper closeout, CLT-local closeout, and reinforced
  closeout are all closed; blocked-source families stay fail-closed, the
  reinforced-concrete low-confidence corridor stays frozen as closeout
  evidence, and no runtime family should be reopened by inertia while the
  Dataholz CLT slice is active
- current candidate posture:
  `GDMTXA04A` exact-visible reopen, `C11c` exact import, raw bare
  open-box/open-web, and wall-selector widening are all explicitly
  fail-closed; raw helper, CLT-local, and reinforced closeouts are all now
  explicit evidence inputs; the selected next move is Dataholz CLT
  calibration tightening
- latest checkpoint review:
  `2026-04-20`
  - reread the living plan/state/handoff docs against the active Dataholz CLT
    audit and route tests
  - reran `pnpm calculator:gate:current` and `pnpm check`: still green
  - found no doc/implementation drift, so the next move remains the first
    defended tightening cut inside `dataholz_clt_calibration_tightening`
- last full green validation:
  `2026-04-20`
  - engine: `182/182` test files passed, `1015/1015` tests passed
  - web: `129/129` test files passed, `699/699` tests passed
  - `pnpm lint`, `pnpm typecheck`, `pnpm check`, and `pnpm build` green
  - build keeps only the known optional `sharp/@img` DOCX warnings
- latest focused gate revalidation:
  `2026-04-20`
  - focused engine: `47/47` files, `179/179` tests
  - focused web: `20/20` files, `38/38` tests
  - `pnpm build` and `git diff --check` green

## Current Hot Files

- [post-blocked-source-backed-widening-rerank-refresh-next-slice-selection-contract.test.ts](../../packages/engine/src/post-blocked-source-backed-widening-rerank-refresh-next-slice-selection-contract.test.ts): executable refresh closeout selecting the rank-1 Dataholz no-runtime design
- [post-dataholz-gdmtxa04a-composite-surface-model-design-next-slice-selection-contract.test.ts](../../packages/engine/src/post-dataholz-gdmtxa04a-composite-surface-model-design-next-slice-selection-contract.test.ts): executable Dataholz fail-closed closeout selecting the rank-2 C11c no-runtime design
- [post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts](../../packages/engine/src/post-tuas-c11c-exact-import-readiness-design-next-slice-selection-contract.test.ts): executable `C11c` fail-closed closeout selecting the rank-3 raw bare family as the next no-runtime slice
- [post-raw-bare-open-box-open-web-impact-widening-next-slice-selection-contract.test.ts](../../packages/engine/src/post-raw-bare-open-box-open-web-impact-widening-next-slice-selection-contract.test.ts): executable raw-family fail-closed closeout selecting `wall_selector_behavior_widening` as the next no-runtime slice
- [post-wall-selector-behavior-widening-next-slice-selection-contract.test.ts](../../packages/engine/src/post-wall-selector-behavior-widening-next-slice-selection-contract.test.ts): executable wall-selector fail-closed closeout selecting the broad audit/replanning pass
- [post-broad-audit-and-replanning-pass-v2-next-slice-selection-contract.test.ts](../../packages/engine/src/post-broad-audit-and-replanning-pass-v2-next-slice-selection-contract.test.ts): executable broad-audit closeout selecting the raw terminal-concrete helper widening slice
- [post-raw-terminal-concrete-helper-family-widening-next-slice-selection-contract.test.ts](../../packages/engine/src/post-raw-terminal-concrete-helper-family-widening-next-slice-selection-contract.test.ts): executable raw-helper closeout selecting the held CLT-local combined evidence slice
- [post-clt-local-combined-interaction-evidence-next-slice-selection-contract.test.ts](../../packages/engine/src/post-clt-local-combined-interaction-evidence-next-slice-selection-contract.test.ts): executable CLT-local closeout selecting the guarded reinforced-concrete conditional follow-up
- [post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts](../../packages/engine/src/post-reinforced-concrete-accuracy-reopen-next-slice-selection-contract.test.ts): executable reinforced-concrete closeout selecting `dataholz_clt_calibration_tightening` as the next defended runtime tightening slice
- [dataholz-clt-source-truth-audit.test.ts](../../packages/engine/src/dataholz-clt-source-truth-audit.test.ts): engine audit pinning exact-vs-estimate and exact-visible-vs-estimate-only Dataholz CLT source truth on the active mass-timber lane
- [dataholz-clt-calibration-tightening-audit.test.ts](../../packages/engine/src/dataholz-clt-calibration-tightening-audit.test.ts): engine audit pinning the capped visible `GDMTXA04A` estimate boundary against the direct official exact row without reopening visible exact matching
- [dataholz-clt-source-truth-route.test.ts](../../apps/web/features/workbench/dataholz-clt-source-truth-route.test.ts): workbench route/card guard for the same active Dataholz CLT exact and estimate surfaces
- [reinforced-concrete-low-confidence-follow-up-matrix.test.ts](../../packages/engine/src/reinforced-concrete-low-confidence-follow-up-matrix.test.ts): engine matrix pinning the first guarded reinforced-concrete follow-up surface across low-confidence and adjacent formula boundaries
- [reinforced-concrete-low-confidence-follow-up-origin-matrix.test.ts](../../packages/engine/src/reinforced-concrete-low-confidence-follow-up-origin-matrix.test.ts): engine provenance matrix pinning the same reinforced follow-up surface to the nearby-row low-confidence packet versus adjacent formula-owned concrete boundaries
- [reinforced-concrete-low-confidence-follow-up-route-card-matrix.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-route-card-matrix.test.ts): workbench route/card matrix proving the same reinforced follow-up surface stays honest on visible stacks
- [reinforced-concrete-low-confidence-follow-up-provenance-matrix.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-follow-up-provenance-matrix.test.ts): workbench evidence-packet matrix proving the same reinforced follow-up surface keeps the real five-citation nearby-row packet and does not blur into formula-owned concrete boundaries
- [reinforced-concrete-low-confidence-diagnostics-dossier-matrix.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-diagnostics-dossier-matrix.test.ts): diagnostics-dossier matrix proving the reinforced low-confidence route stays screening-only while adjacent concrete formula boundaries stay scoped-estimate
- [reinforced-concrete-low-confidence-consultant-trail-matrix.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-consultant-trail-matrix.test.ts): consultant decision-trail matrix proving the same reinforced low-confidence route keeps its delivery-warning posture while adjacent formula boundaries keep scoped formula wording
- [clt-local-combined-interaction-evidence-matrix.test.ts](../../packages/engine/src/clt-local-combined-interaction-evidence-matrix.test.ts): engine evidence matrix pinning the first exact/predictor/fail-closed CLT-local combined triad
- [clt-local-combined-exact-anchor-pack.test.ts](../../packages/engine/src/clt-local-combined-exact-anchor-pack.test.ts): engine evidence matrix pinning the remaining exact `C2c/C3c/C7c` local CLT combined anchors
- [reinforced-concrete-formula-family-closeout-audit.test.ts](../../packages/engine/src/reinforced-concrete-formula-family-closeout-audit.test.ts): engine closeout guard keeping the bounded reinforced-concrete low-confidence corridor explicit after the follow-up closed
- [reinforced-concrete-low-confidence-proposal-honesty.test.ts](../../apps/web/features/workbench/reinforced-concrete-low-confidence-proposal-honesty.test.ts): workbench honesty guard for the same reinforced-concrete closeout surface
- [raw-floor-screening-carrier-support.test.ts](../../packages/engine/src/raw-floor-screening-carrier-support.test.ts): engine support-bucket baseline for the live raw terminal-concrete helper corridor
- [raw-concrete-helper-answer-guard.test.ts](../../packages/engine/src/raw-concrete-helper-answer-guard.test.ts): engine answer snapshots for the selected raw helper lane and adjacent negatives
- [raw-terminal-concrete-helper-widening-matrix.test.ts](../../packages/engine/src/raw-terminal-concrete-helper-widening-matrix.test.ts): engine helper-family widening matrix for the first post-audit concrete-helper cut
- [raw-terminal-concrete-helper-origin-matrix.test.ts](../../packages/engine/src/raw-terminal-concrete-helper-origin-matrix.test.ts): engine provenance matrix proving the first helper-family cut stays on the screening-owned rating surface and the mixed predicted-plus-estimated field impact surface
- [raw-terminal-concrete-helper-split-topology-matrix.test.ts](../../packages/engine/src/raw-terminal-concrete-helper-split-topology-matrix.test.ts): engine matrix for the second defended split-helper widening cut on the same concrete lane
- [raw-terminal-concrete-helper-split-topology-origin-matrix.test.ts](../../packages/engine/src/raw-terminal-concrete-helper-split-topology-origin-matrix.test.ts): engine provenance matrix proving the split-helper cut stays on the same screening-owned rating surface
- [raw-terminal-concrete-helper-partial-order-matrix.test.ts](../../packages/engine/src/raw-terminal-concrete-helper-partial-order-matrix.test.ts): engine matrix for the third defended helper cut across board-and-cavity, board-and-fill, mixed-order, and disjoint helper packages
- [raw-terminal-concrete-helper-partial-order-origin-matrix.test.ts](../../packages/engine/src/raw-terminal-concrete-helper-partial-order-origin-matrix.test.ts): engine provenance matrix proving the partial/order helper cut stays on the same screening-owned rating surface
- [raw-floor-hostile-input-answer-matrix.test.ts](../../packages/engine/src/raw-floor-hostile-input-answer-matrix.test.ts): engine hostile-input matrix guarding the same raw corridor
- [raw-concrete-helper-route-card-guard.test.ts](../../apps/web/features/workbench/raw-concrete-helper-route-card-guard.test.ts): route/card parity guard for the selected raw helper lane
- [raw-terminal-concrete-helper-route-card-matrix.test.ts](../../apps/web/features/workbench/raw-terminal-concrete-helper-route-card-matrix.test.ts): route/card matrix for the first helper-family widening cut on the selected raw lane
- [raw-terminal-concrete-helper-output-origin-card-matrix.test.ts](../../apps/web/features/workbench/raw-terminal-concrete-helper-output-origin-card-matrix.test.ts): workbench provenance/card matrix proving the same helper cut keeps the same support/origin wording
- [raw-terminal-concrete-helper-split-topology-route-card-matrix.test.ts](../../apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-route-card-matrix.test.ts): route/card matrix for the second defended split-helper widening cut
- [raw-terminal-concrete-helper-split-topology-output-origin-card-matrix.test.ts](../../apps/web/features/workbench/raw-terminal-concrete-helper-split-topology-output-origin-card-matrix.test.ts): workbench provenance/card matrix proving the split-helper cut keeps the same support/origin wording
- [raw-terminal-concrete-helper-partial-order-route-card-matrix.test.ts](../../apps/web/features/workbench/raw-terminal-concrete-helper-partial-order-route-card-matrix.test.ts): route/card matrix for the third defended partial/order helper widening cut
- [raw-terminal-concrete-helper-partial-order-output-origin-card-matrix.test.ts](../../apps/web/features/workbench/raw-terminal-concrete-helper-partial-order-output-origin-card-matrix.test.ts): workbench provenance/card matrix proving the partial/order helper cut keeps the same support/origin wording
- [tuas-clt-backlog-decision-contract.test.ts](../../packages/engine/src/tuas-clt-backlog-decision-contract.test.ts): engine backlog contract for exact, predictor-backed, and still-under-described local CLT combined corridors
- [clt-combined-anchor-history-replay-matrix.test.ts](../../apps/web/features/workbench/clt-combined-anchor-history-replay-matrix.test.ts): workbench guard for local CLT combined anchor history replay and fail-closed combined shapes
- [clt-local-combined-exact-anchor-route-card-matrix.test.ts](../../apps/web/features/workbench/clt-local-combined-exact-anchor-route-card-matrix.test.ts): workbench route/card matrix for the remaining exact `C2c/C3c/C7c` local CLT combined anchors
- [raw-floor-hostile-input-route-card-matrix.test.ts](../../apps/web/features/workbench/raw-floor-hostile-input-route-card-matrix.test.ts): workbench hostile-input matrix for the selected raw corridor
- [tuas-c11c-exact-import-readiness.ts](../../packages/engine/src/tuas-c11c-exact-import-readiness.ts): shared C11c visible schedule, weak weighted tuple, and exact-import readiness prerequisites
- [tuas-c11c-exact-import-readiness-design.test.ts](../../packages/engine/src/tuas-c11c-exact-import-readiness-design.test.ts): executable no-runtime design contract for the closed `C11c` readiness slice
- [dataholz-gdmtxa04a-composite-surface-model.ts](../../packages/engine/src/dataholz-gdmtxa04a-composite-surface-model.ts): shared Dataholz composite-surface facts, proxy boundary, and impact cap kept as fail-closed evidence
- [dataholz-gdmtxa04a-composite-surface-model-design.test.ts](../../packages/engine/src/dataholz-gdmtxa04a-composite-surface-model-design.test.ts): executable no-runtime design contract for the closed Dataholz slice
- [dataholz-gdmtxa04a-material-surface-recheck.test.ts](../../packages/engine/src/dataholz-gdmtxa04a-material-surface-recheck.test.ts): existing Dataholz surface blocker and follow-up evidence anchor
- [tuas-c11c-frequency-source-recheck.test.ts](../../packages/engine/src/tuas-c11c-frequency-source-recheck.test.ts): existing TUAS C11c anomaly evidence anchor for the closed fail-closed design
- [blocked-source-backed-widening-rerank-refresh-contract.test.ts](../../packages/engine/src/blocked-source-backed-widening-rerank-refresh-contract.test.ts): executable blocked-source refresh proving the post-seeded order stays fail-closed
- [post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts](../../packages/engine/src/post-mixed-floor-wall-seeded-cross-mode-chain-next-slice-selection-contract.test.ts): executable mixed seeded-chain closeout and blocked-source refresh selection
- [post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts](../../packages/engine/src/post-blocked-source-backed-widening-rerank-next-slice-selection-contract.test.ts): executable blocked-source rerank closeout selection
- [source-gap-candidate-re-rank-contract.test.ts](../../packages/engine/src/source-gap-candidate-re-rank-contract.test.ts): executable blocked-source rerank order and closeout posture
- [blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-1-gdmtxa04a-feasibility-contract.test.ts): executable rank-1 blocked hold
- [blocked-source-rank-2-c11c-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-2-c11c-feasibility-contract.test.ts): executable rank-2 blocked hold
- [blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-3-raw-bare-open-box-open-web-feasibility-contract.test.ts): executable rank-3 blocked hold
- [blocked-source-rank-4-wall-selector-feasibility-contract.test.ts](../../packages/engine/src/blocked-source-rank-4-wall-selector-feasibility-contract.test.ts): executable rank-4 blocked hold
- [run-calculator-current-gate.ts](../../tools/dev/run-calculator-current-gate.ts): single-command focused checkpoint gate
- [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): blocked-source closeout and deferred runtime-candidate ledger

## Read Order

1. [NEXT_IMPLEMENTATION_PLAN.md](./NEXT_IMPLEMENTATION_PLAN.md): concise current execution plan and validated next steps
2. [CURRENT_STATE.md](./CURRENT_STATE.md): short snapshot of the current calculator/workbench posture
3. [SYSTEM_MAP.md](./SYSTEM_MAP.md): end-to-end product flow, runtime boundaries, persistence posture, and test surface map
4. [CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-19_MIXED_FLOOR_WALL_SEEDED_CHAIN_CLOSEOUT_HANDOFF.md): latest checkpoint after the mixed seeded-chain closeout and blocked-source refresh selection
5. [CALCULATION_MODEL_AND_VALIDATION.md](./CALCULATION_MODEL_AND_VALIDATION.md): answer-origin map for formulas, source rows, predictors, field continuations, support gating, and test meaning
6. [SOURCE_GAP_LEDGER.md](./SOURCE_GAP_LEDGER.md): source-backed widening, tightening, and deferred-family boundaries
7. [DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md](./DYNAMIC_CALCULATOR_REMAINING_WORK_PLAN.md): cross-floor/wall remaining work, completion status, and safe execution order
8. [DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md](./DYNAMIC_CALCULATOR_COVERAGE_ACCURACY_PLAN.md): current execution model for coverage growth, accuracy tightening, and test-first slice planning
9. [DYNAMIC_CALCULATOR_PLAN.md](./DYNAMIC_CALCULATOR_PLAN.md): active implementation order and long-form backlog
10. [../archive/analysis/README.md](../archive/analysis/README.md): dated investigations and reproduction notes
