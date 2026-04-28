# Slice Plan - Wall Source Catalog Acquisition v1

Status: GATE A LANDED NO-RUNTIME (by
`packages/engine/src/wall-source-catalog-acquisition-gate-a-contract.test.ts`;
Gate B should close source-pack readiness no-runtime unless a direct
row pack is complete enough for a bounded import slice)

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

Gate A created an executable no-runtime contract that records:

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

If a candidate is only adjacent context, Gate A classifies it as
`bounded` or `reject` and keep runtime frozen.

### Gate A Result - 2026-04-28

Gate A landed in
`packages/engine/src/wall-source-catalog-acquisition-gate-a-contract.test.ts`.
It changed no runtime behavior and classified the source targets as:

| Family | Gate A readiness | Result |
|---|---|---|
| W111 / W112 / W115 / W119 and adjacent manufacturer framed systems | `bounded_existing_rows` | existing bounded rows already fit; no new runtime import selected |
| No-stud empty or porous double-leaf walls | `needs_research` | needs direct row or formula tolerance owner |
| Timber double-board stud walls | `needs_research` | needs double-board/stud/cavity/fill/side-count metadata |
| CLT wall assemblies | `needs_research` | needs wall-specific CLT row or laminated-leaf tolerance |
| Lined-massive / heavy-core concrete | `needs_research` | remains screening until source row or bounded lining rule |
| Floor / impact / product-delta adjacent rows | `reject_adjacent_context` | not wall source truth |

The Gate A decision is that no direct runtime import is ready now. Gate
B should therefore be a no-runtime source-pack readiness closeout unless
new direct rows with complete metadata, tolerance, protected negative
boundaries, and paired engine/web tests are deliberately introduced.

## Expected Tests

- Landed:
  `packages/engine/src/wall-source-catalog-acquisition-gate-a-contract.test.ts`.
- Keep it no-runtime.
- Include row-readiness and negative-boundary assertions.
- Next: add
  `packages/engine/src/wall-source-catalog-acquisition-gate-b-contract.test.ts`
  for source-pack readiness closeout.
- Add paired web route-card tests only if a later gate changes visible
  values, support, confidence, evidence text, or missing-input copy.

## Immediate Execution Order

1. Read
   [CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_A_HANDOFF.md](./CHECKPOINT_2026-04-28_WALL_SOURCE_CATALOG_ACQUISITION_GATE_A_HANDOFF.md).
2. Run `pnpm calculator:gate:current` as the Gate B baseline.
3. Add
   `packages/engine/src/wall-source-catalog-acquisition-gate-b-contract.test.ts`
   as a no-runtime source-pack readiness closeout.
4. Confirm whether any row pack is ready for a future import slice;
   Gate A currently says no direct runtime import is ready now.
5. If no pack is ready, close no-runtime and document the missing
   evidence. If one is ready, select only a bounded import slice with
   complete source metadata, tolerance, negative boundaries, and paired
   engine/web tests.
6. Validate with the targeted Gate B test, `pnpm calculator:gate:current`,
   and `git diff --check`.
