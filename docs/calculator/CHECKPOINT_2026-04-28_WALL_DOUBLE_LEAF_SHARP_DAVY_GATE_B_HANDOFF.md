# Checkpoint - Wall Double-Leaf Sharp/Davy Gate B Handoff

Date: 2026-04-28

Status: Gate B landed no-runtime. No acoustic runtime values, formulas,
confidence scores, evidence tiers, output support, source posture, or
web route-card behavior changed.

Latest landed implementation:
`wall_double_leaf_sharp_davy_scoping_v1` Gate B.

Next unimplemented step:
`wall_double_leaf_sharp_davy_scoping_v1` Gate C no-runtime closeout /
next-slice selection contract.

## What Landed

- `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts`
  adds a bounded current-value/source-tolerance matrix.
- `tools/dev/run-calculator-current-gate.ts` now includes the Gate B
  contract in the current focused calculator gate.
- Runtime stays unchanged because none of the positive double-leaf,
  single-stud, or double-stud candidates has a stack-specific source
  row, lab-fallback row, benchmark envelope, formula tolerance owner, or
  bounded family rule that justifies a value move.

## Current Values Preserved By Gate B

| Case | Current family | Preserved field values |
|---|---|---|
| Empty double-leaf, no stud metadata | `double_leaf` / `double_leaf_empty_cavity_delegate` | `R'w=46`, `Dn,w=47`, `DnT,w=47`, `DnT,A=45.8` |
| Porous double-leaf, no stud metadata | `double_leaf` / `double_leaf_porous_fill_corrected` | `R'w=41`, `Dn,w=42`, `DnT,w=42`, `DnT,A=40.4` |
| Explicit single-stud metadata | `stud_wall_system` / `stud_surrogate_blend+framed_wall_calibration` | `R'w=37`, `Dn,w=38`, `DnT,w=38`, `DnT,A=35.9` |
| Explicit double-stud / split-cavity metadata | `double_stud_system` / `double_stud_surrogate_blend+double_stud_calibration` | `R'w=52`, `Dn,w=53`, `DnT,w=53`, `DnT,A=51.8` |

Each positive route also asserts lab `Rw`, supported output arrays,
selected candidate method/`Rw`, cavity/fill metadata, no verified exact
match, and no lab-fallback source match.

## Runtime Movement Decision

Gate B blocks runtime movement for all four positive routes:

- `empty_double_leaf_formula_owned_no_stack_source`
- `porous_double_leaf_formula_owned_no_stack_source`
- `single_stud_metadata_low_confidence_no_bounded_rule`
- `double_stud_split_cavity_no_stack_source`

The current values are finite and defensible as formula-owned estimates,
but they are not promoted beyond that posture.

## Protected Boundaries

The Gate B contract keeps these surfaces outside the double-leaf/stud
retune lane:

- exact catalog and lab-fallback rows;
- resilient side-count exact rows;
- timber exact and live stud formula surfaces;
- single-leaf mass-law, lined-massive, heavy-core, and CLT boundaries;
- direct-coupled and triple-leaf/multi-cavity negative boundaries.

The executable lined-massive and triple-leaf checks remain pinned from
Gate A.

## Next Step

Add
`packages/engine/src/post-wall-double-leaf-sharp-davy-scoping-v1-next-slice-selection-contract.test.ts`.

That Gate C contract should:

1. close `wall_double_leaf_sharp_davy_scoping_v1` no-runtime;
2. preserve the Gate A/Gate B values and source posture;
3. state that web route-card work is not required because no visible
   value/support/confidence/evidence/missing-input copy changed;
4. select the next roadmap candidate only after reconciling
   `MASTER_PLAN.md`, `NEXT_IMPLEMENTATION_PLAN.md`,
   `CURRENT_STATE.md`, and the source-gap ledger.

## Validation

- `pnpm --filter @dynecho/engine exec vitest run src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts --maxWorkers=1`
  green: 1 file / 5 tests.
- `pnpm calculator:gate:current` green:
  - engine 106 files / 485 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean

Broad `pnpm check` was not rerun for this no-runtime test/docs slice;
the last broad validation remains the 2026-04-28 green run from the
Gate B-ready revalidation checkpoint.

## Boundaries

- Keep `/home/ogttuna/Dev/Machinity/Acoustic2` read-only.
- Do not infer new wall source truth without a dedicated source row,
  benchmark evidence note, formula tolerance owner, or bounded family
  rule.
- Do not merge triple-leaf/multi-cavity shapes into double-leaf.
- Do not override exact/catalog, resilient side-count, timber exact,
  single-leaf, lined-massive, heavy-core, or CLT boundaries.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  wall-selector behavior, heavy-core/concrete, timber-stud, CLT wall,
  floor fallback, or wall exact-row follow-ups from nearby green tests
  alone.
