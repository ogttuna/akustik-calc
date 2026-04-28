# Slice Plan - Wall Double-Leaf Source Evidence Acquisition v1

Status: CLOSED at Gate C (selected by
`wall_double_leaf_sharp_davy_scoping_v1` Gate C closeout; Gate A
classified source/tolerance candidates, and Gate B proved the bounded
Knauf W111 / W112 / W115 / W119 framed-wall rows already fit current
lab/field behavior without runtime value movement; Gate C selected
`wall_source_catalog_acquisition_v1`)

## Objective

Collect and classify source / benchmark / formula-tolerance evidence for
common double-leaf, single-stud, double-stud, and cavity wall assemblies
before any runtime value movement.

The previous `wall_double_leaf_sharp_davy_scoping_v1` slice proved the
current implementation is finite and guarded for the representative
routes, but it also proved that current values cannot honestly move
without stronger evidence.

## Why This Slice Is Next

Gate B closed with no runtime movement because the representative
double-leaf / stud-cavity candidates have:

- no exact source row;
- no lab-fallback source row;
- no benchmark envelope;
- no named formula tolerance owner;
- no bounded family rule that justifies changing values.

These assemblies are common in private/internal acoustic estimation.
The next useful step is therefore not a retune. It is an evidence
acquisition and classification slice that can decide whether a future
Gate B import/tightening pass is defensible.

## Non-Goals

- Do not change runtime values, formulas, confidence scores, evidence
  tiers, output support, or route-card text during Gate A.
- Do not promote current formula-owned values to benchmark/exact.
- Do not borrow floor CLT, floor impact, or unrelated catalog rows as
  wall double-leaf truth.
- Do not merge direct-coupled or triple-leaf/multi-cavity shapes into
  decoupled double-leaf.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  wall-selector behavior, heavy-core/concrete, timber-stud, CLT wall,
  floor fallback, or exact-row follow-ups from nearby green tests alone.

## Current Baseline

The selected source-evidence slice starts from:

- `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-a-contract.test.ts`
- `packages/engine/src/wall-double-leaf-sharp-davy-scoping-gate-b-contract.test.ts`
- `packages/engine/src/post-wall-double-leaf-sharp-davy-scoping-v1-next-slice-selection-contract.test.ts`
- `packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-a-contract.test.ts`
- `packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-b-contract.test.ts`
- `packages/engine/src/post-wall-double-leaf-source-evidence-acquisition-v1-next-slice-selection-contract.test.ts`
- `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_C_CLOSEOUT_HANDOFF.md`
- `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_B_HANDOFF.md`
- `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_GATE_A_HANDOFF.md`
- `docs/calculator/CHECKPOINT_2026-04-28_WALL_DOUBLE_LEAF_SHARP_DAVY_GATE_C_CLOSEOUT_HANDOFF.md`
- `docs/calculator/SOURCE_GAP_LEDGER.md`
- `docs/foundation/SOURCE_REPO_POLICY.md`

Preserved current field values:

| Case | Current family | Current field values |
|---|---|---|
| Empty double-leaf, no stud metadata | `double_leaf` / `double_leaf_empty_cavity_delegate` | `R'w=46`, `Dn,w=47`, `DnT,w=47`, `DnT,A=45.8` |
| Porous double-leaf, no stud metadata | `double_leaf` / `double_leaf_porous_fill_corrected` | `R'w=41`, `Dn,w=42`, `DnT,w=42`, `DnT,A=40.4` |
| Explicit single-stud metadata | `stud_wall_system` / `stud_surrogate_blend+framed_wall_calibration` | `R'w=37`, `Dn,w=38`, `DnT,w=38`, `DnT,A=35.9` |
| Explicit double-stud / split-cavity metadata | `double_stud_system` / `double_stud_surrogate_blend+double_stud_calibration` | `R'w=52`, `Dn,w=53`, `DnT,w=53`, `DnT,A=51.8` |

## Gate A - Source / Tolerance Inventory

Gate A landed no-runtime in
`packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-a-contract.test.ts`.
It created an executable inventory
contract that classifies candidate evidence for:

1. empty-cavity double-leaf walls;
2. porous-filled double-leaf walls;
3. single-stud lightweight walls;
4. double-stud / split-cavity walls;
5. negative boundaries: exact catalog rows, resilient side-count rows,
   timber exact/formula surfaces, single-leaf mass-law, lined-massive,
   heavy-core, CLT, direct-coupled, and triple-leaf/multi-cavity shapes.

Required source fields for each candidate:

- source label and URL or local path;
- assembly layers with thickness, density, surface mass, and mounting;
- reported `Rw` or spectrum and lab/field context;
- cavity depth, fill type, stud type, stud spacing, and coupling;
- declared tolerance or benchmark-fit threshold;
- import decision: `accept`, `bounded`, or `reject`.

Gate A result:

| Candidate | Decision | Why |
|---|---|---|
| Empty AAC / air-gap / gypsum double-leaf | `reject` | no direct stack row, no benchmark tolerance, no field/lab transfer rule |
| No-stud porous gypsum / wool / air-gap / gypsum double-leaf | `reject` | framed mineral-wool sources are adjacent only because the live case lacks stud/coupling metadata |
| Knauf W111 single-stud framed wall context | `bounded` | local benchmark corpus names W111 Rw / DnT,A,k rows and tolerances, but Gate B must reconcile metric choice and route-card impact before any value movement |
| Knauf W115 double-stud / split-cavity context | `bounded` | local benchmark corpus names W115 Rw / DnT,A,k rows and tolerances for the matching family, but Gate B must prove whether current lab/field values already satisfy the row |
| Knauf Quietstud and Davy / stud-type references | `bounded` context only | useful formula/fill/stud-type corridor evidence, not direct generic runtime imports |
| Exact catalog, resilient side-count, timber, single-leaf, lined-massive, heavy-core, CLT, direct-coupled, triple-leaf | `reject` boundary | protected from this import lane |

## Gate B - Bounded Framed-Wall Reconciliation

Gate B landed no-runtime in
`packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-b-contract.test.ts`.
It compares the bounded Knauf framed-wall evidence from Gate A against
the current dynamic implementation.

Gate B result:

| Row group | Current fit | Decision |
|---|---|---|
| W111 single-stud lab/field holdouts | max error 0.3 dB against 3 dB tolerance | keep current runtime |
| W112 single-stud lab holdouts | exact current match to source expected values | keep current runtime |
| W112 field rows | exact `DnT,A,k` proxy anchors already active | keep exact source lane |
| W115 / W119 double-stud split-cavity lab/field rows | exact current match; detected family remains `double_stud_system` | keep current runtime |

Gate B explicitly does not authorize empty/no-stud double-leaf retuning.
Those rows remain frozen until a direct source row or named formula
tolerance owner appears. Because no visible values/support/confidence/
evidence text changed, no paired web route-card test was required for
this gate.

## Gate C - Closeout And Next Slice Selection

Gate C closed no-runtime in
`packages/engine/src/post-wall-double-leaf-source-evidence-acquisition-v1-next-slice-selection-contract.test.ts`.
It selects `wall_source_catalog_acquisition_v1` because the recent wall
accuracy slices repeatedly reached the same blocker: current formulas
are finite and guarded, but runtime/confidence movement needs direct
source rows, benchmark family rules, or named formula tolerance owners.

Selected planning surface:
[SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md](./SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md).

No acoustic runtime values, formulas, support, confidence, evidence
text, API behavior, or route-card copy changed during Gate C.

## Acceptance Rules

A future runtime/import Gate B may only proceed when Gate A finds one of:

- a direct stack row with enough layer and mounting metadata;
- a family benchmark with a declared fit tolerance and matching topology;
- a formula/tolerance reference that names the input parameters and error
  corridor;
- a bounded negative rule that improves honesty without pretending to be
  source-backed.

If evidence is broad, topology-incomplete, or only adjacent to the live
stack, Gate A should classify it as `reject` or `bounded_context_only`
and select a no-runtime closeout.

## Expected Tests

- `packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-a-contract.test.ts`
  now pins the source/tolerance candidate matrix.
- `packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-b-contract.test.ts`
  pins the no-runtime reconciliation over 16 bounded W111 / W112 /
  W115 / W119 rows.
- Gate C closeout is pinned by
  `packages/engine/src/post-wall-double-leaf-source-evidence-acquisition-v1-next-slice-selection-contract.test.ts`.
- Future gates must add value tests and paired web route-card tests
  before changing visible values, support, confidence, evidence text, or
  missing-input copy.
- `wall_source_catalog_acquisition_v1` Gate A has added a no-runtime
  target/source-readiness inventory; continue that slice at Gate B
  source-pack readiness before any import or retune.

## Immediate Execution Order

This slice is closed. Continue in
[SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md](./SLICE_WALL_SOURCE_CATALOG_ACQUISITION_PLAN.md).
