# Checkpoint - Calculator Source Gap Revalidation v6 Gate A Handoff

Date: 2026-04-30

Slice: `calculator_source_gap_revalidation_v6`

Gate: A

Status: LANDED / NO RUNTIME MOVEMENT

## Decision

`packages/engine/src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts`
lands Gate A no-runtime source / accuracy revalidation after the
post-Knauf mapping chain closed.

Gate A does not select runtime import, value movement, support
promotion, confidence promotion, evidence promotion, output support
movement, API movement, route-card movement, output-card movement,
proposal/report copy movement, or workbench-input behavior movement.

Next selected slice:

`steel_stud_knauf_enpc_mapping_tolerance_v1`

Next selected file:

`packages/engine/src/steel-stud-knauf-enpc-mapping-tolerance-gate-a-contract.test.ts`

Gate A selection status:

`selected_no_runtime_knauf_enpc_steel_stud_mapping_tolerance_after_v6_rerank_found_no_runtime_ready_candidate`

## Revalidation Evidence

The recently closed Knauf mapping chain remains no-runtime:

- `TB.5A` lacks exact stud-depth / `SHEETROCK ONE` / `KI 75G11`
  mapping, field-output policy, tolerance owner, and paired visible
  tests.
- `MWI.2A` lacks substrate mass, furring / cavity / coupling,
  board-insulation mapping, field-output policy, tolerance owner, and
  paired visible tests.
- `TTF30.2A` lacks exact twin-frame topology, `FIBEROCK AQUA-TOUGH`,
  side asymmetry, glasswool placement, field-output policy, tolerance
  owner, and paired visible tests.

No closed post-Knauf row is source-ready for runtime import.

## Selected No-Runtime Follow-Up

`EN-PC-50-055-6-2-12.5-WB-25` is selected as the next no-runtime
mapping / tolerance slice because it is the highest-value remaining
concrete Knauf locator for a common steel-stud wall lane.

Known source context:

- source: Knauf UK Drywall Systems Performance Guide, April 2026;
- row: EN Compliance Performer Wallboard
  `EN-PC-50-055-6-2-12.5-WB-25`;
- topology: 50 mm 0.55 gauge Knauf C metal stud at 600 mm centres;
- boards: `2x12.5 mm` Wallboard each side;
- cavity: `25 mm` Knauf Insulation Acoustic Roll;
- metric: lab `Rw 49 dB` context only.

This is context and mapping work, not import permission.

## Why Runtime Stays Blocked

Runtime remains blocked because `EN-PC-50-055-6-2-12.5-WB-25` still
needs:

- Wallboard to local board mapping or rejection;
- Acoustic Roll to local insulation mapping or rejection;
- stud gauge / centres equivalence against the live steel-stud route;
- current steel-stud exact-anchor precedence decision;
- lab `Rw` versus field-output policy;
- spectrum-term rejection for `C`, `Ctr`, and `STC`;
- row-specific tolerance owner or explicit tolerance gap;
- paired engine and web visible tests before any later runtime or copy
  movement.

## Protected Boundaries

Gate A carries these boundaries forward:

- UK steel-stud rows do not promote timber double-board or masonry
  lining routes.
- `EN-PC-50-055-6-2-12.5-WB-25` must not replace existing Knauf
  lab-report exact steel-stud anchors by proximity.
- Lab `Rw` context does not supply field outputs: `R'w`, `Dn,w`,
  `DnT,w`, or `DnT,A`.
- Lab `Rw` context does not supply DynEcho `C`, `Ctr`, or `STC`.
- `AAC.1A`, `TSF120.1A`, and `TO120.1A` remain adjacent or negative
  context only.

## Frozen Surfaces

These surfaces remain frozen:

- runtime;
- support;
- confidence;
- evidence;
- API;
- route-card;
- output-card;
- proposal/report;
- workbench-input.

## Validation

Baseline before Gate A:

- `pnpm calculator:gate:current`: green on 2026-04-30 after TTF30.2A
  Gate C selected this slice, engine 155 files / 770 tests, web 45
  files / 216 passed + 18 skipped, build 5/5 with known non-fatal
  `sharp/@img` warnings, whitespace guard clean.

Completed after this handoff:

- `pnpm --filter @dynecho/engine exec vitest run src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 1 engine file / 8 tests.
- `pnpm --filter @dynecho/engine exec vitest run src/post-lined-masonry-knauf-mwi2a-mapping-tolerance-v1-next-slice-selection-contract.test.ts src/post-twin-timber-knauf-ttf302a-mapping-tolerance-v1-next-slice-selection-contract.test.ts src/calculator-source-gap-revalidation-v6-gate-a-contract.test.ts --maxWorkers=1`
  green on 2026-04-30, 3 engine files / 20 tests.
- `pnpm calculator:gate:current` green on 2026-04-30 after Gate A,
  engine 156 files / 778 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.
- `git diff --check` clean after validation note sync.

Run `pnpm check` only if a later gate selects runtime/import/visible
behavior movement or if this checkpoint is promoted to a release gate.
