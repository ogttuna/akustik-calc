# Checkpoint - Generated Floor Fallback Topology Delta Gate C Closeout

Date: 2026-04-29

Slice: `generated_floor_fallback_topology_delta_v1`

Gate: C

Status: LANDED / NO RUNTIME MOVEMENT

## Decision

Gate C closes `generated_floor_fallback_topology_delta_v1` no-runtime.

Closeout contract:

`packages/engine/src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts`

Selected next slice:

`calculator_source_gap_revalidation_v4`

Selected next file:

`packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`

Selected planning surface:

[SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_PLAN.md](./SLICE_CALCULATOR_SOURCE_GAP_REVALIDATION_V4_PLAN.md)

## Why This Closes No-Runtime

Gate A found only topology near misses:

- the live generated `floor-steel-fallback` stack still lacks the
  19 mm INEX panel, GenieMat layer, Pliteq resilient-channel /
  glasswool topology, and exact Pliteq finish thickness;
- the same live stack also lacks the UBIQ FL-32 engineered-timber /
  no-fill bound topology;
- support adjacency and matching ceiling boards are not sufficient for
  exact or bound promotion.

No source-ready floor runtime candidate is available. Gate B is skipped.

## Frozen Surfaces

No runtime, support, confidence, evidence, API, route-card,
output-card, proposal/report, or workbench-input behavior changed.

No candidate was promoted for internal-pilot convenience.

## Preserved Boundaries

- The live generated floor fallback remains low-confidence/screening.
- Pliteq exact rows apply only to exact Pliteq topology.
- UBIQ FL-32 bound rows apply only to bound source topology.
- Pliteq exact and UBIQ bound rows are not blended into one generated
  fallback family rule.
- `L'nT,50`, lab `Ln,w+CI`, and lab `DeltaLw` stay unsupported without
  source evidence.
- Split live-stack variants remain finite and do not promote to exact
  or bound rows.
- `GDMTXA04A`, `C11c`, raw open-box/open-web, wall selector behavior,
  CLT wall, timber double-board, no-stud double-leaf, and lined-heavy
  wall remain source-blocked or fail-closed until their own blockers
  are directly satisfied.

## Why v4 Revalidation Is Next

The source-ready backlog still marks every family as
`runtimeImportReadyNow: false`. After the generated floor topology
delta closes without runtime movement, the next honest step is to
re-rank current source/accuracy candidates before selecting any runtime,
source acquisition, internal-use visibility, architecture, or
productization work.

Gate A for v4 should decide whether a source-ready runtime slice,
no-runtime source acquisition slice, or another accuracy/test slice is
actually justified by current evidence.

## Validation

Completed before editing:

- baseline `pnpm calculator:gate:current`: green, engine 143 files /
  691 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with
  known non-fatal `sharp/@img` warnings, whitespace guard clean.

Completed after Gate C landed:

- targeted compatibility retest:
  `pnpm --filter @dynecho/engine exec vitest run src/post-calculator-source-intake-backlog-cleanup-v1-next-slice-selection-contract.test.ts --maxWorkers=1`;
  green, 1 engine file / 6 tests.
- targeted Gate C contract:
  `pnpm --filter @dynecho/engine exec vitest run src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts --maxWorkers=1`;
  green, 1 engine file / 6 tests.
- focused `pnpm calculator:gate:current`: green, engine 144 files /
  697 tests, web 45 files / 216 passed + 18 skipped, build 5/5 with
  known non-fatal `sharp/@img` warnings, whitespace guard clean.
- broad `pnpm check`: green, lint/typecheck passed, engine 277 files /
  1517 tests, web 157 files / 890 passed + 18 skipped through
  `tools/dev/run-web-vitest.ts`, build 5/5 with known non-fatal
  `sharp/@img` warnings.

## Next Action

Implement Gate A:

`packages/engine/src/calculator-source-gap-revalidation-v4-gate-a-contract.test.ts`

Gate A should re-rank the current source/accuracy backlog and keep all
runtime / visible surfaces frozen unless it names exact topology, metric
owner, tolerance owner, protected negative boundaries, and paired
engine/web visible tests for a later bounded slice.
