# Slice Plan - Wall No-Stud Double-Leaf Source Research v1

Status: GATE A LANDED NO-RUNTIME (by
`packages/engine/src/wall-no-stud-double-leaf-source-research-gate-a-contract.test.ts`;
Gate B should audit formula-tolerance and direct-row feasibility
no-runtime)

## Objective

Acquire and classify direct source evidence for common no-stud
double-leaf wall stacks before any runtime value, confidence, support,
evidence, or route-card movement.

The target is narrow on purpose: empty-cavity no-stud double-leaf walls
and porous/absorber-filled no-stud double-leaf walls. These are common
user-entered wall combinations, but the current calculator must keep
them formula-owned because the recent source-catalog slice found no
direct source row, benchmark family rule, or named formula tolerance
owner.

## Why This Slice Is Next

`wall_source_catalog_acquisition_v1` Gate B closed with no direct import
pack ready:

- W111 / W112 / W115 / W119 framed rows already fit current behavior;
- generic empty/no-stud double-leaf remains blocked only by missing
  direct rows or a formula tolerance owner;
- timber double-board, CLT wall, and lined-massive/heavy-core concrete
  remain valid gaps, but each needs a broader source match before it can
  move safely;
- floor, impact, product-delta, report, and adjacent context rows are
  not wall source truth.

The highest-value next accuracy move is therefore a source research
gate focused on the no-stud double-leaf family. It can unlock both
coverage and accuracy without guessing.

## Non-Goals

- Do not change acoustic runtime formulas, values, confidence, support,
  evidence tiers, warnings, API behavior, or web route-card copy during
  Gate A.
- Do not promote no-stud double-leaf rows from W111 / W112 / W115 /
  W119 framed rows.
- Do not borrow floor CLT, floor impact, product-delta, report/export,
  triple-leaf, or framed-stud context as direct no-stud wall truth.
- Do not reopen `GDMTXA04A`, `C11c`, raw open-box/open-web,
  wall-selector behavior, heavy-core/concrete, timber-stud, CLT, or
  exact-row follow-ups from nearby green tests alone.
- Do not add route-card copy or UI changes unless a later gate changes
  visible support/confidence/evidence/missing-input behavior and adds
  paired web tests.

## Gate A - Direct Source And Tolerance Inventory

Gate A must be executable and no-runtime. It should create
`packages/engine/src/wall-no-stud-double-leaf-source-research-gate-a-contract.test.ts`
and record:

1. direct source candidates for empty no-stud double-leaf walls;
2. direct source candidates for porous or absorber-filled no-stud
   double-leaf walls;
3. any named Sharp/Davy, mass-air-mass, or other double-leaf formula
   tolerance owner that explicitly applies to no-stud/no-coupling wall
   stacks;
4. source metadata completeness;
5. negative boundaries that prevent framed, floor, product-delta,
   triple-leaf, or lined-massive rows from leaking into this family;
6. the next action: direct import, formula-tolerance gate, or no-runtime
   closeout.

Required evidence fields:

- source label, URL or local path, page/table/row locator, and retrieval
  date;
- exact layer order, material names, thicknesses, density or surface
  mass;
- proof that the stack is no-stud/no-rail/no-mechanical-coupling;
- cavity depth, air gap, fill/absorber type, and mounting context;
- reported metric (`Rw`, `R'w`, `DnT,w`, `DnT,A`, spectrum adaptation,
  lab/field context) and tolerance owner;
- local material mapping confidence;
- exact/bound/family/formula/screening precedence impact;
- engine value tests and web route-card tests required before any
  visible movement.

## Acceptance Rules

Gate A may select a future direct import only if:

- the source row is a direct no-stud double-leaf wall stack;
- empty and porous/filled variants are separated;
- all row metadata and metric context are complete;
- the tolerance owner is named;
- negative boundaries are executable; and
- paired engine value tests plus web route-card tests are explicitly
  named for the import slice.

Gate A may select a formula-tolerance slice only if a named published
formula scope clearly covers the current no-stud routes and supplies a
bounded tolerance corridor.

If the available material is adjacent context only, Gate A must close
no-runtime and leave current behavior formula-owned.

### Gate A Result - 2026-04-28

Gate A landed in
`packages/engine/src/wall-no-stud-double-leaf-source-research-gate-a-contract.test.ts`.
It changed no runtime behavior and classified the source/tolerance
posture as:

| Candidate | Gate A posture | Result |
|---|---|---|
| Current empty no-stud route | formula-owned | `R'w=46`, `Rw=48`; stays frozen until direct same-stack row or named formula tolerance owner |
| Current porous no-stud route | formula-owned | `R'w=41`, `Rw=43`; stays frozen until direct same-stack row or named formula tolerance owner |
| Gypsum-block double walls with air chamber | direct-family adjacent material | useful no-stud family evidence, but not current AAC / gypsum-board material mapping and no imported row-level table |
| Gypsum-block double walls with absorbent material | direct-family adjacent material | useful porous/fill evidence, but needs full row extraction and local material mapping |
| Davy / Sharp cavity-wall formula line | formula-tolerance candidate | selected for Gate B feasibility; must translate model evidence into a bounded local tolerance |
| NRC gypsum-board wall transmission-loss archive | row archive needs extraction | selected for Gate B feasibility; must prove any row has no-stud/no-rail/no-coupling fit |
| Stud-type studies and framed manufacturer rows | adjacent context only | protected negative boundaries; cannot promote no-stud values |

Gate A selects no direct import now. Gate B should remain no-runtime and
decide whether either the Davy/Sharp line can provide a bounded formula
tolerance or the NRC archive contains an extractable direct no-stud row.

## Expected Tests

- Add:
  `packages/engine/src/wall-no-stud-double-leaf-source-research-gate-a-contract.test.ts`.
- Keep it no-runtime.
- Assert source-candidate classification, metadata completeness,
  negative boundaries, and the selected next action.
- Next add:
  `packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts`.
- Gate B should stay no-runtime unless it proves a bounded formula
  tolerance or a complete direct row; runtime movement still requires
  paired engine value and web route-card tests.
- Add paired web route-card tests only in a later slice that changes
  visible values, support, confidence, evidence text, or missing-input
  copy.

## Immediate Execution Order

1. Read
   [CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_NO_STUD_DOUBLE_LEAF_SOURCE_RESEARCH_GATE_A_HANDOFF.md).
2. Run `pnpm calculator:gate:current` as the Gate B baseline.
3. Add
   `packages/engine/src/wall-no-stud-double-leaf-source-research-gate-b-contract.test.ts`
   as a no-runtime feasibility audit.
4. For Davy/Sharp, pin whether the published model evidence is specific
   enough to create a bounded local tolerance for current empty and
   porous no-stud routes.
5. For NRC, pin whether an extracted row proves no-stud/no-rail/
   no-coupling and maps to local material/cavity topology.
6. Keep runtime values, support, confidence, evidence text, and
   route-card copy frozen unless Gate B names a complete direct row or
   tolerance owner with executable negative boundaries.
7. Validate with the targeted Gate B test, `pnpm calculator:gate:current`,
   and `git diff --check`.
