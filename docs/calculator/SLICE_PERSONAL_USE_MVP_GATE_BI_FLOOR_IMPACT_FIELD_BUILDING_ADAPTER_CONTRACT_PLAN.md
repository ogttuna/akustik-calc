# Personal-Use MVP Gate BI Floor-Impact Field/Building Adapter Contract Plan

Date: 2026-05-14

Document role: clean implementation plan and closeout note for the Gate
BI slice after Gate BH. This file is intentionally
narrower than `NEXT_IMPLEMENTATION_PLAN.md`: it exists so the next work
does not confuse the old steel-floor Gate BI with the current
Personal-Use MVP Gate BI.

2026-05-14 company-internal calculation-grade review:
Gate BI remains the selected next contract, but it should close as a
small owner/input gate and then select a runtime-producing lane that
removes live low-confidence/screening floor-impact behavior. See
`CHECKPOINT_2026-05-14_COMPANY_INTERNAL_CALCULATION_GRADE_REVIEW.md`.

## Current Status

Gate BH is landed and validated:

`gate_bh_personal_use_mvp_floor_impact_source_absent_coverage_matrix_refresh_landed_no_runtime_selected_field_building_adapter_gate_bi`

Selected Gate BI action:

`gate_bi_personal_use_mvp_floor_impact_field_building_adapter_contract_plan`

Selected Gate BI file:

`packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bi-floor-impact-field-building-adapter-contract.test.ts`

Implementation status on 2026-05-14:

- the selected Gate BI executable contract file has landed;
- Gate BH matrix and lane ranking already select
  `floor_impact_field_building_adapter_contract`;
- current field rows are already pinned by Gate BH:
  `L'n,w 53`, `L'nT,w 50.6`, and local `L'nT,50 49`;
- building impact prediction for `L'nT,w` / `L'nT,50` is still blocked
  until direct curve, flanking, junction/Kij, normalization,
  low-frequency, and uncertainty-budget owners exist;
- lab `Ln,w` / `DeltaLw` source-absent budgets are not field or
  building evidence;
- `IIC` / `AIIC` remain ASTM adapter boundaries.

## What Gate BI Must Do

Gate BI is a no-runtime owner/input contract. It should not promote a new
numeric field/building runtime, should not retune lab floor formulas, and
should not add source rows.

Gate BI must define floor-impact field and building adapter ownership
separately:

1. Field-apparent owners for `L'n,w`, `L'nT,w`, and the low-frequency
   `L'nT,50` boundary.
2. Building-prediction owners for `L'nT,w` and `L'nT,50`.
3. Missing-input behavior for partial physical context.
4. Unsupported behavior for complete physical context when formula
   owners are still absent.
5. Negative boundaries for lab-to-field/building leakage and ASTM/IIC
   aliases.

## Required Owner Groups

Field-apparent owner group:

- lab impact anchor: owned `Ln,w` or `DeltaLw` basis for the separating
  floor;
- separating element area;
- receiving-room volume;
- receiving-room RT60 or explicit absorption/standardization basis;
- apparent-field correction owner, either owned `K`/guide offset or
  direct flanking-path policy;
- junction/flanking context;
- low-frequency spectrum or `CI50-2500` owner when `L'nT,50` is
  requested;
- field uncertainty budget owner.

Building-prediction owner group:

- direct separating-floor impact frequency curve or owned one-number
  direct curve corridor;
- separating element area;
- receiving-room volume;
- receiving-room RT60 or absorption/normalization basis;
- junction/flanking context;
- coupling length or `Kij` / vibration-reduction owner;
- flanking path transmission/energy owner;
- low-frequency owner when `L'nT,50` is requested;
- building-prediction uncertainty budget owner.

## Implementation Steps

1. Add
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bi-floor-impact-field-building-adapter-contract.test.ts`.
   Status: done.
2. Add a small Gate BI contract module, likely
   `packages/engine/src/calculator-personal-use-mvp-coverage-sprint-gate-bi.ts`,
   if the test needs reusable constants, owner groups, or a scenario
   pack.
   Status: done.
3. Consume `buildPersonalUseMvpCoverageSprintGateBHFloorImpactCoverageMatrix`,
   `summarizePersonalUseMvpCoverageSprintGateBH`, and
   `rankPersonalUseMvpCoverageSprintGateBILanes` so Gate BI proves it is
   implementing the lane selected by Gate BH.
4. Define explicit field-apparent and building-prediction owner groups.
   Do not hide building owners inside the existing `ImpactFieldContext`
   shape unless the shared schema is deliberately widened by a later
   input-surface gate.
5. Add scenario rows or assessments for:
   - current complete field context preserved;
   - current missing field context still `needs_input`;
   - building prediction complete physical context still unsupported
     while formula owners are absent;
   - missing separating area;
   - missing receiving-room volume;
   - missing RT60 or absorption/normalization basis;
   - missing junction/flanking/coupling owner;
   - missing low-frequency owner for `L'nT,50`;
   - lab `Ln,w` / `DeltaLw` budget not reused as field/building budget;
   - `IIC` / `AIIC` still unsupported.
6. Pin unchanged runtime values and boundaries:
   - heavy combined lab `Ln,w 44.4` / `DeltaLw 30.1`;
   - steel formula `Ln,w 55.6` / `DeltaLw 22.4`;
   - timber `Ln,w 51` / `DeltaLw 25.2`;
   - CLT `Ln,w 50` / `DeltaLw 22.6`;
   - field `L'n,w 53` / `L'nT,w 50.6`;
   - local low-frequency guide `L'nT,50 49`;
   - exact source precedence first;
   - no ASTM/IIC adapter.
7. Select the next narrow lane only after Gate BI is executable. The
   preferred next lane is runtime-producing:
   `gate_bj_personal_use_mvp_floor_impact_field_building_runtime_corridor_plan`.
   Select a smaller no-runtime owner gate only if Gate BI proves that a
   required field/building owner is still missing.
   Status: Gate BJ selected.
8. After implementation, update `CURRENT_STATE.md`,
   `NEXT_IMPLEMENTATION_PLAN.md`, the Gate BI checkpoint, and
   `tools/dev/run-calculator-current-gate.ts`.

## Validation Plan

Minimum validation for Gate BI implementation:

- targeted Gate BI Vitest file;
- Gate BH + Gate BI continuity run;
- engine typecheck;
- `pnpm calculator:gate:current`;
- `git diff --check`.

Run full `pnpm check` if Gate BI widens shared schemas, public API
payloads, workbench input surfaces, route cards, report payloads, or any
runtime calculator behavior.

Known non-fatal warnings to keep separate from Gate BI behavior:

- optional `sharp/@img` warnings from `@turbodocx/html-to-docx` during
  Next build;
- unavailable test-storage warnings from Zustand persist middleware in
  web tests.

## Explicit Non-Goals

- No broad source crawl.
- No lab formula retune.
- No tolerance tightening.
- No exact-source promotion.
- No aliasing `Ln,w` / `DeltaLw` to `L'n,w`, `L'nT,w`, or `L'nT,50`.
- No `IIC` / `AIIC` adapter.
- No building-prediction numeric runtime until its direct, flanking,
  junction, normalization, low-frequency, and budget owners exist.
