# Post-V1 Current-Gate Stale Metric/Basis Reconciliation After Opening/Leak Apparent Dn,w/Dn,A Plan - 2026-06-23

Status:
`post_v1_current_gate_stale_metric_basis_reconciliation_after_opening_leak_apparent_dna_landed_no_runtime_selected_runtime_first_rerank_after_current_gate_reconciliation`

## Purpose

This is the selected next action after the no-runtime runtime-first
rerank that followed the wall opening/leak building apparent `Dn,w` /
`Dn,A` companion coverage refresh.

The rerank selected:
`current_gate_stale_metric_basis_reconciliation_after_opening_leak_apparent_dna`.

This slice is calculator-boundary support work, not a broad source
crawl, UI polish pass, confidence-labeling pass, formula retune, or
generic docs cleanup. Its job is to make `pnpm calculator:gate:current`
reflect the current calculator semantics so future runtime owners can
move safely. No runtime behavior should move until stale current-gate
metric/basis expectations are reconciled.

Landed outcome: 34 known stale engine current-gate metric/basis
assertions were reconciled across 22 engine contract files without
moving engine runtime values, formula coefficients, source rows,
request-shape coverage, or target-output support. Four web current-gate
stale surface/report assertions were also reconciled, and one web
surface helper was updated so building A-weighted opening/leak results
are not mislabeled as field results.

Previous no-runtime coverage refresh:
`post_v1_wall_opening_leak_building_apparent_dna_companion_coverage_refresh_plan`
/
`packages/engine/src/post-v1-wall-opening-leak-building-apparent-dna-companion-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_WALL_OPENING_LEAK_BUILDING_APPARENT_DNA_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-23.md`
/
`post_v1_wall_opening_leak_building_apparent_dna_companion_coverage_refresh_landed_no_runtime_selected_runtime_first_rerank_after_opening_leak_building_apparent_dna_companion_coverage_refresh`.

Landed rerank:
`post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_building_apparent_dna_companion_coverage_refresh_plan`
/
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-wall-opening-leak-building-apparent-dna-companion-coverage-refresh-contract.test.ts`
/
`docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_WALL_OPENING_LEAK_BUILDING_APPARENT_DNA_COMPANION_COVERAGE_REFRESH_PLAN_2026-06-23.md`
/
`post_v1_runtime_first_route_family_rerank_after_wall_opening_leak_building_apparent_dna_companion_coverage_refresh_landed_no_runtime_selected_current_gate_stale_metric_basis_reconciliation`.

Selected next action:
`post_v1_current_gate_stale_metric_basis_reconciliation_after_opening_leak_apparent_dna_plan`

Selected next file:
`packages/engine/src/post-v1-current-gate-stale-metric-basis-reconciliation-after-opening-leak-apparent-dna-contract.test.ts`

Selected next plan:
`docs/calculator/POST_V1_CURRENT_GATE_STALE_METRIC_BASIS_RECONCILIATION_AFTER_OPENING_LEAK_APPARENT_DNA_PLAN_2026-06-23.md`

Selected next label:
`post-V1 current-gate stale metric/basis reconciliation after opening/leak apparent Dn,w/Dn,A`

Landed status:
`post_v1_current_gate_stale_metric_basis_reconciliation_after_opening_leak_apparent_dna_landed_no_runtime_selected_runtime_first_rerank_after_current_gate_reconciliation`

Selected follow-up candidate:
`runtime_first_route_family_rerank_after_current_gate_stale_metric_basis_reconciliation`

Selected follow-up action:
`post_v1_runtime_first_route_family_rerank_after_current_gate_stale_metric_basis_reconciliation_plan`

Selected follow-up file:
`packages/engine/src/post-v1-runtime-first-route-family-rerank-after-current-gate-stale-metric-basis-reconciliation-contract.test.ts`

Selected follow-up plan:
`docs/calculator/POST_V1_RUNTIME_FIRST_RERANK_AFTER_CURRENT_GATE_STALE_METRIC_BASIS_RECONCILIATION_PLAN_2026-06-23.md`

Selected follow-up label:
`post-V1 runtime-first route-family rerank after current-gate stale metric/basis reconciliation`

Rerank counters: `candidateCount: 7`,
`knownCurrentGateFailureAssertions: 34`, `roiAnalysisIterations: 3`,
`runtimeValuesMoved 0`, `runtimeFormulaRetunes: 0`,
`sourceRowsImported: 0`, and `frontendImplementationFilesTouched: 0`.

Reconciliation counters: `currentGateKnownFailureAssertionsReconciled:
34`, `staleExpectationFilesTouched: 22`,
`newCalculableRequestShapes: 0`, `newCalculableTargetOutputs: 0`,
`runtimeBasisPromotions: 0`, `runtimeValuesMoved 0`,
`runtimeFormulaRetunes: 0`, `sourceRowsImported: 0`, and
`frontendImplementationFilesTouched: 1`. Additional web reconciliation
counters: `webCurrentGateStaleFailureAssertionsReconciled: 4` and
`webStaleExpectationFilesTouched: 4`.

## Selection Card

- User construction / formula family: current-gate metric/basis
  integrity after opening/leak building apparent `Dn,w` / `Dn,A`
  support landed.
- Target outputs to protect: wall/floor/opening `Rw`, `STC`, `C`,
  `Ctr`, `R'w`, `Dn,w`, `Dn,A`, `DnT,w`, `DnT,A`, `DnT,A,k`,
  `Ln,w`, `DeltaLw`, `IIC`, `AIIC`, and route-specific companion
  metrics only where the route is physically owned.
- Route: no runtime calculation change. Reconcile stale current-gate
  assertions with already-landed runtime behavior.
- Required physical inputs: none newly captured in this slice. Existing
  route-required inputs such as frequency bands, partition area,
  receiving-room volume, building output basis, impact dynamic
  stiffness/load basis, and project/user verified calculated reference
  fingerprints must keep their current `needs_input` / `unsupported`
  semantics.
- `needs_input` behavior: missing volume, missing building output
  basis, missing route-required frequency data, and missing impact
  physical inputs must remain explicit.
- `unsupported` boundaries: impact routes must not advertise airborne
  `Rw`/`C`/`Ctr` unless owned; lab/field/building aliases must remain
  blocked; source-proximate values must not be treated as exact;
  opening/leak apparent-only and standardized/characteristic bases must
  remain separated.
- Expected `newCalculableRequestShapes`: 0.
- Expected `newCalculableTargetOutputs`: 0.
- Expected `runtimeBasisPromotions`: 0.
- Expected `runtimeValuesMoved`: 0.

## ROI Iterations Before Implementation

Iteration 1: do not reselect the landed opening/leak companion chain.

- The opening/leak building apparent `Dn,w` / `Dn,A` owner and coverage
  refresh are already protected.
- Reselecting that family would be support churn and would not open a
  new request shape.

Iteration 2: do not tune values from weak evidence.

- Source-absent opening/leak budget retunes still require same-basis
  holdout evidence.
- Floor/open-web accuracy work is high value, but stale current-gate
  expectations currently blur impact-only support with airborne
  companions.
- Spectrum companions such as `C` / `Ctr` require an owned spectrum
  route before they can move runtime values.

Iteration 3: reconcile the current gate first.

- The latest full current gate failure set includes 34 known stale
  metric/basis assertions.
- The failure classes include impact routes expecting airborne
  `Rw`/`C`/`Ctr` support, opening/leak assertions expecting building
  `Dn,A` to remain closed after the apparent companion owner, and
  resolver precedence expectations that predate
  `user_verified_calculated_exact`.
- Current-gate reconciliation is the highest-ROI bounded support step
  because it restores the gate's ability to distinguish real calculator
  regressions from old expectations.

## Work Order

1. Create the selected reconciliation contract at
   `packages/engine/src/post-v1-current-gate-stale-metric-basis-reconciliation-after-opening-leak-apparent-dna-contract.test.ts`.
2. Classify the current-gate failures by stale expectation family:
   impact-only output support, opening/leak apparent `Dn,A`, verified
   calculated precedence, missing-input wording, and any remaining
   already-landed formula-route drift.
3. Update only tests/docs whose expectations conflict with landed
   calculator behavior. Do not change production runtime values,
   formula coefficients, source rows, or support buckets in this slice.
4. Keep exact/source row, compatible anchor, owned formula,
   `needs_input`, and `unsupported` ordering intact.
5. Re-run targeted stale families first, then `pnpm calculator:gate:current`.

## Validation Plan

- Run the opening/leak apparent owner, coverage refresh, and rerank
  contracts together.
- Run the selected current-gate stale metric/basis reconciliation
  contract when it exists.
- Run targeted tests for each reconciled stale failure family.
- Run `pnpm calculator:gate:current`.
- Run `git diff --check`.

Landed targeted validation: the 22 reconciled stale engine contracts
passed together with `136` tests; the reconciliation contract is the
current closeout proof for this slice.

## Stop Rule

If a failing assertion cannot be proven stale against landed runtime
behavior, stop and leave it as a real failure. This slice must not hide
unknown regressions by loosening assertions broadly.
