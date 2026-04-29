# Checkpoint - Generated Floor Fallback Topology Delta Gate A

Date: 2026-04-29

Slice: `generated_floor_fallback_topology_delta_v1`

Gate: A

Status: LANDED / NO RUNTIME MOVEMENT

## Decision

Gate A lands the generated floor fallback topology-delta matrix
no-runtime.

Gate A contract:

`packages/engine/src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts`

Next selected action:

`packages/engine/src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts`

Gate B is not selected now because Gate A found topology near misses
only, not a source-ready runtime candidate.

## What Gate A Proves

The live generated `floor-steel-fallback` route stays on the
low-confidence screening lane:

- no Pliteq exact match;
- no UBIQ bound match;
- no UBIQ bound interpolation;
- no confidence/support/evidence promotion.

Pliteq exact precedence still works when exact topology is present:

- 250 mm `steel_joist_floor`;
- 19 mm `inex_floor_panel`;
- `geniemat_rst02` or `geniemat_rst12`;
- source finish thickness, for example 2.5 mm vinyl;
- 120 mm `resilient_channel`;
- 100 mm `glasswool`;
- 2 x 16 mm `firestop_board`.

UBIQ FL-32 bound precedence still works when bound topology is present:

- 200/300 mm steel joist / purlin endpoint rows;
- 250 mm interpolation between endpoint rows;
- 19 mm `inex_floor_panel`;
- engineered timber with acoustic underlay;
- UBIQ resilient ceiling family;
- 2 x 16 mm `firestop_board`;
- no ceiling fill.

## Live-Stack Delta Summary

The live fallback stack is still not import-ready:

- deck / `floating_screed`: missing 19 mm INEX panel;
- resilient layer: missing Pliteq GenieMat layer;
- floor covering: 3 mm vinyl is not the Pliteq 2.5 mm exact finish and
  is not the UBIQ engineered timber bound finish;
- ceiling cavity: UBIQ resilient ceiling, not Pliteq resilient channel;
- ceiling fill: 100 mm rockwool, not Pliteq glasswool and not UBIQ
  absent-fill topology;
- support: 250 mm steel joist is adjacent to both source families, but
  support adjacency alone is not enough.

## Frozen Surfaces

No runtime, support, confidence, evidence, API, route-card,
output-card, proposal/report, or workbench-input behavior changed.

No candidate was promoted for pilot convenience.

## Preserved Boundaries

- Exact Pliteq rows apply only to exact Pliteq topology.
- UBIQ FL-32 rows remain bound-only source support.
- Pliteq exact rows and UBIQ bound rows are not blended into one source
  family.
- `L'nT,50`, lab `Ln,w+CI`, and lab `DeltaLw` stay unsupported on the
  live fallback path.
- Split live-stack variants remain finite and low-confidence; they do
  not promote to exact or bound rows.
- `GDMTXA04A`, `C11c`, raw open-box/open-web, wall selector behavior,
  CLT wall, timber double-board, no-stud double-leaf, and lined-heavy
  wall remain source-blocked or fail-closed until their own blockers are
  directly satisfied.

## Validation

Green on 2026-04-29:

- targeted Gate A:
  `pnpm --filter @dynecho/engine exec vitest run src/generated-floor-fallback-topology-delta-gate-a-contract.test.ts --maxWorkers=1`
  - 1 engine file / 6 tests.
- focused current gate:
  `pnpm calculator:gate:current`
  - engine 143 files / 691 tests;
  - web 45 files / 216 passed + 18 skipped;
  - build 5/5 with known non-fatal `sharp/@img` warnings;
  - whitespace guard clean.
- broad full-repo gate:
  `pnpm check`
  - lint/typecheck green;
  - engine 276 files / 1511 tests;
  - web 157 files / 890 passed + 18 skipped;
  - build 5/5 with the known non-fatal `sharp/@img` warnings.

## Next Action

Implement Gate C closeout / next-slice selection:

`packages/engine/src/post-generated-floor-fallback-topology-delta-v1-next-slice-selection-contract.test.ts`

Gate C should close this slice no-runtime unless a source-ready floor
runtime candidate is available with exact topology, metric owner,
tolerance owner, negative boundaries, and paired engine/web visible
tests.
