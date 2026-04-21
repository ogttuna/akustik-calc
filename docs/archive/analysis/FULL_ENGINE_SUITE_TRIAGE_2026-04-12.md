# Full Engine Suite Triage 2026-04-12

This note classifies the broad engine-suite red state observed while reviewing
the calculator docs and current implementation. It is not the next feature plan;
use `NEXT_IMPLEMENTATION_PLAN.md` for execution order.

## Broad Run

Command:

```sh
pnpm --filter @dynecho/engine exec vitest run --reporter=basic
```

Observed result before the focused cleanup:

- `76` files passed
- `16` files failed
- `712` tests passed
- `34` tests failed
- `1` unhandled Vitest worker-timeout warning was emitted

Observed result after the focused cleanup:

- `75` files passed
- `17` files failed
- `729` tests passed
- `25` tests failed
- `4` unhandled Vitest worker-timeout warnings were emitted

Observed result after the C11c anomaly audit guard was added:

- `79` files passed
- `14` files failed
- `734` tests passed
- `22` tests failed
- `3` unhandled Vitest worker-timeout warnings were emitted

Observed result after the first TUAS source-truth fixture refresh:

- `83` files passed
- `10` files failed
- `743` tests passed
- `13` tests failed
- `3` unhandled Vitest worker-timeout warnings were emitted

Observed result after the raw bare CLT posture refresh:

- `86` files passed
- `7` files failed
- `746` tests passed
- `10` tests failed
- `4` unhandled Vitest worker-timeout warnings were emitted

Observed result after stale impact fixture, field/topology, upstream-parity,
wall-stability, and deep-hybrid runner cleanup:

- standard multi-worker command:
  - all assertions passed: `93` files, `757` tests
  - command still exited `1` because Vitest emitted `1` worker RPC
    `onTaskUpdate` timeout after the heavy dynamic-airborne scan cluster
- stable full-suite command:

```sh
pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 --reporter=basic
```

Result:

- `93` files passed
- `757` tests passed
- exit code `0`

Observed result after the test-only typecheck cleanup:

- `pnpm --filter @dynecho/engine typecheck`: green
- touched-test pack: `14` files passed, `97` tests passed
- stable full engine suite with `--maxWorkers=1`: `93` files passed, `757`
  tests passed
- `pnpm build`: green with only the known `sharp/@img` optional-package warnings
  through `proposal-docx` and the Next.js TypeScript plugin recommendation

Operational decision:

- `packages/engine` now runs its package `test` script with `--maxWorkers=1`
  because the engine suite contains CPU-heavy dynamic-airborne generated scans
  that can trip Vitest worker RPC timeouts under broad multi-worker execution
  even when every assertion passes.

Reading:

- the focused floor exact/split/raw-posture pack improved and stays green
- the C11c audit guard is green and did not create a new failure class
- the first stale TUAS source-truth fixture refresh is green and reduced the broad
  suite red count without changing solver logic
- the raw bare CLT snapshot now matches the documented conservative raw-slab
  penalty posture without changing solver logic
- the stale TUAS/open-box/CLT, field, topology, validation-regime, and
  upstream-parity fixture classes are now closed or explicitly classified
- broad-suite airborne scan assertions are green; runner-level RPC fragility is
  managed by the stable `--maxWorkers=1` full-suite command
- engine package typecheck is green again; the fixed classes were test-only
  strict typing issues, not solver behavior

## Fixed During Review

- The broad floor-library tests could not build some current catalog criteria
  because test builders only read `materialIds[0]`. A shared helper now supports
  `materialIds`, `materialScheduleIds`, and representative `materialClass` values.
- Fully tagged floor stacks are now treated as operator intent before automatic
  floor-role inference. The engine only coalesces contiguous same-role pieces for
  split parity, and does not re-infer a fully tagged stack onto broader predictor
  lanes.
- C11c now has an executable anomaly guard. It remains deferred / fail-closed
  because its source tuple `Ln,w 59`, `Ln,w+CI 60`, `Ln,w+CI,50-2500 60`,
  `Rw 74` is still unexplained beside the frozen combined CLT anchors.
- Single-entry floor-role thickness matching no longer lets split pieces match a
  thinner catalog row. This closed the UBIQ `400 mm -> 200 mm` high-split
  selection collision.
- Merge-safe split coalescing now keeps millimetre totals at 0.001 mm precision
  instead of rounding after each tiny piece, so high split counts such as `x20`
  and `x29` do not drift off exact TUAS rows.
- The raw exact audit now documents current implementation posture instead of
  asserting stale raw-vs-tagged parity:
  - current no-safe-inference exact row: `dataholz_gdsnxn01a_timber_frame_lab_2026`
  - raw `140 mm concrete` now infers a safe `base_structure` and uses
    `visible_stack` on impact-only
  - current raw-vs-tagged core drift set contains Dataholz timber-frame plus the
    TUAS rows listed below
- The first TUAS source-truth fixture refresh updated stale expectations in:
  - `predictor-published-family-estimate.test.ts`
  - `impact-layer-stack-driven.test.ts`
  - `impact-common-floor-combinations.test.ts`
  - `impact-validation-regime.ts`
  - `dynamic-floor-regression-matrix.test.ts`
  The refreshed values are backed by the current TUAS exact rows:
  `tuas_x2_clt140_measured_2026`, `tuas_r2b_open_box_timber_measured_2026`,
  `tuas_r5b_open_box_timber_measured_2026`, and the current reinforced-concrete
  family-general candidate pair `tuas_h2_concrete160_measured_2026` plus
  `euracoustics_f0_bare_concrete_lab_2026`.
- The raw bare CLT posture refresh updated stale expectations in:
  - `bare-floor-raw-support.test.ts`
  - `clt-floor-monotonicity.test.ts`
  It aligns the test contract to the documented `clt_bare` predictor rule:
  true raw CLT slabs carry the conservative raw-slab penalty (`-3 dB` airborne,
  `+3 dB` impact) relative to the defended TUAS laminate-plus-underlay anchor
  lane. Current `140 mm` raw CLT snapshot is `Rw 35`, `Ln,w 64`,
  `Ln,w+CI 64`; field standardization gives `R'w 33`, `L'n,w 66`,
  `L'nT,w 63.6`, and `L'nT,w+CI,50-2500 63.6`.
- Stale real-world floor and field coverage fixtures were refreshed to current
  TUAS/Open Box/CLT/UBIQ source truth:
  - `impact-real-world-floor-coverage.test.ts`
  - `impact-real-world-field-coverage.test.ts`
  - `impact-validation-benchmark.test.ts`
  - `impact-validation-regime.test.ts`
- The under-described combined dry-plus-wet CLT validation case is now tracked
  as `unsupported_gap`. That is an explicit fail-closed posture, not a hidden
  low-confidence estimate.
- Upstream impact parity now supports explicit accepted local divergences where
  the Acoustic2 checkout still carries stale TUAS/Open Box/CLT tuples. Those
  divergences are listed per metric in the fixture files and the compare tools
  still fail on any unlisted mismatch.
- `floor-topology-sanity-sweep` now marks the current hollow-core/open-box field
  continuation gaps as fail-closed screening cases instead of expecting live
  continuation without source support.
- Wall-side lined-massive stability was reclassified against the existing
  family-boundary contract:
  - AAC active reinforcement/family-boundary hold is at `100 mm`, not `160 mm`
  - boundary-held rows may occupy the documented `2 dB` held corridor
  - no solver widening was made for this wall slice
- Deep-hybrid dynamic-airborne stress tests now yield periodically to the Vitest
  worker RPC loop, and the largest non-AAC swap cohort was split by board pair.
  The search space is unchanged, but failure attribution and runner stability are
  better.
- Test-only strict typing debt is closed:
  - warning/note callback parameters in dynamic-airborne and floor detour tests
    are typed explicitly
  - empty TUAS backlog arrays now carry their intended candidate shape instead
    of narrowing to `never`
  - nullable UBIQ fixture arrays now fail explicitly if an expected numeric
    depth/deck fixture is missing
  - the C11c audit uses the current `impactFieldContext` option name and guards
    optional `LnWPlusCI` fixture access

Current evidence-rich manual exact raw/base-only drift ids:

- `tuas_x3_clt140_measured_2026`
- `tuas_x4_clt140_measured_2026`
- `tuas_r7b_open_box_timber_measured_2026`
- `tuas_r8b_open_box_timber_measured_2026`
- `tuas_r10a_open_box_timber_measured_2026`
- `tuas_c3_clt260_measured_2026`
- `tuas_c4_clt260_measured_2026`
- `tuas_c5_clt260_measured_2026`
- `tuas_c7_clt260_measured_2026`
- `tuas_c7c_clt260_measured_2026`
- `tuas_c3c_clt260_measured_2026`
- `tuas_c4c_clt260_measured_2026`

## Current Remaining Risks

1. Standard broad multi-worker `vitest run` can still exit non-zero from a Vitest
   worker RPC timeout after all tests pass. Use the package test script or the
   explicit `--maxWorkers=1` full-suite command for stable full validation.

2. C11c remains deliberately deferred / fail-closed. The anomaly is now under an
   executable audit guard, but no exact row should be imported until the source
   weakness is explained.

3. `unsupported_gap` is now a first-class validation posture. Future work should
   add descriptors or source rows before reopening those cases; do not convert
   them into low-confidence estimates just to fill outputs.

4. Accepted local upstream divergences must stay narrow. Any new upstream parity
   mismatch should fail until it is tied to a source-truth correction and listed
   explicitly.

5. Engine package `typecheck` is now green and should remain part of the standard
   gate. Future strict typing failures should be handled as their own cleanup
   slice unless they expose a real solver contract issue.

## Green Focused Pack After Cleanup

```sh
pnpm --filter @dynecho/engine exec vitest run src/floor-library-sweep.test.ts src/floor-library-raw-parity.test.ts src/raw-floor-exact-exception-audit.test.ts --reporter=basic
```

Result:

- `3` files passed
- `27` tests passed

Broader focused target pack:

```sh
pnpm --filter @dynecho/engine exec vitest run src/tuas-c11c-wet-stack-anomaly-audit.test.ts src/floor-library-sweep.test.ts src/floor-library-raw-parity.test.ts src/raw-floor-exact-exception-audit.test.ts src/tuas-candidate-backlog-contract.test.ts src/floor-source-corpus-contract.test.ts src/tuas-clt-backlog-decision-contract.test.ts src/floor-exact-companion-split-parity.test.ts src/floor-widening-candidate-contract.test.ts src/impact-predictor-input.test.ts src/calculate-assembly.test.ts src/calculate-impact-only.test.ts --reporter=basic
```

Result:

- `12` files passed
- `399` tests passed

TUAS source-truth fixture refresh pack:

```sh
pnpm --filter @dynecho/engine exec vitest run src/predictor-published-family-estimate.test.ts src/impact-layer-stack-driven.test.ts src/impact-common-floor-combinations.test.ts src/impact-validation-regime.test.ts src/dynamic-floor-regression-matrix.test.ts --reporter=basic
```

Result:

- `5` files passed
- `88` tests passed

Raw bare CLT posture refresh pack:

```sh
pnpm --filter @dynecho/engine exec vitest run src/bare-floor-raw-support.test.ts src/clt-floor-monotonicity.test.ts --reporter=basic
```

Result:

- `2` files passed
- `7` tests passed

Stale impact fixture / field / topology / parity / wall stability pack:

```sh
pnpm --filter @dynecho/engine exec vitest run src/impact-real-world-floor-coverage.test.ts src/impact-real-world-field-coverage.test.ts src/impact-upstream-parity-acceptance.test.ts src/impact-validation-benchmark.test.ts src/floor-topology-sanity-sweep.test.ts src/airborne-lined-massive-stability.test.ts src/dynamic-airborne-family-boundary.test.ts --reporter=basic
```

Result:

- `7` files passed
- `21` tests passed

Regime and deep-hybrid runner packs:

```sh
pnpm --filter @dynecho/engine exec vitest run src/impact-validation-regime.test.ts src/impact-validation-benchmark.test.ts --reporter=basic
pnpm --filter @dynecho/engine exec vitest run src/dynamic-airborne-deep-hybrid-scan.test.ts src/dynamic-airborne-deep-hybrid-swap-aac-d700-100.test.ts src/dynamic-airborne-deep-hybrid-swap-aac-d700-120.test.ts src/dynamic-airborne-deep-hybrid-swap-aac-g5.test.ts src/dynamic-airborne-deep-hybrid-swap-heavy-core.test.ts --reporter=basic
```

Result:

- regime pack: `2` files passed, `5` tests passed
- deep-hybrid pack: `5` files passed, `10` tests passed

Stable full engine suite:

```sh
pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 --reporter=basic
```

Result:

- `93` files passed
- `757` tests passed

Test-only typecheck cleanup pack:

```sh
pnpm --filter @dynecho/engine typecheck
pnpm --filter @dynecho/engine exec vitest run --maxWorkers=1 src/dynamic-airborne-family-boundary-scan.test.ts src/dynamic-airborne-family-boundary.test.ts src/dynamic-airborne-instability-repro.test.ts src/dynamic-airborne-order-sensitivity.test.ts src/floor-packaged-lane-disjoint-detour.test.ts src/floor-packaged-lane-helper-disjoint-detour.test.ts src/floor-source-corpus-contract.test.ts src/raw-floor-weaker-carrier-posture.test.ts src/tuas-c11c-wet-stack-anomaly-audit.test.ts src/tuas-candidate-backlog-contract.test.ts src/tuas-clt-backlog-decision-contract.test.ts src/tuas-post-corridor-screening-contract.test.ts src/tuas-support-surface-decision-contract.test.ts src/ubiq-candidate-backlog-contract.test.ts --reporter=basic
```

Result:

- typecheck green
- `14` files passed
- `97` tests passed

## Next Safe Order

1. Treat `tuas_c11c_wet_stack_anomaly_audit_v1` as closed: C11c remains deferred
   / fail-closed, with `tuas-c11c-wet-stack-anomaly-audit.test.ts` as the
   executable guard.
2. Use the stable full-suite command with `--maxWorkers=1` when validating the
   whole engine suite.
3. Do not bulk-rebaseline future broad-suite failures; update one failure class
   at a time.
4. When updating stale tests, update one file at a time and cite the source row or
   current defended contract that justifies the expectation.
5. Treat raw-vs-tagged TUAS drift as documented current posture unless a future
   source-led raw inference slice deliberately closes one row. The bare CLT
   posture test class is now aligned to the documented `clt_bare` penalty rule
   and should not be re-opened as raw-equals-tagged parity.
6. Keep engine typecheck in the standard green gate before selecting the next
   source-led raw or predictor widening target.
