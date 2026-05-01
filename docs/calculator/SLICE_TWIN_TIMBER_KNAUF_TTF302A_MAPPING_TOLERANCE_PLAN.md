# Slice Plan - Twin Timber Knauf TTF30.2A Mapping / Tolerance v1

Slice id: `twin_timber_knauf_ttf302a_mapping_tolerance_v1`

Status: CLOSED / NO RUNTIME MOVEMENT (Gate C closed 2026-04-30 in
`packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`).

Latest checkpoint:
[CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-30_TWIN_TIMBER_KNAUF_TTF302A_MAPPING_TOLERANCE_GATE_C_CLOSEOUT_HANDOFF.md)
closes `TTF30.2A` no-runtime and selects
`calculator_source_gap_revalidation_v6`.

Selection status:

`closed_ttf302a_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v6_because_knauf_tb5a_mwi2a_ttf302a_all_lack_exact_material_metric_tolerance_ownership`

Prior selection status:

`closed_mwi2a_mapping_tolerance_no_runtime_and_selected_knauf_ttf302a_twin_timber_mapping_tolerance_because_mwi2a_lacks_exact_material_metric_tolerance_ownership`

Next selected slice:

`calculator_source_gap_revalidation_v6`

Next selected file:

`packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts`

## Objective

Decide whether Knauf AU `TTF30.2A` can become a future source-backed
mapping / tolerance path for a twin timber double-leaf wall lane,
without changing runtime behavior during Gate A.

This is a no-runtime mapping slice. It must resolve or explicitly keep
blocked:

- the exact `TTF30.2A` table row and 70 / 90 mm stud column;
- twin timber frames and 20 mm gap topology;
- asymmetric side lining: `1x13 mm FIBEROCK AQUA-TOUGH` on side 1 and
  `2x13 mm` on side 2;
- `Nil`, `KI 50G11`, `KI 75G11`, and `KI 90G11` cavity-fill variants;
- lab / field metric and output policy;
- the double-leaf / twin-frame tolerance owner or explicit tolerance
  gap;
- negative boundaries for no-stud double-leaf, raw open-box /
  open-web, simple timber, `TB.5A`, `TSF120.1A`, and `TO120.1A`;
- paired engine and web visible tests required before any later runtime
  import, confidence/support promotion, route-card copy movement, or
  report movement.

## Current Posture

`TTF30.2A` is selected because it is the remaining concrete Knauf
locator with a double-leaf twin timber topology. It is not import-ready.

Knauf Gate B blocks `TTF30.2A` because it still lacks twin frame/gap
mapping, side-asymmetry mapping, `FIBEROCK AQUA-TOUGH` local material
mapping, lab / field output policy, double-leaf tolerance ownership,
and paired visible tests. It is useful now primarily as a boundary
slice: it can prevent a framed twin-stud source row from being confused
with no-stud double-leaf, raw open-box / open-web, or simple timber
routes.

Known source context:

- official Knauf AU Section D Timber Stud Walls;
- page/table `D 60-61 twin stud TT.1 / TTF30.1 / TTF30.2`;
- system `TTF30.2A`;
- twin timber studs with 70 or 90 mm stud columns;
- two timber frames separated by a 20 mm gap;
- asymmetric boards: `1x13 mm FIBEROCK AQUA-TOUGH` side 1 and
  `2x13 mm` side 2;
- insulation variants `Nil`, `KI 50G11`, `KI 75G11`, and `KI 90G11`;
- source ratings context: `Rw 49-64` and `Rw+Ctr 41-54`.

## Gate A - TTF30.2A Mapping / Tolerance Decision

Gate A landed:

`packages/engine/src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts`

Landed records:

1. `TTF30.2A` source locator, table context, row label, and exact
   70 / 90 mm column decision.
2. Live implementation comparison: simple timber, double-board timber,
   no-stud double-leaf, raw open-box / open-web, and current
   double-leaf formula surfaces.
3. Local material mapping decisions for `FIBEROCK AQUA-TOUGH`,
   timber studs, twin frame gap, and `KI 50G11` / `KI 75G11` /
   `KI 90G11`.
4. Metric policy: whether any source value is usable as lab `Rw`,
   field `R'w`, `DnT,w`, `DnT,A`, or context only.
5. Tolerance owner: named tolerance corridor, rejected tolerance owner,
   or explicit tolerance gap.
6. Negative boundaries:
   no-stud double-leaf, raw open-box / open-web, simple timber, `TB.5A`,
   `TSF120.1A`, `TO120.1A`, steel stud, CLT, and masonry routes.
7. Next decision:
   - direct runtime import remains blocked because exact topology,
     metric owner, tolerance owner, local material mapping, and paired
     visible tests are not complete;
   - next action is
     `gate_c_no_runtime_closeout_and_next_slice_selection`.

Gate A extracted the official table values:

- 70 mm stud / 199 mm minimum wall width: `49(41)` nil,
  `58(48)` one-side `KI 50G11`, `59(49)` one-side `KI 75G11`,
  no 70 mm one-side `KI 90G11`, `60(50)` both-side `KI 50G11`,
  `61(51)` both-side `KI 75G11`, and no 70 mm both-side `KI 90G11`;
- 90 mm stud / 239 mm minimum wall width: `51(43)` nil,
  `60(51)` one-side `KI 50G11`, `61(52)` one-side `KI 75G11`,
  `61(52)` one-side `KI 90G11`, `62(52)` both-side `KI 50G11`,
  `63(53)` both-side `KI 75G11`, and `64(54)` both-side `KI 90G11`.

Gate A compared those values to the live `wall-timber-stud` route and
kept the source context out of runtime because the live stack is
symmetric generic `12.5 mm` gypsum board, `50 mm` rockwool, a generic
`50 mm` air gap, and a single `wood_stud` formula context rather than
asymmetric `13 mm FIBEROCK AQUA-TOUGH`, twin timber frames, and a
20 mm inter-frame gap.

## Gate C - Closeout / Next-Slice Selection

Gate C should add:

`packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

Gate C landed:

`packages/engine/src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts`

Landed records:

1. Close `twin_timber_knauf_ttf302a_mapping_tolerance_v1` as
   no-runtime.
2. Carry forward that `TTF30.2A` is lab `Rw` / `Rw+Ctr` context only,
   not a field-output owner or tolerance owner.
3. Preserve no-stud double-leaf, raw open-box / open-web, simple
   timber, `TB.5A`, `TSF120.1A`, `TO120.1A`, steel, CLT, and masonry
   negative boundaries.
4. Re-rank the next source/accuracy candidate and select
   `calculator_source_gap_revalidation_v6` because `TB.5A`, `MWI.2A`,
   and `TTF30.2A` all closed no-runtime.
5. Update this slice plan, `NEXT_IMPLEMENTATION_PLAN.md`,
   `CURRENT_STATE.md`, `SOURCE_READY_INTAKE_BACKLOG.md`, `AGENTS.md`,
   and a Gate C handoff together.

Gate C selection status:

`closed_ttf302a_mapping_tolerance_no_runtime_and_selected_source_gap_revalidation_v6_because_knauf_tb5a_mwi2a_ttf302a_all_lack_exact_material_metric_tolerance_ownership`

## Frozen Surfaces

Until Gate A names a fully source-ready runtime candidate, all of these
surfaces stay frozen:

- runtime;
- support;
- confidence;
- evidence;
- API;
- route-card;
- output-card;
- proposal/report;
- workbench-input.

Gate A must not change acoustic values, supported output sets,
confidence, evidence tier, route-card values, output-card statuses,
proposal/report copy, missing-input behavior, or input schema behavior.

## Acceptance Rules

Gate A may select runtime work only if it names all of:

- exact `TTF30.2A` topology or a bounded family rule;
- metric owner and lab / field output policy;
- tolerance owner;
- local material mapping for board, studs, cavity gap, coupling, and
  insulation;
- protected negative boundaries and near misses;
- paired engine value tests and web route-card / report tests.

If any one of these is missing, Gate A remains no-runtime.

## Validation

Baseline before Gate A:

- `pnpm calculator:gate:current`: green on 2026-04-30 before `MWI.2A`
  Gate C, engine 152 files / 750 tests, web 45 files / 216 passed +
  18 skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- `pnpm calculator:gate:current`: green on 2026-04-30 after `MWI.2A`
  Gate C, engine 153 files / 756 tests, web 45 files / 216 passed +
  18 skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- `pnpm calculator:gate:current`: green on 2026-04-30 immediately
  before touching `TTF30.2A` Gate A, engine 153 files / 756 tests, web
  45 files / 216 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.

Gate A validation completed after this handoff:

- `pnpm --filter @dynecho/engine exec vitest run src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 1 file / 8 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30 after preserving the prior MWI.2A Gate C
  selection status in the active docs, 2 files / 14 tests.
- `pnpm calculator:gate:current`
  green on 2026-04-30 after adding Gate A, engine 154 files / 764
  tests, web 45 files / 216 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean.
- `git diff --check`
  clean after validation note sync.

Gate C validation completed after this handoff:

- `pnpm --filter @dynecho/engine exec vitest run src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 1 engine file / 6 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts src/twin-timber-knauf-ttf302a-mapping-tolerance-gate-a-contract.test.ts src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 3 engine files / 20 tests.
- `pnpm calculator:gate:current`
  green on 2026-04-30 after adding Gate C, engine 155 files / 770
  tests, web 45 files / 216 passed + 18 skipped, build 5/5 with known
  non-fatal `sharp/@img` warnings, whitespace guard clean.
- `git diff --check`
  clean after validation note sync.

Run `pnpm check` only if Gate C selects any runtime import, support /
confidence / evidence promotion, API movement, route-card movement,
output-card movement, proposal/report copy movement, output-support
movement, or workbench-input behavior movement.
