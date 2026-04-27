# Checkpoint - Wall Double-Leaf Sharp/Davy Gate B Ready Handoff

Date: 2026-04-27

Status: planning/implementation reconciliation only. No runtime code,
formula, confidence, evidence-tier, output-support, or web route-card
behavior changed in this checkpoint.

Latest landed implementation remains:
`wall_double_leaf_sharp_davy_scoping_v1` Gate A.

Next unimplemented step:
`wall_double_leaf_sharp_davy_scoping_v1` Gate B bounded current-value /
source-tolerance matrix, or no-runtime Gate B decision.

## Reconciliation Result

The active plan is not complete. It is correctly selected, and Gate A is
implemented, but Gate B has not been written yet.

Implemented and validated:

- `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-a-contract.test.ts`
- `tools/dev/run-calculator-current-gate.ts` includes the Gate A
  contract.
- Authority docs point at
  `wall_double_leaf_sharp_davy_scoping_v1`.

Not implemented yet:

- `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts`
- any Gate B closeout or post-slice next-selection contract;
- any source/tolerance-backed value movement for double-leaf,
  single-stud, or double-stud walls.

## Current Gate A Values To Carry Into Gate B

Gate B must start by preserving these current values unless it names a
source row, benchmark envelope, formula tolerance owner, or bounded
family rule that justifies movement:

| Case | Current family | Current field values |
|---|---|---|
| Empty double-leaf, no stud metadata | `double_leaf` / `double_leaf_empty_cavity_delegate` | `R'w=46`, `Dn,w=47`, `DnT,w=47`, `DnT,A=45.8` |
| Porous double-leaf, no stud metadata | `double_leaf` / `double_leaf_porous_fill_corrected` | `R'w=41`, `Dn,w=42`, `DnT,w=42`, `DnT,A=40.4` |
| Explicit single-stud metadata | `stud_wall_system` / `stud_surrogate_blend+framed_wall_calibration` | `R'w=37`, `Dn,w=38`, `DnT,w=38`, `DnT,A=35.9` |
| Explicit double-stud / split-cavity metadata | `double_stud_system` / `double_stud_surrogate_blend+double_stud_calibration` | `R'w=52`, `Dn,w=53`, `DnT,w=53`, `DnT,A=51.8` |

Negative boundaries already pinned by Gate A:

- AAC lining boundary stays `lined_massive_wall`, not double-leaf.
- Classic triple-leaf stays `multileaf_multicavity`, not double-leaf.
- Exact/catalog, resilient side-count, timber, single-leaf,
  lined-massive, and CLT surfaces remain protected by their existing
  contracts.

## Gate B Workplan

1. Run `pnpm calculator:gate:current` before editing.
2. Add
   `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts`.
3. Reuse the four Gate A positive candidate shapes and assert:
   - lab and field values;
   - `supportedTargetOutputs` / `unsupportedTargetOutputs`;
   - detected family, selected delegate, strategy, confidence;
   - selected candidate method and candidate `Rw`;
   - `findVerifiedAirborneAssemblyMatch*` remains null unless a real
     exact/lab-fallback row is deliberately added.
4. Add a source/tolerance decision table for each positive route:
   - current value defensible;
   - direct stack source row present/absent;
   - benchmark envelope present/absent;
   - formula tolerance owner present/absent;
   - runtime movement allowed now true/false.
5. Add negative assertions for:
   - exact catalog / lab-fallback precedence;
   - resilient side-count exact rows;
   - timber exact/formula surfaces;
   - single-leaf mass-law surfaces;
   - lined-massive and CLT boundaries;
   - direct-coupled leaves;
   - triple-leaf / multi-cavity shapes.
6. Do not change runtime values in Gate B unless step 4 provides a
   named source/tolerance basis. If none exists, Gate B should land
   no-runtime and select Gate C closeout.
7. Include the Gate B test in `tools/dev/run-calculator-current-gate.ts`.
8. Validate with the targeted Gate B test, `pnpm calculator:gate:current`,
   and `git diff --check`.

## Expected Decision Bias

Given the current implementation evidence, the likely Gate B result is
no-runtime: the current values are finite and traceable to formula-owned
routes, but no stack-specific source row or bounded tolerance pack is
currently named for these representative double-leaf / stud-cavity
shapes.

That expected outcome is not a permission to skip Gate B. The matrix is
still needed because this family is common, metadata-sensitive, and easy
to misclassify.

## Validation

Planning reconciliation validation:

- `pnpm calculator:gate:current` green:
  - engine 105 files / 480 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean
- `git diff --check` clean.

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
