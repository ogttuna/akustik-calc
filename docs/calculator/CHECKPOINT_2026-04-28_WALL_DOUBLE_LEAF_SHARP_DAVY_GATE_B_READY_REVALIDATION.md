# Checkpoint - Wall Double-Leaf Sharp/Davy Gate B Ready Revalidation

Date: 2026-04-28

Status: checkpoint-only revalidation. No runtime code, formula,
confidence, evidence-tier, output-support, source posture, or web
route-card behavior changed.

Latest landed implementation remains:
`wall_double_leaf_sharp_davy_scoping_v1` Gate A.

Next unimplemented step remains:
`wall_double_leaf_sharp_davy_scoping_v1` Gate B bounded current-value /
source-tolerance matrix, or no-runtime Gate B decision.

## Revalidation Result

The active plan is still correct and still incomplete.

Implemented:

- `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-a-contract.test.ts`
- `tools/dev/run-calculator-current-gate.ts` includes the Gate A
  contract.
- Authority docs select
  `wall_double_leaf_sharp_davy_scoping_v1`.

Still not implemented:

- `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts`
- any Gate B closeout or post-slice next-selection contract;
- any source/tolerance-backed value movement for double-leaf,
  single-stud, or double-stud walls.

The implementation scan found no drift from the 2026-04-27 Gate B-ready
handoff. Gate A remains the latest executable slice artifact, and Gate B
must start from the current-value/source-tolerance matrix described in
the slice plan.

## Current Values To Preserve Into Gate B

Gate B must preserve these current field values unless it names a source
row, benchmark envelope, formula tolerance owner, or bounded family rule
that justifies movement:

| Case | Current family | Current field values |
|---|---|---|
| Empty double-leaf, no stud metadata | `double_leaf` / `double_leaf_empty_cavity_delegate` | `R'w=46`, `Dn,w=47`, `DnT,w=47`, `DnT,A=45.8` |
| Porous double-leaf, no stud metadata | `double_leaf` / `double_leaf_porous_fill_corrected` | `R'w=41`, `Dn,w=42`, `DnT,w=42`, `DnT,A=40.4` |
| Explicit single-stud metadata | `stud_wall_system` / `stud_surrogate_blend+framed_wall_calibration` | `R'w=37`, `Dn,w=38`, `DnT,w=38`, `DnT,A=35.9` |
| Explicit double-stud / split-cavity metadata | `double_stud_system` / `double_stud_surrogate_blend+double_stud_calibration` | `R'w=52`, `Dn,w=53`, `DnT,w=53`, `DnT,A=51.8` |

Negative boundaries remain pinned by Gate A and nearby contracts:

- AAC lining boundary stays `lined_massive_wall`, not double-leaf.
- Classic triple-leaf stays `multileaf_multicavity`, not double-leaf.
- Exact/catalog, resilient side-count, timber, single-leaf,
  lined-massive, and CLT surfaces remain protected by their existing
  contracts.

## Gate B Start Instructions

1. Run `pnpm calculator:gate:current` before editing.
2. Add
   `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts`.
3. Reuse the four Gate A positive candidate shapes and assert:
   - lab and field values;
   - `supportedTargetOutputs` / `unsupportedTargetOutputs`;
   - detected family, selected delegate, strategy, confidence;
   - selected candidate method and candidate `Rw`;
   - no verified exact/lab-fallback source row unless a real row is
     deliberately added.
4. Add the source/tolerance decision columns:
   - `currentValueIsDefensible`;
   - `directStackSourceRow`;
   - `labFallbackSourceRow`;
   - `benchmarkEnvelope`;
   - `formulaToleranceOwner`;
   - `runtimeMoveAllowedNow`;
   - `runtimeMoveBlocker`.
5. Add negative assertions for exact/catalog precedence, resilient
   side-count exact rows, timber exact/formula surfaces, single-leaf
   mass-law, lined-massive, CLT, direct-coupled, and triple-leaf /
   multi-cavity shapes.
6. Include the new Gate B test in
   `tools/dev/run-calculator-current-gate.ts`.
7. Keep runtime values, formulas, output support, confidence, evidence
   text, and web route cards unchanged unless Gate B names the source
   row, benchmark envelope, formula tolerance owner, or bounded family
   rule that supports movement.

## Validation

- `pnpm calculator:gate:current` green:
  - engine 105 files / 480 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean
- `pnpm check` green:
  - lint green
  - typecheck green
  - test stage green with unchanged engine/web tasks replayed from
    Turbo cache
  - build 5/5 with the known non-fatal `sharp/@img` warnings
- `git diff --check` clean before this checkpoint update.

## Boundaries

- Keep `/home/ogttuna/Dev/Machinity/Acoustic2` read-only.
- Do not import or infer new source truth without a dedicated source
  row / benchmark evidence note.
- Do not merge triple-leaf/multi-cavity shapes into double-leaf.
- Do not override exact/catalog, resilient side-count, timber exact,
  single-leaf, lined-massive, or CLT boundaries.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  wall-selector behavior, heavy-core/concrete, timber-stud, CLT wall,
  floor fallback, or wall exact-row follow-ups from nearby green tests
  alone.
