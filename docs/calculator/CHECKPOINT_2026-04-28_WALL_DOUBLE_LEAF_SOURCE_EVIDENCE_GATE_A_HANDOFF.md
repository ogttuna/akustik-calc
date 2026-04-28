# Checkpoint - Wall Double-Leaf Source Evidence Gate A Handoff

Date: 2026-04-28

Status: Gate A landed no-runtime. No acoustic runtime values, formulas,
confidence scores, evidence tiers, output support, source precedence, or
web route-card behavior changed.

Active implementation slice:
`wall_double_leaf_source_evidence_acquisition_v1`.

## What Landed

- `packages/engine/src/wall-double-leaf-source-evidence-acquisition-gate-a-contract.test.ts`
  adds the executable source/tolerance inventory.
- `tools/dev/run-calculator-current-gate.ts` now includes the Gate A
  contract in the focused calculator gate.
- `SLICE_WALL_DOUBLE_LEAF_SOURCE_EVIDENCE_ACQUISITION_PLAN.md`,
  `NEXT_IMPLEMENTATION_PLAN.md`, `CURRENT_STATE.md`,
  `SOURCE_GAP_LEDGER.md`, `MASTER_PLAN.md`,
  `PERSONAL_USE_READINESS_ROADMAP.md`, `README.md`, and `AGENTS.md`
  now point a fresh agent to Gate B reconciliation.

## Source Classification

Gate A classifies candidates conservatively:

| Candidate | Decision | Runtime movement now |
|---|---|---:|
| Empty AAC / air-gap / gypsum double-leaf | `reject` | no |
| No-stud porous gypsum / wool / air-gap / gypsum double-leaf | `reject` | no |
| Knauf W111 single-stud framed wall row | `bounded` | no |
| Knauf W115 double-stud / split-cavity framed wall row | `bounded` | no |
| Knauf Quietstud primary rows | `bounded` context only | no |
| Davy double-leaf formula reference | `bounded` context only | no |
| Lightweight double-leaf stud-type study | `bounded` context only | no |
| Exact catalog, resilient side-count, timber, single-leaf, lined-massive, heavy-core, CLT, direct-coupled, triple-leaf boundaries | `reject` boundary | no |

The useful change is not a retune. The useful change is that Gate B now
has named bounded evidence to reconcile:

- `packages/engine/src/airborne-framed-wall-benchmark.test.ts`
  contains the local Knauf W111 / W112 / W115 / W119 benchmark rows and
  tolerances.
- `packages/engine/src/airborne-verified-catalog.ts` contains the
  Knauf W111 / W112 DnT,A,k proxy field rows.

## Next Gate

Start Gate B by adding a no-runtime reconciliation contract.

Required Gate B questions:

1. Do the current single-stud lab and field values already fit the
   bounded Knauf W111 / W112 rows within the named local tolerances?
2. Do the current double-stud / split-cavity lab and field values
   already fit the bounded Knauf W115 / W119 rows within the named local
   tolerances?
3. If values do not fit, is there a source-row and metric-owner basis
   strong enough to move runtime values?
4. If a visible value, support, confidence, evidence label, or
   missing-input copy would move, add paired web route-card tests before
   changing it.

Default expectation: close no-runtime if the bounded rows already fit
current behavior or cannot map cleanly to generic material IDs without
over-claiming exact source truth.

## Validation

- `pnpm --filter @dynecho/engine exec vitest run src/wall-double-leaf-source-evidence-acquisition-gate-a-contract.test.ts --maxWorkers=1`
  green: 1 file / 6 tests.
- `pnpm calculator:gate:current` green after the Gate A runner update:
  - engine 108 files / 496 tests
  - web 43 files / 211 passed + 18 skipped
  - build 5/5 with the known non-fatal `sharp/@img` warnings
  - whitespace guard clean

Broad `pnpm check` was not rerun for this no-runtime test/docs slice;
the last broad validation remains the 2026-04-28 green run from the
wall double-leaf Gate B-ready revalidation checkpoint.

## Boundaries

- Keep `/home/ogttuna/Dev/Machinity/Acoustic2` read-only.
- Do not retune empty/no-stud double-leaf rows from adjacent framed-wall
  sources.
- Do not collapse Quietstud, wood/steel/acoustic stud studies, or Davy
  formula context into a generic exact source row.
- Do not borrow floor CLT, floor impact, single-leaf, lined-massive,
  heavy-core, timber, direct-coupled, or triple-leaf rows as double-leaf
  truth.
- Do not reopen `GDMTXA04A`, `C11c`, raw bare open-box/open-web,
  wall-selector behavior, heavy-core/concrete, timber-stud, CLT wall,
  floor fallback, or wall exact-row follow-ups from nearby green tests
  alone.
