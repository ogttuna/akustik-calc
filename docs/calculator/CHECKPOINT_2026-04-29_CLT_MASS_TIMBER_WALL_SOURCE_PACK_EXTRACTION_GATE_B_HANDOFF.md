# Checkpoint - CLT / Mass-Timber Wall Source Pack Extraction Gate B Handoff

Date: 2026-04-29

## Summary

`clt_mass_timber_wall_source_pack_extraction_v1` Gate B landed as a
no-runtime metric-mapping and formula-tolerance decision contract. It
keeps the Gate A WoodWorks/NRC source groups useful as roadmap context,
but rejects immediate bounded metric mapping, formula tolerance, runtime
import, support promotion, confidence promotion, evidence promotion, and
visible card/report movement.

No acoustic formulas, runtime values, support classes, confidence
classes, evidence tiers, API shape, route-card values, output-card
statuses, proposal/report copy, or workbench input behavior changed.

## Implementation

Executable Gate B contract:

`packages/engine/src/clt-mass-timber-wall-source-pack-extraction-gate-b-contract.test.ts`

Focused gate runner update:

`tools/dev/run-calculator-current-gate.ts`

Planning surfaces:

- `docs/calculator/SLICE_CLT_MASS_TIMBER_WALL_SOURCE_PACK_EXTRACTION_PLAN.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/SOURCE_GAP_LEDGER.md`
- `docs/calculator/MASTER_PLAN.md`
- `AGENTS.md`

## Gate B Decision

Gate B rejects immediate promotion for all Gate A source groups:

- WoodWorks Table 7 Single CLT Wall:
  reject immediate metric mapping. First missing requirement: exact row
  locator and underlying metric method are not selected.
- WoodWorks Table 8 Single NLT Wall:
  reject immediate formula tolerance. First missing requirement: no live
  NLT wall family or formula-tolerance owner exists.
- WoodWorks Table 9 Double CLT Wall:
  reject immediate metric mapping. First missing requirement: double-CLT
  family boundary and metric mapping are not selected.
- WoodWorks Mass Timber Fire & Acoustic Database:
  reject database pointer. First missing requirement: underlying report,
  table, row, and metric context are not named.
- NRC RR-335 mass-timber report:
  reject immediate formula tolerance. First missing requirement: mixed
  wall/floor/flanking/ASTC context has no DynEcho route tolerance owner.
- NRC NLT addendum:
  reject immediate formula tolerance. First missing requirement: NLT
  wall family, frequency mapping, and tolerance owner are not selected.
- Local Dataholz CLT exact rows:
  reject wall import because they remain floor-only source truth.

The direct metric decision is also closed for now:

- `STC`, `FSTC`, and `ASTC` remain metric-policy research context only.
- `IIC` is impact context and is rejected for wall airborne outputs.
- one-third-octave transmission-loss context may only become row
  recompute input after exact wall rows and ISO 717 handling are named.
- local Dataholz `Rw` floor rows remain floor-only truth.

## Decision

The selected next action remains inside the same slice:

`gate_c_closeout_and_next_slice_selection_no_runtime`

Next target:

`packages/engine/src/post-clt-mass-timber-wall-source-pack-extraction-v1-next-slice-selection-contract.test.ts`

Gate C should close the CLT / mass-timber extraction slice no-runtime
unless a source-ready accuracy pack is actually available. It should not
promote CLT wall, NLT wall, double-CLT wall, WoodWorks database rows,
NRC ASTC/flanking context, or Dataholz CLT floor rows from the Gate B
decision alone.

## Validation

- targeted Gate B engine contract green: 1 file / 7 tests;
- focused `pnpm calculator:gate:current` green after runner/docs sync:
  engine 135 files / 644 tests, web 45 files / 216 passed + 18
  skipped, build 5/5 with the known non-fatal `sharp/@img` warnings,
  whitespace guard clean;
- broad `pnpm check` green: lint/typecheck green, engine 268 files /
  1464 tests, web 157 files / 890 passed + 18 skipped, build 5/5 with
  the known non-fatal `sharp/@img` warnings.
