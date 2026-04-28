# Slice Plan - Wall Source Catalog Acquisition v1

Status: SELECTED (by
`wall_double_leaf_source_evidence_acquisition_v1` Gate C closeout;
starts with no-runtime Gate A target inventory and import acceptance
rules)

## Objective

Turn the repeated wall runtime blockers into a source-acquisition plan
that can unlock future accuracy work without guessing. The last wall
slices all reached the same boundary: current formulas are finite and
guarded, but value/confidence movement is blocked unless a direct source
row, benchmark family rule, or named formula tolerance owner exists.

Gate A is therefore an acquisition/readiness slice, not an import slice.
It should identify which wall rows are worth acquiring, what metadata is
required, and what exact negative boundaries must be pinned before any
future runtime movement.

## Why This Slice Is Next

Closed wall slices now give a clear signal:

- single-leaf concrete / masonry / AAC remains formula-owned without a
  stack-specific source row or bounded tolerance pack;
- generic empty and no-stud porous double-leaf walls remain frozen
  without direct source rows or a formula tolerance owner;
- bounded W111 / W112 / W115 / W119 framed-wall rows already fit
  current behavior and do not require runtime movement;
- timber double-board and CLT wall live stacks remain source-gated;
- heavy-core / lined-massive concrete remains screening.

The highest-value next calculator move is to acquire and classify source
rows for these blocked common wall families before writing another
retune.

## Non-Goals

- Do not change runtime values, formulas, support, confidence, evidence
  tiers, warnings, API behavior, or web route-card copy during Gate A.
- Do not import broad adjacent rows as exact truth.
- Do not use floor CLT, floor impact, product-delta, or report/export
  rows as wall source truth.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  wall-selector behavior, heavy-core/concrete, timber-stud, CLT, or
  exact-row follow-ups from nearby green tests alone.
- Do not add a permanent catalog schema until the acquisition contract
  proves that candidate rows and required metadata are ready.

## Gate A - Target Inventory And Acceptance Rules

Gate A must create an executable no-runtime contract that records:

1. target source families;
2. required fields for each row;
3. import readiness decision: `accept`, `bounded`, `reject`, or
   `needs_research`;
4. negative boundaries that prevent adjacent-source leakage;
5. the first future import slice, if any.

Target families:

| Family | Why it matters | Gate A posture |
|---|---|---|
| W111 / W112 / W115 / W119 and adjacent manufacturer framed systems | common stud/double-stud walls; current bounded rows already fit | acquire broader rows only if layer/mounting metadata is complete |
| No-stud empty or porous double-leaf walls | common user-entered stacks; currently source-blocked | require direct stack rows or a formula tolerance owner |
| Timber double-board stud walls | common lightweight wall lane; live stack remains low-confidence formula | require matching board count, cavity, fill, and stud/coupling metadata |
| CLT wall assemblies | common mass-timber wall lane; floor CLT rows cannot be borrowed | require wall-specific CLT row or documented laminated-leaf tolerance |
| Lined-massive / heavy-core concrete | common renovation wall lane; remains screening | require source row or bounded family rule for the lining topology |

Required row metadata:

- source label, URL/page/table, and retrieval date;
- exact layer order, thickness, material name, density or surface mass;
- mounting, cavity depth, fill type, stud type, stud spacing, coupling,
  side-count/resilient details when relevant;
- reported metric (`Rw`, `R'w`, `DnT,w`, `DnT,A`, spectrum, or field
  companion), context, and tolerance;
- local material mapping confidence;
- exact/bound/family/formula/screening precedence impact;
- engine value tests and web route-card tests required before visible
  movement.

## Acceptance Rules

Gate A may select a future import slice only when a candidate row is:

- direct enough to map to a live or generated wall topology;
- specific enough to preserve exact/catalog precedence;
- bounded by a source tolerance or benchmark threshold;
- paired with negative cases for adjacent rows that must not move.

If a candidate is only adjacent context, Gate A must classify it as
`bounded` or `reject` and keep runtime frozen.

## Expected Tests

- Add
  `packages/engine/src/wall-source-catalog-acquisition-gate-a-contract.test.ts`.
- Keep it no-runtime.
- Include row-readiness and negative-boundary assertions.
- Add paired web route-card tests only if a later gate changes visible
  values, support, confidence, evidence text, or missing-input copy.

## Immediate Execution Order

1. Read
   [CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_C_CLOSEOUT_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_C_CLOSEOUT_HANDOFF.md).
2. Run `pnpm calculator:gate:current` as the baseline.
3. Add Gate A no-runtime wall source catalog target inventory.
4. Decide whether any row pack is ready for a future import slice; if
   not, close no-runtime and document the missing evidence.
5. Validate with the targeted Gate A test, `pnpm calculator:gate:current`,
   and `git diff --check`.
