# Post-Gate BH Plan And Test Review - 2026-05-13

This checkpoint sits after commit `040cc6f` (`feat: land gate bh floor
impact matrix refresh`). It is a planning and verification checkpoint,
not a runtime promotion.

## Read Scope

Files and implementation surfaces reviewed:

- `AGENTS.md`
- `docs/README.md`
- `docs/calculator/README.md`
- `docs/calculator/CURRENT_STATE.md`
- `docs/calculator/NEXT_IMPLEMENTATION_PLAN.md`
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bh.ts`
- `packages/engine/src/calculator-personal-use-mvp-coverage-sprint.ts`
- `packages/engine/src/calculate-impact-only.ts`
- `packages/shared/src/domain/impact-field-context.ts`
- `packages/shared/src/api/estimate.ts`
- `packages/shared/src/api/impact-only.ts`

## Implementation Match

The current docs and implementation agree on the active direction:
Gate BH landed the no-runtime floor-impact source-absent coverage matrix
refresh and selected Gate BI:

`gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan`

Selected Gate BI file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bi-floor-impact-field-building-adapter-contract.test.ts`

The Gate BH executable matrix currently has 21 floor-impact rows. Its
summary still reports no runtime value movement, route coverage
`floor`, basis coverage `element_lab`, `field_apparent`,
`astm_rating_boundary`, and `building_prediction`, and selected lane
`floor_impact_field_building_adapter_contract`.

Pinned runtime values remain unchanged:

- heavy combined source-absent lab floor: `Ln,w 44.4` / `DeltaLw 30.1`
  with `+/-6.5 dB` / `+/-5.5 dB` not-measured budgets;
- steel formula corridor: `Ln,w 55.6` / `DeltaLw 22.4`;
- timber joist: exact `Ln,w 51` plus formula `DeltaLw 25.2`;
- CLT/mass-timber: `Ln,w 50` / `DeltaLw 22.6`;
- existing field continuation row: `L'n,w 53` / `L'nT,w 50.6`;
- local CLT low-frequency guide row: `L'nT,50 49`.

The floor-impact `building_prediction` row is intentionally still
unsupported for `L'nT,w` and `L'nT,50`; the current runtime does not own
the building-impact adapter inputs yet.

## Gaps

Gate BI is still the correct next step because the largest remaining
basis-risk gap is not a lab runtime retune or broad source crawl. It is
the field/building impact owner boundary.

The concrete gaps to close next:

- no Gate BI executable contract file exists yet;
- floor-impact field and building contexts are not represented by a
  first-class owner contract;
- current `ImpactFieldContext` carries useful `K`, volume, and flanking
  knobs, but does not yet own the full field/building adapter contract;
- building prediction needs explicit separating element area, receiving
  room volume, RT60 or absorption basis, junction/flanking context,
  coupling or Kij owner, normalization basis, low-frequency ownership,
  and uncertainty budget ownership before any numeric runtime can
  promote;
- `L'nT,50` should remain folded into the field/building owner contract,
  not promoted as an isolated low-frequency shortcut;
- ASTM/IIC/AIIC remains a later adapter lane after ISO field/building
  owner separation.

No internet research was needed for this checkpoint because the selected
Gate BI move is a no-runtime ownership/input contract. External formula
research becomes relevant only if a later gate promotes a numeric
field/building runtime corridor.

## Gate BI Execution Order

1. Add
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bi-floor-impact-field-building-adapter-contract.test.ts`.
2. Consume the Gate BH summary and assert that
   `floor_impact_field_building_adapter_contract` remains the selected
   lane.
3. Define field-apparent and building-prediction owner groups separately.
4. Assert current field rows remain unchanged:
   `L'n,w 53`, `L'nT,w 50.6`, and local `L'nT,50 49`.
5. Assert building `L'nT,w` / `L'nT,50` requests remain unsupported until
   the owner groups are complete.
6. Assert lab `Ln,w` / `DeltaLw` values and budgets do not move, exact
   source precedence remains first, and no ASTM/IIC adapter is added.
7. Select the next narrow lane only after Gate BI can say whether the
   adapter is still no-runtime or ready for an input-surface/formula
   corridor gate.

## Validation

Checkpoint validation passed in this working turn:

- focused Gate BH contract:
  `pnpm --filter @dynecho/engine exec vitest run src/calculator-personal-use-mvp-coverage-sprint-gate-bh-floor-impact-source-absent-coverage-matrix-refresh-contract.test.ts --maxWorkers=1`
  passed 1 file / 6 tests;
- `pnpm calculator:gate:current` passed with engine 401 files / 2320
  tests, web 77 files / 328 passed + 18 skipped, and repo build 5/5;
- `git diff --check` passed.

The preceding full `pnpm check` is still recorded in the Gate BH
handoff. Because this checkpoint is docs-only and the current-gate suite
remained green, full `pnpm check` was not rerun here.
