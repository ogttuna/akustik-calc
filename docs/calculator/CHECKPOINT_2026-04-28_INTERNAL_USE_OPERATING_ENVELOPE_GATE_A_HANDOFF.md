# Checkpoint - Internal Use Operating Envelope Gate A

Date: 2026-04-28

Slice: `internal_use_operating_envelope_v1`

Gate landed:
`gate_a_short_internal_pilot_usage_note_and_scenario_summary`

## Summary

Gate A landed the short company-internal pilot pack with no runtime
movement.

New artifacts:

- [INTERNAL_USE_PILOT_USAGE_NOTE.md](./INTERNAL_USE_PILOT_USAGE_NOTE.md)
  defines the pilot operating envelope.
- `packages/engine/src/internal-use-operating-envelope-v1-gate-a-contract.test.ts`
  protects the scenario matrix, current representative values, proof
  owners, and no-promotion boundaries.

The note separates current calculator use into:

- `pilot_ready_with_standard_caveat`: exact / benchmark / source-backed
  corridors such as LSF exact wall, AAC/masonry single-leaf walls, and
  exact/bound floor corridors.
- `pilot_allowed_with_visible_caveat`: timber double-board, CLT wall,
  lined/heavy-core wall, generated steel floor fallback, and many-layer
  / reorder guardrails where low-confidence, screening, source-gated, or
  stability-only caveats must remain visible.
- `not_defended_fail_closed_or_source_gated`: invalid/missing inputs,
  unsupported outputs, no-stud double-leaf source-gated work, and
  historical blocked floor families such as `GDMTXA04A`, `C11c`, and raw
  open-box/open-web.

## Runtime Posture

Unchanged:

- numeric runtime behavior;
- support classification;
- confidence classification;
- evidence text;
- API shape;
- workbench/report route-card copy.

The pilot pack explicitly does not promote any low-confidence,
screening, fallback, or source-gated lane for company-pilot convenience.

## Scenario Values Pinned

- `wall_lsf_exact_preset`: `Rw=55`, field/building `R'w=48`,
  building `DnT,w=49`.
- `wall_aac_single_leaf_benchmark`: `Rw=47`, field/building `R'w=45`,
  building `DnT,w=46`.
- `wall_masonry_single_leaf_benchmark`: `Rw=43`, field/building
  `R'w=41`, building `DnT,w=43`.
- `wall_timber_double_board_generated`: generated `wall-timber-stud`
  stays `Rw=50`, `R'w=42`, field `DnT,w=43`, building `DnT,w=44`,
  low-confidence/source-gated.
- `wall_clt_local_generated`: generated `wall-clt-local` stays
  `Rw=42`, `R'w=41`, field `DnT,w=42`, formula-owned/source-gated.
- `wall_lined_heavy_core_screening`: generated
  `wall-screening-concrete` stays `Rw=57`, `R'w=55`, `DnT,w=56`,
  `DnT,A=54.9`, screening.
- `floor_steel_fallback_generated`: generated fallback stays `Rw=61`,
  `R'w=70`, `Ln,w=58.3`, `L'n,w=61.3`, `L'nT,w=58.5`; `L'nT,50`
  remains unsupported.

## Selected Next Action

Gate B:
`internal_use_operating_envelope_v1_gate_b_regular_internal_use_visibility_audit`

Next implementation file:

`packages/engine/src/internal-use-operating-envelope-v1-gate-b-contract.test.ts`

Gate B should audit workbench route cards, proposal/report notes, and
docs against the Gate A scenario ids. It should only select a fix if a
low-confidence, screening, unsupported, or source-gated scenario looks
more certain than the engine evidence tier. Otherwise it should proceed
to Gate C closeout / next-slice selection.

## Validation

Targeted Gate A validation:

- `pnpm --filter @dynecho/engine exec vitest run src/internal-use-operating-envelope-v1-gate-a-contract.test.ts --maxWorkers=1`
- result: 1 file / 6 tests green.

Focused current-gate validation:

- `pnpm calculator:gate:current`
- result: engine 130 files / 613 tests, web 44 files / 212 passed + 18
  skipped, build 5/5 with known non-fatal `sharp/@img` warnings,
  whitespace guard clean.

Additional cleanup:

- Next.js build rewrote `apps/web/next-env.d.ts` to point at
  `./.next/types/routes.d.ts`; it was restored to the repo's
  `./.next-typecheck/types/routes.d.ts` reference after validation.
